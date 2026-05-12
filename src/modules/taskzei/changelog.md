# Changelog do Módulo taskzei

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **taskzei**.

---

## [1.16.0] — 2026-05-12

### Adicionado
- ET D20 — Implantação do Padrão Visual Robust Clean no módulo TaskZei
- Importação da fonte Google Fonts `Rubik` no `index.html` (Fallback: sans-serif)
- Definição dos tokens CSS da paleta Robust Clean no `:root` via `themeTokens.ts`: `--sagb-bg: #F2F4F6`, `--sagb-surface: #FFFFFF`, `--sagb-text: #303842` (Grafite), `--sagb-primary: #2FA99C`, `--sagb-blue: #5D86BC`, `--sagb-red: #C85E62`, `--sagb-amber: #D4953A`, `--sagb-muted: #8892A0`, `--sagb-line: rgba(48,56,66,.08)`, `--sagb-primary-soft`, `--sagb-shadow`, `--sagb-shadow-sm`, `--sagb-radius-xl`, `--sagb-radius-lg`, `--sagb-radius-2xl`

### Modificado
- **Fonte**: `fontFamily: "'Inter', sans-serif"` substituído por `"'Rubik', sans-serif"` em todos os componentes visuais
- **Tokens antigos removidos**: Nomes de variáveis CSS antigas (`--sagb-accent`, `--sagb-accent-bg`, `--sagb-accent-hover`, `--sagb-border`, `--sagb-surface-raised`, `--sagb-surface`, `--sagb-hover-bg`, `--sagb-text-muted`, `--sagb-text-primary`, `--sagb-text-secondary`, `--sagb-text-on-accent`, `--sagb-text-error`, `--sagb-focus`, `--sagb-warning`, `--sagb-success`, `--sagb-error`, `--sagb-selected-bg`) substituídos pelos novos tokens sem fallbacks hex
- **Cores hardcoded erradicadas**: Toda ocorrência de hex/rgb/hsl em Tailwind classes convertida para `style={{}}` inline com variáveis CSS
- **Hover effects**: Pseudoclasses `hover:*` do Tailwind substituídas por `onMouseEnter`/`onMouseLeave` com manipulação imperativa de estilo
- **Color Mix**: Backgrounds semitransparentes convertidos para `color-mix(in srgb, var(--sagb-*) X%, transparent)`
- **Sidebar**: `AgendaInteligenteLayout.tsx` com bordas, bg, sombras padronizadas
- **Componentes refatorados**:
  - `task_drawer.tsx` (803 linhas) — Complete refactoring com priorityColors, checklist, comments, documents section
  - `FocusWidget.tsx` (678 linhas) — ConfigModal, ActiveModal, PipWidget com tokens
  - `EditorCanvas.tsx` (865 linhas) — SaveIndicator, block editor, AI buttons, drag overlay
  - `DocumentTree.tsx` (398 linhas) — Tree nodes com selected/hover states
  - `task_list.tsx` + `task_list_item.tsx` — Column headers, inline edit, status selects
  - `task_filters.tsx` — Filter pills com active states
  - `MockModeBanner.tsx` — Warning banner com amber tokens
  - `AgendaInteligenteHomePage.tsx` — KPI cards, trend chart, operacional summary
  - `AgendaInteligentePage.tsx` — Main task page com kanban/list toggle, loading/error/empty states
  - `AgendaInteligenteMeetingsPage.tsx` — Lista + MeetingDetailModal com STATUS_COLORS
  - `task_kanban_board.tsx` — Kanban board com três colunas (abertas, em_andamento, concluídas) e drag-and-drop
  - `AgendaInteligenteInboxPage.tsx` — Lista + InboxRow com STATUS_CONFIG
  - `AgendaInteligenteMonitorPage.tsx` — Health status, metric cards, event log
  - `AgendaInteligenteDocumentsPage.tsx` — Split pane com tree + editor
  - `AgendaInteligenteSettingsPage.tsx`, `ProjectsPage.tsx`, `ProcessesPage.tsx` — Placeholder pages
  - `taskzei_notification.service.ts` — priority/status color maps com tokens

