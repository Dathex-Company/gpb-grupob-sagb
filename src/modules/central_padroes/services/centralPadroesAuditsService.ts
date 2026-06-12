import { centralPadroesGovernanceService, GovernanceRecordInput } from './centralPadroesGovernanceService';

export const centralPadroesAuditsService = {
  list: (filter?: { query?: string; status?: string; riskLevel?: string; type?: string }) => centralPadroesGovernanceService.listRecords('central_padroes_audits', filter),
  create: (input: GovernanceRecordInput) => centralPadroesGovernanceService.createRecord('central_padroes_audits', { ...input, type: input.type || 'auditoria' }),
  update: (id: string, input: GovernanceRecordInput) => centralPadroesGovernanceService.updateRecord('central_padroes_audits', id, { ...input, type: input.type || 'auditoria' })
};
