# SagB | API SagB | Plano de Finalização 100% — Integrações e WhatsApp Cloud API

## 1. Diagnóstico real

Status documentado antes desta etapa: módulo marcado como 100% concluído em `plano_modulo.md`, com contrato OpenAPI, endpoints legados e função Netlify.

Status técnico encontrado:

- Runtime principal existia em `netlify/functions/api-sagb-router.mjs`, porém focado em Health, TaskZei, CRM, Studio e Vox.
- `api_keys` existia com coluna `key_hash`, mas o router comparava chave bruta em query `api_key=eq...`, divergindo da decisão D-005.
- `api_audit_log` existia, mas sem todos os campos operacionais exigidos e sem auditoria para todos os caminhos de erro.
- Hub de Integrações já possuía driver WhatsApp Cloud API em `src/modules/hub-integracao/services/whatsappService.ts`, mas também mantinha fluxo QR/Baileys para CRM; a API oficial não deve usar QR.
- Supabase tinha `api_keys`, `api_audit_log` e `hub_inbox_messages`; não tinha Events API e tabelas oficiais WhatsApp Cloud consolidadas.
- OpenAPI estava coerente com o proxy legado, mas divergente do objetivo oficial de API SagB como camada de integração do ecossistema.

## 2. Pronto, parcial, ausente e risco

### Pronto

- Módulo ativo com manifest, routes, docs e página.
- Netlify Function existente.
- Tabela `api_keys` com `key_hash`.
- Tabela `api_audit_log` base.
- Hub com driver WhatsApp Cloud API e serviços ClickUp, Gmail/Titan e logger.
- `hub_inbox_messages` para consumo por módulos.

### Parcial

- Autenticação: havia estrutura de hash, mas runtime comparava valor bruto.
- Auditoria: existia, mas incompleta para erros, provider, action, recurso, IP/UA mascarado.
- WhatsApp: Hub tinha Cloud API, mas API oficial não expunha webhook/send/conversas oficiais.
- CRM/Núcleo Conversacional: tinham caminhos próprios, mas não contrato API oficial para conversas WhatsApp.
- Monitoramento: tinha módulo operacional, mas não recebia status/logs API de forma explícita.

### Ausente

- `GET /api-sagb/v1/status`.
- Events API universal.
- Integration API genérica.
- Webhook oficial WhatsApp Cloud API no router principal.
- Persistência oficial de contatos, conversas, mensagens, webhook events e delivery status.
- OpenAPI alinhado ao router final.
- Docs completas de segurança, escopos, eventos, integrações, WhatsApp, go-live e rollback.

### Riscos

- Migração antiga continha seeds com chaves em texto como `key_hash`; a nova migration normaliza para SHA-256, mas produção precisa rotação planejada.
- A migração não deve ser aplicada em produção sem autorização expressa.
- Providers ClickUp/Gmail/Titan/Calendar dependem de credenciais reais e drivers Hub completos para ações específicas.
- Webhook POST Meta deve retornar rápido; qualquer evolução pesada deve ir para fila/worker depois.

## 3. Arquitetura final

- API SagB: borda oficial, autentica, autoriza, valida, audita, normaliza respostas e expõe `/api-sagb/v1`.
- Hub de Integrações: drivers, credenciais, providers e execução externa.
- Supabase: persistência, Auth, Storage, audit logs, eventos, contatos, conversas, mensagens e logs de integração.
- MCP SagB: ferramentas para agentes; não substitui API pública.
- FluxoB: poderá orquestrar processos depois, sem bloquear conexão inicial.
- CRM Ziplia e Núcleo Conversacional: consomem conversas/mensagens por endpoints oficiais e tabelas persistidas.
- Monitoramento: consome `status`, `integration_logs`, `integration_events` e `api_audit_log`.

## 4. Endpoints finais

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
- Endpoints legados preservados para TaskZei, CRM, Studio e Vox com escopos ajustados.

## 5. Tabelas necessárias

Usadas/validadas:

- `api_keys`
- `api_audit_log`
- `hub_inbox_messages`

Criadas/evoluídas por migration:

- `api_events`
- `integration_logs`
- `integration_events`
- `whatsapp_contacts`
- `whatsapp_conversations`
- `whatsapp_messages`
- `whatsapp_webhook_events`
- `whatsapp_delivery_status`

## 6. WhatsApp Cloud API

Variáveis esperadas sem valores documentados:

- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_WABA_ID`
- `META_APP_ID`
- `META_APP_SECRET`

Fluxo:

1. Meta valida webhook com GET e token de verificação.
2. Meta envia POST com mensagens/status.
3. API sanitiza payload, normaliza e persiste.
4. API registra eventos e auditoria.
5. CRM/Núcleo Conversacional consultam conversas/mensagens pela API.
6. Send-message chama Cloud API oficial e persiste tentativa/resultado.

## 7. Critérios de 100%

- Runtime v1 versionado no router Netlify.
- API Key com SHA-256 real.
- Escopos oficiais completos.
- 401 para ausente/inválida/inativa/revogada/expirada.
- 403 para escopo insuficiente.
- Auditoria persistente para sucesso e erro.
- Events API funcional.
- Integration API funcional para status/listagem e action WhatsApp.
- WhatsApp webhook GET/POST funcional.
- Persistência WhatsApp no Supabase.
- OpenAPI bate com router.
- Docs, checklist e rollback presentes.
- Build/testes documentados.

## 8. Go-live checklist resumido

- Publicar Netlify Function.
- Configurar Supabase URL/service key.
- Configurar variáveis WhatsApp Meta.
- Criar API key real com SHA-256.
- Aplicar migration com autorização.
- Validar CORS produção.
- Validar webhook Meta.
- Validar mensagem recebida/enviada e delivery status.
- Validar painel.
- Validar OpenAPI.

## 9. Rollback

- Revogar API key em `api_keys.revoked_at`.
- Remover provider WhatsApp das variáveis de ambiente.
- Pausar webhook no app Meta.
- Reverter função Netlify para versão anterior do deploy.
- Consultar `api_audit_log`, `integration_logs`, `integration_events` e `whatsapp_webhook_events`.
- Manter tabelas para investigação, sem apagar dados.

