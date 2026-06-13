# Protocolo de Comunicação entre Agentes — previsto

**Código**: AGT-PRT-011
**Tipo**: 🔵 Protocolo
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pedro Gazan (se houver dados sensíveis) + Pietro
**Status**: previsto
**Fonte**: AGT-RECLASS-001 (Pierre Zanulli) — item 11.2

---

## Objetivo

Garantir que a comunicação entre agentes seja clara, contextualizada, limitada ao necessário e registrada.

## Disparo

Quando um agente precisar **acionar outro agente** ou trocar contexto com ele.

## Responsável

Agente originador + agente receptor.

## Saída esperada

Comunicação clara, contextualizada, limitada ao necessário e registrada.

## Protocolo

1. **Identificar** a necessidade de outro agente.
2. **Definir** o objetivo do contato.
3. **Resumir** o contexto mínimo necessário.
4. **Declarar** restrições e dados proibidos.
5. **Enviar** solicitação estruturada.
6. **Receber** resposta.
7. **Registrar** contribuição.
8. **Consolidar** síntese para o usuário ou sistema.

## Regras

1. **Mínimo contexto necessário** — não enviar todo o histórico, apenas o relevante.
2. **Dados proibidos** — nunca compartilhar dado sensível sem autorização.
3. **Registro obrigatório** — toda comunicação entre agentes deve ser rastreável.
4. **Sem loop** — se o agente receptor não puder ajudar, encerrar e escalar.

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| Pedro Gazan | DM-03 | Dados sensíveis |
| AGT-PRT-001 (Handoff) | Pierre | Handoff quando aplicável |

---

*Documento previsto — baseado na reclassificação de Pierre Zanulli (AGT-RECLASS-001)*
