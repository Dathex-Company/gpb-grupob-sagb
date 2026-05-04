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

## 2026-05-01 — Hardening incremental do Núcleo Conversacional

- **Decisão:** remover padrão N+1 da listagem de conversas, utilizando preview vindo de `chat_sessions.payload.latestMessageText` em `ConversationsView.tsx`.
- **Motivo:** reduzir latência e custo de leitura por sessão na entrada do módulo.
- **Impacto:** melhoria de escalabilidade e tempo de abertura da Central de Mensagens.

- **Decisão complementar:** introduzir `utils/observability.ts` para logs estruturados do módulo.
- **Motivo complementar:** criar padrão de telemetria reutilizável e reduzir dispersão de logs ad-hoc.
- **Impacto complementar:** maior rastreabilidade operacional para debug e performance tuning.

- **Decisão complementar:** extrair persistência de chat inicial para `services/chatPersistence.ts` (metadata de sessão e placeholder bot).
- **Motivo complementar:** reduzir duplicidade e preparar fatiamento progressivo de `SystemicVision.tsx`.
- **Impacto complementar:** base de refatoração contínua sem ruptura de fluxo.

- **Decisão complementar:** reforçar renderização markdown em `ChatMessage.tsx` com `skipHtml` e whitelist de elementos.
- **Motivo complementar:** diminuir superfície de conteúdo não controlado na UI de chat.
- **Impacto complementar:** aumento de segurança de apresentação de respostas IA/usuário.

## 2026-05-03 — Início do desacoplamento para produto standalone

- **Decisão:** O módulo Núcleo Conversacional será o primeiro produto standalone vendável do SagB. Iniciado desacoplamento por camadas.
- **Motivo:** O módulo é um chat multi-agente auto-contido, ideal para comercialização independente.
- **Camada 1 (tipos):** Criado `types.ts` local com cópia das interfaces essenciais (Agent, Message, Sender, ChatAttachment, UserProfile, PersonaConfig, etc.). Imports dos componentes migrados de `../../../../types` para `../types`.
- **Impacto:** ~120 linhas de tipos copiadas. ChatAttachmentCard.tsx que tinha import quebrado (`../types` não existia) foi corrigido automaticamente. Módulo agora independente do types.ts raiz para seus tipos de domínio.
- **Camadas 2 e 3 executadas:** UI local (ícones, Avatar) + abstração de providers (banco + LLM com DI containers).
- **Infraestrutura standalone:** Criado package.json (React 19, react-markdown 10, TypeScript ~5.8), index.ts (barrel export público), tailwind.preset.ts (tokens bitrix + sagb exportáveis como preset ou objetos avulsos). Primeiro módulo do SagB com infraestrutura própria de publicação.
- **Camada 4 (SuggestionPanels):** Criado `components/SuggestionPanel.tsx` com TitleSuggestionPanel (botões de título) e TaskSuggestionPanel (botões de sugestão de pauta). Substituídos os JSX inline correspondentes no SystemicVision.tsx (ex-linhas 3090-3128) pelos componentes importados. Handlers permanecem no SystemicVision por dependerem de estado local.
- **Decisão:** A extração foi conservadora — apenas o JSX de renderização foi movido. Os handlers continuam no SystemicVision porque dependem de: activeMessages, currentSessionId, isLoading, generateTitleOptions, generateTaskSuggestions, updateDoc (Firestore). Uma extração mais profunda exigiria refatorar o chat input + streaming primeiro.
- **Próximo passo:** Chat input, streaming e header permanecem no SystemicVision. Para extraí-los, seria necessário um `ChatContainer` que encapsule estado de input, anexos, gravação de áudio e streaming.
