# Plano do Módulo — MCP SagB

## Objetivo
Estabelecer o Model Context Protocol do SagB — uma camada de conhecimento, automação
e **operação segura** focada em VS Code, produtividade de desenvolvimento, configuração
de ambiente local e **governança de ambientes, deploys e segredos**,
operacionalizada pelo agente Sávio Codare.

## Etapas de Evolução

### MEGA-ETAPA 01 ✅ Concluída — LOZE-MCP-OPS V1
- **Padrão**: LOZE-MCP-OPS | Operações, Ambientes e Segredos
- **Status**: 🟢 Documental + estrutural concluído
- **Detalhes**: [`plans/loze-mcp-ops-v1-evolucao.md`](plans/loze-mcp-ops-v1-evolucao.md)

### ET-01 🔄 Pendente — Triar legado (docs/legacy/MCP SagB — 24k+ linhas)
- Extrair conhecimento útil (atalhos, configurações, fluxos)
- Descartar duplicatas e conteúdo obsoleto
- Organizar em documentação modular

### MEGA-ETAPA 02 ⏳ Pendente — Implementação das Ferramentas OPS
- Criar tipos OPS, adicionar ferramentas ao catálogo, implementar services
- Implementar layer de autorização e log obrigatório
- Detalhes: [`plans/loze-mcp-ops-v1-evolucao.md`](plans/loze-mcp-ops-v1-evolucao.md)

### MEGA-ETAPA 03 ⏳ Pendente — Auditoria e Segurança
- Revisar ferramentas existentes contra matriz de permissões
- Garantir que nenhuma ferramenta expõe segredos

### MEGA-ETAPA 04 ⏳ Pendente — Integração com Serviços Reais
- Conectar ferramentas OPS com APIs públicas (GitHub, Netlify, Supabase)
- Implementar MCP_INTERNAL_OPS_TOKEN

### MEGA-ETAPA 05 ⏳ Pendente — Evolução e Melhorias Contínuas
- Dashboard de auditoria, notificações, integração com cofre

### ET-02 ⏳ Pendente — Definir escopo do MCP (VS Code)
- Decidir se MCP SagB será um MCP server real (com ferramentas e recursos)
- Ou se permanece como agente de conhecimento (persona + documentação)
- Alinhar com SagB Bridge para evitar sobreposição

### ET-03 ⏳ Pendente — Implementar integração com SagB Bridge
- MCP SagB fornece o conhecimento sobre VS Code
- SagB Bridge fornece a conexão técnica (extensão + API)
- Criar interface entre os dois módulos

## Asset Legado
| Asset | Tipo | Localização |
|-------|------|-------------|
| Persona Sávio Codare | arquivo texto (24k+ linhas) | `docs/legacy/MCP SagB` |
| LOZE-MCP-OPS V1 | 6 documentos + .env.example | `docs/` e `.env.example` |

## Relação com Outros Módulos
- **SagB Bridge**: Complementar — Bridge é a ponte técnica, MCP SagB é o conhecimento
- **Hub de Integração**: Indireta — ambas são camadas técnicas
- **API SagB**: MCP pode consumir API para estender capacidades
- **LOZE-MCP-OPS**: Camada de governança dentro do MCP SagB (padrão interno)
