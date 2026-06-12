# API SagB — Events API

Eventos permitem registrar fatos universais do SagB.

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

Escopos:

- Escrita: `events:write`
- Leitura: `events:read`

