# Changelog

## [2026-04-19] - Karaokê independente (upload próprio)

### Alterado
- Página principal `KaraokePage` refatorada para fluxo independente:
  - upload local de mídia (áudio/vídeo),
  - upload de letra `.txt`,
  - entrada manual de letra,
  - leitura com destaque por timestamp `[mm:ss.xx]` quando disponível,
  - seek por clique na linha da letra com tempo,
  - auto-scroll opcional,
  - estados de vazio e erro de arquivo inválido,
  - ação de reset completo (`Limpar tudo`).

### Governança
- `module-doc.ts` atualizado para remover integração com Studio e refletir escopo independente do módulo.
- `decisions.md` atualizado com decisão formal de independência do Karaokê.

## [2026-04-18] - Ativação oficial de agente e prontidão operacional

### Adicionado
- Estrutura de runtime do módulo com bridge em `store/runtimeBridge.ts` e export em `store/index.ts`.
- Export de store no barrel do módulo em `index.ts`.
- Ownership oficial no manifesto com agente `Nanis Pelta`.
- Documentação operacional da agente em `agent/persona.md`, `agent/owner.md` e `agent/prompt-ativacao-cline.md`.
- Registro inicial de execução em `agent/session-log.md`.

### Alterado
- `KaraokePage` passou a consumir `workspaceId` dinâmico via runtime bridge, removendo dependência rígida exclusiva do fallback.

### Observação
- Build global apresentou erro de infraestrutura Vite/HTML proxy não relacionado ao módulo Karaoke.
