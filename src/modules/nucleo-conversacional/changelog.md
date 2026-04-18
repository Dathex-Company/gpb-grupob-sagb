# Changelog do Módulo nucleo-conversacional

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **nucleo-conversacional**.

---

## [v1.2.0-otimizacao-chat-ux] - 2026-04-16

### Alterado
- Refatoração da função `handleSendMessage` e `handleUpdateAndRegenerate` no componente `SystemicVision.tsx` para adotar UI Otimista (Optimistic UI), injetando mensagens na tela imediatamente e removendo o delay bloqueante de banco de dados.
- Ajuste do listener `onSnapshot` no `SystemicVision.tsx` para respeitar mensagens em estado de "streaming" e mensagens otimistas locais, eliminando o efeito de "flickering" (pisca-pisca) visual durante a geração de textos da IA.

---

## [v1.1.0-refatoracao-ui-docs] - 2026-04-16

### Adicionado
- Botão `Docs` na header da view principal (`ConversationsView.tsx`).
- Modal de documentação técnica dinâmica lendo dados do `module-doc.ts`.
- Bloco de Responsabilidade (Responsável: Cássio Mendes) na header.
- Arquivo de registro de decisões (`decisions.md`).

### Alterado
- Refatoração da tipografia em `ConversationsView.tsx` para o padrão operacional leve (`12px` em textos densos e descrições).
- Atualizado log de sessão do agente (`agent/session-log.md`).

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.
