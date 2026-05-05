# 📋 Handoff — Continuidade do Módulo TaskZei (Agenda Inteligente)

> Copie esta mensagem para o novo chat para dar continuidade ao plano.

---

## Contexto Geral

Este é o módulo **TaskZei** (internamente chamado de **Agenda Inteligente**), localizado em:

```
z:\SagB\src\modules\taskzei\
```

É um módulo plugável do SagB que implementa um sistema completo de gestão de tarefas, reuniões, inbox inteligente, monitoramento e integrações.

---

## O Que Já Foi Implementado (11 de 12 Fases Concluídas)

| Fase | Status | Descrição |
|------|--------|-----------|
| **FASE 1** | ✅ Concluída | Correções de governança: manifest.ts (owner, displayName), module-doc.ts padronizado, persona.md como Dani Freitas |
| **FASE 3** | ✅ Concluída | Provider padrão trocado para Supabase (VITE_TASKZEI_PROVIDER=supabase), MockModeBanner criado |
| **FASE 4** | ✅ Concluída | CRUD completo: task_drawer.tsx com edição, checklist, comentários, auto-save, duplicar/arquivar |
| **FASE 5** | ✅ Concluída | Criação de tarefas a partir do SagB: origin.types.ts (OriginSystem, TaskOrigin) + createTaskFromOrigin() |
| **FASE 6** | ✅ Concluída | Inbox Inteligente: inbox.types.ts, inbox.store.ts, AgendaInteligenteInboxPage.tsx com classificação e conversão |
| **FASE 7** | ✅ Concluída | Reuniões e Decisões: meeting.types.ts, meeting.store.ts, AgendaInteligenteMeetingsPage.tsx com pautas e decisões |
| **FASE 8** | ✅ Concluída | NLP: nlParser.service.ts (parser por regex de linguagem natural) |
| **FASE 9** | ✅ Concluída | Integrações: taskzei.hub.ts + taskzei.conversational.ts |
| **FASE 10** | ✅ Concluída | Monitor/Auditoria: taskzei.audit.ts, taskzei.metrics.ts, taskzei.monitor.ts + AgendaInteligenteMonitorPage.tsx |
| **FASE 11** | ✅ Concluída | UI/UX completa: 6 páginas, layout com navegação lateral, tema industrial pastel |
| **FASE 2** | 🔒 **BLOQUEADA** | Infraestrutura própria Supabase — aguardando definição de dono financeiro (orçamento TaskZei/GrupoB) |

---

## Estrutura de Diretórios do Módulo

```
src/modules/taskzei/
├── agent/
│   ├── persona.md                  — Dani Freitas (Owner do Produto)
│   ├── session_log.md              — Histórico de sessões
│   ├── falas_user.md               — Falas literais do usuário
│   └── prompt_ativacao_cline.md    — Regras de ativação do agente
├── components/
│   └── tasks/
│       ├── task_drawer.tsx         — Drawer de edição com auto-save
│       ├── task_list.tsx           — Lista em tabela
│       ├── task_list_item.tsx      — Item com contexto menu
│       ├── task_filters.tsx        — Filtros por status + busca
│       └── task_kanban_board.tsx   — Visualização Kanban
├── layout/
│   └── AgendaInteligenteLayout.tsx — Shell com navegação lateral
├── pages/
│   ├── AgendaInteligentePage.tsx   — Home (Kanban + Lista)
│   ├── tasks/AgendaInteligenteTasksPage.tsx
│   ├── home/AgendaInteligenteHomePage.tsx
│   ├── inbox/AgendaInteligenteInboxPage.tsx
│   ├── meetings/AgendaInteligenteMeetingsPage.tsx
│   └── monitor/AgendaInteligenteMonitorPage.tsx
├── services/
│   ├── taskzei.facade.ts           — ~40 métodos com autoAudit
│   ├── taskzei_supabase_provider.ts — Provider Supabase real
│   ├── taskzei.providers.ts        — MockTaskzeiProvider
│   ├── taskzei.adapters.ts         — Factory do provider
│   ├── nlParser.service.ts         — Parser NLP
│   ├── taskzei.audit.ts            — Auditoria
│   ├── taskzei.metrics.ts          — Métricas
│   ├── taskzei.monitor.ts          — Monitoramento
│   ├── taskzei.conversational.ts   — Handler conversacional
│   └── taskzei.hub.ts              — Hub de integrações
├── store/
│   ├── taskzei.store.ts            — Zustand (tarefas)
│   ├── meeting.store.ts            — Zustand (reuniões/decisões)
│   └── inbox.store.ts              — Zustand (inbox)
├── types/
│   ├── task.types.ts               — TaskzeiTask, TaskChecklistItem, TaskComment
│   ├── taskzei.contracts.ts        — ITaskzeiRepository, ITaskzeiService
│   ├── origin.types.ts             — OriginSystem, TaskOrigin
│   ├── meeting.types.ts            — Meeting, MeetingAgendaItem, Decision
│   └── inbox.types.ts              — InboxItem, InboxSource, InboxStatus
├── manifest.ts                     — Registro do módulo no core
├── index.ts                        — Ponto de exportação
├── routes.tsx                      — Rotas do módulo
├── module-doc.ts                   — Documentação do módulo (ModuleDoc)
├── plano_modulo.md                 — Plano detalhado do módulo
├── changelog.md                    — Histórico de versões (v1.9.0)
└── decisions.md                    — Decisões arquiteturais (até decisao_019)
```

