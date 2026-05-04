# Plano do Módulo — Studio (Fabi Nunes)

## Fase Atual: Beta Operacional (v1.0.0)

> Este documento é o plano oficial do módulo `studio`, conforme [`padrao_modulos_plugaveis.md`](../../docs/governanca_sagb/padrao_modulos_plugaveis.md).
> Plano detalhado de evolução em [`plans/plano-evolucao-studio-fabi-nunes.md`](../../plans/plano-evolucao-studio-fabi-nunes.md).

---

## Prioridade 1 — ✅ Concluído

| Item | Status |
|------|--------|
| 1.1 Atualizar `module-doc.ts` com 5 tabelas e integrações | ✅ |
| 1.2 Adicionar exportação/download de áudio, vídeo e transcrições | ✅ |
| 1.3 Corrigir gaps de governança (persona, decisions, changelog) | ✅ |

## Prioridade 2 — 🔧 Em Planejamento

| Item | Status |
|------|--------|
| 2.1 Gerenciamento de memória em gravações longas | 🔧 |
| 2.2 Rate limiting e proteção contra múltiplas gravações | 🔧 |
| 2.3 Validação de permissão do workspace no frontend | 🔧 |

## Prioridade 3 — 🔧 Em Planejamento

| Item | Status |
|------|--------|
| 3.1 Integração robusta com CID (assets de transcrição) | 🔧 |
| 3.2 Integração com NIC (Knowledge items) | 🔧 |
| 3.3 Integração com QualitySensor | 🔧 |

## Prioridade 4 — 🔧 Em Planejamento

| Item | Status |
|------|--------|
| 4.1 Testes unitários e de integração | 🔧 |
| 4.2 Script de migração de dados legados | 🔧 |
| 4.3 Integração com Karaokê | 🔧 |

---

## Auditoria de Código

Relatório completo em [`plans/auditoria-studio-fabi-nunes.md`](../../plans/auditoria-studio-fabi-nunes.md).

**17 problemas identificados:**
- 2 🔴 Alta — Corrigidos
- 8 🟡 Média — 7 corrigidos, 1 adiado (rota sem props)
- 7 🔵 Baixa — Corrigidos

---

## Histórico

| Data | Evento |
|------|--------|
| 18/04/2026 | Criação do módulo Studio com captura multicâmera |
| 03/05/2026 | Plano de evolução P1-P4 criado; P1 concluído |
| 03/05/2026 | Auditoria de código + 17 bugs corrigidos |
