import { TabId } from '../../../../types';

export type InitiativeStatus = 'Ideia' | 'Estruturação' | 'Em teste' | 'Ativo' | 'Pausado' | 'Produto futuro';
export type InitiativeCategory =
  | 'Memória operacional'
  | 'Inteligência documental'
  | 'Reuniões e contexto'
  | 'Treinamento e capital intelectual'
  | 'Vídeo e contexto'
  | 'Criatividade e inteligência pessoal'
  | 'Aplicação comercial'
  | 'Análise multimodal'
  | 'Organização estratégica'
  | 'Gestão de portfólio';
export type InitiativePriority = 'Alta' | 'Média' | 'Baixa';
export type OperationalState = 'active' | 'inactive' | 'testing' | 'paused';

export type NagiInitiative = {
  id: string;
  title: string;
  shortDescription: string;
  heroDescription: string;
  status: InitiativeStatus;
  category: InitiativeCategory;
  priority: InitiativePriority;
  operationalState: OperationalState;
  value: string;
  currentStage: string;
  overview: string[];
  structure: {
    inputs: string[];
    processing: string[];
    outputs: string[];
    integrations: string[];
  };
  completed: string[];
  nextSteps: string[];
  documentsAndDecisions: string[];
  routeTab?: TabId;
  featured?: boolean;
};

export const STATUS_OPTIONS: InitiativeStatus[] = ['Ideia', 'Estruturação', 'Em teste', 'Ativo', 'Pausado', 'Produto futuro'];
export const CATEGORY_OPTIONS: InitiativeCategory[] = [
  'Memória operacional',
  'Inteligência documental',
  'Reuniões e contexto',
  'Treinamento e capital intelectual',
  'Vídeo e contexto',
  'Criatividade e inteligência pessoal',
  'Aplicação comercial',
  'Análise multimodal',
  'Organização estratégica',
  'Gestão de portfólio'
];
export const PRIORITY_OPTIONS: InitiativePriority[] = ['Alta', 'Média', 'Baixa'];

