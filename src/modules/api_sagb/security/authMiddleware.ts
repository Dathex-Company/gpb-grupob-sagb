import { ApiScope, AuthContext } from './auth.types';
import type { AuditEntry } from '../audit/audit.types';

const isProduction = () => ['production', 'prod'].includes(String(process.env.SAGB_ENV || process.env.NODE_ENV || '').toLowerCase());

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

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
 * Configuração para validação de API Key via Supabase.
 * As variáveis de ambiente são carregadas em runtime.
 */
function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || 'http://localhost:54321',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  };
}

/**
 * Valida uma API Key consultando a tabela `api_keys` no Supabase.
 *
 * A chave (`X-API-Key`) é comparada contra registros na tabela via
 * consulta REST anônima (protegida por RLS) ou via service_role em
 * contexto de função serverless.
 *
 * Expects: apiKeys com prefixo `sgb_` (sandbox) ou `sgp_` (production).
 */
export async function validateApiKey(apiKey: string): Promise<AuthContext> {
  if (!apiKey) {
    throw new UnauthorizedError('API Key is required');
  }

  // Mock apenas em desenvolvimento/teste. Produção sempre consulta key_hash.
  if (apiKey === 'sgb_sandbox_test_key') {
    if (isProduction()) {
      throw new UnauthorizedError('Mock API Key is not allowed in production');
    }
    return {
      clientId: 'client_test_001',
      environment: 'sandbox',
      scopes: ['system:read', 'system:write', 'events:read', 'events:write'],
      requestId: crypto.randomUUID(),
    };
  }

  try {
    // Consulta a tabela api_keys via REST do Supabase
    const { url, serviceKey } = getSupabaseConfig();
    const keyHash = await sha256Hex(apiKey);
    const response = await fetch(
      `${url}/rest/v1/api_keys?key_hash=eq.${encodeURIComponent(keyHash)}&select=id,key_hash,client_id,environment,scopes,active,client_name,expires_at,revoked_at`,
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new UnauthorizedError('Failed to validate API Key');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new UnauthorizedError('Invalid API Key');
    }

    const keyRecord = data[0];

    if (keyRecord.active === false) {
      throw new UnauthorizedError('API Key is inactive');
    }

    if (keyRecord.revoked_at) {
      throw new UnauthorizedError('API Key is revoked');
    }

    if (keyRecord.expires_at && new Date(keyRecord.expires_at).getTime() <= Date.now()) {
      throw new UnauthorizedError('API Key is expired');
    }

    return {
      clientId: keyRecord.client_id,
      environment: keyRecord.environment || 'production',
      scopes: keyRecord.scopes || [],
      requestId: crypto.randomUUID(),
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    // Erro de conectividade com Supabase — falha segura
    throw new UnauthorizedError('Unable to validate API Key');
  }
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
