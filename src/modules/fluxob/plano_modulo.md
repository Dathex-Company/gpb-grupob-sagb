# Plano do Módulo — FluxoB

## Objetivo
FluxoB é o motor de orquestração de fluxos de trabalho (workflows) do ecossistema GrupoB.
Ele permitirá definir, executar e monitorar processos de negócio que envolvem múltiplos agentes,
sistemas e etapas manuais — tudo em fluxos visuais e rastreáveis.

## Problema que resolve
Hoje o SagB possui agentes, módulos e integrações, mas não existe uma camada central
que orquestre **sequências de ações** entre eles. Cada módulo age de forma independente.
FluxoB será o "maestro" que coordena workflows de ponta a ponta.

## Conceitos Principais

| Conceito | Descrição |
|----------|-----------|
| **Workflow** | Sequência de etapas que executam uma tarefa de negócio |
| **Step** | Unidade atômica do workflow (ação de agente, API, notificação, decisão) |
| **Trigger** | Evento que inicia um workflow (agendado, webhook, manual, condicional) |
| **Contexto** | Dados compartilhados entre steps do mesmo workflow |
| **Rastro** | Log completo de execução com status, duração e resultado de cada step |

## Etapas de Evolução

### ET-01 🔄 Pendente — Definir domínio e alinhar expectativas
- Validar conceitos e terminologia com stakeholders
- Definir casos de uso reais (ex: "ao criar task, disparar workflow de revisão")
- Documentar decisões de escopo (o que NÃO entra na V1)

### ET-02 ⏳ Pendente — Modelar dados e contratos
- Schema de workflow, step, trigger, contexto, rastro
- Tipos TypeScript para o core do FluxoB
- Contratos de API para CRUD + execução

### ET-03 ⏳ Pendente — Implementar executor de workflows
- Engine sequencial (step a step com controle de fluxo)
- Suporte a steps: agente, API, notificação, condicional (if/else), paralelo
- Persistência de contexto e rastro

### ET-04 ⏳ Pendente — Interface visual
- Editor de workflows (arrastar e soltar?)
- Visualizador de execução em tempo real
- Histórico e replay de workflows

### ET-05 ⏳ Pendente — Integrações com ecossistema
- Hub de Integração → consumir conectores
- API SagB → triggers via endpoint
- SagB Bridge → eventos do VS Code disparam workflows
- MCP SagB → steps de configuração de ambiente

## Relação com Outros Módulos
- **Hub de Integração**: FluxoB consumirá conectores e credenciais do Hub
- **API SagB**: FluxoB exporá endpoints para trigger e consulta
- **SagB Bridge**: Workflows podem ser disparados por eventos do VS Code
- **MCP SagB**: Steps de configuração de ambiente para desenvolvimento
- **Central de Padrões**: Fluxos devem seguir as convenções documentadas

## Status Atual
**Pré-alpha** — Nenhum asset de código existe ainda.
Este documento serve como definição inicial do domínio.
