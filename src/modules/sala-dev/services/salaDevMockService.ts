import {
  AgentCatalogEntity,
  ArtifactEntity,
  ArtifactVersionEntity,
  DevRunEntity,
  FinalAuditEntity,
  GateChecklistEntity,
  GateEntity,
  HandoffEntity,
  MacroLayerEntity,
  RecommendedAgentEntity,
  RunAgentEntity,
  RunDecisionEntity,
  RunLogEntity,
  RunRiskEntity
} from '../types/salaDev.domain';
import { AgentFlowEvent, DevAgent, DevFileNode, DevRun, SalaDevDomainSnapshot } from '../types/salaDev.types';
import { salaDevTechnicalBridgeService } from './salaDevTechnicalBridgeService';

const MOCK_DEV_AGENTS: DevAgent[] = [
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

const MOCK_RUN: DevRun = {
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

const MOCK_FLOW_EVENTS: AgentFlowEvent[] = [
  {
    id: 'evt-1', agentId: 'dev-2', actionType: 'PLAN', summary: 'Definição de Requisitos e Escopo', motive: 'Início da Run solicitado pelo usuário.',
    input: 'Briefing: Criar módulo de exportação CSV.', output: 'Documento de requisitos detalhado com 5 filtros identificados.', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), nextAgentId: 'dev-3'
  },
  {
    id: 'evt-2', agentId: 'dev-3', actionType: 'CODE', summary: 'Modelagem da Arquitetura do Sistema', motive: 'Handoff recebido do Product Strategist.',
    input: 'Documento de requisitos de exportação.', output: 'Definição de 3 novas tabelas no schema e 2 endpoints de API.', generatedArtifactId: 'art-arch-1', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), sourceAgentId: 'dev-2', nextAgentId: 'dev-4'
  },
  {
    id: 'evt-3', agentId: 'dev-4', actionType: 'PLAN', summary: 'Criação do Cronograma de Tasks', motive: 'Necessidade de organizar as tarefas de implementação.',
    input: 'Diagrama de arquitetura e endpoints.', output: 'Backlog com 12 tasks distribuídas entre Frontend, Backend e DB.', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), sourceAgentId: 'dev-3', nextAgentId: 'dev-1'
  },
  {
    id: 'evt-4', agentId: 'dev-1', actionType: 'REVIEW', summary: 'Orquestração e Verificação de Consistência', motive: 'Revisão obrigatória antes do início da implementação técnica.',
    input: 'Plano de execução e backlog.', output: 'Plano validado. Autorizando início do Database Engineer.', status: 'APPROVED',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), sourceAgentId: 'dev-4', nextAgentId: 'dev-7'
  },
  {
    id: 'evt-5', agentId: 'dev-7', actionType: 'CODE', summary: 'Criação do Schema e Migrations', motive: 'Implementação das tabelas de log de relatórios.',
    input: 'Especificação técnica do Database.', output: 'Script SQL gerado com sucesso.', generatedArtifactId: 'art-sql-1', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), sourceAgentId: 'dev-1', nextAgentId: 'dev-11'
  },
  {
    id: 'evt-6', agentId: 'dev-11', actionType: 'REVIEW', summary: 'Validação de Qualidade de Dados', motive: 'Garantir que os índices das tabelas estão otimizados.',
    input: 'Scripts SQL de migração.', output: 'Revisão solicitada: Faltou index na coluna user_id.', status: 'REVIEW',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), sourceAgentId: 'dev-7'
  },
  {
    id: 'evt-7', agentId: 'dev-7', actionType: 'CODE', summary: 'Correção de Índices no Banco', motive: 'Ajuste solicitado pelo QA Reviewer.',
    input: 'Feedback de falta de index.', output: 'Index adicionado. Re-enviando para validação.', status: 'RUNNING',
    timestamp: new Date(), sourceAgentId: 'dev-11'
  }
];

const MOCK_FILE_TREE: DevFileNode[] = [{
  id: 'root', name: 'src', type: 'folder', children: [
    { id: 'components', name: 'components', type: 'folder', children: [{ id: 'file-1', name: 'ReportGenerator.tsx', type: 'file', language: 'typescript', status: 'NEW', lastAuthorId: 'dev-5', content: 'export const ReportGenerator = () => {\n  return <div>Gerador de Relatórios</div>;\n};' }] },
    { id: 'api', name: 'api', type: 'folder', children: [{ id: 'file-2', name: 'reports.ts', type: 'file', language: 'typescript', status: 'UNMODIFIED', content: 'export const getReports = async () => [];' }] }
  ]
}];

const NOW = new Date();

