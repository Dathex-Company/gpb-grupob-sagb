# decisions — rai

## 30/04/2026
- Módulo alinhado ao padrão canônico de governança do SagB.
- Pasta `agent` limitada aos 4 arquivos canônicos definidos em `docs/governanca_sagb/padrao_unificado_governanca.md`.

## 03/05/2026 — Manhã
- Definição de owner oficial do módulo: Saleh Malu (agente de Curadoria e Varredura de IA).
- Criação do `plano_modulo.md` para atender checklist de conformidade do `padrao_modulos_plugaveis.md`.
- Registro do RAI na matriz oficial de agentes responsáveis em `padrao_agentes_responsaveis.md`.

## 03/05/2026 — Tarde (Fase 0 — Fundação)
- **Visão do módulo aprovada:** RAI será um sistema de agentes configuráveis com temas, fontes e frequências customizáveis, com classificação automática de relevância e geração de alertas/leituras executivas.
- **Decisão de arquitectura:** TF-IDF para classificação inicial (custo zero), migração futura para pgvector/embeddings (Fase 3).
- **Decisão de scheduling:** pg_cron no Supabase (banco de dados) em vez de timers no front-end.
- **Decisão de fontes:** Priorizar RSS e APIs oficiais; scraping como fallback respeitando robots.txt.
- **Fonte canônica de descrição:** `module-doc.ts` passa a ser a única fonte canônica de propósito do módulo. `manifest.displayName` e `plano_modulo.md` referenciam o mesmo texto descritivo.
- **Tipo `sources`:** Adicionado campo `sources: string[]` ao `RAIAgent` para listar URLs das fontes monitoradas.
- **Store ativada:** Store Zustand do RAI ativada com suporte a `loading`, `error` e `reset`.
- **Roadmap expandido:** Plano de implantação em 5 fases documentado no `plano_modulo.md`.

## 04/05/2026 — Hotfix: infinite loop nos hooks Zustand

### Problema
- `useRAIAgents` e `useRAICaptures` usavam `const store = useRAIStore()` (assinatura do store inteiro).
- Quando `store.setLoading(true)` era chamado, o Zustand mudava o estado → React re-renderizava o componente.
- No re-render, `store` se tornava uma nova referência de objeto (Zustand sempre retorna um novo objeto ao mudar estado).
- `useCallback` com `[store]` recriava a função `fetchAgents` → `useEffect` re-executava → loop infinito.
- **Sintoma:** browser freeze/tela trava ao clicar no módulo RAI.

### Decisão
- **NUNCA** assinar o store Zustand inteiro (`const store = useRAIStore()`) dentro de hooks que também mutam o store.
- Usar **sempre seletores individuais** com `useRAIStore(s => s.setLoading)` — estes retornam referências de função estáveis que não causam re-render.
- Usar `useRef` para valores de input (como `sagbAgents` e `filters`) que mudam entre renders, evitando que a dependência do `useCallback` force recriação desnecessária.
