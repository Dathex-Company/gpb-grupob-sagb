# 04. Modelagem de Dados - HumanG (MVP Supabase + Netlify)

## 1. Visão Geral da Modelagem

### 1.1. Contexto do MVP
Esta modelagem de dados está otimizada para:
- **Stack Supabase PostgreSQL** com todas as suas features
- **Performance de queries** comuns do sistema HumanG
- **Row Level Security (RLS)** nativa do Supabase
- **LGPD compliance** com consentimento explícito
- **Custo zero inicial** usando tier gratuito do Supabase

### 1.2. Princípios de Design
- **Normalização:** 3ª Forma Normal para consistência
- **RLS First:** Segurança implementada a nível de banco
- **JSONB estratégico:** Para dados flexíveis sem muitas tabelas
- **Índices inteligentes:** Otimizados para queries do dashboard
- **Soft delete padrão:** Manter histórico para LGPD

### 1.3. Relação com Arquitetura Existente
Esta modelagem implementa o conceito descrito em `.specs/01-entidades-e-dados.md` adaptado para:
- **Supabase PostgreSQL** ao invés de schema genérico
- **Simplificação do MVP** (menos tabelas que o modelo completo)
- **Foco em queries do dashboard** e pipeline visual
- **Integração com Supabase Auth** nativo

## 2. Schema PostgreSQL para Supabase

### 2.1. Extensão do Schema `auth.users`
O Supabase já fornece a tabela `auth.users`. Vamos estender com uma tabela `profiles`:

```sql
-- Tabela de perfis de usuário (extensão de auth.users)
CREATE TABLE profiles (
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

-- Índices para perfis
CREATE INDEX idx_profiles_company_id ON profiles(company_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Administradores podem ver perfis da sua empresa" 
  ON profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE company_id = profiles.company_id 
      AND role = 'admin'
    )
  );

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);
```

### 2.2. Empresas (Companies)
```sql
CREATE TABLE companies (
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

-- Índices para companies
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_subscription ON companies(subscription_plan, subscription_expires_at);

-- RLS para companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver empresas onde trabalham" 
  ON companies FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.company_id = companies.id
    )
  );

CREATE POLICY "Apenas admins podem modificar empresas" 
  ON companies FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.company_id = companies.id 
      AND profiles.role = 'admin'
    )
  );
```

### 2.3. Vagas (Jobs)
```sql
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb, -- Array de strings como JSON
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

-- Índices para jobs
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status);
CREATE INDEX idx_jobs_deadline ON jobs(deadline) WHERE status = 'open';
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_requirements ON jobs USING GIN(requirements);

-- RLS para jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver vagas da sua empresa" 
  ON jobs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.company_id = jobs.company_id
    )
  );

CREATE POLICY "Recrutadores e admins podem modificar vagas" 
  ON jobs FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.company_id = jobs.company_id 
      AND profiles.role IN ('admin', 'recruiter')
    )
  );
```

### 2.4. Candidatos (Candidates)
```sql
CREATE TABLE candidates (
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
  resume_url TEXT, -- Supabase Storage path
  resume_text TEXT, -- Texto extraído do currículo
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

-- Índices para candidates
CREATE INDEX idx_candidates_job_status ON candidates(job_id, status);
CREATE INDEX idx_candidates_score ON candidates(score_total DESC);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_stage ON candidates(stage);
CREATE INDEX idx_candidates_tags ON candidates USING GIN(tags);

-- RLS para candidates
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver candidatos das vagas da sua empresa" 
  ON candidates FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN profiles p ON p.company_id = j.company_id
      WHERE j.id = candidates.job_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Recrutadores e admins podem modificar candidatos" 
  ON candidates FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN profiles p ON p.company_id = j.company_id
      WHERE j.id = candidates.job_id
      AND p.id = auth.uid()
      AND p.role IN ('admin', 'recruiter')
    )
  );
```

### 2.5. Análises (Analyses)
```sql
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('technical', 'cultural', 'logistical', 'composite')),
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  confidence DECIMAL(3,2) DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  breakdown JSONB DEFAULT '{}'::jsonb, -- Detalhamento do score por categoria
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  generated_by TEXT DEFAULT 'system' CHECK (generated_by IN ('system', 'human', 'hybrid')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para analyses
CREATE INDEX idx_analyses_candidate ON analyses(candidate_id);
CREATE INDEX idx_analyses_type ON analyses(type);
CREATE INDEX idx_analyses_score ON analyses(score DESC);

-- RLS para analyses (herda permissões dos candidates)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver análises dos candidatos da sua empresa" 
  ON analyses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM candidates c
      JOIN jobs j ON j.id = c.job_id
      JOIN profiles p ON p.company_id = j.company_id
      WHERE c.id = analyses.candidate_id
      AND p.id = auth.uid()
    )
  );
```

