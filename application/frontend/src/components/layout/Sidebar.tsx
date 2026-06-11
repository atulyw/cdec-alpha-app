import React from 'react';
import {
  LayoutDashboard,
  Box,
  Server,
  GraduationCap,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Cloud,
} from 'lucide-react';

export type PageId = 'overview' | 'pods' | 'clusters' | 'courses' | 'enrollments';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" />, section: 'Operations' },
  { id: 'pods', label: 'Pods', icon: <Box className="h-5 w-5" /> },
  { id: 'clusters', label: 'Clusters', icon: <Server className="h-5 w-5" /> },
  { id: 'courses', label: 'Courses', icon: <GraduationCap className="h-5 w-5" />, section: 'Learning' },
  { id: 'enrollments', label: 'Enrollments', icon: <ClipboardList className="h-5 w-5" /> },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  let lastSection = '';

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'
      }`}
      style={{ backgroundColor: 'var(--surface-sidebar)' }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex items-center h-[var(--header-height)] px-4 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-slide-in-left min-w-0">
              <h1 className="text-base font-bold text-white truncate">CloudOps</h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase">Control Plane</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3">
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <React.Fragment key={item.id}>
              {showSection && !collapsed && (
                <p className="px-3 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {item.section}
                </p>
              )}
              {showSection && collapsed && <div className="h-4" />}
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
                  currentPage === item.id
                    ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 ${currentPage === item.id ? 'text-blue-400' : ''}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {currentPage === item.id && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" aria-hidden="true" />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors text-sm"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
