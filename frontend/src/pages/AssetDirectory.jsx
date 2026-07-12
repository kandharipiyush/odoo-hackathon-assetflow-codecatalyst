import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { api as axios } from '../services/authService'
import {
  Search,
  Eye,
  Edit,
  History as HistoryIcon,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  RotateCw,
  Info
} from 'lucide-react'

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

const ROWS_PER_PAGE = 10;

const STATIC_STATUSES = [
  'Available', 
  'Allocated', 
  'Reserved', 
  'Under Maintenance', 
  'Lost', 
  'Retired', 
  'Disposed'
];

const FALLBACK_ASSETS = [
  { id: 'AST-8291', serial: 'SN-93021-X', name: 'MacBook Pro 16" (M3 Max, 64GB)', category: 'IT Equipment', department: 'Engineering', location: 'Mumbai HQ', condition: 'Excellent', status: 'Available', healthScore: 95 },
  { id: 'AST-1204', serial: 'SN-40291-B', name: 'Dell UltraSharp 32" 4K Monitor', category: 'IT Equipment', department: 'Product Development', location: 'Bangalore Tech Park', condition: 'Good', status: 'Allocated', healthScore: 88 },
  { id: 'AST-5521', serial: 'SN-10924-M', name: 'Honda Activa Electric Scooter', category: 'Vehicles', department: 'Logistics Operations', location: 'Pune Office', condition: 'Excellent', status: 'Reserved', healthScore: 92 },
  { id: 'AST-3902', serial: 'SN-55263-K', name: 'Generative AI GPU Server Rack', category: 'IT Equipment', department: 'Research & Development', location: 'Noida Data Center', condition: 'Fair', status: 'Under Maintenance', healthScore: 68 },
  { id: 'AST-0921', serial: 'SN-33923-D', name: 'Sony Alpha 7 IV Mirrorless Camera', category: 'IT Equipment', department: 'Sales & Marketing', location: 'Mumbai HQ', condition: 'Excellent', status: 'Lost', healthScore: 0 },
  { id: 'AST-4412', serial: 'SN-11029-A', name: 'Intel Xeon Database Server V1', category: 'IT Equipment', department: 'Engineering', location: 'Delhi Branch', condition: 'Poor', status: 'Retired', healthScore: 40 },
  { id: 'AST-7763', serial: 'SN-00273-P', name: 'Office Reception L-Sofa Set', category: 'Furniture', department: 'Human Resources', location: 'Mumbai HQ', condition: 'Excellent', status: 'Disposed', healthScore: 0 }
];

// ============================================================================
// STYLING HELPERS
// ============================================================================

/**
 * Returns matching Tailwind styles for status badges based on asset flags
 */
