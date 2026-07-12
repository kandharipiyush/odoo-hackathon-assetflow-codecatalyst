import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

/**
 * Enterprise ConfirmDialog — replaces native alert()/confirm() with styled modal.
 * Supports info (view details) and danger (destructive action confirmation) modes.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'info'
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-modal-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDanger
              ? 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
              : 'bg-[#0052CC]/10 border border-[#0052CC]/20 text-[#0052CC]'
          }`}>
            {isDanger
              ? <AlertTriangle className="w-6 h-6" />
              : <Info className="w-6 h-6" />
            }
          </div>
        </div>

        {/* Content */}
        <h4 className="text-sm font-bold text-[#F8FAFC] text-center">{title}</h4>
        <p className="text-xs text-[#94A3B8] text-center mt-2 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold h-10 rounded-xl transition-all duration-200"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 text-white text-xs font-semibold h-10 rounded-xl transition-all duration-200 ${
                isDanger
                  ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                  : 'bg-[#0052CC] hover:bg-[#2563EB]'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
