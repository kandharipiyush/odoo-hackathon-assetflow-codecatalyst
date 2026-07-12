import React from 'react';
import { ShieldCheck, PlusCircle, PenTool, RefreshCcw, User } from 'lucide-react';

export default function RecentActivity({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'create':
        return <PlusCircle className="w-4 h-4 text-[#22C55E]" />;
      case 'edit':
        return <PenTool className="w-4 h-4 text-blue-500" />;
      case 'transfer':
        return <RefreshCcw className="w-4 h-4 text-purple-500" />;
      case 'audit':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <User className="w-4 h-4 text-[#94A3B8]" />;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 shadow-md h-full flex flex-col">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-[#F8FAFC]">System Audit Trail</h4>
        <p className="text-xs text-[#94A3B8] mt-0.5">Real-time asset allocations and activities</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[360px]">
        {activities && activities.length > 0 ? (
          activities.map((act) => (
            <div key={act.id} className="flex gap-3 text-xs leading-relaxed group">
              {/* User Avatar Circle */}
              <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] flex-shrink-0 group-hover:border-[#0052CC]/40 transition-colors">
                {getInitials(act.userName)}
              </div>

              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#F8FAFC] group-hover:text-white truncate">
                    {act.userName}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] flex-shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                
                <p className="text-[#94A3B8] mt-1 flex items-center gap-1.5 min-w-0">
                  <span className="flex-shrink-0">{getIcon(act.type)}</span>
                  <span className="truncate">{act.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-xs text-[#94A3B8] italic">
            No recent activity registered in this session.
          </div>
        )}
      </div>
    </div>
  );
}
