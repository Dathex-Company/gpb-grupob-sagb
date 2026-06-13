# Lacunas Pendentes — Documento Nassar Após Extrações

**Data**: 07-06-2026
**Analista**: Pietro Carboni — Guardião dos Padrões GrupoB
**Documento fonte**: [`documentos-nassar-extraidos-de-deepseek.md`](../fontes-originais-v1-v2/documentos-nassar-extraidos-de-deepseek.md)
**Extrações já realizadas**: 11 subdocumentos do SagB + 1 da análise anterior

---

## Status geral

| Total de itens identificados no Nassar | 80 |
|----------------------------------------|----|
| Já extraídos como subdocumento | 14 |
| **Ainda pendentes de extração** | **~30** |
| Fora da Central (arquitetura técnica) | 1 |

---

## 🚨 LACUNAS AINDA PENDENTES — extração necessária agora

### LAC-01 — Dicionário de Normalização de Nomes (13 regras)

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| N-01 a N-13 | Nassar (áudio + contexto) | **DM-07-NAM** | Noah Verdili |

**Status**: 🚨 **Não extraído** — é a maior lacuna remanescente.
**Ação**: Criar subdocumento `nam-pad-002-dicionario-normalizacao-audio.md` em DM-07-NAM.

---

### LAC-02 — Travas de Linguagem Completas (10 regras)

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| L-01 a L-10 | Nassar (travas de linguagem) | **DM-00-GOV** (transversal) | Pietro Carboni |

**Status**: ⚠️ **Parcialmente capturado** no SagB (seção 4), mas sem subdocumento formal.
**Ação**: Criar subdocumento `gov-pad-001-travas-linguagem-grupob.md` em DM-00-GOV.

---

### LAC-03 — Metodologias Proprietárias (9 metodologias)

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| M-01 a M-09 | Nassar (DR, GERAC, UAU, MAV, EDA, PSCAR, CHAI, TRATO, Camadas) | **DM-09-MET** | Nilo Barret |

**Status**: 🚨 **Não extraído** — conteúdo das 5 metodologias grandes + 4 menores.
**Ação**: Criar subdocumentos em DM-09-MET.

---

### LAC-04 — Prompts de Agentes (7 agentes)

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| A-01 a A-07 | Nassar (prompts completos) | **DM-05-AGT** | Pierre Zanulli |

**Status**: 🚨 **Não extraído** — prompts completos de Nassar, Peres, Cesar Tulli, Tulian, Yasmin, Bianca/Mia, Intensificador.
**Ação**: Extrair como contratos de agente em DM-05-AGT.

---

### LAC-05 — Organograma Completo (14 pessoas)

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| O-01 a O-14 | Nassar (estrutura organizacional) | **DM-11-NEG** + **DM-00-GOV** | César Tulli |

**Status**: ⚠️ **Não extraído** — organograma com cargos e unidades.
**Ação**: Consolidar em DM-11-NEG.

---

### LAC-06 — Diretores de Metodologias (Crispim, Álvaro, Germano, Yves, Diógenes, Nilo Frade)

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| O-06 a O-11 | Nassar (diretores) | **DM-09-MET** | Nilo Barret |

**Status**: ⚠️ **Não extraído** — diretores responsáveis por cada metodologia.
**Ação**: Incorporar em DM-09-MET.

---

### LAC-07 — Protocolos Restantes do Ecossistema

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| P-03 — Decisão Estratégica | Nassar | DM-05-AGT | Pierre |
| P-05 — Rotina (sono, foco, agenda) | Nassar | DM-05-AGT | Pierre |
| P-08 — Interpretação Contextual | Nassar | DM-05-AGT | Pierre |
| P-11 — Poda de Assunto | Nassar | DM-05-AGT | Pierre |
| P-12 — Fechamento Obrigatório | Nassar | DM-05-AGT | Pierre |
| P-13 — Regra de Reabertura | Nassar | DM-05-AGT | Pierre |
| P-14 — Interfone do Rodrigues | Nassar | DM-05-AGT | Pierre |

