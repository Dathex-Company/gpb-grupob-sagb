-- Migration: api_sagb_api_keys
-- Descrição: Cria a tabela de gerenciamento de API Keys para a API SagB
-- Data: 05/05/2026
-- Decision: D-005 — Formato da tabela api_keys

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL UNIQUE,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  scopes TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Índices para consulta eficiente
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_client_id ON api_keys(client_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_environment ON api_keys(environment);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at);

-- Política de segurança RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Apenas service_role (funções serverless) pode ler api_keys
CREATE POLICY api_keys_select_service ON api_keys
  FOR SELECT
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');

-- Apenas service_role pode inserir/atualizar/deletar
CREATE POLICY api_keys_insert_service ON api_keys
  FOR INSERT
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');

CREATE POLICY api_keys_update_service ON api_keys
  FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');

CREATE POLICY api_keys_delete_service ON api_keys
  FOR DELETE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin');

-- Comentários
COMMENT ON TABLE api_keys IS 'Chaves de API para autenticação na API SagB';
COMMENT ON COLUMN api_keys.key_hash IS 'Hash da chave de API (nunca armazenar o valor plano)';
COMMENT ON COLUMN api_keys.client_id IS 'Identificador único do cliente dono da chave';
COMMENT ON COLUMN api_keys.client_name IS 'Nome legível do cliente para auditoria';
COMMENT ON COLUMN api_keys.environment IS 'Ambiente: sandbox para testes, production para produção';
COMMENT ON COLUMN api_keys.scopes IS 'Lista de escopos de autorização (system:read, system:write, agents:read, agents:execute, cid:read, cid:write)';
COMMENT ON COLUMN api_keys.expires_at IS 'Data de expiração da chave (null = sem expiração)';
COMMENT ON COLUMN api_keys.last_used_at IS 'Último uso registrado da chave';
COMMENT ON COLUMN api_keys.metadata IS 'Metadados adicionais (ex: rate limit customizado, tags)';

-- Seeds de teste para ambiente sandbox
-- NOTA: Em produção, remover este bloco ou condicionar ao ambiente
INSERT INTO api_keys (key_hash, client_id, client_name, environment, scopes, active)
VALUES
  ('sgb_sandbox_admin', 'client_sandbox_admin', 'Sandbox Admin', 'sandbox', ARRAY['system:read', 'system:write', 'agents:read', 'agents:execute', 'cid:read', 'cid:write'], true),
  ('sgb_sandbox_system', 'client_sandbox_system', 'Sandbox System', 'sandbox', ARRAY['system:read', 'system:write'], true),
  ('sgb_sandbox_agents', 'client_sandbox_agents', 'Sandbox Agents', 'sandbox', ARRAY['agents:read', 'agents:execute'], true),
  ('sgb_sandbox_cid', 'client_sandbox_cid', 'Sandbox CID', 'sandbox', ARRAY['cid:read', 'cid:write'], true),
  ('sgb_sandbox_readonly', 'client_sandbox_readonly', 'Sandbox Read-Only', 'sandbox', ARRAY['system:read', 'agents:read', 'cid:read'], true)
ON CONFLICT (key_hash) DO NOTHING;

-- Seeds de produção (chaves placeholder, substituir antes do GA)
INSERT INTO api_keys (key_hash, client_id, client_name, environment, scopes, active)
VALUES
  ('sgp_prod_admin_placeholder', 'client_prod_admin', 'Production Admin', 'production', ARRAY['system:read', 'system:write', 'agents:read', 'agents:execute', 'cid:read', 'cid:write'], false)
ON CONFLICT (key_hash) DO NOTHING;
