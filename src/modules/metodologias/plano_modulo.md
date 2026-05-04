# Plano do Módulo — metodologias

## 1. Identificação

| Campo | Valor |
|-------|-------|
| **ID** | `metodologias` |
| **Nome interno** | `metodologias` |
| **Nome de exibição** | Núcleo de Metodologias |
| **Rota base** | `/metodologias` |
| **Ícone** | `BookIcon` |
| **Status** | `active` |
| **Owner** | `metodologias-agent` (Agente de Metodologias) |
| **Fullscreen** | ✅ (após refatoração) |

## 2. Estrutura de arquivos

```
src/modules/metodologias/
├── agent/
│   ├── persona.md
│   ├── session_log.md
│   ├── falas_user.md
│   └── prompt_ativacao_cline.md
├── components/
│   ├── index.ts
│   ├── AtivoDetalheCamadas.tsx      (574 linhas)
│   └── MetodologiasFrontCard.tsx     (103 linhas)
├── data/
│   ├── entradasMetodologicasMock.ts
│   └── metodologiasMock.ts
├── hooks/
│   └── useMetodologiasOverview.ts
├── pages/
│   ├── index.ts
│   ├── MetodologiasHubPage.tsx       (1391 linhas) — ORQUESTRADOR
│   ├── MetodologiasHomePage.tsx      (179 linhas)
│   ├── MetodologiasCatalogoPage.tsx  (379 linhas)
│   ├── MetodologiaAtivoPage.tsx      (184 linhas)
│   ├── MetodologiaAtivoEditarPage.tsx(590 linhas)
│   ├── MetodologiaCanonicoEditarPage.tsx(619 linhas)
│   ├── MetodologiasMesaPage.tsx      (698 linhas)
│   └── MetodologiasSaudePage.tsx     (150 linhas)
├── services/
│   ├── index.ts
│   ├── metodologiasCanonicoSnapshot.ts
│   ├── metodologiasCatalog.ts
│   ├── metodologiasCatalogoExploracao.ts
│   ├── metodologiasComparacaoCanonica.ts
│   ├── metodologiasIndicadores.ts
│   ├── metodologiasMesaOperacional.ts
│   ├── metodologiasPersistencia.ts
│   ├── metodologiasPromocaoAssistida.ts
│   ├── metodologiasRelacoesVisuais.ts
│   └── metodologiasSnapshotCanonicoLifecycle.ts
├── store/
│   └── index.ts
├── types/
│   ├── index.ts
│   └── metodologias.types.ts
├── _triagem/
│   └── Chat
├── changelog.md
├── decisions.md
├── index.ts
├── manifest.ts
├── module-doc.ts
├── plano_modulo.md                  ← este arquivo
└── routes.tsx
```

## 3. Arquitetura

**Padrão: HubPage centralizado.** Diferente de módulos como `mentorias` (que usam view-state routing com páginas independentes), o `metodologias` usa um **HubPage único de 1391 linhas** que:

1. Mantém todo o estado global do módulo (`useState` + `useMemo`)
2. Implementa hash routing interno via `rotaInterna` (string state)
3. Renderiza condicionalmente as 7 sub-páginas baseado na rota
4. Passa **todos os dados como props** para as sub-páginas

As sub-páginas são **presentacionais** — não têm estado próprio (exceto estado local de UI como filtros, formulários), não têm containers externos, e recebem tudo por props.

## 4. Rotas internas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/metodologias` | `MetodologiasHomePage` | Cockpit inicial com indicadores |
| `/metodologias/catalogo` | `MetodologiasCatalogoPage` | Catálogo completo com filtros |
| `/metodologias/mesa` | `MetodologiasMesaPage` | Mesa operacional |
| `/metodologias/saude` | `MetodologiasSaudePage` | Saúde e cobertura do núcleo |
| `/metodologias/ativos/:id` | `MetodologiaAtivoPage` | Detalhe de ativo metodológico |
| `/metodologias/ativos/:id/editar` | `MetodologiaCanonicoEditarPage` | Edição de canônico |
| `/metodologias/ativos/:id/editar` (fallback) | `MetodologiaAtivoEditarPage` | Edição de ativo em estruturação |

