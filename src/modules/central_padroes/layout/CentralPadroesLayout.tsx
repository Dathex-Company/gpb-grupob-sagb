import React, { useMemo, useState } from 'react';
import DashboardPage from '../pages/DashboardPage';
import StandardsPage from '../pages/StandardsPage';
import DocumentsPage from '../pages/DocumentsPage';
import AreasPage from '../pages/AreasPage';
import ModulesPage from '../pages/ModulesPage';
import BaseModulesPage from '../pages/BaseModulesPage';
import ChecklistsPage from '../pages/ChecklistsPage';
import AuditsPage from '../pages/AuditsPage';
import DecisionsPage from '../pages/DecisionsPage';
import InternalDocsPage from '../pages/InternalDocsPage';
import ExternalDocsPage from '../pages/ExternalDocsPage';
import ArchivePage from '../pages/ArchivePage';
import DevModePage from '../pages/DevModePage';
import AgentsPage from '../pages/AgentsPage';
import SearchPage from '../pages/SearchPage';
import RelationshipsPage from '../pages/RelationshipsPage';
import ApprovalsPage from '../pages/ApprovalsPage';
import SettingsPage from '../pages/SettingsPage';
import CentralPadroesPage from '../pages/CentralPadroesPage';

type CentralPadroesView =
  | 'dashboard'
  | 'architecture'
  | 'areas'
  | 'standards'
  | 'documents'
  | 'registry'
  | 'base-modules'
  | 'modules'
  | 'checklists'
  | 'audits'
  | 'decisions'
  | 'internal-docs'
  | 'external-docs'
  | 'archive'
  | 'dev-mode'
  | 'agent-mode'
  | 'search'
  | 'relationships'
  | 'approvals'
  | 'settings'
  | 'publisher';

const navigationItems: Array<{ id: CentralPadroesView; label: string; group: string }> = [
  { id: 'dashboard', label: 'Visão Geral', group: 'Portal' },
  { id: 'architecture', label: 'Arquitetura Mestra', group: 'Portal' },
  { id: 'areas', label: 'Responsáveis e Áreas', group: 'Portal' },
  { id: 'standards', label: 'Biblioteca de Padrões', group: 'Bibliotecas' },
  { id: 'documents', label: 'Biblioteca de Documentos', group: 'Bibliotecas' },
  { id: 'registry', label: 'Registro Mestre', group: 'Bibliotecas' },
  { id: 'base-modules', label: 'Módulos Base', group: 'Módulos' },
  { id: 'modules', label: 'Módulos Plugáveis', group: 'Módulos' },
  { id: 'checklists', label: 'Matrizes e Checklists', group: 'Governança' },
  { id: 'audits', label: 'Auditorias e Evidências', group: 'Governança' },
  { id: 'decisions', label: 'Decisões e Exceções', group: 'Governança' },
  { id: 'internal-docs', label: 'Documentação Interna', group: 'Documentação' },
  { id: 'external-docs', label: 'Documentação Externa', group: 'Documentação' },
  { id: 'archive', label: 'Arquivo Morto / Legado', group: 'Documentação' },
  { id: 'dev-mode', label: 'Modo Dev', group: 'Modos' },
  { id: 'agent-mode', label: 'Modo Agente', group: 'Modos' },
  { id: 'search', label: 'Busca Inteligente', group: 'Inteligência' },
  { id: 'relationships', label: 'Relacionamentos / Grafo', group: 'Inteligência' },
  { id: 'approvals', label: 'Aprovações e Revisões', group: 'Operação' },
  { id: 'settings', label: 'Configurações', group: 'Operação' },
  { id: 'publisher', label: 'Publicador legado', group: 'Operação' }
];

export const CentralPadroesLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<CentralPadroesView>('dashboard');

  const groupedItems = useMemo(() => {
    return navigationItems.reduce<Record<string, typeof navigationItems>>((acc, item) => {
      acc[item.group] = acc[item.group] || [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'architecture':
        return <StandardsPage />;
      case 'areas':
        return <AreasPage />;
      case 'standards':
        return <StandardsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'registry':
        return <RelationshipsPage />;
      case 'base-modules':
        return <BaseModulesPage />;
      case 'modules':
        return <ModulesPage />;
      case 'checklists':
        return <ChecklistsPage />;
      case 'audits':
        return <AuditsPage />;
      case 'decisions':
        return <DecisionsPage />;
      case 'internal-docs':
        return <InternalDocsPage />;
      case 'external-docs':
        return <ExternalDocsPage />;
      case 'archive':
        return <ArchivePage />;
      case 'dev-mode':
        return <DevModePage />;
      case 'agent-mode':
        return <AgentsPage />;
      case 'search':
        return <SearchPage />;
      case 'relationships':
        return <RelationshipsPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'publisher':
        return <CentralPadroesPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="m-3 flex h-full overflow-hidden rounded-[var(--sagb-radius-xl)] border border-sagb-line bg-sagb-surface shadow-[var(--sagb-shadow)]">
      <aside className="flex w-72 shrink-0 flex-col border-r border-sagb-line bg-sagb-surface-soft">
        <div className="shrink-0 border-b border-sagb-line px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-[11px] font-black text-white">CP</div>
            <div>
              <h2 className="text-[14px] font-black tracking-tight text-sagb-text">Central de Padrões</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-sagb-muted">V1 · 18 agentes</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 pl-2 text-[10px] font-black uppercase tracking-[0.12em] text-sagb-muted">{group}</p>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`flex min-h-9 w-full items-center rounded-xl border px-3 py-2 text-left text-[12px] font-bold transition-colors ${
                        isActive
                          ? 'border-blue-500/30 bg-blue-500/10 text-sagb-text'
                          : 'border-transparent text-sagb-muted hover:bg-sagb-bg hover:text-sagb-text'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-sagb-line p-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'ecosystem' }))}
            className="flex h-10 w-full items-center rounded-xl px-3 text-[13px] font-bold text-sagb-muted hover:bg-sagb-bg hover:text-sagb-text"
          >
            Voltar ao SagB
          </button>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-sagb-bg">{renderCurrentView()}</main>
    </div>
  );
};

