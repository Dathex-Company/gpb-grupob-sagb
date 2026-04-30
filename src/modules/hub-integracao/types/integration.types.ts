export interface Integration {
  id: string;
  name: string;
  provider: 'clickup' | 'whatsapp' | 'gmail' | 'titan' | 'meta_facebook' | 'google-calendar' | 'supabase';
  status: 'active' | 'inactive' | 'error';
  configuredAt: Date;
  lastTestedAt?: Date;
  usedBy: string[]; // IDs dos módulos que usam esta integração
  scopes?: string[];
}

export interface HubCreateTaskInput {
  title: string;
  description?: string;
  priority?: 'baixa' | 'media' | 'alta';
  status?: 'aberta' | 'em_andamento' | 'concluida';
  assigneeName?: string;
  dueDate?: string;
}

export interface HubCreateTaskResult {
  externalId: string;
  provider: 'clickup';
  integrationId: string;
  url?: string;
  status?: string;
}

export interface HubSendWhatsAppMessageInput {
  to: string;
  message: string;
}

export interface HubSendWhatsAppMessageResult {
  externalId: string;
  provider: 'whatsapp';
  integrationId: string;
  status: 'sent' | 'queued';
}

// Sprint 2 — Contrato provider-agnostic de e-mail (Gmail + Titan)
export type HubMailProvider = 'gmail' | 'titan';
export type HubMailCapability = 'mail.send' | 'mail.sync' | 'mail.health';

export interface HubMailConnectionConfig {
  integrationId: string;
  provider: HubMailProvider;
  accountEmail: string;
  scopes: string[];
  metadata?: Record<string, unknown>;
}

export interface HubMailSendInput {
  provider: HubMailProvider;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  textBody?: string;
  htmlBody?: string;
  replyTo?: string;
  externalThreadId?: string;
}

export interface HubMailSendResult {
  provider: HubMailProvider;
  integrationId: string;
  externalMessageId: string;
  externalThreadId?: string;
  acceptedAt: string;
}

export interface HubMailSyncCursor {
  provider: HubMailProvider;
  cursor?: string;
  startedAt: string;
}

export interface HubMailMessageRef {
  provider: HubMailProvider;
  integrationId: string;
  externalMessageId: string;
  externalThreadId?: string;
  from: string;
  to: string[];
  subject: string;
  snippet?: string;
  receivedAt: string;
  labels?: string[];
}

export interface HubMailSyncResult {
  provider: HubMailProvider;
  integrationId: string;
  nextCursor?: string;
  messages: HubMailMessageRef[];
}

export interface HubMailProviderContract {
  send(input: HubMailSendInput): Promise<HubMailSendResult>;
  sync(cursor: HubMailSyncCursor): Promise<HubMailSyncResult>;
  health(): Promise<boolean>;
}

export interface ConnectionConfig {
  integrationId: string;
  credentials: Record<string, string>;
  settings?: Record<string, any>;
}

export interface IntegrationServiceContract {
  getClient(provider: string): Promise<any>;
  testConnection(integrationId: string): Promise<boolean>;
  listIntegrations(): Promise<Integration[]>;
  getConnectionStatus(integrationId: string): Promise<'active' | 'inactive' | 'error'>;
  createTaskViaClickUp(input: HubCreateTaskInput): Promise<HubCreateTaskResult>;
  sendWhatsAppMessage(input: HubSendWhatsAppMessageInput): Promise<HubSendWhatsAppMessageResult>;
}
