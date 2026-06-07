# SagB | NAGI | MEGA-ETAPA 06 | Transformar NAGI em Módulo Full Screen

**Status:** ✅ Concluído
**Data:** 2026-06-04
**Autor:** Cássio Mendes
**Path oficial:** `Z:\00_sagb\src\modules\nagi`

---

## 1. Resumo Executivo

O NAGI foi transformado de uma view encaixada no shell do SagB para um **sistema próprio full screen**, com sidebar própria, dashboard inicial e saída clara para voltar ao SagB.

### O que foi feito

1. **NagiShell** — shell full screen (`100dvh` × `100vw`) que substitui o layout encaixado
2. **NagiSidebar** — sidebar própria do NAGI à esquerda, com identidade visual, navegação de 5 seções e saída "Voltar ao SagB" no rodapé
3. **NagiDashboard** — dashboard inicial com grid de métricas, timeline de atividades, itens elegíveis e atalhos rápidos
4. **NAGIView refatorado** — de orquestrador com abas para renderizador de seção ativa, mantendo toda a lógica de negócio, modais e fluxos
5. **NAGIPage simplificado** — agora apenas importa e renderiza o NagiShell

### Como o NAGI ficou

| Aspecto | Antes | Agora |
|---------|-------|-------|
| Sensação | Página interna do SagB | Sistema próprio full screen |
| Navegação | Abas no topo (3 tabs) | Sidebar esquerda (5 seções) |
| Tela inicial | Primeira aba (Documentos) | Dashboard com métricas |
| Saída do módulo | Botão "Voltar" na topbar | Footer da sidebar "Voltar ao SagB" |
| Identidade | Badge NZ na topbar | Badge NZ + nome + tagline na sidebar |
| Dashboard | Inexistente | Grid de 4 métricas + timeline + atalhos |

---

## 2. Caminho Trabalhado

```
Z:\00_sagb\src\modules\nagi\
├── components\
│   ├── NagiShell.tsx          [CRIADO]   Shell full screen
│   ├── NagiSidebar.tsx        [CRIADO]   Sidebar própria
│   ├── NagiDashboard.tsx      [CRIADO]   Dashboard inicial
│   ├── NAGIView.tsx           [ALTERADO]  Refatorado para seção única
│   └── ... (demais componentes preservados)
├── pages\
│   └── NAGIPage.tsx           [ALTERADO]  Agora usa NagiShell
├── plans\
│   └── NAGI-MEGA-ETAPA-06-FULLSCREEN-SHELL.md  [CRIADO]  Este relatório
├── styles\
│   └── nagi-tokens.css        [PRESERVADO]
├── services\                  [PRESERVADO]
├── domain\                    [PRESERVADO]
├── repository\                [PRESERVADO]
└── ...
```

---

## 3. Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| [`components/NagiShell.tsx`](Z:/00_sagb/src/modules/nagi/components/NagiShell.tsx) | Shell full screen que orquestra sidebar + conteúdo + footer. Gerencia estado de seção ativa, carrega todos os dados (catalogItems, triageItems, ingestionDocs, eligibleCount), e os distribui para os componentes filhos. |
| [`components/NagiSidebar.tsx`](Z:/00_sagb/src/modules/nagi/components/NagiSidebar.tsx) | Sidebar fixa de 220px à esquerda: badge NZ (gradiente teal), nome "NAGI", tagline "governança de ideias", 5 itens de navegação com ícones SVG inline e badges de contagem, hover/active states, separador, e footer "Voltar ao SagB" com seta. |
| [`components/NagiDashboard.tsx`](Z:/00_sagb/src/modules/nagi/components/NagiDashboard.tsx) | Dashboard inicial: header "Dashboard" com tagline, grid de 4 métricas (Documentos, Ideias, Catálogo, Revisão), grid secundário (itens elegíveis + timeline mockada de atividades), atalhos rápidos (Nova ideia, Ver documentos, Ver catálogo). |

## 4. Arquivos Alterados

