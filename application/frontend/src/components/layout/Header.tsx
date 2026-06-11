import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Globe,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
  pageTitle: string;
}

const notifications = [
  { id: '1', title: 'Pod crash detected', message: 'api-gateway in staging-us-west-2', time: '2m ago', type: 'critical' as const },
  { id: '2', title: 'Node not ready', message: 'ip-10-3-4-71 in dev-ap-south-1', time: '15m ago', type: 'warning' as const },
  { id: '3', title: 'Deployment scaled', message: 'auth-service scaled to 3 replicas', time: '1h ago', type: 'info' as const },
];

const environments = ['Production', 'Staging', 'Development'];

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, onMobileMenuToggle, pageTitle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEnv, setShowEnv] = useState(false);
  const [environment, setEnvironment] = useState('Production');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (envRef.current && !envRef.current.contains(e.target as Node)) setShowEnv(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sidebarOffset = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <header
      className="fixed top-0 left-0 lg:left-[var(--sidebar-offset)] right-0 z-30 flex items-center h-[var(--header-height)] border-b transition-all duration-300"
      style={{
        '--sidebar-offset': sidebarOffset,
        backgroundColor: 'var(--surface-header)',
        borderColor: 'var(--surface-border)',
      } as React.CSSProperties}
    >
      <div className="flex items-center justify-between w-full px-4 lg:px-6">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden btn btn-ghost btn-sm p-2"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* Center: search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="search"
              placeholder="Search clusters, pods, deployments..."
              className="input pl-10 py-2 text-sm"
              aria-label="Global search"
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Environment selector */}
          <div className="relative hidden sm:block" ref={envRef}>
            <button
              onClick={() => setShowEnv(!showEnv)}
              className="btn btn-ghost btn-sm gap-1.5 px-3"
              aria-expanded={showEnv}
              aria-haspopup="listbox"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{environment}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showEnv && (
              <div className="absolute right-0 top-full mt-1 w-44 card py-1 shadow-lg z-50 animate-fade-in">
                {environments.map((env) => (
                  <button
                    key={env}
                    onClick={() => { setEnvironment(env); setShowEnv(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-bg)] transition-colors ${
                      environment === env ? 'text-blue-500 font-medium' : ''
                    }`}
                    style={{ color: environment === env ? undefined : 'var(--text-primary)' }}
                    role="option"
                    aria-selected={environment === env}
                  >
                    {env}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm p-2"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-ghost btn-sm p-2 relative"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-1 w-80 card shadow-lg z-50 animate-fade-in">
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--surface-border)' }}>
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-[var(--surface-bg)] transition-colors border-b last:border-0 cursor-pointer"
                      style={{ borderColor: 'var(--surface-border)' }}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`status-dot mt-1.5 status-dot-${n.type === 'critical' ? 'critical' : n.type === 'warning' ? 'warning' : 'info'}`} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 btn btn-ghost btn-sm px-2"
              aria-expanded={showProfile}
              aria-haspopup="menu"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 hidden sm:block" style={{ color: 'var(--text-muted)' }} />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-52 card py-1 shadow-lg z-50 animate-fade-in" role="menu">
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--surface-border)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--surface-bg)] transition-colors" role="menuitem">
                  <User className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                  Profile Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
