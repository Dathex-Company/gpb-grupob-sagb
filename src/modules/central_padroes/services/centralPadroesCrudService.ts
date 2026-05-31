import { auth, restFetch } from '../../../../services/supabase';
import {
  CentralChecklist,
  CentralDecision,
  CentralDocument,
  CentralModuleLink,
  CentralStandard,
  CreateChecklistInput,
  CreateDecisionInput,
  CreateDocumentInput,
  CreateStandardInput,
  DocumentFilter,
  StandardFilter,
  UpdateDocumentInput,
  UpdateModuleInput,
  UpdateStandardInput
} from '../types';
import { centralPadroesValidationService } from './centralPadroesValidationService';

const currentUserLabel = () => {
  const user = auth.currentUser as { id?: string; email?: string } | null;
  return user?.email || user?.id || 'unknown';
};

const q = (select = '*') => {
  const query = new URLSearchParams();
  query.set('select', select);
  return query;
};

const mapStandard = (row: any): CentralStandard => ({
  id: row.id,
  key: row.standard_key,
  title: row.title,
  type: row.normative_type,
  status: row.status,
  areaId: row.area_id,
  owner: row.owner_name,
  summary: row.summary,
  risk: row.risk_level,
  version: row.version || row.canonical_version || 1,
  agentAvailable: Boolean(row.agent_available),
  dependencies: [],
  relatedModules: [],
  updatedAt: row.updated_at || row.created_at || new Date().toISOString()
});

const mapDocument = (row: any): CentralDocument => ({
  id: row.id,
  title: row.title,
  path: row.source_path,
  status: row.status,
  category: row.category,
  areaId: row.area_id || 'pietro',
  shouldBecome: row.destination_type || 'apoio'
});

const mapDecision = (row: any): CentralDecision => ({
  id: row.id,
  title: row.title,
  status: row.status,
  areaId: row.area_id || 'pietro',
  summary: row.summary,
  impacts: Array.isArray(row.impacts) ? row.impacts : []
});

const mapChecklist = (row: any): CentralChecklist => ({
  id: row.id,
  title: row.title,
  context: row.context,
  owner: row.owner_name,
  items: Array.isArray(row.items) ? row.items : []
});

const withReturn = { Prefer: 'return=representation' };

