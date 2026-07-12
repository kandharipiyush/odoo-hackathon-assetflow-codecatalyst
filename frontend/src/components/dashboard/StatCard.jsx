import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * StatCard displays key performance indicators with trends and dynamic icons.
 */
export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  badgeText,
  badgeColor = 'blue' // 'green' | 'blue' | 'amber' | 'gray'
}) {
  const getBadgeStyles = () => {
    switch (badgeColor) {
      case 'green':
        return 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30';
      case 'blue':
        return 'bg-[#0052CC]/15 text-[#0052CC] border-[#0052CC]/30';
      case 'amber':
        return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30';
      case 'gray':
      default:
        return 'bg-[#94A3B8]/15 text-[#94A3B8] border-[#94A3B8]/30';
    }
  };

  const getTrendStyles = () => {
    switch (trendType) {
      case 'positive':
        return 'text-[#22C55E]';
      case 'negative':
        return 'text-[#EF4444]';
      case 'neutral':
      default:
        return 'text-[#94A3B8]';
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 shadow-md hover:shadow-lg hover:border-[#0052CC]/30 transition-all duration-200 group">
      <div className="flex justify-between items-start">
        {/* Left side info */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            {title}
          </span>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] mt-2 tracking-tight group-hover:text-white transition-colors">
            {value}
          </h3>
        </div>

        {/* Right side Icon Wrapper */}
        <div className="w-11 h-11 rounded-[12px] bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#94A3B8] group-hover:text-[#0052CC] group-hover:border-[#0052CC]/30 transition-all duration-200">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#334155]/60 text-xs">
        {/* Trend Indicator */}
        {trend ? (
          <div className="flex items-center gap-1">
            {trendType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5 text-[#22C55E]" />}
            {trendType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
            <span className={`font-semibold ${getTrendStyles()}`}>{trend}</span>
          </div>
        ) : (
          <div className="w-1" />
        )}

        {/* Status Badge */}
        {badgeText && (
          <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wide ${getBadgeStyles()}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
