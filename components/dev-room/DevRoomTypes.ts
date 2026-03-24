import React from 'react';

// === TIPOS GERAIS DA SALA DEV ===

export type DevAgentStatus = 'IDLE' | 'WORKING' | 'WAITING_APPROVAL' | 'ERROR' | 'OFFLINE';
export type RunStatus = 'PLANNING' | 'EXECUTING' | 'PAUSED' | 'REVIEWING' | 'DONE';
export type EventStatus = 'PENDING' | 'RUNNING' | 'BLOCKED' | 'REVIEW' | 'APPROVED' | 'COMPLETED' | 'FAILED';

export interface DevAgent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: DevAgentStatus;
}

export interface DevRun {
  id: string;
  projectId: string;
  projectName: string;
  briefingSummary: string;
  status: RunStatus;
  currentStage: string;
  activeAgentId?: string;
  progressPercent: number;
  nextSteps: string[];
}

export interface AgentFlowEvent {
  id: string;
  agentId: string;
  actionType: 'PLAN' | 'CODE' | 'REVIEW' | 'APPROVE' | 'ERROR' | 'MESSAGE' | 'HANDOFF' | 'SYSTEM';
  summary: string;
  motive?: string;
  input?: string;
  output?: string;
  generatedArtifactId?: string;
  status: EventStatus;
  timestamp: Date;
  nextAgentId?: string;
  sourceAgentId?: string;
}

export interface DevFileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: DevFileNode[];
  content?: string;
  language?: string;
  status?: 'UNMODIFIED' | 'MODIFIED' | 'NEW' | 'DELETED';
  lastAuthorId?: string;
}

// === MOCKS INICIAIS ===

export const MOCK_DEV_AGENTS: DevAgent[] = [
  { id: 'dev-1', name: 'Orquestrador', role: 'Orquestrador de Desenvolvimento', avatarColor: '#10B981', status: 'WORKING' },
  { id: 'dev-2', name: 'Product Strat.', role: 'Product Strategist', avatarColor: '#8B5CF6', status: 'IDLE' },
  { id: 'dev-3', name: 'Sys Architect', role: 'System Architect', avatarColor: '#3B82F6', status: 'IDLE' },
  { id: 'dev-4', name: 'Planner', role: 'Project Planner', avatarColor: '#F59E0B', status: 'IDLE' },
  { id: 'dev-5', name: 'Frontend Eng.', role: 'Frontend Engineer', avatarColor: '#EC4899', status: 'IDLE' },
  { id: 'dev-6', name: 'Backend Eng.', role: 'Backend Engineer', avatarColor: '#06B6D4', status: 'IDLE' },
  { id: 'dev-7', name: 'DB Engineer', role: 'Database Engineer', avatarColor: '#F97316', status: 'IDLE' },
  { id: 'dev-8', name: 'Integrations', role: 'Integrations Engineer', avatarColor: '#6366F1', status: 'IDLE' },
  { id: 'dev-9', name: 'Mobile Eng.', role: 'Mobile Engineer', avatarColor: '#14B8A6', status: 'IDLE' },
  { id: 'dev-10', name: 'AI Engineer', role: 'AI Engineer', avatarColor: '#84CC16', status: 'IDLE' },
  { id: 'dev-11', name: 'QA Reviewer', role: 'QA Reviewer', avatarColor: '#EF4444', status: 'IDLE' },
  { id: 'dev-12', name: 'DevOps Eng.', role: 'DevOps Engineer', avatarColor: '#64748B', status: 'IDLE' },
  { id: 'dev-13', name: 'Security Eng.', role: 'Security Engineer', avatarColor: '#334155', status: 'IDLE' },
  { id: 'dev-14', name: 'Tech Writer', role: 'Technical Writer', avatarColor: '#A855F7', status: 'IDLE' },
];

export const MOCK_RUN: DevRun = {
  id: 'run-1',
  projectId: 'proj-1',
  projectName: 'Novo Módulo de Relatórios',
  briefingSummary: 'Criar uma interface para extração de relatórios CSV do painel de administração, com filtros por data e usuário.',
  status: 'EXECUTING',
  currentStage: 'Arquitetura e Planejamento',
  activeAgentId: 'dev-1',
  progressPercent: 35,
  nextSteps: [
    'Aguardando aprovação do schema do banco',
    'Iniciar implementação de componentes UI',
    'Escrever testes unitários'
  ]
};

