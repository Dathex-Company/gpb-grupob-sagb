# 01. Quebra de Tarefas - HumanG (MVP Supabase + Netlify)

## Visão Geral
Este documento detalha as tarefas técnicas executáveis para implementação do MVP do HumanG, baseado no backlog (.plans/01-backlog.md) e roadmap (.plans/02-roadmap.md). Cada tarefa é descrita com critérios de aceitação, dependências e estimativa.

## Princípios da Quebra de Tarefas
1. **Tamanho Ideal:** 1-3 dias de trabalho por tarefa
2. **Independência:** Tarefas podem ser trabalhadas em paralelo quando possível
3. **Testabilidade:** Cada tarefa tem critérios de aceitação claros
4. **Rastreabilidade:** Link para backlog item correspondente
5. **Stack Específica:** Supabase, Netlify, React/TypeScript, Tailwind

---

## Sprint 0: Setup e Fundação (Semana 0-1)

### T0.1: Setup Projeto React/TypeScript com Vite
**Backlog:** Sprint 0 - Setup
**Descrição:** Configurar projeto frontend com todas as ferramentas básicas
**Tarefas:**
- [ ] Criar projeto com `npm create vite@latest humang -- --template react-ts`
- [ ] Configurar Tailwind CSS seguindo documentação oficial
- [ ] Configurar ESLint + Prettier com regras para TypeScript
- [ ] Configurar path aliases (`@/` para `src/`)
- [ ] Configurar ambiente de desenvolvimento (VS Code settings)
- [ ] Criar estrutura inicial de pastas conforme arquitetura
**Critérios de Aceitação:**
- Projeto compila sem erros (`npm run build`)
- ESLint/Prettier funcionando (npm scripts)
- Tailwind classes aplicáveis
- Path aliases funcionando
**Dependências:** Nenhuma
**Estimativa:** 1 dia
**Responsável:** Frontend Engineer

### T0.2: Configuração Supabase Project
**Backlog:** Sprint 0 - Setup
**Descrição:** Criar e configurar projeto Supabase com PostgreSQL, Auth e Storage
**Tarefas:**
- [ ] Criar conta/organização Supabase
- [ ] Criar novo projeto na região South America (São Paulo)
- [ ] Configurar Authentication providers (Email, Google opcional)
- [ ] Configurar Storage bucket para currículos
- [ ] Criar database schema inicial (tables básicas)
- [ ] Configurar Row Level Security (RLS) básico
- [ ] Gerar tipos TypeScript do database (`supabase gen types`)
**Critérios de Aceitação:**
- Projeto Supabase criado e acessível
- Auth funcionando (pode criar usuário)
- Storage bucket criado
- RLS policies aplicadas
- Types gerados e importáveis no frontend
**Dependências:** Nenhuma
**Estimativa:** 1 dia
**Responsável:** Full-stack Engineer

### T0.3: Configuração Netlify Deploy
**Backlog:** Sprint 0 - Setup
**Descrição:** Configurar deploy automático e ambiente na Netlify
**Tarefas:**
- [ ] Criar conta/organização Netlify
- [ ] Conectar repositório GitHub
- [ ] Configurar build settings (build command, publish directory)
- [ ] Configurar environment variables (Supabase URL, keys)
- [ ] Configurar deploy previews para PRs
- [ ] Configurar domain customizado (opcional para staging)
- [ ] Configurar redirects para SPA
**Critérios de Aceitação:**
- Deploy automático funcionando (git push → deploy)
- Environment variables configuradas
- Preview deploys para PRs
- Site acessível via URL Netlify
**Dependências:** T0.1 (Projeto React), T0.2 (Supabase)
**Estimativa:** 0.5 dia
**Responsável:** Frontend Engineer

### T0.4: Configuração Gerenciamento de Estado
**Backlog:** Sprint 0 - Setup
**Descrição:** Configurar React Query e Zustand para gerenciamento de estado
**Tarefas:**
- [ ] Instalar e configurar React Query (`@tanstack/react-query`)
- [ ] Configurar QueryClient provider na app
- [ ] Instalar e configurar Zustand para client state
- [ ] Criar store básica para autenticação
- [ ] Configurar hooks customizados para Supabase
- [ ] Criar sistema de error handling global
**Critérios de Aceitação:**
- React Query funcionando (pode fazer queries)
- Zustand store acessível em componentes
- Hooks para Supabase disponíveis
- Error handling básico implementado
**Dependências:** T0.1 (Projeto React), T0.2 (Supabase)
**Estimativa:** 1 dia
**Responsável:** Frontend Engineer

