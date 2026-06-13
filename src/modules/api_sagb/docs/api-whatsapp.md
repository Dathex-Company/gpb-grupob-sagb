# API SagB — WhatsApp Cloud API Oficial

Integração oficial com Meta WhatsApp Business Platform.

Não usar:

- n8n
- WhatsApp Web
- QR Code
- robô externo

Usar em validação controlada:

- WABA
- Phone Number ID
- Cloud API oficial
- Webhook Meta
- Tokens em variáveis de ambiente
- Hub como driver
- API como borda
- Supabase como persistência

Status pré-produção: implementado para revisão no PR #4, mas não conectado em produção. O go-live depende de secrets reais no ambiente, webhook configurado no Meta Business, migration aplicada com autorização e teste real inbound/outbound.

Variáveis esperadas, sem valores:

- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_WABA_ID`
- `META_APP_ID`
- `META_APP_SECRET`

## Webhook GET

O endpoint recebe `hub.mode`, `hub.verify_token` e `hub.challenge`. Se `hub.verify_token` bater com `WHATSAPP_VERIFY_TOKEN`, retorna o challenge em texto puro. Caso contrário retorna 403.

## Webhook POST e assinatura

Em produção, o POST exige `X-Hub-Signature-256` com formato `sha256=<hmac>`. O HMAC é calculado sobre o raw body usando `META_APP_SECRET` e comparado com `timingSafeEqual`. Sem secret ou assinatura válida, o payload não é processado.

Bypass de assinatura é permitido apenas em `development`, `test` ou `sandbox` para payload simulado. A assinatura completa, tokens e secrets nunca devem ser logados nem persistidos.

## Envio de mensagem

`POST /integrations/whatsapp/send-message` exige escopo `whatsapp:send`, valida destinatário e corpo, usa `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID` e registra logs normalizados. Erros da Meta são retornados sem expor token.

Tabelas:

- `whatsapp_contacts`
- `whatsapp_conversations`
- `whatsapp_messages`
- `whatsapp_webhook_events`
- `whatsapp_delivery_status`

Consumo operacional:

- CRM Ziplia consulta conversas em `/integrations/whatsapp/conversations`.
- Núcleo Conversacional consulta mensagens em `/integrations/whatsapp/conversations/:id/messages`.
- Monitoramento consulta status e logs.
