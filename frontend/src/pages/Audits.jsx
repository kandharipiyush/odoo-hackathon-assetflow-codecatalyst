import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  ClipboardCheck,
  Plus,
  Play,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  Search,
  XCircle,
  FileCheck
} from 'lucide-react'

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

const FALLBACK_CYCLES = [
  { id: 'ADC-101', name: 'Q3 Annual IT Asset Audit', start_date: '2026-07-01T00:00:00Z', end_date: '2026-07-30T00:00:00Z', status: 'OPEN', auditor_id: 'usr-001', audit_items: [] },
  { id: 'ADC-102', name: 'Logistics Vehicle Verification', start_date: '2026-06-15T00:00:00Z', end_date: '2026-06-25T00:00:00Z', status: 'CLOSED', auditor_id: 'usr-002', audit_items: [{ id: '1', asset: { name: 'Honda Activa Electric Scooter' }, verification_status: 'VERIFIED' }] }
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Audits() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Cycle Form State
  const [acName, setAcName] = useState('');
  const [acEndDate, setAcEndDate] = useState('');
  const [acMessage, setAcMessage] = useState(null);

  // Verification Form State
  const [viCycleId, setViCycleId] = useState('');
  const [viAssetId, setViAssetId] = useState('');
  const [viStatus, setViStatus] = useState('VERIFIED');
  const [viNotes, setViNotes] = useState('');
  const [viMessage, setViMessage] = useState(null);

  const fetchCycles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/audits/cycles`);
      setCycles(res.data?.data || FALLBACK_CYCLES);
      if (res.data?.data && res.data.data.length > 0 && !viCycleId) {
        setViCycleId(res.data.data[0].id);
      }
    } catch (err) {
      console.warn("Audit endpoint unavailable. Using fallback data.", err);
      setError("Connection failed. Showing cached records.");
      setCycles(FALLBACK_CYCLES);
      if (FALLBACK_CYCLES.length > 0 && !viCycleId) {
        setViCycleId(FALLBACK_CYCLES[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, [viCycleId]);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  // ---- NEW AUDIT CYCLE FORM ----
  const handleCreateCycle = async (e) => {
    e.preventDefault();
    if (!acName) {
      setAcMessage({ type: 'error', text: 'Audit name is required.' });
      return;
    }
    const payload = { name: acName, end_date: acEndDate || undefined };
    try {
      const res = await axios.post(`${API_BASE_URL}/audits/cycles`, payload);
      setCycles(prev => [res.data.data || { ...payload, id: `ADC-${Date.now()}`, status: 'OPEN', start_date: new Date().toISOString(), audit_items: [] }, ...prev]);
      setAcMessage({ type: 'success', text: 'Audit cycle started successfully!' });
      setAcName(''); setAcEndDate('');
    } catch (err) {
      setAcMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create audit cycle.' });
    }
  };

  // ---- VERIFY ASSET FORM ----
  const handleVerifyAsset = async (e) => {
    e.preventDefault();
    if (!viCycleId || !viAssetId || !viStatus) {
      setViMessage({ type: 'error', text: 'Cycle ID, Asset ID, and Status are required.' });
      return;
    }
    const payload = { audit_cycle_id: viCycleId, asset_id: viAssetId, verification_status: viStatus, notes: viNotes || undefined };
    try {
      const res = await axios.post(`${API_BASE_URL}/audits/items`, payload);
      // Update local state to reflect the new item
      setCycles(prev => prev.map(c => {
        if (c.id === viCycleId) {
          return { ...c, audit_items: [res.data.data || { ...payload, id: `AVI-${Date.now()}`, asset: { name: viAssetId }, verified_at: new Date().toISOString() }, ...(c.audit_items || [])] };
        }
        return c;
      }));
      setViMessage({ type: 'success', text: 'Asset verified successfully!' });
      setViAssetId(''); setViNotes('');
    } catch (err) {
      setViMessage({ type: 'error', text: err.response?.data?.message || 'Failed to verify asset.' });
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      OPEN: 'bg-green-500/15 text-green-400 border-green-500/30',
      IN_PROGRESS: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      CLOSED: 'bg-red-500/15 text-red-400 border-red-500/30',
      VERIFIED: 'bg-green-500/15 text-green-400 border-green-500/30',
      MISSING: 'bg-red-500/15 text-red-400 border-red-500/30',
      DAMAGED: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border inline-block ${styles[status] || 'bg-[#334155] text-[#94A3B8]'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased text-left">
      {/* HEADER */}
      <header className="mb-8 border-b border-[#334155] pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Asset Auditing</h1>
        <p className="text-[#CBD5E1] text-sm font-medium">
          Initiate periodic audits and reconcile physical asset inventory.
        </p>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs flex items-center justify-between gap-3 mb-6" role="alert">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchCycles} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-bold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" aria-label="Auditing Workspace">
        
        {/* FORMS COLUMN */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* START CYCLE FORM */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#334155] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]"></span>
              <span>Start New Audit Cycle</span>
            </h3>

            {acMessage && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${acMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{acMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateCycle} className="space-y-4 text-xs font-semibold">
              <div>
                <label htmlFor="ac_name" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Audit Name *</label>
                <input id="ac_name" type="text" required placeholder="e.g. Q4 Hardware Audit" value={acName} onChange={e => setAcName(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <div>
                <label htmlFor="ac_end_date" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Target Completion Date</label>
                <input id="ac_end_date" type="date" value={acEndDate} onChange={e => setAcEndDate(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <button type="submit" className="w-full px-4 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] text-white rounded-lg text-[11px] font-bold transition duration-200 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] flex items-center justify-center gap-2">
                <Play className="w-3.5 h-3.5" />
                <span>Initialize Audit</span>
              </button>
            </form>
          </div>

          {/* VERIFY ITEM FORM */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#334155] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]"></span>
              <span>Verify Asset Condition</span>
            </h3>

            {viMessage && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${viMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{viMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAsset} className="space-y-4 text-xs font-semibold">
              <div>
                <label htmlFor="vi_cycle_id" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Active Audit Cycle *</label>
                <select id="vi_cycle_id" required value={viCycleId} onChange={e => setViCycleId(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#2962FF]">
                  {cycles.filter(c => c.status !== 'CLOSED').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vi_asset_id" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Asset ID / Tag *</label>
                <input id="vi_asset_id" type="text" required placeholder="Scan or enter asset ID" value={viAssetId} onChange={e => setViAssetId(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <div>
                <label htmlFor="vi_status" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Verification Status *</label>
                <select id="vi_status" required value={viStatus} onChange={e => setViStatus(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#2962FF]">
                  <option value="VERIFIED">Verified (Present & Good)</option>
                  <option value="MISSING">Missing (Not Found)</option>
                  <option value="DAMAGED">Damaged (Requires Maintenance)</option>
                </select>
              </div>
              <div>
                <label htmlFor="vi_notes" className="block text-[#94A3B8] uppercase tracking-wider mb-1.5">Auditor Notes</label>
                <input id="vi_notes" type="text" placeholder="Condition notes" value={viNotes} onChange={e => setViNotes(e.target.value)} className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF]" />
              </div>
              <button type="submit" className="w-full px-4 py-2.5 bg-[#2962FF] hover:bg-[#0047AB] text-white rounded-lg text-[11px] font-bold transition duration-200 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] flex items-center justify-center gap-2">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Submit Verification</span>
              </button>
            </form>
          </div>

        </div>

        {/* AUDIT CYCLES FEED */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#2962FF]" />
                <span>Audit Cycles Overview</span>
              </h3>
              <button onClick={fetchCycles} className="text-[#94A3B8] hover:text-white p-1.5 rounded-lg hover:bg-[#334155] transition cursor-pointer" aria-label="Refresh audits">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="text-center py-12 text-[#94A3B8]">Loading audit cycles...</div>
              ) : cycles.length > 0 ? (
                cycles.map(cycle => (
                  <div key={cycle.id} className="bg-[#0F172A] border border-[#334155] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-bold text-white">{cycle.name}</h4>
                        <div className="text-xs text-[#94A3B8] mt-1 font-mono">ID: {cycle.id} | Auditor: {cycle.auditor_id}</div>
                      </div>
                      <StatusBadge status={cycle.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div>
                        <span className="text-[#94A3B8] uppercase block mb-1">Started</span>
                        <span className="text-[#CBD5E1] font-mono">{cycle.start_date ? new Date(cycle.start_date).toLocaleDateString() : '—'}</span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8] uppercase block mb-1">Target End</span>
                        <span className="text-[#CBD5E1] font-mono">{cycle.end_date ? new Date(cycle.end_date).toLocaleDateString() : '—'}</span>
                      </div>
                    </div>

                    <div className="border-t border-[#334155]/60 pt-4">
                      <h5 className="text-xs font-bold text-white mb-3">Recently Verified Items ({cycle.audit_items?.length || 0})</h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {cycle.audit_items && cycle.audit_items.length > 0 ? (
                          cycle.audit_items.map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center justify-between bg-[#1E293B] p-2.5 rounded-lg border border-[#334155]/60">
                              <div>
                                <div className="text-xs font-bold text-[#CBD5E1]">{item.asset?.name || item.asset_id}</div>
                                {item.notes && <div className="text-[10px] text-[#94A3B8] mt-0.5">{item.notes}</div>}
                              </div>
                              <StatusBadge status={item.verification_status} />
                            </div>
                          ))
                        ) : (
                          <div className="text-[11px] text-[#94A3B8] italic">No items verified in this cycle yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#94A3B8]">No audit cycles found.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