| Arquivo | O que mudou |
|---------|-------------|
| [`components/NAGIView.tsx`](Z:/00_sagb/src/modules/nagi/components/NAGIView.tsx) | Removida lógica de abas (activeTab, tabLabels). Agora recebe `section: NagiSection` como prop. Renderiza o conteúdo da seção ativa: documentos → IngestionSection, ideias → TriageSection, catálogo → CatalogSection, governança → EmptyState placeholder. Mantém modais (Nova ideia, Importar do NIC), toast, refresh, criação e NIC import. Adiciona header + actions por seção. |
| [`pages/NAGIPage.tsx`](Z:/00_sagb/src/modules/nagi/pages/NAGIPage.tsx) | De `return <NAGIView onBack={onBack} />` para `return <NagiShell onBack={onBack} onOpenTab={onOpenTab} />`. |

## 5. Arquivos Removidos

Nenhum arquivo foi removido.

## 6. O que foi preservado da refatoração anterior

| Item | Preservado |
|------|------------|
| Tokens CSS (`var(--nagi-*)`) | ✅ |
| IngestionSection | ✅ |
| TriageSection | ✅ |
| CatalogSection | ✅ |
| EmptyState | ✅ |
| Slide panel / Detail | ✅ |
| Lógica de serviços (nagiService, nagiPromotionService, nagiNicBridge, nagiIngestionService) | ✅ |
| Domain types | ✅ |
| Repository | ✅ |
| Pipeline visual | ✅ |
| Cards com radius 22px | ✅ |
| Pipeline 7 estágios | ✅ |
| Classificador heurístico | ✅ |
| Handoff tracking | ✅ |
| Microcopy melhorado | ✅ |
| Estilo consistente com tokens | ✅ |

## 7. O que mudou estruturalmente

| Antes | Depois |
|-------|--------|
| `NAGIPage → NAGIView (com abas)` | `NAGIPage → NagiShell → NagiSidebar + NAGIView (sem abas) + NagiDashboard` |
| Navegação por tabs no topo | Navegação por sidebar à esquerda |
| Primeira tela: Documentos | Primeira tela: Dashboard |
| Três seções: Documentos, Triagem, Catálogo | Cinco seções: Dashboard, Documentos, Ideias, Catálogo, Governança |
| Estado de aba gerenciado no NAGIView | Estado de seção gerenciado no NagiShell |
| Dados carregados no NAGIView | Dados carregados no NagiShell e passados como props |

## 8. Sidebar do NAGI

```
┌──────────────────────┐
│ [NZ] NAGI            │  ← Badge gradiente + nome + tagline
│      governança...   │
│                      │
│ ◻ Dashboard          │  ← Item ativo: brand + soft bg
│ ◻ Documentos    (12) │  ← Badge de contagem
│ ◻ Ideias em an. (8) │
│ ◻ Catálogo      (15) │
│ ◻ Governança     (0) │
│                      │
│ ──────────────────   │  ← Separador
│                      │
│ ← Voltar ao SagB     │  ← Footer, elegante e discreto
└──────────────────────┘
```

**Características:**
- Largura fixa de 220px
- Ícones SVG inline (Dashboard: grid, Documentos: doc, Ideias: flask, Catálogo: book, Governança: shield)
- Badge NZ com gradiente `linear-gradient(135deg, #0E7C7B, #14A8A6)`
- Active state: `var(--nagi-brand)` no texto, `var(--nagi-brand-soft)` no fundo
- Hover state: `var(--nagi-surface-muted)` no fundo
- Badges de contagem com fundo `var(--nagi-neutral-soft)` e texto `var(--nagi-muted)`, ou brand quando ativo
- Footer "Voltar ao SagB" com seta SVG à esquerda, hover escurece

## 9. Dashboard Inicial

