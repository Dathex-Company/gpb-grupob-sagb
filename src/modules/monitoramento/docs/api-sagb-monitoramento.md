# Monitoramento — API SagB

Fontes oficiais para acompanhar a API SagB:

- `GET /api-sagb/v1/status` para saúde da API, Supabase, Hub, providers e WhatsApp.
- `api_audit_log` para trilha de requisições, 401, 403, erros e actions.
- `integration_logs` para execuções de providers via Hub.
- `integration_events` para eventos operacionais de webhooks/providers.
- `whatsapp_webhook_events` para payloads sanitizados recebidos da Meta.

O monitoramento não deve exibir secrets. Campos sensíveis devem permanecer mascarados.

