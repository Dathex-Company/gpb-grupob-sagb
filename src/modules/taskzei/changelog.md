# Changelog do Módulo taskzei

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **taskzei**.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.

## [v1.1.0-autonomia-diretoria] - 2026-04-17

### Adicionado
- `decisions.md` com decisões de governança do módulo e oficialização de `dani_freitas`.
- `agent/prompt_ativacao_cline.md` para ativação autônoma em novo chat.
- `agent/diretriz_refatoracao_modulo.md` com ordem de leitura e comandos de execução.
- `agent/session_log.md` para log contínuo do módulo.
- pacote completo da agente diretora em `agent/dani_freitas_diretora/`.

### Atualizado
- owner oficial do módulo definido para Dani Freitas em `agent/owner.md`.

## [v1.2.0-kanban-interface] - 2026-04-17

### Adicionado
- Componente `task_kanban_board.tsx` com visualização em colunas (aberta, em_andamento, concluida) e suporte básico a drag-and-drop.
- Modo de alternância entre visualização Kanban e Lista na página principal.

### Atualizado
- `AgendaInteligentePage.tsx` completamente renovada com:
  - Integração com `taskzeiFacade` e `useTaskzeiStore`
  - Botão "Nova Tarefa" com prompt interativo
  - Tratamento de estados (loading, error, empty)
  - Alternância dinâmica entre modos de visualização
- Padronização de nomenclatura de componentes para lowercase com underscore:
  - `task_drawer.tsx` (antes TaskDrawer.tsx)
  - `task_filters.tsx` (antes TaskFilters.tsx)
  - `task_list.tsx` (antes TaskList.tsx)
  - `task_list_item.tsx` (antes TaskListItem.tsx)
- Logs atualizados em `agent/session_log.md` e `agent/dani_freitas_diretora/session_log.md`.

### Correções
- Ajuste de imports após renomeação de componentes.
- Manutenção de padrões de código existentes do módulo.

## [v1.3.0-supabase-persistence] - 2026-04-17

### Adicionado
- Migração `supabase/migrations/20260417000101_taskzei_persistence.sql` com schema de persistência do taskzei:
  - `taskzei_tasks`
  - `taskzei_task_checklist_items`
  - `taskzei_task_comments`
  - índices, trigger de `updated_at` e políticas RLS
- Novo provider `taskzei_supabase_provider.ts` com suporte a `get/create/update/delete` persistente em Supabase.

### Atualizado
- `taskzei.adapters.ts` para seleção de provider por env (`VITE_TASKZEI_PROVIDER`):
  - `mock` (padrão)
  - `supabase`
- `.env.example` com nova variável `VITE_TASKZEI_PROVIDER`.

### Validação
- Build de produção executado com sucesso após integração (`npm run build`).

## [v1.3.1-migration-identification-hardening] - 2026-04-17

### Atualizado
- Migration `20260417000101_taskzei_persistence.sql` recebeu cabeçalho de rastreabilidade explícita:
  - contexto de uso no banco compartilhado do SagB
  - isolamento por prefixo `taskzei_`
  - referência para plano de migração futura

### Adicionado
- Documento `src/modules/taskzei/docs/MIGRACAO_FUTURA_SUPABASE_TASKZEI.md` com plano 1:1 de migração para Supabase dedicado:
  - escopo de tabelas
  - estratégia de export/import
  - checklist de validação pós-migração

## [v1.3.2-fix-routing-id] - 2026-04-18

### Correções
- Corrigido o `id` no `taskzeiManifest` de `agenda-inteligente` para `agenda` para alinhar com o mapeamento esperado no Sidebar do sistema raiz e habilitar a exibição da tela do módulo corretamente.

## [v1.4.0-task-filters-and-search] - 2026-04-18

