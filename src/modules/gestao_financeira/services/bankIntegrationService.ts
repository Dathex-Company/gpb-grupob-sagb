/**
 * Bank Integration Service
 * Responsável por conectar o SagB com APIs Bancárias (Open Finance / BaaS).
 * @author Yasmin Rangel
 */

import { financeService } from './financeService';

export interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  account_code: string;
  status: 'pending' | 'completed' | 'failed';
}

export class BankIntegrationService {
  private static instance: BankIntegrationService;

  private constructor() {}

  public static getInstance(): BankIntegrationService {
    if (!BankIntegrationService.instance) {
      BankIntegrationService.instance = new BankIntegrationService();
    }
    return BankIntegrationService.instance;
  }

  /**
   * Sincroniza transações de um período específico.
   * Pronto para integração com Asaas, Cora, Inter, etc.
   */
  async syncTransactions(startDate: Date, endDate: Date, provider = 'bank-api'): Promise<BankTransaction[]> {
    console.log(`[BankService] Sincronizando ${provider} de ${startDate.toISOString()} até ${endDate.toISOString()}`);

    const synced = await financeService.syncFromProvider(provider, startDate, endDate);
    return synced.map((tx) => ({
      id: tx.id,
      date: tx.data_pagamento || tx.data_competencia,
      amount: tx.valor,
      description: tx.descricao,
      account_code: tx.plano_conta_codigo || '',
      status:
        tx.status === 'falhou'
          ? 'failed'
          : tx.status === 'pendente'
          ? 'pending'
          : 'completed'
    }));
  }

  /**
   * Registra um Webhook na API Bancária.
   */
  async registerWebhook(targetUrl: string, provider = 'bank-api', webhookSecret?: string): Promise<boolean> {
    console.log(`[BankService] Registrando webhook para ${provider}: ${targetUrl}`);

    await financeService.upsertIntegracaoConfig(provider, {
      webhook_url: targetUrl,
      webhook_secret_enc: webhookSecret || null,
      sync_enabled: true,
      status: 'active'
    });

    return true;
  }

  async connectProvider(params: {
    provider: string;
    baseUrl: string;
    apiKey: string;
    webhookUrl?: string;
    webhookSecret?: string;
  }) {
    await financeService.upsertIntegracaoConfig(params.provider, {
      base_url: params.baseUrl,
      api_key_enc: params.apiKey,
      webhook_url: params.webhookUrl || null,
      webhook_secret_enc: params.webhookSecret || null,
      sync_enabled: true,
      status: 'active'
    });
  }
}

export const bankService = BankIntegrationService.getInstance();
