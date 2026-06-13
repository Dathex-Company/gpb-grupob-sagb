# Análise — `protocolos-grupob-sagb-geral.md`

**Documento**: [`protocolos-grupob-sagb-geral.md`](MD-central-de-padroes/protocolos-grupob-sagb-geral.md)
**Data da análise**: 07-06-2026
**Analista**: Pietro Carboni — Guardião dos Padrões GrupoB
**Status**: Documento bruto em análise — **não aprovado como canônico**

---

## 1. Ficha do documento

O documento não possui cabeçalho interno padronizado (como os DMs têm). Pela leitura:

| Campo | Valor inferido |
|-------|----------------|
| Nome | Documento-Base do Sistema de Agentes do GrupoB (SagB) |
| Tipo declarado | "Documento-Base" |
| Responsável | Não identificado |
| Versão | Não informada |
| Data | Não informada |
| Status | Bruto / Não classificado |
| Origem | Provável consolidação de conversas + estrutura técnica de agentes |

---

## 2. Classificação normativa — problema central

O documento intitula **20 itens como "Protocolos Obrigatórios"** (seção 3), mas pela hierarquia normativa da Central de Padrões, **apenas 4 são efetivamente protocolos**. Os demais são:

### 2.1. Classificação correta de cada item

| # | Item | Declarado como | Classificação correta | Justificativa |
|---|------|----------------|----------------------|---------------|
| 3.1 | Viés Positivo | Protocolo | 🔵 **Princípio** | É verdade fundacional: testar decisões, não concordar passivamente. Não tem sequência com saída esperada |
| 3.2 | Fronteira de Escopo | Protocolo | 🟡 **Procedimento** | Passo a passo: recusar → redirecionar → handoff. Sem decisão |
| 3.3 | Coerência Contextual | Protocolo | 🔴 **Regra** | "Pare e pergunte" — é proibição de prosseguir sem confirmação |
| 3.4 | Alçada e Veto | Protocolo | 📊 **Matriz** | Classificação por nível (Estratégico/Tático/Operacional). Tabela de decisão |
| 3.5 | Integridade do Agente | Protocolo | 🔴 **Regra / 🟠 Política** | Proteção contra jailbreak. É diretriz vinculante, não sequência |
| 3.6 | Normalização de Transcrição | Protocolo | 🟠 **Padrão / 📊 Matriz** | É dicionário de referência (tabela entrada→saída). Correção automática |
| 3.7 | Presença U.A.U. | Protocolo | ✅ **Protocolo** | Sequência: entrar → saudar → identificar → contextualizar. Correto |
| 3.8 | Comunicação entre Agentes | Protocolo | ✅ **Protocolo** | Sequência: saudação → contexto → leitura → ponto → perguntas → objetivo. Correto |
| 3.9 | Fechamento e Registro | Protocolo | 🟡 **Procedimento** | Instruções: gerar resumo, criar ata. Sem decisão no passo |
| 3.10 | REDIR | Protocolo | ✅ **Protocolo** | Sequência de reunião formal. Correto |
| 3.11 | Idempotência | Protocolo | 🟠 **Padrão Técnico** | Especificação de implementação, não sequência |
| 3.12 | Tool Use Seguro | Protocolo | 🟠 **Política** | Diretriz de segurança, com validação obrigatória |
| 3.13 | Handoff entre Agentes | Protocolo | ✅ **Protocolo** | Sequência de transferência. Correto |
| 3.14 | Fonte da Verdade | Protocolo | 📊 **Matriz** | Hierarquia de fontes, tabela de precedência |
| 3.15 | Memória Governada | Protocolo | 🟠 **Padrão** | Modelo de estrutura de memória com campos obrigatórios |
| 3.16 | Incidente e Kill Switch | Protocolo | ✅ **Protocolo** | Sequência de emergência. Correto |
| 3.17 | Orçamento (Teto de Custo) | Protocolo | 🔴 **Regra** | Limite vinculante, sem sequência |
| 3.18 | Versionamento de Agentes | Protocolo | 🟠 **Padrão** | Modelo de referência de versionamento |
| 3.19 | Matriz de Autonomia | Protocolo | 📊 **Matriz** | Classificação por nível (0 a 6). Correto como matriz |
| 3.20 | Registro Estruturado de Decisão | Protocolo | 🟠 **Padrão / 📝 Registro** | Template de objeto de decisão |

