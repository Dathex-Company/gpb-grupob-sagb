/**
 * API SagB - Official v1 Serverless Router (Netlify)
 *
 * Borda oficial versionada em /api-sagb/v1 para sistemas, módulos,
 * integrações, Hub de Integrações e WhatsApp Cloud API oficial da Meta.
 *
 * Segurança: API Key com SHA-256 em api_keys.key_hash, escopos por rota,
 * CORS por ambiente, auditoria persistente e logs sem secrets.
 */

import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const API_VERSION = '1.1.1';
const MODULE_NAME = 'api-sagb';
const DEFAULT_ENVIRONMENT = process.env.SAGB_ENV || process.env.CONTEXT || process.env.NODE_ENV || 'production';
const IS_PRODUCTION = ['production', 'prod'].includes(String(DEFAULT_ENVIRONMENT).toLowerCase());
const SIGNATURE_BYPASS_ENVIRONMENTS = new Set(['development', 'dev', 'test', 'sandbox']);
const SUPABASE_URL = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WHATSAPP_API_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || 'v20.0';
const WHATSAPP_GRAPH_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;
const ROUTER_BASE = '/api-sagb';

const SENSITIVE_HEADER_NAMES = new Set([
  'authorization',
  'x-api-key',
  'apikey',
  'cookie',
  'set-cookie',
  'x-supabase-auth',
  'x-hub-signature',
  'x-hub-signature-256',
]);

const PROVIDERS = [
  'whatsapp',
  'clickup',
  'gmail',
  'titan',
  'meta_facebook',
  'google_calendar',
  'supabase',
];

const ROUTE_TABLE = [
  { method: 'GET', pattern: '/v1/health', handler: 'health', scopes: ['system:read'], public: false },
  { method: 'GET', pattern: '/v1/status', handler: 'status', scopes: ['system:read'], public: false },

  { method: 'POST', pattern: '/v1/events', handler: 'createEvent', scopes: ['events:write'], public: false },
  { method: 'GET', pattern: '/v1/events', handler: 'listEvents', scopes: ['events:read'], public: false },
  { method: 'GET', pattern: '/v1/events/:id', handler: 'getEvent', scopes: ['events:read'], public: false },

  { method: 'GET', pattern: '/v1/integrations', handler: 'listIntegrations', scopes: ['integrations:read'], public: false },
  { method: 'GET', pattern: '/v1/integrations/:provider/status', handler: 'getIntegrationStatus', scopes: ['integrations:read'], public: false },
  { method: 'POST', pattern: '/v1/integrations/:provider/actions', handler: 'executeIntegrationAction', scopes: ['integrations:execute'], public: false },
  { method: 'GET', pattern: '/v1/integrations/actions/:actionId', handler: 'getIntegrationAction', scopes: ['integrations:read'], public: false },

  { method: 'GET', pattern: '/v1/integrations/whatsapp/webhook', handler: 'verifyWhatsAppWebhook', scopes: ['whatsapp:webhook'], public: true },
  { method: 'POST', pattern: '/v1/integrations/whatsapp/webhook', handler: 'receiveWhatsAppWebhook', scopes: ['whatsapp:webhook'], public: true },
  { method: 'POST', pattern: '/v1/integrations/whatsapp/send-message', handler: 'sendWhatsAppMessage', scopes: ['whatsapp:send'], public: false },
  { method: 'GET', pattern: '/v1/integrations/whatsapp/conversations', handler: 'listWhatsAppConversations', scopes: ['whatsapp:read'], public: false },
  { method: 'GET', pattern: '/v1/integrations/whatsapp/conversations/:id/messages', handler: 'listWhatsAppConversationMessages', scopes: ['whatsapp:read', 'messages:read'], public: false },

  { method: 'GET', pattern: '/v1/taskzei/notifications', handler: 'legacyProxy', scopes: ['system:read'], upstream: process.env.TASKZEI_API_URL, upstreamPath: '/notifications', public: false },
  { method: 'POST', pattern: '/v1/taskzei/notifications', handler: 'legacyProxy', scopes: ['system:write'], upstream: process.env.TASKZEI_API_URL, upstreamPath: '/notifications', public: false },
  { method: 'GET', pattern: '/v1/crm/leads', handler: 'legacyProxy', scopes: ['crm:read'], upstream: process.env.CRM_API_URL, upstreamPath: '/leads', public: false },
  { method: 'POST', pattern: '/v1/crm/leads', handler: 'legacyProxy', scopes: ['crm:write'], upstream: process.env.CRM_API_URL, upstreamPath: '/leads', public: false },
  { method: 'PUT', pattern: '/v1/crm/leads/:id', handler: 'legacyProxy', scopes: ['crm:write'], upstream: process.env.CRM_API_URL, upstreamPath: '/leads/:id', public: false },
  { method: 'GET', pattern: '/v1/crm/leads/:id', handler: 'legacyProxy', scopes: ['crm:read'], upstream: process.env.CRM_API_URL, upstreamPath: '/leads/:id', public: false },
  { method: 'GET', pattern: '/v1/studio/projects', handler: 'legacyProxy', scopes: ['system:read'], upstream: process.env.STUDIO_API_URL, upstreamPath: '/projects', public: false },
  { method: 'GET', pattern: '/v1/studio/projects/:id', handler: 'legacyProxy', scopes: ['system:read'], upstream: process.env.STUDIO_API_URL, upstreamPath: '/projects/:id', public: false },
  { method: 'POST', pattern: '/v1/vox/transcriptions', handler: 'legacyProxy', scopes: ['messages:write'], upstream: process.env.VOX_API_URL, upstreamPath: '/transcriptions', public: false },
  { method: 'GET', pattern: '/v1/vox/transcriptions/:id', handler: 'legacyProxy', scopes: ['messages:read'], upstream: process.env.VOX_API_URL, upstreamPath: '/transcriptions/:id', public: false },
  { method: 'GET', pattern: '/v1/vox/transcriptions', handler: 'legacyProxy', scopes: ['messages:read'], upstream: process.env.VOX_API_URL, upstreamPath: '/transcriptions', public: false },
];

