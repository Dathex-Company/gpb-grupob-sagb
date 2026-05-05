// Netlify Function: api-sagb-audit
// Descrição: Endpoint de auditoria para a API SagB - registra e consulta logs
// Caminho: /api/audit

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Request-Id': '',
};

export async function handler(event, context) {
  const requestId = event.headers['x-request-id'] || crypto.randomUUID();
  headers['X-Request-Id'] = requestId;

  const { httpMethod, path, queryStringParameters, body } = event;

  try {
    // Roteamento interno
    if (httpMethod === 'POST' && path.endsWith('/audit/log')) {
      return await handleLog(requestId, body);
    }

    if (httpMethod === 'GET' && path.endsWith('/audit/query')) {
      return await handleQuery(requestId, queryStringParameters);
    }

    if (httpMethod === 'GET' && path.endsWith('/audit/health')) {
      return json(200, { status: 'ok', requestId });
    }

    return json(404, {
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${httpMethod} ${path}`,
      },
    });
  } catch (error) {
    console.error('[AUDIT-FN] Error:', error);
    return json(500, {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
}

async function handleLog(requestId, rawBody) {
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(400, {
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid JSON body',
      },
    });
  }

  const { data, error } = await supabase.from('api_audit_log').insert({
    request_id: payload.request_id || requestId,
    client_id: payload.client_id,
    environment: payload.environment,
    method: payload.method,
    path: payload.path,
    scopes: payload.scopes || [],
    status_code: payload.status_code,
    ip_address: payload.ip_address,
    user_agent: payload.user_agent,
    duration_ms: payload.duration_ms,
  }).select('id');

  if (error) {
    console.error('[AUDIT-FN] Supabase insert error:', error);
    return json(500, {
      error: {
        code: 'DB_ERROR',
        message: 'Failed to persist audit entry',
      },
    });
  }

  return json(201, {
    data: { id: data[0]?.id, request_id: requestId },
    meta: { request_id: requestId },
  });
}

async function handleQuery(requestId, params) {
  let query = supabase.from('api_audit_log').select('*', { count: 'exact' });

  if (params?.client_id) query = query.eq('client_id', params.client_id);
  if (params?.method) query = query.eq('method', params.method);
  if (params?.status_code) query = query.eq('status_code', parseInt(params.status_code));
  if (params?.start_date) query = query.gte('created_at', params.start_date);
  if (params?.end_date) query = query.lte('created_at', params.end_date);

  const limit = parseInt(params?.limit || '50');
  const offset = parseInt(params?.offset || '0');

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit);

  const { data, error, count } = await query;

  if (error) {
    console.error('[AUDIT-FN] Supabase query error:', error);
    return json(500, {
      error: {
        code: 'DB_ERROR',
        message: 'Failed to query audit log',
      },
    });
  }

  return json(200, {
    data,
    meta: {
      total: count,
      limit,
      offset,
      has_more: (offset + limit) < count,
      request_id: requestId,
    },
  });
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { ...headers },
    body: JSON.stringify(payload),
  };
}
