# falas_user — mcp-sagb

## 04/05/2026 — Mega Batch 2

```
Sávio, excelente entrega do Mega Batch! A fundação do módulo está perfeita.

Agora vamos para o Mega Batch 2. As instruções são:

ET-01 / ET-02 — FUNDAÇÃO TÉCNICA (Triagem do legado + Setup do MCP SDK real):
- Documente a decisão de que o MCP SagB vai evoluir para um servidor MCP SDK real, arquivei o contrário.
- A triagem do legacy file (24k+ linhas) indica que a SagB precisa de um Core MCP.
- Crie um sub-diretório server dentro de src/modules/mcp_sagb/.
- Inicie a implementação de um servidor básico com transporte via stdio que exponha ao menos 2 resources falsos e 1 tool real de sistema (ex: listagem de módulos instalados via moduleRegistry).
- Esta implementação deve usar a SDK @modelcontextprotocol/sdk que instalamos.

ET-03 — SAGB BRIDGE (Contratos de Integração):
- Crie um arquivo mcpSagb.contracts.ts dentro de uma pasta contracts/.
- Defina interfaces externas que o módulo sagb_bridge vai consumir para saber o status do MCP server.
- Exporte do index.ts os tipos de contrato.

ET-04 — SETUP DO SDK DO MCP:
- Instale a dependência @modelcontextprotocol/sdk com npm.
- Se o ambiente não suportar o server-side SDK diretamente no frontend (Vite/React), planeje e crie os arquivos Node/Express apropriados (talvez em netlify/functions ou diretório root de serviços) e explique como deve ser inicializado, construindo os mocks da UI que chamam essa API.
- O botão "Ativar/Desativar" na UI deve estar conectado ao estado do servidor (mock por enquanto).

Importante: Mantenha o padrão canônico (--sagb-*, font-inter, header com badge, etc). Atualize changelog.md, decisions.md, session_log.md e falas_user.md ao final.

Pode começar quando estiver pronto. Confio na sua execução autônoma.
```

## 04/05/2026 — Mega Batch 1

```
Sávio, assuma imediatamente o controle integral do módulo mcp_sagb.

Eu autorizo a Execução em Lote (Mega Batch) de todas as pendências, desde o setup inicial até o que já tivermos documentado no plano.

O MCP não é um módulo comum; é o padrão estrutural oficial do ecossistema SagB. Nós já debatemos profundamente a teoria na Central de Padrões. Agora, a missão é materializar essa arquitetura em código real.

Sua Diretriz de Execução:

1. Contexto Base: Revise rapidamente o que já foi decidido sobre MCP em docs/legacy/Central de Padroes GrupoB e em docs/governanca_sagb/padrao_agentes_responsaveis.md para se situar no que o MCP é (camada de contrato) e no que ele não é (não cria regras de negócio, apenas as operacionaliza).

2. Estratégia Mega Batch (Lote Único):
   - Não me pergunte passo a passo. Faça um plano mental/interno para executar todas as etapas necessárias de uma vez só.
   - Seu objetivo é criar a estrutura física (src/modules/mcp_sagb), o manifesto (onde você é o owner), as rotas, o module-doc.ts (tipado), o README.md, e implementar a UI/lógica inicial.
   - Padrão canônico rigoroso: cores via tokens --sagb-*, tipografia font-inter, header canônico com badge e botão "Voltar ao SagB" (via sagb:navigate), e sidebar próprio se necessário (adicionando 'mcp_sagb' no hideSidebar global).

3. Autonomia Total na Codificação:
   - Codifique as fases de forma sequencial.
   - Crie mocks e placeholders internos para integrações pesadas (como o SDK do servidor MCP real em TypeScript/Python) de forma que a UI possa funcionar no modo mock/desenvolvimento.
   - Se encontrar erros (Lint, TSC), resolva-os imediatamente sem interromper a execução do Mega Batch.

4. Entrega e Governança:
   - Só pare quando o módulo estiver funcional, 100% no padrão canônico, e visualizável no sistema.
   - Finalize registrando um grande bloco no changelog.md com todas as fases executadas.
   - Documente as escolhas arquiteturais principais no decisions.md.
   - Registre a operação no seu agent/session_log.md e esta autorização no agent/falas_user.md.

Inicie sua análise agora, monte o seu plano de ataque interno e comece a codificar imediatamente. Confio no seu julgamento técnico para a arquitetura do código. Entregue o módulo rodando no final do processo.
```

## 02/05/2026 — Criação do módulo
```
Precisamos criar o módulo canônico MCP SagB...
```
