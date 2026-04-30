/**
 * Servidor Mock para Webhooks Financeiros
 * Para desenvolvimento local quando não há backend real
 * @author Yasmin Rangel
 */

import { createServer } from 'http';
import { URL } from 'url';

const PORT = 3001;

// Segredo de teste para desenvolvimento
const TEST_WEBHOOK_SECRET = 'test-secret-123456';

/**
 * Calcula HMAC-SHA256
 */
async function calculateHmacSha256(data, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const server = createServer(async (req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  console.log(`[Mock Server] ${method} ${pathname}`);

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Signature, X-Webhook-Timestamp');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Endpoint de webhook financeiro
  if (method === 'POST' && pathname === '/api/finance/webhook') {
    try {
      // Ler body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          const headers = req.headers;
          
          console.log(`[Mock Server] Recebido webhook: ${payload.event}`);
          console.log(`[Mock Server] Payload:`, JSON.stringify(payload, null, 2));

          // Simular validação de assinatura
          const signature = headers['x-webhook-signature'];
          if (signature) {
            const calculatedSignature = await calculateHmacSha256(body, TEST_WEBHOOK_SECRET);
            const isValid = signature === calculatedSignature;
            
            console.log(`[Mock Server] Assinatura válida: ${isValid}`);
          }

          // Simular processamento
          await new Promise(resolve => setTimeout(resolve, 100));

          // Responder com sucesso
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'processed',
            message: 'Webhook processed by mock server',
            timestamp: new Date().toISOString(),
            mock: true
          }));
        } catch (error) {
          console.error('[Mock Server] Erro ao processar:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Bad Request',
            message: error.message
          }));
        }
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }));
    }
    return;
  }

  // Endpoint para gerar assinatura de teste
  if (method === 'GET' && pathname === '/api/finance/test-signature') {
    try {
      const testPayload = {
        event: 'payment.confirmed',
        data: {
          id: 'test_' + Date.now(),
          event_id: 'test_' + Date.now(),
          reference: 'tx_test_' + Math.random().toString(36).substring(2, 10),
          provider: 'bank-api',
          paid_at: new Date().toISOString(),
          amount: 100.50,
          currency: 'BRL'
        },
        timestamp: new Date().toISOString()
      };

      const payloadString = JSON.stringify(testPayload, null, 2);
      const signature = await calculateHmacSha256(payloadString, TEST_WEBHOOK_SECRET);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        test_payload: testPayload,
        signature,
        secret: TEST_WEBHOOK_SECRET,
        curl_command: `curl -X POST http://localhost:${PORT}/api/finance/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Webhook-Signature: ${signature}" \\
  -d '${payloadString}'`
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // Endpoint de saúde
  if (method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'finance-webhook-mock',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 404 para outras rotas
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    message: `Route ${pathname} not found`
  }));
});

server.listen(PORT, () => {
  console.log(`✅ Servidor mock de webhooks rodando em http://localhost:${PORT}`);
  console.log(`📝 Endpoints disponíveis:`);
  console.log(`   POST /api/finance/webhook     - Receber webhooks`);
  console.log(`   GET  /api/finance/test-signature - Gerar payload de teste`);
  console.log(`   GET  /health                  - Verificar saúde`);
  console.log(`\n🔑 Segredo de teste: ${TEST_WEBHOOK_SECRET}`);
});

// Tratar encerramento gracioso
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor mock...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});