export async function handler(event) {
  const startTime = Date.now();
  const requestId = randomUUID();
  const method = String(event.httpMethod || 'GET').toUpperCase();
  const path = normalizePath(event.path || '/');
  const query = event.queryStringParameters || {};
  const origin = getHeader(event.headers, 'origin');
  let auth = null;
  let route = null;
  let params = {};
  let body = null;
  const rawBody = getRawBody(event.body, Boolean(event.isBase64Encoded));

  if (method === 'OPTIONS') {
    return buildResponse(204, null, { requestId, startTime, origin });
  }

  try {
    const match = matchRoute(method, path);
    route = match.route;
    params = match.params;

    if (!route) {
      const result = errorResult(404, 'NOT_FOUND', `Route ${method} ${path} not found`);
      await auditSafe({ event, requestId, startTime, route, auth, result, action: 'route.not_found' });
      return buildResponse(result.statusCode, result.body, { requestId, startTime, origin });
    }

    body = safeParseBody(rawBody, getHeader(event.headers, 'content-type'));
    if (body?.__parseError) {
      const result = errorResult(400, 'INVALID_JSON', 'Request body must be valid JSON');
      await auditSafe({ event, requestId, startTime, route, auth, result, action: 'request.invalid_body' });
      return buildResponse(result.statusCode, result.body, { requestId, startTime, origin });
    }

    if (!route.public) {
      const apiKey = extractApiKey(event.headers || {});
      if (!apiKey) {
        const result = errorResult(401, 'UNAUTHORIZED', 'API Key is required');
        await auditSafe({ event, requestId, startTime, route, auth, result, action: 'auth.missing' });
        return buildResponse(result.statusCode, result.body, { requestId, startTime, origin });
      }

      auth = await validateApiKey(apiKey);
      if (!auth.valid) {
        const result = errorResult(401, 'UNAUTHORIZED', auth.error || 'Invalid API Key');
        await auditSafe({ event, requestId, startTime, route, auth, result, action: 'auth.invalid' });
        return buildResponse(result.statusCode, result.body, { requestId, startTime, origin });
      }

      const scopeError = checkScopes(auth.scopes, route.scopes || []);
      if (scopeError) {
        const result = errorResult(403, 'FORBIDDEN', scopeError);
        await auditSafe({ event, requestId, startTime, route, auth, result, action: 'auth.forbidden' });
        return buildResponse(result.statusCode, result.body, { requestId, startTime, origin });
      }
    }

    const result = await executeHandler(route, {
      event,
      method,
      path,
      params,
      query,
      body,
      headers: event.headers || {},
      maskedHeaders: maskHeaders(event.headers || {}),
      rawBody,
      auth,
      requestId,
      startTime,
    });

    await auditSafe({ event, requestId, startTime, route, auth, result, action: route.handler, provider: params.provider });
    return buildResponse(result.statusCode, result.body, { requestId, startTime, origin, extraHeaders: result.headers });
  } catch (error) {
    console.error('[API-SagB Router] error', sanitizeLogObject({ requestId, method, path, message: error?.message }));
    const result = errorResult(500, 'INTERNAL_ERROR', 'Internal server error');
    await auditSafe({ event, requestId, startTime, route, auth, result, action: 'runtime.error', errorCode: 'INTERNAL_ERROR' });
    return buildResponse(result.statusCode, result.body, { requestId, startTime, origin });
  }
}

async function executeHandler(route, context) {
  switch (route.handler) {
    case 'health':
      return ok({ status: 'ok', version: API_VERSION, timestamp: new Date().toISOString(), module: MODULE_NAME });
    case 'status':
      return getStatus(context);
    case 'createEvent':
      return createEvent(context);
    case 'listEvents':
      return listEvents(context);
    case 'getEvent':
      return getEvent(context);
    case 'listIntegrations':
      return listIntegrations(context);
    case 'getIntegrationStatus':
      return getIntegrationStatus(context);
    case 'executeIntegrationAction':
      return executeIntegrationAction(context);
    case 'getIntegrationAction':
      return getIntegrationAction(context);
    case 'verifyWhatsAppWebhook':
      return verifyWhatsAppWebhook(context);
    case 'receiveWhatsAppWebhook':
      return receiveWhatsAppWebhook(context);
    case 'sendWhatsAppMessage':
      return sendWhatsAppMessage(context);
    case 'listWhatsAppConversations':
      return listWhatsAppConversations(context);
    case 'listWhatsAppConversationMessages':
      return listWhatsAppConversationMessages(context);
    case 'legacyProxy':
      return legacyProxy(route, context);
    default:
      return errorResult(500, 'INTERNAL_ERROR', `Unknown handler: ${route.handler}`);
  }
}

