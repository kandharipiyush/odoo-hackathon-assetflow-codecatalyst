import React, { useState, useEffect, useMemo } from 'react';
import { api as axios } from '../services/authService';
import { 
  Building2, 
  Tag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  UserCheck,
  Search,
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import InfoBanner from '../components/common/InfoBanner';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function OrgSetup() {
  const [activeTab, setActiveTab] = useState('departments');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [deptRes, catRes, usersRes] = await Promise.all([
        axios.get('/org/departments'),
        axios.get('/org/asset-categories'),
        axios.get('/org/users')
      ]);
      if (deptRes.data && Array.isArray(deptRes.data.data)) {
        setDepartments(deptRes.data.data);
      }
      if (catRes.data && Array.isArray(catRes.data.data)) {
        setCategories(catRes.data.data);
      }
      if (usersRes.data && Array.isArray(usersRes.data.data)) {
        setEmployees(usersRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load organization data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // REAL STATE DATA
  // ==========================================
  
  // 1. Departments State
  const [departments, setDepartments] = useState([]);

  // 2. Asset Categories State
  const [categories, setCategories] = useState([]);

  // 3. Employee Directory State
  const [employees, setEmployees] = useState([]);

  // ==========================================
  // SEARCH STATE
  // ==========================================
  const [deptSearch, setDeptSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [empSearch, setEmpSearch] = useState('');

  // Filtered data
  const filteredDepts = useMemo(() => {
    if (!deptSearch) return departments;
    const q = deptSearch.toLowerCase();
    return departments.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.headName.toLowerCase().includes(q) ||
      d.parentName.toLowerCase().includes(q)
    );
  }, [departments, deptSearch]);

  const filteredCats = useMemo(() => {
    if (!catSearch) return categories;
    const q = catSearch.toLowerCase();
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }, [categories, catSearch]);

  const filteredEmps = useMemo(() => {
    if (!empSearch) return employees;
    const q = empSearch.toLowerCase();
    return employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  }, [employees, empSearch]);

  // ==========================================
  // MODAL & FORM STATE
  // ==========================================
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formError, setFormError] = useState('');

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null, title: '', message: '' });

  // Form Fields State
  const [deptForm, setDeptForm] = useState({ name: '', parentName: '', headName: '', status: 'Active' });
  const [catForm, setCatForm] = useState({ name: '', description: '', warranty: '', status: 'Active' });

  // Open modals helper
  const openDeptModal = (type, item = null) => {
    setModalType(type);
    setFormError('');
    if (item) {
      setSelectedItem(item);
      setDeptForm({ ...item });
    } else {
      setSelectedItem(null);
      setDeptForm({ name: '', parentName: 'None', headName: '', status: 'Active' });
    }
  };

  const openCatModal = (type, item = null) => {
    setModalType(type);
    setFormError('');
    if (item) {
      setSelectedItem(item);
      setCatForm({ ...item });
    } else {
      setSelectedItem(null);
      setCatForm({ name: '', description: '', warranty: '12 Months', status: 'Active' });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setFormError('');
  };

  // ==========================================
  // ACTIONS / MUTATORS
  // ==========================================

  // Departments CRUD
  const handleSaveDept = async () => {
    if (!deptForm.name.trim()) {
      setFormError('Department name is required.');
      return;
    }

    try {
      if (modalType === 'add-dept') {
        const response = await axios.post('/org/departments', { name: deptForm.name });
        if (response.data && response.data.success) {
          setDepartments([...departments, response.data.data]);
        }
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save department.');
    }
  };

  const toggleDeptStatus = (id) => {
    setDepartments(departments.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return d;
    }));
  };

  // Asset Categories CRUD
  const handleSaveCat = async () => {
    if (!catForm.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    try {
      if (modalType === 'add-cat') {
        const response = await axios.post('/org/asset-categories', {
          name: catForm.name,
          description: catForm.description
        });
        if (response.data && response.data.success) {
          setCategories([...categories, response.data.data]);
        }
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDeleteCat = (id) => {
    const cat = categories.find(c => c.id === id);
    setConfirmState({
      isOpen: true,
      id,
      title: 'Delete Asset Category',
      message: `Are you sure you want to delete "${cat?.name || 'this category'}"? This action cannot be undone.`,
    });
  };

  const confirmDeleteCat = () => {
    if (confirmState.id) {
      setCategories(categories.filter(c => c.id !== confirmState.id));
    }
  };

  // Employee actions (RBAC)
  const promoteRole = async (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    // Cycle: Employee -> Asset Manager -> Department Head -> Asset Manager
    let nextRoleEnum = 'ASSET_MANAGER';
    if (emp.role === 'Employee') {
      nextRoleEnum = 'ASSET_MANAGER';
    } else if (emp.role === 'Asset Manager') {
      nextRoleEnum = 'DEPARTMENT_HEAD';
    } else if (emp.role === 'Department Head') {
      nextRoleEnum = 'ASSET_MANAGER';
    } else {
      return; // Cannot promote or demote Admin
    }

    try {
      const response = await axios.patch(`/org/users/${id}/promote`, { role: nextRoleEnum });
      if (response.data && response.data.success) {
        const roleMapping = {
          'ADMIN': 'Admin',
          'EMPLOYEE': 'Employee',
          'ASSET_MANAGER': 'Asset Manager',
          'DEPARTMENT_HEAD': 'Department Head'
        };
        setEmployees(employees.map(e => e.id === id ? { ...e, role: roleMapping[response.data.data.role] || response.data.data.role } : e));
      }
    } catch (err) {
      console.error("Failed to promote user:", err);
    }
  };

  const toggleEmployeeStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        return { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return emp;
    }));
  };

  // Role badge variant helper
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Admin': return 'purple';
      case 'Asset Manager': return 'blue';
      case 'Department Head': return 'amber';
      default: return 'neutral';
    }
  };

  // Tab configuration
  const tabs = [
    { key: 'departments', label: 'Departments', icon: Building2 },
    { key: 'categories', label: 'Asset Categories', icon: Tag },
    { key: 'employees', label: 'Employee Directory', icon: Users },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 text-[#F8FAFC] animate-fade-in">
        <LoadingSkeleton type="card" rows={1} columns={1} />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#F8FAFC] animate-fade-in">
      
      {/* Confirm Dialog — replaces window.confirm() */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null, title: '', message: '' })}
        onConfirm={confirmDeleteCat}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Delete"
        variant="danger"
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-sm">
        <div>
          <h2 className="text-[20px] font-bold tracking-tight text-white">Organization Setup</h2>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Configure branches, structural groups, asset definitions, and employee privileges.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex p-1 bg-[#111827]/40 rounded-xl max-w-fit border border-[#334155]/50" role="tablist">
        {tabs.map(({ key, label, icon: TabIcon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            aria-controls={`panel-${key}`}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === key
                ? 'bg-[#0052CC] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
            }`}
          >
            <TabIcon className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ==========================================
          1. DEPARTMENTS TAB
          ========================================== */}
      {activeTab === 'departments' && (
        <div className="space-y-4" id="panel-departments" role="tabpanel">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">
              Configured Department Nodes ({departments.length})
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchBar
                value={deptSearch}
                onChange={setDeptSearch}
                placeholder="Search departments..."
                size="sm"
                className="flex-1 sm:w-52"
              />
              <button
                onClick={() => openDeptModal('add-dept')}
                className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-3.5 h-9 rounded-[10px] flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#0052CC]/10 flex-shrink-0"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          {filteredDepts.length > 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155] text-[#94A3B8] font-bold select-none sticky top-0 z-10">
                      <th className="p-4">Department Name</th>
                      <th className="p-4">Parent Structure</th>
                      <th className="p-4">Department Head</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {filteredDepts.map((dept) => (
                      <tr key={dept.id} className="hover:bg-[#0F172A]/30 transition-colors group">
                        <td className="p-4 font-bold text-white group-hover:text-[#0052CC] transition-colors">{dept.name}</td>
                        <td className="p-4 text-[#94A3B8] font-mono text-[11px]">{dept.parentName}</td>
                        <td className="p-4 text-[#F8FAFC]">{dept.headName}</td>
                        <td className="p-4">
                          <Badge variant={dept.status === 'Active' ? 'success' : 'neutral'}>
                            {dept.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openDeptModal('edit-dept', dept)}
                              className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#0052CC] hover:border-[#0052CC]/30 transition-all duration-200"
                              aria-label={`Edit ${dept.name}`}
                              title="Edit department"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleDeptStatus(dept.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                                dept.status === 'Active'
                                  ? 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20'
                                  : 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20'
                              }`}
                              aria-label={dept.status === 'Active' ? `Deactivate ${dept.name}` : `Activate ${dept.name}`}
                            >
                              {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : deptSearch ? (
            <EmptyState
              icon={Search}
              title="No Matching Departments"
              description={`No departments match "${deptSearch}". Try adjusting your search.`}
            />
          ) : (
            <EmptyState 
              title="No Departments Defined" 
              description="Register your structural hierarchy nodes to begin mapping hardware items and access rights."
              actionText="Add First Department"
              onActionClick={() => openDeptModal('add-dept')}
            />
          )}
        </div>
      )}

      {/* ==========================================
          2. ASSET CATEGORIES TAB
          ========================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-4" id="panel-categories" role="tabpanel">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">
              Managed Hardware Profiles ({categories.length})
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchBar
                value={catSearch}
                onChange={setCatSearch}
                placeholder="Search categories..."
                size="sm"
                className="flex-1 sm:w-52"
              />
              <button
                onClick={() => openCatModal('add-cat')}
                className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-3.5 h-9 rounded-[10px] flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#0052CC]/10 flex-shrink-0"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {filteredCats.length > 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155] text-[#94A3B8] font-bold select-none sticky top-0 z-10">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Warranty Period</th>
                      <th className="p-4">State</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {filteredCats.map((cat) => (
                      <tr key={cat.id} className="hover:bg-[#0F172A]/30 transition-colors group">
                        <td className="p-4 font-bold text-white group-hover:text-[#0052CC] transition-colors">{cat.name}</td>
                        <td className="p-4 text-[#94A3B8] max-w-xs truncate">{cat.description}</td>
                        <td className="p-4 text-[#F8FAFC] font-semibold">{cat.warranty}</td>
                        <td className="p-4">
                          <Badge variant={cat.status === 'Active' ? 'success' : 'neutral'}>
                            {cat.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openCatModal('edit-cat', cat)}
                              className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#0052CC] hover:border-[#0052CC]/30 transition-all duration-200"
                              aria-label={`Edit ${cat.name}`}
                              title="Edit category"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCat(cat.id)}
                              className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-all duration-200"
                              aria-label={`Delete ${cat.name}`}
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : catSearch ? (
            <EmptyState
              icon={Search}
              title="No Matching Categories"
              description={`No categories match "${catSearch}". Try adjusting your search.`}
            />
          ) : (
            <EmptyState 
              title="No Categories Defined" 
              description="Create profiles to group physical equipment by type, lifecycle duration, and support metrics."
              actionText="Add First Category"
              onActionClick={() => openCatModal('add-cat')}
            />
          )}
        </div>
      )}

      {/* ==========================================
          3. EMPLOYEE DIRECTORY TAB
          ========================================== */}
      {activeTab === 'employees' && (
        <div className="space-y-4" id="panel-employees" role="tabpanel">
          {/* RBAC Info Banner */}
          <InfoBanner variant="warning" title="Security Restriction Policy">
            Only Administrators can assign elevated roles. Modifying configurations or promoting privileges of user tokens inside this directory should be treated as a sensitive operational event.
          </InfoBanner>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">
              Corporate Directory Register ({employees.length} Users)
            </span>
            <SearchBar
              value={empSearch}
              onChange={setEmpSearch}
              placeholder="Search employees..."
              size="sm"
              className="w-full sm:w-52"
            />
          </div>

          {filteredEmps.length > 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155] text-[#94A3B8] font-bold select-none sticky top-0 z-10">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Work Email</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {filteredEmps.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#0F172A]/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center font-bold text-[#94A3B8] text-[10px]">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-bold text-white group-hover:text-[#0052CC] transition-colors">{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#94A3B8] font-mono text-[11px]">{emp.email}</td>
                        <td className="p-4 text-[#F8FAFC]">{emp.department}</td>
                        <td className="p-4">
                          <Badge variant={getRoleBadgeVariant(emp.role)} rounded={false}>
                            {emp.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => promoteRole(emp.id)}
                              className="p-1.5 rounded-lg bg-[#0052CC]/10 border border-[#0052CC]/30 text-[#0052CC] hover:bg-[#0052CC]/20 hover:text-[#2563EB] transition-all duration-200"
                              aria-label={`Promote ${emp.name}`}
                              title="Cycle role permissions"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleEmployeeStatus(emp.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                                emp.status === 'Active'
                                  ? 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20'
                                  : 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20'
                              }`}
                              aria-label={emp.status === 'Active' ? `Deactivate ${emp.name}` : `Activate ${emp.name}`}
                            >
                              {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : empSearch ? (
            <EmptyState
              icon={Search}
              title="No Matching Employees"
              description={`No employees match "${empSearch}". Try adjusting your search.`}
            />
          ) : (
            <EmptyState title="Directory Empty" description="No registered employees belong to this environment." />
          )}
        </div>
      )}

      {/* ==========================================
          MODALS -- DEPARTMENT FORM
          ========================================== */}
      <Modal
        isOpen={modalType === 'add-dept' || modalType === 'edit-dept'}
        onClose={closeModal}
        title={modalType === 'add-dept' ? 'Add New Department' : 'Edit Department Settings'}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold px-4 h-10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDept}
              className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 h-10 rounded-xl transition-colors"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form className="space-y-4">
          {formError && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-3 rounded-lg text-xs font-medium animate-fade-in" role="alert">
              {formError}
            </div>
          )}
          <div>
            <label htmlFor="dept-name" className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
              Department Name
            </label>
            <input
              id="dept-name"
              type="text"
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="e.g. Quality Assurance"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="dept-parent" className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
              Parent Department
            </label>
            <input
              id="dept-parent"
              type="text"
              value={deptForm.parentName}
              onChange={(e) => setDeptForm({ ...deptForm, parentName: e.target.value })}
              placeholder="None / Operations / Engineering"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="dept-head" className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
              Department Head (Assign Manager)
            </label>
            <input
              id="dept-head"
              type="text"
              value={deptForm.headName}
              onChange={(e) => setDeptForm({ ...deptForm, headName: e.target.value })}
              placeholder="e.g. David Miller"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200"
            />
          </div>
        </form>
      </Modal>

      {/* ==========================================
          MODALS -- CATEGORY FORM
          ========================================== */}
      <Modal
        isOpen={modalType === 'add-cat' || modalType === 'edit-cat'}
        onClose={closeModal}
        title={modalType === 'add-cat' ? 'Add New Category' : 'Edit Category Specifications'}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold px-4 h-10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCat}
              className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 h-10 rounded-xl transition-colors"
            >
              Save Definition
            </button>
          </>
        }
      >
        <form className="space-y-4">
          {formError && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-3 rounded-lg text-xs font-medium animate-fade-in" role="alert">
              {formError}
            </div>
          )}
          <div>
            <label htmlFor="cat-name" className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
              Category Title
            </label>
            <input
              id="cat-name"
              type="text"
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              placeholder="e.g. High Performance Tablets"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="cat-desc" className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
              General Description
            </label>
            <textarea
              id="cat-desc"
              value={catForm.description}
              onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              placeholder="Summarize profile uses..."
              rows={3}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 resize-none"
            />
          </div>
          <div>
            <label htmlFor="cat-warranty" className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
              Warranty & Support Coverage
            </label>
            <input
              id="cat-warranty"
              type="text"
              value={catForm.warranty}
              onChange={(e) => setCatForm({ ...catForm, warranty: e.target.value })}
              placeholder="e.g. 36 Months / 3 Years"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
