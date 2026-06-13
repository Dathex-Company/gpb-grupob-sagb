# Padrão de Idempotência em Tool Calls — previsto

**Código**: TEC-PAD-002
**Tipo**: 🟠 Padrão Técnico
**Domínio**: Padrões Técnicos Loze (DM-01)
**Responsável**: Sávio Codare
**Validação necessária**: Sávio + Pierre + Pietro
**Status**: previsto
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — item 3.11

---

## Objetivo

Garantir que tool calls de criação, alteração ou ajuste não sejam executadas mais de uma vez, mesmo se chamadas repetidamente com a mesma intenção.

## Regra

Tool calls de criação/ajuste devem incluir `idempotency_key` vinculada à mensagem de origem.

## Estrutura esperada

```json
{
  "tool": "nome_da_tool",
  "parameters": { ... },
  "idempotency_key": "msg_<id_da_mensagem>_<hash_dos_parametros>"
}
```

## Comportamento esperado

1. Se uma tool call com `idempotency_key` já foi executada, o sistema **retorna o resultado anterior** sem reexecutar.
2. Se a `idempotency_key` é nova, a tool é executada normalmente.
3. A `idempotency_key` deve ser derivada do conteúdo da mensagem + parâmetros para garantir unicidade.
4. O sistema deve manter um log de `idempotency_keys` por período configurável.

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-05-AGT | Pierre | Agentes chamam as tools |
| AGT-POL-003 | Pierre | Tool Use Seguro |

---

*Documento previsto — aguardando validação de Sávio Codare para canonização*
