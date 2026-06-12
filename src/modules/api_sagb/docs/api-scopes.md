# API SagB — Escopos

Escopos oficiais:

- `system:read`
- `system:write`
- `api:read`
- `api:write`
- `api:audit:read`
- `events:read`
- `events:write`
- `integrations:read`
- `integrations:execute`
- `integrations:admin`
- `whatsapp:read`
- `whatsapp:write`
- `whatsapp:webhook`
- `whatsapp:send`
- `whatsapp:admin`
- `crm:read`
- `crm:write`
- `messages:read`
- `messages:write`

Endpoints webhook da Meta são públicos para a Meta, mas protegidos por `WHATSAPP_VERIFY_TOKEN` no GET e validação/sanitização/auditoria no POST.

