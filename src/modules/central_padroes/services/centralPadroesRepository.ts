import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralDashboardMetrics, CentralRepositorySnapshot, CreateStandardInput, UpdateStandardInput } from '../types';
import { centralPadroesCrudService } from './centralPadroesCrudService';
import { centralPadroesSyncService } from './centralPadroesSyncService';
import { listGovernanceRules } from './governanceRulesService';

const cloneFallback = (): CentralRepositorySnapshot => JSON.parse(JSON.stringify(centralPadroesFallbackData));

export const centralPadroesRepository = {
  async getSnapshot(): Promise<CentralRepositorySnapshot> {
    const fallback = cloneFallback();
    const onlineSnapshot = await centralPadroesSyncService.buildOnlineSnapshot().catch(() => ({
      areas: [],
      standards: [],
      documents: [],
      checklists: [],
      decisions: [],
      modules: [],
      baseModules: [],
      agents: [],
      isOnline: false
    }));
    const rules = await listGovernanceRules().catch(() => []);
    const legacyStandards = rules.map((rule) => ({
      id: rule.id,
      key: rule.rule_key,
      title: rule.title,
      type: 'regra' as const,
      status: rule.sync_status === 'synced' ? 'publicado' as const : 'rascunho' as const,
      areaId: rule.domain || 'pietro',
      owner: rule.updated_by || 'Zico Padron',
      summary: `Regra materializada em ${rule.sync_target_path}`,
      risk: 'medio' as const,
      version: rule.version,
      agentAvailable: false,
      dependencies: [],
      relatedModules: ['central_padroes'],
      updatedAt: rule.updated_at
    }));
    const hasOnlineData = onlineSnapshot.standards.length > 0
      || onlineSnapshot.documents.length > 0
      || onlineSnapshot.checklists.length > 0
      || onlineSnapshot.decisions.length > 0
      || onlineSnapshot.modules.length > 0
      || onlineSnapshot.areas.length > 0
      || onlineSnapshot.agents.length > 0;

    if (!hasOnlineData) {
      return { ...fallback, isOnline: false };
    }

    return {
      ...onlineSnapshot,
      areas: onlineSnapshot.areas.length ? onlineSnapshot.areas : fallback.areas,
      agents: onlineSnapshot.agents.length ? onlineSnapshot.agents : fallback.agents,
      standards: [...legacyStandards, ...onlineSnapshot.standards],
      documents: onlineSnapshot.documents,
      checklists: onlineSnapshot.checklists,
      decisions: onlineSnapshot.decisions,
      modules: onlineSnapshot.modules,
      baseModules: onlineSnapshot.baseModules.length ? onlineSnapshot.baseModules : fallback.baseModules,
      isOnline: Boolean(onlineSnapshot.isOnline)
    };
  },

  createStandard(input: CreateStandardInput) {
    return centralPadroesCrudService.createStandard(input);
  },

  updateStandard(id: string, input: UpdateStandardInput) {
    return centralPadroesCrudService.updateStandard(id, input);
  },

  deleteStandard(id: string) {
    return centralPadroesCrudService.deleteStandard(id);
  },

  getMetrics(snapshot: CentralRepositorySnapshot): CentralDashboardMetrics {
    return {
      standards: snapshot.standards.length,
      documents: snapshot.documents.length,
      checklists: snapshot.checklists.length,
      decisions: snapshot.decisions.length,
      modulesLinked: snapshot.modules.filter((module) => module.status !== 'sem_vinculo').length,
      risks: snapshot.standards.filter((standard) => standard.risk === 'alto' || standard.risk === 'critico').length
    };
  }
};
