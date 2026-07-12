import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { api as axios } from '../services/authService'
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
  Award,
  RotateCw,
  Info,
  Plus,
  Send
} from 'lucide-react'

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

const FALLBACK_REQUESTS = [
  { id: 'MNT-881', tag: 'AST-104', name: 'Server Rack UPS Battery Leak', priority: 'Emergency', date: '2026-07-11', technician: 'Vikram Seth', condition: 'Poor', healthScore: 32, status: 'Broken' },
  { id: 'MNT-882', tag: 'AST-101', name: 'Tesla Model Y Left Front Strut Play', priority: 'High', date: '2026-07-12', technician: 'Unassigned', condition: 'Good', healthScore: 84, status: 'Pending Approval' },
  { id: 'MNT-883', tag: 'AST-103', name: '4K Development Projector Fan Noise', priority: 'Medium', date: '2026-07-10', technician: 'Unassigned', condition: 'Fair', healthScore: 72, status: 'Approved' },
  { id: 'MNT-884', tag: 'AST-105', name: 'Logistics Van Brake Caliper Refit', priority: 'High', date: '2026-07-09', technician: 'Rajesh Kumar', condition: 'Fair', healthScore: 68, status: 'Technician Assigned' },
  { id: 'MNT-885', tag: 'AST-107', name: 'Reception AC Condenser Coil Flush', priority: 'Medium', date: '2026-07-10', technician: 'Priya Patil', condition: 'Fair', healthScore: 75, status: 'In Progress' }
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
  { id: 1, text: 'Ticket MNT-881 moved to Broken', time: '10 mins ago' },
  { id: 2, text: 'Vikram Seth assigned to MNT-884', time: '1 hour ago' },
  { id: 3, text: 'MNT-886 flagged as Resolved', time: '3 hours ago' },
  { id: 4, text: 'New request registered for AST-101', time: '4 hours ago' }
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Returns color classes representing incident priority status
 */
const getPriorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'Emergency':
      return 'bg-red-500/20 text-red-500 border border-red-500/20';
    case 'High':
      return 'text-yellow-400 bg-yellow-500/10';
    case 'Medium':
      return 'text-blue-400 bg-blue-500/10';
    default:
      return 'text-slate-400 bg-slate-500/10';
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Single job entry card, memoized to optimize Kanban updates rendering
 */
const KanbanCard = React.memo(({ req, onMove, onDetails, onHistory }) => {
  const handleMove = useCallback((e) => {
    e.stopPropagation();
    onMove(req.id);
  }, [req.id, onMove]);

  const handleDetails = useCallback(() => onDetails(req), [req, onDetails]);
  const handleHistory = useCallback(() => onHistory(req), [req, onHistory]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      onMove(req.id);
    } else if (e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      onDetails(req);
    } else if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      onHistory(req);
    }
  }, [req, onMove, onDetails, onHistory]);

  const priorityStyle = useMemo(() => getPriorityBadgeStyle(req.priority), [req.priority]);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Task ${req.id} for asset ${req.name}, priority ${req.priority}, health ${req.healthScore} percent. Press M to move, D for details, H for history.`}
      className="bg-[#1E293B] border border-[#334155] hover:border-[#2962FF] rounded-xl p-4 shadow-md transition-all duration-200 flex flex-col gap-3 relative group focus:outline-none focus:ring-2 focus:ring-[#2962FF] focus:border-[#2962FF] text-left"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#94A3B8] font-bold">{req.id}</span>
        <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${priorityStyle}`}>
          {req.priority}
        </span>
      </div>

      <div className="text-xs">
        <span className="text-[10px] font-mono text-[#94A3B8] block mb-0.5">{req.tag}</span>
        <h4 className="font-bold text-white leading-tight line-clamp-2 truncate max-w-[200px]" title={req.name}>{req.name}</h4>
      </div>

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

        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" cx="18" cy="18" r="15" />
            <circle strokeWidth="3" strokeDasharray={`${req.healthScore}, 100`} strokeLinecap="round" stroke="#2D68C4" fill="none" cx="18" cy="18" r="15" />
          </svg>
          <span className="absolute text-[8px] font-bold text-[#CBD5E1] font-mono mt-0.5">{req.healthScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2.5 border-t border-[#334155]/40 text-center">
        <button 
          onClick={handleMove} 
          className="flex items-center justify-center gap-0.5 border border-[#334155]/80 hover:bg-[#2962FF]/10 text-white rounded py-1 px-0.5 text-[9px] font-bold transition duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2962FF]"
          title="Move tag status forward"
        >
          <span>Move</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </button>
        <button 
          onClick={handleDetails} 
          className="border border-[#334155]/80 hover:bg-[#2962FF]/10 text-white rounded py-1 px-0.5 text-[9px] font-bold transition duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2962FF]"
        >
          Details
        </button>
        <button 
          onClick={handleHistory} 
          className="border border-[#334155]/80 hover:bg-[#2962FF]/10 text-white rounded py-1 px-0.5 text-[9px] font-bold transition duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2962FF]"
        >
          History
        </button>
      </div>
    </div>
  );
});

