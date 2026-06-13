# Política de Tool Use Seguro — previsto

**Código**: AGT-POL-003
**Tipo**: 🟠 Política
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05) / Padrões Técnicos Loze (DM-01)
**Responsável**: Pierre Zanulli / Sávio Codare
**Validação necessária**: Pierre + Sávio + Pietro
**Status**: previsto
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — itens 3.11 e 3.12

---

## Diretriz

Ferramentas externas (tools) utilizadas por agentes devem passar por validação de entrada e saída. Ações sensíveis exigem aprovação humana explícita.

## Regras vinculantes

1. Toda tool deve ter **validação de entrada** (tipo, formato, limites).
2. Toda tool deve ter **validação de saída** (o dado retornado é confiável?).
3. Tools de **criação, alteração ou exclusão** devem exigir aprovação humana.
4. Tools de **consulta** podem ser executadas autonomamente conforme alçada.
5. Tool calls de criação/ajuste devem incluir **idempotency_key** vinculada à mensagem de origem (evita duplicação).
6. Actions sensíveis (pagamento, deleção, alteração de regras) exigem **aprovação humana explícita**.
7. Toda tool call deve ser **logada** com timestamp, agente, parâmetros e resultado.

## Matriz de sensibilidade de tools

| Nível | Exemplo | Exigência |
|-------|---------|-----------|
| Consulta | ler dado, buscar info | Automática |
| Sugestão | preparar relatório | Automática com revisão |
| Criação | criar registro | Aprovação humana |
| Alteração | modificar registro | Aprovação humana |
| Exclusão | deletar dado | Aprovação humana + dupla confirmação |
| Crítica | pagamento, deleção em massa | Bloqueado (Kill Switch) |

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-01-TEC | Sávio Codare | Validação técnica de tools |
| DM-03-SEG | Pedro Gazan | Segurança de dados |
| AGT-PRT-002 | Pierre | Incidente e Kill Switch |

---

*Documento previsto — aguardando validação de Pierre Zanulli e Sávio Codare para canonização*
