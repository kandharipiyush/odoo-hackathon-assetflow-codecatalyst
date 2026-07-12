import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  Package,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  TrendingUp,
  Building,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import DashboardLayout from './layouts/DashboardLayout';

// Mock KPI Card Component
function KpiCard({ title, value, change, icon: Icon, color, footnote }) {
  return (
    <div className="bg-card-bg border border-border-color p-6 rounded-card shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium text-text-secondary">{title}</span>
        <div className={`p-2.5 rounded-btn bg-main-bg border border-border-color text-${color} group-hover:brightness-110 transition-all duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-[32px] font-semibold text-text-primary tracking-tight leading-none">
          {value}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span className={`inline-flex items-center gap-1 text-[13px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {change}
            </span>
          )}
          <span className="text-[13px] text-text-secondary">{footnote}</span>
        </div>
      </div>
    </div>
  );
}

// Mock Dashboard Page Content
function MockDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome section */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium text-brand uppercase tracking-wider">Operational Overview</span>
        <p className="text-[15px] text-text-secondary">Welcome back, Alex. Here is a summary of the enterprise assets and bookings today.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Assets Registered"
          value="1,284"
          change="+4.2%"
          icon={Package}
          color="brand"
          footnote="vs last month"
        />
        <KpiCard
          title="Active Resource Bookings"
          value="42"
          change=""
          icon={CalendarDays}
          color="warning"
          footnote="12 pending approval"
        />
        <KpiCard
          title="Pending Maintenance"
          value="8"
          change=""
          icon={Wrench}
          color="danger"
          footnote="3 marked as urgent"
        />
        <KpiCard
          title="Audit Compliance"
          value="98.2%"
          change="+0.5%"
          icon={ClipboardCheck}
          color="success"
          footnote="Last audited 2d ago"
        />
      </div>

      {/* Main Grid: Activities & Utilization */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Activity Table */}
        <div className="xl:col-span-2 bg-card-bg border border-border-color rounded-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-border-color">
            <h3 className="text-[20px] font-semibold text-text-primary">Recent Asset Activities</h3>
            <Link to="/assets" className="inline-flex items-center gap-1.5 text-[14px] text-brand hover:text-brand-hover font-semibold transition-colors duration-200">
              View all Registry
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-color text-text-secondary text-[13px] uppercase tracking-wider font-semibold">
                  <th className="pb-3.5 font-semibold">Asset ID</th>
                  <th className="pb-3.5 font-semibold">Asset Name</th>
                  <th className="pb-3.5 font-semibold">Department</th>
                  <th className="pb-3.5 font-semibold">User</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-[15px] divide-y divide-border-color/45">
                <tr className="text-text-primary hover:bg-hover-bg/30 transition-colors">
                  <td className="py-4 font-medium text-text-secondary">AST-2094</td>
                  <td className="py-4 font-medium">MacBook Pro M3 Max</td>
                  <td className="py-4 text-text-secondary">Engineering</td>
                  <td className="py-4 text-text-secondary">Sarah Connor</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success">
                      Allocated
                    </span>
                  </td>
                </tr>
                <tr className="text-text-primary hover:bg-hover-bg/30 transition-colors">
                  <td className="py-4 font-medium text-text-secondary">AST-4831</td>
                  <td className="py-4 font-medium">Dell XPS 15 9530</td>
                  <td className="py-4 text-text-secondary">Product Design</td>
                  <td className="py-4 text-text-secondary">Marcus Aurelius</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/15 text-warning">
                      Transferring
                    </span>
                  </td>
                </tr>
                <tr className="text-text-primary hover:bg-hover-bg/30 transition-colors">
                  <td className="py-4 font-medium text-text-secondary">AST-1033</td>
                  <td className="py-4 font-medium">iPad Pro 12.9"</td>
                  <td className="py-4 text-text-secondary">Marketing</td>
                  <td className="py-4 text-text-secondary">Amelia Earhart</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/15 text-brand">
                      Reserved
                    </span>
                  </td>
                </tr>
                <tr className="text-text-primary hover:bg-hover-bg/30 transition-colors">
                  <td className="py-4 font-medium text-text-secondary">AST-8821</td>
                  <td className="py-4 font-medium">ThinkPad P16 Gen 2</td>
                  <td className="py-4 text-text-secondary">Data Analytics</td>
                  <td className="py-4 text-text-secondary">Isaac Newton</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger/15 text-danger">
                      Maintenance
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Quick Stats / Logs */}
        <div className="bg-card-bg border border-border-color rounded-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[20px] font-semibold text-text-primary pb-5 border-b border-border-color">
              Resource Occupancy
            </h3>
            
            {/* Occupancy bars list */}
            <div className="space-y-5 mt-6">
              <div>
                <div className="flex justify-between text-[14px] font-medium text-text-primary mb-1">
                  <span>Executive Conference Room</span>
                  <span className="text-text-secondary">85%</span>
                </div>
                <div className="w-full h-2 bg-main-bg rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[14px] font-medium text-text-primary mb-1">
                  <span>Development Labs Hardware</span>
                  <span className="text-text-secondary">62%</span>
                </div>
                <div className="w-full h-2 bg-main-bg rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[14px] font-medium text-text-primary mb-1">
                  <span>Testing Mobiles Pool</span>
                  <span className="text-text-secondary">40%</span>
                </div>
                <div className="w-full h-2 bg-main-bg rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-color">
            <div className="flex items-center gap-3 p-3 rounded-btn bg-main-bg/60 border border-border-color/70">
              <ShieldCheck className="w-5 h-5 text-success flex-shrink-0" />
              <div className="text-[13px] text-text-secondary">
                <span className="font-semibold text-text-primary">System Integrity secure.</span> Last sync with central database was 3 minutes ago.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Mock Page Wrapper Component
