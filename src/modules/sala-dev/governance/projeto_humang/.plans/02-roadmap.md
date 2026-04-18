# 02. Roadmap do Projeto - HumanG (MVP Supabase + Netlify)

## Visão Geral
Este roadmap define o plano de implementação de 12 semanas para o MVP do HumanG, baseado no backlog priorizado (.plans/01-backlog.md) e na arquitetura Supabase + Netlify (.docs/03-arquitetura-sistema.md).

## Princípios do Roadmap
1. **MVP First:** Foco nas funcionalidades essenciais para validação de mercado
2. **Iterações Curtas:** Sprints de 2 semanas com entregas tangíveis
3. **Feedback Contínuo:** Validar com usuários reais a cada milestone
4. **Stack Otimizada:** Aproveitar ao máximo Supabase + Netlify para velocidade
5. **Qualidade Sustentável:** Manter padrões de código desde o início

## Equipe e Capacidade
**Time MVP (Fase Inicial):**
- 1 Frontend Engineer (React/TypeScript)
- 1 Full-stack Engineer (Supabase + Integrações)
- 1 Product Designer (UX/UI - parte time)

**Capacidade por Sprint (2 semanas):**
- 4-6 features de backlog (dependendo da complexidade)
- 1-2 dias para bug fixes e refinamentos
- 1 dia para planning e retrospectiva

## Roadmap de 12 Semanas

### Sprint 0: Setup e Fundação (Semana 0-1)

**Objetivo:** Configurar ambiente de desenvolvimento e infraestrutura básica

**Tarefas Técnicas:**
- [ ] Setup projeto React/TypeScript com Vite
- [ ] Configurar Supabase project (PostgreSQL, Auth, Storage)
- [ ] Configurar Netlify deploy (CI/CD, environment variables)
- [ ] Configurar ESLint, Prettier, TypeScript strict
- [ ] Setup React Query + Zustand para gerenciamento de estado
- [ ] Configurar Tailwind CSS + sistema de design
- [ ] Criar estrutura inicial de pastas conforme arquitetura

**Entregáveis:**
- Projeto inicial deployado em Netlify Preview
- Supabase project configurado com auth básico
- Ambiente de desenvolvimento pronto para toda a equipe
- Guias de contribuição e padrões de código

**Critérios de Sucesso:**
- Deploy automático funcionando (git push → Netlify)
- Login básico funcionando com Supabase Auth
- Build local sem erros de TypeScript
- Performance inicial (Lighthouse score > 90)

---

### Sprint 1: Autenticação e Core Empresarial (Semanas 2-3)

**Objetivo:** Sistema de autenticação e gestão básica de empresas

**Features do Backlog:**
- **A1 - Autenticação com Supabase Auth** (3-5 dias)
- **A2 - Perfil da Empresa** (2-3 dias)
- **A3 - Gestão de Usuários da Empresa** (3-4 dias)

**Tarefas Técnicas:**
- Implementar fluxo completo de login/logout
- Criar páginas de registro e recuperação de senha
- Desenvolver formulário de cadastro da empresa
- Implementar sistema de convite de usuários
- Criar middleware de autenticação para rotas protegidas
- Desenvolver componente de header com usuário logado

**Entregáveis:**
- Sistema de autenticação completo
- Páginas: Login, Registro, Recuperação de Senha
- Dashboard inicial (após login)
- Gestão básica de perfil da empresa
- Sistema de convites de usuários

**Milestone: MVP Alpha - Auth + Empresa**
- Primeira empresa pode se registrar e convitar usuários
- Sistema básico de permissões funcionando
- Deploy em ambiente de staging

---

### Sprint 2: Gestão de Vagas (Semanas 4-5)

**Objetivo:** Sistema completo de criação e gestão de vagas

**Features do Backlog:**
- **B1 - Criação e Edição de Vagas** (2-3 dias)
- **B2 - Listagem de Vagas Ativas** (2-3 dias)
- **F1 - Dashboard de Métricas Básicas** (parte inicial)

**Tarefas Técnicas:**
- Desenvolver formulário completo de criação de vaga
- Implementar CRUD de vagas (Create, Read, Update, Delete/Archive)
- Criar dashboard de vagas com cards e filtros
- Desenvolver página de detalhe da vaga
- Implementar métricas básicas no dashboard
- Criar sistema de status de vagas (aberta, pausada, fechada)

