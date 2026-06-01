# DECISIONS.md — Sala Dev

## Formato ADR (Architecture Decision Record)

---

### ADR-001 — Transição do Modelo de 11 para 18 Agentes

**Data:** 31/05/2026

**Decisão:** Evoluir o modelo de agentes da Sala Dev de 11 para 18 agentes especializados (CA-01 a CA-18).

**Motivação:**
- Os 11 agentes originais acumulavam múltiplas funções, gerando sobrecarga cognitiva
- Agentes sobrecarregados tendem a alucinar, perder memória de contexto e produzir dados inconsistentes
- Especialização reduz o escopo de cada agente, melhorando a qualidade da saída
- Sete funções críticas não estavam representadas: Segurança, DevOps, Logs, Versionamento, Catálogo Técnico, Agentes/MCPs, Revisor de Código, Operação e Runbooks

**Alternativas consideradas:**
1. Manter 11 agentes e aumentar o contexto deles — rejeitado porque agrava o problema de alucinação
2. Criar 19 agentes (microespecialização) — rejeitado por complexidade desnecessária neste momento
3. **18 agentes (escolhido)** — especialização suficiente sem excesso de granularidade

**Consequências:**
- AGENTS.md precisa ser completamente reescrito para 18 agentes
- 7 novas personas precisam ser criadas
- 7 novos prompts de ativação precisam ser criados
- Central de Padrões (planejada para 11 agentes) precisa ser remapeada para 18
- Documento "Estrutura Visual dos 18 Agentes" já existe e serve como base

**Arquivos alterados:**
- `governance/metodologia_multiagentes/AGENTS.md` — expandido de 11 para 18
- `governance/metodologia_multiagentes/PROJECT_BOOTSTRAP.md` — atualizado
- `governance/metodologia_multiagentes/CONTEXT.md` — atualizado
- `plans/plano_evolucao_11_para_18_agentes.md` — criado com plano detalhado
- `plans/analise_sala_dev_completa.md` — movido de Z:\plans\
- `plans/central_padroes_por_agente_esteira.md` — movido de Z:\plans\

---

### ADR-002 — Adoção do Código CA (Catálogo de Agentes) para Identificação

**Data:** 31/05/2026

**Decisão:** Adotar o formato de código `CA-NN` (Catálogo de Agentes) para identificar cada agente na Sala Dev.

**Motivação:**
- Facilita referência cruzada entre documentos
- Permite ordenação numérica clara (CA-01 a CA-18)
- Prepara para expansão futura (CA-19 a CA-30)
- O documento "Estrutura Visual dos 18 Agentes" já usa este formato

**Impacto:**
- AGENTS.md passa a usar CA-01 a CA-18
- Personas serão nomeadas como `ca-XX-nome.md`
- Documentação da Central de Padrões usará referência CA

---

### ADR-003 — Preservação dos 11 Agentes Originais como Base

**Data:** 31/05/2026

**Decisão:** Os 11 agentes originais não são apagados. Seus conteúdos são mantidos e expandidos dentro dos 18 novos agentes.

**Motivação:**
- Preservar histórico e rastreabilidade
- Aproveitar o trabalho já feito nos 11 agentes
- Evitar perda de documentação existente

**Mapeamento de transição:**
- Orquestrador → CA-01
- System Architect → CA-02
- Technical Writer → CA-03
- Frontend Engineer → CA-04
- Backend Engineer → CA-05
- Database Engineer → CA-06
- Integrations Engineer → CA-07
- QA Reviewer → CA-10
- UX and Flow Designer → CA-16
- Product Strategist → absorvido por CA-18 + CA-01
- Project Planner → distribuído entre CA-01, CA-12, CA-17

---

### ADR-004 — Estrutura de Armazenamento de Documentos dos Planos

**Data:** 31/05/2026

**Decisão:** Todos os planos, análises e relatórios da Sala Dev devem ser salvos em `Z:\00_sagb\src\modules\sala-dev\plans\`.

**Arquivos movidos:**
- `Z:\plans\analise_sala_dev_completa.md` → `plans/analise_sala_dev_completa.md`
- `Z:\plans\central_padroes_por_agente_esteira.md` → `plans/central_padroes_por_agente_esteira.md`
- `plans/plano_evolucao_11_para_18_agentes.md` — criado diretamente no local