**Resumo da classificação**: 20 itens nomeados como "Protocolo" → apenas **4 são protocolos** (3.7, 3.8, 3.10, 3.13, 3.16). Os demais são princípios, regras, padrões, matrizes, políticas ou procedimentos. **Taxa de erro de classificação: ~75%.**

---

## 3. Cruzamento com Documentos Mestres (DM-00 a DM-11)

### 3.1. Cruzamento com o Nassar recém-analisado

| Item no SagB | Item correspondente no documento Nassar | Status |
|--------------|----------------------------------------|--------|
| 3.1 Viés Positivo | Não presente no Nassar | 🆕 **Novo** |
| 3.2 Fronteira de Escopo | Não presente no Nassar | 🆕 **Novo** |
| 3.3 Coerência Contextual | P-08 (Interpretação Contextual) | ✅ **Capturado** |
| 3.4 Alçada e Veto | Mencionado em Protocolo 3 | ⚠️ **Expandido** |
| 3.5 Integridade do Agente | Não presente | 🆕 **Novo** |
| 3.6 Normalização de Transcrição | N-01 a N-13 | ✅ **Capturado, mas incompleto** (SagB não lista as 13 entradas) |
| 3.7 Presença U.A.U. | P-01 (Protocolo 1) | ✅ **Capturado** |
| 3.8 Comunicação entre Agentes | P-07 (Modo Reunião) + P-09 (Agent-to-Agent) | ✅ **Capturado** |
| 3.9 Fechamento e Registro | P-06 (Protocolo 6) + P-12 (Fechamento Obrigatório) | ✅ **Capturado** |
| 3.10 REDIR | P-10 (REDIR) | ✅ **Capturado** |
| 3.11 Idempotência | Não presente | 🆕 **Novo** |
| 3.12 Tool Use Seguro | Não presente | 🆕 **Novo** |
| 3.13 Handoff entre Agentes | P-09 (Agent-to-Agent) | ⚠️ **Parcial** |
| 3.14 Fonte da Verdade | Não presente | 🆕 **Novo** |
| 3.15 Memória Governada | Não presente | 🆕 **Novo** |
| 3.16 Incidente e Kill Switch | Não presente | 🆕 **Novo** |
| 3.17 Orçamento / Teto de Custo | Não presente | 🆕 **Novo** |
| 3.18 Versionamento | G-04 (v1.0, v1.5, v2.0) | ✅ **Capturado** |
| 3.19 Matriz de Autonomia | Não presente | 🆕 **Novo** |
| 3.20 Registro Estruturado de Decisão | Não presente | 🆕 **Novo** |

**Conclusão**: O documento SagB contém **8 itens novos** que não estão no documento Nassar (3.1, 3.2, 3.5, 3.11, 3.12, 3.14, 3.15, 3.16, 3.17, 3.19, 3.20). Isso sugere que o SagB foi construído **paralelamente** ao Nassar, possivelmente por fonte técnica diferente (Sávio/Pierre/Cristiano Sá).

### 3.2. Cruzamento com DM-05-AGT (Agentes, Pierre Zanulli)

