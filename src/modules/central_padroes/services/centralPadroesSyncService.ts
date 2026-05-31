import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralRepositorySnapshot } from '../types';
import { centralPadroesCrudService } from './centralPadroesCrudService';

export const centralPadroesSyncService = {
  async buildOnlineSnapshot(): Promise<CentralRepositorySnapshot> {
    const [standards, documents, decisions, checklists, modules] = await Promise.all([
      centralPadroesCrudService.listStandards(),
      centralPadroesCrudService.listDocuments(),
      centralPadroesCrudService.listDecisions(),
      centralPadroesCrudService.listChecklists(),
      centralPadroesCrudService.listModules()
    ]);

    return {
      ...centralPadroesFallbackData,
      standards: standards.length ? standards : centralPadroesFallbackData.standards,
      documents: documents.length ? documents : centralPadroesFallbackData.documents,
      decisions: decisions.length ? decisions : centralPadroesFallbackData.decisions,
      checklists: checklists.length ? checklists : centralPadroesFallbackData.checklists,
      modules: modules.length ? modules : centralPadroesFallbackData.modules,
      isOnline: true
    };
  },

  fallbackSnapshot(): CentralRepositorySnapshot {
    return { ...JSON.parse(JSON.stringify(centralPadroesFallbackData)), isOnline: false };
  }
};

