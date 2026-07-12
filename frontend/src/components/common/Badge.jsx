import React from 'react';

/**
 * Enterprise Badge component with consistent color variants.
 * Used for status indicators, role labels, and category tags.
 */
const VARIANTS = {
  success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
  danger:  'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
  info:    'bg-[#0052CC]/10 text-[#0052CC] border-[#0052CC]/30',
  neutral: 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/30',
  blue:    'bg-blue-500/10 text-blue-400 border-blue-500/30',
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-2.5 py-0.5 text-[10px]',
  lg: 'px-3 py-1 text-[11px]',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  className = '',
}) {
  const variantStyles = VARIANTS[variant] || VARIANTS.neutral;
  const sizeStyles = SIZES[size] || SIZES.sm;
  const radiusClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`
        inline-flex items-center border font-bold uppercase tracking-wider select-none
        ${radiusClass} ${variantStyles} ${sizeStyles} ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