### T0.5: Sistema de Design e Componentes Base
**Backlog:** Sprint 0 - Setup
**Descrição:** Criar sistema de design com Tailwind e componentes base reutilizáveis
**Tarefas:**
- [ ] Definir tokens de design (cores, tipografia, espaçamento)
- [ ] Configurar `tailwind.config.js` com custom colors
- [ ] Criar componentes base: Button, Input, Card, Modal
- [ ] Configurar dark/light theme system
- [ ] Criar layout base com Header e Sidebar
- [ ] Configurar fontes (Inter via Google Fonts)
**Critérios de Aceitação:**
- Tokens de design definidos e usados
- Componentes base funcionando e reutilizáveis
- Theme switching funcionando
- Layout base responsivo
**Dependências:** T0.1 (Projeto React + Tailwind)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer

### T0.6: CI/CD e Qualidade de Código
**Backlog:** Sprint 0 - Setup
**Descrição:** Configurar pipelines de CI/CD e ferramentas de qualidade
**Tarefas:**
- [ ] Configurar GitHub Actions para CI
- [ ] Configurar testes unitários com Jest + React Testing Library
- [ ] Configurar E2E tests com Cypress (básico)
- [ ] Configurar Husky para pre-commit hooks
- [ ] Configurar commitlint para conventional commits
- [ ] Criar templates de PR e issues
**Critérios de Aceitação:**
- CI pipeline passa com build e lint
- Testes unitários rodando
- Pre-commit hooks funcionando
- Conventional commits sendo usados
**Dependências:** T0.1 (Projeto React)
**Estimativa:** 1 dia
**Responsável:** Frontend Engineer

---

## Sprint 1: Autenticação e Core Empresarial (Semanas 2-3)

### T1.1: Páginas de Autenticação (Login/Registro)
**Backlog:** A1 - Autenticação com Supabase Auth
**Descrição:** Implementar fluxo completo de autenticação
**Tarefas:**
- [ ] Criar página de Login com formulário email/senha
- [ ] Integrar com Supabase Auth `signInWithPassword`
- [ ] Criar página de Registro para novas empresas
- [ ] Implementar validação de formulários com React Hook Form + Zod
- [ ] Criar página de Recuperação de Senha
- [ ] Implementar redirecionamento pós-login
- [ ] Adicionar loading states e error handling
**Critérios de Aceitação:**
- Usuário pode fazer login com email/senha
- Novo usuário pode se registrar
- Recuperação de senha funcionando
- Redirecionamento para dashboard após login
- Mensagens de erro claras
**Dependências:** T0.2 (Supabase Auth), T0.5 (Componentes)
**Estimativa:** 2 dias
**Responsável:** Frontend Engineer

### T1.2: Sistema de Autenticação e Rotas Protegidas
**Backlog:** A1 - Autenticação com Supabase Auth
**Descrição:** Implementar proteção de rotas e gestão de sessão
**Tarefas:**
- [ ] Criar componente `ProtectedRoute` para rotas privadas
- [ ] Configurar React Router v6 com rotas protegidas
- [ ] Implementar refresh automático de token JWT
- [ ] Criar hook `useAuth` para acesso a estado de autenticação
- [ ] Implementar logout com limpeza de estado
- [ ] Configurar interceptors para adicionar token às requisições
- [ ] Criar página 404 e redirects
**Critérios de Aceitação:**
- Rotas protegidas redirecionam para login se não autenticado
- Token JWT é automaticamente refreshado
- Hook `useAuth` fornece estado de autenticação
- Logout limpa tudo corretamente
**Dependências:** T1.1 (Páginas de Auth)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer

### T1.3: Perfil da Empresa (CRUD)
**Backlog:** A2 - Perfil da Empresa
**Descrição:** Criar sistema de cadastro e gestão de perfil da empresa
**Tarefas:**
- [ ] Criar tabela `companies` no Supabase
- [ ] Definir RLS policies para companies
- [ ] Criar página/componente de edição de perfil da empresa
- [ ] Implementar upload de logo (Supabase Storage)
- [ ] Criar formulário com campos: nome, domínio, descrição
- [ ] Implementar validação e save
- [ ] Criar contexto/hook para acesso a dados da empresa
**Critérios de Aceitação:**
- Empresa pode criar/editar seu perfil
- Upload de logo funcionando
- Dados persistidos no Supabase
- RLS garantindo que empresa só vê seus dados
**Dependências:** T0.2 (Supabase), T1.1 (Autenticação)
**Estimativa:** 2 dias
**Responsável:** Full-stack Engineer

