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
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

class GmailDriver implements HubMailProviderContract {
  private async getValidAccessToken(actor: string): Promise<string> {
    let credentials = await credentialManager.getCredential('gmail', 'int_gmail_01', 'default', actor);
    
    if (!credentials?.refreshToken) {
      console.error(`[GmailDriver][${actor}] Falha: Refresh Token ausente para int_gmail_01.`);
      throw new Error('Gmail não configurado. Refresh Token é necessário.');
    }

    let accessToken = credentials.accessToken;
    const expiresIn = credentials.expiresIn ? parseInt(credentials.expiresIn, 10) : 0;
    const obtainedAt = credentials.obtainedAt ? new Date(credentials.obtainedAt).getTime() : 0;

    // Verifica se o token expirou (com margem de 5 minutos)
    const isExpired = Date.now() > (obtainedAt + (expiresIn * 1000) - (5 * 60 * 1000));

    if (!accessToken || isExpired) {
      console.log(`[GmailDriver][${actor}] Access Token expirado ou ausente. Tentando refresh.`);

      const clientId = process.env.GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        console.error(`[GmailDriver][${actor}] Falha: Variáveis de ambiente GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configuradas.`);
        throw new Error('Variáveis de ambiente GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não configuradas.');
      }

      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: 'refresh_token',
      });

      const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[GmailDriver][${actor}] Erro ao refrescar token:`, errorData);
        throw new Error(`Falha ao refrescar token do Gmail: ${errorData.error_description || response.statusText}`);
      }

      const data = await response.json();
      accessToken = data.access_token;
      const newExpiresIn = data.expires_in;
      const newObtainedAt = Date.now();

      // Salva o novo access token e tempo de expiração
      await credentialManager.saveCredential(
        'gmail', 'int_gmail_01', 'default',
        { ...credentials, accessToken, expiresIn: String(newExpiresIn), obtainedAt: String(newObtainedAt) },
        'system-refresh'
      );
      console.log(`[GmailDriver][${actor}] Access Token refrescado com sucesso.`);

    } else {
      console.log(`[GmailDriver][${actor}] Usando Access Token existente. Expira em ${new Date(obtainedAt + (expiresIn * 1000)).toLocaleString()}.`);
    }

    if (!accessToken) {
      console.error(`[GmailDriver][${actor}] Falha: Não foi possível obter um Access Token válido.`);
      throw new Error('Não foi possível obter um Access Token válido para o Gmail.');
    }
    return accessToken;
  }

  async send(input: HubMailSendInput): Promise<HubMailSendResult> {
    const accessToken = await this.getValidAccessToken('email-send');
    console.log('[GmailDriver] Tentando enviar e-mail com Access Token.');

    const mimeMessage = this.buildMimeMessage(input);
    const encodedMessage = btoa(mimeMessage).replace(/\+/g, '-')
                                            .replace(/\//g, '_')
                                            .replace(/=+$/, '');

    const response = await fetch(`${GMAIL_API_BASE}/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[GmailDriver] Erro no envio de e-mail:', response.status, err);
      throw new Error(`Gmail send failed (${response.status}): ${err}`);
    }

    const data = (await response.json()) as { id: string; threadId: string };
    console.log('[GmailDriver] E-mail enviado com sucesso:', data.id);
    return {
      provider: 'gmail',
      integrationId: 'int_gmail_01',
      externalMessageId: data.id,
      externalThreadId: data.threadId,
      acceptedAt: new Date().toISOString(),
    };
  }

  async sync(cursor: HubMailSyncCursor): Promise<HubMailSyncResult> {
    const accessToken = await this.getValidAccessToken('email-sync');
    console.log('[GmailDriver] Tentando sincronizar inbox com Access Token.');

    const params = new URLSearchParams({ maxResults: '20' });
    if (cursor.cursor) params.set('pageToken', cursor.cursor);
    params.set('q', 'in:inbox is:unread');

    const response = await fetch(`${GMAIL_API_BASE}/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[GmailDriver] Erro na sincronização do inbox:', response.status, err);
      throw new Error(`Gmail sync failed (${response.status}): ${err}`);
    }

    const data = (await response.json()) as {
      messages?: Array<{ id: string; threadId: string }>;
      nextPageToken?: string;
    };

    console.log('[GmailDriver] Mensagens brutas recebidas do Gmail:', data.messages?.length || 0);

    const messages = await Promise.all(
      (data.messages || []).slice(0, 20).map(async (msg) => {
        const detail = await this.getMessageDetail(msg.id, accessToken);
        return detail;
      })
    );
    console.log('[GmailDriver] Mensagens processadas para o Hub:', messages.filter(Boolean).length);

    return {
      provider: 'gmail',
      integrationId: 'int_gmail_01',
      nextCursor: data.nextPageToken || undefined,
      messages: messages.filter(Boolean) as HubMailSyncResult['messages'],
    };
  }

  async health(): Promise<boolean> {
    console.log('[GmailDriver] Executando health check.');
    try {
      const accessToken = await this.getValidAccessToken('email-health');

      const response = await fetch(`${GMAIL_API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const isHealthy = response.ok;
      console.log(`[GmailDriver] Health check: ${isHealthy ? 'Sucesso' : 'Falha'}.`);
      return isHealthy;
    } catch (err) {
      console.error('[GmailDriver] Health check falhou:', err);
      return false;
    }
  }

  private async getMessageDetail(messageId: string, accessToken: string) {
    const response = await fetch(`${GMAIL_API_BASE}/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      console.warn(`[GmailDriver] Falha ao buscar detalhes da mensagem ${messageId}:`, response.status);
      return null;
    }

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

// ─────────── Titan (Serverless Function Bridge) ───────────

class TitanDriver implements HubMailProviderContract {
  private getTitanFunctionUrl(): string {
    return String(import.meta.env.VITE_HUB_TITAN_BASE_URL || '/hub/email-titan').trim();
  }

  async send(input: HubMailSendInput): Promise<HubMailSendResult> {
    const credentials = await credentialManager.getCredential('titan', 'int_titan_01', 'default', 'email-service');
    if (!credentials?.apiKey && !credentials?.password) {
      console.warn('[TitanDriver] Falha: Credenciais ausentes para int_titan_01.');
      throw new Error('Titan não configurado. Senha ou API Key necessária.');
    }

    const response = await fetch(`${this.getTitanFunctionUrl()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send',
        credentials: {
          email: credentials.accountEmail || credentials.email || input.from,
          password: credentials.password || credentials.apiKey,
        },
        payload: input
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[TitanDriver] Erro no envio de e-mail:', response.status, err);
      throw new Error(`Titan send failed (${response.status}): ${err}`);
    }

    const data = await response.json() as { messageId: string, acceptedAt: string };
    
    return {
      provider: 'titan',
      integrationId: 'int_titan_01',
      externalMessageId: data.messageId,
      acceptedAt: data.acceptedAt || new Date().toISOString(),
    };
  }

  async sync(_cursor: HubMailSyncCursor): Promise<HubMailSyncResult> {
    const credentials = await credentialManager.getCredential('titan', 'int_titan_01', 'default', 'email-sync');
    if (!credentials?.apiKey && !credentials?.password) {
      console.warn('[TitanDriver] Falha: Credenciais ausentes para int_titan_01.');
      throw new Error('Titan não configurado. Senha ou API Key necessária.');
    }

    const response = await fetch(`${this.getTitanFunctionUrl()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync',
        credentials: {
          email: credentials.accountEmail || credentials.email || 'unknown',
          password: credentials.password || credentials.apiKey,
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[TitanDriver] Erro na sincronização do inbox:', response.status, err);
      throw new Error(`Titan sync failed (${response.status}): ${err}`);
    }

    const data = await response.json() as { messages: any[] };

    return {
      provider: 'titan',
      integrationId: 'int_titan_01',
      messages: data.messages.map((msg: any) => ({
        ...msg,
        provider: 'titan',
        integrationId: 'int_titan_01'
      })),
    };
  }

  async health(): Promise<boolean> {
    try {
      const credentials = await credentialManager.getCredential('titan', 'int_titan_01', 'default', 'email-health');
      if (!credentials?.apiKey && !credentials?.password) {
        return false;
      }

      const response = await fetch(`${this.getTitanFunctionUrl()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'health',
          credentials: {
            email: credentials.accountEmail || credentials.email || 'unknown',
            password: credentials.password || credentials.apiKey,
          }
        }),
      });

      return response.ok;
    } catch (err) {
      console.error('[TitanDriver] Health check falhou:', err);
      return false;
    }
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
    try {
      const result = await driver.sync(cursor);
      await loggerService.log({
        integrationId: result.integrationId,
        integrationName: `E-mail (${cursor.provider})`,
        provider: cursor.provider,
        action: 'receive',
        status: 'success',
        summary: `Sincronização de inbox concluída. ${result.messages.length} mensagens novas.`,
      });
      return result;
    } catch (err) {
      await loggerService.log({
        integrationId: `int_${cursor.provider}_01`,
        integrationName: `E-mail (${cursor.provider})`,
        provider: cursor.provider,
        action: 'error',
        status: 'failure',
        summary: `Falha ao sincronizar inbox: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
      });
      throw err;
    }
  }

  async health(provider: HubMailProvider): Promise<boolean> {
    const driver = this.drivers[provider];
    if (!driver) return false;
    try {
      const isHealthy = await driver.health();
      await loggerService.log({
        integrationId: `int_${provider}_01`,
        integrationName: `E-mail (${provider})`,
        provider,
        action: 'health',
        status: isHealthy ? 'success' : 'failure',
        summary: `Health check E-mail (${provider}): ${isHealthy ? 'Sucesso' : 'Falha'}`,
      });
      return isHealthy;
    } catch (err) {
      await loggerService.log({
        integrationId: `int_${provider}_01`,
        integrationName: `E-mail (${provider})`,
        provider,
        action: 'error',
        status: 'failure',
        summary: `Falha no health check de E-mail (${provider}): ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
      });
      return false;
    }
  }

  getDriver(provider: HubMailProvider): HubMailProviderContract {
    return this.drivers[provider];
  }
}

export const emailService = new EmailService();