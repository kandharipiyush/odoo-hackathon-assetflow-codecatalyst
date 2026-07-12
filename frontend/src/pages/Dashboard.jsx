import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  CheckCircle2, 
  Package, 
  Wrench, 
  Calendar, 
  GitPullRequest, 
  CornerDownLeft, 
  TrendingUp,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import AlertBanner from '../components/dashboard/AlertBanner';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SearchBar from '../components/common/SearchBar';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Simulated loading state for skeleton experience
  const [isLoading, setIsLoading] = useState(true);

  // Search query — stub for future asset/booking/maintenance filtering
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dashboard mock metrics
  const [metrics] = useState({
    assetsAvailable: 842,
    assetsAllocated: 384,
    maintenanceToday: 5,
    activeBookings: 18,
    pendingTransfers: 12,
    upcomingReturns: 7,
  });

  // Mock system alert values (dismissible / inspectable)
  const [alerts] = useState({
    overdueCount: 4,
    criticalMaintenanceCount: 2,
    pendingApprovalsCount: 3,
  });

  // Confirm dialog state (replaces native alert())
  const [dialogState, setDialogState] = useState({ isOpen: false, title: '', message: '' });

  // Recent system log actions
  const [activities] = useState([
    {
      id: 'act-1',
      userName: 'Alex Carter',
      type: 'audit',
      message: 'Completed IT Equipment physical inventory audit (Marketing Dept).',
      timestamp: '10m ago',
    },
    {
      id: 'act-2',
      userName: 'John Doe',
      type: 'create',
      message: 'Booked MacBook Pro 16" (Room B, Project Apollo).',
      timestamp: '45m ago',
    },
    {
      id: 'act-3',
      userName: 'Sarah Jenkins',
      type: 'edit',
      message: 'Sent Dell UltraSharp Monitor #827 to Maintenance for backlight replacement.',
      timestamp: '2h ago',
    },
    {
      id: 'act-4',
      userName: 'David Miller',
      type: 'transfer',
      message: 'Approved Transfer Request #1084 (iPad Pro 12.9" → Engineering).',
      timestamp: 'Yesterday',
    },
    {
      id: 'act-5',
      userName: 'Jane Watson',
      type: 'create',
      message: 'Registered new asset: Cisco Catalyst Switch (SN: 92849204).',
      timestamp: '2 days ago',
    },
  ]);

  // Formatted date string — computed once on mount, never stale within a session
  const currentDateString = useMemo(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }, []);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Handle resolving or inspecting system alerts — uses styled dialog instead of alert()
  const handleResolveAlert = (type) => {
    const alertDetails = {
      overdue: {
        title: 'Overdue Asset Returns',
        message: '• Laptop-194 (John Doe) — overdue by 4 days\n• iPad-829 (Sarah Jenkins) — overdue by 2 days\n• Camera-012 (IT Dept) — overdue by 7 days\n• Phone-291 (Marketing Dept) — overdue by 3 days',
      },
      maintenance: {
        title: 'Critical Maintenance Tickets',
        message: '1. Server Room A Cooling Fan malfunction — CRITICAL\n2. Office Router backup power battery failure — HIGH',
      },
      approvals: {
        title: 'Pending Transfer Approvals',
        message: '1. Macbook M2 Max — Engineering → HR\n2. Test iPad Air — QA → David Miller\n3. Wacom Tablet — Design → John Doe',
      },
    };

    const detail = alertDetails[type];
    if (detail) {
      setDialogState({ isOpen: true, title: detail.title, message: detail.message });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 text-[#F8FAFC] animate-fade-in">
        <LoadingSkeleton type="card" rows={1} columns={1} />
        <LoadingSkeleton type="stat" rows={6} />
        <LoadingSkeleton type="card" rows={4} columns={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" rows={1} columns={1} />
          <LoadingSkeleton type="card" rows={1} columns={1} />
          <LoadingSkeleton type="activity" rows={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#F8FAFC] animate-fade-in">
      
      {/* Confirm Dialog — replaces native alert() */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, title: '', message: '' })}
        title={dialogState.title}
        message={dialogState.message}
        variant="info"
        cancelText="Close"
      />

      {/* 1. Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-sm">
        <div>
          <h2 className="text-[30px] font-bold text-white tracking-tight leading-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Operator'}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1.5 font-medium flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
            {currentDateString} • System Active
          </p>
        </div>

        {/* Global Dashboard Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search assets, maintenance, bookings..."
          size="sm"
          className="max-w-xs w-full"
        />
      </div>

      {/* 2. Alert Banner Panel */}
      <AlertBanner
        overdueCount={alerts.overdueCount}
        criticalMaintenanceCount={alerts.criticalMaintenanceCount}
        pendingApprovalsCount={alerts.pendingApprovalsCount}
        onResolveAction={handleResolveAlert}
      />

      {/* 3. KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Available"
          value={metrics.assetsAvailable}
          icon={CheckCircle2}
          trend="+14 new this week"
          trendType="positive"
          badgeText="Healthy"
          badgeColor="green"
        />
        <StatCard
          title="Allocated"
          value={metrics.assetsAllocated}
          icon={Package}
          trend="+4.2% allocation index"
          trendType="positive"
          badgeText="Active"
          badgeColor="blue"
        />
        <StatCard
          title="Maintenance"
          value={metrics.maintenanceToday}
          icon={Wrench}
          trend="2 completed today"
          trendType="neutral"
          badgeText="Active"
          badgeColor="amber"
        />
        <StatCard
          title="Active Bookings"
          value={metrics.activeBookings}
          icon={Calendar}
          trend="4 scheduled tomorrow"
          trendType="positive"
          badgeText="Allocated"
          badgeColor="blue"
        />
        <StatCard
          title="Transfers"
          value={metrics.pendingTransfers}
          icon={GitPullRequest}
          trend="-2 resolved yesterday"
          trendType="positive"
          badgeText="Review"
          badgeColor="amber"
        />
        <StatCard
          title="Returns"
          value={metrics.upcomingReturns}
          icon={CornerDownLeft}
          trend="3 scheduled today"
          trendType="neutral"
          badgeText="Due"
          badgeColor="amber"
        />
      </div>

      {/* 4. Quick Actions Panel */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-widest text-[#94A3B8] font-bold">
          Workspace Quick Operations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Register Asset"
            description="Log new hardware items, upload barcode tags, and configure specifications."
            icon={Package}
            to="/assets"
            colorScheme="blue"
            badgeText="Admin/Manager"
          />
          <QuickActionCard
            title="Book Resource"
            description="Reserve shared test devices, project laptops, vehicles, or workspace hubs."
            icon={Calendar}
            to="/bookings"
            colorScheme="green"
            badgeText="All Roles"
          />
          <QuickActionCard
            title="Raise Maintenance"
            description="Create repair tickets, report malfunctioned gear, and check service status."
            icon={Wrench}
            to="/maintenance"
            colorScheme="amber"
            badgeText="Asset Users"
          />
          <QuickActionCard
            title="View Reports"
            description="Examine cost distributions, depreciation tables, and physical audit summaries."
            icon={TrendingUp}
            to="/reports"
            colorScheme="blue"
            badgeText="Executive"
          />
        </div>
      </div>

      {/* 5. Chart Dashboards & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Card 1: Asset Utilization */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC]">Asset Utilization</h4>
            <p className="text-xs text-[#94A3B8] mt-0.5">Allocation density by hardware category</p>
            
            {/* Utilization Bars */}
            <div className="space-y-4 mt-6">
              {[
                { category: 'Laptops & Workstations', percentage: 92, count: '312/340', color: '#0052CC' },
                { category: 'Monitors & Displays', percentage: 84, count: '420/500', color: '#3B82F6' },
                { category: 'Network Switches', percentage: 70, count: '35/50', color: '#22C55E' },
                { category: 'Conference Equipment', percentage: 55, count: '44/80', color: '#A855F7' },
                { category: 'Test Mobile Devices', percentage: 40, count: '60/150', color: '#F59E0B' },
              ].map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-[#F8FAFC]">{item.category}</span>
                    <span className="text-[#94A3B8]">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#0F172A] rounded-full h-2 overflow-hidden border border-[#334155]">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-[#94A3B8] mt-6 pt-4 border-t border-[#334155]/60 flex items-center justify-between">
            <span>Overall Capacity: 81.3%</span>
            <span className="font-semibold text-emerald-500">Optimized</span>
          </div>
        </div>

        {/* Chart Card 2: Maintenance Trends */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC]">Maintenance Trend</h4>
            <p className="text-xs text-[#94A3B8] mt-0.5">Resolved repair tickets (last 6 months)</p>
            
            {/* SVG Line Graph */}
            <div className="mt-8 flex justify-center items-center relative">
              <svg className="w-full h-32" viewBox="0 0 300 120" aria-label="Maintenance trend chart showing resolved tickets over 6 months">
                {/* Background Grid Lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                
                {/* SVG Area Path Gradient */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0052CC" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0052CC" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Graph Path Area */}
                <path 
                  d="M 10 100 L 60 75 L 110 88 L 160 50 L 210 65 L 260 30 L 260 110 L 10 110 Z" 
                  fill="url(#chartGradient)" 
                />

                {/* Graph Line Path */}
                <path 
                  d="M 10 100 L 60 75 L 110 88 L 160 50 L 210 65 L 260 30" 
                  fill="none" 
                  stroke="#0052CC" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                <circle cx="10" cy="100" r="3.5" fill="#1E293B" stroke="#0052CC" strokeWidth="2" />
                <circle cx="60" cy="75" r="3.5" fill="#1E293B" stroke="#0052CC" strokeWidth="2" />
                <circle cx="110" cy="88" r="3.5" fill="#1E293B" stroke="#0052CC" strokeWidth="2" />
                <circle cx="160" cy="50" r="3.5" fill="#1E293B" stroke="#0052CC" strokeWidth="2" />
                <circle cx="210" cy="65" r="3.5" fill="#1E293B" stroke="#0052CC" strokeWidth="2" />
                <circle cx="260" cy="30" r="4.5" fill="#22C55E" stroke="#1E293B" strokeWidth="2" />

                {/* Y-axis values */}
                <text x="275" y="33" fill="#94A3B8" fontSize="8" fontWeight="bold">24</text>
                <text x="275" y="63" fill="#94A3B8" fontSize="8">12</text>
                <text x="275" y="103" fill="#94A3B8" fontSize="8">0</text>
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between px-1 text-[9px] text-[#94A3B8] font-bold mt-2">
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
            </div>
          </div>

          <div className="text-[10px] text-[#94A3B8] mt-6 pt-4 border-t border-[#334155]/60 flex items-center justify-between">
            <span>Critical response rate: 98%</span>
            <span className="font-semibold text-emerald-500">Excellent</span>
          </div>
        </div>

        {/* Column 3: Recent Activity Timeline */}
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
