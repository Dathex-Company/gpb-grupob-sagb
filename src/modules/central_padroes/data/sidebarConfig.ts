// ============================================================
// Central de Documentos e Padrões — Sidebar oficial
// ============================================================
// Fonte única da verdade para navegação interna do módulo.

export interface SidebarSection {
  label: string;
  icon: string;
  rows: SidebarRow[];
}

export interface SidebarRow {
  id: string;
  label: string;
  icon: string;
  help?: string;
}

export const sidebarSections: SidebarSection[] = [
  {
    label: 'Central',
    icon: '🏛️',
    rows: [
      { id: 'dashboard', label: 'Início', icon: '🏠', help: 'Visão executiva da Central.' },
      { id: 'chat-pietro', label: 'Assistente da Central', icon: '🧠', help: 'Apoio guiado para padrões e governança.' },
      { id: 'search', label: 'Buscar', icon: '🔎', help: 'Busca em documentos e padrões.' },
      { id: 'governance-panel', label: 'Painel de Governança', icon: '🛡️', help: 'Canonicidade, aprovações e riscos.' }
    ]
  },
  {
    label: 'Documentos e Padrões',
    icon: '📚',
    rows: [
      { id: 'documents', label: 'Documentos', icon: '🔵', help: 'Documentos oficiais, brutos, legados e registros.' },
      { id: 'standards', label: 'Padrões', icon: '🧭', help: 'Padrões normativos oficiais.' },
      { id: 'decisions', label: 'Decisões', icon: '🟣', help: 'Decisões técnicas e governança.' },
      { id: 'checklists', label: 'Checklists', icon: '✅', help: 'Listas de validação e execução.' }
    ]
  },
  {
    label: 'Auditoria e Execução',
    icon: '🧾',
    rows: [
      { id: 'audits', label: 'Auditorias', icon: '🧾', help: 'Achados, evidências e planos de ação.' },
      { id: 'relatorios', label: 'Relatórios', icon: '📊', help: 'Relatórios técnicos e executivos.' },
      { id: 'agent-mode', label: 'Execuções LOZE-TRACE', icon: '⚙️', help: 'Execuções de agentes e rastreabilidade.' },
      { id: 'evidence', label: 'Evidências', icon: '🧪', help: 'Provas, anexos e registros de validação.' }
    ]
  },
  {
    label: 'Módulos',
    icon: '🧩',
    rows: [
      { id: 'base-modules', label: 'Módulos Base', icon: '🧩', help: 'Módulos reutilizáveis.' },
      { id: 'modules', label: 'Links de Módulos', icon: '🔗', help: 'Vínculos entre módulos e padrões.' },
      { id: 'relationships', label: 'Dependências', icon: '🕸️', help: 'Relacionamentos e dependências.' },
      { id: 'tags', label: 'Tags', icon: '🏷️', help: 'Classificação futura.' }
    ]
  },
  {
    label: 'Curadoria',
    icon: '📦',
    rows: [
      { id: 'curadoria', label: 'Curadoria', icon: '📦', help: 'Materiais em curadoria: legado, duplicados, fora do padrão e itens para decisão futura.' },
      { id: 'ingestion', label: 'Triagem e Ingestão', icon: '📥', help: 'Fila de curadoria e entrada documental.' },
      { id: 'documentos-mestres', label: 'Documentos Mestres', icon: '📘', help: 'Acervo mestre em curadoria.' },
      { id: 'documento-base-99', label: 'Documento-base 99', icon: '📦', help: 'Base 99 e material bruto.' },
      { id: 'subdocumentos-previstos', label: 'Subdocumentos Previstos', icon: '🗂️', help: 'Documentos planejados.' }
    ]
  },
  {
    label: 'Operação',
    icon: '⚙️',
    rows: [
      { id: 'approvals', label: 'Aprovações Pendentes', icon: '🟡', help: 'Solicitações aguardando decisão.' },
      { id: 'settings', label: 'Configurações', icon: '⚙️', help: 'Configurações do módulo.' },
      { id: 'dev-mode', label: 'Modo Dev', icon: '🛠️', help: 'Ferramentas de operação e diagnóstico.' }
    ]
  }
];

export const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Início',
  'chat-pietro': 'Assistente da Central',
  search: 'Buscar',
  'governance-panel': 'Painel de Governança',
  documents: 'Documentos',
  standards: 'Padrões',
  decisions: 'Decisões',
  checklists: 'Checklists',
  audits: 'Auditorias',
  relatorios: 'Relatórios',
  'agent-mode': 'Execuções LOZE-TRACE',
  evidence: 'Evidências',
  'base-modules': 'Módulos Base',
  modules: 'Links de Módulos',
  relationships: 'Dependências',
  tags: 'Tags',
  curadoria: 'Curadoria',
  ingestion: 'Triagem e Ingestão',
  'documentos-mestres': 'Documentos Mestres',
  'documento-base-99': 'Documento-base 99',
  'subdocumentos-previstos': 'Subdocumentos Previstos',
  approvals: 'Aprovações Pendentes',
  settings: 'Configurações',
  'dev-mode': 'Modo Dev',
  areas: 'Áreas',
  'internal-docs': 'Docs Internos',
  'external-docs': 'Docs Externos',
  archive: 'Arquivo',
  publisher: 'Publicador'
};

export const getViewLabel = (viewId: string): string => breadcrumbLabels[viewId] || viewId;

export const getAllSidebarRows = (): SidebarRow[] => sidebarSections.flatMap((section) => section.rows);
