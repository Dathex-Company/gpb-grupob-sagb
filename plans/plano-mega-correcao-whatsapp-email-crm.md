# Plano Mega Forte — Correção Total e Finalização WhatsApp + E-mail no CRM

## Objetivo

Garantir operação **100% funcional e estável** de WhatsApp QR + WhatsApp Cloud API + Gmail + Titan no CRM, com inbox unificada, envio/recebimento confiáveis, status real e observabilidade ponta a ponta.

---

## Princípios de execução

1. **Fonte única de verdade:** Supabase para inbox e estado operacional.
2. **Nada hardcoded para status:** todo status vem de health/check real.
3. **Resiliência serverless:** reconexão, retry e degradação controlada.
4. **Observabilidade obrigatória:** correlation id em todas as rotas críticas.
5. **Entrega em camadas:** primeiro estabilidade, depois UX fina.

---

## Fase 0 — Contenção e baseline técnico

### 0.1 Congelar regressões
- Criar branch de hardening.
- Validar build local e netlify build antes de novos patches.

### 0.2 Checklist de ambiente obrigatório
- Validar variáveis em Netlify para [`whatsapp-qr.mjs`](netlify/functions/whatsapp-qr.mjs), [`whatsapp-webhook.mjs`](netlify/functions/whatsapp-webhook.mjs), [`email-titan-driver.ts`](netlify/functions/email-titan-driver.ts), [`email-sync-background.ts`](netlify/functions/email-sync-background.ts).
- Validar credenciais no Hub para [`int_waba_01`](src/modules/hub-integracao/services/integrationService.ts:27), [`int_gmail_01`](src/modules/hub-integracao/services/integrationService.ts:166), [`int_titan_01`](src/modules/hub-integracao/services/integrationService.ts:174).

---

## Fase 1 — Fonte única Supabase (P0)

### 1.1 Parar dependência de localStorage como backend
- Refatorar leitura em [`getInboxMessages()`](src/modules/hub-integracao/services/integrationService.ts:518) para buscar do Supabase.
- Manter [`localStorage`](src/modules/hub-integracao/services/integrationService.ts:617) apenas como fallback DEV explícito.

### 1.2 Persistência padronizada de inbound/outbound
- WhatsApp QR inbound já grava Supabase: consolidar schema e validação.
- WhatsApp outbound do CRM (QR e Cloud) também deve persistir no Supabase com `direction=outbound`.
- Gmail/Titan sync e envio: persistir no mesmo formato de inbox.

### 1.3 Contrato de mensagem unificado
- Evoluir [`HubInboundMessage`](src/modules/hub-integracao/types/integration.types.ts:129) com campos consistentes para:
  - `channel` (whatsapp/email)
  - `provider` (waba/baileys/gmail/titan)
  - `direction` (inbound/outbound)
  - `threadId`/`conversationId`

---

## Fase 2 — Status real e health real (P0)

### 2.1 Remover status fake
- Eliminar `status: 'active'` hardcoded em [`int_crm_ziplia_whatsapp`](src/modules/hub-integracao/services/integrationService.ts:147).

### 2.2 Unificar getConnectionStatus
- Ajustar [`getConnectionStatus()`](src/modules/hub-integracao/services/integrationService.ts:186) para:
  - WhatsApp Cloud: credenciais + health API real.
  - WhatsApp QR: consultar [`/health`](netlify/functions/whatsapp-qr.mjs:347) + status de sessão.
  - Gmail: `refreshToken` + health real [`GmailDriver.health()`](src/modules/hub-integracao/services/emailService.ts:163).
  - Titan: critérios coerentes com [`TitanDriver`](src/modules/hub-integracao/services/emailService.ts:246) e bridge.

### 2.3 Test Connection completo
- Expandir [`testConnection()`](src/modules/hub-integracao/services/integrationService.ts:79) para `int_titan_01` e QR.

---

## Fase 3 — Resiliência WhatsApp QR (P0)

### 3.1 Ciclo de sessão robusto
- Manter [`/reset`](netlify/functions/whatsapp-qr.mjs:334) e endurecer reconexão.
- Em `connection.close`, mapear `reasonCode` para ações:
  - relogin obrigatório
  - reconnect automático
  - throttling

### 3.2 Persistência de sessão
- Avaliar armazenamento de auth state fora de `/tmp`.
- Se inviável hoje, formalizar rotina operacional de recuperação com UX clara.