### 2.6. Entrevistas (Interviews)
```sql
CREATE TABLE interviews (
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
  interviewer_ids UUID[] DEFAULT '{}', -- Array de profile IDs
  meeting_link TEXT,
  meeting_notes TEXT,
  recording_url TEXT,
  feedback JSONB DEFAULT '{}'::jsonb, -- Avaliação do entrevistador
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para interviews
CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_start);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_interviewer ON interviews USING GIN(interviewer_ids);

-- RLS para interviews
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver entrevistas dos candidatos da sua empresa" 
  ON interviews FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM candidates c
      JOIN jobs j ON j.id = c.job_id
      JOIN profiles p ON p.company_id = j.company_id
      WHERE c.id = interviews.candidate_id
      AND p.id = auth.uid()
    )
    OR
    auth.uid() = ANY(interviews.interviewer_ids)
  );

CREATE POLICY "Entrevistadores podem atualizar entrevistas que participam" 
  ON interviews FOR UPDATE 
  USING (auth.uid() = ANY(interviewer_ids)) 
  WITH CHECK (auth.uid() = ANY(interviewer_ids));
```

### 2.7. Banco de Talentos (Talent Pool)
```sql
CREATE TABLE talent_pool (
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

-- Índices para talent_pool
CREATE INDEX idx_talent_pool_status ON talent_pool(status);
CREATE INDEX idx_talent_pool_match_score ON talent_pool(match_score DESC);
CREATE INDEX idx_talent_pool_skills ON talent_pool USING GIN(skills);

-- RLS para talent_pool (herda permissões dos candidates)
ALTER TABLE talent_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver talent pool da sua empresa" 
  ON talent_pool FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM candidates c
      JOIN jobs j ON j.id = c.job_id
      JOIN profiles p ON p.company_id = j.company_id
      WHERE c.id = talent_pool.candidate_id
      AND p.id = auth.uid()
    )
  );
```

### 2.8. Atividades (Activities) - Para timeline e auditoria
```sql
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'candidate', 'job', 'interview', etc.
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'status_changed', 'note_added'
  actor_id UUID REFERENCES profiles(id),
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para activities
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_actor ON activities(actor_id);

-- RLS para activities (apenas admins podem ver logs completos)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver todas as atividades da empresa" 
  ON activities FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## 3. Triggers e Functions

### 3.1. Atualização automática de `updated_at`
```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar a todas as tabelas com updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_talent_pool_updated_at BEFORE UPDATE ON talent_pool
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.2. Cálculo automático de score_total
```sql
-- Função para calcular score_total
CREATE OR REPLACE FUNCTION calculate_candidate_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular média ponderada: 70% técnico + 30% cultural
  NEW.score_total = COALESCE(NEW.score_technical, 0) * 0.7 + COALESCE(NEW.score_cultural, 0) * 0.3;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para candidates
CREATE TRIGGER update_candidate_score BEFORE INSERT OR UPDATE OF score_technical, score_cultural ON candidates
  FOR EACH ROW EXECUTE FUNCTION calculate_candidate_score();
```

### 3.3. Log automático de atividades
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
  -- Determinar ação baseada na operação
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

  -- Obter actor_id da sessão atual (se disponível)
  BEGIN
    v_actor_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := NULL;
  END;

  -- Inserir na tabela de atividades
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

-- Aplicar a tabelas importantes
CREATE TRIGGER log_candidate_activities AFTER INSERT OR UPDATE OR DELETE ON candidates
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_job_activities AFTER INSERT OR UPDATE OR DELETE ON jobs
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_interview_activities AFTER INSERT OR UPDATE OR DELETE ON interviews
  FOR EACH ROW EXECUTE FUNCTION log_activity();
```

## 4. Views Úteis para o Dashboard

### 4.1. View: Pipeline da Vaga
```sql
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
```

### 4.2. View: Performance do Recrutador
```sql
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
```

### 4.3. View: Métricas da Empresa
```sql
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

## 5. Índices de Performance

