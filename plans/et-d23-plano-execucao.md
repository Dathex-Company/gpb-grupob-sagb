# ET D23 — Plano de Execução

## Escopo confirmado
- Hierarquia de subtarefas recursiva até 5 níveis
- Integração de responsáveis com base global de utilizadores
- Blindagem visual Robust Clean sem hardcode de cor
- Atualização de documentação de módulo e changelog

## Checklist de execução
- [ ] 1. Banco de dados
  - [ ] Criar migration para adicionar `parent_task_id` em `taskzei_tasks`
  - [ ] Criar índice em `parent_task_id`
  - [ ] Definir regra de remoção consistente com soft delete

- [ ] 2. Tipos e contratos
  - [ ] Estender [`TaskzeiTask`](src/modules/taskzei/types/task.types.ts:19) com `parentTaskId`, `depth`, `hasChildren`
  - [ ] Ajustar [`TaskzeiTaskInlineInput`](src/modules/taskzei/types/taskzei.contracts.ts:22) para criação como subtask
  - [ ] Incluir métodos no repositório/serviço para árvore e toggle de expansão

- [ ] 3. Provider Supabase + Mock
  - [ ] Mapear `parent_task_id` em [`taskzei_supabase_provider.ts`](src/modules/taskzei/services/taskzei_supabase_provider.ts:36)
  - [ ] Garantir leitura com ordenação estável para árvore
  - [ ] Atualizar [`taskzei.providers.ts`](src/modules/taskzei/services/taskzei.providers.ts:8) sem dados de demonstração

- [ ] 4. Store e performance
  - [ ] Evoluir [`useTaskzeiStore`](src/modules/taskzei/store/taskzei.store.ts:16) para estado normalizado
  - [ ] Implementar `buildTaskTree` com limite de profundidade 5
  - [ ] Implementar `expandedIds` e seletor memoizado de linhas visíveis
  - [ ] Bloquear criação de 6º nível em store e UI

- [ ] 5. UI da tabela de tarefas
  - [ ] Adaptar [`TaskList`](src/modules/taskzei/components/tasks/task_list.tsx:131) para render recursivo linear
  - [ ] Ajustar [`TaskListItem`](src/modules/taskzei/components/tasks/task_list_item.tsx:183) com indent por nível
  - [ ] Adicionar botão expand/recolher minimalista na coluna título
  - [ ] Preservar densidade `h-8` e redimensionamento de colunas

- [ ] 6. Atribuição global de utilizadores
  - [ ] Substituir input textual de responsável em [`TaskModal`](src/modules/taskzei/components/tasks/TaskModal.tsx:275)
  - [ ] Consumir view canônica de perfis via `services/supabase`
  - [ ] Exibir avatar + nome em modal e grid
  - [ ] Persistir `assigneeId` e `assigneeName` sincronizados

- [ ] 7. Governança e validação
  - [ ] Verificar tokens visuais somente `--sagb-*`
  - [ ] Atualizar [`module-doc.ts`](src/modules/taskzei/module-doc.ts)
  - [ ] Registrar versão em [`changelog.md`](src/modules/taskzei/changelog.md:1)
  - [ ] Executar build e validação TypeScript

## Estratégia técnica
- Árvore em memória com estrutura normalizada para reduzir re-render
- Flatten derivado por seletor memoizado para alimentar grid linear
- Guard rails de profundidade em dois pontos: serviço/store e componentes de ação
- Atribuição por dataset global, evitando qualquer fallback textual mockado

## Riscos e mitigação
- Divergência de base global de perfis
  - Mitigação: fallback seguro de leitura, sem quebrar edição de tarefa
- Custo de render em árvores grandes
  - Mitigação: flatten memoizado + expansão explícita por nó
- Integridade de hierarquia
  - Mitigação: bloqueio de ciclos e bloqueio de profundidade > 5

