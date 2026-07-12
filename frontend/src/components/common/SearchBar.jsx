import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Enterprise SearchBar with icon, clear button, and consistent styling.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  size = 'md',
}) {
  const sizeStyles = size === 'sm'
    ? 'pl-9 pr-8 py-2 text-xs'
    : 'pl-10 pr-9 py-2.5 text-sm';

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const iconLeft = size === 'sm' ? 'left-3' : 'left-3.5';

  return (
    <div className={`relative ${className}`}>
      <Search
        className={`${iconSize} text-[#94A3B8] absolute ${iconLeft} top-1/2 -translate-y-1/2 pointer-events-none`}
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`
          w-full bg-[#0F172A] border border-[#334155] rounded-[10px]
          text-[#F8FAFC] placeholder-[#64748B]
          focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20
          transition-all duration-200 ${sizeStyles}
        `.trim()}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-0.5 rounded"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
