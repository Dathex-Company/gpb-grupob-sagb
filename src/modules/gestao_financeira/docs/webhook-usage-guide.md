# Guia de Uso: Webhook de Conciliação Financeira

## Visão Geral
O sistema de webhook permite que provedores bancários notifiquem o sistema sobre eventos financeiros em tempo real, como pagamentos confirmados ou transferências falhadas. O sistema valida a autenticidade das notificações usando assinaturas HMAC e processa os eventos para conciliar transações automaticamente.

## Arquitetura

### Componentes Principais
1. **`webhookEndpoint.ts`** - Handler HTTP que recebe requisições POST em `/api/finance/webhook`
2. **`webhookValidator.ts`** - Valida assinaturas HMAC e protege contra replay attacks
3. **`webhookHandler.ts`** - Processa eventos e atualiza transações no banco de dados
4. **`financeService.ts`** - Serviço de negócio para operações financeiras
5. **Mock Server** - Servidor de desenvolvimento para testes (`tools/webhook-mock-server.js`)

### Fluxo de Processamento
```
Provedor Bancário → POST /api/finance/webhook → Validação HMAC → Processamento → Atualização BD → Resposta HTTP
```

## Configuração

### 1. Configurar Provider no Banco de Dados
```sql
INSERT INTO finance.configuracoes_api (provider, webhook_secret, api_key, base_url, created_at)
VALUES ('bank-api', 'seu-segredo-aqui-32-chars', 'api-key-opcional', 'https://api.bank.com', NOW());
```

### 2. Configurar Proxy de Desenvolvimento (Vite)
O `vite.config.ts` já está configurado para redirecionar `/api/finance/webhook` para o mock server em desenvolvimento:
```javascript
proxy: {
  '/api/finance/webhook': 'http://localhost:3001',
  '/api/finance/test-signature': 'http://localhost:3001'
}
```

### 3. Iniciar Mock Server (Desenvolvimento)
```bash
node tools/webhook-mock-server.js
```

## Eventos Suportados

### `payment.confirmed`
**Payload esperado:**
```json
{
  "event": "payment.confirmed",
  "data": {
    "reference": "ref_123456",
    "amount": 1000.50,
    "paid_at": "2024-01-15T10:30:00Z",
    "description": "Pagamento de fatura"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "provider": "bank-api"
}
```

**Ação do sistema:** Atualiza transação com `reference` correspondente para status `conciliado`.

### `transfer.failed`
**Payload esperado:**
```json
{
  "event": "transfer.failed",
  "data": {
    "reference": "ref_789012",
    "amount": 500.00,
    "reason": "insufficient_funds",
    "failed_at": "2024-01-15T11:00:00Z"
  },
  "timestamp": "2024-01-15T11:00:00Z",
  "provider": "bank-api"
}
```

**Ação do sistema:** Atualiza transação para status `falhou` com motivo no metadata.

### `payment.created` / `transfer.created`
**Payload esperado:**
```json
{
  "event": "payment.created",
  "data": {
    "reference": "ref_new_001",
    "amount": 250.75,
    "description": "Novo pagamento",
    "account_code": "1.01.01"
  },
  "timestamp": "2024-01-15T12:00:00Z",
  "provider": "bank-api"
}
```

**Ação do sistema:** Cria nova transação se não existir com a referência.

## Testes

### 1. Testar Assinatura HMAC
```bash
curl -X POST http://localhost:5173/api/finance/test-signature \
  -H "Content-Type: application/json" \
  -d '{"payload": {"event": "payment.confirmed", "data": {"amount": 100}}, "secret": "test-secret"}'
```

### 2. Enviar Webhook de Teste
```bash
curl -X POST http://localhost:5173/api/finance/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: signature-here" \
  -H "X-Webhook-Timestamp: $(date +%s)" \
  -d '{
    "event": "payment.confirmed",
    "data": {
      "reference": "test_ref_001",
      "amount": 1000,
      "paid_at": "2024-01-15T10:30:00Z"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "provider": "bank-api"
  }'
```

### 3. Testar com Mock Server
O mock server fornece endpoints para gerar assinaturas válidas:
```bash
# Gerar assinatura para payload
curl -X POST http://localhost:3001/generate-signature \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {"event": "payment.confirmed", "data": {"amount": 100}},
    "secret": "test-secret-123"
  }'

# Enviar webhook com assinatura válida
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: generated-signature" \
  -H "X-Webhook-Timestamp: $(date +%s)" \
  -d '{
    "event": "payment.confirmed",
    "data": {"reference": "test_ref", "amount": 100},
    "timestamp": "$(date -Iseconds)"
  }'
```

## Segurança

### Validação HMAC
1. **Formato da assinatura:** `HMAC-SHA256(timestamp + "." + payload_json, secret)`
2. **Headers obrigatórios:**
   - `X-Webhook-Signature`: Assinatura HMAC em hex
   - `X-Webhook-Timestamp`: Timestamp Unix em segundos

### Proteção contra Replay Attacks
- Timestamps são validados com tolerância de 5 minutos
- Requisições fora da janela de tempo são rejeitadas

### Idempotência
- Eventos são identificados por `event_id`
- Processamento duplicado é detectado e ignorado
- Registros de conciliação mantêm histórico completo

## Monitoramento

### Logs
- Todas as tentativas de webhook são registradas em `finance.conciliacoes`
- Campos de status: `processado`, `ignorado`, `erro`
- Metadata de processamento incluído no payload

### Métricas
- Tempo de processamento por evento
- Taxa de sucesso por provider
- Eventos não reconhecidos

## Solução de Problemas

### Erro: "Signature mismatch"
1. Verificar se o segredo no banco corresponde ao usado pelo provider
2. Confirmar formato do payload (deve ser string JSON exata)
3. Verificar timestamp (deve ser o mesmo usado no cálculo da assinatura)

### Erro: "Timestamp out of range"
1. Verificar sincronização de horário entre sistemas
2. Ajustar tolerância se necessário (configurável no validator)

### Erro: "Event not supported"
1. Verificar se o nome do evento está na lista de suportados
2. Adicionar novo evento ao `webhookHandler.ts` se necessário

### Transação não encontrada
1. Verificar se `reference` no payload corresponde a `referencia_externa` na transação
2. Confirmar que o provider está correto

## Extensão do Sistema

### Adicionar Novo Provider
1. Adicionar configuração em `finance.configuracoes_api`
2. Implementar lógica específica se necessário (atualmente genérica)

### Adicionar Novo Tipo de Evento
1. Adicionar case no `switch` do `webhookHandler.ts`
2. Definir ação apropriada (criar/atualizar transação)
3. Atualizar lista de eventos suportados

### Customizar Validação
1. Estender `WebhookValidator` com regras específicas
2. Implementar validação de schema do payload

## Referências

- [Implementação do Webhook Validator](../services/webhookValidator.ts)
- [Handler de Webhook](../services/webhookHandler.ts)
- [Endpoint HTTP](../services/webhookEndpoint.ts)
- [Plano de Implementação](./webhook-implementation-plan.md)

---

*Documento mantido por Yasmin Rangel - Módulo de Gestão Financeira*