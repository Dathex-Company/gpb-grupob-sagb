# MCP SagB

**Model Context Protocol do SagB** — Camada de conhecimento e automação focada em
VS Code, produtividade de desenvolvimento, organização de workspace e configuração
de ambiente local.

| Atributo | Valor |
|----------|-------|
| **Status** | 🟢 Ativo (v1.0.0) |
| **Responsável** | Sávio Codare (savio_codare) |
| **Tipo** | Módulo Oficial — Camada Técnica |
| **Rota base** | `/mcp_sagb` |
| **Ícone** | `TerminalIcon` |
| **Registro** | `src/core/modules/moduleRegistry.ts` |

---

## Propósito

O MCP SagB operacionaliza o conhecimento sobre ambiente de desenvolvimento como
ferramentas MCP (Model Context Protocol) acessíveis via interface web. Ele não cria
regras de negócio — apenas disponibiliza o conhecimento técnico do ecossistema SagB
de forma interativa.

## Relação com Outros Módulos

| Módulo | Relação |
|--------|---------|
| [SagB Bridge](../sagb_bridge/README.md) | **Complementar** — Bridge é a ponte técnica (VS Code Extension), MCP SagB é o conhecimento VS Code |
| [Hub de Integração](../hub-integracao/README.md) | **Indireta** — ambas são camadas técnicas |
| [API SagB](../api_sagb/README.md) | **Consumidor** — MCP pode consumir API para estender capacidades |

---

## Estrutura do Módulo

```
src/modules/mcp_sagb/
├── README.md                   # Documentação do módulo
├── changelog.md                # Histórico de versões
├── decisions.md                # Decisões arquiteturais
├── index.ts                    # Barreira de exportação
├── manifest.ts                 # Manifesto do módulo (ModuleManifest)
├── module-doc.ts               # Documentação tipada (ModuleDoc)
├── plano_modulo.md             # Plano de evolução
├── routes.tsx                  # Rotas do módulo
├── agent/                      # Pasta canônica do agente
│   ├── falas_user.md
│   ├── persona.md
│   ├── prompt_ativacao_cline.md
│   └── session_log.md
├── data/
│   └── mcpSagbCatalog.ts       # Catálogo de ferramentas, scripts e configs
├── pages/
│   ├── index.ts
│   └── McpSagbPage.tsx         # Página principal
├── services/
│   └── mcpSagbService.ts       # Camada de serviço (mock → futuramente MCP SDK)
└── types/
    └── mcpSagb.types.ts        # Tipos do módulo
```

---

## Funcionalidades

### 🔧 Ferramentas MCP (Mock)
O módulo expõe ferramentas MCP simuladas que demonstram as capacidades do protocolo:

| Ferramenta | Categoria | Descrição |
|------------|-----------|-----------|
| Workspace Scanner | workspace | Escaneia estrutura do projeto |
| Terminal Executor | terminal | Executa comandos simulados |
| Extension Lister | extension | Lista extensões VS Code |
| Netlify Deployer | deploy | Valida pré-requisitos de deploy |
| Module Scaffolder | scaffold | Gera estrutura de novos módulos |
| Git Status | git | Status do repositório |
| DB Migration Runner | database | Executa migrações Supabase |
| System Monitor | monitoring | Monitora recursos do sistema |

### 📜 Scripts de Automação
Scripts reais documentados para setup, deploy e manutenção do ambiente.

### ⚙️ Configurações
Painel de configurações do ambiente de desenvolvimento com persistência em
localStorage.

---

## Como Usar

1. Acesse `/mcp_sagb` na barra lateral ou navegação
2. Na aba **Ferramentas MCP**, clique em "Executar" em qualquer ferramenta
3. Na aba **Scripts**, visualize os scripts de automação disponíveis
4. Na aba **Configurações**, ajuste preferências do ambiente

---

## Plano de Evolução

| Etapa | Status | Descrição |
|-------|--------|-----------|
| ET-01 | Pendente | Triar legado de 24k+ linhas (`docs/legacy/MCP SagB`) |
| ET-02 | Pendente | Decidir se MCP SagB será um MCP server real (SDK TypeScript) |
| ET-03 | Pendente | Implementar integração com SagB Bridge |
| **Atual** | **Concluído** | Módulo canônico com UI, tipos, serviços e dados mock |

---

## Asset Legado

| Asset | Linhas | Localização |
|-------|--------|-------------|
| Persona Sávio Codare | ~24.357 | `docs/legacy/MCP SagB` |

---

## Licença

Este módulo faz parte do ecossistema **SagB** e segue as diretrizes de governança
do **GrupoB**.
