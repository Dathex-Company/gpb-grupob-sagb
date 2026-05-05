import React, { useState } from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { MentoriasDashboardPage } from './pages/MentoriasDashboardPage';
import { MentoriasLibraryPage } from './pages/MentoriasLibraryPage';
import { MentoriaDetailPage } from './pages/MentoriaDetailPage';

type ViewType = 'dashboard' | 'library' | 'detail';

const MentoriasModuleContainer: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleNavigate = (newView: ViewType, id?: string) => {
    setView(newView);
    setSelectedId(id);
  };

  const handleBackToSagB = () => {
    window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'ecosystem' }));
  };

  const itensSidebar: { id: ViewType; label: string; icone: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icone: '🏠' },
    { id: 'library', label: 'Biblioteca', icone: '📚' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-sagb-bg text-sagb-text font-inter">
      {/* Sidebar vertical — Padrão SagB integrado (mesmo pattern do Metodologias) */}
      <aside className="w-64 shrink-0 bg-sagb-panel flex flex-col shadow-sm border-r border-sagb-line">
        {/* Branding / Título do módulo */}
        <div className="px-5 pt-6 pb-4 border-b border-sagb-line">
          <p className="text-[9px] uppercase tracking-[0.28em] font-black text-sagb-muted mb-1">Central de Mentorias</p>
          <h2 className="text-lg font-black tracking-tight text-sagb-text">Mentorias</h2>
        </div>
        {/* Navegação interna */}
        <nav className="flex-1 overflow-auto p-3 space-y-0.5">
          {itensSidebar.map((item) => {
            const ativo = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                  ativo
                    ? 'bg-sagb-bg-2 text-sagb-text border border-sagb-line shadow-sm'
                    : 'text-sagb-muted border border-transparent hover:bg-sagb-bg-2 hover:text-sagb-text hover:border-sagb-line'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icone}</span>
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
          {view === 'detail' && (
            <button
              type="button"
              disabled
              className="w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold bg-sagb-bg-2 text-sagb-text border border-sagb-line shadow-sm cursor-default"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-sm">📄</span>
                <span>Detalhamento</span>
              </span>
            </button>
          )}
        </nav>
        {/* Rodapé da sidebar — Voltar ao SagB */}
        <div className="p-3 border-t border-sagb-line">
          <button
            type="button"
            onClick={handleBackToSagB}
            className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide text-sagb-muted hover:text-sagb-blue hover:bg-sagb-bg-2 transition-all border border-transparent hover:border-sagb-line"
          >
            ← Voltar ao SagB
          </button>
        </div>
      </aside>
      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {view === 'dashboard' && <MentoriasDashboardPage onNavigate={handleNavigate} />}
        {view === 'library' && <MentoriasLibraryPage onNavigate={handleNavigate} />}
        {view === 'detail' && <MentoriaDetailPage id={selectedId} onBack={() => handleNavigate('library')} />}
      </main>
    </div>
  );
};

export const mentoriasRoutes: ModuleRoute = {
  path: '/mentorias',
  element: <MentoriasModuleContainer />,
  fullscreen: true
};
