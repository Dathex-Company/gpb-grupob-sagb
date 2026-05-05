# Changelog — Hub de Integrações SagB

## [Mega Batch #2] 2026-05-04 — Amarração Estrutural (Event Bridge, Contrato Taskzei, Meta Webhook Setup)

### Scripts e Configuração
- **scripts/setup-meta-webhook.ts** — Script utilitário que gera Verify Token aleatório (crypto.randomBytes) e exibe passo a passo completo para configurar webhook no painel da Meta (Callback URL, Verify Token, inscrição em eventos).
- **.env.example** — Adicionadas variáveis do Hub de Integrações: VITE_HUB_WABA_ACCESS_TOKEN, VITE_HUB_WABA_PHONE_NUMBER_ID, VITE_HUB_WABA_VERIFY_TOKEN, MOCK_META_VERIFY_TOKEN, VITE_HUB_CLICKUP_API_TOKEN, VITE_HUB_CLICKUP_LIST_ID.
- **netlify.toml** — Adicionada seção `[functions."whatsapp-webhook"]` com variável MOCK_META_VERIFY_TOKEN.

### Event Bridge Global
- **integrationService.ts** — `processInboundWebhook()` agora dispara `window.dispatchEvent(new CustomEvent('hub:inbound-message', { detail: message }))` para que módulos consumidores (Taskzei, CRM Ziplia) escutem mensagens inbound em tempo real.
- Documentação inline do event listener pattern para uso nos módulos consumidores.

### Contrato Público Taskzei
- **integrationService.ts** — Novo método `markAsRead(messageId: string)` que marca mensagem como `processed` e registra `consumedBy: 'taskzei'`.
- **index.ts** — Exportados `getInboxMessages` e `markAsRead` como funções standalone para consumo direto pelo Taskzei. Adicionada documentação inline com exemplos de uso.
- **integration.types.ts** — `IntegrationServiceContract` atualizado com `markAsRead`.

### UI — CRM Ziplia WhatsApp
- **listIntegrations()** — Nova integração simulada `int_crm_ziplia_whatsapp` (WhatsApp CRM Ziplia) sempre ativa para testes.
- **HubIntegracaoPage.tsx** — Card de destaque "WhatsApp CRM Ziplia" com gradiente verde, indicador "● Ativo" e descrição do canal.

### Correções
- **module-doc.ts** — Corrigido erro TS1002 (unterminated string literal): template literals com quebras de linha substituídas por strings planas.

---

## [Mega Batch #1] 2026-05-04 — Implementação completa das Fases 2, 3 e 4

### FASE 2 — Catálogo e Conexões (UI)
- **IntegrationCatalog.tsx** — Catálogo visual de integrações com badges de status (ativo/inativo/erro), ícones por provedor, ações de configurar e testar.
- **ConnectionManager.tsx** — Gerenciador de conexões com lista de ativas/inativas, suporte a edição e revogação de credenciais.
- **ConnectionTest.tsx** — Modal de teste de conexão com feedback visual (✅ Conectado / ❌ Falha), suporte a re-teste.
- **ActivityLog.tsx** — Log de atividades com filtro por integração, ícones por ação, status de sucesso/falha e timestamp.
- **CredentialConfigModal.tsx** — Modal dinâmico de configuração de credenciais com campos específicos por provedor (WhatsApp, ClickUp, Gmail, Titan, Meta).
- **ProviderBadge.tsx** — Componente de badge colorido por provedor.
- **HubIntegracaoPage.tsx** — Dashboard refatorado com abas (Catálogo, Conexões, Atividades), cards de status (ativas/inativas/erro), integração com todos os modais.

