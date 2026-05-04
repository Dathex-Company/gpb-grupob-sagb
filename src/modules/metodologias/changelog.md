# Changelog do Módulo metodologias

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **metodologias**.

---

## [v1.1.0-canonic-refactor] - 2026-05-03

### Adicionado
- `plano_modulo.md` — documentação completa do estado atual do módulo (10 seções)
- `owner` no `manifest.ts` com `type: 'agent'`, `id: 'metodologias-agent'`
- `fullscreen: true` no `routes.tsx`
- `handleBackToSagB` no `routes.tsx` usando evento `sagb:navigate`
- `activeTab === 'metodologias'` no `isImmersiveMode` do `App.tsx`
- Botão "Voltar ao SagB" no header canônico do HubPage
- Botão "Docs" no header canônico do HubPage
- Interface `MetodologiasHubPageProps` com `onBackToSagB`

### Modificado
- `routes.tsx` — substituído `lazy()` por import direto + JSX, adicionado `fullscreen: true` e `handleBackToSagB`
- `manifest.ts` — adicionado `owner`
- `index.ts` — reduzido para apenas manifest + routes
- `module-doc.ts` — corrigido whitespace nas strings
- `MetodologiasHubPage.tsx` — refatoração completa para padrão canônico:
  - Container: `flex-1 p-10 bg-sagb-bg text-sagb-text min-h-full font-inter`
  - Header canônico 2 colunas com badge "Módulo Oficial", metadata, Docs e botão voltar
  - Navbar tokenizada: `bg-sagb-panel border-sagb-line`
  - Loading e not-found sections tokenizados
- `MetodologiasHomePage.tsx` — refatoração completa:
  - Gradient header `from-sagb-blue to-indigo-700`
  - Cards com tokens `bg-sagb-panel border-sagb-line`
  - Badges semânticos: `bg-emerald-500/10`, `bg-amber-500/10`, `bg-indigo-500/10`
- `MetodologiasCatalogoPage.tsx` — refatoração completa:
  - Todos selects/inputs tokenizados: `bg-sagb-panel border-sagb-line text-sagb-text text-[12px]`
  - Filter pills: `bg-sagb-blue/10 text-sagb-blue`
  - Map/connection panels e preview aside tokenizados
- `MetodologiaAtivoPage.tsx` — refatoração completa:
  - Header e info cards tokenizados
  - Badges semânticos com opacidade 10%
  - Seção de relacionamentos com classes canônicas
- `MetodologiasSaudePage.tsx` — refatoração completa:
  - Health status com `bg-emerald-500/10`, `bg-amber-500/10`, `bg-rose-500/10`
  - Métricas e cobertura tokenizadas
  - Attention items tokenizados
- `MetodologiasFrontCard.tsx` — refatoração completa:
  - Card: `bg-sagb-panel border-sagb-line`
  - Status badges: `bg-cyan-500/10`, `bg-indigo-500/10`
- `MetodologiaAtivoEditarPage.tsx` (590 linhas) — refatoração completa:
  - Todos containers: `bg-white border-slate-200` → `bg-sagb-panel border-sagb-line`
  - Todos inputs/selects/textareas tokenizados
  - Badges semânticos substituídos (`bg-cyan-50/60 text-cyan-800` → `bg-cyan-500/10 text-cyan-500`)
  - Lacunas: `bg-amber-50/70` → `bg-amber-500/10`
  - Próximo passo: `bg-indigo-50/60` → `bg-indigo-500/10`
  - Botões: `bg-sagb-blue`, `bg-rose-500`, `bg-emerald-500`
- `MetodologiaCanonicoEditarPage.tsx` (619 linhas) — refatoração completa:
  - Header, campos-base, rastreabilidade tokenizados
  - Versionamento: `bg-amber-50/40` → `bg-amber-500/10`
  - Versões canônicas e eventos tokenizados
  - Diff grid tokenizado
  - Blocos canônicos tokenizados
- `MetodologiasMesaPage.tsx` (698 linhas) — refatoração completa:
  - Constantes `BADGE_CLASSIFICACAO_STYLE`, `BADGE_PRONTIDAO_STYLE`, `FILTER_BASE_CLASS` atualizadas
  - Todos painéis, cards indicadores e filtros tokenizados
  - Fila operacional, formulário, entradas tokenizados
  - Leitura assistida e conversão assistida tokenizadas

### Corrigido
- Whitespace (`\n`) nas strings de `module-doc.ts`
- Dynamic import (`lazy()`) substituído por import estático em `routes.tsx`

---

## [v1.2.0-subsidebar-refactor] - 2026-05-03

### Adicionado
- `MetodologiasInternalMenu.tsx` — novo componente de sub-sidebar vertical com 4 itens (Home, Mesa, Catálogo, Saúde), indicador de modo detalhamento
- Layout grid `lg:grid-cols-[280px_1fr]` no HubPage substituindo navbar horizontal
- `max-w` expandido de `[1400px]` para `[1600px]` para acomodar sub-sidebar

### Modificado
- `MetodologiasHubPage.tsx` — navbar horizontal substituída por grid com sub-sidebar vertical + conteúdo
- `App.tsx:1710` — `isImmersiveMode` dividido em `hideSidebar` (esconde sidebar) e `hideHeader` (esconde header superior)
  - `hideSidebar`: metodologias, mentorias, gestao-financeira, crm-ziplia, audacus-home
  - `hideHeader`: apenas audacus-home
- `MentoriasDashboardPage.tsx:43-50` — botão Docs removido

### Removido
- Botão "Docs" do header canônico do `MetodologiasHubPage.tsx`
- Botão "Docs" do `MentoriasDashboardPage.tsx`

### Padrão Canônico Aplicado (Original v1.1.0)
- ✅ Container com tokens `bg-sagb-bg text-sagb-text font-inter`
- ✅ Header canônico 2 colunas com badge + metadata
- ✅ Tipografia canônica (`text-3xl font-black`, `text-[12px]`, `text-[10px] font-black`)
- ✅ Tokens exclusivos sem hardcoded colors
- ✅ Zero `dark:` prefix
- ✅ Zero `text-sm`/`text-xs` (substituído por `text-[12px]`)
- ✅ Zero `font-bold` em títulos (substituído por `font-black`)
- ✅ Badges semânticos no formato `bg-*-500/10 text-*-500 border-*-500/20`
- ✅ Fullscreen ativado
- ✅ Botão de retorno via `sagb:navigate`
- ✅ Owner definido no manifest
- ✅ `plano_modulo.md` documentado
- ✅ HubPage como orquestrador central (1408 linhas)
- ✅ Sub-páginas presentacionais sem container próprio

### Padrão Canônico Aplicado (v1.2.0 — Sub-sidebar)
- ✅ Sub-sidebar vertical como padrão de navegação interna (mesmo pattern de configuracoes-ambiente e monitoramento)
- ✅ Grid `lg:grid-cols-[280px_1fr]` com aside nav + conteúdo
- ✅ `hideSidebar`/`hideHeader` separados para controle granular de imersão
- ✅ Botões de documentação removidos (docs movidos para back-end)

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.
