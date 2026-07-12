import React, { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Filter,
  MapPin,
  DollarSign,
  User,
  AlertTriangle,
  X,
  ChevronDown,
  Trash2,
  Wrench,
  ArrowUpDown,
  Boxes,
  Activity
} from 'lucide-react'

// Dummy Data
const INITIAL_ASSETS = [
  {
    id: 'AST-2026-001',
    name: 'MacBook Pro 16" (M3 Max)',
    serialNumber: 'SN-MBP9823412',
    category: 'IT Equipment',
    purchaseDate: '2026-02-15',
    value: 3499,
    location: 'Mumbai HQ - 4th Floor',
    status: 'Allocated',
    assignee: 'Rohit Sharma',
    department: 'Engineering'
  },
  {
    id: 'AST-2026-002',
    name: 'Dell UltraSharp 32" Monitor',
    serialNumber: 'SN-DEL3290182',
    category: 'IT Equipment',
    purchaseDate: '2026-03-01',
    value: 899,
    location: 'Delhi Branch',
    status: 'Available',
    assignee: '',
    department: ''
  },
  {
    id: 'AST-2026-003',
    name: 'Ergonomic Office Chair',
    serialNumber: 'SN-CHR4829310',
    category: 'Office Furniture',
    purchaseDate: '2025-11-10',
    value: 450,
    location: 'Mumbai HQ - 2nd Floor',
    status: 'Allocated',
    assignee: 'Ananya Sen',
    department: 'Human Resources'
  },
  {
    id: 'AST-2026-004',
    name: 'Fleet Tesla Model 3',
    serialNumber: 'SN-TSL7729104',
    category: 'Vehicles',
    purchaseDate: '2025-08-20',
    value: 42000,
    location: 'Bangalore Tech Park',
    status: 'Under Maintenance',
    assignee: '',
    department: ''
  },
  {
    id: 'AST-2026-005',
    name: 'iPad Pro 12.9"',
    serialNumber: 'SN-IPD0928131',
    category: 'IT Equipment',
    purchaseDate: '2026-01-10',
    value: 1099,
    location: 'Mumbai HQ - 4th Floor',
    status: 'Reserved',
    assignee: 'Karan Johar',
    department: 'Product font-medium'
  },
  {
    id: 'AST-2026-006',
    name: 'Conference Room Projector',
    serialNumber: 'SN-PRJ5491028',
    category: 'IT Equipment',
    purchaseDate: '2025-09-05',
    value: 1200,
    location: 'Pune Office',
    status: 'Available',
    assignee: '',
    department: ''
  },
  {
    id: 'AST-2026-007',
    name: 'Standing Desk XL',
    serialNumber: 'SN-DSK8290132',
    category: 'Office Furniture',
    purchaseDate: '2025-12-18',
    value: 650,
    location: 'Delhi Branch',
    status: 'Allocated',
    assignee: 'Priya Patel',
    department: 'Finance'
  },
  {
    id: 'AST-2026-008',
    name: 'Cisco Router ISR4331',
    serialNumber: 'SN-CSC1104829',
    category: 'IT Equipment',
    purchaseDate: '2024-05-14',
    value: 2500,
    location: 'Noida Data Center',
    status: 'Retired',
    assignee: '',
    department: ''
  },
  {
    id: 'AST-2026-009',
    name: 'Fleet Delivery Van',
    serialNumber: 'SN-VAN8839201',
    category: 'Vehicles',
    purchaseDate: '2025-06-30',
    value: 32000,
    location: 'Kolkata Hub',
    status: 'Allocated',
    assignee: 'Sunil Gavaskar',
    department: 'Logistics'
  },
  {
    id: 'AST-2026-010',
    name: 'Heavy Duty Toolbox',
    serialNumber: 'SN-TLX9018239',
    category: 'Facility Tools',
    purchaseDate: '2026-04-05',
    value: 250,
    location: 'Pune Office',
    status: 'Available',
    assignee: '',
    department: ''
  },
  {
    id: 'AST-2026-011',
    name: 'Server Rack UPS 3kVA',
    serialNumber: 'SN-UPS5539201',
    category: 'IT Equipment',
    purchaseDate: '2025-02-28',
    value: 1800,
    location: 'Mumbai HQ - Server Room',
    status: 'Under Maintenance',
    assignee: '',
    department: ''
  }
];

