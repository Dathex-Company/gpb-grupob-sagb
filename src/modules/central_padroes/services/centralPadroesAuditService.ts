// ============================================================
// Central de Padrões — Serviço de Auditoria (T1.3)
// ============================================================
// Registra todas as operações críticas em central_padroes_audit_log
// Fallback para console.warn se Supabase offline

import { restFetch } from '../../../../services/supabase';
import {
  AuditEventType,
  AuditEntityType,
  AuditLogEntry,
  CentralRiskLevel
} from '../types';
import { centralPadroesPermissionService } from './centralPadroesPermissionService';

const AUDIT_TABLE = 'central_padroes_audit_log';

interface AuditInput {
  eventType: AuditEventType;
  entityType: AuditEntityType;
  entityId: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  diff?: Record<string, unknown> | null;
  reason?: string | null;
  riskLevel?: CentralRiskLevel | null;
  metadata?: Record<string, unknown>;
}

/**
 * Gera um diff simples entre dois objetos JSON.
 */
const generateDiff = (
  prev: Record<string, unknown> | null | undefined,
  next: Record<string, unknown> | null | undefined
): Record<string, unknown> | null => {
  if (!prev || !next) return null;
  const changes: Record<string, unknown> = {};
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const key of allKeys) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
      changes[key] = { from: prev[key], to: next[key] };
    }
  }
  return Object.keys(changes).length > 0 ? changes : null;
};

