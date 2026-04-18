export interface NICMetric {
  label: string;
  value: string;
  note: string;
}

export interface NICLens {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface NICAnalysisBlock {
  title: string;
  items: string[];
}

export const nicMetrics: NICMetric[] = [
  {
    label: 'Fluxo Operacional',
    value: 'CID > NIC > NAGI',
    note: 'Preparar > Interpretar > Governar'
  },
  {
    label: 'Foco da Fase',
    value: 'Materiais Internos',
    note: 'Cruzamento de documentos, transcrições e memórias do SagB'
  },
  {
    label: 'Estado do Motor',
    value: 'Interface Ativa',
    note: 'Blueprint operacional pronto, ainda com documentos mockados até integração real com o CID'
  }
];

export const nicLenses: NICLens[] = [
  { id: 'opportunity', name: 'Oportunidade', description: 'Identifica novos caminhos de negócio ou produto', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'risk', name: 'Risco', description: 'Detecta ameaças, gargalos ou redundâncias críticas', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { id: 'synergy', name: 'Sinergia', description: 'Pontos de união entre projetos e áreas diferentes', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
  { id: 'contradiction', name: 'Contradição', description: 'Tensões ou informações conflitantes entre documentos', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: 'methodology', name: 'Metodologias', description: 'Conexão entre práticas e frameworks aplicados', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'pattern', name: 'Padrão Recorrente', description: 'Temas ou dores que se repetem em múltiplos contextos', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' }
];

export const nicMotorComponents: NICAnalysisBlock[] = [
  {
    title: 'Cruzamento Semântico',
    items: ['Análise de termos comuns entre documentos', 'Identificação de proximidade de temas', 'Mapeamento de citações indiretas']
  },
  {
    title: 'Detecção de Tensões',
    items: ['Divergências de prioridade entre áreas', 'Gaps de informação entre CID e Operação', 'Inconsistências metodológicas']
  },
  {
    title: 'Filtros de Inteligência',
    items: ['Leitura por Venture específica', 'Visão por Projeto ou Unidade', 'Agrupamento por sensibilidade de dado']
  }
];

export const nicStrategicOutputs: NICAnalysisBlock[] = [
  {
    title: 'Conexões Principais',
    items: ['Genealogia de ideias (de onde veio, para onde vai)', 'Dependências críticas entre frentes']
  },
  {
    title: 'Hipóteses e Recomendações',
    items: ['Sugestões de reaproveitamento de módulos', 'Indicação de spin-offs potenciais']
  },
  {
    title: 'Próximos Passos (NAGI)',
    items: ['Qualificação para priorização no NAGI', 'Encaminhamento para Mesa de Decisão']
  }
];

export const nicHistoryExamples = [
  { id: '1', date: '2026-03-20', title: 'Análise de Sinergia: 3forB & StartyB', documents: 4, lens: 'Sinergia' },
  { id: '2', date: '2026-03-18', title: 'Mapeamento de Riscos: Infra Nuexus', documents: 3, lens: 'Risco' },
  { id: '3', date: '2026-03-15', title: 'Conexão Metodológica: GERAC & M.A.V', documents: 2, lens: 'Metodologias' }
];
