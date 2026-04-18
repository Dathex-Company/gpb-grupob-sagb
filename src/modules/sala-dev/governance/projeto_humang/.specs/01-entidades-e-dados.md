# 01. Entidades e Dados - HumanG

## 1. Visão Geral do Modelo de Dados

### 1.1. Princípios de Modelagem
- **Normalização:** Até 3ª Forma Normal para consistência e integridade
- **Performance:** Denormalização estratégica para queries frequentes
- **LGPD Compliance:** Separação de dados sensíveis, consentimento explícito
- **Extensibilidade:** Design para evolução com novas funcionalidades
- **Auditoria:** Rastreabilidade completa de alterações

### 1.2. Padrões de Acesso
- **Repository Pattern:** Separação entre lógica de negócio e acesso a dados
- **DTO (Data Transfer Object):** Schemas Pydantic para validação e serialização
- **Soft Delete:** Deleção lógica mantendo histórico
- **Versionamento:** Controle de versões para entidades críticas

## 2. Entidades Principais

### 2.1. Usuário (User)
**Descrição:** Representa todos os usuários do sistema (clientes, administradores, candidatos)

**Campos:**
```sql
id: UUID (primary key)
email: VARCHAR(255) (unique, not null)
password_hash: VARCHAR(255) (not null)
full_name: VARCHAR(255)
role: ENUM('admin', 'client_admin', 'client_user', 'candidate')
is_active: BOOLEAN (default: true)
email_verified: BOOLEAN (default: false)
phone: VARCHAR(20)
avatar_url: TEXT
timezone: VARCHAR(50) (default: 'America/Sao_Paulo')
language: VARCHAR(10) (default: 'pt-BR')
last_login_at: TIMESTAMP
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
deleted_at: TIMESTAMP (nullable)
```

**Relacionamentos:**
- One-to-Many: User → Company (clientes)
- One-to-Many: User → Candidate (candidatos)
- One-to-Many: User → Interview (entrevistadores)

**Considerações:**
- Dados sensíveis (password) sempre criptografados
- Autenticação via JWT com refresh tokens
- RBAC baseado no campo `role`
- Soft delete para manter histórico

### 2.2. Empresa (Company)
**Descrição:** Cliente B2B que contrata os serviços da HumanG

**Campos:**
```sql
id: UUID (primary key)
name: VARCHAR(255) (not null)
legal_name: VARCHAR(255)
tax_id: VARCHAR(20) (CNPJ)
phone: VARCHAR(20)
email: VARCHAR(255)
website: TEXT
address_street: VARCHAR(255)
address_city: VARCHAR(100)
address_state: VARCHAR(50)
address_zip_code: VARCHAR(10)
address_country: VARCHAR(50) (default: 'Brazil')
industry: VARCHAR(100)
size_range: ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
status: ENUM('active', 'inactive', 'suspended') (default: 'active')
subscription_plan: ENUM('starter', 'growth', 'enterprise')
subscription_start_date: DATE
subscription_end_date: DATE
primary_contact_id: UUID (foreign key to User)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
metadata: JSONB (dados customizados)
```

**Relacionamentos:**
- One-to-Many: Company → User (colaboradores)
- One-to-Many: Company → Job (vagas)
- One-to-Many: Company → Interview (processos seletivos)

**Considerações:**
- Dados fiscais sensíveis com criptografia adicional
- Metadata JSONB para extensibilidade sem migrations
- Hierarquia de usuários via `primary_contact_id`

### 2.3. Vaga (Job)
**Descrição:** Posição aberta para contratação

**Campos:**
```sql
id: UUID (primary key)
company_id: UUID (foreign key to Company, not null)
title: VARCHAR(255) (not null)
description: TEXT
requirements: TEXT[]
nice_to_have: TEXT[]
location_type: ENUM('onsite', 'remote', 'hybrid') (default: 'hybrid')
location_city: VARCHAR(100)
location_state: VARCHAR(50)
salary_range_min: DECIMAL(12,2)
salary_range_max: DECIMAL(12,2)
salary_currency: VARCHAR(3) (default: 'BRL')
employment_type: ENUM('full_time', 'part_time', 'contract', 'internship')
experience_level: ENUM('entry', 'mid', 'senior', 'lead', 'executive')
department: VARCHAR(100)
status: ENUM('draft', 'open', 'in_progress', 'closed', 'cancelled') (default: 'draft')
priority: ENUM('low', 'medium', 'high', 'critical') (default: 'medium')
target_start_date: DATE
deadline: DATE
hiring_manager_id: UUID (foreign key to User)
created_by_id: UUID (foreign key to User)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
closed_at: TIMESTAMP (nullable)
metadata: JSONB (critérios customizados)
```

