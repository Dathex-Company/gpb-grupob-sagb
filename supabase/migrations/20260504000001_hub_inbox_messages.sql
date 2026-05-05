-- Migration: hub_inbox_messages
-- Descrição: Tabela central para armazenar mensagens de entrada do Hub de Integrações
-- (WhatsApp, e-mail, webhooks) antes de serem consumidas pelos módulos (Taskzei, CRM, etc.)
-- Data: 2026-05-04

-- ─────────── Enum: Fonte da Mensagem ───────────

DO $$ BEGIN
  CREATE TYPE hub_inbound_source AS ENUM ('whatsapp', 'email', 'webhook');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ─────────── Enum: Status da Mensagem ───────────

DO $$ BEGIN
  CREATE TYPE hub_inbound_status AS ENUM ('pending', 'processed', 'error', 'ignored');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ─────────── Tabela: hub_inbox_messages ───────────

CREATE TABLE IF NOT EXISTS hub_inbox_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    TEXT NOT NULL DEFAULT 'default',
  source          hub_inbound_source NOT NULL,
  -- Identificação do remetente
  from_number     TEXT,                                   -- telefone (WhatsApp)
  from_email      TEXT,                                   -- e-mail do remetente (email)
  from_name       TEXT,                                   -- nome do remetente (se disponível)
  -- Conteúdo
  content         TEXT NOT NULL DEFAULT '',               -- texto da mensagem
  media_url       TEXT,                                   -- link para mídia (imagem/video/audio)
  media_type      TEXT,                                   -- mime type da mídia
  -- Metadados do provedor externo
  external_id     TEXT NOT NULL,                          -- ID da mensagem no provedor (Meta, Gmail)
  conversation_id TEXT,                                   -- ID da conversa/thread
  integration_id  TEXT NOT NULL,                          -- ID da integração no Hub (ex: int_waba_01)
  -- Processamento
  status          hub_inbound_status NOT NULL DEFAULT 'pending',
  consumed_by     TEXT,                                   -- módulo que consumiu (ex: 'taskzei', 'crm_ziplia')
  consumed_at     TIMESTAMPTZ,                            -- quando foi consumido
  error_message   TEXT,                                   -- se status = 'error', mensagem de erro
  -- Payload bruto (para debug/reprocessamento)
  raw_payload     JSONB,
  -- Metadados flexíveis
  metadata        JSONB DEFAULT '{}'::jsonb,
  -- Timestamps
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────── Índices ───────────

CREATE INDEX IF NOT EXISTS idx_hub_inbox_status      ON hub_inbox_messages (status);
CREATE INDEX IF NOT EXISTS idx_hub_inbox_source      ON hub_inbox_messages (source);
CREATE INDEX IF NOT EXISTS idx_hub_inbox_integration  ON hub_inbox_messages (integration_id);
CREATE INDEX IF NOT EXISTS idx_hub_inbox_consumed_by  ON hub_inbox_messages (consumed_by);
CREATE INDEX IF NOT EXISTS idx_hub_inbox_received_at  ON hub_inbox_messages (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_hub_inbox_external_id  ON hub_inbox_messages (external_id);
-- Índice para busca de conversas não processadas
CREATE INDEX IF NOT EXISTS idx_hub_inbox_pending_unprocessed
  ON hub_inbox_messages (received_at DESC)
  WHERE status = 'pending';

-- ─────────── Trigger: updated_at ───────────

CREATE OR REPLACE FUNCTION hub_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hub_inbox_messages_updated_at ON hub_inbox_messages;
CREATE TRIGGER trg_hub_inbox_messages_updated_at
  BEFORE UPDATE ON hub_inbox_messages
  FOR EACH ROW
  EXECUTE FUNCTION hub_update_updated_at_column();

-- ─────────── RLS (Row Level Security) ───────────

ALTER TABLE hub_inbox_messages ENABLE ROW LEVEL SECURITY;

-- Política: leitura permitida para service_role e authenticated (módulos consumidores)
CREATE POLICY "hub_inbox_select_authenticated"
  ON hub_inbox_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: inserção permitida para service_role (funções Netlify)
CREATE POLICY "hub_inbox_insert_service_role"
  ON hub_inbox_messages
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Política: update permitido para módulos consumidores (marcar como processed)
CREATE POLICY "hub_inbox_update_authenticated"
  ON hub_inbox_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────── Comentários ───────────

COMMENT ON TABLE  hub_inbox_messages IS 'Mensagens de entrada do Hub de Integrações SagB. Centraliza webhooks do WhatsApp, e-mail e outras fontes antes de serem distribuídas aos módulos consumidores.';
COMMENT ON COLUMN hub_inbox_messages.source IS 'Fonte da mensagem: whatsapp, email, webhook';
COMMENT ON COLUMN hub_inbox_messages.from_number IS 'Número de telefone do remetente (WhatsApp)';
COMMENT ON COLUMN hub_inbox_messages.from_email IS 'E-mail do remetente';
COMMENT ON COLUMN hub_inbox_messages.external_id IS 'ID único da mensagem no sistema externo (Meta message ID, Gmail message ID)';
COMMENT ON COLUMN hub_inbox_messages.consumed_by IS 'Nome do módulo que consumiu esta mensagem (ex: taskzei, crm_ziplia)';
COMMENT ON COLUMN hub_inbox_messages.status IS 'Status de processamento: pending (aguardando), processed (consumido), error (falha), ignored (ignorado)';
