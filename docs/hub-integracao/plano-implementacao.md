# 📋 Plano de Implementação - Hub de Integrações SagB

**Data:** 2026-04-19  
**Autor:** Pierre Zanulli (Agente Mestre de Orquestração)  
**Revisado por:** Alan Flow (Diretor de Automações)  
**Status:** Aprovado para execução  

---

## 🎯 Visão Geral

O **Hub de Integrações** será a camada centralizada oficial do SagB para gerenciamento de conexões externas (WhatsApp, ClickUp, e-mail, agenda, Meta, Supabase, webhooks, APIs). Evita duplicação de código, espalhamento de tokens e falta de governança entre módulos.

## 🏗️ Arquitetura

### Posicionamento no SagB
```
┌─────────────────────────────────┐
│      Módulos de Negócio         │ ← CRM, Taskzei, Agentes, etc.
├─────────────────────────────────┤
│      Hub de Integrações         │ ← CAMADA CENTRAL (módulo + serviço)
├─────────────────────────────────┤
│      Core do SagB               │ ← Auth, Storage, Config
└─────────────────────────────────┘
```

### Estrutura Técnica
```
src/modules/hub-integracao/
├── manifest.ts                          # Registro no sistema
├── routes.tsx                          # Rotas do módulo
├── index.ts                            # Exportações públicas
├── pages/
│   └── HubIntegracaoPage.tsx           # Dashboard principal
├── components/
│   ├── IntegrationCatalog.tsx          # Catálogo de integrações
│   ├── ConnectionManager.tsx           # Gerenciador de conexões
│   ├── ConnectionTest.tsx              # Teste de conexão
│   └── ActivityLog.tsx                 # Logs de atividade
├── services/
│   ├── integrationService.ts           ⭐ SERVIÇO CENTRAL
│   ├── credentialManager.ts            # Gerenciador seguro
│   ├── clickupService.ts               # Driver ClickUp
│   ├── whatsappService.ts              # Driver WhatsApp
│   └── loggerService.ts                # Logs centralizados
├── types/
│   └── integration.types.ts            # Tipos TypeScript
├── utils/
│   ├── encryption.ts                   # Criptografia de credenciais
│   └── validation.ts                   # Validação de configs
└── agent/                              # Agente Alan Flow
    ├── persona.md
    ├── owner.md
    ├── prompt-ativacao-cline.md
    ├── session-log.md
    └── diretriz-operacao-hub.md
```

## 🎯 MVP (Escopo Mínimo Viável)

### Funcionalidades Core
- [ ] Estrutura do módulo plugável completa
- [ ] Serviço central acessível por outros módulos  
- [ ] Catálogo básico de integrações (UI)
- [ ] Conexões ativas (CRUD)
- [ ] Teste de conexão (ping/health check)
- [ ] Logs básicos de uso
- [ ] POC com 2 integrações: ClickUp + WhatsApp

### Exclusões do MVP
- OAuth automatizado (manual no MVP)
- Webhook management avançado
- Dashboard de métricas
- Marketplace de integrações
- API pública para desenvolvedores

## 🔄 Fases de Implementação

### FASE 1 - Fundação (Semana 1)
- [ ] 1.1 Criar estrutura base do módulo
- [ ] 1.2 Implementar manifest.ts e routes.tsx  
- [ ] 1.3 Registrar no moduleRegistry
- [ ] 1.4 Criar página básica do dashboard
- [ ] 1.5 Implementar serviço central (integrationService.ts)
- [ ] 1.6 Criar sistema de armazenamento seguro (LocalStorage → Supabase)

### FASE 2 - Catálogo e Conexões (Semana 2)
- [ ] 2.1 Componente IntegrationCatalog.tsx
- [ ] 2.2 Componente ConnectionManager.tsx (CRUD)
- [ ] 2.3 Sistema de teste de conexão
- [ ] 2.4 Logs básicos de atividade
- [ ] 2.5 Interface de configuração de credenciais

### FASE 3 - Drivers de Integração (Semana 3)
- [ ] 3.1 Driver ClickUp (tasks, spaces, lists)
- [ ] 3.2 Driver WhatsApp Business API
- [ ] 3.3 Sistema de mapeamento de escopos/permissões
- [ ] 3.4 Health check automático

### FASE 4 - Integração com Módulos (Semana 4)
- [ ] 4.1 Atualizar Taskzei para usar Hub (ClickUp)
- [ ] 4.2 Atualizar CRM Ziplia para usar Hub (WhatsApp)
- [ ] 4.3 Documentação para desenvolvedores
- [ ] 4.4 Testes end-to-end

## 🧪 POC - Integrações Críticas

### ClickUp (Prioridade Alta)
- **Justificativa:** Já usado no Taskzei, complexidade média, ROI alto
- **Escopo MVP:** Listar espaços, criar tasks, webhooks básicos
- **Configuração:** API Token + Space ID
- **Módulo consumidor:** Taskzei (já existe integração)