### Adicionado
- Filtros funcionais por status na tela de tarefas (`todas`, `aberta`, `em_andamento`, `concluida`) com contadores por segmento.
- Busca textual por título e descrição na área de filtros da agenda inteligente.
- Estado vazio contextual para cenários sem resultado de filtro/busca com ação de limpar refinamentos.

### Atualizado
- `TaskFilters` evoluído de bloco visual estático para componente controlado por estado da página.
- `AgendaInteligenteTasksPage` passou a aplicar filtro cumulativo (status + texto), exibindo quantidade filtrada no cabeçalho.

### Compatibilidade
- Mantido o fluxo de seleção de tarefa no drawer e conclusão de tarefa via facade sem alterações de contrato.

## [v1.5.0-industrial-pastel-ui-refresh] - 2026-04-18

### Adicionado
- Novo padrão visual compactado para filtros de tarefas em `task_filters.tsx` com toolbar mais operacional, busca integrada e ação de limpar filtros.
- Cabeçalho tabular na lista de tarefas em `task_list.tsx` com colunas orientadas ao uso diário (nome, prioridade, cliente, colaborador, vencimento, status).
- Variante `card` em `task_list_item.tsx` para preservar compatibilidade de leitura no modo kanban.

### Atualizado
- `AgendaInteligenteTasksPage.tsx` com:
  - dupla barra superior contextual (breadcrumbs + views + ação principal);
  - estética `industrial pastel` aplicada em tipografia, bordas e superfícies;
  - integração de troca de status inline por linha na tabela.
- `AgendaInteligenteLayout.tsx` refinado para sidebar mais densa e profissional, com marca, hierarquia de navegação e bloco de contexto de workspace.
- `AgendaInteligenteHomePage.tsx` evoluída de placeholder para dashboard funcional com KPIs, agenda e atividade recente.
- `task_kanban_board.tsx` adaptado para usar `TaskListItem` na variante `card`, evitando regressão visual no kanban.

### Validação
- Build de produção executado com sucesso via `npm run build` após as alterações de interface.

## [v1.6.0-governance-consolidation] - 2026-05-02

### Adicionado
- `plano_modulo.md` com plano executivo completo contendo 10 fases detalhadas, 28 ETs, KPIs, riscos e baseline do módulo.

### Corrigido
- `manifest.ts`: adicionado campo `owner` com `{ type: 'human', id: 'dani_freitas', displayName: 'Dani Freitas' }` conforme padrão canônico (seção 1.1.1 do `padrao_modulos_plugaveis.md`).
- `manifest.ts`: corrigido `displayName` de `'taskzei'` para `'Agenda Inteligente'` alinhado à estratégia de branding.
- `module-doc.ts`: removido `agent/owner.md` de `requiredDocs` (proibido pelo padrão canônico).
- `module-doc.ts`: adicionado `plano_modulo.md` à lista de documentos obrigatórios.
- `agent/persona.md`: substituída persona genérica "Guardião do Módulo" por "Dani Freitas — Produto TaskZei" com autoridade explícita de produto.

### Removido
- Referência a `agent/owner.md` em todos os arquivos de governança do módulo.

### Observação
- As correções acima implementam a ET-01, ET-02 e ET-03 da FASE 1 do plano de implantação.

---

## [1.7.0] — 2026-05-04 — ET-08: Provider Supabase como Default

### Alterado
- `VITE_TASKZEI_PROVIDER` default de `mock` → `supabase` (`.env.example` e `taskzei.adapters.ts`).
- Provider Supabase agora é o padrão em produção; mock é fallback explícito de desenvolvimento.

### Adicionado
- `components/MockModeBanner.tsx`: componente de alerta visual quando em modo mock (amarelo, não intrusivo).
- `MockModeBanner` integrado ao `AgendaInteligenteLayout.tsx` acima do conteúdo principal.

### Observação
- Esta entrada implementa a ET-08 da FASE 3 do plano de implantação.
- Decisão alinhada à decisao_011: mock como fallback de desenvolvimento, não dívida técnica.
- Supabase utilizado é o compartilhado do SagB (shared pool), não dedicado.

