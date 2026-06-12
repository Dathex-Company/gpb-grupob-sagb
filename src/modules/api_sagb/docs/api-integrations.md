# API SagB — Integration API

A Integration API permite acionar providers sem duplicar lógica do Hub.

Providers iniciais:

- `whatsapp`
- `clickup`
- `gmail`
- `titan`
- `meta_facebook`
- `google_calendar`
- `supabase`

Regra operacional:

1. API valida payload.
2. API autentica e autoriza.
3. API audita.
4. Hub executa provider.
5. Supabase registra.
6. API normaliza resposta.

Persistência: `integration_logs` e `integration_events`.

