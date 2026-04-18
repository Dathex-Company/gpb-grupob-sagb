# 02. Banco de Dados - Tarefas de Implementação (HumanG MVP Supabase)

## Visão Geral
Este documento detalha as tarefas técnicas executáveis para implementar a modelagem de dados do HumanG no Supabase PostgreSQL. Baseado no documento `.specs/04-modelagem-de-dados.md`.

## Princípios da Implementação
1. **RLS First:** Segurança implementada antes de qualquer dado
2. **Incremental Deployment:** Executar em ordem correta considerando dependências
3. **Version Control:** Manter scripts SQL em sistema de migrações
4. **Testing Each Step:** Validar cada etapa antes de prosseguir
5. **Documentation:** Registrar alterações e configurações

---

## Sprint 0: Setup Supabase (Semana 0)

### DB0.1: Criação do Projeto Supabase
**Descrição:** Criar projeto Supabase e configurar ambiente básico
**Tarefas:**
- [ ] Criar conta/organização no Supabase (se não existir)
- [ ] Criar novo projeto `humang-mvp` na região South America (São Paulo)
- [ ] Configurar projeto com database name: `humang_db`
- [ ] Anotar credentials: Project URL, anon key, service role key
- [ ] Configurar environment variables no `.env` do projeto
- [ ] Instalar Supabase CLI localmente
**Critérios de Aceitação:**
- Projeto criado no dashboard Supabase
- URL do projeto acessível
- Credentials disponíveis em ambiente seguro
- CLI instalado localmente
**Dependências:** Nenhuma
**Estimativa:** 0.5 dia
**Responsável:** Database Engineer

### DB0.2: Configuração Inicial do Banco
**Descrição:** Configurar extensões e settings básicos do PostgreSQL
**Tarefas:**
- [ ] Habilitar extensão `pgcrypto` para UUID generation
- [ ] Habilitar extensão `uuid-ossp` (se necessário)
- [ ] Configurar timezone para `America/Sao_Paulo`
- [ ] Configurar locale para `pt_BR.UTF-8`
- [ ] Criar schema inicial `public` se não existir
- [ ] Verificar permissões de roles padrão
**Critérios de Aceitação:**
- Extensões habilitadas no banco
- Timezone configurado corretamente
- Permissões básicas funcionando
**Dependências:** DB0.1 (Projeto Criado)
**Estimativa:** 0.5 dia
**Responsável:** Database Engineer

### DB0.3: Configuração de Autenticação
**Descrição:** Configurar Supabase Auth com providers e settings
**Tarefas:**
- [ ] Configurar Email Auth provider (padrão)
- [ ] Configurar Google OAuth (opcional para MVP)
- [ ] Definir site URL para `https://humang.netlify.app`
- [ ] Configurar redirect URLs (localhost + Netlify)
- [ ] Definir template de emails de confirmação
- [ ] Configurar rate limiting adequado
**Critérios de Aceitação:**
- Email Auth funcionando
- Site URL e redirects configurados
- Templates de email definidos
**Dependências:** DB0.1 (Projeto Criado)
**Estimativa:** 0.5 dia
**Responsável:** Database Engineer

### DB0.4: Configuração de Storage
**Descrição:** Configurar buckets para arquivos do sistema
**Tarefas:**
- [ ] Criar bucket `resumes` para currículos
- [ ] Configurar políticas de acesso (RLS) para o bucket
- [ ] Definir tamanho máximo de arquivo (10MB)
- [ ] Configurar tipos permitidos (.pdf, .doc, .docx)
- [ ] Criar bucket `company-assets` para logos
- [ ] Configurar cache policies adequadas
**Critérios de Aceitação:**
- Buckets criados e acessíveis
- Políticas de acesso configuradas
- Limites de tamanho e tipos aplicados
**Dependências:** DB0.1 (Projeto Criado)
**Estimativa:** 0.5 dia
**Responsável:** Database Engineer

---

## Sprint 1: Schema Básico e Tabelas (Semana 1)

