import { RequestContext } from './audit.types';

/**
 * Gera um UUID v4 para rastreamento de requisições.
 * Compatível com Node 18+ (crypto.randomUUID).
 */
function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para ambientes sem crypto.randomUUID (ex: alguns runtimes edge)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Cria o contexto de rastreamento para uma requisição.
 * Gera um X-Request-Id único se não fornecido externamente.
 */
export function createRequestContext(params: {
  clientId: string;
  environment: string;
  scopes: string[];
  requestId?: string;
}): RequestContext {
  return {
    requestId: params.requestId || generateRequestId(),
    clientId: params.clientId,
    environment: params.environment,
    scopes: params.scopes,
    startedAt: Date.now(),
  };
}

/**
 * Extrai o X-Request-Id dos headers da requisição, se presente.
 * Usado para propagação de tracing entre serviços.
 */
export function extractRequestId(headers: Record<string, string | string[] | undefined>): string | undefined {
  const requestId = headers['x-request-id'] || headers['X-Request-Id'];
  if (Array.isArray(requestId)) {
    return requestId[0];
  }
  return requestId as string | undefined;
}

/**
 * Calcula a duração da requisição em ms.
 * Aceita RequestContext (com propriedade startedAt) ou um timestamp numérico.
 */
export function calculateDuration(context: RequestContext | number): number {
  const startTime = typeof context === 'number' ? context : context.startedAt;
  if (startTime === undefined || startTime === null) return 0;
  return Date.now() - startTime;
}
