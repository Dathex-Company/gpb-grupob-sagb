# Plano de Execução Unificada — TaskZei (FASES 5–10)

## Objetivo

Executar **todas as fases restantes do TaskZei** em uma única grande empreitada coordenada, maximizando paralelismo onde possível e respeitando dependências estritas. O resultado é um módulo **completo, integrável ao ecossistema SagB, com inteligência contextual, monitoramento e maturidade**.

---

## 1. Status Atual (Baseline Pós-FASE 4)

| Item | Status |
|------|--------|
| Governança (F1) | ✅ Completo |
| Conformidade canônica (ET-04) | ✅ Completo |
| Provider Supabase (F3) | ✅ Default |
| CRUD completo (F4) | ✅ Completo |
| Drawer editável | ✅ 6 campos + auto-save |
| Checklist funcional | ✅ Add/toggle/remove |
| Comentários funcionais | ✅ Add/list |
| Ações rápidas | ✅ Duplicar/Arquivar |
| Build | ✅ 701 módulos |

---

## 2. Mapa de Dependências Entre Fases

```
F5 (Criação via SagB) ──→ F6 (Inbox) ──→ F8 (Conversão Contextual)
                          ↗                   ↕
F7 (Pautas/Reuniões) ────                    F9 (Integrações)
                                               ↕
F2 (Infra compartilhada)                    F10 (Monitoramento)
```

**Dependências rígidas:**
- F6 (Inbox) depende de F5 (contrato de origem) → **sequencial, não paralelizável**
- F8 (Conversão) depende de F6 (Inbox populado) → **sequencial**
- F7 (Pautas/Reuniões) é **independente** de F5/F6 → pode rodar em paralelo
- F9 (Integrações) depende de F5+F6+F7+F8 → **última do lote**
- F10 (Monitoramento) depende de F9 → **última do lote**

**Execução em 3 ondas paralelas:**

```
┌─────────────────────────────────────────────────────┐
│ ONDA 1 (Paralelo)                                    │
│   F5 (Contrato) + F7 (Pautas/Reuniões) + F2 (Infra) │
└─────────────┬───────────────────────┬────────────────┘
              │                       │
┌─────────────▼───────────┐ ┌────────▼───────────┐
│ ONDA 2 (Paralelo)        │ │ ONDA 2 (Paralelo)   │
│   F6 (Inbox)             │ │   F7 cont.           │
│   F8 (Parser NL)         │ │                      │
└─────────────┬────────────┘ └──────────────────────┘
              │
┌─────────────▼──────────────────────────────────────┐
│ ONDA 3                                               │
│   F9 (Integrações) + F10 (Monitoramento)             │
└────────────────────────────────────────────────────┘
```

---

## 3. ONDA 1 — Paralela (3 tracks simultâneos)

### Track A: F5 — Criação de Tarefas a Partir do SagB

**ET-13: Definir contrato de origem**

| Item | Detalhe |
|------|---------|
| **O que** | Contrato `TaskOrigin` que identifica de onde uma tarefa foi criada |
| **Arquivo** | `src/modules/taskzei/types/origin.types.ts` (NOVO) |
| **Campos** | `originSystem: 'sagb' \| 'clickup' \| 'whatsapp' \| 'email' \| 'inbox'`, `originRef?: string` (ID no sistema de origem), `originMetadata?: Record<string, unknown>` |
| **Implementação** | Interface TypeScript + campo `origin` em `TaskzeiTask` |

```typescript
// origin.types.ts
export type OriginSystem = 'sagb' | 'clickup' | 'whatsapp' | 'email' | 'inbox';

export interface TaskOrigin {
  system: OriginSystem;
  ref?: string;
  metadata?: Record<string, unknown>;
}
```

**ET-14: Implementar endpoint/interface de recepção**

| Item | Detalhe |
|------|---------|
| **O que** | Função `createTaskFromOrigin` no facade que aceita `TaskOrigin` |
| **Onde** | `taskzei.facade.ts` — novo método público |
| **Mock** | `MockTaskzeiProvider.createTaskFromOrigin` — gera task com origin |
| **Supabase** | `SupabaseTaskzeiProvider.createTaskFromOrigin` — salva com origin |
| **Contrato** | Expandir `ITaskzeiRepository` com `createTaskFromOrigin(data: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'> & { origin: TaskOrigin }): Promise<TaskzeiTask>` |

