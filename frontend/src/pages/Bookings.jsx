import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react'

// Mock Assets available for booking
const BOOKABLE_ASSETS = [
  { id: 'AST-101', name: 'Tesla Model Y Long Range (Electric)', type: 'Vehicle', healthScore: 96, location: 'Bangalore Tech Park' },
  { id: 'AST-102', name: 'Conference Room Alpha (Main)', type: 'Room', healthScore: 98, location: 'Mumbai HQ - 4th Floor' },
  { id: 'AST-103', name: '4K Development Projector RX', type: 'Equipment', healthScore: 84, location: 'Pune Office' },
  { id: 'AST-104', name: 'Hardware Testing Lab Suite', type: 'Room', healthScore: 92, location: 'Noida Data Center' },
  { id: 'AST-105', name: 'Vantage Logistics Carrier Van', type: 'Vehicle', healthScore: 78, location: 'Delhi Branch' }
];

// Preloaded Booking History
const INITIAL_HISTORICAL_BOOKINGS = [
  { id: 'BKG-501', employee: 'Piyush Kandhari', assetId: 'AST-101', assetName: 'Tesla Model Y Long Range (Electric)', date: '2026-07-14', time: '09:00 - 11:00', status: 'Upcoming' },
  { id: 'BKG-502', employee: 'Vikram Seth', assetId: 'AST-102', assetName: 'Conference Room Alpha (Main)', date: '2026-07-13', time: '13:00 - 15:00', status: 'Completed' },
  { id: 'BKG-503', employee: 'Rohit Sharma', assetId: 'AST-103', name: '4K Development Projector RX', assetName: '4K Development Projector RX', date: '2026-07-10', time: '10:00 - 12:00', status: 'Cancelled' },
  { id: 'BKG-504', employee: 'Ananya Sen', assetId: 'AST-104', assetName: 'Hardware Testing Lab Suite', date: '2026-07-15', time: '11:00 - 14:00', status: 'Upcoming' },
  { id: 'BKG-505', employee: 'Sunil Gavaskar', assetId: 'AST-101', assetName: 'Tesla Model Y Long Range (Electric)', date: '2026-07-12', time: '14:00 - 17:00', status: 'Completed' }
];

// Timeline static hourly slots showing state representations
const TIMELINE_SLOTS = [
  { id: 'slot-9', label: '09:00 AM', status: 'Upcoming', description: 'Assigned (Tesla model Y)' },
  { id: 'slot-10', label: '10:00 AM', status: 'Available', description: 'Available for reservation' },
  { id: 'slot-11', label: '11:00 AM', status: 'Booked', description: 'Reserved by R&D' },
  { id: 'slot-12', label: '12:00 PM', status: 'Available', description: 'Available for reservation' },
  { id: 'slot-13', label: '01:00 PM', status: 'Booked', description: 'Reserved by Product Team' },
  { id: 'slot-14', label: '02:00 PM', status: 'Cancelled', description: 'Cancelled maintenance run' },
  { id: 'slot-15', label: '03:00 PM', status: 'Available', description: 'Available for reservation' },
  { id: 'slot-16', label: '04:00 PM', status: 'Available', description: 'Available for reservation' },
  { id: 'slot-17', label: '05:00 PM', status: 'Upcoming', description: 'Scheduled delivery run' }
];