async function getStatus() {
  const supabase = await supabaseHealth();
  const providerStatuses = Object.fromEntries(await Promise.all(PROVIDERS.map(async (provider) => [provider, await providerStatus(provider)])));
  const readyProviders = Object.values(providerStatuses).filter((status) => status.status === 'ready' || status.status === 'configured').length;
  return ok({
    status: supabase.status === 'ok' ? 'ok' : 'degraded',
    version: API_VERSION,
    module: MODULE_NAME,
    environment: DEFAULT_ENVIRONMENT,
    timestamp: new Date().toISOString(),
    supabase,
    hub: {
      status: readyProviders > 0 ? 'partially_configured' : 'driver_pending',
      role: 'connectors_credentials_external_execution',
      providers: PROVIDERS,
      note: 'API validates/authenticates/audits. Hub owns providers and credentials. Some provider actions remain pending by driver/credentials.',
    },
    providers: providerStatuses,
    whatsapp: providerStatuses.whatsapp,
  });
}

async function createEvent({ body, auth, requestId }) {
  const validation = validateEventPayload(body);
  if (validation) return errorResult(400, 'VALIDATION_ERROR', validation);

  const row = {
    id: randomUUID(),
    request_id: requestId,
    client_id: auth?.clientId || null,
    event_type: body.event_type,
    source_type: body.source?.type,
    source_id: body.source?.id,
    context_type: body.context?.type || null,
    context_id: body.context?.id || null,
    resource_type: body.resource?.type || null,
    resource_id: body.resource?.id || null,
    payload: sanitizePayload(body.payload || {}),
    metadata: sanitizePayload(body.metadata || {}),
    created_at: new Date().toISOString(),
  };

  const inserted = await supabaseInsert('api_events', row);
  if (!inserted.ok) return errorResult(502, 'SUPABASE_ERROR', 'Failed to persist event');
  return { statusCode: 201, body: { event: inserted.data?.[0] || row } };
}

async function listEvents({ query }) {
  const params = new URLSearchParams({ select: '*', order: 'created_at.desc', limit: clampLimit(query.limit, 50, 100) });
  if (query.event_type) params.set('event_type', `eq.${query.event_type}`);
  if (query.source_type) params.set('source_type', `eq.${query.source_type}`);
  if (query.context_id) params.set('context_id', `eq.${query.context_id}`);
  const result = await supabaseRequest('api_events', { query: params });
  if (!result.ok) return errorResult(502, 'SUPABASE_ERROR', 'Failed to list events');
  return ok({ events: result.data || [] });
}

async function getEvent({ params }) {
  const query = new URLSearchParams({ select: '*', id: `eq.${params.id}`, limit: '1' });
  const result = await supabaseRequest('api_events', { query });
  if (!result.ok) return errorResult(502, 'SUPABASE_ERROR', 'Failed to read event');
  if (!result.data?.length) return errorResult(404, 'NOT_FOUND', 'Event not found');
  return ok({ event: result.data[0] });
}

async function listIntegrations() {
  return ok({
    providers: await Promise.all(PROVIDERS.map(async (provider) => ({ provider, ...(await providerStatus(provider)) }))),
    hub: {
      status: 'available',
      execution: 'api_validates_authorizes_audits_hub_executes_supabase_records',
    },
  });
}

async function getIntegrationStatus({ params }) {
  if (!PROVIDERS.includes(params.provider)) return errorResult(404, 'PROVIDER_NOT_FOUND', 'Provider not registered');
  return ok({ provider: params.provider, ...(await providerStatus(params.provider)) });
}

async function executeIntegrationAction({ params, body, requestId, auth }) {
  if (!PROVIDERS.includes(params.provider)) return errorResult(404, 'PROVIDER_NOT_FOUND', 'Provider not registered');
  if (!body || typeof body !== 'object') return errorResult(400, 'VALIDATION_ERROR', 'Action payload is required');

  const actionId = randomUUID();
  const startedAt = Date.now();
  const action = String(body.action || '').trim();
  if (!action) return errorResult(400, 'VALIDATION_ERROR', 'action is required');

  const pendingRow = {
    id: actionId,
    provider: params.provider,
    action,
    status: 'running',
    request_id: requestId,
    client_id: auth?.clientId || null,
    payload: sanitizePayload(body.payload || {}),
    created_at: new Date().toISOString(),
  };
  await supabaseInsert('integration_logs', pendingRow);

  try {
    const result = await executeHubProviderAction(params.provider, action, body.payload || {}, { requestId });
    const completed = {
      status: 'success',
      response: sanitizePayload(result),
      duration_ms: Date.now() - startedAt,
    };
    await supabasePatch('integration_logs', new URLSearchParams({ id: `eq.${actionId}` }), completed);
    return { statusCode: 202, body: { actionId, provider: params.provider, action, status: 'success', result } };
  } catch (error) {
    const errorPayload = {
      status: 'failure',
      error_code: 'HUB_ACTION_FAILED',
      error_message: safeErrorMessage(error),
      duration_ms: Date.now() - startedAt,
    };
    await supabasePatch('integration_logs', new URLSearchParams({ id: `eq.${actionId}` }), errorPayload);
    return errorResult(502, 'HUB_ACTION_FAILED', safeErrorMessage(error));
  }
}

async function getIntegrationAction({ params }) {
  const query = new URLSearchParams({ select: '*', id: `eq.${params.actionId}`, limit: '1' });
  const result = await supabaseRequest('integration_logs', { query });
  if (!result.ok) return errorResult(502, 'SUPABASE_ERROR', 'Failed to read action');
  if (!result.data?.length) return errorResult(404, 'NOT_FOUND', 'Action not found');
  return ok({ action: result.data[0] });
}