### 3.3 Limpeza e watchdog
- Evitar sessão zumbi em [`SESSIONS`](netlify/functions/whatsapp-qr.mjs:5) com TTL e limpeza periódica.

---

## Fase 4 — Operação de e-mail de verdade (P0)

### 4.1 Gmail
- Confirmar send/sync/health em [`GmailDriver`](src/modules/hub-integracao/services/emailService.ts:17).
- Tratar limites e paginação com cursor persistido.

### 4.2 Titan
- Alinhar status/credenciais entre [`integrationService.ts`](src/modules/hub-integracao/services/integrationService.ts:205) e [`TitanDriver`](src/modules/hub-integracao/services/emailService.ts:246).
- Fortalecer bridge em [`email-titan-driver.ts`](netlify/functions/email-titan-driver.ts:1): timeout, retry, mensagens de erro estruturadas.

### 4.3 Sync operacional contínuo
- Ativar execução recorrente de [`email-sync-background.ts`](netlify/functions/email-sync-background.ts:1).
- Registrar última sincronização por provider e workspace.

---

## Fase 5 — CRM Inbox unificada final (P0)

### 5.1 Remover heurística frágil
- Trocar detecção por `includes('@')` em [`CrmZipliaNativePage.tsx`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx:536) por metadado canônico (`channel`/`provider`).

### 5.2 Composer multi-canal seguro
- Rotear envio por `provider` explícito.
- Regras de assunto/thread para e-mail em resposta.

### 5.3 Lead linking consistente
- WhatsApp: normalização de telefone.
- E-mail: vínculo por e-mail principal/secundário do lead.

### 5.4 Estados operacionais
- Empty/loading/error/retry para sync e envio por canal.

---

## Fase 6 — Observabilidade e auditoria técnica (P0)

### 6.1 Correlation ID ponta a ponta
- Gerar `correlationId` em cada evento/ação e propagar por:
  - [`whatsapp-qr.mjs`](netlify/functions/whatsapp-qr.mjs)
  - [`whatsapp-webhook.mjs`](netlify/functions/whatsapp-webhook.mjs)
  - [`email-titan-driver.ts`](netlify/functions/email-titan-driver.ts)
  - [`email-sync-background.ts`](netlify/functions/email-sync-background.ts)
  - [`integrationService.ts`](src/modules/hub-integracao/services/integrationService.ts)

### 6.2 Logs estruturados e úteis
- Padronizar erro por categoria: credencial, rede, provedor, schema, rate limit.

### 6.3 Painel de saúde
- Expor visão consolidada por canal no Hub para operação diária.

---

## Fase 7 — Validação de aceite (Go Live)

## Cenários obrigatórios

1. WhatsApp QR: reset → connect → scan → status connected → inbound aparece no CRM.
2. WhatsApp Cloud: inbound webhook persiste e aparece no CRM.
3. Gmail: health OK, sync traz mensagens, reply funciona no CRM.
4. Titan: health OK, sync traz mensagens, send/reply funciona no CRM.
5. Inbox unificada: ordenação, unread, thread, vínculo de lead e follow-up consistentes.
6. Reinício/deploy: sistema retorna sem perder operação (ou com recuperação automática documentada).

---

## Backlog de melhoria pós-estabilização

- SLA por canal.
- Regras de automação por estágio do lead.
- Templates por canal.
- Detecção de sentimento/prioridade em inbound.

---

## Sequência de implementação recomendada

1. [`integrationService.ts`](src/modules/hub-integracao/services/integrationService.ts)
2. [`integration.types.ts`](src/modules/hub-integracao/types/integration.types.ts)
3. [`whatsapp-qr.mjs`](netlify/functions/whatsapp-qr.mjs)
4. [`whatsapp-webhook.mjs`](netlify/functions/whatsapp-webhook.mjs)
5. [`emailService.ts`](src/modules/hub-integracao/services/emailService.ts)
6. [`email-titan-driver.ts`](netlify/functions/email-titan-driver.ts)
7. [`email-sync-background.ts`](netlify/functions/email-sync-background.ts)
8. [`CrmZipliaNativePage.tsx`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx)
9. [`HubIntegracaoPage.tsx`](src/modules/hub-integracao/pages/HubIntegracaoPage.tsx)

---

## Resultado esperado do plano

- WhatsApp e e-mail operando com status real, dados consistentes, e diagnóstico rápido de falhas.
- CRM com inbox realmente unificada, envio/recebimento confiáveis e vínculo comercial utilizável no dia a dia.

