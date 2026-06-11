import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, ExternalLink, FileText, RefreshCw } from 'lucide-react';
import { StatusChip, podStatusVariant } from '../ui/StatusChip';
import { pods, type Pod, type PodStatus } from '../../data/mockClusterData';

const allStatuses: PodStatus[] = ['Running', 'Pending', 'Failed', 'CrashLoopBackOff', 'Restarting', 'Succeeded'];

export const PodStatusTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PodStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return pods.filter((pod) => {
      const matchesSearch =
        search === '' ||
        pod.name.toLowerCase().includes(search.toLowerCase()) ||
        pod.namespace.toLowerCase().includes(search.toLowerCase()) ||
        pod.cluster.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || pod.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b" style={{ borderColor: 'var(--surface-border)' }}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pod Status</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} of {pods.length} pods
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="search"
              placeholder="Filter pods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
              aria-label="Filter pods"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-secondary btn-sm ${statusFilter !== 'all' ? 'ring-2 ring-blue-500/30' : ''}`}
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b animate-fade-in" style={{ borderColor: 'var(--surface-border)' }}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`badge ${statusFilter === 'all' ? 'badge-info' : ''} cursor-pointer hover:opacity-80`}
          >
            All
          </button>
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`cursor-pointer hover:opacity-80 ${statusFilter === s ? '' : 'opacity-60'}`}
            >
              <StatusChip label={s} variant={podStatusVariant(s)} />
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="data-table w-full text-sm" role="table">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--surface-border)' }}>
              {['Name', 'Namespace', 'Cluster', 'Status', 'Restarts', 'CPU', 'Memory', 'Node', 'Age', ''].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                  No pods match your filters
                </td>
              </tr>
            ) : (
              filtered.map((pod: Pod) => (
                <PodRow key={pod.id} pod={pod} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PodRow: React.FC<{ pod: Pod }> = ({ pod }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr
      className="border-b hover:bg-[var(--surface-bg)] transition-colors group"
      style={{ borderColor: 'var(--surface-border)' }}
    >
      <td className="px-4 py-3 font-mono text-xs font-medium max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }} title={pod.name}>
        {pod.name}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="badge badge-info text-xs">{pod.namespace}</span>
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{pod.cluster}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusChip label={pod.status} variant={podStatusVariant(pod.status)} />
      </td>
      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: pod.restarts > 3 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
        {pod.restarts}
      </td>
      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{pod.cpu}</td>
      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{pod.memory}</td>
      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{pod.node}</td>
      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{pod.age}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost btn-sm p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label={`Actions for ${pod.name}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 card py-1 shadow-lg z-20 animate-fade-in">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--surface-bg)]" onClick={() => setMenuOpen(false)}>
                <ExternalLink className="h-3.5 w-3.5" /> View Details
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--surface-bg)]" onClick={() => setMenuOpen(false)}>
                <FileText className="h-3.5 w-3.5" /> View Logs
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--surface-bg)]" onClick={() => setMenuOpen(false)}>
                <RefreshCw className="h-3.5 w-3.5" /> Restart Pod
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
