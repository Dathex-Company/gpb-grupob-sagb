# Changelog do MÃ³dulo nucleo-conversacional

Registro de mudanÃ§as tÃ©cnicas, decisÃµes de arquitetura e evoluÃ§Ã£o do mÃ³dulo **nucleo-conversacional**.

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

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histÃ³rico local do mÃ³dulo (changelog.md).
- Base para rastreabilidade contÃ­nua de mudanÃ§as.

### PendÃªncias (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsÃ¡vel.

