# Padrão de Registro Estruturado de Decisão — previsto

**Código**: PROC-PAD-002
**Tipo**: 🟠 Padrão / 📝 Registro
**Domínio**: Processos, Execução e Registros Operacionais (DM-02)
**Responsável**: Yuri Sague
**Validação necessária**: Yuri + Pietro
**Status**: previsto
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — item 3.20

---

## Objetivo

Definir o template obrigatório para registro de decisões no ecossistema GrupoB, garantindo rastreabilidade e contexto.

## Template obrigatório

Toda decisão registrada deve conter:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `decision_id` | Sim | Identificador único da decisão |
| `contexto` | Sim | Situação que gerou a decisão |
| `opções_consideradas` | Sim | Quais alternativas foram avaliadas |
| `justificativa` | Sim | Por que a opção escolhida foi a melhor |
| `responsável` | Sim | Quem tomou a decisão |
| `prazo` | Não | Se aplicável, prazo para execução |
| `impacto_esperado` | Sim | O que se espera que aconteça |
| `critérios_de_sucesso` | Sim | Como saber se a decisão foi correta |
| `data_de_revisão` | Não | Quando reavaliar a decisão |
| `anexos` | Não | Documentos de suporte |

## Regras

1. Toda decisão que afete mais de uma área **deve** ter `decision_id` registrado.
2. Decisões sem `justificativa` não são consideradas registradas.
3. Decisões do Chairman (Rodrigues) ou CEO (Nassar) têm prioridade máxima de registro.
4. O registro deve ser armazenado no ClickUp ou sistema equivalente.

## Relação com Fonte da Verdade

A matriz `GOV-MTZ-001` (Fonte da Verdade) classifica "Decisão Registrada" como **prioridade 2** (perde apenas para Contrato Assinado).

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-00-GOV | Pietro | Fonte da Verdade |
| DM-05-AGT | Pierre | Agentes consumirem registros |

---

*Documento previsto — aguardando validação de Yuri Sague para canonização*
