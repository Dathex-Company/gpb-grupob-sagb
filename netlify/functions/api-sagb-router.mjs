/**
 * API SagB - Router Serverless Function (Netlify)
 *
 * Roteador principal da API SagB.
 * Função auto-contida (sem imports TypeScript) para deploy direto na Netlify.
 *
 * Rotas expostas:
 *   GET    /api-sagb/v1/health
 *   GET    /api-sagb/v1/taskzei/notifications
 *   POST   /api-sagb/v1/taskzei/notifications
 *   GET    /api-sagb/v1/crm/leads
 *   POST   /api-sagb/v1/crm/leads
 *   PUT    /api-sagb/v1/crm/leads/:id
 *   GET    /api-sagb/v1/crm/leads/:id
 *   GET    /api-sagb/v1/studio/projects
 *   GET    /api-sagb/v1/studio/projects/:id
 *   POST   /api-sagb/v1/vox/transcriptions
 *   GET    /api-sagb/v1/vox/transcriptions/:id
 *   GET    /api-sagb/v1/vox/transcriptions
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zipliajeqyjdjockaght.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const CRM_API_URL = process.env.CRM_API_URL || 'http://localhost:4001';
const TASKZEI_API_URL = process.env.TASKZEI_API_URL || 'http://localhost:4002';
const STUDIO_API_URL = process.env.STUDIO_API_URL || 'http://localhost:4003';
const VOX_API_URL = process.env.VOX_API_URL || 'http://localhost:4004';

// ============================================================
//  Tabela de roteamento
// ============================================================

const ROUTE_TABLE = [
  { method: 'GET',    pattern: '/v1/health',                         handler: 'health' },
  { method: 'GET',    pattern: '/v1/taskzei/notifications',          handler: 'listNotifications' },
  { method: 'POST',   pattern: '/v1/taskzei/notifications',          handler: 'sendNotification' },
  { method: 'GET',    pattern: '/v1/crm/leads',                      handler: 'listLeads' },
  { method: 'POST',   pattern: '/v1/crm/leads',                      handler: 'createLead' },
  { method: 'PUT',    pattern: '/v1/crm/leads/:id',                  handler: 'updateLead' },
  { method: 'GET',    pattern: '/v1/crm/leads/:id',                  handler: 'getLead' },
  { method: 'GET',    pattern: '/v1/studio/projects',                handler: 'listProjects' },
  { method: 'GET',    pattern: '/v1/studio/projects/:id',            handler: 'getProject' },
  { method: 'POST',   pattern: '/v1/vox/transcriptions',             handler: 'transcribe' },
  { method: 'GET',    pattern: '/v1/vox/transcriptions/:id',         handler: 'getTranscription' },
  { method: 'GET',    pattern: '/v1/vox/transcriptions',             handler: 'listTranscriptions' },
];

// ============================================================
//  Handler principal da Netlify Function
// ============================================================

export async function handler(event, context) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    // --- CORS preflight ---
    if (event.httpMethod === 'OPTIONS') {
      return buildResponse(204, null, requestId, startTime);
    }

    // --- Autenticação ---
    const apiKey = extractApiKey(event.headers);
    if (!apiKey) {
      return buildResponse(401, { error: { code: 'UNAUTHORIZED', message: 'API Key is required' } }, requestId, startTime);
    }

    const auth = await validateApiKey(apiKey);
    if (!auth.valid) {
      return buildResponse(401, { error: { code: 'UNAUTHORIZED', message: auth.error || 'Invalid API Key' } }, requestId, startTime);
    }

    // --- Roteamento ---
    const method = event.httpMethod.toUpperCase();
    const path = (event.path || '').replace(/^\/api-sagb/, '') || '/';
    const query = event.queryStringParameters || {};
    const body = parseBody(event.body, event.headers['content-type']);

    const { route, params } = matchRoute(method, path);
    if (!route) {
      return buildResponse(404, { error: { code: 'NOT_FOUND', message: `Route ${method} ${path} not found` } }, requestId, startTime);
    }

    // --- Autorização (scopes) ---
    const requiredScopes = getRequiredScopes(route.handler);
    const scopeError = checkScopes(auth.scopes, requiredScopes);
    if (scopeError) {
      return buildResponse(403, { error: { code: 'FORBIDDEN', message: scopeError } }, requestId, startTime);
    }

    // --- Execução do handler ---
    const result = await executeHandler(route.handler, {
      method,
      path,
      params,
      query,
      headers: event.headers,
      body,
      auth,
      requestId,
    });

    // --- Auditoria (async, não bloqueante) ---
    logAudit({
      request_id: requestId,
      client_id: auth.clientId,
      environment: process.env.SAGB_ENV || 'production',
      method,
      path,
      scopes: auth.scopes,
      status_code: result.statusCode,
      ip_address: event.headers['client-ip'] || event.headers['x-forwarded-for'],
      user_agent: event.headers['user-agent'],
      duration_ms: Date.now() - startTime,
    }).catch(err => console.error('[API-SagB] Audit log error:', err));

    // --- Resposta ---
    return buildResponse(result.statusCode, result.body, requestId, startTime, result.headers);
  } catch (error) {
    console.error('[API-SagB Router] Error:', error.message, { requestId });
    return buildResponse(500, { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, requestId, startTime);
  }
}

// ============================================================
//  Funções auxiliares
// ============================================================

/**
 * Extrai a API Key dos headers.
 */
function extractApiKey(headers) {
  return headers['x-api-key'] || headers['X-API-Key'] || headers['x-api-key'] || null;
}

/**
 * Valida a API Key consultando o Supabase.
 */
