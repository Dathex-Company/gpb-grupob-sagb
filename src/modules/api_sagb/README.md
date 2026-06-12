# API SagB

API SagB é a camada oficial versionada do ecossistema SagB em `/api-sagb/v1`.

Ela serve sistemas internos, módulos SagB, ferramentas externas, Hub de Integrações e WhatsApp Cloud API oficial da Meta.

## Responsabilidades

- Autenticar por API Key.
- Autorizar por escopos.
- Auditar toda chamada.
- Normalizar contratos HTTP.
- Persistir eventos e integrações no Supabase.
- Encaminhar execução externa para o Hub de Integrações.
- Expor conversas e mensagens WhatsApp para CRM Ziplia e Núcleo Conversacional.

## Não responsabilidades

- Não substitui MCP SagB para agentes.
- Não armazena secrets em código, logs ou docs.
- Não usa n8n, WhatsApp Web, QR Code ou robô externo.
- Não expõe Supabase como contrato externo.

## Endpoints principais

- `GET /api-sagb/v1/health`
- `GET /api-sagb/v1/status`
- `POST /api-sagb/v1/events`
- `GET /api-sagb/v1/events`
- `GET /api-sagb/v1/events/:id`
- `GET /api-sagb/v1/integrations`
- `GET /api-sagb/v1/integrations/:provider/status`
- `POST /api-sagb/v1/integrations/:provider/actions`
- `GET /api-sagb/v1/integrations/actions/:actionId`
- `GET /api-sagb/v1/integrations/whatsapp/webhook`
- `POST /api-sagb/v1/integrations/whatsapp/webhook`
- `POST /api-sagb/v1/integrations/whatsapp/send-message`
- `GET /api-sagb/v1/integrations/whatsapp/conversations`
- `GET /api-sagb/v1/integrations/whatsapp/conversations/:id/messages`

## Documentos

- `contracts/openapi_v1.yaml`
- `docs/api-vision.md`
- `docs/api-security.md`
- `docs/api-scopes.md`
- `docs/api-events.md`
- `docs/api-integrations.md`
- `docs/api-whatsapp.md`
- `docs/api-go-live-checklist.md`
- `docs/api-rollback.md`

