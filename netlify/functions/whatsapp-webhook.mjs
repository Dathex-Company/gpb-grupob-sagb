/**
 * WhatsApp Webhook — Hub de Integrações SagB
 *
 * Requer @supabase/supabase-js instalado como dependência do projeto.
 *
 * Endpoint para receber webhooks da Meta Cloud API (WhatsApp Business).
 *
 * GET  /.netlify/functions/whatsapp-webhook  → Verificação do webhook (Meta challenge)
 * POST /.netlify/functions/whatsapp-webhook  → Recebimento de mensagens inbound
 */

// ─────────── Helpers ───────────

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
  process.env.SUPABASE_SERVICE_KEY || 'YOUR_SUPABASE_SERVICE_KEY'
);

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

const text = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-store',
  },
  body: String(body),
});

// ─────────── Webhook Verification (GET) ───────────

/**
 * Meta envia uma requisição GET para verificar o webhook:
 *   ?hub.mode=subscribe&hub.challenge=RANDOM&hub.verify_token=SEU_TOKEN
 *
 * O verify_token deve ser o mesmo configurado no painel da Meta.
 */
export async function handler(event) {
  if (event.httpMethod === 'GET') {
    return handleVerification(event);
  }

  if (event.httpMethod === 'POST') {
    return handleInbound(event);
  }

  return json(405, { ok: false, error: 'Method Not Allowed' });
}

async function handleVerification(event) {
  const mode = event.queryStringParameters?.['hub.mode'];
  const token = event.queryStringParameters?.['hub.verify_token'];
  const challenge = event.queryStringParameters?.['hub.challenge'];

  // O token de verificação esperado (configurado via env var)
  const expectedToken =
    process.env.MOCK_META_VERIFY_TOKEN ||
    process.env.HUB_WABA_VERIFY_TOKEN ||
    process.env.VITE_HUB_WABA_VERIFY_TOKEN ||
    'sagb_hub_verify_2026';

// Log the token source for debugging
if (!process.env.MOCK_META_VERIFY_TOKEN && !process.env.HUB_WABA_VERIFY_TOKEN && !process.env.VITE_HUB_WABA_VERIFY_TOKEN) {
  console.warn('[WhatsApp Webhook] Usando token de verificação padrão: sagb_hub_verify_2026');
} else if (process.env.MOCK_META_VERIFY_TOKEN) {
  console.log('[WhatsApp Webhook] Usando MOCK_META_VERIFY_TOKEN');
} else if (process.env.HUB_WABA_VERIFY_TOKEN) {
  console.log('[WhatsApp Webhook] Usando HUB_WABA_VERIFY_TOKEN');
} else if (process.env.VITE_HUB_WABA_VERIFY_TOKEN) {
  console.log('[WhatsApp Webhook] Usando VITE_HUB_WABA_VERIFY_TOKEN');
}

  if (mode === 'subscribe' && token === expectedToken && challenge) {
    console.log('[WhatsApp Webhook] Verificação bem-sucedida');
    // A Meta espera EXATAMENTE o valor de hub.challenge como resposta text/plain
    return text(200, challenge);
  }

  console.warn('[WhatsApp Webhook] Falha na verificação:', { mode, token, challenge });
  return json(403, { ok: false, error: 'Verification failed' });
}

// ─────────── Inbound Message Handler (POST) ───────────

async function handleInbound(event) {
  let payload;

  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body' });
  }

  // Confirma que é um webhook do WhatsApp
  if (payload.object !== 'whatsapp_business_account') {
    return json(200, { ok: true, status: 'ignored', reason: 'Not a WhatsApp event' });
  }

  try {
    // Processa as mensagens recebidas
    const messages = [];
    const statusUpdates = [];

    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        // Extrai mensagens de texto/mídia
        for (const msg of value.messages || []) {
          const contact = value.contacts?.find((c) => c.wa_id === msg.from);

          let content = '';
          let mediaUrl = null;

          if (msg.type === 'text' && msg.text?.body) {
            content = msg.text.body;
          } else if (['image', 'video', 'audio', 'document'].includes(msg.type)) {
            content = `[${msg.type.charAt(0).toUpperCase() + msg.type.slice(1)}]`;
            if (msg[msg.type]?.link) {
              mediaUrl = msg[msg.type].link;
            }
          }

          messages.push({
            source: 'whatsapp',
            from: msg.from,
            fromName: contact?.profile?.name || null,
            content,
            mediaUrl,
            externalId: msg.id,
            conversationId: msg.from,
            timestamp: msg.timestamp,
            raw: msg,
          });
        }

        // Extrai atualizações de status (delivered/read/failed)
        for (const status of value.statuses || []) {
          statusUpdates.push({
            messageId: status.id,
            status: status.status,
            recipientId: status.recipient_id,
            timestamp: status.timestamp,
          });
        }
      }
    }

    // TODO: Em produção, persistir no Supabase (tabela hub_inbox_messages)
    // e publicar evento para os módulos consumidores (Taskzei, CRM).
    //
    // Exemplo:
    //   await supabase.from('hub_inbox_messages').insert(messages);
    //   await pubsub.publish('hub.inbox.new', { messages });
    //
    // Por enquanto, loga no console (funcionará em produção com logs da Netlify).

    console.log('[WhatsApp Webhook] Mensagens recebidas:', messages.length);
    console.log('[WhatsApp Webhook] Status updates:', statusUpdates.length);

    if (messages.length > 0) {
      console.log('[WhatsApp Webhook] Primeira mensagem:', {
        from: messages[0].from,
        content: messages[0].content.slice(0, 80),
      });
    }

    // Meta espera 200 OK rápido para não re-enviar o webhook
    return json(200, {
      ok: true,
      data: {
        messagesReceived: messages.length,
        statusUpdates: statusUpdates.length,
      },
    });
  } catch (error) {
    console.error('[WhatsApp Webhook] Erro no processamento:', error);
    // Mesmo em erro, retorna 200 para evitar re-envio excessivo da Meta
    return json(200, {
      ok: true,
      status: 'processed_with_errors',
      error: error.message,
    });
  }
}
