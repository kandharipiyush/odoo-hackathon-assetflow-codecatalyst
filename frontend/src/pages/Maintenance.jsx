import React, { useState, useMemo } from 'react'
import {
  Wrench,
  AlertTriangle,
  DollarSign,
  Plus,
  ArrowRight,
  CheckCircle,
  X,
  ChevronDown,
  User,
  Activity,
  Search
} from 'lucide-react'

// Dummy Data
const ASSETS_LIST = [
  { id: 'AST-2026-001', name: 'MacBook Pro 16" (M3 Max)' },
  { id: 'AST-2026-003', name: 'Ergonomic Office Chair' },
  { id: 'AST-2026-004', name: 'Fleet Tesla Model 3' },
  { id: 'AST-2026-007', name: 'Standing Desk XL' },
  { id: 'AST-2026-009', name: 'Fleet Delivery Van' },
  { id: 'AST-2026-011', name: 'Server Rack UPS 3kVA' }
];

const INITIAL_REQUESTS = [
  {
    id: 'MNT-401',
    title: 'Tesla Model 3 Brake Calliper Clicking',
    assetId: 'AST-2026-004',
    assetName: 'Fleet Tesla Model 3',
    priority: 'Emergency',
    type: 'Corrective',
    status: 'In Progress',
    description: 'Brakes are clicking when applying medium pressure on front wheel side.',
    reporter: 'Sunil Gavaskar',
    technician: 'Rajesh Kumar',
    estimatedCost: 850,
    createdDate: '2026-07-10'
  },
  {
    id: 'MNT-402',
    title: 'Routine Server Room UPS Battery Cycle',
    assetId: 'AST-2026-011',
    assetName: 'Server Rack UPS 3kVA',
    priority: 'Medium',
    type: 'Preventive',
    status: 'Scheduled',
    description: 'Scheduled preventive discharge test and battery level check.',
    reporter: 'Admin System',
    technician: 'Vikram Seth',
    estimatedCost: 150,
    createdDate: '2026-07-12'
  },
  {
    id: 'MNT-403',
    title: 'Office Chair Hydraulic Leak',
    assetId: 'AST-2026-003',
    assetName: 'Ergonomic Office Chair',
    priority: 'Low',
    type: 'Corrective',
    status: 'Pending Approval',
    description: 'The height adjustment lever sinks over time.',
    reporter: 'Ananya Sen',
    technician: 'Unassigned',
    estimatedCost: 45,
    createdDate: '2026-07-11'
  },
  {
    id: 'MNT-404',
    title: 'Delivery Van Oil Filter replacement',
    assetId: 'AST-2026-009',
    assetName: 'Fleet Delivery Van',
    priority: 'High',
    type: 'Preventive',
    status: 'Under Verification',
    description: '15,000 km oil change and filter replacement finished.',
    reporter: 'Sunil Gavaskar',
    technician: 'Rajesh Kumar',
    estimatedCost: 220,
    createdDate: '2026-07-09'
  },
  {
    id: 'MNT-405',
    title: 'MacBook Keyboard Sticky Keys',
    assetId: 'AST-2026-001',
    assetName: 'MacBook Pro 16" (M3 Max)',
    priority: 'Low',
    type: 'Corrective',
    status: 'Completed',
    description: 'E and R keys were sticky. Cleaned assembly under cap.',
    reporter: 'Rohit Sharma',
    technician: 'Vikram Seth',
    estimatedCost: 0,
    createdDate: '2026-07-05'
  }
];