### T1.4: Sistema de Convite de Usuários
**Backlog:** A3 - Gestão de Usuários da Empresa
**Descrição:** Implementar sistema de convite para novos membros da equipe
**Tarefas:**
- [ ] Criar tabela `invitations` no Supabase
- [ ] Implementar envio de email de convite (SendGrid/Resend)
- [ ] Criar página para listar usuários da empresa
- [ ] Implementar roles (admin, recruiter, interviewer)
- [ ] Criar interface para adicionar/remover usuários
- [ ] Implementar aceitação de convite (token-based)
- [ ] Criar RLS policies baseadas em roles
**Critérios de Aceitação:**
- Admin pode convidar novos usuários
- Email de convite é enviado
- Usuário pode aceitar convite e criar conta
- Roles funcionando com permissões diferentes
**Dependências:** T1.3 (Perfil da Empresa)
**Estimativa:** 3 dias
**Responsável:** Full-stack Engineer

### T1.5: Dashboard Inicial
**Backlog:** Sprint 1 - Entregável
**Descrição:** Criar dashboard inicial após login
**Tarefas:**
- [ ] Criar layout de dashboard com sidebar
- [ ] Implementar componente de Header com usuário logado
- [ ] Criar cards de métricas básicas (placeholder)
- [ ] Implementar navegação entre seções
- [ ] Adicionar empty states para primeira vez
- [ ] Criar componente de atividades recentes
**Critérios de Aceitação:**
- Dashboard acessível após login
- Sidebar com navegação funcional
- Layout responsivo
- Empty states quando não há dados
**Dependências:** T1.2 (Sistema de Auth)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer

---

## Sprint 2: Gestão de Vagas (Semanas 4-5)

### T2.1: Formulário de Criação de Vaga
**Backlog:** B1 - Criação e Edição de Vagas
**Descrição:** Criar formulário completo para criação de novas vagas
**Tarefas:**
- [ ] Criar tabela `jobs` no Supabase
- [ ] Definir RLS policies para jobs
- [ ] Criar componente de formulário multi-step
- [ ] Campos: título, descrição (rich text), requisitos técnicos
- [ ] Implementar sistema de tags/skills para requisitos
- [ ] Adicionar critérios de avaliação com pesos
- [ ] Implementar validação e save
**Critérios de Aceitação:**
- Usuário pode criar nova vaga com todos os campos
- Rich text editor funcionando para descrição
- Tags/skills podem ser adicionadas/removidas
- Dados salvos no Supabase
**Dependências:** T1.3 (Perfil da Empresa)
**Estimativa:** 2.5 dias
**Responsável:** Full-stack Engineer

### T2.2: Listagem de Vagas Ativas
**Backlog:** B2 - Listagem de Vagas Ativas
**Descrição:** Criar dashboard com lista de vagas e filtros
**Tarefas:**
- [ ] Criar página `/jobs` com grid de cards
- [ ] Implementar card de vaga com status e métricas
- [ ] Criar sistema de filtros (status, departamento, data)
- [ ] Implementar busca por título/descrição
- [ ] Adicionar ações rápidas (editar, pausar, arquivar)
- [ ] Criar paginação ou infinite scroll
- [ ] Implementar empty state quando não há vagas
**Critérios de Aceitação:**
- Lista de vagas carrega do Supabase
- Filtros e busca funcionando
- Cards mostram informações relevantes
- Ações rápidas funcionam
**Dependências:** T2.1 (Formulário de Vaga)
**Estimativa:** 2 dias
**Responsável:** Frontend Engineer

### T2.3: Página de Detalhe da Vaga
**Backlog:** B2 - Listagem de Vagas Ativas
**Descrição:** Criar página de detalhe com todas informações da vaga
**Tarefas:**
- [ ] Criar rota `/jobs/:id` com layout de detalhe
- [ ] Implementar tabs para diferentes seções (descrição, candidatos, configurações)
- [ ] Criar componente de header com ações (editar, pausar, duplicar)
- [ ] Adicionar seção de métricas da vaga
- [ ] Implementar edição inline de campos
- [ ] Criar histórico de alterações
**Critérios de Aceitação:**
- Página carrega detalhes da vaga
- Tabs funcionando com conteúdo diferente
- Edição inline salva no Supabase
- Histórico de alterações visível
**Dependências:** T2.1 (Formulário de Vaga)
**Estimativa:** 2 dias
**Responsável:** Frontend Engineer