**Entregáveis:**
- Formulário de criação/edição de vagas
- Dashboard com lista de vagas ativas
- Página de detalhe da vaga
- Sistema de arquivamento/pausa de vagas
- Métricas básicas (contadores) no dashboard

**Milestone: MVP Beta - Vagas Funcionais**
- Empresa pode criar e gerenciar vagas
- Dashboard com visão geral do recrutamento
- Fluxo básico de gestão de vagas completo

---

### Sprint 3: Upload e Processamento de Candidatos (Semanas 6-7)

**Objetivo:** Sistema de recebimento e análise inicial de candidatos

**Features do Backlog:**
- **C1 - Upload e Processamento de Currículos** (3-5 dias)
- **C2 - Score Técnico Automático (MVP Básico)** (4-5 dias)
- **C3 - Perfil Detalhado do Candidato** (3-4 dias)

**Tarefas Técnicas:**
- Implementar upload de arquivos para Supabase Storage
- Desenvolver parser básico de currículos (PDF/DOC)
- Criar algoritmo de score técnico (keywords match)
- Desenvolver página de perfil completo do candidato
- Implementar timeline de interações
- Criar sistema de tags e categorização automática
- Desenvolver interface para revisão humana de scores

**Entregáveis:**
- Upload de currículos funcional
- Score técnico automático básico
- Página de perfil do candidato
- Timeline de atividades
- Sistema de classificação (alta/média/baixa prioridade)

**Milestone: MVP Gamma - Pipeline de Candidatos**
- Upload e processamento de currículos funcionando
- Score automático básico gerando classificações
- Perfil de candidato com todas informações relevantes
- Primeiro teste end-to-end (vaga → upload → score)

---

### Sprint 4: Pipeline Visual e Gestão (Semanas 8-9)

**Objetivo:** Sistema visual de pipeline e gestão do fluxo de candidatos

**Features do Backlog:**
- **B3 - Pipeline Visual da Vaga (Kanban)** (4-6 dias)
- **D2 - Formulário de Avaliação de Entrevista** (2-3 dias)
- **E1 - Sistema Básico de Banco de Talentos** (3-4 dias)

**Tarefas Técnicas:**
- Implementar pipeline kanban com drag & drop
- Desenvolver sistema de movimentação entre etapas
- Criar formulário de avaliação pós-entrevista
- Implementar banco de talentos básico
- Desenvolver filtros avançados para banco de talentos
- Criar sistema de tags e categorização manual
- Implementar busca por skills no banco de talentos

**Entregáveis:**
- Pipeline visual kanban funcional
- Formulário de avaliação de entrevista
- Banco de talentos com listagem e filtros
- Sistema de movimentação de candidatos entre etapas
- Histórico completo de avaliações

**Milestone: MVP Delta - Pipeline Completo**
- Pipeline visual funcionando com drag & drop
- Sistema de avaliação de entrevistas implementado
- Banco de talentos básico operacional
- Fluxo completo: vaga → upload → pipeline → avaliação

---

### Sprint 5: Entrevistas e Decisão Assistida (Semanas 10-11)

**Objetivo:** Sistema de agendamento e decisão final

**Features do Backlog:**
- **D1 - Agendamento de Entrevistas** (5-7 dias)
- **D3 - Sistema de Decisão Assistida** (3-5 dias)
- **G1 - Templates de Comunicação** (parte inicial)

**Tarefas Técnicas:**
- Integrar Google Calendar API para agendamento
- Implementar sistema de slots de disponibilidade
- Desenvolver dashboard comparativo para decisão
- Criar sistema de recomendação (verde/amarelo/vermelho)
- Implementar templates básicos de email
- Desenvolver sistema de notificações por email
- Criar confirmação de entrevista automática

**Entregáveis:**
- Agendamento de entrevistas com Google Calendar
- Dashboard comparativo de candidatos
- Sistema de recomendação para decisão
- Templates básicos de comunicação
- Notificações automáticas por email

**Milestone: MVP Épsilon - Processo Completo**
- Agendamento de entrevistas integrado
- Sistema de decisão assistida funcionando
- Comunicação automática com candidatos
- Processo end-to-end completo operacional

---

### Sprint 6: Polimento e Lançamento (Semanas 12-13)

**Objetivo:** Refinamento, testes e preparação para lançamento

**Features do Backlog:**
- **F2 - Relatórios de Performance** (4-5 dias)
- **E2 - Match Automático com Novas Vagas** (4-6 dias)
- **G2 - Configurações de LGPD** (3-4 dias)

