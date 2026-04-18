import {
  addDoc,
  collection,
  db,
  doc,
  getDocs,
  limit as queryLimit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from '../../../../services/supabase';
import {
  ConciliacaoFinanceira,
  ConfiguracaoApiBancaria,
  CreateTransacaoInput,
  PlanoConta,
  TransacaoFinanceira
} from '../types/finance.types';

const TABLE_PLANO_CONTAS = 'finance.plano_de_contas';
const TABLE_TRANSACOES = 'finance.transacoes';
const TABLE_CONFIGURACOES = 'finance.configuracoes_api';
const TABLE_CONCILIACOES = 'finance.conciliacoes';

const DEFAULT_WORKSPACE_ID = 'default-workspace';

type SnapshotLike = {
  docs?: Array<{ id: string; data: () => any }>;
  forEach?: (cb: (doc: { id: string; data: () => any }) => void) => void;
};

const snapshotToArray = <T>(snapshot: SnapshotLike): T[] => {
  if (Array.isArray(snapshot?.docs)) {
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data?.() || {}) } as T));
  }

  const buffer: T[] = [];
  if (typeof snapshot?.forEach === 'function') {
    snapshot.forEach((d) => {
      buffer.push({ id: d.id, ...(d.data?.() || {}) } as T);
    });
  }
  return buffer;
};

export class FinanceService {
  async listPlanoDeContas(): Promise<PlanoConta[]> {
    const q = query(collection(db, TABLE_PLANO_CONTAS), orderBy('codigo', 'asc'));
    const snapshot = await getDocs(q);
    return snapshotToArray<PlanoConta>(snapshot as SnapshotLike);
  }

  subscribePlanoDeContas(cb: (accounts: PlanoConta[]) => void) {
    const q = query(collection(db, TABLE_PLANO_CONTAS), orderBy('codigo', 'asc'));
    return onSnapshot(q, (snapshot) => cb(snapshotToArray<PlanoConta>(snapshot as SnapshotLike)));
  }

  subscribeTransacoes(cb: (items: TransacaoFinanceira[]) => void, workspaceId = DEFAULT_WORKSPACE_ID, take = 50) {
    const q = query(
      collection(db, TABLE_TRANSACOES),
      where('workspace_id', '==', workspaceId),
      orderBy('created_at', 'desc'),
      queryLimit(take)
    );
    return onSnapshot(q, (snapshot) => cb(snapshotToArray<TransacaoFinanceira>(snapshot as SnapshotLike)));
  }

  async createTransacao(input: CreateTransacaoInput): Promise<string> {
    const payload = {
      workspace_id: input.workspace_id || DEFAULT_WORKSPACE_ID,
      origem: input.origem || 'manual',
      tipo: input.tipo,
      status: input.status || 'pendente',
      descricao: input.descricao,
      valor: input.valor,
      moeda: input.moeda || 'BRL',
      data_competencia: input.data_competencia,
      data_pagamento: input.data_pagamento || null,
      plano_conta_id: input.plano_conta_id || null,
      plano_conta_codigo: input.plano_conta_codigo || null,
      categoria: input.categoria || null,
      contraparte: input.contraparte || null,
      referencia_externa: input.referencia_externa || null,
      integracao_provider: input.integracao_provider || null,
      metadata: input.metadata || {},
      created_by: input.created_by || null
    };

    const ref = await addDoc(collection(db, TABLE_TRANSACOES), payload as any);
    return ref.id;
  }

  async updateStatusByExternalReference(params: {
    provider: string;
    reference: string;
    status: string;
    metadataPatch?: Record<string, unknown>;
    dataPagamento?: string;
  }) {
    const q = query(
      collection(db, TABLE_TRANSACOES),
      where('integracao_provider', '==', params.provider),
      where('referencia_externa', '==', params.reference),
      queryLimit(1)
    );
    const snapshot = await getDocs(q);
    const items = snapshotToArray<TransacaoFinanceira>(snapshot as SnapshotLike);
    if (!items.length) return null;

    const tx = items[0];
    await updateDoc(doc(db, TABLE_TRANSACOES, tx.id), {
      status: params.status,
      data_pagamento: params.dataPagamento || tx.data_pagamento || null,
      metadata: {
        ...(tx.metadata || {}),
        ...(params.metadataPatch || {})
      }
    } as any);
    return tx.id;
  }