### T2.4: Sistema de Status de Vagas
**Backlog:** B1 - Criação e Edição de Vagas
**Descrição:** Implementar sistema de status (aberta, pausada, fechada, arquivada)
**Tarefas:**
- [ ] Adicionar enum `job_status` na tabela jobs
- [ ] Criar actions para mudar status (pause, close, archive)
- [ ] Implementar validações de transição de status
- [ ] Adicionar visual indicators (badges) para status
- [ ] Criar filtros por status no dashboard
- [ ] Implementar confirmações para ações destrutivas
**Critérios de Aceitação:**
- Status pode ser alterado através de ações
- Badges mostram status corretamente
- Filtros por status funcionando
- Confirmações previnem ações acidentais
**Dependências:** T2.2 (Listagem de Vagas)
**Estimativa:** 1 dia
**Responsável:** Frontend Engineer

### T2.5: Métricas Básicas no Dashboard
**Backlog:** F1 - Dashboard de Métricas Básicas (parte inicial)
**Descrição:** Adicionar cards de métricas ao dashboard principal
**Tarefas:**
- [ ] Criar componente `MetricCard` reutilizável
- [ ] Implementar query para contar vagas ativas
- [ ] Implementar query para contar candidatos totais
- [ ] Adicionar query para vagas com decisão pendente
- [ ] Criar gráfico simples de vagas por status
- [ ] Implementar refresh automático de métricas
**Critérios de Aceitação:**
- Cards mostram métricas corretas
- Gráfico mostra distribuição de status
- Métricas atualizam automaticamente
- Loading states durante carregamento
**Dependências:** T2.1 (Tabela jobs), T1.5 (Dashboard)
**Estimativa:** 1.5 dias
**Responsável:** Full-stack Engineer

---

## Sprint 3: Upload e Processamento de Candidatos (Semanas 6-7)

### T3.1: Upload de Currículos para Supabase Storage
**Backlog:** C1 - Upload e Processamento de Currículos
**Descrição:** Implementar sistema de upload de arquivos (PDF/DOC)
**Tarefas:**
- [ ] Criar componente `FileUpload` com drag & drop
- [ ] Integrar com Supabase Storage `upload`
- [ ] Implementar validação (tamanho, tipo, quantidade)
- [ ] Adicionar progress indicator durante upload
- [ ] Criar sistema de retry para falhas
- [ ] Implementar preview de arquivo após upload
- [ ] Adicionar tratamento de erros e limites
**Critérios de Aceitação:**
- Upload de arquivos funcionando
- Validação de tipos e tamanhos
- Progresso visível durante upload
- Preview do arquivo disponível
- Erros tratados adequadamente
**Dependências:** T0.2 (Supabase Storage), T2.1 (Vagas)
**Estimativa:** 2 dias
**Responsável:** Frontend Engineer

### T3.2: Parser Básico de Currículos (Texto)
**Backlog:** C1 - Upload e Processamento de Currículos
**Descrição:** Extrair texto de currículos PDF/DOC para análise
**Tarefas:**
- [ ] Implementar extração de texto de PDF (pdf-parse ou similar)
- [ ] Implementar extração de texto de DOC/DOCX (mammoth ou similar)
- [ ] Criar Edge Function para processamento assíncrono
- [ ] Implementar queue system para processamento em background
- [ ] Extrair informações básicas: nome, email, telefone
- [ ] Salvar texto extraído no Supabase
**Critérios de Aceitação:**
- Texto extraído de PDFs
- Texto extraído de DOCs
- Processamento assíncrono funcionando
- Informações básicas extraídas
**Dependências:** T3.1 (Upload de Currículos)
**Estimativa:** 3 dias
**Responsável:** Full-stack Engineer

### T3.3: Algoritmo de Score Técnico (Keywords Match)
**Backlog:** C2 - Score Técnico Automático (MVP Básico)
**Descrição:** Implementar algoritmo básico de matching por keywords
**Tarefas:**
- [ ] Definir estrutura de skills/requisitos da vaga
- [ ] Implementar tokenização do texto do currículo
- [ ] Criar algoritmo de match por keywords simples
- [ ] Calcular score baseado em porcentagem de match
- [ ] Adicionar pesos para skills obrigatórias vs desejáveis
- [ ] Implementar caching de resultados
- [ ] Criar interface para ajuste manual do score
**Critérios de Aceitação:**
- Score calculado baseado em match de keywords
- Pesos aplicados corretamente
- Caching funcionando para performance
- Ajuste manual possível
**Dependências:** T3.2 (Parser de Currículos), T2.1 (Requisitos da Vaga)
**Estimativa:** 3 dias
**Responsável:** Full-stack Engineer