/**
 * Top summary statistics loader
 */
const SummarySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-pulse mb-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-[#1E293B] rounded-xl p-5 border border-[#334155] h-28"></div>
    ))}
  </div>
);

/**
 * Columns container placeholders
 */
const ColumnsSkeleton = () => (
  <div className="grid grid-cols-3 gap-6 animate-pulse">
    {[...Array(3)].map((_, col) => (
      <div key={col} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 h-96 space-y-4">
        <div className="h-5 bg-slate-700 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-800/80 rounded-xl"></div>
          <div className="h-20 bg-slate-800/80 rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal selections
  const [activeModal, setActiveModal] = useState(null); // 'details', 'history', 'raise'
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Raise Issue form state
  const [raiseAssetId, setRaiseAssetId] = useState('');
  const [raiseDescription, setRaiseDescription] = useState('');
  const [raisePriority, setRaisePriority] = useState('MEDIUM');
  const [raiseMessage, setRaiseMessage] = useState(null);
  const [raiseSubmitting, setRaiseSubmitting] = useState(false);
  const [assetsList, setAssetsList] = useState([]);

  const fetchMaintenanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [maintRes, assetsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/maintenance`),
        axios.get(`${API_BASE_URL}/assets`)
      ]);
      if (maintRes.status === 'fulfilled' && Array.isArray(maintRes.value.data?.data)) {
        setRequests(maintRes.value.data.data);
      } else {
        setRequests([]);
      }
      if (assetsRes.status === 'fulfilled' && Array.isArray(assetsRes.value.data?.data)) {
        setAssetsList(assetsRes.value.data.data);
      }
    } catch (err) {
      console.warn("REST endpoint unavailable.", err);
      setError("Connect request failed. Presenting localized maintenance tickets snapshot.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseIssue = async (e) => {
    e.preventDefault();
    if (!raiseAssetId || !raiseDescription) {
      setRaiseMessage({ type: 'error', text: 'Asset and description are required.' });
      return;
    }
    setRaiseSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/maintenance`, {
        asset_id: raiseAssetId,
        issue_description: raiseDescription,
        priority: raisePriority
      });
      setRaiseMessage({ type: 'success', text: 'Issue reported successfully!' });
      setRaiseAssetId(''); setRaiseDescription(''); setRaisePriority('MEDIUM');
      // Refresh the board after 1s
      setTimeout(() => {
        setActiveModal(null);
        setRaiseMessage(null);
        fetchMaintenanceData();
      }, 1200);
    } catch (err) {
      setRaiseMessage({ type: 'error', text: err.response?.data?.message || 'Failed to report issue.' });
    } finally {
      setRaiseSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      critical: requests.filter(r => r.priority === 'Emergency' || r.priority === 'High').length,
      resolved: requests.filter(r => r.status === 'Resolved' || r.status === 'Available').length,
      repairTime: '4.2 Hrs'
    };
  }, [requests]);

  const handleMoveCard = useCallback(async (reqId) => {
    let updatedItem = null;
    setRequests(prev => {
      const nextRequests = prev.map(item => {
        if (item.id === reqId) {
          const currentIndex = COLUMNS.findIndex(col => col.id === item.status);
          const nextIndex = (currentIndex + 1) % COLUMNS.length;
          
          let updatedTech = item.technician;
          if (COLUMNS[nextIndex].id === 'Technician Assigned' && item.technician === 'Unassigned') {
            updatedTech = 'Rajesh Kumar';
          }
          
          let updatedHealth = item.healthScore;
          if (COLUMNS[nextIndex].id === 'Available') {
            updatedHealth = 98;
          }

          updatedItem = {
            ...item,
            status: COLUMNS[nextIndex].id,
            technician: updatedTech,
            healthScore: updatedHealth,
            _previousStatus: item.status,
            _nextStatus: COLUMNS[nextIndex].id
          };
          return updatedItem;
        }
        return item;
      });

      if (updatedItem) {
        // Map Kanban column transitions to the backend action enum
        const nextStatus = updatedItem._nextStatus;
        let action = null;
        if (nextStatus === 'In Progress') {
          action = 'APPROVE_REPAIR';
        } else if (nextStatus === 'Resolved' || nextStatus === 'Available') {
          action = 'RESOLVE_FIX';
        }

        if (action) {
          axios.patch(`${API_BASE_URL}/maintenance/${reqId}/resolve`, { action }).catch(err => {
            console.warn("Backend PATCH failed, modified locally.", err);
          });
        }
      }
      return nextRequests;
    });
  }, []);

  const handleDetailsClick = useCallback((req) => {
    setSelectedRequest(req);
    setActiveModal('details');
  }, []);

  const handleHistoryClick = useCallback((req) => {
    setSelectedRequest(req);
    setActiveModal('history');
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRequest(null);
    setActiveModal(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased text-left flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <header className="border-b border-[#334155] pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Maintenance Management</h1>
          <p className="text-[#CBD5E1] text-sm font-medium">
            Track repair requests and maintenance workflow.
          </p>
        </div>
        <button
          onClick={() => { setRaiseMessage(null); setActiveModal('raise'); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg shadow-lg transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Issue</span>
        </button>
      </header>

      {/* ERROR STATUS ALERT */}
      {error && (
        <div 
          className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs flex items-center justify-between gap-3 mb-2 origin-top animate-fadeIn"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchMaintenanceData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            aria-label="Retry retrieving maintenance cards"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* DYNAMIC SUMMARIES */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" aria-label="Summary Statistics">
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
        </section>
      )}

      {loading ? (
        <ColumnsSkeleton />
      ) : (
        /* KANBAN SECTION GRID */
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1 min-h-[500px]" aria-label="Kanban matrix board dashboard">
          
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
                    role="list"
                    aria-label={`Kanban stage: ${col.name}`}
                  >
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

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
                      {colRequests.length > 0 ? (
                        colRequests.map(req => (
                          <KanbanCard
                            key={req.id}
                            req={req}
                            onMove={handleMoveCard}
                            onDetails={handleDetailsClick}
                            onHistory={handleHistoryClick}
                          />
                        ))
                      ) : (
                        <div className="py-12 border border-dashed border-[#334155]/40 rounded-xl text-center text-[#94A3B8] text-[11px] flex flex-col items-center justify-center gap-1">
                          <Info className="w-4 h-4 text-[#94A3B8]" />
                          <span>No active jobs</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR: RECENT ACTIVITIES (1 col) */}
          <aside className="lg:col-span-1 bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-2xl flex flex-col gap-4" aria-label="Recent Activities Log">
            <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2962FF]" />
              <span>Recent Activity</span>
            </h3>

            <div className="relative border-l border-[#334155] ml-3 pl-5 space-y-5 text-xs text-left">
              {RECENT_ACTIVITIES.map(action => (
                <div key={action.id} className="relative">
                  <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2962FF] border border-[#1E293B]"></span>
                  <span className="text-[#94A3B8] font-mono text-[10px] block">{action.time}</span>
                  <p className="text-[#CBD5E1] mt-0.5 font-medium leading-relaxed">{action.text}</p>
                </div>
              ))}
            </div>
          </aside>

        </section>
      )}

      {/* POPUP MODALS OVERLAYS */}
      {activeModal && selectedRequest && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left text-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-4 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white capitalize flex items-center gap-1.5">
                <span>{activeModal === 'details' ? 'Request Specifications' : 'Technical Diagnostic Logs'}</span>
                <span className="text-[10px] font-mono bg-[#334155] text-[#CBD5E1] px-2 py-0.5 rounded ml-2">{selectedRequest.id}</span>
              </h3>
              <button 
                onClick={closeModal} 
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
                aria-label="Close modal specs"
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
                  <button onClick={closeModal} className="px-4 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-[11px] font-bold rounded transition cursor-pointer">Close Specs Details</button>
                </div>
              </div>
            )}

            {/* HISTORY MODAL BODY */}
            {activeModal === 'history' && (
              <div className="p-5 space-y-4">
                <div className="text-[#CBD5E1] text-[11px] bg-[#0F172A] p-2.5 rounded border border-[#334155]">
                  Job lifecycle tracking logs for <strong className="text-white">{selectedRequest.name}</strong>
                </div>

                <div className="relative border-l border-[#334155] ml-3 pl-4 space-y-4 text-xs font-medium">
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

                <div className="flex justify-end pt-3 border-t border-[#334155]/60 animate-fadeIn">
                  <button onClick={closeModal} className="px-4 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-[11px] font-bold rounded transition cursor-pointer">Close Log History</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* RAISE ISSUE MODAL */}
      {activeModal === 'raise' && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left text-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">

            {/* Modal Header */}
            <div className="bg-[#0F172A] p-4 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#2962FF]" />
                <span>Raise Maintenance Issue</span>
              </h3>
              <button
                onClick={() => { setActiveModal(null); setRaiseMessage(null); }}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
                aria-label="Close raise issue modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleRaiseIssue} className="p-5 space-y-4">
              {raiseMessage && (
                <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${raiseMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                  {raiseMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{raiseMessage.text}</span>
                </div>
              )}

              <div>
                <label htmlFor="raise_asset" className="block text-[10px] text-[#94A3B8] uppercase tracking-wider font-bold mb-1.5">Asset *</label>
                <select
                  id="raise_asset"
                  required
                  value={raiseAssetId}
                  onChange={e => setRaiseAssetId(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]"
                >
                  <option value="">Select the asset with the issue...</option>
                  {assetsList.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name} ({asset.asset_tag})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="raise_priority" className="block text-[10px] text-[#94A3B8] uppercase tracking-wider font-bold mb-1.5">Priority</label>
                <select
                  id="raise_priority"
                  value={raisePriority}
                  onChange={e => setRaisePriority(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>

              <div>
                <label htmlFor="raise_desc" className="block text-[10px] text-[#94A3B8] uppercase tracking-wider font-bold mb-1.5">Issue Description *</label>
                <textarea
                  id="raise_desc"
                  required
                  rows={4}
                  placeholder="Describe the defect, damage, or malfunction in detail..."
                  value={raiseDescription}
                  onChange={e => setRaiseDescription(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2 border-t border-[#334155]/60">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setRaiseMessage(null); }}
                  className="flex-1 px-4 py-2.5 bg-[#334155] hover:bg-[#475569] text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={raiseSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] disabled:opacity-50 text-white text-[11px] font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{raiseSubmitting ? 'Submitting...' : 'Submit Issue'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
