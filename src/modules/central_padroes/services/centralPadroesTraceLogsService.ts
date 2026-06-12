import { centralPadroesGovernanceService, TraceLogInput } from './centralPadroesGovernanceService';

export const centralPadroesTraceLogsService = {
  list: (filter?: { query?: string; status?: string; riskMax?: string }) => centralPadroesGovernanceService.listTraceLogs(filter),
  create: (input: TraceLogInput) => centralPadroesGovernanceService.createTraceLog(input)
};
