// ============================================================
// Testes — Serviço de Auditoria (T2.2)
// ============================================================

import { describe, it, expect } from 'vitest';
import { centralPadroesAuditService } from '../services/centralPadroesAuditService';

describe('centralPadroesAuditService', () => {
  describe('getRiskLevelForTransition()', () => {
    it('retorna critico para transição de canônico', () => {
      const risk = centralPadroesAuditService.getRiskLevelForTransition('canonico_operacional', 'canonico_oficial');
      expect(risk).toBe('critico');
    });

    it('retorna alto para transição para publicado', () => {
      const risk = centralPadroesAuditService.getRiskLevelForTransition('homologado', 'publicado');
      expect(risk).toBe('alto');
    });

    it('retorna alto para bloqueio de padrão em revisão', () => {
      const risk = centralPadroesAuditService.getRiskLevelForTransition('em_revisao', 'bloqueado');
      expect(risk).toBe('alto');
    });

    it('retorna medio para arquivamento', () => {
      const risk = centralPadroesAuditService.getRiskLevelForTransition('obsoleto', 'arquivado');
      expect(risk).toBe('medio');
    });

    it('retorna baixo para transições simples', () => {
      const risk = centralPadroesAuditService.getRiskLevelForTransition('bruto', 'rascunho');
      expect(risk).toBe('baixo');
    });
  });

  describe('mapRow()', () => {
    it('mapeia row do banco corretamente', () => {
      const row = {
        id: 'log-001',
        event_type: 'STATUS_CHANGE',
        entity_type: 'standard',
        entity_id: 'std-001',
        previous_state: { status: 'rascunho' },
        new_state: { status: 'em_revisao' },
        diff: { status: { from: 'rascunho', to: 'em_revisao' } },
        changed_by: 'user@test.com',
        changed_by_role: 'editor',
        reason: 'Revisão iniciada',
        risk_level: 'baixo',
        metadata: { fromStatus: 'rascunho', toStatus: 'em_revisao' },
        created_at: '2026-06-01T12:00:00Z',
      };

      const entry = centralPadroesAuditService.mapRow(row);
      expect(entry.id).toBe('log-001');
      expect(entry.eventType).toBe('STATUS_CHANGE');
      expect(entry.entityType).toBe('standard');
      expect(entry.changedBy).toBe('user@test.com');
      expect(entry.changedByRole).toBe('editor');
      expect(entry.riskLevel).toBe('baixo');
      expect(entry.metadata).toEqual({ fromStatus: 'rascunho', toStatus: 'em_revisao' });
    });

    it('lida com campos nulos', () => {
      const row: Record<string, unknown> = {
        id: 'log-002',
        event_type: 'CREATE',
        entity_type: 'standard',
        entity_id: 'std-002',
        changed_by: 'system',
        created_at: '2026-06-01T12:00:00Z',
      };

      const entry = centralPadroesAuditService.mapRow(row);
      expect(entry.id).toBe('log-002');
      expect(entry.changedByRole).toBeNull();
      expect(entry.reason).toBeNull();
      expect(entry.riskLevel).toBeNull();
      expect(entry.previousState).toBeNull();
      expect(entry.diff).toBeNull();
    });
  });
});
