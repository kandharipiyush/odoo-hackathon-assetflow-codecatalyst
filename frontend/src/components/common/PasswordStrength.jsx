import React, { useMemo } from 'react';

/**
 * PasswordStrength — visual 4-bar strength meter for password fields.
 * Checks: length ≥ 8, uppercase letter, number, special character.
 */
export default function PasswordStrength({ password = '' }) {
  const { score, label, color } = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;

    // Normalize to 4-bar scale
    const normalized = Math.min(4, s);

    const configs = [
      { label: '', color: '' },
      { label: 'Weak', color: '#EF4444' },
      { label: 'Fair', color: '#F59E0B' },
      { label: 'Good', color: '#3B82F6' },
      { label: 'Strong', color: '#22C55E' },
    ];

    return { score: normalized, ...configs[normalized] };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {/* Strength bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: level <= score ? color : '#334155',
            }}
          />
        ))}
      </div>
      {/* Label */}
      {label && (
        <p className="text-[10px] font-semibold tracking-wide" style={{ color }}>
          {label} password
        </p>
      )}
    </div>
  );
}
