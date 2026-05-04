# Changelog do MÃ³dulo nucleo-conversacional

Registro de mudanÃ§as tÃ©cnicas, decisÃµes de arquitetura e evoluÃ§Ã£o do mÃ³dulo **nucleo-conversacional**.

---

## [v1.4.0-hardening-observabilidade-chat] - 2026-05-01

### Adicionado
- UtilitÃ¡rio de observabilidade estruturada em `src/modules/nucleo-conversacional/utils/observability.ts`.
- Camada inicial de persistÃªncia de chat em `src/modules/nucleo-conversacional/services/chatPersistence.ts` para reduzir duplicidade operacional.

### Alterado
- `ConversationsView.tsx` passou a ler preview direto de `chat_sessions.payload.latestMessageText`, removendo padrÃ£o N+1 de leitura por sessÃ£o.
- `ConversationsView.tsx` recebeu tipagem local de sessÃ£o (`SessionRowData`) em substituiÃ§Ã£o de `any` nos pontos crÃ­ticos do estado.
- `ChatMessage.tsx` passou a usar `UserProfile` tipado e `ReactMarkdown` com `skipHtml` + `allowedElements` para hardening de renderizaÃ§Ã£o.
- `SystemicVision.tsx` iniciou extraÃ§Ã£o de persistÃªncia (`touchChatSessionMetadata`, `persistBotPlaceholder`) e padronizou logs de erro desses fluxos com observabilidade do mÃ³dulo.

### SeguranÃ§a
- ReduÃ§Ã£o de superfÃ­cie de renderizaÃ§Ã£o markdown (sem HTML cru), com whitelist de elementos permitidos.

---

## [v1.3.0-performance-lazy-hydration] - 2026-04-20

### Alterado
- RefatoraÃ§Ã£o do pipeline de agentes em `App.tsx` para separar ingestÃ£o de snapshot (`dbAgents`) da lista de UI (`activatedAgents`) e remover hidrataÃ§Ã£o pesada global durante render.
- Introduzido resolvedor sob demanda `hydrateAgentForRuntime(...)` para montar DNA/contexto apenas no momento de abrir conversa ou compor instruÃ§Ã£o de execuÃ§Ã£o.
- Ajustado roteamento de chat (`handleAgentInteraction` / `handleOpenAgentSession`) para usar agente hidratado sob demanda, preservando validaÃ§Ãµes operacionais.
- Ajustado `directChannelProfile` para resolver instruÃ§Ã£o com agente hidratado no momento da composiÃ§Ã£o.
- Atualizado sincronismo de `setRuntimeAiContext(...)` para derivar identidade a partir de `dbAgents` + hidrataÃ§Ã£o sob demanda, evitando acoplamento com re-render de lista de UI.

### Observabilidade
- InstrumentaÃ§Ã£o de performance adicionada no fluxo de agentes em `App.tsx` (`console.time`/`console.debug`) e na listagem de conversas em `ConversationsView.tsx` para medir snapshot, previews e custo de montagem.

---

## [v1.2.0-otimizacao-chat-ux] - 2026-04-16

### Alterado
- RefatoraÃ§Ã£o da funÃ§Ã£o `handleSendMessage` e `handleUpdateAndRegenerate` no componente `SystemicVision.tsx` para adotar UI Otimista (Optimistic UI), injetando mensagens na tela imediatamente e removendo o delay bloqueante de banco de dados.
- Ajuste do listener `onSnapshot` no `SystemicVision.tsx` para respeitar mensagens em estado de "streaming" e mensagens otimistas locais, eliminando o efeito de "flickering" (pisca-pisca) visual durante a geraÃ§Ã£o de textos da IA.

---

## [v1.1.0-refatoracao-ui-docs] - 2026-04-16

### Adicionado
- BotÃ£o `Docs` na header da view principal (`ConversationsView.tsx`).
- Modal de documentaÃ§Ã£o tÃ©cnica dinÃ¢mica lendo dados do `module-doc.ts`.
- Bloco de Responsabilidade (ResponsÃ¡vel: CÃ¡ssio Mendes) na header.
- Arquivo de registro de decisÃµes (`decisions.md`).

### Alterado
- RefatoraÃ§Ã£o da tipografia em `ConversationsView.tsx` para o padrÃ£o operacional leve (`12px` em textos densos e descriÃ§Ãµes).
- Atualizado log de sessÃ£o do agente (`agent/session_log.md`).

---

## [v1.5.0-standalone-infrastructure] - 2026-05-03

### Adicionado
- `package.json` com React 19, react-markdown 10, TypeScript ~5.8 como peer/dev dependencias.
- `index.ts` barrel export publico: ConversationsView, ChatMessage, ChatAttachmentCard, providers (setDbProvider, setLlmProvider), ncLog, tailwind preset.
- `tailwind.preset.ts` com tokens bitrix (6 cores) + sagb (13 cores, 3 gradientes, 10 sombras) exportaveis como preset PostCSS ou objetos avulsos para CDN.

### Alterado
- `plano_modulo.md` — infraestrutura adicionada como passo entre Camada 3 e Camada 4 no roadmap.
- `agent/session_log.md` — registro da execucao da infraestrutura standalone.
- `decisions.md` — atualizada com decisoes da infraestrutura.

## [v1.4.0-hardening-observabilidade-chat] - 2026-05-01

### Adicionado
- Utilitário de observabilidade estruturada em `src/modules/nucleo-conversacional/utils/observability.ts`.

---

## [v1.6.1-esm-hotfix] - 2026-05-03

### Corrigido
- White screen ao clicar em "Conversas" no sidebar: `require()` usado em `ncDb.ts` e `ncLlm.ts` crashava em contexto ESM/Vite. Substituído por `import()` dinâmico com promise cacheada.
- `ncDb.ts` — `getSupabase()` convertido de `require()` síncrono para `import()` assíncrono com promise cacheada (`_supabaseInit`).
- `ncLlm.ts` — `getAiProxy()` convertido de `require()` síncrono para `import()` assíncrono com promise cacheada (`_proxyInit`).
- `ConversationsView.tsx` — `subscribeToSessions` agora retorna `Promise<() => void>`; useEffect adaptado com flag `cancelled` e ref de cleanup para evitar race conditions em re-render.

---

## [v1.6.0-standalone-layer4] - 2026-05-03

### Adicionado
- SuggestionPanel.tsx — TitleSuggestionPanel e TaskSuggestionPanel como componentes standalone no módulo.
- Substituição dos JSX inline correspondentes no SystemicVision.tsx pelos componentes importados.

### Alterado
- SystemicVision.tsx — ~38 linhas removidas (3.264 → ~3.226), 1 import adicionado.
- index.ts — Exporta SuggestionPanel, TitleSuggestionPanel, TaskSuggestionPanel.
- plano_modulo.md — Camada 4 marcada como concluída.

### Pendências (Roadmap)
- Chat input, streaming e header ainda estão no SystemicVision. Próxima refatoração: ChatContainer.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histÃ³rico local do mÃ³dulo (changelog.md).
- Base para rastreabilidade contÃ­nua de mudanÃ§as.

### PendÃªncias (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsÃ¡vel.

