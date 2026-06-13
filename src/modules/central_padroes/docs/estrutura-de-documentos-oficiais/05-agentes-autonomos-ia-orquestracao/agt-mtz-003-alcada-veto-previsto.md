# Matriz de Alçada e Veto — previsto

**Código**: AGT-MTZ-003
**Tipo**: 📊 Matriz
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pietro + Pedro Gazan (se envolver dados)
**Status**: previsto
**Fonte**: AGT-RECLASS-001 (Pierre Zanulli) — item 10.1

---

## ⚠️ Nota de unificação

Esta matriz **deve ser unificada** com `AGT-MTZ-002` (Matriz de Autonomia 0-6). Ambas tratam de permissão e limite de ação de agentes. A unificação está pendente de sessão entre Pierre e Pietro.

Enquanto não unificada, esta matriz serve como referência de alçada por tipo de ação.

---

## Matriz

| Tipo de ação | Agente pode sugerir? | Agente pode executar? | Quem aprova? | Quem pode vetar? |
|---|---|---|---|---|
| Resumo interno | Sim | Sim | Não exige | Responsável humano |
| Rascunho de documento | Sim | Sim | Responsável conforme uso | Pietro, se padrão |
| Criar tarefa interna | Sim | Talvez | Responsável da área | Yuri / gestor |
| Alterar dado operacional | Sim | Só com gate | Responsável da área | Sávio / Pedro |
| Enviar mensagem externa | Sim | Só com gate | Humano responsável | Responsável da área |
| Acesso a dado sensível | Não livremente | Não | Pedro Gazan | Pedro Gazan |
| Alterar padrão oficial | Pode sugerir | Não | Pietro Carboni | Pietro Carboni |
| Ação financeira/cobrança | Pode sugerir | Não sem autorização | Kane/Rodrigues | Kane/Rodrigues |

## Regras associadas

1. **Sugerir** ≠ **executar** — o agente pode sugerir qualquer ação dentro do escopo.
2. **Gate** = aprovação obrigatória antes da execução.
3. **Veto** = qualquer responsável listado pode bloquear a ação.
4. Ação não listada nesta tabela segue a regra: **se não pode fazer, não faça** (ver AGT-PRO-001 — Fronteira de Escopo).

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| AGT-MTZ-002 | Pierre | Unificação pendente |
| AGT-PRO-001 | Pierre | Fronteira de Escopo |
| DM-03 | Pedro | Dados sensíveis |
| DM-11 | César/Kane | Ações financeiras |

---

*Documento previsto — baseado na reclassificação de Pierre Zanulli (AGT-RECLASS-001)*