```
┌── Dashboard ──────────────────────────────────────┐
│ Visão geral do Núcleo Avançado de Gestão de Ideias │
├────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐ │
│ │ 📄     │ │ 🧪     │ │ 📚     │ │ ⚠️           │ │
│ │ Docs   │ │ Ideias │ │ Catál. │ │ Revisão      │ │
│ │   12   │ │    8   │ │   15   │ │      3       │ │
│ └────────┘ └────────┘ └────────┘ └──────────────┘ │
├────────────────────────────────────────────────────┤
│ ┌── Elegíveis ──┐ ┌── Últimas atividades ────┐   │
│ │ ✅ 2 elegíveis │ │ • Documento classificado  │   │
│ │ Ver ideias     │ │ • Ideia promovida        │   │
│ └────────────────┘ │ • Documento em revisão   │   │
│                    │ • Ideia criada           │   │
│                    │ • Catálogo atualizado    │   │
│                    └──────────────────────────┘   │
├────────────────────────────────────────────────────┤
│ [Nova ideia]  [Ver documentos]  [Ver catálogo]     │
└────────────────────────────────────────────────────┘
```

## 10. Saída de volta ao SagB

Localizada no **rodapé da sidebar**:
- Botão com ícone de seta à esquerda
- Texto "Voltar ao SagB"
- Cor `var(--nagi-muted)` (discreta), escurece para `var(--nagi-text)` no hover
- Sem emoji, sem badge chamativo — elegante e funcional

## 11. Pendências

| Item | Status | Nota |
|------|--------|------|
| Governança real | Placeholder | Seção mostra EmptyState "Governança em construção" |
| Dashboard com dados reais de atividade | Mockado | Timeline usa dados mockados. Futuramente integrar com log de eventos |
| Botão "Nova ideia" no dashboard | Redireciona para seção Ideias | Idealmente abriria modal inline no dashboard |
| Sidebar colapsável | Não implementado | Pode ser necessário para telas menores |
| Transições de seção | Sem animação | Futuramente: fade/slide entre seções |
| Breadcrumbs | Removidos | Sidebar substituiu necessidade de breadcrumbs |

## 12. Riscos e Limites Remanescentes

1. **Sidebar fixa 220px em telas pequenas** — Abaixo de 1024px, a sidebar pode comprimir demais o conteúdo. Mitigação futura: sidebar colapsável.
2. **Dashboard com timeline mockada** — Dá a impressão de funcionalidade que ainda não existe. Ideal substituir por dados reais na próxima etapa.
3. **NAGIView duplica header para governança** — Seção de governança tem header inline no JSX, enquanto as demais usam o SECTION_CONFIG. Pequena inconsistência.
4. **Sem transição visual entre seções** — A troca de seção é instantânea. Animação CSS melhoraria a sensação de sistema.

## 13. Reflexão Crítica

### O que ficou realmente bom

- **Sidebar com identidade forte.** O badge NZ gradiente + nome + tagline cria uma presença visual imediata. O NAGI agora tem "cara de sistema".
- **Dashboard como primeira tela.** A entrada pelo dashboard dá contexto antes de mergulhar nos dados. Isso muda completamente a percepção de maturidade do módulo.
- **Responsividade dos dados.** As métricas no dashboard refletem dados reais do sistema (catálogo, triagem, documentos) — não são números fixos.
- **Preservação total da lógica.** Nada foi quebrado. Ingestion, Triage, Catalog, modais — tudo funciona como antes, só que dentro de um shell mais robusto.
- **Footer "Voltar ao SagB" discreto mas claro.** Não polui a interface, mas está visível e acessível.

### O que ainda ficou fraco

- **Seção de Governança vazia.** É um placeholder elegante, mas vazio. Idealmente já teria algo — mesmo que simples — sobre decisões pendentes ou auditoria.
- **Timeline mockada no dashboard.** Funciona visualmente, mas o usuário pode sentir que é enganoso se começar a interagir. Melhor substituir por dados reais o quanto antes.

### O que quase virou exagero

- **Grid de 4 métricas no dashboard.** Inicialmente pensei em 6 métricas. 4 é o ponto certo — não sobrecarrega e cobre o essencial.
- **Sidebar com 5 itens.** Dashboard + 4 áreas de conteúdo. Se tivesse mais que 5, precisaria de scroll na sidebar. 5 é o limite ideal.

### O que foi segurado para não poluir

- **Animações de transição.** Seria um refinamento, mas não crítica para o lançamento. Pode vir numa próxima etapa.
- **Sidebar colapsável.** A sidebar de 220px funciona bem para a maioria dos monitores. Colapsar seria um plus, não uma necessidade.
- **Breadcrumbs dentro do conteúdo.** Com a sidebar funcionando como navegação principal, breadcrumbs se tornaram redundantes.