### Removido
- Todas as variáveis CSS antigas com fallback hex: `--sagb-border, #d9dee5`, `--sagb-accent, #68c7be`, etc.
- Todas as ocorrências de hex/rgb/hsl hardcoded em JSX/Tailwind dentro do módulo TaskZei
- Dependência visual da fonte `Inter` no módulo

### Observação
- A transição para o novo sistema visual é total e não quebra contratos de API ou interfaces existentes
- TS errors pre-existentes (Promise type mismatch em `useAutoSave`) não foram alterados — não são causados por esta refatoração
- O sistema de shadow/radius via CSS vars permite ajuste centralizado futuro sem alterar componentes
- `border-r`, `border-b`, `border-t` do Tailwind continuam funcionando pois definem apenas direção; a cor vem do `style={{ borderColor: 'var(--sagb-line)' }}`

## [1.15.0] — 2026-05-12

### Adicionado
- `taskzei.facade.ts`: trigger de notificação ao detectar mudança de `assigneeName` em `updateTask()` — dispara `TaskzeiNotificationService.notifyTaskCreated()` para o novo assignee
- `supabase/functions/taskzei-due-reminder/`: Supabase Edge Function com cron schedule para lembretes de prazo — consulta `taskzei_tasks` com `due_date` nas janelas (7d, 3d, 1d, 0d) e insere registros em `taskzei_notifications` com deduplicação SHA-256
- `supabase/migrations/20260512000103_taskzei_push_devices.sql`: tabela `taskzei_push_devices` (user_id, device_token, platform) com RLS policies e índices para suporte a push notifications via OneSignal

### Atualizado
- `module-doc.ts`: versão `1.15.0`, tabelas `taskzei_notifications`/`taskzei_push_devices` em dataDependencies, integrações Resend/SendGrid/OneSignal, boundary de notificações server-side

### Observação
- Notificações de assignee change reusam o fluxo existente (`TaskzeiNotificationService.notifyTaskCreated`) — sem nova lógica de template
- Due reminders usam Edge Function (Deno) para inserir registros — o envio continua pela Netlify Function existente (`taskzei-send-notification.mjs`)
- Push notifications requerem config de variáveis `ONESIGNAL_APP_ID` e `ONESIGNAL_REST_API_KEY` no Netlify
- Zero hardcode de chaves de API no frontend — toda comunicação passa por `/.netlify/functions/*` ou Supabase Edge Functions

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

---

## [1.10.0] — 2026-05-04 — SagB sidebar removido + "Voltar ao SagB" no sidebar do módulo

### Modificado
- `App.tsx` — adicionado `'agenda'` à lista `hideSidebar` para ocultar a sidebar global do SagB quando o módulo taskzei estiver ativo.
- `AgendaInteligenteLayout.tsx` — adicionado botão "← Voltar ao SagB" no rodapé da sidebar do módulo, com evento `sagb:navigate` para retornar ao ecosystem.

### Adicionado
- Rodapé da sidebar do taskzei com "Voltar ao SagB" — mesmo padrão dos módulos Metodologias e Mentorias.

---

## [1.11.0] — 2026-05-12 — ET D08-D12: Central de Documentos Inteligentes

### Adicionado
- **Migration** `supabase/migrations/20260512000101_taskzei_documents.sql` com 4 novas tabelas:
  - `taskzei_doc_nodes`: nós da árvore hierárquica (pastas e documentos) com suporte a soft delete via `deleted_at`
  - `taskzei_doc_contents`: blocos de conteúdo rich text (paragraph, heading, bulletList, orderedList, checkList, blockquote, codeBlock, image, divider) com JSONB attributes e content
  - `taskzei_entity_links`: links bidirecionais entre entidades (task ↔ document, etc.) com metadata JSONB e unique constraint
  - `taskzei_doc_attachments`: anexos referenciando storage bucket
  - RLS habilitado em todas as tabelas com políticas baseadas em workspace_id
