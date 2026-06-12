# API SagB — WhatsApp Cloud API Oficial

Integração oficial com Meta WhatsApp Business Platform.

Não usar:

- n8n
- WhatsApp Web
- QR Code
- robô externo

Usar:

- WABA
- Phone Number ID
- Cloud API oficial
- Webhook Meta
- Tokens em variáveis de ambiente
- Hub como driver
- API como borda
- Supabase como persistência

Variáveis esperadas, sem valores:

- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_WABA_ID`
- `META_APP_ID`
- `META_APP_SECRET`

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

