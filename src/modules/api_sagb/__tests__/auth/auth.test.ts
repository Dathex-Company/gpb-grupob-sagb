/**
 * Testes de autenticação e autorização.
 *
 * Verifica:
 * - Validação de API Key
 * - Verificação de escopos
 * - Erros de autorização (401, 403)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateApiKey, requireScopes, UnauthorizedError, ForbiddenError } from '../../security/authMiddleware';
import { AuthContext } from '../../security/auth.types';

describe('Auth Middleware', () => {
  describe('validateApiKey', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('deve rejeitar API Key vazia', async () => {
      await expect(validateApiKey('')).rejects.toThrow(UnauthorizedError);
    });

    it('deve rejeitar API Key inválida', async () => {
      // Simula falha na validação
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      } as Response);

      await expect(validateApiKey('invalid-key')).rejects.toThrow(UnauthorizedError);
    });

    it('deve aceitar API Key válida e retornar AuthContext', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [{
          client_id: 'client-123',
          environment: 'production',
          scopes: ['system:read', 'system:write'],
        }],
      } as Response;

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await validateApiKey('valid-key-123');
      expect(result).toBeDefined();
      expect(result.clientId).toBe('client-123');
      expect(result.environment).toBe('production');
      expect(result.scopes).toContain('system:read');
    });

    it('deve rejeitar API Key inativa', async () => {
      const mockResponse = {
        ok: true,
        json: async () => [{
          client_id: 'client-123',
          environment: 'production',
          scopes: ['system:read'],
          active: false,
        }],
      } as Response;

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await expect(validateApiKey('inactive-key')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('requireScopes', () => {
    const createContext = (scopes: string[]): AuthContext => ({
      clientId: 'test-client',
      apiKey: 'test-key',
      environment: 'test',
      scopes,
    });

    it('deve permitir acesso com scope correspondente', () => {
      const context = createContext(['system:read', 'system:write']);
      expect(() => requireScopes(context, ['system:read'])).not.toThrow();
    });

    it('deve permitir acesso com múltiplos scopes correspondentes', () => {
      const context = createContext(['system:read', 'system:write', 'agents:read']);
      expect(() => requireScopes(context, ['system:read', 'agents:read'])).not.toThrow();
    });

    it('deve lançar ForbiddenError quando scope não encontrado', () => {
      const context = createContext(['system:read']);
      expect(() => requireScopes(context, ['system:write'])).toThrow(ForbiddenError);
    });

    it('deve lançar ForbiddenError quando nenhum scope correspondente', () => {
      const context = createContext(['system:read']);
      expect(() => requireScopes(context, ['agents:read', 'cid:write'])).toThrow(ForbiddenError);
    });

    it('deve permitir quando lista de scopes requeridos é vazia', () => {
      const context = createContext([]);
      expect(() => requireScopes(context, [])).not.toThrow();
    });

    it('deve funcionar com scopes do tipo agents', () => {
      const context = createContext(['agents:execute']);
      expect(() => requireScopes(context, ['agents:execute'])).not.toThrow();
      expect(() => requireScopes(context, ['agents:read'])).toThrow(ForbiddenError);
    });

    it('deve funcionar com scopes do tipo cid', () => {
      const context = createContext(['cid:read', 'cid:write']);
      expect(() => requireScopes(context, ['cid:write'])).not.toThrow();
      expect(() => requireScopes(context, ['system:read'])).toThrow(ForbiddenError);
    });
  });
});
