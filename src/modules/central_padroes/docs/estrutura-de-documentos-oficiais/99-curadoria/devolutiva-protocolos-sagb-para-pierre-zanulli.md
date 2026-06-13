# Devolutiva — protocolos-grupob-sagb-geral.md

**Devolvido para**: Pierre Zanulli — Responsável por Agentes Autônomos (DM-05-AGT)
**Devolvido por**: Pietro Carboni — Guardião dos Padrões GrupoB
**Data**: 07-06-2026
**Documento original**: [`protocolos-grupob-sagb-geral.md`](MD-central-de-padroes/protocolos-grupob-sagb-geral.md)
**Análise completa**: [`analise-protocolos-grupob-sagb-geral.md`](MD-central-de-padroes/analise-protocolos-grupob-sagb-geral.md)

---

## Motivo da devolução

O documento foi **reprovado na triagem normativa** por 3 motivos que impedem a canonização:

### 1. Classificação normativa incorreta (~75% dos itens)

Dos 20 itens listados como "Protocolos Obrigatórios", apenas 5 são efetivamente protocolos. Os demais são princípios, regras, padrões, matrizes ou procedimentos.

### 2. Sem responsável identificado

O documento não possui:
- Responsável pela criação
- Versão
- Data
- Status
- Validação necessária

### 3. Sem dependências registradas

O documento cruza com Sávio (técnico), Pedro (segurança), Noah (naming), Yuri (processos), mas não declara nenhuma dependência.

---

## O que deve ser feito (A)

### Passo 1 — Assumir a responsabilidade pelo documento

Adicione ao documento (ou a uma nova versão) o cabeçalho interno padronizado:

```markdown
| Campo | Informação |
|---|---|
| Código do documento | (a definir) |
| Documento | (a definir) |
| Domínio normativo | Agentes Autônomos, IA e Orquestração |
| Responsável atual | Pierre Zanulli |
| Versão | v1.0 |
| Data da versão | (data atual) |
| Status | em_triagem |
| Formato | Markdown .md |
| Validação final | Pietro Carboni |
```

### Passo 2 — Reclassificar cada item no tipo normativo correto

Use a tabela abaixo como guia. Para cada item, **renomeie a seção** com o tipo normativo correto e ajuste o conteúdo se necessário:

| # | Item | Tipo atual (errado) | Tipo correto | Ação |
|---|------|---------------------|--------------|------|
| 3.1 | Viés Positivo | Protocolo | 🔵 **Princípio** | Mudar para seção de Princípios |
| 3.2 | Fronteira de Escopo | Protocolo | 🟡 **Procedimento** | Mudar para seção de Procedimentos |
| 3.3 | Coerência Contextual | Protocolo | 🔴 **Regra** | Mudar para seção de Regras |
| 3.4 | Alçada e Veto | Protocolo | 📊 **Matriz** | Mudar para seção de Matrizes |
| 3.5 | Integridade do Agente | Protocolo | 🔴 **Regra / 🟠 Política** | Mudar conforme preferir |
| 3.6 | Normalização de Transcrição | Protocolo | 🟠 **Padrão** | Mudar — já será extraído (ver C) |
| 3.7 | Presença U.A.U. | Protocolo | ✅ **Protocolo** | **Manter** — classificação correta |
| 3.8 | Comunicação entre Agentes | Protocolo | ✅ **Protocolo** | **Manter** — classificação correta |
| 3.9 | Fechamento e Registro | Protocolo | 🟡 **Procedimento** | Mudar para seção de Procedimentos |
| 3.10 | REDIR | Protocolo | ✅ **Protocolo** | **Manter** — classificação correta |
| 3.11 | Idempotência | Protocolo | 🟠 **Padrão Técnico** | Mudar (depende de Sávio) |
| 3.12 | Tool Use Seguro | Protocolo | 🟠 **Política** | Mudar (depende de Sávio) |
| 3.13 | Handoff entre Agentes | Protocolo | ✅ **Protocolo** | **Manter** — MAS unificar com DM-05 |
| 3.14 | Fonte da Verdade | Protocolo | 📊 **Matriz** | Mudar para seção de Matrizes |
| 3.15 | Memória Governada | Protocolo | 🟠 **Padrão** | Mudar |
| 3.16 | Incidente e Kill Switch | Protocolo | ✅ **Protocolo** | **Manter** — classificação correta |
| 3.17 | Orçamento | Protocolo | 🔴 **Regra** | Mudar para seção de Regras |
| 3.18 | Versionamento | Protocolo | 🟠 **Padrão** | Mudar |
| 3.19 | Matriz de Autonomia | Protocolo | 📊 **Matriz** | Mudar — MAS unificar com DM-05 |
| 3.20 | Registro de Decisão | Protocolo | 🟠 **Padrão / 📝 Registro** | Mudar — já será extraído (ver C) |

### Passo 3 — Separar arquitetura técnica de normas

A seção **"2. Arquitetura Cognitiva (9 Camadas)"** é **arquitetura de sistema**, não norma. Ela deve ser movida para a documentação técnica do SagB, fora da Central de Padrões. A Central só deve conter as normas extraídas das camadas.

### Passo 4 — Resolver duplicidades

| Duplicidade | Resolução |
|-------------|-----------|
| Handoff (3 versões: SagB + DM-05 + Nassar) | **Unificar** — manter a versão mais completa, referenciar as outras |
| Matriz de Autonomia (2 versões: SagB + DM-05) | **Unificar** — manter níveis 0-6 do SagB como padrão |
| Fechamento (3 versões: SagB + DM-02 + Nassar) | **Unificar** com Yuri |
| Normalização (2 versões: SagB + Nassar) | Já sendo extraída para DM-07 (Noah) |
| Tool Use (2 versões: SagB + DM-05) | **Unificar** — manter versão mais detalhada |

---

## Subdocumentos já sendo extraídos (C)

Enquanto você reclassifica, os 12 itens inéditos estão sendo extraídos como subdocumentos prévios nos DMs correspondentes. Consulte:

| Item extraído | DM destino | Arquivo |
|---------------|------------|---------|
| Viés Positivo | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-pri-003-vies-positivo-previsto.md` |
| Fronteira de Escopo | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-pro-001-fronteira-escopo-previsto.md` |
| Integridade do Agente | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-pol-002-integridade-agente-previsto.md` |
| Idempotência | DM-01-TEC | Requer Sávio — pendente |
| Tool Use Seguro | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-pol-003-tool-use-seguro-previsto.md` |
| Fonte da Verdade | DM-00-GOV | `00-governanca-central-padroes/gov-mtz-001-fonte-verdade-previsto.md` |
| Memória Governada | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-pad-002-memoria-governada-previsto.md` |
| Kill Switch | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-prt-002-incidente-kill-switch-previsto.md` |
| Teto de Custo | DM-05-AGT | `05-agentes-autonomos-ia-orquestracao/agt-reg-001-teto-custo-previsto.md` |
| Matriz Autonomia 0-6 | DM-05-AGT | Unificação com AGT-MTZ-001 — pendente |
| Registro Decisão | DM-02-PROC | Requer Yuri — pendente |
| Arquitetura 9 Camadas | Fora da Central | Documentação técnica do SagB |

---

## Prazo sugerido

**Reenvio do documento reclassificado**: até próxima curadoria (14-06-2026).

Após o reenvio, faremos a validação cruzada com Sávio (técnico), Pedro (segurança) e Noah (naming), conforme necessário.

---

*Devolutiva gerada por Pietro Carboni — Guardião dos Padrões GrupoB*
