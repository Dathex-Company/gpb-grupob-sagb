import React from 'react';

interface DocumentErrorBoundaryProps {
  children: React.ReactNode;
}

interface DocumentErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class DocumentErrorBoundary extends React.Component<
  DocumentErrorBoundaryProps,
  DocumentErrorBoundaryState
> {
  constructor(props: DocumentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DocumentErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Falha inesperada ao renderizar documento.',
    };
  }

  componentDidCatch(error: Error): void {
    console.error('[DocumentErrorBoundary] erro de renderização:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-full items-center justify-center p-6"
          style={{ backgroundColor: 'var(--sagb-bg)' }}
        >
          <div
            className="max-w-md rounded-xl border p-4"
            style={{
              borderColor: 'var(--sagb-line)',
              backgroundColor: 'var(--sagb-surface)',
            }}
          >
            <h3
              className="text-sm font-black"
              style={{ color: 'var(--sagb-red)' }}
            >
              Erro ao exibir documento
            </h3>
            <p className="mt-2 text-xs" style={{ color: 'var(--sagb-muted)' }}>
              {this.state.message || 'Um documento corrompido interrompeu a renderização.'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-3 rounded px-3 py-1.5 text-xs font-semibold"
              style={{
                color: '#fff',
                backgroundColor: 'var(--sagb-primary)',
              }}
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

