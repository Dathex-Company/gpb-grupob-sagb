# plano_modulo — api_sagb

## 1. visão do módulo

Estabelecer a API oficial do SagB como camada de consumo para sistemas internos e externos, com segurança, rastreabilidade, versionamento e governança.

## 1.1 status executivo

- fase atual: `03/09 ET | Segurança e identidade`
- responsável atual: `Dande Conec`
- progresso estimado: `33%`
- próximo marco: implementar auditoria e observabilidade (correlation id)
- bloqueio principal: integração com mecanismo de logs distribuídos

## 1.2 changelog curto

### 01/05/2026

- criado módulo `api_sagb` no runtime
- integrado ao registry de módulos
- definido guardião e base documental
- criado `plano_modulo.md` para governança operacional
- **etapa 2 concluída**: criados `openapi_v1.yaml` e `conventions.md` com padrões de erro, paginação e idempotência
- **etapa 3 concluída**: criados `auth.types.ts` e `authMiddleware.ts` definindo estrutura de clientes, chaves, validação e autorização por escopos

## 2. precedência canônica obrigatória

Este planejamento segue a norma canônica:

- `docs/governanca_sagb/padrao_unificado_governanca.md`

Em caso de conflito, a norma canônica prevalece.

## 3. decisões oficiais

1. API SagB será a camada oficial para sistemas.
2. MCP SagB permanecerá voltado a agentes.
3. Hub de Integração permanecerá como camada de conectores e credenciais.
4. Acesso direto ao banco não será contrato oficial para consumidores externos.

## 4. estado atual

- módulo `api_sagb` criado e plugado em `src/core/modules/moduleRegistry.ts`
- rota base ativa em `src/modules/api_sagb/routes.tsx`
- documentação base criada (`module-doc`, `decisions`, `changelog`)
- agente do módulo criado em `src/modules/api_sagb/agent`

## 5. estado alvo

API oficial versionada (`/v1`) com autenticação, autorização por escopo, auditoria por request e contratos estáveis para consumo multi-produto.

## 6. trilha oficial em 9 etapas

### etapa 1 — definição de fronteiras

**objetivo**
Formalizar fronteiras entre API, MCP, Hub e dados.

**critérios de aceitação**
- matriz de responsabilidades aprovada
- fluxos proibidos/permitidos documentados

### etapa 2 — contrato inicial `/v1`

**objetivo**
Definir recursos e padrões de resposta/erro.

**critérios de aceitação**
- contrato OpenAPI inicial
- convenções de paginação, erros e idempotência

### etapa 3 — segurança e identidade

**objetivo**
Implementar authn/authz por escopo.

**critérios de aceitação**
- chaves/tokens por cliente
- escopos por produto e por operação

### etapa 4 — auditoria e observabilidade

**objetivo**
Rastrear chamadas ponta a ponta.

**critérios de aceitação**
- correlation id por request
- trilha de ator, origem, escopo e resultado

### etapa 5 — camada de integração interna

**objetivo**
Conectar API ao Hub sem acoplamento de borda.

**critérios de aceitação**
- adapters internos definidos
- políticas de timeout/retry por conector

### etapa 6 — endpoints prioritários

**objetivo**
Subir primeiros endpoints para consumidores críticos.

**critérios de aceitação**
- TaskZei, CRM, Studio e Vox com casos cobertos

### etapa 7 — governança de versão

**objetivo**
Controlar evolução sem quebra.

**critérios de aceitação**
- política de depreciação
- changelog de API por versão

### etapa 8 — hardening e testes

**objetivo**
Elevar confiabilidade operacional.

**critérios de aceitação**
- testes de contrato e segurança
- cenários de carga e falha

### etapa 9 — rollout controlado

**objetivo**
Migrar consumidores com risco mínimo.

**critérios de aceitação**
- plano por ondas
- rollback validado

## 7. riscos arquiteturais

- confusão de fronteiras API x MCP x Hub
- acoplamento indevido ao banco como contrato externo
- falta de escopos finos de autorização
- ausência de trilha de auditoria por chamada

## 8. dependências futuras

- política de identidade e acesso unificada
- observabilidade centralizada
- catálogo oficial de consumidores da API

## 9. próxima etapa recomendada

`04/09 ET | Auditoria e observabilidade`

## 10. versionamento

### v0.1.0 - 01/05/2026

- criação do `plano_modulo.md`
- definição da trilha de implantação completa da API SagB
