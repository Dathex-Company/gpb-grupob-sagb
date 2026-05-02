import {
  AgentCatalogEntity,
  ArtifactEntity,
  ArtifactVersionEntity,
  DevRunEntity,
  FinalAuditEntity,
  FutureExecutionBridge,
  GateChecklistEntity,
  GateEntity,
  HandoffEntity,
  MacroLayerEntity,
  RecommendedAgentEntity,
  RunAgentEntity,
  RunDecisionEntity,
  RunLogEntity,
  RunRiskEntity
} from './salaDev.domain';
import { TechnicalBridgeContract } from './salaDev.technicalBridge';

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

export interface SalaDevDomainSnapshot {
  run: DevRunEntity;
  macroLayers: MacroLayerEntity[];
  handoffs: HandoffEntity[];
  gates: GateEntity[];
  artifacts: ArtifactEntity[];
  runAgents: RunAgentEntity[];
  availableAgents: AgentCatalogEntity[];
  recommendedAgents: RecommendedAgentEntity[];
  artifactVersions: ArtifactVersionEntity[];
  gateChecklists: GateChecklistEntity[];
  finalAudit: FinalAuditEntity;
  logs: RunLogEntity[];
  decisions: RunDecisionEntity[];
  risks: RunRiskEntity[];
  executionBridge: FutureExecutionBridge;
  technicalBridge: TechnicalBridgeContract;
}