export const centralPadroesAuditService = {
  /**
   * Registra um evento de auditoria.
   */
  async log(input: AuditInput): Promise<AuditLogEntry | null> {
    const user = centralPadroesPermissionService.getCurrentUser();
    const role = centralPadroesPermissionService.getCurrentRole();

    const diff = input.diff || generateDiff(input.previousState, input.newState);

    const payload = {
      event_type: input.eventType,
      entity_type: input.entityType,
      entity_id: input.entityId,
      previous_state: input.previousState || null,
      new_state: input.newState || null,
      diff: diff || null,
      changed_by: user,
      changed_by_role: role,
      reason: input.reason || null,
      risk_level: input.riskLevel || null,
      metadata: input.metadata || {}
    };

    try {
      const data = await restFetch(AUDIT_TABLE, {
        method: 'POST',
        body: payload,
        headers: { Prefer: 'return=representation' }
      });

      if (Array.isArray(data) && data[0]) {
        return this.mapRow(data[0]);
      }
      return null;
    } catch (err) {
      // Fallback: log no console se Supabase offline
      console.warn('[central-padroes][audit] Supabase offline — log não registrado remotamente.', {
        payload,
        error: (err as Error).message
      });
      return null;
    }
  },

  /**
   * Registra criação de entidade.
   */
  async logCreate(entityType: AuditEntityType, entityId: string, entity: Record<string, unknown>, reason?: string): Promise<void> {
    await this.log({
      eventType: 'CREATE',
      entityType,
      entityId,
      newState: entity,
      reason: reason || 'Criação de registro',
      riskLevel: entity.risk_level as CentralRiskLevel || 'medio'
    });
  },

  /**
   * Registra atualização de entidade.
   */
  async logUpdate(entityType: AuditEntityType, entityId: string, previous: Record<string, unknown>, next: Record<string, unknown>, reason?: string): Promise<void> {
    const diff = generateDiff(previous, next);
    const isCanonicalEdit = previous.canonical_level === 'canonico_operacional' || previous.canonical_level === 'canonico_oficial';
    await this.log({
      eventType: isCanonicalEdit ? 'CANONICAL_EDIT' : 'UPDATE',
      entityType,
      entityId,
      previousState: previous,
      newState: next,
      diff,
      reason: reason || (isCanonicalEdit ? 'Alteração em padrão canônico' : 'Atualização de registro'),
      riskLevel: isCanonicalEdit ? 'critico' : (next.risk_level as CentralRiskLevel || 'medio'),
      metadata: isCanonicalEdit ? { requiresJustification: true } : undefined
    });
  },

  /**
   * Registra exclusão (soft delete).
   */
  async logDelete(entityType: AuditEntityType, entityId: string, entity: Record<string, unknown>, reason?: string): Promise<void> {
    await this.log({
      eventType: 'SOFT_DELETE',
      entityType,
      entityId,
      previousState: entity,
      reason: reason || 'Exclusão lógica',
      riskLevel: entity.risk_level as CentralRiskLevel || 'alto',
      metadata: { softDelete: true }
    });
  },

  /**
   * Registra mudança de status.
   */
  async logStatusChange(entityType: AuditEntityType, entityId: string, fromStatus: string, toStatus: string, entity: Record<string, unknown>, reason?: string): Promise<void> {
    await this.log({
      eventType: 'STATUS_CHANGE',
      entityType,
      entityId,
      previousState: { status: fromStatus },
      newState: { status: toStatus },
      reason: reason || `Mudança de status: ${fromStatus} → ${toStatus}`,
      riskLevel: this.getRiskLevelForTransition(fromStatus, toStatus),
      metadata: { fromStatus, toStatus }
    });
  },

  /**
   * Registra aprovação.
   */
  async logApprove(entityType: AuditEntityType, entityId: string, approvedBy: string, reason?: string): Promise<void> {
    await this.log({
      eventType: 'APPROVE',
      entityType,
      entityId,
      reason: reason || 'Aprovação de registro',
      riskLevel: 'alto',
      metadata: { approvedBy }
    });
  },

  /**
   * Registra rejeição.
   */
  async logReject(entityType: AuditEntityType, entityId: string, rejectedBy: string, reason: string): Promise<void> {
    await this.log({
      eventType: 'REJECT',
      entityType,
      entityId,
      reason: reason || 'Rejeição de registro',
      riskLevel: 'medio',
      metadata: { rejectedBy }
    });
  },

  /**
   * Registra consulta de agente.
   */
  async logAgentQuery(entityType: AuditEntityType, entityId: string, agentCode: string): Promise<void> {
    await this.log({
      eventType: 'AGENT_QUERY',
      entityType,
      entityId,
      riskLevel: 'baixo',
      metadata: { agentCode }
    });
  },

  /**
   * Registra resposta do Chat Pietro.
   */
  async logChatResponse(entityType: AuditEntityType, entityId: string, question: string): Promise<void> {
    await this.log({
      eventType: 'CHAT_RESPONSE',
      entityType,
      entityId,
      riskLevel: 'baixo',
      metadata: { question }
    });
  },

  /**
   * Registra mudança de responsável/dono.
   */
  async logOwnerChange(
    entityType: AuditEntityType,
    entityId: string,
    fromOwner: string,
    toOwner: string,
    reason?: string
  ): Promise<void> {
    await this.log({
      eventType: 'OWNER_CHANGE',
      entityType,
      entityId,
      previousState: { owner: fromOwner },
      newState: { owner: toOwner },
      reason: reason || `Mudança de responsável: ${fromOwner || 'sem dono'} → ${toOwner || 'sem dono'}`,
      riskLevel: 'medio',
      metadata: { fromOwner, toOwner }
    });
  },

  /**
   * Registra upload de evidência visual/documental.
   */
  async logEvidenceUpload(
    entityType: AuditEntityType,
    entityId: string,
    evidence: {
      evidenceId?: string;
      title?: string;
      storagePath?: string;
      bucket?: 'cp-evidence' | 'cp-documents' | string;
      severity?: CentralRiskLevel;
    },
    reason?: string
  ): Promise<void> {
    await this.log({
      eventType: 'CREATE',
      entityType: 'evidence',
      entityId: evidence.evidenceId || entityId,
      newState: evidence as Record<string, unknown>,
      reason: reason || `Upload de evidência para ${entityType}:${entityId}`,
      riskLevel: evidence.severity || 'medio',
      metadata: {
        relatedEntityType: entityType,
        relatedEntityId: entityId,
        bucket: evidence.bucket,
        storagePath: evidence.storagePath,
      }
    });
  },

  /**
   * Busca logs por entidade.
   */
  async getLogsByEntity(entityType: AuditEntityType, entityId: string, limit = 50): Promise<AuditLogEntry[]> {
    try {
      const query = new URLSearchParams();
      query.set('entity_type', `eq.${entityType}`);
      query.set('entity_id', `eq.${entityId}`);
      query.set('order', 'created_at.desc');
      query.set('limit', String(limit));
      const data = await restFetch(AUDIT_TABLE, { method: 'GET', query });
      return Array.isArray(data) ? data.map(this.mapRow) : [];
    } catch {
      return [];
    }
  },

  /**
   * Busca logs por tipo de evento.
   */
  async getLogsByEventType(eventType: AuditEventType, limit = 50): Promise<AuditLogEntry[]> {
    try {
      const query = new URLSearchParams();
      query.set('event_type', `eq.${eventType}`);
      query.set('order', 'created_at.desc');
      query.set('limit', String(limit));
      const data = await restFetch(AUDIT_TABLE, { method: 'GET', query });
      return Array.isArray(data) ? data.map(this.mapRow) : [];
    } catch {
      return [];
    }
  },

  /**
   * Busca logs recentes.
   */
  async getRecentLogs(limit = 100): Promise<AuditLogEntry[]> {
    try {
      const query = new URLSearchParams();
      query.set('order', 'created_at.desc');
      query.set('limit', String(limit));
      const data = await restFetch(AUDIT_TABLE, { method: 'GET', query });
      return Array.isArray(data) ? data.map(this.mapRow) : [];
    } catch {
      return [];
    }
  },

  /**
   * Mapeia uma row do banco para AuditLogEntry.
   */
  mapRow(row: Record<string, unknown>): AuditLogEntry {
    return {
      id: String(row.id || ''),
      eventType: row.event_type as AuditEventType,
      entityType: row.entity_type as AuditEntityType,
      entityId: String(row.entity_id || ''),
      previousState: row.previous_state ? (row.previous_state as Record<string, unknown>) : null,
      newState: row.new_state ? (row.new_state as Record<string, unknown>) : null,
      diff: row.diff ? (row.diff as Record<string, unknown>) : null,
      changedBy: String(row.changed_by || ''),
      changedByRole: row.changed_by_role ? String(row.changed_by_role) : null,
      reason: row.reason ? String(row.reason) : null,
      riskLevel: row.risk_level ? (row.risk_level as CentralRiskLevel) : null,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: String(row.created_at || '')
    };
  },

  /**
   * Define nível de risco baseado na transição de status.
   */
  getRiskLevelForTransition(from: string, to: string): CentralRiskLevel {
    const criticalTransitions = ['bruto', 'rascunho', 'em_revisao'];
    if (from === 'canonico_operacional' || from === 'canonico_oficial') return 'critico';
    if (to === 'publicado' || to === 'canonico_oficial') return 'alto';
    if (criticalTransitions.includes(from) && to === 'bloqueado') return 'alto';
    if (to === 'arquivado' || to === 'obsoleto') return 'medio';
    return 'baixo';
  }
};