**Arquivos a modificar:**
- `src/modules/taskzei/types/origin.types.ts` — **CRIAR**
- `src/modules/taskzei/types/task.types.ts` — adicionar campo `origin?: TaskOrigin`
- `src/modules/taskzei/types/taskzei.contracts.ts` — adicionar `createTaskFromOrigin` na interface
- `src/modules/taskzei/services/taskzei.providers.ts` — implementar no mock
- `src/modules/taskzei/services/taskzei_supabase_provider.ts` — implementar no Supabase
- `src/modules/taskzei/services/taskzei.facade.ts` — método público com store update

---

### Track B: F7 — Pautas, Reuniões e Decisões

**ET-17: Entidade de Pautas**

| Item | Detalhe |
|------|---------|
| **Arquivo** | `src/modules/taskzei/types/meeting.types.ts` (NOVO) |
| **Entidade** | `MeetingAgendaItem { id, taskzeiMeetingId, title, description, order, status: 'pendente' \| 'discutido' \| 'adiado', createdAt, updatedAt }` |
| **CRUD** | `addAgendaItem`, `updateAgendaItem`, `removeAgendaItem`, `reorderAgendaItems` |
| **Provider** | Implementar nos dois providers (mock in-memory, Supabase Firestore) |
| **Facade** | Métodos com store update |

**ET-18: Entidade de Reuniões**

| Item | Detalhe |
|------|---------|
| **Entidade** | `Meeting { id, title, date, duration, status: 'agendada' \| 'em_andamento' \| 'concluida', agendaItems: MeetingAgendaItem[], decisions: Decision[], notes, createdAt, updatedAt }` |
| **CRUD** | `createMeeting`, `updateMeeting`, `deleteMeeting`, `getMeetings`, `getMeetingById` |
| **Provider** | Implementar nos dois providers |
| **Facade** | Métodos com store update |

**ET-19: Entidade de Decisões**

| Item | Detalhe |
|------|---------|
| **Entidade** | `Decision { id, taskzeiMeetingId, title, description, responsible, deadline, status: 'aberta' \| 'em_andamento' \| 'concluida', taskId?: string, createdAt, updatedAt }` |
| **CRUD** | `addDecision`, `updateDecision`, `removeDecision` |
| **Provider** | Implementar nos dois providers |
| **Facade** | Métodos com store update |

**Nova store:** `useTaskzeiMeetingStore` (Zustand) ou estender `useTaskzeiStore`

**Arquivos a criar:**
- `src/modules/taskzei/types/meeting.types.ts`
- `src/modules/taskzei/store/meeting.store.ts`
- `src/modules/taskzei/components/meetings/` (componentes de UI)

**Migração SQL:**
- `supabase/migrations/2026XXXX000001_taskzei_meetings.sql`

---

### Track C: F2 Light — Infraestrutura (Shared Pool)

> Como decidido anteriormente, usamos o Supabase compartilhado. Esta track apenas garante que as novas tabelas sigam o padrão de prefixo `taskzei_`.

| Item | Detalhe |
|------|---------|
| **Migration** | Arquivo SQL com tabelas de meetings, pautas e decisões |
| **Namespace** | `taskzei_meetings`, `taskzei_meeting_agenda_items`, `taskzei_decisions` |
| **RLS** | Políticas de segurança por usuário |

---

## 4. ONDA 2 — Sequencial (após ONDA 1)

### Track D: F6 — Inbox Inteligente

**ET-15: Estrutura de inbox_items**

| Item | Detalhe |
|------|---------|
| **Arquivo** | `src/modules/taskzei/types/inbox.types.ts` (NOVO) |
| **Entidade** | `InboxItem { id, content, source: 'manual' \| 'whatsapp' \| 'email' \| 'clickup' \| 'voice', status: 'pending' \| 'classified' \| 'converted' \| 'dismissed', suggestedType?: 'task' \| 'meeting' \| 'decision' \| 'note', confidence?: number, convertedToId?: string, convertedToType?: string, createdAt, updatedAt }` |
| **CRUD** | `addToInbox`, `getInboxItems`, `classifyInboxItem`, `dismissInboxItem` |
| **Provider** | Implementar nos dois providers |

**ET-16: Conversão de inbox em entidades**

| Item | Detalhe |
|------|---------|
| **Função** | `convertInboxToEntity(inboxId, entityType, entityData)` |
| **Fluxo** | 1. Cria a entidade (task/meeting/decision) → 2. Atualiza inboxItem com `convertedToId` e `convertedToType` → 3. Marca como `converted` |
| **Facade** | Método que coordena a conversão |

