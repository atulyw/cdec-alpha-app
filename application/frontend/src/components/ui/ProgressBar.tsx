import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'healthy' | 'warning' | 'critical' | 'info';
  size?: 'sm' | 'md';
}

const barColors: Record<string, string> = {
  healthy: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  info: 'bg-blue-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  variant,
  size = 'md',
}) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const autoVariant = variant ?? (pct >= 85 ? 'critical' : pct >= 70 ? 'warning' : 'healthy');

  return (
    <div className="w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>}
          {showValue && <span className="text-sm font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{pct}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full bg-[var(--surface-bg)] ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`${barColors[autoVariant]} rounded-full transition-all duration-500 ease-out ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
