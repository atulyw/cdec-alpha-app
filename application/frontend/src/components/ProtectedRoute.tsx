import React from 'react';
import { Cloud } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-auth flex items-center justify-center">
        <div className="text-center">
          <Cloud className="h-8 w-8 text-blue-400 mx-auto mb-4 animate-pulse-subtle" />
          <div className="spinner h-10 w-10 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--surface-bg)' }}>
        <div className="card p-8 text-center max-w-sm">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            You need to be signed in to access the control plane.
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-primary btn-md w-full">
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
