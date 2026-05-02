# Plano do Módulo — MCP SagB

## Objetivo
Estabelecer o Model Context Protocol do SagB — uma camada de conhecimento e automação
focada em VS Code, produtividade de desenvolvimento e configuração de ambiente local,
operacionalizada pelo agente Sávio Codare.

## Etapas de Evolução

### ET-01 🔄 Pendente — Triar legado (docs/legacy/MCP SagB — 24k+ linhas)
- Extrair conhecimento útil (atalhos, configurações, fluxos)
- Descartar duplicatas e conteúdo obsoleto
- Organizar em documentação modular

### ET-02 ⏳ Pendente — Definir escopo do MCP
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

## Relação com Outros Módulos
- **SagB Bridge**: Complementar — Bridge é a ponte técnica, MCP SagB é o conhecimento
- **Hub de Integração**: Indireta — ambas são camadas técnicas
- **API SagB**: MCP pode consumir API para estender capacidades
