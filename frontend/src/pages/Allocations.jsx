import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { api as axios } from '../services/authService'
import {
  ArrowRightLeft,
  Package,
  UserCheck,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RotateCw,
  Info,
  ChevronRight
} from 'lucide-react'

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

const FALLBACK_ALLOCATIONS = [
  { id: 'ALC-001', asset_id: 'AST-8291', asset: { name: 'MacBook Pro 16" (M3 Max)' }, allocated_to_id: 'usr-004', allocator_id: 'usr-001', status: 'ACTIVE', notes: 'Issued for Q3 project sprint', allocated_at: '2026-07-01T09:00:00Z' },
  { id: 'ALC-002', asset_id: 'AST-1204', asset: { name: 'Dell UltraSharp 32" 4K Monitor' }, allocated_to_id: 'usr-003', allocator_id: 'usr-002', status: 'ACTIVE', notes: 'Department head workstation setup', allocated_at: '2026-06-28T14:00:00Z' },
  { id: 'ALC-003', asset_id: 'AST-5521', asset: { name: 'Honda Activa Electric Scooter' }, allocated_to_id: 'usr-004', allocator_id: 'usr-001', status: 'RETURNED', notes: 'Field logistics run completed', allocated_at: '2026-06-15T08:00:00Z' }
];

