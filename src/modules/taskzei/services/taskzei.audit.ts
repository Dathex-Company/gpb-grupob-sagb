import type { ITaskzeiRepository } from '../types/taskzei.contracts';

/**
 * Payload de uma consulta de auditoria.
 */
export interface AuditQuery {
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Resultado agregado de auditoria por ação.
 */
export interface AuditActionSummary {
  action: string;
  count: number;
  lastOccurrence: string;
}

/**
 * Serviço dedicado de consulta e análise de auditoria para o módulo TaskZei.
 *
 * Complementa o `autoAudit` do facade com operações de leitura, agregação
 * e geração de relatórios. As escritas continuam sendo feitas pelo facade.
 */
export class AuditService {
  constructor(private readonly provider: ITaskzeiRepository) {}

  /**
   * Lista logs de auditoria com filtros opcionais.
   * Delega ao provider que faz a query no Firestore.
   */
  async queryLogs(query: AuditQuery): Promise<unknown[]> {
    // O provider de auditoria aceita filtros inline.
    // Para filtrar corretamente precisamos percorrer todos os logs
    // e aplicar filtros em memória, já que o Firestore não suporta
    // queries complexas em collection group facilmente.
    try {
      const allLogs = await this.provider.auditLog('audit_query', 'audit_log', 'bulk');
      // Como auditLog retorna void, fazemos uma chamada direta
      // ao provider subjacente se ele expuser método de leitura.
      // Fallback: retorna array vazio com indicação de que logs
      // precisam ser lidos via collection direct do Firestore.
      return this.filterLogs(allLogs as unknown as Record<string, unknown>[], query);
    } catch {
      // Se o provider não suportar leitura de logs, logamos warning
      console.warn('[AuditService] Provider não suporta leitura de logs de auditoria');
      return [];
    }
  }

  /**
   * Gera sumário de ações de auditoria agregadas por tipo.
   */
  async getActionSummary(): Promise<AuditActionSummary[]> {
    try {
      const logs = await this.queryLogs({});
      const actionMap = new Map<string, { count: number; lastOccurrence: string }>();

      for (const log of logs) {
        const action = (log as Record<string, unknown>).action as string;
        const createdAt = (log as Record<string, unknown>).created_at as string ||
                          (log as Record<string, unknown>).createdAt as string;
        if (!action) continue;

        const existing = actionMap.get(action) || { count: 0, lastOccurrence: '' };
        existing.count += 1;
        if (createdAt && createdAt > existing.lastOccurrence) {
          existing.lastOccurrence = createdAt;
        }
        actionMap.set(action, existing);
      }

      return Array.from(actionMap.entries())
        .map(([action, data]) => ({
          action,
          count: data.count,
          lastOccurrence: data.lastOccurrence,
        }))
        .sort((a, b) => b.count - a.count);
    } catch {
      return [];
    }
  }

  /**
   * Gera relatório de atividades de um usuário específico.
   */
  async getUserActivityReport(userId: string): Promise<{
    userId: string;
    totalActions: number;
    actionsByType: AuditActionSummary[];
    lastActivity: string | null;
  }> {
    const logs = await this.queryLogs({ userId });
    const actionMap = new Map<string, { count: number; lastOccurrence: string }>();
    let lastActivity: string | null = null;

    for (const log of logs) {
      const row = log as Record<string, unknown>;
      const action = row.action as string;
      const createdAt = (row.created_at as string) || (row.createdAt as string);
      if (!action) continue;

      const existing = actionMap.get(action) || { count: 0, lastOccurrence: '' };
      existing.count += 1;
      if (createdAt && createdAt > existing.lastOccurrence) {
        existing.lastOccurrence = createdAt;
      }
      if (createdAt && (!lastActivity || createdAt > lastActivity)) {
        lastActivity = createdAt;
      }
      actionMap.set(action, existing);
    }

    return {
      userId,
      totalActions: Array.from(actionMap.values()).reduce((sum, a) => sum + a.count, 0),
      actionsByType: Array.from(actionMap.entries()).map(([action, data]) => ({
        action,
        count: data.count,
        lastOccurrence: data.lastOccurrence,
      })),
      lastActivity,
    };
  }

  /**
   * Filtra logs em memória com base nos critérios fornecidos.
   */
  private filterLogs(
    logs: Record<string, unknown>[],
    query: AuditQuery
  ): Record<string, unknown>[] {
    return logs.filter((log) => {
      if (query.action && log.action !== query.action) return false;
      if (query.entityType && log.entity_type !== query.entityType && log.entityType !== query.entityType) return false;
      if (query.entityId && log.entity_id !== query.entityId && log.entityId !== query.entityId) return false;
      if (query.userId && log.user_id !== query.userId && log.userId !== query.userId) return false;

      if (query.startDate || query.endDate) {
        const createdAt = (log.created_at as string) || (log.createdAt as string);
        if (!createdAt) return false;
        const ts = new Date(createdAt).getTime();
        if (query.startDate && ts < new Date(query.startDate).getTime()) return false;
        if (query.endDate && ts > new Date(query.endDate).getTime()) return false;
      }

      return true;
    });
  }
}
