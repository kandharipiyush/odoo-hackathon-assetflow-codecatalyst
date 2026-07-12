import React, { useState } from 'react';
import { AlertTriangle, Clock, Hammer, Signature, X } from 'lucide-react';

/**
 * AlertBanner — dismissible system alerts panel for the Dashboard.
 * Displays overdue returns, critical maintenance, and pending approvals.
 */
export default function AlertBanner({ 
  overdueCount = 0, 
  criticalMaintenanceCount = 0, 
  pendingApprovalsCount = 0,
  onResolveAction,
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const totalAlerts = (overdueCount > 0 ? 1 : 0) + 
                      (criticalMaintenanceCount > 0 ? 1 : 0) + 
                      (pendingApprovalsCount > 0 ? 1 : 0);

  if (totalAlerts === 0) return null;

  const alerts = [
    {
      key: 'overdue',
      show: overdueCount > 0,
      icon: Clock,
      iconClass: 'text-[#F59E0B]',
      title: 'Overdue Returns',
      description: `${overdueCount} assets are currently past due date.`,
      action: 'Inspect Returns',
    },
    {
      key: 'maintenance',
      show: criticalMaintenanceCount > 0,
      icon: Hammer,
      iconClass: 'text-[#EF4444]',
      title: 'Critical Maintenance',
      description: `${criticalMaintenanceCount} server or facility tickets are open.`,
      action: 'View Tickets',
    },
    {
      key: 'approvals',
      show: pendingApprovalsCount > 0,
      icon: Signature,
      iconClass: 'text-[#3B82F6]',
      title: 'Pending Approvals',
      description: `${pendingApprovalsCount} transfer requests await review.`,
      action: 'Open Approvals Console',
    },
  ].filter((a) => a.show);

  return (
    <div
      className="bg-[#1E293B] border border-[#EF4444]/30 rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fade-in"
      role="alert"
      aria-label={`${totalAlerts} system alerts requiring action`}
    >
      {/* Danger border glow indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EF4444] rounded-l-2xl" />

      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] flex-shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC]">System Alerts Requiring Action</h4>
            <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
              There are active operational items that require immediate resolution or approval.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setVisible(false)}
          className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#0F172A] transition-all duration-200 flex-shrink-0"
          aria-label="Dismiss alerts"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-[#334155]">
        {alerts.map(({ key, icon: AlertIcon, iconClass, title, description, action }) => (
          <div
            key={key}
            className="flex items-start gap-3 bg-[#0F172A] p-4 rounded-xl border border-[#334155] hover:border-[#334155]/80 transition-colors"
          >
            <div className={`${iconClass} mt-0.5 flex-shrink-0`}>
              <AlertIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#F8FAFC]">{title}</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">{description}</p>
              <button 
                onClick={() => onResolveAction?.(key)}
                className="text-[10px] font-bold text-[#0052CC] hover:text-[#2563EB] hover:underline mt-2 transition-colors"
              >
                {action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
