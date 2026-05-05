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

export interface HubWhatsAppQrStatus {
  sessionId: string;
  status: 'not_initialized' | 'initializing' | 'qr_ready' | 'connected' | 'disconnected' | 'logged_out';
  qrDataUrl?: string | null;
  lastError?: string | null;
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

// ────────── Webhook / Inbound ──────────

export type HubInboundSource = 'whatsapp' | 'email' | 'webhook';

export interface HubInboundMessage {
  id: string;
  source: HubInboundSource;
  from: string;
  fromName?: string;
  content: string;
  mediaUrl?: string;
  externalId: string;
  conversationId?: string;
  integrationId: string;
  workspaceId: string;
  receivedAt: string;
  status: 'pending' | 'processed' | 'error';
  consumedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface HubInboundWebhookPayload {
  source: HubInboundSource;
  integrationId: string;
  workspaceId: string;
  raw: unknown;
  parsed: {
    from: string;
    fromName?: string;
    content: string;
    mediaUrl?: string;
    externalId: string;
    conversationId?: string;
  };
}

// ────────── Activity Log ──────────

export interface HubActivityLogEntry {
  id: string;
  integrationId: string;
  integrationName: string;
  provider: string;
  action: 'test' | 'send' | 'receive' | 'config' | 'error' | 'health';
  status: 'success' | 'failure';
  summary: string;
  details?: string;
  timestamp: string;
}

// ────────── Integration Service Contract (atualizado) ──────────

export interface IntegrationServiceContract {
  getClient(provider: string): Promise<any>;
  testConnection(integrationId: string): Promise<boolean>;
  listIntegrations(): Promise<Integration[]>;
  getConnectionStatus(integrationId: string): Promise<'active' | 'inactive' | 'error'>;
  createTaskViaClickUp(input: HubCreateTaskInput): Promise<HubCreateTaskResult>;
  sendWhatsAppMessage(input: HubSendWhatsAppMessageInput): Promise<HubSendWhatsAppMessageResult>;
  connectWhatsAppQr(sessionId?: string): Promise<HubWhatsAppQrStatus>;
  getWhatsAppQrStatus(sessionId?: string): Promise<HubWhatsAppQrStatus>;
  logoutWhatsAppQr(sessionId?: string): Promise<void>;

  // Novos métodos Fase 3/4
  processInboundWebhook(payload: HubInboundWebhookPayload): Promise<HubInboundMessage>;
  getInboxMessages(integrationId?: string, limit?: number): Promise<HubInboundMessage[]>;
  markAsRead(messageId: string): Promise<void>;
  sendEmail(input: HubMailSendInput): Promise<HubMailSendResult>;
  getActivityLog(integrationId?: string, limit?: number): Promise<HubActivityLogEntry[]>;
  getCredentialAudit(limit?: number): Promise<any[]>;
  updateIntegrationConfig(integrationId: string, config: ConnectionConfig): Promise<void>;
}
