import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="card p-12 text-center max-w-md mx-auto">
    <div className="h-16 w-16 rounded-2xl bg-[var(--surface-bg)] flex items-center justify-center mx-auto mb-6">
      <Icon className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
    </div>
    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    {action && (
      <button onClick={action.onClick} className="btn btn-primary btn-md">
        {action.label}
      </button>
    )}
  </div>
);
