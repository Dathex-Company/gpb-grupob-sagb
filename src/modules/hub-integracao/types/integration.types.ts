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

// ────────── Channel-Oriented Public Model (v2) ──────────

export type HubChannel = 'whatsapp' | 'email';
export type HubModuleConsumer = 'crm_ziplia' | 'taskzei' | string;

export type ChannelMethodKey =
  | 'whatsapp_qr'
  | 'whatsapp_business_api'
  | 'email_gmail'
  | 'email_titan';

export interface ConnectionMethod {
  id: string;
  workspaceId: string;
  channel: HubChannel;
  method: ChannelMethodKey;
  enabled: boolean;
  isDefault: boolean;
  displayName: string;
  providerInternal: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelConfig {
  id: string;
  workspaceId: string;
  channel: HubChannel;
  displayName: string;
  preferredMethod: ChannelMethodKey;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface ModuleBinding {
  id: string;
  workspaceId: string;
  module: HubModuleConsumer;
  channel: HubChannel;
  method: ChannelMethodKey;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface ChannelRuntimeStatus {
  workspaceId: string;
  channel: HubChannel;
  status: 'active' | 'inactive' | 'error';
  currentMethod: ChannelMethodKey;
  sessionId?: string;
  sessionStatus?: string;
  connectedAccount?: string;
  lastError?: string | null;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface HubChannelView {
  config: ChannelConfig;
  methods: ConnectionMethod[];
  runtime: ChannelRuntimeStatus;
  bindings: ModuleBinding[];
}

export interface HubObservabilityEvent {
  eventName:
    | 'qr_generated'
    | 'qr_scanned'
    | 'session_connecting'
    | 'session_ready'
    | 'session_lost'
    | 'status_refresh_failed'
    | 'message_send_failed'
    | 'provider_fallback_used';
  timestamp: string;
  workspaceId: string;
  channel: HubChannel;
  method?: string;
  sessionId?: string;
  module?: string;
  correlationId?: string;
  status?: string;
  errorCode?: string;
  errorMessage?: string;
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

export interface HubSendWhatsAppQrMessageInput {
  to: string;
  message: string;
  sessionId?: string;
}

export interface HubWhatsAppQrStatus {
  sessionId: string;
  status: 'not_initialized' | 'initializing' | 'qr_ready' | 'connected' | 'disconnected' | 'logged_out';
  qrDataUrl?: string | null;
  lastError?: string | null;
  connectedAccount?: string | null;
  updatedAt?: string;
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
  sendWhatsAppQrMessage(input: HubSendWhatsAppQrMessageInput): Promise<HubSendWhatsAppMessageResult>;
  getChannels(workspaceId?: string): Promise<HubChannelView[]>;
  getChannelStatus(channel: HubChannel, workspaceId?: string): Promise<ChannelRuntimeStatus>;
  setPreferredMethod(channel: HubChannel, method: ChannelMethodKey, workspaceId?: string, module?: string): Promise<void>;
  setModuleBinding(module: string, channel: HubChannel, method: ChannelMethodKey, workspaceId?: string): Promise<void>;
  connectWhatsAppQr(sessionId?: string): Promise<HubWhatsAppQrStatus>;
  getWhatsAppQrStatus(sessionId?: string): Promise<HubWhatsAppQrStatus>;
  logoutWhatsAppQr(sessionId?: string): Promise<void>;

  // QR Baileys
  getWhatsAppQrInbox(sessionId?: string): Promise<HubInboundMessage[]>;

  // Novos métodos Fase 3/4
  processInboundWebhook(payload: HubInboundWebhookPayload): Promise<HubInboundMessage>;
  getInboxMessages(integrationId?: string, limit?: number): Promise<HubInboundMessage[]>;
  markAsRead(messageId: string): Promise<void>;
  sendEmail(input: HubMailSendInput): Promise<HubMailSendResult>;
  getActivityLog(integrationId?: string, limit?: number): Promise<HubActivityLogEntry[]>;
  getCredentialAudit(limit?: number): Promise<any[]>;
  updateIntegrationConfig(integrationId: string, config: ConnectionConfig): Promise<void>;
}
