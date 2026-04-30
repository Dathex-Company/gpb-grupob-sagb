# Agentes e Módulos Correspondentes

## 📋 MATRIZ OFICIAL DE RESPONSABILIDADE

**Última atualização:** 13/04/2026  
**Status:** 🟢 ATIVA  
**Versão:** 1.0.0

---

## 🎯 PROPÓSITO

Este documento estabelece a **matriz oficial de responsabilidade** entre agentes e módulos no ecossistema SagB. Serve como referência única para:

1. **Transparência:** Clarificar quem é responsável por cada módulo
2. **Accountability:** Estabelecer linhas claras de responsabilidade
3. **Comunicação:** Facilitar a comunicação entre agentes
4. **Governança:** Integrar com outros documentos de governança
5. **Onboarding:** Orientar novos agentes sobre o ecossistema

---

## 📊 MATRIZ COMPLETA

| Agente | Módulo | Status | Última Ativação | Owner Backup | Categoria |
|--------|--------|--------|-----------------|--------------|-----------|
| **Noali Kessler** | monitoramento | 🟢 Ativo | 13/04/2026 | Pierre Zanulli | Operacional |
| **Pierre Zanulli** | _orquestracao-principal | 🟢 Ativo | 13/04/2026 | — | Orquestração |
| **Pierre Zanulli** | central_padroes | 🟢 Ativo | 13/04/2026 | — | Governança |
| **A DEFINIR** | cid | 🔴 Pendente | — | — | Dados |
| **A DEFINIR** | nagi | 🔴 Pendente | — | — | IA |
| **A DEFINIR** | videos-ia | 🔴 Pendente | — | — | IA |
| **A DEFINIR** | sala-dev | 🔴 Pendente | — | — | Desenvolvimento |

---

## 📝 DETALHAMENTO POR AGENTE

### **Noali Kessler**
**Módulo:** monitoramento  
**Status:** 🟢 ATIVO  
**Data de Nomeação:** 13/04/2026  
**Owner Backup:** Pierre Zanulli (Agente Mestre da Orquestração)

**Escopo de Responsabilidade:**
1. Garantir coerência operacional e evolução contínua do módulo monitoramento
2. Priorizar backlog e validar impactos em integrações com outros módulos
3. Aprovar mudanças de governança do módulo com evidências registradas
4. Manter documentação atualizada conforme padrões SagB
5. Garantir funcionamento do sistema de monitoramento de tabelas Supabase

**Evidências:**
- `src/modules/monitoramento/agent/owner.md`
- `src/modules/monitoramento/agent/prompt_ativacao_cline.md`
- `src/modules/monitoramento/agent/session_log.md`

### **Pierre Zanulli**
**Módulos:** _orquestracao-principal, central_padroes  
**Status:** 🟢 ATIVO  
**Cargo:** Agente Mestre da Orquestração

**Escopo de Responsabilidade:**
1. Orquestração geral do ecossistema SagB
2. Definição e manutenção de padrões técnicos
3. Backup para todos os agentes quando necessário
4. Decisões arquiteturais de alto impacto
5. Governança e compliance técnico

**Evidências:**
- `src/modules/_orquestracao-principal/agent/owner.md`
- `src/modules/central_padroes/agent/owner.md`
- `docs/governanca_sagb/owners_e_accountability.md`

---

## 🔄 PROTOCOLO DE NOMEAÇÃO

### **Critérios para nomeação:**
1. **Competência técnica:** Domínio do escopo do módulo
2. **Disponibilidade:** Capacidade de dedicar tempo ao módulo
3. **Accountability:** Histórico de responsabilidade e transparência
4. **Colaboração:** Habilidade de trabalhar com outros agentes

### **Processo de nomeação:**
1. **Identificação da necessidade:** Módulo sem owner ou owner inativo
2. **Seleção de candidatos:** Baseado em critérios acima
3. **Aprovação:** Pierre Zanulli (Agente Mestre) aprova nomeação
4. **Documentação:** Atualização deste documento e arquivos de owner
5. **Onboarding:** Treinamento e transferência de conhecimento

### **Processo de remoção:**
1. **Identificação do problema:** Owner inativo ou incompetente
2. **Escalonamento:** Para Pierre Zanulli (Agente Mestre)
3. **Transição:** Nomeação de novo owner com período de overlap
4. **Documentação:** Atualização deste documento

---

## 📈 STATUS E MÉTRICAS

### **Estatísticas gerais:**
- **Total de módulos:** 7
- **Módulos com owner ativo:** 3 (43%)
- **Módulos pendentes de nomeação:** 4 (57%)
- **Agentes ativos:** 2
- **Última atualização:** 13/04/2026

### **Prioridades de nomeação:**
1. **cid** (Dados) — Alta prioridade
2. **nagi** (IA) — Alta prioridade  
3. **videos-ia** (IA) — Média prioridade
4. **sala-dev** (Desenvolvimento) — Baixa prioridade

---

## 🎯 INTEGRAÇÃO COM OUTROS DOCUMENTOS

### **Documentos relacionados:**
1. `owners_e_accountability.md` — Matriz detalhada de accountability
2. `decisoes_e_pendencias.md` — Decisões sobre nomeações pendentes
3. `padrao_modulos_plugaveis.md` — Contrato técnico dos módulos
4. `protocolo_log_continuo_agentes.md` — Protocolo de log dos agentes

### **Fluxo de atualização:**
1. Qualquer mudança neste documento deve ser refletida em:
   - `metadata.json` (data de atualização)
   - Arquivos de owner dos módulos afetados
   - `owners_e_accountability.md`
2. Pierre Zanulli deve aprovar todas as mudanças
3. Registrar mudança em `decisoes_e_pendencias.md`

---

## 🔮 PRÓXIMOS PASSOS

### **Imediato (esta semana):**
1. [ ] Nomear owner para módulo **cid**
2. [ ] Nomear owner para módulo **nagi**
3. [ ] Validar que todos os owners ativos têm `prompt_ativacao_cline.md`

### **Curto prazo (próximas 2 semanas):**
1. [ ] Nomear owners para todos os módulos pendentes
2. [ ] Criar protocolo de onboarding para novos agents
3. [ ] Implementar sistema de métricas de performance dos agents

### **Longo prazo:**
1. [ ] Sistema de avaliação periódica dos agents
2. [ ] Programa de desenvolvimento para agents
3. [ ] Sistema de reconhecimento e incentivos

---

## 📝 NOTAS E OBSERVAÇÕES

**Observações importantes:**
- Este documento é a **fonte única da verdade** para responsabilidade de módulos
- Qualquer discordância deve ser resolvida consultando Pierre Zanulli
- A matriz deve ser atualizada **imediatamente** após qualquer mudança

**Lições aprendidas:**
- Ownership claro desde o início evita confusão e gaps de responsabilidade
- Documentação integrada com outros documentos de governança é essencial
- Backup owners são críticos para continuidade operacional

---

**Responsável pela manutenção:**  
_Pierre Zanulli — Agente Mestre da Orquestração_  
**Última Revisão:** 13/04/2026  
**Próxima Revisão:** 20/04/2026