const FALLBACK_TRANSFERS = [
  { id: 'TRF-001', asset_id: 'AST-3902', asset: { name: 'AI GPU Server Rack' }, target_department: { name: 'Engineering' }, status: 'PENDING', reason: 'R&D project completed, reallocating to Engineering', created_at: '2026-07-10T10:00:00Z' },
  { id: 'TRF-002', asset_id: 'AST-1204', asset: { name: 'Dell UltraSharp Monitor' }, target_department: { name: 'Product Development' }, status: 'APPROVED', reason: 'Team expansion requires additional monitors', created_at: '2026-07-08T11:30:00Z' }
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const TabButton = React.memo(({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] ${
      active
        ? 'bg-[#1E293B] text-white border-[#2962FF]'
        : 'bg-[#0F172A]/50 text-[#94A3B8] border-transparent hover:text-white hover:bg-[#1E293B]/50'
    }`}
    aria-selected={active}
    role="tab"
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
));

const StatusBadge = React.memo(({ status }) => {
  const styles = {
    ACTIVE: 'bg-[#2962FF]/15 text-[#2962FF] border-[#2962FF]/30',
    RETURNED: 'bg-[#0052CC]/15 text-[#CBD5E1] border-[#334155]',
    OVERDUE: 'bg-red-500/15 text-red-400 border-red-500/30',
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    APPROVED: 'bg-green-500/15 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/15 text-red-400 border-red-500/30'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border inline-block ${styles[status] || 'bg-[#334155] text-[#94A3B8]'}`}>
      {status}
    </span>
  );
});

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Allocations() {
  const [activeTab, setActiveTab] = useState('allocations');
  const [allocations, setAllocations] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Allocation form state
  const [alAssetId, setAlAssetId] = useState('');
  const [alEmployeeId, setAlEmployeeId] = useState('');
  const [alNotes, setAlNotes] = useState('');
  const [alReturnDate, setAlReturnDate] = useState('');
  const [alMessage, setAlMessage] = useState(null);

  // Transfer form state
  const [trAssetId, setTrAssetId] = useState('');
  const [trDeptId, setTrDeptId] = useState('');
  const [trReason, setTrReason] = useState('');
  const [trMessage, setTrMessage] = useState(null);

  // Live lookup states
  const [assetsList, setAssetsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allocRes, transferRes, assetsRes, employeesRes, deptsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/allocations`),
        axios.get(`${API_BASE_URL}/transfers`),
        axios.get(`${API_BASE_URL}/assets`),
        axios.get(`${API_BASE_URL}/org/users`),
        axios.get(`${API_BASE_URL}/org/departments`)
      ]);
      setAllocations(
        allocRes.status === 'fulfilled' && allocRes.value.data?.data
          ? allocRes.value.data.data
          : []
      );
      setTransfers(
        transferRes.status === 'fulfilled' && transferRes.value.data?.data
          ? transferRes.value.data.data
          : []
      );

      if (assetsRes.status === 'fulfilled' && assetsRes.value.data?.data) {
        setAssetsList(assetsRes.value.data.data);
      }
      if (employeesRes.status === 'fulfilled' && employeesRes.value.data?.data) {
        setEmployeesList(employeesRes.value.data.data);
      }
      if (deptsRes.status === 'fulfilled' && deptsRes.value.data?.data) {
        setDepartmentsList(deptsRes.value.data.data);
      }
    } catch (err) {
      console.warn("Endpoint unavailable. Using fallback data.", err);
      setError("Connection failed. Showing cached records.");
      setAllocations([]);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = useMemo(() => ({
    activeAllocations: allocations.filter(a => a.status === 'ACTIVE').length,
    totalAllocations: allocations.length,
    pendingTransfers: transfers.filter(t => t.status === 'PENDING').length,
    totalTransfers: transfers.length
  }), [allocations, transfers]);

  // ---- ALLOCATION FORM ----
  const handleAllocateAsset = async (e) => {
    e.preventDefault();
    if (!alAssetId || !alEmployeeId) {
      setAlMessage({ type: 'error', text: 'Asset ID and Employee ID are required.' });
      return;
    }
    const payload = {
      asset_id: alAssetId,
      allocated_to_id: alEmployeeId,
      notes: alNotes || undefined,
      expected_return_date: alReturnDate || undefined
    };
    try {
      const res = await axios.post(`${API_BASE_URL}/allocations`, payload);
      setAllocations(prev => [res.data.data || { ...payload, id: `ALC-${Date.now()}`, status: 'ACTIVE', allocated_at: new Date().toISOString(), asset: { name: alAssetId } }, ...prev]);
      setAlMessage({ type: 'success', text: 'Asset allocated successfully!' });
      setAlAssetId(''); setAlEmployeeId(''); setAlNotes(''); setAlReturnDate('');
    } catch (err) {
      setAlMessage({ type: 'error', text: err.response?.data?.message || 'Allocation failed.' });
    }
  };

  // ---- TRANSFER FORM ----
  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    if (!trAssetId || !trDeptId) {
      setTrMessage({ type: 'error', text: 'Asset ID and Target Department ID are required.' });
      return;
    }
    const payload = { asset_id: trAssetId, target_department_id: trDeptId, reason: trReason || undefined };
    try {
      const res = await axios.post(`${API_BASE_URL}/transfers`, payload);
      setTransfers(prev => [res.data.data || { ...payload, id: `TRF-${Date.now()}`, status: 'PENDING', created_at: new Date().toISOString(), asset: { name: trAssetId }, target_department: { name: trDeptId } }, ...prev]);
      setTrMessage({ type: 'success', text: 'Transfer request submitted!' });
      setTrAssetId(''); setTrDeptId(''); setTrReason('');
    } catch (err) {
      setTrMessage({ type: 'error', text: err.response?.data?.message || 'Transfer request failed.' });
    }
  };

  // ---- TRANSFER ACTION ----
  const handleTransferAction = async (transferId, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/transfers/${transferId}/action`, { status });
      setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status } : t));
    } catch (err) {
      console.warn("Action failed, updating locally.", err);
      setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status } : t));
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased text-left">
      {/* HEADER */}
      <header className="mb-8 border-b border-[#334155] pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Asset Allocation & Transfer</h1>
        <p className="text-[#CBD5E1] text-sm font-medium">
          Assign assets to employees and manage inter-department transfer requests.
        </p>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs flex items-center justify-between gap-3 mb-6" role="alert">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-bold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8" aria-label="Summary Statistics">
        <div className="bg-[#0052CC] rounded-xl p-5 shadow-lg border border-[#334155] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-white/10 p-3 rounded-lg text-white"><Package className="w-6 h-6" /></div>
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-wider block">Active Allocations</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.activeAllocations}</h3>
          <p className="text-white/60 text-xs mt-3">Currently deployed assets</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg border border-[#334155] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-blue-500/10 p-3 rounded-lg text-blue-400"><UserCheck className="w-6 h-6" /></div>
          <span className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider block">Total Allocations</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.totalAllocations}</h3>
          <p className="text-[#CBD5E1] text-xs mt-3">All-time allocation records</p>
        </div>
        <div className="bg-[#0F52BA] rounded-xl p-5 shadow-[0_0_20px_rgba(41,98,255,0.4)] border border-[#2962FF] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-white/10 p-3 rounded-lg text-white"><Clock className="w-6 h-6 animate-pulse" /></div>
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-wider block">Pending Transfers</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.pendingTransfers}</h3>
          <p className="text-white/60 text-xs mt-3">Awaiting approval decision</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg border border-[#334155] relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-blue-500/10 p-3 rounded-lg text-blue-400"><ArrowRightLeft className="w-6 h-6" /></div>
          <span className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider block">Total Transfers</span>
          <h3 className="text-3xl font-black text-white mt-1 leading-none">{stats.totalTransfers}</h3>
          <p className="text-[#CBD5E1] text-xs mt-3">Inter-department move requests</p>
        </div>
      </section>

      {/* TAB SWITCHER */}
      <div className="flex gap-1 mb-0 border-b border-[#334155]" role="tablist">
        <TabButton label="Allocations" icon={Package} active={activeTab === 'allocations'} onClick={() => setActiveTab('allocations')} />
        <TabButton label="Transfers" icon={ArrowRightLeft} active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} />
      </div>

      {/* ============ ALLOCATIONS TAB ============ */}
      {activeTab === 'allocations' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 items-start" aria-label="Allocations Workspace">

          {/* ALLOCATION FORM */}
          <div className="lg:col-span-1 bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#334155] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]"></span>
              <span>Allocate Asset</span>
            </h3>

            {alMessage && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${alMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`} role="status">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{alMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleAllocateAsset} className="space-y-4 text-xs font-semibold">
               <div>
                 <label htmlFor="al_asset_id" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Asset *</label>
                 <select
                   id="al_asset_id"
                   required
                   value={alAssetId}
                   onChange={e => setAlAssetId(e.target.value)}
                   className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]"
                 >
                   <option value="">Select Asset...</option>
                   {assetsList.filter(a => a.status === 'AVAILABLE').map(asset => (
                     <option key={asset.id} value={asset.id}>{asset.name} ({asset.asset_tag})</option>
                   ))}
                 </select>
               </div>
               <div>
                 <label htmlFor="al_employee_id" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Employee *</label>
                 <select
                   id="al_employee_id"
                   required
                   value={alEmployeeId}
                   onChange={e => setAlEmployeeId(e.target.value)}
                   className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]"
                 >
                   <option value="">Select Employee...</option>
                   {employeesList.map(emp => (
                     <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                   ))}
                 </select>
               </div>
              <div>
                <label htmlFor="al_return_date" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Expected Return Date</label>
                <input id="al_return_date" type="date" value={alReturnDate} onChange={e => setAlReturnDate(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <div>
                <label htmlFor="al_notes" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Notes</label>
                <input id="al_notes" type="text" placeholder="Optional allocation notes" value={alNotes} onChange={e => setAlNotes(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <button type="submit" className="w-full px-4 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] text-white rounded-lg text-[11px] font-bold transition duration-200 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Deploy Allocation</span>
              </button>
            </form>
          </div>

          {/* ALLOCATION TABLE */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#2962FF]" />
                <span>Active Deployments</span>
              </h3>
              <button onClick={fetchData} className="text-[#94A3B8] hover:text-white p-1.5 rounded-lg hover:bg-[#334155] transition cursor-pointer" aria-label="Refresh allocations">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0F172A]/75 border-b border-[#334155]">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Asset</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Assigned To</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Date</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Notes</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60 text-xs">
                  {loading ? (
                    <tr><td colSpan="5" className="py-12 text-center text-[#94A3B8]">Loading allocation records...</td></tr>
                  ) : allocations.length > 0 ? (
                    allocations.map(alloc => (
                      <tr key={alloc.id} className="hover:bg-[#0f172a]/20 transition-all duration-150">
                        <td className="px-6 py-4 font-bold text-white">{alloc.asset?.name || alloc.asset_id}</td>
                         <td className="px-6 py-4 font-mono text-[#CBD5E1]">{alloc.allocated_to?.name || alloc.allocated_to_id}</td>
                        <td className="px-6 py-4 font-mono text-[#CBD5E1]">{alloc.allocated_at ? new Date(alloc.allocated_at).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-4 text-[#CBD5E1] max-w-[200px] truncate" title={alloc.notes}>{alloc.notes || '—'}</td>
                        <td className="px-6 py-4 text-center"><StatusBadge status={alloc.status} /></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="py-12 text-center text-[#94A3B8]">No allocation records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ============ TRANSFERS TAB ============ */}
      {activeTab === 'transfers' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 items-start" aria-label="Transfers Workspace">

          {/* TRANSFER FORM */}
          <div className="lg:col-span-1 bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#334155] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]"></span>
              <span>Request Transfer</span>
            </h3>

            {trMessage && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${trMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`} role="status">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{trMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs font-semibold">
              <div>
                 <label htmlFor="tr_asset_id" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Asset *</label>
                 <select
                   id="tr_asset_id"
                   required
                   value={trAssetId}
                   onChange={e => setTrAssetId(e.target.value)}
                   className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]"
                 >
                   <option value="">Select Asset...</option>
                   {assetsList.map(asset => (
                     <option key={asset.id} value={asset.id}>{asset.name} ({asset.asset_tag})</option>
                   ))}
                 </select>
               </div>
               <div>
                 <label htmlFor="tr_dept_id" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Target Department *</label>
                 <select
                   id="tr_dept_id"
                   required
                   value={trDeptId}
                   onChange={e => setTrDeptId(e.target.value)}
                   className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]"
                 >
                   <option value="">Select Target Department...</option>
                   {departmentsList.map(dept => (
                     <option key={dept.id} value={dept.id}>{dept.name}</option>
                   ))}
                 </select>
               </div>
              <div>
                <label htmlFor="tr_reason" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Reason</label>
                <input id="tr_reason" type="text" placeholder="Reason for transfer" value={trReason} onChange={e => setTrReason(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <button type="submit" className="w-full px-4 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] text-white rounded-lg text-[11px] font-bold transition duration-200 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Transfer Request</span>
              </button>
            </form>
          </div>

          {/* TRANSFER REQUESTS TABLE */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#2962FF]" />
                <span>Transfer Requests</span>
              </h3>
              <button onClick={fetchData} className="text-[#94A3B8] hover:text-white p-1.5 rounded-lg hover:bg-[#334155] transition cursor-pointer" aria-label="Refresh transfers">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0F172A]/75 border-b border-[#334155]">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Asset</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Target Dept</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Reason</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] text-center">Status</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60 text-xs">
                  {loading ? (
                    <tr><td colSpan="5" className="py-12 text-center text-[#94A3B8]">Loading transfer records...</td></tr>
                  ) : transfers.length > 0 ? (
                    transfers.map(tr => (
                      <tr key={tr.id} className="hover:bg-[#0f172a]/20 transition-all duration-150">
                        <td className="px-6 py-4 font-bold text-white">{tr.asset?.name || tr.asset_id}</td>
                        <td className="px-6 py-4 text-[#CBD5E1]">{tr.target_department?.name || tr.target_department_id}</td>
                        <td className="px-6 py-4 text-[#CBD5E1] max-w-[200px] truncate" title={tr.reason}>{tr.reason || '—'}</td>
                        <td className="px-6 py-4 text-center"><StatusBadge status={tr.status} /></td>
                        <td className="px-6 py-4 text-center">
                          {tr.status === 'PENDING' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleTransferAction(tr.id, 'APPROVED')} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition cursor-pointer" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleTransferAction(tr.id, 'REJECTED')} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#94A3B8] text-[10px]">Actioned</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="py-12 text-center text-[#94A3B8]">No transfer requests found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