---

## [1.6.1] — 2026-05-04 — ET-04: Checklist de Conformidade

### Adicionado
- `module-doc.ts`: reescrito para implementar a interface `ModuleDoc` com tipagem TypeScript (displayName, version, boundaries, integrations tipadas, dataDependencies).
- `README.md`: criado com identidade do módulo, estrutura de arquivos, stack, status de conformidade e owner.

### Corrigido
- `module-doc.ts`: versão anterior era objeto `{}` sem tipagem; agora exporta `moduleDoc: ModuleDoc` conforme contrato `src/core/modules/module.types.ts`.
- `module-doc.ts`: `displayName` agora é o campo oficial (antes usava `name`/`title` não padronizados).

### Pendências (não conformidades documentadas)
As seguintes não conformidades foram identificadas e **não foram resolvidas no ET-04** por escopo:

1. **Conformidade visual canônica** (item 9 do checklist):
   - Uso massivo de cores hex inline (`#d9dee5`, `#68c7be`, `#87a8cf`, etc.) em todos os componentes .tsx
   - Tipografia usa `text-xs`, `text-[11px]` fora da tabela canônica (deveria ser `text-[12px]`)
   - Header canônico do módulo não implementado (badge "Módulo Oficial", linha "Responsável: Dani Freitas")
   - Container raiz sem declaração explícita de `font-inter`
   - → **Agendado para FASE de refatoração visual pós FASE 10 ou fase específica de design tokens**
2. **Arquivos de governança em lowercase**: `changelog.md` e `decisions.md` estão em lowercase; o padrão recomenda UPPERCASE. Mantido lowercase para compatibilidade com referências existentes em `module-doc.ts`.

### Relatório de Conformidade (ET-04)

| # | Item | Status |
|---|------|--------|
| 1 | Pasta em `src/modules/taskzei/` | ✅ Conforme |
| 2 | `manifest.ts`, `routes.tsx`, `index.ts`, `module-doc.ts` | ✅ Conforme |
| 3 | `module-doc.ts` implementa `ModuleDoc` tipado | ✅ Conforme (corrigido) |
| 4 | `README.md`, `changelog.md`, `decisions.md` presentes | ✅ Conforme (README criado) |
| 5 | `plano_modulo.md` (plano ativo de evolução) | ✅ Conforme |
| 6 | Pasta `agent/` com 4 arquivos canônicos | ✅ Conforme |
| 7 | Owner declarado em `manifest.ts` | ✅ Conforme |
| 8 | Módulo registrado em `moduleRegistry.ts` | ✅ Conforme |
| 9 | Conformidade visual canônica | ⚠️ Pendente (ver acima) |

---

## [1.8.0] — 2026-05-04 — FASE 4: CRUD Completo de Tarefas (ET-09 a ET-12)

### Adicionado
- **ET-09 — Drawer com edição real de tarefa** (`task_drawer.tsx`):
  - Todos os 6 campos editáveis: título (input), descrição (textarea), status (select), prioridade (select), responsável (input), data de vencimento (date input)
  - Auto-save em cada blur de campo com indicador visual de salvamento (saving/saved/error)
  - Hook customizado `useAutoSave` com debounce e timer de 2s para auto-limpeza
  - Componente `SaveIndicator` com estados: salvando (animação), salvo (check verde), erro (alerta vermelho)
- **ET-10 — Checklist funcional** (`task_drawer.tsx`):
  - Adicionar item via tecla Enter ou botão +
  - Toggle de conclusão via checkbox
  - Remover item com hover (×)
  - Contador de itens (completados/total)
  - Persistência via `addChecklistItem`, `toggleChecklistItem`, `removeChecklistItem`
