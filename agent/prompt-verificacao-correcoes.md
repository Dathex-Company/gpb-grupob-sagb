# Prompt de Verificação — Correções WhatsApp QR → CRM Ziplia

## Contexto

Foram feitas correções em 6 arquivos para resolver 10 problemas identificados no fluxo de integração WhatsApp (Baileys QR) com o módulo CRM Ziplia. Você precisa verificar se todas as correções foram aplicadas **corretamente**, sem introduzir novos problemas.

## Instruções

1. Leia cada arquivo listado abaixo
2. Verifique cada ponto da checklist
3. Reporte qualquer problema, inconsistência ou regressão encontrada
4. Se tudo estiver correto, confirme com "✅ Todas as verificações passaram"

---

## Arquivos para verificar

### 1. `netlify/functions/whatsapp-qr.mjs`

**Checklist:**

- [ ] **messages.upsert handler**: existe `sock.ev.on('messages.upsert', ...)` que processa mensagens recebidas
  - [ ] Filtra `type !== 'notify'` para processar apenas mensagens em tempo real
  - [ ] Pula mensagens `msg.key?.fromMe === true` (enviadas pelo próprio número)
  - [ ] Pula mensagens de grupo (`remoteJid.endsWith('@g.us')`)
  - [ ] Extrai conteúdo de `conversation`, `extendedTextMessage.text`, `imageMessage.caption`, `videoMessage.caption`, `audioMessage`, `documentMessage`
  - [ ] Cria objeto `inboundMsg` com campos: id, source, from, fromName, content, externalId, conversationId, integrationId ('int_waba_qr_01'), receivedAt, status ('pending'), metadata
  - [ ] Adiciona mensagem a `session.inboundMessages[]`
  - [ ] Tenta persistir no Supabase (`supabase.from('hub_inbox_messages').insert(...)`) com tratamento de erro (try/catch)

- [ ] **GET /inbox endpoint** (linha ~159):
  - [ ] Retorna `session.inboundMessages` como array
  - [ ] Retorna array vazio se sessão não existe
  - [ ] Usa `sessionId` do query parameter

- [ ] **GET /health endpoint** (linha ~178):
  - [ ] Retorna `activeSessions` count
  - [ ] Retorna array com id, status e inboundCount de cada sessão

- [ ] **Import do Supabase**: `import { createClient } from '@supabase/supabase-js'` no topo
  - [ ] `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` lidos de `process.env`

- [ ] **Funcionalidades existentes não quebradas**:
  - [ ] POST /connect continua funcionando
  - [ ] GET /status continua funcionando
  - [ ] POST /send continua funcionando
  - [ ] POST /logout continua funcionando
  - [ ] `isAuthorized` continua funcionando

---

### 2. `src/modules/hub-integracao/types/integration.types.ts`

**Checklist:**

- [ ] `IntegrationServiceContract` tem método `getWhatsAppQrInbox(sessionId?: string): Promise<HubInboundMessage[]>`
- [ ] Nenhum outro método existente foi removido ou alterado

---

### 3. `src/modules/hub-integracao/services/integrationService.ts`

**Checklist:**

- [ ] **getWhatsAppQrInbox(sessionId)** existe (entre `logoutWhatsAppQr` e `processInboundWebhook`):
  - [ ] Faz fetch para `${baseUrl}/inbox?sessionId=...`
  - [ ] Passa `x-api-key` se configurado
  - [ ] Retorna array vazio se resposta não for ok ou se houver erro
  - [ ] Trata erro com try/catch e console.warn

- [ ] **markAsRead**:
  - [ ] Log diz `"pelo CRM Ziplia"` (linha ~536), NÃO "pelo Taskzei"
  - [ ] `consumedBy` continua como `messages[index].consumedBy || 'crm_ziplia'`

- [ ] Nenhum método existente foi removido ou alterado indevidamente

---

### 4. `src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx`

**Checklist:**

- [ ] **loadWhatsInbox** (linha ~35):
  - [ ] Faz `Promise.all` com `getInboxMessages('int_waba_01', 200)` e `getWhatsAppQrInbox('default')`
  - [ ] `getWhatsAppQrInbox` tem `.catch(() => [])` para não quebrar se falhar
  - [ ] Merge com deduplicação por `externalId`
  - [ ] Sort por `receivedAt` decrescente
  - [ ] Seta `selectedConversationId` se não estiver definido

- [ ] **useEffect WhatsApp** (linha ~83):
  - [ ] Event listener registrado **antes** de `loadWhatsInbox()` e `refreshQrStatus()`
  - [ ] Handler do evento faz dedup: `if (prev.some((m) => m.id === detail.id)) return prev`
  - [ ] Cleanup remove o listener

- [ ] **conversations memo** (linha ~132):
  - [ ] Mensagens novas em conversa existente atualizam `lastMessage` e `timestamp`
  - [ ] Se `msg.receivedAt > existing.timestamp`, atualiza `existing.lastMessage` e `existing.timestamp`
  - [ ] Atualiza `title` se `msg.fromName` existir

- [ ] **Tab Inbox** (linha ~475):
  - [ ] `activeTab === 'inbox'` renderiza componente separado (não duplicata do WhatsApp)
  - [ ] Mostra header "Inbox Unificada" com contagem de conversas
  - [ ] Tem placeholder explicando que futuramente reunirá múltiplos canais

- [ ] **Tab WhatsApp** (linha ~379):
  - [ ] Condição é `activeTab === 'whatsapp'` (não mais `activeTab === 'whatsapp' || activeTab === 'inbox'`)
  - [ ] Header continua "Canal WhatsApp CRM" com badge de status da sessão

- [ ] **Fallback** (linha ~494):
  - [ ] Condição exclui todos os tabs implementados: `pipeline`, `whatsapp`, `inbox`, `settings`, `daily`, `integrations`, `simulator`, `differences`

---

### 5. `netlify/functions/whatsapp-webhook.mjs`

**Checklist:**

- [ ] **Persistência no Supabase** (linha ~156):
  - [ ] Itera sobre `messages[]` e cria objeto `record` para cada uma
  - [ ] Chama `supabase.from('hub_inbox_messages').insert(record)`
  - [ ] Trata erro com try/catch
  - [ ] Mantém `console.log` para debug
  - [ ] TODO comentário foi removido/substituído

- [ ] **Funcionalidades existentes**:
  - [ ] GET handleVerification continua funcionando
  - [ ] POST handleInbound continua retornando 200
  - [ ] Import do Supabase existe no topo

---

### 6. `netlify.toml`

**Checklist:**

- [ ] Seção `[functions."whatsapp-qr"]` tem `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` no environment
- [ ] `HUB_WHATSAPP_QR_API_KEY` ainda está presente
- [ ] Outras funções não foram alteradas

---

### 7. Build de validação

- [ ] `npm run build` (Vite) passa sem erros
- [ ] `npx netlify build` passa sem erros (frontend + functions bundling)
- [ ] `whatsapp-qr.mjs` aparece na lista de funções empacotadas
- [ ] `whatsapp-webhook.mjs` aparece na lista de funções empacotadas

---

## Relatório Final

Após verificar todos os pontos acima, escreva um relatório respondendo:

1. **Problemas encontrados:** Liste qualquer item da checklist que não passou
2. **Inconsistências:** Algo que parece errado mesmo que não esteja na checklist
3. **Regressões:** Funcionalidade existente que foi quebrada
4. **Resultado:** ✅ Todas as verificações passaram ou ❌ Problemas encontrados (detalhar)

Se tudo estiver correto, o sistema está pronto para deploy.