function MockPagePlaceholder({ title, description, icon: Icon, stats }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium text-brand uppercase tracking-wider">Module Shell</span>
        <p className="text-[15px] text-text-secondary">{description}</p>
      </div>

      {/* Inner Area Container */}
      <div className="bg-card-bg border border-border-color rounded-card p-8 min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm">
        <div className="p-4 rounded-full bg-main-bg border border-border-color mb-4 text-brand">
          <Icon className="w-10 h-10" />
        </div>
        <h2 className="text-[20px] font-semibold text-text-primary">{title} Module</h2>
        <p className="text-[15px] text-text-secondary max-w-md mt-2">
          This workspace belongs to Member 4. The Sidebar navigation and overall shell layout parameters have been registered. The frontend router is fully operational.
        </p>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
            {stats.map((s, idx) => (
              <div key={idx} className="bg-main-bg border border-border-color/80 p-4 rounded-btn">
                <span className="block text-[13px] text-text-secondary font-medium">{s.label}</span>
                <span className="block text-[20px] font-semibold text-text-primary mt-1">{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Main Dashboard Layout Group */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <MockDashboard />
            </DashboardLayout>
          }
        />
        
        <Route
          path="/org-setup"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Organization Setup"
                description="Manage departments, categories, site allocations and roles."
                icon={Building}
                stats={[
                  { label: "Departments", value: "8 Active" },
                  { label: "Active Roles", value: "4 Defined" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/assets"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Asset Registry"
                description="Register new hardware, track active leases and lifecycles."
                icon={Package}
                stats={[
                  { label: "Total Asset Value", value: "$450,290" },
                  { label: "Available Stock", value: "318 Units" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/allocation"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Allocation & Transfer"
                description="Monitor device assignments and department transfers."
                icon={TrendingUp}
                stats={[
                  { label: "Pending Transfers", value: "4 Requests" },
                  { label: "Completed Today", value: "19 Transfers" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/bookings"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Resource Booking"
                description="Schedule shared meeting rooms, testing pools, and visual assets."
                icon={CalendarDays}
                stats={[
                  { label: "Active Bookings", value: "42 Rooms" },
                  { label: "Conflicts Resolved", value: "0 Conflict" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/maintenance"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Maintenance Management"
                description="Submit hardware repair orders, assign tickets, and audit equipment state."
                icon={Wrench}
                stats={[
                  { label: "Open Tickets", value: "8 Issues" },
                  { label: "Avg Resolution", value: "24.5 Hours" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/audit"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Asset Audit"
                description="Schedule periodic device validation checklists and verify locations."
                icon={ClipboardCheck}
                stats={[
                  { label: "Next Audit Period", value: "Aug 1st" },
                  { label: "Discrepancy Rate", value: "0.18%" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Reports & Analytics"
                description="Download compliance spreadsheets, view utilization logs, and export PDFs."
                icon={TrendingUp}
                stats={[
                  { label: "Scheduled Reports", value: "Weekly" },
                  { label: "Total Downloads", value: "148 Exports" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="Notifications"
                description="Smart alerts, auto escalation reports, and allocation reminders."
                icon={Clock}
                stats={[
                  { label: "Unread Alerts", value: "3 New" },
                  { label: "Total Logged Events", value: "1,209" }
                ]}
              />
            </DashboardLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <MockPagePlaceholder
                title="My Profile"
                description="Manage personal credentials, preferences, and notifications."
                icon={ShieldCheck}
                stats={[
                  { label: "Role Authority", value: "Full Admin" },
                  { label: "Security Level", value: "Tier 1" }
                ]}
              />
            </DashboardLayout>
          }
        />

        {/* Fallback default route */}
        <Route
          path="*"
          element={
            <DashboardLayout>
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <h2 className="text-[30px] font-semibold text-text-primary">404 - Page Not Found</h2>
                <Link to="/" className="text-brand hover:text-brand-hover mt-4 font-semibold text-[15px]">
                  Return to Dashboard
                </Link>
              </div>
            </DashboardLayout>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
