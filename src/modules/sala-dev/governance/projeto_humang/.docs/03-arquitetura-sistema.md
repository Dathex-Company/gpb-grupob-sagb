# 03. Arquitetura do Sistema - HumanG (MVP Supabase + Netlify)

## 1. Visão Geral da Arquitetura

### 1.1. Princípios Arquiteturais (MVP)
- **Simplicidade:** Stack minimalista para entrega rápida
- **Velocidade:** Supabase e Netlify para desenvolvimento acelerado
- **Custo Zero Inicial:** Ambos oferecem tiers gratuitos generosos
- **Serverless:** Foco em lógica de negócio, não em infraestrutura
- **LGPD Compliance:** Segurança e privacidade integradas desde o início

### 1.2. Diagrama Arquitetural Simplificado
```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Browser/Mobile)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────┐
│                 Netlify (Frontend React/TypeScript)          │
│  • Hospedagem estática                                      │
│  • Edge Functions (lógica serverless)                      │
│  • CDN global                                              │
│  • Forms e funções automáticas                             │
└──────────────────────────────┬──────────────────────────────┘
                               │ Supabase JS Client
┌──────────────────────────────▼──────────────────────────────┐
│                     Supabase (Backend as a Service)          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ PostgreSQL │ │   Auth     │ │  Storage   │              │
│  │  Database  │ │(JWT, OAuth)│ │ (S3-like)  │              │
│  └────────────┘ └────────────┘ └────────────┘              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │  REST API  │ │ GraphQL    │ │  Realtime  │              │
│  │ (Auto-gen) │ │ (Optional) │ │  Subscriptions            │
│  └────────────┘ └────────────┘ └────────────┘              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                 Integrações Externas (APIs)                  │
│  • Google Calendar API                                      │
│  • SendGrid (Email)                                         │
│  • Serviços de IA (OpenAI, Hugging Face)                   │
└─────────────────────────────────────────────────────────────┘
```

## 2. Responsabilidades do Netlify

### 2.1. Hospedagem do Frontend
- **Aplicação React/TypeScript** com Vite como build tool
- **Deploy contínuo** via Git (GitHub/GitLab/Bitbucket)
- **CDN global** para assets estáticos (imagens, CSS, JS)
- **Pré-rendering** para melhor SEO no portal do candidato
- **Split testing** e rollbacks automáticos

### 2.2. Edge Functions
- **Lógica serverless** em TypeScript/JavaScript
- **Proxy para APIs** externas (calendário, email, IA)
- **Validação de dados** antes de enviar ao Supabase
- **Caching estratégico** para reduzir chamadas ao banco
- **Rate limiting** e proteção contra abuso

### 2.3. Otimizações de Performance
- **Image optimization** automática
- **Code splitting** e lazy loading
- **Minification** e compressão
- **HTTP/2** e HTTP/3 suporte

### 2.4. Ferramentas de Desenvolvimento
- **Netlify Dev** para desenvolvimento local
- **Environment variables** gerenciadas
- **Branch deploys** para preview de features
- **Analytics** básico de uso

## 3. Responsabilidades do Supabase

### 3.1. Banco de Dados PostgreSQL
- **PostgreSQL 15+** com todas as features enterprise
- **JSONB support** para dados semi-estruturados
- **Full-text search** nativo para busca em currículos
- **Row Level Security (RLS)** para proteção de dados
- **Backups automáticos** e point-in-time recovery

### 3.2. Autenticação e Autorização
- **Supabase Auth** com múltiplos providers:
  - Email/password
  - OAuth (Google, GitHub, etc.)
  - Magic links
- **JWT tokens** com refresh automático
- **Sessions management** integrado
- **Multi-factor authentication** (opcional)

### 3.3. API e Realtime
- **REST API automática** baseada no schema do banco
- **GraphQL** via Supabase GraphQL (opcional)
- **Realtime subscriptions** para updates em tempo real
- **WebSockets** para notificações e chat

### 3.4. Armazenamento de Arquivos
- **S3-compatible storage** para currículos e documentos
- **Resize on-the-fly** para imagens
- **CDN integrada** para arquivos estáticos
- **Permissions** baseadas em RLS

### 3.5. Edge Functions
- **Funções serverless** em TypeScript/Deno
- **Cron jobs** para tarefas agendadas
- **Processamento batch** para análise de currículos
- **Integrações complexas** com serviços externos

