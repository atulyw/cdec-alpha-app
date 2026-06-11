import React, { useState } from 'react';
import { Sidebar, type PageId } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

const pageTitles: Record<PageId, string> = {
  overview: 'Operations Overview',
  pods: 'Pod Monitoring',
  clusters: 'Cluster Health',
  courses: 'Course Catalog',
  enrollments: 'My Enrollments',
};

interface AppLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPage, onNavigate, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarOffset = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-bg)' }}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => { onNavigate(page); setMobileMenuOpen(false); }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <Header
        sidebarCollapsed={sidebarCollapsed}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        pageTitle={pageTitles[currentPage]}
      />

      <main
        className="transition-all duration-300 pt-[var(--header-height)] min-h-screen lg:ml-[var(--sidebar-offset)]"
        style={{ '--sidebar-offset': sidebarOffset } as React.CSSProperties}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[90rem] mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
