import {
  AgentCatalogEntity,
  ArtifactEntity,
  ArtifactVersionEntity,
  BlockEntity,
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
import { AGENT_18_MAP, BLOCK_CONFIG, getAgent18List } from '../types/salaDev.agentConstants';

const MOCK_DEV_AGENTS: DevAgent[] = getAgent18List().map((agent) => ({
  id: agent.id,
  name: agent.name,
  role: agent.role,
  avatarColor: agent.avatarColor,
  status: agent.id === 'ca-02' ? 'WORKING' : 'IDLE'
}));

const MOCK_RUN: DevRun = {
  id: 'run-1',
  projectId: 'proj-1',
  projectName: 'Novo Módulo de Relatórios',
  briefingSummary: 'Criar uma interface para extração de relatórios CSV do painel de administração, com filtros por data e usuário.',
  status: 'EXECUTING',
  currentStage: 'Bloco 2 — Arquitetura e Documentação',
  activeAgentId: 'ca-02',
  progressPercent: 35,
  nextSteps: [
    'Concluir gate do Bloco 2 — Arquitetura e Documentação',
    'Convocar CA-06, CA-05, CA-07, CA-14 e CA-04 para Construção Técnica',
    'Preparar trilha de revisão com CA-15, CA-08, CA-10 e CA-11'
  ]
};

const MOCK_FLOW_EVENTS: AgentFlowEvent[] = [
  {
    id: 'evt-1', agentId: 'ca-01', actionType: 'PLAN', summary: 'Orquestração inicial da run', motive: 'Início da run solicitado pelo usuário.',
    input: 'Briefing: Criar módulo de exportação CSV.', output: 'Fluxo geral da run estruturado com 5 blocos.', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), nextAgentId: 'ca-18'
  },
  {
    id: 'evt-2', agentId: 'ca-18', actionType: 'REVIEW', summary: 'Parecer de reaproveitamento técnico', motive: 'Evitar duplicidade antes da arquitetura.',
    input: 'Briefing e contexto do SagB.', output: 'Parecer: adaptar estrutura existente de módulo plugável.', generatedArtifactId: 'artifact-1', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), sourceAgentId: 'ca-01', nextAgentId: 'ca-13'
  },
  {
    id: 'evt-3', agentId: 'ca-13', actionType: 'PLAN', summary: 'Catálogo técnico inicial', motive: 'Mapear ativos reutilizáveis antes de construir.',
    input: 'Parecer de reaproveitamento.', output: 'Catálogo de módulos, services e padrões relacionados.', status: 'COMPLETED',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), sourceAgentId: 'ca-18', nextAgentId: 'ca-02'
  },
  {
    id: 'evt-4', agentId: 'ca-02', actionType: 'PLAN', summary: 'Arquitetura do sistema', motive: 'Entrada no Bloco 2.',
    input: 'Fluxo, parecer e catálogo.', output: 'Arquitetura técnica da solução e fronteiras de módulo.', status: 'RUNNING',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), sourceAgentId: 'ca-13', nextAgentId: 'ca-16'
  },
  {
    id: 'evt-5', agentId: 'ca-16', actionType: 'PLAN', summary: 'UX/UI técnico convocado', motive: 'Projetar jornada e estados visuais.',
    input: 'Arquitetura preliminar.', output: 'Mapa de telas em preparação.', generatedArtifactId: 'artifact-2', status: 'PENDING',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), sourceAgentId: 'ca-02', nextAgentId: 'ca-03'
  },
  {
    id: 'evt-6', agentId: 'ca-03', actionType: 'MESSAGE', summary: 'Documentação técnica inicial', motive: 'Registrar decisões para continuidade.',
    input: 'Arquitetura e mapa de telas.', output: 'README, ADRs e guia de continuidade pendentes.', status: 'PENDING',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), sourceAgentId: 'ca-16'
  },
  {
    id: 'evt-7', agentId: 'ca-06', actionType: 'CODE', summary: 'Próximo agente recomendado: banco', motive: 'Bloco 3 será iniciado após gate de arquitetura.',
    input: 'Arquitetura aprovada.', output: 'Migrations e RLS iniciais.', status: 'PENDING',
    timestamp: new Date(), sourceAgentId: 'ca-02'
  }
];

