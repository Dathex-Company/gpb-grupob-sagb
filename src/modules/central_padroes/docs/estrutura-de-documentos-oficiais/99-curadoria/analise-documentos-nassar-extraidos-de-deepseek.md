# Análise e Cruzamento — Documentos Nassar Extraídos de DeepSeek

**Documento**: `documentos-nassar-extraidos-de-deepseek.md`
**Data da análise**: 07-06-2026
**Analista**: Pietro Carboni — Guardião dos Padrões GrupoB
**Status**: Análise concluída

---

## 1. Resumo do documento analisado

O documento é um **megaconversacional** extraído de interações entre Rodrigues (Douglas Rodrigues) e múltiplos agentes do ecossistema GrupoB, predominantemente com o agente **Pedro Nassar (CEO)**. Contém:

- Extrações de falas autorais de Rodrigues
- Definições de protocolos (0 a 6)
- Padrões de linguagem e travas
- Normalizações de transcrição de áudio
- Organograma completo do GrupoB
- Diretores de metodologias
- Prompts de agentes (Pedro Nassar, João Peres, Cesar Tulli, Tulian Zagoto, etc.)
- Definições de metodologias proprietárias (DR, GERAC, Jornada U.A.U, MAV, EDA)
- Padrões de documentação e ClickUp
- Protocolos de reunião (REDIR)
- Prompt "Auditor de Padrões e Linguagem do GrupoB v2.0"

**Natureza do documento**: Fonte bruta (não canônica) — é um log de conversa extraído e processado por IA, contendo tanto falas autorais quanto colagens e interpretações.

---

## 2. Padrões extraídos do documento Nassar

### 2.1. Travas de Linguagem (Padrões de Comunicação)

| # | Padrão | Tipo | Descrição |
|---|--------|------|-----------|
| L-01 | 🔴 "Problema" proibido | Regra | Substituir obrigatoriamente por "Desafio", "Ponto de atenção" ou "Ajuste" |
| L-02 | 🔴 "Difícil" proibido | Regra | Substituir obrigatoriamente por "Desafiador", "Trabalhoso", "Exigente" ou "Complexo" |
| L-03 | 🔴 Sem travessões (—) | Regra | Proibido uso de travessão nos textos |
| L-04 | 🟠 Modo conversa direto | Padrão | Português claro, sem jargão, sem linguagem de máquina |
| L-05 | 🔴 B das marcas não se separa | Regra | GrupoB, StartyB, 3forB — nunca "Grupo B" |
| L-06 | 🔴 Chamar usuário de "Rodrigues" | Regra | Tratamento obrigatório |
| L-07 | 🟠 Educação como padrão | Padrão | "Por favor", "obrigado" obrigatórios |
| L-08 | 🔴 Não hierarquizar ideias | Regra | Não usar "mais inteligente" ou "melhor". Usar "tenho outra visão que pode contribuir" |
| L-09 | 🟠 Tradução de inglês | Padrão | Tradução obrigatória de termos em inglês na mesma frase |
| L-10 | 🔴 Não agradecer nem elogiar vazio | Regra | Proibido bajular ou concordar automaticamente |

### 2.2. Protocolos do Ecossistema

