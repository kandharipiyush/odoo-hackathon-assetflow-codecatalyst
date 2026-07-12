import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * QuickActionCard — navigational action card for Dashboard quick operations.
 * Supports color schemes: blue, green, amber, purple.
 */
const COLOR_CONFIG = {
  green: {
    iconBg: 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]',
    hoverBg: 'hover:border-[#22C55E]/30',
    arrowBg: 'bg-[#22C55E]/10 text-[#22C55E] group-hover:bg-[#22C55E]/20',
  },
  amber: {
    iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]',
    hoverBg: 'hover:border-[#F59E0B]/30',
    arrowBg: 'bg-[#F59E0B]/10 text-[#F59E0B] group-hover:bg-[#F59E0B]/20',
  },
  purple: {
    iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    hoverBg: 'hover:border-purple-500/30',
    arrowBg: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
  },
  blue: {
    iconBg: 'bg-[#0052CC]/10 border-[#0052CC]/20 text-[#0052CC]',
    hoverBg: 'hover:border-[#0052CC]/30',
    arrowBg: 'bg-[#0052CC]/10 text-[#0052CC] group-hover:bg-[#0052CC]/20',
  },
};

export default function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  to,
  badgeText,
  colorScheme = 'blue',
}) {
  const colors = COLOR_CONFIG[colorScheme] || COLOR_CONFIG.blue;

  return (
    <Link 
      to={to} 
      className={`
        bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-sm
        transition-all duration-200 group flex flex-col justify-between h-full
        hover:-translate-y-0.5 hover:shadow-lg ${colors.hoverBg}
      `.trim()}
      aria-label={`${title} — ${description}`}
    >
      <div>
        <div className="flex justify-between items-start">
          {/* Action Icon */}
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colors.iconBg}`}>
            {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
          </div>

          {/* Arrow indicator */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${colors.arrowBg}`}>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-white transition-colors">
              {title}
            </h4>
            {badgeText && (
              <span className="px-1.5 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[9px] font-semibold text-[#94A3B8]">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
