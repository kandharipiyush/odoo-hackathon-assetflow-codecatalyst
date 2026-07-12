import React from 'react';
import { ShieldCheck, PlusCircle, PenTool, RefreshCcw, User, Clock } from 'lucide-react';

/**
 * RecentActivity — timeline feed showing recent system audit trail entries.
 * Features connected timeline line and empty state.
 */
const ACTIVITY_ICONS = {
  create:   { icon: PlusCircle, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10 border-[#22C55E]/30' },
  edit:     { icon: PenTool, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10 border-[#3B82F6]/30' },
  transfer: { icon: RefreshCcw, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  audit:    { icon: ShieldCheck, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10 border-[#22C55E]/30' },
  default:  { icon: User, color: 'text-[#94A3B8]', bg: 'bg-[#94A3B8]/10 border-[#94A3B8]/30' },
};

export default function RecentActivity({ activities }) {
  const getConfig = (type) => ACTIVITY_ICONS[type] || ACTIVITY_ICONS.default;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-md h-full flex flex-col">
      <div className="mb-5">
        <h4 className="text-sm font-bold text-[#F8FAFC]">System Audit Trail</h4>
        <p className="text-xs text-[#94A3B8] mt-0.5">Real-time asset allocations and activities</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 max-h-[360px]">
        {activities && activities.length > 0 ? (
          <div className="relative">
            {/* Timeline connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-[#334155]/60" aria-hidden="true" />

            <div className="space-y-5">
              {activities.map((act, idx) => {
                const config = getConfig(act.type);
                const TypeIcon = config.icon;

                return (
                  <div key={act.id} className="flex gap-3 text-xs leading-relaxed group relative">
                    {/* Avatar with type indicator */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] group-hover:border-[#0052CC]/40 transition-colors">
                        {getInitials(act.userName)}
                      </div>
                    </div>

                    {/* Activity Info */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#F8FAFC] group-hover:text-white truncate transition-colors">
                          {act.userName}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] flex-shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {act.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-[#94A3B8] mt-1 flex items-start gap-1.5 min-w-0">
                        <span className={`flex-shrink-0 mt-0.5 ${config.color}`}>
                          <TypeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                        <span className="line-clamp-2">{act.message}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#94A3B8] mb-3">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">No recent activity</p>
            <p className="text-[11px] text-[#64748B] mt-1">Activity will appear here as events occur.</p>
          </div>
        )}
      </div>
    </div>
  );
}
