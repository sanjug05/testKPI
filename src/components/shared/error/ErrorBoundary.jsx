import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Application boundary captured error', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-effect m-4 flex min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
          <AlertTriangle className="text-amber-300" size={32} />
          <div>
            <h2 className="text-lg font-semibold text-white">We could not render this workspace</h2>
            <p className="mt-1 max-w-xl text-xs text-white/60">The dashboard recovered gracefully. Retry the section or contact support if the issue continues.</p>
          </div>
          <button type="button" onClick={this.handleRetry} className="inline-flex items-center gap-2 rounded-lg border border-teal/40 px-3 py-2 text-xs text-teal transition hover:bg-teal/10">
            <RefreshCcw size={14} /> Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
