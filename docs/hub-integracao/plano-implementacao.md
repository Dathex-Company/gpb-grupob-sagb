# 📋 Plano de Implementação - Hub de Integrações SagB

**Data:** 2026-04-19  
**Autor:** Pierre Zanulli (Agente Mestre de Orquestração)  
**Revisado por:** Alan Flow (Diretor de Automações)
**Status:** Em execução — Prioridades revisadas em 04/05/2026

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

### FASE 3 - Drivers de Integração (Semana 3) — [Prioridade Revisada 04/05]
- [ ] 3.1 **Driver WhatsApp Business API** (Inbound via webhook + Outbound)
- [ ] 3.2 Webhook handler para receber mensagens da Meta e processar payload
- [ ] 3.3 Integração com `taskzei.hub.ts` — injeção de mensagens no Inbox Inteligente
- [ ] 3.4 Sistema de mapeamento de escopos/permissões
- [ ] 3.5 Health check automático

### FASE 4 - Integração com Módulos (Semana 4) — [Prioridade Revisada 04/05]
- [ ] 4.1 **Taskzei consumindo WhatsApp via Hub** (injetar mensagens no Inbox)
- [ ] 4.2 Atualizar CRM Ziplia para usar Hub (WhatsApp outbound)
- [ ] 4.3 Driver E-mail (Gmail e Titan) com OAuth2
- [ ] 4.4 Documentação para desenvolvedores
- [ ] 4.5 Testes end-to-end

## 🧪 POC - Integrações Críticas (Prioridades revisadas em 04/05/2026)

> **Nota estratégica:** O ClickUp foi removido do escopo de integração do Hub. O sistema proprietário **Taskzei** substitui o ClickUp como plataforma de gestão de tarefas do SagB. O Taskzei já possui interface `taskzei.hub.ts` aberta para receber payloads do Hub.

### WhatsApp Business API (Prioridade Máxima — Urgência Operacional)
- **Justificativa:** Maior gargalo operacional do Taskzei. Muitas demandas nascem soltas no WhatsApp. Com a Fase 6 (Inbox Inteligente) e Fase 8 (Parser de Linguagem Natural) já entregues no Taskzei, o Hub precisa capturar mensagens do WhatsApp (inbound via webhook) e injetar no Inbox do Taskzei para que a IA classifique e converta em tarefas automaticamente.
- **Escopo MVP:**
  - **Inbound (webhook):** Receber mensagens da Meta, autenticar, processar payload e injetar no `taskzei.hub.ts`
  - **Outbound:** Enviar mensagens, status de entrega (já possui alicerce inicial no `whatsappService.ts`)
- **Configuração:** Token + Number ID + Webhook URL
- **Módulo consumidor primário:** Taskzei (Inbox Inteligente)
- **Módulo consumidor secundário:** CRM Ziplia

### E-mail — Gmail e Titan (Alta Prioridade)
- **Justificativa:** Demandas formais e aprovações chegam por e-mail corporativo. Transformar threads de e-mail em tarefas com contexto anexo acelera o backoffice.
- **Escopo MVP:** Capturar e-mails inbound (webhook/IMAP), converter em payload para `taskzei.hub.ts`
- **Configuração:** OAuth2 com refresh token
- **Módulo consumidor:** Taskzei

### Ecossistema Meta — Facebook/Instagram (Baixa Prioridade para Taskzei)
- **Justificativa:** Integração mais relevante para CRM/Vendas (Ziplia) do que para gestão de tarefas.
- **Status:** Congelado para Taskzei. Será atendido quando CRM Ziplia demandar.
- **Módulo consumidor:** CRM Ziplia

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

### MVP Pronto quando — [Prioridade Revisada 04/05]
- [ ] Módulo aparece no Sidebar como "Hub de Integrações"
- [ ] Dashboard mostra catálogo com WhatsApp (prioridade máxima) e E-mail (alta prioridade)
- [ ] Webhook do WhatsApp configurado e recebendo mensagens no Hub
- [ ] Hub injeta mensagens do WhatsApp no `taskzei.hub.ts` (Inbox Inteligente)
- [ ] É possível configurar credenciais para WhatsApp e E-mail
- [ ] Teste de conexão retorna "Conectado" ou "Erro"
- [ ] Taskzei recebe mensagens do WhatsApp via Hub e converte em tarefas (NLP)
- [ ] CRM Ziplia consegue enviar mensagem WhatsApp via Hub (outbound)
- [ ] Logs mostram atividade das integrações

### Métricas de Sucesso (30 dias)
- 1 integração funcional no catálogo (WhatsApp inbound + outbound)
- 2 módulos consumindo o Hub (Taskzei + CRM Ziplia)
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

## 📝 Próximos Passos Imediatos — [Revisado 04/05]

### Hoje/amanhã
1. ~~Criar repositório de decisões~~ ✅ — `docs/hub-integracao/decisions.md` já criado
2. **Atualizar prioridades no backlog** — WhatsApp (inbound/outbound) como prioridade máxima
3. **Alinhar com Dani Freitas (Taskzei)** — Já realizado. Arquitetura aberta via `taskzei.hub.ts`
4. **Mapear estrutura do webhook WhatsApp** — Definir endpoints e payloads

### Semana que vem
1. **Iniciar desenvolvimento do webhook handler para WhatsApp inbound**
2. **Estruturar injeção de payload no `taskzei.hub.ts`**
3. **Definir reuniões de sync semanais** — Quintas, 16h
4. **Criar canal #hub-integracoes no Slack**

## 👥 Equipe

### Responsáveis
- **Product Owner:** Alan Flow
- **Tech Lead:** [Definir]
- **Frontend:** [Definir]  
- **Backend:** [Definir]
- **QA:** [Definir]

### Dependências — [Revisado 04/05]
- **Taskzei team (Dani Freitas)** — Para integração WhatsApp inbound (Inbox Inteligente)
- **CRM Ziplia team** — Para integração WhatsApp outbound
- **Infra team** — Para segurança/criptografia e configuração de webhooks Meta

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

- [x] Alan confirmado como Agente responsável
- [ ] Time técnico alocado
- [x] Kickoff realizado com Dani Freitas (Taskzei) — 04/05
- [x] Repositório do módulo criado
- [x] Estrutura base do módulo implementada (manifest, routes, services)
- [x] Driver WhatsApp outbound com alicerce inicial
- [ ] **Webhook WhatsApp inbound em desenvolvimento**
- [ ] Primeira task da Fase 3 (Driver WhatsApp) em andamento

---

**Última atualização:** 2026-05-04
**Próxima revisão:** 2026-05-11 (após avanço do webhook WhatsApp)