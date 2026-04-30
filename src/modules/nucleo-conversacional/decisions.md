# Decisões Arquiteturais e de Produto — Núcleo Conversacional

Este documento registra as decisões estruturais e de governança do módulo, mantidas por Poazi Bellini.

---

## 2026-04-16 — Estrutura do Modal de Documentação

- **Decisão:** O modal de documentação técnica foi integrado diretamente no `ConversationsView.tsx` em vez de ser um componente isolado.
- **Motivo:** O conteúdo do modal de leitura de `module-doc.ts` é simples e estático do ponto de vista de UI. Criar um componente separado agora adicionaria complexidade prematura de importações e estados. A visibilidade condicional resolve o problema atual mantendo a performance leve.
- **Impacto:** O arquivo da View ganha mais linhas HTML (jsx), porém reduzimos a quantidade de arquivos e re-renderizações complexas.

## 2026-04-16 — Governança e Refatoração de UI (Padrão 12px)

- **Decisão:** Reduzir a tipografia para `12px` (text-xs) nas descrições e sub-conteúdos da lista de conversas, e suavizar sombras (shadow-sm em vez de shadow-md por padrão).
- **Motivo:** Alinhar com as orientações globais de padronização do SagB que pregam a "tipografia operacional leve".
- **Impacto:** Melhor densidade de informação em telas e um visual mais coeso com o resto do ecossistema de Agentes.

## 2026-04-20 — Separação Snapshot x Hidratação e Lazy Runtime no Chat

- **Decisão:** Separar o fluxo de agentes em duas camadas no `App.tsx`: 
  1) snapshot leve de cadastro (`dbAgents`),
  2) estado de UI operacional (`activatedAgents`) sem hidratação completa de DNA em massa.
- **Motivo:** O modelo anterior hidratava prompt/memória/DNA de todos os agentes a cada atualização de dependências globais, gerando custo alto de CPU e re-render desnecessário.
- **Impacto:** Redução de acoplamento entre atualização de governança/DNA e renderização do chat/listas; melhor base para escalabilidade do Núcleo Conversacional.

- **Decisão complementar:** introduzir resolver sob demanda `hydrateAgentForRuntime(...)` para montar contexto completo apenas no momento de uso (abertura de conversa, composição de instrução e runtime AI context).
- **Motivo complementar:** preservar completude de contexto para execução sem carregar payload pesado em toda a árvore de UI.
- **Impacto complementar:** menor pressão de render global e melhor responsividade nas interações de chat.
