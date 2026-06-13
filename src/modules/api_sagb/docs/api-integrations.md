# API SagB — Integration API

A Integration API permite acionar providers sem duplicar lógica do Hub.

Providers iniciais e status pré-produção:

- `whatsapp`: implementado para validação com ponte temporária serverless -> Meta Cloud API; produção exige `META_APP_SECRET`, assinatura webhook válida e credenciais reais.
- `clickup`: driver Hub existe no código, mas execução server-side depende de credenciais e adaptação segura do Hub.
- `gmail`: provider cadastrado; execução depende de credenciais/driver Hub server-side.
- `titan`: provider cadastrado; execução depende de credenciais/driver Hub server-side.
- `meta_facebook`: provider cadastrado; driver de ações pendente.
- `google_calendar`: provider cadastrado; driver de ações pendente.
- `supabase`: provider de persistência/status; depende de env e migration controlada.

Regra operacional:

1. API valida payload.
2. API autentica e autoriza.
3. API audita.
4. Hub executa provider quando houver driver server-safe e credenciais configuradas.
5. Supabase registra.
6. API normaliza resposta.

Status possíveis retornados por provider:

- `configured`: credenciais mínimas presentes e caminho técnico disponível para validação.
- `partially_configured`: parte das credenciais está presente, mas falta configuração para produção.
- `missing_credentials`: driver/caminho existe, porém faltam variáveis.
- `driver_pending`: provider registrado, mas sem driver de ação pronto no runtime serverless.
- `unavailable`: provider não registrado.

Observação pré-produção: o WhatsApp ainda usa uma ponte temporária no router porque os services atuais do Hub dependem de padrões frontend/localStorage em alguns fluxos. Antes do go-live definitivo, a extração para um driver server-side do Hub deve ser revisada.

Persistência: `integration_logs` e `integration_events`.
