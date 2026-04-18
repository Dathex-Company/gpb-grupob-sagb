# 00. Fluxo Geral do Projeto

## Contexto
Este documento define o fluxo oficial de execução do projeto **PROJETO_HUMANG**, seguindo a abordagem multiagentes estabelecida no `PROJECT_BOOTSTRAP.md`. O fluxo organiza a atuação sequencial dos 11 agentes especializados do sistema.

## Fluxo Oficial (ET-01 a ET-08)

### ET-01: Orquestração
**Agente:** Orquestrador  
**Objetivo:** Receber a ideia inicial e organizar o fluxo de execução  
**Entradas:** Ideia inicial do projeto, contexto do produto  
**Saídas:** Este documento (fluxo geral), `.logs/00-orquestracao.md`  
**Checkpoint:** Fluxo definido e aprovado

---

### ET-02: Estratégia de Produto
**Agente:** Product Strategist  
**Objetivo:** Transformar ideia em visão de produto clara  
**Entradas:** Output do Orquestrador, contexto de negócio  
**Saídas:** `.docs/01-visao-produto.md`, `.docs/02-prd-inicial.md`  
**Checkpoint:** Visão de produto e PRD aprovados

---

### ET-03: Arquitetura Técnica
**Agente:** System Architect  
**Objetivo:** Definir arquitetura técnica do sistema  
**Entradas:** Visão de produto, PRD inicial  
**Saídas:** `.docs/03-arquitetura-sistema.md`, `.specs/01-entidades-e-dados.md`, `.specs/02-estrutura-tecnica.md`  
**Checkpoint:** Arquitetura técnica aprovada

---

### ET-04: Experiência do Usuário
**Agente:** UX and Flow Designer  
**Objetivo:** Estruturar jornada do usuário e fluxos principais  
**Entradas:** Arquitetura técnica, visão de produto  
**Saídas:** `.docs/04-fluxos-do-usuario.md`, `.specs/03-mapa-de-telas.md`  
**Checkpoint:** Fluxos de usuário e mapa de telas aprovados

---

### ET-05: Planejamento do Projeto
**Agente:** Project Planner  
**Objetivo:** Quebrar projeto em tarefas executáveis  
**Entradas:** Todos os documentos anteriores (visão, arquitetura, UX)  
**Saídas:** `.plans/01-backlog.md`, `.plans/02-roadmap.md`, `.tasks/01-quebra-de-tarefas.md`  
**Checkpoint:** Backlog e roadmap aprovados

---

### ET-06: Implementação Técnica
**Agentes:** Frontend Engineer, Backend Engineer, Database Engineer, Integrations Engineer  
**Objetivo:** Materializar sistema com base na documentação  
**Entradas:** Todas as especificações e planejamento  
**Saídas:** 
- Código em `src/` (Frontend)
- Arquivos técnicos de backend
- `.specs/04-modelagem-de-dados.md`, `.tasks/02-banco-de-dados.md` (Database)
- `.specs/05-integracoes.md` (Integrations)
- `.logs/frontend-execucao.md`, `.logs/backend-execucao.md`
**Checkpoint:** Implementação técnica concluída

---

### ET-07: Revisão de Qualidade
**Agente:** QA Reviewer  
**Objetivo:** Validar consistência e qualidade do que foi gerado  
**Entradas:** Todos os documentos e código implementado  
**Saídas:** `.docs/05-checklist-qa.md`, `.logs/revisao-qa.md`  
**Checkpoint:** Qualidade aprovada para release

---

### ET-08: Documentação Final
**Agente:** Technical Writer  
**Objetivo:** Organizar documentação final do projeto  
**Entradas:** Todos os documentos gerados  
**Saídas:** `README.md` (melhorado), `.docs/06-guia-de-continuidade.md`  
**Checkpoint:** Projeto documentado para continuidade

---

## Regras de Execução

1. **Sequência Obrigatória:** Seguir ET-01 a ET-08 sem pular etapas
2. **Dependências:** Cada etapa depende das saídas da etapa anterior
3. **Documentação:** Cada agente deve gerar seus arquivos obrigatórios
4. **Validação:** Cada checkpoint deve ser validado antes de seguir
5. **Rastreabilidade:** Todas as decisões devem ser documentadas em `.logs/`

## Próximos Passos Imediatos

1. **ET-01 Completa:** Este documento criado
2. **Iniciar ET-02:** Aguardar ideia do produto para Product Strategist
3. **Manter Log:** Registrar progresso em `.logs/00-orquestracao.md`

## Observações

- Este fluxo é genérico e será adaptado com base na ideia específica do produto
- As etapas ET-06 podem ser executadas em paralelo conforme dependências
- A revisão de qualidade (ET-07) pode incluir múltiplas iterações
- A documentação final (ET-08) consolida todo o conhecimento do projeto

---

*Documento gerado pelo Orquestrador como parte da ET-01 - Orquestração*

**Data:** 16/03/2026  
**Status:** Fluxo geral definido  
**Próxima Ação:** Aguardar ideia do produto para iniciar ET-02