async function validateApiKey(apiKey) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/api_keys?select=client_id,scopes,environment,active&api_key=eq.${encodeURIComponent(apiKey)}`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!response.ok) return { valid: false, error: 'Auth service unavailable' };

    const data = await response.json();
    if (!data || data.length === 0) return { valid: false, error: 'Invalid API Key' };

    const key = data[0];
    if (!key.active) return { valid: false, error: 'API Key is inactive' };

    return {
      valid: true,
      clientId: key.client_id,
      environment: key.environment || 'production',
      scopes: key.scopes || [],
    };
  } catch (error) {
    console.error('[API-SagB] Auth validation error:', error.message);
    return { valid: false, error: 'Auth service unavailable' };
  }
}

/**
 * Match de rota com suporte a parâmetros dinâmicos (:id).
 */
function matchRoute(method, path) {
  const parts = path.split('/').filter(Boolean);

  for (const route of ROUTE_TABLE) {
    if (route.method !== method) continue;

    const patternParts = route.pattern.split('/').filter(Boolean);
    if (parts.length !== patternParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = parts[i];
      } else if (patternParts[i] !== parts[i]) {
        match = false;
        break;
      }
    }

    if (match) return { route, params };
  }

  return { route: null, params: {} };
}

/**
 * Retorna os scopes necessários para cada handler.
 */
function getRequiredScopes(handlerName) {
  const scopeMap = {
    health: [],
    listNotifications: ['system:read'],
    sendNotification: ['system:write'],
    listLeads: ['agents:read'],
    createLead: ['agents:execute'],
    updateLead: ['agents:execute'],
    getLead: ['agents:read'],
    listProjects: ['system:read'],
    getProject: ['system:read'],
    transcribe: ['cid:write'],
    getTranscription: ['cid:read'],
    listTranscriptions: ['cid:read'],
  };
  return scopeMap[handlerName] || [];
}

/**
 * Verifica se o client possui os scopes necessários.
 */
function checkScopes(clientScopes, requiredScopes) {
  if (requiredScopes.length === 0) return null;
  for (const scope of requiredScopes) {
    if (!clientScopes.includes(scope)) {
      return `Insufficient scopes. Required: ${requiredScopes.join(', ')}`;
    }
  }
  return null;
}

/**
 * Executa o handler específico baseado no nome da rota.
 */
async function executeHandler(handlerName, context) {
  const { method, params, query, body, auth, requestId } = context;

  switch (handlerName) {
    // --- Health ---
    case 'health':
      return {
        statusCode: 200,
        body: {
          status: 'ok',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          module: 'api-sagb',
        },
      };

    // --- TaskZei ---
    case 'listNotifications':
      return proxyUpstream('GET', `${TASKZEI_API_URL}/notifications`, null, query, auth);

    case 'sendNotification':
      return proxyUpstream('POST', `${TASKZEI_API_URL}/notifications`, body, null, auth);

    // --- CRM ---
    case 'listLeads':
      return proxyUpstream('GET', `${CRM_API_URL}/leads`, null, query, auth);

    case 'createLead':
      return proxyUpstream('POST', `${CRM_API_URL}/leads`, body, null, auth);

    case 'updateLead':
      return proxyUpstream('PUT', `${CRM_API_URL}/leads/${params.id}`, body, null, auth);

    case 'getLead':
      return proxyUpstream('GET', `${CRM_API_URL}/leads/${params.id}`, null, null, auth);

    // --- Studio ---
    case 'listProjects':
      return proxyUpstream('GET', `${STUDIO_API_URL}/projects`, null, query, auth);

    case 'getProject':
      return proxyUpstream('GET', `${STUDIO_API_URL}/projects/${params.id}`, null, null, auth);

    // --- Vox ---
    case 'transcribe':
      return proxyUpstream('POST', `${VOX_API_URL}/transcriptions`, body, null, auth);

    case 'getTranscription':
      return proxyUpstream('GET', `${VOX_API_URL}/transcriptions/${params.id}`, null, null, auth);

    case 'listTranscriptions':
      return proxyUpstream('GET', `${VOX_API_URL}/transcriptions`, null, query, auth);

    default:
      return { statusCode: 500, body: { error: { code: 'INTERNAL_ERROR', message: `Unknown handler: ${handlerName}` } } };
  }
}

/**
 * Proxy de requisição para upstream service.
 */
async function proxyUpstream(method, url, body, query, auth) {
  try {
    const requestUrl = new URL(url);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value) requestUrl.searchParams.set(key, value);
      });
    }

    const response = await fetch(requestUrl.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': auth.apiKey || '',
        'X-Client-Id': auth.clientId || '',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = response.headers.get('content-type')?.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      statusCode: response.ok ? response.status : 502,
      body: response.ok ? data : { error: { code: 'UPSTREAM_ERROR', message: 'Upstream service error', details: data } },
    };
  } catch (error) {
    console.error(`[API-SagB] Upstream proxy error [${method} ${url}]:`, error.message);
    return { statusCode: 502, body: { error: { code: 'UPSTREAM_ERROR', message: error.message } } };
  }
}

/**
 * Registra entrada de auditoria no Supabase (fire-and-forget).
 */
async function logAudit(entry) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/api_audit_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify(entry),
    });
  } catch (error) {
    console.error('[API-SagB] Audit log write failed:', error.message);
  }
}

/**
 * Constrói a resposta HTTP padronizada.
 */
function buildResponse(statusCode, body, requestId, startTime, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : '',
  };
}

/**
 * Parse do body da requisição.
 */
function parseBody(body, contentType) {
  if (!body) return null;
  if (contentType && contentType.includes('application/json')) {
    try { return JSON.parse(body); } catch { return body; }
  }
  return body;
}