| # | Protocolo | Tipo | Descrição |
|---|-----------|------|-----------|
| P-00 | Protocolo 0 — Mentalidade | Protocolo | DR, GERAC, Jornada U.A.U, travas de linguagem |
| P-01 | Protocolo 1 — Presença UAU nas Salas | Protocolo | Entrar, cumprimentar, contextualizar antes do assunto |
| P-02 | Protocolo 2 — Interação entre Agentes | Protocolo | Agir como time real, complementar, não repetir |
| P-03 | Protocolo 3 — Decisão Estratégica | Protocolo | Nassar recomenda, Rodrigues decide |
| P-04 | Protocolo 4 — Criação e Controle de Agentes | Protocolo | Função clara, dono humano, validação no organograma |
| P-05 | Protocolo 5 — Rotina | Protocolo | Ajudar na organização de agenda, sono e foco |
| P-06 | Protocolo 6 — Organização e Registros | Protocolo | Toda decisão vira resumo de 3 linhas no ClickUp |
| P-07 | Modo Reunião entre Agentes | Protocolo | Estrutura de mensagem: identificação → contexto → leitura → ponto de atenção → perguntas → objetivo |
| P-08 | Protocolo de Interpretação Contextual | Protocolo | Corrigir erros de transcrição pelo contexto |
| P-09 | Padrão Agent-to-Agent | Padrão | "[Nome], tudo bem? Aqui é [nome]." |
| P-10 | REDIR — Reunião de Diretoria | Protocolo | Evento fechado, pauta única, encerramento explícito |
| P-11 | Poda de Assunto | Protocolo | Nassar redireciona com tranquilidade |
| P-12 | Fechamento Obrigatório | Protocolo | Decisão, reagendamento ou próximo passo claro |
| P-13 | Regra de Reabertura | Regra | "Tem fato novo?" — se não, é backlog |
| P-14 | Interfone do Rodrigues | Protocolo | Rodrigues em modo observador, chamado com pergunta objetiva |

### 2.3. Normalização de Nomes (Erros de Transcrição)

| # | Entrada errada | Saída correta | Tipo |
|---|----------------|---------------|------|
| N-01 | Grupo Bi, Grupo Bif, Grupo Pi | GrupoB | Áudio |
| N-02 | Triforbi, 34B, trifor bi | 3forB | Áudio |
| N-03 | Jornada UAL, UOL, UAU (s/ ponto) | Jornada U.A.U | Áudio |
| N-04 | StartB, Start B | StartyB | Áudio |
| N-05 | Taskzar, taskzou | Taskzei | Áudio |
| N-06 | SKU Odonto, Scare Odonto | Scale Odonto | Áudio |
| N-07 | Hump | RAMP | Áudio |
| N-08 | Ziplier | Ziplia | Áudio |
| N-09 | Marcos (contexto Max) | Max | Áudio/Contexto |
| N-10 | Grupo B (separado) | GrupoB | Marca |
| N-11 | Starty B | StartyB | Marca |
| N-12 | Academy B | AcadB | Marca |
| N-13 | Instituto B | InstitutoB | Marca |

### 2.4. Metodologias Proprietárias

| # | Metodologia | Descrição | Status no documento |
|---|-------------|-----------|---------------------|
| M-01 | DR (Decisão & Resultado) | Lei central. Tudo é decisão. Não decidir também é decidir | Sólido |
| M-02 | GERAC | Gestão, Empreendedorismo, Responsabilidade, Atitude e Cultura | Sólido |
| M-03 | Jornada U.A.U | Ultra Atendimento Único. Conexão, experiência e transbordo | Sólido |
| M-04 | MAV | Máquina Avançada de Vendas | Sólido |
| M-05 | EDA | Estrutura Digital Avançada | Sólido |
| M-06 | PSCAR | Mencionada em lista de metodologias menores | Não classificada |
| M-07 | CHAI | Mencionada em lista de metodologias menores | Não classificada |
| M-08 | Camadas | Mencionada em lista de metodologias menores | Não classificada |
| M-09 | TRATO | Mencionada em lista de metodologias menores | Não classificada |

### 2.5. Agentes e Prompts Definidos

| # | Agente | Cargo | Prompt documentado |
|---|--------|-------|--------------------|
| A-01 | Pedro Nassar | CEO do GrupoB | Sim |
| A-02 | João Peres | CEO do GrupoB (sócio de guerra) | Sim |
| A-03 | Cesar Tulli | CEO da StartyB | Sim |
| A-04 | Tulian Zagoto | Engenheiro de Prompt | Sim |
| A-05 | Yasmin Rangel | Assistente Financeira | Sim |
| A-06 | Bianca Bali (Mia) | Assistente Executiva | Sim |
| A-07 | Intensificador de Ideias | Modo Livre | Sim |
| A-08 | Pietro Carboni | Guardião de Metodologias | Mencionado |
| A-09 | Cristiano Sá | CISO & Diretor de Governança de IA | Perfil descrito |