### T3.4: Página de Perfil do Candidato
**Backlog:** C3 - Perfil Detalhado do Candidato
**Descrição:** Criar página completa com todas informações do candidato
**Tarefas:**
- [ ] Criar rota `/candidates/:id`
- [ ] Implementar layout com tabs (info, score, documentos, timeline)
- [ ] Criar seção de informações pessoais extraídas
- [ ] Adicionar visualização do score técnico com breakdown
- [ ] Implementar visualização do currículo original (PDF viewer)
- [ ] Criar timeline de interações
- [ ] Adicionar ações (contatar, agendar, mover etapa)
**Critérios de Aceitação:**
- Página carrega todas informações do candidato
- Tabs funcionando com conteúdo diferente
- PDF viewer funcionando para currículos
- Timeline mostra histórico completo
**Dependências:** T3.1 (Upload de Currículos), T3.3 (Score Técnico)
**Estimativa:** 3 dias
**Responsável:** Frontend Engineer

### T3.5: Sistema de Classificação e Priorização
**Backlog:** C2 - Score Técnico Automático (MVP Básico)
**Descrição:** Implementar sistema de classificação automática (alta/média/baixa)
**Tarefas:**
- [ ] Definir thresholds para categorias (ex: >80 alta, 60-80 média, <60 baixa)
- [ ] Implementar badging visual para prioridade
- [ ] Criar filtros por prioridade no dashboard
- [ ] Adicionar sorting por score nas listagens
- [ ] Implementar highlight de candidatos de alta prioridade
- [ ] Criar relatório de distribuição de scores
**Critérios de Aceitação:**
- Candidatos classificados automaticamente
- Badges mostram prioridade corretamente
- Filtros por prioridade funcionando
- Sorting por score disponível
**Dependências:** T3.3 (Score Técnico)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer

---

## Sprint 4: Pipeline Visual e Gestão (Semanas 8-9)

### T4.1: Pipeline Kanban com Drag & Drop
**Backlog:** B3 - Pipeline Visual da Vaga (Kanban)
**Descrição:** Implementar visualização kanban com drag & drop para movimentação
**Tarefas:**
- [ ] Criar componente `KanbanBoard` com colunas
- [ ] Implementar drag & drop com `@dnd-kit`
- [ ] Definir etapas do pipeline (recebido, triagem, contato, entrevista, decisão)
- [ ] Criar cards de candidato arrastáveis
- [ ] Implementar persistência de mudanças no Supabase
- [ ] Adicionar animações durante drag & drop
- [ ] Criar visualização responsiva (vertical em mobile)
**Critérios de Aceitação:**
- Kanban board renderizando colunas e cards
- Drag & drop funcionando
- Mudanças persistidas no banco
- Responsivo em diferentes tamanhos de tela
**Dependências:** T3.4 (Perfil do Candidato), T2.3 (Detalhe da Vaga)
**Estimativa:** 3 dias
**Responsável:** Frontend Engineer

### T4.2: Sistema de Movimentação entre Etapas
**Backlog:** B3 - Pipeline Visual da Vaga (Kanban)
**Descrição:** Implementar lógica de transição entre etapas do pipeline
**Tarefas:**
- [ ] Definir regras de transição entre etapas
- [ ] Implementar validações para movimentação
- [ ] Criar histórico de mudanças de etapa
- [ ] Adicionar confirmações para movimentações críticas
- [ ] Implementar notificações para mudanças de etapa
- [ ] Criar sistema de triggers para ações automáticas
**Critérios de Aceitação:**
- Movimentações seguem regras definidas
- Histórico registrado para cada mudança
- Confirmações para ações importantes
- Notificações enviadas quando aplicável
**Dependências:** T4.1 (Pipeline Kanban)
**Estimativa:** 2 dias
**Responsável:** Full-stack Engineer

### T4.3: Formulário de Avaliação de Entrevista
**Backlog:** D2 - Formulário de Avaliação de Entrevista
**Descrição:** Criar formulário estruturado para avaliação pós-entrevista
**Tarefas:**
- [ ] Criar tabela `interview_evaluations` no Supabase
- [ ] Definir schema de avaliação (técnica, comportamental, cultural)
- [ ] Implementar formulário multi-seção com ratings
- [ ] Adicionar campo de observações livres
- [ ] Criar sistema de anexo de gravação (opcional)
- [ ] Implementar cálculo de score consolidado
- [ ] Adicionar assinatura do entrevistador
**Critérios de Aceitação:**
- Formulário coleta todas informações necessárias
- Ratings funcionando (estrelas ou escala)
- Anexo de arquivos funcionando
- Score consolidado calculado automaticamente
**Dependências:** T3.4 (Perfil do Candidato)
**Estimativa:** 2.5 dias
**Responsável:** Full-stack Engineer

