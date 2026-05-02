import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Erro capturado:', error);
        console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-sagb-bg p-8">
                    <div className="max-w-lg w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                                <span className="text-lg">⚠️</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-tight">
                                    Erro na aplicação
                                </h2>
                                <p className="text-[9px] font-bold text-red-500 dark:text-red-500 uppercase tracking-widest">
                                    Um erro inesperado ocorreu
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-sagb-bg-2 rounded-xl p-4 mb-4 overflow-auto max-h-32 border border-red-100 dark:border-red-900">
                            <pre className="text-xs font-mono text-red-600 dark:text-red-300 whitespace-pre-wrap break-all">
                                {this.state.error?.message || 'Erro desconhecido'}
                            </pre>
                        </div>
                        <details className="mb-4">
                            <summary className="text-[9px] font-bold text-red-500 uppercase tracking-widest cursor-pointer hover:text-red-700">
                                Ver detalhes técnicos
                            </summary>
                            <pre className="mt-2 text-[9px] font-mono text-red-400 dark:text-red-500 whitespace-pre-wrap break-all max-h-48 overflow-auto bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                                {this.state.error?.stack || 'Sem stack trace'}
                            </pre>
                        </details>
                        <button
                            onClick={this.handleReset}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
