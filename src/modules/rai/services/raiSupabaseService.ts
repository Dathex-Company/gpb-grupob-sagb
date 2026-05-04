import { restFetch } from '../../../../services/supabase';
import { RAIConfig, RAICapture } from '../types';

/**
 * Serviço de dados do RAI via Supabase (PostgREST).
 * As configurações (rai_configs) são vinculadas aos agents existentes do SagB.
 */

const TABLE_CONFIGS = 'rai_configs';
const TABLE_CAPTURES = 'rai_captures';

// --------------- Mappers ---------------

const mapConfigFromDB = (row: any): RAIConfig => ({
  id: row.id,
  agentId: row.agent_id,
  workspaceId: row.workspace_id,
  theme: row.theme,
  objective: row.objective || '',
  frequency: row.frequency,
  status: row.status,
  sources: Array.isArray(row.sources_json) ? row.sources_json : [],
  lastRun: row.last_run_at ? new Date(row.last_run_at) : undefined,
  nextRun: row.next_run_at ? new Date(row.next_run_at) : undefined,
  metadata: row.payload || undefined,
});

const mapCaptureFromDB = (row: any): RAICapture => ({
  id: row.id,
  agentId: row.agent_id,
  configId: row.config_id || undefined,
  title: row.title,
  content: row.content || '',
  summary: row.summary || undefined,
  sourceUrl: row.source_url || undefined,
  sourceName: row.source_name,
  relevance: row.relevance_score !== null ? Number(row.relevance_score) : 0,
  timestamp: new Date(row.captured_at || row.created_at),
  tags: Array.isArray(row.tags_json) ? row.tags_json : [],
  category: row.category || '',
  status: row.status,
  payload: row.payload || undefined,
});

// --------------- Query Builders ---------------

const buildQuery = (params?: Record<string, string>) => {
  const q = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        q.append(key, value);
      }
    });
  }
  if (!q.has('order')) {
    q.append('order', 'created_at.desc');
  }
  return q;
};

// --------------- Service ---------------

export const raiSupabaseService = {
  /**
   * Buscar configurações de radar dos agentes.
   */
  async getConfigs(workspaceId: string): Promise<RAIConfig[]> {
    const query = buildQuery({
      workspace_id: `eq.${workspaceId}`,
      select: '*',
    });
    const data = await restFetch(TABLE_CONFIGS, { query });
    return Array.isArray(data) ? data.map(mapConfigFromDB) : [];
  },

  /**
   * Buscar uma configuração específica por agent_id.
   */
  async getConfigByAgentId(agentId: string): Promise<RAIConfig | null> {
    const query = buildQuery({ agent_id: `eq.${agentId}`, select: '*' });
    const data = await restFetch(TABLE_CONFIGS, { query });
    if (Array.isArray(data) && data.length > 0) {
      return mapConfigFromDB(data[0]);
    }
    return null;
  },

  /**
   * Salvar ou atualizar configuração de radar de um agente.
   */
  async saveConfig(config: Partial<RAIConfig> & { agentId: string; workspaceId: string; theme: string }): Promise<RAIConfig | null> {
    const body: Record<string, any> = {
      agent_id: config.agentId,
      workspace_id: config.workspaceId,
      theme: config.theme,
      objective: config.objective || null,
      frequency: config.frequency || 'daily',
      status: config.status || 'active',
      sources_json: JSON.stringify(config.sources || []),
      payload: config.metadata ? JSON.stringify(config.metadata) : null,
      updated_at: new Date().toISOString(),
    };

    // Upsert: se já existir config para este agent+workspace, atualiza
    const data = await restFetch(TABLE_CONFIGS, {
      method: 'POST',
      body,
      query: new URLSearchParams({
        on_conflict: 'agent_id,workspace_id',
      }),
    });

    if (data && data[0]) {
      return mapConfigFromDB(data[0]);
    }
    return null;
  },

  /**
   * Buscar capturas com filtros opcionais.
   */
  async getCaptures(
    workspaceId: string,
    filters?: { agentId?: string; status?: string; category?: string; limit?: number }
  ): Promise<RAICapture[]> {
    const params: Record<string, string> = {
      workspace_id: `eq.${workspaceId}`,
      select: '*',
    };

    if (filters?.agentId) params['agent_id'] = `eq.${filters.agentId}`;
    if (filters?.status) params['status'] = `eq.${filters.status}`;
    if (filters?.category) params['category'] = `eq.${filters.category}`;
    if (filters?.limit) params['limit'] = String(filters.limit);

    const query = buildQuery(params);
    const data = await restFetch(TABLE_CAPTURES, { query });
    return Array.isArray(data) ? data.map(mapCaptureFromDB) : [];
  },

  /**
   * Buscar uma captura específica por ID.
   */
  async getCaptureById(id: string): Promise<RAICapture | null> {
    const query = buildQuery({ id: `eq.${id}`, select: '*' });
    const data = await restFetch(TABLE_CAPTURES, { query });
    if (Array.isArray(data) && data.length > 0) {
      return mapCaptureFromDB(data[0]);
    }
    return null;
  },

  /**
   * Atualizar status de uma captura (new → read → archived).
   */
  async updateCaptureStatus(id: string, status: RAICapture['status']): Promise<void> {
    await restFetch(TABLE_CAPTURES, {
      method: 'PATCH',
      body: { status, updated_at: new Date().toISOString() },
      query: new URLSearchParams({ id: `eq.${id}` }),
    });
  },

  /**
   * Disparar execução manual de um agente via Netlify Function.
   */
  async triggerAgentRun(agentId: string, workspaceId: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch('/.netlify/functions/rai-rss-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, workspaceId }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return { ok: false, error: error.message || 'Failed to trigger agent run' };
    }
  },
};