### T4.4: Banco de Talentos Básico
**Backlog:** E1 - Sistema Básico de Banco de Talentos
**Descrição:** Implementar sistema para armazenar candidatos não selecionados
**Tarefas:**
- [ ] Criar tabela `talent_pool` no Supabase
- [ ] Implementar ação "Adicionar ao banco de talentos"
- [ ] Criar página `/talent-pool` com listagem
- [ ] Implementar filtros por skills, experiência, localização
- [ ] Adicionar sistema de tags para categorização
- [ ] Criar busca por texto completo
- [ ] Implementar consentimento LGPD para armazenamento
**Critérios de Aceitação:**
- Candidatos podem ser adicionados ao banco
- Listagem com filtros funcionando
- Tags podem ser adicionadas/removidas
- Consentimento registrado
**Dependências:** T3.4 (Perfil do Candidato)
**Estimativa:** 3 dias
**Responsável:** Full-stack Engineer

### T4.5: Histórico Completo de Avaliações
**Backlog:** D2 - Formulário de Avaliação de Entrevista
**Descrição:** Criar visualização de histórico de avaliações por candidato
**Tarefas:**
- [ ] Criar componente `EvaluationHistory` para timeline
- [ ] Implementar query para buscar todas avaliações do candidato
- [ ] Criar visualização comparativa de avaliações
- [ ] Adicionar filtros por entrevistador/tipo
- [ ] Implementar exportação de avaliações (PDF)
- [ ] Criar dashboard de performance de entrevistadores
**Critérios de Aceitação:**
- Histórico de avaliações visível
- Visualização comparativa funcionando
- Filtros aplicáveis
- Exportação para PDF funcionando
**Dependências:** T4.3 (Formulário de Avaliação)
**Estimativa:** 2 dias
**Responsável:** Frontend Engineer

---

## Sprint 5: Entrevistas e Decisão Assistida (Semanas 10-11)

### T5.1: Integração Google Calendar API
**Backlog:** D1 - Agendamento de Entrevistas
**Descrição:** Integrar com Google Calendar para agendamento automático
**Tarefas:**
- [ ] Configurar Google Cloud Project com Calendar API
- [ ] Implementar OAuth2 flow para autorização
- [ ] Criar sistema de armazenamento de tokens de acesso
- [ ] Implementar criação de eventos no Google Calendar
- [ ] Gerar links do Google Meet automaticamente
- [ ] Criar sistema de sync bidirecional (atualizações no calendar)
- [ ] Implementar fallback manual (link customizado)
**Critérios de Aceitação:**
- OAuth2 flow funcionando
- Eventos criados no Google Calendar
- Links do Google Meet gerados automaticamente
- Sync de atualizações funcionando
- Fallback manual disponível
**Dependências:** T3.4 (Perfil do Candidato)
**Estimativa:** 4 dias
**Responsável:** Full-stack Engineer

### T5.2: Sistema de Slots de Disponibilidade
**Backlog:** D1 - Agendamento de Entrevistas
**Descrição:** Implementar sistema de seleção de horários disponíveis
**Tarefas:**
- [ ] Criar interface para definição de disponibilidade dos entrevistadores
- [ ] Implementar algoritmo de match de slots disponíveis
- [ ] Criar visualização de calendário com slots livres
- [ ] Adicionar validação de conflitos de horário
- [ ] Implementar sistema de buffer entre entrevistas
- [ ] Criar confirmação por email para o candidato
**Critérios de Aceitação:**
- Entrevistadores podem definir disponibilidade
- Slots disponíveis são mostrados
- Conflitos detectados e prevenidos
- Confirmação por email enviada
**Dependências:** T5.1 (Google Calendar Integration)
**Estimativa:** 2.5 dias
**Responsável:** Frontend Engineer

