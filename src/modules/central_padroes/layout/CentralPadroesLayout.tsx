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
import ChatPietroPage from '../pages/ChatPietroPage';
import GovernancePanelPage from '../pages/GovernancePanelPage';
import { centralPadroesSeedService } from '../services/centralPadroesSeedService';
import { sidebarSections, getViewLabel, breadcrumbLabels } from '../data/sidebarConfig';
import '../styles/centralDocs.css';

type CentralPadroesView =
  | 'dashboard'
  | 'chat-pietro'
  | 'governance-panel'
  | 'areas'
  | 'standards'
  | 'documents'
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
  | 'publisher'
  | 'tags'
  | 'ingestion'
  | 'evidence';

export const CentralPadroesLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<CentralPadroesView>('dashboard');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [seedStatus, setSeedStatus] = useState<string>('');
  const [menuQuery, setMenuQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Central: true,
    Padrões: true,
    'Documentos e Decisões': true,
    Módulos: true,
    Curadoria: false,
    Relacionamentos: false
  });

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'chat-pietro':
        return <ChatPietroPage />;
      case 'governance-panel':
        return <GovernancePanelPage />;
      case 'areas':
        return <AreasPage />;
      case 'standards':
        return <StandardsPage />;
      case 'documents':
        return <DocumentsPage />;
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
      case 'tags':
        return <div className="cp-docs-empty"><h2>Tags</h2><p>Gerenciamento de tags — em desenvolvimento.</p></div>;
      case 'ingestion':
        return <div className="cp-docs-empty"><h2>Triagem e Ingestão</h2><p>Fila de ingestão de documentos — em desenvolvimento.</p></div>;
      case 'evidence':
        return <div className="cp-docs-empty"><h2>Evidências</h2><p>Registro de evidências — em desenvolvimento.</p></div>;
      default:
        return <DashboardPage />;
    }
  };

  const filteredTreeSections = useMemo(() => {
    const term = menuQuery.trim().toLowerCase();
    if (!term) return sidebarSections;
    return sidebarSections
      .map((section) => ({ ...section, rows: section.rows.filter((row) => row.label.toLowerCase().includes(term)) }))
      .filter((section) => section.rows.length > 0);
  }, [menuQuery]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const currentLabel = getViewLabel(currentView as string);

  const seedSupabase = async () => {
    setSeedStatus('Sincronizando fallback para Supabase...');
    try {
      const result = await centralPadroesSeedService.seedFallbackIntoSupabase();
      setSeedStatus(`Seed concluído: ${result.areas} áreas, ${result.standards} padrões, ${result.documents} docs, ${result.checklists} checklists, ${result.decisions} decisões, ${result.modules} módulos, ${result.baseModules} módulos base, ${result.agents} agentes.`);
    } catch (error) {
      setSeedStatus(`Falha no seed Supabase: ${String((error as Error)?.message || error)}`);
    }
  };

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
            <input placeholder="Pesquisar na Central" value={menuQuery} onChange={(event) => setMenuQuery(event.target.value)} />
          </label>

          <nav className="cp-docs-tree">
            {filteredTreeSections.map((section) => (
              <div key={section.label} className="cp-docs-tree-section">
                <button type="button" className="cp-docs-tree-label cp-docs-tree-label-button" onClick={() => toggleSection(section.label)}>
                  <span>{section.label}</span>
                  <span>{openSections[section.label] ? '⌄' : '›'}</span>
                </button>
                {(openSections[section.label] || Boolean(menuQuery.trim())) && section.rows.map((row, index) => {
                  const isActive = currentView === row.id;
                  const className = [
                    'cp-docs-tree-row',
                    isActive ? 'active' : '',
                    'indent-1',
                    'has-parent',
                    index === 0 ? 'is-first' : '',
                    index === section.rows.length - 1 ? 'is-last' : ''
                  ].filter(Boolean).join(' ');
                  return (
                    <button key={row.id} type="button" onClick={() => setCurrentView(row.id as CentralPadroesView)} className={className} title={row.label}>
                      <span>{row.icon}</span>
                      <span className="cp-docs-tree-text">{row.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
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
              <button className="cp-docs-top-link" type="button" onClick={() => setCurrentView('search')}>Buscar</button>
              <button className="cp-docs-top-link ai" type="button" onClick={() => setCurrentView('chat-pietro')}>Pietro IA</button>
              <button className="cp-docs-top-link" type="button" onClick={seedSupabase}>Sincronizar</button>
              <button className="cp-docs-top-link primary" type="button" onClick={() => setCurrentView('documents')}>Registrar</button>
              <button className="cp-docs-icon-btn" type="button" onClick={() => setCurrentView('settings')} title="Configurações">⋯</button>
            </div>
          </header>

          {renderCurrentView()}
          {seedStatus && <div className="cp-docs-toast">{seedStatus}</div>}
        </main>
      </div>

      <nav className="cp-docs-mobile-bottom">
        <button className={`cp-docs-mobile-item ${currentView === 'dashboard' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('dashboard')}>⌂<span>Início</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'chat-pietro' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('chat-pietro')}>💬<span>Pietro</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'search' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('search')}>⌕<span>Busca</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'governance-panel' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('governance-panel')}>📊<span>Gov</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'settings' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('settings')}>⋯<span>Mais</span></button>
      </nav>
    </div>
  );
};
