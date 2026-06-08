# changelog — mcp-sagb

## 07/06/2026 — MEGA-ETAPA 01: LOZE-MCP-OPS V1 — Operações, Ambientes e Segredos (v2.0.0)
- **NOVO PADRÃO**: `LOZE-MCP-OPS | Operações, Ambientes e Segredos` — camada de governança operacional segura.
- **NOVO**: `docs/loze-mcp-ops-ambientes.md` — Arquitetura completa da V1: definição, fluxo obrigatório, camadas, travas.
- **NOVO**: `docs/mapa-ambiente-segredos.md` — Mapa de ambientes, variáveis e segredos (sem valores reais).
- **NOVO**: `docs/registro-operacoes-mcp.md` — Modelo obrigatório de registro operacional com correlation_id.
- **NOVO**: `docs/checklist-seguranca-ambiente-mcp.md` — Checklist de segurança por ambiente (local, preview, produção).
- **NOVO**: `docs/matriz-permissoes-mcp.md` — Matriz de permissões: 8 ferramentas permitidas, 2 protegidas, 11 bloqueadas.
- **NOVO**: `.env.example` — Template com valores falsos, 3 grupos de variáveis.
- **DECISÃO**: LOZE-MCP-OPS não é novo módulo — é camada de governança sobre o MCP SagB existente.
- **DECISÃO**: O MCP não expõe segredos — opera ações com credencial protegida.
- **DECISÃO**: Produção tem trava mais rígida — ações críticas bloqueadas por padrão.
- **ESCOPO**: Ações bloqueadas na V1: alterar-variavel-producao, deploy-producao, alterar-rls, migration, reset-banco, force-push, entre outras.

## 04/05/2026 — Mega Batch 2: SDK MCP real + Server Node.js + Bridge Contracts (v1.1.0)
- **NOVO**: Dependência `@modelcontextprotocol/sdk` v1.29.0 instalada.
- **NOVO**: `server/mcpServer.ts` — Servidor MCP usando `McpServer` + `StdioServerTransport` do SDK oficial.
  - Resources: `sagb://modules` (módulos instalados), `sagb://tools` (catálogo de ferramentas)
  - Resource Template: `sagb://module/{id}` (detalhe de módulo individual)
  - Tools: `list-modules` (lista módulos com filtro), `mcp-status` (status do servidor)
  - Modo Node.js standalone — executável via `npx tsx src/modules/mcp_sagb/server/runner.ts`
- **NOVO**: `server/runner.ts` — CLI runner com parsing de args (`--name`, `--version`).
- **NOVO**: `server/index.ts` — Barrel export do server (Node.js apenas, não importado pela UI).
- **NOVO**: `services/mcpSagbClient.ts` — Adapter client-side (UI-safe) para gerenciamento de estado do servidor.
  - `startClient()`, `stopClient()`, `toggleClient()`, `getClientState()`
  - Eventos DOM: `mcp-sagb:server-started`, `mcp-sagb:server-stopped`, `mcp-sagb:state-changed`
  - Sistema de listeners com unsubscribe pattern
- **NOVO**: `contracts/mcpSagb.contracts.ts` — Contratos de integração para SagB Bridge.
  - `McpServerState`, `McpSagbBridgeContract`, `McpBridgeTool`, `McpBridgeToolResult`
  - `MCP_SAGB_EVENTS` — constantes de eventos
- **NOVO**: `contracts/index.ts` — Barrel export dos contracts.
- **MODIFICADO**: `services/mcpSagbService.ts` — Adicionadas funções: `getServerState()`, `isServerRunning()`, `startMcpServer()`, `stopMcpServer()`, `toggleMcpServer()`, `onServerStateChange()`.
- **MODIFICADO**: `pages/McpSagbPage.tsx` — UI conectada ao estado do servidor:
  - Header: badge dinâmico (Ativo/Parado) + indicador de modo (Mock/Live)
  - Botão "Iniciar Servidor" / "Parar Servidor" com feedback visual
  - Stats card "Servidor MCP" com resources/tools count
  - Log de execução com eventos do servidor
  - Footer dinâmico reflete estado do servidor
- **MODIFICADO**: `index.ts` — Exporta tipos de contracts e server (type-only para server).
- **DECISÃO**: SDK MCP não roda em Vite/React (stdio requer Node.js). Arquitetura: server standalone + client adapter mock na UI.

## 04/05/2026 — Mega Batch 1: MCP SagB operational (v1.0.0)
- **BREAKING**: Status alterado de `inactive` para `active` no manifesto.
- `module-doc.ts` reescrito usando o tipo `ModuleDoc` do core (tipado).
- `README.md` criado com documentação completa do módulo.
- `types/mcpSagb.types.ts` — Tipos canônicos: McpTool, McpResource, McpScript, McpConfig, McpEnvironment.
- `data/mcpSagbCatalog.ts` — Catálogo mock com 8 ferramentas MCP, 4 scripts e 7 configurações.
- `services/mcpSagbService.ts` — Camada de serviço com mock de execução, toggle e persistência em localStorage.
- `pages/McpSagbPage.tsx` — UI completa no padrão canônico:
  - Header com badge "Camada Técnica • Ativo" e dados do owner
  - 4 stats cards (Status, Ferramentas, Scripts, Configurações)
  - 3 abas internas: Ferramentas MCP, Scripts, Configurações
  - Cards de ferramentas com botão Executar (simulação com delay)
  - Log de execução em tempo real
  - Botão "Voltar ao SagB" flutuante (sagb:navigate)
  - Footer canônico
- `pages/index.ts` criado.
- `index.ts` atualizado com exportação de tipos.

## 02/05/2026 - Criação do módulo canônico MCP SagB
- Módulo canônico criado em `src/modules/mcp-sagb/` com estrutura padrão.
- `manifest.ts`, `routes.tsx`, `module-doc.ts`, `index.ts` criados.
- `pages/McpSagbPage.tsx` criada com header canônico e visão geral.
- `plano_modulo.md` com etapas de evolução definidas.
- `changelog.md` e `decisions.md` criados.
- Pasta `agent/` com 4 arquivos canônicos criados.
- Asset legado referenciado: `docs/legacy/MCP SagB`.
- Status inicial: `inactive` (draft — aguardando definição do escopo MCP real).
