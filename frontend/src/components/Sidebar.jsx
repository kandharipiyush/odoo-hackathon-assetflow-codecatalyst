import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowRightLeft,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  CircleUser,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Navigation items definition to ensure DRY code
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Organization Setup', path: '/org-setup', icon: Building2 },
  { name: 'Assets', path: '/assets', icon: Package },
  { name: 'Allocation & Transfer', path: '/allocation', icon: ArrowRightLeft },
  { name: 'Resource Booking', path: '/bookings', icon: CalendarDays },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Audit', path: '/audit', icon: ClipboardCheck },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell, badgeCount: 3 }
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();

  // Helper to determine if a route is active
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between bg-sidebar-bg border-r border-border-color transition-all duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px]'}
          w-[280px]
        `}
      >
        {/* Top Logo Section */}
        <div>
          <div className={`flex items-center justify-between h-[72px] px-6 border-b border-border-color ${isCollapsed ? 'md:px-4 md:justify-center' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-brand text-text-primary flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 transition-opacity duration-200">
                  <span className="font-semibold text-text-primary text-[18px] tracking-tight leading-tight">
                    AssetFlow
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-text-secondary font-medium">
                    Enterprise
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button (Tablet/Desktop only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-6 h-6 rounded-full border border-border-color bg-card-bg text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links Area */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item.path);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-btn text-sidebar text-[15px] font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-brand
                    ${active 
                      ? 'bg-brand text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg hover:scale-[1.02]'
                    }
                    ${isCollapsed ? 'md:justify-center md:px-0 md:h-12' : ''}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-[20px] h-[20px] flex-shrink-0 transition-colors duration-200 ${
                      active ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  
                  {/* Badge Alert */}
                  {item.badgeCount && !isCollapsed && (
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full min-w-[20px] ${
                      active ? 'bg-text-primary text-brand' : 'bg-danger text-text-primary'
                    }`}>
                      {item.badgeCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions Section */}
        <div className="p-4 border-t border-border-color bg-sidebar-bg">
          <div className={`flex flex-col gap-3 ${isCollapsed ? 'md:items-center' : ''}`}>
            
            {/* User Profile Card */}
            <div className={`flex items-center gap-3 p-2 rounded-card bg-card-bg/40 border border-border-color/50 ${isCollapsed ? 'md:p-0 md:bg-transparent md:border-none' : ''}`}>
              <div className="relative flex-shrink-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand/20 border border-brand/50 text-brand font-semibold text-sm">
                  AC
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-sidebar-bg" />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-[14px] font-semibold text-text-primary truncate">Alex Carter</span>
                  <span className="text-[11px] text-text-secondary truncate">Admin</span>
                </div>
              )}

              {!isCollapsed && (
                <NavLink
                  to="/profile"
                  className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-hover-bg rounded-full transition-colors duration-200"
                  aria-label="View Profile"
                >
                  <CircleUser className="w-[18px] h-[18px]" />
                </NavLink>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => console.log('Mock Logout triggered')}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-btn text-[15px] font-medium text-text-secondary hover:text-danger hover:bg-danger/10 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-danger/50
                ${isCollapsed ? 'md:justify-center md:px-0 md:h-12' : ''}
              `}
              title="Logout"
            >
              <LogOut className="w-[20px] h-[20px] flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
