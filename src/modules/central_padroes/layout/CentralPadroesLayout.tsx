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
import '../styles/centralDocs.css';

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
  const [mode, setMode] = useState<'light' | 'dark'>('light');

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

  const treeRows = [
    { id: 'dashboard' as const, label: 'Visão Geral', icon: '⌂' },
    { id: 'architecture' as const, label: 'Arquitetura Mestra', icon: '◇' },
    { label: 'Documentos-Mãe', icon: '▾', disabled: true },
    { id: 'areas' as const, label: 'Responsáveis e Áreas', icon: '◦', indent: 1, parent: true, first: true },
    { id: 'documents' as const, label: 'Biblioteca de Documentos', icon: '📄', indent: 1, parent: true },
    { id: 'standards' as const, label: 'Padrões Atômicos', icon: '📘', indent: 1, parent: true, last: true },
    { label: 'Governança', icon: '▾', disabled: true },
    { id: 'checklists' as const, label: 'Matrizes e Checklists', icon: '✓', indent: 1, parent: true, first: true },
    { id: 'audits' as const, label: 'Auditorias e Evidências', icon: '↗', indent: 1, parent: true },
    { id: 'decisions' as const, label: 'Decisões e Exceções', icon: '⚑', indent: 1, parent: true, last: true },
    { label: 'Módulos e Inteligência', icon: '▾', disabled: true },
    { id: 'base-modules' as const, label: 'Módulos Base', icon: '□', indent: 1, parent: true, first: true },
    { id: 'modules' as const, label: 'Módulos Plugáveis', icon: '▣', indent: 1, parent: true },
    { id: 'relationships' as const, label: 'Relacionamentos / Grafo', icon: '⟲', indent: 1, parent: true },
    { id: 'search' as const, label: 'Busca Inteligente', icon: '⌕', indent: 1, parent: true, last: true },
    { label: 'Operação', icon: '▾', disabled: true },
    { id: 'approvals' as const, label: 'Aprovações e Revisões', icon: '●', indent: 1, parent: true, first: true },
    { id: 'dev-mode' as const, label: 'Modo Dev', icon: '</>', indent: 1, parent: true },
    { id: 'agent-mode' as const, label: 'Modo Agente', icon: '✦', indent: 1, parent: true },
    { id: 'publisher' as const, label: 'Publicador legado', icon: '↳', indent: 1, parent: true, last: true }
  ];

  const currentLabel = navigationItems.find((item) => item.id === currentView)?.label || 'Central de Padrões';

  return (
    <div className="cp-docs-root h-full overflow-hidden" data-mode={mode}>
      <div className="cp-docs-app h-full">
        <aside className="cp-docs-sidebar">
          <div className="cp-docs-brand-row">
            <div className="cp-docs-brand"><span className="cp-docs-brand-dot">CP</span><span>Central de Padrões</span></div>
            <button className="cp-docs-icon-btn" type="button" title="Alternar modo" onClick={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}>◐</button>
          </div>

          <label className="cp-docs-search">
            <span>⌕</span>
            <input placeholder="Pesquisar padrões" />
          </label>

          <nav className="cp-docs-tree">
            <div className="cp-docs-tree-label">Workspace</div>
            {treeRows.map((row, index) => {
              if (row.disabled) return <div key={`${row.label}-${index}`} className="cp-docs-tree-label">{row.label}</div>;
              const isActive = currentView === row.id;
              const className = [
                'cp-docs-tree-row',
                isActive ? 'active' : '',
                row.indent ? `indent-${row.indent}` : '',
                row.parent ? 'has-parent' : '',
                row.first ? 'is-first' : '',
                row.last ? 'is-last' : ''
              ].filter(Boolean).join(' ');
              return (
                <button key={row.id} type="button" onClick={() => setCurrentView(row.id)} className={className}>
                  <span>{row.icon}</span>
                  <span className="cp-docs-tree-text">{row.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="cp-docs-sidebar-foot">
            <button type="button" onClick={() => setCurrentView('settings')} className={`cp-docs-tree-row ${currentView === 'settings' ? 'active' : ''}`}><span>⚙</span><span className="cp-docs-tree-text">Configurações</span></button>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'ecosystem' }))} className="cp-docs-tree-row"><span>←</span><span className="cp-docs-tree-text">Voltar ao SagB</span></button>
          </div>
        </aside>

        <main className="cp-docs-main">
          <header className="cp-docs-topbar">
            <div className="cp-docs-crumbs"><span>GrupoB</span><span className="sep">›</span><span>Central de Padrões</span><span className="sep">›</span><strong>{currentLabel}</strong></div>
            <div className="cp-docs-top-actions">
              <button className="cp-docs-top-link" type="button">Editar</button>
              <button className="cp-docs-top-link ai" type="button">IA</button>
              <button className="cp-docs-top-link" type="button">Compartilhar</button>
              <button className="cp-docs-top-link primary" type="button" onClick={() => setCurrentView('documents')}>Novo</button>
              <button className="cp-docs-icon-btn" type="button">⋯</button>
            </div>
          </header>

          {renderCurrentView()}
        </main>
      </div>

      <nav className="cp-docs-mobile-bottom">
        <button className="cp-docs-mobile-item active" type="button" onClick={() => setCurrentView('documents')}>📄<span>Docs</span></button>
        <button className="cp-docs-mobile-item" type="button" onClick={() => setCurrentView('search')}>⌕<span>Busca</span></button>
        <button className="cp-docs-mobile-item" type="button" onClick={() => setCurrentView('documents')}>+<span>Novo</span></button>
        <button className="cp-docs-mobile-item" type="button" onClick={() => setCurrentView('settings')}>⋯<span>Mais</span></button>
      </nav>
    </div>
  );
};
