# Changelog do MÃ³dulo taskzei

Registro de mudanÃ§as tÃ©cnicas, decisÃµes de arquitetura e evoluÃ§Ã£o do mÃ³dulo **taskzei**.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histÃ³rico local do mÃ³dulo (changelog.md).
- Base para rastreabilidade contÃ­nua de mudanÃ§as.

### PendÃªncias (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsÃ¡vel.

## [v1.1.0-autonomia-diretoria] - 2026-04-17

### Adicionado
- `decisions.md` com decisÃµes de governanÃ§a do mÃ³dulo e oficializaÃ§Ã£o de `dani_freitas`.
- `agent/prompt_ativacao_cline.md` para ativaÃ§Ã£o autÃ´noma em novo chat.
- `agent/diretriz_refatoracao_modulo.md` com ordem de leitura e comandos de execuÃ§Ã£o.
- `agent/session_log.md` para log contÃ­nuo do mÃ³dulo.
- pacote completo da agente diretora em `agent/dani_freitas_diretora/`.

### Atualizado
- owner oficial do mÃ³dulo definido para Dani Freitas em `agent/owner.md`.

## [v1.2.0-kanban-interface] - 2026-04-17

### Adicionado
- Componente `task_kanban_board.tsx` com visualizaÃ§Ã£o em colunas (aberta, em_andamento, concluida) e suporte bÃ¡sico a drag-and-drop.
- Modo de alternÃ¢ncia entre visualizaÃ§Ã£o Kanban e Lista na pÃ¡gina principal.

### Atualizado
- `AgendaInteligentePage.tsx` completamente renovada com:
  - IntegraÃ§Ã£o com `taskzeiFacade` e `useTaskzeiStore`
  - BotÃ£o "Nova Tarefa" com prompt interativo
  - Tratamento de estados (loading, error, empty)
  - AlternÃ¢ncia dinÃ¢mica entre modos de visualizaÃ§Ã£o
- PadronizaÃ§Ã£o de nomenclatura de componentes para lowercase com underscore:
  - `task_drawer.tsx` (antes TaskDrawer.tsx)
  - `task_filters.tsx` (antes TaskFilters.tsx)
  - `task_list.tsx` (antes TaskList.tsx)
  - `task_list_item.tsx` (antes TaskListItem.tsx)
- Logs atualizados em `agent/session_log.md` e `agent/dani_freitas_diretora/session_log.md`.

### CorreÃ§Ãµes
- Ajuste de imports apÃ³s renomeaÃ§Ã£o de componentes.
- ManutenÃ§Ã£o de padrÃµes de cÃ³digo existentes do mÃ³dulo.

## [v1.3.0-supabase-persistence] - 2026-04-17

### Adicionado
- MigraÃ§Ã£o `supabase/migrations/20260417000101_taskzei_persistence.sql` com schema de persistÃªncia do taskzei:
  - `taskzei_tasks`
  - `taskzei_task_checklist_items`
  - `taskzei_task_comments`
  - Ã­ndices, trigger de `updated_at` e polÃ­ticas RLS
- Novo provider `taskzei_supabase_provider.ts` com suporte a `get/create/update/delete` persistente em Supabase.

### Atualizado
- `taskzei.adapters.ts` para seleÃ§Ã£o de provider por env (`VITE_TASKZEI_PROVIDER`):
  - `mock` (padrÃ£o)
  - `supabase`
- `.env.example` com nova variÃ¡vel `VITE_TASKZEI_PROVIDER`.

### ValidaÃ§Ã£o
- Build de produÃ§Ã£o executado com sucesso apÃ³s integraÃ§Ã£o (`npm run build`).

## [v1.3.1-migration-identification-hardening] - 2026-04-17

### Atualizado
- Migration `20260417000101_taskzei_persistence.sql` recebeu cabeÃ§alho de rastreabilidade explÃ­cita:
  - contexto de uso no banco compartilhado do SagB
  - isolamento por prefixo `taskzei_`
  - referÃªncia para plano de migraÃ§Ã£o futura

### Adicionado
- Documento `src/modules/taskzei/docs/MIGRACAO_FUTURA_SUPABASE_TASKZEI.md` com plano 1:1 de migraÃ§Ã£o para Supabase dedicado:
  - escopo de tabelas
  - estratÃ©gia de export/import
  - checklist de validaÃ§Ã£o pÃ³s-migraÃ§Ã£o

## [v1.3.2-fix-routing-id] - 2026-04-18

### CorreÃ§Ãµes
- Corrigido o `id` no `taskzeiManifest` de `agenda-inteligente` para `agenda` para alinhar com o mapeamento esperado no Sidebar do sistema raiz e habilitar a exibiÃ§Ã£o da tela do mÃ³dulo corretamente.

## [v1.4.0-task-filters-and-search] - 2026-04-18

### Adicionado
- Filtros funcionais por status na tela de tarefas (`todas`, `aberta`, `em_andamento`, `concluida`) com contadores por segmento.
- Busca textual por tÃ­tulo e descriÃ§Ã£o na Ã¡rea de filtros da agenda inteligente.
- Estado vazio contextual para cenÃ¡rios sem resultado de filtro/busca com aÃ§Ã£o de limpar refinamentos.

### Atualizado
- `TaskFilters` evoluÃ­do de bloco visual estÃ¡tico para componente controlado por estado da pÃ¡gina.
- `AgendaInteligenteTasksPage` passou a aplicar filtro cumulativo (status + texto), exibindo quantidade filtrada no cabeÃ§alho.

### Compatibilidade
- Mantido o fluxo de seleÃ§Ã£o de tarefa no drawer e conclusÃ£o de tarefa via facade sem alteraÃ§Ãµes de contrato.

## [v1.5.0-industrial-pastel-ui-refresh] - 2026-04-18

### Adicionado
- Novo padrÃ£o visual compactado para filtros de tarefas em `task_filters.tsx` com toolbar mais operacional, busca integrada e aÃ§Ã£o de limpar filtros.
- CabeÃ§alho tabular na lista de tarefas em `task_list.tsx` com colunas orientadas ao uso diÃ¡rio (nome, prioridade, cliente, colaborador, vencimento, status).
- Variante `card` em `task_list_item.tsx` para preservar compatibilidade de leitura no modo kanban.

### Atualizado
- `AgendaInteligenteTasksPage.tsx` com:
  - dupla barra superior contextual (breadcrumbs + views + aÃ§Ã£o principal);
  - estÃ©tica `industrial pastel` aplicada em tipografia, bordas e superfÃ­cies;
  - integraÃ§Ã£o de troca de status inline por linha na tabela.
- `AgendaInteligenteLayout.tsx` refinado para sidebar mais densa e profissional, com marca, hierarquia de navegaÃ§Ã£o e bloco de contexto de workspace.
- `AgendaInteligenteHomePage.tsx` evoluÃ­da de placeholder para dashboard funcional com KPIs, agenda e atividade recente.
- `task_kanban_board.tsx` adaptado para usar `TaskListItem` na variante `card`, evitando regressÃ£o visual no kanban.

### ValidaÃ§Ã£o
- Build de produÃ§Ã£o executado com sucesso via `npm run build` apÃ³s as alteraÃ§Ãµes de interface.

