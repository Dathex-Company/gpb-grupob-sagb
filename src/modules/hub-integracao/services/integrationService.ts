import {
  HubCreateTaskInput,
  HubCreateTaskResult,
  HubSendWhatsAppMessageInput,
  HubSendWhatsAppQrMessageInput,
  HubSendWhatsAppMessageResult,
  HubWhatsAppQrStatus,
  HubMailSendInput,
  HubMailSendResult,
  HubInboundMessage,
  HubInboundWebhookPayload,
  HubActivityLogEntry,
  ConnectionConfig,
  Integration,
  IntegrationServiceContract,
} from '../types/integration.types';
import { clickUpDriver } from './clickupService';
import { credentialManager } from './credentialManager';
import { whatsAppDriver } from './whatsappService';
import { emailService } from './emailService';
import { loggerService } from './loggerService';

const INBOX_STORAGE_KEY = 'sagb_hub_inbox_messages_v1';

export class IntegrationHubService implements IntegrationServiceContract {
  private readonly clickUpIntegrationId = 'int_clickup_01';
  private readonly whatsAppIntegrationId = 'int_waba_01';
  private readonly workspaceId = 'default';

  // ────────── Credential Bootstrap (DEV) ──────────

  private async ensureDevClickUpCredentials(): Promise<void> {
    if (!import.meta.env.DEV) return;

    const existing = await credentialManager.getCredential('clickup', this.clickUpIntegrationId, this.workspaceId, 'integration-hub-bootstrap');
    if (existing?.apiToken && existing?.listId) return;

    const token = String(import.meta.env.VITE_HUB_CLICKUP_API_TOKEN || '').trim();
    const listId = String(import.meta.env.VITE_HUB_CLICKUP_LIST_ID || '').trim();
    if (!token || !listId) return;

    await credentialManager.saveCredential(
      'clickup',
      this.clickUpIntegrationId,
      this.workspaceId,
      { apiToken: token, listId },
      'integration-hub-bootstrap'
    );
  }

  private async ensureDevWhatsAppCredentials(): Promise<void> {
    if (!import.meta.env.DEV) return;

    const existing = await credentialManager.getCredential('whatsapp', this.whatsAppIntegrationId, this.workspaceId, 'integration-hub-bootstrap');
    if (existing?.accessToken && existing?.phoneNumberId) return;

    const accessToken = String(import.meta.env.VITE_HUB_WABA_ACCESS_TOKEN || '').trim();
    const phoneNumberId = String(import.meta.env.VITE_HUB_WABA_PHONE_NUMBER_ID || '').trim();
    if (!accessToken || !phoneNumberId) return;

    await credentialManager.saveCredential(
      'whatsapp',
      this.whatsAppIntegrationId,
      this.workspaceId,
      { accessToken, phoneNumberId },
      'integration-hub-bootstrap'
    );
  }

  // ────────── Client (placeholder) ──────────

  async getClient(provider: string): Promise<any> {
    console.log(`[Hub] Solicitado cliente para: ${provider}`);
    throw new Error(`Not implemented: Driver para ${provider} ainda não disponível`);
  }

  // ────────── Test Connection ──────────

