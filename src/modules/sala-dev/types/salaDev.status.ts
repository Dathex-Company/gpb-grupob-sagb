export type RunExecutionStatus =
  | 'draft'
  | 'pending'
  | 'running'
  | 'paused'
  | 'blocked'
  | 'review'
  | 'completed'
  | 'cancelled';

export type MacroLayerStatus =
  | 'pending'
  | 'running'
  | 'blocked'
  | 'review'
  | 'approved'
  | 'completed';

export type HandoffStatus =
  | 'pending'
  | 'sent'
  | 'received'
  | 'running'
  | 'blocked'
  | 'completed'
  | 'rejected';

export type GateStatus =
  | 'pending'
  | 'running'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'blocked';

export type ArtifactStatus =
  | 'draft'
  | 'generated'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'official';

export type RunAgentStatus =
  | 'available'
  | 'recommended'
  | 'summoned'
  | 'active'
  | 'waiting'
  | 'completed'
  | 'blocked';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DomainDecision = 'approved' | 'rejected' | 'needs_review' | 'deferred';

