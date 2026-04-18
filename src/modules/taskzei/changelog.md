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
- `history_chat.md` para rastreabilidade contextual local.
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