## 5. Serviços (10 arquivos)

| Serviço | Responsabilidade |
|---------|-----------------|
| `metodologiasCatalog` | Operações CRUD do catálogo de ativos |
| `metodologiasCatalogoExploracao` | Filtros, ordenação, agrupamento, visual |
| `metodologiasPersistencia` | Persistência local (localStorage) |
| `metodologiasMesaOperacional` | Operações da mesa de trabalho |
| `metodologiasPromocaoAssistida` | Promoção assistida de ativos |
| `metodologiasCanonicoSnapshot` | Geração de snapshots canônicos |
| `metodologiasSnapshotCanonicoLifecycle` | Ciclo de vida de snapshots |
| `metodologiasComparacaoCanonica` | Comparação entre versões canônicas |
| `metodologiasIndicadores` | Cálculo de indicadores de saúde |
| `metodologiasRelacoesVisuais` | Mapa de conexões visuais |

## 6. Providers de dados

- **Firestore**: ativos metodológicos, blocos, versões canônicas, relações
- **localStorage**: entradas brutas, estado de estruturação (via `metodologiasPersistencia`)
- **Mock data** (`data/`): entradas metodológicas mock, metodologias mock

## 7. Estado atual da UI (pré-refatoração)

| Aspecto | Status |
|---------|--------|
| Container canônico (`flex-1 p-10 bg-sagb-bg...`) | ❌ HubPage usa `max-w-[1400px] mx-auto px-6 md:px-10 py-7` |
| Tokens `--sagb-*` | ❌ Nenhum token usado |
| `dark:` prefix | ✅ Não usado (ok) |
| Cores hardcoded | ❌ Presente em todas as páginas |
| `text-sm` / `text-xs` | ❌ Presente em várias páginas |
| Header canônico 2 colunas | ❌ HomePage tem header próprio elaborado |
| Badge "Módulo Oficial" | ❌ Ausente |
| Botão "Voltar ao SagB" | ❌ Ausente |
| `fullscreen: true` na rota | ❌ Ausente (adicionado na refatoração) |
| Owner no manifest | ❌ Ausente (adicionado na refatoração) |
| Plano do módulo | ✅ Este arquivo |

## 8. Dependências

- **Core**: `module.types.ts` (ModuleRoute, ModuleManifest)
- **Serviços SagB**: `services/` (indiretamente via imports das páginas)
- **UI**: Tailwind CSS com variáveis CSS `--sagb-*`
- **Database**: Firestore (via `metodologiasCatalog`, etc.), localStorage

## 9. Pendências identificadas

- [x] Adicionar `owner` no `manifest.ts`
- [x] Corrigir `routes.tsx` (JSX direto, `fullscreen: true`, `handleBackToSagB`)
- [x] Corrigir `module-doc.ts` (whitespace)
- [x] Reduzir `index.ts` (apenas manifest + routes)
- [ ] Refatorar `MetodologiasHubPage.tsx` — container canônico + header canônico
- [ ] Refatorar `MetodologiasHomePage.tsx` — tokens
- [ ] Refatorar `MetodologiasCatalogoPage.tsx` — tokens
- [ ] Refatorar `MetodologiaAtivoPage.tsx` — tokens
- [ ] Refatorar `MetodologiaAtivoEditarPage.tsx` — tokens
- [ ] Refatorar `MetodologiaCanonicoEditarPage.tsx` — tokens
- [ ] Refatorar `MetodologiasMesaPage.tsx` — tokens
- [ ] Refatorar `MetodologiasSaudePage.tsx` — tokens
- [ ] Refatorar `MetodologiasFrontCard.tsx` — tokens
- [ ] Adicionar `'metodologias'` no `isImmersiveMode` em `App.tsx`
- [ ] Atualizar `changelog.md`
- [ ] Atualizar `decisions.md`

## 10. Histórico de versões

| Versão | Data | Descrição |
|--------|------|-----------|
| v1.0.0-governance-bootstrap | — | Versão inicial do módulo |
| v1.1.0-canonic-refactor | 2026-05-03 | Refatoração para padrão canônico 100% |
