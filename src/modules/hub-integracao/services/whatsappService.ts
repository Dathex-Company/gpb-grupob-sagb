export interface WhatsAppCredentials {
  accessToken: string;
  phoneNumberId: string;
  webhookVerifyToken?: string;
}

export interface WhatsAppSendMessageInput {
  to: string;
  message: string;
}

export interface WhatsAppSendMessageResult {
  messageId: string;
  status: 'sent' | 'queued';
  raw?: unknown;
}

// ────────── Inbound Types ──────────

export interface WhatsAppInboundMessage {
  messageId: string;
  from: string;
  fromName?: string;
  content: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: string;
  conversationId?: string;
  raw?: unknown;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string; link?: string };
          video?: { id: string; mime_type: string; link?: string };
          audio?: { id: string; mime_type: string; link?: string };
          document?: { id: string; mime_type: string; link?: string };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppWebhookVerification {
  mode: string;
  token: string;
  challenge: string;
}

const WHATSAPP_API_BASE = 'https://graph.facebook.com/v20.0';

export class WhatsAppDriver {
  // ────────── Outbound ──────────

  async sendMessage(
    credentials: WhatsAppCredentials,
    input: WhatsAppSendMessageInput
  ): Promise<WhatsAppSendMessageResult> {
    const response = await fetch(`${WHATSAPP_API_BASE}/${credentials.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: input.to,
        type: 'text',
        text: {
          body: input.message
        }
      })
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(`WhatsApp sendMessage failed (${response.status}): ${raw}`);
    }

    const data = await response.json() as {
      messages?: Array<{ id?: string }>;
    };

    return {
      messageId: data.messages?.[0]?.id || crypto.randomUUID(),
      status: 'sent',
      raw: data
    };
  }

  // ────────── Inbound Webhook ──────────

  /**
   * Verifica o webhook da Meta (desafio GET).
   * A Meta envia: hub.mode, hub.challenge, hub.verify_token
   */
  verifyWebhook(verification: WhatsAppWebhookVerification, expectedToken: string): string | null {
    const { mode, token, challenge } = verification;

    if (mode === 'subscribe' && token === expectedToken) {
      return challenge;
    }

    return null;
  }

  /**
   * Processa o payload de webhook recebido da Meta (POST).
   * Extrai mensagens de texto/mídia e retorna um array normalizado.
   */
  processInboundPayload(payload: WhatsAppWebhookPayload): WhatsAppInboundMessage[] {
    const messages: WhatsAppInboundMessage[] = [];

    if (!payload?.entry) return messages;

    for (const entry of payload.entry) {
      for (const change of entry.changes || []) {
        const value = change.value;

        // Processa mensagens recebidas
        for (const msg of value.messages || []) {
          const contact = value.contacts?.find((c) => c.wa_id === msg.from);

          let content = '';
          let mediaUrl: string | undefined;
          let mediaType: string | undefined;

          if (msg.type === 'text' && msg.text?.body) {
            content = msg.text.body;
          } else if (msg.type === 'image') {
            content = '[Imagem]';
            mediaType = msg.image?.mime_type;
          } else if (msg.type === 'video') {
            content = '[Vídeo]';
            mediaType = msg.video?.mime_type;
          } else if (msg.type === 'audio') {
            content = '[Áudio]';
            mediaType = msg.audio?.mime_type;
          } else if (msg.type === 'document') {
            content = '[Documento]';
            mediaType = msg.document?.mime_type;
          }

          messages.push({
            messageId: msg.id,
            from: msg.from,
            fromName: contact?.profile?.name,
            content,
            timestamp: msg.timestamp,
            mediaUrl,
            mediaType,
            conversationId: msg.from, // No WhatsApp, o conversationId é o número do remetente
            raw: msg,
          });
        }

        // Processa status de envio (delivery receipts)
        for (const status of value.statuses || []) {
          messages.push({
            messageId: status.id,
            from: status.recipient_id,
            content: `[Status: ${status.status}]`,
            timestamp: status.timestamp,
            raw: status,
          });
        }
      }
    }

    return messages;
  }

  // ────────── Health Check ──────────

  async healthCheck(credentials: WhatsAppCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${WHATSAPP_API_BASE}/${credentials.phoneNumberId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const whatsAppDriver = new WhatsAppDriver();