**Status**: ⚠️ **Não extraídos** como subdocumentos individuais.
**Ação**: Criar protocolos em DM-05-AGT.

---

### LAC-08 — Governança de Agentes Restante

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| G-01 — Termo "C.A." oficial | Nassar | DM-05-AGT | Pierre |
| G-02 — Persona obrigatória | Nassar | DM-05-AGT | Pierre |
| G-03 — Hierarquia clara | Nassar | DM-05-AGT | Pierre |
| G-05 — Validação no organograma | Nassar | DM-05-AGT | Pierre |
| G-06 — Função clara e dono humano | Nassar | DM-05-AGT | Pierre |

**Status**: ⚠️ **Parcialmente coberto** pelo SagB, mas sem subdocumento consolidado.
**Ação**: Consolidar em DM-05-AGT como padrão de governança de agente.

---

### LAC-09 — Padrões de Documentação ClickUp

| Item | Fonte | DM alvo | Responsável |
|------|-------|---------|-------------|
| D-01 a D-04 | Nassar (títulos, formatação) | **DM-02-PROC** | Yuri Sague |

**Status**: ⚠️ **Não extraído** — padrões de formatação de documentos.
**Ação**: Criar subdocumento em DM-02-PROC.

---

## Resumo visual — o que já foi vs o que falta

```
NASSAR (80 itens)
│
├── ✅ Extraídos (14)
│   ├── SagB → AGT-PRI-003 (Viés Positivo)
│   ├── SagB → AGT-PRO-001 (Fronteira Escopo)
│   ├── SagB → AGT-POL-002 (Integridade)
│   ├── SagB → AGT-POL-003 (Tool Use)
│   ├── SagB → AGT-PAD-002 (Memória)
│   ├── SagB → AGT-PRT-002 (Kill Switch)
│   ├── SagB → AGT-REG-001 (Teto Custo)
│   ├── SagB → AGT-MTZ-002 (Autonomia 0-6)
│   ├── SagB → GOV-MTZ-001 (Fonte Verdade)
│   ├── SagB → PROC-PAD-002 (Registro Decisão)
│   ├── SagB → TEC-PAD-002 (Idempotência)
│   ├── SagB → 3.7 Presença UAU (já no SagB)
│   ├── SagB → 3.8 Comunicação (já no SagB)
│   └── SagB → 3.10 REDIR (já no SagB)
│
├── 🚨 Extrair AGORA (3) ← Prioridade máxima
│   ├── N-01 a N-13 → DM-07-NAM (Dicionário de Normalização)
│   ├── L-01 a L-10 → DM-00-GOV (Travas de Linguagem)
│   └── P-03 → DM-05-AGT (Decisão Estratégica)
│
├── ⚠️ Extrair PRÓXIMA RODADA (6)
│   ├── M-01 a M-09 → DM-09-MET (Metodologias)
│   ├── A-01 a A-07 → DM-05-AGT (Prompts)
│   ├── O-01 a O-14 → DM-11-NEG (Organograma)
│   ├── P-05, P-08, P-11 a P-14 → DM-05-AGT
│   ├── G-01 a G-06 → DM-05-AGT
│   └── D-01 a D-04 → DM-02-PROC
│
└── 🔵 Fora da Central
    └── Arquitetura 9 Camadas → doc técnica SagB
```

---

## Ação imediata

Extraindo agora os **3 itens prioritários** que ainda não têm subdocumento:

1. **Dicionário de Normalização** (N-01 a N-13) → `DM-07-NAM/nam-pad-002-dicionario-normalizacao-audio.md`
2. **Travas de Linguagem** (L-01 a L-10) → `DM-00-GOV/gov-pad-001-travas-linguagem-grupob.md`
3. **Protocolo de Decisão Estratégica** (P-03) → `DM-05-AGT/agt-prt-003-decisao-estrategica.md`
