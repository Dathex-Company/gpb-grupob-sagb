# Changelog do Módulo mentorias

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **mentorias**.

---

## [v1.1.0-canonic-refactor] - 2026-05-03

### Adicionado
- `plano_modulo.md` — documentação completa do estado atual do módulo (10 seções)
- `fullscreen?: boolean` no tipo `ModuleRoute` em `src/core/modules/module.types.ts`
- `owner` no `manifest.ts` com `type: 'agent'`, `id: 'mentorias-agent'`
- `handleBackToSagB` no `routes.tsx` usando evento `sagb:navigate`
- `activeTab === 'mentorias'` no `isImmersiveMode` do `App.tsx`
- Botão "Voltar ao SagB" no header canônico do Dashboard
- Botão "Docs" no header canônico do Dashboard

### Modificado
- `MentoriasDashboardPage.tsx` — refatoração completa para padrão canônico:
  - Container: `flex-1 p-10 bg-sagb-bg text-sagb-text min-h-full font-inter`
  - Header canônico 2 colunas com badge "Módulo Oficial", metadata, Docs e botão voltar
  - Todas as cores substituídas por tokens `--sagb-*`
  - Zero uso de `dark:` prefix
  - Tipografia: `font-black`, `text-[12px]`, `text-[10px]`
- `MentoriasLibraryPage.tsx` — refatoração completa para padrão canônico:
  - Container, tokens, tipografia, sem `dark:`
- `MentoriaDetailPage.tsx` — refatoração completa para padrão canônico:
  - Container, tokens, tipografia, sem `dark:`
- `module-doc.ts` — corrigido whitespace nas strings
- `routes.tsx` — adicionado `fullscreen: true` e `handleBackToSagB`

### Corrigido
- Whitespace (`\n`) nas strings de `module-doc.ts`

### Padrão Canônico Aplicado
- ✅ Container com tokens `bg-sagb-bg text-sagb-text font-inter`
- ✅ Header canônico 2 colunas com badge + metadata
- ✅ Tipografia canônica (`text-3xl font-black`, `text-[12px]`, `text-[10px] font-black`)
- ✅ Tokens exclusivos sem hardcoded colors
- ✅ Zero `dark:` prefix
- ✅ Fullscreen ativado
- ✅ Botão de retorno via `sagb:navigate`
- ✅ Owner definido no manifest
- ✅ `plano_modulo.md` documentado

---

## [v1.2.0-sidebar-refined] - 2026-05-04

### Modificado
- `routes.tsx` — `MentoriasModuleContainer` refatorado para incluir sidebar vertical no padrão Metodologias:
  - Layout `flex-1 flex overflow-hidden` com sidebar + conteúdo
  - Sidebar `w-64` com branding, navegação interna e "Voltar ao SagB" no rodapé
  - Nav buttons em estilo pill sutil: ativo `bg-sagb-bg-2 text-sagb-text border-sagb-line shadow-sm`, inativo `text-sagb-muted hover:bg-sagb-bg-2 hover:text-sagb-text hover:border-sagb-line`
  - Indicador de "Detalhamento" ativo quando `view === 'detail'`
- `MentoriasDashboardPage.tsx` — removido container `flex-1 p-10` externo (agora no routes), removido botão "Voltar ao SagB" (agora no sidebar), removida prop `onBackToSagB`

### Adicionado
- Sidebar vertical com 2 itens fixos: Dashboard (🏠) e Biblioteca (📚)

### Removido
- Botão "Voltar ao SagB" do header do Dashboard (movido para o sidebar)
- Prop `onBackToSagB` do `MentoriasDashboardPageProps`

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.