const INITIAL_LOGS = [
  { id: 1, action: 'Asset Registered', asset: 'Heavy Duty Toolbox (AST-2026-010)', user: 'Admin', time: '2 hours ago' },
  { id: 2, action: 'Status Changed to Maintenance', asset: 'Fleet Tesla Model 3 (AST-2026-004)', user: 'Maint. Manager', time: '5 hours ago' },
  { id: 3, action: 'Asset Allocated', asset: 'MacBook Pro 16" (AST-2026-001)', user: 'HR System', time: '1 day ago' },
  { id: 4, action: 'Status Changed to Reserved', asset: 'iPad Pro 12.9" (AST-2026-005)', user: 'Karan Johar', time: '2 days ago' }
];

export default function AssetDirectory() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Sorting
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [selectedAssetForAllocation, setSelectedAssetForAllocation] = useState(null);

  // Register Form State
  const [newAsset, setNewAsset] = useState({
    name: '',
    serialNumber: '',
    category: 'IT Equipment',
    purchaseDate: new Date().toISOString().split('T')[0],
    value: '',
    location: 'Mumbai HQ - 4th Floor',
    status: 'Available',
    assignee: '',
    department: ''
  });

  // Allocation Form State
  const [allocationForm, setAllocationForm] = useState({
    assignee: '',
    department: 'Engineering'
  });

  // Unique Categories/Locations for select box
  const locations = useMemo(() => {
    return ['All', ...new Set(assets.map(a => a.location.split(' - ')[0]))];
  }, [assets]);

  const categories = ['All', 'IT Equipment', 'Office Furniture', 'Vehicles', 'Facility Tools'];
  const statuses = ['All', 'Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Retired'];

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.assignee.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
        const matchesLocation =
          locationFilter === 'All' || asset.location.startsWith(locationFilter);

        return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
      });
  }, [assets, searchQuery, categoryFilter, statusFilter, locationFilter, sortField, sortDirection]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = assets.length;
    const totalVal = assets.reduce((sum, item) => sum + Number(item.value || 0), 0);
    const allocatedCount = assets.filter((a) => a.status === 'Allocated').length;
    const activeMaintCount = assets.filter((a) => a.status === 'Under Maintenance').length;

    return {
      totalCount,
      totalVal,
      allocatedCount,
      activeMaintCount,
      allocationRate: totalCount ? Math.round((allocatedCount / totalCount) * 100) : 0
    };
  }, [assets]);

  // Handle Register submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber || !newAsset.value) {
      alert('Please fill in all required fields');
      return;
    }

    const nextId = `AST-2026-${String(assets.length + 1).padStart(3, '0')}`;
    const registeredAsset = {
      ...newAsset,
      id: nextId,
      value: parseFloat(newAsset.value)
    };

    setAssets((prev) => [registeredAsset, ...prev]);
    setLogs((prev) => [
      {
        id: Date.now(),
        action: 'Asset Registered',
        asset: `${registeredAsset.name} (${registeredAsset.id})`,
        user: 'Admin',
        time: 'Just now'
      },
      ...prev
    ]);

    // Reset Form
    setNewAsset({
      name: '',
      serialNumber: '',
      category: 'IT Equipment',
      purchaseDate: new Date().toISOString().split('T')[0],
      value: '',
      location: 'Mumbai HQ - 4th Floor',
      status: 'Available',
      assignee: '',
      department: ''
    });
    setIsRegisterOpen(false);
  };

  // Open Allocation Modal
  const openAllocation = (asset) => {
    setSelectedAssetForAllocation(asset);
    setAllocationForm({ assignee: '', department: 'Engineering' });
    setIsAllocateOpen(true);
  };

  // Handle Allocation Submit
  const handleAllocationSubmit = (e) => {
    e.preventDefault();
    if (!allocationForm.assignee) {
      alert('Please provide an Employee Name.');
      return;
    }

    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAssetForAllocation.id
          ? {
              ...a,
              status: 'Allocated',
              assignee: allocationForm.assignee,
              department: allocationForm.department
            }
          : a
      )
    );

    setLogs((prev) => [
      {
        id: Date.now(),
        action: 'Asset Allocated',
        asset: `${selectedAssetForAllocation.name} (${selectedAssetForAllocation.id})`,
        user: 'Asset Manager',
        time: 'Just now'
      },
      ...prev
    ]);

    setIsAllocateOpen(false);
    setSelectedAssetForAllocation(null);
  };

  // Quick Action: Send to Maintenance
  const handleSendToMaintenance = (assetId) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, status: 'Under Maintenance', assignee: '', department: '' } : a))
    );
    const targetAsset = assets.find((a) => a.id === assetId);
    setLogs((prev) => [
      {
        id: Date.now(),
        action: 'Status Changed to Maintenance',
        asset: `${targetAsset.name} (${targetAsset.id})`,
        user: 'Asset Manager',
        time: 'Just now'
      },
      ...prev
    ]);
  };

  // Quick Action: Retire Asset
  const handleRetireAsset = (assetId) => {
    if (window.confirm('Are you sure you want to retire this asset?')) {
      setAssets((prev) =>
        prev.map((a) => (a.id === assetId ? { ...a, status: 'Retired', assignee: '', department: '' } : a))
      );
      const targetAsset = assets.find((a) => a.id === assetId);
      setLogs((prev) => [
        {
          id: Date.now(),
          action: 'Asset Retired',
          asset: `${targetAsset.name} (${targetAsset.id})`,
          user: 'Asset Manager',
          time: 'Just now'
        },
        ...prev
      ]);
    }
  };

  // Quick Action: Return Asset (Make Available)
  const handleReturnAsset = (assetId) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, status: 'Available', assignee: '', department: '' } : a
      )
    );
    const targetAsset = assets.find((a) => a.id === assetId);
    setLogs((prev) => [
      {
        id: Date.now(),
        action: 'Asset Returned (Available)',
        asset: `${targetAsset.name} (${targetAsset.id})`,
        user: 'HR System',
        time: 'Just now'
      },
      ...prev
    ]);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-notification-blue/10 text-notification-blue border-notification-blue/30';
      case 'Allocated':
        return 'bg-primary-brand/10 text-accent-blue border-primary-brand/30';
      case 'Reserved':
        return 'bg-progress-charts/10 text-progress-charts border-progress-charts/30';
      case 'Under Maintenance':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Retired':
        return 'bg-slate-700/10 text-text-muted border-slate-700/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-custom-bg text-text-primary p-6 font-sans">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-card-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-left">Asset Directory</h1>
          <p className="text-text-secondary text-sm text-left">
            Centralized registry for enterprise assets lifecycle tracking, allocation, and audit.
          </p>
        </div>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-primary-brand hover:bg-hover-blue text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-primary-brand/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition-all duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-primary-brand/10 p-3 rounded-lg text-primary-brand">
            <Boxes className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Total Registered Assets</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.totalCount}</h3>
          <p className="text-text-secondary text-xs mt-2 text-left">All categories monitored</p>
        </div>

        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition-all duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-accent-blue/10 p-3 rounded-lg text-accent-blue">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Total Valuation</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">
            ${stats.totalVal.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </h3>
          <p className="text-text-secondary text-xs mt-2 text-left">Capital asset investment value</p>
        </div>

        <div className="bg-surface-card border border-card-border p-6 rounded-xl shadow-lg relative overflow-hidden transition-all duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-progress-charts/10 p-3 rounded-lg text-progress-charts">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Active Allocation Rate</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.allocationRate}%</h3>
          <div className="w-full bg-card-border h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-progress-charts h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.allocationRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-surface-card border border-card-border border-l-4 border-l-primary-brand p-6 rounded-xl shadow-lg relative overflow-hidden transition-all duration-200 hover:-translate-y-1">
          <div className="absolute right-4 top-4 bg-premium-ai/20 p-3 rounded-lg text-premium-ai animate-pulse">
            <Wrench className="w-6 h-6 text-accent-blue" />
          </div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider text-left">Under Maintenance</p>
          <h3 className="text-3xl font-bold mt-2 text-left text-white">{stats.activeMaintCount}</h3>
          <p className="text-accent-blue text-xs mt-2 text-left flex items-center gap-1 font-semibold">
            <span>Requires urgent review</span>
          </p>
        </div>
      </div>

      {/* Main Core View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side Filter Module & Recent Activity Logs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Advanced Filter Card */}
          <div className="bg-surface-card border border-card-border rounded-xl p-5 shadow-lg">
            <h3 className="font-semibold text-lg border-b border-card-border pb-3 mb-4 text-left flex items-center gap-2">
              <Filter className="w-5 h-5 text-accent-blue" />
              <span>Filters</span>
            </h3>

            {/* Category Select */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 text-left">Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Status Select */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 text-left">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Location Select */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-text-muted mb-2 text-left">Location</label>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('All');
                setLocationFilter('All');
                setSearchQuery('');
              }}
              className="w-full bg-card-border hover:bg-slate-700 text-text-secondary text-sm font-medium py-2 rounded-xl border border-transparent hover:border-card-border transition-all duration-200 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>

          {/* Activity Log Summary Card */}
          <div className="bg-surface-card border border-card-border rounded-xl p-5 shadow-lg flex-1">
            <h3 className="font-semibold text-lg border-b border-card-border pb-3 mb-4 text-left flex items-center gap-2">
              <Activity className="w-5 h-5 text-notification-blue" />
              <span>Activity Log</span>
            </h3>

            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border-b border-card-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-text-primary text-left leading-snug">{log.action}</p>
                    <span className="text-[10px] text-text-muted whitespace-nowrap">{log.time}</span>
                  </div>
                  <p className="text-xs text-text-secondary text-left mt-1 font-mono break-all">{log.asset}</p>
                  <p className="text-[10px] text-text-muted text-left mt-0.5">By: {log.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Table / Interactive Assets List Grid */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Directory Toolbar */}
          <div className="bg-surface-card border border-card-border rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-text-muted" />
              </span>
              <input
                type="text"
                placeholder="Search by ID, asset name, serial, or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-custom-bg border border-card-border rounded-xl text-sm focus:outline-none focus:border-primary-brand text-text-primary"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-muted uppercase">Sorted By:</span>
              <span className="text-xs text-text-secondary bg-custom-bg border border-card-border px-3 py-1.5 rounded-lg flex items-center gap-1">
                <span className="capitalize font-semibold">{sortField === 'id' ? 'Asset ID' : sortField}</span>
                <span className="uppercase text-[9px] text-[#007FFF] font-bold">({sortDirection})</span>
              </span>
            </div>
          </div>

          {/* Data Grid Component */}
          <div className="bg-surface-card border border-card-border rounded-xl shadow-lg overflow-hidden flex-1">
            <div className="overflow-x-auto border-0">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-custom-bg border-b border-card-border text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <th className="py-4 px-5 cursor-pointer select-none hover:text-white" onClick={() => handleSort('id')}>
                      <div className="flex items-center gap-1.5">
                        <span>Asset ID</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-4 px-5 cursor-pointer select-none hover:text-white" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1.5">
                        <span>Asset Details</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-4 px-5 cursor-pointer select-none hover:text-white" onClick={() => handleSort('category')}>
                      <div className="flex items-center gap-1.5">
                        <span>Category</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-4 px-5 cursor-pointer select-none hover:text-white" onClick={() => handleSort('value')}>
                      <div className="flex items-center gap-1.5">
                        <span>Valuation</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-4 px-5">Assignee</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/55 text-sm">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="hover:bg-custom-bg/40 transition-colors duration-150 group"
                      >
                        <td className="py-4 px-5 font-mono text-xs text-text-secondary font-medium">{asset.id}</td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-text-primary text-[15px] group-hover:text-primary-brand transition-colors text-left">{asset.name}</div>
                          <div className="text-xs text-text-muted mt-0.5 flex flex-wrap items-center gap-2">
                            <span className="font-mono">{asset.serialNumber}</span>
                            <span className="inline-block w-1 h-1 rounded-full bg-card-border"></span>
                            <span className="flex items-center gap-0.5 text-text-secondary">
                              <MapPin className="w-3 h-3 text-[#007FFF]" /> {asset.location}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-xs bg-card-border/60 text-text-secondary px-2.5 py-1 rounded-lg border border-card-border font-medium">
                            {asset.category}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-semibold font-mono text-white text-left">
                          ${asset.value.toLocaleString()}
                        </td>
                        <td className="py-4 px-5">
                          {asset.assignee ? (
                            <div className="text-left">
                              <div className="font-medium text-text-primary flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-accent-blue" />
                                <span>{asset.assignee}</span>
                              </div>
                              <div className="text-[10px] text-text-muted mt-0.5">{asset.department}</div>
                            </div>
                          ) : (
                            <span className="text-text-muted italic text-xs block text-left">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(
                              asset.status
                            )}`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {asset.status === 'Available' && (
                              <button
                                onClick={() => openAllocation(asset)}
                                className="bg-primary-brand/10 border border-primary-brand/35 hover:bg-primary-brand text-white hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                              >
                                Allocate
                              </button>
                            )}
                            {asset.status === 'Allocated' && (
                              <button
                                onClick={() => handleReturnAsset(asset.id)}
                                className="bg-card-highlight/10 border border-card-highlight/35 hover:bg-card-highlight text-text-primary hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                              >
                                Return
                              </button>
                            )}
                            {asset.status !== 'Under Maintenance' && asset.status !== 'Retired' && (
                              <button
                                title="Send to Maintenance"
                                onClick={() => handleSendToMaintenance(asset.id)}
                                className="text-text-muted hover:text-yellow-500 p-1.5 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
                              >
                                <Wrench className="w-4 h-4" />
                              </button>
                            )}
                            {asset.status !== 'Retired' && (
                              <button
                                title="Retire Asset"
                                onClick={() => handleRetireAsset(asset.id)}
                                className="text-text-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-text-muted">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500/80" />
                        <div>No assets match the selected directory filter rules.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="bg-custom-bg border-t border-card-border p-4 flex items-center justify-between text-xs text-text-muted">
              <div>
                Showing {filteredAssets.length} of {assets.length} assets
              </div>
              <div className="flex gap-2">
                <button disabled className="px-3 py-1 bg-surface-card border border-card-border rounded-lg disabled:opacity-50 cursor-not-allowed">
                  Previous
                </button>
                <button disabled className="px-3 py-1 bg-surface-card border border-card-border rounded-lg disabled:opacity-50 cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTER NEW ASSET MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-surface-card border border-card-border rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-custom-bg p-5 border-b border-card-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-primary-brand" />
                <span>Register New Asset Record</span>
              </h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Body / Form */}
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Asset Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MacBook Pro 16&quot;"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-9801823"
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Category</label>
                  <div className="relative">
                    <select
                      value={newAsset.category}
                      onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                      className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                    >
                      {categories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Purchase Valuation ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Cost value"
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Purchase Date</label>
                  <input
                    type="date"
                    value={newAsset.purchaseDate}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary font-sans"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Location HQ Placement</label>
                  <input
                    type="text"
                    required
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="bg-card-border hover:bg-slate-700 text-text-secondary text-sm font-medium py-2 px-4 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-brand hover:bg-hover-blue text-white text-sm font-medium py-2 px-5 rounded-xl shadow-lg transition duration-200 cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALLOCATE ASSET MODAL */}
      {isAllocateOpen && selectedAssetForAllocation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-surface-card border border-card-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-custom-bg p-5 border-b border-card-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-accent-blue" />
                <span>Allocate Asset Resource</span>
              </h3>
              <button
                onClick={() => {
                  setIsAllocateOpen(false);
                  setSelectedAssetForAllocation(null);
                }}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-card-border transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={handleAllocationSubmit} className="p-6 space-y-4">
              <div className="bg-custom-bg/60 p-4 rounded-lg border border-card-border mb-4">
                <div className="text-xs text-text-muted font-mono uppercase text-left">Target Asset</div>
                <div className="font-semibold text-text-primary text-[15px] mt-1 text-left">{selectedAssetForAllocation.name}</div>
                <div className="text-xs text-text-secondary font-mono mt-0.5 text-left">{selectedAssetForAllocation.id}</div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Assignment Employee Nominee *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Piyush Kandhari"
                  value={allocationForm.assignee}
                  onChange={(e) => setAllocationForm({ ...allocationForm, assignee: e.target.value })}
                  className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-muted mb-1 text-left">Target Department</label>
                <div className="relative">
                  <select
                    value={allocationForm.department}
                    onChange={(e) => setAllocationForm({ ...allocationForm, department: e.target.value })}
                    className="w-full bg-custom-bg border border-card-border rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-brand text-text-secondary cursor-pointer appearance-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Development">Product Development</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Logistics Operations">Logistics Operations</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsAllocateOpen(false);
                    setSelectedAssetForAllocation(null);
                  }}
                  className="bg-card-border hover:bg-slate-700 text-text-secondary text-sm font-medium py-2 px-4 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-brand hover:bg-hover-blue text-white text-sm font-medium py-2 px-5 rounded-xl shadow-lg transition duration-200 cursor-pointer"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