**Tarefas Técnicas:**
- Desenvolver relatórios avançados de performance
- Implementar algoritmo de match automático
- Criar sistema de configurações de LGPD
- Realizar testes de carga e performance
- Otimizar para mobile e acessibilidade
- Implementar analytics básico (Mixpanel/Amplitude)
- Criar documentação de usuário final
- Preparar material de onboarding

**Entregáveis:**
- Relatórios de performance exportáveis
- Sistema de match automático banco → vagas
- Configurações completas de LGPD
- Site otimizado para performance
- Documentação de usuário
- Kit de onboarding para novos clientes

**Milestone: MVP Final - Pronto para Lançamento**
- Sistema completo e polido
- Performance otimizada (Lighthouse > 95)
- Testes end-to-end passando
- Documentação completa
- Pronto para primeiros clientes pagantes

---

## Marcos Principais (Milestones)

### M1: MVP Alpha - Fundação (Final Sprint 1)
**Data:** Semana 3
**Entregáveis:**
- Autenticação completa
- Gestão de empresa básica
- Dashboard inicial
**Critérios de Aceitação:**
- 1 empresa pode se registrar e convitar 3 usuários
- Login/logout funcionando sem erros
- Interface responsiva básica

### M2: MVP Beta - Vagas (Final Sprint 2)
**Data:** Semana 5
**Entregáveis:**
- Sistema completo de vagas
- Dashboard com métricas
- CRUD de vagas funcional
**Critérios de Aceitação:**
- Criar 5 vagas diferentes
- Editar e arquivar vagas
- Dashboard mostrando contadores corretos

### M3: MVP Gamma - Candidatos (Final Sprint 3)
**Data:** Semana 7
**Entregáveis:**
- Upload e processamento de currículos
- Score técnico automático
- Perfil completo do candidato
**Critérios de Aceitação:**
- Upload de 10 currículos diferentes
- Score gerado para cada candidato
- Perfil mostrando todas informações extraídas

### M4: MVP Delta - Pipeline (Final Sprint 4)
**Data:** Semana 9
**Entregáveis:**
- Pipeline visual kanban
- Sistema de avaliação
- Banco de talentos básico
**Critérios de Aceitação:**
- Mover candidatos entre etapas via drag & drop
- Avaliar 5 candidatos com formulário estruturado
- 3 candidatos no banco de talentos com tags

### M5: MVP Épsilon - Decisão (Final Sprint 5)
**Data:** Semana 11
**Entregáveis:**
- Agendamento de entrevistas
- Sistema de decisão assistida
- Comunicação automática
**Critérios de Aceitação:**
- Agendar 3 entrevistas via Google Calendar
- Usar dashboard comparativo para decisão
- Enviar 5 emails automáticos para candidatos

### M6: MVP Final - Lançamento (Final Sprint 6)
**Data:** Semana 13
**Entregáveis:**
- Sistema completo e polido
- Relatórios e analytics
- Documentação completa
**Critérios de Aceitação:**
- Processo completo end-to-end funcionando
- Performance Lighthouse > 95
- 0 bugs críticos
- Pronto para primeiros clientes pagantes

---

## Métricas de Progresso

### Métricas de Desenvolvimento
- **Velocity:** 4-6 features por sprint (mantido)
- **Bugs por Sprint:** < 5 (críticos), < 15 (todos)
- **Cobertura de Testes:** > 70% (aumentando gradualmente)
- **Deploy Success Rate:** > 95%
- **Code Review Time:** < 24h para PRs

### Métricas de Produto (MVP)
- **Tempo para Primeira Vaga:** < 10 minutos (após login)
- **Tempo para Primeiro Upload:** < 2 minutos (após criação de vaga)
- **Taxa de Sucesso de Upload:** > 95%
- **Performance Média:** < 3s carregamento de página
- **Satisfação Usuário (NPS):** > 30 (testes internos)

### Métricas de Negócio (Pós-MVP)
- **Conversão para Cliente:** > 20% (demos)
- **Retenção 30 dias:** > 80%
- **Receita Média por Vaga:** R$ 3.000 - R$ 5.000
- **CAC:** < R$ 2.000
- **LTV:** > R$ 30.000

---

## Riscos e Planos de Contingência

### Risco 1: Atrasos no Desenvolvimento
- **Probabilidade:** Média
- **Impacto:** Alto
- **Mitigação:**
  - Sprints conservativas (subestimar capacidade)
  - Buffer de 1 semana entre sprints 3 e 4
  - Features opcionais identificadas (podem ser cortadas)
  - Time dedicado (minimizar contexto switching)

