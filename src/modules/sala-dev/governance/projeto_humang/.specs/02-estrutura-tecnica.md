# 02. Estrutura Técnica - HumanG

## 1. Organização do Projeto

### 1.1. Estrutura de Pastas Detalhada

```
PROJETO_HUMANG/
├── .github/                          # Configurações GitHub
│   ├── workflows/                    # GitHub Actions
│   │   ├── ci.yml                    # CI pipeline
│   │   ├── cd.yml                    # CD pipeline
│   │   └── security-scan.yml         # Security scanning
│   └── ISSUE_TEMPLATE/               # Templates de issues
│
├── .vscode/                          # Configurações VS Code
│   ├── extensions.json               # Extensões recomendadas
│   ├── settings.json                 # Configurações do workspace
│   └── launch.json                   # Configurações de debug
│
├── src/                              # Código fonte
│   ├── backend/                      # Backend FastAPI
│   │   ├── app/                      # Aplicação principal
│   │   │   ├── __init__.py
│   │   │   ├── main.py               # Entry point da aplicação
│   │   │   ├── core/                 # Configurações core
│   │   │   │   ├── __init__.py
│   │   │   │   ├── config.py         # Configurações da aplicação
│   │   │   │   ├── database.py       # Configurações do banco
│   │   │   │   ├── security.py       # Configurações de segurança
│   │   │   │   ├── dependencies.py   # Dependências FastAPI
│   │   │   │   └── middleware.py     # Middlewares customizados
│   │   │   │
│   │   │   ├── api/                  # Rotas da API
│   │   │   │   ├── __init__.py
│   │   │   │   ├── v1/               # API v1
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── auth.py       # Rotas de autenticação
│   │   │   │   │   ├── candidates.py # Rotas de candidatos
│   │   │   │   │   ├── jobs.py       # Rotas de vagas
│   │   │   │   │   ├── interviews.py # Rotas de entrevistas
│   │   │   │   │   ├── analysis.py   # Rotas de análise
│   │   │   │   │   └── talent_pool.py# Rotas de banco de talentos
│   │   │   │   └── health.py         # Health check
│   │   │   │
│   │   │   ├── models/               # SQLAlchemy models
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py           # Model base
│   │   │   │   ├── user.py           # Model User
│   │   │   │   ├── company.py        # Model Company
│   │   │   │   ├── job.py            # Model Job
│   │   │   │   ├── candidate.py      # Model Candidate
│   │   │   │   ├── resume.py         # Model Resume
│   │   │   │   ├── application.py    # Model CandidateApplication
│   │   │   │   ├── interview.py      # Model Interview
│   │   │   │   ├── analysis.py       # Model Analysis
│   │   │   │   └── talent_pool.py    # Model TalentPoolEntry
│   │   │   │
│   │   │   ├── schemas/              # Pydantic schemas
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py           # Schema base
│   │   │   │   ├── user.py           # User schemas
│   │   │   │   ├── company.py        # Company schemas
│   │   │   │   ├── job.py            # Job schemas
│   │   │   │   ├── candidate.py      # Candidate schemas
│   │   │   │   ├── interview.py      # Interview schemas
│   │   │   │   ├── analysis.py       # Analysis schemas
│   │   │   │   └── talent_pool.py    # Talent pool schemas
│   │   │   │
│   │   │   ├── services/             # Serviços de negócio
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth_service.py   # Serviço de autenticação
│   │   │   │   ├── candidate_service.py
│   │   │   │   ├── job_service.py
│   │   │   │   ├── screening_service.py
│   │   │   │   ├── interview_service.py
│   │   │   │   ├── analysis_service.py
│   │   │   │   └── talent_pool_service.py
│   │   │   │
│   │   │   ├── repositories/         # Repositórios (Repository Pattern)
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py           # Repository base
│   │   │   │   ├── user_repository.py
│   │   │   │   ├── company_repository.py
│   │   │   │   ├── job_repository.py
│   │   │   │   ├── candidate_repository.py
│   │   │   │   └── interview_repository.py
│   │   │   │
│   │   │   ├── workers/              # Tarefas Celery
│   │   │   │   ├── __init__.py
│   │   │   │   ├── tasks.py          # Tasks principais
│   │   │   │   ├── cv_parser.py      # Parser de currículos
│   │   │   │   ├── email_sender.py   # Envio de emails
│   │   │   │   ├── transcription.py  # Transcrição de áudio
│   │   │   │   └── analytics.py      # Análises em background
│   │   │   │
│   │   │   ├── ai/                   # Serviços de IA
│   │   │   │   ├── __init__.py
│   │   │   │   ├── cv_analyzer.py    # Análise de currículos
│   │   │   │   ├── text_processor.py # Processamento de texto
│   │   │   │   ├── sentiment.py      # Análise de sentimento
│   │   │   │   └── embeddings.py     # Geração de embeddings
│   │   │   │
│   │   │   └── utils/                # Utilitários
│   │   │       ├── __init__.py
│   │   │       ├── validators.py     # Validadores customizados
│   │   │       ├── security.py       # Utilitários de segurança
│   │   │       ├── file_handler.py   # Manipulação de arquivos
│   │   │       └── logger.py         # Configuração de logging
│   │   │
│   │   ├── alembic/                  # Migrações de banco
│   │   │   ├── versions/             # Migrações versionadas
│   │   │   ├── env.py                # Ambiente Alembic
│   │   │   └── script.py.mako        # Template de migração
│   │   │
│   │   ├── tests/                    # Testes backend
│   │   │   ├── __init__.py
│   │   │   ├── conftest.py           # Fixtures do pytest
│   │   │   ├── unit/                 # Testes unitários
│   │   │   ├── integration/          # Testes de integração
│   │   │   └── e2e/                  # Testes end-to-end
│   │   │
│   │   └── requirements/             # Requirements por ambiente
│   │       ├── base.txt              # Dependências base
│   │       ├── dev.txt               # Dependências desenvolvimento
│   │       ├── prod.txt              # Dependências produção
│   │       └── test.txt              # Dependências testes
│   │
│   ├── frontend/                     # Frontend React/TypeScript
│   │   ├── public/                   # Arquivos públicos
│   │   │   ├── index.html            # HTML principal
│   │   │   ├── favicon.ico           # Favicon
│   │   │   ├── robots.txt            # Configuração robots
│   │   │   └── manifest.json         # Web app manifest
│   │   │
│   │   ├── src/                      # Código fonte frontend
│   │   │   ├── main.tsx              # Entry point React
│   │   │   ├── App.tsx               # Componente App raiz
│   │   │   ├── vite-env.d.ts         # Tipos Vite
│   │   │   │
│   │   │   ├── components/           # Componentes reutilizáveis
│   │   │   │   ├── common/           # Componentes comuns
│   │   │   │   │   ├── Button/
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Select/
│   │   │   │   │   ├── Modal/
│   │   │   │   │   ├── Table/
│   │   │   │   │   └── Card/
│   │   │   │   │
│   │   │   │   ├── layout/           # Componentes de layout
│   │   │   │   │   ├── Header/
│   │   │   │   │   ├── Sidebar/
│   │   │   │   │   ├── Footer/
│   │   │   │   │   └── DashboardLayout/
│   │   │   │   │
│   │   │   │   ├── candidates/       # Componentes de candidatos
│   │   │   │   ├── jobs/             # Componentes de vagas
│   │   │   │   ├── interviews/       # Componentes de entrevistas
│   │   │   │   └── analytics/        # Componentes de análise
│   │   │   │
│   │   │   ├── pages/                # Páginas da aplicação
│   │   │   │   ├── Login/            # Página de login
│   │   │   │   ├── Dashboard/        # Dashboard principal
│   │   │   │   ├── Candidates/       # Lista de candidatos
│   │   │   │   ├── Jobs/             # Lista de vagas
│   │   │   │   ├── Interviews/       # Calendário de entrevistas
│   │   │   │   ├── Analysis/         # Análises e pareceres
│   │   │   │   ├── TalentPool/       # Banco de talentos
│   │   │   │   └── Settings/         # Configurações
│   │   │   │
│   │   │   ├── hooks/                # Custom hooks
│   │   │   │   ├── useAuth.ts        # Hook de autenticação
│   │   │   │   ├── useCandidates.ts  # Hook de candidatos
│   │   │   │   ├── useJobs.ts        # Hook de vagas
│   │   │   │   ├── useInterviews.ts  # Hook de entrevistas
│   │   │   │   └── useApi.ts         # Hook genérico para API
│   │   │   │
│   │   │   ├── services/             # Serviços de API
│   │   │   │   ├── apiClient.ts      # Cliente HTTP configurado
│   │   │   │   ├── authService.ts    # Serviço de autenticação
│   │   │   │   ├── candidateService.ts
│   │   │   │   ├── jobService.ts
│   │   │   │   ├── interviewService.ts
│   │   │   │   └── analysisService.ts
│   │   │   │
│   │   │   ├── stores/               # Zustand stores
│   │   │   │   ├── authStore.ts      # Store de autenticação
│   │   │   │   ├── candidateStore.ts # Store de candidatos
│   │   │   │   ├── jobStore.ts       # Store de vagas
│   │   │   │   ├── uiStore.ts        # Store de UI
│   │   │   │   └── index.ts          # Exportação centralizada
│   │   │   │
│   │   │   ├── types/                # TypeScript types
│   │   │   │   ├── api.ts            # Tipos da API
│   │   │   │   ├── candidate.ts      # Tipos de candidatos
│   │   │   │   ├── job.ts            # Tipos de vagas
│   │   │   │   ├── interview.ts      # Tipos de entrevistas
│   │   │   │   └── index.ts          # Exportação centralizada
│   │   │   │
│   │   │   ├── utils/                # Utilitários
│   │   │   │   ├── formatters.ts     # Formatadores de dados
│   │   │   │   ├── validators.ts     # Validadores
│   │   │   │   ├── constants.ts      # Constantes da aplicação
│   │   │   │   └── helpers.ts        # Funções helper
│   │   │   │
│   │   │   ├── styles/               # Estilos globais
│   │   │   │   ├── globals.css       # Estilos globais
│   │   │   │   ├── theme.ts          # Configuração do tema MUI
│   │   │   │   └── tailwind.css      # Configuração Tailwind
│   │   │   │
│   │   │   └── routes/               # Configuração de rotas
│   │   │       ├── index.tsx         # Configuração principal
│   │   │       ├── PrivateRoute.tsx  # Rota privada
│   │   │       └── PublicRoute.tsx   # Rota pública
│   │   │
│   │   ├── tests/                    # Testes frontend
│   │   │   ├── unit/                 # Testes unitários
│   │   │   ├── integration/          # Testes de integração
│   │   │   └── e2e/                  # Testes end-to-end (Cypress)
│   │   │
│   │   └── config/                   # Configurações build
│   │       ├── vite.config.ts        # Configuração Vite
│   │       ├── tsconfig.json         # Configuração TypeScript
│   │       ├── tailwind.config.js    # Configuração Tailwind
│   │       └── postcss.config.js     # Configuração PostCSS
│   │
│   └── shared/                       # Código compartilhado
│       ├── types/                    # Tipos compartilhados
│       │   ├── api.types.ts          # Tipos da API compartilhados
│       │   ├── candidate.types.ts    # Tipos de candidato
│       │   └── index.ts              # Exportação centralizada
│       │
│       ├── utils/                    # Utilitários compartilhados
│       │   ├── dateFormatter.ts      # Formatadores de data
│       │   ├── currencyFormatter.ts  # Formatadores de moeda
│       │   └── validators.ts         # Validadores compartilhados
│       │
│       └── contracts/                # Contratos API
│           ├── openapi.yaml          # Especificação OpenAPI
│           ├── postman.json          # Coleção Postman
│           └── asyncapi.yaml         # Especificação AsyncAPI (eventos)
│
├── infrastructure/                   # Infraestrutura como código
│   ├── docker/                       # Configurações Docker
│   │   ├── backend.Dockerfile        # Dockerfile backend
│   │   ├── frontend.Dockerfile       # Dockerfile frontend
│   │   ├── nginx.Dockerfile          # Dockerfile nginx
│   │   └── docker-compose.yml        # Docker Compose dev
│   │
│   ├── kubernetes/                   # Configurações K8s (futuro)
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── ingress/
│   │   └── configmaps/
│   │
│   ├── terraform/                    # IaC Terraform (futuro)
│   │   ├── modules/
│   │   ├── environments/
│   │   └── main.tf
│   │
│   └── monitoring/                   # Monitoramento
│       ├── prometheus/
│       ├── grafana/
│       └── loki/
│
├── ai-services/                      # Serviços de IA separados
│   ├── cv-parser/                    # Parser de currículos
│   │   ├── Dockerfile
│   │   ├── app.py
│   │   └── requirements.txt
│   │
│   ├── text-analysis/                # Análise de texto
│   ├── transcription/                # Transcrição de áudio
│   └── embeddings/                   # Geração de embeddings
│
├── ops/                              # Operações e scripts
│   ├── scripts/                      # Scripts utilitários
│   │   ├── deploy.sh                 # Script de deploy
│   │   ├── backup.sh                 # Script de backup
│   │   ├── restore.sh                # Script de restore
│   │   └── health-check.sh           # Script de health check
│   │
│   ├── docs/                         # Documentação operacional
│   │   ├── deployment-guide.md       # Guia de deploy
│   │   ├── troubleshooting.md        # Troubleshooting
│   │   └── monitoring-guide.md       # Guia de monitoramento
│   │
│   └── logs/                         # Estrutura de logs
│       ├── app/
│       ├── nginx/
│       └── audit/
│
├── docs/                             # Documentação do projeto
├── .specs/                           # Especificações técnicas
├── .agents/                          # Definições dos agentes
├── .logs/                            # Logs de execução
├── .plans/                           # Planejamento
├── .tasks/                           # Tarefas
│
├── .env.example                      # Template de variáveis de ambiente
├── .gitignore                        # Git ignore
├── .dockerignore                     # Docker ignore
├── README.md                         # README principal
├── LICENSE                           # Licença do projeto
└── pyproject.toml                    # Configuração Python
```

