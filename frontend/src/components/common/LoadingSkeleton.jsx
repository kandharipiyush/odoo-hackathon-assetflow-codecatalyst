import React from 'react';

export default function LoadingSkeleton({ rows = 4, type = 'table' }) {
  if (type === 'table') {
    return (
      <div className="w-full bg-[#1E293B] border border-[#334155] rounded-[16px] p-5 space-y-4 animate-pulse">
        {/* Table header skeleton */}
        <div className="flex justify-between items-center pb-3 border-b border-[#334155]">
          <div className="h-4 bg-[#0F172A] rounded-[4px] w-1/4" />
          <div className="h-4 bg-[#0F172A] rounded-[4px] w-1/6" />
          <div className="h-4 bg-[#0F172A] rounded-[4px] w-1/6" />
          <div className="h-4 bg-[#0F172A] rounded-[4px] w-1/12" />
        </div>
        
        {/* Table row skeletons */}
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/3" />
            <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/5" />
            <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/5" />
            <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/10" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 space-y-4 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/2" />
                <div className="h-6 bg-[#0F172A] rounded-[4px] w-1/3" />
              </div>
              <div className="w-10 h-10 rounded-[10px] bg-[#0F172A]" />
            </div>
            <div className="pt-4 border-t border-[#334155] flex justify-between">
              <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/4" />
              <div className="h-3 bg-[#0F172A] rounded-[4px] w-1/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
