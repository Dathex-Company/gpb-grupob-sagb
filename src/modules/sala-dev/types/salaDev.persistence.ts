import { ArtifactStatus, DomainDecision, GateStatus, HandoffStatus, MacroLayerStatus, RiskLevel, RunAgentStatus, RunExecutionStatus } from './salaDev.status';

export interface DevRunRow {
  id: string;
  project_id: string;
  title: string;
  status: RunExecutionStatus;
  current_macro_layer_id: string;
  current_gate_id?: string | null;
  active_agent_id?: string | null;
  risk_level: RiskLevel;
  progress: number;
  execution_environment: 'sagb_ui' | 'vscode_future' | 'roo_code_future';
  started_at?: string | null;
  updated_at: string;
  completed_at?: string | null;
}

export interface DevRunMacroLayerRow {
  id: string;
  run_id: string;
  name: string;
  order_index: number;
  status: MacroLayerStatus;
  progress: number;
  risk_level: RiskLevel;
}

export interface DevRunAgentRow {
  id: string;
  run_id: string;
  agent_id: string;
  official_agent_id?: string | null;
  dna_version_id?: string | null;
  role_in_run: string;
  macro_layer_id?: string | null;
  activation_reason?: string | null;
  recommendation_reason?: string | null;
  status: RunAgentStatus;
}

export interface DevHandoffRow {
  id: string;
  run_id: string;
  macro_layer_id: string;
  source_agent_id?: string | null;
  target_agent_id?: string | null;
  reason: string;
  input_summary: string;
  expected_output: string;
  related_artifact_id?: string | null;
  gate_id?: string | null;
  status: HandoffStatus;
  risk_level: RiskLevel;
  created_at?: string | null;
  completed_at?: string | null;
}

export interface DevGateRow {
  id: string;
  run_id: string;
  macro_layer_id: string;
  name: string;
  status: GateStatus;
  decision?: DomainDecision | null;
  responsible_agent_id?: string | null;
  risk_level: RiskLevel;
  observations?: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;
}

export interface DevArtifactRow {
  id: string;
  run_id: string;
  macro_layer_id: string;
  agent_id?: string | null;
  handoff_id?: string | null;
  gate_id?: string | null;
  title: string;
  type: string;
  status: ArtifactStatus;
  version: string;
  file_path?: string | null;
  content_preview?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DevArtifactVersionRow {
  id: string;
  artifact_id: string;
  version: string;
  author_agent_id?: string | null;
  change_summary: string;
  status: ArtifactStatus;
  created_at: string;
}

export interface DevLogRow {
  id: string;
  run_id: string;
  macro_layer_id?: string | null;
  agent_id?: string | null;
  event_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  created_at: string;
}

export interface DevDecisionRow {
  id: string;
  run_id: string;
  macro_layer_id?: string | null;
  gate_id?: string | null;
  responsible_agent_id?: string | null;
  title: string;
  decision: DomainDecision;
  reason: string;
  status: 'open' | 'validated' | 'superseded';
  created_at: string;
}

export interface DevGateChecklistRow {
  id: string;
  gate_id: string;
  title: string;
  completion_rate: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  items_json: string;
}

export interface DevFinalAuditRow {
  id: string;
  run_id: string;
  status: 'draft' | 'in_review' | 'completed';
  risks_found: number;
  gates_approved: number;
  gates_pending: number;
  official_artifacts: number;
  final_notes: string;
  final_decision: 'aprovado' | 'aprovado_com_ressalvas' | 'revisao_necessaria' | 'bloqueado';
}

export interface DevExecutionEnvironmentRow {
  id: string;
  run_id: string;
  environment_type: 'vscode' | 'roo_code' | 'sagb_ui';
  status: 'not_connected' | 'configured' | 'ready' | 'running' | 'paused' | 'completed' | 'failed';
  repository_ref?: string | null;
  workspace_path?: string | null;
  future_action?: string | null;
}
