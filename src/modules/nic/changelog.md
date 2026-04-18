# Changelog do Módulo nic

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **nic**.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.

---

## [v1.1.0-formalizacao-modulo] - 2026-04-11

### Adicionado
- `module-doc.ts` com objetivo, integrações, fluxos principais e pendências do NIC.
- Export oficial de `module-doc` no `index.ts` do módulo.

### Consolidado
- Papel do NIC formalizado como módulo interpretativo na cadeia `CID > NIC > NAGI`.
- Registro explícito de que o NIC não é storage primário, e sim camada de leitura estratégica.

### Pendências
- Trocar mocks por integração real com documentos do CID.
- Definir persistência real do histórico de leituras estratégicas.

---

## [v1.1.1-higienizacao-estrutural] - 2026-04-11

### Removido / Ajustado
- Duplicidade do card `Fluxo Operacional` em `data/nicBlueprint.ts`.
- Mantido o uso de `mockDocs` como ponte temporária até a integração real com o CID.

### Decisão
- Pastas vazias (`components/`, `hooks/`, `services/`, `store/`, `types/`) não foram removidas nesta etapa porque ainda podem compor o padrão estrutural do módulo.
- Itens com `A DEFINIR` foram preservados por serem lacunas formais, não resíduos mortos.