async function verifyWhatsAppWebhook({ query, requestId }) {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];
  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || '';

  if (!expectedToken) return errorResult(503, 'WHATSAPP_NOT_CONFIGURED', 'WhatsApp verify token is not configured');
  if (mode === 'subscribe' && constantTimeEquals(String(token || ''), expectedToken) && challenge) {
    await recordIntegrationEvent('whatsapp', 'webhook.verify.success', { requestId });
    return { statusCode: 200, body: String(challenge), headers: { 'Content-Type': 'text/plain' } };
  }
  await recordIntegrationEvent('whatsapp', 'webhook.verify.denied', { requestId });
  return errorResult(403, 'FORBIDDEN', 'Invalid WhatsApp webhook verification token');
}

async function receiveWhatsAppWebhook({ body, rawBody, headers, requestId }) {
  const signatureValidation = validateMetaWebhookSignature(rawBody, headers || {});
  if (!signatureValidation.valid) {
    await recordIntegrationEvent('whatsapp', 'webhook.signature.denied', {
      requestId,
      reason: signatureValidation.reason,
      signature_present: signatureValidation.signaturePresent,
    });
    return errorResult(signatureValidation.statusCode, signatureValidation.code, signatureValidation.message);
  }

  if (!body || typeof body !== 'object' || body.object !== 'whatsapp_business_account' || !Array.isArray(body.entry)) {
    return errorResult(400, 'VALIDATION_ERROR', 'Invalid Meta WhatsApp webhook payload');
  }

  const sanitizedRaw = sanitizePayload(body);
  await supabaseInsert('whatsapp_webhook_events', {
    id: randomUUID(),
    provider: 'whatsapp',
    event_type: 'meta.webhook.received',
    raw_payload_sanitized: sanitizedRaw,
    normalized_payload: normalizeWhatsAppWebhook(body),
    processed: false,
    created_at: new Date().toISOString(),
  });

  const normalized = normalizeWhatsAppWebhook(body);
  for (const contact of normalized.contacts) await upsertWhatsAppContact(contact);
  for (const message of normalized.messages) await persistWhatsAppMessage(message, requestId);
  for (const status of normalized.statuses) await persistWhatsAppStatus(status);

  await recordIntegrationEvent('whatsapp', 'webhook.received', { requestId, messages: normalized.messages.length, statuses: normalized.statuses.length });
  return ok({ received: true, messages: normalized.messages.length, statuses: normalized.statuses.length });
}

async function sendWhatsAppMessage({ body, requestId, auth }) {
  const to = String(body?.to || '').trim();
  const type = String(body?.type || 'text');
  const text = body?.text?.body || body?.message || body?.text;
  if (!to) return errorResult(400, 'VALIDATION_ERROR', 'to is required');
  if (type === 'text' && !text) return errorResult(400, 'VALIDATION_ERROR', 'text body is required for text messages');

  const result = await executeHubProviderAction('whatsapp', 'send-message', { to, type, text, template: body?.template, media: body?.media }, { requestId });
  const providerMessageId = result?.messages?.[0]?.id || result?.messageId || randomUUID();
  const contact = await upsertWhatsAppContact({ phone: to, wa_id: to, name: body?.contact_name || null, source: 'api_send' });
  const conversationId = await upsertWhatsAppConversation(contact?.id, 'api_outbound');
  await supabaseInsert('whatsapp_messages', {
    id: randomUUID(),
    conversation_id: conversationId,
    contact_id: contact?.id || null,
    provider_message_id: providerMessageId,
    direction: 'outbound',
    type,
    text: type === 'text' ? String(text) : null,
    payload: sanitizePayload(body || {}),
    status: 'sent',
    sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });
  await supabaseInsert('whatsapp_delivery_status', {
    id: randomUUID(),
    provider_message_id: providerMessageId,
    status: 'sent',
    timestamp: new Date().toISOString(),
    raw_payload_sanitized: sanitizePayload({ source: 'api_send_initial_status' }),
    created_at: new Date().toISOString(),
  });
  await supabaseInsert('integration_logs', {
    id: randomUUID(),
    provider: 'whatsapp',
    action: 'send-message',
    status: 'success',
    request_id: requestId,
    client_id: auth?.clientId || null,
    response: sanitizePayload({ providerMessageId }),
    created_at: new Date().toISOString(),
  });
  return { statusCode: 202, body: { provider: 'whatsapp', status: 'sent', providerMessageId, result: sanitizePayload(result) } };
}

async function listWhatsAppConversations({ query }) {
  const params = new URLSearchParams({ select: '*,whatsapp_contacts(*)', order: 'last_message_at.desc', limit: clampLimit(query.limit, 50, 100) });
  const result = await supabaseRequest('whatsapp_conversations', { query: params });
  if (!result.ok) return errorResult(502, 'SUPABASE_ERROR', 'Failed to list WhatsApp conversations');
  return ok({ conversations: result.data || [] });
}

async function listWhatsAppConversationMessages({ params, query }) {
  const qs = new URLSearchParams({ select: '*', conversation_id: `eq.${params.id}`, order: 'created_at.asc', limit: clampLimit(query.limit, 100, 200) });
  const result = await supabaseRequest('whatsapp_messages', { query: qs });
  if (!result.ok) return errorResult(502, 'SUPABASE_ERROR', 'Failed to list WhatsApp messages');
  return ok({ messages: result.data || [] });
}

