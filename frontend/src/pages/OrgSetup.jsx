import React, { useState } from 'react';
import { 
  Building2, 
  Tag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  AlertTriangle, 
  UserCheck, 
  X,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function OrgSetup() {
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' | 'categories' | 'employees'

  // ==========================================
  // LOCAL MOCK STATE DATA (FOR HIGHER UX)
  // ==========================================
  
  // 1. Departments State
  const [departments, setDepartments] = useState([
    { id: 'dept-1', name: 'Engineering', parentName: 'None', headName: 'Alex Carter', status: 'Active' },
    { id: 'dept-2', name: 'IT Support', parentName: 'Operations', headName: 'David Miller', status: 'Active' },
    { id: 'dept-3', name: 'Marketing', parentName: 'None', headName: 'Sarah Jenkins', status: 'Active' },
    { id: 'dept-4', name: 'Human Resources', parentName: 'Operations', headName: 'Jane Watson', status: 'Active' },
    { id: 'dept-5', name: 'Finance & Legal', parentName: 'None', headName: 'Donald Sterling', status: 'Inactive' }
  ]);

  // 2. Asset Categories State
  const [categories, setCategories] = useState([
    { id: 'cat-1', name: 'Laptops', description: 'Enterprise-grade work notebooks', warranty: '36 Months', status: 'Active' },
    { id: 'cat-2', name: 'Monitors', description: 'Dual Display configurations', warranty: '24 Months', status: 'Active' },
    { id: 'cat-3', name: 'Network Hardware', description: 'Cisco switches, routers, and hubs', warranty: '60 Months', status: 'Active' },
    { id: 'cat-4', name: 'Office Furniture', description: 'Ergonomic desks and chairs', warranty: '12 Months', status: 'Active' },
    { id: 'cat-5', name: 'AV Equipment', description: 'Projectors, speakers, and cameras', warranty: '12 Months', status: 'Inactive' }
  ]);

  // 3. Employee Directory State
  const [employees, setEmployees] = useState([
    { id: 'emp-1', name: 'Alex Carter', email: 'admin@company.com', department: 'Engineering', role: 'Admin', status: 'Active' },
    { id: 'emp-2', name: 'Sarah Jenkins', email: 'manager@company.com', department: 'Marketing', role: 'Asset Manager', status: 'Active' },
    { id: 'emp-3', name: 'David Miller', email: 'head@company.com', department: 'IT Support', role: 'Department Head', status: 'Active' },
    { id: 'emp-4', name: 'John Doe', email: 'employee@company.com', department: 'Engineering', role: 'Employee', status: 'Active' },
    { id: 'emp-5', name: 'Jane Watson', email: 'jane@company.com', department: 'Human Resources', role: 'Employee', status: 'Active' },
    { id: 'emp-6', name: 'Alice Cooper', email: 'alice@company.com', department: 'Finance & Legal', role: 'Employee', status: 'Inactive' }
  ]);

  // ==========================================
  // MODAL & FORM STATE
  // ==========================================
  const [modalType, setModalType] = useState(null); // 'add-dept' | 'edit-dept' | 'add-cat' | 'edit-cat'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form Fields State
  const [deptForm, setDeptForm] = useState({ name: '', parentName: '', headName: '', status: 'Active' });
  const [catForm, setCatForm] = useState({ name: '', description: '', warranty: '', status: 'Active' });

  // Open modals helper
  const openDeptModal = (type, item = null) => {
    setModalType(type);
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
    if (item) {
      setSelectedItem(item);
      setCatForm({ ...item });
    } else {
      setSelectedItem(null);
      setCatForm({ name: '', description: '', warranty: '12 Months', status: 'Active' });
    }
  };

  // Close modals
  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  // ==========================================
  // ACTIONS / MUTATORS
  // ==========================================

  // Departments CRUD
  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!deptForm.name.trim() || !deptForm.headName.trim()) {
      alert("Name and Department Head are required.");
      return;
    }

    if (modalType === 'add-dept') {
      const newDept = {
        id: `dept-${Date.now()}`,
        ...deptForm
      };
      setDepartments([...departments, newDept]);
    } else if (modalType === 'edit-dept' && selectedItem) {
      setDepartments(departments.map(d => d.id === selectedItem.id ? { ...d, ...deptForm } : d));
    }
    closeModal();
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
  const handleSaveCat = (e) => {
    e.preventDefault();
    if (!catForm.name.trim() || !catForm.warranty.trim()) {
      alert("Name and Warranty period are required.");
      return;
    }

    if (modalType === 'add-cat') {
      const newCat = {
        id: `cat-${Date.now()}`,
        ...catForm
      };
      setCategories([...categories, newCat]);
    } else if (modalType === 'edit-cat' && selectedItem) {
      setCategories(categories.map(c => c.id === selectedItem.id ? { ...c, ...catForm } : c));
    }
    closeModal();
  };

  const handleDeleteCat = (id) => {
    if (window.confirm("Are you sure you want to delete this asset category?")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Employee actions (RBAC)
  const promoteRole = (id) => {
    const roles = ['Employee', 'Department Head', 'Asset Manager', 'Admin'];
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const nextIdx = (roles.indexOf(emp.role) + 1) % roles.length;
        return { ...emp, role: roles[nextIdx] };
      }
      return emp;
    }));
  };

  const toggleEmployeeStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        return { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return emp;
    }));
  };

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Organization Setup</h2>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Configure branches, structural groups, asset definitions, and employee privileges.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#334155] space-x-1.5 p-1 bg-[#111827]/40 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTab === 'departments'
              ? 'bg-[#0052CC] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Departments</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTab === 'categories'
              ? 'bg-[#0052CC] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Asset Categories</span>
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTab === 'employees'
              ? 'bg-[#0052CC] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee Directory</span>
        </button>
      </div>

      {/* ==========================================
          1. DEPARTMENTS TAB
          ========================================== */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">
              Configured Department Nodes ({departments.length})
            </span>
            <button
              onClick={() => openDeptModal('add-dept')}
              className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-3 py-2 rounded-[10px] flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] shadow-md shadow-[#0052CC]/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          {departments.length > 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155] text-[#94A3B8] font-bold select-none">
                      <th className="p-4">Department Name</th>
                      <th className="p-4">Parent Structure</th>
                      <th className="p-4">Department Head</th>
                      <th className="p-4">Operational Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-[#0F172A]/30 transition-colors group">
                        <td className="p-4 font-bold text-white group-hover:text-[#0052CC] transition-colors">{dept.name}</td>
                        <td className="p-4 text-[#94A3B8] font-mono">{dept.parentName}</td>
                        <td className="p-4 text-[#F8FAFC]">{dept.headName}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                            dept.status === 'Active'
                              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                              : 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30'
                          }`}>
                            {dept.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openDeptModal('edit-dept', dept)}
                            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#0052CC] hover:border-[#0052CC]/30 transition-all duration-150"
                            title="Edit node"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleDeptStatus(dept.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all duration-150 ${
                              dept.status === 'Active'
                                ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/25'
                                : 'bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/25'
                            }`}
                          >
                            {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">
              Managed Hardware Profiles ({categories.length})
            </span>
            <button
              onClick={() => openCatModal('add-cat')}
              className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-3 py-2 rounded-[10px] flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] shadow-md shadow-[#0052CC]/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155] text-[#94A3B8] font-bold select-none">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Warranty Period</th>
                      <th className="p-4">State</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-[#0F172A]/30 transition-colors group">
                        <td className="p-4 font-bold text-white group-hover:text-[#0052CC] transition-colors">{cat.name}</td>
                        <td className="p-4 text-[#94A3B8] max-w-xs truncate">{cat.description}</td>
                        <td className="p-4 text-[#F8FAFC] font-semibold">{cat.warranty}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                            cat.status === 'Active'
                              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                              : 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30'
                          }`}>
                            {cat.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openCatModal('edit-cat', cat)}
                            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#0052CC] hover:border-[#0052CC]/30 transition-all duration-150"
                            title="Edit definition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCat(cat.id)}
                            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-all duration-150"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
        <div className="space-y-4">
          {/* RBAC Warnings Banner */}
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-white p-4 rounded-[16px] text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
            <div>
              <span className="font-bold text-[#F8FAFC]">Security Restriction Policy:</span>
              <p className="text-[#94A3B8] mt-1 leading-relaxed">
                Only Administrators can assign elevated roles. Modifying configurations or promoting privileges of user tokens inside this directory should be treated as a sensitive operational event.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">
              Corporate Directory Register ({employees.length} Users)
            </span>
          </div>

          {employees.length > 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155] text-[#94A3B8] font-bold select-none">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Work Email</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#0F172A]/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            {/* Avatar */}
                            <div className="w-7 h-7 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center font-bold text-[#94A3B8] text-[10px]">
                              {emp.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <span className="font-bold text-white group-hover:text-[#0052CC] transition-colors">{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#94A3B8] font-mono">{emp.email}</td>
                        <td className="p-4 text-[#F8FAFC]">{emp.department}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            emp.role === 'Admin' 
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' 
                              : emp.role === 'Asset Manager' 
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : emp.role === 'Department Head'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                          }`}>
                            {emp.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                            emp.status === 'Active'
                              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                              : 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => promoteRole(emp.id)}
                            className="bg-[#0052CC]/10 border border-[#0052CC]/30 hover:bg-[#0052CC]/25 text-[#0052CC] hover:text-[#2563EB] text-[10px] font-bold px-2 py-1.5 rounded-lg transition-all duration-150"
                            title="Cycle permissions"
                          >
                            Promote
                          </button>
                          <button
                            onClick={() => toggleEmployeeStatus(emp.id)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-150 ${
                              emp.status === 'Active'
                                ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/25'
                                : 'bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/25'
                            }`}
                          >
                            {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState title="Directory Empty" description="No registered employees belong to this environment." />
          )}
        </div>
      )}

      {/* ==========================================
          MODALS -- DEPARTMENT FORM
          ========================================== */}
      {(modalType === 'add-dept' || modalType === 'edit-dept') && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#334155]">
              <h4 className="text-sm font-bold text-white">
                {modalType === 'add-dept' ? 'Add New Department' : 'Edit Department Settings'}
              </h4>
              <button onClick={closeModal} className="text-[#94A3B8] hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
                  Department Name
                </label>
                <input
                  type="text"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Quality Assurance"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
                  Parent Department
                </label>
                <input
                  type="text"
                  value={deptForm.parentName}
                  onChange={(e) => setDeptForm({ ...deptForm, parentName: e.target.value })}
                  placeholder="None / Operations / Engineering"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
                  Department Head (Assign Manager)
                </label>
                <input
                  type="text"
                  value={deptForm.headName}
                  onChange={(e) => setDeptForm({ ...deptForm, headName: e.target.value })}
                  placeholder="e.g. David Miller"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#334155] mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold px-4 py-2.5 rounded-[12px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-[12px] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          MODALS -- CATEGORY FORM
          ========================================== */}
      {(modalType === 'add-cat' || modalType === 'edit-cat') && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#334155]">
              <h4 className="text-sm font-bold text-white">
                {modalType === 'add-cat' ? 'Add New Category' : 'Edit Category Specifications'}
              </h4>
              <button onClick={closeModal} className="text-[#94A3B8] hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
                  Category Title
                </label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. High Performance Tablets"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
                  General Description
                </label>
                <textarea
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Summarize profile uses..."
                  rows={3}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30 transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-1.5">
                  Warranty & Support Coverage
                </label>
                <input
                  type="text"
                  value={catForm.warranty}
                  onChange={(e) => setCatForm({ ...catForm, warranty: e.target.value })}
                  placeholder="e.g. 36 Months / 3 Years"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#334155] mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold px-4 py-2.5 rounded-[12px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-[12px] transition-colors"
                >
                  Save Definition
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
