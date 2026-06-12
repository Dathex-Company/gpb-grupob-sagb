-- Migration: api_sagb_final_integrations
-- Description: hardening API SagB v1, Events API, Integration API and WhatsApp Cloud persistence.
-- Safe to apply after explicit production authorization. No secrets are stored here.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- API keys hardening
-- -----------------------------------------------------------------------------
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;

UPDATE api_keys
SET key_hash = encode(digest(key_hash, 'sha256'), 'hex')
WHERE key_hash !~ '^[a-f0-9]{64}$';

UPDATE api_keys
SET scopes = ARRAY[
  'system:read','system:write','api:read','api:write','api:audit:read',
  'events:read','events:write','integrations:read','integrations:execute','integrations:admin',
  'whatsapp:read','whatsapp:write','whatsapp:webhook','whatsapp:send','whatsapp:admin',
  'crm:read','crm:write','messages:read','messages:write'
]
WHERE client_id = 'client_sandbox_admin' AND environment = 'sandbox';

COMMENT ON COLUMN api_keys.revoked_at IS 'When set, the API key is revoked and must return 401.';
COMMENT ON COLUMN api_keys.scopes IS 'Official API SagB scopes: system, api, audit, events, integrations, whatsapp, crm, messages and legacy scopes.';

-- -----------------------------------------------------------------------------
-- Audit log enrichment
-- -----------------------------------------------------------------------------
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS actor_id TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS actor_type TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS error_code TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS ip_hash TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS user_agent_hash TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS resource_id TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE api_audit_log ADD COLUMN IF NOT EXISTS provider TEXT;

CREATE INDEX IF NOT EXISTS idx_api_audit_provider ON api_audit_log(provider);
CREATE INDEX IF NOT EXISTS idx_api_audit_action ON api_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_api_audit_error_code ON api_audit_log(error_code);

-- -----------------------------------------------------------------------------
-- Universal Events API
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  client_id TEXT,
  event_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  context_type TEXT,
  context_id TEXT,
  resource_type TEXT,
  resource_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_events_event_type ON api_events(event_type);
CREATE INDEX IF NOT EXISTS idx_api_events_source ON api_events(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_api_events_context ON api_events(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_api_events_resource ON api_events(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_api_events_created_at ON api_events(created_at DESC);

ALTER TABLE api_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY api_events_service_all ON api_events
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin')
    WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- Integration API logs/events
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  request_id UUID,
  client_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  response JSONB NOT NULL DEFAULT '{}',
  error_code TEXT,
  error_message TEXT,
  duration_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_logs_provider ON integration_logs(provider);
CREATE INDEX IF NOT EXISTS idx_integration_logs_request ON integration_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created_at ON integration_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_events_provider ON integration_events(provider);
CREATE INDEX IF NOT EXISTS idx_integration_events_created_at ON integration_events(created_at DESC);

ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY integration_logs_service_all ON integration_logs
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin')
    WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY integration_events_service_all ON integration_events
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin')
    WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- WhatsApp Cloud API persistence
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  name TEXT,
  wa_id TEXT UNIQUE,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES whatsapp_contacts(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to TEXT,
  origin TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES whatsapp_conversations(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES whatsapp_contacts(id) ON DELETE SET NULL,
  provider_message_id TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  type TEXT NOT NULL,
  text TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT,
  sent_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'whatsapp',
  event_type TEXT NOT NULL,
  raw_payload_sanitized JSONB NOT NULL DEFAULT '{}',
  normalized_payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN NOT NULL DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_delivery_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES whatsapp_messages(id) ON DELETE SET NULL,
  provider_message_id TEXT,
  status TEXT NOT NULL,
  timestamp TIMESTAMPTZ,
  raw_payload_sanitized JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_wa_id ON whatsapp_contacts(wa_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone ON whatsapp_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_contact ON whatsapp_conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_last ON whatsapp_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation ON whatsapp_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_provider_id ON whatsapp_messages(provider_message_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_events_created_at ON whatsapp_webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_delivery_provider_id ON whatsapp_delivery_status(provider_message_id);

ALTER TABLE whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_delivery_status ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['whatsapp_contacts','whatsapp_conversations','whatsapp_messages','whatsapp_webhook_events','whatsapp_delivery_status'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_service_all', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (current_setting(''request.jwt.claims'', true)::json->>''role'' = ''service_admin'') WITH CHECK (current_setting(''request.jwt.claims'', true)::json->>''role'' = ''service_admin'')', t || '_service_all', t);
  END LOOP;
END $$;

COMMENT ON TABLE api_events IS 'Universal Events API for modules, systems, integrations, agents and external clients.';
COMMENT ON TABLE integration_logs IS 'Normalized execution logs for Integration API actions delegated to Hub providers.';
COMMENT ON TABLE integration_events IS 'Operational events emitted by providers, webhooks and Hub execution flows.';
COMMENT ON TABLE whatsapp_contacts IS 'WhatsApp Cloud API contacts normalized from Meta webhooks and outbound sends.';
COMMENT ON TABLE whatsapp_conversations IS 'Operational WhatsApp conversations consumable by CRM Ziplia and Conversational Core.';
COMMENT ON TABLE whatsapp_messages IS 'Inbound and outbound WhatsApp messages persisted without raw secrets.';
COMMENT ON TABLE whatsapp_webhook_events IS 'Sanitized Meta webhook payloads and normalized parse result.';
COMMENT ON TABLE whatsapp_delivery_status IS 'WhatsApp message delivery/read statuses from Meta.';