### WhatsApp Business API (Prioridade Alta)
- **Justificativa:** Crítico para CRM, alto valor de negócio
- **Escopo MVP:** Enviar mensagens, status de entrega
- **Configuração:** Token + Number ID + Webhook URL
- **Módulo consumidor:** CRM Ziplia (já existe necessidade)

### Backup (se necessário)
- **Google Calendar** (simples, OAuth bem documentado)
- **Supabase** (já usamos internamente, bom para teste)

## 👤 Agente Responsável

### Alan Flow - Diretor de Automações e Integrações
- **Justificativa:** Identificou a necessidade, conhecimento técnico em APIs, alinhamento natural com automações
- **Responsabilidades:**
  - Estabelecer padrões de segurança
  - Validar novas integrações
  - Manter catálogo atualizado
  - Governar uso entre módulos

### Estrutura do Agente
```markdown
# agent/persona.md
- "Sou Alan Flow, Diretor de Automações e Integrações do SagB"
- "Meu foco é conectar o SagB ao mundo exterior de forma segura e escalável"
- "Sou pragmático: integração que funciona > integração perfeita"
```

## 📊 Definição de Prontidão (DoR)

### MVP Pronto quando:
- [ ] Módulo aparece no Sidebar como "Hub de Integrações"
- [ ] Dashboard mostra catálogo com ClickUp e WhatsApp
- [ ] É possível configurar credenciais para ambas
- [ ] Teste de conexão retorna "Conectado" ou "Erro"
- [ ] Taskzei consegue criar task no ClickUp via Hub
- [ ] CRM Ziplia consegue enviar mensagem WhatsApp via Hub
- [ ] Logs mostram atividade das integrações

### Métricas de Sucesso (30 dias)
- 2 integrações funcionais no catálogo
- 2 módulos consumindo o Hub
- Redução de 50% no código de integração duplicado
- Tempo de setup de nova integração reduzido em 70%

## 🛡️ Governança e Padrões

### Regras Obrigatórias (a partir do MVP)
1. **Nenhum módulo novo implementa integração própria**
2. **Todas as credenciais passam pelo Hub**
3. **Novas integrações requerem aprovação do agente**
4. **Logs de uso são centralizados no Hub**
5. **Documentação pública para cada integração**

### Template de Integração
```typescript
interface IntegrationTemplate {
  id: string;
  name: string;           // "WhatsApp Business"
  provider: string;       // "meta"
  authType: 'api_key' | 'oauth2' | 'basic';
  baseUrl: string;
  endpoints: Endpoint[];
  scopes: string[];
  rateLimits: RateLimit[];
  errorHandling: ErrorHandler[];
}
```

## 🚀 Roadmap Pós-MVP

### Fase 2 (30-60 dias)
- OAuth flow automatizado
- Dashboard de métricas
- Sistema de webhooks avançado
- +3 integrações (Google Calendar, Email SMTP, Meta Ads)

### Fase 3 (60-90 dias)
- Marketplace interno de integrações
- API pública para desenvolvedores
- Sistema de templates de automação
- Analytics avançado de uso

### Fase 4 (90+ dias)
- IA para sugestão de integrações
- Auto-healing de conexões
- Compliance e auditoria
- Certificações de segurança

## 📝 Próximos Passos Imediatos

### Hoje/amanhã
1. **Criar repositório de decisões** - `docs/hub-integracao/decisions.md`
2. **Definir equipe mínima** - Alan Flow + 1 dev front + 1 dev back
3. **Estimar esforço** - ~4 semanas para MVP
4. **Priorizar no backlog** - Colocar como prioridade alta

### Semana que vem
1. **Kickoff com time técnico** - Segunda-feira, 10h
2. **Iniciar Fase 1 (estrutura)**
3. **Definir reuniões de sync semanais** - Quintas, 16h
4. **Criar canal #hub-integracoes no Slack**

## 👥 Equipe

### Responsáveis
- **Product Owner:** Alan Flow
- **Tech Lead:** [Definir]
- **Frontend:** [Definir]  
- **Backend:** [Definir]
- **QA:** [Definir]

### Dependências
- **Taskzei team** - Para integração ClickUp
- **CRM Ziplia team** - Para integração WhatsApp
- **Infra team** - Para segurança/criptografia

## 📞 Contato e Comunicação

### Canais
- **Slack:** #hub-integracoes
- **Reuniões:** Weekly sync - Quintas, 16h
- **Documentação:** Esta pasta (`docs/hub-integracao/`)
- **Decisões:** `docs/hub-integracao/decisions.md`

### Stakeholders
- **Alan Flow** - PO e Agente responsável
- **Pierre Zanulli** - Orquestração arquitetural
- **Time de Produto** - Priorização
- **Todos os devs de módulos** - Consumidores

---

## ✅ Checklist de Início

- [ ] Alan confirmado como Agente responsável
- [ ] Time técnico alocado
- [ ] Kickoff agendado
- [ ] Repositório do módulo criado
- [ ] Primeira task da Fase 1 em andamento

---

**Última atualização:** 2026-04-19  
**Próxima revisão:** 2026-04-26 (após kickoff)