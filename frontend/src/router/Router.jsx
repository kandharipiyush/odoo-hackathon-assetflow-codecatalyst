import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Import existing page components
import AssetDirectory from '../pages/AssetDirectory';
import Bookings from '../pages/Bookings';
import Maintenance from '../pages/Maintenance';
import Dashboard from '../pages/Dashboard';
import OrgSetup from '../pages/OrgSetup';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// Import icons for fallbacks & mock screens
import { ShieldAlert } from 'lucide-react';

// ==========================================
// 1. BEATIFULLY MOCKED PAGES (FALLBACKS)
// ==========================================

// Mock pages removed - imported actual pages

const MockAllocation = () => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 max-w-4xl shadow-xl">
    <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Asset Allocation & Transfer</h2>
    <p className="text-[#94A3B8] mb-6">
      Issue, reassign, or release company hardware and tools to departments or individual employees.
    </p>
    <div className="bg-[#0F172A] p-6 rounded-lg border border-[#334155]">
      <p className="text-sm text-[#94A3B8]">
        Allocation controls are available for **Admin**, **Asset Manager**, and **Department Head** roles.
      </p>
    </div>
  </div>
);

const MockAudit = () => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 max-w-4xl shadow-xl">
    <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Physical Asset Auditing</h2>
    <p className="text-[#94A3B8] mb-6">
      Initiate periodic audits, upload scan sheets, and reconcile asset inventory discrepancies.
    </p>
    <div className="bg-[#0F172A] p-6 rounded-lg border border-[#334155]">
      <p className="text-sm text-[#94A3B8]">
        Auditing tools are restricted to **Admin** and **Asset Manager** roles.
      </p>
    </div>
  </div>
);

const MockReports = () => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 max-w-4xl shadow-xl">
    <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Reports & Financial Analytics</h2>
    <p className="text-[#94A3B8] mb-6">
      Monitor asset depreciation, cost centers, and hardware replacement cycles.
    </p>
    <div className="bg-[#0F172A] p-6 rounded-lg border border-[#334155]">
      <p className="text-sm text-[#94A3B8]">
        Analytical reporting is available for **Admin**, **Asset Manager**, and **Department Head** roles.
      </p>
    </div>
  </div>
);

const MockNotifications = () => {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 max-w-4xl shadow-xl">
      <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Notifications Panel</h2>
      <p className="text-[#94A3B8] mb-6">
        Keep track of asset schedules, warranty expirations, and repair updates.
      </p>
      <div className="space-y-3">
        <div className="bg-[#0F172A] p-4 rounded border-l-4 border-amber-500 flex justify-between">
          <div>
            <h4 className="font-semibold text-sm text-[#F8FAFC]">Asset Audit Due Soon</h4>
            <p className="text-xs text-[#94A3B8] mt-1">IT Equipment audit is scheduled for next Tuesday.</p>
          </div>
          <span className="text-[10px] text-[#94A3B8] self-center">2h ago</span>
        </div>
        <div className="bg-[#0F172A] p-4 rounded border-l-4 border-[#0052CC] flex justify-between">
          <div>
            <h4 className="font-semibold text-sm text-[#F8FAFC]">Booking Approved</h4>
            <p className="text-xs text-[#94A3B8] mt-1">Your request for Conference Room B has been accepted.</p>
          </div>
          <span className="text-[10px] text-[#94A3B8] self-center">1d ago</span>
        </div>
      </div>
    </div>
  );
};