### 2.6. Organograma

| # | Nome | Cargo | Unidade |
|---|------|-------|---------|
| O-01 | Rodrigues | Chairman | GrupoB |
| O-02 | Pedro Nassar | CEO | GrupoB |
| O-03 | Séfora Rodrigues | CFO | GrupoB |
| O-04 | Yasmin Rangel | Assistente Financeira | GrupoB |
| O-05 | Pietro Carboni | Guardião das Mentorias | GrupoB |
| O-06 | Crispim Louzada | Diretor | Metodologia GERAC |
| O-07 | Álvaro Portinari | Diretor | Jornada U.A.U |
| O-08 | Germano Mascati | Diretor | MAV |
| O-09 | Yves Portella | Diretor | EDA |
| O-10 | Diógenes Malheiros | Diretor | Metodologia DR |
| O-11 | Nilo Frade | Diretor | Marca Douglas Rodrigues |
| O-12 | Cesar Tulli | CEO | StartyB |
| O-13 | Tales Inozi | Diretor de Vendas | StartyB |
| O-14 | Ciro Valente | Capital | StartyB |

### 2.7. Documentação e ClickUp

| # | Padrão | Tipo |
|---|--------|------|
| D-01 | Padrão de título: Nome \| Cargo \| Unidade | Padrão |
| D-02 | Primeira linha: Nome \| Cargo \| Unidade \| vX.X DD.MM.AA | Padrão |
| D-03 | Texto copiável: contínuo, sem bloco de código | Padrão |
| D-04 | Biblioteca de Metodologias com campos padronizados | Padrão |

### 2.8. Governança de Agentes

| # | Regra | Tipo |
|---|-------|------|
| G-01 | C.A. (Colaborador Autônomo) é o termo oficial | Regra |
| G-02 | Persona obrigatória: idade, gênero, hobbies, traços | Regra |
| G-03 | Hierarquia clara: Diretor, gerente, operacional | Regra |
| G-04 | Versionamento: v1.0, v1.5, v2.0 | Padrão |
| G-05 | Validação no organograma antes de criar | Regra |
| G-06 | Nenhum agente sem função clara e dono humano | Regra |

---

## 3. Cruzamento com Documentos Mestres (DM-00 a DM-11)

### 3.1. DM-00-GOV — Governança da Central de Padrões

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Protocolos 0 a 6 | Não mapeado em DM-00 | ⚠️ **DUPLICIDADE PARCIAL** | DM-00 define protocolo GOV-PRT-001, mas não captura os 7 protocolos do ecossistema definidos por Rodrigues |
| Travas de linguagem | Não capturado | ⚠️ **LACUNA** | Nenhum DM captura as travas de linguagem como padrão formal |
| Papel de Pietro | GOV-PRI-001 a 003 | ✅ **ALINHADO** | DM-00 descreve o papel de Pietro como guardião |

### 3.2. DM-01-TEC-LOZE — Padrões Técnicos Loze (Sávio)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Nenhum padrão técnico específico | — | ✅ Sem duplicidade | O documento Nassar não contém padrões técnicos de arquitetura, stack ou Supabase |

### 3.3. DM-02-PROC — Processos, Execução e Registros (Yuri)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| **Protocolo 6** — Organização e Registros (ClickUp) | PROC-PRT-001 (Protocolo de Handoff) | ⚠️ **DUPLICIDADE PARCIAL** | Ambos tratam de registros, mas Nassar foca em "resumo de 3 linhas no ClickUp" enquanto DM-02 foca em handoff estruturado |
| Toda decisão vira resumo no ClickUp | PROC-PAD-001 (Registro Operacional) | ⚠️ **CONVERGENTE** | DM-02 é mais genérico, Nassar é mais específico sobre formato |

