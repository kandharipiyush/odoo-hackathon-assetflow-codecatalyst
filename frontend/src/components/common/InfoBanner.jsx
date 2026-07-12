import React from 'react';
import { Info, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

/**
 * Enterprise InfoBanner — displays contextual notices with consistent styling.
 * Variants: info (blue), warning (amber), danger (red), success (green)
 */
const VARIANT_CONFIG = {
  info: {
    containerClass: 'bg-[#0052CC]/8 border-[#0052CC]/25',
    iconClass: 'text-[#0052CC]',
    Icon: Info,
  },
  warning: {
    containerClass: 'bg-[#F59E0B]/8 border-[#F59E0B]/25',
    iconClass: 'text-[#F59E0B]',
    Icon: AlertTriangle,
  },
  danger: {
    containerClass: 'bg-[#EF4444]/8 border-[#EF4444]/25',
    iconClass: 'text-[#EF4444]',
    Icon: ShieldAlert,
  },
  success: {
    containerClass: 'bg-[#22C55E]/8 border-[#22C55E]/25',
    iconClass: 'text-[#22C55E]',
    Icon: CheckCircle,
  },
};

export default function InfoBanner({
  variant = 'info',
  title,
  children,
  className = '',
  icon: CustomIcon,
}) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
  const IconComponent = CustomIcon || config.Icon;

  return (
    <div
      className={`
        border rounded-xl p-4 flex items-start gap-3 text-xs
        ${config.containerClass} ${className}
      `.trim()}
      role="note"
    >
      <IconComponent
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconClass}`}
        aria-hidden="true"
      />
      <div className="min-w-0">
        {title && (
          <span className="font-bold text-[#F8FAFC] block">{title}</span>
        )}
        <div className="text-[#94A3B8] mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
