import { AuthContext } from '../security/auth.types';

/**
 * Interface padrão para todos os handlers de endpoint da API SagB.
 */
export interface ApiHandler<T = unknown> {
  (request: ApiRequest, auth: AuthContext): Promise<ApiResponse<T>>;
}

export interface ApiRequest {
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  requestId: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
}

/**
 * Cria uma resposta de sucesso padronizada.
 */
export function ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    statusCode: 200,
    body: meta ? ({ data, meta } as unknown as T) : data,
    headers: { 'X-Request-Id': '' },
  };
}

/**
 * Cria uma resposta de criação padronizada.
 */
export function created<T>(data: T): ApiResponse<T> {
  return {
    statusCode: 201,
    body: data,
    headers: { 'X-Request-Id': '' },
  };
}

/**
 * Cria uma resposta de erro padronizada.
 */
export function apiError(statusCode: number, code: string, message: string, details?: string[]): ApiResponse {
  return {
    statusCode,
    body: {
      error: { code, message, details },
    },
    headers: { 'X-Request-Id': '' },
  };
}

/**
 * Parseia os parâmetros de path de uma rota.
 * Ex: matchParams('/v1/taskzei/notifications/123', '/v1/taskzei/notifications/:id') => { id: '123' }
 */
export function matchParams(route: string, pattern: string): Record<string, string> | null {
  const routeParts = route.split('/');
  const patternParts = pattern.split('/');

  if (routeParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = routeParts[i];
    } else if (patternParts[i] !== routeParts[i]) {
      return null;
    }
  }
  return params;
}
