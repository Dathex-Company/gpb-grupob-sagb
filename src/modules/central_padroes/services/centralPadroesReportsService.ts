import { centralPadroesGovernanceService, GovernanceRecordInput } from './centralPadroesGovernanceService';

export const centralPadroesReportsService = {
  list: (filter?: { query?: string; status?: string; riskLevel?: string; type?: string }) => centralPadroesGovernanceService.listRecords('central_padroes_reports', filter),
  create: (input: GovernanceRecordInput) => centralPadroesGovernanceService.createRecord('central_padroes_reports', { ...input, type: input.type || 'relatorio' }),
  update: (id: string, input: GovernanceRecordInput) => centralPadroesGovernanceService.updateRecord('central_padroes_reports', id, { ...input, type: input.type || 'relatorio' })
};
