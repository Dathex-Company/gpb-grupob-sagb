/**
 * Webhook Endpoint Handler
 * Handler HTTP para receber webhooks de providers bancários.
 * @author Yasmin Rangel
 */

import { WebhookValidator, ValidationResult } from './webhookValidator';
import { financeService } from './financeService';
import { processWebhookNotification } from './webhookHandler';

export interface WebhookResponse {
  status: number;
  body: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * Processa requisição de webhook HTTP
 * @param request Objeto Request HTTP
 * @returns Resposta HTTP
 */
export async function handleFinanceWebhook(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  console.log(`[Webhook ${requestId}] Recebida requisição ${request.method} ${request.url}`);

  try {
    // 1. Verificar método HTTP
    if (request.method !== 'POST') {
      return createResponse(405, {
        error: 'Method not allowed',
        message: 'Only POST method is supported'
      });
    }

    // 2. Extrair headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 3. Extrair payload
    let payloadString: string;
    try {
      payloadString = await request.text();
    } catch (error) {
      return createResponse(400, {
        error: 'Invalid request body',
        message: 'Could not read request body'
      });
    }

    // 4. Validar conteúdo JSON
    let payload: any;
    try {
      payload = JSON.parse(payloadString);
    } catch (error) {
      return createResponse(400, {
        error: 'Invalid JSON',
        message: 'Request body must be valid JSON'
      });
    }

    // 5. Extrair provider (padrão: 'bank-api')
    const provider = payload?.data?.provider || 'bank-api';
    const eventId = payload?.data?.event_id || payload?.data?.id || generateEventId();

    // 6. Registrar recebimento do webhook
    await financeService.logWebhookAttempt(eventId, provider, 'received', payload);

    // 7. Validar assinatura
    const validationResult = await WebhookValidator.validateWebhook(
      payloadString,
      headers,
      provider
    );

    if (!validationResult.isValid) {
      await financeService.logWebhookAttempt(
        eventId,
        provider,
        'error',
        payload,
        validationResult.error
      );
      
      return createResponse(401, {
        error: 'Unauthorized',
        message: validationResult.error || 'Invalid webhook signature'
      });
    }

    // 8. Registrar validação bem-sucedida
    await financeService.logWebhookAttempt(eventId, provider, 'validated', payload);

    // 9. Verificar idempotência
    const existingConciliacaoId = await financeService.findConciliacaoByEventId(eventId, provider);
    if (existingConciliacaoId) {
      console.log(`[Webhook ${requestId}] Evento duplicado ${eventId}, conciliação ${existingConciliacaoId}`);
      
      await financeService.logWebhookAttempt(eventId, provider, 'duplicate', payload);
      
      return createResponse(200, {
        status: 'already_processed',
        message: 'Event already processed',
        conciliacao_id: existingConciliacaoId,
        event_id: eventId
      });
    }

    // 10. Processar evento
    console.log(`[Webhook ${requestId}] Processando evento: ${payload.event}, provider: ${provider}`);
    
    try {
      await processWebhookNotification(payload);
      
      // 11. Registrar processamento bem-sucedido
      await financeService.logWebhookAttempt(eventId, provider, 'processed', payload);
      
      const processingTime = Date.now() - startTime;
      console.log(`[Webhook ${requestId}] Processado com sucesso em ${processingTime}ms`);
      
      return createResponse(200, {
        status: 'processed',
        message: 'Webhook processed successfully',
        event_id: eventId,
        processing_time_ms: processingTime
      });
    } catch (processingError) {
      // 12. Registrar erro no processamento
      const errorMessage = processingError instanceof Error ? processingError.message : String(processingError);
      console.error(`[Webhook ${requestId}] Erro ao processar evento:`, processingError);
      
      await financeService.logWebhookAttempt(
        eventId,
        provider,
        'error',
        payload,
        errorMessage
      );
      
      return createResponse(500, {
        error: 'Processing error',
        message: errorMessage,
        event_id: eventId,
        request_id: requestId
      });
    }

  } catch (unexpectedError) {
    // 13. Tratar erros inesperados
    const errorMessage = unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError);
    console.error(`[Webhook ${requestId}] Erro inesperado:`, unexpectedError);
    
    const processingTime = Date.now() - startTime;
    
    return createResponse(500, {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      request_id: requestId,
      processing_time_ms: processingTime
    });
  }
}

/**
 * Cria resposta HTTP padronizada
 */
function createResponse(status: number, body: Record<string, any>): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Processed-At': new Date().toISOString()
    }
  });
}

/**
 * Gera ID único para a requisição
 */
function generateRequestId(): string {
  return `wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Gera ID de evento se não fornecido
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Handler para uso com Vite dev server ou servidores simples
 * @param req Objeto Request
 * @param res Objeto Response (opcional, para ambientes específicos)
 */
export async function webhookHttpHandler(
  req: Request,
  res?: any
): Promise<Response> {
  // Esta função é um wrapper para compatibilidade com diferentes ambientes
  return handleFinanceWebhook(req);
}

/**
 * Testa a validação de assinatura com payload de exemplo
 * @param secret Segredo para teste
 * @returns Resultado do teste
 */
export async function testWebhookValidation(secret: string): Promise<{
  isValid: boolean;
  signatureMatch: boolean;
  testPayload: any;
}> {
  const testPayload = {
    event: 'payment.confirmed',
    data: {
      id: 'test_123',
      event_id: 'test_123',
      reference: 'tx_test_456',
      provider: 'bank-api',
      paid_at: new Date().toISOString(),
      amount: 100.50,
      currency: 'BRL'
    },
    timestamp: new Date().toISOString()
  };

  const payloadString = JSON.stringify(testPayload);
  
  // Calcular assinatura
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payloadString);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Validar
  const headers = {
    'X-Webhook-Signature': signatureHex,
    'X-Webhook-Timestamp': new Date().toISOString()
  };

  const result = await WebhookValidator.validateWebhook(
    payloadString,
    headers,
    'bank-api'
  );

  return {
    isValid: result.isValid,
    signatureMatch: result.isValid,
    testPayload
  };
}