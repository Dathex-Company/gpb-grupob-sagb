/**
 * Testes do sistema de auditoria.
 *
 * Verifica:
 * - Criação de RequestContext
 * - Extração de X-Request-Id
 * - Cálculo de duração
 * - AuditLogger (log, flush, query)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequestContext, extractRequestId, calculateDuration } from '../../audit/requestContext';
import { AuditLogger } from '../../audit/auditLogger';
import { AuditEntry } from '../../audit/audit.types';

describe('Audit System', () => {
  describe('requestContext', () => {
    it('deve criar RequestContext com requestId', () => {
      const context = createRequestContext({
        requestId: 'req-123',
        clientId: 'client-1',
        environment: 'test',
        scopes: ['system:read'],
      });

      expect(context.requestId).toBe('req-123');
      expect(context.clientId).toBe('client-1');
      expect(context.environment).toBe('test');
      expect(context.startedAt).toBeGreaterThan(0);
    });

    it('deve criar RequestContext sem scopes', () => {
      const context = createRequestContext({
        requestId: 'req-456',
        clientId: 'anonymous',
        environment: 'production',
        scopes: [],
      });

      expect(context.scopes).toEqual([]);
    });
  });

  describe('extractRequestId', () => {
    it('deve extrair X-Request-Id dos headers', () => {
      const headers = { 'X-Request-Id': 'req-789', 'Content-Type': 'application/json' };
      expect(extractRequestId(headers)).toBe('req-789');
    });

    it('deve extrair x-request-id (lowercase) dos headers', () => {
      const headers = { 'x-request-id': 'req-abc' };
      expect(extractRequestId(headers)).toBe('req-abc');
    });

    it('deve retornar undefined se não existir requestId', () => {
      expect(extractRequestId({})).toBeUndefined();
    });

    it('deve lidar com headers com array de valores', () => {
      const headers = { 'X-Request-Id': ['req-111', 'req-222'] };
      expect(extractRequestId(headers)).toBe('req-111');
    });
  });

  describe('calculateDuration', () => {
    it('deve calcular duração correta', () => {
      const start = Date.now() - 1000; // 1 segundo atrás
      const duration = calculateDuration(start);
      expect(duration).toBeGreaterThanOrEqual(990);
      expect(duration).toBeLessThanOrEqual(1100);
    });

    it('deve retornar 0 para duração instantânea', () => {
      const start = Date.now();
      const duration = calculateDuration(start);
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('AuditLogger', () => {
    let logger: AuditLogger;

    beforeEach(() => {
      // Garante instância limpa para cada teste
      logger = AuditLogger.getInstance();
      (logger as any).buffer = [];
      (logger as any).flushInterval = null;
    });

    it('deve ser singleton', () => {
      const instance1 = AuditLogger.getInstance();
      const instance2 = AuditLogger.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('deve adicionar entry ao buffer', () => {
      const entry: AuditEntry = {
        request_id: 'req-1',
        client_id: 'client-1',
        environment: 'test',
        method: 'GET',
        path: '/v1/health',
        scopes: ['system:read'],
        status_code: 200,
        duration_ms: 10,
        created_at: new Date().toISOString(),
      };

      logger.log(entry);
      expect(logger['buffer'].length).toBe(1);
      expect(logger['buffer'][0]).toEqual(entry);
    });

    it('deve adicionar múltiplas entradas', () => {
      for (let i = 0; i < 5; i++) {
        logger.log({
          request_id: `req-${i}`,
          client_id: 'client-1',
          environment: 'test',
          method: 'GET',
          path: '/v1/health',
          scopes: [],
          status_code: 200,
          duration_ms: 10,
          created_at: new Date().toISOString(),
        });
      }
      expect(logger['buffer'].length).toBe(5);
    });

    it('deve limpar buffer após flush bem sucedido', async () => {
      const entry: AuditEntry = {
        request_id: 'req-1',
        client_id: 'client-1',
        environment: 'test',
        method: 'GET',
        path: '/v1/health',
        scopes: [],
        status_code: 200,
        duration_ms: 10,
        created_at: new Date().toISOString(),
      };

      // Mock do Supabase
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
      } as Response);

      logger.log(entry);
      await logger.flush();
      expect(logger['buffer'].length).toBe(0);
    });

    it('deve manter entradas no buffer se flush falhar', async () => {
      const entry: AuditEntry = {
        request_id: 'req-1',
        client_id: 'client-1',
        environment: 'test',
        method: 'GET',
        path: '/v1/health',
        scopes: [],
        status_code: 200,
        duration_ms: 10,
        created_at: new Date().toISOString(),
      };

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      logger.log(entry);
      // O flush não deve remover entradas se falhar
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      await logger.flush();
      expect(logger['buffer'].length).toBe(1);
      consoleSpy.mockRestore();
    });

    it('deve respeitar o limite máximo do buffer', () => {
      const maxBuffer = 1000;
      for (let i = 0; i < maxBuffer + 10; i++) {
        logger.log({
          request_id: `req-${i}`,
          client_id: 'client-1',
          environment: 'test',
          method: 'GET',
          path: '/v1/health',
          scopes: [],
          status_code: 200,
          duration_ms: 10,
          created_at: new Date().toISOString(),
        });
      }
      expect(logger['buffer'].length).toBeLessThanOrEqual(maxBuffer);
    });

    it('deve consultar entries por client_id', async () => {
      const entry: AuditEntry = {
        request_id: 'req-1',
        client_id: 'client-1',
        environment: 'test',
        method: 'GET',
        path: '/v1/health',
        scopes: [],
        status_code: 200,
        duration_ms: 10,
        created_at: new Date().toISOString(),
      };

      logger.log(entry);

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [entry],
      } as Response);

      const results = await logger.query({ clientId: 'client-1', limit: 10 });
      expect(results).toHaveLength(1);
      expect(results[0].client_id).toBe('client-1');
    });
  });
});
