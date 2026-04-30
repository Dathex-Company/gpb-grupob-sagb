export interface WhatsAppCredentials {
  accessToken: string;
  phoneNumberId: string;
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

const WHATSAPP_API_BASE = 'https://graph.facebook.com/v20.0';

export class WhatsAppDriver {
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

  async healthCheck(credentials: WhatsAppCredentials): Promise<boolean> {
    const response = await fetch(`${WHATSAPP_API_BASE}/${credentials.phoneNumberId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`
      }
    });

    return response.ok;
  }
}

export const whatsAppDriver = new WhatsAppDriver();