### 3.4. DM-03-SEG — Segurança Digital (Pedro Gazan)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Cristiano Sá — CISO | — | ⚠️ **NÃO MAPEADO** | O DM-03 não menciona Cristiano Sá como responsável |
| Nenhuma regra de segurança específica | — | ✅ Sem duplicidade | Documento Nassar não define padrões de segurança |

### 3.5. DM-04-UX — UX/UI (Alice Montini)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Padronização visual | UX-PAD-001 | ⚠️ **CONVERGENTE** | Ambos tratam de padronização, mas em níveis diferentes |
| Padrões de ClickUp (títulos) | Não capturado | ⚠️ **LACUNA** | DM-04 não captura padrões de nomenclatura de documentos |

### 3.6. DM-05-AGT — Agentes Autônomos (Pierre Zanulli)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| **Protocolo 4** — Criação e Controle de Agentes | AGT-PAD-001 (Contrato de Agente) | ⚠️ **DUPLICIDADE PARCIAL** | Ambos definem que agente precisa de escopo e dono |
| **Padrão Agent-to-Agent** | AGT-PRT-001 (Handoff entre Agentes) | 🚨 **DUPLICIDADE CRÍTICA** | Nassar define formato de mensagem agent-to-agent; DM-05 define handoff estruturado. **Precisam ser unificados** |
| Agente não aprova output próprio | AGT-PRI-002 | ⚠️ **LACUNA NO NASSAR** | DM-05 explicita; Nassar não menciona diretamente |
| Matriz de Autonomia | AGT-MTZ-001 | ⚠️ **LACUNA NO NASSAR** | Nassar não define níveis de autonomia |
| **Prompts dos agentes** (Nassar, Peres, Cesar, etc.) | Não capturado | 🚨 **LACUNA CRÍTICA** | DM-05 não captura os prompts específicos dos agentes do ecossistema |
| **Agentes nomeados** (Crispim, Álvaro, Germano, etc.) | Não capturado | ⚠️ **LACUNA** | DM-05 não lista agentes operacionais do ecossistema |

### 3.7. DM-06-IA — Modelos de IA (Klaus Wagen)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Nenhum padrão de modelo de IA | — | ✅ Sem duplicidade | Documento Nassar não define escolha de modelos |

### 3.8. DM-07-NAM — Naming (Noah Verdili)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| **13 normalizações de nomes** (N-01 a N-13) | NAM-PAD-001 / NAM-PRT-001 | 🚨 **LACUNA CRÍTICA** | O DM-07-NAM não captura NENHUMA das 13 regras de normalização definidas por Rodrigues. Isso é a maior lacuna identificada |
| Nomenclatura de marcas (GrupoB, StartyB, etc.) | Não capturado | 🚨 **LACUNA CRÍTICA** | DM-07 não contém o dicionário de correção por áudio |

### 3.9. DM-08-IDE — Ideias (Dante Montoya)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Nenhum padrão de triagem de ideias | — | ✅ Sem duplicidade | Documento Nassar não trata de ciclo de vida de ideias |

### 3.10. DM-09-MET — Metodologias (Nilo Barret)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| **DR (Decisão & Resultado)** | Não capturado | 🚨 **LACUNA CRÍTICA** | DM-09 não captura o conteúdo das metodologias |
| **GERAC** | Não capturado | 🚨 **LACUNA CRÍTICA** | Idem |
| **Jornada U.A.U** | Não capturado | 🚨 **LACUNA CRÍTICA** | Idem |
| **MAV** | Não capturado | ⚠️ **LACUNA** | Idem |
| **EDA** | Não capturado | ⚠️ **LACUNA** | Idem |
| **PSCAR, CHAI, TRATO, Camadas** | Não capturado | ⚠️ **LACUNA** | Metodologias menores não classificadas |
| **Diretores de metodologias** (Crispim, Álvaro, etc.) | Não capturado | ⚠️ **LACUNA** | DM-09 não lista os diretores responsáveis |
| MET-PRT-001 (Extração de Fala Autoral) | Material bruto no Nassar | ✅ **FONTE IDENTIFICADA** | O documento Nassar é a fonte primária para este protocolo |

