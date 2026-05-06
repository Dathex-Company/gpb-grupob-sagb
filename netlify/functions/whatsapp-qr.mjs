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

async function ensureSession(sessionId = 'default') {
  if (SESSIONS.has(sessionId)) return SESSIONS.get(sessionId);

  const { state, saveCreds } = await useMultiFileAuthState(`/tmp/baileys-${sessionId}`);
  const { version } = await fetchLatestBaileysVersion();

  const session = {
    id: sessionId,
    status: 'initializing',
    qr: null,
    qrDataUrl: null,
    lastError: null,
    socket: null,
    inboundMessages: [],
  };

  const sock = makeWASocket({ version, auth: state, printQRInTerminal: false });
  session.socket = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect } = update;
    if (qr) {
      session.qr = qr;
      session.qrDataUrl = await qrcode.toDataURL(qr);
      session.status = 'qr_ready';
    }

    if (connection === 'open') {
      session.status = 'connected';
      session.qr = null;
      session.qrDataUrl = null;
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        session.status = 'logged_out';
      } else {
        session.status = 'disconnected';
      }
      session.lastError = String(lastDisconnect?.error || 'closed');
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

function isAuthorized(event) {
  if (!API_KEY) return true;
  const incoming = event.headers?.['x-api-key'] || event.headers?.['X-API-Key'];
  return incoming === API_KEY;
}

export async function handler(event) {
  if (!isAuthorized(event)) {
    return json(401, { ok: false, error: 'unauthorized' });
  }

  const route = event.path || '';
  const method = event.httpMethod;
  const sessionId = event.queryStringParameters?.sessionId || 'default';

  if (method === 'POST' && route.endsWith('/connect')) {
    const session = await ensureSession(sessionId);
    return json(200, {
      ok: true,
      sessionId,
      status: session.status,
      qrDataUrl: session.qrDataUrl,
    });
  }

  if (method === 'GET' && route.endsWith('/status')) {
    const session = SESSIONS.get(sessionId);
    if (!session) return json(200, { ok: true, sessionId, status: 'not_initialized' });
    return json(200, {
      ok: true,
      sessionId,
      status: session.status,
      qrDataUrl: session.qrDataUrl,
      lastError: session.lastError,
    });
  }

  if (method === 'POST' && route.endsWith('/send')) {
    const session = SESSIONS.get(sessionId);
    if (!session?.socket || session.status !== 'connected') {
      return json(400, { ok: false, error: 'session_not_connected' });
    }

    const body = JSON.parse(event.body || '{}');
    const to = body.to;
    const message = body.message;
    if (!to || !message) return json(400, { ok: false, error: 'to_and_message_required' });

    const jid = to.includes('@s.whatsapp.net') ? to : `${to.replace(/\D/g, '')}@s.whatsapp.net`;
    const result = await session.socket.sendMessage(jid, { text: message });
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
    if (session?.socket) {
      try { await session.socket.logout(); } catch { /* ignore */ }
      try { session.socket.end(); } catch { /* ignore */ }
    }
    SESSIONS.delete(sessionId);
    return json(200, { ok: true, sessionId, status: 'logged_out' });
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
