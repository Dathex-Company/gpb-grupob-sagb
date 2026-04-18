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