**Arquivos a criar:**
- `src/modules/taskzei/types/inbox.types.ts`
- `src/modules/taskzei/store/inbox.store.ts`
- `src/modules/taskzei/components/inbox/`

---

### Track E: F8 — Inteligência de Conversão Contextual

**ET-20: Parser de linguagem natural para ações**

| Item | Detalhe |
|------|---------|
| **O que** | Função `parseNaturalLanguage(text: string): ParsedAction` que identifica intenção |
| **Arquivo** | `src/modules/taskzei/services/nlParser.service.ts` (NOVO) |
| **Retorno** | `ParsedAction { type: 'task' \| 'meeting' \| 'decision' \| 'reminder', title, description, priority?, assignee?, dueDate?, meetingDate?, participants?, confidence }` |
| **Estratégia** | Inicial: regex + heurísticas (sem LLM). Futuro: integração com núcleo conversacional |
| **Padrões** | "criar tarefa X", "reunião amanhã às 14h", "decide Y para Z", "lembrete em 2 dias" |

**ET-21: Fluxo de confirmação humana**

| Item | Detalhe |
|------|---------|
| **O que** | Interface de confirmação antes de criar entidade a partir de texto livre |
| **Componente** | `ConversionConfirmationModal.tsx` que exibe o que foi parseado e permite confirmar/editar |
| **Fluxo** | Texto → Parser → Modal de confirmação → Criação da entidade |
| **Arquivo** | `src/modules/taskzei/components/inbox/ConversionConfirmationModal.tsx` |

---

## 5. ONDA 3 — Integração e Maturidade

### Track F: F9 — Integrações com Ecossistema SagB

**ET-22: Integração com Núcleo Conversacional**

| Item | Detalhe |
|------|---------|
| **O que** | Registrar handlers no núcleo conversacional para criação de tarefas via chat |
| **Arquivo** | `src/modules/taskzei/services/taskzei.conversational.ts` (NOVO) |
| **Mecanismo** | Exportar `taskzeiConversationalHandlers` que o núcleo conversacional consome |
| **Trigger** | Quando usuário diz "criar tarefa X" no chat, o núcleo chama o handler que cria via facade |

**ET-23: Integração com Monitoramento**

| Item | Detalhe |
|------|---------|
| **O que** | Exportar métricas do TaskZei para o sistema de monitoramento do SagB |
| **Arquivo** | `src/modules/taskzei/services/taskzei.metrics.ts` (NOVO) |
| **Métricas** | Nº de tarefas criadas/dia, taxa de conclusão, tempo médio de conclusão, top responsáveis |

**ET-24: Integração com Documentos (CID)**

| Item | Detalhe |
|------|---------|
| **O que** | Vincular tarefas a documentos do CID |
| **Arquivo** | `src/modules/taskzei/types/task.types.ts` — adicionar `relatedDocIds?: string[]` |
| **Função** | `linkTaskToDoc(taskId, docId)` no facade |

**ET-25: Integração com Hub de Integrações**

| Item | Detalhe |
|------|---------|
| **O que** | Conectar com ClickUp, WhatsApp, e-mail via Hub de Integrações |
| **Arquivo** | `src/modules/taskzei/services/taskzei.hub.ts` (NOVO) |
| **Mecanismo** | Chamar APIs do Hub de Integrações para sincronização bidirecional |
| **Status** | ⚠️ Depende do Hub de Integrações estar operacional |

---

### Track G: F10 — Monitoramento, Auditoria e Maturidade

**ET-26: Logs de auditoria**

| Item | Detalhe |
|------|---------|
| **O que** | Função `auditLog(action, entityType, entityId, userId, metadata)` chamada em todas as mutações |
| **Arquivo** | `src/modules/taskzei/services/taskzei.audit.ts` (NOVO) |
| **Implementação** | Mock: log em console + array in-memory. Supabase: tabela `taskzei_audit_log` |
| **Integração** | Chamar `auditLog` no início de cada método do facade |

**ET-27: Métricas de uso**

| Item | Detalhe |
|------|---------|
| **O que** | Coletar e expor métricas de uso do módulo |
| **Arquivo** | `src/modules/taskzei/services/taskzei.metrics.ts` (estendido da ET-23) |
| **Métricas** | Tasks por status, taxa de conversão inbox→task, engajamento por usuário |

**ET-28: Monitoramento de falhas e alertas**

