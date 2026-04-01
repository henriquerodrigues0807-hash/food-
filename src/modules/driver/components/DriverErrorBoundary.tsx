import React, { ErrorInfo } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class DriverErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Driver Module Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="p-6 bg-red-500/10 rounded-full text-red-500">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Ops! Algo deu errado.</h1>
            <p className="text-white/40 max-w-[300px] mx-auto">
              Ocorreu um erro inesperado no módulo do entregador. Tente recarregar a página.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl active:scale-95 transition-transform"
          >
            <RefreshCcw size={18} />
            Recarregar App
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-white/5 rounded-xl text-xs text-left max-w-full overflow-auto text-red-400">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default DriverErrorBoundary;