## 4. Estrutura de Dados Inicial

### 4.1. Tabelas Principais (MVP)
```sql
-- 1. Empresas (Companies)
companies: id, name, domain, created_at, updated_at

-- 2. Usuários (Users) - extend supabase.auth.users
profiles: id (references auth.users), company_id, role, preferences

-- 3. Vagas (Jobs)
jobs: id, company_id, title, description, requirements, status, created_at

-- 4. Candidatos (Candidates)
candidates: id, job_id, email, name, phone, resume_url, status, score, created_at

-- 5. Análises (Analyses)
analyses: id, candidate_id, technical_score, cultural_fit, logistica_viability, notes

-- 6. Entrevistas (Interviews)
interviews: id, candidate_id, scheduled_at, duration, interviewer_id, status, notes

-- 7. Banco de Talentos (Talent Pool)
talent_pool: id, candidate_id, skills, status, match_score, contacted_at
```

### 4.2. Políticas de Segurança (RLS)
```sql
-- Exemplo: Apenas usuários da mesma empresa podem ver seus dados
CREATE POLICY "Users can only view their company's data" ON companies
FOR SELECT USING (auth.uid() IN (
  SELECT id FROM profiles WHERE company_id = companies.id
));
```

### 4.3. Índices para Performance
```sql
-- Índices essenciais para queries frequentes
CREATE INDEX idx_candidates_job_status ON candidates(job_id, status);
CREATE INDEX idx_candidates_score ON candidates(score DESC);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX idx_talent_pool_skills ON talent_pool USING GIN(skills);
```

## 5. Fluxo de Autenticação

### 5.1. Login do Cliente (Empresa)
1. **Cliente acessa** `app.humang.com`
2. **Netlify redireciona** para página de login do Supabase
3. **Supabase Auth** processa credenciais (email/password ou OAuth)
4. **JWT token** retornado e armazenado no cliente
5. **Frontend configura** Supabase client com token
6. **Todas as requisições subsequentes** incluem token automaticamente
7. **RLS policies** garantem acesso apenas aos dados da empresa

### 5.2. Portal do Candidato (Acesso Público)
1. **Candidato recebe link** único por email
2. **Link contém token** temporário com permissão limitada
3. **Supabase valida token** e permite acesso apenas ao perfil do candidato
4. **Sessão expira** após 24h ou após decisão da vaga
5. **Não requer login tradicional** - experiência simplificada

### 5.3. Gestão de Permissões
- **Admin (Carlos/Ana):** Acesso completo à empresa
- **Recruiter:** Acesso a vagas e candidatos
- **Interviewer:** Acesso apenas a entrevistas agendadas
- **Candidate:** Acesso apenas ao próprio perfil

## 6. Fluxo de Simulação e Persistência

### 6.1. Upload e Análise de Currículo
```
1. Candidato envia currículo (PDF/DOC)
   │
2. Frontend (Netlify) → Supabase Storage
   │
3. Edge Function (Netlify) processa arquivo
   │
4. Extrai texto e metadados
   │
5. Chama serviço de IA para análise
   │
6. Salva resultado no Supabase Database
   │
7. Atualiza score do candidato
   │
8. Notifica recrutador via Realtime
```

### 6.2. Processo de Decisão Assistida
```
1. Recrutador visualiza dashboard
   │
2. Frontend consulta Supabase (candidatos + análises)
   │
3. Dados filtrados e ordenados no client-side
   │
4. Recrutador seleciona candidatos para entrevista
   │
5. Sistema agenda via Google Calendar API (Edge Function)
   │
6. Atualiza status no Supabase (Realtime update)
   │
7. Envia email ao candidato (SendGrid via Edge Function)
```

### 6.3. Persistência e Sincronização
- **Frontend state:** Zustand para UI state
- **Server state:** Supabase queries com cache automático
- **Realtime updates:** Supabase subscriptions para mudanças
- **Offline support:** PWA capabilities para recrutadores móveis

## 7. Motor de Cálculo do MVP

