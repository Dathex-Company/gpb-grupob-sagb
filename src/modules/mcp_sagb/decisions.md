# decisions — mcp-sagb

## 07/06/2026 — MEGA-ETAPA 01: LOZE-MCP-OPS V1 — Operações, Ambientes e Segredos

### Decisão: LOZE-MCP-OPS é camada de governança, não novo módulo
- **Contexto:** O MCP SagB já existe como módulo canônico com ferramentas, servidor e UI. Precisávamos de uma camada de segurança operacional para ambientes, deploys e segredos.
- **Opções consideradas:**
  1. **Novo módulo independente** (descartada): Criaria duplicação e complexidade desnecessária.
  2. **Camada de governança dentro do MCP SagB** (escolhida): Aproveita toda a estrutura existente (tipos, serviços, contratos) e adiciona a documentação e regras de operação segura.
- **Decisão:** LOZE-MCP-OPS é um padrão/policy que se sobrepõe ao MCP SagB existente. Os documentos em `docs/` definem as regras; as ferramentas existentes são adaptadas conforme a matriz de permissões.
- **Consequência:** Sem duplicação de módulo. A evolução pode acontecer de forma incremental dentro do mesmo módulo.

### Decisão: Segredo real nunca transita pelo MCP
- **Contexto:** Agentes (IA) precisam consultar status e validar ambientes, mas não devem ter acesso a chaves reais.
- **Opções consideradas:**
  1. **Agente acessa o cofre diretamente** (descartada): Risco de vazamento e exposição.
  2. **MCP como proxy com credencial de curta duração** (escolhida): O MCP executa ações usando `MCP_INTERNAL_OPS_TOKEN` e devolve apenas resultado controlado.
- **Decisão:** O MCP opera com credencial protegida. O agente recebe apenas status, validação, sucesso/erro, evidência controlada e links. **Nunca** o valor do segredo.
- **Consequência:** Segurança por design. Mesmo que um agente seja comprometido, não tem acesso a chaves.

### Decisão: Matriz de permissões como documento vivo
- **Contexto:** A V1 precisa definir claramente o que é permitido, protegido e bloqueado.
- **Decisão:** Criar `docs/matriz-permissoes-mcp.md` como a única fonte de verdade sobre permissões. Qualquer nova ferramenta MCP deve ser classificada antes de ser disponibilizada.
- **Consequência:** Toda ação tem categoria, risco, owner e requisito de autorização documentados.

### Decisão: .env.example com valores falsos por grupo de risco
- **Contexto:** Desenvolvedores precisam saber quais variáveis existem, mas sem expor valores reais.
- **Decisão:** Criar `.env.example` com 3 grupos claros: públicas frontend, build/deploy, backend críticas. Todos os valores são falsos e identificáveis como tal.
- **Consequência:** Facilita onboarding sem risco de vazamento.

### Decisão: Logs obrigatórios com correlation_id para todas as operações
- **Contexto:** Operações MCP precisam ser rastreáveis e auditáveis.
- **Decisão:** Toda operação MCP gera log com `correlation_id` (UUID v4). O log nunca contém valores de segredos. O modelo segue `docs/registro-operacoes-mcp.md`.
- **Consequência:** Rastreabilidade fim a fim sem expor dados sensíveis.

### Decisão: Produção tem trava mais rígida — ações críticas bloqueadas por padrão
- **Contexto:** Produção é o ambiente real de usuários. Erros são custosos.
- **Decisão:** Na V1, 11 ações são bloqueadas por padrão (deploy-producao, alterar-rls, migration, reset-banco, force-push etc). Ações críticas exigem dupla validação.
- **Consequência:** Segurança máxima em produção. Ações só são liberadas com avaliação caso a caso.

### Decisão: Ferramentas MCP existentes são mantidas e complementadas
- **Contexto:** O MCP SagB já tem 8 ferramentas mock (Workspace Scanner, Netlify Deployer, Git Status, etc).
- **Decisão:** As ferramentas existentes continuam. As novas ferramentas OPS (consultar-status-projeto, listar-variaveis-sem-valores etc) são adicionadas como complemento, não substituição.
- **Consequência:** Compatibilidade retroativa. UI e servidor MCP existentes continuam funcionando.

## 04/05/2026 — Mega Batch 2: SDK MCP real + Server Node.js + Bridge Contracts

### Decisão: MCP Server roda como processo Node.js standalone, não no bundle Vite
- **Contexto:** O `@modelcontextprotocol/sdk` usa `StdioServerTransport` que depende de `process.stdin`/`process.stdout` (Node.js streams). O frontend Vite/React executa no navegador, que não tem acesso a esses recursos.
- **Opções consideradas:**
  1. **In-memory MCP server** (descartada): Usar o SDK in-memory ignorando o transporte stdio. Quebraria o protocolo MCP real.
  2. **Web Worker** (descartada): Workers não têm acesso a stdin/stdout.
  3. **Servidor Node.js standalone + client adapter**: O servidor MCP real roda como processo Node.js separado. A UI consome via adapter client-side (mock ou HTTP).