- **ET-11 — Comentários funcionais** (`task_drawer.tsx`):
  - Textarea + botão "Comentar" para adicionar
  - Lista com avatar (inicial do autor), nome, data relativa e conteúdo
  - Persistência via `addComment`
- **ET-12 — Ações rápidas de tarefa** (`task_list_item.tsx`):
  - Menu de contexto (⋯) com opções "Duplicar" e "Arquivar"
  - Botão ⋯ aparece em hover (opacity-0 → opacity-100)
  - Fechamento do menu ao clicar fora (click-outside detection com ref)
  - Callbacks `onDuplicate` e `onArchive` propagados via `TaskList` → `TaskListItem`

### Atualizado
- **`task.types.ts`**: adicionado `'urgente'` a `TaskPriority`, campo `archived?: boolean` em `TaskzeiTask`
- **`taskzei.contracts.ts`**: expandido `ITaskzeiRepository` e `ITaskzeiService` com 6 novos métodos (addChecklistItem, toggleChecklistItem, removeChecklistItem, addComment, duplicateTask, archiveTask)
- **`taskzei.providers.ts`** (MockTaskzeiProvider): implementados todos os 6 novos métodos com lógica in-memory completa
- **`taskzei_supabase_provider.ts`** (SupabaseTaskzeiProvider): implementados todos os 6 novos métodos com operações Firestore (addDoc, updateDoc, deleteDoc, query com where)
- **`taskzei.facade.ts`** (TaskzeiFacade): implementados todos os 6 novos métodos com chamada ao provider + atualização da Zustand store
- **`task_list.tsx`**: adicionados `onDuplicate` e `onArchive` às props, propagados ao `TaskListItem`
- **`AgendaInteligentePage.tsx`**:
  - Adicionados handlers `handleDuplicateTask`, `handleArchiveTask`, `handleUpdateTask`
  - List view substituída de renderização manual de cards para componente `TaskList` (com edição inline, contexto de ações rápidas)
  - Import do `TaskList` e `TaskzeiTaskInlineInput`
### Validação
- Build de produção executado com sucesso: ✅ 701 módulos, 24.09s

---

## [1.9.0] — 2026-05-04 — Batch 1+2: Origin, Meetings, Inbox & Audit (Fases 5-7, 10)

### Adicionado
- **Migration** `supabase/migrations/20260505000101_taskzei_meetings_inbox_audit.sql`:
  - `taskzei_tasks`: colunas `origin_system`, `origin_ref`, `origin_metadata`, `related_doc_ids`, `archived`
  - `taskzei_meetings`, `taskzei_meeting_agenda_items`, `taskzei_decisions`: schema completo de reuniões
  - `taskzei_inbox_items`: schema de captura de itens externos
  - `taskzei_audit_log`: schema de auditoria com payload JSONB
  - Índices, triggers de `updated_at`, RLS habilitado
- **Tipos** `src/modules/taskzei/types/origin.types.ts`: `OriginSystem`, `TaskOrigin`
- **Tipos** `src/modules/taskzei/types/meeting.types.ts`: `Meeting`, `MeetingAgendaItem`, `Decision` com todos os enums
- **Tipos** `src/modules/taskzei/types/inbox.types.ts`: `InboxItem`, `InboxSource`, `InboxStatus`, `SuggestedEntityType`
- **Stores** `meeting.store.ts` e `inbox.store.ts`: Zustand stores para meetings/decisions e inbox items
- **Contrato** `taskzei.contracts.ts`: ~25 novos métodos em `ITaskzeiRepository` e `ITaskzeiService` (origem, meetings, inbox, auditoria)
- **MockTaskzeiProvider**: dados mock de meetings (1) e inboxItems (2), todos os novos métodos implementados in-memory
- **SupabaseTaskzeiProvider**: todos os novos métodos com operações Firestore nos novos schemas
- **TaskzeiFacade**: `autoAudit` silencioso integrado a todos os métodos mutantes; métodos delegados aos providers com sincronização de stores

