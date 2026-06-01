import { centralPadroesFallbackData } from '../data/fallbackData';
import { centralBaseModulesCatalog } from '../data/baseModulesCatalog';
import { restFetch } from '../../../../services/supabase';

const withReturn = { Prefer: 'return=representation' };

const qBy = (field: string, value: string) => {
  const query = new URLSearchParams();
  query.set('select', 'id');
  query.set(field, `eq.${value}`);
  query.set('limit', '1');
  return query;
};

const exists = async (table: string, field: string, value: string) => {
  const data = await restFetch(table, { method: 'GET', query: qBy(field, value) });
  return Array.isArray(data) && data.length > 0;
};

export const centralPadroesSeedService = {
  async seedFallbackIntoSupabase(): Promise<{ areas: number; standards: number; documents: number; decisions: number; checklists: number; modules: number; baseModules: number; agents: number }> {
    const result = { areas: 0, standards: 0, documents: 0, decisions: 0, checklists: 0, modules: 0, baseModules: 0, agents: 0 };

    for (const area of centralPadroesFallbackData.areas) {
      if (await exists('central_padroes_areas', 'id', area.id)) continue;
      await restFetch('central_padroes_areas', {
        method: 'POST',
        headers: withReturn,
        body: {
          id: area.id,
          name: area.name,
          owner_name: area.owner,
          focus: area.focus
        }
      });
      result.areas += 1;
    }

    for (const standard of centralPadroesFallbackData.standards) {
      if (await exists('central_padroes_standards', 'standard_key', standard.key)) continue;
      await restFetch('central_padroes_standards', {
        method: 'POST',
        headers: withReturn,
        body: {
          standard_key: standard.key,
          title: standard.title,
          normative_type: standard.type,
          status: standard.status,
          area_id: standard.areaId,
          owner_name: standard.owner,
          summary: standard.summary,
          content_md: standard.summary,
          content_rich: { markdown: standard.summary, seeded_from: 'fallbackData' },
          risk_level: standard.risk,
          agent_available: Boolean(standard.agentAvailable),
          canonical_version: standard.version,
          version: standard.version
        }
      });
      result.standards += 1;
    }

    for (const document of centralPadroesFallbackData.documents) {
      if (await exists('central_padroes_documents', 'title', document.title)) continue;
      await restFetch('central_padroes_documents', {
        method: 'POST',
        headers: withReturn,
        body: {
          title: document.title,
          source_path: document.path,
          status: document.status,
          category: document.category,
          area_id: document.areaId,
          destination_type: document.shouldBecome
        }
      });
      result.documents += 1;
    }

    for (const decision of centralPadroesFallbackData.decisions) {
      if (await exists('central_padroes_decisions', 'title', decision.title)) continue;
      await restFetch('central_padroes_decisions', {
        method: 'POST',
        headers: withReturn,
        body: {
          title: decision.title,
          status: decision.status,
          area_id: decision.areaId,
          summary: decision.summary,
          impacts: decision.impacts
        }
      });
      result.decisions += 1;
    }

    for (const checklist of centralPadroesFallbackData.checklists) {
      if (await exists('central_padroes_checklists', 'title', checklist.title)) continue;
      await restFetch('central_padroes_checklists', {
        method: 'POST',
        headers: withReturn,
        body: {
          title: checklist.title,
          context: checklist.context,
          owner_name: checklist.owner,
          items: checklist.items
        }
      });
      result.checklists += 1;
    }

    for (const moduleLink of centralPadroesFallbackData.modules) {
      if (await exists('central_padroes_module_links', 'module_id', moduleLink.moduleId)) continue;
      await restFetch('central_padroes_module_links', {
        method: 'POST',
        headers: withReturn,
        body: {
          module_id: moduleLink.moduleId,
          module_name: moduleLink.moduleName,
          kind: moduleLink.kind,
          status: moduleLink.status,
          standards: moduleLink.standards
        }
      });
      result.modules += 1;
    }

    for (const baseModule of centralBaseModulesCatalog) {
      if (await exists('central_padroes_base_modules', 'module_id', baseModule.moduleId).catch(() => false)) continue;
      await restFetch('central_padroes_base_modules', {
        method: 'POST',
        headers: withReturn,
        body: {
          module_id: baseModule.moduleId,
          name: baseModule.name,
          module_type: baseModule.moduleType,
          description: baseModule.description,
          status: baseModule.status,
          owner_name: baseModule.owner,
          area_id: baseModule.areaId,
          dependencies: baseModule.dependencies,
          risks: baseModule.risks,
          recommended_use: baseModule.recommendedUse,
          reuse_criteria: baseModule.reuseCriteria,
          linked_standards: baseModule.linkedStandards,
          linked_protocols: baseModule.linkedProtocols,
          linked_checklists: baseModule.linkedChecklists,
          gate_checklist_key: baseModule.gateChecklistKey
        }
      }).catch(() => null);
      result.baseModules += 1;
    }

    for (const agent of centralPadroesFallbackData.agents) {
      if (await exists('central_padroes_agent_runs', 'agent_code', agent.agentCode)) continue;
      await restFetch('central_padroes_agent_runs', {
        method: 'POST',
        headers: withReturn,
        body: {
          agent_code: agent.agentCode,
          agent_name: agent.agentName,
          block_name: agent.block,
          status: agent.status,
          deliverable: agent.deliverable
        }
      });
      result.agents += 1;
    }

    return result;
  }
};