export default function Maintenance() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Request Form State
  const [formData, setFormData] = useState({
    assetId: 'AST-2026-004',
    title: '',
    description: '',
    priority: 'Medium',
    type: 'Corrective',
    technician: 'Vikram Seth',
    estimatedCost: ''
  });

  // Unique status columns
  const COLUMNS = [
    { title: 'Pending Approval', status: 'Pending Approval', bg: 'border-t-yellow-500' },
    { title: 'Scheduled', status: 'Scheduled', bg: 'border-t-[#007FFF]' },
    { title: 'In Progress', status: 'In Progress', bg: 'border-t-[#2962FF]' },
    { title: 'Under Verification', status: 'Under Verification', bg: 'border-t-[#2D68C4]' },
    { title: 'Completed', status: 'Completed', bg: 'border-t-[#0052CC]' }
  ];

  // Shift status helper
  const handleShiftStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          // If moving to completed, set actual cost if needed
          return {
            ...r,
            status: newStatus,
            technician: r.technician === 'Unassigned' ? 'Vikram Seth' : r.technician
          };
        }
        return r;
      })
    );
  };

  // Quick Action: Delete Request
  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to dismiss this request?')) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };

  // Submit Request
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill out all fields.');
      return;
    }

    const matchedAsset = ASSETS_LIST.find((a) => a.id === formData.assetId);

    const newRequestObj = {
      id: `MNT-${Date.now().toString().slice(-3)}`,
      title: formData.title,
      assetId: formData.assetId,
      assetName: matchedAsset?.name || 'Unknown Asset',
      priority: formData.priority,
      type: formData.type,
      status: 'Pending Approval',
      description: formData.description,
      reporter: 'Piyush Kandhari (Product)',
      technician: formData.technician,
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setRequests((prev) => [newRequestObj, ...prev]);
    setIsNewRequestOpen(false);

    // Reset Form
    setFormData({
      assetId: 'AST-2026-004',
      title: '',
      description: '',
      priority: 'Medium',
      type: 'Corrective',
      technician: 'Vikram Seth',
      estimatedCost: ''
    });
  };

  // Priority color styling
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Emergency':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'High':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Medium':
        return 'bg-[#2962FF]/10 text-accent-blue border-[#2962FF]/30';
      case 'Low':
        return 'bg-slate-700/20 text-slate-300 border-slate-700/35';
      default:
        return 'text-slate-300';
    }
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reporter.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [requests, searchQuery, priorityFilter]);

  // Statistics
  const stats = useMemo(() => {
    const activeRequests = requests.filter((r) => r.status !== 'Completed').length;
    const completedVal = requests.filter((r) => r.status === 'Completed').length;
    const mttr = '4.2 hrs'; // Mock statistics
    const totalExpenses = requests.reduce((sum, item) => sum + item.estimatedCost, 0);

    return {
      activeRequests,
      completedVal,
      mttr,
      totalExpenses
    };
  }, [requests]);

  return (
    <div className="min-h-screen bg-custom-bg text-text-primary p-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-card-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-left">Maintenance request management</h1>
          <p className="text-text-secondary text-sm text-left">
            Create, track, and authorize maintenance routines or corrective breakdowns requests.
          </p>
        </div>
        <button
          onClick={() => setIsNewRequestOpen(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-primary-brand hover:bg-hover-blue text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-primary-brand/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>New Maintenance Request</span>
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-primary-brand/10 p-3 rounded-lg text-primary-brand">
            <Wrench className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Mean Time to Repair</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.mttr}</h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Target under SLA metrics (6.0 hrs limit)</p>
        </div>

        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-[#007FFF]/10 p-3 rounded-lg text-[#007FFF]">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Active Requests</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.activeRequests}</h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Awaiting repair execution stages</p>
        </div>

        <div className="bg-surface-card border-card-highlight border border-l-4 p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-premium-ai/20 p-3 rounded-lg text-accent-blue">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Maintenance Expenses</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">
            ${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Rolling cost of active/completed tasks</p>
        </div>

        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-yellow-500/10 p-3 rounded-lg text-yellow-500">
            <AlertTriangle className="w-6 h-6 animate-none" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Compliance Target</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">88%</h3>
          <p className="text-yellow-500 text-xs mt-2 text-left flex items-center gap-1 font-semibold">
            <span>Critical checklists complete</span>
          </p>
        </div>
      </div>

      {/* Kanban Board Toolbar Filter */}
      <div className="bg-surface-card border border-card-border rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-text-muted" />
          </span>
          <input
            type="text"
            placeholder="Search request cards by ID, description, asset, or engineer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-custom-bg border border-card-border rounded-xl text-sm focus:outline-none focus:border-primary-brand text-text-primary font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-muted uppercase">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-custom-bg border border-card-border rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none pr-8 relative font-semibold"
          >
            <option value="All">All Priorities</option>
            <option value="Emergency">Emergency Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Panel Multi-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch overflow-x-auto min-h-[500px]">
        {COLUMNS.map((col) => {
          const colRequests = filteredRequests.filter((r) => r.status === col.status);
          return (
            <div
              key={col.status}
              className="bg-surface-card/65 rounded-xl border border-card-border/70 p-4 flex flex-col gap-4 min-w-[250px]"
            >
              {/* Column Header Title */}
              <div className={`border-t-4 ${col.bg} pt-3 flex items-center justify-between`}>
                <h4 className="font-bold text-sm text-text-primary tracking-wide text-left">{col.title}</h4>
                <span className="bg-custom-bg/90 border border-card-border text-xs px-2 py-0.5 rounded-full font-mono text-text-muted font-bold">
                  {colRequests.length}
                </span>
              </div>

              {/* Column Cards Container list */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {colRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-surface-card border border-card-border rounded-xl p-4 shadow-md transition-all duration-200 hover:border-[#007FFF]/55 hover:shadow-lg relative group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-text-muted">{req.id}</span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
                          req.priority
                        )}`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    <h5 className="font-bold text-text-primary text-[14px] leading-snug group-hover:text-primary-brand text-left">
                      {req.title}
                    </h5>

                    <p className="text-text-secondary text-xs mt-2 line-clamp-2 text-left leading-relaxed">
                      {req.description}
                    </p>

                    <div className="border-t border-card-border/55 mt-4 pt-3 space-y-1.5 text-[11px] text-text-muted">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-secondary">Asset:</span>
                        <span className="font-mono truncate max-w-[120px]" title={req.assetName}>
                          {req.assetName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-secondary">Technician:</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-accent-blue" />
                          <span>{req.technician}</span>
                        </span>
                      </div>
                      {req.estimatedCost > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-text-secondary">Est. Cost:</span>
                          <span className="font-semibold text-white font-mono">${req.estimatedCost}</span>
                        </div>
                      )}
                    </div>

                    {/* Column Stage shifting actions */}
                    <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-card-border/30">
                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        className="text-text-muted hover:text-red-500 text-[10px] font-medium"
                      >
                        Dismiss
                      </button>

                      <div className="flex gap-1.5">
                        {req.status === 'Pending Approval' && (
                          <button
                            onClick={() => handleShiftStatus(req.id, 'Scheduled')}
                            className="bg-[#2962FF] hover:bg-hover-blue text-white text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <span>Approve</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {req.status === 'Scheduled' && (
                          <button
                            onClick={() => handleShiftStatus(req.id, 'In Progress')}
                            className="bg-[#007FFF]/90 hover:bg-[#007FFF] text-white text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <span>Repair</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {req.status === 'In Progress' && (
                          <button
                            onClick={() => handleShiftStatus(req.id, 'Under Verification')}
                            className="bg-[#2D68C4] hover:bg-hover-blue text-white text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <span>Verify</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {req.status === 'Under Verification' && (
                          <button
                            onClick={() => handleShiftStatus(req.id, 'Completed')}
                            className="bg-[#0052CC] hover:bg-[#0047AB] text-white text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <span>Complete</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {req.status === 'Completed' && (
                          <span className="text-[10px] text-green-500 font-semibold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" /> Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colRequests.length === 0 && (
                  <div className="py-12 border border-dashed border-card-border/50 rounded-xl text-center text-text-muted/65 text-xs">
                    No requests in column.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW REQUEST MODAL */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-surface-card border border-card-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-custom-bg p-5 border-b border-card-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary-brand" />
                <span>Submit Asset Maintenance Request</span>
              </h3>
              <button
                onClick={() => setIsNewRequestOpen(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Select Asset to service *</label>
                  <div className="relative">
                    <select
                      value={formData.assetId}
                      onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      {ASSETS_LIST.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.id})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Request Brief Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken hydraulic pump or oil filter change"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Description & Details *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Provide full description of the defect, symptoms, or preventive checklist..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Maintenance Category</label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      <option value="Corrective">Corrective (Breakdown)</option>
                      <option value="Preventive">Preventive Routine</option>
                      <option value="Routine">Routine Service Audit</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Severity priority *</label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Assign Specialist Technician</label>
                  <div className="relative">
                    <select
                      value={formData.technician}
                      onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      <option value="Vikram Seth">Vikram Seth (IT/Electronics)</option>
                      <option value="Rajesh Kumar">Rajesh Kumar (Automotive/Mech)</option>
                      <option value="Priya Patil">Priya Patil (Facilities)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Estimated Budget Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 250"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>
              </div>

              {/* Form Buttons controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="bg-card-border hover:bg-slate-700 text-text-secondary text-sm font-medium py-2 px-4 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-brand hover:bg-hover-blue text-white text-sm font-medium py-2 px-5 rounded-xl shadow-lg transition duration-200 cursor-pointer"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
