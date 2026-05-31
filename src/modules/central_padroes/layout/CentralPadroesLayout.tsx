import React, { useState } from 'react';
import CentralPadroesPage from '../pages/CentralPadroesPage';

type CentralPadroesView = 'overview';

export const CentralPadroesLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<CentralPadroesView>('overview');

  const navigationItems: { id: CentralPadroesView; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      )
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
      default:
        return <CentralPadroesPage />;
    }
  };

  return (
    <div
      className="m-3 flex h-full overflow-hidden"
      style={{
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        backgroundColor: 'var(--sagb-surface)',
        boxShadow: 'var(--sagb-shadow)'
      }}
    >
      <aside
        className="flex w-64 shrink-0 flex-col"
        style={{ borderRight: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface-soft)' }}
      >
        <div className="h-16 shrink-0 px-5" style={{ borderBottom: '1px solid var(--sagb-line)' }}>
          <div className="flex h-full items-center gap-3">
            <div
              className="grid h-8 w-8 place-items-center rounded-[10px] text-[10px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, var(--sagb-primary), var(--sagb-blue))' }}
            >
              CP
            </div>
            <div>
              <h2 className="text-[14px] font-semibold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
                Central de Padrões
              </h2>
              <p
                className="text-[10px] font-medium uppercase tracking-[0.08em]"
                style={{ color: 'var(--sagb-muted)' }}
              >
                robust clean
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          <div>
            <p
              className="mb-2 pl-2 text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--sagb-muted)' }}
            >
              Main
            </p>
            {navigationItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className="mb-1 flex h-9 w-full items-center gap-3 rounded-[var(--sagb-radius-sm)] border px-3 text-[13px] font-medium transition-colors"
                  style={{
                    borderColor: isActive ? 'var(--sagb-primary-soft)' : 'transparent',
                    backgroundColor: isActive ? 'var(--sagb-primary-soft)' : 'transparent',
                    color: isActive ? 'var(--sagb-text)' : 'var(--sagb-muted)'
                  }}
                >
                  <div style={{ color: isActive ? 'var(--sagb-primary)' : 'var(--sagb-muted)' }}>{item.icon}</div>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 p-3" style={{ borderTop: '1px solid var(--sagb-line)' }}>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'ecosystem' }))}
            className="flex h-9 w-full items-center gap-3 rounded-[var(--sagb-radius-sm)] border border-transparent px-3 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao SagB
          </button>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: 'var(--sagb-bg)' }}>
        {renderCurrentView()}
      </main>
    </div>
  );
};

