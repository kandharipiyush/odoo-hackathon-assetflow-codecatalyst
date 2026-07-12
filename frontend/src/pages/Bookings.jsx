import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  Search,
  AlertTriangle,
  X,
  ChevronDown,
  Building,
  Car,
  Tv,
  Users,
  AlertCircle
} from 'lucide-react'

// Dummy Data
const RESOURCES = [
  { id: 'RES-001', name: 'Conference Room Alpha', type: 'Room', capacity: 12, location: 'Mumbai HQ - 4th Floor', icon: Users },
  { id: 'RES-002', name: 'Conference Room Beta', type: 'Room', capacity: 6, location: 'Mumbai HQ - 2nd Floor', icon: Users },
  { id: 'RES-003', name: 'Fleet Tesla Model 3', type: 'Vehicle', capacity: 5, location: 'Bangalore Tech Park', icon: Car },
  { id: 'RES-004', name: 'Fleet Delivery Van', type: 'Vehicle', capacity: 2, location: 'Kolkata Hub', icon: Car },
  { id: 'RES-005', name: 'Testing Projector 4K', type: 'Equipment', capacity: 1, location: 'Pune Office', icon: Tv },
  { id: 'RES-006', name: 'Hardware Testing Lab', type: 'Room', capacity: 8, location: 'Noida Data Center', icon: Building }
];

const INITIAL_BOOKINGS = [
  {
    id: 'BKG-101',
    resourceId: 'RES-001',
    purpose: 'Product Sync & Q3 Planning',
    date: '2026-07-14',
    startTime: '10:00',
    endTime: '12:00',
    requester: 'Piyush Kandhari',
    department: 'Product',
    status: 'Approved'
  },
  {
    id: 'BKG-102',
    resourceId: 'RES-003',
    purpose: 'Client Onsite Visit - Bangalore',
    date: '2026-07-15',
    startTime: '09:00',
    endTime: '17:00',
    requester: 'Ananya Sen',
    department: 'Sales',
    status: 'Approved'
  },
  {
    id: 'BKG-103',
    resourceId: 'RES-005',
    purpose: 'Demo for Stakeholders',
    date: '2026-07-14',
    startTime: '14:00',
    endTime: '15:30',
    requester: 'Rahul Bajaj',
    department: 'Engineering',
    status: 'Pending Approval'
  },
  {
    id: 'BKG-104',
    resourceId: 'RES-002',
    purpose: 'Weekly HR Interview Round',
    date: '2026-07-16',
    startTime: '13:00',
    endTime: '15:00',
    requester: 'Priya Patel',
    department: 'Human Resources',
    status: 'Approved'
  },
  {
    id: 'BKG-105',
    resourceId: 'RES-006',
    purpose: 'IoT Sensor Calibration',
    date: '2026-07-14',
    startTime: '11:00',
    endTime: '14:00',
    requester: 'Vikram Seth',
    department: 'R&D',
    status: 'Approved'
  }
];

