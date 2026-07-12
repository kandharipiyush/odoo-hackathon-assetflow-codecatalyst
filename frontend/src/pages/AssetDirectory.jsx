import React, { useState, useMemo } from 'react'
import {
  Search,
  Eye,
  Edit,
  History as HistoryIcon,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'

// Dummy data representing assets spanning the 7 required statuses
const INITIAL_ASSETS = [
  { id: 'AST-8291', serial: 'SN-93021-X', name: 'MacBook Pro 16" (M3 Max, 64GB)', category: 'IT Equipment', department: 'Engineering', location: 'Mumbai HQ', condition: 'Excellent', status: 'Available', healthScore: 95 },
  { id: 'AST-1204', serial: 'SN-40291-B', name: 'Dell UltraSharp 32" 4K Monitor', category: 'IT Equipment', department: 'Product Development', location: 'Bangalore Tech Park', condition: 'Good', status: 'Allocated', healthScore: 88 },
  { id: 'AST-5521', serial: 'SN-10924-M', name: 'Honda Activa Electric Scooter', category: 'Vehicles', department: 'Logistics Operations', location: 'Pune Office', condition: 'Excellent', status: 'Reserved', healthScore: 92 },
  { id: 'AST-3902', serial: 'SN-55263-K', name: 'Generative AI GPU Server Rack', category: 'IT Equipment', department: 'Research & Development', location: 'Noida Data Center', condition: 'Fair', status: 'Under Maintenance', healthScore: 68 },
  { id: 'AST-0921', serial: 'SN-33923-D', name: 'Sony Alpha 7 IV Mirrorless Camera', category: 'IT Equipment', department: 'Sales & Marketing', location: 'Mumbai HQ', condition: 'Excellent', status: 'Lost', healthScore: 0 },
  { id: 'AST-4412', serial: 'SN-11029-A', name: 'Intel Xeon Database Server V1', category: 'IT Equipment', department: 'Engineering', location: 'Delhi Branch', condition: 'Poor', status: 'Retired', healthScore: 40 },
  { id: 'AST-7763', serial: 'SN-00273-P', name: 'Office Reception L-Sofa Set', category: 'Furniture', department: 'Human Resources', location: 'Mumbai HQ', condition: 'Excellent', status: 'Disposed', healthScore: 0 },
  { id: 'AST-9921', serial: 'SN-88273-E', name: 'Lenovo ThinkPad X1 Carbon Gen 11', category: 'IT Equipment', department: 'Finance & Accounting', location: 'Bangalore Tech Park', condition: 'Good', status: 'Available', healthScore: 90 },
  { id: 'AST-8812', serial: 'SN-66271-T', name: 'Fleet Tesla Model Y Long Range', category: 'Vehicles', department: 'Logistics Operations', location: 'Delhi Branch', condition: 'Good', status: 'Allocated', healthScore: 84 },
  { id: 'AST-1102', serial: 'SN-77382-U', name: 'iPad Pro 12.9" (M2, 256GB)', category: 'IT Equipment', department: 'Design', location: 'Pune Office', condition: 'Good', status: 'Available', healthScore: 91 },
  { id: 'AST-2931', serial: 'SN-55421-Y', name: 'Conference Projector 4K laser', category: 'IT Equipment', department: 'Human Resources', location: 'Noida Data Center', condition: 'Fair', status: 'Under Maintenance', healthScore: 72 },
  { id: 'AST-5562', serial: 'SN-09827-W', name: 'Ergonomic Desk chair V4', category: 'Furniture', department: 'Engineering', location: 'Delhi Branch', condition: 'Excellent', status: 'Allocated', healthScore: 96 },
  { id: 'AST-8219', serial: 'SN-11827-Q', name: 'Fiber Optic Router Cisco 9000', category: 'IT Equipment', department: 'Engineering', location: 'Noida Data Center', condition: 'Good', status: 'Reserved', healthScore: 89 },
  { id: 'AST-6671', serial: 'SN-99827-F', name: 'Office Cold Brewer Dispenser', category: 'Facilities', department: 'Facilities', location: 'Mumbai HQ', condition: 'Poor', status: 'Retired', healthScore: 35 },
  { id: 'AST-3301', serial: 'SN-44321-R', name: 'Logistics Forklift Unit A', category: 'Vehicles', department: 'Logistics Operations', location: 'Delhi Branch', condition: 'Good', status: 'Available', healthScore: 82 }
];

export default function AssetDirectory() {
  // Master asset list state
  const [assets, setAssets] = useState(INITIAL_ASSETS);

  // Search & Filter input state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Active query parameters (committed on Apply Filters click)
  const [appliedQuery, setAppliedQuery] = useState({
    search: '',
    category: '',
    department: '',
    status: '',
    location: ''
  });

  // Table pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Selected asset for View / Edit / History popup modals
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'view', 'edit', 'history'

  // Temporary Edit validation state
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    department: '',
    location: '',
    condition: '',
    status: '',
    healthScore: 100
  });

  // Unique lists for filter dropdown selections
  const categories = useMemo(() => [...new Set(assets.map(a => a.category))], [assets]);
  const departments = useMemo(() => [...new Set(assets.map(a => a.department))], [assets]);
  const statuses = ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'];
  const locations = useMemo(() => [...new Set(assets.map(a => a.location))], [assets]);

  // Handle Apply filters click
  const handleApplyFilters = () => {
    setAppliedQuery({
      search: searchQuery,
      category: categoryFilter,
      department: departmentFilter,
      status: statusFilter,
      location: locationFilter
    });
    setCurrentPage(1); // Reset page selection on applying filters
  };

  // Handle Reset filters click
  const handleResetFilters = () => {
    setSearchQuery('');
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
  };

  // Memoized filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
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
  }, [assets, appliedQuery]);

  // Paginated chunk calculation (exactly 10 rows)
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAssets.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAssets, currentPage]);

  const totalPages = Math.ceil(filteredAssets.length / rowsPerPage);

  // Status Badge Class Selector mapping
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Available':
        return {
          backgroundColor: 'rgba(41,98,255,0.15)',
          color: '#2962FF'
        };
      case 'Allocated':
        return {
          backgroundColor: 'rgba(0,82,204,0.15)',
          color: '#0052CC'
        };
      case 'Reserved':
        return {
          backgroundColor: 'rgba(30,144,255,0.15)',
          color: '#1E90FF'
        };
      case 'Under Maintenance':
        return {
          backgroundColor: 'rgba(15,82,186,0.15)',
          color: '#0F52BA'
        };
      case 'Lost':
        return {
          backgroundColor: 'rgba(0,0,128,0.15)',
          color: '#000080'
        };
      case 'Retired':
        return {
          backgroundColor: 'rgba(65,105,225,0.15)',
          color: '#4169E1'
        };
      case 'Disposed':
        return {
          backgroundColor: 'rgba(0,71,171,0.15)',
          color: '#0047AB'
        };
      default:
        return {
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: '#ffffff'
        };
    }
  };

  // Open respective Modal
  const openModal = (asset, type) => {
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
  };

  // Close Modal
  const closeModal = () => {
    setSelectedAsset(null);
    setActiveModal(null);
  };

  // Saving Edits into state
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.category) {
      alert('Asset Name and Category are required!');
      return;
    }
    
    setAssets(prev => prev.map(a => {
      if (a.id === selectedAsset.id) {
        return {
          ...a,
          name: editForm.name,
          category: editForm.category,
          department: editForm.department,
          location: editForm.location,
          condition: editForm.condition,
          status: editForm.status,
          healthScore: Number(editForm.healthScore)
        };
      }
      return a;
    }));

    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans antialiased">
      {/* HEADER SECTION */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Asset Directory</h1>
        <p className="text-[#CBD5E1] text-sm font-medium">
          View, search and manage all registered organizational assets.
        </p>
      </div>

      {/* TOP TOOLBAR */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-xl mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          
          {/* SEARCH INPUT */}
          <div className="xl:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#94A3B8]" />
            </span>
            <input
              type="text"
              placeholder="Search by Asset Tag, Asset Name or Serial Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-white placeholder-[#94A3B8] transition-colors focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
            />
          </div>

          {/* DROPDOWN FILTERS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:col-span-3 gap-3">
            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
              >
                <option value="">All Statuses</option>
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-xs py-2.5 px-3 text-[#CBD5E1] cursor-pointer focus:outline-none focus:border-[#1E90FF]"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#334155]/60">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-[#334155] rounded-lg text-xs font-semibold text-[#CBD5E1] hover:bg-[#0F172A] transition duration-200 cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg shadow-md transition duration-200 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* ASSET DATA TABLE CONTAINER */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* STICKY HEADER */}
            <thead className="sticky top-0 bg-[#0052CC] z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none whitespace-nowrap">
                  Asset Tag
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">
                  Asset Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">
                  Department
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">
                  Condition
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none text-center">
                  Health Score
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white select-none text-center">
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE ROWS */}
            <tbody className="divide-y divide-[#334155]">
              {paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-[#0F172A]/40 transition-all duration-150 group"
                  >
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
                        {/* Circular Progress SVG */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            {/* SVG Track */}
                            <path
                              className="text-slate-700"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            {/* SVG Fill Ring */}
                            <path
                              className="transition-all duration-500 ease-out"
                              strokeWidth="3.5"
                              strokeDasharray={`${asset.healthScore}, 100`}
                              strokeLinecap="round"
                              stroke="#2D68C4"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-bold text-white font-mono leading-none">
                            {asset.healthScore}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(asset, 'view')}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2962FF] hover:bg-[#0047AB] hover:border-[#0047AB] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openModal(asset, 'edit')}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2962FF] hover:bg-[#0047AB] hover:border-[#0047AB] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => openModal(asset, 'history')}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2962FF] hover:bg-[#0047AB] hover:border-[#0047AB] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          <HistoryIcon className="w-3.5 h-3.5" />
                          <span>History</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#94A3B8]">
                    No assets found matching the applied filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE PAGINATION FOOTER */}
        <div className="bg-[#1E293B] border-t border-[#334155] px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-[#94A3B8] font-medium">
            Showing <span className="text-[#CBD5E1] font-semibold">{filteredAssets.length ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="text-[#CBD5E1] font-semibold">{Math.min(currentPage * rowsPerPage, filteredAssets.length)}</span> of <span className="text-[#CBD5E1] font-semibold">{filteredAssets.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 border border-[#334155] rounded-lg transition-all cursor-pointer ${
                currentPage === 1
                  ? 'text-slate-600 border-slate-800/40 cursor-not-allowed'
                  : 'text-[#CBD5E1] hover:bg-[#0F172A]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNumber
                      ? 'bg-[#2962FF] text-white shadow-md'
                      : 'border border-[#334155] text-[#CBD5E1] hover:bg-[#0F172A]'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 border border-[#334155] rounded-lg transition-all cursor-pointer ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-slate-600 border-slate-800/40 cursor-not-allowed'
                  : 'text-[#CBD5E1] hover:bg-[#0F172A]'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODALS OVERLAYS */}
      {activeModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn text-left">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-5 border-b border-[#334155] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                <span>{activeModal === 'view' ? 'Asset Details' : activeModal === 'edit' ? 'Modify Asset' : 'Asset Lifecycle Log'}</span>
                <span className="text-xs font-mono bg-[#334155] text-[#CBD5E1] px-2 py-0.5 rounded ml-2">
                  {selectedAsset.id}
                </span>
              </h3>
              <button
                onClick={closeModal}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer"
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
                    <div className="pt-1.5">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={getStatusBadgeStyle(selectedAsset.status)}>
                        {selectedAsset.status}
                      </span>
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
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Close Directory Card
                  </button>
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
                      {statuses.map(st => (
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
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl text-sm p-2.5 text-white"
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

                {/* Audit Trail Timeline */}
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
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 bg-[#2962FF] hover:bg-[#0047AB] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Close History Logs
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
