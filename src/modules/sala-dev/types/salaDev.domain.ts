import {
  ArtifactStatus,
  DomainDecision,
  GateStatus,
  HandoffStatus,
  MacroLayerStatus,
  RiskLevel,
  RunAgentStatus,
  RunExecutionStatus
} from './salaDev.status';

export type ExecutionEnvironment = 'sagb_ui' | 'vscode_future' | 'roo_code_future';
export type AgentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface DevRunEntity {
  id: string;
  projectId: string;
  title: string;
  status: RunExecutionStatus;
  currentMacroLayerId: string;
  currentGateId?: string;
  activeAgentId?: string;
  riskLevel: RiskLevel;
  progress: number;
  startedAt?: Date;
  updatedAt: Date;
  completedAt?: Date;
  executionEnvironment: ExecutionEnvironment;
}

export interface MacroLayerEntity {
  id: string;
  name: string;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  description?: string;
  status: MacroLayerStatus;
  progress: number;
  agentsCount: number;
  handoffsCount: number;
  gatesCount: number;
  artifactsCount: number;
  riskLevel: RiskLevel;
  nextRecommendedAction?: string;
}

export interface HandoffEntity {
  id: string;
  runId: string;
  sourceAgentId?: string;
  targetAgentId?: string;
  macroLayerId: string;
  reason: string;
  inputSummary: string;
  expectedOutput: string;
  relatedArtifactId?: string;
  status: HandoffStatus;
  gateId?: string;
  riskLevel: RiskLevel;
  createdAt: Date;
  completedAt?: Date;
}

export interface GateEntity {
  id: string;
  runId: string;
  macroLayerId: string;
  name: string;
  status: GateStatus;
  checklist: string[];
  responsibleAgentId?: string;
  riskLevel: RiskLevel;
  decision?: DomainDecision;
  observations?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
}

export interface ArtifactEntity {
  id: string;
  runId: string;
  macroLayerId: string;
  agentId?: string;
  handoffId?: string;
  gateId?: string;
  title: string;
  type: string;
  status: ArtifactStatus;
  version: string;
  contentPreview?: string;
  filePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtifactVersionEntity {
  id: string;
  artifactId: string;
  version: string;
  authorAgentId?: string;
  changeSummary: string;
  createdAt: Date;
  status: ArtifactStatus;
}

export interface RunAgentEntity {
  agentId: string;
  name: string;
  role: string;
  layer: string;
  macroLayerId?: string;
  status: RunAgentStatus;
  activationReason?: string;
  recommendationReason?: string;
  complexityLevel?: 'low' | 'medium' | 'high';
  technicalNeed?: string;
  skills: string[];
  dnaVersionId?: string;
  isOfficialAgentReference: boolean;
}

export interface AgentCatalogEntity {
  agentId: string;
  name: string;
  role: string;
  specialty: string;
  suggestedMacroLayerId?: string;
  availability: 'available' | 'limited' | 'unavailable';
  technicalNeeds: string[];
  skills: string[];
  complexityFit: 'low' | 'medium' | 'high';
  isOfficialAgentReference: boolean;
  dnaVersionId?: string;
}

export interface RecommendedAgentEntity {
  recommendationId: string;
  agentId: string;
  macroLayerId: string;
  priority: AgentPriority;
  associatedRiskLevel: RiskLevel;
  reasons: string[];
  technicalNeed: string;
  complexity: 'low' | 'medium' | 'high';
  basedOn: Array<'current_stage' | 'risk' | 'complexity' | 'supabase_future' | 'security' | 'external_integration' | 'deploy' | 'mobile' | 'ai' | 'audit'>;
}

export interface RunLogEntity {
  id: string;
  runId: string;
  macroLayerId?: string;
  agentId?: string;
  eventType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  createdAt: Date;
}

export interface RunDecisionEntity {
  id: string;
  runId: string;
  macroLayerId?: string;
  gateId?: string;
  responsibleAgentId?: string;
  title: string;
  decision: DomainDecision;
  reason: string;
  status: 'open' | 'validated' | 'superseded';
  createdAt: Date;
}

export interface ChecklistItemEntity {
  id: string;
  label: string;
  status: 'pending' | 'completed' | 'blocked';
  required: boolean;
  observation?: string;
}

export interface GateChecklistEntity {
  id: string;
  gateId: string;
  title: string;
  items: ChecklistItemEntity[];
  completionRate: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

export interface FinalAuditEntity {
  id: string;
  runId: string;
  status: 'draft' | 'in_review' | 'completed';
  risksFound: number;
  gatesApproved: number;
  gatesPending: number;
  officialArtifacts: number;
  finalNotes: string;
  finalDecision: 'aprovado' | 'aprovado_com_ressalvas' | 'revisao_necessaria' | 'bloqueado';
}

export interface RunRiskEntity {
  id: string;
  runId: string;
  macroLayerId?: string;
  title: string;
  level: RiskLevel;
  mitigation?: string;
  createdAt: Date;
}

export interface FutureExecutionBridge {
  source: 'vscode' | 'roo_code';
  mode: 'future_only';
  notes: string;
}
