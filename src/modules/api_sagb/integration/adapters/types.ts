import { CircuitBreaker } from '../circuitBreaker';
import { HttpClient } from '../httpClient';

/**
 * Configuração base para todos os adapters de integração.
 */
export interface AdapterConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

/**
 * Interface padrão que todos os adapters devem implementar.
 */
export interface IAdapter {
  readonly name: string;
  readonly httpClient: HttpClient;
  readonly circuitBreaker: CircuitBreaker;
  healthCheck(): Promise<{ status: string; service: string }>;
}

/**
 * Wrapper de resposta padronizada dos adapters.
 */
export interface AdapterResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
  service: string;
  durationMs: number;
  meta?: {
    source: string;
    duration_ms: number;
  };
}

/**
 * Cria uma resposta de sucesso padronizada.
 */
export function createSuccessResponse<T>(data: T, source: string, durationMs: number): AdapterResponse<T> {
  return {
    success: true,
    data,
    error: null,
    service: source,
    durationMs,
    meta: { source, duration_ms: durationMs },
  };
}

/**
 * Cria uma resposta de erro padronizada.
 */
export function createErrorResponse(code: string, message: string, source: string): AdapterResponse<null> {
  return {
    success: false,
    data: null,
    error: { code, message },
    service: source,
    durationMs: 0,
    meta: { source, duration_ms: 0 },
  };
}
