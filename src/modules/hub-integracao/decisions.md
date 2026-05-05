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