### DB1.1: Criação da Tabela Companies
**Descrição:** Implementar tabela companies com RLS policies
**Script:**
```sql
-- Executar via Supabase Dashboard SQL Editor
-- Verificar se não existe primeiro
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  logo_url TEXT,
  description TEXT,
  industry TEXT,
  size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  cultural_values JSONB DEFAULT '[]'::jsonb,
  location_city TEXT,
  location_state TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'starter', 'growth', 'enterprise')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE companies
- [ ] Criar índices: `idx_companies_domain`, `idx_companies_subscription`
- [ ] Habilitar RLS: `ALTER TABLE companies ENABLE ROW LEVEL SECURITY;`
- [ ] Criar políticas RLS conforme especificação
- [ ] Testar políticas com usuário autenticado
- [ ] Validar constraints e tipos de dados
**Critérios de Aceitação:**
- Tabela companies criada com sucesso
- Índices criados e otimizados
- RLS policies aplicadas e funcionando
- Constraints validando dados corretamente
**Dependências:** DB0.2 (Configuração Inicial)
**Estimativa:** 1 dia
**Responsável:** Database Engineer

### DB1.2: Criação da Tabela Profiles
**Descrição:** Implementar tabela profiles (extensão de auth.users)
**Script:**
```sql
-- Executar após companies estar criada
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'recruiter', 'interviewer', 'candidate')),
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  language TEXT DEFAULT 'pt-BR',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE profiles
- [ ] Criar índices: `idx_profiles_company_id`, `idx_profiles_role`
- [ ] Habilitar RLS: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`
- [ ] Criar políticas RLS (pessoal, admin, etc.)
- [ ] Criar trigger para criação automática de profile após signup
- [ ] Testar integração com auth.users
**Critérios de Aceitação:**
- Tabela profiles criada com foreign key para auth.users
- Índices otimizando queries comuns
- RLS policies permitindo acesso apropriado
- Trigger criando profile automaticamente
**Dependências:** DB1.1 (Tabela Companies), DB0.3 (Auth Configurado)
**Estimativa:** 1.5 dias
**Responsável:** Database Engineer

### DB1.3: Criação da Tabela Jobs
**Descrição:** Implementar tabela jobs com validações complexas
**Script:**
```sql
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  nice_to_have JSONB DEFAULT '[]'::jsonb,
  location_type TEXT DEFAULT 'hybrid' CHECK (location_type IN ('onsite', 'remote', 'hybrid')),
  location_city TEXT,
  location_state TEXT,
  salary_range_min DECIMAL(10,2),
  salary_range_max DECIMAL(10,2),
  salary_currency TEXT DEFAULT 'BRL',
  employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
  experience_level TEXT DEFAULT 'mid' CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paused', 'closed', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  target_start_date DATE,
  deadline DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE jobs
- [ ] Criar índices: `idx_jobs_company_status`, `idx_jobs_deadline`, `idx_jobs_created_at`, `idx_jobs_requirements`
- [ ] Habilitar RLS
- [ ] Criar políticas RLS (visibilidade por empresa)
- [ ] Validar todos os CHECK constraints
- [ ] Testar queries com filtros comuns
**Critérios de Aceitação:**
- Tabela jobs criada com todas as constraints
- Índices GIN funcionando para JSONB queries
- RLS policies permitindo acesso correto
- Validações de enum funcionando
**Dependências:** DB1.1 (Companies), DB1.2 (Profiles)
**Estimativa:** 2 dias
**Responsável:** Database Engineer

