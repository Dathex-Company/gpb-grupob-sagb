# Changelog do Módulo nagi

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **nagi**.

---

## [v1.0.0-formalizacao-inicial] - 2026-04-11

### Adicionado
- Estrutura mínima oficial do módulo em `src/modules/nagi`.
- `manifest.ts`, `routes.tsx`, `pages/NAGIPage.tsx` e `pages/index.ts`.
- `module-doc.ts` com papel, integrações, fluxos e pendências.
- `agent/owner.md` e `agent/persona.md` para responsabilidade e continuidade.
- `changelog.md` para rastreabilidade local.

### Consolidado
- NAGI formalizado como camada de governança estratégica e portfólio de iniciativas.
- Registro explícito de que o módulo não é storage primário nem engine documental.
- Papel do NAGI fixado como etapa de governança na cadeia `CID > NIC > NAGI`.

### Pendências
- Definir owner principal e backup com nome e sobrenome.
- Evoluir de portfólio estático para persistência viva.
- Conectar saídas do NIC à priorização do NAGI.

---

## [v1.0.1-auditoria-higienizacao] - 2026-04-11

### Auditado
- Revisão estrutural da pasta `src/modules/nagi` após formalização inicial.
- Verificação de resíduos óbvios como duplicidades, placeholders técnicos e scaffolds mortos.

### Resultado
- Nenhum resíduo claro removível foi encontrado dentro da estrutura recém-criada do módulo.
- A estrutura foi mantida íntegra por estar aderente ao padrão formal mínimo.

### Observação
- Lacunas como definição de owner e evolução para persistência viva permanecem como pendências formais do módulo, não como lixo estrutural.

---

## [v1.1.0-internalizacao-view] - 2026-04-11

### Alterado
- `pages/NAGIPage.tsx` passou a usar a view internalizada do próprio módulo.
- `components/NAGIView.tsx` foi internalizado em `src/modules/nagi/components/` e ajustado para importar `types.ts` e `components/Icon.tsx` pelos caminhos corretos.

### Adicionado
- `docs/inputs/` como pasta oficial de ingestão documental bruta do módulo.

### Decisão
- O arquivo global legado `components/NAGIView.tsx` permanece temporariamente até revisão final de resíduos e remoção controlada.

---

## [v1.1.1-fechamento-internalizacao] - 2026-04-11

### Ajustado
- `src/modules/nagi/components/NAGIView.tsx` corrigido para usar imports válidos do contexto modularizado.

### Removido
- Componente legado global `components/NAGIView.tsx`, após validação de ausência de referências ativas.

### Resultado
- O NAGI passa a depender apenas da view interna do próprio módulo.