### 7.1. Análise de Currículo (Score Técnico)
```typescript
// Edge Function: /api/analyze-resume
export default async (req: Request) => {
  const { resumeText, jobRequirements } = await req.json();
  
  // 1. Extração de habilidades
  const skills = extractSkills(resumeText);
  
  // 2. Match com requisitos da vaga
  const technicalMatch = calculateMatch(skills, jobRequirements.technical);
  
  // 3. Análise de experiência
  const experienceScore = analyzeExperience(resumeText);
  
  // 4. Score final (0-100)
  const finalScore = (technicalMatch * 0.6) + (experienceScore * 0.4);
  
  return { score: finalScore, matchedSkills: skills };
};
```

### 7.2. Análise de Fit Cultural
- **Questionário estruturado** para candidato
- **Respostas comparadas** com perfil cultural da empresa
- **Machine learning básico** para identificar padrões
- **Score baseado em compatibilidade** de valores

### 7.3. Análise Logística
- **Localização do candidato** vs. escritório
- **Disponibilidade** vs. horários da empresa
- **Requisitos especiais** (home office, flexibilidade)
- **Score de viabilidade** logística

### 7.4. Serviços de IA Integrados
- **OpenAI GPT-4** para análise qualitativa
- **Hugging Face** modelos para NLP
- **Google Cloud Vision** OCR para currículos escaneados
- **Custom models** treinados com dados do setor

## 8. Estrutura de Pastas do Projeto

```
PROJETO_HUMANG/
├── netlify/                    # Configurações Netlify
│   ├── edge-functions/        # Edge Functions
│   └── config.toml           # Configuração deploy
│
├── supabase/                  # Configurações Supabase
│   ├── migrations/           # SQL migrations
│   ├── seeds/               # Dados iniciais
│   └── config.toml          # Config Supabase CLI
│
├── src/                      # Código fonte frontend
│   ├── components/          # Componentes React
│   │   ├── dashboard/      # Dashboard recrutador
│   │   ├── candidate/      # Perfil candidato
│   │   └── shared/         # Componentes compartilhados
│   │
│   ├── pages/              # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Jobs.tsx
│   │   ├── Candidates.tsx
│   │   └── TalentPool.tsx
│   │
│   ├── lib/                # Bibliotecas e utilities
│   │   ├── supabase.ts    # Cliente Supabase configurado
│   │   ├── api.ts         Chamadas API externas
│   │   └── utils.ts       # Funções utilitárias
│   │
│   ├── stores/             # Gerenciamento de estado
│   │   ├── auth.store.ts  # Estado autenticação
│   │   ├── jobs.store.ts  # Estado vagas
│   │   └── ui.store.ts    # Estado interface
│   │
│   ├── types/              # TypeScript definitions
│   │   ├── database.ts    # Tipos do Supabase
│   │   └── app.ts         # Tipos da aplicação
│   │
│   └── styles/             # Estilos
│       ├── globals.css    # Estilos globais
│       └── tailwind.config.js
│
├── public/                  # Assets estáticos
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
│
├── package.json            # Dependências frontend
├── tsconfig.json          # Config TypeScript
├── vite.config.ts         # Config Vite
└── README.md              # Documentação projeto
```

## 9. Estratégia de Evolução da Arquitetura

### 9.1. Fase 1: MVP (Meses 1-3)
- **Foco total em Supabase + Netlify**
- **Edge Functions apenas para integrações externas**
- **Banco de dados direto no Supabase PostgreSQL**
- **Autenticação nativa do Supabase**
- **Deploy simplificado via Git push**

### 9.2. Fase 2: Escala Inicial (Meses 4-6)
- **Supabase Enterprise** para maior limite de conexões
- **Netlify Pro** para mais Edge Functions
- **Cache estratégico** com Supabase Realtime
- **Background jobs** com Supabase Edge Functions Cron
- **Monitoring** básico com logs das Edge Functions

### 9.3. Fase 3: Crescimento (Meses 7-12)
- **Migração gradual** para arquitetura mais complexa SE necessário
- **Serviços dedicados** apenas para partes críticas
- **Manter Supabase** para auth e database
- **Considerar serviços especializados** para IA/ML intensivo
- **Manter Netlify** para frontend (já escala automaticamente)

### 9.4. Quando Considerar Mudança Arquitetural
1. **> 10k usuários ativos** simultâneos
2. **> 1TB de dados** no banco
3. **Processamento de IA** muito intensivo
4. **Requisitos de compliance** específicos (gov, saúde)
5. **Custos Supabase > custos infra própria** (após ~$500/mês)