### T5.3: Dashboard Comparativo para Decisão
**Backlog:** D3 - Sistema de Decisão Assistida
**Descrição:** Criar dashboard side-by-side para comparação de candidatos
**Tarefas:**
- [ ] Criar componente `CandidateComparison`
- [ ] Implementar layout com colunas comparativas
- [ ] Adicionar métricas comparativas (score técnico, cultural, etc.)
- [ ] Criar sistema de highlighting de diferenças
- [ ] Implementar notas e comentários por candidato
- [ ] Adicionar sistema de votação/ranking
- [ ] Criar visualização de consensus entre entrevistadores
**Critérios de Aceitação:**
- Comparação side-by-side funcionando
- Métricas comparáveis visíveis
- Diferenciações destacadas
- Sistema de votação funcionando
**Dependências:** T4.3 (Avaliações), T4.5 (Histórico)
**Estimativa:** 3 dias
**Responsável:** Frontend Engineer

### T5.4: Sistema de Recomendação (Verde/Amarelo/Vermelho)
**Backlog:** D3 - Sistema de Decisão Assistida
**Descrição:** Implementar algoritmo de recomendação automática
**Tarefas:**
- [ ] Definir critérios para cada categoria (verde, amarelo, vermelho)
- [ ] Implementar algoritmo de classificação baseado em scores
- [ ] Criar visual indicators (badges, cores) para recomendações
- [ ] Adicionar justificativa automática para recomendação
- [ ] Implementar sistema de override manual com justificativa obrigatória
- [ ] Criar relatório de acurácia das recomendações
**Critérios de Aceitação:**
- Recomendações geradas automaticamente
- Badges mostrando categoria corretamente
- Justificativa automática apresentada
- Override manual funcionando com justificativa
**Dependências:** T5.3 (Dashboard Comparativo)
**Estimativa:** 2.5 dias
**Responsável:** Full-stack Engineer

### T5.5: Templates Básicos de Comunicação
**Backlog:** G1 - Templates de Comunicação (parte inicial)
**Descrição:** Implementar sistema de templates de email
**Tarefas:**
- [ ] Criar tabela `email_templates` no Supabase
- [ ] Implementar editor básico de templates (textarea com preview)
- [ ] Adicionar sistema de variáveis dinâmicas (`{{candidate_name}}`, etc.)
- [ ] Criar templates padrão (contato inicial, agendamento, feedback)
- [ ] Implementar envio de email com SendGrid/Resend
- [ ] Adicionar histórico de emails enviados
**Critérios de Aceitação:**
- Templates podem ser criados/editados
- Variáveis dinâmicas substituídas corretamente
- Emails enviados via SendGrid/Resend
- Histórico de envios disponível
**Dependências:** T5.2 (Sistema de Slots)
**Estimativa:** 3 dias
**Responsável:** Full-stack Engineer

---

## Sprint 6: Polimento e Lançamento (Semanas 12-13)

### T6.1: Relatórios de Performance Exportáveis
**Backlog:** F2 - Relatórios de Performance
**Descrição:** Criar sistema de relatórios avançados com exportação
**Tarefas:**
- [ ] Implementar queries analíticas complexas
- [ ] Criar dashboard de métricas avançadas
- [ ] Implementar gráficos interativos (Chart.js ou similar)
- [ ] Adicionar filtros temporais (período personalizado)
- [ ] Criar exportação para PDF (react-pdf ou similar)
- [ ] Implementar exportação para Excel/CSV
- [ ] Adicionar agendamento de relatórios periódicos
**Critérios de Aceitação:**
- Dashboard com métricas avançadas
- Gráficos interativos funcionando
- Exportação para PDF/Excel funcionando
- Filtros temporais aplicáveis
**Dependências:** T2.5 (Métricas Básicas), T4.5 (Histórico)
**Estimativa:** 4 dias
**Responsável:** Full-stack Engineer

### T6.2: Algoritmo de Match Automático
**Backlog:** E2 - Match Automático com Novas Vagas
**Descrição:** Implementar sistema de match entre banco de talentos e novas vagas
**Tarefas:**
- [ ] Criar algoritmo de match baseado em skills e experiência
- [ ] Implementar sistema de scoring de compatibilidade
- [ ] Criar notificações para matches relevantes
- [ ] Adicionar filtros de threshold para matches
- [ ] Implementar batch processing para match em massa
- [ ] Criar dashboard de matches ativos
- [ ] Adicionar opt-out para candidatos
**Critérios de Aceitação:**
- Matches identificados automaticamente
- Scoring de compatibilidade calculado
- Notificações enviadas para matches relevantes
- Dashboard de matches funcionando
**Dependências:** T4.4 (Banco de Talentos), T2.1 (Vagas)
**Estimativa:** 4 dias
**Responsável:** Full-stack Engineer

