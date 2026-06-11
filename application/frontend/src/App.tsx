import { useState, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DebugPanel } from './components/DebugPanel';
import { AppLayout } from './layouts/AppLayout';
import type { PageId } from './components/layout/Sidebar';
import { Cloud } from 'lucide-react';

const OverviewPage = lazy(() => import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const PodsPage = lazy(() => import('./pages/PodsPage').then((m) => ({ default: m.PodsPage })));
const ClustersPage = lazy(() => import('./pages/ClustersPage').then((m) => ({ default: m.ClustersPage })));
const CourseList = lazy(() => import('./components/CourseList').then((m) => ({ default: m.CourseList })));
const EnrollmentsTable = lazy(() => import('./components/EnrollmentsTable').then((m) => ({ default: m.EnrollmentsTable })));

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="spinner h-8 w-8" />
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>('overview');

  if (loading) {
    return (
      <div className="min-h-screen gradient-auth flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="h-16 w-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <Cloud className="h-8 w-8 text-blue-400 animate-pulse-subtle" />
          </div>
          <div className="spinner h-10 w-10 mx-auto mb-4" />
          <p className="text-slate-300 text-sm font-medium">Initializing CloudOps Control Plane...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginForm isLogin={isLogin} onToggleMode={() => setIsLogin(!isLogin)} />
      </ErrorBoundary>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'pods':
        return <PodsPage />;
      case 'clusters':
        return <ClustersPage />;
      case 'courses':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Explore cloud computing courses and accelerate your platform engineering skills.
              </p>
            </div>
            <CourseList />
          </div>
        );
      case 'enrollments':
        return <EnrollmentsTable />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </AppLayout>
        <DebugPanel />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

export default App;
