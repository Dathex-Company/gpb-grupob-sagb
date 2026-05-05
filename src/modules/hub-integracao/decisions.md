# decisions — hub-integracao

## 30/04/2026
- Módulo alinhado ao padrão canônico de governança do SagB.
- Pasta `agent` limitada aos 4 arquivos canônicos definidos em `docs/governanca_sagb/padrao_unificado_governanca.md`.

## 04/05/2026 — Redirecionamento Estratégico (fora do ClickUp, foco no Taskzei)
- **Decisão:** ClickUp removido do escopo de integração do Hub. O sistema interno Taskzei substitui o ClickUp como plataforma de gestão de tarefas.
- **Nova prioridade zero:** Conector WhatsApp (inbound/outbound) para alimentar o Inbox Inteligente do Taskzei.
- **Justificativa:** Taskzei já possui Fase 6 (Inbox Inteligente) e Fase 8 (Parser de Linguagem Natural) entregues. A integração WhatsApp -> Taskzei via Hub destrava a operação de curto prazo das demandas que nascem soltas no WhatsApp.
- **Segunda prioridade:** Conector E-mail (Gmail e Titan) para capturar demandas formais e aprovações via thread de e-mail convertidas em tarefas no Taskzei.
- **Terceira prioridade (congelada para Taskzei):** Ecossistema Meta (Facebook/Instagram) — realocado para atender CRM Ziplia quando demandado.
- **Taskzei já possui interface aberta:** `taskzei.hub.ts` apto a receber payload do Hub.

## 04/05/2026 — Mega Batch #1 (Fases 2, 3 e 4 executadas em lote único)
- **Decisão:** Execução de todas as fases pendentes do Hub de Integrações em lote único (Mega Batch), autorizada pelo usuário.
- **Estratégia:** Implementação sequencial respeitando dependências: UI (Fase 2) → Drivers (Fase 3) → Integração com Módulos (Fase 4).
- **Contrato de dados:** Adotado modelo `HubInboundMessage` como formato canônico para mensagens de entrada. Persistência local (localStorage) como fallback, com migration Supabase preparada para produção.
- **Arquitetura do webhook:** Meta Cloud API → `netlify/functions/whatsapp-webhook.mjs` → processamento no `IntegrationHubService` → persistência/publish.
- **Driver de e-mail:** Strategy Pattern com `GmailDriver` (implementado via Gmail API REST) e `TitanDriver` (placeholder — Titan sem API pública).
- **Health Check:** Substituído mock estático por chamada real à API do provedor.
- **Logs:** Criado `LoggerService` centralizado. Todo evento do Hub (test, send, receive, config, error, health) é registrado.
- **Supabase:** Migration `20260504000001` criada com tabela `hub_inbox_messages`, índices e RLS policies.

## 04/05/2026 — Mega Batch #2 (Amarração Estrutural)
- **Decisão:** Script de setup do webhook Meta criado para automatizar geração de Verify Token e documentar passo a passo da configuração no painel da Meta.
- **Decisão:** Adotado `window.dispatchEvent(new CustomEvent('hub:inbound-message', ...))` como mecanismo de event bridge global — sem dependência de bibliotecas externas de pubsub. Qualquer módulo pode escutar via `window.addEventListener('hub:inbound-message', handler)`.
- **Decisão:** Contrato mínimo e explícito entre Hub e Taskzei: `getInboxMessages()` para consulta e `markAsRead()` para acknowledgment. Não criar abstração excessiva — o Taskzei chama o Hub diretamente.
- **Decisão:** Integração `int_crm_ziplia_whatsapp` simulada como ativa para testes. Em produção, será conectada ao número dedicado do CRM Ziplia.
- **Decisão:** `module-doc.ts` corrigido para usar strings planas em vez de template literais multilinha, resolvendo erro TS1002.
- **Variáveis de ambiente** documentadas no `.env.example` e configuradas no `netlify.toml` para a função whatsapp-webhook.
