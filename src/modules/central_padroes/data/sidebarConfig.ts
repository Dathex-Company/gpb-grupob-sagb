// ============================================================
// Central de Padrões — Configuração centralizada da Sidebar (T1.2)
// ============================================================
// Fonte única da verdade para navegação.

export interface SidebarSection {
  label: string;
  icon: string;
  rows: SidebarRow[];
}

export interface SidebarRow {
  id: string;
  label: string;
  icon: string;
}

/**
 * Seções da sidebar com agrupamento por afinidade.
 * Cada row.id corresponde a uma view no CentralPadroesLayout.
 */
export const sidebarSections: SidebarSection[] = [
  {
    label: 'Central',
    icon: '📋',
    rows: [
      { id: 'dashboard', label: 'Início', icon: '⌂' },
      { id: 'chat-pietro', label: 'Pergunte ao Pietro', icon: '💬' },
      { id: 'search', label: 'Buscar', icon: '⌕' },
      { id: 'governance-panel', label: 'Painel de Governança', icon: '📊' }
    ]
  },
  {
    label: 'Padrões',
    icon: '📐',
    rows: [
      { id: 'standards', label: 'Padrões Normativos', icon: '📐' },
      { id: 'approvals', label: 'Aprovações Pendentes', icon: '✓' },
      { id: 'audit', label: 'Auditoria', icon: '📋' }
    ]
  },
  {
    label: 'Documentos e Decisões',
    icon: '📄',
    rows: [
      { id: 'documents', label: 'Documentos', icon: '📄' },
      { id: 'decisions', label: 'Decisões', icon: '⚖' },
      { id: 'checklists', label: 'Checklists', icon: '✅' }
    ]
  },
  {
    label: 'Módulos e Agentes',
    icon: '🔌',
    rows: [
      { id: 'base-modules', label: 'Módulos Base', icon: '🔌' },
      { id: 'module-links', label: 'Links de Módulos', icon: '🔗' },
      { id: 'agent-runs', label: 'Execuções de Agentes', icon: '🤖' }
    ]
  },
  {
    label: 'Curadoria',
    icon: '🏛️',
    rows: [
      { id: 'ingestion', label: 'Triagem e Ingestão', icon: '📥' },
      { id: 'evidence', label: 'Evidências', icon: '🔍' }
    ]
  },
  {
    label: 'Relacionamentos',
    icon: '🔀',
    rows: [
      { id: 'relationships', label: 'Dependências', icon: '🔀' },
      { id: 'tags', label: 'Tags', icon: '🏷' }
    ]
  }
];

/**
 * Mapa de breadcrumb por view id.
 */
export const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Início',
  'chat-pietro': 'Pergunte ao Pietro',
  search: 'Buscar',
  'governance-panel': 'Painel de Governança',
  standards: 'Padrões Normativos',
  approvals: 'Aprovações Pendentes',
  audit: 'Auditoria',
  documents: 'Documentos',
  decisions: 'Decisões',
  checklists: 'Checklists',
  'base-modules': 'Módulos Base',
  'module-links': 'Links de Módulos',
  'agent-runs': 'Execuções de Agentes',
  ingestion: 'Triagem e Ingestão',
  evidence: 'Evidências',
  relationships: 'Dependências',
  tags: 'Tags',
  settings: 'Configurações'
};

/**
 * Encontra o label de uma view pelo id.
 */
export const getViewLabel = (viewId: string): string => {
  return breadcrumbLabels[viewId] || viewId;
};

/**
 * Encontra todas as rows (para busca de navegação).
 */
export const getAllSidebarRows = (): SidebarRow[] => {
  return sidebarSections.flatMap(section => section.rows);
};
