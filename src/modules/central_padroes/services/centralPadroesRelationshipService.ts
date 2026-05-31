import { restFetch } from '../../../../services/supabase';
import { centralPadroesRepository } from './centralPadroesRepository';

export interface StandardRelationship {
  standardId: string;
  standardTitle: string;
  type: 'depends_on' | 'related_to' | 'replaces' | 'replaced_by' | 'conflicts_with';
  direction: 'incoming' | 'outgoing';
}

export interface ImpactAnalysis {
  standardId: string;
  directDependents: string[];
  indirectDependents: string[];
  riskScore: number;
  breakingChanges: boolean;
}

export const centralPadroesRelationshipService = {
  async getRelationships(standardId: string): Promise<StandardRelationship[]> {
    try {
      const query = new URLSearchParams({ select: '*', standard_id: `eq.${standardId}` });
      const rows = await restFetch('central_padroes_standard_dependencies', { method: 'GET', query });
      const snapshot = await centralPadroesRepository.getSnapshot();
      return (Array.isArray(rows) ? rows : []).map((row: any) => {
        const related = snapshot.standards.find((standard) => standard.id === row.depends_on_standard_id);
        return { standardId: row.depends_on_standard_id, standardTitle: related?.title || row.depends_on_standard_id, type: row.relation_type || 'depends_on', direction: 'outgoing' };
      });
    } catch {
      const snapshot = await centralPadroesRepository.getSnapshot();
      const source = snapshot.standards.find((standard) => standard.id === standardId || standard.key === standardId);
      return (source?.dependencies || []).map((dep) => ({ standardId: dep, standardTitle: dep, type: 'depends_on', direction: 'outgoing' }));
    }
  },

  async addDependency(standardId: string, dependsOnId: string, type = 'depends_on'): Promise<void> {
    await restFetch('central_padroes_standard_dependencies', { method: 'POST', body: { standard_id: standardId, depends_on_standard_id: dependsOnId, relation_type: type } });
  },

  async removeDependency(standardId: string, dependsOnId: string): Promise<void> {
    const query = new URLSearchParams({ standard_id: `eq.${standardId}`, depends_on_standard_id: `eq.${dependsOnId}` });
    await restFetch('central_padroes_standard_dependencies', { method: 'DELETE', query });
  },

  async getImpactAnalysis(standardId: string): Promise<ImpactAnalysis> {
    const snapshot = await centralPadroesRepository.getSnapshot();
    const directDependents = snapshot.standards.filter((standard) => standard.dependencies.includes(standardId)).map((standard) => standard.key);
    const indirectDependents = snapshot.standards.filter((standard) => standard.dependencies.some((dep) => directDependents.includes(dep))).map((standard) => standard.key);
    const riskScore = directDependents.length * 20 + indirectDependents.length * 10;
    return { standardId, directDependents, indirectDependents, riskScore, breakingChanges: riskScore >= 40 };
  }
};

