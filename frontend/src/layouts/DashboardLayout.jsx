import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children, title }) {
  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Tablet/Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-main-bg text-text-primary font-sans antialiased overflow-x-hidden">
      
      {/* Fixed Sidebar component */}
      <Sidebar
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Right Column Layout Wrapper */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-200 ease-in-out
          ${isCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'}
          pl-0
        `}
      >
        {/* Header component, aligning left-offset based on sidebar width */}
        <div className="w-full z-30">
          <Header
            title={title}
            onMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