const MOCK_FILE_TREE: DevFileNode[] = [{
  id: 'root', name: 'src', type: 'folder', children: [
    { id: 'components', name: 'components', type: 'folder', children: [{ id: 'file-1', name: 'ReportGenerator.tsx', type: 'file', language: 'typescript', status: 'NEW', lastAuthorId: 'ca-04', content: 'export const ReportGenerator = () => {\n  return <div>Gerador de Relatórios</div>;\n};' }] },
    { id: 'api', name: 'api', type: 'folder', children: [{ id: 'file-2', name: 'reports.ts', type: 'file', language: 'typescript', status: 'UNMODIFIED', content: 'export const getReports = async () => [];' }] }
  ]
}];

const NOW = new Date();

const MOCK_RUN_DOMAIN: DevRunEntity = {
  id: 'run-1',
  projectId: 'proj-1',
  title: 'Novo Módulo de Relatórios',
  status: 'running',
  currentMacroLayerId: 'block-2',
  currentGateId: 'gate-2',
  activeAgentId: 'ca-02',
  riskLevel: 'medium',
  progress: 35,
  startedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 3),
  updatedAt: NOW,
  executionEnvironment: 'sagb_ui'
};

const MOCK_BLOCKS: BlockEntity[] = Object.values(BLOCK_CONFIG).map((block) => ({
  id: block.id,
  runId: 'run-1',
  block: block.order,
  name: block.name,
  description: block.description,
  status: block.order === 1 ? 'completed' : block.order === 2 ? 'running' : 'pending',
  progress: block.order === 1 ? 100 : block.order === 2 ? 65 : 0,
  agentsCount: block.agents.length,
  handoffsCount: block.order === 1 ? 2 : block.order === 2 ? 2 : 0,
  gatesCount: 1,
  artifactsCount: block.order === 1 ? 1 : block.order === 2 ? 2 : 0,
  riskLevel: block.order >= 4 ? 'high' : block.order === 2 || block.order === 3 ? 'medium' : 'low',
  currentAgentId: block.order === 2 ? 'ca-02' : undefined,
  nextRecommendedAction: block.order === 1
    ? 'Entrada validada; avançar para arquitetura'
    : block.order === 2
      ? 'Concluir arquitetura, UX e documentação inicial'
      : block.order === 3
        ? 'Aguardar gate de arquitetura para construir'
        : block.order === 4
          ? 'Preparar revisão, segurança, QA e observabilidade'
          : 'Preparar versionamento, deploy e runbook',
  gateStatus: block.order === 1 ? 'approved' : block.order === 2 ? 'review' : 'pending'
}));

