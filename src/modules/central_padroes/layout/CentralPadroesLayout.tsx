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
import { centralPadroesSeedService } from '../services/centralPadroesSeedService';
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
  const [seedStatus, setSeedStatus] = useState<string>('');
  const [menuQuery, setMenuQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Visão Geral': true,
    Padrões: true,
    Protocolos: true,
    'Documentos-Mãe': true,
    Checklists: true,
    Matrizes: true,
    Validações: true,
    'Biblioteca de Módulos Base': true,
    Configurações: true
  });

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

  const treeSections = [
    {
      label: 'Visão Geral',
      rows: [
        { id: 'dashboard' as const, label: 'Visão Geral', icon: '⌂' },
        { id: 'architecture' as const, label: 'Arquitetura Mestra', icon: '◇' },
        { id: 'areas' as const, label: 'Responsáveis e Áreas', icon: '◦' }
      ]
    },
    {
      label: 'Padrões',
      rows: [
        { id: 'standards' as const, label: 'Padrões', icon: '📘' },
        { id: 'registry' as const, label: 'Registro Mestre', icon: '▤' }
      ]
    },
    {
      label: 'Protocolos',
      rows: [
        { id: 'decisions' as const, label: 'Decisões e Exceções', icon: '⚑' },
        { id: 'approvals' as const, label: 'Aprovações e Revisões', icon: '●' }
      ]
    },
    {
      label: 'Documentos-Mãe',
      rows: [
        { id: 'documents' as const, label: 'Documentos', icon: '📄' },
        { id: 'internal-docs' as const, label: 'Documentação Interna', icon: '⌘' },
        { id: 'external-docs' as const, label: 'Documentação Externa', icon: '↗' },
        { id: 'archive' as const, label: 'Arquivo / Legado', icon: '◫' }
      ]
    },
    {
      label: 'Checklists',
      rows: [
        { id: 'checklists' as const, label: 'Checklists Operacionais', icon: '✓' }
      ]
    },
    {
      label: 'Matrizes',
      rows: [
        { id: 'relationships' as const, label: 'Relacionamentos / Grafo', icon: '⟲' }
      ]
    },
    {
      label: 'Validações',
      rows: [
        { id: 'audits' as const, label: 'Auditorias e Evidências', icon: '↗' },
        { id: 'search' as const, label: 'Busca Textual', icon: '⌕' },
        { id: 'agent-mode' as const, label: 'Preparação Pietro', icon: '✦' }
      ]
    },
    {
      label: 'Biblioteca de Módulos Base',
      rows: [
        { id: 'base-modules' as const, label: 'Gate Modular Pré-Dev', icon: '□' },
        { id: 'modules' as const, label: 'Módulos Plugáveis', icon: '▣' }
      ]
    },
    {
      label: 'Configurações',
      rows: [
        { id: 'settings' as const, label: 'Configurações', icon: '⚙' },
        { id: 'dev-mode' as const, label: 'Modo Dev', icon: '</>' },
        { id: 'publisher' as const, label: 'Publicador legado', icon: '↳' }
      ]
    }
  ];

  const filteredTreeSections = useMemo(() => {
    const term = menuQuery.trim().toLowerCase();
    if (!term) return treeSections;
    return treeSections
      .map((section) => ({ ...section, rows: section.rows.filter((row) => row.label.toLowerCase().includes(term)) }))
      .filter((section) => section.rows.length > 0);
  }, [menuQuery]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const currentLabel = navigationItems.find((item) => item.id === currentView)?.label || 'Central de Padrões';

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
                    <button key={row.id} type="button" onClick={() => setCurrentView(row.id)} className={className} title={row.label}>
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
              <button className="cp-docs-top-link ai" type="button">IA</button>
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
        <button className={`cp-docs-mobile-item ${currentView === 'documents' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('documents')}>📄<span>Docs</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'search' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('search')}>⌕<span>Busca</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'dashboard' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('dashboard')}>⌂<span>Início</span></button>
        <button className={`cp-docs-mobile-item ${currentView === 'settings' ? 'active' : ''}`} type="button" onClick={() => setCurrentView('settings')}>⋯<span>Mais</span></button>
      </nav>
    </div>
  );
};