export const centralPadroesCrudService = {
  async listStandards(filter?: StandardFilter): Promise<CentralStandard[]> {
    const query = q('*');
    query.set('order', 'standard_key.asc');
    if (filter?.status) query.set('status', `eq.${filter.status}`);
    if (filter?.areaId) query.set('area_id', `eq.${filter.areaId}`);
    const data = await restFetch('central_padroes_standards', { method: 'GET', query });
    const rows = Array.isArray(data) ? data.map(mapStandard) : [];
    if (!filter?.query) return rows;
    const term = filter.query.toLowerCase();
    return rows.filter((item) => `${item.key} ${item.title} ${item.summary}`.toLowerCase().includes(term));
  },

  async getStandard(id: string): Promise<CentralStandard | null> {
    const query = q('*');
    query.set('id', `eq.${id}`);
    const data = await restFetch('central_padroes_standards', { method: 'GET', query });
    return Array.isArray(data) && data[0] ? mapStandard(data[0]) : null;
  },

  async createStandard(input: CreateStandardInput): Promise<CentralStandard> {
    centralPadroesValidationService.validateStandard(input);
    const data = await restFetch('central_padroes_standards', {
      method: 'POST',
      headers: withReturn,
      body: {
        standard_key: input.key,
        title: input.title,
        normative_type: input.type,
        status: input.status || 'rascunho',
        area_id: input.areaId,
        owner_name: input.owner,
        summary: input.summary,
        content_md: input.contentMd || input.summary,
        content_rich: { markdown: input.contentMd || input.summary },
        risk_level: input.risk || 'medio',
        agent_available: Boolean(input.agentAvailable)
      }
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao criar padrão.');
    await this.recordHistory(row.id, 'create', null, row);
    return mapStandard(row);
  },

  async updateStandard(id: string, input: UpdateStandardInput): Promise<CentralStandard> {
    centralPadroesValidationService.validateStandard({ key: input.key || 'STD', title: input.title || 'Atualização', summary: input.summary || 'Atualização', areaId: input.areaId || 'pietro', owner: input.owner || currentUserLabel() });
    const query = q('*');
    query.set('id', `eq.${id}`);
    const body: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.key) body.standard_key = input.key;
    if (input.title) body.title = input.title;
    if (input.type) body.normative_type = input.type;
    if (input.status) body.status = input.status;
    if (input.areaId) body.area_id = input.areaId;
    if (input.owner) body.owner_name = input.owner;
    if (input.summary) body.summary = input.summary;
    if (input.risk) body.risk_level = input.risk;
    if (typeof input.agentAvailable === 'boolean') body.agent_available = input.agentAvailable;
    if (input.contentMd) body.content_rich = { markdown: input.contentMd };
    const data = await restFetch('central_padroes_standards', { method: 'PATCH', query, headers: withReturn, body });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao atualizar padrão.');
    await this.recordHistory(id, 'update', null, row);
    return mapStandard(row);
  },

  async deleteStandard(id: string): Promise<void> {
    const query = new URLSearchParams();
    query.set('id', `eq.${id}`);
    await restFetch('central_padroes_standards', { method: 'DELETE', query });
  },

  async listDocuments(filter?: DocumentFilter): Promise<CentralDocument[]> {
    const query = q('*');
    query.set('order', 'title.asc');
    if (filter?.status) query.set('status', `eq.${filter.status}`);
    if (filter?.areaId) query.set('area_id', `eq.${filter.areaId}`);
    const data = await restFetch('central_padroes_documents', { method: 'GET', query });
    const rows = Array.isArray(data) ? data.map(mapDocument) : [];
    if (!filter?.query) return rows;
    return rows.filter((doc) => `${doc.title} ${doc.path} ${doc.category}`.toLowerCase().includes(filter.query!.toLowerCase()));
  },

  async getDocument(id: string): Promise<CentralDocument | null> {
    const query = q('*');
    query.set('id', `eq.${id}`);
    const data = await restFetch('central_padroes_documents', { method: 'GET', query });
    return Array.isArray(data) && data[0] ? mapDocument(data[0]) : null;
  },

  async createDocument(input: CreateDocumentInput): Promise<CentralDocument> {
    centralPadroesValidationService.validateDocument(input);
    const data = await restFetch('central_padroes_documents', { method: 'POST', headers: withReturn, body: { title: input.title, source_path: input.path, status: input.status, category: input.category, area_id: input.areaId, destination_type: input.shouldBecome } });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao criar documento.');
    return mapDocument(row);
  },

  async updateDocument(id: string, input: UpdateDocumentInput): Promise<CentralDocument> {
    const query = q('*');
    query.set('id', `eq.${id}`);
    const body: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.title) body.title = input.title;
    if (input.path) body.source_path = input.path;
    if (input.status) body.status = input.status;
    if (input.category) body.category = input.category;
    if (input.areaId) body.area_id = input.areaId;
    if (input.shouldBecome) body.destination_type = input.shouldBecome;
    const data = await restFetch('central_padroes_documents', { method: 'PATCH', query, headers: withReturn, body });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao atualizar documento.');
    return mapDocument(row);
  },

  async deleteDocument(id: string): Promise<void> {
    const query = new URLSearchParams();
    query.set('id', `eq.${id}`);
    await restFetch('central_padroes_documents', { method: 'DELETE', query });
  },

  async listDecisions(): Promise<CentralDecision[]> {
    const query = q('*');
    query.set('order', 'created_at.desc');
    const data = await restFetch('central_padroes_decisions', { method: 'GET', query });
    return Array.isArray(data) ? data.map(mapDecision) : [];
  },

  async createDecision(input: CreateDecisionInput): Promise<CentralDecision> {
    centralPadroesValidationService.validateDecision(input);
    const data = await restFetch('central_padroes_decisions', { method: 'POST', headers: withReturn, body: { title: input.title, status: input.status, area_id: input.areaId, summary: input.summary, impacts: input.impacts } });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao criar decisão.');
    return mapDecision(row);
  },

  async listChecklists(): Promise<CentralChecklist[]> {
    const query = q('*');
    query.set('order', 'title.asc');
    const data = await restFetch('central_padroes_checklists', { method: 'GET', query });
    return Array.isArray(data) ? data.map(mapChecklist) : [];
  },

  async createChecklist(input: CreateChecklistInput): Promise<CentralChecklist> {
    centralPadroesValidationService.validateChecklist(input);
    const data = await restFetch('central_padroes_checklists', { method: 'POST', headers: withReturn, body: { title: input.title, context: input.context, owner_name: input.owner, items: input.items } });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao criar checklist.');
    return mapChecklist(row);
  },

  async listModules(): Promise<CentralModuleLink[]> {
    const data = await restFetch('central_padroes_module_links', { method: 'GET', query: q('*') });
    return Array.isArray(data) ? data.map((row: any) => ({ id: row.id, moduleId: row.module_id, moduleName: row.module_name, kind: row.kind, status: row.status, standards: Array.isArray(row.standards) ? row.standards : [] })) : [];
  },

  async updateModuleLink(id: string, input: UpdateModuleInput): Promise<CentralModuleLink> {
    const query = q('*');
    query.set('id', `eq.${id}`);
    const body: Record<string, unknown> = {};
    if (input.moduleId) body.module_id = input.moduleId;
    if (input.moduleName) body.module_name = input.moduleName;
    if (input.kind) body.kind = input.kind;
    if (input.status) body.status = input.status;
    if (input.standards) body.standards = input.standards;
    const data = await restFetch('central_padroes_module_links', { method: 'PATCH', query, headers: withReturn, body });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Falha ao atualizar módulo.');
    return { id: row.id, moduleId: row.module_id, moduleName: row.module_name, kind: row.kind, status: row.status, standards: Array.isArray(row.standards) ? row.standards : [] };
  },

  async recordHistory(standardId: string, action: string, previousData: unknown, nextData: unknown): Promise<void> {
    await restFetch('central_padroes_standard_history', { method: 'POST', body: { standard_id: standardId, action, previous_data: previousData, next_data: nextData, changed_by: currentUserLabel() } });
  }
};