const MOCK_MACRO_LAYERS: MacroLayerEntity[] = [
  { id: 'macro-1', name: 'Escopo e Requisitos', order: 1, description: 'Consolidar escopo, requisitos e critérios mínimos de aceitação.', status: 'completed', progress: 100, agentsCount: 2, handoffsCount: 1, gatesCount: 1, artifactsCount: 1, riskLevel: 'low', nextRecommendedAction: 'Encaminhar pacote validado para Arquitetura' },
  { id: 'macro-2', name: 'Arquitetura', order: 2, description: 'Definir modelagem técnica, contratos e estrutura de implementação.', status: 'running', progress: 55, agentsCount: 3, handoffsCount: 2, gatesCount: 1, artifactsCount: 2, riskLevel: 'medium', nextRecommendedAction: 'Concluir revisão de schema e aprovar gate de arquitetura' },
  { id: 'macro-3', name: 'Construção', order: 3, description: 'Executar desenvolvimento dos blocos funcionais do MVP.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'medium', nextRecommendedAction: 'Aguardar aprovação da arquitetura' },
  { id: 'macro-4', name: 'Revisão e Segurança', order: 4, description: 'Executar validações de qualidade, segurança e conformidade.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'medium', nextRecommendedAction: 'Planejar checklist de revisão e segurança' },
  { id: 'macro-5', name: 'Deploy e Observabilidade', order: 5, description: 'Preparar publicação e monitoramento do MVP em produção.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'high', nextRecommendedAction: 'Definir plano de deploy e observabilidade' },
  { id: 'macro-6', name: 'Auditoria Final', order: 6, description: 'Consolidar rastreabilidade, parecer final e fechamento da run.', status: 'pending', progress: 0, agentsCount: 0, handoffsCount: 0, gatesCount: 0, artifactsCount: 0, riskLevel: 'medium', nextRecommendedAction: 'Estruturar checkpoints de auditoria final' }
];

const MOCK_RUN_AGENTS: RunAgentEntity[] = [
  ...getAgent18List().map((agent): RunAgentEntity => ({
    agentId: agent.id,
    name: agent.name,
    role: agent.role,
    layer: BLOCK_CONFIG[agent.block].shortName,
    macroLayerId: BLOCK_CONFIG[agent.block].id,
    status: agent.block === 1 ? 'completed' : agent.id === 'ca-02' ? 'active' : agent.block === 2 ? 'summoned' : 'available',
    activationReason: agent.block === 1
      ? 'Bloco de entrada executado na simulação v3.0.0'
      : agent.id === 'ca-02'
        ? 'Agente ativo do bloco de arquitetura'
        : `Preparado para atuação no ${BLOCK_CONFIG[agent.block].shortName}`,
    technicalNeed: agent.specialty,
    complexityLevel: agent.block >= 3 ? 'high' : 'medium',
    skills: agent.skills,
    dnaVersionId: `dna-${agent.id}-v3`,
    isOfficialAgentReference: true
  }))
];

const MOCK_AVAILABLE_AGENTS: AgentCatalogEntity[] = getAgent18List().map((agent) => ({
  agentId: agent.id,
  name: agent.name,
  role: agent.role,
  specialty: agent.specialty,
  suggestedMacroLayerId: BLOCK_CONFIG[agent.block].id,
  availability: agent.id === 'ca-08' ? 'limited' : 'available',
  technicalNeeds: [agent.specialty],
  skills: agent.skills,
  complexityFit: agent.block >= 3 ? 'high' : 'medium',
  isOfficialAgentReference: true,
  dnaVersionId: `dna-${agent.id}-v3`
}));

const MOCK_RECOMMENDED_AGENTS: RecommendedAgentEntity[] = [
  {
    recommendationId: 'rec-1',
    agentId: 'ca-16',
    macroLayerId: 'block-2',
    priority: 'high',
    associatedRiskLevel: 'medium',
    reasons: ['Bloco de arquitetura em execução', 'Jornada visual precisa ser especificada'],
    technicalNeed: 'Definir fluxos, telas e estados antes da construção',
    complexity: 'medium',
    basedOn: ['current_stage', 'risk', 'complexity', 'audit']
  },
  {
    recommendationId: 'rec-2',
    agentId: 'ca-15',
    macroLayerId: 'block-4',
    priority: 'critical',
    associatedRiskLevel: 'high',
    reasons: ['Bloco de qualidade deve revisar código antes de segurança e QA'],
    technicalNeed: 'Code review e redução de dívida técnica',
    complexity: 'high',
    basedOn: ['security', 'external_integration', 'deploy']
  }
];

const MOCK_HANDOFFS: HandoffEntity[] = [
  {
    id: 'handoff-1',
    runId: 'run-1',
    sourceAgentId: 'ca-13',
    targetAgentId: 'ca-02',
    macroLayerId: 'block-2',
    reason: 'Passagem do catálogo técnico para arquitetura',
    inputSummary: 'Parecer de reaproveitamento e catálogo de ativos',
    expectedOutput: 'Arquitetura, contratos e decisões estruturais',
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
    macroLayerId: 'block-1',
    name: 'Gate de Entrada e Organização',
    status: 'approved',
    checklist: ['Escopo validado', 'Critérios definidos'],
    responsibleAgentId: 'ca-01',
    riskLevel: 'low',
    decision: 'approved',
    observations: 'Pronto para arquitetura',
    approvedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5)
  },
  {
    id: 'gate-2',
    runId: 'run-1',
    macroLayerId: 'block-2',
    name: 'Gate de Arquitetura e Documentação',
    status: 'review',
    checklist: ['Schema preliminar', 'Endpoints mapeados'],
    responsibleAgentId: 'ca-02',
    riskLevel: 'medium'
  }
];

const MOCK_ARTIFACTS: ArtifactEntity[] = [
  {
    id: 'artifact-1',
    runId: 'run-1',
    macroLayerId: 'block-1',
    agentId: 'ca-18',
    title: 'Parecer de Reaproveitamento',
    type: 'reaproveitamento',
    status: 'approved',
    version: 'v1.0.0',
    gateId: 'gate-1',
    contentPreview: 'Parecer técnico para usar, adaptar ou criar novo recurso no SagB.',
    filePath: '.docs/parecer-reaproveitamento.md',
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2.5),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2)
  },
  {
    id: 'artifact-2',
    runId: 'run-1',
    macroLayerId: 'block-2',
    agentId: 'ca-02',
    title: 'Arquitetura Inicial v3',
    type: 'architecture',
    status: 'review',
    version: 'v0.2.0',
    handoffId: 'handoff-1',
    gateId: 'gate-2',
    contentPreview: 'Fronteiras, contratos e estrutura técnica para a esteira de 18 agentes.',
    filePath: '.docs/03-arquitetura-sistema.md',
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5),
    updatedAt: new Date(NOW.getTime() - 1000 * 60 * 45)
  }
];

