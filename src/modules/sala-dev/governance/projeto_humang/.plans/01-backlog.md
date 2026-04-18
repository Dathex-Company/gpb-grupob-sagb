# 01. Backlog do Produto - HumanG (MVP Supabase + Netlify)

## Visão Geral
Este backlog organiza as funcionalidades do MVP do HumanG baseado na visão de produto (.docs/01-visao-produto.md), PRD (.docs/02-prd-inicial.md), arquitetura (.docs/03-arquitetura-sistema.md) e fluxos do usuário (.docs/04-fluxos-do-usuario.md).

## Princípios de Priorização
1. **MVP Core:** Funcionalidades essenciais para validar proposta de valor
2. **Stack Supabase + Netlify:** Priorizar features que aproveitam stack definida
3. **Velocidade de Entrega:** Features que podem ser entregues rapidamente
4. **Impacto no Usuário:** Resolver dores principais das personas Carlos e Ana
5. **Dependências Técnicas:** Sequência lógica de implementação

## Categorias de Funcionalidades

### A. Sistema de Autenticação e Gerenciamento de Empresas (Fundação)
**Prioridade: ALTA** - Base para todo o sistema

#### A1. Autenticação com Supabase Auth
- **Descrição:** Sistema de login para empresas (Carlos/Ana) com Supabase Auth
- **Critérios de Aceitação:**
  - Login com email/senha
  - Recuperação de senha
  - Gestão de sessão JWT
  - Logout seguro
- **Complexidade:** Média
- **Dependências:** Setup Supabase project
- **Estimativa:** 3-5 dias

#### A2. Perfil da Empresa
- **Descrição:** Cadastro e gestão de informações da empresa cliente
- **Critérios de Aceitação:**
  - Cadastro de nome, domínio, logo
  - Configuração de valores culturais
  - Gestão de departamentos/equipes
- **Complexidade:** Baixa
- **Dependências:** A1 (Autenticação)
- **Estimativa:** 2-3 dias

#### A3. Gestão de Usuários da Empresa
- **Descrição:** Controle de acesso para diferentes membros da equipe
- **Critérios de Aceitação:**
  - Convite de novos usuários
  - Definição de papéis (admin, recrutador, entrevistador)
  - Controle de permissões por papel
- **Complexidade:** Média
- **Dependências:** A1 (Autenticação)
- **Estimativa:** 3-4 dias

### B. Gestão de Vagas (Core do Negócio)
**Prioridade: ALTA** - Funcionalidade principal para Carlos

#### B1. Criação e Edição de Vagas
- **Descrição:** Formulário para criação de novas posições
- **Critérios de Aceitação:**
  - Campos: título, descrição, requisitos técnicos
  - Critérios de avaliação (pesos)
  - Configuração de processo (etapas)
- **Complexidade:** Baixa
- **Dependências:** A1 (Autenticação)
- **Estimativa:** 2-3 dias

#### B2. Listagem de Vagas Ativas
- **Descrição:** Dashboard com todas as vagas da empresa
- **Critérios de Aceitação:**
  - Cards com status e métricas
  - Filtros por status/departamento
  - Busca por título/descrição
  - Ações rápidas (editar, pausar, arquivar)
- **Complexidade:** Baixa
- **Dependências:** B1 (Criação de Vagas)
- **Estimativa:** 2-3 dias

#### B3. Pipeline Visual da Vaga (Kanban)
- **Descrição:** Visualização do fluxo de candidatos por vaga
- **Critérios de Aceitação:**
  - Colunas por etapa do processo
  - Cards de candidatos arrastáveis
  - Status visuais (cores, badges)
  - Contadores por coluna
- **Complexidade:** Média-Alta
- **Dependências:** C1 (Gestão de Candidatos)
- **Estimativa:** 4-6 dias

### C. Gestão de Candidatos (Core do Sistema)
**Prioridade: ALTA** - Processamento central do HumanG

#### C1. Upload e Processamento de Currículos
- **Descrição:** Recebimento e análise inicial de currículos
- **Critérios de Aceitação:**
  - Upload de PDF/DOC
  - Armazenamento no Supabase Storage
  - Extração básica de texto
  - Parsing de informações básicas
- **Complexidade:** Média
- **Dependências:** B1 (Vagas), Supabase Storage
- **Estimativa:** 3-5 dias

#### C2. Score Técnico Automático (MVP Básico)
- **Descrição:** Análise inicial de compatibilidade técnica
- **Critérios de Aceitação:**
  - Comparação com requisitos da vaga
  - Score simples baseado em keywords match
  - Classificação automática (alta/média/baixa)
- **Complexidade:** Média
- **Dependências:** C1 (Upload de Currículos)
- **Estimativa:** 4-5 dias

#### C3. Perfil Detalhado do Candidato
- **Descrição:** Página com todas as informações do candidato
- **Critérios de Aceitação:**
  - Informações pessoais e de contato
  - Histórico profissional
  - Score técnico e avaliações
  - Timeline de interações
  - Documentos anexados
