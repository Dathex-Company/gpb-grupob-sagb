/**
 * API SagB - Router (TypeScript)
 *
 * Roteador interno usado para testes e desenvolvimento local.
 * A função Netlify (api-sagb-router.mjs) é a versão compilada para produção.
 */

import { AuthContext } from '../security/auth.types';
import { ApiRequest, ApiResponse, matchParams } from './endpoints.types';
import { validateApiKey } from '../security/authMiddleware';
import { createRequestContext, extractRequestId, calculateDuration } from '../audit/requestContext';
import { AuditLogger } from '../audit/auditLogger';

// Handlers
import { handleHealth } from './health.handler';
import { handleListNotifications, handleSendNotification } from './taskzei/taskzei.handler';
import { handleListLeads, handleCreateLead, handleUpdateLead, handleGetLead } from './crm/crm.handler';
import { handleListProjects, handleGetProject } from './studio/studio.handler';
import { handleTranscribe, handleGetTranscription, handleListTranscriptions } from './vox/vox.handler';

interface RouteEntry {
  method: string;
  pattern: string;
  handler: (request: ApiRequest, auth: AuthContext) => Promise<ApiResponse>;
}

/**
 * Tabela de roteamento: method + pattern => handler
 */
const routeTable: RouteEntry[] = [
  // Health
  { method: 'GET', pattern: '/v1/health', handler: handleHealth },

  // TaskZei
  { method: 'GET', pattern: '/v1/taskzei/notifications', handler: handleListNotifications },
  { method: 'POST', pattern: '/v1/taskzei/notifications', handler: handleSendNotification },

  // CRM
  { method: 'GET', pattern: '/v1/crm/leads', handler: handleListLeads },
  { method: 'POST', pattern: '/v1/crm/leads', handler: handleCreateLead },
  { method: 'PUT', pattern: '/v1/crm/leads/:id', handler: handleUpdateLead },
  { method: 'GET', pattern: '/v1/crm/leads/:id', handler: handleGetLead },

  // Studio
  { method: 'GET', pattern: '/v1/studio/projects', handler: handleListProjects },
  { method: 'GET', pattern: '/v1/studio/projects/:id', handler: handleGetProject },

  // Vox
  { method: 'POST', pattern: '/v1/vox/transcriptions', handler: handleTranscribe },
  { method: 'GET', pattern: '/v1/vox/transcriptions/:id', handler: handleGetTranscription },
  { method: 'GET', pattern: '/v1/vox/transcriptions', handler: handleListTranscriptions },
];

export interface RouterResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Processa uma requisição HTTP contra a tabela de roteamento.
 * Útil para testes unitários e ambientes serverless.
 */
export async function dispatchRequest(
  method: string,
  path: string,
  headers: Record<string, string | string[] | undefined>,
  body: unknown,
  query: Record<string, string>,
): Promise<RouterResult> {
  const startTime = Date.now();
  const requestId = extractRequestId(headers) || crypto.randomUUID();

  const authContext = createRequestContext({
    requestId,
    clientId: 'anonymous',
    environment: process.env.SAGB_ENV || 'production',
    scopes: [],
  });

  try {
    // --- Autenticação ---
    const apiKey =
      (typeof headers['x-api-key'] === 'string' ? headers['x-api-key'] : undefined) ||
      (typeof headers['X-API-Key'] === 'string' ? headers['X-API-Key'] : undefined);

    if (!apiKey) {
      return buildRouterResult(401, { error: { code: 'UNAUTHORIZED', message: 'API Key is required' } }, requestId, startTime);
    }

    const auth = await validateApiKey(apiKey);
    authContext.clientId = auth.clientId;
    authContext.environment = auth.environment;
    authContext.scopes = auth.scopes;

    // --- Roteamento ---
    const normalizedPath = path.replace(/^\/api-sagb/, '') || '/';

    let matchedRoute: RouteEntry | null = null;
    let params: Record<string, string> = {};

    for (const route of routeTable) {
      if (route.method !== method) continue;
      const matched = matchParams(normalizedPath, route.pattern);
      if (matched) {
        matchedRoute = route;
        params = matched;
        break;
      }
    }

    if (!matchedRoute) {
      return buildRouterResult(404, { error: { code: 'NOT_FOUND', message: `Route ${method} ${normalizedPath} not found` } }, requestId, startTime);
    }

    // --- Montagem do request ---
    const apiRequest: ApiRequest = {
      method,
      path: normalizedPath,
      params,
      query,
      headers,
      body,
      requestId,
    };

    // --- Execução do handler ---
    const response = await matchedRoute.handler(apiRequest, auth);

    // --- Log de auditoria ---
    const duration = calculateDuration(startTime);
    const auditLogger = AuditLogger.getInstance();
    auditLogger.log({
      request_id: requestId,
      client_id: authContext.clientId,
      environment: authContext.environment,
      method,
      path: normalizedPath,
      scopes: authContext.scopes,
      status_code: response.statusCode,
      ip_address: typeof headers['client-ip'] === 'string' ? headers['client-ip'] : undefined,
      user_agent: typeof headers['user-agent'] === 'string' ? headers['user-agent'] : undefined,
      duration_ms: duration,
      created_at: new Date().toISOString(),
    });

    // --- Resposta ---
    return buildRouterResult(response.statusCode, response.body, requestId, startTime, response.headers);
  } catch (error) {
    const duration = calculateDuration(startTime);
    console.error(`[API-SagB Router] Error: ${(error as Error).message}`, { requestId, duration });
    return buildRouterResult(500, { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, requestId, startTime);
  }
}

/**
 * Constrói o resultado padronizado do roteador.
 */
function buildRouterResult(
  statusCode: number,
  body: unknown,
  requestId: string,
  startTime: number,
  extraHeaders?: Record<string, string>,
): RouterResult {
  const duration = calculateDuration(startTime);
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
      'X-Response-Time': `${duration}ms`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}