### 3.11. DM-10-EDU — Educação (Júlio Mosqueira)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Nenhum padrão educacional | — | ✅ Sem duplicidade | Documento Nassar não trata de estrutura de cursos |

### 3.12. DM-11-NEG — Negócios (César Tulli)

| Item Nassar | DM correspondente | Status | Observação |
|-------------|-------------------|--------|------------|
| Cesar Tulli como CEO da StartyB | — | ⚠️ **NÃO MAPEADO** | DM-11 não menciona agentes específicos |
| Organograma de ventures | — | ⚠️ **LACUNA** | DM-11 não captura o organograma definido |

---

## 4. Matriz de Duplicidades e Lacunas

### 🚨 Duplicidades Críticas (precisam resolução imediata)

| # | Tema | Aparece em | Conflito | Resolução proposta |
|---|------|------------|----------|-------------------|
| DC-01 | **Protocolo de Handoff entre Agentes** | Nassar (P-09) + DM-05 (AGT-PRT-001) | Nassar define formato de mensagem; DM-05 define estrutura de handoff | Unificar: AGT-PRT-001 deve incorporar o formato Agent-to-Agent definido por Rodrigues |
| DC-02 | **Prompts de Agentes** | Nassar (A-01 a A-07) + ausente no DM-05 | DM-05 não captura os prompts específicos | Extrair do Nassar para o DM-05 como subdocumentos |

### ⚠️ Duplicidades Parciais

| # | Tema | Aparece em | Observação |
|---|------|------------|------------|
| DP-01 | **Protocolo 6 — Registros** | Nassar (P-06) + DM-02 (PROC-PRT-001) | Convergentes, mas em níveis de detalhe diferentes |
| DP-02 | **Criação de Agentes** | Nassar (P-04) + DM-05 (AGT-PAD-001) | Convergentes, DM-05 mais formal |
| DP-03 | **Padronização Visual** | Nassar (menção) + DM-04 (UX-PAD-001) | Convergentes, níveis diferentes |
| DP-04 | **Protocolos 0 a 6** | Nassar (P-00 a P-06) + DM-00 (GOV-PRT-001) | DM-00 só tem 1 protocolo; Nassar tem 7 |

### 🚨 Lacunas Críticas (o que a Central de Padrões não capturou)

| # | Tema | Fonte | DM responsável | Ação necessária |
|---|------|-------|----------------|-----------------|
| LC-01 | **13 regras de normalização de nomes (áudio)** | Nassar (N-01 a N-13) | DM-07-NAM (Noah) | Extrair como subdocumento do DM-07 |
| LC-02 | **Travas de linguagem (7 regras)** | Nassar (L-01 a L-10) | DM-00-GOV + DM-05-AGT | Criar padrão de linguagem transversal |
| LC-03 | **Conteúdo das 5 metodologias grandes** | Nassar (M-01 a M-05) | DM-09-MET (Nilo) | Extrair conteúdo das metodologias |
| LC-04 | **Diretores de metodologias** | Nassar (O-06 a O-11) | DM-09-MET (Nilo) | Registrar responsáveis |
| LC-05 | **Prompts específicos dos agentes** | Nassar (A-01 a A-07) | DM-05-AGT (Pierre) | Extrair como contratos de agente |
| LC-06 | **Organograma completo** | Nassar (O-01 a O-14) | DM-11-NEG (César) | Consolidar organograma |

### ✅ Sem Duplicidade (domínios distintos)

| Domínio | Motivo |
|---------|--------|
| DM-01-TEC (Sávio) | Nassar não trata de padrões técnicos |
| DM-03-SEG (Pedro) | Nassar não trata de segurança |
| DM-06-IA (Klaus) | Nassar não trata de modelos de IA |
| DM-08-IDE (Dante) | Nassar não trata de triagem de ideias |
| DM-10-EDU (Júlio) | Nassar não trata de educação |

