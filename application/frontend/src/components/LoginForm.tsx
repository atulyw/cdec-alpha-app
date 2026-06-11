import React, { useState } from 'react';
import { Cloud, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
  isLogin: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, isLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password);

      if (!result.success) {
        setError(result.error || (isLogin ? 'Invalid email or password' : 'Registration failed'));
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen gradient-auth flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-indigo-500 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CloudOps</h1>
              <p className="text-xs text-slate-400 tracking-wider uppercase">Control Plane</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Enterprise Cloud<br />Operations Platform
          </h2>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Monitor clusters, manage workloads, and orchestrate your cloud infrastructure from a single unified dashboard.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <span>99.99% Uptime SLA</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">CloudOps</h1>
          </div>

          <div className="card p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {isLogin ? 'Access your cloud operations dashboard' : 'Get started with CloudOps Control Plane'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    className="input"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input pr-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm p-0"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50" role="alert">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
                {loading ? (
                  <>
                    <div className="spinner h-4 w-4" />
                    Authenticating...
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center mt-6 text-xs text-slate-500">
            © 2026 CloudOps Control Plane. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