const MOCK_ARTIFACT_VERSIONS: ArtifactVersionEntity[] = [
  { id: 'artv-1', artifactId: 'artifact-1', version: 'v0.9.0', authorAgentId: 'ca-18', changeSummary: 'Rascunho do parecer de reaproveitamento', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 3), status: 'draft' },
  { id: 'artv-2', artifactId: 'artifact-1', version: 'v1.0.0', authorAgentId: 'ca-13', changeSummary: 'Catálogo técnico vinculado ao parecer', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 2), status: 'approved' },
  { id: 'artv-3', artifactId: 'artifact-2', version: 'v0.1.0', authorAgentId: 'ca-02', changeSummary: 'Arquitetura inicial dos 5 blocos', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5), status: 'generated' },
  { id: 'artv-4', artifactId: 'artifact-2', version: 'v0.2.0', authorAgentId: 'ca-16', changeSummary: 'Jornada visual incorporada à arquitetura', createdAt: new Date(NOW.getTime() - 1000 * 60 * 45), status: 'review' }
];

const MOCK_LOGS: RunLogEntity[] = [
  { id: 'log-1', runId: 'run-1', macroLayerId: 'block-2', agentId: 'ca-02', eventType: 'GATE_REVIEW', severity: 'warning', message: 'Gate de Arquitetura e Documentação em revisão', createdAt: NOW },
  { id: 'log-2', runId: 'run-1', macroLayerId: 'block-2', agentId: 'ca-16', eventType: 'ARTIFACT_VERSIONED', severity: 'info', message: 'Versão v0.2.0 do artefato de arquitetura publicada com UX/UI técnico', createdAt: new Date(NOW.getTime() - 1000 * 60 * 20) }
];

const MOCK_DECISIONS: RunDecisionEntity[] = [
  { id: 'decision-1', runId: 'run-1', macroLayerId: 'block-1', gateId: 'gate-1', responsibleAgentId: 'ca-01', title: 'Aprovação do bloco de entrada', decision: 'approved', reason: 'Briefing, reaproveitamento e catálogo consistentes', status: 'validated', createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 1.5) },
  { id: 'decision-2', runId: 'run-1', macroLayerId: 'block-2', gateId: 'gate-2', responsibleAgentId: 'ca-02', title: 'Solicitação de revisão UX/docs antes da construção', decision: 'needs_review', reason: 'CA-16 e CA-03 ainda precisam consolidar entregáveis', status: 'open', createdAt: new Date(NOW.getTime() - 1000 * 60 * 8) }
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
  { id: 'risk-1', runId: 'run-1', macroLayerId: 'block-2', title: 'Arquitetura avançar sem UX/docs completos', level: 'medium', mitigation: 'Concluir CA-16 e CA-03 antes do Bloco 3', createdAt: NOW }
];

const MOCK_DOMAIN_SNAPSHOT: SalaDevDomainSnapshot = {
  run: MOCK_RUN_DOMAIN,
  blocks: MOCK_BLOCKS,
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