| Item SagB | DM-05-AGT correspondente | Status |
|-----------|-------------------------|--------|
| 3.3 Coerência Contextual | Não mapeado | ⚠️ **Lacuna no DM-05** |
| 3.4 Alçada e Veto | AGT-PRI-001 (Autonomia com limite) | ⚠️ **Parcial** — DM-05 mais genérico |
| 3.5 Integridade do Agente | Não mapeado | ⚠️ **Lacuna** |
| 3.6 Normalização de Transcrição | Não mapeado | ⚠️ **Lacuna** (é DM-07, não DM-05) |
| 3.7 Presença U.A.U. | Não mapeado | ⚠️ **Lacuna** |
| 3.8 Comunicação entre Agentes | AGT-PRT-001 (Handoff) | ⚠️ **Parcial** — DM-05 só trata de handoff |
| 3.11 Idempotência | AGT-POL-001 (Tool Use) | ⚠️ **Parcial** — DM-05 cita tool use sem detalhes |
| 3.12 Tool Use Seguro | AGT-POL-001 | ⚠️ **Parcial** |
| 3.13 Handoff entre Agentes | AGT-PRT-001 | ⚠️ **Duplicidade** — mesmos conceitos, redações diferentes |
| 3.15 Memória Governada | Não mapeado | ⚠️ **Lacuna** |
| 3.16 Kill Switch | Não mapeado | ⚠️ **Lacuna** |
| 3.17 Teto de Custo | Não mapeado | ⚠️ **Lacuna** |
| 3.19 Matriz de Autonomia | AGT-MTZ-001 | ⚠️ **Duplicidade** — níveis diferentes (SagB tem 0-6, DM-05 não detalha) |
| 3.20 Registro de Decisão | Não mapeado | ⚠️ **Lacuna** |

### 3.3. Cruzamento com DM-00-GOV (Governança)

| Item SagB | DM-00 correspondente | Status |
|-----------|---------------------|--------|
| Camada 2 — Compliance | Não mapeado | ⚠️ **Lacuna** |
| Camada 3 — Governança (Alçada, Veto) | GOV-PRT-001 | ⚠️ **Parcial** |
| Camada 4 — Permissões | Não mapeado | ⚠️ **Lacuna** |
| Camada 9 — Avaliação | Não mapeado | ⚠️ **Lacuna** |

### 3.4. Cruzamento com DM-07-NAM (Naming, Noah Verdili)

| Item SagB | DM-07 correspondente | Status |
|-----------|---------------------|--------|
| 3.6 Normalização de Transcrição | NAM-PAD-001 / NAM-PRT-001 | 🚨 **Confirmada a lacuna** — DM-07 não captura este padrão |

### 3.5. Cruzamento com DM-02-PROC (Processos, Yuri Sague)

| Item SagB | DM-02 correspondente | Status |
|-----------|---------------------|--------|
| 3.9 Fechamento e Registro | PROC-PAD-001 / PROC-PRT-001 | ⚠️ **Duplicidade** — ambos tratam de registros operacionais |

---

## 4. Duplicidades com a Central de Padrões

| # | Tema | Aparece em | Classificação | Risco |
|---|------|------------|---------------|-------|
| D-01 | **Handoff entre Agentes** | SagB (3.13) + DM-05 (AGT-PRT-001) + Nassar (P-09) | 3 fontes para o mesmo protocolo | 🚨 **Alto** |
| D-02 | **Matriz de Autonomia** | SagB (3.19) + DM-05 (AGT-MTZ-001) | Duas versões diferentes | ⚠️ **Médio** |
| D-03 | **Normalização de Transcrição** | SagB (3.6) + Nassar (N-01 a N-13) | SagB menciona mas não lista todas as 13 entradas | ⚠️ **Médio** |
| D-04 | **Fechamento e Registro** | SagB (3.9) + DM-02 (PROC-PRT-001) + Nassar (P-06) | 3 fontes | ⚠️ **Médio** |
| D-05 | **Tool Use** | SagB (3.12) + DM-05 (AGT-POL-001) | SagB mais detalhado | ⚠️ **Médio** |

---

## 5. Lacunas que o SagB preenche (itens novos para a Central)

O documento SagB adiciona **conteúdo que não existe em nenhum DM oficial**:

| # | Item | Relevância | DM alvo |
|---|------|------------|---------|
| L-01 | **Arquitetura de 9 Camadas** | Alta — define hierarquia cognitiva do sistema | DM-05-AGT |
| L-02 | **Viés Positivo** | Alta — princípio de testar decisões | DM-05-AGT |
| L-03 | **Fronteira de Escopo** | Alta — procedimento de recusa | DM-05-AGT |
| L-04 | **Integridade do Agente** | Alta — proteção contra jailbreak | DM-05-AGT + DM-03-SEG |
| L-05 | **Idempotência** | Média — padrão técnico | DM-01-TEC |
| L-06 | **Tool Use Seguro** | Alta — validação de ferramentas | DM-05-AGT + DM-03-SEG |
| L-07 | **Fonte da Verdade** | Alta — hierarquia de precedência | DM-00-GOV |
| L-08 | **Memória Governada** | Alta — gestão de memórias | DM-05-AGT |
| L-09 | **Incidente e Kill Switch** | Alta — parada de emergência | DM-05-AGT + DM-03-SEG |
| L-10 | **Orçamento / Teto de Custo** | Média — controle financeiro | DM-05-AGT |
| L-11 | **Matriz de Autonomia (0-6)** | Alta — níveis detalhados | DM-05-AGT |
| L-12 | **Registro Estruturado de Decisão** | Alta — template de decisão | DM-02-PROC + DM-00-GOV |

---

## 6. Problemas estruturais do documento

### 6.1. Classificação errada (já detalhada no item 2)

75% dos itens chamados de "protocolo" não são protocolos. Isso viola o **princípio 4** da Central:

> *Não chamar tudo de protocolo.*

### 6.2. Ausência de responsável

O documento não identifica:
- Quem criou
- Quem é o dono do conteúdo
- Quem validou
- Versão

Sem responsável claro, o documento **não pode entrar como canônico**.

### 6.3. Ausência de dependências registradas

O documento não declara dependências com outros domínios (Sávio, Alice, Pedro, Pierre, etc.).

### 6.4. Mistura de arquitetura com normas

A seção 2 (Arquitetura Cognitiva de 9 Camadas) é **arquitetura de sistema**, não norma. Pertence à documentação técnica do SagB, não à Central de Padrões. A Central deve conter apenas as **normas** (protocolos, regras, padrões), não o desenho arquitetural.

### 6.5. SagB como termo

O documento usa "SagB" (Sistema Avançado de Gestão do GrupoB) como nome do sistema de agentes. No documento Nassar e no DM-05, o termo usado é "C.A. (Colaborador Autônomo)". **Há conflito de nomenclatura** — o Noah Verdili (DM-07) precisa validar qual é o nome oficial.

---

## 7. Decisão

Documento: [`protocolos-grupob-sagb-geral.md`](MD-central-de-padroes/protocolos-grupob-sagb-geral.md)
Área responsável: Agentes Autônomos (Pierre Zanulli) — inferido pelo conteúdo
Classificação declarada: Documento-Base / Protocolos Obrigatórios
Classificação real: **Híbrido bruto** — contém princípios, regras, padrões, protocolos, procedimentos, matrizes e arquitetura técnica misturados

### Análise

1. **Classificação normativa**: ❌ **Incorreta** — 75% dos itens chamados de "protocolo" são de outro tipo normativo. O documento como um todo é uma **consolidação bruta**, não um documento normativo classificado.

2. **Responsável identificado**: ❌ **Não** — sem dono, sem versão, sem data.

3. **Dependências registradas**: ❌ **Não** — zero dependências com Sávio, Alice, Pedro, Pierre, Noah, Yuri, etc.

4. **Risco de duplicidade**: 🚨 **Alto** — 5 duplicidades diretas com DM-05-AGT, DM-02-PROC e documento Nassar. O maior risco é o **Handoff entre Agentes** existir em 3 versões diferentes (SagB, DM-05, Nassar).

5. **Conteúdo canônico ou bruto**: 🟠 **Bruto** — documento precisa de triagem, classificação, extração e validação antes de qualquer item virar canônico.

### Decisão

**❌ Devolvido** — não aprovado como documento canônico.

