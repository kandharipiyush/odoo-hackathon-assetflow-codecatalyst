import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ 
  title = "No data found", 
  description = "There are no entries corresponding to the selection in this view.",
  actionText,
  onActionClick
}) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-8 text-center flex flex-col items-center justify-center min-h-[240px] shadow-sm">
      <div className="w-14 h-14 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#94A3B8] mb-4">
        <PackageOpen className="w-7 h-7" />
      </div>
      
      <h4 className="text-sm font-bold text-[#F8FAFC] tracking-tight">{title}</h4>
      <p className="text-xs text-[#94A3B8] mt-2 max-w-sm leading-relaxed mx-auto">
        {description}
      </p>

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-5 bg-[#0052CC] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-[12px] shadow-md transition-all duration-200"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
