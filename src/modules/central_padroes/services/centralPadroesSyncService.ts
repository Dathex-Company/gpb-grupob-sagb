import { CentralRepositorySnapshot } from '../types';
import { centralPadroesBaseModulesService } from './centralPadroesBaseModulesService';
import { centralPadroesCrudService } from './centralPadroesCrudService';

export const centralPadroesSyncService = {
  async buildOnlineSnapshot(): Promise<CentralRepositorySnapshot> {
    const [areas, standards, documents, decisions, checklists, modules, agents] = await Promise.all([
      centralPadroesCrudService.listAreas().catch(() => []),
      centralPadroesCrudService.listStandards(),
      centralPadroesCrudService.listDocuments(),
      centralPadroesCrudService.listDecisions(),
      centralPadroesCrudService.listChecklists(),
      centralPadroesCrudService.listModules(),
      centralPadroesCrudService.listAgentRuns().catch(() => [])
    ]);
    const baseModules = await centralPadroesBaseModulesService.buildBaseModules(modules);

    return {
      areas,
      agents,
      standards,
      documents,
      decisions,
      checklists,
      modules,
      baseModules,
      isOnline: true
    };
  }
};
