# Dicionário de Normalização por Áudio — previsto

**Código**: NAM-PAD-002
**Tipo**: 🟠 Padrão / 📊 Matriz
**Domínio**: Naming, Disponibilidade e Banco de Marcas (DM-07)
**Responsável**: Noah Verdili
**Validação necessária**: Noah + Pietro
**Status**: previsto
**Fonte**: [`documentos-nassar-extraidos-de-deepseek.md`](../../fontes-originais-v1-v2/documentos-nassar-extraidos-de-deepseek.md) — seção 2.3

---

## Objetivo

Padronizar a correção automática de erros de transcrição de áudio e contextuais no ecossistema GrupoB. Toda correção deve seguir este dicionário.

## ⚠️ Nota

Este documento é **transversal** — deve ser consumido por todos os agentes, sistemas de transcrição e processos que envolvam interpretação de áudio ou texto bruto.

---

## Matriz de Normalização

### Erros de Áudio (transcrição fonética)

| # | Entrada errada (áudio) | Saída correta | Contexto |
|---|---|---|---|
| N-01 | Grupo Bi, Grupo Bif, Grupo Pi | **GrupoB** | Marca guarda-chuva do ecossistema |
| N-02 | Triforbi, 34B, trifor bi | **3forB** | Unidade de CRM e operação |
| N-03 | Jornada UAL, UOL, UAU (sem pontos) | **Jornada U.A.U** | Metodologia de experiência |
| N-04 | StartB, Start B | **StartyB** | Unidade de ventures e startups |
| N-05 | Taskzar, taskzou | **Taskzei** | Sistema de tarefas e gestão |
| N-06 | SKU Odonto, Scare Odonto | **Scale Odonto** | Unidade odontológica |
| N-07 | Hump | **RAMP** | Metodologia/metodologia de ramp |
| N-08 | Ziplier | **Ziplia** | Ferramenta/plataforma |

### Erros Contextuais

| # | Entrada errada (contexto) | Saída correta | Contexto |
|---|---|---|---|
| N-09 | Marcos (quando for Max) | **Max** | Pessoa específica, corrigir pelo contexto |

### Erros de Escrita (marca com "B" separado)

| # | Entrada errada (escrita) | Saída correta | Marca |
|---|---|---|---|
| N-10 | Grupo B (separado) | **GrupoB** | GrupoB |
| N-11 | Starty B | **StartyB** | StartyB |
| N-12 | Academy B | **AcadB** | AcadB |
| N-13 | Instituto B | **InstitutoB** | InstitutoB |
| — | 3 for B, 3ForB | **3forB** | 3forB |
| — | Papo B | **PapoB** | PapoB |
| — | Acelera B | **AceleraB** | AceleraB |

> **Nota**: As 3 últimas entradas (PapoB, AceleraB) foram inferidas pelo padrão "B colado" — confirmar com Noah Verdili se estas marcas existem oficialmente.

---

## Regras de aplicação

1. A **transcrição original** deve ser preservada (nunca substituir o arquivo de áudio original).
2. A **correção** é aplicada na exibição, no registro e na interpretação.
3. Em caso de ambiguidade (ex.: "Marcos" pode ser pessoa ou erro de "Max"), o agente deve **parar e perguntar** (ver regra AGT-PRO-001 — Coerência Contextual).
4. Novas entradas no dicionário devem ser **validadas por Noah Verdili** antes de incorporadas.

---

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-00-GOV | Pietro | Travas de linguagem (L-05) — B das marcas |
| DM-05-AGT | Pierre | Agentes consumirem este dicionário |
| Protocolo de Interpretação Contextual (P-08) | Pierre | Corrigir pelo contexto |

---

*Documento previsto — aguardando validação de Noah Verdili para canonização*
