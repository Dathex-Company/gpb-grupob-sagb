# Changelog da API SagB

Todas as mudanças notáveis na API SagB serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.1] - 2026-06-12

### Segurança

- Adicionada validação de `X-Hub-Signature-256` no webhook POST do WhatsApp com `META_APP_SECRET` e comparação timing-safe.
- Migration ajustada para não re-hashear `api_keys.key_hash` automaticamente.
- Mock keys restritas a `development`, `test` e `sandbox`.
- CORS padrão de produção ajustado para `https://sagb.grupob.com.br`.

### Documentação

- OpenAPI corrigido para domínio oficial `https://sagb.grupob.com.br/api-sagb/v1` e branch preview genérico.
- Painel do módulo marcado como checklist pré-produção, sem indicar status real falso.
- Providers do Hub documentados com estados reais/pedentes.

### Pré-produção

- Esta versão está implementada para revisão no PR #4. Não houve deploy, merge ou aplicação de migration.

## [1.1.0] - 2026-06-12

### Adicionado

#### System
- `GET /v1/status` — status real da API, Supabase, Hub, providers e WhatsApp sem expor secrets.

#### Events API
- `POST /v1/events` — registra evento universal.
- `GET /v1/events` — lista eventos.
- `GET /v1/events/{id}` — obtém evento por ID.

#### Integration API
- `GET /v1/integrations` — lista providers oficiais.
- `GET /v1/integrations/{provider}/status` — consulta status de provider.
- `POST /v1/integrations/{provider}/actions` — executa action via Hub.
- `GET /v1/integrations/actions/{actionId}` — consulta action.

#### WhatsApp Cloud API Oficial
- `GET /v1/integrations/whatsapp/webhook` — valida webhook Meta.
- `POST /v1/integrations/whatsapp/webhook` — recebe payload Meta e persiste contatos, conversas, mensagens e status.
- `POST /v1/integrations/whatsapp/send-message` — envia mensagem pela Cloud API oficial.
- `GET /v1/integrations/whatsapp/conversations` — lista conversas.
- `GET /v1/integrations/whatsapp/conversations/{id}/messages` — lista mensagens.

### Alterado
- Autenticação por API Key agora compara SHA-256 em `api_keys.key_hash`.
- Escopos oficiais adicionados: `api:*`, `events:*`, `integrations:*`, `whatsapp:*`, `crm:*`, `messages:*`.
- Audit log enriquecido com action, provider, resource, error_code, ip_hash e user_agent_hash.

### Segurança
- Mock keys bloqueadas em produção.
- CORS parametrizado por ambiente.
- Nenhum secret deve aparecer em código, log ou documentação.

## [1.0.0] - 2026-05-05

### Adicionado

#### System
- `GET /v1/health` — Healthcheck da API

#### TaskZei (Notificações)
- `GET /v1/taskzei/notifications` — Listar notificações por destinatário
- `POST /v1/taskzei/notifications` — Enviar notificação para um ou mais destinatários

#### CRM (Leads)
- `GET /v1/crm/leads` — Listar leads com filtros opcionais
- `POST /v1/crm/leads` — Criar novo lead
- `PUT /v1/crm/leads/{id}` — Atualizar lead existente
- `GET /v1/crm/leads/{id}` — Obter detalhes de um lead

#### Studio (Projetos)
- `GET /v1/studio/projects` — Listar projetos
- `GET /v1/studio/projects/{id}` — Obter detalhes de um projeto

#### Vox (Transcrição)
- `POST /v1/vox/transcriptions` — Enviar áudio para transcrição
- `GET /v1/vox/transcriptions/{id}` — Obter resultado da transcrição
- `GET /v1/vox/transcriptions` — Listar transcrições recentes

#### Segurança
- Autenticação via API Key (header `X-API-Key`)
- Autorização por escopos: `system:read`, `system:write`, `agents:read`, `agents:execute`, `cid:read`, `cid:write`

#### Observabilidade
- `X-Request-Id` para correlação em todas as respostas
- Logs de auditoria em `api_audit_log`
- `X-Response-Time` em todas as respostas

#### Versionamento
- Header `Accept-Version` para controle de versão pelo cliente
- Headers de resposta: `X-API-Version`, `X-API-Version-Prefix`, `Warning`, `Sunset`
- Política de depreciação com 90 dias de aviso prévio

### Notas Técnicas

- Schema OpenAPI: `contracts/openapi_v1.yaml`
- Postman Collection: Disponível no painel do desenvolvedor
- Limite de rate: 1000 requisições/minuto por API Key (fase inicial)
- Timeout padrão dos endpoints: 30 segundos
