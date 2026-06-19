import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Robust React Error Boundary to catch UI rendering crashes and render high-contrast visual recovery cards.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught React rendering crash detected:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
          <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm max-w-md w-full text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-stone-950">Structural Rendering Crash</h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              We encountered an unexpected error while rendering this section. Don't worry, your data is saved safely in LocalStorage.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-stone-400 bg-stone-50 rounded-lg p-3 text-left overflow-auto border border-stone-100 font-mono max-h-[120px]">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 text-white rounded-xl py-2 px-4 hover:bg-emerald-700 text-xs font-bold transition-all cursor-pointer shadow-3xs"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
