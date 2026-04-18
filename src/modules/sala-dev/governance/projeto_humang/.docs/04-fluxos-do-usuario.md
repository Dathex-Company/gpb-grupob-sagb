# 04 - Fluxos do Usuário - HumanG

## Visão Geral
Este documento descreve as jornadas de usuário, fluxos principais do sistema e experiências chave para o MVP do HumanG - Sistema de Seleção Inteligente B2B. Baseado nas personas definidas no PRD (.docs/02-prd-inicial.md) e na arquitetura técnica (.specs/02-estrutura-tecnica.md).

---

## Personas Principais

### Persona 1: Carlos (Líder de Crescimento)
**Perfil:** Gerente de Pessoas em startup scale-up, focado em eficiência operacional
**Objetivos no HumanG:**
- Reduzir tempo de contratação de semanas para dias
- Aumentar qualidade das contratações técnicas
- Automatizar triagem inicial de currículos
- Manter visibilidade total do pipeline de recrutamento

**Dores específicas:**
- Perda de tempo com triagem manual
- Dificuldade em comparar candidatos objetivamente
- Falta de padronização no processo de seleção
- Comunicação fragmentada com candidatos

### Persona 2: Ana (Fundadora Consciente)
**Perfil:** Fundadora de empresa em crescimento, com foco em cultura e fit cultural
**Objetivos no HumanG:**
- Garantir alinhamento cultural nas contratações
- Preservar experiência positiva do candidato
- Manter controle estratégico sobre contratações chave
- Escalar processo de seleção mantendo qualidade

**Dores específicas:**
- Medo de contratar pessoas que não se encaixem na cultura
- Preocupação com experiência negativa do candidato
- Necessidade de envolvimento em decisões estratégicas
- Falta de tempo para processos extensos

---

## Jornadas Principais

### Jornada 1: Contratação de Vaga Técnica (Carlos)

#### Fase 1: Preparação (Pré-HumanG)
1. **Definição da Vaga**
   - Carlos cria descrição da vaga com requisitos técnicos
   - Define orçamento e prazo de contratação
   - Estabelece critérios de avaliação

2. **Publicação da Vaga**
   - Publica em múltiplas plataformas (LinkedIn, GitHub, etc.)
   - Define processo de recebimento de currículos

#### Fase 2: Recebimento e Triagem (HumanG - Automatizado)
3. **Recebimento Massivo**
   - Candidatos enviam currículos através de múltiplos canais
   - Sistema consolida tudo em um único pipeline

4. **Triagem Automática (Core do HumanG)**
   - Análise automática de compatibilidade técnica
   - Score inicial baseado em requisitos da vaga
   - Filtro de candidatos qualificados vs. desqualificados

5. **Revisão Curatorial (Carlos)**
   - Carlos revisa lista de qualificados
   - Ajusta scores manualmente se necessário
   - Seleciona candidatos para próxima fase

#### Fase 3: Engajamento e Avaliação
6. **Contato Inicial**
   - Sistema envia emails automatizados para candidatos selecionados
   - Agenda entrevistas iniciais
   - Coleta disponibilidade dos candidatos

7. **Entrevista Técnica**
   - Carlos conduz entrevista focada em habilidades técnicas
   - Registra avaliações no sistema
   - Atualiza status do candidato

8. **Avaliação Cultural (com Ana)**
   - Para cargos estratégicos, Ana participa da avaliação cultural
   - Sistema registra avaliação de fit cultural
   - Score combinado (técnico + cultural)

#### Fase 4: Decisão e Onboarding
9. **Decisão Final**
   - Sistema apresenta candidatos ranqueados
   - Carlos e Ana discutem e tomam decisão
   - Status atualizado para "Aprovado" ou "Reprovado"

10. **Comunicação e Banco de Talentos**
    - Sistema notifica candidatos selecionados
    - Candidatos reprovados com feedback entram no banco de talentos
    - Dados preservados para futuras oportunidades

### Jornada 2: Avaliação de Fit Cultural (Ana)

#### Fase 1: Definição de Critérios Culturais
1. **Configuração de Perfil Cultural**
   - Ana define valores e comportamentos desejados
   - Sistema aprende com decisões passadas
   - Cria modelo de avaliação cultural

#### Fase 2: Avaliação em Tempo Real
2. **Monitoramento de Interações**
   - Sistema analisa comunicação durante o processo
   - Avalia alinhamento com valores da empresa
   - Gera alertas de possível desalinhamento

3. **Avaliação Proativa**
   - Ana recebe relatórios de fit cultural
   - Pode intervir em momentos-chave
   - Sistema sugere perguntas específicas para entrevista

