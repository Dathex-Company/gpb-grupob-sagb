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
  HubChannel,
  ChannelMethodKey,
  ChannelRuntimeStatus,
  ChannelConfig,
  ConnectionMethod,
  ModuleBinding,
  HubChannelView,
  HubObservabilityEvent,
} from '../types/integration.types';
import { clickUpDriver } from './clickupService';
import { credentialManager } from './credentialManager';
import { whatsAppDriver } from './whatsappService';
import { emailService } from './emailService';
import { loggerService } from './loggerService';
import { restFetch } from '../../../../services/supabase';

const INBOX_STORAGE_KEY = 'sagb_hub_inbox_messages_v1';

export class IntegrationHubService implements IntegrationServiceContract {
  private readonly clickUpIntegrationId = 'int_clickup_01';
  private readonly whatsAppIntegrationId = 'int_waba_01';
  private readonly workspaceId = 'default';

  private emitObservability(event: HubObservabilityEvent): void {
    const summary = `${event.eventName} [${event.channel}/${event.method || 'n/a'}] ${event.status || ''}`.trim();
    void loggerService.log({
      integrationId: `obs_${event.channel}`,
      integrationName: `Observability ${event.channel}`,
      provider: event.channel,
      action: 'health',
      status: event.errorCode ? 'failure' : 'success',
      summary,
      details: JSON.stringify(event),
    });
  }

  private async getDefaultMethods(workspaceId = this.workspaceId): Promise<ConnectionMethod[]> {
    return [
      {
        id: crypto.randomUUID(),
        workspaceId,
        channel: 'whatsapp',
        method: 'whatsapp_qr',
        enabled: true,
        isDefault: true,
        displayName: 'QR Code',
        providerInternal: 'baileys',
      },
      {
        id: crypto.randomUUID(),
        workspaceId,
        channel: 'whatsapp',
        method: 'whatsapp_business_api',
        enabled: true,
        isDefault: false,
        displayName: 'Business API',
        providerInternal: 'meta_cloud_api',
      },
      {
        id: crypto.randomUUID(),
        workspaceId,
        channel: 'email',
        method: 'email_gmail',
        enabled: true,
        isDefault: true,
        displayName: 'Gmail / Google',
        providerInternal: 'gmail',
      },
      {
        id: crypto.randomUUID(),
        workspaceId,
        channel: 'email',
        method: 'email_titan',
        enabled: true,
        isDefault: false,
        displayName: 'Outro e-mail corporativo',
        providerInternal: 'titan',
      },
    ];
  }

  private async getMethodRows(workspaceId = this.workspaceId): Promise<ConnectionMethod[]> {
    try {
      const query = new URLSearchParams({ select: '*', workspace_id: `eq.${workspaceId}` });
      const rows = await restFetch('hub_channel_methods', { query }) as any[];
      if (!rows?.length) return this.getDefaultMethods(workspaceId);
      return rows.map((row) => ({
        id: String(row.id || crypto.randomUUID()),
        workspaceId: String(row.workspace_id || workspaceId),
        channel: row.channel as HubChannel,
        method: row.method as ChannelMethodKey,
        enabled: Boolean(row.enabled),
        isDefault: Boolean(row.is_default),
        displayName: String(row.display_name || row.method),
        providerInternal: String(row.provider_internal || row.method),
        metadata: row.metadata || undefined,
      }));
    } catch {
      return this.getDefaultMethods(workspaceId);
    }
  }

  private async getChannelConfigRows(workspaceId = this.workspaceId): Promise<ChannelConfig[]> {
    try {
      const query = new URLSearchParams({ select: '*', workspace_id: `eq.${workspaceId}` });
      const rows = await restFetch('hub_channel_configs', { query }) as any[];
      if (!rows?.length) {
        return [
          {
            id: crypto.randomUUID(),
            workspaceId,
            channel: 'whatsapp',
            displayName: 'WhatsApp',
            preferredMethod: 'whatsapp_qr',
            enabled: true,
          },
          {
            id: crypto.randomUUID(),
            workspaceId,
            channel: 'email',
            displayName: 'E-mail',
            preferredMethod: 'email_gmail',
            enabled: true,
          },
        ];
      }
      return rows.map((row) => ({
        id: String(row.id || crypto.randomUUID()),
        workspaceId: String(row.workspace_id || workspaceId),
        channel: row.channel as HubChannel,
        displayName: String(row.display_name || row.channel),
        preferredMethod: row.preferred_method as ChannelMethodKey,
        enabled: Boolean(row.enabled),
        metadata: row.metadata || undefined,
      }));
    } catch {
      return [
        {
          id: crypto.randomUUID(),
          workspaceId,
          channel: 'whatsapp',
          displayName: 'WhatsApp',
          preferredMethod: 'whatsapp_qr',
          enabled: true,
        },
        {
          id: crypto.randomUUID(),
          workspaceId,
          channel: 'email',
          displayName: 'E-mail',
          preferredMethod: 'email_gmail',
          enabled: true,
        },
      ];
    }
  }

