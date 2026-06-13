# Protocolo de Handoff entre Agentes — previsto

**Código**: AGT-PRT-001
**Tipo**: 🔵 Protocolo
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pierre + Pietro
**Status**: previsto (unificado)
**Fonte**: AGT-RECLASS-001 (Pierre Zanulli) — item 11.4 + documento-base SagB (3.13)

---

## ⚠️ Nota de unificação

Este documento **unifica** três fontes:

1. Protocolo original do DM-05-AGT (canônico)
2. Seção 3.13 do SagB-Geral
3. Item 11.4 do AGT-RECLASS-001 (Pierre Zanulli)

Versão consolidada abaixo.

---

## Objetivo

Garantir que toda transferência de demanda entre agentes seja completa, rastreável e sem vazamento de contexto.

## Disparo

Quando uma demanda sair de um agente e passar para outro.

## Responsável

Agente originador (quem transfere) + agente receptor (quem recebe).

## Saída esperada

Handoff completo, rastreável e sem vazamento de contexto.

## Protocolo

### Fase 1 — Preparação

1. **Identificar** o motivo do handoff (escopo, competência, capacidade, carga).
2. **Validar** se o agente receptor é adequado para a demanda.
3. **Preparar** resumo de contexto mínimo.
4. **Remover** dados não necessários ou sensíveis.

### Fase 2 — Transferência

5. **Informar** objetivo, restrições e saída esperada.
6. **Transferir** a solicitação de forma estruturada.
7. **Registrar** o handoff (data, origem, destino, motivo).

### Fase 3 — Confirmação

8. **Confirmar** recebimento pelo agente receptor.
9. **Registrar** o resultado do handoff.

## Estrutura de handoff

```
HANDOFF
Motivo: [escopo / competência / capacidade / carga]
De: [agente originador]
Para: [agente receptor]
Contexto: [resumo mínimo]
Objetivo: [o que precisa ser feito]
Restrições: [o que não pode ser feito]
Dados sensíveis: [sim/não — se sim, não transferir sem autorização]
Saída esperada: [o que o receptor deve entregar]
```

## Regras

1. **Contexto mínimo** — não transferir todo o histórico, apenas o relevante.
2. **Dados sensíveis** — não transferir sem autorização de Pedro Gazan.
3. **Registro obrigatório** — todo handoff deve ser rastreável.
4. **Confirmação obrigatória** — handoff não é completo até o receptor confirmar.
5. **Sem ghost handoff** — não transferir sem avisar o receptor.

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| AGT-PRT-011 (Comunicação Agentes) | Pierre | Etapa de comunicação |
| AGT-PRO-001 (Fronteira de Escopo) | Pierre | Identificar necessidade de handoff |
| Pedro Gazan | DM-03 | Dados sensíveis |

---

*Documento previsto (unificado) — aguardando validação de Pierre Zanulli para canonização*
