# SagB | Missões | Estratégia de Evolução: Motor de Times Autônomos

Este documento detalha o diagnóstico técnico e a proposta arquitetural para transformar o módulo de Missões no motor oficial de orquestração de times autônomos do SagB.

---

## 1. Diagnóstico do Módulo Atual (Fase 1: Auditoria)

### 1.1 O que já existe e está sólido (Aproveitamento Total)
- **Tabelas Relacionais**: `agent_missions`, `agent_mission_steps`, `agent_artifacts` e `agent_handoffs` formam uma base robusta para persistência.
- **Protocolo de Handoff**: A lógica de passar o contexto (artefato anterior + input inicial) já funciona via `contextAssembler.ts`.
- **Rastreabilidade**: Integração nativa com `intelligence_flows` permite auditar cada pensamento dos agentes.
- **Mecanismo de Retry e Reprocessamento**: Já existe suporte para falhas e retomada de fluxos.

### 1.2 O que está rígido ou linear demais (Necessita Evolução)
- **Blueprints Hardcoded**: Atualmente, as etapas da missão ("Descoberta", "Produto", "Arquitetura") estão chumbadas no código (`POC_MISSION_STAGE_BLUEPRINTS`).
- **Resolução de Agentes**: O sistema usa regex ou templates fixos para achar agentes. Precisa suportar seleção dinâmica por "Papéis" (Roles) definidos no Blueprint.
- **Orquestração Determinística Linear**: O runner atual (`orchestrationRunner.ts`) executa apenas uma sequência `1 -> 2 -> 3`. Não suporta paralelismo, loops de revisão ou checkpoints humanos nativos.
- **Ausência de Eventos Granulares**: Atualmente, a timeline é montada inferindo o estado das etapas e artefatos. Não há um "Log de Eventos" da Missão (ex: comentários, objeções, aprovações).

---

## 2. Proposta de Evolução Arquitetural (Fase 2)

A evolução proposta visa desacoplar a **lógica de execução** da **definição do time**.

### 2.1 Visão de Produto
- **Chat**: Camada de supervisão, intervenção e comando humano.
- **Missões**: Camada de execução autônoma, coordenação técnica e geração de entregáveis.

### 2.2 Mudanças Chave
1. **Missões Orientadas a Blueprints**: Toda missão nasce vinculada a um `agent_mission_blueprints`.
2. **Introdução de Papéis (Roles)**: O Blueprint define papéis (ex: "UX Research", "Dev Ops") e a missão os preenche com agentes específicos ou templates.
3. **Motor de Eventos de Missão**: Tudo o que ocorre na missão gera um registro em `agent_mission_events`. Isso permite que o chat e a UI de missões conversem de forma fluida.

---

## 3. Novas Estruturas Propostas (Fase 3)

### 3.1 Tabelas de Definição (Blueprints)
- `public.agent_mission_blueprints`: id, workspace_id, title, description, category (marketing, produto, dev, etc), flow_config (jsonb).
- `public.agent_mission_blueprint_roles`: id, blueprint_id, role_key, role_name, suggested_agent_id, metadata (jsonb).

### 3.2 Tabelas de Execução (Dinâmicas)
- `public.agent_mission_events`: id, mission_id, event_type, actor_id, actor_name, actor_type (agent/human), content, payload (jsonb).
- `public.agent_mission_checkpoints`: id, mission_id, step_id, status (pending, approved, rejected), reviewer_id, note.

### 3.3 Event Types Prioritários
- `step_started`, `step_completed`, `step_failed`
- `internal_comment` (agente falando com o time)
- `objection` (agente levantando risco)
- `artifact_created`
- `waiting_human_approval`
- `handoff_accepted`

---

## 4. Plano de Implementação (Fase 4)

### Fase 1 (Imediata): Engine de Blueprints e Eventos
1. **DB**: Criação das tabelas de Blueprints, Roles e Events.
2. **Service**: Refatoração do `missionService.ts` para carregar blueprints do banco.
3. **Runner**: Atualização do `orchestrationRunner.ts` para disparar eventos durante a execução.
4. **UI**: Evolução do `AgentMissionsView.tsx` para listar eventos na timeline oficial.

### Fase 2 (Curto Prazo): Checkpoints e Intervenção
1. Implementação do status `waiting_approval` nas etapas.
2. Integração com o chat para solicitar aprovação humana.

### Fase 3 (Médio Prazo): Paralelismo e Memória
1. Suporte a dependências de etapas (grafo de execução).
2. Tabela de `agent_mission_memory` para contexto compartilhado do time.

---

## 5. Riscos e Validação

### Riscos
- **Compatibilidade**: Quebrar a POC atual de 3 agentes. (Mitigação: Manter a estrutura atual via fallback).
- **Complexidade**: A orquestração deixar de ser simples e gerar deadlocks. (Mitigação: Manter o runner centralizado e síncrono por enquanto).

### Como Validar
1. Criar um blueprint de "Time de Produto" via banco.
2. Disparar uma missão baseada nele.
3. Verificar se os eventos aparecem no log.
4. Confirmar se a missão completa todas as etapas com sucesso.
