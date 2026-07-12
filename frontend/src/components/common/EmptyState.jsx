import React from 'react';
import { PackageOpen } from 'lucide-react';

/**
 * Enterprise EmptyState — displayed when a list, table, or section has no data.
 * Supports custom icon, title, description, and optional action button.
 */
export default function EmptyState({ 
  title = 'No data found', 
  description = 'There are no entries corresponding to the selection in this view.',
  actionText,
  onActionClick,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#94A3B8] mb-5">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>
      
      <h4 className="text-sm font-bold text-[#F8FAFC] tracking-tight">{title}</h4>
      <p className="text-xs text-[#94A3B8] mt-2 max-w-xs leading-relaxed mx-auto">
        {description}
      </p>

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-6 bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-5 h-10 rounded-xl shadow-md shadow-[#0052CC]/10 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
