import { ApiScope, AuthContext } from './auth.types';

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden: Insufficient scopes') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Módulo de validação de API Key.
 * Em um cenário real, deve conectar-se a um Redis ou Banco de Dados (Supabase)
 * para validar o hash da chave e carregar os escopos do cliente.
 */
export async function validateApiKey(apiKey: string): Promise<AuthContext> {
  if (!apiKey || !apiKey.startsWith('sgb_')) {
    throw new UnauthorizedError('Invalid API Key format');
  }

  // Mock implementation for structural foundation
  // TODO: Retrieve client and key details from database
  const isSandbox = apiKey.startsWith('sgb_sandbox_');
  
  if (apiKey === 'sgb_sandbox_test_key') {
    return {
      clientId: 'client_test_001',
      environment: 'sandbox',
      scopes: ['system:read', 'system:write'],
      requestId: crypto.randomUUID(),
    };
  }

  throw new UnauthorizedError('Invalid API Key');
}

/**
 * Middleware para checagem de escopos exigidos.
 */
export function requireScopes(context: AuthContext, requiredScopes: ApiScope[]): void {
  const hasAllScopes = requiredScopes.every(scope => context.scopes.includes(scope));
  
  if (!hasAllScopes) {
    throw new ForbiddenError(`Forbidden: Missing one or more required scopes: ${requiredScopes.join(', ')}`);
  }
}
