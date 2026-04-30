/**
 * Webhook Handler
 * Processa notificações enviadas por APIs externas (Supabase Edge Functions / Bancos).
 * @author Yasmin Rangel
 */

import { financeService } from './financeService';

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
  provider?: string;
}

export interface WebhookProcessingResult {
  success: boolean;
  transacaoId?: string | null;
  conciliacaoId?: string;
  eventType: string;
  provider: string;
  message: string;
  error?: string;
}

/**
 * Processa notificação de webhook
 * @param payload Payload do webhook
 * @param options Opções de processamento
 * @returns Resultado do processamento
 */
export const processWebhookNotification = async (
  payload: WebhookPayload,
  options?: { skipValidation?: boolean }
): Promise<WebhookProcessingResult> => {
  const startTime = Date.now();
  const provider = String(payload?.provider || payload?.data?.provider || 'bank-api');
  const reference = String(payload?.data?.reference || payload?.data?.id || '').trim();
  const eventId = String(payload?.data?.event_id || payload?.data?.id || `evt_${Date.now()}`);

  console.log(`[WebhookHandler] Processando evento: ${payload.event}, provider: ${provider}, event_id: ${eventId}`);

  try {
    let transacaoId: string | null = null;
    let resultMessage = '';

    switch (payload.event) {
      case 'payment.confirmed':
        console.log('Conciliando pagamento confirmado...');
        if (reference) {
          transacaoId = await financeService.updateStatusByExternalReference({
            provider,
            reference,
            status: 'conciliado',
            dataPagamento: payload?.data?.paid_at || payload.timestamp,
            metadataPatch: {
              webhook_event: payload.event,
              webhook_timestamp: payload.timestamp,
              webhook_provider: provider,
              reconciled_at: new Date().toISOString()
            }
          });

          resultMessage = transacaoId
            ? `Pagamento conciliado para transação ${transacaoId}`
            : 'Nenhuma transação encontrada para conciliar';
        } else {
          resultMessage = 'Referência não fornecida no payload';
        }
        break;
      
      case 'transfer.failed':
        console.warn('Alerta: Transferência falhou!');
        if (reference) {
          transacaoId = await financeService.updateStatusByExternalReference({
            provider,
            reference,
            status: 'falhou',
            metadataPatch: {
              webhook_event: payload.event,
              webhook_timestamp: payload.timestamp,
              webhook_provider: provider,
              failure_reason: payload?.data?.reason || 'unknown',
              failed_at: new Date().toISOString()
            }
          });

          resultMessage = transacaoId
            ? `Status atualizado para falha na transação ${transacaoId}`
            : 'Nenhuma transação encontrada para atualizar';
        } else {
          resultMessage = 'Referência não fornecida no payload';
        }
        break;

      case 'payment.created':
      case 'transfer.created':
        console.log(`Novo evento criado: ${payload.event}`);
        // Para eventos de criação, podemos criar uma nova transação se não existir
        if (reference && payload.data) {
          // Verificar se já existe transação com esta referência
          const existingId = await financeService.updateStatusByExternalReference({
            provider,
            reference,
            status: 'pendente',
            metadataPatch: {
              webhook_event: payload.event,
              webhook_timestamp: payload.timestamp,
              webhook_provider: provider
            }
          });

          if (!existingId && payload.data.amount) {
            // Criar nova transação
            const newTxId = await financeService.createTransacao({
              origem: 'bank',
              tipo: payload.event.includes('payment') ? 'pagamento' : 'transferencia',
              status: 'pendente',
              descricao: payload.data.description || `Transação ${provider}`,
              valor: Number(payload.data.amount || 0),
              data_competencia: new Date().toISOString().slice(0, 10),
              data_pagamento: null,
              referencia_externa: reference,
              integracao_provider: provider,
              plano_conta_codigo: payload.data.account_code || null,
              metadata: {
                webhook_event: payload.event,
                webhook_timestamp: payload.timestamp,
                webhook_provider: provider,
                created_via_webhook: true
              }
            });
            transacaoId = newTxId;
            resultMessage = `Nova transação criada: ${newTxId}`;
          } else {
            transacaoId = existingId;
            resultMessage = existingId
              ? `Transação existente atualizada: ${existingId}`
              : 'Dados insuficientes para criar transação';
          }
        }
        break;

      default:
        console.log(`Evento não mapeado: ${payload.event}`);
        resultMessage = `Evento '${payload.event}' não é suportado`;
    }

    // Registrar conciliação independentemente do resultado
    const conciliacaoId = await financeService.registerConciliacao({
      transacao_id: transacaoId,
      provider,
      event_type: payload.event,
      event_id: eventId,
      status: transacaoId ? 'processado' : 'ignorado',
      payload: {
        ...(payload.data || {}),
        _processing_metadata: {
          processing_time_ms: Date.now() - startTime,
          reference_matched: !!reference,
          result_message: resultMessage
        }
      },
      ocorrido_em: payload.timestamp || new Date().toISOString()
    });

    const processingTime = Date.now() - startTime;
    console.log(`[WebhookHandler] Processamento concluído em ${processingTime}ms: ${resultMessage}`);

    return {
      success: !!transacaoId || ['payment.confirmed', 'transfer.failed'].includes(payload.event) ? !!reference : true,
      transacaoId,
      conciliacaoId,
      eventType: payload.event,
      provider,
      message: resultMessage
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[WebhookHandler] Erro ao processar webhook:`, error);

    // Registrar conciliação de erro
    await financeService.registerConciliacao({
      transacao_id: null,
      provider,
      event_type: payload.event,
      event_id: eventId,
      status: 'erro',
      payload: {
        ...(payload.data || {}),
        _error_metadata: {
          error: errorMessage,
          processing_time_ms: Date.now() - startTime
        }
      },
      ocorrido_em: new Date().toISOString()
    });

    return {
      success: false,
      eventType: payload.event,
      provider,
      message: `Erro ao processar webhook: ${errorMessage}`,
      error: errorMessage
    };
  }
};

/**
 * Valida se um evento de webhook é suportado
 * @param event Nome do evento
 * @returns true se o evento é suportado
 */
export function isSupportedWebhookEvent(event: string): boolean {
  const supportedEvents = [
    'payment.confirmed',
    'transfer.failed',
    'payment.created',
    'transfer.created',
    'payment.refunded',
    'transfer.completed'
  ];
  return supportedEvents.includes(event);
}

/**
 * Obtém descrição amigável para um tipo de evento
 * @param event Nome do evento
 * @returns Descrição do evento
 */
export function getEventDescription(event: string): string {
  const descriptions: Record<string, string> = {
    'payment.confirmed': 'Pagamento confirmado',
    'transfer.failed': 'Transferência falhou',
    'payment.created': 'Pagamento criado',
    'transfer.created': 'Transferência criada',
    'payment.refunded': 'Pagamento reembolsado',
    'transfer.completed': 'Transferência concluída'
  };
  return descriptions[event] || `Evento: ${event}`;
}

/**
 * Processa múltiplos webhooks em lote
 * @param payloads Array de payloads de webhook
 * @returns Resultados do processamento
 */
export async function processWebhookBatch(
  payloads: WebhookPayload[]
): Promise<WebhookProcessingResult[]> {
  const results: WebhookProcessingResult[] = [];
  
  for (const payload of payloads) {
    const result = await processWebhookNotification(payload);
    results.push(result);
  }
  
  return results;
}