**Relacionamentos:**
- Many-to-One: Job → Company
- One-to-Many: Job → CandidateApplication
- One-to-Many: Job → Interview

**Considerações:**
- Campos de texto usados para busca full-text
- JSONB `metadata` para critérios específicos do cliente
- Workflow de status controlado por business rules

### 2.4. Candidato (Candidate)
**Descrição:** Pessoa que se candidata a uma vaga

**Campos:**
```sql
id: UUID (primary key)
user_id: UUID (foreign key to User, nullable - para candidatos registrados)
external_id: VARCHAR(100) (para candidatos importados)
full_name: VARCHAR(255) (not null)
email: VARCHAR(255) (not null)
phone: VARCHAR(20)
linkedin_url: TEXT
portfolio_url: TEXT
current_title: VARCHAR(255)
current_company: VARCHAR(255)
total_experience_years: INTEGER
location_city: VARCHAR(100)
location_state: VARCHAR(50)
location_country: VARCHAR(50) (default: 'Brazil')
willing_to_relocate: BOOLEAN (default: false)
remote_only: BOOLEAN (default: false)
salary_expectation_min: DECIMAL(12,2)
salary_expectation_max: DECIMAL(12,2)
salary_currency: VARCHAR(3) (default: 'BRL')
notice_period_days: INTEGER (default: 30)
source: ENUM('linkedin', 'website', 'referral', 'job_board', 'direct', 'other')
status: ENUM('new', 'screened', 'contacted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn') (default: 'new')
consent_given: BOOLEAN (default: false)
consent_given_at: TIMESTAMP (nullable)
privacy_settings: JSONB (preferências LGPD)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
metadata: JSONB (dados complementares)
```

**Relacionamentos:**
- One-to-One: Candidate → User (opcional)
- One-to-Many: Candidate → CandidateApplication
- One-to-Many: Candidate → Resume
- One-to-Many: Candidate → Interview
- One-to-Many: Candidate → TalentPoolEntry

**Considerações:**
- Separação entre dados públicos e sensíveis (LGPD)
- Consentimento explícito obrigatório para processamento
- `metadata` JSONB para informações contextuais (logística, rotina, etc.)

### 2.5. Currículo (Resume)
**Descrição:** Documento de currículo do candidato

**Campos:**
```sql
id: UUID (primary key)
candidate_id: UUID (foreign key to Candidate, not null)
file_name: VARCHAR(255)
file_path: TEXT (S3/minIO path)
file_size_bytes: INTEGER
file_type: VARCHAR(50)
content_text: TEXT (texto extraído via OCR)
content_structured: JSONB (dados estruturados do parse)
parsing_status: ENUM('pending', 'processing', 'completed', 'failed') (default: 'pending')
parsing_errors: TEXT[]
parsed_at: TIMESTAMP (nullable)
confidence_score: DECIMAL(3,2) (0.00-1.00)
is_primary: BOOLEAN (default: true)
version: INTEGER (default: 1)
created_at: TIMESTAMP (default: now())
metadata: JSONB (metadados do parser)
```

**Relacionamentos:**
- Many-to-One: Resume → Candidate
- One-to-Many: Resume → ResumeSkill (via JSONB parsing)

**Considerações:**
- Armazenamento em object storage (S3/minIO)
- Processamento assíncrono via Celery workers
- Versionamento para múltiplas versões do currículo
- Campo `content_structured` com schema definido

### 2.6. Candidatura (CandidateApplication)
**Descrição:** Relação entre Candidato e Vaga

**Campos:**
```sql
id: UUID (primary key)
candidate_id: UUID (foreign key to Candidate, not null)
job_id: UUID (foreign key to Job, not null)
cover_letter: TEXT
application_source: ENUM('direct', 'linkedin', 'website', 'referral', 'imported')
status: ENUM('applied', 'screened', 'contacted', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn') (default: 'applied')
screening_score: DECIMAL(5,2) (0-100)
screening_notes: TEXT
rejection_reason: TEXT
applied_at: TIMESTAMP (default: now())
screened_at: TIMESTAMP (nullable)
contacted_at: TIMESTAMP (nullable)
rejected_at: TIMESTAMP (nullable)
hired_at: TIMESTAMP (nullable)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
metadata: JSONB (dados do processo)
```

**Relacionamentos:**
- Many-to-One: CandidateApplication → Candidate
- Many-to-One: CandidateApplication → Job
- One-to-Many: CandidateApplication → Interview

