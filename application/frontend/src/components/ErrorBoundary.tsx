import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--surface-bg)' }}>
          <div className="card p-8 text-center max-w-md w-full">
            <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Something went wrong</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              An unexpected error occurred. Our team has been notified.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="rounded-lg p-4 mb-6 text-left text-xs font-mono overflow-auto max-h-40" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={this.handleRetry} className="btn btn-primary btn-md flex-1">
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="btn btn-secondary btn-md flex-1">
                <RefreshCw className="h-4 w-4" /> Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
