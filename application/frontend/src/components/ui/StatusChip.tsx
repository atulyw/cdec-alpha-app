import React from 'react';

type StatusVariant = 'healthy' | 'warning' | 'critical' | 'info';

interface StatusChipProps {
  label: string;
  variant?: StatusVariant;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const variantMap: Record<StatusVariant, string> = {
  healthy: 'badge-success',
  warning: 'badge-warning',
  critical: 'badge-critical',
  info: 'badge-info',
};

const dotMap: Record<StatusVariant, string> = {
  healthy: 'status-dot-healthy',
  warning: 'status-dot-warning',
  critical: 'status-dot-critical',
  info: 'status-dot-info',
};

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant = 'info',
  showDot = true,
  size = 'sm',
}) => (
  <span className={`badge ${variantMap[variant]} ${size === 'md' ? 'text-sm px-3 py-1' : ''}`}>
    {showDot && <span className={`status-dot ${dotMap[variant]}`} aria-hidden="true" />}
    {label}
  </span>
);

export const podStatusVariant = (status: string): StatusVariant => {
  switch (status) {
    case 'Running':
    case 'Succeeded':
      return 'healthy';
    case 'Pending':
      return 'warning';
    case 'Failed':
    case 'CrashLoopBackOff':
      return 'critical';
    case 'Restarting':
      return 'info';
    default:
      return 'info';
  }
};
