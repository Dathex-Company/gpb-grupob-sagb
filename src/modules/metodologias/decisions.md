# decisions — metodologias

## 30/04/2026 - Módulo alinhado ao padrão canônico de governança do SagB.
- Pasta `agent` limitada aos 4 arquivos canônicos definidos em `docs/governanca_sagb/padrao_unificado_governanca.md`.

## 03/05/2026 - Refatoração completa para padrão canônico de módulos plugáveis.

### Decisões

1. **Fullscreen via ModuleRoute type** — Adicionado `fullscreen: true` na rota do módulo para exibição em tela cheia, seguindo o padrão estabelecido pelo módulo mentorias.

2. **HubPage como orquestrador central** — Diferente do mentorias (que usa 3 páginas independentes), o metodologias centraliza todo o estado e lógica no HubPage (1391 linhas), que renderiza 7 sub-páginas presentacionais via hash routing. As sub-páginas recebem dados via props e não possuem container próprio.

3. **Hash routing interno** — Usado `window.location.hash` para navegação entre as sub-páginas, evitando poluir o roteador global do SagB e permitindo URLs sharable dentro do módulo.

4. **`sagb:navigate` como padrão de retorno** — Adotado o evento customizado `sagb:navigate` (mesmo padrão usado pelo Gestão Financeira e mentorias) em vez de `window.history.back()`.

5. **Tokens `--sagb-*` como única fonte de cor** — Substituídas todas as ocorrências de cores hardcoded e `dark:` por tokens do tema. O módulo agora respeita o tema atual sem duplicação de definições.

6. **Badges semânticos com opacidade 10%** — Adotado o padrão `bg-*-500/10 text-*-500 border-*-500/20` para todos os badges de status, classificação e tags, substituindo o padrão anterior `bg-*-50/60 text-*-800`.

7. **Header canônico 2 colunas** — Adotado o mesmo padrão do mentorias: badge "Módulo Oficial" à esquerda, metadata (responsável) + ações (Docs, Voltar) à direita.

8. **Owner no manifest** — Definido `owner.type: 'agent'` como placeholder. Deve ser atualizado quando houver um responsável humano ou agente específico designado.

9. **`plano_modulo.md` sem planejamento futuro** — Documentado apenas o estado atual do módulo. Nenhuma ET (etapa futura) foi incluída.

10. **Import estático em vez de lazy()** — Substituído `React.lazy(() => import(...))` por import direto com JSX, eliminando a necessidade de Suspense e simplificando a estrutura de rotas.

---

## 03/05/2026 — Ajustes pós-refatoração + Sub-sidebar vertical

### Decisões

11. **`hideSidebar` vs `hideHeader`** — O antigo `isImmersiveMode` (booleano único) foi dividido em duas variáveis para controle granular: `hideSidebar` (esconde a sidebar lateral) e `hideHeader` (esconde a barra superior do SagB). Metodologias e mentorias agora usam `hideSidebar: true` mas mantêm o header visível (`hideHeader: false`). Apenas audacus-home usa ambos.

12. **Sub-sidebar vertical como padrão de navegação interna** — Implementado no módulo metodologias o mesmo pattern usado por configuracoes-ambiente e monitoramento: `grid grid-cols-1 lg:grid-cols-[280px_1fr]` com um `<aside>` de navegação vertical à esquerda e o conteúdo à direita. Substitui a navbar horizontal que ocupava espaço vertical desnecessário.

13. **Botões de documentação removidos** — Os botões "Docs" foram removidos tanto do HubPage de metodologias quanto do DashboardPage de mentorias. A documentação será mantida exclusivamente em arquivos no back-end, não no front-end do SagB.

14. **`MetodologiasInternalMenu` como componente reutilizável** — Seguindo o pattern de `ConfiguracoesInternalMenu`, o novo componente é auto-contido com lista de itens, estado ativo, e indicador de "Modo detalhamento ativo" para rotas de edição/detalhamento de ativos canônicos.

---

## 04/05/2026 — Refinamento visual do sidebar (opção 2 — paleta SagB integrada)

### Decisões

15. **Sidebar refinado com paleta SagB em vez de azul pesado** — Após o usuário rejeitar a primeira versão do sidebar (com fundo azul escuro `bg-sagb-blue` e texto branco), foi implementada uma segunda opção usando exclusivamente os tokens `--sagb-*` do tema claro do SagB. O sidebar agora usa `bg-sagb-panel` com `shadow-sm` e `border-r border-sagb-line`, e os botões de navegação são pills sutis — ativo `bg-sagb-bg-2 text-sagb-text border-sagb-line shadow-sm`, inativo `text-sagb-muted hover:bg-sagb-bg-2 hover:text-sagb-text hover:border-sagb-line`. A largura é fixa `w-64` e não varia com a quantidade de itens.
