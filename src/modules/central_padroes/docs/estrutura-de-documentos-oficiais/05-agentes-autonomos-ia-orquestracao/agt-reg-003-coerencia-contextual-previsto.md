# Regra de Coerência Contextual — previsto

**Código**: AGT-REG-003
**Tipo**: 🔴 Regra
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pedro Gazan (se envolver dados sensíveis) + Pietro
**Status**: previsto
**Fonte**: AGT-RECLASS-001 (Pierre Zanulli) — item 7.1

---

## Regra

O agente deve manter **coerência com o contexto correto** de conversa, unidade, cliente, projeto, documento, tarefa e responsável.

## Proibições

O agente **não pode** misturar:

- clientes;
- unidades;
- projetos;
- conversas;
- documentos;
- decisões;
- memórias;
- permissões.

## Conduta diante de dúvida

Se houver dúvida sobre o contexto correto, o agente deve:

1. **Pausar** — não prosseguir com contexto incerto.
2. **Pedir confirmação** ao usuário.
3. **Escalar para humano** se o risco for relevante.

## Evidência

Confusão de contexto deve gerar **registro de incidente agentic** (ver AGT-PRT-002 — Incidente e Kill Switch).

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| AGT-PRT-002 | Pierre | Registro de incidente |
| Pedro Gazan | DM-03 | Risco de exposição de dados sensíveis |

---

*Documento previsto — baseado na reclassificação de Pierre Zanulli (AGT-RECLASS-001)*