### DB1.4: Criação da Tabela Candidates
**Descrição:** Implementar tabela candidates com LGPD compliance
**Script:**
```sql
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  current_title TEXT,
  current_company TEXT,
  experience_years INTEGER,
  location_city TEXT,
  location_state TEXT,
  willing_to_relocate BOOLEAN DEFAULT false,
  resume_url TEXT,
  resume_text TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'screened', 'contacted', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
  stage TEXT DEFAULT 'applied' CHECK (stage IN ('applied', 'screening', 'interview', 'decision', 'offer')),
  score_technical DECIMAL(5,2) DEFAULT 0,
  score_cultural DECIMAL(5,2) DEFAULT 0,
  score_total DECIMAL(5,2) DEFAULT 0,
  consent_given BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE candidates
- [ ] Criar índices básicos: `idx_candidates_job_status`, `idx_candidates_email`, `idx_candidates_stage`
- [ ] Habilitar RLS
- [ ] Criar políticas RLS complexas (join com jobs → profiles → companies)
- [ ] Validar array operations (tags TEXT[])
- [ ] Testar consent_given workflow
**Critérios de Aceitação:**
- Tabela candidates criada com campos LGPD
- Índices suportando queries de pipeline
- RLS policies complexas funcionando
- Array operations testadas
**Dependências:** DB1.3 (Jobs)
**Estimativa:** 2 dias
**Responsável:** Database Engineer

---

## Sprint 2: Tabelas Relacionais e Índices (Semana 2)

### DB2.1: Criação da Tabela Analyses
**Descrição:** Implementar tabela para análises técnicas e culturais
**Script:**
```sql
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'cultural', 'logistical', 'composite')),
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  confidence DECIMAL(3,2) DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  breakdown JSONB DEFAULT '{}'::jsonb,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  generated_by TEXT DEFAULT 'system' CHECK (generated_by IN ('system', 'human', 'hybrid')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE analyses
- [ ] Criar índices: `idx_analyses_candidate`, `idx_analyses_type`, `idx_analyses_score`
- [ ] Habilitar RLS
- [ ] Criar políticas RLS herdando de candidates
- [ ] Validar CHECK constraints (score, confidence)
- [ ] Testar array fields (strengths, weaknesses)
**Critérios de Aceitação:**
- Tabela analyses criada
- Índices para queries por score e tipo
- RLS policies herdando corretamente
- Validações de score funcionando
**Dependências:** DB1.4 (Candidates)
**Estimativa:** 1.5 dias
**Responsável:** Database Engineer

### DB2.2: Criação da Tabela Interviews
**Descrição:** Implementar sistema de agendamento de entrevistas
**Script:**
```sql
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('screening', 'technical', 'cultural', 'managerial', 'final')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  interviewer_ids UUID[] DEFAULT '{}',
  meeting_link TEXT,
  meeting_notes TEXT,
  recording_url TEXT,
  feedback JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE interviews
- [ ] Criar índices: `idx_interviews_candidate`, `idx_interviews_scheduled`, `idx_interviews_status`, `idx_interviews_interviewer`
- [ ] Habilitar RLS
- [ ] Criar políticas RLS complexas (candidate chain + interviewer array)
- [ ] Validar UUID[] operations
- [ ] Testar temporal queries (scheduled_start)
**Critérios de Aceitação:**
- Tabela interviews criada com array field
- Índices GIN para UUID[] funcionando
- RLS policies para interviewers funcionando
- Queries temporais otimizadas
**Dependências:** DB1.4 (Candidates), DB1.2 (Profiles)
**Estimativa:** 2 dias
**Responsável:** Database Engineer

### DB2.3: Criação da Tabela Talent Pool
**Descrição:** Implementar banco de talentos para candidatos rejeitados
**Script:**
```sql
CREATE TABLE IF NOT EXISTS talent_pool (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'placed', 'archived')),
  category TEXT CHECK (category IN ('high_potential', 'technical_expert', 'cultural_fit', 'future_opportunity')),
  skills TEXT[] DEFAULT '{}',
  target_roles TEXT[] DEFAULT '{}',
  match_score DECIMAL(5,2) DEFAULT 0,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  consent_keep_data BOOLEAN DEFAULT false,
  consent_contact_again BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(candidate_id)
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE talent_pool
- [ ] Criar índices: `idx_talent_pool_status`, `idx_talent_pool_match_score`, `idx_talent_pool_skills`
- [ ] Habilitar RLS
- [ ] Criar políticas RLS herdando de candidates
- [ ] Validar UNIQUE constraint candidate_id
- [ ] Testar array operations com skills e roles
**Critérios de Aceitação:**
- Tabela talent_pool criada com constraint UNIQUE
- Índices GIN para array searches funcionando
- RLS policies herdando corretamente
- Consentimentos LGPD implementados
**Dependências:** DB1.4 (Candidates)
**Estimativa:** 1.5 dias
**Responsável:** Database Engineer

### DB2.4: Criação da Tabela Activities
**Descrição:** Implementar sistema de auditoria e timeline
**Script:**
```sql
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**Tarefas:**
- [ ] Executar script CREATE TABLE activities
- [ ] Criar índices: `idx_activities_entity`, `idx_activities_created_at`, `idx_activities_actor`
- [ ] Habilitar RLS
- [ ] Criar políticas RLS restritas (apenas admins)
- [ ] Validar JSONB operations
- [ ] Testar queries por entity_type/entity_id
**Critérios de Aceitação:**
- Tabela activities criada para auditoria
- Índices compostos otimizando entity queries
- RLS policies restritas funcionando
- JSONB fields armazenando old/new data
**Dependências:** DB1.2 (Profiles)
**Estimativa:** 1 dia
**Responsável:** Database Engineer

### DB2.5: Índices Avançados de Performance
**Descrição:** Criar índices adicionais para otimização
**Scripts:**
```sql
-- Índices para busca de candidatos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_email_lower ON candidates(LOWER(email));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_resume_text_gin ON candidates USING gin(to_tsvector('portuguese', resume_text));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_job_status_score ON candidates(job_id, status, score_total DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC) WHERE status NOT IN ('archived', 'deleted');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_talent_pool_skills_gin ON talent_pool USING gin(skills);

