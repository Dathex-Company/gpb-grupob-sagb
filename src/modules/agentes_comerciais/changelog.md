# changelog — modulo agentes_atendendes

## 2026_04_17
- criacao da estrutura inicial do modulo `agentes_atendendes`.
- criacao da governanca minima (`decisions.md`, `history_chat.md`, `changelog.md`).
- criacao da estrutura de agente diretor `oton_lacerda_diretor`.
- criacao do arquivo de ativacao e da diretriz de refatoracao para execucao autonoma em novo chat.
- implementacao inicial da camada tecnica do modulo (types, services, store, hooks e componentes).
- integracao do modulo no `moduleRegistry` central.
- criacao da pagina `AgentesAtendentesPage` com listagem, cadastro e edicao basica via mock service.
- ajuste de imports relativos dos componentes para o caminho correto de `components/Icon`.
- validacao via `npm run build`: modulo `agentes_atendendes` sem erro de resolucao; build global segue falhando por pendencia preexistente em `src/modules/taskzei/components/tasks/task_list.tsx` (`./TaskListItem`).