### O NAGI agora realmente parece um sistema à parte?

**Sim, com ressalvas.**

A entrada pelo sidebar + dashboard dá uma sensação clara de "outro sistema". O layout full screen (`100dvh` × `100vw`) com sidebar própria, identidade visual e saída controlada cria a ilusão de produto independente.

O que ainda "denuncia" que é parte do SagB:
- A URL ainda é `/nagi` dentro do mesmo domínio — tecnicamente ainda é o mesmo SPA
- O estilo ainda usa os tokens CSS do ecossistema Alice UI (o que é bom, na verdade)
- O clique em itens do catálogo que navegam para outros módulos (ex: ventures) ainda usam o `onOpenTab` do SagB

Mas para a experiência do usuário final, a sensação é de sistema próprio. O que importa.

### Ele ficou mais forte como módulo vendável?

**Sim.** A transformação full screen + sidebar + dashboard são os três componentes que um produto precisa para parecer "vendável". Antes parecia uma feature interna. Agora parece um módulo que poderia ser apresentado em um pitch ou demo.

Se o objetivo é que o NAGI sirva de referência para outros módulos (conforme o mega-plano), essa arquitetura estabelece o padrão:
1. Shell próprio (NagiShell)
2. Sidebar com identidade (NagiSidebar)
3. Dashboard de entrada (NagiDashboard)
4. Seções de conteúdo entregues por componentes dedicados

### Essa nova arquitetura ajuda ele a virar referência?

**Sim.** A separação de responsabilidades é clara:
- `NagiShell` → orquestrador e layout
- `NagiSidebar` → navegação
- `NagiDashboard` → entrada
- `NAGIView` → conteúdo (refatorado para ser "burro" — só renderiza o que recebe)
- Serviços → lógica pura, sem UI

Qualquer módulo que queira seguir o padrão NAGI pode copiar essa estrutura.

---

## 14. O que eu faria diferente

1. **Criaria o NagiDashboard primeiro, antes do shell.** O dashboard foi o componente mais denso (472 linhas). Tê-lo como referência antes de criar o shell teria ajudado a definir melhor os contratos de props.
2. **Extrairia o SECTION_CONFIG para um arquivo separado.** Está inline no NAGIView. Funciona, mas polui o componente principal.
3. **Adicionaria um `GovernanceSection` mínimo.** Mesmo que simples — uma tabela de decisões recentes — teria sido melhor que o EmptyState.

---

## 15. Observações e Insights

- A refatoração manteve **100% da lógica de negócio intacta** (services, repository, classifier, rules, handoff). Zero regressão funcional.
- O NAGIView passou de 606 para 703 linhas — ganhou ~100 linhas porque o header + actions de cada seção agora são mais descritivos e com mais elementos visuais.
- O NagiDashboard é o maior componente novo (472 linhas), mas é 90% estrutura de cards + ícones + texto. Baixa complexidade.
- A sidebar (282 linhas) é puro CSS-in-JS com SVG inline. Sem estado, sem lógica — componentização limpa.
- Não foi necessário alterar nenhum arquivo de serviço, domínio ou repositório. Prova de que a separação view × lógica estava correta desde o início.

---

## Checklist de Pronto

| Critério | Status |
|----------|--------|
| Ao clicar no NAGI no sidebar do SagB, sensação de sistema próprio | ✅ |
| Sidebar própria do NAGI existe | ✅ |
| Dashboard inicial do NAGI existe | ✅ |
| Saída "Voltar ao SagB" clara no rodapé da sidebar | ✅ |
| Módulo não parece página simples encaixada | ✅ |
| Navegação interna clara (5 seções na sidebar) | ✅ |
| Visual alinhado ao Alice UI (tokens CSS, Rubik, hierarquia) | ✅ |
| Lógica construída anteriormente continua íntegra | ✅ |
| NAGI parece mais forte, maduro e vendável | ✅ |

---

*Documento registrado em `Z:\00_sagb\src\modules\nagi\plans\` conforme regra permanente de governança documental do módulo.*