**Considerações:**
- Chave única composta: (candidate_id, job_id)
- Timeline completa do processo
- `screening_score` calculado por algoritmos de IA

### 2.7. Entrevista (Interview)
**Descrição:** Sessão de entrevista com candidato

**Campos:**
```sql
id: UUID (primary key)
candidate_application_id: UUID (foreign key to CandidateApplication, not null)
title: VARCHAR(255)
type: ENUM('screening', 'technical', 'cultural', 'managerial', 'final')
status: ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') (default: 'scheduled')
scheduled_start: TIMESTAMP (not null)
scheduled_end: TIMESTAMP (not null)
actual_start: TIMESTAMP (nullable)
actual_end: TIMESTAMP (nullable)
duration_minutes: INTEGER
interviewer_ids: UUID[] (array de User IDs)
meeting_link: TEXT (Zoom, Google Meet, etc.)
meeting_notes: TEXT
recording_url: TEXT (após consentimento)
transcription_text: TEXT
transcription_status: ENUM('pending', 'processing', 'completed', 'failed') (default: 'pending')
transcription_confidence: DECIMAL(3,2)
location: VARCHAR(255)
created_by_id: UUID (foreign key to User)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
metadata: JSONB (dados da entrevista)
```

**Relacionamentos:**
- Many-to-One: Interview → CandidateApplication
- Many-to-Many: Interview → User (via interviewer_ids array)

**Considerações:**
- Integração com calendários externos (Google Calendar, Outlook)
- Gravação e transcrição opcionais (com consentimento)
- Array de entrevistadores para painéis

### 2.8. Parecer (Analysis)
**Descrição:** Análise e recomendação sobre candidato

**Campos:**
```sql
id: UUID (primary key)
candidate_application_id: UUID (foreign key to CandidateApplication, not null)
interview_id: UUID (foreign key to Interview, nullable)
analyst_id: UUID (foreign key to User, not null)
overall_score: DECIMAL(5,2) (0-100)
technical_score: DECIMAL(5,2) (0-100)
cultural_fit_score: DECIMAL(5,2) (0-100)
behavioral_score: DECIMAL(5,2) (0-100)
logistical_score: DECIMAL(5,2) (0-100) (viabilidade logística)
risk_level: ENUM('low', 'medium', 'high', 'critical')
strengths: TEXT[]
weaknesses: TEXT[]
red_flags: TEXT[]
green_flags: TEXT[]
recommendation: ENUM('strong_hire', 'hire', 'maybe', 'no_hire', 'strong_no_hire')
recommendation_notes: TEXT
next_steps: TEXT[]
is_final: BOOLEAN (default: false)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
version: INTEGER (default: 1)
metadata: JSONB (análises detalhadas)
```

**Relacionamentos:**
- Many-to-One: Analysis → CandidateApplication
- Many-to-One: Analysis → Interview (opcional)
- Many-to-One: Analysis → User (analista)

**Considerações:**
- Versionamento para múltiplas revisões
- Scores normalizados (0-100) para comparação
- Campo `metadata` com análises estruturadas por dimensão

### 2.9. Banco de Talentos (TalentPoolEntry)
**Descrição:** Candidato classificado no banco de talentos

**Campos:**
```sql
id: UUID (primary key)
candidate_id: UUID (foreign key to Candidate, not null)
source_application_id: UUID (foreign key to CandidateApplication, nullable)
status: ENUM('active', 'contacted', 'placed', 'archived') (default: 'active')
category: ENUM('high_potential', 'technical_expert', 'cultural_fit', 'future_opportunity', 'needs_development')
readiness_level: ENUM('immediate', '30_days', '90_days', '6_months', '1_year+')
skills: TEXT[] (skills principais)
target_roles: VARCHAR(255)[]
target_industries: VARCHAR(100)[]
location_preferences: VARCHAR(100)[]
salary_expectation_min: DECIMAL(12,2)
salary_expectation_max: DECIMAL(12,2)
last_contacted_at: TIMESTAMP (nullable)
next_follow_up_at: TIMESTAMP (nullable)
match_score: DECIMAL(5,2) (para vagas futuras)
notes: TEXT
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
metadata: JSONB (dados de classificação)
```

**Relacionamentos:**
- Many-to-One: TalentPoolEntry → Candidate
- Many-to-One: TalentPoolEntry → CandidateApplication (origem)

**Considerações:**
- Classificação multidimensional para match futuro
- Sistema de follow-up automático
- Match scoring baseado em skills e preferências

### 2.10. Habilidade (Skill)
**Descrição:** Competências técnicas e comportamentais

