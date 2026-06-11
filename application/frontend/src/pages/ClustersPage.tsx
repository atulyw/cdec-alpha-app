import React, { useState, useEffect } from 'react';
import { Server, MapPin, GitBranch, Box, Cpu } from 'lucide-react';
import { HealthScore } from '../components/ui/HealthScore';
import { StatusChip } from '../components/ui/StatusChip';
import { ProgressBar } from '../components/ui/ProgressBar';
import { clusters } from '../data/mockClusterData';

export const ClustersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-6 w-40 mb-4" />
                <div className="skeleton h-24 w-24 rounded-full mx-auto mb-4" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))
          : clusters.map((cluster, index) => (
              <div
                key={cluster.id}
                className="card card-hover p-6 animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[var(--surface-bg)]">
                      <Server className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{cluster.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{cluster.region}</span>
                        <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />v{cluster.version}</span>
                      </div>
                    </div>
                  </div>
                  <StatusChip
                    label={cluster.health.charAt(0).toUpperCase() + cluster.health.slice(1)}
                    variant={cluster.health === 'healthy' ? 'healthy' : cluster.health === 'warning' ? 'warning' : 'critical'}
                  />
                </div>

                <div className="flex items-center gap-6 mb-5">
                  <HealthScore score={cluster.healthScore} size="sm" label="" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-[var(--surface-bg)]">
                      <Cpu className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                      <p className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                        {cluster.healthyNodes}/{cluster.nodes}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Nodes</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--surface-bg)]">
                      <Box className="h-4 w-4 mx-auto mb-1 text-indigo-500" />
                      <p className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{cluster.pods}</p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Pods</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <ProgressBar
                    value={Math.round((cluster.healthyNodes / cluster.nodes) * 100)}
                    label="Node Health"
                    variant={cluster.health === 'healthy' ? 'healthy' : cluster.health === 'warning' ? 'warning' : 'critical'}
                  />
                  <ProgressBar
                    value={cluster.healthScore}
                    label="Overall Health"
                    variant={cluster.health === 'healthy' ? 'healthy' : cluster.health === 'warning' ? 'warning' : 'critical'}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
