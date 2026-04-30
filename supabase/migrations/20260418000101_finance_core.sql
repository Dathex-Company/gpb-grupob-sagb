-- =============================================================
-- Gestão Financeira (Yasmin Rangel)
-- Core: plano de contas, transações, integrações e conciliação
-- =============================================================

CREATE SCHEMA IF NOT EXISTS finance;

CREATE TABLE IF NOT EXISTS finance.plano_de_contas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  natureza TEXT NOT NULL CHECK (natureza IN ('Devedora', 'Credora')),
  parent_id UUID REFERENCES finance.plano_de_contas(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance.configuracoes_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  base_url TEXT,
  api_key_enc TEXT,
  webhook_secret_enc TEXT,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_finance_configuracoes_api_provider UNIQUE (provider)
);

CREATE TABLE IF NOT EXISTS finance.transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'default-workspace',
  origem TEXT NOT NULL DEFAULT 'manual' CHECK (origem IN ('manual', 'bank', 'webhook')),
  tipo TEXT NOT NULL CHECK (tipo IN ('despesa', 'pagamento', 'receita', 'estorno', 'transferencia', 'taxa')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'conciliado', 'cancelado', 'falhou')),
  descricao TEXT NOT NULL,
  valor NUMERIC(14,2) NOT NULL CHECK (valor >= 0),
  moeda CHAR(3) NOT NULL DEFAULT 'BRL',
  data_competencia DATE NOT NULL,
  data_pagamento TIMESTAMPTZ,
  plano_conta_id UUID REFERENCES finance.plano_de_contas(id) ON DELETE SET NULL,
  plano_conta_codigo TEXT,
  categoria TEXT,
  contraparte TEXT,
  referencia_externa TEXT,
  integracao_provider TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_finance_transacoes_referencia_externa
  ON finance.transacoes(integracao_provider, referencia_externa)
  WHERE referencia_externa IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_finance_transacoes_workspace_status
  ON finance.transacoes(workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_finance_transacoes_datas
  ON finance.transacoes(data_competencia DESC, data_pagamento DESC);

CREATE TABLE IF NOT EXISTS finance.conciliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transacao_id UUID REFERENCES finance.transacoes(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_id TEXT,
  status TEXT NOT NULL DEFAULT 'processado' CHECK (status IN ('processado', 'ignorado', 'erro')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ocorrido_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_finance_conciliacoes_evento
  ON finance.conciliacoes(provider, event_id)
  WHERE event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_finance_conciliacoes_transacao
  ON finance.conciliacoes(transacao_id, ocorrido_em DESC);

CREATE OR REPLACE FUNCTION finance.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_finance_plano_de_contas_updated_at ON finance.plano_de_contas;
CREATE TRIGGER trg_finance_plano_de_contas_updated_at
BEFORE UPDATE ON finance.plano_de_contas
FOR EACH ROW EXECUTE FUNCTION finance.touch_updated_at();

DROP TRIGGER IF EXISTS trg_finance_configuracoes_api_updated_at ON finance.configuracoes_api;
CREATE TRIGGER trg_finance_configuracoes_api_updated_at
BEFORE UPDATE ON finance.configuracoes_api
FOR EACH ROW EXECUTE FUNCTION finance.touch_updated_at();

DROP TRIGGER IF EXISTS trg_finance_transacoes_updated_at ON finance.transacoes;
CREATE TRIGGER trg_finance_transacoes_updated_at
BEFORE UPDATE ON finance.transacoes
FOR EACH ROW EXECUTE FUNCTION finance.touch_updated_at();

ALTER TABLE finance.plano_de_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.configuracoes_api ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.conciliacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS finance_plano_de_contas_auth_all ON finance.plano_de_contas;
CREATE POLICY finance_plano_de_contas_auth_all ON finance.plano_de_contas
FOR ALL USING (auth.role() IN ('authenticated', 'service_role'));

DROP POLICY IF EXISTS finance_configuracoes_api_auth_all ON finance.configuracoes_api;
CREATE POLICY finance_configuracoes_api_auth_all ON finance.configuracoes_api
FOR ALL USING (auth.role() IN ('authenticated', 'service_role'));

DROP POLICY IF EXISTS finance_transacoes_auth_all ON finance.transacoes;
CREATE POLICY finance_transacoes_auth_all ON finance.transacoes
FOR ALL USING (auth.role() IN ('authenticated', 'service_role'));

DROP POLICY IF EXISTS finance_conciliacoes_auth_all ON finance.conciliacoes;
CREATE POLICY finance_conciliacoes_auth_all ON finance.conciliacoes
FOR ALL USING (auth.role() IN ('authenticated', 'service_role'));

INSERT INTO finance.plano_de_contas (codigo, nome, tipo, natureza)
VALUES
  ('1.1.01', 'Caixa e Bancos', 'Disponibilidades', 'Devedora'),
  ('2.1.03', 'Impostos a Recolher', 'Tributário', 'Credora'),
  ('4.1.01', 'Receita de Mentorias', 'Operacional', 'Credora'),
  ('5.1.01', 'Google/Facebook Ads', 'Marketing', 'Devedora'),
  ('5.1.04', 'Taxas de Gateway/Cartão', 'Financeira', 'Devedora')
ON CONFLICT (codigo) DO NOTHING;

