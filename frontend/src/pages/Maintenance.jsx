import React, { useState } from 'react'
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  User,
  Calendar,
  Activity,
  Award
} from 'lucide-react'

// Dummy pre-loaded maintenance requests distributed across the 7 columns
const INITIAL_REQUESTS = [
  { id: 'MNT-881', tag: 'AST-104', name: 'Server Rack UPS Battery Leak', priority: 'Emergency', date: '2026-07-11', technician: 'Vikram Seth', condition: 'Poor', healthScore: 32, status: 'Broken' },
  { id: 'MNT-882', tag: 'AST-101', name: 'Tesla Model Y Left Front Strut Play', priority: 'High', date: '2026-07-12', technician: 'Unassigned', condition: 'Good', healthScore: 84, status: 'Pending Approval' },
  { id: 'MNT-883', tag: 'AST-103', name: '4K Development Projector Fan Noise', priority: 'Medium', date: '2026-07-10', technician: 'Unassigned', condition: 'Fair', healthScore: 72, status: 'Approved' },
  { id: 'MNT-884', tag: 'AST-105', name: 'Logistics Van Brake Caliper Refit', priority: 'High', date: '2026-07-09', technician: 'Rajesh Kumar', condition: 'Fair', healthScore: 68, status: 'Technician Assigned' },
  { id: 'MNT-885', tag: 'AST-107', name: 'Reception AC Condenser Coil Flush', priority: 'Medium', date: '2026-07-10', technician: 'Priya Patil', condition: 'Fair', healthScore: 75, status: 'In Progress' },
  { id: 'MNT-886', tag: 'AST-102', name: 'Conference Suite Mic Battery Cycle', priority: 'Low', date: '2026-07-12', technician: 'Vikram Seth', condition: 'Good', healthScore: 88, status: 'Resolved' },
  { id: 'MNT-887', tag: 'AST-109', name: 'Production Server Storage Array Add', priority: 'Medium', date: '2026-07-08', technician: 'Vikram Seth', condition: 'Excellent', healthScore: 96, status: 'Available' },
  { id: 'MNT-888', tag: 'AST-111', name: 'Standing Desk Height Actuator Jam', priority: 'Low', date: '2026-07-11', technician: 'Priya Patil', condition: 'Fair', healthScore: 70, status: 'Pending Approval' },
  { id: 'MNT-889', tag: 'AST-114', name: 'Fiber Line SFP Modulator Overheat', priority: 'High', date: '2026-07-12', technician: 'Unassigned', condition: 'Good', healthScore: 82, status: 'Broken' },
  { id: 'MNT-890', tag: 'AST-115', name: 'Warehouse Conveyor Lubrication', priority: 'Medium', date: '2026-07-10', technician: 'Rajesh Kumar', condition: 'Good', healthScore: 90, status: 'Resolved' }
];

const COLUMNS = [
  { id: 'Broken', name: 'Broken', color: '#000080' },
  { id: 'Pending Approval', name: 'Pending Approval', color: '#1E90FF' },
  { id: 'Approved', name: 'Approved', color: '#2962FF' },
  { id: 'Technician Assigned', name: 'Technician Assigned', color: '#2A52BE' },
  { id: 'In Progress', name: 'In Progress', color: '#2D68C4' },
  { id: 'Resolved', name: 'Resolved', color: '#0052CC' },
  { id: 'Available', name: 'Available', color: '#2962FF' }
];

const RECENT_ACTIVITIES = [
  { id: 1, text: 'Ticket MNT-881 moved to Broken', time: '10 mins ago', type: 'broken' },
  { id: 2, text: 'Vikram Seth assigned to MNT-884', time: '1 hour ago', type: 'assign' },
  { id: 3, text: 'MNT-886 flagged as Resolved', time: '3 hours ago', type: 'resolve' },
  { id: 4, text: 'New request registered for AST-101', time: '4 hours ago', type: 'add' },
  { id: 5, text: 'SLA report compiled successfully', time: 'Yesterday', type: 'audit' }
];

