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
  FinanceCategoriaResumo,
  FinanceDashboardReport,
  FinanceDateRange,
  FinanceDreLine,
  FinanceKpis,
  FinanceSeriePoint,
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
  private isReceita(tx: TransacaoFinanceira): boolean {
    return tx.tipo === 'receita';
  }

  private isDespesa(tx: TransacaoFinanceira): boolean {
    return tx.tipo === 'despesa' || tx.tipo === 'pagamento' || tx.tipo === 'taxa';
  }

  private toMonthKey(dateValue?: string | null): string {
    if (!dateValue) return 'sem-data';
    const normalized = String(dateValue).slice(0, 7);
    return /^\d{4}-\d{2}$/.test(normalized) ? normalized : 'sem-data';
  }

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

  async listTransacoesByRange(range: FinanceDateRange, workspaceId = DEFAULT_WORKSPACE_ID): Promise<TransacaoFinanceira[]> {
    const q = query(
      collection(db, TABLE_TRANSACOES),
      where('workspace_id', '==', workspaceId),
      where('data_competencia', '>=', range.startDate),
      where('data_competencia', '<=', range.endDate),
      orderBy('data_competencia', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshotToArray<TransacaoFinanceira>(snapshot as SnapshotLike);
  }

  async getDashboardReport(range: FinanceDateRange, workspaceId = DEFAULT_WORKSPACE_ID): Promise<FinanceDashboardReport> {
    const rows = await this.listTransacoesByRange(range, workspaceId);

    const receitas = rows
      .filter((tx) => this.isReceita(tx))
      .reduce((acc, tx) => acc + Number(tx.valor || 0), 0);

    const despesas = rows
      .filter((tx) => this.isDespesa(tx))
      .reduce((acc, tx) => acc + Number(tx.valor || 0), 0);

    const saldo = receitas - despesas;
    const receitaCount = rows.filter((tx) => this.isReceita(tx)).length;

    const kpis: FinanceKpis = {
      receitas,
      despesas,
      saldo,
      margem: receitas > 0 ? saldo / receitas : 0,
      ticketMedioReceita: receitaCount > 0 ? receitas / receitaCount : 0
    };

    const dre: FinanceDreLine[] = [
      { code: 'RECEITA_BRUTA', label: 'Receita Bruta', valor: receitas },
      { code: 'DESPESAS_OPERACIONAIS', label: 'Despesas Operacionais', valor: despesas },
      { code: 'RESULTADO_OPERACIONAL', label: 'Resultado Operacional', valor: saldo }
    ];

    const byMonth = new Map<string, FinanceSeriePoint>();
    rows.forEach((tx) => {
      const key = this.toMonthKey(tx.data_competencia);
      const current = byMonth.get(key) || { periodo: key, receitas: 0, despesas: 0, saldo: 0 };

      const valor = Number(tx.valor || 0);
      if (this.isReceita(tx)) current.receitas += valor;
      if (this.isDespesa(tx)) current.despesas += valor;
      current.saldo = current.receitas - current.despesas;

      byMonth.set(key, current);
    });

    const serieMensal: FinanceSeriePoint[] = [...byMonth.values()].sort((a, b) => a.periodo.localeCompare(b.periodo));

    const byCategoria = new Map<string, number>();
    rows
      .filter((tx) => this.isDespesa(tx))
      .forEach((tx) => {
        const key = (tx.categoria || tx.plano_conta_codigo || 'Sem categoria').trim();
        byCategoria.set(key, (byCategoria.get(key) || 0) + Number(tx.valor || 0));
      });

    const topCategoriasDespesa: FinanceCategoriaResumo[] = [...byCategoria.entries()]
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      range,
      kpis,
      dre,
      serieMensal,
      topCategoriasDespesa
    };
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

  /**
   * Busca conciliação por event_id para verificação de idempotência
   * @param eventId ID único do evento do webhook
   * @param provider Nome do provider (ex: 'bank-api')
   * @returns ID da conciliação se encontrada, null caso contrário
   */
  async findConciliacaoByEventId(eventId: string, provider: string): Promise<string | null> {
    if (!eventId || !provider) {
      return null;
    }

    try {
      const q = query(
        collection(db, TABLE_CONCILIACOES),
        where('event_id', '==', eventId),
        where('provider', '==', provider),
        queryLimit(1)
      );
      const snapshot = await getDocs(q);
      const conciliacoes = snapshotToArray<ConciliacaoFinanceira>(snapshot as SnapshotLike);
      
      return conciliacoes.length > 0 ? conciliacoes[0].id : null;
    } catch (error) {
      console.error(`Erro ao buscar conciliação por event_id ${eventId}:`, error);
      return null;
    }
  }

  /**
   * Obtém segredo de webhook para validação de assinatura
   * @param provider Nome do provider (ex: 'bank-api')
   * @returns Segredo em texto claro ou null se não encontrado
   */
  async getWebhookSecret(provider: string): Promise<string | null> {
    try {
      const q = query(
        collection(db, TABLE_CONFIGURACOES),
        where('provider', '==', provider),
        queryLimit(1)
      );
      const snapshot = await getDocs(q);
      const configs = snapshotToArray<ConfiguracaoApiBancaria>(snapshot as SnapshotLike);
      
      if (configs.length === 0) {
        return null;
      }

      // Nota: Em produção, o segredo deve estar criptografado e precisaria ser descriptografado
      // Por enquanto, assumimos que está em texto claro para desenvolvimento
      const config = configs[0];
      return config.webhook_secret_enc || config.api_key_enc || null;
    } catch (error) {
      console.error(`Erro ao obter segredo de webhook para ${provider}:`, error);
      return null;
    }
  }

  /**
   * Registra tentativa de processamento de webhook (para logging e debugging)
   * @param eventId ID do evento
   * @param provider Nome do provider
   * @param status Status do processamento
   * @param payload Payload recebido
   * @param errorMessage Mensagem de erro (se houver)
   */
  async logWebhookAttempt(
    eventId: string,
    provider: string,
    status: 'received' | 'validated' | 'processed' | 'duplicate' | 'error',
    payload?: any,
    errorMessage?: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, TABLE_CONCILIACOES), {
        transacao_id: null,
        provider,
        event_type: 'webhook_attempt',
        event_id: eventId,
        status,
        payload: payload || {},
        error_message: errorMessage || null,
        ocorrido_em: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao registrar tentativa de webhook:', error);
    }
  }
}

export const financeService = new FinanceService();

