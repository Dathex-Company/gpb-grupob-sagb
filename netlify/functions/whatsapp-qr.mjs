import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';

const SESSIONS = new Map();
const API_KEY = process.env.HUB_WHATSAPP_QR_API_KEY || '';

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

  if (method === 'POST' && route.endsWith('/logout')) {
    const session = SESSIONS.get(sessionId);
    if (session?.socket) {
      try {
        await session.socket.logout();
      } catch {
        // ignore
      }
      try {
        session.socket.end();
      } catch {
        // ignore
      }
    }
    SESSIONS.delete(sessionId);
    return json(200, { ok: true, sessionId, status: 'logged_out' });
  }

  return json(404, { ok: false, error: 'route_not_found' });
}
