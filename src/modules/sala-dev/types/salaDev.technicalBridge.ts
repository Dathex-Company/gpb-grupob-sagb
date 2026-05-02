export type TechnicalBridgeStatus =
  | 'not_configured'
  | 'planned'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'disabled';

export type TechnicalBridgeCapability =
  | 'view_package'
  | 'export_package'
  | 'copy_instructions'
  | 'import_result_manual'
  | 'execute_command'
  | 'open_ide'
  | 'write_files_directly'
  | 'sync_repository'
  | 'access_secrets'
  | 'read_private_memory'
  | 'modify_agent_dna'
  | 'deploy_automatically';

export interface TechnicalBridgeContract {
  bridgeId: string;
  runId: string;
  targetEnvironment: 'vscode' | 'roo_code';
  status: TechnicalBridgeStatus;
  requestedCapability?: TechnicalBridgeCapability;
  allowedCapabilities: TechnicalBridgeCapability[];
  deniedCapabilities: TechnicalBridgeCapability[];
  humanApprovalRequired: true;
  approvalStatus: 'not_requested' | 'pending' | 'approved' | 'rejected';
  requestedBy?: string;
  approvedBy?: string;
  requestedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  auditLogRefs: string[];
  safetyNotes: string[];
}

