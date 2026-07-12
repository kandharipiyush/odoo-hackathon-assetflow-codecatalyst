import React from 'react';

/**
 * Enterprise LoadingSkeleton — shimmer placeholders for various content types.
 * Variants: table, card, stat, form, activity
 */
export default function LoadingSkeleton({ rows = 4, type = 'table', columns = 3 }) {
  const shimmer = 'skeleton-shimmer rounded';

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2.5 flex-1">
                <div className={`h-3 ${shimmer} w-16`} />
                <div className={`h-7 ${shimmer} w-12`} />
              </div>
              <div className={`w-11 h-11 rounded-xl ${shimmer}`} />
            </div>
            <div className="pt-4 border-t border-[#334155]/60 flex justify-between">
              <div className={`h-3 ${shimmer} w-20`} />
              <div className={`h-3 ${shimmer} w-12`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-4">
        {/* Table header skeleton */}
        <div className="flex justify-between items-center pb-3 border-b border-[#334155]">
          <div className={`h-4 ${shimmer} w-1/4`} />
          <div className={`h-4 ${shimmer} w-1/6`} />
          <div className={`h-4 ${shimmer} w-1/6`} />
          <div className={`h-4 ${shimmer} w-1/12`} />
        </div>
        
        {/* Table row skeletons */}
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex justify-between items-center py-2.5">
            <div className={`h-3 ${shimmer} w-1/3`} />
            <div className={`h-3 ${shimmer} w-1/5`} />
            <div className={`h-3 ${shimmer} w-1/5`} />
            <div className={`h-3 ${shimmer} w-16`} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    const gridCols = columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-3';

    return (
      <div className={`grid ${gridCols} gap-6`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className={`h-3 ${shimmer} w-1/2`} />
                <div className={`h-6 ${shimmer} w-1/3`} />
              </div>
              <div className={`w-10 h-10 rounded-xl ${shimmer}`} />
            </div>
            <div className="pt-4 border-t border-[#334155]/60 flex justify-between">
              <div className={`h-3 ${shimmer} w-1/4`} />
              <div className={`h-3 ${shimmer} w-1/6`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 space-y-5 max-w-md mx-auto">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className={`h-3 ${shimmer} w-20`} />
            <div className={`h-10 ${shimmer} w-full rounded-[10px]`} />
          </div>
        ))}
        <div className={`h-12 ${shimmer} w-full rounded-xl mt-4`} />
      </div>
    );
  }

  if (type === 'activity') {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-5">
        <div className="space-y-2 mb-4">
          <div className={`h-4 ${shimmer} w-32`} />
          <div className={`h-3 ${shimmer} w-48`} />
        </div>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full ${shimmer} flex-shrink-0`} />
            <div className="flex-1 space-y-2">
              <div className={`h-3 ${shimmer} w-24`} />
              <div className={`h-3 ${shimmer} w-full`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