| Item | Detalhe |
|------|---------|
| **O que** | Coletor de erros e alertas do módulo |
| **Arquivo** | `src/modules/taskzei/services/taskzei.monitor.ts` (NOVO) |
| **Trigger** | Erros em operações CRUD, falhas de conexão Supabase, timeouts |
| **Alerta** | Log estruturado + (futuro) notificação para o agente Dani Freitas |

---

## 6. Cronograma Estimado

| Onda | Track | Fase | ETs | Arquivos | Esforço (dias) |
|------|-------|------|-----|----------|----------------|
| 1A | F5 | Contrato de Origem | ET-13, ET-14 | 6 arquivos modificar + 1 criar | 1 |
| 1B | F7 | Pautas/Reuniões | ET-17, ET-18, ET-19 | 5+ arquivos criar, migration | 2-3 |
| 1C | F2 Light | Migration shared | — | 1 migration SQL | 0.5 |
| 2D | F6 | Inbox Inteligente | ET-15, ET-16 | 4+ arquivos criar | 2 |
| 2E | F8 | Conversão Contextual | ET-20, ET-21 | 2+ arquivos criar | 2 |
| 3F | F9 | Integrações | ET-22 a ET-25 | 4+ arquivos criar | 3 |
| 3G | F10 | Monitoramento | ET-26 a ET-28 | 3+ arquivos criar | 2 |
| **Total** | | | **16 ETs** | | **10-12 dias** |

---

## 7. Matriz de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Hub de Integrações não está pronto para ET-25 | Alta | Alto | Implementar apenas interface/simulacro; integração real postergada |
| Parser NL (ET-20) muito simples para casos reais | Média | Médio | Iterar com base em feedback real; evoluir para LLM depois |
| Migration SQL conflita com outras migrações | Baixa | Alto | Usar timestamp no nome do arquivo; testar em staging |
| Componentes de UI de meetings/reuniões complexos | Média | Médio | Começar com CRUD básico sem drag-and-drop; estender depois |
| F10 depende de sistemas de monitoramento ainda não consolidados | Alta | Alto | Implementar logging próprio independente do sistema central |

---

## 8. Ordem de Execução Recomendada (Batch)

Para executar tudo de uma vez, sugiro a seguinte ordem de commits/PRs:

### Batch 1: Infraestrutura + Tipos
1. Migration SQL (`taskzei_meetings`, `taskzei_decisions`, `taskzei_inbox_items`, `taskzei_audit_log`)
2. `origin.types.ts`, `meeting.types.ts`, `inbox.types.ts`
3. Atualizar `task.types.ts` (adicionar `origin`, `relatedDocIds`)
4. Atualizar `taskzei.contracts.ts` (expandir interfaces)

### Batch 2: Providers + Facade
5. Atualizar `MockTaskzeiProvider` com todos os novos métodos
6. Atualizar `SupabaseTaskzeiProvider` com todos os novos métodos
7. Atualizar `TaskzeiFacade` com todos os novos métodos
8. Criar stores: `meeting.store.ts`, `inbox.store.ts`

### Batch 3: Lógica de Negócio
9. `nlParser.service.ts` (parser de linguagem natural)
10. `taskzei.audit.ts` (audit log)
11. `taskzei.metrics.ts` (métricas)
12. `taskzei.monitor.ts` (monitoramento)

### Batch 4: UI Components
13. Componentes de Meeting (create/edit/list/detail)
14. Componentes de Inbox (list/classify/convert)
15. `ConversionConfirmationModal.tsx`
16. Atualizar navegação e rotas

### Batch 5: Integrações + Final
17. `taskzei.conversational.ts` (handlers p/ núcleo conversacional)
18. `taskzei.hub.ts` (hub de integrações)
19. Testes e build
20. Changelog + Decisions

---

## 9. Validação Pós-Execução

| Critério | Métrica |
|----------|---------|
| Build de produção | `npm run build` sem erros |
| CRUD funcional | Task, Meeting, Decision, Inbox — criar/ler/atualizar/deletar |
| Busca e filtros | Filtros por status, origem, prioridade, data |
| Parser NL | 3 exemplos de cada tipo (task, meeting, decision, reminder) |
| Auditoria | Log de toda mutação com timestamp e usuário |
| Inbox | Fluxo completo: adicionar → classificar → converter → entidade criada |
| Integração | Handler registrado e consumível pelo núcleo conversacional |

---

## 10. Próximo Passo

Deseja que eu **inicie a execução imediata** deste plano unificado, começando pelo **Batch 1** (migrations + tipos + contratos)?
