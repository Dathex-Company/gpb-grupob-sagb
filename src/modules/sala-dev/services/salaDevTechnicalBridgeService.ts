import { TechnicalBridgeCapability, TechnicalBridgeContract, TechnicalBridgeStatus } from '../types/salaDev.technicalBridge';

const ALLOWED_CAPABILITIES: TechnicalBridgeCapability[] = [
  'view_package',
  'export_package',
  'copy_instructions',
  'import_result_manual'
];

const DENIED_CAPABILITIES: TechnicalBridgeCapability[] = [
  'execute_command',
  'open_ide',
  'write_files_directly',
  'sync_repository',
  'access_secrets',
  'read_private_memory',
  'modify_agent_dna',
  'deploy_automatically'
];

export const salaDevTechnicalBridgeService = {
  createPlannedContract(runId: string, targetEnvironment: 'vscode' | 'roo_code' = 'vscode'): TechnicalBridgeContract {
    return {
      bridgeId: `bridge-${runId}`,
      runId,
      targetEnvironment,
      status: 'planned',
      allowedCapabilities: ALLOWED_CAPABILITIES,
      deniedCapabilities: DENIED_CAPABILITIES,
      humanApprovalRequired: true,
      approvalStatus: 'not_requested',
      auditLogRefs: [],
      safetyNotes: [
        'Deny-by-default ativo para toda capability não explicitamente permitida.',
        'Execução remota desabilitada nesta fase.',
        'Aprovação humana obrigatória para qualquer capability sensível.'
      ]
    };
  },

  isCapabilityAllowed(contract: TechnicalBridgeContract, capability: TechnicalBridgeCapability): boolean {
    return contract.allowedCapabilities.includes(capability) && !contract.deniedCapabilities.includes(capability);
  },

  resolveStatusLabel(status: TechnicalBridgeStatus): string {
    const map: Record<TechnicalBridgeStatus, string> = {
      not_configured: 'Não configurada',
      planned: 'Planejada',
      pending_approval: 'Pendente de aprovação',
      approved: 'Aprovada',
      rejected: 'Rejeitada',
      expired: 'Expirada',
      disabled: 'Desabilitada'
    };
    return map[status];
  },

  requestCapability(contract: TechnicalBridgeContract, capability: TechnicalBridgeCapability, requestedBy: string): TechnicalBridgeContract {
    return {
      ...contract,
      requestedCapability: capability,
      status: 'pending_approval',
      approvalStatus: 'pending',
      requestedBy,
      requestedAt: new Date().toISOString()
    };
  }
};