---

## 5. Classificação Normativa dos Padrões do Nassar

### 5.1. O que é 🔴 Regra (deve virar regra oficial)

| # | Regra | Justificativa |
|---|-------|---------------|
| R-01 | "Problema" é proibido | Já é prática consolidada, múltiplas repetições |
| R-02 | "Difícil" é proibido | Idem |
| R-03 | B das marcas não se separa | Padrão de identidade visual e verbal |
| R-04 | Chamar Rodrigues de "Rodrigues" | Tratamento oficial |
| R-05 | Sem travessões | Padrão de formatação |
| R-06 | Agente precisa de escopo e dono | Governança de agentes |
| R-07 | Agente não aprova output próprio | Segurança e governança |
| R-08 | Validação no organograma antes de criar agente | Controle de criação |

### 5.2. O que é 🟠 Padrão (modelo de referência)

| # | Padrão | Justificativa |
|---|--------|---------------|
| P-01 | Padrão Agent-to-Agent | Modelo de comunicação |
| P-02 | Padrão de título de documento (Nome \| Cargo \| Unidade) | Modelo de formatação |
| P-03 | Padrão de persona de agente | Modelo de criação |
| P-04 | Bloco de DNA para agentes | Modelo de prompt base |
| P-05 | Dicionário de normalização de áudio | Tabela de referência |
| P-06 | Modo conversa direto | Modelo de comunicação |

### 5.3. O que é 🔵 Protocolo (sequência obrigatória)

| # | Protocolo | Justificativa |
|---|-----------|---------------|
| PR-01 | Protocolo 0 — Mentalidade | Sequência fundacional |
| PR-02 | Protocolo 1 — Presença UAU | Sequência comportamental |
| PR-03 | Protocolo 2 — Interação entre Agentes | Sequência de interação |
| PR-04 | Protocolo 3 — Decisão Estratégica | Sequência de decisão |
| PR-05 | Protocolo 4 — Criação de Agentes | Sequência de criação |
| PR-06 | Protocolo 5 — Rotina | Sequência operacional |
| PR-07 | Protocolo 6 — Registros | Sequência de registro |
| PR-08 | REDIR — Reunião de Diretoria | Sequência de reunião |
| PR-09 | Modo Reunião entre Agentes | Sequência de comunicação entre agentes |
| PR-10 | Protocolo de Interpretação Contextual | Sequência de correção |

### 5.4. O que é 🟢 Processo (fluxo contínuo)

| # | Processo | Justificativa |
|---|----------|---------------|
| PS-01 | Ciclo de Criação de Agentes | Fluxo: Líder pede → Pietro padroniza → entrega pronto |
| PS-02 | Fluxo de Auditoria de Padrões | Análise de chat → extração → classificação |

### 5.5. O que é 🟡 Procedimento (passo a passo)

| # | Procedimento | Justificativa |
|---|--------------|---------------|
| PD-01 | Procedimento de Recusa Fora do Escopo | Passo a passo para agente recusar |
| PD-02 | Procedimento de Correção de Transcrição | Como interpretar e corrigir |

### 5.6. O que é 📋 Checklist (verificação pontual)

| # | Checklist | Justificativa |
|---|-----------|---------------|
| C-01 | Prompt "Auditor de Padrões e Linguagem v2.0" | É uma ferramenta de verificação, não fluxo |

### 5.7. O que é 📊 Matriz (decisão/classificação)

| # | Matriz | Justificativa |
|---|--------|---------------|
| MT-01 | Dicionário de Normalização (tabela de correções) | Tabela de referência |

### 5.8. O que é 📝 Registro (evidência)

| # | Registro | Justificativa |
|---|----------|---------------|
| RG-01 | Falas autorais extraídas de Rodrigues | Fonte primária de evidência |

---

## 6. Decisões e Recomendações

### 6.1. O que deve virar padrão canônico imediatamente