- **Complexidade:** Média
- **Dependências:** C1 (Upload de Currículos)
- **Estimativa:** 3-4 dias

### D. Processo de Entrevista e Avaliação
**Prioridade: MÉDIA-ALTA** - Diferencial do HumanG

#### D1. Agendamento de Entrevistas
- **Descrição:** Sistema integrado com Google Calendar
- **Critérios de Aceitação:**
  - Seleção de data/hora
  - Escolha de entrevistador
  - Geração automática de link (Google Meet)
  - Notificações por email
- **Complexidade:** Média-Alta
- **Dependências:** C3 (Perfil do Candidato), Integração Calendar API
- **Estimativa:** 5-7 dias

#### D2. Formulário de Avaliação de Entrevista
- **Descrição:** Coleta estruturada de feedback pós-entrevista
- **Critérios de Aceitação:**
  - Campos para avaliação técnica/comportamental
  - Score de fit cultural
  - Campo de observações livres
  - Anexo de gravação (opcional)
- **Complexidade:** Baixa
- **Dependências:** D1 (Agendamento)
- **Estimativa:** 2-3 dias

#### D3. Sistema de Decisão Assistida
- **Descrição:** Dashboard comparativo para decisão final
- **Critérios de Aceitação:**
  - Comparação side-by-side de candidatos
  - Scores consolidados (técnico + cultural)
  - Recomendação automática (verde/amarelo/vermelho)
  - Campo para justificativa da decisão
- **Complexidade:** Média
- **Dependências:** D2 (Avaliação de Entrevista)
- **Estimativa:** 3-5 dias

### E. Banco de Talentos e Reaproveitamento
**Prioridade: MÉDIA** - Diferencial de longo prazo

#### E1. Sistema Básico de Banco de Talentos
- **Descrição:** Armazenamento de candidatos não selecionados
- **Critérios de Aceitação:**
  - Listagem de talentos com filtros
  - Tags por skills e experiência
  - Status de consentimento LGPD
  - Busca por critérios
- **Complexidade:** Baixa-Média
- **Dependências:** C3 (Perfil do Candidato)
- **Estimativa:** 3-4 dias

#### E2. Match Automático com Novas Vagas
- **Descrição:** Sugestão de candidatos do banco para vagas ativas
- **Critérios de Aceitação:**
  - Algoritmo de match por skills/experiência
  - Notificação para recrutador
  - Score de compatibilidade
- **Complexidade:** Média-Alta
- **Dependências:** E1 (Banco de Talentos), B1 (Vagas)
- **Estimativa:** 4-6 dias

### F. Dashboard e Analytics
**Prioridade: MÉDIA** - Importante para Ana

#### F1. Dashboard de Métricas Básicas
- **Descrição:** Visão geral do pipeline e performance
- **Critérios de Aceitação:**
  - Cards com contadores (candidatos ativos, em revisão, etc.)
  - Gráfico de funnel do pipeline
  - Lista de atividades recentes
  - Métricas por vaga
- **Complexidade:** Média
- **Dependências:** B2 (Listagem de Vagas), C1 (Candidatos)
- **Estimativa:** 3-5 dias

#### F2. Relatórios de Performance
- **Descrição:** Análise de eficácia do processo
- **Critérios de Aceitação:**
  - Taxa de conversão por etapa
  - Tempo médio de contratação
  - Satisfação do candidato (se disponível)
  - Exportação para PDF/Excel
- **Complexidade:** Média
- **Dependências:** F1 (Dashboard)
- **Estimativa:** 4-5 dias

### G. Configurações e Administração
**Prioridade: BAIXA-MÉDIA** - Necessário mas não crítico para MVP

#### G1. Templates de Comunicação
- **Descrição:** Sistema de emails automatizados
- **Critérios de Aceitação:**
  - Editor de templates WYSIWYG
  - Variáveis dinâmicas (nome, vaga, etc.)
  - Teste de envio
  - Configuração SMTP/SendGrid
- **Complexidade:** Média
- **Dependências:** A1 (Autenticação)
- **Estimativa:** 4-5 días

#### G2. Configurações de LGPD
- **Descrição:** Gestão de consentimento e privacidade
- **Critérios de Aceitação:**
  - Templates de consentimento
  - Configuração de retenção de dados
  - Logs de acesso
  - Ferramenta de exclusão de dados
- **Complexidade:** Média
- **Dependências:** A1 (Autenticação)
- **Estimativa:** 3-4 días

## Backlog Prioritizado (Ordem de Implementação)

### Fase 1: Fundação (Semanas 1-2)
**Objetivo:** Sistema básico funcionando com autenticação e gestão de vagas

1. **A1 - Autenticação com Supabase Auth** (ALTA)
2. **A2 - Perfil da Empresa** (ALTA) 
3. **B1 - Criação e Edição de Vagas** (ALTA)
4. **B2 - Listagem de Vagas Ativas** (ALTA)

