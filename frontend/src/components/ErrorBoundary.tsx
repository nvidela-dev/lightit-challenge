import { Component, ErrorInfo, ReactNode } from 'react';
import { XCircleIcon } from './icons';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
          <div className="glass-section rounded-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-slate-800 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 text-sm mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {error && (
              <pre className="text-left text-xs bg-slate-100 rounded-lg p-3 mb-6 overflow-auto max-h-32 text-slate-600">
                {error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="glass-button text-white px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