- **Tipos** `src/modules/taskzei/types/doc_types.ts`: `DocNode`, `DocContent`, `DocContentInput`, `EntityLink`, `EntityLinkInput`, `DocAttachment`, `DocTreeNode` (árvore em memória), `IDocService`, funções helper `buildDocTree()` e `slugify()`
- **Store** `src/modules/taskzei/store/doc_store.ts`: Zustand store `useDocStore` com:
  - Gerenciamento de nós, árvore transformada via `buildDocTree()`, seleção, expansão/recolhimento
  - Gerenciamento de conteúdo por nodeId, entity links e estados de UI (loading, saving, error)
- **Serviço** `src/modules/taskzei/services/doc_service.ts`: `DocService` implementando `IDocService` com:
  - CRUD de nós (createNode, updateNode, deleteNode com soft delete, restoreNode)
  - Carregamento e salvamento de blocos de conteúdo (saveContents com substituição atômica)
  - Gerenciamento de entity links e anexos
  - Singleton `docService` exportado
- **Componente** `src/modules/taskzei/components/docs/DocumentTree.tsx`: árvore hierárquica expansível/colapsável com:
  - Navegação multinível com indentação progressiva
  - Botões de ação por nó (criar documento/pasta, excluir) em hover
  - Ações em lote: expandir todos, recolher todos
  - Estado vazio com CTA para criar primeiro documento
  - Uso de tokens CSS `--sagb-*` (sem hex hardcoded)
- **Componente** `src/modules/taskzei/components/docs/EditorCanvas.tsx`: editor de blocos rich text com:
  - 9 tipos de bloco: paragraph, heading (h2), bulletList, orderedList, checkList, blockquote, codeBlock, divider
  - Seletor de tipo por bloco visível em hover
  - Input/textarea para conteúdo inline conforme tipo
  - Auto-save com debounce de 1000ms e indicador visual (Salvando alterações... / Documento salvo / Erro ao salvar)
  - Criação de bloco via Enter, remoção via Backspace em bloco vazio
  - Estado vazio "Selecione um documento"