---

## Plano de execução direta (pronto para entrar em Code)

### Bloco A — P0 de dados e status (ordem obrigatória)

1. Refatorar [`IntegrationHubService.getInboxMessages()`](src/modules/hub-integracao/services/integrationService.ts:518) para buscar no Supabase via [`restFetch()`](services/supabase.ts:137), com fallback DEV para [`getInboxStorage()`](src/modules/hub-integracao/services/integrationService.ts:616).
2. Refatorar [`IntegrationHubService.persistInboxMessage()`](src/modules/hub-integracao/services/integrationService.ts:606) para gravar no Supabase; manter localStorage apenas quando Supabase indisponível em DEV.
3. Remover hardcode `active` em [`listIntegrations()`](src/modules/hub-integracao/services/integrationService.ts:131) para `int_crm_ziplia_whatsapp` e derivar de [`getWhatsAppQrStatus()`](src/modules/hub-integracao/services/integrationService.ts:387).
4. Corrigir [`getConnectionStatus()`](src/modules/hub-integracao/services/integrationService.ts:186) para Titan aceitar `password` ou `apiKey`, alinhado com [`TitanDriver`](src/modules/hub-integracao/services/emailService.ts:246).
5. Estender [`testConnection()`](src/modules/hub-integracao/services/integrationService.ts:79) para QR/Titan com health real.

### Bloco B — Estabilidade operacional de canal

6. Endurecer ciclo de sessão em [`whatsapp-qr.mjs`](netlify/functions/whatsapp-qr.mjs:63): mapear `reasonCode` → ação (reconnect/reset/logout).
7. Adicionar TTL de sessão e limpeza para [`SESSIONS`](netlify/functions/whatsapp-qr.mjs:5).
8. Em [`email-sync-background.ts`](netlify/functions/email-sync-background.ts:1), normalizar payload/campos de inbox e idempotência por `external_id`.
9. Definir agendamento recorrente de sync (cron) para Gmail/Titan.

### Bloco C — CRM Inbox unificada funcional

10. Em [`CrmZipliaNativePage.tsx`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx:35), trocar merge heurístico por dados com metadados canônicos (`channel`, `provider`, `direction`).
11. Substituir heurística `includes('@')` em [`inbox`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx:536) por `msg.source` + `integrationId`.
12. Ajustar [`handleSendFromComposer()`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx:251) para roteamento por provider explícito (waba/baileys/gmail/titan) e thread de e-mail (`Re:` com `externalThreadId`).

---

## Checklist de homologação por etapa

### H1 — Dados (Supabase como fonte única)
- [ ] Mensagens recebidas por [`whatsapp-webhook.mjs`](netlify/functions/whatsapp-webhook.mjs:94) aparecem no CRM sem reload manual.
- [ ] Mensagens QR de [`messages.upsert`](netlify/functions/whatsapp-qr.mjs:118) aparecem no CRM em novo dispositivo/navegador.
- [ ] E-mails sincronizados por [`email-sync-background.ts`](netlify/functions/email-sync-background.ts:1) aparecem no CRM com assunto e thread.

### H2 — Status real
- [ ] Hub mostra status real para WhatsApp QR, WhatsApp Cloud, Gmail e Titan.
- [ ] `testConnection` retorna sucesso/falha coerente para os 4 canais.

### H3 — Operação de envio
- [ ] Envio WhatsApp via QR funciona com sessão `connected`.
- [ ] Envio WhatsApp Cloud funciona com credenciais válidas.
- [ ] Envio Gmail funciona com refresh token válido.
- [ ] Envio Titan funciona via bridge [`email-titan-driver.ts`](netlify/functions/email-titan-driver.ts:1).

### H4 — Resiliência
- [ ] Após restart/cold start, QR recupera por reset/reconnect sem travar estado.
- [ ] Sync de e-mail reexecuta sem duplicar mensagens (idempotência por external_id).

---

## Definição de pronto (DoD)

- [ ] Build OK via [`npm run build`](package.json:7).
- [ ] Build Netlify OK via [`npx netlify build`](netlify.toml:3).
- [ ] 4 canais operacionais confirmados em homologação: WhatsApp QR, WhatsApp Cloud, Gmail, Titan.
- [ ] Inbox unificada no CRM sem heurística frágil.
- [ ] Logs com rastreabilidade ponta a ponta (correlation id) em funções e Hub.