export default function Bookings() {
  const [history, setHistory] = useState(INITIAL_HISTORICAL_BOOKINGS);

  // Form hooks
  const [employee, setEmployee] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [selectedAssetId, setSelectedAssetId] = useState('AST-101');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [purpose, setPurpose] = useState('');

  // Selected hour slots on the timeline calendar
  const [selectedSlotId, setSelectedSlotId] = useState('slot-10');

  // Conflict alerts and availability check feedback states
  const [availabilityMessage, setAvailabilityMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // AI Recommendation Choice parameters (strictly mapped to sapphire color setup)
  const aiChoice = {
    name: 'Tesla Model Y Long Range (Electric)',
    healthScore: 96,
    reason: 'Highest reliability index on site, fully charged (98%), and has no maintenance scheduled for the next 14 days.',
    confidence: '94%'
  };

  // Run mock scheduling conflict check
  const handleCheckAvailability = () => {
    if (!employee || !purpose) {
      setAvailabilityMessage({
        type: 'error',
        text: 'Please specify the Employee and Purpose details first to check route clearance.'
      });
      return;
    }

    // Checking if start/end times conflict with existing upcoming/completed bookings for the same asset
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    if (startHour >= endHour) {
      setAvailabilityMessage({
        type: 'error',
        text: 'Invalid range: Start time must occur strictly before the End time.'
      });
      return;
    }

    // Mock check based on selected asset and date
    const assetObj = BOOKABLE_ASSETS.find(a => a.id === selectedAssetId);
    
    // Simulate overlap conflict if they choose "Tesla Model Y" on "2026-07-14" between 09:00 and 11:00
    if (selectedAssetId === 'AST-101' && bookingDate === '2026-07-14' && (
      (startHour >= 9 && startHour < 11) || (endHour > 9 && endHour <= 11)
    )) {
      setAvailabilityMessage({
        type: 'error',
        text: `Conflict Warning! ${assetObj.name} is already reserved by Piyush Kandhari on this date from 09:00 - 11:00.`
      });
    } else {
      setAvailabilityMessage({
        type: 'success',
        text: `${assetObj.name} is available! No scheduling blockages found.`
      });
    }
  };

  // Submit resource reservation block
  const handleBookResource = (e) => {
    e.preventDefault();
    if (!employee || !purpose || !bookingDate || !startTime || !endTime) {
      alert('Please fill out all mandatory booking fields!');
      return;
    }

    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    if (startHour >= endHour) {
      alert('Start hour must be before end hour!');
      return;
    }

    const assetObj = BOOKABLE_ASSETS.find(a => a.id === selectedAssetId);

    // Conflict block
    if (selectedAssetId === 'AST-101' && bookingDate === '2026-07-14' && (
      (startHour >= 9 && startHour < 11) || (endHour > 9 && endHour <= 11)
    )) {
      alert(`Access Refused: Conflict exists on ${assetObj.name}. Check timeline configuration.`);
      return;
    }

    const newBooking = {
      id: `BKG-${Date.now().toString().slice(-3)}`,
      employee,
      assetId: selectedAssetId,
      assetName: assetObj.name,
      date: bookingDate,
      time: `${startTime} - ${endTime}`,
      status: 'Upcoming'
    };

    setHistory(prev => [newBooking, ...prev]);
    setAvailabilityMessage({
      type: 'success',
      text: `Resource Successfully Reserved! Ticket sequence ${newBooking.id} created.`
    });

    // Reset fields
    setEmployee('');
    setPurpose('');
  };

  // Reset form inputs
  const handleCancelForm = () => {
    setEmployee('');
    setDepartment('Engineering');
    setSelectedAssetId('AST-101');
    setBookingDate(new Date().toISOString().split('T')[0]);
    setStartTime('09:00');
    setEndTime('11:00');
    setPurpose('');
    setAvailabilityMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased text-left">
      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-[#334155] pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Resource Booking</h1>
        <p className="text-[#CBD5E1] text-sm font-medium">
          Reserve shared resources without scheduling conflicts.
        </p>
      </div>

      {/* TOP AI RECOMMENDATION BANNER */}
      <div className="relative bg-[#0F52BA] border border-[#2962FF] rounded-xl p-6 shadow-[0_0_20px_rgba(41,98,255,0.4)] mb-8 overflow-hidden transition-all duration-300">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2962FF]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="bg-[#007FFF] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                AI Suggested Choice
              </span>
              <div className="flex items-center gap-1 text-[#CBD5E1] text-xs">
                <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Smart Auto-Select</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1.5">{aiChoice.name}</h3>
            <p className="text-[#CBD5E1] text-xs leading-relaxed max-w-2xl">
              <strong className="text-white">Recommendation Reason:</strong> {aiChoice.reason}
            </p>
          </div>

          <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-4 shrink-0">
            {/* Reliability Rating Box */}
            <div className="bg-[#0e2d7e]/40 border border-[#2962FF]/50 p-4 rounded-xl text-center flex flex-col justify-center min-w-[100px]">
              <span className="text-[10px] text-[#CBD5E1] font-semibold uppercase tracking-wider block">Health Score</span>
              <span className="text-2xl font-black text-white font-mono leading-none mt-1">{aiChoice.healthScore}%</span>
            </div>

            {/* Confidence Box */}
            <div className="bg-[#0e2d7e]/40 border border-[#2962FF]/50 p-4 rounded-xl text-center flex flex-col justify-center min-w-[100px]">
              <span className="text-[10px] text-[#CBD5E1] font-semibold uppercase tracking-wider block">Confidence</span>
              <span className="text-2xl font-black text-[#007FFF] font-mono leading-none mt-1">{aiChoice.confidence}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
        
        {/* LEFT COLUMN: BOOKING FORM */}
        <div className="lg:col-span-1 bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-[#334155] pb-3 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]"></span>
            <span>Reserve Slot Request</span>
          </h3>

          {/* Form Actions Feedbacks */}
          {availabilityMessage && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              availabilityMessage.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{availabilityMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleBookResource} className="space-y-4 text-xs font-semibold">
            
            {/* Employee Name */}
            <div>
              <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Employee Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priyush Kandhari"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product Development">Product Management</option>
                <option value="Logistics Operations">Logistics</option>
                <option value="R&D">Research & Dev</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            {/* Asset Allocation */}
            <div>
              <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Select Asset *</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white cursor-pointer"
              >
                {BOOKABLE_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Date */}
            <div>
              <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Booking Date *</label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
              />
            </div>

            {/* Time slot selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Start Time *</label>
                <input
                  type="time"
                  required
                  step="3600"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">End Time *</label>
                <input
                  type="time"
                  required
                  step="3600"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            {/* Booking Purpose */}
            <div>
              <label className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Booking Purpose *</label>
              <input
                type="text"
                required
                placeholder="e.g. On-site customer verification"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF]"
              />
            </div>

            {/* Form actions triggers */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#334155]/60">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-2.5 py-2.5 border border-[#334155] rounded-lg text-[11px] font-bold text-center text-[#94A3B8] hover:bg-[#0f172a] hover:text-white transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleCheckAvailability}
                className="px-2.5 py-2.5 border border-[#2962FF] text-[#2962FF] hover:bg-[#2962FF]/10 rounded-lg text-[11px] font-bold text-center transition duration-200 cursor-pointer"
              >
                Check State
              </button>

              <button
                type="submit"
                className="px-2.5 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] text-white rounded-lg text-[11px] font-bold text-center transition duration-200 shadow-md cursor-pointer"
              >
                Book
              </button>
            </div>

          </form>

        </div>

        {/* RIGHT COLUMN: BOOKING CALENDAR SLOT TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* VISUAL BOOKING TIMELINE GRID */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#2962FF]" />
                  <span>Booking Timeline</span>
                </h3>
                <span className="text-[11px] text-[#94A3B8]">Selected slot details displayed on interaction link.</span>
              </div>

              {/* Day Badge */}
              <span className="text-xs bg-[#2D68C4]/20 text-[#CBD5E1] border border-[#2D68C4]/40 px-3 py-1 rounded-full font-bold">
                Today (July 12, 2026)
              </span>
            </div>

            {/* State indicators key */}
            <div className="flex flex-wrap gap-4 mb-6 text-xs text-[#CBD5E1] font-medium bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-white border border-[#2962FF]"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#0052CC]"></span>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#2962FF]"></span>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#000080]"></span>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#2D68C4]"></span>
                <span>Upcoming Scheduled</span>
              </div>
            </div>

            {/* Hourly Slot Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIMELINE_SLOTS.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                
                // Color formatting helper based on parameters
                let bgStyle = '';
                let textStyle = 'text-[#CBD5E1]';
                let borderStyle = 'border border-[#334155]';

                if (isSelected) {
                  bgStyle = 'bg-[#2962FF]';
                  textStyle = 'text-white';
                  borderStyle = 'border border-[#2962FF]';
                } else {
                  switch (slot.status) {
                    case 'Available':
                      bgStyle = 'bg-white';
                      textStyle = 'text-slate-800';
                      borderStyle = 'border-2 border-[#2962FF]';
                      break;
                    case 'Booked':
                      bgStyle = 'bg-[#0052CC]';
                      textStyle = 'text-white';
                      break;
                    case 'Cancelled':
                      bgStyle = 'bg-[#000080]';
                      textStyle = 'text-white';
                      break;
                    case 'Upcoming':
                    default:
                      bgStyle = 'bg-[#2D68C4]';
                      textStyle = 'text-white';
                      break;
                  }
                }

                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-4 rounded-xl transition duration-200 hover:-translate-y-0.5 shadow-md flex flex-col justify-between h-24 ${bgStyle} ${textStyle} ${borderStyle} cursor-pointer`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold tracking-wider font-mono">{slot.label}</span>
                      <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : slot.status === 'Available'
                          ? 'bg-[#2962FF]/10 text-[#2962FF]'
                          : 'bg-black/15 text-white/90'
                      }`}>
                        {slot.status}
                      </span>
                    </div>

                    <div className="w-full text-left mt-2">
                      <p className={`text-[10px] font-bold line-clamp-1 truncate ${
                        slot.status === 'Available' && !isSelected ? 'text-slate-600' : 'text-white/80'
                      }`}>
                        {slot.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected slot information card */}
            {selectedSlotId && (
              <div className="mt-5 p-4 bg-[#0F172A] border border-[#334155] rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[#2D68C4] shrink-0 mt-0.5" />
                <div className="text-left text-xs">
                  <div className="font-bold text-white mb-0.5">
                    Slot Information Overview
                  </div>
                  <p className="text-[#CBD5E1] leading-relaxed">
                    Hour slot: <span className="text-white font-semibold font-mono">{TIMELINE_SLOTS.find(s => s.id === selectedSlotId)?.label}</span> is flagged as <span className="font-semibold text-white">{TIMELINE_SLOTS.find(s => s.id === selectedSlotId)?.status}</span>. You can reserve available hours immediately using the booking scheduler interface.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* BOOKING HISTORY TABLE */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2962FF]" />
            <span>Booking History & State Records</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0F172A]/75 border-b border-[#334155]">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Employee</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Reserved Asset</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Booking Date</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Reservation Time</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60 text-xs">
              {history.map((booking) => {
                
                // Color formatting status badge
                let badgeBg = '';
                switch (booking.status) {
                  case 'Upcoming':
                    badgeBg = 'bg-[#2962FF] text-white';
                    break;
                  case 'Completed':
                    badgeBg = 'bg-[#0052CC] text-white';
                    break;
                  case 'Cancelled':
                    badgeBg = 'bg-[#000080] text-white';
                    break;
                  default:
                    badgeBg = 'bg-[#1e293b] text-white';
                    break;
                }

                return (
                  <tr key={booking.id} className="hover:bg-[#0f172a]/20 transition-all duration-150">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#94A3B8]" />
                      <span>{booking.employee}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#CBD5E1]">
                      {booking.assetName || 'Testing Projector 4K'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[#CBD5E1]">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 font-mono text-[#CBD5E1]">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold font-sans tracking-wide inline-block ${badgeBg}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
