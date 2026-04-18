# AGENTS.md - Sistema Multiagentes do Projeto

## Visão Geral
Este documento consolida os agentes oficiais do sistema, suas missões, ordem de atuação e entregáveis por etapa. O projeto segue uma abordagem multiagentes profissional com divisão clara de funções e rastreabilidade completa.

---

## Lista de Agentes

### 01. Orquestrador
**Missão:** Receber a ideia, organizar o fluxo, decidir a ordem das etapas, garantir que cada agente produza sua saída e manter coerência entre tudo.

**Ordem de Atuação:** ET-01  
**Entregáveis:**
- `.plans/00-fluxo-geral.md`
- `.logs/00-orquestracao.md`

---

### 02. Product Strategist
**Missão:** Transformar a ideia inicial em visão de produto clara, útil e bem posicionada.

**Ordem de Atuação:** ET-02  
**Entregáveis:**
- `.docs/01-visao-produto.md`
- `.docs/02-prd-inicial.md`

---

### 03. System Architect
**Missão:** Definir a arquitetura técnica do sistema.

**Ordem de Atuação:** ET-03  
**Entregáveis:**
- `.docs/03-arquitetura-sistema.md`
- `.specs/01-entidades-e-dados.md`
- `.specs/02-estrutura-tecnica.md`

---

### 04. UX and Flow Designer
**Missão:** Estruturar a jornada do usuário e os fluxos principais do sistema.

**Ordem de Atuação:** ET-04  
**Entregáveis:**
- `.docs/04-fluxos-do-usuario.md`
- `.specs/03-mapa-de-telas.md`

---

### 05. Project Planner
**Missão:** Quebrar o projeto em etapas e tarefas executáveis.

**Ordem de Atuação:** ET-05  
**Entregáveis:**
- `.plans/01-backlog.md`
- `.plans/02-roadmap.md`
- `.tasks/01-quebra-de-tarefas.md`

---

### 06. Frontend Engineer
**Missão:** Materializar a camada de interface do sistema.

**Ordem de Atuação:** ET-06  
**Entregáveis:**
- Código em `src/`
- `.logs/frontend-execucao.md`

---

### 07. Backend Engineer
**Missão:** Materializar a lógica de backend e regras de negócio.

**Ordem de Atuação:** ET-06  
**Entregáveis:**
- Arquivos técnicos no projeto
- `.logs/backend-execucao.md`

---

### 08. Database Engineer
**Missão:** Modelar e estruturar dados do projeto.

**Ordem de Atuação:** ET-06  
**Entregáveis:**
- `.specs/04-modelagem-de-dados.md`
- `.tasks/02-banco-de-dados.md`

---

### 09. Integrations Engineer
**Missão:** Mapear e preparar integrações externas e internas.

**Ordem de Atuação:** ET-06  
**Entregáveis:**
- `.specs/05-integracoes.md`

---

### 10. QA Reviewer
**Missão:** Validar consistência, funcionamento e clareza do que foi gerado.

**Ordem de Atuação:** ET-07  
**Entregáveis:**
- `.docs/05-checklist-qa.md`
- `.logs/revisao-qa.md`

---

### 11. Technical Writer
**Missão:** Organizar a documentação final do projeto.

**Ordem de Atuação:** ET-08  
**Entregáveis:**
- `README.md` (melhorado)
- `.docs/06-guia-de-continuidade.md`

---

## Ordem de Atuação (Fluxo Oficial)

### ET-01: Orquestração
Orquestrador recebe a ideia e organiza o fluxo inicial.

### ET-02: Estratégia de Produto
Product Strategist transforma a ideia em visão de produto e PRD inicial.

### ET-03: Arquitetura Técnica
System Architect transforma a visão em arquitetura técnica.

### ET-04: Experiência do Usuário
UX and Flow Designer organiza fluxo do usuário e mapa de telas.

### ET-05: Planejamento do Projeto
Project Planner quebra tudo em backlog, roadmap e tarefas.

### ET-06: Implementação Técnica
Frontend, Backend, Database e Integrations trabalham com base na documentação.

### ET-07: Revisão de Qualidade
QA Reviewer revisa estrutura, lógica e consistência.

### ET-08: Documentação Final
Technical Writer organiza a base final do projeto.

---

## Regras de Execução

1. **Dependências:** Cada etapa depende das saídas da etapa anterior
2. **Rastreabilidade:** Todas as decisões e entregáveis devem ser documentados
3. **Organização:** Seguir estrutura de pastas definida no projeto
4. **Clareza:** Documentação deve ser legível por outros agentes
5. **Profissionalismo:** Manter padrões de qualidade em todas as entregas

---

## Arquivos de Controle

- `.agents/`: Arquivos detalhados de cada agente
- `.logs/`: Registros de execução e checkpoints
- `.plans/`: Planejamento e fluxo geral
- `.docs/`: Documentação de produto e arquitetura
- `.specs/`: Especificações técnicas
- `.tasks/`: Quebra operacional de tarefas

---

## Próximos Passos

1. Executar Orquestrador para definir fluxo detalhado
2. Seguir sequência ET-01 a ET-08
3. Validar cada etapa com QA Reviewer
4. Consolidar com Technical Writer

---

*Última atualização: Inicialização do projeto conforme PROJECT_BOOTSTRAP.md*