async function legacyProxy(route, { method, query, body, params, auth }) {
  if (!route.upstream) return errorResult(501, 'UPSTREAM_NOT_CONFIGURED', 'Legacy upstream is not configured');
  const upstreamPath = Object.entries(params || {}).reduce((acc, [key, value]) => acc.replace(`:${key}`, encodeURIComponent(value)), route.upstreamPath);
  const url = new URL(`${String(route.upstream).replace(/\/$/, '')}${upstreamPath}`);
  Object.entries(query || {}).forEach(([key, value]) => { if (value !== undefined && value !== null) url.searchParams.set(key, String(value)); });

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': auth?.clientId || '',
      'X-SagB-API-Version': API_VERSION,
    },
    body: body ? JSON.stringify(sanitizePayload(body)) : undefined,
  });
  const data = await readResponseBody(response);
  if (!response.ok) return { statusCode: 502, body: { error: { code: 'UPSTREAM_ERROR', message: 'Upstream service error', details: sanitizePayload(data) } } };
  return { statusCode: response.status, body: data };
}

async function executeHubProviderAction(provider, action, payload, { requestId }) {
  if (provider === 'whatsapp' && ['send-message', 'send_message'].includes(action)) {
    // Temporary pre-production bridge: the Hub owns provider credentials/driver boundaries,
    // while this serverless router performs the Meta Cloud API call until a server-safe Hub
    // driver can be imported without browser/localStorage dependencies.
    return callWhatsAppCloudApi(payload, requestId);
  }
  if (provider === 'supabase' && action === 'health') return supabaseHealth();
  if (provider === 'clickup' || provider === 'gmail' || provider === 'titan' || provider === 'meta_facebook' || provider === 'google_calendar') {
    throw new Error(`Provider ${provider} is registered in Hub but action ${action} requires provider credentials/driver configuration`);
  }
  throw new Error(`Unsupported provider action: ${provider}.${action}`);
}