### 5.1. Índices Essenciais (já incluídos nas tabelas)
```sql
-- Para busca de candidatos por email
CREATE INDEX CONCURRENTLY idx_candidates_email_lower ON candidates(LOWER(email));

-- Para busca full-text em currículos
CREATE INDEX CONCURRENTLY idx_candidates_resume_text_gin 
ON candidates USING gin(to_tsvector('portuguese', resume_text));

-- Para filtros combinados comuns
CREATE INDEX CONCURRENTLY idx_candidates_job_status_score 
ON candidates(job_id, status, score_total DESC);

-- Para queries temporais
CREATE INDEX CONCURRENTLY idx_candidates_created_at 
ON candidates(created_at DESC) 
WHERE status NOT IN ('archived', 'deleted');

-- Para busca no talent pool por skills
CREATE INDEX CONCURRENTLY idx_talent_pool_skills_gin 
ON talent_pool USING gin(skills);
```

### 5.2. Índices para RLS Performance
```sql
-- Para otimizar políticas RLS que usam joins
CREATE INDEX CONCURRENTLY idx_profiles_company_role 
ON profiles(company_id, role);

CREATE INDEX CONCURRENTLY idx_jobs_company 
ON jobs(company_id);

CREATE INDEX CONCURRENTLY idx_candidates_job 
ON candidates(job_id);
```

## 6. Políticas de Retenção e LGPD

### 6.1. Procedimento de Anonimização
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
```

### 6.2. Exclusão de Dados (Right to be Forgotten)
```sql
-- Função para excluir dados de candidato específico
CREATE OR REPLACE PROCEDURE delete_candidate_data(candidate_uuid UUID)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Excluir em ordem de dependências
  DELETE FROM analyses WHERE candidate_id = candidate_uuid;
  DELETE FROM interviews WHERE candidate_id = candidate_uuid;
  DELETE FROM talent_pool WHERE candidate_id = candidate_uuid;
  DELETE FROM candidates WHERE id = candidate_uuid;
  
  -- Log da exclusão
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

## 7. Migrações e Versionamento

### 7.1. Estrutura de Migrações Supabase
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

### 7.2. Script de Migração Inicial (001_initial_schema.sql)
```sql
-- Este arquivo contém todas as CREATE TABLE statements acima
-- Executar via Supabase CLI: supabase db reset
```

## 8. Validação e Testes

### 8.1. Testes de Schema
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
```

### 8.2. Testes de Dados de Exemplo
```sql
-- Inserir dados de teste para desenvolvimento
INSERT INTO companies (name, domain, industry) VALUES
  ('TechStartup Inc', 'techstartup.com', 'Technology'),
  ('HealthCorp', 'healthcorp.com', 'Healthcare');

-- Inserir perfis de teste
INSERT INTO profiles (id, company_id, role, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM companies WHERE domain = 'techstartup.com'), 'admin', 'Carlos Admin'),
  ('22222222-2222-2222-2222-222222222222', (SELECT id FROM companies WHERE domain = 'techstartup.com'), 'recruiter', 'Ana Recruiter');
```

## 9. Considerações de Performance para MVP

### 9.1. Otimizações para Tier Gratuito do Supabase
- **Máximo de 500MB de banco de dados** - otimizar tamanho de textos
- **Limite de 2GB de bandwidth** - cache agressivo no frontend
- **2 projetos simultâneos** - usar apenas development + production
- **500MB de armazenamento de arquivos** - comprimir currículos antes de upload

### 9.2. Monitoramento
```sql
-- Query para monitorar uso do banco
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as db_size,
  (SELECT COUNT(*) FROM candidates) as total_candidates,
  (SELECT COUNT(*) FROM jobs) as total_jobs,
  (SELECT COUNT(*) FROM companies) as total_companies;
```

### 9.3. Limpeza Automática
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

## 10. Próximos Passos

### 10.1. Implantação Imediata
1. Executar scripts SQL no Supabase via Dashboard SQL Editor
2. Configurar RLS policies conforme acima
3. Criar usuário de serviço para aplicação
4. Gerar tipos TypeScript com `supabase gen types`

### 10.2. Integração com Frontend
1. Configurar cliente Supabase no frontend
2. Implementar queries usando os índices otimizados
3. Configurar subscriptions para dados em tempo real
4. Implementar upload para Supabase Storage

### 10.3. Monitoramento Pós-Implantação
1. Configurar alertas para queries lentas
2. Monitorar uso de storage e database
3. Ajustar índices baseado em padrões de uso reais
4. Planejar upgrade de tier quando necessário

---

**Status:** Modelagem completa para MVP Supabase PostgreSQL  
**Próximo documento:** `.tasks/02-banco-de-dados.md` (tarefas de implementação)  
**Base:** `.docs/03-arquitetura-sistema.md` (arquitetura Supabase + Netlify)  

*Documento gerado pelo Database Engineer - ET-06*  
*Foco: Implementação prática para MVP com performance e LGPD*