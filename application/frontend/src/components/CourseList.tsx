import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, User, Plus, Cloud, Container, Cog, RefreshCw } from 'lucide-react';
import { courseApi, enrollApi } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { EmptyState } from './ui/EmptyState';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
}

const courseIcons = [
  { match: 'aws', icon: Cloud, color: 'text-orange-500' },
  { match: 'docker', icon: Container, color: 'text-blue-500' },
  { match: 'kubernetes', icon: Cog, color: 'text-indigo-500' },
];

const getCourseMeta = (title: string) => {
  const found = courseIcons.find((c) => title.toLowerCase().includes(c.match));
  return found ?? { icon: BookOpen, color: 'text-violet-500' };
};

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseApi.get<Course[]>('/');
      if (response.success && response.data) {
        setCourses(response.data);
        setError('');
      } else {
        setError(response.error || 'Failed to fetch courses');
      }
    } catch {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      const response = await enrollApi.post<{ message: string }>('/', { courseId });
      if (response.success) {
        showToast('Successfully enrolled in the course!', 'success');
      } else {
        showToast(response.error || 'Failed to enroll in the course', 'error');
      }
    } catch {
      showToast('Failed to enroll in the course', 'error');
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-10 w-10 rounded-lg mb-4" />
            <div className="skeleton h-5 w-3/4 mb-2" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-2/3 mb-6" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button onClick={fetchCourses} className="btn btn-primary btn-md">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses available"
        description="Check back later for new cloud computing courses."
        action={{ label: 'Refresh', onClick: fetchCourses }}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => {
        const { icon: Icon, color } = getCourseMeta(course.title);
        return (
          <div
            key={course.id}
            className="card card-hover p-6 animate-slide-up flex flex-col"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-lg bg-[var(--surface-bg)] ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                  ${course.price}
                </span>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>One-time</p>
              </div>
            </div>

            <h3 className="text-base font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
              {course.title}
            </h3>
            <p className="text-sm mb-4 line-clamp-3 flex-1" style={{ color: 'var(--text-secondary)' }}>
              {course.description}
            </p>

            <div className="flex items-center gap-4 text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{course.instructor}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}h</span>
            </div>

            <button
              onClick={() => handleEnroll(course.id)}
              disabled={enrolling === course.id}
              className="btn btn-primary btn-md w-full"
            >
              {enrolling === course.id ? (
                <><div className="spinner h-4 w-4" /> Enrolling...</>
              ) : (
                <><Plus className="h-4 w-4" /> Enroll Now</>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