const MOCK_RUN_DOMAIN: DevRunEntity = {
  id: 'run-1',
  projectId: 'proj-1',
  title: 'Novo Módulo de Relatórios',
  status: 'running',
  currentMacroLayerId: 'macro-2',
  currentGateId: 'gate-2',
  activeAgentId: 'dev-1',
  riskLevel: 'medium',
  progress: 35,
  startedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 3),
  updatedAt: NOW,
  executionEnvironment: 'sagb_ui'
};

const MOCK_MACRO_LAYERS: MacroLayerEntity[] = [
  { id: 'macro-1', name: 'Escopo e Requisitos', order: 1, description: 'Consolidar escopo, requisitos e critérios mínimos de aceitação.', status: 'completed', progress: 100, agentsCount: 2, handoffsCount: 1, gatesCount: 1, artifactsCount: 1, riskLevel: 'low', nextRecommendedAction: 'Encaminhar pacote validado para Arquitetura' },
  { id: 'macro-2', name: 'Arquitetura', order: 2, description: 'Definir modelagem técnica, contratos e estrutura de implementação.', status: 'running', progress: 55, agentsCount: 3, handoffsCount: 2, gatesCount: 1, artifactsCount: 2, riskLevel: 'medium', nextRecommendedAction: 'Concluir revisão de schema e aprovar gate de arquitetura' },
  { id: 'macro-3', name: 'Construção', order: 3, description: 'Executar desenvolvimento dos blocos funcionais do MVP.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'medium', nextRecommendedAction: 'Aguardar aprovação da arquitetura' },
  { id: 'macro-4', name: 'Revisão e Segurança', order: 4, description: 'Executar validações de qualidade, segurança e conformidade.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'medium', nextRecommendedAction: 'Planejar checklist de revisão e segurança' },
  { id: 'macro-5', name: 'Deploy e Observabilidade', order: 5, description: 'Preparar publicação e monitoramento do MVP em produção.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'high', nextRecommendedAction: 'Definir plano de deploy e observabilidade' },
  { id: 'macro-6', name: 'Auditoria Final', order: 6, description: 'Consolidar rastreabilidade, parecer final e fechamento da run.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'medium', nextRecommendedAction: 'Estruturar checkpoints de auditoria final' }
];

const MOCK_RUN_AGENTS: RunAgentEntity[] = [
  { agentId: 'dev-1', name: 'Orquestrador', role: 'Orquestrador de Desenvolvimento', layer: 'Arquitetura', macroLayerId: 'macro-2', status: 'active', activationReason: 'Coordenação da run', technicalNeed: 'Coordenação de handoffs e gates', complexityLevel: 'high', skills: ['coordenação', 'priorização'], isOfficialAgentReference: true },
  { agentId: 'dev-3', name: 'Sys Architect', role: 'System Architect', layer: 'Arquitetura', macroLayerId: 'macro-2', status: 'summoned', activationReason: 'Definição de arquitetura', technicalNeed: 'Modelagem de contratos e fronteiras', complexityLevel: 'high', skills: ['arquitetura', 'integração'], dnaVersionId: 'dna-arch-v1', isOfficialAgentReference: true },
  { agentId: 'dev-7', name: 'DB Engineer', role: 'Database Engineer', layer: 'Arquitetura', macroLayerId: 'macro-2', status: 'waiting', activationReason: 'Ajustes de schema para gate de arquitetura', technicalNeed: 'Índices e qualidade de consulta', complexityLevel: 'medium', skills: ['sql', 'migrations'], dnaVersionId: 'dna-db-v1', isOfficialAgentReference: true }
];

const MOCK_AVAILABLE_AGENTS: AgentCatalogEntity[] = [
  { agentId: 'dev-11', name: 'QA Reviewer', role: 'QA Reviewer', specialty: 'Qualidade e revisão', suggestedMacroLayerId: 'macro-4', availability: 'available', technicalNeeds: ['qa', 'auditoria técnica'], skills: ['qa', 'review'], complexityFit: 'medium', isOfficialAgentReference: true },
  { agentId: 'dev-12', name: 'DevOps Eng.', role: 'DevOps Engineer', specialty: 'Deploy e observabilidade', suggestedMacroLayerId: 'macro-5', availability: 'available', technicalNeeds: ['deploy', 'monitoramento'], skills: ['deploy', 'monitoramento'], complexityFit: 'high', isOfficialAgentReference: true },
  { agentId: 'dev-13', name: 'Security Eng.', role: 'Security Engineer', specialty: 'Segurança de aplicação', suggestedMacroLayerId: 'macro-4', availability: 'limited', technicalNeeds: ['segurança', 'hardening'], skills: ['security', 'threat-model'], complexityFit: 'high', isOfficialAgentReference: true },
  { agentId: 'dev-10', name: 'AI Engineer', role: 'AI Engineer', specialty: 'Automação e IA aplicada', suggestedMacroLayerId: 'macro-3', availability: 'available', technicalNeeds: ['ia', 'assistência de código'], skills: ['llm', 'prompt-engineering'], complexityFit: 'high', isOfficialAgentReference: true }
];

const MOCK_RECOMMENDED_AGENTS: RecommendedAgentEntity[] = [
  {
    recommendationId: 'rec-1',
    agentId: 'dev-11',
    macroLayerId: 'macro-2',
    priority: 'high',
    associatedRiskLevel: 'medium',
    reasons: ['Gate de arquitetura em revisão', 'Risco de índices insuficientes'],
    technicalNeed: 'Validação de qualidade antes de avançar',
    complexity: 'medium',
    basedOn: ['current_stage', 'risk', 'complexity', 'audit']
  },
  {
    recommendationId: 'rec-2',
    agentId: 'dev-13',
    macroLayerId: 'macro-4',
    priority: 'critical',
    associatedRiskLevel: 'high',
    reasons: ['Necessidade de revisão de segurança para publicação'],
    technicalNeed: 'Threat model e checklist de segurança',
    complexity: 'high',
    basedOn: ['security', 'external_integration', 'deploy']
  }
];

const MOCK_HANDOFFS: HandoffEntity[] = [
  {
    id: 'handoff-1',
    runId: 'run-1',
    sourceAgentId: 'dev-2',
    targetAgentId: 'dev-3',
    macroLayerId: 'macro-2',
    reason: 'Passagem de requisitos para arquitetura',
    inputSummary: 'Documento com escopo e filtros',
    expectedOutput: 'Definição de schema e endpoints',
    relatedArtifactId: 'artifact-2',
    status: 'completed',
    gateId: 'gate-1',
    riskLevel: 'medium',
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2),
    completedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1)
  }
];

const MOCK_GATES: GateEntity[] = [
  {
    id: 'gate-1',
    runId: 'run-1',
    macroLayerId: 'macro-1',
    name: 'Gate de Requisitos',
    status: 'approved',
    checklist: ['Escopo validado', 'Critérios definidos'],
    responsibleAgentId: 'dev-1',
    riskLevel: 'low',
    decision: 'approved',
    observations: 'Pronto para arquitetura',
    approvedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5)
  },
  {
    id: 'gate-2',
    runId: 'run-1',
    macroLayerId: 'macro-2',
    name: 'Gate de Arquitetura',
    status: 'review',
    checklist: ['Schema preliminar', 'Endpoints mapeados'],
    responsibleAgentId: 'dev-1',
    riskLevel: 'medium'
  }
];

const MOCK_ARTIFACTS: ArtifactEntity[] = [
  {
    id: 'artifact-1',
    runId: 'run-1',
    macroLayerId: 'macro-1',
    agentId: 'dev-2',
    title: 'Documento de Requisitos',
    type: 'requisitos',
    status: 'approved',
    version: 'v1.0.0',
    gateId: 'gate-1',
    contentPreview: 'Escopo e critérios da feature',
    filePath: 'docs/requirements.md',
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2.5),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2)
  },
  {
    id: 'artifact-2',
    runId: 'run-1',
    macroLayerId: 'macro-2',
    agentId: 'dev-3',
    title: 'Arquitetura Inicial',
    type: 'architecture',
    status: 'review',
    version: 'v0.2.0',
    handoffId: 'handoff-1',
    gateId: 'gate-2',
    contentPreview: 'Schema + API draft',
    filePath: 'docs/architecture.md',
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 45)
  }
];