---

## Camada de Dados

- **Provider atual**: Supabase (tabelas no pool compartilhado do SagB)
- **Migration aplicada**: `20260505000101_taskzei_meetings_inbox_audit.sql`
- **Tabelas no Supabase**: taskzei_tasks, taskzei_task_checklist_items, taskzei_task_comments, taskzei_meetings, taskzei_meeting_agenda_items, taskzei_decisions, taskzei_inbox_items, taskzei_audit_log
- **Fallback mock**: MockTaskzeiProvider com dados fictícios
- **Stores Zustand**: taskzei.store.ts (tarefas), meeting.store.ts (reuniões), inbox.store.ts (inbox)

---

## Próximos Passos Prioritários

### 1. 🔗 Integração com Hub de Integrações (Status Atual)
O Hub de Integrações do SagB já está operacional e o TaskZei já possui listener ativo de `hub:inbound-message`.

Status atual:
- Event Bridge inbound ativo no TaskZei
- Processamento via `conversationalHandler`
- Marcação de mensagem lida via `markAsRead`

Próximo foco:
- elevar maturidade operacional (filtros inbound, observabilidade e redução de ruído de logs)

### 2. 📧 Conectores Externos (via Hub)
Prioridade definida pela Dani Freitas:
1. **WhatsApp** (Urgência Máxima) — demandas nascem soltas no WhatsApp
2. **E-mail (Gmail e Titan)** (Alta Prioridade)
3. **Ecossistema Meta (Facebook/Instagram)** (Baixa Prioridade)

### 3. 🏗️ FASE 2 — Infraestrutura Própria Supabase
Assim que houver definição de orçamento, criar projeto Supabase dedicado e migrar dados do pool compartilhado.

### 4. 🔌 Google Agenda / Google Calendar
Conectar o Google Calendar da conta `adm@forb.com.br` para sincronizar reuniões e compromissos. Seria necessário:
- Criar projeto no Google Cloud Console
- Habilitar Google Calendar API
- Configurar OAuth 2.0 (ou service account)
- Criar conector no Hub ou diretamente no TaskZei

---

## Arquivos de Governança Essenciais

- [`plano_modulo.md`](src/modules/taskzei/plano_modulo.md) — Plano completo com 20 seções, 10 fases, 28 ETs
- [`changelog.md`](src/modules/taskzei/changelog.md) — v1.9.0 (última versão com Batch 1-5)
- [`decisions.md`](src/modules/taskzei/decisions.md) — Decisões arquiteturais documentadas
- [`module-doc.ts`](src/modules/taskzei/module-doc.ts) — ModuleDoc conforme padrão canônico
- [`manifest.ts`](src/modules/taskzei/manifest.ts) — Registro com owner=Dani Freitas

---

## Contatos / Responsáveis

- **Dani Freitas** — Owner do Produto TaskZei / Agenda Inteligente
- **Alan Flow** — Diretor de Automações e Integrações (Hub de Integrações)
- **Cássio Mendes** — Validação técnica (consultivo)
- **Douglas Rodrigues** — Validação estratégica (roadmap)

---

> **Status atual**: Módulo operacional com 11 fases implementadas. Pendente: FASE 2 (Supabase dedicado) + integrações reais com Hub.