**Campos:**
```sql
id: UUID (primary key)
name: VARCHAR(100) (not null, unique)
category: ENUM('technical', 'soft', 'language', 'certification', 'tool')
description: TEXT
popularity_score: INTEGER (default: 0)
is_verified: BOOLEAN (default: false)
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (default: now())
```

**Relacionamentos:**
- Many-to-Many: Skill → Candidate (via tabela de junção)
- Many-to-Many: Skill → Job (via tabela de junção)

**Considerações:**
- Catálogo centralizado de skills para consistência
- Popularity score baseado em uso
- Tabela de junção com nível de proficiência

## 3. Tabelas de Junção e Relacionamentos

### 3.1. CandidateSkill (N-N)
```sql
candidate_id: UUID (foreign key to Candidate)
skill_id: UUID (foreign key to Skill)
proficiency_level: ENUM('beginner', 'intermediate', 'advanced', 'expert')
years_of_experience: INTEGER
last_used_year: INTEGER
is_primary: BOOLEAN (default: false)
created_at: TIMESTAMP (default: now())
PRIMARY KEY (candidate_id, skill_id)
```

### 3.2. JobSkill (N-N)
```sql
job_id: UUID (foreign key to Job)
skill_id: UUID (foreign key to Skill)
importance: ENUM('required', 'preferred', 'nice_to_have')
minimum_proficiency: ENUM('beginner', 'intermediate', 'advanced', 'expert')
created_at: TIMESTAMP (default: now())
PRIMARY KEY (job_id, skill_id)
```

### 3.3. CompanyUser (N-N)
```sql
company_id: UUID (foreign key to Company)
user_id: UUID (foreign key to User)
role_in_company: VARCHAR(100)
department: VARCHAR(100)
is_active: BOOLEAN (default: true)
joined_at: DATE
left_at: DATE (nullable)
created_at: TIMESTAMP (default: now())
PRIMARY KEY (company_id, user_id)
```

## 4. Estratégias de Persistência

### 4.1. Particionamento
- **Temporal:** `CandidateApplication` particionada por `applied_at` (mensal)
- **Por Cliente:** Dados sensíveis separados por `company_id`
- **Hot/Warm/Cold:** Dados históricos movidos para armazenamento mais barato

### 4.2. Índices
**Índices Essenciais:**
```sql
-- Candidate
CREATE INDEX idx_candidate_email ON candidate(email);
CREATE INDEX idx_candidate_status ON candidate(status);
CREATE INDEX idx_candidate_location ON candidate(location_city, location_state);

-- Job
CREATE INDEX idx_job_company ON job(company_id);
CREATE INDEX idx_job_status ON job(status);
CREATE INDEX idx_job_deadline ON job(deadline) WHERE status = 'open';

-- CandidateApplication
CREATE INDEX idx_app_candidate_job ON candidate_application(candidate_id, job_id);
CREATE INDEX idx_app_status ON candidate_application(status);
CREATE INDEX idx_app_screening_score ON candidate_application(screening_score DESC);

-- Interview
CREATE INDEX idx_interview_scheduled ON interview(scheduled_start);
CREATE INDEX idx_interview_status ON interview(status);

-- Full-text Search
CREATE INDEX idx_resume_content_text ON resume USING gin(to_tsvector('portuguese', content_text));
CREATE INDEX idx_job_description ON job USING gin(to_tsvector('portuguese', description));
```

### 4.3. Políticas de Retenção
1. **Dados Ativos:** Mantidos online por 2 anos
2. **Dados Históricos:** Movidos para archive após 2 anos
3. **Dados LGPD:** Anonimizados após 5 anos
4. **Logs de Auditoria:** Mantidos por 7 anos (conformidade)

### 4.4. Backup Strategy
- **Backup Completo:** Diariamente (00:00)
- **Backup Incremental:** A cada 4 horas
- **Retenção:** 30 dias de backups completos
- **Offsite Backup:** Semanal para cloud storage

## 5. Consultas Comuns e Otimizações

### 5.1. Dashboard do Cliente
```sql
-- Vagas ativas com estatísticas
SELECT 
    j.*,
    COUNT(ca.id) as total_applications,
    COUNT(CASE WHEN ca.status = 'screened' THEN 1 END) as screened_count,
    COUNT(CASE WHEN ca.status = 'interviewing' THEN 1 END) as interviewing_count
FROM job j
LEFT JOIN candidate_application ca ON j.id = ca.job_id
WHERE j.company_id = :company_id 
    AND j.status IN ('open', 'in_progress')
GROUP BY j.id
ORDER BY j.priority DESC, j.created_at DESC;
```