#### Fase 3: Decisão com Base em Dados
4. **Dashboard Cultural**
   - Visualização clara do fit cultural por candidato
   - Comparativo com contratações bem-sucedidas
   - Insights para melhoria do processo

---

## Fluxos Principais do Sistema

### Fluxo 1: Pipeline de Candidatos

```
Recebimento → Triagem Automática → Revisão Humana → Contato → Entrevista → Análise → Decisão → Reaproveitamento
```

**Estados do Pipeline:**
1. **Recebido** - Currículo recebido, aguardando processamento
2. **Processando** - Em análise automática pelo sistema
3. **Qualificado** - Passou na triagem automática
4. **Revisão Pendente** - Aguardando revisão do recrutador
5. **Contatado** - Contato inicial enviado
6. **Agendado** - Entrevista agendada
7. **Entrevistado** - Entrevista concluída
8. **Em Análise** - Avaliação em andamento
9. **Aprovado** - Selecionado para contratação
10. **Reprovado** - Não selecionado
11. **Banco de Talentos** - Armazenado para futuras oportunidades
12. **Arquivado** - Processo finalizado

### Fluxo 2: Triagem Automática

```
1. Extração de Dados
   │
   ├── Análise de Formação
   ├── Experiência Relevante  
   ├── Habilidades Técnicas
   ├── Projetos e Portfólio
   └── Compatibilidade Cultural (se disponível)
   │
2. Score de Compatibilidade
   │
3. Classificação
   │
   ├── Alta Prioridade (Score > 80)
   ├── Média Prioridade (Score 60-80)
   └── Baixa Prioridade (Score < 60)
```

### Fluxo 3: Processo de Decisão Colaborativa

```
1. Dashboard de Candidatos
   │
2. Filtros e Ordenação
   │
3. Visualização Detalhada
   │
4. Discussão em Equipe
   │
5. Votação/Consenso
   │
6. Decisão Registrada
   │
7. Notificações Automáticas
```

### Fluxo 4: Banco de Talentos e Reaproveitamento

```
1. Candidato Reprovado
   │
2. Análise de Potencial Futuro
   │
3. Categorização por Skills
   │
4. Armazenamento com Metadados
   │
5. Match Automático com Novas Vagas
   │
6. Notificação Proativa
```

---

## Módulos do Sistema e Interações

### Módulo Principal: Dashboard de Recrutamento
**Função:** Visão central do pipeline de contratação
**Usuários Principais:** Carlos
**Interações:**
- Visualização em tempo real do pipeline
- Filtros avançados por status, vaga, score
- Ações rápidas (contatar, agendar, reprovar)
- Métricas e KPIs

### Módulo: Gestão de Vagas
**Função:** Criação e gestão de posições abertas
**Usuários Principais:** Carlos, Ana
**Interações:**
- Criação de novas vagas com critérios detalhados
- Template de descrições
- Configuração de processo de seleção
- Acompanhamento de múltiplas vagas simultâneas

### Módulo: Perfil do Candidato
**Função:** Visualização detalhada de cada candidato
**Usuários Principais:** Carlos, Ana
**Interações:**
- Histórico completo de interações
- Avaliações técnicas e culturais
- Documentos e portfólio
- Timeline do processo

### Módulo: Banco de Talentos
**Função:** Gestão de candidatos para oportunidades futuras
**Usuários Principais:** Carlos
**Interações:**
- Busca por skills específicas
- Match automático com novas vagas
- Segmentação por categorias
- Renovação de consentimento LGPD

### Módulo: Configurações e Analytics
**Função:** Personalização e análise do sistema
**Usuários Principais:** Carlos (config), Ana (analytics)
**Interações:**
- Configuração de templates de comunicação
- Definição de critérios de avaliação
- Dashboard de métricas de contratação
- Relatórios de eficácia do processo

---

## Estados e Transições Críticas

### Estado 1: Decisão Pendente
**Quando ocorre:** Após entrevista concluída
**Ações possíveis:**
- → Aprovar (com justificativa)
- → Reprovar (com feedback)
- → Solicitar nova entrevista
- → Adicionar ao banco de talentos

**Regras de negócio:**
- Prazo máximo: 72 horas após última entrevista
- Requer pelo menos uma avaliação registrada
- Notificação automática após 48 horas de inatividade

### Estado 2: Consentimento LGPD Expirado
**Quando ocorre:** 12 meses após último contato
**Ações possíveis:**
- → Renovar consentimento (contatar candidato)
- → Arquivar permanentemente
- → Anonimizar dados

**Regras de negócio:**
- Bloqueio automático de novas ações
- Alerta para equipe de recrutamento
- Processo automático após 30 dias de expiração

### Estado 3: Match com Nova Vaga
**Quando ocorre:** Candidato no banco de talentos corresponde a nova vaga
**Ações possíveis:**
- → Notificar recrutador
- → Contatar candidato automaticamente
- → Ignorar match

