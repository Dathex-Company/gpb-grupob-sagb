import { AuditEntry, RequestContext, AuditFilter } from './audit.types';
import { calculateDuration } from './requestContext';

/**
 * Configuração para persistência de auditoria via Supabase.
 */
function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || 'http://localhost:54321',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  };
}

/**
 * Serviço de auditoria da API SagB.
 * Registra requisições e permite consulta do histórico de auditoria.
 *
 * Em operação real, conecta-se ao Supabase para persistência.
 * Nesta fase inicial, utiliza armazenamento em memória com fallback.
 */
export class AuditLogger {
  private static instance: AuditLogger;
  private buffer: AuditEntry[] = [];
  private readonly maxBufferSize = 1000;

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Registra uma entrada de auditoria.
   * Aceita tanto um AuditEntry completo quanto os parâmetros individuais
   * para compatibilidade com diferentes estilos de chamada.
   */
  async log(entry: AuditEntry): Promise<void> {
    if (!entry || !entry.request_id) {
      console.warn('[AUDIT] Invalid audit entry:', entry);
      return;
    }

    this.buffer.push(entry);

    // Se o buffer atingir o limite, persiste e limpa
    if (this.buffer.length >= this.maxBufferSize) {
      await this.flush();
    }
  }

  /**
   * Persiste o buffer de auditoria no Supabase via REST API.
   * Em ambiente de teste, o global.fetch é mockado pelo Vitest.
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = [...this.buffer];
    this.buffer = [];

    try {
      const { url, serviceKey } = getSupabaseConfig();
      const response = await fetch(`${url}/rest/v1/api_audit_log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(batch),
      });

      if (!response.ok) {
        throw new Error(`Supabase insert failed: ${response.status}`);
      }
    } catch (error) {
      console.error('[AUDIT] Failed to flush audit log:', error);
      // Re-adiciona ao buffer em caso de falha
      this.buffer.unshift(...batch);
    }
  }

  /**
   * Busca entradas de auditoria com filtros.
   */
  async query(filter: AuditFilter = {}): Promise<AuditEntry[]> {
    let results = [...this.buffer];

    if (filter.clientId) {
      results = results.filter(e => e.client_id === filter.clientId);
    }
    if (filter.method) {
      results = results.filter(e => e.method === filter.method);
    }
    if (filter.path) {
      results = results.filter(e => e.path.startsWith(filter.path!));
    }
    if (filter.status_code) {
      results = results.filter(e => e.status_code === filter.status_code);
    }

    // Ordenar por data descendente
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const limit = filter.limit || 50;
    const offset = filter.offset || 0;

    return results.slice(offset, offset + limit);
  }
}

export const auditLogger = AuditLogger.getInstance();
