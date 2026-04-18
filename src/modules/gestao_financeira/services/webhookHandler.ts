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
}

export const processWebhookNotification = async (payload: WebhookPayload) => {
  console.log(`[WebhookHandler] Evento recebido: ${payload.event}`);
  const provider = String(payload?.data?.provider || 'bank-api');
  const reference = String(payload?.data?.reference || payload?.data?.id || '').trim();

  switch (payload.event) {
    case 'payment.confirmed':
      console.log('Conciliando pagamento no Supabase...');
      if (reference) {
        const txId = await financeService.updateStatusByExternalReference({
          provider,
          reference,
          status: 'conciliado',
          dataPagamento: payload?.data?.paid_at || payload.timestamp,
          metadataPatch: {
            webhook_event: payload.event,
            webhook_timestamp: payload.timestamp
          }
        });

        await financeService.registerConciliacao({
          transacao_id: txId,
          provider,
          event_type: payload.event,
          event_id: String(payload?.data?.event_id || payload?.data?.id || ''),
          status: txId ? 'processado' : 'ignorado',
          payload: payload.data || {},
          ocorrido_em: payload.timestamp || new Date().toISOString()
        });
      }
      break;
    
    case 'transfer.failed':
      console.warn('Alerta: Transferência falhou!');
      if (reference) {
        const txId = await financeService.updateStatusByExternalReference({
          provider,
          reference,
          status: 'falhou',
          metadataPatch: {
            webhook_event: payload.event,
            webhook_timestamp: payload.timestamp,
            failure_reason: payload?.data?.reason || 'unknown'
          }
        });

        await financeService.registerConciliacao({
          transacao_id: txId,
          provider,
          event_type: payload.event,
          event_id: String(payload?.data?.event_id || payload?.data?.id || ''),
          status: txId ? 'processado' : 'erro',
          payload: payload.data || {},
          ocorrido_em: payload.timestamp || new Date().toISOString()
        });
      }
      break;

    default:
      console.log('Evento não mapeado:', payload.event);
      await financeService.registerConciliacao({
        transacao_id: null,
        provider,
        event_type: payload.event,
        event_id: String(payload?.data?.event_id || payload?.data?.id || ''),
        status: 'ignorado',
        payload: payload.data || {},
        ocorrido_em: payload.timestamp || new Date().toISOString()
      });
  }
};
