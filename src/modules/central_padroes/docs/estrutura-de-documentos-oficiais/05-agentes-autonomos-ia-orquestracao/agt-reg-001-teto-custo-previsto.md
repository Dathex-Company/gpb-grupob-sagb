# Registro de Teto de Custo (Orçamento de Agente) — previsto

**Código**: AGT-REG-001
**Tipo**: 📝 Registro / 🔴 Regra
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pierre + César Tulli (se envolver custo) + Pietro
**Status**: previsto
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — item 3.17

---

## Regra

Cada agente tem limite de tokens por tarefa e/ou por período. Estouro pausa a tarefa e notifica o dono.

## O que deve ser registrado

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| agent_id | Sim | Identificador do agente |
| limite_por_tarefa | Sim | Máximo de tokens por execução |
| limite_por_período | Sim | Máximo de tokens por dia/semana/mês |
| período | Sim | Diário / Semanal / Mensal |
| dono | Sim | Responsável pelo agente |
| notificar_em | Sim | Percentual do limite que dispara alerta (ex: 80%) |
| ação_ao_estourar | Sim | Pausar / Reduzir qualidade / Notificar apenas |

## Registro de estouro

Quando o limite é atingido:

1. Agente é pausado automaticamente.
2. Dono é notificado com: agente, tarefa atual, consumo atual, limite.
3. Dono decide: aumentar limite, ajustar tarefa ou manter pausa.
4. Decisão é registrada.

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-11-NEG | César Tulli | Custo operacional |
| DM-01-TEC | Sávio Codare | Implementação técnica do limite |

---

*Documento previsto — aguardando validação de Pierre Zanulli para canonização*
