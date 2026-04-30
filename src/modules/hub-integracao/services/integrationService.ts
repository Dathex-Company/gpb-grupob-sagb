import {
  HubCreateTaskInput,
  HubCreateTaskResult,
  HubSendWhatsAppMessageInput,
  HubSendWhatsAppMessageResult,
  Integration,
  IntegrationServiceContract
} from '../types/integration.types';
import { clickUpDriver } from './clickupService';
import { credentialManager } from './credentialManager';
import { whatsAppDriver } from './whatsappService';

export class IntegrationHubService implements IntegrationServiceContract {
  private readonly clickUpIntegrationId = 'int_clickup_01';
  private readonly whatsAppIntegrationId = 'int_waba_01';
  private readonly workspaceId = 'default';

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
      {
        apiToken: token,
        listId
      },
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
      {
        accessToken,
        phoneNumberId
      },
      'integration-hub-bootstrap'
    );
  }

  async getClient(provider: string): Promise<any> {
    console.log(`[Hub] Solicitado cliente para: ${provider}`);
    throw new Error(`Not implemented: Driver para ${provider} ainda não disponível`);
  }

  async testConnection(integrationId: string): Promise<boolean> {
    console.log(`[Hub] Testando conexão: ${integrationId}`);
    return true; // Mock placeholder
  }

  async listIntegrations(): Promise<Integration[]> {
    return [
      {
        id: 'int_clickup_01',
        name: 'ClickUp Oficial',
        provider: 'clickup',
        status: 'inactive', // Placeholder
        configuredAt: new Date(),
        usedBy: ['taskzei']
      },
      {
        id: 'int_waba_01',
        name: 'WhatsApp API',
        provider: 'whatsapp',
        status: 'inactive', // Placeholder
        configuredAt: new Date(),
        usedBy: ['crm_ziplia']
      }
    ];
  }

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

    return 'inactive';
  }

  async createTaskViaClickUp(input: HubCreateTaskInput): Promise<HubCreateTaskResult> {
    await this.ensureDevClickUpCredentials();
    const credentials = await credentialManager.getCredential('clickup', this.clickUpIntegrationId, this.workspaceId, 'integration-hub');

    if (!credentials?.apiToken || !credentials?.listId) {
      throw new Error('ClickUp não configurado no Hub. Salve apiToken e listId nas credenciais da integração int_clickup_01.');
    }

    const result = await clickUpDriver.createTask(
      {
        apiToken: credentials.apiToken,
        listId: credentials.listId
      },
      input
    );

    return {
      externalId: result.id,
      provider: 'clickup',
      integrationId: this.clickUpIntegrationId,
      url: result.url,
      status: result.status
    };
  }

  async sendWhatsAppMessage(input: HubSendWhatsAppMessageInput): Promise<HubSendWhatsAppMessageResult> {
    await this.ensureDevWhatsAppCredentials();
    const credentials = await credentialManager.getCredential('whatsapp', this.whatsAppIntegrationId, this.workspaceId, 'integration-hub');

    if (!credentials?.accessToken || !credentials?.phoneNumberId) {
      throw new Error('WhatsApp não configurado no Hub. Salve accessToken e phoneNumberId nas credenciais da integração int_waba_01.');
    }

    const result = await whatsAppDriver.sendMessage(
      {
        accessToken: credentials.accessToken,
        phoneNumberId: credentials.phoneNumberId
      },
      input
    );

    return {
      externalId: result.messageId,
      provider: 'whatsapp',
      integrationId: this.whatsAppIntegrationId,
      status: result.status
    };
  }
}

export const integrationHub = new IntegrationHubService();
