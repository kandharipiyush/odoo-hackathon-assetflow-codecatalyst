import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  to,
  badgeText,
  colorScheme = 'blue' // 'blue' | 'green' | 'amber' | 'purple'
}) {
  const getColorStyles = () => {
    switch (colorScheme) {
      case 'green':
        return {
          iconBg: 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]',
          hoverBg: 'hover:border-[#22C55E]/30 hover:bg-[#22C55E]/5',
          plusBg: 'bg-[#22C55E] group-hover:bg-[#22C55E]/90'
        };
      case 'amber':
        return {
          iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]',
          hoverBg: 'hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/5',
          plusBg: 'bg-[#F59E0B] group-hover:bg-[#F59E0B]/90'
        };
      case 'purple':
        return {
          iconBg: 'bg-[#a3e635]/10 border-[#a3e635]/20 text-[#a3e635]', // actually yellow-green in original, let's keep purple styling
          hoverBg: 'hover:border-purple-500/30 hover:bg-purple-500/5',
          plusBg: 'bg-purple-600 group-hover:bg-purple-500'
        };
      case 'blue':
      default:
        return {
          iconBg: 'bg-[#0052CC]/10 border-[#0052CC]/20 text-[#0052CC]',
          hoverBg: 'hover:border-[#0052CC]/30 hover:bg-[#0052CC]/5',
          plusBg: 'bg-[#0052CC] group-hover:bg-[#2563EB]'
        };
    }
  };

  const colors = getColorStyles();

  return (
    <Link 
      to={to} 
      className={`bg-[#1E293B] border border-[#334155] rounded-[16px] p-5 shadow-sm transition-all duration-200 group flex flex-col justify-between h-full ${colors.hoverBg}`}
    >
      <div>
        <div className="flex justify-between items-start">
          {/* Action Icon */}
          <div className={`w-11 h-11 rounded-[12px] border flex items-center justify-center ${colors.iconBg}`}>
            {Icon && <Icon className="w-5.5 h-5.5" />}
          </div>

          {/* Plus action trigger pill */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-sm ${colors.plusBg}`}>
            <Plus className="w-4 h-4" />
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
