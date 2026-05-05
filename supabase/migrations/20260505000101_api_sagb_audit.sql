-- Migration: api_sagb_audit
-- Descrição: Cria a tabela de auditoria para rastrear chamadas da API SagB
-- Data: 05/05/2026

CREATE TABLE IF NOT EXISTS api_audit_log (
  id BIGSERIAL PRIMARY KEY,
  request_id UUID NOT NULL,
  client_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  status_code INT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  duration_ms INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consulta
CREATE INDEX IF NOT EXISTS idx_api_audit_request_id ON api_audit_log(request_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_client_id ON api_audit_log(client_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_created_at ON api_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_audit_method_path ON api_audit_log(method, path);
CREATE INDEX IF NOT EXISTS idx_api_audit_env_status ON api_audit_log(environment, status_code);

-- Política de segurança: apenas leitura para clientes autenticados
ALTER TABLE api_audit_log ENABLE ROW LEVEL SECURITY;

-- Clientes autenticados podem ver seus próprios logs
CREATE POLICY audit_select_own ON api_audit_log
  FOR SELECT
  USING (client_id = current_setting('request.jwt.claims', true)::json->>'client_id');

-- Apenas admin pode inserir (via backend serverless)
CREATE POLICY audit_insert_admin ON api_audit_log
  FOR INSERT
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_admin'
  );

-- Retenção: manter 90 dias (job externo ou trigger)
COMMENT ON TABLE api_audit_log IS 'Registro de auditoria de requisições da API SagB';
COMMENT ON COLUMN api_audit_log.request_id IS 'UUID único de rastreamento (X-Request-Id)';
COMMENT ON COLUMN api_audit_log.client_id IS 'Identificador do cliente autenticado';
COMMENT ON COLUMN api_audit_log.duration_ms IS 'Tempo total de processamento em milissegundos';