  async registerConciliacao(entry: Omit<ConciliacaoFinanceira, 'id' | 'created_at'>): Promise<string> {
    const payload = {
      transacao_id: entry.transacao_id || null,
      provider: entry.provider,
      event_type: entry.event_type,
      event_id: entry.event_id || null,
      status: entry.status,
      payload: entry.payload || {},
      ocorrido_em: entry.ocorrido_em
    };
    const ref = await addDoc(collection(db, TABLE_CONCILIACOES), payload as any);
    return ref.id;
  }

  async getIntegracaoConfig(provider: string): Promise<ConfiguracaoApiBancaria | null> {
    const q = query(
      collection(db, TABLE_CONFIGURACOES),
      where('provider', '==', provider),
      queryLimit(1)
    );
    const snapshot = await getDocs(q);
    const items = snapshotToArray<ConfiguracaoApiBancaria>(snapshot as SnapshotLike);
    return items[0] || null;
  }

  async upsertIntegracaoConfig(provider: string, patch: Partial<ConfiguracaoApiBancaria>) {
    const current = await this.getIntegracaoConfig(provider);
    if (!current) {
      const ref = await addDoc(collection(db, TABLE_CONFIGURACOES), {
        provider,
        base_url: patch.base_url || null,
        api_key_enc: patch.api_key_enc || null,
        webhook_secret_enc: patch.webhook_secret_enc || null,
        webhook_url: patch.webhook_url || null,
        status: patch.status || 'inactive',
        sync_enabled: patch.sync_enabled ?? false,
        last_sync_at: patch.last_sync_at || null,
        metadata: patch.metadata || {}
      } as any);
      return ref.id;
    }

    await updateDoc(doc(db, TABLE_CONFIGURACOES, current.id), {
      ...patch,
      provider
    } as any);
    return current.id;
  }

  async syncFromProvider(provider: string, startDate: Date, endDate: Date): Promise<TransacaoFinanceira[]> {
    const config = await this.getIntegracaoConfig(provider);
    if (!config || !config.sync_enabled || config.status !== 'active' || !config.base_url) {
      throw new Error(`Integração ${provider} não está ativa para sincronização.`);
    }

    const params = new URLSearchParams({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });

    const response = await fetch(`${config.base_url.replace(/\/$/, '')}/transactions?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(config.api_key_enc ? { Authorization: `Bearer ${config.api_key_enc}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`Falha ao sincronizar ${provider}: HTTP ${response.status}`);
    }

    const json = await response.json().catch(() => ({}));
    const incoming: any[] = Array.isArray(json) ? json : Array.isArray(json?.transactions) ? json.transactions : [];

    const synced: TransacaoFinanceira[] = [];
    for (const item of incoming) {
      const reference = String(item.reference_id || item.id || '').trim();
      if (!reference) continue;

      const existingId = await this.updateStatusByExternalReference({
        provider,
        reference,
        status: String(item.status || 'pendente'),
        dataPagamento: item.paid_at || null,
        metadataPatch: { sync_source: provider, sync_payload: item }
      });

      if (!existingId) {
        await this.createTransacao({
          origem: 'bank',
          tipo: item.type || 'pagamento',
          status: item.status || 'pendente',
          descricao: item.description || `Transação ${provider}`,
          valor: Number(item.amount || 0),
          data_competencia: String(item.competence_date || new Date().toISOString().slice(0, 10)),
          data_pagamento: item.paid_at || null,
          referencia_externa: reference,
          integracao_provider: provider,
          plano_conta_codigo: item.account_code || null,
          metadata: { sync_source: provider, sync_payload: item }
        });
      }
    }

    await this.upsertIntegracaoConfig(provider, {
      last_sync_at: new Date().toISOString(),
      status: 'active'
    });

    const q = query(
      collection(db, TABLE_TRANSACOES),
      where('integracao_provider', '==', provider),
      orderBy('updated_at', 'desc'),
      queryLimit(100)
    );
    const snapshot = await getDocs(q);
    synced.push(...snapshotToArray<TransacaoFinanceira>(snapshot as SnapshotLike));
    return synced;
  }
}

export const financeService = new FinanceService();