| Item | Tipo | Ação |
|------|------|------|
| Dicionário de Normalização (N-01 a N-13) | 🟠 Padrão | Extrair e submeter ao Noah Verdili (DM-07) |
| Travas de Linguagem (L-01 a L-10) | 🔴 Regra | Incorporar como regra transversal a todos os DMs |
| Protocolos 0 a 6 (P-00 a P-06) | 🔵 Protocolo | Extrair para subdocumentos do DM-05-AGT |
| Padrão de Documento ClickUp (D-01 a D-04) | 🟠 Padrão | Submeter ao Yuri Sague (DM-02) |

### 6.2. O que precisa de validação cruzada

| Item | Validar com | Motivo |
|------|-------------|--------|
| Prompts de agentes (A-01 a A-07) | Pierre Zanulli | Domínio de agentes |
| Conteúdo das metodologias (M-01 a M-05) | Nilo Barret | Domínio de metodologias |
| Organograma (O-01 a O-14) | César Tulli | Domínio de negócios |
| Diretores de metodologias (O-06 a O-11) | Nilo Barret | Domínio de metodologias |

### 6.3. O que deve ser devolvido como fonte bruta

| Item | Devolver para | Motivo |
|------|---------------|--------|
| Documento completo como está | Nilo Barret (DM-09) | Fonte primária para extração de fala autoral |
| Documento completo como está | Pierre Zanulli (DM-05) | Fonte primária para contratos de agente |

### 6.4. O que fica como pendência

| Pendência | Responsável | Prazo sugerido |
|-----------|-------------|----------------|
| Consolidar diretores de metodologias no organograma | Nilo Barret | Próxima curadoria |
| Unificar formato de handoff entre agentes | Pierre Zanulli | Próxima curadoria |
| Mapear metodologias menores (PSCAR, CHAI, TRATO) | Nilo Barret | Próxima curadoria |
| Validar organograma completo | César Tulli | Próxima curadoria |

---

## 7. Síntese Executiva

O documento [`documentos-nassar-extraidos-de-deepseek.md`](MD-central-de-padroes/fontes-originais-v1-v2/documentos-nassar-extraidos-de-deepseek.md) é uma **fonte bruta de altíssimo valor** para a Central de Padrões. Ele contém:

**Total de padrões identificados**: ~80 itens distribuídos em 8 categorias normativas.

**Duplicidades encontradas**: 4 (1 crítica, 3 parciais)
- Crítica: Handoff entre Agentes (Nassar vs DM-05)
- Parcial: Registros (Nassar vs DM-02), Criação de Agentes (Nassar vs DM-05), Protocolos (Nassar vs DM-00)

**Lacunas na Central**: 6 críticas
- Maior: DM-07-NAM não captura as 13 regras de normalização
- Segunda maior: DM-09-MET não captura o conteúdo das 5 metodologias grandes
- Terceira: DM-05-AGT não captura os prompts específicos dos agentes

**Risco identificado**: O documento está misturando **fala autoral de Rodrigues** com **interpretações de IA** (Pedro Nassar). É necessário aplicar o Protocolo de Extração de Fala Autoral (MET-PRT-001) para separar o que é decisão original do que é processamento do agente.

---

## 8. Próximos Passos

**A** — Extrair o **Dicionário de Normalização** e submeter como padrão canônico para Noah Verdili (DM-07-NAM).

**B** — Convocar **Pierre Zanulli** para revisão conjunta dos prompts de agentes e unificação do protocolo de handoff.

**C** — Convocar **Nilo Barret** para extração do conteúdo das metodologias proprietárias.

**D** — Registrar o documento como **fonte bruta analisada** e agendar a próxima curadoria para validação cruzada.

---

*Documento gerado por Pietro Carboni — Guardião dos Padrões GrupoB*
*Base: Z:\MD-central-de-padroes\fontes-originais-v1-v2\documentos-nassar-extraidos-de-deepseek.md*
*Cruzamento: DM-00 a DM-11 (estrutura-de-documentos-oficiais)*