### Risco 2: Problemas com Integrações (Google Calendar)
- **Probabilidade:** Baixa-Média
- **Impacto:** Médio
- **Mitigação:**
  - Implementar fallback manual primeiro
  - Testar integração no sprint 1
  - Ter plano B (calendário próprio simples)
  - Isolar código de integração para fácil substituição

### Risco 3: Performance do Processamento de Currículos
- **Probabilidade:** Média
- **Impacto:** Médio
- **Mitigação:**
  - Começar com parser simples (texto apenas)
  - Processamento assíncrono (background jobs)
  - Limitar tamanho de arquivo (10MB)
  - Feedback visual claro durante processamento

### Risco 4: Complexidade do Algoritmo de Score
- **Probabilidade:** Alta
- **Impacto:** Médio
- **Mitigação:**
  - MVP com algoritmo simples (keyword matching)
  - Revisão humana obrigatória (não confiar apenas no score)
  - Evoluir gradualmente (coletar dados primeiro)
  - Manter transparência (mostrar como score foi calculado)

### Risco 5: Dificuldades com LGPD
- **Probabilidade:** Baixa
- **Impacto:** Alto
- **Mitigação:**
  - Consultar especialista LGPD desde o início
  - Implementar consentimento explícito
  - Design para privacidade desde o início
  - Ferramentas de exclusão e anonimização built-in

---

## Recursos Necessários

### Recursos Humanos
- **1x Frontend Sênior:** React, TypeScript, Tailwind (Sprints 0-6)
- **1x Full-stack Pleno:** Supabase, Node.js, APIs (Sprints 0-6)
- **1x Product Designer:** 50% time (Sprints 0-2, 5-6)
- **1x QA Tester:** 25% time (Sprints 4-6)

### Infraestrutura
- **Supabase:** Tier gratuito (até ~$10k MRR)
- **Netlify:** Tier gratuito (até ~$10k MRR)
- **Google Cloud:** $300 crédito inicial (Calendar API, etc.)
- **SendGrid:** Tier gratuito (100 emails/dia)
- **Monitoring:** Sentry (free tier), LogRocket (free trial)

### Ferramentas de Desenvolvimento
- **GitHub:** Repositório + Actions (CI/CD)
- **Figma:** Design system e protótipos
- **Notion:** Documentação do projeto
- **Slack/Discord:** Comunicação da equipe
- **Linear/Jira:** Gestão de tarefas

---

## Próximos Passos Imediatos

### Antes do Sprint 0:
1. [ ] Contratar/designar equipe
2. [ ] Criar contas Supabase + Netlify
3. [ ] Configurar repositório GitHub
4. [ ] Definir ferramentas de comunicação
5. [ ] Revisar backlog com equipe técnica

### Durante Sprint 0:
1. [ ] Setup completo do ambiente
2. [ ] Primeiro deploy em Netlify
3. [ ] Configurar CI/CD pipeline
4. [ ] Estabelecer padrões de código
5. [ ] Criar guia de contribuição

### Pós-MVP (Roadmap Futuro):
1. **Módulo HumanG Bank Avançado** (match inteligente)
2. **Módulo HumanG Trail** (trilha para candidatos)
3. **Módulo HumanG GERAC Score** (diagnóstico de maturidade)
4. **Módulo HumanG Grow** (onboarding e desenvolvimento)
5. **API Pública** para integração com outros sistemas de RH
6. **Mobile App** para recrutadores em campo

---

## Conclusão

Este roadmap de 12 semanas fornece um plano realista para implementação do MVP do HumanG usando a stack Supabase + Netlify. O foco está em entregar valor incremental a cada sprint, com marcos claros que permitem validação contínua com usuários reais.

A abordagem iterativa permite ajustar o plano conforme feedback, enquanto a stack escolhida (Supabase + Netlify) maximiza velocidade de desenvolvimento e minimiza custos iniciais.

**Próximo passo:** Iniciar Sprint 0 (Setup) com a equipe técnica designada.

---

*Roadmap gerado pelo Project Planner - ET-05*
*Base: .plans/01-backlog.md, .docs/03-arquitetura-sistema.md*
*Horizonte: 12 semanas para MVP completo*
*Stack: Supabase (backend) + Netlify (frontend) + React/TypeScript*