  private async getModuleBindingRows(workspaceId = this.workspaceId): Promise<ModuleBinding[]> {
    try {
      const query = new URLSearchParams({ select: '*', workspace_id: `eq.${workspaceId}` });
      const rows = await restFetch('hub_module_bindings', { query }) as any[];
      return (rows || []).map((row) => ({
        id: String(row.id || crypto.randomUUID()),
        workspaceId: String(row.workspace_id || workspaceId),
        module: String(row.module),
        channel: row.channel as HubChannel,
        method: row.method as ChannelMethodKey,
        enabled: Boolean(row.enabled),
        metadata: row.metadata || undefined,
      }));
    } catch {
      return [];
    }
  }

  private async legacyIntegrationsToChannels(workspaceId = this.workspaceId): Promise<HubChannelView[]> {
    const configs = await this.getChannelConfigRows(workspaceId);
    const methods = await this.getMethodRows(workspaceId);
    const bindings = await this.getModuleBindingRows(workspaceId);

    const views: HubChannelView[] = [];
    for (const cfg of configs) {
      const channelMethods = methods.filter((m) => m.channel === cfg.channel);
      const runtime = await this.getChannelStatus(cfg.channel, workspaceId);
      const channelBindings = bindings.filter((b) => b.channel === cfg.channel);
      views.push({ config: cfg, methods: channelMethods, runtime, bindings: channelBindings });
    }
    return views;
  }

  async getChannels(workspaceId = this.workspaceId): Promise<HubChannelView[]> {
    return this.legacyIntegrationsToChannels(workspaceId);
  }

  async getChannelStatus(channel: HubChannel, workspaceId = this.workspaceId): Promise<ChannelRuntimeStatus> {
    if (channel === 'whatsapp') {
      try {
        const status = await this.getWhatsAppQrStatus('default');
        const mapped: ChannelRuntimeStatus = {
          workspaceId,
          channel,
          status: status.status === 'connected' ? 'active' : status.status === 'disconnected' || status.status === 'logged_out' ? 'error' : 'inactive',
          currentMethod: 'whatsapp_qr',
          sessionId: status.sessionId,
          sessionStatus: status.status,
          connectedAccount: status.connectedAccount || undefined,
          lastError: status.lastError || null,
          updatedAt: status.updatedAt || new Date().toISOString(),
          metadata: {
            semanticState:
              status.status === 'connected'
                ? 'channel_active'
                : status.status === 'qr_ready'
                ? 'awaiting_scan'
                : status.status === 'logged_out'
                ? 'session_expired'
                : status.status === 'disconnected'
                ? 'error'
                : 'method_selected',
          },
        };
        this.emitObservability({
          eventName: status.status === 'connected' ? 'session_ready' : 'session_connecting',
          timestamp: new Date().toISOString(),
          workspaceId,
          channel,
          method: 'whatsapp_qr',
          sessionId: status.sessionId,
          status: status.status,
        });
        return mapped;
      } catch (err) {
        this.emitObservability({
          eventName: 'status_refresh_failed',
          timestamp: new Date().toISOString(),
          workspaceId,
          channel,
          method: 'whatsapp_qr',
          status: 'error',
          errorCode: 'qr_status_failed',
          errorMessage: err instanceof Error ? err.message : 'unknown',
        });
        return {
          workspaceId,
          channel,
          status: 'error',
          currentMethod: 'whatsapp_qr',
          updatedAt: new Date().toISOString(),
          lastError: err instanceof Error ? err.message : 'unknown',
        };
      }
    }

    const gmail = await this.getConnectionStatus('int_gmail_01');
    const titan = await this.getConnectionStatus('int_titan_01');
    const gmailCreds = await credentialManager.getCredential('gmail', 'int_gmail_01', workspaceId, 'hub-channel-status');
    const titanCreds = await credentialManager.getCredential('titan', 'int_titan_01', workspaceId, 'hub-channel-status');
    const gmailConfigured = Boolean(gmailCreds?.refreshToken);
    const titanConfigured = Boolean((titanCreds?.password || titanCreds?.apiKey) && titanCreds?.accountEmail);
    const anyConfigured = gmailConfigured || titanConfigured;
    const tested = gmail === 'active' || titan === 'active';
    const currentMethod: ChannelMethodKey = gmail === 'active' ? 'email_gmail' : 'email_titan';
    return {
      workspaceId,
      channel,
      status: gmail === 'active' || titan === 'active' ? 'active' : gmail === 'error' || titan === 'error' ? 'error' : 'inactive',
      currentMethod,
      updatedAt: new Date().toISOString(),
      metadata: {
        semanticState: tested
          ? 'channel_active'
          : anyConfigured
          ? 'method_configured'
          : 'no_method_configured',
        methodSelected: anyConfigured,
        methodConfigured: anyConfigured,
        connectionTested: tested,
      },
    };
  }

