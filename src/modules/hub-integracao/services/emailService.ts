import { credentialManager } from './credentialManager';
import { loggerService } from './loggerService';
import {
  HubMailProvider,
  HubMailSendInput,
  HubMailSendResult,
  HubMailSyncCursor,
  HubMailSyncResult,
  HubMailProviderContract,
} from '../types/integration.types';

// ─────────── Gmail via Gmail API ───────────

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

class GmailDriver implements HubMailProviderContract {
  async send(input: HubMailSendInput): Promise<HubMailSendResult> {
    const credentials = await credentialManager.getCredential('gmail', 'int_gmail_01', 'default', 'email-service');
    if (!credentials?.accessToken) {
      throw new Error('Gmail não configurado. Client ID e refresh token necessários.');
    }

    const mimeMessage = this.buildMimeMessage(input);
    const encodedMessage = btoa(mimeMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await fetch(`${GMAIL_API_BASE}/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gmail send failed (${response.status}): ${err}`);
    }

    const data = (await response.json()) as { id: string; threadId: string };
    return {
      provider: 'gmail',
      integrationId: 'int_gmail_01',
      externalMessageId: data.id,
      externalThreadId: data.threadId,
      acceptedAt: new Date().toISOString(),
    };
  }

  async sync(cursor: HubMailSyncCursor): Promise<HubMailSyncResult> {
    const credentials = await credentialManager.getCredential('gmail', 'int_gmail_01', 'default', 'email-service');
    if (!credentials?.accessToken) {
      throw new Error('Gmail não configurado.');
    }

    const params = new URLSearchParams({ maxResults: '20' });
    if (cursor.cursor) params.set('pageToken', cursor.cursor);
    params.set('q', 'in:inbox is:unread');

    const response = await fetch(`${GMAIL_API_BASE}/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gmail sync failed (${response.status}): ${err}`);
    }

    const data = (await response.json()) as {
      messages?: Array<{ id: string; threadId: string }>;
      nextPageToken?: string;
    };

    const messages = await Promise.all(
      (data.messages || []).slice(0, 20).map(async (msg) => {
        const detail = await this.getMessageDetail(msg.id, credentials.accessToken!);
        return detail;
      })
    );

    return {
      provider: 'gmail',
      integrationId: 'int_gmail_01',
      nextCursor: data.nextPageToken || undefined,
      messages: messages.filter(Boolean) as HubMailSyncResult['messages'],
    };
  }

  async health(): Promise<boolean> {
    try {
      const credentials = await credentialManager.getCredential('gmail', 'int_gmail_01', 'default', 'email-service');
      if (!credentials?.accessToken) return false;

      const response = await fetch(`${GMAIL_API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async getMessageDetail(messageId: string, accessToken: string) {
    const response = await fetch(`${GMAIL_API_BASE}/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      id: string;
      threadId: string;
      payload?: {
        headers?: Array<{ name: string; value: string }>;
      };
      snippet?: string;
      internalDate?: string;
    };

    const headers = data.payload?.headers || [];
    const getHeader = (name: string) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    return {
      provider: 'gmail' as const,
      integrationId: 'int_gmail_01',
      externalMessageId: data.id,
      externalThreadId: data.threadId,
      from: getHeader('From'),
      to: [getHeader('To')],
      subject: getHeader('Subject'),
      snippet: data.snippet,
      receivedAt: data.internalDate ? new Date(Number(data.internalDate)).toISOString() : new Date().toISOString(),
    };
  }

  private buildMimeMessage(input: HubMailSendInput): string {
    const boundary = `boundary_${Date.now()}`;
    const lines: string[] = [];

    lines.push(`From: ${input.from}`);
    lines.push(`To: ${input.to.join(', ')}`);
    if (input.cc?.length) lines.push(`Cc: ${input.cc.join(', ')}`);
    lines.push(`Subject: ${input.subject}`);
    lines.push('MIME-Version: 1.0');
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push('');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push('');
    lines.push(input.textBody || input.subject);
    if (input.htmlBody) {
      lines.push('');
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/html; charset="UTF-8"');
      lines.push('');
      lines.push(input.htmlBody);
    }
    lines.push('');
    lines.push(`--${boundary}--`);

    return lines.join('\r\n');
  }
}

// ─────────── Titan (placeholder) ───────────

class TitanDriver implements HubMailProviderContract {
  async send(input: HubMailSendInput): Promise<HubMailSendResult> {
    const credentials = await credentialManager.getCredential('titan', 'int_titan_01', 'default', 'email-service');
    if (!credentials?.apiKey) {
      throw new Error('Titan não configurado. API Key necessária.');
    }

    // Placeholder — Titan não possui API pública REST documentada.
    // A integração real exigirá SMTP ou API proprietária.
    console.log('[Titan] Envio placeholder para:', input.to);
    throw new Error('Driver Titan ainda não implementado. Use SMTP diretamente ou aguarde integração via Hub.');
  }

  async sync(_cursor: HubMailSyncCursor): Promise<HubMailSyncResult> {
    throw new Error('Driver Titan ainda não implementado.');
  }

  async health(): Promise<boolean> {
    return false;
  }
}

// ─────────── Email Service (Factory) ───────────

class EmailService {
  private drivers: Record<HubMailProvider, HubMailProviderContract> = {
    gmail: new GmailDriver(),
    titan: new TitanDriver(),
  };

  async send(input: HubMailSendInput): Promise<HubMailSendResult> {
    const driver = this.drivers[input.provider];
    if (!driver) {
      throw new Error(`Provedor de e-mail não suportado: ${input.provider}`);
    }

    try {
      const result = await driver.send(input);
      await loggerService.log({
        integrationId: result.integrationId,
        integrationName: `E-mail (${input.provider})`,
        provider: input.provider,
        action: 'send',
        status: 'success',
        summary: `E-mail enviado para ${input.to.join(', ')}: "${input.subject}"`,
      });
      return result;
    } catch (err) {
      await loggerService.log({
        integrationId: `int_${input.provider}_01`,
        integrationName: `E-mail (${input.provider})`,
        provider: input.provider,
        action: 'error',
        status: 'failure',
        summary: `Falha ao enviar e-mail: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
      });
      throw err;
    }
  }

  async sync(cursor: HubMailSyncCursor): Promise<HubMailSyncResult> {
    const driver = this.drivers[cursor.provider];
    if (!driver) {
      throw new Error(`Provedor de e-mail não suportado: ${cursor.provider}`);
    }
    return driver.sync(cursor);
  }

  async health(provider: HubMailProvider): Promise<boolean> {
    const driver = this.drivers[provider];
    if (!driver) return false;
    return driver.health();
  }

  getDriver(provider: HubMailProvider): HubMailProviderContract {
    return this.drivers[provider];
  }
}

export const emailService = new EmailService();
