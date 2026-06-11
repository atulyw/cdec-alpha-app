import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, CheckCircle, Search, RefreshCw, Cloud, Container, Cog } from 'lucide-react';
import { enrollApi } from '../utils/api';
import { MetricCard } from './ui/MetricCard';
import { StatusChip } from './ui/StatusChip';
import { EmptyState } from './ui/EmptyState';

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'healthy' as const;
    case 'completed': return 'info' as const;
    case 'cancelled': return 'critical' as const;
    default: return 'warning' as const;
  }
};

const getCourseIcon = (title: string) => {
  if (title.toLowerCase().includes('aws')) return Cloud;
  if (title.toLowerCase().includes('docker')) return Container;
  if (title.toLowerCase().includes('kubernetes')) return Cog;
  return BookOpen;
};

export const EnrollmentsTable: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchEnrollments(); }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await enrollApi.get<Enrollment[]>('/');
      if (response.success && response.data) {
        setEnrollments(response.data);
        setError('');
      } else {
        setError(response.error || 'Failed to fetch enrollments');
      }
    } catch {
      setError('Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const filtered = enrollments.filter((e) =>
    search === '' || e.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="card p-5"><div className="skeleton h-16 w-full" /></div>)}
        </div>
        <div className="card p-6"><div className="skeleton h-48 w-full" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button onClick={fetchEnrollments} className="btn btn-primary btn-md">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No enrollments yet"
        description="Browse the course catalog and start your cloud engineering journey."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Total Enrollments" value={enrollments.length} icon={BookOpen} iconColor="text-blue-500" />
        <MetricCard title="Active Courses" value={enrollments.filter((e) => e.status === 'active').length} icon={Zap} iconColor="text-emerald-500" />
        <MetricCard title="Completed" value={enrollments.filter((e) => e.status === 'completed').length} icon={CheckCircle} iconColor="text-indigo-500" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b" style={{ borderColor: 'var(--surface-border)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Course Enrollments</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{filtered.length} enrollment{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="search"
              placeholder="Search enrollments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
              aria-label="Search enrollments"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="data-table w-full text-sm" role="table">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--surface-border)' }}>
                {['Course', 'Enrolled', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No enrollments match your search
                  </td>
                </tr>
              ) : (
                filtered.map((enrollment) => {
                  const Icon = getCourseIcon(enrollment.courseTitle);
                  return (
                    <tr
                      key={enrollment.id}
                      className="border-b hover:bg-[var(--surface-bg)] transition-colors"
                      style={{ borderColor: 'var(--surface-border)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[var(--surface-bg)]">
                            <Icon className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{enrollment.courseTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(enrollment.enrolledAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusChip
                          label={enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          variant={statusVariant(enrollment.status)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