const MockProfile = () => {
  const { user } = useAuth();
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 max-w-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Profile Settings</h2>
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-[#0052CC] text-[#F8FAFC] text-2xl font-bold flex items-center justify-center">
          {user?.name ? user.name.split(' ').map(n=>n[0]).join('') : 'U'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">{user?.name}</h3>
          <p className="text-[#94A3B8] text-sm">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-[#0052CC]/15 text-[#0052CC] border border-[#0052CC]/30 rounded-full text-xs font-semibold">
            {user?.role}
          </span>
        </div>
      </div>
      <div className="space-y-4 border-t border-[#334155] pt-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">User ID</span>
          <p className="text-sm font-mono text-[#F8FAFC]">{user?.id}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Assigned Permissions</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {user?.permissions && user.permissions.length > 0 ? (
              user.permissions.map((perm) => (
                <span key={perm} className="text-xs px-2 py-0.5 bg-[#334155] text-[#F8FAFC] rounded">
                  {perm}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#94A3B8] italic">No custom permissions assigned.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MockSettings = () => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 max-w-2xl shadow-xl">
    <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">System Settings</h2>
    <p className="text-[#94A3B8] mb-6">
      Admin settings, email server configurations, database log rotations, and security parameters.
    </p>
    <div className="bg-[#0F172A] p-6 rounded-lg border border-[#334155] text-center">
      <p className="text-sm text-[#94A3B8]">
        Settings are only accessible by users holding the **Admin** role.
      </p>
    </div>
  </div>
);

// ==========================================
// 2. MOCK LOGIN SCREEN (DEVELOPER SANDBOX)
// ==========================================

// Inline Mock Login removed - now uses page component

// ==========================================
// 3. UNAUTHORIZED SCREEN (ACCESS DENIED)
// ==========================================

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-[#F8FAFC] font-sans">
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
        
        {/* Decorative caution bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-red-500" />
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-6 mt-2">
          <ShieldAlert className="w-9 h-9" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-[#F8FAFC]">Access Denied</h2>
        <p className="text-[#94A3B8] text-sm mt-3.5 leading-relaxed">
          Your account role is not authorized to access this department console or settings resource. 
          Please contact your administrator if you require permissions elevation.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#0052CC] hover:bg-[#2563EB] text-[#F8FAFC] text-sm font-semibold py-2.5 rounded-lg shadow transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex-1 bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-semibold py-2.5 rounded-lg transition-all duration-150"
          >
            Logout / Switch Accounts
          </button>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN ROUTER WRAPPER
// ==========================================

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Dashboard Shell Routes */}
        <Route element={<ProtectedRoute />}>
          
          {/* Dashboard Overview */}
          <Route path="/" element={
            <DashboardLayout title="Dashboard Overview">
              <Dashboard />
            </DashboardLayout>
          } />

          {/* Org Setup - Restricted to Admin */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/org-setup" element={
              <DashboardLayout title="Organization Setup">
                <OrgSetup />
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout title="System Settings">
                <MockSettings />
              </DashboardLayout>
            } />
          </Route>

          {/* Assets Registry - Restricted to Admin, Asset Manager, and Dept Head */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Asset Manager', 'Department Head']} />}>
            <Route path="/assets" element={
              <DashboardLayout title="Asset Registry">
                <AssetDirectory />
              </DashboardLayout>
            } />
            <Route path="/allocation" element={
              <DashboardLayout title="Asset Allocations">
                <MockAllocation />
              </DashboardLayout>
            } />
            <Route path="/maintenance" element={
              <DashboardLayout title="Maintenance Management">
                <Maintenance />
              </DashboardLayout>
            } />
            <Route path="/reports" element={
              <DashboardLayout title="Reports & Analytics">
                <MockReports />
              </DashboardLayout>
            } />
          </Route>

          {/* Auditing - Restricted to Admin and Asset Manager */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Asset Manager']} />}>
            <Route path="/audit" element={
              <DashboardLayout title="Asset Auditing">
                <MockAudit />
              </DashboardLayout>
            } />
          </Route>

          {/* Resource Bookings - Available to all authenticated users */}
          <Route path="/bookings" element={
            <DashboardLayout title="Resource Bookings">
              <Bookings />
            </DashboardLayout>
          } />

          {/* Notifications - Available to all authenticated users */}
          <Route path="/notifications" element={
            <DashboardLayout title="Smart Notifications">
              <MockNotifications />
            </DashboardLayout>
          } />

          {/* Profile & Settings - Available to all authenticated users */}
          <Route path="/profile" element={
            <DashboardLayout title="Profile Settings">
              <MockProfile />
            </DashboardLayout>
          } />

          {/* Unauthorized page inside layout to retain sidebar structure */}
          <Route path="/unauthorized" element={
            <DashboardLayout title="Access Restricted">
              <Unauthorized />
            </DashboardLayout>
          } />

        </Route>

        {/* 404 Fallback - Redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;