Motivos:
1. Classificação normativa incorreta (75% dos "protocolos" são outra coisa)
2. Sem responsável identificado
3. Sem dependências registradas
4. Duplicidades não resolvidas com DM-05, DM-02 e documento Nassar
5. Mistura arquitetura técnica com normas (as 9 camadas são desenho de sistema, não padrão)

---

## 8. Recomendação de encaminhamento

O documento tem **altíssimo valor** — ele preenche 12 lacunas que a Central de Padrões não cobre. Mas precisa ser tratado:

### Fase 1 — Triagem (Pietro + responsável a designar)

1. Separar **arquitetura técnica** (9 camadas) → documentação do sistema SagB
2. Separar **normas** (20 itens) → classificar cada um no tipo correto
3. Extrair **template de Registro de Decisão** (3.20) → subdocumento
4. Extrair **Matriz de Autonomia** (3.19) → unificar com AGT-MTZ-001 do DM-05

### Fase 2 — Validação cruzada

| Item | Validar com |
|------|-------------|
| Handoff entre Agentes | Pierre Zanulli (unificar 3 versões) |
| Integridade / Kill Switch | Pedro Gazan (segurança) |
| Idempotência / Tool Use | Sávio Codare (técnico) |
| Nomenclatura SagB vs C.A. | Noah Verdili (naming) |
| Registro de Decisão | Yuri Sague (processos) |

### Fase 3 — Canonização

Após validação, os itens aprovados devem ser incorporados como subdocumentos dos DMs correspondentes, seguindo a ordem:
1. DM-05-AGT (agentes) — recebe a maior parte do conteúdo
2. DM-00-GOV (governança) — recebe Fonte da Verdade e Registro de Decisão
3. DM-02-PROC (processos) — recebe template de registro
4. DM-07-NAM (naming) — recebe normalização de transcrição
5. DM-03-SEG (segurança) — recebe Kill Switch e Integridade

---

## 9. Síntese final

O documento [`protocolos-grupob-sagb-geral.md`](MD-central-de-padroes/protocolos-grupob-sagb-geral.md) é uma **fonte bruta de altíssimo valor** que cobre 12 lacunas da Central de Padrões, mas:

- ❌ **Não está classificado corretamente** — 75% dos itens não são protocolos
- ❌ **Não tem dono** — sem responsável, não entra como canônico
- ❌ **Tem 5 duplicidades** — especialmente Handoff (3 versões) e Matriz de Autonomia (2 versões)
- ✅ **Traz 12 itens inéditos** — Viés Positivo, Fronteira de Escopo, Integridade, Idempotência, Tool Use, Fonte da Verdade, Memória, Kill Switch, Teto de Custo, Matriz 0-6, Registro Estruturado, Arquitetura 9 Camadas

**Valor do documento**: 8/10 (fonte rica, mas precisa de tratamento)
**Risco de duplicidade**: 7/10 (alto — 5 duplicidades diretas)
**Prontidão para canonização**: 2/10 (baixa — precisa de triagem completa)

---

## 10. Próximos passos possíveis

**A** — Devolver o documento para triagem com a classificação corrigida e solicitar que Pierre Zanulli assuma como responsável.

**B** — Convocar Pierre Zanulli + Sávio Codare para sessão de validação cruzada dos itens técnicos (Idempotência, Tool Use, Kill Switch).

**C** — Extrair os 12 itens inéditos do SagB e incorporar como subdocumentos dos DMs correspondentes, resolvendo as duplicidades no mesmo movimento.

**D** — Registrar o documento como fonte bruta e aguardar a definição de responsável antes de qualquer canonização.

---

*Análise gerada por Pietro Carboni — Guardião dos Padrões GrupoB*
*Base: [`Z:\MD-central-de-padroes\protocolos-grupob-sagb-geral.md`](MD-central-de-padroes/protocolos-grupob-sagb-geral.md)*
*Cruzamento: DM-00 a DM-11 + documentos-nassar-extraidos-de-deepseek.md*
