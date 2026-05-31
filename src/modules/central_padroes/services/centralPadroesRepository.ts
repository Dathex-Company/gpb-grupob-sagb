import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralDashboardMetrics, CentralRepositorySnapshot } from '../types';
import { listGovernanceRules } from './governanceRulesService';

const cloneFallback = (): CentralRepositorySnapshot => JSON.parse(JSON.stringify(centralPadroesFallbackData));

export const centralPadroesRepository = {
  async getSnapshot(): Promise<CentralRepositorySnapshot> {
    const snapshot = cloneFallback();
    try {
      const rules = await listGovernanceRules();
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
      return { ...snapshot, standards: [...legacyStandards, ...snapshot.standards] };
    } catch {
      return snapshot;
    }
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