  async testConnection(integrationId: string): Promise<boolean> {
    console.log(`[Hub] Testando conexão: ${integrationId}`);

    let success = false;
    let summary = '';
    let integrationName = integrationId;
    let provider = 'unknown';

    try {
      if (integrationId === this.clickUpIntegrationId) {
        integrationName = 'ClickUp Oficial';
        provider = 'clickup';
        const credentials = await credentialManager.getCredential('clickup', this.clickUpIntegrationId, this.workspaceId, 'integration-hub');
        if (!credentials?.apiToken) throw new Error('ClickUp não configurado');
        success = await clickUpDriver.healthCheck({ apiToken: credentials.apiToken, listId: credentials.listId || '' });
        summary = success ? 'ClickUp conectado' : 'ClickUp inacessível';
      } else if (integrationId === this.whatsAppIntegrationId) {
        integrationName = 'WhatsApp API';
        provider = 'whatsapp';
        const credentials = await credentialManager.getCredential('whatsapp', this.whatsAppIntegrationId, this.workspaceId, 'integration-hub');
        if (!credentials?.accessToken || !credentials?.phoneNumberId) throw new Error('WhatsApp não configurado');
        success = await whatsAppDriver.healthCheck({ accessToken: credentials.accessToken, phoneNumberId: credentials.phoneNumberId });
        summary = success ? 'WhatsApp conectado' : 'WhatsApp inacessível';
      } else if (integrationId === 'int_gmail_01') {
        integrationName = 'Gmail';
        provider = 'gmail';
        const credentials = await credentialManager.getCredential('gmail', 'int_gmail_01', this.workspaceId, 'integration-hub');
        if (!credentials?.refreshToken) throw new Error('Gmail não configurado (refresh token ausente)');
        success = await emailService.health('gmail');
        summary = success ? 'Gmail conectado' : 'Gmail inacessível';
      } else {
        summary = 'Integração desconhecida';
      }
    } catch (err) {
      summary = `Erro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
      success = false;
    }

    await loggerService.log({
      integrationId,
      integrationName,
      provider,
      action: 'test',
      status: success ? 'success' : 'failure',
      summary,
    });

    return success;
  }

  // ────────── List Integrations ──────────

  async listIntegrations(): Promise<Integration[]> {
    const [whatsAppStatus, clickUpStatus] = await Promise.all([
      this.getConnectionStatus(this.whatsAppIntegrationId),
      this.getConnectionStatus(this.clickUpIntegrationId),
    ]);

    return [
      {
        id: this.whatsAppIntegrationId,
        name: 'WhatsApp API',
        provider: 'whatsapp',
        status: whatsAppStatus,
        configuredAt: new Date(),
        usedBy: ['taskzei', 'crm_ziplia'],
      },
      {
        id: 'int_crm_ziplia_whatsapp',
        name: 'WhatsApp CRM Ziplia',
        provider: 'whatsapp',
        // Simulado como ativo para testes — representa o número
        // dedicado do CRM Ziplia conectado via Hub
        status: 'active',
        configuredAt: new Date(),
        usedBy: ['crm_ziplia'],
        scopes: ['inbound_messages', 'outbound_messages'],
      },
      {
        id: this.clickUpIntegrationId,
        name: 'ClickUp Oficial',
        provider: 'clickup',
        status: clickUpStatus,
        configuredAt: new Date(),
        usedBy: ['taskzei'],
      },
      {
        id: 'int_gmail_01',
        name: 'Gmail',
        provider: 'gmail',
        status: await this.getConnectionStatus('int_gmail_01'),
        configuredAt: new Date(),
        usedBy: ['taskzei'],
      },
      {
        id: 'int_titan_01',
        name: 'Titan Email',
        provider: 'titan',
        status: await this.getConnectionStatus('int_titan_01'),
        configuredAt: new Date(),
        usedBy: ['taskzei'],
      },
    ];
  }

  // ────────── Connection Status ──────────

  async getConnectionStatus(integrationId: string): Promise<'active' | 'inactive' | 'error'> {
    if (integrationId === this.clickUpIntegrationId) {
      const credentials = await credentialManager.getCredential('clickup', this.clickUpIntegrationId, this.workspaceId, 'integration-hub');
      if (!credentials?.apiToken || !credentials?.listId) return 'inactive';
      return 'active';
    }

    if (integrationId === this.whatsAppIntegrationId) {
      const credentials = await credentialManager.getCredential('whatsapp', this.whatsAppIntegrationId, this.workspaceId, 'integration-hub');
      if (!credentials?.accessToken || !credentials?.phoneNumberId) return 'inactive';
      return 'active';
    }

    if (integrationId === 'int_gmail_01') {
      const credentials = await credentialManager.getCredential('gmail', 'int_gmail_01', this.workspaceId, 'integration-hub');
      if (!credentials?.refreshToken) return 'inactive';
      return 'active';
    }

    if (integrationId === 'int_titan_01') {
      const credentials = await credentialManager.getCredential('titan', 'int_titan_01', this.workspaceId, 'integration-hub');
      if (!credentials?.apiKey) return 'inactive';
      return 'active';
    }

    return 'inactive';
  }

  // ────────── ClickUp ──────────

  async createTaskViaClickUp(input: HubCreateTaskInput): Promise<HubCreateTaskResult> {
    await this.ensureDevClickUpCredentials();
    const credentials = await credentialManager.getCredential('clickup', this.clickUpIntegrationId, this.workspaceId, 'integration-hub');

    if (!credentials?.apiToken || !credentials?.listId) {
      throw new Error('ClickUp não configurado no Hub. Salve apiToken e listId nas credenciais da integração int_clickup_01.');
    }

    const result = await clickUpDriver.createTask(
      { apiToken: credentials.apiToken, listId: credentials.listId },
      input
    );

    await loggerService.log({
      integrationId: this.clickUpIntegrationId,
      integrationName: 'ClickUp Oficial',
      provider: 'clickup',
      action: 'send',
      status: 'success',
      summary: `Task criada: "${input.title}"`,
    });

    return {
      externalId: result.id,
      provider: 'clickup',
      integrationId: this.clickUpIntegrationId,
      url: result.url,
      status: result.status,
    };
  }

  // ────────── WhatsApp Outbound ──────────

  async sendWhatsAppMessage(input: HubSendWhatsAppMessageInput): Promise<HubSendWhatsAppMessageResult> {
    await this.ensureDevWhatsAppCredentials();
    const credentials = await credentialManager.getCredential('whatsapp', this.whatsAppIntegrationId, this.workspaceId, 'integration-hub');

    if (!credentials?.accessToken || !credentials?.phoneNumberId) {
      throw new Error('WhatsApp não configurado no Hub. Salve accessToken e phoneNumberId nas credenciais da integração int_waba_01.');
    }

    const result = await whatsAppDriver.sendMessage(
      { accessToken: credentials.accessToken, phoneNumberId: credentials.phoneNumberId },
      input
    );

    await loggerService.log({
      integrationId: this.whatsAppIntegrationId,
      integrationName: 'WhatsApp API',
      provider: 'whatsapp',
      action: 'send',
      status: 'success',
      summary: `Mensagem enviada para ${input.to}`,
    });

    return {
      externalId: result.messageId,
      provider: 'whatsapp',
      integrationId: this.whatsAppIntegrationId,
      status: result.status,
    };
  }

  async sendWhatsAppQrMessage(input: HubSendWhatsAppQrMessageInput): Promise<HubSendWhatsAppMessageResult> {
    const baseUrl = this.getWhatsAppQrBaseUrl();
    const apiKey = this.getWhatsAppQrApiKey();
    const sessionId = input.sessionId || 'default';

    const response = await fetch(`${baseUrl}/send?sessionId=${encodeURIComponent(sessionId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
      body: JSON.stringify({
        to: input.to,
        message: input.message,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Falha ao enviar mensagem via WhatsApp QR (${response.status}): ${err}`);
    }

    const data = await response.json() as { messageId?: string | null };

    const outboundMessage: HubInboundMessage = {
      id: crypto.randomUUID(),
      source: 'whatsapp',
      from: 'me',
      fromName: 'CRM Ziplia',
      content: input.message,
      externalId: data.messageId || `local-${Date.now()}`,
      conversationId: input.to,
      integrationId: this.whatsAppIntegrationId,
      workspaceId: this.workspaceId,
      receivedAt: new Date().toISOString(),
      status: 'processed',
      consumedBy: 'crm_ziplia',
      metadata: {
        direction: 'outbound',
        to: input.to,
        sessionId,
      },
    };

    this.persistInboxMessage(outboundMessage);

    await loggerService.log({
      integrationId: this.whatsAppIntegrationId,
      integrationName: 'WhatsApp QR (Baileys)',
      provider: 'whatsapp',
      action: 'send',
      status: 'success',
      summary: `Mensagem enviada via QR para ${input.to}`,
    });

    return {
      externalId: data.messageId || outboundMessage.externalId,
      provider: 'whatsapp',
      integrationId: this.whatsAppIntegrationId,
      status: 'sent',
    };
  }

  // ────────── WhatsApp QR (Baileys Service) ──────────

  private getWhatsAppQrBaseUrl(): string {
    return String(import.meta.env.VITE_HUB_WHATSAPP_QR_BASE_URL || '/hub/whatsapp-qr').trim();
  }

  private getWhatsAppQrApiKey(): string {
    return String(import.meta.env.VITE_HUB_WHATSAPP_QR_API_KEY || '').trim();
  }

  async connectWhatsAppQr(sessionId = 'default'): Promise<HubWhatsAppQrStatus> {
    const baseUrl = this.getWhatsAppQrBaseUrl();
    const apiKey = this.getWhatsAppQrApiKey();

    const response = await fetch(`${baseUrl}/connect?sessionId=${encodeURIComponent(sessionId)}`, {
      method: 'POST',
      headers: {
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Falha ao iniciar conexão WhatsApp QR (${response.status}): ${err}`);
    }

    const data = await response.json() as { sessionId: string; status: HubWhatsAppQrStatus['status']; qrDataUrl?: string | null; lastError?: string | null };

    await loggerService.log({
      integrationId: this.whatsAppIntegrationId,
      integrationName: 'WhatsApp QR (Baileys)',
      provider: 'whatsapp',
      action: 'config',
      status: 'success',
      summary: `Sessão QR iniciada (${sessionId}) com status ${data.status}`,
    });

    return {
      sessionId: data.sessionId || sessionId,
      status: data.status,
      qrDataUrl: data.qrDataUrl ?? null,
      lastError: data.lastError ?? null,
    };
  }

  async getWhatsAppQrStatus(sessionId = 'default'): Promise<HubWhatsAppQrStatus> {
    const baseUrl = this.getWhatsAppQrBaseUrl();
    const apiKey = this.getWhatsAppQrApiKey();

    const response = await fetch(`${baseUrl}/status?sessionId=${encodeURIComponent(sessionId)}`, {
      method: 'GET',
      headers: {
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Falha ao consultar status WhatsApp QR (${response.status}): ${err}`);
    }

    const data = await response.json() as { sessionId: string; status: HubWhatsAppQrStatus['status']; qrDataUrl?: string | null; lastError?: string | null };

    return {
      sessionId: data.sessionId || sessionId,
      status: data.status,
      qrDataUrl: data.qrDataUrl ?? null,
      lastError: data.lastError ?? null,
    };
  }

  async logoutWhatsAppQr(sessionId = 'default'): Promise<void> {
    const baseUrl = this.getWhatsAppQrBaseUrl();
    const apiKey = this.getWhatsAppQrApiKey();

    const response = await fetch(`${baseUrl}/logout?sessionId=${encodeURIComponent(sessionId)}`, {
      method: 'POST',
      headers: {
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Falha ao logout da sessão WhatsApp QR (${response.status}): ${err}`);
    }

    await loggerService.log({
      integrationId: this.whatsAppIntegrationId,
      integrationName: 'WhatsApp QR (Baileys)',
      provider: 'whatsapp',
      action: 'config',
      status: 'success',
      summary: `Sessão QR encerrada (${sessionId})`,
    });
  }

  // ────────── WhatsApp QR (Baileys Service) — Inbox ──────────

  async getWhatsAppQrInbox(sessionId = 'default'): Promise<HubInboundMessage[]> {
    const baseUrl = this.getWhatsAppQrBaseUrl();
    const apiKey = this.getWhatsAppQrApiKey();

    try {
      const response = await fetch(`${baseUrl}/inbox?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'GET',
        headers: {
          ...(apiKey ? { 'x-api-key': apiKey } : {}),
        },
      });

      if (!response.ok) return [];
      const data = await response.json() as { ok: boolean; messages: HubInboundMessage[] };
      return data.messages || [];
    } catch (err) {
      console.warn('[Hub] Falha ao buscar inbox QR:', err);
      return [];
    }
  }

  // ────────── WhatsApp Inbound (Webhook) ──────────

  async processInboundWebhook(payload: HubInboundWebhookPayload): Promise<HubInboundMessage> {
    const message: HubInboundMessage = {
      id: crypto.randomUUID(),
      source: payload.source,
      from: payload.parsed.from,
      fromName: payload.parsed.fromName,
      content: payload.parsed.content,
      mediaUrl: payload.parsed.mediaUrl,
      externalId: payload.parsed.externalId,
      conversationId: payload.parsed.conversationId,
      integrationId: payload.integrationId,
      workspaceId: payload.workspaceId,
      receivedAt: new Date().toISOString(),
      status: 'pending',
      metadata: { raw: payload.raw },
    };

    // Persiste no armazenamento local (mock)
    this.persistInboxMessage(message);

    // Log
    await loggerService.log({
      integrationId: payload.integrationId,
      integrationName: 'WhatsApp API',
      provider: 'whatsapp',
      action: 'receive',
      status: 'success',
      summary: `Mensagem recebida de ${payload.parsed.fromName || payload.parsed.from}: "${payload.parsed.content.slice(0, 60)}"`,
    });

    // ─── Event Bridge Global ────────────────────────────────────────
    // Dispara um evento customizado no window para que módulos
    // consumidores (Taskzei, CRM Ziplia) possam escutar mensagens
    // inbound em tempo real sem acoplamento direto.
    //
    // Uso no módulo consumidor:
    //   window.addEventListener('hub:inbound-message', (event) => {
    //     const message = (event as CustomEvent<HubInboundMessage>).detail;
    //     // processar mensagem...
    //   });
    try {
      window.dispatchEvent(
        new CustomEvent<HubInboundMessage>('hub:inbound-message', {
          detail: message,
          bubbles: true,
        })
      );
    } catch (err) {
      console.warn('[Hub] Event bridge dispatch failed (server-side render?):', err);
    }

    return message;
  }

  async getInboxMessages(integrationId?: string, limit = 50): Promise<HubInboundMessage[]> {
    const all = this.getInboxStorage();
    const filtered = integrationId
      ? all.filter((m) => m.integrationId === integrationId)
      : all;
    return filtered.slice(0, limit);
  }

  // ────────── Taskzei Contract: Marcar como lida ─────────────────

  async markAsRead(messageId: string): Promise<void> {
    const messages = this.getInboxStorage();
    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) throw new Error(`Mensagem ${messageId} não encontrada`);

    messages[index].status = 'processed';
    messages[index].consumedBy = messages[index].consumedBy || 'crm_ziplia';
    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages));

    await loggerService.log({
      integrationId: messages[index].integrationId,
      integrationName: 'WhatsApp API',
      provider: 'whatsapp',
      action: 'receive',
      status: 'success',
      summary: `Mensagem ${messageId} marcada como lida pelo CRM Ziplia`,
    });
  }

  // ────────── Email ──────────

  async sendEmail(input: HubMailSendInput): Promise<HubMailSendResult> {
    return emailService.send(input);
  }

  // ────────── Activity Log ──────────

  async getActivityLog(integrationId?: string, limit = 50): Promise<HubActivityLogEntry[]> {
    return loggerService.getLogs(integrationId, limit);
  }

  async getCredentialAudit(limit = 50): Promise<any[]> {
    return credentialManager.getAuditTrail(limit);
  }

  // ────────── Integration Config ──────────

  async updateIntegrationConfig(integrationId: string, config: ConnectionConfig): Promise<void> {
    const providerMap: Record<string, any> = {
      int_waba_01: 'whatsapp',
      int_clickup_01: 'clickup',
      int_gmail_01: 'gmail',
      int_titan_01: 'titan',
      int_meta_01: 'meta_facebook',
    };

    const provider = providerMap[integrationId];
    if (!provider) {
      throw new Error(`Integração desconhecida: ${integrationId}`);
    }

    // Se o config incluir accountEmail, armazena como metadata separada
    const { accountEmail, ...credentialFields } = config.credentials as any;
    const credentialsToSave = { ...credentialFields };
    if (accountEmail) {
      credentialsToSave.accountEmail = accountEmail;
    }

    await credentialManager.saveCredential(
      provider,
      integrationId,
      this.workspaceId,
      credentialsToSave,
      'integration-hub-ui'
    );

    await loggerService.log({
      integrationId,
      integrationName: integrationId,
      provider,
      action: 'config',
      status: 'success',
      summary: `Credenciais configuradas para ${integrationId}`,
    });
  }

  // ────────── Inbox Storage (local mock) ──────────

  private persistInboxMessage(message: HubInboundMessage): void {
    const messages = this.getInboxStorage();
    messages.unshift(message);
    // Mantém apenas os últimos 500
    if (messages.length > 500) {
      messages.length = 500;
    }
    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages));
  }

  private getInboxStorage(): HubInboundMessage[] {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as HubInboundMessage[];
    } catch {
      return [];
    }
  }
}

export const integrationHub = new IntegrationHubService();
