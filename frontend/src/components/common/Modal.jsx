import React, { useEffect, useRef, useCallback, useId } from 'react';
import { X } from 'lucide-react';

/**
 * Enterprise Modal — accessible overlay dialog with consistent styling.
 * Closes on Escape key and overlay click.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  // Stable IDs for aria-labelledby / aria-describedby linkage
  const titleId = useId();
  const bodyId = useId();

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  // Focus the modal content on open
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Overlay — not the dialog; no role or aria-label here
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* Dialog — role, aria-labelledby, and aria-describedby live here */}
      <div
        ref={contentRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className={`
          bg-[#1E293B] border border-[#334155] rounded-2xl w-full ${maxWidth}
          p-6 shadow-2xl animate-modal-in focus:outline-none
        `.trim()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#334155]">
          <h4 id={titleId} className="text-sm font-bold text-white">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white p-1.5 rounded-lg hover:bg-[#0F172A] transition-all duration-200"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div id={bodyId} className="mt-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-3 justify-end pt-4 border-t border-[#334155] mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