export const INITIATIVES: NagiInitiative[] = [
  {
    id: 'continuous-memory',
    title: 'Memória Contínua',
    shortDescription: 'Captação contínua de fala ao longo do dia, com blocos curtos, transcrição e organização temporal.',
    heroDescription: 'Captação contínua de fala e transcrição em blocos curtos para inteligência operacional.',
    status: 'Em teste',
    category: 'Memória operacional',
    priority: 'Alta',
    operationalState: 'active',
    value: 'Transforma fala espontânea em memória operacional estruturada dentro do SagB.',
    currentStage: 'Primeiro módulo real do NAGI, já funcional e validando a espinha dorsal da linha de captação e memória.',
    overview: [
      'Memória Contínua é a prova concreta de que o SagB pode captar a realidade do dia e convertê-la em inteligência utilizável.',
      'Ela grava continuamente, fragmenta em blocos curtos, transcreve, organiza por sessão e por tempo, e prepara o terreno para classificação, resumos e extrações.',
      'O projeto já nasce integrado à visão maior do NAGI, servindo como base para agentes, Fluxo de Inteligência e CID.'
    ],
    structure: {
      inputs: ['Áudio contínuo de microfone', 'Contexto da sessão, venture, projeto e sensibilidade'],
      processing: ['Chunking de 3 a 5 minutos', 'Persistência em storage', 'Transcrição por bloco', 'Timeline operacional com retry'],
      outputs: ['Áudio original por chunk', 'Transcrição estruturada', 'Jobs rastreáveis', 'Extrações iniciais e labels'],
      integrations: ['CID', 'Fluxo de Inteligência', 'Agentes', 'NIC']
    },
    completed: ['Captação contínua V1', 'Chunking temporal', 'Transcrição por bloco', 'Timeline do dia', 'Reprocessamento por chunk'],
    nextSteps: ['Classificação automática mais robusta', 'Resumos por sessão/manhã/tarde/dia', 'Extrações validadas por contexto', 'Leitura futura por agentes'],
    documentsAndDecisions: ['Módulo oficial do SAGB já implantado', 'Storage fora do banco', 'RLS e pipeline preparados para escalar'],
    routeTab: 'continuous-memory',
    featured: true
  },
  {
    id: 'cid',
    title: 'CID',
    shortDescription: 'Centro de Inteligência Documental para armazenar, transcrever, resumir e organizar documentos, áudios e vídeos.',
    heroDescription: 'Centro de inteligência documental para ingestão, transcrição e consolidação de materiais estratégicos.',
    status: 'Em teste',
    category: 'Inteligência documental',
    priority: 'Alta',
    operationalState: 'active',
    value: 'Concentra ativos documentais e multimídia em uma camada consultável, resumível e reutilizável pelo ecossistema.',
    currentStage: 'Estrutura avançada já implantada, com espaço para evolução de inteligência e governança documental.',
    overview: [
      'O CID organiza documentos, áudios, vídeos e saídas derivadas como ativo estratégico do SagB.',
      'É a camada que sustenta parte da inteligência documental do NAGI e funciona como repositório operacional para materiais vivos.',
      'No ecossistema, ele abastece consultas, resumos, consolidações e leitura futura por módulos e agentes.'
    ],
    structure: {
      inputs: ['Uploads de documentos, áudio e vídeo', 'Metadados de projeto, área e sensibilidade'],
      processing: ['Armazenamento', 'Fragmentação', 'Transcrição', 'Resumo e consolidação'],
      outputs: ['Assets', 'Chunks', 'Outputs textuais', 'Links e tags documentais'],
      integrations: ['NAGI', 'Fluxo de Inteligência', 'Governança', 'Agentes']
    },
    completed: ['Pipeline de upload', 'Jobs de processamento', 'Outputs e tags', 'Storage privado e RLS'],
    nextSteps: ['Busca semântica', 'Vínculos mais fortes com NAGI', 'Leitura contextual por módulo', 'Consolidação comercial futura'],
    documentsAndDecisions: ['CID permanece módulo próprio do SagB', 'NAGI o organiza como peça da linha de inteligência', 'Integração com memória e reuniões é prioritária'],
    routeTab: 'cid'
  },
  {
    id: 'nic',
    title: 'NIC - Núcleo de Inteligência Conectiva',
    shortDescription: 'Sistema de leitura estratégica que cruza documentos internos, encontra conexões e gera inteligência orientada a ação.',
    heroDescription: 'Motor de inteligência conectiva que encontra relações entre temas, metodologias e contextos organizacionais.',
    status: 'Em teste',
    category: 'Organização estratégica',
    priority: 'Alta',
    operationalState: 'active',
    value: 'Lê o que o CID prepara e gera inteligência qualificada para que o NAGI governe as frentes e decisões.',
    currentStage: 'Transição da interface de blueprint para motor real de leitura estratégica interna.',
    overview: [
      'O NIC atua como ponte inteligente entre o CID e o NAGI.',
      'Sua função primária hoje é cruzar materiais internos aplicando lentes de leitura para gerar priorização e decisão.',
      'O objetivo é identificar padrões recorrentes, tensões e sinergias, saindo da visão isolada de documento para uma visão de conexões ativas.'
    ],
    structure: {
      inputs: ['Múltiplos documentos preparados pelo CID', 'Lentes de análise definidas pelo usuário', 'Filtros de conteúdo interno'],
      processing: ['Cruzamento de documentos', 'Detecção de padrões e temas em comum', 'Identificação de conflitos e complementaridades'],
      outputs: ['Evidências e trechos conectados', 'Saídas estratégicas (hipóteses, recomendações)', 'Memória de análise salva para histórico'],
      integrations: ['CID', 'NAGI', 'Memória Contínua', 'Hub de Ventures']
    },
    completed: ['Evolução de Radar de Conexões para NIC', 'Estruturação base da tela orientada a motor de leitura', 'Conceito do ecossistema CID > NIC > NAGI consolidado'],
    nextSteps: ['Implementar motor real de cruzamento de conteúdos do CID', 'Habilitar seleção múltipla de documentos', 'Integrar saídas estratégicas ao NAGI para priorização'],
    documentsAndDecisions: ['O foco da V1 é puramente interno, sem acessar fontes externas', 'Não é apenas um mural estático, deve operar como lente ativa de leitura', 'Decidido fluxo oficial: CID prepara, NIC interpreta, NAGI governa'],
    routeTab: 'nic',
    featured: true
  }
];

export const statusTone: Record<InitiativeStatus, string> = {
  'Ideia': 'bg-slate-100 text-slate-700 border-slate-200',
  'Estruturação': 'bg-blue-50 text-blue-700 border-blue-200',
  'Em teste': 'bg-amber-50 text-amber-700 border-amber-200',
  'Ativo': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pausado': 'bg-gray-100 text-gray-600 border-gray-200',
  'Produto futuro': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
};

export const priorityTone: Record<InitiativePriority, string> = {
  'Alta': 'text-rose-600',
  'Média': 'text-amber-600',
  'Baixa': 'text-slate-500'
};

export const operationalMeta: Record<OperationalState, { label: string; dot: string; card: string; on: boolean }> = {
  active: { label: 'Ativo', dot: 'bg-emerald-500', card: '', on: true },
  inactive: { label: 'Inativo', dot: 'bg-rose-500', card: 'opacity-80 saturate-[0.85]', on: false },
  testing: { label: 'Em teste', dot: 'bg-amber-400', card: '', on: true },
  paused: { label: 'Pausado', dot: 'bg-slate-400', card: 'opacity-90', on: false }
};