### FASE 3 — Drivers de Integração
- **WhatsApp Inbound (webhook):**
  - `whatsappService.ts` expandido com `verifyWebhook()` (verificação do challenge da Meta), `processInboundPayload()` (parser de mensagens inbound text/image/video/audio/document), e processamento de status updates (delivered/read/failed).
  - `netlify/functions/whatsapp-webhook.mjs` — Função serverless completa:
    - **GET** — Verificação do webhook da Meta (`hub.mode`, `hub.challenge`, `hub.verify_token`)
    - **POST** — Recebimento e processamento de mensagens inbound com logging estruturado
    - Retorna 200 rápido para evitar re-envio da Meta
  - Tipos `WhatsAppWebhookPayload`, `WhatsAppInboundMessage`, `WhatsAppWebhookVerification` adicionados.
- **LoggerService:** Serviço de logs centralizados com persistência em localStorage (200 entradas máximas), suporte a filtro por integrationId.
- **Health Check real:** `testConnection()` agora executa health check real via API do provedor (WhatsApp e ClickUp) e registra no log.

### FASE 4 — Integração com Módulos
- **Email Service (Gmail/Titan):**
  - `emailService.ts` com arquitetura de drivers (Strategy Pattern):
    - **GmailDriver:** Envio via Gmail API (MIME message), sync de inbox (mensagens não lidas), health check.
    - **TitanDriver:** Placeholder estrutural (Titan não possui API REST pública).
  - `HubMailSendInput`, `HubMailSendResult`, `HubMailSyncResult` já tipados.
- **IntegrationService expandido:**
  - `processInboundWebhook()` — Orquestra recebimento de webhook, persiste mensagem no storage local, registra no log.
  - `getInboxMessages()` — Recupera mensagens de entrada do hub.
  - `sendEmail()` — Delega para o EmailService.
  - `updateIntegrationConfig()` — Salva/atualiza credenciais com mapeamento automático integrationId → provider.
  - `getActivityLog()` / `getCredentialAudit()` — Logs e auditoria.
- **Supabase Migration:** `20260504000001_hub_inbox_messages.sql`
  - Tabela `hub_inbox_messages` com suporte a múltiplas fontes (whatsapp, email, webhook)
  - Enums `hub_inbound_source` e `hub_inbound_status`
  - Índices de performance por status, fonte, integração, módulo consumidor
  - RLS policies para service_role (insert) e authenticated (select/update)
  - Trigger automático de `updated_at`
- **index.ts expandido:** Exporta `integrationHub`, `credentialManager`, `whatsAppDriver`, `emailService`, `loggerService` e todos os tipos públicos.

### Arquivos criados (8)
- `src/modules/hub-integracao/components/IntegrationCatalog.tsx`
- `src/modules/hub-integracao/components/ConnectionManager.tsx`
- `src/modules/hub-integracao/components/ConnectionTest.tsx`
- `src/modules/hub-integracao/components/ActivityLog.tsx`
- `src/modules/hub-integracao/components/CredentialConfigModal.tsx`
- `src/modules/hub-integracao/components/ProviderBadge.tsx`
- `src/modules/hub-integracao/services/loggerService.ts`
- `src/modules/hub-integracao/services/emailService.ts`
- `netlify/functions/whatsapp-webhook.mjs`
- `supabase/migrations/20260504000001_hub_inbox_messages.sql`

### Arquivos modificados (5)
- `src/modules/hub-integracao/types/integration.types.ts` — Novos tipos (HubInboundMessage, HubActivityLogEntry, HubInboundWebhookPayload)
- `src/modules/hub-integracao/services/whatsappService.ts` — Webhook verification + inbound parser
- `src/modules/hub-integracao/services/integrationService.ts` — Novos métodos (webhook, email, logs, config)
- `src/modules/hub-integracao/utils/validation.ts` — Validação expandida para email e webhook
- `src/modules/hub-integracao/pages/HubIntegracaoPage.tsx` — Dashboard completo com abas e modais
- `src/modules/hub-integracao/index.ts` — Exportações expandidas

---

## [2026-04-30] — Módulo alinhado ao padrão canônico de governança
- Estrutura inicial do módulo: manifest, routes, index, services, types, utils
- Pasta `agent` com 4 arquivos canônicos
- Driver de ClickUp e WhatsApp (outbound) iniciais
- CredentialManager com criptografia mock e auditoria