export default function Bookings() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Booking Form State
  const [formData, setFormData] = useState({
    resourceId: 'RES-001',
    purpose: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    requester: '',
    department: 'Engineering'
  });

  // Conflict Alerts State
  const [conflictWarning, setConflictWarning] = useState(null);

  // Time overlap logic check
  const checkConflict = (resourceId, date, start, end, excludeId = null) => {
    return bookings.find((b) => {
      if (b.id === excludeId) return false;
      if (b.resourceId !== resourceId) return false;
      if (b.date !== date) return false;
      if (b.status === 'Cancelled') return false;

      const newStart = parseInt(start.replace(':', ''));
      const newEnd = parseInt(end.replace(':', ''));
      const currentStart = parseInt(b.startTime.replace(':', ''));
      const currentEnd = parseInt(b.endTime.replace(':', ''));

      // Check overlap: Start time falls inside existing, or end time falls inside, or new booking completely covers existing
      const overlap =
        (newStart >= currentStart && newStart < currentEnd) ||
        (newEnd > currentStart && newEnd <= currentEnd) ||
        (newStart <= currentStart && newEnd >= currentEnd);

      return overlap;
    });
  };

  // Real-time conflict feedback as user changes inputs
  const handleFormChange = (field, value) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);

    // Verify booking conflict
    const conflicting = checkConflict(
      updatedForm.resourceId,
      updatedForm.date,
      updatedForm.startTime,
      updatedForm.endTime
    );

    if (conflicting) {
      const resourceObj = RESOURCES.find((r) => r.id === updatedForm.resourceId);
      setConflictWarning({
        resourceName: resourceObj?.name,
        requester: conflicting.requester,
        purpose: conflicting.purpose,
        startTime: conflicting.startTime,
        endTime: conflicting.endTime,
        department: conflicting.department
      });
    } else {
      setConflictWarning(null);
    }
  };

  // Handle Form Submit
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.purpose || !formData.date || !formData.startTime || !formData.endTime || !formData.requester) {
      alert('Please fill out all fields.');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert('Start Time must be strictly before End Time.');
      return;
    }

    // Double check conflict
    const conflicting = checkConflict(formData.resourceId, formData.date, formData.startTime, formData.endTime);
    if (conflicting) {
      alert(`Conflict Detected! ${RESOURCES.find(r => r.id === formData.resourceId)?.name} is already booked.`);
      return;
    }

    const newBookingObj = {
      ...formData,
      id: `BKG-${Date.now().toString().slice(-3)}`,
      status: 'Approved' // auto-approves for demo
    };

    setBookings((prev) => [newBookingObj, ...prev]);
    setIsNewBookingOpen(false);
    setConflictWarning(null);
    
    // Reset Form except standard values
    setFormData({
      resourceId: 'RES-001',
      purpose: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      requester: '',
      department: 'Engineering'
    });
  };

  // Quick Action: Cancel Booking
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
    }
  };

  // Quick Action: Approve Booking
  const handleApproveBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Approved' } : b))
    );
  };

  // Computed Values
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const resource = RESOURCES.find((r) => r.id === b.resourceId);
      const matchesSearch =
        resource?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'All' || resource?.type === filterType;
      const matchesDate = !dateFilter || b.date === dateFilter;

      return matchesSearch && matchesType && matchesDate;
    });
  }, [bookings, searchQuery, filterType, dateFilter]);

  const stats = useMemo(() => {
    const totalToday = bookings.filter((b) => b.status !== 'Cancelled').length;
    const pendingCount = bookings.filter((b) => b.status === 'Pending Approval').length;
    const roomBookings = bookings.filter((b) => {
      const r = RESOURCES.find((res) => res.id === b.resourceId);
      return b.status !== 'Cancelled' && r?.type === 'Room';
    }).length;

    return {
      totalToday,
      pendingCount,
      roomBookings,
      utilizationRate: 72 // mock percentage
    };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-custom-bg text-text-primary p-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-card-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-left">Resource Bookings</h1>
          <p className="text-text-secondary text-sm text-left">
            Reserve conference rooms, vehicles, and test equipments. Real-time scheduling conflict resolution.
          </p>
        </div>
        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-primary-brand hover:bg-hover-blue text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-primary-brand/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>New Booking Request</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-primary-brand/10 p-3 rounded-lg text-primary-brand">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Total Active Bookings</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.totalToday}</h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Scheduled and approved reserve slots</p>
        </div>

        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-accent-blue/10 p-3 rounded-lg text-accent-blue">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Avg. Utilization Rate</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.utilizationRate}%</h3>
          <div className="w-full bg-card-border h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-accent-blue h-full rounded-full" style={{ width: `${stats.utilizationRate}%` }}></div>
          </div>
        </div>

        <div className="bg-surface-card border-card-highlight border border-l-4 p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-premium-ai/20 p-3 rounded-lg text-[#007FFF]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Pending Approvals</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.pendingCount}</h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Requires supervisor signoff</p>
        </div>

        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-progress-charts/10 p-3 rounded-lg text-progress-charts">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Spaces Reserved</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.roomBookings}</h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Conference rooms reserved this week</p>
        </div>
      </div>

      {/* Main Core Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Resources Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-card border border-card-border rounded-xl p-5 shadow-lg">
            <h3 className="font-semibold text-lg border-b border-card-border pb-3 mb-4 text-left">Shared Resources</h3>
            <div className="space-y-3">
              {RESOURCES.map((res) => {
                const IconComponent = res.icon;
                return (
                  <div
                    key={res.id}
                    className="p-4 bg-custom-bg rounded-xl border border-card-border flex items-start gap-3 hover:border-[#007FFF]/50 transition-colors"
                  >
                    <div className="bg-primary-brand/10 p-2 text-[#007FFF] rounded-lg">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-text-primary text-[15px]">{res.name}</div>
                      <div className="text-xs text-text-muted mt-0.5 font-mono">{res.id}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] uppercase font-bold text-text-muted bg-card-border py-0.5 px-2 rounded">
                          {res.type}
                        </span>
                        {res.capacity > 1 && (
                          <span className="text-[10px] text-text-secondary font-medium">
                            Capacity: {res.capacity} pax
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-secondary mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-accent-blue" />
                        <span>{res.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Active Reservations List & Filter Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="bg-surface-card border border-card-border rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-text-muted" />
              </span>
              <input
                type="text"
                placeholder="Search bookings by requester, purpose, or resource name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-custom-bg border border-card-border rounded-xl text-sm focus:outline-none focus:border-primary-brand text-text-primary font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-custom-bg border border-card-border rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none pr-8 relative"
                >
                  <option value="All">All Resources</option>
                  <option value="Room">Rooms</option>
                  <option value="Vehicle">Vehicles</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-custom-bg border border-card-border rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary font-sans"
                />
              </div>
            </div>
          </div>

          {/* Bookings Lists */}
          <div className="bg-surface-card border border-card-border rounded-xl shadow-lg p-5">
            <h3 className="font-semibold text-lg border-b border-card-border pb-3 mb-4 text-left">Reservation Records</h3>
            
            <div className="space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const resObj = RESOURCES.find((res) => res.id === b.resourceId);
                  return (
                    <div
                      key={b.id}
                      className={`p-4 bg-custom-bg border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-custom-bg/40 ${
                        b.status === 'Cancelled'
                          ? 'border-transparent opacity-50'
                          : b.status === 'Pending Approval'
                          ? 'border-yellow-500/30 border-l-4 border-l-yellow-500'
                          : 'border-card-border hover:border-primary-brand/40'
                      }`}
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-text-primary text-base group-hover:text-primary-brand">
                            {resObj?.name}
                          </h4>
                          <span className="text-[10px] font-mono bg-card-border/60 text-text-muted px-2 py-0.5 rounded">
                            {b.id}
                          </span>
                        </div>

                        <p className="text-text-secondary text-sm font-medium mt-1">{b.purpose}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mt-3 text-xs text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-accent-blue" />
                            <span>{b.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#007FFF]" />
                            <span>{b.startTime} - {b.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2 md:col-span-1">
                            <User className="w-3.5 h-3.5 text-primary-brand" />
                            <span>{b.requester} ({b.department})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-end border-t border-card-border/30 pt-3 md:border-0 md:pt-0">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            b.status === 'Approved'
                              ? 'bg-notification-blue/10 text-[#007FFF]'
                              : b.status === 'Cancelled'
                              ? 'bg-slate-700/20 text-text-muted'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {b.status}
                        </span>

                        {b.status === 'Pending Approval' && (
                          <button
                            onClick={() => handleApproveBooking(b.id)}
                            className="bg-[#2962FF] hover:bg-hover-blue text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {b.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-text-muted hover:text-red-500 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 border border-dashed border-card-border rounded-xl text-center text-text-muted">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-text-muted/65" />
                  <div>No resource reservations match the search filters.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NEW BOOKING FORM MODAL */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-surface-card border border-card-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-custom-bg p-5 border-b border-card-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary-brand" />
                <span>Request Shared Resource Slot</span>
              </h3>
              <button
                onClick={() => {
                  setIsNewBookingOpen(false);
                  setConflictWarning(null);
                }}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {/* Conflict Alert Warning Banner */}
              {conflictWarning && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-yellow-500 uppercase">Scheduling Blockage Conflict</div>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      <strong>{conflictWarning.resourceName}</strong> is already booked on this date from{' '}
                      <strong>{conflictWarning.startTime} - {conflictWarning.endTime}</strong> by{' '}
                      {conflictWarning.requester} ({conflictWarning.department}) for: "{conflictWarning.purpose}".
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Select Shared Resource *</label>
                  <div className="relative">
                    <select
                      value={formData.resourceId}
                      onChange={(e) => handleFormChange('resourceId', e.target.value)}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      {RESOURCES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.type})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Booking Purpose *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sprint Planning Sync"
                    value={formData.purpose}
                    onChange={(e) => handleFormChange('purpose', e.target.value)}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2.5 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Booking Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Requester Employee *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Piyush Kandhari"
                    value={formData.requester}
                    onChange={(e) => handleFormChange('requester', e.target.value)}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Start Time *</label>
                  <input
                    type="time"
                    required
                    step="1800"
                    value={formData.startTime}
                    onChange={(e) => handleFormChange('startTime', e.target.value)}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">End Time *</label>
                  <input
                    type="time"
                    required
                    step="1800"
                    value={formData.endTime}
                    onChange={(e) => handleFormChange('endTime', e.target.value)}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary font-sans"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Requester Department</label>
                  <div className="relative">
                    <select
                      value={formData.department}
                      onChange={(e) => handleFormChange('department', e.target.value)}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product Development</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance & Accounting</option>
                      <option value="Sales">Sales & Marketing</option>
                      <option value="R&D">Research & Development</option>
                      <option value="Logistics">Logistics Operations</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewBookingOpen(false);
                    setConflictWarning(null);
                  }}
                  className="bg-card-border hover:bg-slate-700 text-text-secondary text-sm font-medium py-2 px-4 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!conflictWarning}
                  className={`text-white text-sm font-medium py-2 px-5 rounded-xl shadow-lg transition duration-200 cursor-pointer ${
                    conflictWarning
                      ? 'bg-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-primary-brand hover:bg-hover-blue'
                  }`}
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
