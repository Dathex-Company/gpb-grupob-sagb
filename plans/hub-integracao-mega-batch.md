# Plano Mega Batch — Hub de Integrações SagB

## Autorização
Usuário autorizou execução em lote (Mega Batch) de todas as fases pendentes.
Data: 04/05/2026

## Fases a Executar (Ordem com Dependências)

### FASE 1 — Fundação (Estrutura Base)
**Status:** Parcialmente concluído. Completar itens faltantes.

| Item | Status | Arquivo |
|------|--------|---------|
| 1.1 Estrutura base do módulo | ✅ Feito | `src/modules/hub-integracao/` |
| 1.2 manifest.ts e routes.tsx | ✅ Feito | `manifest.ts`, `routes.tsx` |
| 1.3 Registro no moduleRegistry | ✅ Feito | Via `index.ts` |
| 1.4 Dashboard básico | ✅ Feito | `pages/HubIntegracaoPage.tsx` |
| 1.5 Serviço central | ✅ Feito | `services/integrationService.ts` |
| 1.6 Armazenamento seguro | ✅ Feito | `services/credentialManager.ts` |

**Pendente:** Nada. Fase 1 completa.

---

### FASE 2 — Catálogo e Conexões (UI)
**Status:** NÃO iniciado. Criar componentes de UI.

| Item | Arquivo | Descrição |
|------|---------|-----------|
| 2.1 IntegrationCatalog.tsx | `src/modules/hub-integracao/components/IntegrationCatalog.tsx` | Catálogo de integrações disponíveis com badges de status |
| 2.2 ConnectionManager.tsx | `src/modules/hub-integracao/components/ConnectionManager.tsx` | CRUD de conexões (configurar, editar, revogar) |
| 2.3 ConnectionTest.tsx | `src/modules/hub-integracao/components/ConnectionTest.tsx` | Teste de conexão com feedback visual |
| 2.4 ActivityLog.tsx | `src/modules/hub-integracao/components/ActivityLog.tsx` | Logs de atividade das integrações |
| 2.5 CredentialConfigModal | `src/modules/hub-integracao/components/CredentialConfigModal.tsx` | Modal para configurar credenciais |
| 2.6 Refatorar HubIntegracaoPage.tsx | `pages/HubIntegracaoPage.tsx` | Integrar todos os componentes no dashboard |

---

### FASE 3 — Drivers de Integração (Prioridade: WhatsApp)
**Status:** Parcialmente concluído. WhatsApp outbound existe, inbound não.

| Item | Arquivo | Descrição |
|------|---------|-----------|
| 3.1 WhatsApp inbound (webhook handler) | `netlify/functions/whatsapp-webhook.mjs` | Função serverless para receber webhooks da Meta |
| 3.2 WhatsAppService — processInboundMessage | `services/whatsappService.ts` | Parsear payload da Meta, extrair texto + remetente |
| 3.3 IntegrationService — receiveWhatsAppWebhook | `services/integrationService.ts` | Orquestrar recebimento e persistência |
| 3.4 LoggerService | `services/loggerService.ts` | Serviço de logs centralizados |
| 3.5 Health check automático | `services/whatsappService.ts` | Verificar saúde da conexão WhatsApp |
| 3.6 Supabase inbox_items table | (migration) | Tabela para persistir mensagens de inbox do Hub |

---

### FASE 4 — Integração com Módulos
**Status:** NÃO iniciado.

| Item | Arquivo | Descrição |
|------|---------|-----------|
| 4.1 Ingestão no Taskzei Inbox | `services/integrationService.ts` + `src/modules/taskzei/services/taskzei.hub.ts` | Injetar mensagens no Inbox do Taskzei |
| 4.2 Gmail/Titan email driver | `services/emailService.ts` | Driver de e-mail com OAuth2 |
| 4.3 Atualizar Index/Routes | `index.ts`, `routes.tsx` | Exportar novos serviços |
| 4.4 Supabase migration | `supabase/migrations/` | Migration para inbox_messages |

---

### Arquivos a criar/modificar (lista completa)

#### Criar:
1. `src/modules/hub-integracao/components/IntegrationCatalog.tsx`
2. `src/modules/hub-integracao/components/ConnectionManager.tsx`
3. `src/modules/hub-integracao/components/ConnectionTest.tsx`
4. `src/modules/hub-integracao/components/ActivityLog.tsx`
5. `src/modules/hub-integracao/components/CredentialConfigModal.tsx`
6. `src/modules/hub-integracao/services/loggerService.ts`
7. `src/modules/hub-integracao/services/emailService.ts`
8. `netlify/functions/whatsapp-webhook.mjs`
9. `supabase/migrations/20260504000001_hub_inbox_messages.sql`

#### Modificar:
1. `src/modules/hub-integracao/pages/HubIntegracaoPage.tsx` — Integrar novos componentes
2. `src/modules/hub-integracao/services/integrationService.ts` — Adicionar webhook handler, email driver, health check real
3. `src/modules/hub-integracao/services/whatsappService.ts` — Adicionar inbound processing
4. `src/modules/hub-integracao/types/integration.types.ts` — Adicionar tipos de webhook e inbox
5. `src/modules/hub-integracao/utils/validation.ts` — Adicionar validação para email, webhook
6. `src/modules/hub-integracao/index.ts` — Exportar novos componentes/serviços
7. `src/modules/hub-integracao/changelog.md` — Registrar implementação
8. `src/modules/hub-integracao/decisions.md` — Registrar decisão do Mega Batch

---

### Contrato de Dados — WhatsApp Webhook → Taskzei Inbox

Meta envia webhook → `whatsapp-webhook.mjs` → `whatsappService.processInboundMessage()` → `integrationService.receiveInboundMessage()` → Supabase `inbox_messages` → Taskzei lê da tabela

```typescript
// Payload que o Hub persiste no Supabase
interface HubInboxMessage {
  id: string;
  source: 'whatsapp' | 'email' | 'webhook';
  from: string;           // número de telefone ou email
  fromName?: string;
  content: string;        // texto da mensagem
  mediaUrl?: string;      // link para mídia se houver
  externalId: string;     // ID da mensagem no provedor externo
  conversationId?: string;// thread/conversation ID
  integrationId: string;  // ID da integração no Hub
  workspaceId: string;
  receivedAt: string;
  status: 'pending' | 'processed' | 'error';
  consumedBy?: string;    // módulo que consumiu (ex: 'taskzei')
  metadata?: Record<string, unknown>;
}
```