export const MOCK_FLOW_EVENTS: AgentFlowEvent[] = [
  {
    id: 'evt-1',
    agentId: 'dev-2',
    actionType: 'PLAN',
    summary: 'Definição de Requisitos e Escopo',
    motive: 'Início da Run solicitado pelo usuário.',
    input: 'Briefing: Criar módulo de exportação CSV.',
    output: 'Documento de requisitos detalhado com 5 filtros identificados.',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    nextAgentId: 'dev-3'
  },
  {
    id: 'evt-2',
    agentId: 'dev-3',
    actionType: 'CODE',
    summary: 'Modelagem da Arquitetura do Sistema',
    motive: 'Handoff recebido do Product Strategist.',
    input: 'Documento de requisitos de exportação.',
    output: 'Definição de 3 novas tabelas no schema e 2 endpoints de API.',
    generatedArtifactId: 'art-arch-1',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    sourceAgentId: 'dev-2',
    nextAgentId: 'dev-4'
  },
  {
    id: 'evt-3',
    agentId: 'dev-4',
    actionType: 'PLAN',
    summary: 'Criação do Cronograma de Tasks',
    motive: 'Necessidade de organizar as tarefas de implementação.',
    input: 'Diagrama de arquitetura e endpoints.',
    output: 'Backlog com 12 tasks distribuídas entre Frontend, Backend e DB.',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
    sourceAgentId: 'dev-3',
    nextAgentId: 'dev-1'
  },
  {
    id: 'evt-4',
    agentId: 'dev-1',
    actionType: 'REVIEW',
    summary: 'Orquestração e Verificação de Consistência',
    motive: 'Revisão obrigatória antes do início da implementação técnica.',
    input: 'Plano de execução e backlog.',
    output: 'Plano validado. Autorizando início do Database Engineer.',
    status: 'APPROVED',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    sourceAgentId: 'dev-4',
    nextAgentId: 'dev-7'
  },
  {
    id: 'evt-5',
    agentId: 'dev-7',
    actionType: 'CODE',
    summary: 'Criação do Schema e Migrations',
    motive: 'Implementação das tabelas de log de relatórios.',
    input: 'Especificação técnica do Database.',
    output: 'Script SQL gerado com sucesso.',
    generatedArtifactId: 'art-sql-1',
    status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    sourceAgentId: 'dev-1',
    nextAgentId: 'dev-11'
  },
  {
    id: 'evt-6',
    agentId: 'dev-11',
    actionType: 'REVIEW',
    summary: 'Validação de Qualidade de Dados',
    motive: 'Garantir que os índices das tabelas estão otimizados.',
    input: 'Scripts SQL de migração.',
    output: 'Revisão solicitada: Faltou index na coluna user_id.',
    status: 'REVIEW',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sourceAgentId: 'dev-7'
  },
  {
    id: 'evt-7',
    agentId: 'dev-7',
    actionType: 'CODE',
    summary: 'Correção de Índices no Banco',
    motive: 'Ajuste solicitado pelo QA Reviewer.',
    input: 'Feedback de falta de index.',
    output: 'Index adicionado. Re-enviando para validação.',
    status: 'RUNNING',
    timestamp: new Date(),
    sourceAgentId: 'dev-11'
  }
];

export const MOCK_FILE_TREE: DevFileNode[] = [
  {
    id: 'root',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'file-1',
            name: 'ReportGenerator.tsx',
            type: 'file',
            language: 'typescript',
            status: 'NEW',
            lastAuthorId: 'dev-5',
            content: 'export const ReportGenerator = () => {\n  return <div>Gerador de Relatórios</div>;\n};'
          }
        ]
      },
      {
        id: 'api',
        name: 'api',
        type: 'folder',
        children: [
          {
            id: 'file-2',
            name: 'reports.ts',
            type: 'file',
            language: 'typescript',
            status: 'UNMODIFIED',
            content: 'export const getReports = async () => [];'
          }
        ]
      }
    ]
  }
];
