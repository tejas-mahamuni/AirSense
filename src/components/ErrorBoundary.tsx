import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Here we could send to Sentry/PostHog in the future
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl">warning</span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-on-surface mb-2">Something went wrong</h1>
          <p className="text-on-surface-variant mb-8 max-w-md">
            We encountered an unexpected error. Our systems have been notified. Please try refreshing the page.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={this.handleReset}
              className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-bold hover:bg-surface-container-highest/80 transition-colors"
            >
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-surface-container-lowest text-left rounded-xl border border-error/20 overflow-auto max-w-2xl w-full text-xs font-mono text-error">
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
