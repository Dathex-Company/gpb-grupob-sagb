# Plano do Módulo TaskZei — Agenda Inteligente

> **Documento:** Plano executivo oficial do módulo
> **Responsável:** Dani Freitas
> **Última atualização:** 2026-05-02

---

## Índice

1. [Identidade do Módulo](#1-identidade-do-módulo)
2. [Definição Técnica do Módulo](#2-definição-técnica-do-módulo)
3. [Estado Atual (Baseline)](#3-estado-atual-baseline)
4. [Pendências Estruturais Pré-Fase 1](#4-pendências-estruturais-pré-fase-1)
5. [Estrutura das Fases](#5-estrutura-das-fases)
6. [FASE 1 — Governança Oficial do Módulo](#fase-1--governança-oficial-do-módulo)
7. [FASE 2 — Infraestrutura Própria Supabase](#fase-2--infraestrutura-própria-supabase)
8. [FASE 3 — Persistência Real de Tarefas](#fase-3--persistência-real-de-tarefas)
9. [FASE 4 — CRUD Completo de Tarefas](#fase-4--crud-completo-de-tarefas)
10. [FASE 5 — Criação de Tarefas a Partir do SagB](#fase-5--criação-de-tarefas-a-partir-do-sagb)
11. [FASE 6 — Inbox Inteligente](#fase-6--inbox-inteligente)
12. [FASE 7 — Pautas, Reuniões e Decisões](#fase-7--pautas-reuniões-e-decisões)
13. [FASE 8 — Inteligência de Conversão Contextual](#fase-8--inteligência-de-conversão-contextual)
14. [FASE 9 — Integrações com Ecossistema SagB](#fase-9--integrações-com-ecossistema-sagb)
15. [FASE 10 — Monitoramento, Auditoria e Maturidade](#fase-10--monitoramento-auditoria-e-maturidade)
16. [Roadmap Resumido](#16-roadmap-resumido)
17. [O Que Não Fazer Agora](#17-o-que-não-fazer-agora)
18. [Riscos e Mitigações](#18-riscos-e-mitigações)
19. [Glossário](#19-glossário)

---

## 1. Identidade do Módulo

### 1.1 Nomenclatura Oficial

| Contexto | Nome | Onde aparece |
|---|---|---|
| Interface do SagB | **Agenda Inteligente** | Sidebar, cabeçalhos, app store |
| Engine/Produto | **TaskZei** | Repositório, pacote, documentação técnica |
| Pasta técnica | `src/modules/taskzei` | Sistema de arquivos |
| Rota base | `/agenda-inteligente` | URL do navegador |
| ID canônico no registry | `agenda` | `moduleRegistry.ts` |

### 1.2 Time do Módulo

| Função | Responsável | Tipo | Onde declarado |
|---|---|---|---|
| Owner de produto e marca | Dani Freitas | Humano | `manifest.ts` |
| Execução técnica | Cássio Mendes | Humano | `decisions.md` |
| Direção estratégica | Douglas Rodrigues | Humano | `decisions.md` |
| Orquestração sistêmica | Pierre Zanulli | Humano | `decisions.md` |
| Agente operacional do módulo | Dani Freitas (agente) | Agente | `agent/persona.md` |

### 1.3 Status no Catálogo de Governança

- **Status atual:** Oficial — PARCIAL (em consolidação)
- **Objetivo:** Oficial — COMPLETO
- **Referência:** [`docs/governanca_sagb/catalogo_unico_governanca.md`](docs/governanca_sagb/catalogo_unico_governanca.md)

---

## 2. Definição Técnica do Módulo

### 2.1 O Que é a Agenda Inteligente

A Agenda Inteligente é a **camada de execução viva do SagB**. Ela transforma conversas, reuniões, decisões, pautas e demandas em tarefas, projetos, processos, registros e acompanhamentos.

```
SagB pensa, conversa, decide e registra.
Agenda Inteligente transforma isso em execução.
```

### 2.2 O Que é TaskZei

TaskZei é o nome da engine/produto por trás da Agenda Inteligente. Tecnicamente é o mesmo código em `src/modules/taskzei`. A diferenciação é estratégica/comercial:

- **Agenda Inteligente** = nome de interface dentro do SagB
- **TaskZei** = nome do produto que pode ser empacotado e vendido separadamente

### 2.3 Critérios de "Módulo Destacável" (Definição Técnica)

Para que o módulo seja considerado destacável, ele precisa atender a **todos** os critérios abaixo:

| # | Critério | Status | Onde |
|---|---|---|---|
| 1 | **Banco próprio** — Supabase dedicado, não compartilhado | ❌ Pendente | Fase 2 |
| 2 | **Schema isolado** — tabelas com prefixo `taskzei_` | ✅ Pronto | Migration SQL |
| 3 | **Provider intercambiável** — mock ↔ supabase via env | ✅ Pronto | `taskzei.adapters.ts` |
| 4 | **Store própria** — estado Zustand independente | ✅ Pronto | `store/taskzei.store.ts` |
| 5 | **Types próprios** — contratos desacoplados do core | ✅ Pronto | `types/` |
| 6 | **CI/CD independente** — pipeline próprio separado do monorepo | ❌ Pendente | Fora do escopo atual |
| 7 | **Build standalone** — empacotável como app separada | ❌ Pendente | Fora do escopo atual |

> **Nota:** Critérios 6 e 7 estão fora do escopo das 10 fases atuais. Serão tratados quando houver demanda comercial concreta.

---

## 3. Estado Atual (Baseline)

Tudo abaixo já está implementado. Serve como ponto de partida.

### 3.1 Arquivos de Governança

| Arquivo | Status | Observação |
|---|---|---|
| `manifest.ts` | ✅ Existe | Requer correção: sem `owner`, `displayName` errado |
| `routes.tsx` | ✅ Existe | Rota `/agenda-inteligente` |
| `index.ts` | ✅ Existe | Exporta manifesto e rotas |
| `module-doc.ts` | ✅ Existe | Requer correção: `requiredDocs` desatualizado |
| `changelog.md` | ✅ Existe | 11 versões registradas (v1.0.0 a v1.5.0) |
| `decisions.md` | ✅ Existe | 6 decisões registradas |
| `plano_modulo.md` | ✅ Existe | Este documento |
| `agent/prompt_ativacao_cline.md` | ✅ Existe | OK |
| `agent/persona.md` | ✅ Existe | Requer atualização (genérica) |
| `agent/session_log.md` | ✅ Existe | OK |
| `agent/falas_user.md` | ✅ Existe | OK |
| `agent/owner.md` | ❌ Não existe | Correto — não deve existir (owner fica no `manifest.ts`) |

### 3.2 Layout e Navegação

- [x] Shell interno com sidebar própria ([`AgendaInteligenteLayout.tsx`](src/modules/taskzei/layout/AgendaInteligenteLayout.tsx))
- [x] Navegação interna: Visão Geral, Tarefas, Inbox, Projetos, Processos, Configurações
- [x] Visual "industrial pastel" (Inter, escala tipográfica compacta, paleta neutra + acentos pastel)

### 3.3 Páginas Implementadas

| Rota Interna | Arquivo | Status |
|---|---|---|
| `/` (Visão Geral) | [`AgendaInteligenteHomePage.tsx`](src/modules/taskzei/pages/home/AgendaInteligenteHomePage.tsx) | ✅ Dashboard com KPIs, agenda, atividade |
| `/tarefas` | [`AgendaInteligenteTasksPage.tsx`](src/modules/taskzei/pages/tasks/AgendaInteligenteTasksPage.tsx) | ✅ Lista + Kanban + Filtros |
| `/inbox` | [`AgendaInteligenteInboxPage.tsx`](src/modules/taskzei/pages/inbox/AgendaInteligenteInboxPage.tsx) | ⚠️ Placeholder (estrutura criada, sem função) |
| `/projetos` | [`AgendaInteligenteProjectsPage.tsx`](src/modules/taskzei/pages/projects/AgendaInteligenteProjectsPage.tsx) | ⚠️ Placeholder |
| `/processos` | [`AgendaInteligenteProcessesPage.tsx`](src/modules/taskzei/pages/processes/AgendaInteligenteProcessesPage.tsx) | ⚠️ Placeholder |
| `/configuracoes` | [`AgendaInteligenteSettingsPage.tsx`](src/modules/taskzei/pages/settings/AgendaInteligenteSettingsPage.tsx) | ⚠️ Placeholder |

### 3.4 Componentes de Tarefa

| Componente | Função |
|---|---|
| [`task_list.tsx`](src/modules/taskzei/components/tasks/task_list.tsx) | Tabela de tarefas com colunas |
| [`task_list_item.tsx`](src/modules/taskzei/components/tasks/task_list_item.tsx) | Linha da tabela + variante card |
| [`task_kanban_board.tsx`](src/modules/taskzei/components/tasks/task_kanban_board.tsx) | Visão kanban por status |
| [`task_drawer.tsx`](src/modules/taskzei/components/tasks/task_drawer.tsx) | Drawer lateral com detalhes da tarefa |
| [`task_filters.tsx`](src/modules/taskzei/components/tasks/task_filters.tsx) | Toolbar de filtros + busca |

### 3.5 Camada de Dados

| Camada | Arquivo | Função |
|---|---|---|
| Types | [`types/task.types.ts`](src/modules/taskzei/types/task.types.ts) | Contratos de dados |
| Types | [`types/integration.types.ts`](src/modules/taskzei/types/integration.types.ts) | Tipos de integração |
| Types | [`types/taskzei.contracts.ts`](src/modules/taskzei/types/taskzei.contracts.ts) | Interface `ITaskzeiService` |
| Store | [`store/taskzei.store.ts`](src/modules/taskzei/store/taskzei.store.ts) | Estado Zustand |
| Facade | [`services/taskzei.facade.ts`](src/modules/taskzei/services/taskzei.facade.ts) | Fachada unificada |
| Adapters | [`services/taskzei.adapters.ts`](src/modules/taskzei/services/taskzei.adapters.ts) | Seleção de provider por env |
| Providers | [`services/taskzei.providers.ts`](src/modules/taskzei/services/taskzei.providers.ts) | Interface única de providers |
| Mock Provider | [`services/taskzei_supabase_provider.ts`](src/modules/taskzei/services/taskzei_supabase_provider.ts) | Dados mockados |
| Supabase Provider | [`services/taskzei_supabase_provider.ts`](src/modules/taskzei/services/taskzei_supabase_provider.ts) | Provider real (já implementado) |

### 3.6 Migração e Persistência

| Item | Arquivo | Status |
|---|---|---|
| Migration base | `supabase/migrations/20260417000101_taskzei_persistence.sql` | ✅ Aplicada no banco compartilhado |
| Tabela `taskzei_tasks` | Migration | ✅ Criada com RLS |
| Tabela `taskzei_task_checklist_items` | Migration | ✅ Criada com RLS |
| Tabela `taskzei_task_comments` | Migration | ✅ Criada com RLS |
| Plano de migração futura | [`docs/MIGRACAO_FUTURA_SUPABASE_TASKZEI.md`](src/modules/taskzei/docs/MIGRACAO_FUTURA_SUPABASE_TASKZEI.md) | ✅ Documentado |

### 3.7 Serviços Auxiliares

| Serviço | Arquivo | Função |
|---|---|---|
| Notificação | [`taskzei_notification.service.ts`](src/modules/taskzei/services/taskzei_notification.service.ts) | Notificações de tarefa |
| Lembrete de prazo | [`taskzei_due_reminder.service.ts`](src/modules/taskzei/services/taskzei_due_reminder.service.ts) | Lembrete de vencimento |
| Netlify Function | `netlify/functions/taskzei-send-notification.mjs` | Serverless de notificação |

### 3.8 Registro no Core

```typescript
// moduleRegistry.ts — já registrado
{
  manifest: taskzeiManifest,
  routes: taskzeiRoutes
}
```

---

## 4. Pendências Estruturais Pré-Fase 1

Estes itens precisam ser resolvidos **antes** de qualquer fase de implantação. Eles são correções de conformidade com o padrão canônico vigente.

### P1 — `manifest.ts` sem owner

**Arquivo:** [`src/modules/taskzei/manifest.ts`](src/modules/taskzei/manifest.ts)
**Problema:** O type `ModuleManifest` suporta `owner?: { type, id, displayName }`, mas o manifest atual não declara owner.
**Impacto:** O runtime não sabe quem é o dono do módulo.
**Correção:** Adicionar:

```typescript
owner: {
  type: 'human',
  id: 'dani_freitas',
  displayName: 'Dani Freitas'
}
```

### P2 — `manifest.ts` com `displayName` errado

**Arquivo:** [`src/modules/taskzei/manifest.ts`](src/modules/taskzei/manifest.ts)
**Problema:** `displayName: 'taskzei'` — deveria ser `'Agenda Inteligente'` (nome exibido no SagB).
**Impacto:** Sidebar e cabeçalhos mostram "taskzei" em vez de "Agenda Inteligente".
**Correção:** Alterar `displayName` para `'Agenda Inteligente'`.

### P3 — `module-doc.ts` referencia `agent/owner.md` (proibido)

**Arquivo:** [`src/modules/taskzei/module-doc.ts`](src/modules/taskzei/module-doc.ts)
**Problema:** O `requiredDocs` lista `agent/owner.md`, mas o [`padrao_modulos_plugaveis.md`](docs/governanca_sagb/padrao_modulos_plugaveis.md) seção 1.1.1 proíbe `owner.md` — owner deve estar no `manifest.ts`.
**Impacto:** Toda validação automática vai gerar falso positivo de inconformidade.
**Correção:** Remover `agent/owner.md` de `requiredDocs` e adicionar `plano_modulo.md`.

### P4 — Persona do agente genérica

**Arquivo:** [`src/modules/taskzei/agent/persona.md`](src/modules/taskzei/agent/persona.md)
**Problema:** Persona se chama "Guardião do Módulo" — não reflete a Dani Freitas como owner de produto.
**Impacto:** O agente não tem autoridade de decisão de produto.
**Correção:** Substituir por persona que reflete Dani Freitas como responsável de produto e marca TaskZei.

### P5 — Status do provider mock indefinido

**Arquivo:** Vários
**Problema:** Não está decidido se o provider mock é temporário (removido após F3) ou fallback permanente.
**Impacto:** Se for removido, dev local quebra. Se for mantido, precisa de manutenção contínua.
**Decisão tomada neste plano:** Mock vira **fallback permanente** com as seguintes regras:
- `VITE_TASKZEI_PROVIDER=mock` é o padrão apenas em desenvolvimento
- `VITE_TASKZEI_PROVIDER=supabase` é o padrão em produção
- Mock provider deve ser mantido sincronizado com o schema real
- Em desenvolvimento, exibir `<MockModeBanner />` quando provider = mock

### P6 — Projeto Supabase dedicado sem dono financeiro

**Problema:** O plano prevê Supabase dedicado, mas não define quem paga, quem gerencia, qual o plano.
**Impacto:** Risco operacional — sem dono financeiro, o projeto pode nunca sair do ar.
**Decisão necessária:** Definir antes da Fase 2.

---

## 5. Estrutura das Fases

### 5.1 Convenção

- **F 1..10** — Fase do plano conceitual (este documento)
- **ET XX** — Epic/Tarefa executável (usado no dia a dia da execução)
- Cada fase contém múltiplas ETs
- Cada ET tem: ação, arquivos envolvidos, critério de aceitação, KPI

### 5.2 Grafo de Dependências

```text
F1 (Governança) ──→ F2 (Infra Supabase) ──→ F3 (Persistência real)
                                                      │
                                                      ▼
                                               F4 (CRUD tarefas)
                                                      │
                                              ┌───────┴────────┐
                                              ▼                ▼
                                        F5 (Origem SagB)   F6 (Inbox)
                                              │                │
                                              └───────┬────────┘
                                                      ▼
                                              F7 (Reuniões/Pautas)
                                                      │
                                                      ▼
                                          F8 (IA conversão contextual)
                                                      │
                                                      ▼
                                          F9 (Integrações Hub)
                                                      │
                                                      ▼
                                          F10 (Monitoramento)
```

### 5.3 Legenda dos Ícones

| Ícone | Significado |
|---|---|
| 🎯 | Entregável principal |
| 📁 | Arquivo(s) a criar/modificar |
| ✅ | Critério de aceitação |
| 📊 | KPI da ET |
| ⚠️ | Risco identificado |
| 🔧 | Ação técnica |

---

## FASE 1 — Governança Oficial do Módulo

> **ETs:** ET-01 a ET-04
> **Esforço estimado:** 2-3 dias
> **Depende de:** Nenhuma (pode começar imediatamente)
> **Responsável:** Dani Freitas (validação) / Cássio Mendes (execução)

### ET-01: Corrigir `manifest.ts` — owner e displayName

**🎯 Entregável:** `manifest.ts` com owner declarado e displayName correto.

**📁 Arquivo:** [`src/modules/taskzei/manifest.ts`](src/modules/taskzei/manifest.ts)

**🔧 Ações:**
1. Adicionar campo `owner` no objeto `taskzeiManifest`:
   ```typescript
   owner: {
     type: 'human',
     id: 'dani_freitas',
     displayName: 'Dani Freitas'
   }
   ```
2. Alterar `displayName` de `'taskzei'` para `'Agenda Inteligente'`
3. Validar que o type `ModuleManifest` em [`src/core/modules/module.types.ts`](src/core/modules/module.types.ts) aceita o campo (já aceita, linha 10-14)
4. Verificar se o Sidebar do SagB lê `displayName` ou `internalName` e ajustar se necessário

**✅ Critério de aceitação:**
- `manifest.ts` tem `owner.type === 'human'`, `owner.id === 'dani_freitas'`, `owner.displayName === 'Dani Freitas'`
- `manifest.ts` tem `displayName === 'Agenda Inteligente'`
- Build passa sem erro (`npm run build`)
- Sidebar do SagB exibe "Agenda Inteligente" em vez de "taskzei"

**📊 KPI:** Zero warnings de tipo no build. Sidebar exibe nome correto.

---

### ET-02: Atualizar `module-doc.ts` — requiredDocs

**🎯 Entregável:** `module-doc.ts` com `requiredDocs` alinhado ao padrão canônico.

**📁 Arquivo:** [`src/modules/taskzei/module-doc.ts`](src/modules/taskzei/module-doc.ts)

**🔧 Ações:**
1. Remover `'agent/owner.md'` da lista `requiredDocs`
2. Adicionar `'plano_modulo.md'` à lista `requiredDocs`
3. Validar que a lista completa seja:
   ```typescript
   requiredDocs: [
     'changelog.md',
     'decisions.md',
     'plano_modulo.md',
     'agent/prompt_ativacao_cline.md',
     'agent/persona.md',
     'agent/session_log.md',
     'agent/falas_user.md'
   ]
   ```

**✅ Critério de aceitação:**
- `requiredDocs` não contém `agent/owner.md`
- `requiredDocs` contém `plano_modulo.md`
- Total de 7 docs obrigatórios (contra 8 atuais)

**📊 KPI:** Zero referências a `owner.md` em qualquer arquivo de governança do módulo.

---

### ET-03: Atualizar `agent/persona.md` — Dani Freitas

**🎯 Entregável:** Persona do agente refletindo Dani Freitas como owner de produto.

**📁 Arquivo:** [`src/modules/taskzei/agent/persona.md`](src/modules/taskzei/agent/persona.md)

**🔧 Conteúdo proposto:**

```markdown
# Persona de Agente — Módulo taskzei

## Identidade

- **Nome Operacional:** Dani Freitas — Produto TaskZei
- **Tipo:** Owner de Produto e Marca
- **Domínio:** TaskZei / Agenda Inteligente

## Missão

Garantir que o TaskZei evolua como produto real, destacável e com identidade própria,
dentro e fora do ecossistema SagB.

## Autoridade

- Decisões de produto e prioridade de funcionalidades
- Validação de entregas e qualidade da experiência
- Definição de roadmap e escopo
- Representante oficial do módulo perante a orquestração do SagB

## O que deve monitorar continuamente

- Alinhamento entre o módulo e a visão de produto
- Qualidade da experiência do usuário na Agenda Inteligente
- Pendências abertas e blockers do time de execução
- Consistência da marca TaskZei (industrial pastel)

## Regras de atuação

- Decisões técnicas estruturais devem ser validadas com Cássio Mendes
- Decisões estratégicas de roadmap devem ser validadas com Douglas Rodrigues
- Toda entrega deve ser registrada em changelog.md e decisions.md
- Conflitos de prioridade entre módulos devem ser escalados para Pierre Zanulli
```

**✅ Critério de aceitação:**
- Persona reflete Dani Freitas como agente responsável
- Persona explicita autoridade de decisão de produto
- Persona explicita regras de escalonamento

**📊 KPI:** Persona lida por outro agente → entende quem decide o quê.

---

### ET-04: Validar contra checklist do padrão canônico

**🎯 Entregável:** Módulo aprovado no checklist da seção 7 do `padrao_modulos_plugaveis.md`.

**📁 Arquivo:** Este documento + validação manual

**🔧 Ações:**
1. Percorrer cada item do checklist em [`docs/governanca_sagb/padrao_modulos_plugaveis.md`](docs/governanca_sagb/padrao_modulos_plugaveis.md) seção 7 (linhas 130-160)
2. Para cada item, marcar como ✅ ou ❌
3. Corrigir itens ❌ antes de declarar F1 concluída

**✅ Critério de aceitação:** 100% dos itens do checklist da seção 7 validados como conformes.

**📊 KPI:** Checklist v1.0.0 do módulo registrado em `docs/` ou no próprio `changelog.md`.

---

## FASE 2 — Infraestrutura Própria Supabase

> **ETs:** ET-05 a ET-07
> **Esforço estimado:** 3-5 dias
> **Depende de:** F1 concluída
> **Responsável:** A DEFINIR (risco: sem dono financeiro)
> **⚠️ Bloqueante:** Sem definição de responsável financeiro, esta fase não pode começar

### ET-05: Criar projeto Supabase TaskZei

**🎯 Entregável:** Projeto Supabase no ar com URL e anon key.

**🔧 Ações:**

1. Acessar [supabase.com](https://supabase.com) e criar novo projeto
2. Nome do projeto: `taskzei` (ou `taskzei-producao`)
3. Região: mesma do projeto SagB (para minimizar latência entre serviços)
4. Plano sugerido: **Pro** (US$25/mês) — plano Free tem limites restritivos para uso contínuo
   - Alternativa: começar com Free e migrar para Pro quando atingir limites
5. Anotar:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_ANON_KEY` (anon public key)
   - `SUPABASE_SERVICE_ROLE_KEY` (service role — apenas para migrations e admin)

**📁 Artefatos a criar:**
- Bloco de notas seguro (vault/gestor de senhas) com as chaves
- Entrada no `docs/governanca_sagb/` sobre o projeto

**✅ Critério de aceitação:**
- Projeto criado e acessível via dashboard
- URL e anon key válidas (testar com curl/insomnia)
- Service role key guardada em local seguro

**📊 KPI:** Ping ao projeto retorna status 200 em < 500ms.

---

### ET-06: Executar migration base no novo projeto

**🎯 Entregável:** Schema `taskzei_*` presente no banco dedicado.

**📁 Arquivo:** `supabase/migrations/20260417000101_taskzei_persistence.sql`

**🔧 Ações:**

1. Conectar ao novo projeto via Supabase CLI ou SQL Editor
2. Executar a migration `20260417000101_taskzei_persistence.sql` completa
3. Verificar tabelas criadas:
   - `taskzei_tasks`
   - `taskzei_task_checklist_items`
   - `taskzei_task_comments`
4. Verificar índices, triggers e RLS policies aplicados
5. Se houver dados no banco compartilhado, exportar via CSV/SQL e importar:
   - Exportar: `taskzei_tasks`, `taskzei_task_checklist_items`, `taskzei_task_comments`
   - Importar mantendo os mesmos UUIDs (integridade referencial)
   - Validar: checklist/task_id → tasks/id, comments/task_id → tasks/id

**✅ Critério de aceitação:**
- 3 tabelas criadas com mesmas colunas, índices e RLS
- Dados migrados (se houver) com integridade referencial 100%
- `SELECT count(*)` retorna mesmo número antes e depois

**📊 KPI:** Zero erros de migration. Zero registros órfãos (checklist/comentários sem task pai).

---

### ET-07: Configurar env vars e CI/CD

**🎯 Entregável:** TaskZei apontando para Supabase dedicado.

**📁 Arquivos:**
- `.env.example` (taskzei)
- Configuração do Netlify (se aplicável)
- Pipeline de CI/CD (se existir)

**🔧 Ações:**

1. Adicionar ao `.env.example` (ou equivalente):
   ```env
   VITE_TASKZEI_PROVIDER=supabase
   VITE_TASKZEI_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_TASKZEI_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```
2. Configurar as mesmas env vars no ambiente de produção (Netlify, Vercel, etc.)
3. Remover (ou comentar) a referência ao Supabase compartilhado do SagB para as tabelas `taskzei_*`
4. Testar: criar tarefa via UI → verificar se aparece no SQL Editor do novo projeto

**✅ Critério de aceitação:**
- Task criada na UI aparece no banco dedicado
- Task não aparece mais no banco compartilhado (a menos que tenha sido migrada)
- Refresh da página mantém a task

**📊 KPI:** CRUD operacional contra o novo projeto em < 1s por operação.

---

## FASE 3 — Persistência Real de Tarefas

> **ETs:** ET-08
> **Esforço estimado:** 2-3 dias
> **Depende de:** F2 concluída
> **Responsável:** Cássio Mendes

### ET-08: Trocar provider para Supabase como default

**🎯 Entregável:** Provider Supabase ativo como padrão, mock como fallback.

**📁 Arquivos:**
- [`src/modules/taskzei/services/taskzei.adapters.ts`](src/modules/taskzei/services/taskzei.adapters.ts)
- [`src/modules/taskzei/services/taskzei.providers.ts`](src/modules/taskzei/services/taskzei.providers.ts)
- [`src/modules/taskzei/services/taskzei_supabase_provider.ts`](src/modules/taskzei/services/taskzei_supabase_provider.ts)

**🔧 Ações Detalhadas:**

1. **Alterar default do adapter:**
   ```typescript
   // Antes
   const providerType = (import.meta.env.VITE_TASKZEI_PROVIDER as ProviderType) || 'mock';
   // Depois
   const providerType = (import.meta.env.VITE_TASKZEI_PROVIDER as ProviderType) || 'supabase';
   ```

2. **Validar todas as operações do provider Supabase:**
   - `getTasks()` — listar tarefas com filtros
   - `createTask(data)` — criar com todos os campos
   - `updateTask(id, data)` — atualizar parcial
   - `deleteTask(id)` — deletar (ou arquivar)
   - `getTaskChecklist(taskId)` — carregar checklist
   - `addChecklistItem(taskId, text)` — adicionar item
   - `toggleChecklistItem(itemId, completed)` — alternar
   - `removeChecklistItem(itemId)` — remover item
   - `getTaskComments(taskId)` — carregar comentários
   - `addComment(taskId, text, author)` — adicionar comentário

3. **Implementar MockModeBanner:**
   ```tsx
   // Componente que avisa quando está em modo mock
   const MockModeBanner = () => {
     if (provider !== 'mock') return null;
     return (
       <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] px-3 py-1 rounded-md">
         🟡 Modo mock — dados não persistem
       </div>
     );
   };
   ```

4. **Testar cenários de erro do Supabase:**
   - Rede off-line → mensagem amigável
   - RLS negando acesso → mensagem clara
   - Timeout → retry 1x antes de mostrar erro

**✅ Critério de aceitação:**
- Provider Supabase é o padrão em produção
- Provider mock funciona em dev com aviso visual
- Todas as 11 operações CRUD passam sem erro
- Tratamento de erro cobre: rede off, RLS, timeout

**📊 KPI:**
- 100% das operações CRUD funcionando no provider supabase
- Latência p95 < 500ms para `getTasks()`
- Zero perda de dados em teste de 50 criações consecutivas

---

## FASE 4 — CRUD Completo de Tarefas

> **ETs:** ET-09 a ET-12
> **Esforço estimado:** 4-7 dias
> **Depende de:** F3 concluída
> **Responsável:** Cássio Mendes

### ET-09: Drawer com edição real de tarefa

**🎯 Entregável:** Drawer lateral com todos os campos editáveis e persistindo no backend.

**📁 Arquivo:** [`src/modules/taskzei/components/tasks/task_drawer.tsx`](src/modules/taskzei/components/tasks/task_drawer.tsx)

**🔧 Ações Detalhadas:**

1. **Campo: Título**
   - Input editável inline
   - Ao perder foco (onBlur), salvar automaticamente
   - Indicador de "salvando..." durante a persistência

2. **Campo: Descrição**
   - Textarea expansível (min-height: 80px, max-height: 300px)
   - Suporte a Markdown básico (negrito, itálico, lista)
   - Auto-save on blur

3. **Campo: Status**
   - Select estilizado: `aberta`, `em_andamento`, `concluida`
   - Ao mudar, perguntar se deseja adicionar comentário explicando a mudança

4. **Campo: Prioridade**
   - Select estilizado: `baixa`, `media`, `alta`, `urgente`
   - Cor do indicador muda conforme prioridade

5. **Campo: Responsável**
   - Input com autocomplete (buscar usuários do workspace)
   - Se não houver integração com user service, manter input livre (texto)

6. **Campo: Prazo**
   - Date picker nativo (`<input type="date">`)
   - Exibir dias restantes ou "atrasado" em vermelho

7. **Indicadores de salvamento:**
   - Ícone de check verde quando salvo
   - Ícone de relógio amarelo enquanto salva
   - Ícone de erro vermelho se falhar

**✅ Critério de aceitação:**
- Todos os 6 campos editáveis no drawer
- Alterações persistem após refresh
- Indicadores de salvamento visíveis

**📊 KPI:** Edição de qualquer campo salva em < 1s. Indicador de erro aparece em < 3s se falhar.

---

### ET-10: Checklist funcional

**🎯 Entregável:** Checklist com criação, conclusão e remoção de itens, persistindo no backend.

**📁 Arquivos:**
- [`src/modules/taskzei/components/tasks/task_drawer.tsx`](src/modules/taskzei/components/tasks/task_drawer.tsx)
- [`src/modules/taskzei/services/taskzei_supabase_provider.ts`](src/modules/taskzei/services/taskzei_supabase_provider.ts)

**🔧 Ações Detalhadas:**

1. **Adicionar item:**
   - Input compacto no final da lista
   - Ao pressionar Enter, criar item e limpar input
   - Scroll automático para o novo item

2. **Concluir/desconcluir item:**
   - Checkbox clicável
   - Ao marcar, aplicar strike-through no texto com atraso de 300ms (feedback visual)
   - Atualizar contador: "3/5 concluídos"

3. **Remover item:**
   - Ícone "×" à direita ao hover
   - Confirmar antes de remover (toast "desfazer?")

4. **Reordenar (nice to have):**
   - Drag-and-drop simples entre itens
   - Persistir ordem via campo `sort_order`

**✅ Critério de aceitação:**
- Criar item aparece imediatamente na UI
- Concluir/desconcluir persiste após refresh
- Remover item some da UI e do banco
- Contador atualiza em tempo real

**📊 KPI:** Operações de checklist em < 500ms. Zero perda de itens.

---

### ET-11: Comentários funcionais

**🎯 Entregável:** Seção de comentários com criação e listagem, persistindo no backend.

**📁 Arquivos:**
- [`src/modules/taskzei/components/tasks/task_drawer.tsx`](src/modules/taskzei/components/tasks/task_drawer.tsx)
- [`src/modules/taskzei/services/taskzei_supabase_provider.ts`](src/modules/taskzei/services/taskzei_supabase_provider.ts)

**🔧 Ações Detalhadas:**

1. **Listagem de comentários:**
   - Ordenado do mais recente para o mais antigo
   - Exibir: avatar (iniciais), nome do autor, data relativa ("há 2h"), texto
   - Scroll infinito (carregar mais 10 quando chegar ao fim)

2. **Criação de comentário:**
   - Textarea com auto-resize
   - Botão "Comentar" desabilitado se texto vazio
   - Ao enviar, comentário aparece no topo da lista sem refresh

3. **Indicador de atividade:**
   - Badge "2 novos" no header da seção
   - Destaque suave em comentários recém-criados (fade out em 3s)

**✅ Critério de aceitação:**
- Comentário criado aparece imediatamente
- Comentário persiste após refresh
- Scroll mantém posição após carregar mais

**📊 KPI:** Comentário criado e visível em < 1s. Scroll infinito carrega lote em < 500ms.

---

### ET-12: Ações rápidas de tarefa

**🎯 Entregável:** Ações de concluir, duplicar e arquivar tarefa funcionando.

**📁 Arquivos:**
- [`src/modules/taskzei/components/tasks/task_list_item.tsx`](src/modules/taskzei/components/tasks/task_list_item.tsx)
- [`src/modules/taskzei/components/tasks/task_list.tsx`](src/modules/taskzei/components/tasks/task_list.tsx)

**🔧 Ações Detalhadas:**

1. **Concluir tarefa:**
   - Checkbox na linha da tabela
   - Ao marcar:
     - Título fica riscado (line-through)
     - Opacidade reduz (opacity-50)
     - Badge "Concluída" aparece
     - Tarefa move para coluna "Concluídas" no Kanban

2. **Duplicar tarefa:**
   - Botão "Duplicar" no menu de contexto (⋯)
   - Criar cópia exata com sufixo "(cópia)" no título
   - Status da cópia: `aberta` (independente do original)
   - Manter: prioridade, responsável, checklist (itens abertos), descrição

3. **Arquivar tarefa:**
   - Botão "Arquivar" no menu de contexto
   - Tarefa archive não aparece na lista padrão
   - Criar filtro "Arquivadas" para visualizar
   - Botão "Restaurar" no drawer da tarefa arquivada

**✅ Critério de aceitação:**
- Concluir: checkbox funcional, UI reflete estado
- Duplicar: cópia criada com dados corretos, checklist copiado
- Arquivar: tarefa some da lista, aparece no filtro "Arquivadas"
- Restaurar: tarefa volta à lista original

**📊 KPI:** Ações executam em < 500ms. Nenhuma ação remove dados permanentemente (só archiving).

---

## FASE 5 — Criação de Tarefas a Partir do SagB

> **ETs:** ET-13, ET-14
> **Esforço estimado:** 5-8 dias
> **Depende de:** F3 (independe de F4)
> **Responsável:** Cássio Mendes + time do módulo de origem

### ET-13: Definir contrato de origem

**🎯 Entregável:** Contrato de origem documentado e tipos criados.

**📁 Arquivo:** [`src/modules/taskzei/types/integration.types.ts`](src/modules/taskzei/types/integration.types.ts)

**🔧 Ações Detalhadas:**

1. **Definir interface de origem:**
   ```typescript
   export interface TaskOrigin {
     originType: 'agent_chat' | 'meeting' | 'document' | 'monitoring' | 'decision' | 'manual' | 'integration';
     originId: string;        // ID único no sistema de origem
     originTitle: string;     // Título legível para referência
     originModule: string;    // Módulo SagB de origem (ex: 'nucleo-conversacional')
     createdByAgent?: string; // ID do agente que criou (se aplicável)
     createdByUser?: string;  // ID do usuário que criou (se aplicável)
     originContext: string;   // Contexto/trecho da origem (opcional)
     originUrl?: string;      // Link para o registro original
   }
   ```

2. **Estender `CreateTaskInput` para incluir origem:**
   ```typescript
   export interface CreateTaskInput {
     title: string;
     description?: string;
     priority?: TaskPriority;
     assigneeName?: string;
     dueDate?: string;
     origin?: TaskOrigin;  // Novo campo
   }
   ```

3. **Atualizar schema do banco:**
   ```sql
   -- Migration: adicionar campos de origem à taskzei_tasks
   ALTER TABLE taskzei_tasks
     ADD COLUMN origin_type text,
     ADD COLUMN origin_id text,
     ADD COLUMN origin_title text,
     ADD COLUMN origin_module text,
     ADD COLUMN origin_context text,
     ADD COLUMN origin_url text,
     ADD COLUMN created_by_agent text,
     ADD COLUMN created_by_user text;
   ```

4. **Exibir origem na UI:**
   - Badge no drawer: "Originada de: [nome do módulo]"
   - Link clicável para o registro original (se `originUrl` presente)

**✅ Critério de aceitação:**
- Interface `TaskOrigin` definida e exportada
- Migration com campos de origem criada e testada
- Drawer exibe badge de origem quando presente

**📊 KPI:** Contrato aprovado pela orquestração do SagB antes de implementar.

---

### ET-14: Implementar endpoint/interface de recepção

**🎯 Entregável:** Mecanismo para outros módulos criarem tarefas programaticamente.

**🔧 Ações Detalhadas:**

1. **Criar função de recepção no facade:**
   ```typescript
   // taskzei.facade.ts
   async createTaskFromExternal(input: CreateTaskInput): Promise<TaskzeiTask> {
     // Validar origem
     if (!input.origin) {
       throw new Error('createTaskFromExternal requires origin');
     }
     // Registrar no log de atividade
     await this.logActivity({
       action: 'task_created_from_external',
       originModule: input.origin.originModule,
       taskTitle: input.title
     });
     // Delegar para o provider ativo
     return this.provider.createTask(input);
   }
   ```

2. **Criar hook  ou função utilitária para módulos consumidores:**
   ```typescript
   // taskzei.client.ts (ou similar, exportado pelo módulo)
   import { taskzeiFacade } from '../services/taskzei.facade';
   
   export async function createTaskForAgendaInteligente(input: CreateTaskInput) {
     return taskzeiFacade.createTaskFromExternal(input);
   }
   ```

3. **Criar exemplo de integração com Monitoramento:**
   - Usar a "Ação Inteligente" que já existe no módulo de Monitoramento
   - Ação "Criar task no TaskZei" → chama `createTaskFromExternal`
   - Contexto do alerta vira `originContext` da task

4. **Criar documentação de integração:**
   ```markdown
   # Como criar tarefas na Agenda Inteligente a partir de outro módulo
   
   1. Importe `createTaskForAgendaInteligente` de `src/modules/taskzei/services/taskzei.client.ts`
   2. Monte o `CreateTaskInput` com os dados da origem
   3. Chame a função
   4. Trate possíveis erros (timeout, validação)
   
   Exemplo:
   ```typescript
   const task = await createTaskForAgendaInteligente({
     title: 'Revisar alerta de monitoramento',
     description: 'Alerta gerado em...',
     priority: 'alta',
     origin: {
       originType: 'monitoring',
       originId: alerta.id,
       originTitle: alerta.title,
       originModule: 'monitoramento',
       originContext: alerta.description
     }
   });
   ```
   ```

**✅ Critério de aceitação:**
- Monitoramento consegue criar tarefa na Agenda Inteligente
- Tarefa criada mostra badge de origem "Monitoramento"
- Link na badge leva ao registro original no Monitoramento

**📊 KPI:** Tarefa criada de outro módulo aparece na lista em < 5s.

---

## FASE 6 — Inbox Inteligente

> **ETs:** ET-15, ET-16
> **Esforço estimado:** 5-8 dias
> **Depende de:** F5 (Inbox precisa de fontes de entrada para existir)
> **Responsável:** Dani Freitas (validação) / Cássio Mendes (execução)
> **⚠️ Nota:** Esta fase só começa depois que pelo menos uma fonte de entrada (F5) estiver operacional.

### ET-15: Estrutura de inbox_items

**🎯 Entregável:** Entidade `inbox_items` com CRUD básico.

**📁 Novos arquivos:**
- Migration SQL para `taskzei_inbox_items`
- `src/modules/taskzei/types/inbox.types.ts`
- Atualização no provider

**🔧 Ações Detalhadas:**

1. **Migration SQL:**
   ```sql
   CREATE TABLE taskzei_inbox_items (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     title text NOT NULL,
     description text,
     source_type text NOT NULL,      -- 'manual', 'chat', 'meeting', 'document', 'agent', 'monitoring', 'upload'
     source_id text,                 -- ID no sistema de origem
     source_module text,             -- módulo SagB de origem
     status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'converted', 'archived')),
     converted_to text,              -- 'task', 'meeting', 'decision', 'project'
     converted_entity_id uuid,       -- ID da entidade convertida
     context text,                   -- contexto original (trecho de conversa, etc.)
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now(),
     created_by text,               -- usuário ou agente que criou
     workspace_id uuid REFERENCES taskzei_workspaces(id)
   );
   
   CREATE INDEX idx_inbox_status ON taskzei_inbox_items(status);
   CREATE INDEX idx_inbox_source ON taskzei_inbox_items(source_module);
   ```

2. **Types:**
   ```typescript
   // inbox.types.ts
   export type InboxSourceType = 'manual' | 'chat' | 'meeting' | 'document' | 'agent' | 'monitoring' | 'upload';
   export type InboxStatus = 'new' | 'reviewed' | 'converted' | 'archived';
   export type InboxConversionType = 'task' | 'meeting' | 'decision' | 'project';
   
   export interface InboxItem {
     id: string;
     title: string;
     description?: string;
     sourceType: InboxSourceType;
     sourceId?: string;
     sourceModule?: string;
     status: InboxStatus;
     convertedTo?: InboxConversionType;
     convertedEntityId?: string;
     context?: string;
     createdAt: string;
     updatedAt: string;
     createdBy?: string;
   }
   ```

3. **UI:**
   - Substituir placeholder da página de Inbox por lista real
   - Colunas: título, origem, status, data
   - Badge de status com cor: `new` (azul), `reviewed` (amarelo), `converted` (verde), `archived` (cinza)
   - Ordenação: itens mais recentes primeiro
   - Filtros: por status, por origem

**✅ Critério de aceitação:**
- Inbox lista itens reais (não placeholder)
- Itens podem ser criados manualmente via UI
- Status tracking funcional (new → reviewed → converted/archived)

**📊 KPI:** Inbox carrega 50 itens em < 1s. Criar item manual em < 500ms.

---

### ET-16: Conversão de inbox em entidades

**🎯 Entregável:** Ações de conversão: inbox → tarefa, reunião, decisão, pauta.

**🔧 Ações Detalhadas:**

1. **Menu de conversão no item da inbox:**
   - Botão "Converter em..."
   - Opções:
     - 📋 Tarefa → abre drawer de criação de tarefa com dados pré-preenchidos
     - 📅 Reunião → abre formulário de criação de reunião
     - 📝 Decisão → abre formulário de registro de decisão
     - 📌 Pauta → cria pauta associada

2. **Fluxo de conversão para tarefa:**
   - Título do inbox vira título da tarefa
   - Descrição do inbox vira descrição da tarefa
   - `sourceModule` vira `origin.originModule`
   - `sourceId` vira `origin.originId`
   - Após criar tarefa, inbox item muda status para `converted`
   - Badge "Convertido em tarefa #ID" aparece no inbox

3. **Bulk actions:**
   - Selecionar múltiplos itens
   - "Converter todos em tarefas"
   - "Arquivar selecionados"
   - "Marcar como revisados"

**✅ Critério de aceitação:**
- Item da inbox pode ser convertido em tarefa
- Tarefa criada mantém referência ao item original
- Item convertido não aparece mais na fila "novos"

**📊 KPI:** Conversão concluída em < 2s. Taxa de conversão > 60% (itens que viram ação).

---

## FASE 7 — Pautas, Reuniões e Decisões

> **ETs:** ET-17 a ET-19
> **Esforço estimado:** 7-10 dias
> **Depende de:** F4
> **Responsável:** Dani Freitas + Cássio Mendes

### ET-17: Entidade de Pautas

**🎯 Entregável:** CRUD de pautas com associação a reuniões e tarefas.

**📁 Novos arquivos:**
- Migration SQL para `taskzei_agendas`
- `src/modules/taskzei/types/meeting.types.ts`

**🔧 Ações Detalhadas:**

1. **Migration SQL:**
   ```sql
   CREATE TABLE taskzei_agendas (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     title text NOT NULL,
     description text,
     meeting_id uuid REFERENCES taskzei_meetings(id),
     status text DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'cancelled')),
     resolved_at timestamptz,
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now(),
     created_by text
   );
   
   -- Tabela de ligação pauta → tarefa
   CREATE TABLE taskzei_agenda_tasks (
     agenda_id uuid REFERENCES taskzei_agendas(id) ON DELETE CASCADE,
     task_id uuid REFERENCES taskzei_tasks(id) ON DELETE CASCADE,
     PRIMARY KEY (agenda_id, task_id)
   );
   ```

2. **UI de pautas:**
   - Lista de pautas na área "Pautas" (nova aba na navegação)
   - Criar pauta: título + descrição + (opcional) reunião vinculada
   - Marcar como resolvida: data e observação
   - Associar tarefas existentes à pauta

**✅ Critério de aceitação:**
- Pauta criada persiste
- Pauta pode ser vinculada a reunião
- Pauta pode ser vinculada a tarefas
- Status tracking (open → resolved/cancelled)

**📊 KPI:** Pauta criada em < 1s. Associação pauta-tarefa em < 500ms.

---

### ET-18: Entidade de Reuniões

**🎯 Entregável:** CRUD de reuniões com participantes, pauta e geração de tarefas.

**📁 Novos arquivos:**
- Migration SQL para `taskzei_meetings` e `taskzei_meeting_participants`

**🔧 Ações Detalhadas:**

1. **Migration SQL:**
   ```sql
   CREATE TABLE taskzei_meetings (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     title text NOT NULL,
     description text,
     meeting_date timestamptz NOT NULL,
     status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'occurred', 'cancelled')),
     summary text,                  -- ata/resumo pós-reunião
     next_meeting_id uuid,          -- referência à próxima reunião
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now(),
     created_by text
   );
   
   CREATE TABLE taskzei_meeting_participants (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     meeting_id uuid REFERENCES taskzei_meetings(id) ON DELETE CASCADE,
     participant_name text NOT NULL,
     participant_role text,         -- 'organizer', 'participant', 'guest'
     confirmed boolean DEFAULT false
   );
   ```

2. **Fluxo de reunião:**
   - Criar reunião: título, data, participantes, pautas vinculadas
   - Durante a reunião (ou após):
     - Gerar tarefas a partir de pautas
     - Registrar decisões
     - Escrever sumário/ata
     - Vincular próxima reunião
   - Template de ATA: gerar markdown compatível com o padrão do GrupoB:
     ```
     _qgs/[qg]/_reunioes/[AAAA-MM-DD]-[agente]-[assunto].md
     ```

**✅ Critério de aceitação:**
- Reunião criada com participantes e data
- Pautas associadas à reunião
- Tarefas geradas a partir da reunião
- ATA exportável em markdown

**📊 KPI:** Reunião com 5 pautas gera ATA em < 3 minutos de interação.

---

### ET-19: Entidade de Decisões

**🎯 Entregável:** Registro de decisões com contexto, responsável e ações geradas.

**📁 Novos arquivos:**
- Migration SQL para `taskzei_decisions`

**🔧 Ações Detalhadas:**

1. **Migration SQL:**
   ```sql
   CREATE TABLE taskzei_decisions (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     title text NOT NULL,
     description text,
     decided_by text NOT NULL,           -- quem decidiu
     decided_at timestamptz DEFAULT now(),
     context_type text,                  -- 'meeting', 'conversation', 'document', 'manual'
     context_id text,                    -- ID no sistema de contexto
     impact text,                        -- impacto da decisão
     status text DEFAULT 'active' CHECK (status IN ('active', 'implemented', 'superseded')),
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now()
   );
   
   -- Ligação decisão → tarefas geradas
   CREATE TABLE taskzei_decision_tasks (
     decision_id uuid REFERENCES taskzei_decisions(id) ON DELETE CASCADE,
     task_id uuid REFERENCES taskzei_tasks(id) ON DELETE CASCADE,
     PRIMARY KEY (decision_id, task_id)
   );
   ```

2. **UI de decisões:**
   - Aba "Decisões" na navegação (ou dentro de Reuniões)
   - Registrar: título, descrição, decidido por, contexto, impacto
   - Vincular tarefas geradas a partir da decisão
   - Status tracking: active → implemented → superseded

3. **Conexão com governança do SagB:**
   - Decisão relevante → atualizar [`docs/governanca_sagb/decisoes_e_pendencias.md`](docs/governanca_sagb/decisoes_e_pendencias.md)
   - Exportar decisão como item de governança

**✅ Critério de aceitação:**
- Decisão registrada com contexto e responsável
- Tarefas podem ser vinculadas à decisão
- Decisão pode ser exportada como item de governança

**📊 KPI:** Decisão registrada em < 1 minuto. Zero perda de contexto (toda decisão tem "por que" e "quem").

---

## FASE 8 — Inteligência de Conversão Contextual

> **ETs:** ET-20, ET-21
> **Esforço estimado:** 8-12 dias
> **Depende de:** F6 + F7
> **Responsável:** Cássio Mendes + suporte de IA (definir qual modelo/provider)

### ET-20: Parser de linguagem natural para ações

**🎯 Entregável:** Sistema que recebe texto livre e sugere tarefas, responsáveis, prazos e reuniões.

**📁 Novos arquivos:**
- `src/modules/taskzei/services/taskzei_nlp_parser.ts`
- `src/modules/taskzei/types/parser.types.ts`

**🔧 Ações Detalhadas:**

1. **Tipos do parser:**
   ```typescript
   export interface ParsedAction {
     type: 'task' | 'meeting' | 'decision';
     confidence: number;  // 0.0 a 1.0
     title: string;
     description?: string;
     suggestedAssignee?: string;
     suggestedDueDate?: string;
     suggestedPriority?: 'baixa' | 'media' | 'alta';
     suggestedParticipants?: string[];
     extractedFrom: string; // trecho original
   }
   
   export interface ParserResult {
     actions: ParsedAction[];
     rawText: string;
     processingTime: number;
   }
   ```

2. **Implementação do parser (duas abordagens):**
   - **Abordagem A (regras):** Regex + heurísticas para padrões comuns:
     - "criar tarefa para [alguém]" → tarefa
     - "marcar reunião com [alguém]" → reunião
     - "decidir [assunto]" → decisão
     - "até [data]" → prazo
   - **Abordagem B (IA):** Usar LLM disponível no SagB (Gemini/DeepSeek) para extrair ações
   - **Recomendação:** Começar com abordagem A (regras) para ter algo funcional rápido, depois evoluir para IA

3. **Integração com Inbox (F6):**
   - Item da inbox → botão "Interpretar" → parser sugere conversão
   - Usuário confirma ou ajusta antes de criar

**✅ Critério de aceitação:**
- "Criar tarefa para Cássio revisar amanhã" → sugere tarefa com responsável e prazo
- "Marcar reunião com Dani e Douglas semana que vem" → sugere reunião com participantes
- Sugestões têm botão "Confirmar" e "Ajustar"

**📊 KPI:** Precisão > 70% na abordagem A (regras). Tempo de processamento < 3s.

---

### ET-21: Fluxo de confirmação humana

**🎯 Entregável:** Toda sugestão do parser passa por aprovação humana antes de persistir.

**🔧 Ações Detalhadas:**

1. **Componente de confirmação:**
   ```tsx
   // SugestãoParserModal.tsx
   // Exibe:
   // - Ação detectada (tarefa/reunião/decisão)
   // - Campos pré-preenchidos (editáveis)
   // - Confidence score
   // - Botões: "Confirmar", "Ajustar", "Ignorar"
   ```

2. **Fluxo:**
   - Usuário cola/digita texto no campo "Interpretar texto"
   - Parser processa e exibe sugestões no modal
   - Usuário confirma (cria imediatamente) ou ajusta (edita campos antes de criar)
   - Após confirmação, registro é criado e item da inbox atualizado

3. **Feedback loop:**
   - Registrar acertos/erros do parser (campo `parser_feedback` nas ações)
   - Usar feedback para melhorar regras ou fine-tuning do modelo

**✅ Critério de aceitação:**
- Sugestão do parser sempre requer confirmação
- Usuário pode ajustar qualquer campo antes de confirmar
- Feedback de acerto/erro é registrado

**📊 KPI:** Taxa de confirmação sem ajustes > 50% (usuário não precisa editar). Feedback registrado para 100% das sugestões.

---

## FASE 9 — Integrações com Ecossistema SagB

> **ETs:** ET-22 a ET-25
> **Esforço estimado:** 6-10 dias
> **Depende de:** F5
> **Responsável:** Cássio Mendes + owners dos módulos integrados
> **⚠️ Regra:** Toda integração externa DEVE passar pelo [`hub-integracao`](src/modules/hub-integracao), não por conexão direta.

### ET-22: Integração com Núcleo Conversacional

**🎯 Entregável:** Chat com agente pode criar tarefa na Agenda Inteligente.

**🔧 Ações Detalhadas:**

1. **No Núcleo Conversacional:**
   - Detectar intenção "criar tarefa" na fala do usuário
   - Extrair: título, responsável, prazo, prioridade
   - Chamar `createTaskFromExternal` do TaskZei
   - Retornar confirmação no chat: "✅ Tarefa criada na Agenda Inteligente"

2. **No TaskZei:**
   - Tarefa criada via chat aparece com badge "Conversa com agente"
   - Link para o trecho da conversa (se disponível)

**✅ Critério de aceitação:**
- "Cria uma tarefa para revisar o documento amanhã" no chat → tarefa criada
- Tarefa aparece na Agenda Inteligente com origem identificada

**📊 KPI:** Task criada do chat em < 5s. Badge de origem visível.

---

### ET-23: Integração com Monitoramento

**🎯 Entregável:** Alerta de monitoramento pode gerar tarefa automaticamente.

**🔧 Ações Detalhadas:**

1. **No Monitoramento:**
   - Ação inteligente "Criar task no TaskZei" (já prevista no módulo)
   - Ao disparar, chamar `createTaskFromExternal` com dados do alerta
   - Prioridade do alerta mapeia para prioridade da tarefa

2. **No TaskZei:**
   - Tarefa criada via monitoramento aparece com badge "Monitoramento"
   - Link para o alerta original

**✅ Critério de aceitação:**
- Alerta de monitoramento → tarefa criada automaticamente
- Tarefa tem prioridade compatível com gravidade do alerta

**📊 KPI:** Alerta → task em < 3s.

---

### ET-24: Integração com Documentos

**🎯 Entregável:** Documentos podem ser vinculados a tarefas, reuniões e decisões.

**🔧 Ações Detalhadas:**

1. **Campo `document_id` nas entidades:**
   ```sql
   -- Adicionar campo de documento vinculado onde aplicável
   ALTER TABLE taskzei_tasks ADD COLUMN document_id text;
   ALTER TABLE taskzei_meetings ADD COLUMN document_id text;
   ALTER TABLE taskzei_decisions ADD COLUMN document_id text;
   ```

2. **UI:**
   - No drawer da tarefa: botão "Vincular documento"
   - Modal de busca/seleção de documentos do CID
   - Badge com nome do documento vinculado
   - Clique abre o documento

**✅ Critério de aceitação:**
- Documento pode ser vinculado a tarefa
- Documento vinculado aparece no drawer
- (Opcional) Ao criar tarefa a partir de documento, vínculo automático

**📊 KPI:** Vincular documento em < 2s.

---

### ET-25: Integração com Hub de Integrações

**🎯 Entregável:** Conexões externas (ClickUp, WhatsApp, e-mail) passam pelo Hub.

**🔧 Ações Detalhadas:**

1. **Mapear integrações previstas:**
   - ClickUp: importar/exportar tarefas
   - WhatsApp: receber tarefas por mensagem
   - E-mail: criar tarefa a partir de e-mail
   - Calendário: sincronizar prazos

2. **No Hub de Integrações:**
   - Verificar se o Hub já tem conectores para estas plataformas
   - Se sim: configurar e usar
   - Se não: criar conector no Hub (não no TaskZei)

3. **Contrato TaskZei ↔ Hub:**
   ```typescript
   // Interface que o Hub deve implementar para se comunicar com o TaskZei
   export interface ITaskzeiHubIntegration {
     onCreateTask(data: CreateTaskInput): Promise<TaskzeiTask>;
     onUpdateTask(taskId: string, data: Partial<TaskzeiTask>): Promise<TaskzeiTask>;
     onSyncTasks(): Promise<TaskzeiTask[]>;
   }
   ```

**✅ Critério de aceitação:**
- ClickUp conectado via Hub consegue criar tarefa no TaskZei
- Nenhuma chave de API externa armazenada no TaskZei (só no Hub)

**📊 KPI:** Integração via Hub em < 5s. Zero tokens externos no TaskZei.

---

## FASE 10 — Monitoramento, Auditoria e Maturidade

> **ETs:** ET-26 a ET-28
> **Esforço estimado:** 4-6 dias
> **Depende de:** F4
> **Responsável:** Cássio Mendes

### ET-26: Logs de auditoria

**🎯 Entregável:** Toda ação relevante tem registro de auditoria rastreável.

**📁 Novos arquivos:**
- Migration SQL para `taskzei_activity_log`
- `src/modules/taskzei/services/taskzei_audit.service.ts`

**🔧 Ações Detalhadas:**

1. **Migration SQL:**
   ```sql
   CREATE TABLE taskzei_activity_log (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     entity_type text NOT NULL,       -- 'task', 'checklist_item', 'comment', 'inbox_item', 'meeting', 'decision'
     entity_id uuid NOT NULL,
     action text NOT NULL,            -- 'created', 'updated', 'deleted', 'completed', 'converted'
     previous_state jsonb,            -- estado anterior (para updates)
     new_state jsonb,                 -- novo estado
     performed_by text NOT NULL,      -- usuário ou agente
     performed_at timestamptz DEFAULT now(),
     metadata jsonb                   -- dados extras (origem, motivo, etc.)
   );
   
   CREATE INDEX idx_audit_entity ON taskzei_activity_log(entity_type, entity_id);
   CREATE INDEX idx_audit_time ON taskzei_activity_log(performed_at DESC);
   ```

2. **Serviço de auditoria:**
   ```typescript
   // taskzei_audit.service.ts
   export class TaskzeiAuditService {
     async log(params: {
       entityType: string;
       entityId: string;
       action: string;
       previousState?: any;
       newState?: any;
       performedBy: string;
       metadata?: any;
     }): Promise<void> {
       // Inserir no banco
       // Se falhar, logar no console (não bloquear a operação principal)
     }
     
     async getHistory(entityType: string, entityId: string): Promise<AuditEntry[]> {
       // Retornar histórico ordenado por data
     }
   }
   ```

3. **Integrar auditoria nas operações:**
   - Toda criação de tarefa → log
   - Toda atualização de campo → log com previous_state e new_state
   - Toda conclusão → log
   - Toda conversão de inbox → log

**✅ Critério de aceitação:**
- 100% das ações de escrita têm registro no `taskzei_activity_log`
- Histórico de uma tarefa pode ser visualizado no drawer (aba "Histórico")
- Falha no log não bloqueia a operação principal

**📊 KPI:** Zero operações de escrita sem auditoria. Log em < 200ms (assíncrono, não bloqueante).

---

### ET-27: Métricas de uso

**🎯 Entregável:** Dashboard interno com KPIs de uso do módulo.

**🔧 Ações Detalhadas:**

1. **Métricas a coletar:**
   - Tarefas criadas/dia
   - Tarefas concluídas/dia
   - Taxa de conclusão (concluídas / criadas no período)
   - Tempo médio para concluir tarefa
   - Distribuição por prioridade
   - Distribuição por origem (qual módulo mais cria tarefas)
   - Itens de inbox processados/dia
   - Taxa de conversão da inbox
   - Usuários ativos/dia

2. **Consultas SQL de métricas:**
   ```sql
   -- Tarefas criadas hoje
   SELECT COUNT(*) FROM taskzei_tasks WHERE created_at::date = CURRENT_DATE;
   
   -- Taxa de conclusão (últimos 7 dias)
   SELECT 
     COUNT(*) FILTER (WHERE status = 'concluida') as completed,
     COUNT(*) as total,
     ROUND(COUNT(*) FILTER (WHERE status = 'concluida')::numeric / COUNT(*) * 100, 1) as rate
   FROM taskzei_tasks 
   WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
   
   -- Origem das tarefas
   SELECT origin_module, COUNT(*) 
   FROM taskzei_tasks 
   WHERE origin_module IS NOT NULL
   GROUP BY origin_module 
   ORDER BY COUNT(*) DESC;
   ```

3. **UI de métricas:**
   - Seção "Métricas" na Visão Geral (Home)
   - Cards com: criadas hoje, concluídas hoje, pendentes, taxa de conclusão
   - Gráfico simples de tendência (últimos 7 dias) — usar CSS/divs, não biblioteca externa

**✅ Critério de aceitação:**
- Home exibe métricas reais (não mockadas)
- Métricas atualizam automaticamente
- Dados vêm do Supabase (provider ativo)

**📊 KPI:** Dashboard carrega em < 1s. Métricas refletem dados reais do banco.

---

### ET-28: Monitoramento de falhas e alertas

**🎯 Entregável:** Sistema de monitoramento do próprio módulo.

**🔧 Ações Detalhadas:**

1. **Health check do provedor:**
   ```typescript
   // Verificar periodicamente se o Supabase está respondendo
   async function checkProviderHealth(): Promise<{ ok: boolean; latency: number; error?: string }> {
     const start = Date.now();
     try {
       await supabase.from('taskzei_tasks').select('id').limit(1);
       return { ok: true, latency: Date.now() - start };
     } catch (err) {
       return { ok: false, latency: Date.now() - start, error: err.message };
     }
   }
   ```

2. **Alertas:**
   - Se provider ficar off-line > 30s, disparar notificação
   - Se latência p95 > 2s, disparar alerta de performance
   - Se taxa de erro > 5% nas últimas 100 operações, disparar alerta

3. **Painel de status do módulo:**
   - Indicador verde/amarelo/vermelho no header do módulo
   - Detalhes: status do banco, latência média, últimas falhas

**✅ Critério de aceitação:**
- Health check executado a cada 60s
- Alerta disparado quando provedor fica off-line
- Painel de status visível no header do módulo

**📊 KPI:** MTTR (Mean Time to Resolve) < 30 min para falha de provedor. Health check em < 500ms.

---

## 16. Roadmap Resumido

| Bloco | Fases | ETs | Esforço | Período | Depende de |
|---|---|---|---|---|---|
| **Regularização** | F1 + F2 | ET-01 a ET-07 | 5-8 dias | Semana 1-2 | Nenhuma |
| **Uso real** | F3 + F4 | ET-08 a ET-12 | 6-10 dias | Semana 2-4 | F1, F2 |
| **Origem e Inbox** | F5 + F6 | ET-13 a ET-16 | 10-16 dias | Semana 3-6 | F3 |
| **Inteligência** | F7 + F8 | ET-17 a ET-21 | 15-22 dias | Semana 5-9 | F4, F6 |
| **Maturidade** | F9 + F10 | ET-22 a ET-28 | 10-16 dias | Semana 8-12 | F5, F7 |

**Total estimado:** 46-72 dias úteis (~9-14 semanas)

---

## 17. O Que Não Fazer Agora

Para não inflar o projeto antes da maturidade:

1. ❌ **CRM completo** — fora do escopo do TaskZei
2. ❌ **WhatsApp como canal de entrada direto** — só depois do Hub de Integrações
3. ❌ **IA generativa pesada na task** — só depois da persistência real (F3)
4. ❌ **Reunião inteligente automática sem confirmação** — depois de F7
5. ❌ **Integração externa direta sem Hub** — proibido por padrão
6. ❌ **Dashboard complexo com biblioteca de gráficos** — métricas internas primeiro
7. ❌ **Permissões avançadas por papel** — só quando houver múltiplos workspaces
8. ❌ **Marketplace de integrações** — visão de longo prazo
9. ❌ **CI/CD independente** — só quando houver demanda comercial concreta
10. ❌ **Build standalone** — só quando houver demanda comercial concreta

---

## 18. Riscos e Mitigações

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Supabase dedicado sem dono financeiro | Alta | Crítico | Definir responsável antes da F2. Se não definir, F2 não começa. |
| R2 | Mock removido antes do Supabase estar 100% | Média | Alto | Manter mock como fallback permanente com aviso visual |
| R3 | Início da Inbox sem fontes de entrada | Média | Médio | F6 depende de F5 — bloqueio no grafo de dependências |
| R4 | Integrações diretas sem passar pelo Hub | Média | Alto | Revisão de código obrigatória. CI/CD check proibindo import direto de APIs externas |
| R5 | Plano sem atualização quinzenal vira letra morta | Alta | Médio | Revisão quinzenal agendada. Próxima revisão: +15 dias |
| R6 | DisplayName errado causar confusão na UI | Alta | Médio | Corrigir na ET-01 (primeira ação) |
| R7 | Parser de linguagem natural com baixa precisão | Média | Médio | Começar com regras (abordagem A) antes de IA |
| R8 | Conflito entre módulos na criação de tarefas | Média | Alto | Contrato `TaskOrigin` padronizado. Toda origem tem module + ID únicos |
| R9 | Perda de dados na migração para Supabase dedicado | Baixa | Crítico | Migração 1:1 com validação de integridade referencial |
| R10 | Agente do módulo sem autoridade de decisão | Média | Médio | Persona atualizada na ET-03 com autoridade explícita |

---

## 19. Glossário

| Termo | Definição |
|---|---|
| **Agenda Inteligente** | Nome de interface do módulo dentro do SagB |
| **TaskZei** | Nome da engine/produto destacável |
| **ET** | Epic/Tarefa executável (usado no planejamento do dia a dia) |
| **Fase (F)** | Bloco conceitual do plano (F1 a F10) |
| **Provider** | Camada de persistência intercambiável (mock, supabase) |
| **Facade** | Fachada unificada que esconde a complexidade dos providers |
| **Adapter** | Código que seleciona o provider com base na env var |
| **KPI** | Key Performance Indicator — métrica numérica de sucesso |
| **RLS** | Row-Level Security — política de segurança do Supabase |
| **Hub de Integrações** | Módulo centralizado do SagB para conexões externas |
| **Núcleo Conversacional** | Módulo de chat com agentes do SagB |
| **CID** | Centro de Inteligência Documental (módulo de documentos) |
| **ATA** | Template de reunião do GrupoB |

---

## 20. Manutenção do Plano

- **Revisão obrigatória:** Quinzenal
- **Próxima revisão:** +15 dias a partir da data deste documento
- **Quem revisa:** Dani Freitas (valida conteúdo) + Cássio Mendes (valida estimativas)
- **Como atualizar:**
  1. ETs concluídas → mover para `changelog.md` com versão e data
  2. Novas ETs identificadas → adicionar na fase correspondente
  3. Mudança de estimativa → atualizar esforço e justificar em `decisions.md`
  4. Mudança de owner → atualizar `manifest.ts`, `decisions.md`, `changelog.md` e `agent/persona.md` no mesmo ciclo

---

*Documento mantido em [`src/modules/taskzei/plano_modulo.md`](src/modules/taskzei/plano_modulo.md)*
*Próxima revisão: 2026-05-17*