const MOCK_ARTIFACT_VERSIONS: ArtifactVersionEntity[] = [
  { id: 'artv-1', artifactId: 'artifact-1', version: 'v0.9.0', authorAgentId: 'dev-2', changeSummary: 'Rascunho inicial do escopo', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 3), status: 'draft' },
  { id: 'artv-2', artifactId: 'artifact-1', version: 'v1.0.0', authorAgentId: 'dev-2', changeSummary: 'Critérios de aceitação consolidados', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2), status: 'approved' },
  { id: 'artv-3', artifactId: 'artifact-2', version: 'v0.1.0', authorAgentId: 'dev-3', changeSummary: 'Modelo inicial de schema e endpoints', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5), status: 'generated' },
  { id: 'artv-4', artifactId: 'artifact-2', version: 'v0.2.0', authorAgentId: 'dev-7', changeSummary: 'Ajustes de índices após revisão', createdAt: new Date(NOW.getTime() - 1000 * 60 * 45), status: 'review' }
];

const MOCK_LOGS: RunLogEntity[] = [
  { id: 'log-1', runId: 'run-1', macroLayerId: 'macro-2', agentId: 'dev-1', eventType: 'GATE_REVIEW', severity: 'warning', message: 'Gate de Arquitetura em revisão', createdAt: NOW },
  { id: 'log-2', runId: 'run-1', macroLayerId: 'macro-2', agentId: 'dev-7', eventType: 'ARTIFACT_VERSIONED', severity: 'info', message: 'Versão v0.2.0 do artefato de arquitetura publicada', createdAt: new Date(NOW.getTime() - 1000 * 60 * 20) }
];