### Fase 2: Core do Sistema (Semanas 3-4)
**Objetivo:** Processamento de candidatos e pipeline básico

5. **C1 - Upload e Processamento de Currículos** (ALTA)
6. **C2 - Score Técnico Automático (MVP Básico)** (ALTA)
7. **C3 - Perfil Detalhado do Candidato** (ALTA)
8. **B3 - Pipeline Visual da Vaga (Kanban)** (ALTA)

### Fase 3: Processo de Avaliação (Semanas 5-6)
**Objetivo:** Sistema completo de entrevista e decisão

9. **D1 - Agendamento de Entrevistas** (MÉDIA-ALTA)
10. **D2 - Formulário de Avaliação de Entrevista** (MÉDIA-ALTA)
11. **D3 - Sistema de Decisão Assistida** (MÉDIA-ALTA)

### Fase 4: Dashboard e Analytics (Semanas 7-8)
**Objetivo:** Visibilidade e métricas para o cliente

12. **F1 - Dashboard de Métricas Básicas** (MÉDIA)
13. **F2 - Relatórios de Performance** (MÉDIA)

### Fase 5: Funcionalidades Avançadas (Semanas 9-12)
**Objetivo:** Diferenciais e otimizações

14. **E1 - Sistema Básico de Banco de Talentos** (MÉDIA)
15. **E2 - Match Automático com Novas Vagas** (MÉDIA)
16. **G1 - Templates de Comunicação** (BAIXA-MÉDIA)
17. **G2 - Configurações de LGPD** (BAIXA-MÉDIA)

## Critérios de Pronto (Definition of Done)

Para cada item do backlog, considera-se "Pronto" quando:

1. **Código implementado** seguindo padrões da stack (React/TypeScript + Supabase)
2. **Testes unitários** cobrindo casos principais (Jest + React Testing Library)
3. **Testes de integração** com Supabase (quando aplicável)
4. **Documentação** atualizada (comentários no código + atualização de docs relevantes)
5. **Review de código** realizado (pair programming ou code review)
6. **Deploy em ambiente de staging** (Netlify Preview)
7. **Testes manuais** realizados conforme critérios de aceitação
8. **Performance** atendendo requisitos (carregamento < 3s, interações < 1s)
9. **Responsividade** testada (mobile, tablet, desktop)
10. **Acessibilidade** básica implementada (contraste, navegação por teclado)

## Dependências Externas

### Supabase (Backend)
- **Auth:** Sistema de autenticação
- **PostgreSQL:** Banco de dados principal
- **Storage:** Armazenamento de currículos
- **Edge Functions:** Processamento de IA (futuro)
- **Realtime:** Notificações em tempo real (futuro)

### Netlify (Frontend)
- **Hospedagem:** Deploy da aplicação React
- **Edge Functions:** Proxy para APIs externas
- **Forms:** Coleta de dados (potencial)
- **Analytics:** Métricas de uso básicas

### APIs de Terceiros
- **Google Calendar API:** Agendamento de entrevistas
- **SendGrid/Mailgun:** Envio de emails
- **OpenAI/Hugging Face:** Análise de currículos (futuro)
- **Google Meet/Zoom:** Links de reunião

## Riscos e Mitigações

### Risco 1: Complexidade do Score Técnico Automático
- **Risco:** Algoritmo muito complexo atrasa MVP
- **Mitigação:** Começar com match simples por keywords, evoluir gradualmente

### Risco 2: Integração com Google Calendar
- **Risco:** Dependência externa pode falhar
- **Mitigação:** Ter fallback manual (cópia de link) + testar extensivamente

### Risco 3: Performance do Upload de Currículos
- **Risco:** Processamento lento de arquivos grandes
- **Mitigação:** Limitar tamanho de arquivo + processamento assíncrono + feedback visual

### Risco 4: Gestão de Estado Complexa
- **Risco:** Muitos estados no frontend (candidatos, vagas, entrevistas)
- **Mitigação:** Usar React Query para server state + Zustand para client state + manter componentes simples

## Métricas de Sucesso do Backlog

1. **Velocidade de entrega:** 2-3 features por semana (após setup inicial)
2. **Qualidade do código:** < 5% de bugs reportados em produção
3. **Satisfação do time:** Feedback positivo nas retrospectivas
4. **Adesão ao padrão:** > 90% de conformidade com guias de estilo
5. **Cobertura de testes:** > 70% para código crítico

---

**Próximo passo:** Definir roadmap detalhado com marcos e cronograma em `.plans/02-roadmap.md`

*Backlog gerado pelo Project Planner - ET-05*
*Base: .docs/01-visao-produto.md, .docs/02-prd-inicial.md, .docs/03-arquitetura-sistema.md, .docs/04-fluxos-do-usuario.md, .specs/03-mapa-de-telas.md*
*Stack: Supabase + Netlify para MVP rápido*