export type SalaDevStudioSessionStatus = 'draft' | 'planning' | 'waiting_approval' | 'approved' | 'simulated' | 'completed';

export type SalaDevStudioStepStatus = 'pending' | 'running' | 'approved' | 'rejected' | 'completed';

export interface SalaDevStudioPlanStep {
  id: string;
  title: string;
  description: string;
  ownerAgent: string;
  status: SalaDevStudioStepStatus;
}

export interface SalaDevStudioImpactedFile {
  id: string;
  path: string;
  action: 'create' | 'update' | 'delete' | 'review';
  reason: string;
  risk: 'low' | 'medium' | 'high';
}

export interface SalaDevStudioDiffBlock {
  id: string;
  filePath: string;
  title: string;
  before: string;
  after: string;
  status: 'proposed' | 'approved' | 'rejected' | 'applied_simulated';
}

export interface SalaDevStudioApproval {
  id: string;
  label: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  decidedAt?: string;
}

export interface SalaDevStudioEvent {
  id: string;
  type: 'session' | 'plan' | 'approval' | 'diff' | 'command' | 'preview' | 'audit';
  message: string;
  createdAt: string;
}

export interface SalaDevStudioCommandLog {
  id: string;
  command: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  output: string;
  createdAt: string;
}

export interface SalaDevStudioSession {
  id: string;
  runId: string;
  projectName: string;
  objective: string;
  status: SalaDevStudioSessionStatus;
  createdAt: string;
  updatedAt: string;
  planSteps: SalaDevStudioPlanStep[];
  impactedFiles: SalaDevStudioImpactedFile[];
  diffs: SalaDevStudioDiffBlock[];
  approvals: SalaDevStudioApproval[];
  events: SalaDevStudioEvent[];
  commandLogs: SalaDevStudioCommandLog[];
  previewUrl?: string;
}

