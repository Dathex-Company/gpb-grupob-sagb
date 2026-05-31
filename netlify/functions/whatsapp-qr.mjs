import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

const SESSIONS = new Map();
const API_KEY = process.env.HUB_WHATSAPP_QR_API_KEY || '';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://sagb.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

const log = (scope, data = {}) => {
  try {
    console.log(`[WhatsAppQR][${scope}]`, JSON.stringify(data));
  } catch {
    console.log(`[WhatsAppQR][${scope}]`, data);
  }
};

const emitObs = (eventName, payload = {}) => {
  log('obs', {
    eventName,
    timestamp: new Date().toISOString(),
    workspaceId: 'default',
    channel: 'whatsapp',
    method: 'whatsapp_qr',
    ...payload,
  });
};

async function ensureSession(sessionId = 'default') {
  log('ensureSession:start', {
    sessionId,
    hasSessionInMap: SESSIONS.has(sessionId),
    mapSize: SESSIONS.size,
  });

  if (SESSIONS.has(sessionId)) return SESSIONS.get(sessionId);

  const { state, saveCreds } = await useMultiFileAuthState(`/tmp/baileys-${sessionId}`);
  const { version } = await fetchLatestBaileysVersion();

  log('ensureSession:authState', {
    sessionId,
    authPath: `/tmp/baileys-${sessionId}`,
    version,
  });

  const session = {
    id: sessionId,
    status: 'initializing',
    qr: null,
    qrDataUrl: null,
    lastError: null,
    socket: null,
    connectedAccount: null,
    updatedAt: new Date().toISOString(),
    inboundMessages: [],
  };

  const sock = makeWASocket({ version, auth: state, printQRInTerminal: false });
  session.socket = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect } = update;
    const code = lastDisconnect?.error?.output?.statusCode;

    log('connection.update', {
      sessionId,
      connection,
      hasQr: Boolean(qr),
      disconnectCode: code ?? null,
      disconnectError: lastDisconnect?.error ? String(lastDisconnect.error) : null,
    });

    if (qr) {
      session.qr = qr;
      session.qrDataUrl = await qrcode.toDataURL(qr);
      session.status = 'qr_ready';
      session.updatedAt = new Date().toISOString();

      emitObs('qr_generated', {
        sessionId,
        status: 'awaiting_scan',
      });

      log('connection.qr_ready', {
        sessionId,
        qrLength: qr?.length || 0,
      });
    }

    if (connection === 'open') {
      session.status = 'connected';
      session.qr = null;
      session.qrDataUrl = null;
      session.connectedAccount = sock?.user?.id || null;
      session.updatedAt = new Date().toISOString();

      emitObs('qr_scanned', {
        sessionId,
        status: 'connected',
      });
      emitObs('session_ready', {
        sessionId,
        status: 'connected',
      });

      log('connection.open', {
        sessionId,
        status: session.status,
      });
    }

    if (connection === 'close') {
      if (code === DisconnectReason.loggedOut) {
        session.status = 'logged_out';
      } else {
        session.status = 'disconnected';
      }
      session.lastError = JSON.stringify({
        reasonCode: code ?? null,
        error: String(lastDisconnect?.error || 'closed'),
        at: new Date().toISOString(),
      });
      session.updatedAt = new Date().toISOString();

      emitObs('session_lost', {
        sessionId,
        status: session.status,
        errorCode: String(code ?? 'unknown'),
        errorMessage: String(lastDisconnect?.error || 'closed'),
      });

      log('connection.close', {
        sessionId,
        status: session.status,
        lastError: session.lastError,
      });
    }
  });

  // ─────────── Inbound Message Handler (Baileys) ───────────
  sock.ev.on('messages.upsert', async ({ messages: newMessages, type }) => {
    if (type !== 'notify') return; // only process new real-time messages

    for (const msg of newMessages) {
      // Skip messages sent by us
      if (msg.key?.fromMe) continue;
      if (!msg.message) continue;

      // Extract text content from various message types
      let content = '';
      if (msg.message.conversation) {
        content = msg.message.conversation;
      } else if (msg.message.extendedTextMessage?.text) {
        content = msg.message.extendedTextMessage.text;
      } else if (msg.message.imageMessage?.caption) {
        content = `[Imagem] ${msg.message.imageMessage.caption || ''}`;
      } else if (msg.message.videoMessage?.caption) {
        content = `[Vídeo] ${msg.message.videoMessage.caption || ''}`;
      } else if (msg.message.audioMessage) {
        content = msg.message.audioMessage.ptt ? '[Áudio]' : '[Voz]';
      } else if (msg.message.documentMessage) {
        content = `[Documento] ${msg.message.documentMessage.fileName || ''}`;
      } else {
        content = `[${Object.keys(msg.message)[0] || 'unknown'}]`;
      }

      const remoteJid = msg.key.remoteJid || '';
      // Skip group messages for now (only handle 1-on-1)
      if (remoteJid.endsWith('@g.us')) continue;

      const inboundMsg = {
        id: crypto.randomUUID(),
        source: 'whatsapp',
        from: remoteJid,
        fromName: msg.pushName || remoteJid.split('@')[0] || '',
        content,
        mediaUrl: null,
        externalId: msg.key.id || `baileys-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId: remoteJid,
        integrationId: 'int_waba_qr_01',
        workspaceId: 'default',
        receivedAt: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000).toISOString(),
        status: 'pending',
        metadata: {
          direction: 'inbound',
          sessionId,
          source: 'baileys_qr',
        },
      };

      session.inboundMessages.push(inboundMsg);

      // Persist to Supabase for durability across cold starts
      try {
        await supabase.from('hub_inbox_messages').insert({
          id: inboundMsg.id,
          source: inboundMsg.source,
          from: inboundMsg.from,
          from_name: inboundMsg.fromName,
          content: inboundMsg.content,
          external_id: inboundMsg.externalId,
          conversation_id: inboundMsg.conversationId,
          integration_id: inboundMsg.integrationId,
          workspace_id: inboundMsg.workspaceId,
          received_at: inboundMsg.receivedAt,
          status: inboundMsg.status,
          metadata: inboundMsg.metadata,
        });
      } catch (e) {
        console.warn('[QR] Supabase persist failed (table may not exist):', e.message);
      }

      console.log(`[QR Inbound] De ${inboundMsg.from}: "${inboundMsg.content.slice(0, 80)}"`);
    }
  });

  SESSIONS.set(sessionId, session);
  return session;
}

async function destroySession(sessionId = 'default', reason = 'manual') {
  const session = SESSIONS.get(sessionId);
  if (!session) return;

  log('destroySession:start', { sessionId, reason, status: session.status });

  if (session?.socket) {
    try { await session.socket.logout(); } catch { /* ignore */ }
    try { session.socket.end(); } catch { /* ignore */ }
  }

  SESSIONS.delete(sessionId);
  log('destroySession:done', { sessionId, reason, mapSize: SESSIONS.size });
}

function isAuthorized(event) {
  if (!API_KEY) return true;
  const incoming = event.headers?.['x-api-key'] || event.headers?.['X-API-Key'];
  return incoming === API_KEY;
}

export async function handler(event) {
  log('handler.request', {
    method: event.httpMethod,
    path: event.path,
    hasApiKeyHeader: Boolean(event.headers?.['x-api-key'] || event.headers?.['X-API-Key']),
  });

  if (!isAuthorized(event)) {
    log('handler.unauthorized', {
      path: event.path,
    });
    return json(401, { ok: false, error: 'unauthorized' });
  }

  const route = event.path || '';
  const method = event.httpMethod;
  const sessionId = event.queryStringParameters?.sessionId || 'default';

  if (method === 'POST' && route.endsWith('/connect')) {
    const existing = SESSIONS.get(sessionId);

    // Se sessão existente estiver desconectada/logged_out, força reset para evitar estado corrompido
    if (existing && (existing.status === 'disconnected' || existing.status === 'logged_out')) {
      await destroySession(sessionId, `reconnect_from_${existing.status}`);
    }

    const session = await ensureSession(sessionId);
    emitObs('session_connecting', {
      sessionId,
      status: session.status,
    });
    log('route.connect', {
      sessionId,
      status: session.status,
      hasQrDataUrl: Boolean(session.qrDataUrl),
    });
    return json(200, {
      ok: true,
      sessionId,
      status: session.status,
      qrDataUrl: session.qrDataUrl,
      connectedAccount: session.connectedAccount || null,
      updatedAt: session.updatedAt,
    });
  }

  if (method === 'GET' && route.endsWith('/status')) {
    const session = SESSIONS.get(sessionId);
    log('route.status', {
      sessionId,
      exists: Boolean(session),
      status: session?.status || 'not_initialized',
      hasQrDataUrl: Boolean(session?.qrDataUrl),
      lastError: session?.lastError || null,
    });
    if (!session) return json(200, { ok: true, sessionId, status: 'not_initialized' });
    return json(200, {
      ok: true,
      sessionId,
      status: session.status,
      qrDataUrl: session.qrDataUrl,
      lastError: session.lastError,
      connectedAccount: session.connectedAccount || null,
      updatedAt: session.updatedAt,
    });
  }

  if (method === 'POST' && route.endsWith('/send')) {
    const session = SESSIONS.get(sessionId);
    log('route.send:start', {
      sessionId,
      hasSession: Boolean(session),
      status: session?.status || null,
    });
    if (!session?.socket || session.status !== 'connected') {
      emitObs('provider_fallback_used', {
        sessionId,
        status: session?.status || 'not_initialized',
        errorCode: 'session_not_connected',
        errorMessage: 'Tentativa de envio sem sessão conectada',
      });
      log('route.send:blocked', {
        sessionId,
        reason: 'session_not_connected',
      });
      return json(400, { ok: false, error: 'session_not_connected' });
    }

    const body = JSON.parse(event.body || '{}');
    const to = body.to;
    const message = body.message;
    if (!to || !message) return json(400, { ok: false, error: 'to_and_message_required' });

    const jid = to.includes('@s.whatsapp.net') ? to : `${to.replace(/\D/g, '')}@s.whatsapp.net`;
    let result;
    try {
      result = await session.socket.sendMessage(jid, { text: message });
    } catch (err) {
      emitObs('message_send_failed', {
        sessionId,
        status: 'failure',
        errorCode: 'send_failed',
        errorMessage: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
    log('route.send:success', {
      sessionId,
      jid,
      messageId: result?.key?.id || null,
    });
    return json(200, { ok: true, messageId: result?.key?.id || null });
  }

  if (method === 'GET' && route.endsWith('/inbox')) {
    const session = SESSIONS.get(sessionId);
    if (!session) return json(200, { ok: true, messages: [] });
    return json(200, {
      ok: true,
      messages: session.inboundMessages,
    });
  }

  if (method === 'POST' && route.endsWith('/logout')) {
    const session = SESSIONS.get(sessionId);
    log('route.logout:start', {
      sessionId,
      hasSession: Boolean(session),
      status: session?.status || null,
    });
    await destroySession(sessionId, 'logout_route');

    log('route.logout:done', {
      sessionId,
      mapSize: SESSIONS.size,
    });

    return json(200, { ok: true, sessionId, status: 'logged_out' });
  }

  if (method === 'POST' && route.endsWith('/reset')) {
    await destroySession(sessionId, 'explicit_reset_route');
    const session = await ensureSession(sessionId);

    return json(200, {
      ok: true,
      sessionId,
      status: session.status,
      qrDataUrl: session.qrDataUrl,
      reset: true,
    });
  }

  if (method === 'GET' && route.endsWith('/health')) {
    return json(200, {
      ok: true,
      activeSessions: SESSIONS.size,
      sessions: Array.from(SESSIONS.keys()).map((id) => ({
        id,
        status: SESSIONS.get(id)?.status || 'unknown',
        inboundCount: SESSIONS.get(id)?.inboundMessages?.length || 0,
      })),
    });
  }

  return json(404, { ok: false, error: 'route_not_found' });
}
