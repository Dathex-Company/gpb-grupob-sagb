import { restFetch } from '../../../../services/supabase';
import { centralBaseModulesCatalog } from '../data/baseModulesCatalog';
import { CentralBaseModule, CentralModuleLink } from '../types';

const queryAll = () => {
  const query = new URLSearchParams();
  query.set('select', '*');
  query.set('order', 'module_id.asc');
  return query;
};

const normalizeArray = (value: unknown): string[] => Array.isArray(value) ? value.map(String) : [];

const mapOnlineBaseModule = (row: any): CentralBaseModule => ({
  id: row.id,
  moduleId: row.module_id,
  name: row.name || row.module_name,
  moduleType: row.module_type || 'core',
  description: row.description || '',
  status: row.status || 'candidato',
  owner: row.owner_name || 'Central de Padrões',
  areaId: row.area_id || 'savio',
  dependencies: normalizeArray(row.dependencies),
  risks: normalizeArray(row.risks) as CentralBaseModule['risks'],
  recommendedUse: row.recommended_use || '',
  reuseCriteria: normalizeArray(row.reuse_criteria),
  linkedStandards: normalizeArray(row.linked_standards),
  linkedProtocols: normalizeArray(row.linked_protocols),
  linkedChecklists: normalizeArray(row.linked_checklists),
  gateChecklistKey: row.gate_checklist_key || 'CP-TEC-006',
  source: 'supabase'
});

const fromModuleLink = (moduleLink: CentralModuleLink): CentralBaseModule => {
  const catalogItem = centralBaseModulesCatalog.find((item) => item.moduleId === moduleLink.moduleId);
  if (catalogItem) {
    return {
      ...catalogItem,
      status: moduleLink.status === 'conforme' ? 'aprovado' : moduleLink.status === 'revisar' ? 'revisao' : catalogItem.status,
      linkedStandards: moduleLink.standards.length ? moduleLink.standards : catalogItem.linkedStandards,
      source: 'module_link'
    };
  }

  return {
    id: `base-${moduleLink.moduleId}`,
    moduleId: moduleLink.moduleId,
    name: moduleLink.moduleName,
    moduleType: 'core',
    description: 'Módulo base identificado em vínculos operacionais. Requer curadoria para completar contrato de reutilização.',
    status: moduleLink.status === 'conforme' ? 'aprovado' : 'candidato',
    owner: 'Central de Padrões',
    areaId: 'savio',
    dependencies: [],
    risks: ['medio'],
    recommendedUse: 'Consultar antes de criar implementação equivalente.',
    reuseCriteria: ['Existe módulo base similar', 'Há padrões vinculados', 'Pode evitar retrabalho'],
    linkedStandards: moduleLink.standards,
    linkedProtocols: ['CP-GOV-006'],
    linkedChecklists: ['CP-TEC-006'],
    gateChecklistKey: 'CP-TEC-006',
    source: 'module_link'
  };
};

export const centralPadroesBaseModulesService = {
  async listOnlineBaseModules(): Promise<CentralBaseModule[]> {
    const data = await restFetch('central_padroes_base_modules', { method: 'GET', query: queryAll() });
    return Array.isArray(data) ? data.map(mapOnlineBaseModule) : [];
  },

  async buildBaseModules(moduleLinks: CentralModuleLink[]): Promise<CentralBaseModule[]> {
    const online = await this.listOnlineBaseModules().catch(() => []);
    if (online.length) return online;

    const linked = moduleLinks.filter((moduleLink) => moduleLink.kind === 'base_reutilizavel').map(fromModuleLink);
    const linkedIds = new Set(linked.map((item) => item.moduleId));
    const catalogOnly = centralBaseModulesCatalog.filter((item) => !linkedIds.has(item.moduleId));
    return [...linked, ...catalogOnly];
  }
};
