export type TipoTransacaoFinanceira =
  | 'despesa'
  | 'pagamento'
  | 'receita'
  | 'estorno'
  | 'transferencia'
  | 'taxa';

export type StatusTransacaoFinanceira = 'pendente' | 'pago' | 'conciliado' | 'cancelado' | 'falhou';

export type OrigemTransacaoFinanceira = 'manual' | 'bank' | 'webhook';

export interface PlanoConta {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
  natureza: 'Devedora' | 'Credora';
  parent_id?: string | null;
  ativo: boolean;
}

export interface ConfiguracaoApiBancaria {
  id: string;
  provider: string;
  base_url?: string | null;
  api_key_enc?: string | null;
  webhook_secret_enc?: string | null;
  webhook_url?: string | null;
  status: 'inactive' | 'active' | 'error';
  sync_enabled: boolean;
  last_sync_at?: string | null;
  metadata: Record<string, unknown>;
}

export interface TransacaoFinanceira {
  id: string;
  workspace_id: string;
  origem: OrigemTransacaoFinanceira;
  tipo: TipoTransacaoFinanceira;
  status: StatusTransacaoFinanceira;
  descricao: string;
  valor: number;
  moeda: string;
  data_competencia: string;
  data_pagamento?: string | null;
  plano_conta_id?: string | null;
  plano_conta_codigo?: string | null;
  categoria?: string | null;
  contraparte?: string | null;
  referencia_externa?: string | null;
  integracao_provider?: string | null;
  metadata: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConciliacaoFinanceira {
  id: string;
  transacao_id?: string | null;
  provider: string;
  event_type: string;
  event_id?: string | null;
  status: 'processado' | 'ignorado' | 'erro';
  payload: Record<string, unknown>;
  ocorrido_em: string;
  created_at: string;
}

export interface CreateTransacaoInput {
  workspace_id?: string;
  origem?: OrigemTransacaoFinanceira;
  tipo: TipoTransacaoFinanceira;
  status?: StatusTransacaoFinanceira;
  descricao: string;
  valor: number;
  moeda?: string;
  data_competencia: string;
  data_pagamento?: string | null;
  plano_conta_id?: string | null;
  plano_conta_codigo?: string | null;
  categoria?: string | null;
  contraparte?: string | null;
  referencia_externa?: string | null;
  integracao_provider?: string | null;
  metadata?: Record<string, unknown>;
  created_by?: string | null;
}

