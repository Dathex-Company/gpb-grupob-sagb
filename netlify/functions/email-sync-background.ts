import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
  process.env.SUPABASE_SERVICE_KEY || 'YOUR_SUPABASE_SERVICE_KEY'
);

const json = (statusCode: number, payload: any) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { provider, messages, integrationId } = body;

    if (!provider || !messages || !Array.isArray(messages)) {
      return json(400, { ok: false, error: 'Invalid payload' });
    }

    const records = messages.map((msg: any) => ({
      id: crypto.randomUUID(),
      source: 'email',
      from: msg.from,
      from_name: msg.fromName || msg.from, // Try to parse name from "Name <email>" if possible later
      content: msg.snippet || msg.subject || '[Sem conteúdo]',
      external_id: msg.externalMessageId,
      conversation_id: msg.externalThreadId || msg.externalMessageId,
      integration_id: integrationId || `int_${provider}_01`,
      workspace_id: 'default',
      received_at: new Date(msg.receivedAt || Date.now()).toISOString(),
      status: 'pending',
      metadata: { 
        subject: msg.subject,
        to: msg.to,
        labels: msg.labels || []
      },
    }));

    if (records.length > 0) {
      const { error } = await supabase.from('hub_inbox_messages').insert(records);
      if (error) {
        console.error('[Email Sync Background] Erro Supabase:', error);
        return json(500, { ok: false, error: error.message });
      }
    }

    return json(200, { ok: true, synced: records.length });

  } catch (error: any) {
    console.error('[Email Sync Background] Internal Error:', error);
    return json(500, { ok: false, error: error.message });
  }
}