- **Componente** `src/modules/taskzei/components/docs/ExportActions.tsx`: exportação de documento com:
  - Dropdown com opções Markdown (.md) e HTML (.html)
  - Conversão de blocos para Markdown puro com formatação (`#`, `-`, `>`, ` ``` `, etc.)
  - Geração de HTML completo com `<head>`, `<style>` e estrutura semântica
  - Download automático via Blob URL com nome slugificado
  - Indicador de status "Exportado!" por 2s
- **Integração TaskDrawer**: seção "Documentos de Apoio" no drawer de tarefas com:
  - Lista de documentos vinculados com ícone, nome e botão de desvincular
  - Busca textual com dropdown de resultados para vincular novos documentos
  - Metadata payload `{"intent": "execution_support", "linked_from": "task_drawer", "timestamp": "<iso_string>"}`
  - Contador de documentos vinculados
  - Carregamento automático ao abrir drawer

### Atualizado
- `module-doc.ts`: versão atualizada para `1.11.0`, `supabaseTables` expandido com 4 novas tabelas, `boundaries` atualizado com soft delete e entity links
- `agent/persona.md`: adicionado monitoramento da Central de Documentos e alinhamento visual com tokens `--sagb-*`
- `agent/prompt_ativacao_cline.md`: adicionada calibração para a Central de Documentos Inteligentes
- `task_drawer.tsx`: adicionados imports do `docService`, `EntityLink` e `DocNode`; novos estados e effects para linked docs

### Observação
- Esta versão implementa a ET D08-D12 do roadmap, completando a Central de Documentos Inteligentes como subsistema do TaskZei.
- O editor usa blocos tipados com persistência em JSONB, compatible com modelo TipTap headless.
- CSS tokens `--sagb-*` foram utilizados em todos os novos componentes, com fallbacks para as cores do tema industrial pastel existente.
- Build validado: nenhum erro de compilação nos novos arquivos.

---

## [1.11.1] — 2026-05-12 — ET D13: Remediação Canônica e Polimento Pós-Auditoria

### Corrigido
- **FAIL #1**: `task_drawer.tsx` — seção "Documentos de Apoio" (linhas 557-659): todas as cores hex hardcoded substituídas por tokens `--sagb-*` (surface, surface-raised, border, text, text-muted, accent, accent-hover, accent-bg, hover-bg, selected-bg, error, focus)
- **WARNING #1**: `task_drawer.tsx` — `text-[11px]` substituído por `text-[12px]` (cancel button) conforme tabela canônica DEC-009
- **WARNING #3**: `DocumentTree.tsx` — `window.confirm()` bloqueante substituído por modal inline não-bloqueante com overlay e botões Cancelar/Confirmar, usando `--sagb-*` tokens
- **FAIL #2**: `prompt_ativacao_cline.md` — adicionada instrução `[📝 Auto-log: OK]` na seção de auto-log

---

## [1.11.2] — 2026-05-12 — ET D14: Refatoração de Interface — Densidade Extrema (Estilo ClickUp)

### Alterado
- `task_list.tsx`: reescrito com layout tabular CSS Grid (`grid-cols-[1fr_70px_90px_120px_110px_100px_28px]`), compactação vertical (`h-8`, `py-1`), tipografia canônica (`text-[12px]` corpo, `text-[10px] font-black uppercase tracking-widest` cabeçalhos), zero hex hardcoded (apenas fallbacks `var(--sagb-*, #hex)`)
- `task_list_item.tsx`: reescrito com:
  - Status reduzido a indicador 12×12px `rounded-sm` (sem badge/pill)
  - Prioridade como 12×12px `rounded-sm` + select compacto
  - Ações (⋯ menu) flutuando apenas em hover via `group-hover:opacity-100`
  - Cores centralizadas em objetos `STATUS_COLORS`, `PRIORITY_COLORS`, `PRIORITY_LABELS`, `STATUS_LABELS` com tokens `--sagb-*`
  - Colunas de largura fixa alinhadas ao grid pai via `LIST_COLUMNS`
  - Card variant preservado para kanban board (`task_kanban_board.tsx` compatível)

---

## [1.11.3] — 2026-05-12 — ET D15: Integração de Storage com o CID

### Adicionado
- **Migration** `supabase/migrations/20260512000102_taskzei_documents_cid_bridge.sql`:
  - Coluna `cid_ref_id TEXT` em `taskzei_doc_attachments` para referência ao storage do CID
  - Índice `idx_doc_attachments_cid_ref` para consulta por referência CID
- **Adapter** `src/modules/taskzei/services/doc_storage_adapter.ts` — `DocStorageAdapter` com:
  - `uploadAttachment()`: upload para bucket `cid-assets` no path `taskzei/{workspaceId}/{nodeId}/{timestamp}-{safeName}`, criação de registro em `taskzei_doc_attachments`, retorno de `DocAttachment` com `cidRefId`
  - `deleteAttachment()`: deleção de registro de attachment
  - `getAttachmentUrl()`: URL pública via `getSupabasePublicUrl('cid-assets', storageKey)`
- **Upload via Editor** (`EditorCanvas.tsx`):
  - Imports do `DocStorageAdapter`
  - Estado `uploadingFiles[]` com tracking de upload (`uploading` | `error`)
  - Estado `isDragOver` para feedback visual de drag-and-drop
  - `handleFileUpload()`: upload via DocStorageAdapter → CID, criação de bloco `image` (com `src`/`alt`/`attachmentId`) para imagens ou `paragraph` com link para binários
  - Drag-and-drop: `handleDragOver`/`handleDragLeave`/`handleDrop` com overlay visual (borda tracejada, fundo translúcido `--sagb-accent`)
  - Paste handler: `handlePaste` intercepta imagens da área de transferência
  - Indicador de upload com spinner animado (uploading) e alerta (error), auto-remoção após 2s/5s

### Modificado
- `doc_types.ts`: adicionado campo `cidRefId?: string` em `DocAttachment`; adicionados `createAttachment()` e `deleteAttachment()` à interface `IDocService`
- `doc_service.ts`: implementados `createAttachment()` (cria registro com todos os campos) e `deleteAttachment()` (deleção por id); `getAttachments()` lê `cid_ref_id` da collection
- `EditorCanvas.tsx`: adicionado tipo `'image'` em `BLOCK_TYPES`; adicionados manipuladores de upload, drag-drop e paste; renderização de blocos `image` com `<img>`; indicador de upload em tempo real; overlay de drag-and-drop com tokens `--sagb-*`

### Observação
- Zero hex hardcoded verificado em todos os novos arquivos — apenas fallbacks `var(--sagb-*, #hex)`.
- A integração usa o bucket compartilhado `cid-assets` com prefixo `taskzei/` para isolamento.
- Build validado.

---

## [1.12.0] — 2026-05-12 — ET D16: IA Contextual e Interação Inteligente com Documentos

### Adicionado
- **`src/modules/taskzei/services/doc_nlp_adapter.ts`** — Ponte de Leitura Semântica (ET D16 Item 1):
  - `compileDocContent(nodeId, payloadLimit?)`: compila blocos TipTap JSONB para texto plano com estrutura markdown-like
  - `compileDocContentChunks(nodeId)`: divisão de documentos longos em chunks com overlap de 1KB
  - `compileLinkedDocs(entityType, entityId, payloadLimit?)`: compila todos os documentos vinculados a uma entidade
  - `extractKeywords(text, maxKeywords?)`: extração de keywords por frequência com filtro de stopwords
  - `compileBlock()`: mapeamento de 10 tipos de bloco (heading→`# texto`, bulletList→`- texto`, checkList→`[x] texto`, codeBlock→``````, image→`[Imagem: alt]`, etc.)
  - `renumberOrderedLists()`: pós-processamento de numeração 1. 2. 3. para ordered lists consecutivas
- **`src/modules/taskzei/services/doc_ai_service.ts`** — Serviço de IA com Contexto Documental (ET D16 Item 2):
  - `extractActionsFromDoc(nodeId)`: extrai ações de um documento via Gemini e cria tarefas vinculadas
  - `summarizeDoc(nodeId)`: gera resumo + palavras-chave via Gemini
  - `extractActionsFromLinkedDocs(entityType, entityId)`: extração em lote de todos os docs vinculados
  - `askQuestion(nodeIds[], question)`: perguntas e respostas sobre múltiplos documentos
  - `generateTasksFromCommand(userCommand, docContext)`: geração de tarefas a partir de comando + contexto documental
  - `callAiWithRetry<T>()`: helper com 2 retentativas e parsing JSON da resposta da IA
  - 5 system prompts especializados (extração, sumarização, Q&A, geração de tarefas)
- **Extensão do ConversationalHandler** (`taskzei.conversational.ts`) (ET D16 Item 3):
  - `processMessageWithDocs(text, linkedDocIds, context?)`: processamento de mensagens com contexto documental
  - `detectDocCommand(text)`: detecção de comandos (`'extrair ações'`, `'resuma'`, comandos customizados)
  - Roteamento para `extractActionsFromDoc`, `summarizeDoc`, `generateTasksFromCommand`
- **Interface de Prompt Assistido — EditorCanvas** (`EditorCanvas.tsx`) (ET D16 Item 4):
  - Botões "✨ Extrair Ações" e "✨ Gerar Resumo" no header do editor
  - Spinner animado durante processamento (`aiProcessing: 'extracting' | 'summarizing'`)
  - Feedback de resultado com auto-limpeza após 4-8 segundos
  - Handlers `handleExtractActions` e `handleSummarize` com tratamento de erro
- **Interface de Prompt Assistido — TaskDrawer** (`task_drawer.tsx`) (ET D16 Item 5):
  - Botões "✨ Extrair Ações" e "✨ Gerar Resumo" na seção "Documentos de Apoio"
  - Operação em lote sobre todos os documentos vinculados
  - Spinner e feedback visual consistentes com o EditorCanvas

### Atualizado
- `module-doc.ts`: versão atualizada para `1.12.0`
- `taskzei.conversational.ts`: adicionado intent `'doc_ai'`, método `processMessageWithDocs()`, comando `detectDocCommand()`
- `EditorCanvas.tsx`: adicionados imports do `docAiService`, estados de IA, handlers e botões no header
- `task_drawer.tsx`: adicionados imports do `docAiService`, estados de IA, handlers e botões na seção de documentos

### Observação
- Toda comunicação com IA usa exclusivamente `callAiProxy('gemini_chat', ...)` com modelId `gemini-2.5-flash`.
- Nenhuma chave de API exposta no frontend — o proxy (`aiProxy.ts`) roteia via backend (`/api/ai`).
- System prompts em português com instruções estruturadas para retorno JSON.
- Retry automático (2 tentativas) com fallback silencioso em caso de falha da IA.
- Zero hex hardcoded nos novos componentes — apenas fallbacks `var(--sagb-*, #hex)`.
- Build validado.

## [1.14.0] — 2026-05-12

### Adicionado
- `focusWidgetStore.ts`: nova Zustand store com modo `FocusWidgetMode` (`'hidden' | 'config' | 'active_modal' | 'pip'`) e transições `open()`, `minimize()`, `expand()`, `close()`
- `FocusWidget.tsx`: componente de hiperfoco flutuante com 4 modos de renderização — `config` (modal de configuração), `active_modal` (timer circular com pause/resume/stop), `pip` (widget flutuante compacto no canto inferior direito com arrasto via `mousedown`/`mousemove`/`mouseup`), `hidden` (null)

### Alterado
- `task_list_item.tsx`: `handleFocusClick` agora abre o `FocusWidget` via `useFocusWidgetStore.getState().open()` em vez de disparar navegação de página via `sagb:navigate` — elimina desmontagem do TaskZei
- `AgendaInteligenteLayout.tsx`: `<FocusWidget />` montado como último filho do `<main>` — persiste sobre toda a interface

### Removido
- `task_list_item.tsx`: import de `useFocusStore` (substituído por `useFocusWidgetStore`), chamada a `window.dispatchEvent` com `sagb:navigate` para rota `/foco-total/*`

## [1.13.0] — 2026-05-12

### Adicionado
- `task_list.tsx`: colunas dinamicamente redimensionáveis via drag handles (`mousedown`/`mousemove`/`mouseup`), estado reativo de larguras em pixels via hook `useColumnResize`, cabeçalho com divisórias arrastáveis, `gridTemplateColumns` dinâmico aplicado via `style`
- `task_list_item.tsx`: prop `gridColumnsStyle?: string` para receber o grid dinâmico do pai

### Alterado
- `task_list.tsx`: removida constante estática `LIST_COLUMNS`, `TaskCreateRow` adaptado para receber `gridTemplate` via prop
- `task_list_item.tsx` (variante `table`): densidade linear absoluta com `height: 32` (`h-8`), descrição posicionada ao lado do título com `truncate`, erradicados sub-elementos abaixo do título, cor do título alterada para `var(--sagb-text-muted, #95a0b1)` com `text-[12px] font-medium`
