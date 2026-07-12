import React, { useState } from 'react';
import { AlertTriangle, Clock, Hammer, Signature, X } from 'lucide-react';

export default function AlertBanner({ 
  overdueCount = 0, 
  criticalMaintenanceCount = 0, 
  pendingApprovalsCount = 0,
  onResolveAction 
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const totalAlerts = (overdueCount > 0 ? 1 : 0) + 
                      (criticalMaintenanceCount > 0 ? 1 : 0) + 
                      (pendingApprovalsCount > 0 ? 1 : 0);

  if (totalAlerts === 0) return null;

  return (
    <div className="bg-[#1E293B] border border-[#EF4444]/30 rounded-[16px] p-5 shadow-lg relative overflow-hidden transition-all duration-200">
      {/* Danger border glow indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EF4444]" />

      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] flex-shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
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
          className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#0F172A] transition-all duration-200"
          aria-label="Dismiss alerts"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-[#334155]">
        {/* Overdue Returns Alert */}
        {overdueCount > 0 && (
          <div className="flex items-start gap-3 bg-[#0F172A] p-3.5 rounded-[12px] border border-[#334155]">
            <div className="text-amber-500 mt-0.5 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#F8FAFC]">Overdue Returns</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                {overdueCount} assets are currently past due date.
              </p>
              <button 
                onClick={() => onResolveAction?.('overdue')}
                className="text-[10px] font-bold text-[#0052CC] hover:text-[#2563EB] hover:underline mt-2 flex items-center gap-0.5"
              >
                Inspect Returns
              </button>
            </div>
          </div>
        )}

        {/* Critical Maintenance Alert */}
        {criticalMaintenanceCount > 0 && (
          <div className="flex items-start gap-3 bg-[#0F172A] p-3.5 rounded-[12px] border border-[#334155]">
            <div className="text-[#EF4444] mt-0.5 flex-shrink-0">
              <Hammer className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#F8FAFC]">Critical Maintenance</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                {criticalMaintenanceCount} server or facility tickets are open.
              </p>
              <button 
                onClick={() => onResolveAction?.('maintenance')}
                className="text-[10px] font-bold text-[#0052CC] hover:text-[#2563EB] hover:underline mt-2"
              >
                View Tickets
              </button>
            </div>
          </div>
        )}

        {/* Pending Approvals Alert */}
        {pendingApprovalsCount > 0 && (
          <div className="flex items-start gap-3 bg-[#0F172A] p-3.5 rounded-[12px] border border-[#334155]">
            <div className="text-blue-500 mt-0.5 flex-shrink-0">
              <Signature className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#F8FAFC]">Pending Approvals</span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                {pendingApprovalsCount} transfer requests await review.
              </p>
              <button 
                onClick={() => onResolveAction?.('approvals')}
                className="text-[10px] font-bold text-[#0052CC] hover:text-[#2563EB] hover:underline mt-2"
              >
                Open Approvals Console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
