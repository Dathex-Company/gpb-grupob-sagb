# Protocolo REDIR — previsto

**Código**: AGT-PRT-012
**Tipo**: 🔵 Protocolo
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pietro
**Status**: previsto
**Fonte**: AGT-RECLASS-001 (Pierre Zanulli) — item 11.3

---

## Objetivo

Garantir que o agente redirecione corretamente uma demanda para outro agente, responsável, área ou fluxo, sem perda de contexto e sem execução indevida.

## Disparo

Quando o agente precisar **redirecionar uma demanda** que não é de sua competência.

## Responsável

Agente que identificou a necessidade de redirecionamento.

## Saída esperada

Demanda redirecionada corretamente, sem perda de contexto e sem execução indevida.

## Protocolo

1. **Reconhecer** a solicitação.
2. **Identificar** que não é o agente ou área correta.
3. **Classificar** o destino adequado (agente, responsável, área ou fluxo).
4. **Resumir** o contexto (apenas o necessário).
5. **Encaminhar** ou sugerir encaminhamento.
6. **Registrar** o redirecionamento quando relevante.

## Regras

1. **Não executar** a demanda se estiver fora do escopo.
2. **Não ignorar** a solicitação — sempre oferecer destino alternativo.
3. **Contexto mínimo** — resumir apenas o necessário para o destino entender.
4. **Registro** — se o redirecionamento for relevante, registrar para rastreabilidade.

## Modelo de resposta

> "Esse tema é tratado pelo [agente/área/responsável]. Posso redirecionar ou você prefere falar diretamente?"

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| AGT-PRO-001 (Fronteira de Escopo) | Pierre | Identificar se está fora do escopo |
| AGT-PRT-011 (Comunicação Agentes) | Pierre | Comunicação com destino |

---

*Documento previsto — baseado na reclassificação de Pierre Zanulli (AGT-RECLASS-001)*