### 1.2. Convenções de Nomenclatura

**Backend (Python):**
- **Arquivos:** snake_case (`candidate_service.py`)
- **Classes:** PascalCase (`CandidateService`)
- **Funções/Métodos:** snake_case (`get_candidate_by_id`)
- **Variáveis:** snake_case (`candidate_list`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

**Frontend (TypeScript):**
- **Arquivos:** PascalCase para componentes, camelCase para outros (`CandidateList.tsx`, `apiClient.ts`)
- **Componentes React:** PascalCase (`CandidateCard`)
- **Funções/Variáveis:** camelCase (`fetchCandidates`)
- **Interfaces/Types:** PascalCase (`CandidateData`)
- **Enums:** PascalCase singular (`CandidateStatus`)

**Banco de Dados:**
- **Tabelas:** snake_case plural (`candidates`)
- **Colunas:** snake_case (`created_at`)
- **Índices:** `idx_<tabela>_<colunas>` (`idx_candidates_email`)
- **Constraints:** `fk_<tabela>_<coluna>_<tabela_ref>` (`fk_candidates_user_id`)

## 2. Configuração de Ambiente

### 2.1. Variáveis de Ambiente

**Backend (.env):**
```env
# Aplicação
APP_NAME=HumanG
APP_ENV=development  # development, staging, production
APP_DEBUG=true
APP_SECRET_KEY=your-secret-key-here
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/humang_dev
DATABASE_TEST_URL=postgresql://user:password@localhost:5432/humang_test
REDIS_URL=redis://localhost:6379/0

# Autenticação
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Serviços de IA
OPENAI_API_KEY=your-openai-api-key
GOOGLE_CLOUD_API_KEY=your-google-api-key
HUGGINGFACE_TOKEN=your-huggingface-token

# Integrações Externas
GOOGLE_CALENDAR_CLIENT_ID=your-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-client-secret
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Armazenamento
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=humang-documents
AWS_REGION=us-east-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password
DEFAULT_FROM_EMAIL=noreply@humang.com.br

# Monitoramento
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=INFO
```

**Frontend (.env):**
```env
VITE_APP_NAME=HumanG
VITE_APP_ENV=development
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2.2. Configuração por Ambiente

**Development:**
- Banco de dados local (PostgreSQL + Redis)
- Hot reload no frontend e backend
- Logging detalhado
- Mock de serviços externos

**Staging:**
- Replicação de produção
- Dados de teste realistas
- Monitoramento ativo
- Testes de integração completos

**Production:**
- Banco de dados otimizado
- Cache agressivo
- Logging estruturado
- SSL/TLS obrigatório
- Rate limiting ativo

## 3. Integrações Técnicas

### 3.1. API Externa - Google Calendar

**Configuração:**
```python
# backend/app/core/google_calendar.py
GOOGLE_CALENDAR_CONFIG = {
    "SCOPES": ["https://www.googleapis.com/auth/calendar"],
    "CREDENTIALS_FILE": "credentials/google-calendar.json",
    "TOKEN_FILE": "tokens/google-calendar-token.json",
    "CALENDAR_ID": "primary",
    "TIMEZONE": "America/Sao_Paulo"
}
```

**Endpoints relacionados:**
- `POST /api/v1/interviews/{id}/google-calendar` - Criar evento no Google Calendar
- `PATCH /api/v1/interviews/{id}/google-calendar` - Atualizar evento
- `DELETE /api/v1/interviews/{id}/google-calendar` - Deletar evento

### 3.2. API Externa - SendGrid (Email)

**Configuração:**
```python
# backend/app/core/email.py
EMAIL_CONFIG = {
    "PROVIDER": "sendgrid",  # ou "smtp"
    "SENDGRID_API_KEY": os.getenv("SENDGRID_API_KEY"),
    "DEFAULT_FROM": "noreply@humang.com.br",
    "TEMPLATES": {
        "candidate_invitation": "d-1234567890",
        "interview_confirmation": "d-0987654321",
        "rejection_notification": "d-1122334455"
    }
}
```

### 3.3. API Externa - Twilio (WhatsApp)

**Configuração:**
```python
# backend/app/core/whatsapp.py
WHATSAPP_CONFIG = {
    "PROVIDER": "twilio",
    "ACCOUNT_SID": os.getenv("TWILIO_ACCOUNT_SID"),
    "AUTH_TOKEN": os.getenv("TWILIO_AUTH_TOKEN"),
    "WHATSAPP_NUMBER": "whatsapp:+14155238886",
    "TEMPLATES": {
        "interview_reminder": "interview_reminder_24h",
        "application_update": "application_status_update"
    }
}
```

### 3.4. Processamento de Arquivos (S3/minIO)

**Configuração:**
```python
# backend/app/core/storage.py
STORAGE_CONFIG = {
    "PROVIDER": "s3",  # ou "minio" para self-hosted
    "BUCKET_NAME": os.getenv("AWS_S3_BUCKET_NAME"),
    "REGION": os.getenv("AWS_REGION"),
    "ENDPOINT_URL": None,  # Para minIO: "http://localhost:9000"
    "ACCESS_KEY": os.getenv("AWS_ACCESS_KEY_ID"),
    "SECRET_KEY": os.getenv("AWS_SECRET_ACCESS_KEY"),
    "MAX_FILE_SIZE": 10 * 1024 * 1024,  # 10MB
    "ALLOWED_EXTENSIONS": [".pdf", ".doc", ".docx", ".txt"]
}
```

## 4. API Design e Contratos

### 4.1. Especificação OpenAPI

**Estrutura base:**
```yaml
openapi: 3.0.3
info:
  title: HumanG API
  version: 1.0.0
  description: API para o sistema HumanG de seleção inteligente
servers:
  - url: http://localhost:8000/api/v1
    description: Development server
paths:
  /candidates:
    get:
      summary: Listar candidatos
      tags: [Candidates]
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        200:
          description: Lista de candidatos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CandidateListResponse'
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Candidate:
      type: object
      required: [id, full_name, email]
      properties:
        id:
          type: string
          format: uuid
        full_name:
          type: string
        email:
          type: string
          format: email
```

### 4.2. Padrões de Response

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "candidate": {
      "id": "uuid",
      "full_name": "João Silva",
      "email": "joao@email.com"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_123456"
  }
}
```

### 4.3. Códigos de Erro Padronizados

| Código | Descrição | HTTP Status |
|--------|-----------|-------------|
| `AUTH_REQUIRED` | Autenticação necessária | 401 |
| `INVALID_TOKEN` | Token inválido ou expirado | 401 |
| `PERMISSION_DENIED` | Permissão insuficiente | 403 |
| `RESOURCE_NOT_FOUND` | Recurso não encontrado | 404 |
| `VALIDATION_ERROR` | Erro de validação | 422 |
| `RATE_LIMITED` | Limite de requisições excedido | 429 |
| `INTERNAL_ERROR` | Erro interno do servidor | 500 |
| `EXTERNAL_SERVICE_ERROR` | Erro em serviço externo | 502 |

## 5. Configuração de Desenvolvimento

### 5.1. Setup Local

**Pré-requisitos:**
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

**Comandos de setup:**
```bash
# Clone o repositório
git clone https://github.com/seu-org/humang.git
cd humang

# Configuração do ambiente
cp .env.example .env
# Edite .env com suas configurações

# Inicialização com Docker (recomendado)
docker-compose up -d

# Ou setup manual
# Backend
cd src/backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements/dev.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd src/frontend
npm install
npm run dev
```

### 5.2. Docker Compose para Desenvolvimento

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: humang_dev
      POSTGRES_USER: humang
      POSTGRES_PASSWORD: humang123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./src/backend
      dockerfile: Dockerfile.dev
    environment:
      DATABASE_URL: postgresql://humang:humang123@postgres:5432/humang_dev
      REDIS_URL: redis://redis:6379/0
    ports:
      - "8000:8000"
    volumes:
      - ./src/backend:/app
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./src/frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./src/frontend:/app
      - /app/node_modules
    environment:
      VITE_API_URL: http://localhost:8000/api/v1

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

## 6. Scripts e Automação

### 6.1. Scripts de Desenvolvimento

**package.json (frontend):**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

**Makefile (backend):**
```makefile
# Makefile
.PHONY: help install test lint format migrate run

help:
	@echo "Comandos disponíveis:"
	@echo "  install     Instala dependências"
	@echo "  test       Executa testes"
	@echo "  lint       Verifica estilo de código"
	@echo "  format     Formata código automaticamente"
	@echo "  migrate    Executa migrações do banco"
	@echo "  run        Inicia servidor de desenvolvimento"

install:
	pip install -r requirements/dev.txt

test:
	pytest tests/ -v --cov=app --cov-report=html

lint:
	black --check app tests
	flake8 app tests
	mypy app

format:
	black app tests
	isort app tests

migrate:
	alembic upgrade head

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6.2. CI/CD Pipeline

**GitHub Actions (.github/workflows/ci.yml):**
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: humang_test
          POSTGRES_USER: humang
          POSTGRES_PASSWORD: humang123
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          pip install -r src/backend/requirements/test.txt
          
      - name: Run tests
        env:
          DATABASE_URL: postgresql://humang:humang123@postgres:5432/humang_test
          REDIS_URL: redis://redis:6379/0
        run: |
          cd src/backend
          pytest tests/ -v --cov=app --cov-report=xml
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd src/frontend
          npm ci
          
      - name: Run tests
        run: |
          cd src/frontend
          npm test -- --coverage
          
      - name: Build
        run: |
          cd src/frontend
          npm run build
```

## 7. Padrões de Código

### 7.1. Backend Python

**FastAPI Best Practices:**
```python
# Exemplo de service pattern
class CandidateService:
    def __init__(self, candidate_repository: CandidateRepository):
        self.repository = candidate_repository
    
    async def get_candidate(self, candidate_id: UUID) -> CandidateSchema:
        candidate = await self.repository.get_by_id(candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        return CandidateSchema.from_orm(candidate)
    
    async def create_candidate(self, data: CandidateCreateSchema) -> CandidateSchema:
        # Validação de negócio
        if await self.repository.email_exists(data.email):
            raise HTTPException(
                status_code=400, 
                detail="Email already registered"
            )
        
        # Criação do candidato
        candidate = Candidate(**data.dict())
        await self.repository.create(candidate)
        
        # Eventos pós-criação
        await self._send_welcome_email(candidate)
        
        return CandidateSchema.from_orm(candidate)
```

**Repository Pattern:**
```python
class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: AsyncSession):
        self.model = model
        self.session = session
    
    async def get_by_id(self, id: UUID) -> Optional[T]:
        result = await self.session.get(self.model, id)
        return result
    
    async def create(self, obj: T) -> T:
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

class CandidateRepository(BaseRepository[Candidate]):
    async def email_exists(self, email: str) -> bool:
        stmt = select(self.model).where(self.model.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None
```

### 7.2. Frontend TypeScript

**Component Pattern:**
```tsx
// CandidateCard.tsx
import React from 'react';
import { Candidate } from '@/types/candidate';
import { formatDate } from '@/utils/formatters';
import { Card, CardContent, Typography } from '@mui/material';

interface CandidateCardProps {
  candidate: Candidate;
  onClick?: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(candidate);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': { 
          boxShadow: onClick ? 6 : 1 
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {candidate.full_name}
        </Typography>
        <Typography color="text.secondary">
          {candidate.email}
        </Typography>
        <Typography variant="body2">
          Aplicado em: {formatDate(candidate.created_at)}
        </Typography>
      </CardContent>
    </Card>
  );
};
```

**Custom Hook Pattern:**
```typescript
// useCandidates.ts
import { useState, useEffect, useCallback } from 'react';
import { Candidate, CandidateFilters } from '@/types/candidate';
import { candidateService } from '@/services/candidateService';

export const useCandidates = (filters?: CandidateFilters) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchCandidates = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.getCandidates({
        ...filters,
        page,
        limit: 20
      });
      
      setCandidates(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCandidates(1);
  }, [fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    pagination,
    refetch: fetchCandidates
  };
};
```

## 8. Testes e Qualidade

### 8.1. Estratégia de Testes

**Test Pyramid:**
- **Unit Tests (70%):** Testes isolados de funções, classes, services
- **Integration Tests (20%):** Testes de integração entre componentes
- **E2E Tests (10%):** Testes de fluxos completos do usuário

**Backend Tests:**
```python
# tests/unit/test_candidate_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.candidate_service import CandidateService
from app.schemas.candidate import CandidateCreateSchema

@pytest.mark.asyncio
async def test_create_candidate_success():
    # Arrange
    mock_repo = AsyncMock()
    mock_repo.email_exists.return_value = False
    mock_repo.create.return_value = MagicMock(id=1, email="test@email.com")
    
    service = CandidateService(mock_repo)
    data = CandidateCreateSchema(email="test@email.com", full_name="Test")
    
    # Act
    result = await service.create_candidate(data)
    
    # Assert
    assert result.email == "test@email.com"
    mock_repo.email_exists.assert_called_once_with("test@email.com")
    mock_repo.create.assert_called_once()
```

**Frontend Tests:**
```typescript
// tests/unit/CandidateCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { Candidate } from '@/types/candidate';

describe('CandidateCard', () => {
  const mockCandidate: Candidate = {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    created_at: '2024-01-01T12:00:00Z'
  };

  it('renders candidate information', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CandidateCard candidate={mockCandidate} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('John Doe'));
    expect(handleClick).toHaveBeenCalledWith(mockCandidate);
  });
});
```

### 8.2. Quality Gates

**SonarQube Configuration:**
```yaml
# sonar-project.properties
sonar.projectKey=humang
sonar.projectName=HumanG
sonar.projectVersion=1.0

sonar.sources=src
sonar.tests=tests
sonar.test.inclusions=tests/**/*

sonar.python.coverage.reportPaths=coverage.xml
sonar.javascript.coverage.reportPaths=coverage/lcov.info

sonar.exclusions=**/node_modules/**, **/venv/**, **/migrations/**

sonar.qualitygate.wait=true
```

## 9. Deploy e Infraestrutura

### 9.1. Estratégia de Deploy

**Blue-Green Deployment:**
```yaml
# infrastructure/kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: humang-backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: humang-backend
  template:
    metadata:
      labels:
        app: humang-backend
        version: v1.2.0
    spec:
      containers:
      - name: backend
        image: humang/backend:v1.2.0
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: humang-config
        - secretRef:
            name: humang-secrets
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
```

### 9.2. Monitoring Stack

**Grafana Dashboards:**
- **Business Metrics:** Candidatos processados, entrevistas agendadas, tempo médio de contratação
- **Technical Metrics:** API response time, error rate, database connections
- **Infrastructure Metrics:** CPU, memory, disk usage, network traffic

**Alerting Rules:**
```yaml
# infrastructure/monitoring/prometheus/rules.yml
groups:
  - name: humang_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.instance }}"
          description: "Error rate is {{ $value }}"
      
      - alert: DatabaseSlowQueries
        expr: pg_stat_database_blk_read_time{datname="humang_prod"} > 1000
        for: 2m
        labels:
          severity: warning
```

## 10. Próximos Passos Técnicos

### 10.1. Sprint 0 - Setup Foundation
- [ ] Configurar estrutura de pastas inicial
- [ ] Configurar Docker Compose para desenvolvimento
- [ ] Setup inicial do banco de dados
- [ ] Configurar autenticação básica (JWT)
- [ ] Criar CI/CD pipeline básico

### 10.2. Sprint 1 - Core Entities
- [ ] Implementar modelos de User, Company, Job, Candidate
- [ ] Criar CRUD básico para entidades principais
- [ ] Implementar sistema de permissões (RBAC)
- [ ] Criar dashboard inicial do cliente

### 10.3. Sprint 2 - Candidate Pipeline
- [ ] Implementar upload e parse de currículos
- [ ] Criar sistema de triagem inicial
- [ ] Implementar agendamento de entrevistas
- [ ] Integração com Google Calendar

### 10.4. Sprint 3 - Intelligence Layer
- [ ] Implementar análise automática de currículos
- [ ] Criar sistema de scoring de candidatos
- [ ] Implementar geração de pareceres
- [ ] Sistema de notificações por email/WhatsApp

### 10.5. Sprint 4 - Talent Pool & Analytics
- [ ] Implementar banco de talentos
- [ ] Criar sistema de match para vagas futuras
- [ ] Dashboard de analytics
- [ ] Relatórios e exportação de dados

---

**Próximo passo:** Iniciar ET-04 (UX and Flow Designer) para estruturar jornadas de usuário e fluxos principais.

*Documento gerado pelo System Architect - ET-03*
*Base: .docs/01-visao-produto.md, .docs/02-prd-inicial.md, .docs/03-arquitetura-sistema.md, .specs/01-entidades-e-dados.md*