  async setPreferredMethod(channel: HubChannel, method: ChannelMethodKey, workspaceId = this.workspaceId, module?: string): Promise<void> {
    if (module) {
      await this.setModuleBinding(module, channel, method, workspaceId);
      return;
    }

    const query = new URLSearchParams({
      workspace_id: `eq.${workspaceId}`,
      channel: `eq.${channel}`,
    });

    try {
      await restFetch('hub_channel_configs', {
        method: 'PATCH',
        query,
        body: { preferred_method: method },
      });
    } catch {
      await restFetch('hub_channel_configs', {
        method: 'POST',
        body: {
          workspace_id: workspaceId,
          channel,
          display_name: channel === 'whatsapp' ? 'WhatsApp' : 'E-mail',
          preferred_method: method,
          enabled: true,
        },
      });
    }
  }

  async setModuleBinding(module: string, channel: HubChannel, method: ChannelMethodKey, workspaceId = this.workspaceId): Promise<void> {
    const query = new URLSearchParams({
      workspace_id: `eq.${workspaceId}`,
      module: `eq.${module}`,
      channel: `eq.${channel}`,
    });

    try {
      await restFetch('hub_module_bindings', {
        method: 'PATCH',
        query,
        body: { method, enabled: true },
      });
    } catch {
      await restFetch('hub_module_bindings', {
        method: 'POST',
        body: {
          workspace_id: workspaceId,
          module,
          channel,
          method,
          enabled: true,
        },
      });
    }
  }

  private mapInboxRowToMessage(row: any): HubInboundMessage {
    return {
      id: String(row.id || crypto.randomUUID()),
      source: (row.source || 'webhook') as HubInboundMessage['source'],
      from: String(row.from || ''),
      fromName: row.from_name || undefined,
      content: String(row.content || ''),
      mediaUrl: row.media_url || undefined,
      externalId: String(row.external_id || row.id || `local-${Date.now()}`),
      conversationId: row.conversation_id || undefined,
      integrationId: String(row.integration_id || ''),
      workspaceId: String(row.workspace_id || this.workspaceId),
      receivedAt: String(row.received_at || new Date().toISOString()),
      status: (row.status || 'pending') as HubInboundMessage['status'],
      consumedBy: row.consumed_by || undefined,
      metadata: row.metadata || undefined,
    };
  }