### 5.2. Pipeline de Candidatos
```sql
-- Candidatos por status para uma vaga
SELECT 
    c.*,
    ca.screening_score,
    ca.applied_at,
    MAX(i.scheduled_start) as last_interview_date
FROM candidate c
JOIN candidate_application ca ON c.id = ca.candidate_id
LEFT JOIN interview i ON ca.id = i.candidate_application_id
WHERE ca.job_id = :job_id
    AND ca.status = :status
GROUP BY c.id, ca.id
ORDER BY ca.screening_score DESC, ca.applied_at DESC;
```

### 5.3. Busca no Banco de Talentos
```sql
-- Match de talentos com vagas futuras
SELECT 
    tpe.*,
    c.*,
    ts_rank(
        to_tsvector('portuguese', array_to_string(tpe.skills, ' ')),
        to_tsvector('portuguese', :job_requirements)
    ) as relevance_score
FROM talent_pool_entry tpe
JOIN candidate c ON tpe.candidate_id = c.id
WHERE tpe.status = 'active'
    AND tpe.readiness_level IN ('immediate', '30_days')
    AND (tpe.target_roles IS NULL OR :job_title = ANY(tpe.target_roles))
    AND (tpe.location_preferences IS NULL OR :job_location = ANY(tpe.location_preferences))
    AND c.salary_expectation_max >= :salary_min
ORDER BY relevance_score DESC, tpe.match_score DESC
LIMIT 20;
```

## 6. Considerações de LGPD

### 6.1. Dados Sensíveis
- **Categoria Especial:** Dados pessoais sensíveis (origem étnica, religião, saúde)
- **Consentimento Explícito:** Campo `consent_given` com timestamp
- **Finalidade Específica:** Cada dado coletado com finalidade declarada

### 6.2. Anonimização
```sql
-- Procedimento de anonimização após 5 anos
UPDATE candidate SET
    full_name = CONCAT('Anon_', SUBSTRING(MD5(id::text), 1, 8)),
    email = CONCAT(SUBSTRING(MD5(id::text), 1, 10), '@anonymized.humang'),
    phone = NULL,
    linkedin_url = NULL,
    current_company = NULL,
    location_city = NULL,
    location_state = NULL,
    salary_expectation_min = NULL,
    salary_expectation_max = NULL,
    metadata = jsonb_set(metadata, '{anonymized_at}', to_jsonb(now()::text))
WHERE created_at < NOW() - INTERVAL '5 years'
    AND consent_given = true;
```

### 6.3. Portabilidade
- Endpoint `/api/candidates/{id}/export` para exportação em JSON
- Inclui todos os dados do candidato em formato estruturado
- Exclusão de dados sensíveis conforme preferências

### 6.4. Auditoria
- Tabela `data_access_log` para registro de todos os acessos
- Notificação de violação de dados em até 72 horas
- DPO (Data Protection Officer) designado

## 7. Evolução do Modelo

### 7.1. Versionamento de Schema
- **Alembic:** Para migrações de banco de dados
- **Rollback Seguro:** Todas as migrações reversíveis
- **Schema Registry:** Controle de versões do modelo
- **Blue-Green Deployments:** Para migrações críticas

### 7.2. Breaking Changes
1. **Adição de Campos:** Sempre nullable com valor default
2. **Remoção de Campos:** Deprecation period de 6 meses
3. **Alteração de Tipos:** Migração em lote com fallback
4. **Relacionamentos:** Manter compatibilidade reversa

### 7.3. Data Migration Strategy
- **Teste em Staging:** Antes de produção
- **Backup Pré-Migração:** Snapshot completo
- **Rollback Plan:** Procedimento documentado
- **Monitoring Pós-Migração:** Métricas de performance

## 8. Próximos Passos

### 8.1. Implantações Imediatas
1. Criar scripts de migração inicial
2. Implementar modelos SQLAlchemy
3. Configurar conexão com PostgreSQL
4. Criar fixtures de dados de teste
5. Implementar repositórios base

### 8.2. Validações
1. Testar queries de performance
2. Validar índices com carga real
3. Testar procedures de LGPD
4. Validar backup/restore procedures
5. Testar migrações de schema

---

**Próximo passo:** Detalhar estrutura técnica em `.specs/02-estrutura-tecnica.md`

*Documento gerado pelo System Architect - ET-03*
*Base: .docs/01-visao-produto.md, .docs/02-prd-inicial.md, .docs/03-arquitetura-sistema.md*