-- Índices para RLS performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_company_role ON profiles(company_id, role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_job ON candidates(job_id);
```
**Tarefas:**
- [ ] Executar índices para busca de candidatos
- [ ] Executar índices para RLS performance
- [ ] Validar criação CONCURRENTLY (sem downtime)
- [ ] Testar performance com EXPLAIN ANALYZE
- [ ] Ajustar índices baseado em query patterns
**Critérios de Aceitação:**
- Todos os índices criados com sucesso
- Queries otimizadas visivelmente
- Criação CONCURRENTLY sem bloquear tabelas
- Full-text search funcionando em português
**Dependências:** Todas as tabelas criadas
**Estimativa:** 1 dia
**Responsável:** Database Engineer

---

## Sprint 3: Triggers, Functions e Views (Semana 3)

### DB3.1: Função e Triggers para updated_at
**Descrição:** Implementar sistema automático de atualização de timestamps
**Script:**
```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_talent_pool_updated_at BEFORE UPDATE ON talent_pool FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
**Tarefas:**
- [ ] Criar função `update_updated_at_column`
- [ ] Aplicar trigger em `profiles`
- [ ] Aplicar trigger em `companies`
- [ ] Aplicar trigger em `jobs`
- [ ] Aplicar trigger em `candidates`
- [ ] Aplicar trigger em `talent_pool`
- [ ] Testar triggers com updates
**Critérios de Aceitação:**
- Função criada e funcionando
- Triggers aplicados em todas as tabelas relevantes
- updated_at atualizado automaticamente
- Sem impacto de performance significativo
**Dependências:** Todas as tabelas criadas
**Estimativa:** 0.5 dia
**Responsável:** Database Engineer

### DB3.2: Função e Trigger para Cálculo de Score Total
**Descrição:** Implementar cálculo automático de score_total
**Script:**
```sql
-- Função para calcular score_total
CREATE OR REPLACE FUNCTION calculate_candidate_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.score_total = COALESCE(NEW.score_technical, 0) * 0.7 + COALESCE(NEW.score_cultural, 0) * 0.3;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para candidates
CREATE TRIGGER update_candidate_score BEFORE INSERT OR UPDATE OF score_technical, score_cultural ON candidates
  FOR EACH ROW EXECUTE FUNCTION calculate_candidate_score();
```
**Tarefas:**
- [ ] Criar função `calculate_candidate_score`
- [ ] Aplicar trigger em `candidates`
- [ ] Testar com INSERT de candidato
- [ ] Testar com UPDATE de score_technical
- [ ] Testar com UPDATE de score_cultural
- [ ] Validar cálculo (70% técnico + 30% cultural)
**Critérios de Aceitação:**
- Função calculando score_total corretamente
- Trigger executando em INSERT e UPDATE
- Cálculo seguindo fórmula especificada
- NULL values tratados adequadamente
**Dependências:** DB1.4 (Candidates)
**Estimativa:** 0.5 dia
**Responsável:** Database Engineer

### DB3.3: Função e Triggers para Log de Atividades
**Descrição:** Implementar sistema automático de auditoria
**Script:**
```sql
-- Função para log de atividades
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_actor_id UUID;
  v_old_data JSONB;
  v_new_data JSONB;
  v_action TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'updated';
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'deleted';
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
  END IF;

  BEGIN
    v_actor_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := NULL;
  END;

  INSERT INTO activities (
    entity_type,
    entity_id,
    action,
    actor_id,
    old_data,
    new_data
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_action,
    v_actor_id,
    v_old_data,
    v_new_data
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ language 'plpgsql';

-- Aplicar triggers
CREATE TRIGGER log_candidate_activities AFTER INSERT OR UPDATE OR DELETE ON candidates FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_job_activities AFTER INSERT OR UPDATE OR DELETE ON jobs FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_interview_activities AFTER INSERT OR UPDATE OR DELETE ON interviews FOR EACH ROW EXECUTE FUNCTION log_activity();
```
**Tarefas:**
- [ ] Criar função `log_activity`
- [ ] Aplicar trigger em `candidates`
- [ ] Aplicar trigger em `jobs`
- [ ] Aplicar trigger em `interviews`
- [ ] Testar INSERT, UPDATE, DELETE
- [ ] Verificar logs na tabela activities
**Critérios de Aceitação:**
- Função capturando todas as operações
- Triggers aplicados nas tabelas principais
- Logs sendo inseridos na tabela activities
- auth.uid() sendo capturado corretamente
**Dependências:** DB2.4 (Activities), DB0.3 (Auth)
**Estimativa:** 1 dia
**Responsável:** Database Engineer

### DB3.4: Views para Dashboard
**Descrição:** Criar views otimizadas para queries do dashboard
**Scripts:**
```sql
-- View: Pipeline da Vaga
CREATE OR REPLACE VIEW job_pipeline AS
SELECT 
  j.id as job_id,
  j.title as job_title,
  j.status as job_status,
  COUNT(c.id) as total_candidates,
  COUNT(CASE WHEN c.status = 'new' THEN 1 END) as new_count,
  COUNT(CASE WHEN c.status = 'screened' THEN 1 END) as screened_count,
  COUNT(CASE WHEN c.status = 'interviewing' THEN 1 END) as interviewing_count,
  COUNT(CASE WHEN c.status = 'offered' THEN 1 END) as offered_count,
  COUNT(CASE WHEN c.status = 'hired' THEN 1 END) as hired_count,
  AVG(c.score_total) as avg_score,
  MAX(c.created_at) as last_application_date
FROM jobs j
LEFT JOIN candidates c ON j.id = c.job_id
GROUP BY j.id, j.title, j.status;

-- View: Performance do Recrutador
CREATE OR REPLACE VIEW recruiter_performance AS
SELECT 
  p.id as recruiter_id,
  p.full_name as recruiter_name,
  COUNT(DISTINCT c.id) as total_candidates_managed,
  COUNT(DISTINCT CASE WHEN c.status = 'hired' THEN c.id END) as hired_count,
  AVG(CASE WHEN c.status = 'hired' THEN c.score_total END) as avg_hired_score,
  AVG(EXTRACT(EPOCH FROM (c.updated_at - c.created_at))/86400) as avg_time_to_hire_days,
  COUNT(DISTINCT i.id) as interviews_scheduled,
  COUNT(DISTINCT CASE WHEN i.status = 'completed' THEN i.id END) as interviews_completed
FROM profiles p
LEFT JOIN candidates c ON p.id = c.created_by
LEFT JOIN interviews i ON c.id = i.candidate_id
WHERE p.role IN ('admin', 'recruiter')
GROUP BY p.id, p.full_name;

-- View: Métricas da Empresa
CREATE OR REPLACE VIEW company_metrics AS
SELECT 
  c.id as company_id,
  c.name as company_name,
  COUNT(DISTINCT j.id) as total_jobs,
  COUNT(DISTINCT CASE WHEN j.status = 'open' THEN j.id END) as open_jobs,
  COUNT(DISTINCT ca.id) as total_candidates,
  COUNT(DISTINCT CASE WHEN ca.status = 'hired' THEN ca.id END) as hired_candidates,
  AVG(ca.score_total) as avg_candidate_score,
  COUNT(DISTINCT tp.id) as talent_pool_size,
  COUNT(DISTINCT p.id) as active_users
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id
LEFT JOIN candidates ca ON j.id = ca.job_id
LEFT JOIN talent_pool tp ON ca.id = tp.candidate_id AND tp.status = 'active'
LEFT JOIN profiles p ON c.id = p.company_id AND p.role != 'candidate'
GROUP BY c.id, c.name;
```
**Tarefas:**
- [ ] Criar view `job_pipeline`
- [ ] Criar view `recruiter_performance`
- [ ] Criar view `company_metrics`
- [ ] Testar queries com EXPLAIN ANALYZE
- [ ] Otimizar views se necessário
- [ ] Documentar views para uso do frontend
**Critérios de Aceitação:**
- Views criadas e funcionando
- Queries otimizadas com índices
- RLS aplicada nas views (se necessário)
- Performance aceitável para dashboard
**Dependências:** Todas as tabelas e índices
**Estimativa:** 1.5 dias
**Responsável:** Database Engineer

---

## Sprint 4: LGPD, Procedures e Migrações (Semana 4)

### DB4.1: Procedures para Anonimização LGPD
**Descrição:** Implementar procedures para compliance com LGPD
**Script:**
```sql
-- Função para anonimizar candidatos após 2 anos
CREATE OR REPLACE PROCEDURE anonymize_old_candidates()
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE candidates
  SET 
    email = CONCAT('anon_', SUBSTRING(MD5(id::text), 1, 8), '@anonymized.humang'),
    full_name = CONCAT('Candidate ', SUBSTRING(MD5(id::text), 1, 6)),
    phone = NULL,
    linkedin_url = NULL,
    current_company = NULL,
    resume_text = NULL,
    metadata = jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{anonymized_at}',
      to_jsonb(NOW()::text)
    )
  WHERE 
    created_at < NOW() - INTERVAL '2 years'
    AND consent_given = false
    AND status NOT IN ('hired', 'interviewing');
END;
$$;

-- Função para exclusão de dados (Right to be Forgotten)
CREATE OR REPLACE PROCEDURE delete_candidate_data(candidate_uuid UUID)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM analyses WHERE candidate_id = candidate_uuid;
  DELETE FROM interviews WHERE candidate_id = candidate_uuid;
  DELETE FROM talent_pool WHERE candidate_id = candidate_uuid;
  DELETE FROM candidates WHERE id = candidate_uuid;
  
  INSERT INTO activities (
    entity_type,
    entity_id,
    action,
    actor_id,
    old_data,
    new_data
  ) VALUES (
    'candidate',
    candidate_uuid,
    'gdpr_deleted',
    auth.uid(),
    NULL,
    jsonb_build_object('deleted_at', NOW(), 'reason', 'GDPR request')
  );
END;
$$;
```
**Tarefas:**
- [ ] Criar procedure `anonymize_old_candidates`
- [ ] Criar procedure `delete_candidate_data`
- [ ] Testar anonimização com dados de teste
- [ ] Testar exclusão com dados de teste
- [ ] Validar logging na tabela activities
- [ ] Documentar procedures para uso administrativo
**Critérios de Aceitação:**
- Procedures criadas e funcionando
- Anonimização seguindo padrões LGPD
- Exclusão em cascata funcionando
- Logging adequado para auditoria
**Dependências:** Todas as tabelas relacionadas
**Estimativa:** 1.5 dias
**Responsável:** Database Engineer

### DB4.2: Procedure de Limpeza Automática
**Descrição:** Implementar limpeza automática de dados temporários
**Script:**
```sql
-- Agendar limpeza de dados temporários
CREATE OR REPLACE PROCEDURE cleanup_temporary_data()
LANGUAGE plpgsql
AS $$
BEGIN
  -- Excluir candidatos sem consentimento após 30 dias
  DELETE FROM candidates 
  WHERE consent_given = false 
    AND created_at < NOW() - INTERVAL '30 days';
    
  -- Excluir vagas rascunho antigas
  DELETE FROM jobs 
  WHERE status = 'draft' 
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$;
```
**Tarefas:**
- [ ] Criar procedure `cleanup_temporary_data`
- [ ] Testar com dados de teste
- [ ] Configurar cron job no Supabase (se suportado)
- [ ] Documentar schedule recomendado
- [ ] Adicionar logging de execução
**Critérios de Aceitação:**
- Procedure criada e funcionando
- Limpeza seguindo regras de negócio
- Cron job configurado (ou instruções)
- Logging de execução implementado
**Dependências:** DB1.4 (Candidates), DB1.3 (Jobs)
**Estimativa:** 1 dia
**Responsável:** Database Engineer

### DB4.3: Sistema de Migrações
**Descrição:** Configurar sistema de migrações versionadas
**Estrutura:**
```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_triggers_functions.sql
│   ├── 003_create_views.sql
│   └── 004_seed_data.sql
├── seeds/
│   └── development_data.sql
└── config.toml
```
**Tarefas:**
- [ ] Criar estrutura de diretórios `supabase/migrations/`
- [ ] Criar `001_initial_schema.sql` com todas as CREATE TABLE
- [ ] Criar `002_add_triggers_functions.sql` com triggers e functions
- [ ] Criar `003_create_views.sql` com views
- [ ] Criar `004_seed_data.sql` com dados de desenvolvimento
- [ ] Configurar `config.toml` para projeto
- [ ] Testar migrações com Supabase CLI
**Critérios de Aceitação:**
- Estrutura de migrações criada
- Scripts SQL organizados e funcionais
- CLI commands testados localmente
- Rollback strategies consideradas
**Dependências:** Todos os scripts anteriores
**Estimativa:** 2 dias
**Responsável:** Database Engineer

### DB4.4: Dados de Desenvolvimento (Seeds)
**Descrição:** Criar dados de teste para desenvolvimento
**Script:**
```sql
-- Inserir dados de teste para desenvolvimento
INSERT INTO companies (name, domain, industry) VALUES
  ('TechStartup Inc', 'techstartup.com', 'Technology'),
  ('HealthCorp', 'healthcorp.com', 'Healthcare')
ON CONFLICT (domain) DO NOTHING;

-- Inserir perfis de teste (após auth.users serem criados manualmente)
-- IDs hardcoded para desenvolvimento
INSERT INTO profiles (id, company_id, role, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM companies WHERE domain = 'techstartup.com'), 'admin', 'Carlos Admin'),
  ('22222222-2222-2222-2222-222222222222', (SELECT id FROM companies WHERE domain = 'techstartup.com'), 'recruiter', 'Ana Recruiter')
ON CONFLICT (id) DO NOTHING;
```
**Tarefas:**
- [ ] Criar script `development_data.sql`
- [ ] Inserir companies de teste
- [ ] Inserir profiles de teste (com IDs conhecidos)
- [ ] Inserir jobs de teste
- [ ] Inserir candidates de teste
- [ ] Testar dados com queries do frontend
**Critérios de Aceitação:**
- Dados de desenvolvimento criados
- Relacionamentos mantidos corretamente
- IDs consistentes para testes
- Dados representativos do domínio
**Dependências:** Todas as tabelas criadas
**Estimativa:** 1 dia
**Responsável:** Database Engineer

### DB4.5: Validação e Testes
**Descrição:** Validar todo o schema com testes automatizados
**Scripts:**
```sql
-- Verificar se todas as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar políticas RLS
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Testar performance de queries comuns
EXPLAIN ANALYZE
SELECT * FROM job_pipeline WHERE job_status = 'open';

-- Monitorar uso do banco
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as db_size,
  (SELECT COUNT(*) FROM candidates) as total_candidates,
  (SELECT COUNT(*) FROM jobs) as total_jobs,
  (SELECT COUNT(*) FROM companies) as total_companies;
```
**Tarefas:**
- [ ] Executar verificação de tabelas criadas
- [ ] Executar verificação de políticas RLS
- [ ] Executar testes de performance
- [ ] Monitorar uso do banco
- [ ] Documentar resultados dos testes
- [ ] Criar relatório de validação
**Critérios de Aceitação:**
- Todas as tabelas existem
- Todas as políticas RLS aplicadas
- Performance aceitável nas queries
- Uso do banco dentro dos limites
**Dependências:** Todas as implementações anteriores
**Estimativa:** 1 dia
**Responsável:** Database Engineer

---

## Sprint 5: Integração e TypeScript (Semana 5)

### DB5.1: Geração de Tipos TypeScript
**Descrição:** Gerar tipos TypeScript do database schema
**Comandos:**
```bash
# Instalar Supabase CLI globalmente
npm install supabase --save-dev

# Fazer login na CLI
npx supabase login

# Gerar tipos TypeScript
npx supabase gen types typescript --project-id "seu-project-id" > src/types/database.types.ts
```
**Tarefas:**
- [ ] Instalar Supabase CLI no projeto
- [ ] Configurar authentication na CLI
- [ ] Gerar tipos TypeScript do schema
- [ ] Verificar arquivo gerado `src/types/database.types.ts`
- [ ] Configurar import no projeto
- [ ] Testar uso dos tipos no código
**Critérios de Aceitação:**
- Tipos TypeScript gerados com sucesso
- Arquivo organizado em estrutura apropriada
- Tipos sendo usados no frontend
- IntelliSense funcionando no VS Code
**Dependências:** Schema completo implementado
**Estimativa:** 0.5 dia
**Responsável:** Frontend Engineer com Database Engineer

### DB5.2: Configuração do Cliente Supabase
**Descrição:** Configurar cliente Supabase no frontend com tipos
**Código:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```
**Tarefas:**
- [ ] Instalar pacote `@supabase/supabase-js`
- [ ] Configurar environment variables
- [ ] Criar arquivo `src/lib/supabase.ts`
- [ ] Configurar cliente com tipos do database
- [ ] Testar conexão com queries simples
- [ ] Configurar error handling
**Critérios de Aceitação:**
- Cliente Supabase configurado
- Environment variables funcionando
- Types sendo inferidos corretamente
- Conexão testada com sucesso
**Dependências:** DB5.1 (Tipos TypeScript)
**Estimativa:** 0.5 dia
**Responsável:** Frontend Engineer

### DB5.3: Queries Otimizadas para Frontend
**Descrição:** Criar queries otimizadas e documentadas para uso no frontend
**Exemplos:**
```typescript
// src/lib/queries/jobs.ts
import { supabase } from '@/lib/supabase'

export async function getCompanyJobs(companyId: string) {
  return supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
}

export async function getJobPipeline(jobId: string) {
  return supabase
    .from('job_pipeline') // usando view
    .select('*')
    .eq('job_id', jobId)
    .single()
}
```
**Tarefas:**
- [ ] Criar arquivo `src/lib/queries/jobs.ts`
- [ ] Criar arquivo `src/lib/queries/candidates.ts`
- [ ] Criar arquivo `src/lib/queries/companies.ts`
- [ ] Criar arquivo `src/lib/queries/analytics.ts` (para views)
- [ ] Documentar queries com exemplos de uso
- [ ] Testar todas as queries
**Critérios de Aceitação:**
- Queries organizadas por domínio
- Views sendo utilizadas quando apropriado
- Documentação clara para desenvolvedores
- Todas as queries testadas
**Dependências:** DB5.2 (Cliente Supabase), DB3.4 (Views)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer com Database Engineer

### DB5.4: Sistema de Subscriptions (Realtime)
**Descrição:** Configurar subscriptions para dados em tempo real
**Código:**
```typescript
// Exemplo de subscription para pipeline changes
const channel = supabase
  .channel('candidate-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'candidates',
      filter: `job_id=eq.${jobId}`
    },
    (payload) => {
      console.log('Candidate updated:', payload)
      // Atualizar UI
    }
  )
  .subscribe()
