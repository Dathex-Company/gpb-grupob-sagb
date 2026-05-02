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
- Módulo agora atende aos requisitos do `padrao_modulos_plugaveis.md` seção 7 (checklist mínimo de conformidade).
