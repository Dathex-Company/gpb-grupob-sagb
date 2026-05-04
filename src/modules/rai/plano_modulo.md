# plano_modulo — rai

## objetivo
Módulo oficial do Radar Avançado de Inteligência (RAI) do SagB.

## status
ativo

## owner
Saleh Malu — Curadoria e Varredura de IA

## visão geral
Sistema de agentes de inteligência configuráveis que varrem a internet (RSS, sites, APIs) em frequência programada, capturam conteúdo relevante por tema, classificam automaticamente por relevância e geram alertas e leituras executivas. Substitui monitoramento manual por curadoria automatizada e contínua.

## roadmap

### Concluído
- [x] Estrutura inicial do módulo (manifest, rotas, index, module-doc)
- [x] Pasta agent com 4 arquivos canônicos (persona, session_log, falas_user, prompt_ativacao_cline)
- [x] Componentes de UI: Hero, StatsStrip, FiltersBar, Captures, Readings, Alerts, History, Agents
- [x] Store (Zustand), types, services e hooks
- [x] Registro no moduleRegistry.ts
- [x] Owner definido (Saleh Malu)
- [x] **Fase 0 — Fundação:** type `sources` adicionado, store ativada, displayName e purpose atualizados, mocks com fontes reais

### Fase 1 — MVP Radar IA (concluída — corrigida)
- [x] **Migration** `20260503000001_rai_core.sql`: `rai_configs` com FK → `agents(id)` do SagB + `rai_captures` com FK → `agents(id)`. Sem duplicação de cadastro.
- [x] **Netlify Function** `rai-rss-fetch.mjs`: fetch RSS, parse XML (RSS 2.0 e Atom), TF-IDF zero-cost, batch upsert no Supabase, cálculo de próxima execução.
- [x] **`raiSupabaseService.ts`**: consulta `rai_configs` por `agent_id` + `workspace_id`.
- [x] **`useRAIAgents(sagbAgents?)`**: compõe `RAIAgent[]` a partir de `Agent[]` do SagB + `RAIConfig[]` do RAI.
- [x] **Store Zustand**: `configs: RAIConfig[]` como estado principal.
- [ ] **Pendente:** Conectar `RAIPage.tsx` ao contexto `activatedAgents` do `App.tsx` para usar agentes reais.

### Fase 2 — Configuração de Radar (estimativa: 2-3 dias)
- [ ] Modal de configuração RAI para agente existente do SagB: tema, objetivo, fontes, frequência
- [ ] CRUD de `rai_configs` persistido no Supabase
- [ ] Botão "Ativar Radar" nos agentes do Quadro de Elite
- [ ] Filtros dinâmicos baseados nas configurações ativas

### Fase 3 — Classificação Inteligente (estimativa: 3-5 dias)
- [ ] Migração TF-IDF → pgvector (embeddings)
- [ ] Classificação por similaridade semântica
- [ ] Feedback loop: usuário marca relevância → ajusta pesos
- [ ] Busca semântica no histórico de capturas

### Fase 4 — Alertas e Leituras (estimativa: 2-3 dias)
- [ ] Gatilhos de alerta por severidade (alta → notification, média → badge)
- [ ] Leituras executivas automáticas (síntese das capturas do período)
- [ ] Painel de leituras com timeline
- [ ] Exportar leitura como relatório

### Fase 5 — Expansão (contínuo)
- [ ] Adapters de fonte (RSS, scraping, API, newsletter)
- [ ] Catálogo público de fontes (com curadoria da comunidade)
- [ ] Marketplace de agentes pré-configurados
- [ ] Agentes híbridos (combinação de fontes + LLM para análise)
- [ ] Política de retenção e arquivamento automático

## riscos mapeados
| Risco | Mitigação |
|-------|-----------|
| Timeout em serverless (10s Netlify) | Usar n8n ou worker dedicado para scraping pesado |
| Custo de LLM para classificação | TF-IDF no MVP; embeddings só na Fase 3 |
| Legal: scraping de sites | Respeitar robots.txt, priorizar RSS/APIs oficiais |
| Bloat de dados | Política de retenção (ex: 90 dias) + arquivamento |

## dependências
- Supabase (PostgreSQL + pg_cron + pgvector na Fase 3)
- Netlify Edge/Serverless Functions
- n8n (opcional, para orquestração complexa)
- Zustand (já integrado)
- Tailwind CSS (já no projeto)

## histórico de planejamento

| data | descricao |
|------|-----------|
| 03/05/2026 | Criação inicial do plano. Definição de owner Saleh Malu. |
| 03/05/2026 | Expansão do roadmap: Fase 0 (Fundação) concluída, Fases 1-5 definidas. Riscos e dependências mapeados. |