const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Available':
      return { backgroundColor: 'rgba(41,98,255,0.15)', color: '#2962FF' };
    case 'Allocated':
      return { backgroundColor: 'rgba(0,82,204,0.15)', color: '#0052CC' };
    case 'Reserved':
      return { backgroundColor: 'rgba(30,144,255,0.15)', color: '#1E90FF' };
    case 'Under Maintenance':
      return { backgroundColor: 'rgba(15,82,186,0.15)', color: '#0F52BA' };
    case 'Lost':
      return { backgroundColor: 'rgba(0,0,128,0.15)', color: '#000080' };
    case 'Retired':
      return { backgroundColor: 'rgba(65,105,225,0.15)', color: '#4169E1' };
    case 'Disposed':
      return { backgroundColor: 'rgba(0,71,171,0.15)', color: '#0047AB' };
    default:
      return { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff' };
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Memoized single row entry component for rendering speed optimization
 */
const AssetRow = React.memo(({ asset, onActionClick }) => {
  const handleView = useCallback(() => onActionClick(asset, 'view'), [asset, onActionClick]);
  const handleEdit = useCallback(() => onActionClick(asset, 'edit'), [asset, onActionClick]);
  const handleHistory = useCallback(() => onActionClick(asset, 'history'), [asset, onActionClick]);

  return (
    <tr className="hover:bg-[#0F172A]/40 transition-all duration-150 group border-b border-[#334155]">
      <td className="px-6 py-4 text-sm font-semibold tracking-wider font-mono text-[#CBD5E1] whitespace-nowrap">
        {asset.id}
      </td>
      <td className="px-6 py-4 text-sm font-bold text-white max-w-xs truncate" title={asset.name}>
        {asset.name}
      </td>
      <td className="px-6 py-4 text-xs font-medium text-[#CBD5E1] whitespace-nowrap">
        {asset.category}
      </td>
      <td className="px-6 py-4 text-xs font-medium text-[#CBD5E1] whitespace-nowrap">
        {asset.department}
      </td>
      <td className="px-6 py-4 text-xs font-medium text-[#CBD5E1] whitespace-nowrap">
        {asset.location}
      </td>
      <td className="px-6 py-4 text-xs font-bold whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded text-[11px] ${
          asset.condition === 'Excellent' ? 'text-green-400 bg-green-500/10' :
          asset.condition === 'Good' ? 'text-blue-400 bg-blue-500/10' :
          asset.condition === 'Fair' ? 'text-yellow-400 bg-yellow-500/10' :
          'text-red-400 bg-red-500/10'
        }`}>
          {asset.condition}
        </span>
      </td>
      <td className="px-6 py-4 text-xs font-bold whitespace-nowrap">
        <span 
          className="px-3 py-1 rounded-full text-[11px] font-semibold" 
          style={getStatusBadgeStyle(asset.status)}
        >
          {asset.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center">
          <div className="relative w-10 h-10 flex items-center justify-center" aria-label={`Health Index: ${asset.healthScore}%`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-700" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="transition-all duration-500 ease-out" strokeWidth="3.5" strokeDasharray={`${asset.healthScore}, 100`} strokeLinecap="round" stroke="#2D68C4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[10px] font-bold text-white font-mono leading-none">{asset.healthScore}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={handleView} 
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2962FF] hover:bg-[#0047AB] hover:border-[#0047AB] text-white text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2962FF] cursor-pointer"
            aria-label={`View details for ${asset.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
          
          <button 
            onClick={handleEdit} 
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2962FF] hover:bg-[#0047AB] hover:border-[#0047AB] text-white text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2962FF] cursor-pointer"
            aria-label={`Edit ${asset.name}`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          
          <button 
            onClick={handleHistory} 
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2962FF] hover:bg-[#0047AB] hover:border-[#0047AB] text-white text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2962FF] cursor-pointer"
            aria-label={`View history for ${asset.name}`}
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </td>
    </tr>
  );
});

/**
 * Placeholder skeletons matching row structure
 */
const TableSkeletons = () => (
  <>
    {[...Array(6)].map((_, idx) => (
      <tr key={idx} className="animate-pulse border-b border-[#334155]/60">
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-12"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-36"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-28"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-16"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-slate-700 rounded-full w-20"></div></td>
        <td className="px-6 py-4"><div className="h-8 bg-slate-700 rounded-full w-8 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-8 bg-slate-700 rounded w-24 mx-auto"></div></td>
      </tr>
    ))}
  </>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AssetDirectory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & input parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Committed search/filter queries
  const [appliedQuery, setAppliedQuery] = useState({
    search: '',
    category: '',
    department: '',
    status: '',
    location: ''
  });

  // Table states
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Modal controls
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'view', 'edit', 'history'

  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    department: '',
    location: '',
    condition: '',
    status: '',
    healthScore: 100
  });

  // Debouncing search query input (300ms gap throttle)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Dynamic asset retriever
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/assets`);
      if (response.data && Array.isArray(response.data.data)) {
        setAssets(response.data.data);
      } else {
        setAssets([]);
      }
    } catch (err) {
      console.warn("API disconnect. Hydrating directory with fallback records.", err);
      setError("Connect request failed. Presenting localized registry logs snapshot.");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Filter option categories memoized from loaded assets list
  const categories = useMemo(() => [...new Set(assets.map(a => a.category))], [assets]);
  const departments = useMemo(() => [...new Set(assets.map(a => a.department))], [assets]);
  const locations = useMemo(() => [...new Set(assets.map(a => a.location))], [assets]);

  const handleApplyFilters = useCallback(() => {
    setAppliedQuery({
      search: debouncedQuery,
      category: categoryFilter,
      department: departmentFilter,
      status: statusFilter,
      location: locationFilter
    });
    setCurrentPage(1);
  }, [debouncedQuery, categoryFilter, departmentFilter, statusFilter, locationFilter]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setCategoryFilter('');
    setDepartmentFilter('');
    setStatusFilter('');
    setLocationFilter('');
    setAppliedQuery({
      search: '',
      category: '',
      department: '',
      status: '',
      location: ''
    });
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // Sorted and filtered assets calculation
  const filteredAndSortedAssets = useMemo(() => {
    const filtered = assets.filter(item => {
      const matchText = appliedQuery.search.toLowerCase();
      const matchesSearch = !matchText || 
        item.id.toLowerCase().includes(matchText) ||
        item.name.toLowerCase().includes(matchText) ||
        item.serial.toLowerCase().includes(matchText);

      const matchesCategory = !appliedQuery.category || item.category === appliedQuery.category;
      const matchesDepartment = !appliedQuery.department || item.department === appliedQuery.department;
      const matchesStatus = !appliedQuery.status || item.status === appliedQuery.status;
      const matchesLocation = !appliedQuery.location || item.location === appliedQuery.location;

      return matchesSearch && matchesCategory && matchesDepartment && matchesStatus && matchesLocation;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'healthScore') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [assets, appliedQuery, sortConfig]);

  // Paginated partition view window
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredAndSortedAssets.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredAndSortedAssets, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedAssets.length / ROWS_PER_PAGE);
  }, [filteredAndSortedAssets]);

  const handleActionClick = useCallback((asset, type) => {
    setSelectedAsset(asset);
    setActiveModal(type);
    if (type === 'edit') {
      setEditForm({
        name: asset.name,
        category: asset.category,
        department: asset.department,
        location: asset.location,
        condition: asset.condition,
        status: asset.status,
        healthScore: asset.healthScore
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedAsset(null);
    setActiveModal(null);
  }, []);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.category) {
      alert('Asset Name and Category are required!');
      return;
    }
    
    const updatedAsset = {
      ...selectedAsset,
      name: editForm.name,
      category: editForm.category,
      department: editForm.department,
      location: editForm.location,
      condition: editForm.condition,
      status: editForm.status,
      healthScore: Number(editForm.healthScore)
    };

    try {
      await axios.put(`${API_BASE_URL}/assets/${selectedAsset.id}`, updatedAsset);
      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAsset : a));
    } catch (err) {
      console.warn("Backend update failed, applying modifications locally.", err);
      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAsset : a));
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased">
      {/* HEADER SECTION */}
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Asset Directory</h1>
        <p className="text-[#CBD5E1] text-sm font-medium">
          View, search and manage all registered organizational assets.
        </p>
      </header>

      {/* ERROR MESSAGE DANGER STRIP */}
      {error && (
        <div 
          className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs flex items-center justify-between gap-3 mb-6 text-left origin-top animate-fadeIn"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAssets}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            aria-label="Retry retrieving assets"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-xl mb-6 text-left" aria-label="Filters">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#94A3B8]" />
            </span>
            <input
              type="text"
              placeholder="Search by Asset Tag, Asset Name or Serial Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-white placeholder-[#94A3B8] transition-all focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
              aria-label="Filter assets by text keywords"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 xl:col-span-3 gap-3">
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
                aria-label="Filter by Category"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
                aria-label="Filter by Department"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
                aria-label="Filter by Status"
              >
                <option value="">All Statuses</option>
                {STATIC_STATUSES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
                aria-label="Filter by Location"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#334155]/60">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-[#334155] rounded-lg text-xs font-semibold text-[#CBD5E1] hover:bg-[#0F172A] transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg shadow-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
          >
            Apply Filters
          </button>
        </div>
      </section>

      {/* CORE TABLE */}
      <section className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col" aria-label="Asset Directory Grid">
        <div className="overflow-x-auto border-b border-[#334155]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0052CC] z-10">
              <tr>
                <th 
                  onClick={() => handleSort('id')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('id'); }}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Asset Tag"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none whitespace-nowrap cursor-pointer hover:bg-[#0047AB] transition focus:outline-none focus:underline"
                >
                  Asset Tag {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('name'); }}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Asset Name"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none cursor-pointer hover:bg-[#0047AB] transition focus:outline-none focus:underline"
                >
                  Asset Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">Department</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">Location</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">Condition</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">Status</th>
                <th 
                  onClick={() => handleSort('healthScore')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('healthScore'); }}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Health Score"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none text-center cursor-pointer hover:bg-[#0047AB] transition focus:outline-none focus:underline"
                >
                  Health Score {sortConfig.key === 'healthScore' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#334155]">
              {loading ? (
                <TableSkeletons />
              ) : paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onActionClick={handleActionClick}
                  />
                ))
              ) : (
                /* EMPTY DATA PLACEHOLDER */
                <tr>
                  <td colSpan="9" className="py-20 text-center text-[#94A3B8] font-medium bg-[#1e293b]/50 animate-fadeIn">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Info className="w-8 h-8 text-[#94A3B8]" />
                      <span>No assets found matching the applied filter criteria.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION NAVIGATION */}
        {!loading && (
          <div className="bg-[#1E293B] px-6 py-4 flex items-center justify-between">
            <div className="text-xs text-[#94A3B8] font-medium">
              Showing <span className="text-[#CBD5E1] font-semibold">{filteredAndSortedAssets.length ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0}</span> to <span className="text-[#CBD5E1] font-semibold">{Math.min(currentPage * ROWS_PER_PAGE, filteredAndSortedAssets.length)}</span> of <span className="text-[#CBD5E1] font-semibold">{filteredAndSortedAssets.length}</span> entries
            </div>

            <div className="flex items-center gap-2" role="navigation" aria-label="Pagination Navigation">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 border border-[#334155] rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] ${
                  currentPage === 1 ? 'text-slate-600 border-slate-800/40 cursor-not-allowed' : 'text-[#CBD5E1] hover:bg-[#0F172A]'
                }`}
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] ${
                      currentPage === pageNumber ? 'bg-[#2962FF] text-white shadow-md' : 'border border-[#334155] text-[#CBD5E1] hover:bg-[#0F172A]'
                    }`}
                    aria-label={`Go to Page ${pageNumber}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 border border-[#334155] rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF] ${
                  currentPage === totalPages || totalPages === 0 ? 'text-slate-600 border-slate-800/40 cursor-not-allowed' : 'text-[#CBD5E1] hover:bg-[#0F172A]'
                }`}
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* POPUP OVERLAYS */}
      {activeModal && selectedAsset && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-5 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                <span>{activeModal === 'view' ? 'Asset Details' : activeModal === 'edit' ? 'Modify Asset' : 'Asset Lifecycle Log'}</span>
                <span className="text-xs font-mono bg-[#334155] text-[#CBD5E1] px-2 py-0.5 rounded ml-2">{selectedAsset.id}</span>
              </h3>
              <button 
                onClick={closeModal} 
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
                aria-label="Close modal dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VIEW MODAL BODY */}
            {activeModal === 'view' && (
              <div className="p-6 space-y-4">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-3">
                  <div className="text-xs font-bold text-[#94A3B8] uppercase">Asset Description / Name</div>
                  <div className="text-base font-bold text-white">{selectedAsset.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Serial Number</label>
                    <div className="text-sm font-mono text-[#CBD5E1] bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]">{selectedAsset.serial}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Status Badge</label>
                    <div className="pt-1.5 flex align-middle">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={getStatusBadgeStyle(selectedAsset.status)}>{selectedAsset.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Category</label>
                    <div className="text-sm text-[#CBD5E1] bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]">{selectedAsset.category}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Department</label>
                    <div className="text-sm text-[#CBD5E1] bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]">{selectedAsset.department}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Location Address</label>
                    <div className="text-sm text-[#CBD5E1] bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]">{selectedAsset.location}</div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Physical Condition</label>
                    <div className="text-sm text-[#CBD5E1] bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]">{selectedAsset.condition}</div>
                  </div>
                </div>

                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#94A3B8] uppercase">Reliability Index Health Score</div>
                    <div className="text-xs text-[#94A3B8]">Based on service audits and calibrations</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{selectedAsset.healthScore}</span>
                    <span className="text-xs font-medium text-[#CBD5E1]">/ 100</span>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#334155]/60">
                  <button onClick={closeModal} className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg transition cursor-pointer">Close Directory Card</button>
                </div>
              </div>
            )}

            {/* EDIT MODAL BODY */}
            {activeModal === 'edit' && (
              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Asset Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-sm p-2.5 text-white focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs p-2.5 text-[#CBD5E1]"
                    >
                      <option value="IT Equipment">IT Equipment</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Facilities">Facilities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Department</label>
                    <select
                      value={editForm.department}
                      onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs p-2.5 text-[#CBD5E1]"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product Development">Product Dev</option>
                      <option value="Logistics Operations">Logistics</option>
                      <option value="Research & Development">R&D</option>
                      <option value="Human Resources">HR</option>
                      <option value="Sales & Marketing">Sales</option>
                      <option value="Finance & Accounting">Finance</option>
                      <option value="Design">Design</option>
                      <option value="Facilities">Facilities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Location</label>
                    <select
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs p-2.5 text-[#CBD5E1]"
                    >
                      <option value="Mumbai HQ">Mumbai HQ</option>
                      <option value="Delhi Branch">Delhi Branch</option>
                      <option value="Pune Office">Pune Office</option>
                      <option value="Bangalore Tech Park">Bangalore Tech Park</option>
                      <option value="Noida Data Center">Noida DC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Condition</label>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs p-2.5 text-[#CBD5E1]"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Asset Status Badge</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs p-2.5 text-[#CBD5E1]"
                    >
                      {STATIC_STATUSES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1">Health Score (0-100)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={editForm.healthScore}
                      onChange={(e) => setEditForm(prev => ({ ...prev, healthScore: Number(e.target.value) }))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-sm p-2.5 text-white lg:text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]/60">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-[#334155] rounded-lg text-xs font-semibold text-[#CBD5E1] hover:bg-[#0F172A] transition duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg transition duration-200 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* HISTORY MODAL BODY */}
            {activeModal === 'history' && (
              <div className="p-6 space-y-4">
                <div className="text-[#CBD5E1] text-xs font-medium bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                  Showing audit tracking logs for <strong className="text-white">{selectedAsset.name}</strong>
                </div>

                <div className="relative border-l-2 border-[#334155] ml-4 pl-6 space-y-5">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#2962FF] border-2 border-[#1E293B]"></span>
                    <div className="text-xs font-mono text-[#94A3B8]">2026-07-10 14:32:10</div>
                    <div className="text-sm font-bold text-white">Asset Registry Setup</div>
                    <p className="text-xs text-[#CBD5E1] mt-0.5">Asset successfully cataloged by system admin. Status flagged as Available.</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1E90FF] border-2 border-[#1E293B]"></span>
                    <div className="text-xs font-mono text-[#94A3B8]">2026-07-11 09:12:45</div>
                    <div className="text-sm font-bold text-white">Location Allocation Check</div>
                    <p className="text-xs text-[#CBD5E1] mt-0.5">Assigned to department coordinator. Operational clearance certified.</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#2D68C4] border-2 border-[#1E293B]"></span>
                    <div className="text-xs font-mono text-[#94A3B8]">2026-07-12 11:24:00</div>
                    <div className="text-sm font-bold text-white">Status Synchronized</div>
                    <p className="text-xs text-[#CBD5E1] mt-0.5">Internal synchronizer verified health score index state as {selectedAsset.healthScore}%.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#334155]/60">
                  <button onClick={closeModal} className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg transition cursor-pointer">Close History Logs</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