  private mapMessageToInboxRow(message: HubInboundMessage) {
    return {
      id: message.id,
      source: message.source,
      from: message.from,
      from_name: message.fromName || null,
      content: message.content,
      media_url: message.mediaUrl || null,
      external_id: message.externalId,
      conversation_id: message.conversationId || null,
      integration_id: message.integrationId,
      workspace_id: message.workspaceId,
      received_at: message.receivedAt,
      status: message.status,
      consumed_by: message.consumedBy || null,
      metadata: message.metadata || {},
    };
  }

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
      } else if (integrationId === 'int_titan_01') {
        integrationName = 'Titan Email';
        provider = 'titan';
        const credentials = await credentialManager.getCredential('titan', 'int_titan_01', this.workspaceId, 'integration-hub');
        if ((!credentials?.password && !credentials?.apiKey) || !credentials?.accountEmail) {
          throw new Error('Titan não configurado (accountEmail/senha ausentes)');
        }
        success = await emailService.health('titan');
        summary = success ? 'Titan conectado' : 'Titan inacessível';
      } else if (integrationId === 'int_crm_ziplia_whatsapp') {
        integrationName = 'WhatsApp CRM Ziplia';
        provider = 'whatsapp';
        const qr = await this.getWhatsAppQrStatus('default');
        success = qr.status === 'connected';
        summary = success ? 'Sessão QR conectada' : `Sessão QR não conectada (${qr.status})`;
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
    const [whatsAppStatus, clickUpStatus, qrStatus] = await Promise.all([
      this.getConnectionStatus(this.whatsAppIntegrationId),
      this.getConnectionStatus(this.clickUpIntegrationId),
      this.getConnectionStatus('int_crm_ziplia_whatsapp'),
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
        status: qrStatus,
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
      if ((!credentials?.apiKey && !credentials?.password) || !credentials?.accountEmail) return 'inactive';
      return 'active';
    }

    if (integrationId === 'int_crm_ziplia_whatsapp') {
      try {
        const status = await this.getWhatsAppQrStatus('default');
        if (status.status === 'connected') return 'active';
        if (status.status === 'disconnected' || status.status === 'logged_out') return 'error';
        return 'inactive';
      } catch {
        return 'error';
      }
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

    const data = await response.json() as { sessionId: string; status: HubWhatsAppQrStatus['status']; qrDataUrl?: string | null; lastError?: string | null; connectedAccount?: string | null; updatedAt?: string };

    return {
      sessionId: data.sessionId || sessionId,
      status: data.status,
      qrDataUrl: data.qrDataUrl ?? null,
      lastError: data.lastError ?? null,
      connectedAccount: data.connectedAccount ?? null,
      updatedAt: data.updatedAt,
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
    try {
      const query = new URLSearchParams();
      query.set('select', '*');
      query.set('order', 'received_at.desc');
      query.set('limit', String(limit));
      if (integrationId) {
        query.set('integration_id', `eq.${integrationId}`);
      }

      const rows = await restFetch('hub_inbox_messages', { query }) as any[];
      return (rows || []).map((row) => this.mapInboxRowToMessage(row));
    } catch (err) {
      // fallback explícito para desenvolvimento/offline
      console.warn('[Hub] Supabase inbox indisponível, usando fallback localStorage:', err);
      const all = this.getInboxStorage();
      const filtered = integrationId
        ? all.filter((m) => m.integrationId === integrationId)
        : all;
      return filtered.slice(0, limit);
    }
  }

  // ────────── Taskzei Contract: Marcar como lida ─────────────────

  async markAsRead(messageId: string): Promise<void> {
    const messages = this.getInboxStorage();
    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) throw new Error(`Mensagem ${messageId} não encontrada`);

    messages[index].status = 'processed';
    messages[index].consumedBy = messages[index].consumedBy || 'crm_ziplia';
    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages));

    try {
      await restFetch('hub_inbox_messages', {
        method: 'PATCH',
        query: new URLSearchParams({ id: `eq.${messageId}` }),
        body: {
          status: 'processed',
          consumed_by: messages[index].consumedBy,
        },
      });
    } catch (err) {
      console.warn('[Hub] Falha ao atualizar status no Supabase, mantendo localStorage:', err);
    }

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

  async sendChannelMessage(params: {
    channel: HubChannel;
    to: string;
    message: string;
    module?: string;
    workspaceId?: string;
    emailSubject?: string;
    emailProvider?: 'gmail' | 'titan';
  }): Promise<HubSendWhatsAppMessageResult | HubMailSendResult> {
    const workspaceId = params.workspaceId || this.workspaceId;
    const channels = await this.getChannels(workspaceId);
    const channel = channels.find((c) => c.config.channel === params.channel);
    if (!channel) throw new Error(`Canal ${params.channel} não encontrado`);

    const binding = params.module
      ? channel.bindings.find((b) => b.module === params.module && b.enabled)
      : undefined;

    // module override > channel default
    const resolvedMethod = binding?.method || channel.config.preferredMethod;

    if (params.channel === 'whatsapp') {
      if (resolvedMethod === 'whatsapp_business_api') {
        return this.sendWhatsAppMessage({ to: params.to, message: params.message });
      }
      return this.sendWhatsAppQrMessage({ to: params.to, message: params.message, sessionId: 'default' });
    }

    const provider = params.emailProvider || (resolvedMethod === 'email_titan' ? 'titan' : 'gmail');
    return this.sendEmail({
      provider,
      from: 'me',
      to: [params.to],
      subject: params.emailSubject || 'Mensagem via Hub',
      textBody: params.message,
    });
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

    void (async () => {
      try {
        await restFetch('hub_inbox_messages', {
          method: 'POST',
          body: this.mapMessageToInboxRow(message),
        });
      } catch (err) {
        console.warn('[Hub] Falha ao persistir inbox no Supabase, mantendo fallback localStorage:', err);
      }
    })();
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
