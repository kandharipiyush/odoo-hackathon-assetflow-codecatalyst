import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, CircleUser, Settings, LogOut } from 'lucide-react';

const ROUTE_TITLES = {
  '/': 'Dashboard Overview',
  '/org-setup': 'Organization Setup',
  '/assets': 'Asset Registry',
  '/allocation': 'Asset Allocations & Transfers',
  '/bookings': 'Resource Bookings',
  '/maintenance': 'Maintenance Management',
  '/audit': 'Asset Audits',
  '/reports': 'Reports & Analytics',
  '/notifications': 'Smart Notifications',
  '/profile': 'Profile Settings'
};

export default function Header({ title, onMenuToggle }) {
  const location = useLocation();

  // Determine active page title based on path or fallback to prop or default
  const activeTitle = title || ROUTE_TITLES[location.pathname] || 'AssetFlow';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-auto z-30 flex items-center justify-between h-[72px] px-8 bg-main-bg border-b border-border-color transition-all duration-200">
      
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="flex md:hidden items-center justify-center p-2 rounded-btn border border-border-color text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h1 className="text-[24px] lg:text-[30px] font-semibold text-text-primary tracking-tight leading-tight select-none">
          {activeTitle}
        </h1>
      </div>

      {/* Middle/Right: Search bar + Utilities */}
      <div className="flex items-center gap-6">
        
        {/* Search Input (Hidden on mobile, visible on tablet/desktop) */}
        <div className="relative hidden sm:block w-[280px] lg:w-[380px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary" />
          <input
            type="text"
            placeholder="Search assets, bookings, or tickets..."
            className="w-full pl-10 pr-4 py-2 bg-card-bg border border-border-color text-text-primary placeholder-text-secondary text-[15px] rounded-input transition-all duration-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/35"
          />
        </div>

        {/* Notifications and User Avatar Group */}
        <div className="flex items-center gap-4">
          
          {/* Notification Trigger Button */}
          <button
            className="relative p-2.5 rounded-full border border-border-color text-text-secondary hover:text-text-primary hover:bg-hover-bg hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="View notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
          </button>

          {/* Vertical divider */}
          <div className="w-[1px] h-6 bg-border-color hidden xs:block" />

          {/* Quick Profile Icon (Interactive dropdown representation) */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 focus:outline-none"
              aria-label="User Options Menu"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand text-text-primary font-semibold text-sm hover:brightness-110 transition-all duration-200">
                AC
              </div>
              <span className="hidden lg:block text-[14px] font-medium text-text-primary select-none group-hover:text-text-primary transition-colors">
                Alex
              </span>
            </button>

            {/* Quick dropdown mock styling */}
            <div className="absolute right-0 mt-2 w-48 bg-sidebar-bg border border-border-color rounded-card shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 py-1">
              <div className="px-4 py-2 border-b border-border-color">
                <p className="text-[14px] font-semibold text-text-primary">Alex Carter</p>
                <p className="text-[11px] text-text-secondary">alex.carter@company.com</p>
              </div>
              <a
                href="/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-colors duration-150"
              >
                <CircleUser className="w-4 h-4" />
                My Profile
              </a>
              <a
                href="/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-colors duration-150"
              >
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <hr className="border-border-color my-1" />
              <button
                onClick={() => console.log('Mock Logout triggered')}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-[14px] text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

        </div>

      </div>

    </header>
  );
}