async function callWhatsAppCloudApi(payload, requestId) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  if (!accessToken || !phoneNumberId) throw new Error('WhatsApp Cloud API is not configured');
  const type = String(payload.type || 'text');
  const metaPayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: payload.to,
    type,
    ...(type === 'text' ? { text: { preview_url: false, body: String(payload.text || '') } } : {}),
    ...(type === 'template' ? { template: payload.template } : {}),
    ...(payload.media && ['image', 'audio', 'video', 'document'].includes(type) ? { [type]: payload.media } : {}),
  };
  const response = await fetch(`${WHATSAPP_GRAPH_BASE_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
    },
    body: JSON.stringify(metaPayload),
  });
  const data = await readResponseBody(response);
  if (!response.ok) {
    await recordIntegrationEvent('whatsapp', 'send.error', { requestId, status: response.status, data: sanitizePayload(data) });
    throw new Error(`Meta Cloud API error (${response.status})`);
  }
  await recordIntegrationEvent('whatsapp', 'send.success', { requestId, data: sanitizePayload(data) });
  return data;
}

function normalizeWhatsAppWebhook(payload) {
  const contacts = [];
  const messages = [];
  const statuses = [];
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      for (const contact of value.contacts || []) {
        contacts.push({ phone: contact.wa_id, wa_id: contact.wa_id, name: contact.profile?.name || null, source: 'meta_webhook' });
      }
      for (const msg of value.messages || []) {
        const contact = (value.contacts || []).find((c) => c.wa_id === msg.from);
        messages.push({
          provider_message_id: msg.id,
          from: msg.from,
          wa_id: msg.from,
          contact_name: contact?.profile?.name || null,
          direction: 'inbound',
          type: msg.type,
          text: msg.text?.body || null,
          timestamp: msg.timestamp ? new Date(Number(msg.timestamp) * 1000).toISOString() : new Date().toISOString(),
          payload: sanitizePayload(msg),
        });
      }
      for (const status of value.statuses || []) {
        statuses.push({
          provider_message_id: status.id,
          status: status.status,
          recipient_id: status.recipient_id,
          timestamp: status.timestamp ? new Date(Number(status.timestamp) * 1000).toISOString() : new Date().toISOString(),
          payload: sanitizePayload(status),
        });
      }
    }
  }
  return { contacts, messages, statuses };
}

async function persistWhatsAppMessage(message, requestId) {
  const contact = await upsertWhatsAppContact({ phone: message.from, wa_id: message.wa_id, name: message.contact_name, source: 'meta_webhook' });
  const conversationId = await upsertWhatsAppConversation(contact?.id, 'whatsapp_cloud');
  await supabaseInsert('whatsapp_messages', {
    id: randomUUID(),
    conversation_id: conversationId,
    contact_id: contact?.id || null,
    provider_message_id: message.provider_message_id,
    direction: message.direction,
    type: message.type,
    text: message.text,
    payload: message.payload,
    status: 'received',
    received_at: message.timestamp,
    created_at: new Date().toISOString(),
  });
  await supabaseInsert('api_events', {
    id: randomUUID(),
    request_id: requestId,
    client_id: 'meta_whatsapp_webhook',
    event_type: 'whatsapp.message.received',
    source_type: 'integration',
    source_id: 'whatsapp',
    context_type: 'conversation',
    context_id: conversationId,
    resource_type: 'whatsapp_message',
    resource_id: message.provider_message_id,
    payload: message.payload,
    metadata: { direction: message.direction },
    created_at: new Date().toISOString(),
  });
}

async function persistWhatsAppStatus(status) {
  await supabaseInsert('whatsapp_delivery_status', {
    id: randomUUID(),
    provider_message_id: status.provider_message_id,
    status: status.status,
    timestamp: status.timestamp,
    raw_payload_sanitized: status.payload,
    created_at: new Date().toISOString(),
  });
}

async function upsertWhatsAppContact(input) {
  const existing = await supabaseRequest('whatsapp_contacts', { query: new URLSearchParams({ select: '*', wa_id: `eq.${input.wa_id || input.phone}`, limit: '1' }) });
  if (existing.ok && existing.data?.[0]) {
    await supabasePatch('whatsapp_contacts', new URLSearchParams({ id: `eq.${existing.data[0].id}` }), { name: input.name || existing.data[0].name, updated_at: new Date().toISOString() });
    return existing.data[0];
  }
  const row = { id: randomUUID(), phone: input.phone, name: input.name || null, wa_id: input.wa_id || input.phone, source: input.source || 'api', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  await supabaseInsert('whatsapp_contacts', row);
  return row;
}

async function upsertWhatsAppConversation(contactId, origin) {
  if (!contactId) return null;
  const existing = await supabaseRequest('whatsapp_conversations', { query: new URLSearchParams({ select: '*', contact_id: `eq.${contactId}`, limit: '1' }) });
  if (existing.ok && existing.data?.[0]) {
    await supabasePatch('whatsapp_conversations', new URLSearchParams({ id: `eq.${existing.data[0].id}` }), { last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    return existing.data[0].id;
  }
  const id = randomUUID();
  await supabaseInsert('whatsapp_conversations', { id, contact_id: contactId, status: 'open', origin, last_message_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return id;
}

async function validateApiKey(apiKey) {
  if (isMockApiKeyAllowed() && isDevMockKey(apiKey)) {
    const mockScopes = String(apiKey).includes('limited')
      ? ['system:read']
      : [
          'system:read', 'system:write', 'api:read', 'api:write', 'api:audit:read',
          'events:read', 'events:write', 'integrations:read', 'integrations:execute', 'integrations:admin',
          'whatsapp:read', 'whatsapp:write', 'whatsapp:webhook', 'whatsapp:send', 'whatsapp:admin',
          'crm:read', 'crm:write', 'messages:read', 'messages:write',
        ];
    return {
      valid: true,
      keyId: 'dev-mock-key',
      clientId: 'client_sandbox_mock',
      environment: 'sandbox',
      scopes: mockScopes,
    };
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { valid: false, error: 'Auth service unavailable' };
  const keyHash = sha256Hex(apiKey);
  let data = await findApiKeyByHash(keyHash);
  if (!data?.length && isMockApiKeyAllowed() && isDevMockKey(apiKey)) data = await findApiKeyByHash(apiKey);
  if (!data?.length) return { valid: false, error: 'Invalid API Key' };
  const key = data[0];
  if (!constantTimeEquals(String(key.key_hash), String(keyHash)) && (IS_PRODUCTION || !isDevMockKey(apiKey))) return { valid: false, error: 'Invalid API Key' };
  if (key.active === false || key.revoked_at) return { valid: false, error: 'Invalid API Key' };
  if (key.expires_at && new Date(key.expires_at).getTime() <= Date.now()) return { valid: false, error: 'Invalid API Key' };
  await supabasePatch('api_keys', new URLSearchParams({ id: `eq.${key.id}` }), { last_used_at: new Date().toISOString() });
  return { valid: true, keyId: key.id, clientId: key.client_id, environment: key.environment || DEFAULT_ENVIRONMENT, scopes: key.scopes || [] };
}

async function findApiKeyByHash(hash) {
  const query = new URLSearchParams({ select: 'id,key_hash,client_id,environment,scopes,active,expires_at,last_used_at,metadata', key_hash: `eq.${hash}`, limit: '1' });
  const result = await supabaseRequest('api_keys', { query });
  return result.ok ? result.data : [];
}

function extractApiKey(headers) {
  const raw = getHeader(headers, 'x-api-key') || getHeader(headers, 'authorization');
  if (!raw) return null;
  return String(raw).startsWith('Bearer ') ? String(raw).slice(7).trim() : String(raw).trim();
}

function checkScopes(clientScopes = [], requiredScopes = []) {
  if (!requiredScopes.length) return null;
  const hasAll = requiredScopes.every((scope) => clientScopes.includes(scope));
  return hasAll ? null : `Insufficient scopes. Required: ${requiredScopes.join(', ')}`;
}

async function auditSafe({ event, requestId, startTime, route, auth, result, action, provider, errorCode }) {
  try {
    const path = normalizePath(event.path || '/');
    const entry = {
      request_id: requestId,
      client_id: auth?.clientId || (route?.public ? 'public_webhook' : 'anonymous'),
      actor_id: auth?.clientId || null,
      actor_type: route?.public ? 'provider' : 'api_client',
      environment: DEFAULT_ENVIRONMENT,
      method: String(event.httpMethod || 'GET').toUpperCase(),
      path,
      scopes: route?.scopes || [],
      status_code: result.statusCode,
      error_code: errorCode || result.body?.error?.code || null,
      duration_ms: Date.now() - startTime,
      ip_hash: sha256Hex(getHeader(event.headers, 'client-ip') || getHeader(event.headers, 'x-forwarded-for') || ''),
      user_agent_hash: sha256Hex(getHeader(event.headers, 'user-agent') || ''),
      resource_type: inferResourceType(path),
      resource_id: null,
      action,
      provider: provider || inferProvider(path),
      created_at: new Date().toISOString(),
    };
    await supabaseInsert('api_audit_log', entry, { silent: true });
  } catch (error) {
    console.error('[API-SagB] audit write failed', sanitizeLogObject({ requestId, message: error?.message }));
  }
}

async function recordIntegrationEvent(provider, eventType, metadata) {
  await supabaseInsert('integration_events', { id: randomUUID(), provider, event_type: eventType, metadata: sanitizePayload(metadata || {}), created_at: new Date().toISOString() }, { silent: true });
}

async function supabaseHealth() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { status: 'not_configured', configured: false };
  const result = await supabaseRequest('api_keys', { query: new URLSearchParams({ select: 'id', limit: '1' }) });
  return { status: result.ok ? 'ok' : 'error', configured: true, error_code: result.ok ? null : result.status };
}

async function providerStatus(provider) {
  const catalog = {
    whatsapp: {
      driver: 'temporary_router_cloud_api_bridge',
      required: ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VERIFY_TOKEN', 'META_APP_SECRET'],
      configured: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_VERIFY_TOKEN && process.env.META_APP_SECRET),
      partial: Boolean(process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_VERIFY_TOKEN || process.env.META_APP_SECRET),
    },
    clickup: {
      driver: 'hub_clickup_driver_available_frontend_service',
      required: ['CLICKUP_API_TOKEN or HUB_CLICKUP_API_TOKEN'],
      configured: Boolean(process.env.CLICKUP_API_TOKEN || process.env.HUB_CLICKUP_API_TOKEN),
      partial: false,
    },
    gmail: {
      driver: 'hub_email_driver_available_frontend_service',
      required: ['GMAIL_CLIENT_ID or HUB_GMAIL_REFRESH_TOKEN'],
      configured: Boolean(process.env.GMAIL_CLIENT_ID || process.env.HUB_GMAIL_REFRESH_TOKEN),
      partial: false,
    },
    titan: {
      driver: 'hub_email_driver_available_frontend_service',
      required: ['TITAN_API_KEY or TITAN_SMTP_HOST'],
      configured: Boolean(process.env.TITAN_API_KEY || process.env.TITAN_SMTP_HOST),
      partial: false,
    },
    meta_facebook: {
      driver: 'driver_pending',
      required: ['META_APP_ID', 'META_APP_SECRET'],
      configured: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
      partial: Boolean(process.env.META_APP_ID || process.env.META_APP_SECRET),
    },
    google_calendar: {
      driver: 'driver_pending',
      required: ['GOOGLE_CALENDAR_CLIENT_ID or GOOGLE_CLIENT_ID'],
      configured: Boolean(process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID),
      partial: false,
    },
    supabase: {
      driver: 'rest_persistence',
      required: ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'],
      configured: Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY),
      partial: Boolean(SUPABASE_URL || SUPABASE_SERVICE_KEY),
    },
  }[provider];
  if (!catalog) return { status: 'unavailable', configured: false, secrets_exposed: false };
  const status = catalog.configured
    ? (catalog.driver === 'driver_pending' ? 'driver_pending' : 'configured')
    : catalog.partial
      ? 'partially_configured'
      : (catalog.driver === 'driver_pending' ? 'driver_pending' : 'missing_credentials');
  return {
    status,
    configured: Boolean(catalog.configured),
    driver: catalog.driver,
    required_env: catalog.required,
    secrets_exposed: false,
  };
}

async function supabaseRequest(table, { method = 'GET', query, body } = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { ok: false, status: 503, data: null };
  try {
    const qs = query ? `?${query.toString()}` : '';
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${qs}`, {
      method,
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await readResponseBody(response);
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('[API-SagB] supabase request failed', sanitizeLogObject({ table, method, message: error?.message }));
    return { ok: false, status: 500, data: null };
  }
}

