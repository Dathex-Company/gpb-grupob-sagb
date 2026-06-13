# API SagB — Events API

Eventos permitem registrar fatos universais do SagB.

Na revisão pré-produção, o payload mínimo obrigatório inclui `event_type`, `source.type`, `source.id`, `context.type`, `context.id`, `resource.type` e `resource.id`. Payload inválido retorna 400.

Payload mínimo:

```json
{
  "event_type": "string",
  "source": { "type": "module", "id": "crm_ziplia" },
  "context": { "type": "conversation", "id": "uuid" },
  "resource": { "type": "whatsapp_message", "id": "wamid" },
  "payload": {},
  "metadata": {}
}
```

Persistência: `api_events`.

Dados sensíveis em `payload` e `metadata` são sanitizados antes da persistência e da auditoria.

Escopos:

- Escrita: `events:write`
- Leitura: `events:read`
