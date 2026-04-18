# Changelog do Módulo CID

Este arquivo mantém o registro de mudanças técnicas, decisões de arquitetura e refatorações exclusivas do módulo **Centro de Inteligência Documental (CID)**.

---

## [v1.0.0-governance] - 2026-04-09

### Adicionado
- **Isolamento Documental:** Criada a pasta `src/modules/cid` para aderir ao novo padrão de governança de módulos plugáveis.
- **Manifesto Base:** Criado o arquivo `manifest.ts` para permitir que o módulo seja enxergado pela interface e gerenciado no sistema de governança (`moduleRegistry.ts`).
- **Ficha Consolidada (`module-doc.ts`):** O conhecimento do módulo que antes existia apenas em formato Markdown na pasta `docs/` foi tipado e incluído como objeto TS para que a interface de catálogo possa ler suas tabelas, integrações, buckets e fluxos em tempo real sem precisar de um parser de MD.
- **Changelog Local:** Criado este próprio arquivo (`changelog.md`) para ser a "Single Source of Truth" do histórico desse módulo específico. As mudanças feitas nele não precisam poluir o `DEV_LOG.md` da raiz com minúcias, apenas atualizações de alto impacto.

### Pendências (Roadmap)
- Refatorar o componente legado `components/CIDView.tsx`, fatiando-o em subcomponentes e movendo-os para a subpasta `components/` dentro de `src/modules/cid`.

## [v1.0.1-agent-governance] - 2026-04-09

### Adicionado
- **Estrutura de Agente do Módulo:** criada a pasta `src/modules/cid/agent/` para separar claramente owner humano e persona operacional de IA.
- **Owner Humano (`owner.md`):** documento com accountability formal, escopo e alçadas do responsável pelo módulo.
- **Persona de Agente (`persona.md`):** documento com missão, foco técnico, regras e checklist do agente especialista do CID.

### Impacto
- O módulo CID passa a carregar, junto da ficha técnica, a sua camada mínima de governança humano+agente para continuidade operacional.
