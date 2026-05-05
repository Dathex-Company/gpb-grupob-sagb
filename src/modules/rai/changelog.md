# Changelog do Módulo rai

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **rai**.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Consolidar persona definitiva do agente responsável.

## [v1.0.1] - 2026-05-03

### Adicionado
- Owner Saleh Malu definido no `manifest.ts` (type: agent, id: saleh_malu).
- `plano_modulo.md` criado com visão geral, roadmap e próximos passos.
- Decisão de ownership registrada em `decisions.md`.

### Alterado
- RAI incluído na matriz oficial de agentes responsáveis (`padrao_agentes_responsaveis.md`).

### Status
- Owner: Saleh Malu (definido). Pendência de owner resolvida.

## [v1.1.0] - 2026-05-03

### Adicionado
- Campo `sources: string[]` adicionado à interface `RAIAgent` em `types/index.ts`.
- Store Zustand ativada em `store/index.ts` com suporte a `loading`, `error` e `reset`.
- Fontes RSS reais adicionadas aos 3 agentes mock em `raiServices.ts` (BCB, arXiv, TechCrunch etc).
- `plano_modulo.md` expandido: roadmap completo com Fase 0-5, riscos mapeados e dependências.
- Decisões de arquitetura registradas em `decisions.md` (TF-IDF → embeddings, pg_cron, fontes RSS).

### Alterado
- `manifest.ts`: `displayName` alterado de `"RAI"` para `"RAI — Radar Avançado de Inteligência"`.
- `module-doc.ts`: `purpose` atualizado com descrição real do módulo.
- `plano_modulo.md`: visão geral atualizada, riscos e dependências documentados.

### Registro
- Sessão completa registrada em `agent/session_log.md`.
- Todas as falas do usuário registradas em `agent/falas_user.md`.

### Status
- Fase 0 — Fundação concluída. Módulo preparado para Fase 1 (MVP real).

## [v1.2.0] - 2026-05-03 (correção arquitetural)

### Contexto da Correção
- **Problema identificado:** A implementação inicial criava `rai_agents` como tabela paralela de cadastro de agentes, duplicando o registro canônico do SagB (`agents`).
- **Decisão arquitetural:** O RAI não cria agentes próprios. Ele **aproveita os agentes do SagB** (`nucleo_de_agentes` + `quadro_de_elite`), adicionando apenas configurações de radar via tabela de extensão.
- **Análise realizada:** Examinados `nucleo_de_agentes/module-doc.ts` (advertência: "Usar sempre agents como fonte única de cadastro oficial") e `quadro_de_elite/module-doc.ts` (advertência: "Criação de cadastro de agentes paralelo → risco de duplicidade de identidade").

### Adicionado
- **Migration corrigida** `20260503000001_rai_core.sql`: tabela `rai_configs` com `agent_id uuid references public.agents(id) on delete cascade` e `unique(agent_id, workspace_id)`. `rai_captures.agent_id` referencia `agents(id)` diretamente.
- **Tipo `RAIConfig`** em `types/index.ts`: entidade de configuração do radar, sem duplicar dados do agente.
- **`RAIAgent` como tipo composto:** mescla `Agent` do SagB + `RAIConfig` via `composeRAIAgents()`.
- **Netlify Function** `rai-rss-fetch.mjs` corrigida: busca `rai_configs` por `agent_id` + `workspace_id`, depois busca dados do agente em `agents`.
- **Hook `useRAIAgents(sagbAgents?)`**: aceita `Agent[]` do contexto global do App.tsx, enriquece com configurações RAI.

### Removido
- Tabela `rai_agents` (substituída por `rai_configs` com FK → `agents(id)`).
- Interface `RAIAgent` como entidade isolada (agora é tipo composto: Agent SagB + RAIConfig).

### Registro
- Decisão arquitetural registrada em `agent/session_log.md` e `agent/falas_user.md`.
- Análise dos módulos `nucleo_de_agentes` e `quadro_de_elite` documentada.

### Corrigido (hotfix)
- **Import path incorreto**: em `useRAI.ts` e `raiSupabaseService.ts`, o caminho `../../../services/supabase` resolvia para `src/modules/services/supabase` (inexistente). Corrigido para `../../../../services/supabase` (4 níveis até `src/`).
- **Sintoma**: tela branca ao carregar o App — o Vite não conseguia resolver a importação de `restFetch` e `auth`, quebrando toda a cadeia de módulos.

### Status
- **Fase 1 — MVP Radar IA**: Pipeline real implementado (RSS → Parse → TF-IDF → Supabase).
- **Integração com SagB**: zero duplicação de cadastro de agentes. `rai_configs` como extensão de `agents`.
- **Build/Dev**: servidor roda sem erros de importação.
- Pendente: conectar `RAIPage.tsx` ao contexto de `activatedAgents` do `App.tsx`.

## [v1.2.1] - 2026-05-04

### Adicionado
- Sidebar modificada para exibir SOMENTE o módulo RAI no menu de navegação.

### Alterado
- `components/Sidebar.tsx`: filtro `menuItems` para mostrar apenas item com id 'rai'.

### Diagnóstico
- RAI module registrado em `moduleRegistry.ts`, manifesto com `initialStatus: 'active'`, rota `/rai`.
- Sidebar exibe RAI via `dynamicModules`. Sem conflito de ID/label com staticItemIds.
- Possível causa de inacessibilidade: localStorage com toggle `rai: false` de sessão anterior.
- Servidor dev reiniciado para limpar cache do Vite.

### Status
- Navegação: apenas RAI visível no sidebar.
- Risco: usuário perde acesso a outros módulos via sidebar (intencional).

## [v1.2.2] - 2026-05-04

### Corrigido (hotfix crítico)
- **Infinite loop no hook `useRAIAgents`**: o hook assinava o store Zustand inteiro via `const store = useRAIStore()`. Quando `store.setLoading(true)` era chamado, o estado do store mudava → o componente re-renderizava → `store` virava nova referência de objeto → `useCallback` com `[store]` recriava `fetchAgents` → `useEffect` re-executava → loop infinito. Sintoma: tela trava (browser freeze) ao clicar no módulo RAI.
- **Mesmo padrão replicado em `useRAICaptures`**: idem, `[store, filters]` como dependência causava o mesmo loop.
- **Correção aplicada**: store quebrado em dois hooks auxiliares:
  - `useRAIStoreActions()` — seletores individuais com `useRAIStore(s => s.setLoading)`, que retornam referências de função ESTÁVEIS (não causam re-render).
  - `useRAIStoreValues()` — seletores individuais para leitura de valores reativos (`loading`, `error`, `captures`).
  - `useRef` para `sagbAgents` e `filters` — evita que arrays/objetos criados no render do parente forcem recriação do `useCallback`.

### Registro
- Análise completa documentada em `agent/session_log.md`.
- Decisão registrada em `decisions.md`.
