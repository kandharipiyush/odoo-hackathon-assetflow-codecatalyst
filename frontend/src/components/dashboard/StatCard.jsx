import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * StatCard — KPI metric card with icon, trend indicator, and status badge.
 * Follows 8px spacing grid and enterprise design tokens.
 */
const BADGE_STYLES = {
  green:  'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
  blue:   'bg-[#0052CC]/10 text-[#0052CC] border-[#0052CC]/30',
  amber:  'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
  gray:   'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30',
};

const TREND_STYLES = {
  positive: 'text-[#22C55E]',
  negative: 'text-[#EF4444]',
  neutral:  'text-[#94A3B8]',
};

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral',
  badgeText,
  badgeColor = 'blue',
}) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-[#0052CC]/30 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex justify-between items-start">
        {/* Left side info */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            {title}
          </span>
          <h3 className="text-[32px] font-extrabold text-[#F8FAFC] mt-1.5 tracking-tight leading-none group-hover:text-white transition-colors">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>

        {/* Right side Icon */}
        <div className="w-11 h-11 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#94A3B8] group-hover:text-[#0052CC] group-hover:border-[#0052CC]/30 transition-all duration-200">
          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#334155]/60 text-xs">
        {/* Trend Indicator */}
        {trend ? (
          <div className="flex items-center gap-1">
            {trendType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5 text-[#22C55E]" aria-hidden="true" />}
            {trendType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" aria-hidden="true" />}
            <span className={`font-semibold ${TREND_STYLES[trendType] || TREND_STYLES.neutral}`}>
              {trend}
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Status Badge */}
        {badgeText && (
          <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wide ${BADGE_STYLES[badgeColor] || BADGE_STYLES.gray}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