**Regras de negócio:**
- Score mínimo de 70% para match automático
- Notificação apenas em horário comercial
- Respeitar preferências do candidato

---

## Experiência do MVP - Princípios de Design

### 1. Clareza sobre Automação
**Princípio:** Usuário sempre sabe o que é automático vs. manual
**Implementação:**
- Badges claros indicando "Automático" ou "Revisão Humana"
- Timeline mostrando todas as ações do sistema
- Explicação simples dos scores e algoritmos

### 2. Controle Humano no Loop
**Princípio:** Automação assiste, não substitui decisão humana
**Implementação:**
- Override fácil de qualquer decisão automática
- Justificativa obrigatória para override
- Histórico completo de decisões humanas vs. automáticas

### 3. Feedback Construtivo
**Princípio:** Todo reprovado recebe razão clara (quando possível)
**Implementação:**
- Templates de feedback personalizáveis
- Diferenciação entre feedback técnico e cultural
- Opção de não fornecer feedback (conforme LGPD)

### 4. Transparência do Processo
**Princípio:** Candidato sabe onde está no pipeline
**Implementação:**
- Portal do candidato com status atual
- Notificações automáticas em mudanças de status
- Tempo médio por etapa visível

### 5. Eficiência sem Frieza
**Princípio:** Automatizar tarefas repetitivas, humanizar interações
**Implementação:**
- Comunicação automática com toque pessoal (nome, detalhes específicos)
- Espaço para personalização de mensagens
- Lembrete para interações humanas em momentos-chave

---

## Riscos de Experiência Identificados

### Risco 1: Desumanização do Processo
**Mitigação:**
- Manuir interações humanas em pontos críticos (entrevistas, decisão final)
- Comunicação sempre com opção de resposta humana
- Feedback personalizado quando possível

### Risco 2: Over-reliance no Score Automático
**Mitigação:**
- Educação clara sobre limitações do algoritmo
- Destaque para fatores que o sistema não avalia (soft skills, potencial)
- Facilidade para ajustar scores manualmente

### Risco 3: Complexidade para Usuário Inicial
**Mitigação:**
- Onboarding guiado passo a passo
- Dashboard simplificado como padrão
- Modo avançado opcional
- Tutoriais contextuais

### Risco 4: Experiência Negativa do Candidato
**Mitigação:**
- Status sempre atualizado no portal do candidato
- Tempo máximo para cada etapa
- Comunicação clara sobre prazos
- Canal de sucesso para dúvidas

---

## Próximos Passos para Refinamento

### Fase 1: Validação de Jornadas (Pós-MVP)
1. Teste de usabilidade com recrutadores reais
2. Ajuste de fluxos baseado em feedback
3. Refinamento de templates de comunicação

### Fase 2: Expansão de Funcionalidades
1. Integração com mais fontes de currículos
2. Análise avançada de fit cultural
3. Ferramentas colaborativas para decisão em equipe

### Fase 3: Personalização Avançada
1. Machine learning adaptativo por empresa
2. Workflows customizáveis
3. API para integração com outros sistemas de RH

---

## Relação com Outros Documentos

### Documentos de Entrada:
- `.docs/01-visao-produto.md` - Visão geral do produto
- `.docs/02-prd-inicial.md` - Personas e requisitos funcionais
- `.specs/01-entidades-e-dados.md` - Modelo de dados para telas
- `.specs/02-estrutura-tecnica.md` - Base para módulos e navegação

### Documentos de Saída:
- `.specs/03-mapa-de-telas.md` - Detalhamento de telas e navegação
- `.tasks/01-quebra-de-tarefas.md` - Tarefas de implementação de frontend

---

## Considerações Finais

As jornadas e fluxos descritos representam a experiência do MVP do HumanG, equilibrando automação inteligente com toque humano. O foco está em resolver as dores reais de Carlos (eficiência) e Ana (qualidade cultural) enquanto mantém uma experiência positiva para os candidatos.

A arquitetura modular permite evolução gradual, com o dashboard de recrutamento como centro da experiência e módulos especializados que podem ser ativados conforme necessidade.

**Próxima etapa:** Detalhar o mapa de telas (.specs/03-mapa-de-telas.md) com wireframes funcionais e especificações de navegação.

---

*Documento gerado pelo UX and Flow Designer (ET-04) como parte do fluxo multiagentes do Projeto HumanG.*
*Última atualização: [DATA DA GERAÇÃO]*
*Baseado em: .docs/01-visao-produto.md, .docs/02-prd-inicial.md, .specs/01-entidades-e-dados.md, .specs/02-estrutura-tecnica.md*