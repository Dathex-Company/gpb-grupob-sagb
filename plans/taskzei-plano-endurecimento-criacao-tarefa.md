# Plano — Endurecimento da criação de tarefas no TaskZei

## Objetivo
Elevar o fluxo de criação de tarefa para padrão de produção com validação de domínio, observabilidade, UX de erro consistente e cobertura de testes.

## Escopo
- Fluxo de criação via [`AgendaInteligenteTasksPage`](src/modules/taskzei/pages/tasks/AgendaInteligenteTasksPage.tsx)
- Modal de criação em [`TaskModal`](src/modules/taskzei/components/tasks/TaskModal.tsx)
- Orquestração em [`createTask()`](src/modules/taskzei/services/taskzei.facade.ts:77)
- Atualização de estado em [`useTaskzeiStore`](src/modules/taskzei/store/taskzei.store.ts)
- Criação de subtarefa em [`handleOpenCreateSubtask()`](src/modules/taskzei/pages/tasks/AgendaInteligenteTasksPage.tsx:75)

## Checklist de execução
- [ ] 1. Consolidar regras de domínio da criação
  - [ ] Definir contrato de entrada canônico para título, prioridade, status e data
  - [ ] Validar limites de tamanho e normalização de texto antes de persistir
  - [ ] Garantir coerência entre `parentTaskId` e limite hierárquico

- [ ] 2. Fortalecer validação na camada de serviço
  - [ ] Implementar validação central em [`createTask()`](src/modules/taskzei/services/taskzei.facade.ts:77)
  - [ ] Retornar erros de domínio tipados para UI diferenciar erro de validação e erro técnico
  - [ ] Preservar compatibilidade com caminho Hub ClickUp

- [ ] 3. Padronizar UX de erro e sucesso no fluxo de criação
  - [ ] Exibir erro de criação de forma explícita no modal em [`TaskModal`](src/modules/taskzei/components/tasks/TaskModal.tsx)
  - [ ] Garantir estado `saving` robusto em submit duplo e fechamento por escape
  - [ ] Confirmar atualização visual imediata da lista após sucesso

- [ ] 4. Blindar criação de subtarefas
  - [ ] Validar limite de profundidade também na camada de serviço
  - [ ] Bloquear criação de nível inválido com mensagem de feedback clara
  - [ ] Cobrir casos de referência a pai inexistente

- [ ] 5. Melhorar observabilidade e rastreabilidade
  - [ ] Padronizar logs de erro de criação com contexto mínimo de diagnóstico
  - [ ] Remover logs temporários de debug dos documentos (`[DEBUG-DOC]`, `[DEBUG-EDITOR]`)
  - [ ] Garantir auditoria de criação consistente para todos os caminhos

- [ ] 6. Cobertura de testes do caminho crítico
  - [ ] Teste de criação de tarefa raiz
  - [ ] Teste de criação de subtarefa válida
  - [ ] Teste de bloqueio de subtarefa em profundidade inválida
  - [ ] Teste de falha de provider com mensagem amigável na UI

- [ ] 7. Validação final de integração
  - [ ] Executar build e checagem TypeScript
  - [ ] Validar manualmente criação em modo local e modo Hub
  - [ ] Atualizar documentação técnica e changelog do módulo

## Critérios de aceite
- Criação de tarefa funciona sem regressão em raiz e subtarefa
- Erros são exibidos para o usuário com mensagem clara e sem tela branca
- Regras de domínio estão centralizadas e testadas
- Não restam logs temporários de debug no código de produção
