# Plano Corrigido de Migração com Paridade Real — CRM Ziplia

## 1. Diagnóstico correto do CRM real

Baseado no sistema original em [`App.tsx`](_ventures/ziplia/modules/crm/web/src/App.tsx:87), o CRM real não é um painel simples de leads. Ele possui:

- Shell completo com sidebar interna e múltiplas abas em [`activeTab`](_ventures/ziplia/modules/crm/web/src/App.tsx:88)
- 3 visualizações de pipeline (`classic`, `modern`, `lines`) em [`viewVariant`](_ventures/ziplia/modules/crm/web/src/App.tsx:89)
- Modal de criação de lead em [`isNewLeadModalOpen`](_ventures/ziplia/modules/crm/web/src/App.tsx:150)
- Modal detalhado de lead com playbook, score UAU e auditoria em [`selectedLead`](_ventures/ziplia/modules/crm/web/src/App.tsx:97)
- Dashboard colaborador e dashboard gestor em [`renderDashboardColab()`](_ventures/ziplia/modules/crm/web/src/App.tsx:423) e aba `dashboard-gestor` em [`activeTab === 'dashboard-gestor'`](_ventures/ziplia/modules/crm/web/src/App.tsx:1053)
- WhatsApp inbox em [`activeTab === 'whatsapp'`](_ventures/ziplia/modules/crm/web/src/App.tsx:1279)
- Integrações e inbox unificada em [`IntegrationsPanel`](_ventures/ziplia/modules/crm/web/src/App.tsx:1051) e [`InboxPanel`](_ventures/ziplia/modules/crm/web/src/App.tsx:1052)
- Camada API rica em [`crmApi`](_ventures/ziplia/modules/crm/web/src/lib/crmApi.ts:43)

## 2. Escopo de paridade funcional obrigatória

### 2.1 Núcleo comercial

1. Pipeline com 3 modos visuais equivalentes aos renderizadores:
   - [`renderKanban()`](_ventures/ziplia/modules/crm/web/src/App.tsx:211)
   - [`renderGrid()`](_ventures/ziplia/modules/crm/web/src/App.tsx:310)
   - [`renderLines()`](_ventures/ziplia/modules/crm/web/src/App.tsx:359)
2. Busca global de leads em [`searchQuery`](_ventures/ziplia/modules/crm/web/src/App.tsx:93)
3. Criação de lead com fluxo igual ao modal em [`onClick={async () => ... createLead ...}`](_ventures/ziplia/modules/crm/web/src/App.tsx:724)
4. Edição/avanço de etapa com motivo de auditoria em [`handleUpdateLead()`](_ventures/ziplia/modules/crm/web/src/App.tsx:117)

### 2.2 Operação e gestão

1. Dashboard colaborador com KPIs e risco em [`renderDashboardColab()`](_ventures/ziplia/modules/crm/web/src/App.tsx:423)
2. Dashboard gestor completo com:
   - performance por etapa [`stages.map`](_ventures/ziplia/modules/crm/web/src/App.tsx:1084)
   - higiene de dados e risco [`activeTab === 'dashboard-gestor'`](_ventures/ziplia/modules/crm/web/src/App.tsx:1053)
   - auditoria em [`auditLogs`](_ventures/ziplia/modules/crm/web/src/App.tsx:98)

### 2.3 Comunicação e integrações

1. WhatsApp inbox da aba [`whatsapp`](_ventures/ziplia/modules/crm/web/src/App.tsx:1279)
2. Integrações via [`/api/integrations`](_ventures/ziplia/modules/crm/web/src/lib/crmApi.ts:71)
3. Inbox/threads via [`getThreads()`](_ventures/ziplia/modules/crm/web/src/lib/crmApi.ts:90)

### 2.4 Configuração

1. Configurações de probabilidade e fatores da aba [`settings`](_ventures/ziplia/modules/crm/web/src/App.tsx:1195)
2. Playbook por estágio vindo de [`STAGES`](_ventures/ziplia/modules/crm/web/src/constants.ts:3) e API de estágios em [`getStages()`](_ventures/ziplia/modules/crm/web/src/lib/crmApi.ts:46)

## 3. Estratégia técnica corrigida

## 3.1 Arquitetura de páginas no módulo SagB

Estrutura alvo em [`src/modules/crm_ziplia`](src/modules/crm_ziplia):

- `pages/CrmZipliaPage.tsx` (shell principal)
- `components/pipeline/*` (kanban, grid, lines)
- `components/modals/*` (novo lead, detalhe lead)
- `components/dashboard/*` (colab e gestor)
- `components/whatsapp/*`
- `components/integrations/*`

## 3.2 Camada de dados

Para manter paridade real, a primeira entrega deve preservar o contrato do legado em [`crmApi`](_ventures/ziplia/modules/crm/web/src/lib/crmApi.ts:43), mapeando 1:1 endpoint e payload.

## 3.3 Sequência de migração por feature

1. Shell + tabs + estados base
2. Pipeline 3 views
3. Modal novo lead
4. Modal detalhe lead + avanço de etapa + auditoria
5. Dashboard colaborador
6. Dashboard gestor
7. WhatsApp
8. Integrações + inbox
9. Configurações

## 4. Critérios de aceite (paridade real)

Cada feature só fecha quando tiver comportamento equivalente ao legado em [`_ventures/ziplia/modules/crm/web/src/App.tsx`](_ventures/ziplia/modules/crm/web/src/App.tsx:87), não apenas visual parcial.

Checklist mínimo por etapa:

- [ ] mesma ação de usuário
- [ ] mesmo efeito no estado
- [ ] mesma persistência de dados
- [ ] mesma resposta de erro/fallback

## 5. Risco principal identificado

Risco de regressão por simplificação funcional.

Mitigação: governar migração por matriz de paridade e não por “MVP reduzido”.