### 9.5. Benefícios da Abordagem Atual
- **Time-to-market:** MVP em semanas, não meses
- **Custo inicial:** $0 até escala significativa
- **Manutenção:** Supabase e Netlify gerenciam infra
- **Foco no produto:** Time fica em features, não em infra
- **Escalabilidade automática:** Ambos escalam conforme necessidade

## 10. Riscos e Mitigações

### 10.1. Vendor Lock-in (Supabase/Netlify)
- **Risco:** Dificuldade de migração futura
- **Mitigação:** 
  - Usar SQL padrão (sem extensions exclusivas)
  - Isolar chamadas Supabase em camada de abstração
  - Manter migrations versionadas
  - Planejar migração gradual se necessário

### 10.2. Limites de Tier Gratuito
- **Risco:** Limites de uso podem ser atingidos
- **Mitigação:**
  - Monitorar uso desde o início
  - Otimizar queries e storage
  - Planos de upgrade definidos antecipadamente
  - Considerar cache agressivo

### 10.3. Performance de Edge Functions
- **Risco:** Cold starts podem afetar latency
- **Mitigação:**
  - Manter funções pequenas e eficientes
  - Usar cache quando possível
  - Considerar warming para funções críticas
  - Monitorar performance continuamente

### 10.4. LGPD e Dados Sensíveis
- **Risco:** Dados de candidatos exigem cuidado especial
- **Mitigação:**
  - Supabase hospedado na AWS São Paulo (dados no Brasil)
  - RLS policies rigorosas
  - Consentimento explícito registrado
  - Audit trails de acesso
  - Plano de anonimização/exclusão

## 11. Próximos Passos Técnicos

### 11.1. Sprint 0: Setup (1 semana)
- [ ] Criar contas Supabase e Netlify
- [ ] Setup projeto frontend com Vite + React + TypeScript
- [ ] Configurar Supabase local com Docker
- [ ] Definir schema inicial do banco
- [ ] Criar migrations iniciais

### 11.2. Sprint 1: Autenticação e Core (2 semanas)
- [ ] Implementar login com Supabase Auth
- [ ] Criar páginas básicas (Dashboard, Vagas, Candidatos)
- [ ] Implementar CRUD de vagas
- [ ] Upload de currículos para Supabase Storage
- [ ] Listagem básica de candidatos

### 11.3. Sprint 2: Análise Inteligente (2 semanas)
- [ ] Edge Function para análise de currículos
- [ ] Integração com serviço de IA (OpenAI/Hugging Face)
- [ ] Sistema de scoring automático
- [ ] Dashboard com métricas básicas
- [ ] Notificações em tempo real

### 11.4. Sprint 3: Fluxo Completo (2 semanas)
- [ ] Agendamento de entrevistas (Google Calendar)
- [ ] Sistema de pareceres e decisão
- [ ] Banco de talentos
- [ ] Portal do candidato
- [ ] Templates de comunicação

## 12. Conclusão

Esta arquitetura com **Supabase + Netlify** oferece o caminho mais rápido para um MVP funcional do HumanG, com custo próximo de zero inicialmente e capacidade de escalar conforme a demanda cresce. A simplicidade da stack permite focar nas funcionalidades de negócio que realmente importam: análise inteligente de candidatos, decisão assistida e experiência humana.

**Principais vantagens:**
1. **Velocidade:** MVP em produção em 4-6 semanas
2. **Custo:** $0 até escala significativa
3. **Manutenção:** Infra gerenciada pelos providers
4. **Escalabilidade:** Ambos escalam automaticamente
5. **LGPD:** Supabase com hospedagem AWS Brasil

**Quando reavaliar:**
- Após 6 meses de operação
- Quando atingir 1.000 usuários ativos
- Quando custos mensais > R$ 1.000
- Quando necessidades específicas não forem atendidas

---

**Próximo passo:** Detalhar implementação das Edge Functions e schema completo do banco em `.specs/01-entidades-e-dados.md`

*Documento atualizado pelo System Architect - ET-03*
*Base: .docs/01-visao-produto.md, .docs/02-prd-inicial.md, .docs/04-fluxos-do-usuario.md*
*Stack obrigatória: Supabase + Netlify para MVP*
