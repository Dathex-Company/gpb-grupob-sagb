/**
 * Testes de integração dos adapters.
 *
 * Verifica:
 * - HttpClient (retry, timeout, error handling)
 * - CircuitBreaker (states: CLOSED, OPEN, HALF_OPEN)
 * - Adapters (TaskZei, CRM, Studio, Vox)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient, TimeoutError } from '../../integration/httpClient';
import { CircuitBreaker } from '../../integration/circuitBreaker';
import { TaskzeiAdapter } from '../../integration/adapters/taskzeiAdapter';
import { CrmAdapter } from '../../integration/adapters/crmAdapter';
import { StudioAdapter } from '../../integration/adapters/studioAdapter';
import { VoxAdapter } from '../../integration/adapters/voxAdapter';
import { createSuccessResponse, createErrorResponse } from '../../integration/adapters/types';

describe('Integration Layer', () => {
  describe('HttpClient', () => {
    const baseUrl = 'http://localhost:9999';

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('deve fazer GET com sucesso', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      } as Response);

      const client = new HttpClient({ baseUrl });
      const response = await client.get('/test');
      expect(response.data).toEqual({ data: 'test' });
    });

    it('deve fazer POST com body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ id: '123' }),
      } as Response);

      const client = new HttpClient({ baseUrl });
      const response = await client.post('/test', { name: 'test' });
      expect(response.data).toEqual({ id: '123' });
    });

    it('deve aplicar timeout via AbortController', async () => {
      vi.useFakeTimers();

      // Mock fetch que respeita AbortSignal: quando o controller abortar,
      // rejeita com AbortError. Isso simula o comportamento real do fetch.
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        return new Promise((_, reject) => {
          const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
          options?.signal?.addEventListener('abort', onAbort, { once: true });
          // Se já estiver abortado, rejeita imediatamente
          if (options?.signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
          }
        });
      });

      const client = new HttpClient({ baseUrl, timeout: 100 });
      const promise = client.get('/timeout');

      // Anexa o .catch() ANTES de avançar os timers, para evitar que o
      // Node.js detecte a rejeição como "unhandled" (ela ocorre durante
      // o processamento síncrono de vi.advanceTimersByTimeAsync).
      const rejection = expect(promise).rejects.toThrow(TimeoutError);
      await vi.advanceTimersByTimeAsync(150);
      await rejection;

      vi.useRealTimers();
    });

    it('deve tentar novamente em caso de falha (retry)', async () => {
      let attempts = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Temporary error'));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);
      });

      const client = new HttpClient({ baseUrl, retryCount: 3 });
      const response = await client.get('/retry-test');
      expect(response.data).toEqual({ success: true });
      expect(attempts).toBe(3);
    });

    it('deve lançar erro após exaurir tentativas de retry', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Persistent error'));

      const client = new HttpClient({ baseUrl, retryCount: 2 });
      await expect(client.get('/fail')).rejects.toThrow();
    });
  });

  describe('CircuitBreaker', () => {
    it('deve iniciar no estado CLOSED', () => {
      const cb = new CircuitBreaker({ name: 'test', failureThreshold: 3, successThreshold: 2, timeout: 10000 });
      expect(cb['state']).toBe('CLOSED');
    });

    it('deve chamar a função com sucesso e permanecer CLOSED', async () => {
      const cb = new CircuitBreaker({ name: 'test', failureThreshold: 3, successThreshold: 2, timeout: 10000 });
      const result = await cb.call(async () => 'success');
      expect(result).toBe('success');
      expect(cb['state']).toBe('CLOSED');
    });

    it('deve abrir o circuito após exceder failureThreshold', async () => {
      const cb = new CircuitBreaker({ name: 'test', failureThreshold: 2, successThreshold: 1, timeout: 5000 });

      const failingFn = async () => { throw new Error('fail'); };

      await expect(cb.call(failingFn)).rejects.toThrow();
      await expect(cb.call(failingFn)).rejects.toThrow();
      expect(cb['state']).toBe('OPEN');

      // Terceira chamada deve falhar imediatamente (circuito aberto)
      await expect(cb.call(failingFn)).rejects.toThrow('Circuit breaker is OPEN');
    });

    it('deve transitar para HALF_OPEN após timeout e fechar após sucesso', async () => {
      vi.useFakeTimers();

      const cb = new CircuitBreaker({ name: 'test', failureThreshold: 1, successThreshold: 1, timeout: 1000 });
      const failingFn = async () => { throw new Error('fail'); };
      const successFn = async () => 'recovered';

      await expect(cb.call(failingFn)).rejects.toThrow();
      expect(cb['state']).toBe('OPEN');

      // Avança o tempo além do timeout
      vi.advanceTimersByTime(1500);

      // Agora deve permitir HALF_OPEN
      const result = await cb.call(successFn);
      expect(result).toBe('recovered');
      expect(cb['state']).toBe('CLOSED');

      vi.useRealTimers();
    });
  });

  describe('Adapters', () => {
    const baseUrl = 'http://localhost:9999';

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    describe('TaskzeiAdapter', () => {
      it('deve listar notificações', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => [{ id: 'n1', title: 'Test' }],
        } as Response);

        const adapter = new TaskzeiAdapter({ baseUrl });
        const result = await adapter.listNotifications({ recipient_id: 'user-1' });
        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
      });

      it('deve enviar notificação', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
          json: async () => ({ id: 'n1', title: 'Hello' }),
        } as Response);

        const adapter = new TaskzeiAdapter({ baseUrl });
        const result = await adapter.sendNotification({
          title: 'Hello',
          message: 'World',
          type: 'info',
          recipient_ids: ['user-1'],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('CrmAdapter', () => {
      it('deve listar leads', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => [{ id: 'l1', name: 'Lead 1' }],
        } as Response);

        const adapter = new CrmAdapter({ baseUrl });
        const result = await adapter.listLeads({});
        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
      });

      it('deve criar lead', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
          json: async () => ({ id: 'l1', name: 'New Lead', email: 'test@test.com' }),
        } as Response);

        const adapter = new CrmAdapter({ baseUrl });
        const result = await adapter.createLead({ name: 'New Lead', email: 'test@test.com' });
        expect(result.success).toBe(true);
      });
    });

    describe('StudioAdapter', () => {
      it('deve listar projetos', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => [{ id: 'p1', name: 'Project 1', status: 'active' }],
        } as Response);

        const adapter = new StudioAdapter({ baseUrl });
        const result = await adapter.listProjects();
        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
      });
    });

    describe('VoxAdapter', () => {
      it('deve iniciar transcrição', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
          json: async () => ({ id: 't1', status: 'pending' }),
        } as Response);

        const adapter = new VoxAdapter({ baseUrl });
        const result = await adapter.transcribe({ audio_url: 'https://example.com/audio.mp3' });
        expect(result.success).toBe(true);
      });

      it('deve retornar erro para URL inválida', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Invalid URL'));

        const adapter = new VoxAdapter({ baseUrl });
        const result = await adapter.transcribe({ audio_url: 'invalid-url' });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Adapter Response Helpers', () => {
    it('createSuccessResponse deve marcar como sucesso', () => {
      const result = createSuccessResponse({ id: '1' }, 'test', 10);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1' });
      expect(result.service).toBe('test');
      expect(result.durationMs).toBe(10);
    });

    it('createErrorResponse deve marcar como erro', () => {
      const result = createErrorResponse('TEST_ERROR', 'Something went wrong', 'test');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('TEST_ERROR');
      expect(result.error?.message).toBe('Something went wrong');
    });
  });
});