export default function Maintenance() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  
  // Selected Card Modals
  const [activeModal, setActiveModal] = useState(null); // 'details', 'history'
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Stats computation
  const stats = {
    total: requests.length,
    critical: requests.filter(r => r.priority === 'Emergency' || r.priority === 'High').length,
    resolved: requests.filter(r => r.status === 'Resolved' || r.status === 'Available').length,
    repairTime: '4.2 Hrs'
  };

  // Move request through workflow columns sequentially
  const handleMoveCard = (reqId) => {
    setRequests(prev => prev.map(item => {
      if (item.id === reqId) {
        const currentIndex = COLUMNS.findIndex(col => col.id === item.status);
        const nextIndex = (currentIndex + 1) % COLUMNS.length;
        
        // Auto-assign sample technician if moving into Tech Assigned stage
        let updatedTech = item.technician;
        if (COLUMNS[nextIndex].id === 'Technician Assigned' && item.technician === 'Unassigned') {
          updatedTech = 'Rajesh Kumar';
        }
        
        // Auto-boost health score if moving to Available
        let updatedHealth = item.healthScore;
        if (COLUMNS[nextIndex].id === 'Available') {
          updatedHealth = 98;
        }

        return {
          ...item,
          status: COLUMNS[nextIndex].id,
          technician: updatedTech,
          healthScore: updatedHealth
        };
      }
      return item;
    }));
  };

  // Open modal handler
  const openModal = (req, type) => {
    setSelectedRequest(req);
    setActiveModal(type);
  };

  // Close modals
  const closeModal = () => {
    setSelectedRequest(null);
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased text-left flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="border-b border-[#334155] pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Maintenance Management</h1>
        <p className="text-[#CBD5E1] text-sm font-medium">
          Track repair requests and maintenance workflow.
        </p>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Total Requests - Primary Atlassian Color */}
        <div className="bg-[#0052CC] rounded-xl p-5 shadow-lg border border-[#334155] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-white/10 p-3 rounded-lg text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-wider block">Total Requests</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.total}</h3>
          <p className="text-white/60 text-xs mt-3">Active job tickets in repository</p>
        </div>

        {/* Critical Issues - AI Highlight Sapphire Color */}
        <div className="bg-[#0F52BA] rounded-xl p-5 shadow-[0_0_20px_rgba(41,98,255,0.4)] border border-[#2962FF] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-white/10 p-3 rounded-lg text-white">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-wider block">Critical Issues</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.critical}</h3>
          <p className="text-white/60 text-xs mt-3">Emergency & High priority tickets</p>
        </div>

        {/* Resolved Today */}
        <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg border border-[#334155] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-green-500/10 p-3 rounded-lg text-green-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <span className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider block">Resolved Today</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.resolved}</h3>
          <p className="text-[#CBD5E1] text-xs mt-3">Completed repairs in last 24h</p>
        </div>

        {/* Average Repair Time */}
        <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg border border-[#334155] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-blue-500/10 p-3 rounded-lg text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider block">Avg. Repair Time</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.repairTime}</h3>
          <p className="text-[#CBD5E1] text-xs mt-3">MTTR under SLA schedule limits</p>
        </div>

      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1 min-h-[500px]">
        
        {/* KANBAN BOARD CONTAINER (3 cols) */}
        <div className="lg:col-span-3 bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-2xl flex flex-col gap-5 overflow-hidden">
          <h3 className="text-lg font-bold text-white border-b border-[#334155] pb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2962FF]" />
            <span>Workflow Kanban Matrix</span>
          </h3>

          {/* Lateral Scrolling columns panel */}
          <div className="flex gap-4 overflow-x-auto pb-4 items-stretch select-none">
            {COLUMNS.map(col => {
              const colRequests = requests.filter(r => r.status === col.id);
              return (
                <div
                  key={col.id}
                  className="bg-[#0F172A]/70 border border-[#334155]/60 rounded-xl p-3 flex flex-col gap-3 min-w-[260px] w-[260px] shrink-0"
                >
                  {/* Column Header */}
                  <div
                    className="border-l-4 pl-2 py-1 flex items-center justify-between"
                    style={{ borderColor: col.color }}
                  >
                    <span className="text-xs font-bold text-white tracking-wide truncate max-w-[170px]" title={col.name}>
                      {col.name}
                    </span>
                    <span className="bg-[#1E293B] border border-[#334155] text-[10px] font-mono font-bold text-[#CBD5E1] px-2 py-0.5 rounded-full">
                      {colRequests.length}
                    </span>
                  </div>

                  {/* Column Card Lists */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                    {colRequests.map(req => (
                      
                      // Rounded card, dark bg, hover border blue #2962FF
                      <div
                        key={req.id}
                        className="bg-[#1E293B] border border-[#334155] hover:border-[#2962FF] rounded-xl p-4 shadow-md transition-all duration-200 flex flex-col gap-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#94A3B8] font-bold">{req.id}</span>
                          <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                            req.priority === 'Emergency' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                            req.priority === 'High' ? 'text-yellow-400 bg-yellow-500/10' :
                            req.priority === 'Medium' ? 'text-blue-400 bg-blue-500/10' :
                            'text-slate-400 bg-slate-500/10'
                          }`}>
                            {req.priority}
                          </span>
                        </div>

                        <div className="text-xs">
                          <span className="text-[10px] font-mono text-[#94A3B8] block mb-0.5">{req.tag}</span>
                          <h4 className="font-bold text-white leading-tight line-clamp-2 truncate max-w-[200px]" title={req.name}>
                            {req.name}
                          </h4>
                        </div>

                        {/* Health Score Ring (#2D68C4) & Technician name details */}
                        <div className="border-t border-[#334155]/60 pt-3 flex items-center justify-between text-[11px] text-[#CBD5E1]">
                          <div className="space-y-1">
                            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                              <User className="w-3 h-3 text-[#2962FF]" />
                              <span className="truncate max-w-[100px] font-medium" title={req.technician}>{req.technician}</span>
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                              <Calendar className="w-3 h-3 text-[#2962FF]" />
                              <span>{req.date}</span>
                            </span>
                          </div>

                          {/* Health Circle Ring (#2D68C4) */}
                          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <circle
                                className="text-slate-800"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                cx="18"
                                cy="18"
                                r="15"
                              />
                              <circle
                                strokeWidth="3"
                                strokeDasharray={`${req.healthScore}, 100`}
                                strokeLinecap="round"
                                stroke="#2D68C4"
                                fill="none"
                                cx="18"
                                cy="18"
                                r="15"
                              />
                            </svg>
                            <span className="absolute text-[8px] font-bold text-[#CBD5E1] font-mono mt-0.5">{req.healthScore}</span>
                          </div>

                        </div>

                        {/* OUTLINED ACTIONS BUTTONS */}
                        <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2.5 border-t border-[#334155]/40 text-center">
                          <button
                            onClick={() => handleMoveCard(req.id)}
                            className="flex items-center justify-center gap-0.5 border border-[#334155]/80 hover:bg-[#2962FF]/10 text-white rounded py-1 px-0.5 text-[9px] font-bold transition duration-200 cursor-pointer"
                          >
                            <span>Move</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                          
                          <button
                            onClick={() => openModal(req, 'details')}
                            className="border border-[#334155]/80 hover:bg-[#2962FF]/10 text-white rounded py-1 px-0.5 text-[9px] font-bold transition duration-200 cursor-pointer"
                          >
                            Details
                          </button>

                          <button
                            onClick={() => openModal(req, 'history')}
                            className="border border-[#334155]/80 hover:bg-[#2962FF]/10 text-white rounded py-1 px-0.5 text-[9px] font-bold transition duration-200 cursor-pointer"
                          >
                            History
                          </button>
                        </div>

                      </div>
                    ))}

                    {colRequests.length === 0 && (
                      <div className="py-12 border border-dashed border-[#334155]/40 rounded-xl text-center text-[#94A3B8] text-[11px]">
                        No active jobs
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: RECENT ACTIVITIES (1 col) */}
        <div className="lg:col-span-1 bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-2xl flex flex-col gap-4">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2962FF]" />
            <span>Recent Activity</span>
          </h3>

          <div className="relative border-l border-[#334155] ml-3 pl-5 space-y-5 text-xs text-left">
            {RECENT_ACTIVITIES.map(action => (
              <div key={action.id} className="relative">
                {/* Timeline Icon Marker Node (#2962FF) */}
                <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2962FF] border border-[#1E293B]"></span>
                <span className="text-[#94A3B8] font-mono text-[10px] block">{action.time}</span>
                <p className="text-[#CBD5E1] mt-0.5 font-medium leading-relaxed">{action.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POPUP MODALS OVERLAYS */}
      {activeModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn text-left text-xs">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-4 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white capitalize flex items-center gap-1.5">
                <span>{activeModal === 'details' ? 'Request Specifications' : 'Technical Diagnostic Logs'}</span>
                <span className="text-[10px] font-mono bg-[#334155] text-[#CBD5E1] px-2 py-0.5 rounded ml-2">
                  {selectedRequest.id}
                </span>
              </h3>
              <button
                onClick={closeModal}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DETAILS MODAL BODY */}
            {activeModal === 'details' && (
              <div className="p-5 space-y-4 font-medium">
                <div>
                  <div className="text-[10px] text-[#94A3B8] uppercase">Defect Summary</div>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedRequest.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase">Asset Tag</label>
                    <div className="text-white font-mono bg-[#0F172A] p-2 rounded border border-[#334155] mt-0.5">{selectedRequest.tag}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase">SLA Severity</label>
                    <div className="text-white bg-[#0F172A] p-2 rounded border border-[#334155] mt-0.5">{selectedRequest.priority}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase">Assigned Technician</label>
                    <div className="text-white bg-[#0F172A] p-2 rounded border border-[#334155] mt-0.5">{selectedRequest.technician}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase">Date Registered</label>
                    <div className="text-white font-mono bg-[#0F172A] p-2 rounded border border-[#334155] mt-0.5">{selectedRequest.date}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase">Physical Condition</label>
                    <div className="text-white bg-[#0F172A] p-2 rounded border border-[#334155] mt-0.5">{selectedRequest.condition}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase">Asset Health Index</label>
                    <div className="text-white font-mono bg-[#0F172A] p-2 rounded border border-[#334155] mt-0.5">{selectedRequest.healthScore}%</div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#334155]/60">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Close Specs Details
                  </button>
                </div>
              </div>
            )}

            {/* HISTORY MODAL BODY */}
            {activeModal === 'history' && (
              <div className="p-5 space-y-4">
                <div className="text-[#CBD5E1] text-[11px] bg-[#0F172A] p-2.5 rounded border border-[#334155]">
                  Job lifecycle tracking logs for <strong className="text-white">{selectedRequest.name}</strong>
                </div>

                <div className="relative border-l border-[#334155] ml-3 pl-4 space-y-4 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#2962FF] border border-[#1E293B]"></span>
                    <span className="text-[#94A3B8] font-mono text-[9px]">2026-07-10 09:12</span>
                    <div className="font-bold text-white mt-0.5">Defect Logged</div>
                    <p className="text-[#CBD5E1] text-[10px]">Registered by operations operator. flagged status code as {selectedRequest.status}.</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#2D68C4] border border-[#1E293B]"></span>
                    <span className="text-[#94A3B8] font-mono text-[9px]">2026-07-11 14:32</span>
                    <div className="font-bold text-white mt-0.5">Audit Assessment Run</div>
                    <p className="text-[#CBD5E1] text-[10px]">Visual safety checks complete. Initial health score checked at {selectedRequest.healthScore}%.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#334155]/60">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Close Log History
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
