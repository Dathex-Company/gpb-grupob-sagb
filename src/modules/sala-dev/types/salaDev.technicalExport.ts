import {
  ArtifactEntity,
  ArtifactVersionEntity,
  FinalAuditEntity,
  GateChecklistEntity,
  GateEntity,
  HandoffEntity,
  MacroLayerEntity,
  RunAgentEntity,
  RunDecisionEntity,
  RunLogEntity
} from './salaDev.domain';

export interface TechnicalExecutionPackage {
  packageId: string;
  runId: string;
  generatedAt: string;
  generatedBy: string;
  packageVersion: string;
  projectTitle: string;
  runStatus: string;
  macroLayers: MacroLayerEntity[];
  runAgents: RunAgentEntity[];
  handoffs: HandoffEntity[];
  gates: GateEntity[];
  artifacts: ArtifactEntity[];
  artifactVersions: ArtifactVersionEntity[];
  logs: RunLogEntity[];
  decisions: RunDecisionEntity[];
  checklists: GateChecklistEntity[];
  finalAudit: FinalAuditEntity;
  executionEnvironment: {
    runExecutionEnvironment: string;
    bridgeSource: string;
    bridgeMode: string;
    bridgeNotes: string;
  };
  humanInstructions: string[];
  safetyGuardrails: string[];
  excludedSensitiveData: string[];
  packageChecksum: string;
}