- **Decisão:** Criar `server/mcpServer.ts` como módulo Node.js standalone (nunca importado pela UI), e `services/mcpSagbClient.ts` como adapter seguro para o bundle Vite.
- **Consequência:** A UI funciona em modo mock por padrão. Para modo live, é necessário executar o runner Node.js (`npx tsx src/modules/mcp_sagb/server/runner.ts`) e configurar a comunicação (HTTP/WebSocket futuramente).

### Decisão: Resources e Tools do servidor MCP espelham o catálogo do módulo
- **Contexto:** O servidor MCP precisa expor dados coerentes com o ecossistema SagB.
- **Decisão:** O servidor expõe 3 resources (`sagb://modules`, `sagb://tools`, `sagb://module/{id}`) e 2 tools (`list-modules`, `mcp-status`). Os dados são obtidos de snapshots internos que espelham o `moduleRegistry` e o `mcpSagbCatalog`.
- **Consequência:** Em produção, os snapshots serão substituídos por chamadas reais ao `moduleRegistry` e `mcpSagbCatalog`. O contrato do protocolo permanece o mesmo.

### Decisão: Contratos de integração isolados em `contracts/` para consumo do SagB Bridge
- **Contexto:** O módulo `sagb_bridge` precisa consumir status e ferramentas do MCP SagB sem depender de implementação interna.
- **Decisão:** Criar `contracts/mcpSagb.contracts.ts` com interfaces `McpSagbBridgeContract`, `McpServerState`, `McpBridgeTool` etc. O SagB Bridge deve implementar `McpSagbBridgeContract` para se comunicar com o MCP SagB.
- **Consequência:** Acoplamento frouxo entre módulos. O MCP SagB pode evoluir internamente sem quebrar o Bridge.

### Decisão: Eventos DOM para comunicação cross-module
- **Contexto:** Módulos no SagB são independentes e não compartilham store global.
- **Decisão:** Usar `CustomEvent` no `window` para emitir mudanças de estado do servidor MCP (`mcp-sagb:server-started`, `mcp-sagb:server-stopped`, `mcp-sagb:state-changed`). Qualquer módulo pode escutar.
- **Consequência:** Baixo acoplamento. O SagB Bridge pode escutar eventos MCP sem importar o módulo diretamente.

## 04/05/2026 — Mega Batch 1: Arquitetura do MCP SagB definida

### Decisão: MCP SagB opera em modo mock com camada de serviço abstraída
- **Contexto:** Não há um servidor MCP real rodando. Precisamos de uma UI funcional imediatamente.
- **Decisão:** Criar `services/mcpSagbService.ts` como camada de abstração. Hoje usa dados mock do catálogo local. Amanhã pode trocar a implementação para conectar a um MCP Server SDK (TypeScript ou Python) sem alterar a UI.
- **Consequência:** A UI funciona 100% em modo mock. Trocar o backend é trocar apenas os métodos do service.

### Decisão: module-doc.ts tipado com ModuleDoc do core
- **Contexto:** O module-doc.ts anterior usava formato próprio (não tipado).
- **Decisão:** Reescrever usando o tipo `ModuleDoc` de `src/core/modules/module.types.ts` para garantir consistência com o restante do ecossistema.
- **Consequência:** ModuleDoc agora é verificado em tempo de compilação.

### Decisão: 3 abas internas (Ferramentas, Scripts, Configurações) em vez de sub-rotas
- **Contexto:** O módulo tem 3 escopos distintos de funcionalidade.
- **Decisão:** Usar abas internas (state `activeTab`) em vez de sub-rotas React Router. Simplicidade > complexidade prematura. Sub-rotas podem ser adicionadas depois se o módulo crescer.
- **Consequência:** Navegação mais rápida, sem troca de rota. Perde deep linking para abas específicas.

### Decisão: Owner do módulo é Sávio Codare (agente)
- **Contexto:** O MCP SagB é operacionalizado pelo conhecimento do agente Sávio Codare.
- **Decisão:** Manter `owner.type: 'agent'`, `owner.id: 'savio_codare'` no manifesto.
- **Consequência:** O módulo aparece na sidebar associado ao agente correto.

### Decisão: Assets de tipos, dados e serviços separados em pastas dedicadas
- **Contexto:** O módulo precisa escalar para suportar um MCP server real no futuro.
- **Decisão:** Criar `types/`, `data/`, `services/` como pastas separadas, seguindo o padrão de módulos maduros (agentes_comerciais, gestao_financeira).
- **Consequência:** Separação clara de responsabilidades. Fácil de adicionar testes, hooks e store depois.

## 02/05/2026 - Módulo canônico criado
- Módulo alinhado ao padrão canônico de governança do SagB.
- Status inicial definido como `inactive` pois o módulo é um draft — o legado (persona Sávio Codare) existe mas precisa ser triado e evoluído para um verdadeiro MCP server.
- Owner: Sávio Codare (savio_codare), agente especialista em VS Code.
- Asset legado de 24k+ linhas mantido em `docs/legacy/MCP SagB` — não será movido para manter rastreabilidade.
- MCP SagB é complementar ao SagB Bridge: Bridge é a ponte técnica (VS Code Extension), MCP SagB é o conhecimento/habilidade sobre VS Code.