function supabaseInsert(table, body, options = {}) { return supabaseRequest(table, { method: 'POST', body }).then((result) => { if (!result.ok && !options.silent) console.error('[API-SagB] insert failed', sanitizeLogObject({ table, status: result.status })); return result; }); }
function supabasePatch(table, query, body) { return supabaseRequest(table, { method: 'PATCH', query, body }); }

function matchRoute(method, path) {
  const parts = path.split('/').filter(Boolean);
  for (const route of ROUTE_TABLE) {
    if (route.method !== method) continue;
    const patternParts = route.pattern.split('/').filter(Boolean);
    if (parts.length !== patternParts.length) continue;
    const params = {};
    let match = true;
    for (let i = 0; i < patternParts.length; i += 1) {
      if (patternParts[i].startsWith(':')) params[patternParts[i].slice(1)] = decodeURIComponent(parts[i]);
      else if (patternParts[i] !== parts[i]) { match = false; break; }
    }
    if (match) return { route, params };
  }
  return { route: null, params: {} };
}

function normalizePath(rawPath) {
  const path = String(rawPath || '/').replace(/^\/\.netlify\/functions\/api-sagb-router/, '').replace(new RegExp(`^${ROUTER_BASE}`), '') || '/';
  return path.startsWith('/v1') ? path : path.replace(/^\/api-sagb/, '') || '/';
}

function getRawBody(rawBody, isBase64Encoded) {
  if (!rawBody) return null;
  return isBase64Encoded ? Buffer.from(rawBody, 'base64').toString('utf8') : String(rawBody);
}

function safeParseBody(body, contentType) {
  if (!body) return null;
  if (String(contentType || '').includes('application/json')) {
    try { return JSON.parse(body); } catch { return { __parseError: true }; }
  }
  try { return JSON.parse(body); } catch { return body; }
}

async function readResponseBody(response) {
  const text = await response.text();
  if (!text) return null;
  if (response.headers.get('content-type')?.includes('application/json')) {
    try { return JSON.parse(text); } catch { return text; }
  }
  try { return JSON.parse(text); } catch { return text; }
}

