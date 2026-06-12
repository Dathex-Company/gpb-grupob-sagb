import { auth, restFetch } from '../../../../services/supabase';

export type CentralGovernanceTable = 'central_padroes_reports' | 'central_padroes_audits' | 'central_padroes_curadoria';

export interface CentralGovernanceRecord {
  id: string;
  title: string;
  slug: string | null;
  type: string;
  category: string;
  status: string;
  riskLevel: string;
  pathAbsolute: string | null;
  pathRelative: string | null;
  summary: string | null;
  content: string | null;
  tags: string[];
  owner: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CentralTraceLog {
  id: string;
  executionId: string;
  project: string;
  module: string;
  executor: string | null;
  taskTitle: string;
  riskMax: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  commandsJson: unknown[];
  filesChangedJson: unknown[];
  errorsJson: unknown[];
  summary: string | null;
  createdAt: string;
}

export type GovernanceRecordInput = Partial<Omit<CentralGovernanceRecord, 'id' | 'createdAt' | 'updatedAt'>> & { title: string };
export type TraceLogInput = Partial<Omit<CentralTraceLog, 'id' | 'createdAt'>> & { executionId: string; taskTitle: string };

const withReturn = { Prefer: 'return=representation' };
const currentUserId = () => (auth.currentUser as { id?: string } | null)?.id || null;

const q = (select = '*') => {
  const query = new URLSearchParams();
  query.set('select', select);
  return query;
};

const mapRecord = (row: any): CentralGovernanceRecord => ({
  id: String(row.id),
  title: String(row.title || ''),
  slug: row.slug || null,
  type: String(row.type || 'documento'),
  category: String(row.category || 'governanca'),
  status: String(row.status || 'registro'),
  riskLevel: String(row.risk_level || 'R2'),
  pathAbsolute: row.path_absolute || null,
  pathRelative: row.path_relative || null,
  summary: row.summary || null,
  content: row.content || null,
  tags: Array.isArray(row.tags) ? row.tags : [],
  owner: row.owner || null,
  source: row.source || null,
  createdAt: String(row.created_at || new Date().toISOString()),
  updatedAt: row.updated_at || null
});

const mapTrace = (row: any): CentralTraceLog => ({
  id: String(row.id),
  executionId: String(row.execution_id || ''),
  project: String(row.project || 'SagB'),
  module: String(row.module || 'central_padroes'),
  executor: row.executor || null,
  taskTitle: String(row.task_title || ''),
  riskMax: String(row.risk_max || 'R2'),
  status: String(row.status || 'registro'),
  startedAt: row.started_at || null,
  finishedAt: row.finished_at || null,
  commandsJson: Array.isArray(row.commands_json) ? row.commands_json : [],
  filesChangedJson: Array.isArray(row.files_changed_json) ? row.files_changed_json : [],
  errorsJson: Array.isArray(row.errors_json) ? row.errors_json : [],
  summary: row.summary || null,
  createdAt: String(row.created_at || new Date().toISOString())
});

const recordBody = (input: GovernanceRecordInput) => ({
  title: input.title,
  slug: input.slug || null,
  type: input.type || 'documento',
  category: input.category || 'governanca',
  status: input.status || 'registro',
  risk_level: input.riskLevel || 'R2',
  path_absolute: input.pathAbsolute || null,
  path_relative: input.pathRelative || null,
  summary: input.summary || null,
  content: input.content || null,
  tags: input.tags || [],
  owner: input.owner || null,
  source: input.source || 'central_padroes_ui',
  created_by: currentUserId(),
  updated_by: currentUserId(),
  updated_at: new Date().toISOString()
});

export const centralPadroesGovernanceService = {
  async listRecords(table: CentralGovernanceTable, filter?: { query?: string; status?: string; riskLevel?: string; type?: string }): Promise<CentralGovernanceRecord[]> {
    const query = q('*');
    query.set('order', 'updated_at.desc.nullslast,created_at.desc');
    if (filter?.status && filter.status !== 'todos') query.set('status', `eq.${filter.status}`);
    if (filter?.riskLevel && filter.riskLevel !== 'todos') query.set('risk_level', `eq.${filter.riskLevel}`);
    if (filter?.type && filter.type !== 'todos') query.set('type', `eq.${filter.type}`);
    const data = await restFetch(table, { method: 'GET', query });
    const rows = Array.isArray(data) ? data.map(mapRecord) : [];
    if (!filter?.query) return rows;
    const term = filter.query.toLowerCase();
    return rows.filter((item) => `${item.title} ${item.type} ${item.category} ${item.status} ${item.riskLevel} ${item.summary || ''} ${item.content || ''} ${item.pathAbsolute || ''} ${item.pathRelative || ''} ${item.owner || ''} ${item.source || ''} ${item.tags.join(' ')} ${item.createdAt} ${item.updatedAt || ''}`.toLowerCase().includes(term));
  },

  async createRecord(table: CentralGovernanceTable, input: GovernanceRecordInput): Promise<CentralGovernanceRecord> {
    const data = await restFetch(table, { method: 'POST', headers: withReturn, body: recordBody(input) });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Supabase não retornou o registro criado.');
    return mapRecord(row);
  },

  async updateRecord(table: CentralGovernanceTable, id: string, input: GovernanceRecordInput): Promise<CentralGovernanceRecord> {
    const query = q('*');
    query.set('id', `eq.${id}`);
    const data = await restFetch(table, { method: 'PATCH', query, headers: withReturn, body: recordBody(input) });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Supabase não retornou o registro atualizado.');
    return mapRecord(row);
  },

  async listTraceLogs(filter?: { query?: string; status?: string; riskMax?: string }): Promise<CentralTraceLog[]> {
    const query = q('*');
    query.set('order', 'created_at.desc');
    if (filter?.status && filter.status !== 'todos') query.set('status', `eq.${filter.status}`);
    if (filter?.riskMax && filter.riskMax !== 'todos') query.set('risk_max', `eq.${filter.riskMax}`);
    const data = await restFetch('central_padroes_trace_logs', { method: 'GET', query });
    const rows = Array.isArray(data) ? data.map(mapTrace) : [];
    if (!filter?.query) return rows;
    const term = filter.query.toLowerCase();
    return rows.filter((item) => `${item.executionId} ${item.taskTitle} ${item.summary || ''} ${item.executor || ''}`.toLowerCase().includes(term));
  },

  async createTraceLog(input: TraceLogInput): Promise<CentralTraceLog> {
    const data = await restFetch('central_padroes_trace_logs', {
      method: 'POST',
      headers: withReturn,
      body: {
        execution_id: input.executionId,
        project: input.project || 'SagB',
        module: input.module || 'central_padroes',
        executor: input.executor || null,
        task_title: input.taskTitle,
        risk_max: input.riskMax || 'R2',
        status: input.status || 'registro',
        started_at: input.startedAt || null,
        finished_at: input.finishedAt || null,
        commands_json: input.commandsJson || [],
        files_changed_json: input.filesChangedJson || [],
        errors_json: input.errorsJson || [],
        summary: input.summary || null
      }
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) throw new Error('Supabase não retornou o LOZE-TRACE criado.');
    return mapTrace(row);
  }
};