### T6.3: Configurações de LGPD
**Backlog:** G2 - Configurações de LGPD
**Descrição:** Implementar sistema completo de compliance com LGPD
**Tarefas:**
- [ ] Criar sistema de consentimento explícito
- [ ] Implementar página de política de privacidade
- [ ] Criar ferramenta de exclusão de dados (right to be forgotten)
- [ ] Implementar sistema de anonimização de dados
- [ ] Adicionar logs de acesso a dados sensíveis
- [ ] Criar relatório de compliance
- [ ] Implementar data retention policies automáticas
**Critérios de Aceitação:**
- Consentimento explícito registrado
- Exclusão de dados funcionando
- Anonimização implementada
- Logs de acesso disponíveis
**Dependências:** T3.4 (Perfil do Candidato), T4.4 (Banco de Talentos)
**Estimativa:** 3 dias
**Responsável:** Full-stack Engineer

### T6.4: Otimização de Performance e Acessibilidade
**Backlog:** Sprint 6 - Polimento
**Descrição:** Otimizar performance, acessibilidade e experiência mobile
**Tarefas:**
- [ ] Realizar audit Lighthouse e corrigir issues
- [ ] Otimizar bundle size (code splitting, lazy loading)
- [ ] Implementar image optimization
- [ ] Melhorar acessibilidade (ARIA labels, keyboard navigation)
- [ ] Testar e otimizar para mobile
- [ ] Implementar PWA features (offline, install prompt)
- [ ] Adicionar error boundaries e melhor error handling
**Critérios de Aceitação:**
- Lighthouse score > 95
- Bundle otimizado (main bundle < 200KB gzipped)
- Acessibilidade WCAG AA compliant
- Funciona bem em mobile
**Dependências:** Todas as tarefas anteriores
**Estimativa:** 3 dias
**Responsável:** Frontend Engineer

### T6.5: Documentação e Onboarding
**Backlog:** Sprint 6 - Lançamento
**Descrição:** Criar documentação de usuário e material de onboarding
**Tarefas:**
- [ ] Criar documentação de usuário (README, guias)
- [ ] Implementar tour interativo para primeiro uso
- [ ] Criar video tutorials (screen recordings)
- [ ] Preparar kit de onboarding para novos clientes
- [ ] Configurar sistema de help desk (Intercom ou similar)
- [ ] Criar página de FAQ
- [ ] Implementar feedback widget
**Critérios de Aceitação:**
- Documentação completa disponível
- Tour interativo funcionando
- Video tutorials gravados
- Kit de onboarding preparado
**Dependências:** T6.4 (Otimizações)
**Estimativa:** 2 dias
**Responsável:** Frontend Engineer + Product Designer

---

## Dependências Críticas entre Tarefas

### Cadeia 1: Autenticação → Empresa → Vagas → Candidatos
```
T1.1 (Auth) → T1.3 (Empresa) → T2.1 (Vagas) → T3.1 (Upload) → T3.4 (Perfil Candidato)
```

### Cadeia 2: Pipeline → Avaliação → Decisão
```
T4.1 (Kanban) → T4.3 (Avaliação) → T5.3 (Comparação) → T5.4 (Recomendação)
```

### Cadeia 3: Banco Talentos → Match Automático
```
T4.4 (Banco) → T6.2 (Match Automático)
```

### Cadeia 4: Integrações Externas
```
T5.1 (Calendar) → T5.2 (Slots) → T5.5 (Templates Email)
```

## Estimativas de Esforço Total

### Por Sprint:
- **Sprint 0:** ~6 dias (1 semana + buffer)
- **Sprint 1:** ~10 dias (2 semanas)
- **Sprint 2:** ~9 dias (2 semanas)
- **Sprint 3:** ~13 dias (2.5 semanas)
- **Sprint 4:** ~12.5 dias (2.5 semanas)
- **Sprint 5:** ~15 dias (3 semanas)
- **Sprint 6:** ~16 dias (3 semanas)

### Total Estimado:
- **~81.5 dias** de trabalho efetivo
- **~16 semanas** calendário (considerando paralelismo e buffers)
- **~4 meses** para MVP completo

## Próximos Passos Imediatos

1. **Revisar tarefas** com equipe técnica para ajustar estimativas
2. **Atribuir responsáveis** para Sprint 0
3. **Configurar ferramentas** de gestão (Linear, Jira, Trello)
4. **Criar repositório** e configurar acesso da equipe
5. **Iniciar Sprint 0** conforme roadmap

---

*Documento gerado pelo Project Planner - ET-05*
*Base: .plans/01-backlog.md, .plans/02-roadmap.md, .docs/03-arquitetura-sistema.md*
*Detalhamento: 35 tarefas técnicas com dependências e estimativas*