function buildResponse(statusCode, body, { requestId, startTime, origin, extraHeaders = {} }) {
  const contentType = extraHeaders['Content-Type'] || 'application/json';
  return {
    statusCode,
    headers: {
      'Content-Type': contentType,
      'X-Request-Id': requestId,
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-API-Version': API_VERSION,
      'Access-Control-Allow-Origin': resolveCorsOrigin(origin),
      'Vary': 'Origin',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization, X-Request-Id, X-Hub-Signature-256',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Max-Age': '86400',
      ...extraHeaders,
    },
    body: body == null ? '' : contentType.includes('application/json') ? JSON.stringify(body) : String(body),
  };
}

function resolveCorsOrigin(origin) {
  const allowed = String(process.env.API_SAGB_ALLOWED_ORIGINS || process.env.CORS_ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (!origin) return allowed[0] || (IS_PRODUCTION ? 'https://sagb.grupob.com.br' : '*');
  if (!IS_PRODUCTION && !allowed.length) return origin;
  return allowed.includes(origin) ? origin : (allowed[0] || 'https://sagb.grupob.com.br');
}

function ok(body) { return { statusCode: 200, body }; }
function errorResult(statusCode, code, message, details) { return { statusCode, body: { error: { code, message, ...(details ? { details } : {}) } } }; }
function sha256Hex(value) { return createHash('sha256').update(String(value || ''), 'utf8').digest('hex'); }
function getHeader(headers = {}, name) { const found = Object.keys(headers || {}).find((key) => key.toLowerCase() === name.toLowerCase()); return found ? headers[found] : undefined; }
function constantTimeEquals(a, b) { const left = Buffer.from(String(a)); const right = Buffer.from(String(b)); return left.length === right.length && timingSafeEqual(left, right); }
function isDevMockKey(apiKey) { return String(apiKey || '').startsWith('sgb_sandbox_') || String(apiKey || '') === 'sgb_sandbox_test_key'; }
function isMockApiKeyAllowed() { return SIGNATURE_BYPASS_ENVIRONMENTS.has(String(DEFAULT_ENVIRONMENT).toLowerCase()); }
function isWebhookSignatureBypassAllowed() { return SIGNATURE_BYPASS_ENVIRONMENTS.has(String(DEFAULT_ENVIRONMENT).toLowerCase()); }
function clampLimit(value, fallback, max) { const n = Number(value || fallback); return String(Math.min(Math.max(Number.isFinite(n) ? n : fallback, 1), max)); }
function safeErrorMessage(error) { return String(error?.message || 'Unknown error').replace(/Bearer\s+[A-Za-z0-9._~+\-/]+=*/g, 'Bearer [REDACTED]'); }

function validateMetaWebhookSignature(rawBody, headers) {
  const appSecret = process.env.META_APP_SECRET || '';
  const signature = getHeader(headers, 'x-hub-signature-256') || '';
  const signaturePresent = Boolean(signature);

  if (!appSecret) {
    if (isWebhookSignatureBypassAllowed()) {
      return { valid: true, reason: 'bypass_non_production_no_app_secret', signaturePresent };
    }
    return {
      valid: false,
      statusCode: 503,
      code: 'WHATSAPP_SIGNATURE_NOT_CONFIGURED',
      message: 'WhatsApp webhook signature validation is not configured',
      reason: 'missing_meta_app_secret',
      signaturePresent,
    };
  }

  if (!signature || !String(signature).startsWith('sha256=')) {
    if (isWebhookSignatureBypassAllowed()) {
      return { valid: true, reason: 'bypass_non_production_missing_signature', signaturePresent };
    }
    return {
      valid: false,
      statusCode: 403,
      code: 'FORBIDDEN',
      message: 'Invalid WhatsApp webhook signature',
      reason: 'missing_signature',
      signaturePresent,
    };
  }

  const expected = `sha256=${createHmac('sha256', appSecret).update(String(rawBody || ''), 'utf8').digest('hex')}`;
  if (!constantTimeEquals(signature, expected)) {
    return {
      valid: false,
      statusCode: 403,
      code: 'FORBIDDEN',
      message: 'Invalid WhatsApp webhook signature',
      reason: 'signature_mismatch',
      signaturePresent,
    };
  }
  return { valid: true, reason: 'signature_valid', signaturePresent };
}

function validateEventPayload(body) {
  if (!body || typeof body !== 'object') return 'Payload is required';
  if (!body.event_type || typeof body.event_type !== 'string') return 'event_type is required';
  if (!body.source?.type || !body.source?.id) return 'source.type and source.id are required';
  if (!body.context?.type || !body.context?.id) return 'context.type and context.id are required';
  if (!body.resource?.type || !body.resource?.id) return 'resource.type and resource.id are required';
  return null;
}

function sanitizePayload(value) {
  if (Array.isArray(value)) return value.map(sanitizePayload);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [key, val] of Object.entries(value)) {
    const lower = key.toLowerCase();
    if (lower.includes('token') || lower.includes('secret') || lower.includes('key') || lower.includes('password') || lower.includes('authorization')) out[key] = '[REDACTED]';
    else out[key] = sanitizePayload(val);
  }
  return out;
}

function maskHeaders(headers) {
  return Object.fromEntries(Object.entries(headers || {}).map(([key, value]) => [key, SENSITIVE_HEADER_NAMES.has(key.toLowerCase()) ? '[REDACTED]' : value]));
}

function sanitizeLogObject(obj) { return sanitizePayload(obj); }
function inferProvider(path) { return PROVIDERS.find((provider) => path.includes(`/integrations/${provider}`)) || null; }
function inferResourceType(path) {
  if (path.includes('/events')) return 'api_event';
  if (path.includes('/integrations/whatsapp/conversations')) return 'whatsapp_conversation';
  if (path.includes('/integrations')) return 'integration';
  return 'system';
}