const MOCK_DECISIONS: RunDecisionEntity[] = [
  { id: 'decision-1', runId: 'run-1', macroLayerId: 'macro-1', gateId: 'gate-1', responsibleAgentId: 'dev-1', title: 'Aprovação do pacote de requisitos', decision: 'approved', reason: 'Requisitos consistentes', status: 'validated', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5) },
  { id: 'decision-2', runId: 'run-1', macroLayerId: 'macro-2', gateId: 'gate-2', responsibleAgentId: 'dev-11', title: 'Solicitação de revisão do schema', decision: 'needs_review', reason: 'Índice em user_id ausente', status: 'open', createdAt: new Date(NOW.getTime() - 1000 * 60 * 8) }
];

const MOCK_GATE_CHECKLISTS: GateChecklistEntity[] = [
  {
    id: 'chk-1',
    gateId: 'gate-2',
    title: 'Checklist Gate Arquitetura',
    completionRate: 66,
    status: 'in_progress',
    items: [
      { id: 'chki-1', label: 'Schema base publicado', status: 'completed', required: true },
      { id: 'chki-2', label: 'Índices críticos validados', status: 'blocked', required: true, observation: 'Falta índice em user_id' },
      { id: 'chki-3', label: 'Contrato de endpoint revisado', status: 'completed', required: true }
    ]
  }
];

const MOCK_FINAL_AUDIT: FinalAuditEntity = {
  id: 'audit-1',
  runId: 'run-1',
  status: 'draft',
  risksFound: 1,
  gatesApproved: 1,
  gatesPending: 1,
  officialArtifacts: 1,
  finalNotes: 'Auditoria final em construção; necessário fechar gate de arquitetura.',
  finalDecision: 'revisao_necessaria'
};

const MOCK_RISKS: RunRiskEntity[] = [
  { id: 'risk-1', runId: 'run-1', macroLayerId: 'macro-2', title: 'Índices insuficientes no schema', level: 'medium', mitigation: 'Revisão de QA antes de build final', createdAt: NOW }
];

const MOCK_DOMAIN_SNAPSHOT: SalaDevDomainSnapshot = {
  run: MOCK_RUN_DOMAIN,
  macroLayers: MOCK_MACRO_LAYERS,
  handoffs: MOCK_HANDOFFS,
  gates: MOCK_GATES,
  artifacts: MOCK_ARTIFACTS,
  runAgents: MOCK_RUN_AGENTS,
  availableAgents: MOCK_AVAILABLE_AGENTS,
  recommendedAgents: MOCK_RECOMMENDED_AGENTS,
  artifactVersions: MOCK_ARTIFACT_VERSIONS,
  gateChecklists: MOCK_GATE_CHECKLISTS,
  finalAudit: MOCK_FINAL_AUDIT,
  logs: MOCK_LOGS,
  decisions: MOCK_DECISIONS,
  risks: MOCK_RISKS,
  technicalBridge: salaDevTechnicalBridgeService.createPlannedContract('run-1', 'vscode'),
  executionBridge: {
    source: 'vscode',
    mode: 'future_only',
    notes: 'Preparação arquitetural sem integração real nesta etapa.'
  }
};

export function getSalaDevMockRun(): DevRun { return MOCK_RUN; }
export function getSalaDevMockAgents(): DevAgent[] { return MOCK_DEV_AGENTS; }
export function getSalaDevMockFlowEvents(): AgentFlowEvent[] { return MOCK_FLOW_EVENTS; }
export function getSalaDevMockFileTree(): DevFileNode[] { return MOCK_FILE_TREE; }
export function getSalaDevMockDomainSnapshot(): SalaDevDomainSnapshot { return MOCK_DOMAIN_SNAPSHOT; }
