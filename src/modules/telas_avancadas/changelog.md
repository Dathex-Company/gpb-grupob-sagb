# Changelog do Módulo telas_avancadas

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **telas_avancadas**.

---

## [v1.2.0-super-tela-sagb-v1] - 2026-04-20

### Adicionado
- Botão `Super Tela SagB` no cabeçalho da página principal para abrir uma experiência expandida de comando visual.
- Componente `SuperTelaSagBPanel` em camada full-screen com layout orientado a múltiplos monitores e blocos fictícios de operação.

### Estrutura Visual (v1 fictícia)
- Painel full-screen com header fixo e CTA de fechamento.
- Grid expandido com blocos grandes para: Panorama Operacional, Empresas, Monitoramento, Agentes, Automações, Alertas, Ferramentas e Comandos Rápidos.
- Botões amplos em cada bloco para iniciar fluxos de comando simulados.

### Observações
- Implementação preserva o comportamento atual do módulo e funciona como camada adicional, sem remover as telas já existentes.
- Correção de compatibilidade de navegação: `manifest.id` e `baseRoute` retornaram para `telas-avancadas`/`/telas-avancadas` para manter aderência com o `id` já utilizado na [`Sidebar`](components/Sidebar.tsx:116) e na tipagem global de tabs.

## [v1.1.0-migracao-novo-padrao] - 2026-04-20

### Alterado
- Migração técnica de naming do módulo para underscore: `telas-avancadas` -> `telas_avancadas`.
- Atualização do `manifest.ts` para contrato atual com `id`, `internalName` e `baseRoute` em underscore.
- Inclusão de `owner` no manifesto com responsável humano oficial (`Cley Scrini`).
- Atualização da rota do módulo para `'/telas_avancadas'`.
- Ajuste de import no `moduleRegistry` para apontar ao novo diretório do módulo.

### Governança
- Definido `Cley Scrini` como owner principal no `agent/owner.md`.
- Definido `Cley Devis` como persona oficial do agente no `agent/persona.md`.
- Inclusão dos artefatos obrigatórios de governança: `module-doc.ts`, `history-chat.md`, `decisions.md`, `agent/prompt-ativacao-cline.md` e `agent/session-log.md`.

### Observações
- Mantida compatibilidade de chave de armazenamento local (`sagb_telas_avancadas_v2`) para evitar perda de dados já existentes no navegador.
- Renomeação de pasta executada para `src/modules/telas_avancadas` com remoção da estrutura antiga `src/modules/telas-avancadas`.

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner backup com nome e sobrenome.
