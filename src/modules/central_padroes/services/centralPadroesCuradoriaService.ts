import { centralPadroesGovernanceService, GovernanceRecordInput } from './centralPadroesGovernanceService';

export const centralPadroesCuradoriaService = {
  list: (filter?: { query?: string; status?: string; riskLevel?: string; type?: string }) => centralPadroesGovernanceService.listRecords('central_padroes_curadoria', filter),
  create: (input: GovernanceRecordInput) => centralPadroesGovernanceService.createRecord('central_padroes_curadoria', { ...input, type: input.type || 'curadoria' }),
  update: (id: string, input: GovernanceRecordInput) => centralPadroesGovernanceService.updateRecord('central_padroes_curadoria', id, { ...input, type: input.type || 'curadoria' })
};