### Alterado
- `task.types.ts`: `TaskzeiTask` ganhou `origin?: TaskOrigin` e `relatedDocIds?: string[]`
- `taskzei.contracts.ts`: interfaces expandidas com suporte a origem de tarefas, reuniões, inbox e auditoria
- `taskzei.providers.ts`: reescrito com novos métodos e dados mock
- `taskzei_supabase_provider.ts`: reescrito com novos tipos de linha (MeetingRow, AgendaItemRow, DecisionRow, InboxRow) e mapeamento snake_case ↔ camelCase
- `taskzei.facade.ts`: reescrito com `autoAudit` e integração total com MeetingStore e InboxStore

### Batch 3 — Serviços de Lógica (Fase 8 e 10)
- **`nlParser.service.ts`**: Serviço de parse de linguagem natural com padrões regex para identificar intenções (task, meeting, decision, inbox), extração de prioridade, responsável, datas relativas (hoje, amanhã, dias da semana), horários e duração. Singleton `nlParser` exportado.
- **`taskzei.audit.ts`**: Serviço `AuditService` com métodos `queryLogs`, `getActionSummary`, `getUserActivityReport` — filtragem em memória com fallback silencioso quando provider não suporta leitura de logs.
- **`taskzei.metrics.ts`**: Serviço `MetricsService` com `computeTaskMetrics` (taxa de conclusão, dias médios, atrasadas), `computeMeetingMetrics` (status, duração, decisões), `computeInboxMetrics` (conversão, confiança) e `computeOverall`. Singleton `metricsService`.
- **`taskzei.monitor.ts`**: Serviço `MonitorService` com buffer circular de 1000 eventos, avaliação de limiares configuráveis, `getHealthStatus` (healthy/degraded/critical), `getActiveAlerts` e `cleanOldEvents`. Singleton `monitorService`.

### Batch 4 — Componentes de UI (Fases 6, 7, 10)
- **`AgendaInteligenteInboxPage.tsx`**: Reescrito com listagem real de inbox items, filtros por status (todas/pendentes/classificados/convertidos/descartados), quick-add inline, classificação em linha com seleção de tipo, conversão direta para tarefa, ação de descartar com hover.
- **`AgendaInteligenteMeetingsPage.tsx`**: Página de reuniões com listagem, filtro por status, criação inline com formulário (título, descrição, data, horário, duração), modal de detalhe com pauta (add/toggle status) e decisões (add com responsável/prazo), alteração de status da reunião via select.
- **`AgendaInteligenteMonitorPage.tsx`**: Painel de monitoramento com status de saúde do módulo, métricas de tarefas (grid 4 colunas), métricas de reuniões, métricas de inbox, alertas ativos, eventos recentes do monitor, contagem de auditoria.
- **Layout** `AgendaInteligenteLayout.tsx`: Adicionadas views `meetings` e `monitor` à navegação lateral com ícones de calendário e gráfico.

### Batch 5 — Integrações (Fase 9)
- **`taskzei.conversational.ts`**: `ConversationalHandler` com `processMessage(text, context?)` — faz parse via nlParser, executa ação correspondente (cria tarefa com origem, agenda reunião, salva decisão no inbox, fallback para inbox), retorna resultado estruturado com sugestões de continuação.
- **`taskzei.hub.ts`**: `HubIntegrationService` com métodos `publishTaskCreated`, `publishTaskCompleted`, `publishMeetingCreated`, `publishInboxConverted`, `syncState` — atualmente faz console.log, preparado para conectar ao hub-integracao quando disponível (conforme decisao_013).

### Observação
- Esta versão implementa todos os 5 Batches do plano_execucao_unificada.md, completando as Fases 5 a 10 do plano_modulo.md.
- Pendente: FASE 2 (Infraestrutura própria Supabase — aguardando definição financeira).
- Build validado: nenhum erro de compilação no módulo taskzei.