```
**Tarefas:**
- [ ] Configurar subscription para candidates (pipeline)
- [ ] Configurar subscription para interviews (calendar)
- [ ] Configurar subscription para activities (timeline)
- [ ] Implementar cleanup de subscriptions
- [ ] Testar realtime updates
- [ ] Documentar padrões de subscription
**Critérios de Aceitação:**
- Subscriptions funcionando para mudanças
- Realtime updates refletindo no UI
- Cleanup adequado para memory leaks
- Performance aceitável com múltiplas subscriptions
**Dependências:** DB5.2 (Cliente Supabase)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer

### DB5.5: Upload para Supabase Storage
**Descrição:** Implementar upload de currículos para Supabase Storage
**Código:**
```typescript
// Upload de currículo
async function uploadResume(file: File, candidateId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${candidateId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file)
    
  if (error) throw error
  
  // Atualizar candidate com resume_url
  return supabase
    .from('candidates')
    .update({ resume_url: data.path })
    .eq('id', candidateId)
}
```
**Tarefas:**
- [ ] Implementar função de upload para currículos
- [ ] Implementar validação de tipo/tamanho
- [ ] Configurar RLS policies do bucket
- [ ] Implementar progress indicator
- [ ] Testar upload com diferentes tipos de arquivo
- [ ] Implementar retry logic
**Critérios de Aceitação:**
- Upload funcionando para PDF/DOC/DOCX
- Validações aplicadas no frontend e backend
- Progress indicator visível
- RLS garantindo acesso apropriado
**Dependências:** DB0.4 (Storage Configurado), DB5.2 (Cliente Supabase)
**Estimativa:** 1.5 dias
**Responsável:** Frontend Engineer

---

## Dependências Críticas

### Ordem de Execução:
```
DB0.1 → DB0.2 → DB0.3 → DB0.4 (Setup)
↓
DB1.1 → DB1.2 → DB1.3 → DB1.4 (Tabelas Base)
↓
DB2.1 → DB2.2 → DB2.3 → DB2.4 → DB2.5 (Tabelas Relacionais + Índices)
↓
DB3.1 → DB3.2 → DB3.3 → DB3.4 (Triggers + Views)
↓
DB4.1 → DB4.2 → DB4.3 → DB4.4 → DB4.5 (LGPD + Migrações)
↓
DB5.1 → DB5.2 → DB5.3 → DB5.4 → DB5.5 (Integração Frontend)
```

### Dependências de Schema:
- `profiles` depende de `companies` e `auth.users`
- `jobs` depende de `companies` e `profiles`
- `candidates` depende de `jobs`
- `analyses`, `interviews`, `talent_pool` dependem de `candidates`
- `activities` depende de `profiles`
- Todas as views dependem de múltiplas tabelas

## Estimativas de Esforço Total

### Por Sprint:
- **Sprint 0 (Setup):** 2 dias
- **Sprint 1 (Tabelas Base):** 6.5 dias
- **Sprint 2 (Tabelas Relacionais):** 8 dias
- **Sprint 3 (Triggers e Views):** 3.5 dias
- **Sprint 4 (LGPD e Migrações):** 6.5 dias
- **Sprint 5 (Integração):** 5.5 dias

### Total Estimado:
- **~32 dias** de trabalho de Database Engineer
- **~6.5 semanas** calendário
- **Pode ser executado em paralelo** com desenvolvimento frontend após Sprint 2

## Próximos Passos Imediatos

1. **Iniciar Sprint 0:** Configurar projeto Supabase
2. **Coordenar com Frontend:** Alinhar tipos TypeScript e queries
3. **Configurar CI/CD:** Para migrações de banco
4. **Documentar operações:** Para time de desenvolvimento
5. **Monitorar performance:** Ajustar índices baseado em uso real

---

## Anexos

### Anexo A: Script de Criação Completo
Ver `.specs/04-modelagem-de-dados.md` para scripts SQL completos.

### Anexo B: Configuração de Ambiente
```bash
# Environment variables necessárias
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=seu-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key  # apenas backend
```

### Anexo C: Comandos Supabase CLI Úteis
```bash
# Inicializar projeto local
npx supabase init

# Iniciar ambiente local
npx supabase start

# Criar nova migração
npx supabase migration new nome_da_migracao

# Aplicar migrações
npx supabase db reset
```

### Anexo D: Monitoramento Recomendado
```sql
-- Query para monitorar performance
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

*Documento gerado pelo Database Engineer - ET-06*
*Base: .specs/04-modelagem-de-dados.md (modelagem completa)*
*Integração: .docs/03-arquitetura-sistema.md (arquitetura Supabase + Netlify)*
*Foco: Tarefas executáveis para implementação prática do banco de dados*

**Status:** ET-06 Database Engineer - Entregável 2/2 Completo
**Próximo agente:** Integrations Engineer (ET-06) - Criar `.specs/05-integracoes.md`
