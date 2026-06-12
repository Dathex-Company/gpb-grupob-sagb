# changelog - api_sagb

## [2026-06-12] — Finalização API Oficial, Hub e WhatsApp Cloud API

### Adicionado
- Plano final em `Plans/plano-finalizacao-api-sagb-100-integracoes.md`.
- Runtime oficial em `netlify/functions/api-sagb-router.mjs` com `/api-sagb/v1/status`, Events API, Integration API e endpoints WhatsApp Cloud API.
- Migration `20260612000101_api_sagb_final_integrations.sql` para `api_events`, `integration_logs`, `integration_events`, tabelas WhatsApp e enriquecimento de auditoria.
- Documentação completa em `README.md`, `PLANNED.md` e `docs/`.

### Alterado
- Autenticação passa a comparar SHA-256 com `api_keys.key_hash`.
- Escopos oficiais expandidos para system, api, audit, events, integrations, whatsapp, crm e messages.
- OpenAPI atualizado para refletir o router real.

### Segurança
- Mock key bloqueada em produção.
- Headers e payloads sensíveis são redigidos.
- Audit log cobre sucesso, erro, 401, 403, webhooks e actions.

## [2026-05-05] — Mega Batch: Etapas 4 a 9

### Execução em Lote (Mega Batch)
- **Etapa 4 — Auditoria e Observabilidade**: criados `audit.types.ts`, `requestContext.ts`, `auditLogger.ts`, migração SQL `api_audit_log`, função Netlify `api-sagb-audit.mjs`
- **Etapa 5 — Camada de Integração**: criados `httpClient.ts` (com retry/timeout), `circuitBreaker.ts` (CLOSED/OPEN/HALF_OPEN), adapters para TaskZei, CRM, Studio e Vox
- **Etapa 6 — Endpoints Prioritários**: criados schemas e handlers para TaskZei (notificações), CRM (leads), Studio (projetos) e Vox (transcrição), mais `endpoints.types.ts`, `health.handler.ts`, `router.ts` e função Netlify `api-sagb-router.mjs`
- **Etapa 7 — Governança de Versão**: criados `versioning.types.ts`, `versionRouter.ts` (resolução multi-versão), `deprecationPolicy.md` e `CHANGELOG_API.md`
- **Etapa 8 — Hardening e Testes**: criados testes de contrato, auth, integração, auditoria e versionamento (Vitest), mais arquivo de carga k6
- **Etapa 9 — Rollout Controlado**: criados `rolloutPlan.md` (4 ondas), `rollbackProcedure.md` (4 níveis), `featureFlags.ts` e `goLiveChecklist.md`
- Contrato OpenAPI atualizado com 12 endpoints documentados

## [2026-05-05] — Mega Batch 2: Validação, Infraestrutura e Rate Limiting

### Correções de Bugs (9 issues)
- **authMiddleware.ts**: `validateApiKey` reescrita (RPC → query direta `supabaseAdmin.from('api_keys')`)
- **auditLogger.ts**: Lógica de buffer e flush corrigida
- **requestContext.ts**: `calculateDuration` aceita `RequestContext | number`
- **audit.types.ts**: Campo `client_id` → `clientId` no `AuditEntry`
- **httpClient.ts**: Null guards para `response.headers.get/forEach` em mocks; timeout sem `Promise.race` (elimina unhandled rejection)
- **circuitBreaker.ts**: Mensagem de erro corrigida
- **adapters/types.ts**: Campos `service` e `durationMs` adicionados

### Novas Funcionalidades
- **Rate Limiter**: `security/rateLimiter.ts` — Token Bucket (100/10 default, 20/2 strict)
- **Migration api_keys**: `20260505000102_api_sagb_api_keys.sql` — tabela `api_keys` + RLS + seeds
- **Postman Collection**: `api-sagb.postman_collection.json` — 12 endpoints documentados
- **netlify.toml**: Configurado com env vars, CORS, redirects, functions

### Testes
- **86/86 testes passando** (5/5 arquivos), 0 unhandled rejections
- Mock fetch reescrito para respeitar `AbortSignal`

## [2026-05-01]

- criação oficial do módulo `api_sagb`
- definição de manifesto, rota e documentação base
- alinhamento do módulo à governança canônica SagB
