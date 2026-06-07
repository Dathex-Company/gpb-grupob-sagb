# SagB | NAGI | Mega-Plano de Refatoração Visual, UX e UI

**Status:** Revisão final para aprovação
**Benchmark:** TaskZei | **Padrão:** Alice UI Standard v1.0 (Nível 2)
**Path oficial do módulo:** `Z:\00_sagb\src\modules\nagi`
**Path de planos do módulo:** `Z:\00_sagb\src\modules\nagi\plans\`
**Data:** 2026-06-04 | **Autor:** Cássio Mendes

---

## Governança documental do módulo

Este plano segue a regra permanente do módulo NAGI:

> **Todos os planos, relatórios, auditorias, propostas e materiais estratégicos do NAGI devem ser registrados em:**
> `Z:\00_sagb\src\modules\nagi\plans\`

Isso inclui:
- Planos de refatoração como este
- Auditorias visuais e de UX
- Relatórios de implementação
- Propostas de evolução futura
- Documentos de benchmark comparativo

Qualquer material fora desse caminho deve ser movido para cá. Isso garante que o módulo tenha rastro documental completo e rastreável, servindo também de padrão para os demais módulos do SagB.

---

## Sumário

1. [Leitura Executiva do NAGI Atual](#1-leitura-executiva-do-nagi-atual)
2. [Leitura Executiva do TaskZei como Benchmark](#2-leitura-executiva-do-taskzei-como-benchmark)
3. [Diagnóstico Visual Comparativo NAGI × TaskZei](#3-diagnóstico-visual-comparativo)
4. [Diagnóstico de UX](#4-diagnóstico-de-ux)
5. [Diagnóstico de UI](#5-diagnóstico-de-ui)
6. [Diagnóstico de Linguagem](#6-diagnóstico-de-linguagem)
7. [Fase 0 — Mapa Atual, Superfície Impactada e Estratégia de Preservação](#7-fase-0--mapa-atual-superfície-impactada-e-estratégia-de-preservação)
8. [Plano de Refatoração por Fases](#8-plano-de-refatoração-por-fases)
9. [Decisão de Navegação: Opção A × Opção B](#9-decisão-de-navegação-opção-a--opção-b)
10. [Paleta e Identidade Visual do NAGI](#10-paleta-e-identidade-visual-do-nagi)
11. [Proposta de Nova Direção Visual](#11-proposta-de-nova-direção-visual)
12. [NAGI como Módulo Referência](#12-nagi-como-módulo-referência)
13. [Ordem Recomendada de Execução](#13-ordem-recomendada-de-execução)
14. [Fechamento Executivo](#14-fechamento-executivo)
15. [Reflexão Crítica](#15-reflexão-crítica)

---

## 1. Leitura Executiva do NAGI Atual

### Como ele está hoje

O NAGI é funcional e entrega o que promete: três abas (Documentos, Ideias em análise, Catálogo), pipeline de triagem, cards de catálogo e painel de detalhes com score, governança e handoff.

### Sensação que transmite

**Ferramenta interna robusta, mas ainda crua.** Parece um sistema que foi construído para funcionar primeiro e refinado depois. Há um contraste forte entre:

- a **lógica** que é madura (repository pattern, classificador heurístico, rule-based promotion, handoff tracking)
- a **cara** que é de protótipo funcional (cores hardcoded, cards sem respiro, modais básicos, sem estados de transição)

### Acertos do NAGI atual

| Acerto | Detalhe |
|--------|---------|
| Pipeline visual de 7 colunas | Dá visibilidade do estágio de maturidade de uma vez |
| Distinção Catálogo × Triagem × Documentos | Clara e operacionalmente correta |
| Métricas no header | Catálogo, Triagem, Docs, Revisão — números visíveis sem scroll |
| Abas internas | Navegação rápida entre as três frentes |
| Painel de detalhes rico | Score, evidências, histórico, handoff — tudo num lugar |
| Classificador heurístico | Funciona sem IA, dá sugestões úteis de imediato |
| Entrada em lote | Produtiva para zerar volume de documentos |
| Cards com radius 22px | Já alinhado ao Alice UI |

### Principais problemas

| Problema | Impacto |
|----------|---------|
| Cores hardcoded (slate, emerald, amber, cyan) sem tokens | Inconsistente com o sistema de tokens do SagB; qualquer mudança de tema exige rewrites |
| Navegação rasa — só abas, sem breadcrumbs | Usuário não tem noção de profundidade nem de onde está |
| Cards sem variantes de tamanho/hierarquia | Tudo parece ter o mesmo peso visual |
| Modais são overlays básicos sem animação | Sensação de sistema inacabado |
| Pipeline 7 colunas lado a lado | Muita informação simultânea, difícil escanear |
| Estados vazios e loading não tratados | Quando não há dados, fica um branco seco |
| Botões com labels técnicos ("Resetar", "Promover ao catálogo") | Distância do usuário não técnico |
| Sem identidade visual própria do módulo | NAGI não tem logo, badge, cor ou selo na interface |

---

## 2. Leitura Executiva do TaskZei como Benchmark

### Por que o TaskZei parece mais leve

O TaskZei emprega uma **estratégia de layout de módulo completo**: sidebar própria, header com breadcrumbs, área de conteúdo independente. Estratégia que faz sentido para 9 views, mas não necessariamente para 3.

### Características que transmitem maturidade

| Característica | Como aparece no TaskZei |
|----------------|-------------------------|
| **Sidebar com identidade** | Logo TZ com gradiente, nome "TaskZei", tagline "robust clean", workspace context |
| **Breadcrumbs** | "Operacional / Demandas / Demandas | Geral" — hierarquia clara |
| **Navegação com ícones SVG** | 9 views com SVG inline, hover state suave, active state com cor primária |
| **Header de página** | Título + contagem + badge de status do backend + botão de ação principal |
| **Tabela estilo ClickUp** | Colunas redimensionáveis, grid template, drag handle para redimensionar |
| **Estado vazio tratado** | Ícone, título explicativo, subtítulo, CTA — o vazio vira onboarding |
| **Uso de CSS variables** | `var(--sagb-*)` em todo lugar — consistência e preparado para tema escuro |
| **Densidade controlada** | Altura de linha 32px, fontes 11-13px, espaçamento justo |
| **Micro interações** | Hover com mudança de cor, feedback visual sutil |
| **Badges de provedor** | "ClickUp via Hub" / "Backend local" — transparência técnica |

### O que pode ser usado como referência (sem copiar)

1. **CSS variables** — prepara para tema escuro e consistência cross-module
2. **Breadcrumbs** — clareza de localização dentro do módulo
3. **Hierarquia visual com header duplo** — breadcrumb + título + ações
4. **Tabelas list com densidade controlada** — mais escaneável que cards soltos
5. **Estado vazio com propósito** — converte ausência em ação
6. **Badges informativos** — contexto do sistema sem poluir
7. **Identidade de módulo** — selo com gradiente + nome + tagline (no header, não na sidebar)

### O que o TaskZei não faz (e o NAGI deve manter)

- Pipeline visual de estágios (TaskZei não tem)
- Classificação heurística
- Regras de promoção triagem → catálogo
- Handoff tracking para especialistas
- Entrada governada de documentos em lote

---

## 3. Diagnóstico Visual Comparativo

### NAGI × TaskZei: comparação direta

| Aspecto | NAGI (hoje) | TaskZei | Impacto |
|---------|-------------|---------|---------|
| **Identidade** | Nenhuma — texto "NAGI" só no subtítulo | Logo TZ + gradiente + tagline + workspace | NAGI parece submódulo, não produto |
| **Cores** | Hardcoded `text-slate-950`, `bg-emerald-50` | `var(--sagb-text)`, `var(--sagb-primary)` | NAGI quebra com tema escuro |
| **Tipografia** | Classes Tailwind genéricas | CSS variables + Rubik consistente | NAGI sem coerência tipográfica |
| **Navegação** | Abas planas no topo | Sidebar + breadcrumbs | Abas são mais simples; breadcrumbs é o que falta |
| **Cards** | Radius 22px, padding 15px, borda sutil | Tabela com linhas de 32px | Cards NAGI são bons, mas tudo é card — falta variedade |
| **Pipeline** | 7 colunas lado a lado | Não tem pipeline | Pipeline é diferencial do NAGI, mas visualmente denso |
| **Modais** | Sombra + backdrop-blur, sem animação | Modal dedicado (TaskModal) | NAGI modais são OK mas sem refinamento |
| **Estado vazio** | Não tratado | Ícone + título + descrição + CTA | NAGI perde oportunidade de onboarding |
| **Hierarquia** | Header → Abas → Conteúdo | Sidebar → Breadcrumbs → Header → Conteúdo | TaskZei dá mais contexto de localização |
| **Densidade** | Moderada, espaçamento generoso | Justa, 32-40px de linha | NAGI pode apertar sem perder leveza |
| **Loading** | Não tratado | "Carregando tarefas..." + spinner | NAGI não comunica estados de carregamento |

### Onde o NAGI perde feio

1. **Zero identidade visual.** O módulo não tem selo, badge, logo, nem uma paleta própria. Ele aparece como uma página branca genérica.
2. **Cores fixas.** Se o SagB mudar o tema, o NAGI inteiro quebra. Cada `text-slate-950` é um ponto de falha.
3. **Sem breadcrumb.** Usuário não sabe se está em Documentos, Triagem ou Catálogo sem olhar a aba ativa.
4. **Estado vazio inexistente.** Quando não há documentos ou itens, a tela fica vazia e sem orientação.
5. **Pipeline denso demais.** 7 colunas simultâneas com cards internos criam uma parede visual que cansa.

### Onde o NAGI está visualmente melhor que o TaskZei

1. **Cards com radius generoso (22px).** Dá sensação mais moderna que a tabela densa do TaskZei.
2. **Métricas no header.** Números visíveis sem precisar scrollar — TaskZei não tem isso.
3. **Uso de chips e badges.** Tags coloridas para governance, tipo, destino — TaskZei é mais monocromático.
4. **Pipeline visual.** Apesar de denso, é informativo e único.

---

## 4. Diagnóstico de UX

### Clareza de navegação

**Hoje:** O usuário tem três abas (Documentos, Ideias em análise, Catálogo) e botões de ação no topo. Funciona, mas a troca de aba perde o scroll position e o contexto.

**Problema:** Cada aba tem conteúdo denso e independente. Ao trocar de aba, o usuário precisa reescanear a tela do zero.

### Sequência mental do usuário

**Fluxo esperado:**
1. Chego no NAGI
2. Vejo o que precisa de atenção (revisão, itens pendentes)
3. Tomo uma decisão (classificar, qualificar, aprovar, promover)
4. Vejo o resultado
5. Repito

**Hoje:** Esse fluxo existe, mas é interrompido por:
- Modais que escondem o contexto
- Falta de feedback visual depois da ação
- Sem indicador de carregamento nas ações

### Facilidade de leitura

| Problema | Detalhe |
|----------|---------|
| Pipeline 7 colunas | O olho precisa varrer horizontalmente para ler todos os estágios |
| Cards com muito texto | Título + resumo + tags + status — informação demais no card |
| Código de cores sem legenda | O que significa cada badge de governance? Precisa decorar |
| Score bar pequeno | A barra de progresso do score é sutil demais para ser notada |

### Carga cognitiva

O NAGI exige que o usuário entenda:
- 7 estágios de maturidade
- 6 status de governança
- 7 tipos de item
- 5 prioridades
- 5 status operacionais
- 4 status de promoção
- 5 status de handoff

Isso é **muita informação** para uma tela só. A UX atual entrega tudo de uma vez, sem progressão ou revelação contextual.

### Gargalos de uso

1. **Pipeline denso** — difícil escanear rápido
2. **Modais sem transição** — perda de contexto ao abrir/fechar
3. **Sem filtro preservado** — ao trocar de aba, filtros resetam
4. **Sem indicador de carregamento** — ações parecem instantâneas mas não dão feedback
5. **Botões sem hierarquia** — primário e secundário têm o mesmo peso visual

---

## 5. Diagnóstico de UI

### Tipografia

| Problema | Localização |
|----------|-------------|
| Tamanho inconsistente | `text-[31px]` no título, `text-[10px]` em labels, sem escala fixa |
| Peso exagerado | `font-extrabold` no título, `font-bold` em contagens — falta nuance |
| Altura de linha | `leading-6` em textos de 13px é espaçamento generoso demais |
| Sem tokens | Usa Tailwind classes fixas, não `var(--page-title)` do Alice UI |

### Densidade e espaçamento

| Componente | Atual | Problema |
|------------|-------|----------|
| Header | `py-6 px-6` | Padding vertical alto demais para um header interno |
| Cards de métrica | `px-4 py-3` | Bom, mas números de 24px poderiam ser maiores |
| Cards de catálogo | Grid 4 colunas + gap | Bom, mas padding de 15px é justo |
| Pipeline colunas | `gap-2` entre colunas | Colunas muito próximas visualmente |
| Modal | `p-6` | Espaçamento OK, mas sem variante compacta |

### Botões

| Botão | Atual | Problema |
|-------|-------|----------|
| "Resetar" | `bg-white text-slate-400` | Parece ação secundária, mas é destrutiva — deveria ser mais discreta |
| "+ Nova ideia" | `bg-slate-950 text-white` | OK, mas sem ícone SVG |
| "+ Do NIC" | `bg-blue-50 text-blue-700` | Azul destoa do esquema neutro do Alice UI |
| Ações do detalhe | Vários botões no mesmo tamanho | Sem hierarquia entre ação primária, secundária e destrutiva |

### Cards

Os cards do NAGI (radius 22px) são o **ponto mais forte** visualmente. Mas:
- Todos têm o mesmo tamanho e padding — sem variante de destaque
- Sem hover state — não reagem a mouseover
- Sem sombra — borda sutil é elegante, mas poderia ter `shadow-sm` em hover

---

## 6. Diagnóstico de Linguagem

### O que está bom

- "Documentos" — claro
- "Catálogo" — direto
- "Ideias em análise" — melhor que "Triagem / Ideias em Qualificação"
- "Entrada de documentos" — funcional
- "Ler e classificar" — ação clara
- "Prontos para salvar" — ótimo

### O que está técnico demais

| Atual | Problema | Sugestão |
|-------|----------|----------|
| "Promover ao catálogo" | Jargão de governança | "Mover para Catálogo" ou "Tornar oficial" |
| "Elegível para promoção" | Técnico | "Pronto para Catálogo" |
| "Handoff tracking" | Inglês técnico | "Acompanhamento" ou "Encaminhamento" |
| "Resetar" | Parece perigoso | "Recarregar base" ou "Restaurar" |
| "score.final" | Código vazando | "Nota final" ou "Avaliação" |
| "governanceStatus" | Código | "Status de governança" (já ajustado parcialmente) |
| "NicOutputPayload" | Código no formulário | "Importar do NIC" (já ajustado) |

### O que está frio demais

- "Documento recebido e lido pelo NAGI" — robótico
- "Campos revisados antes de salvar" — impessoal
- "Itens oficiais e reconhecidos do ecossistema — prontos, catalogados e vinculados a módulos especialistas" — pesado para um subtítulo

### O que precisa ficar mais leve

| Trecho atual | Versão mais leve |
|--------------|------------------|
| "Itens oficiais e reconhecidos do ecossistema" | "Itens oficiais do ecossistema" |
| "Ideias em análise, aguardando classificação, qualificação ou decisão" | "Ideias em análise — aguardando sua avaliação" |
| "Entrada governada: documentos entram como candidatos..." | "Documentos entram, o NAGI sugere, você revisa e decide" |

---

## 7. Fase 0 — Mapa Atual, Superfície Impactada e Estratégia de Preservação

### Objetivo

Antes de qualquer alteração visual, mapear exatamente o que existe hoje, o que será preservado, o que será alterado e o que exige mais cuidado. Esta fase não é executada como código — é um contrato de preservação para guiar toda a refatoração.

### Mapa de arquivos impactados

| Arquivo | Componentes | Função | Risco de refatoração |
|---------|-------------|--------|----------------------|
| [`NAGIView.tsx`](Z:/00_sagb/src/modules/nagi/components/NAGIView.tsx) | Header, métricas, abas, orquestração de seções | Hub principal do módulo | Alto — breadcrumbs + topbar adicionados |
| [`CatalogSection.tsx`](Z:/00_sagb/src/modules/nagi/components/CatalogSection.tsx) | Grid de cards de catálogo, métrica, ações | Exibição de itens oficiais | Médio — cards são refatorados, lógica preservada |
| [`TriageSection.tsx`](Z:/00_sagb/src/modules/nagi/components/TriageSection.tsx) | Pipeline 7 colunas, cards de triagem | Pipeline de maturidade de ideias | Alto — pipeline será reestruturado |
| [`NagiItemDetail.tsx`](Z:/00_sagb/src/modules/nagi/components/NagiItemDetail.tsx) | Modal de detalhe, score, evidências, histórico, handoff | Visualização e ações de governança | Alto — modal → slide-in panel |
| [`IngestionSection.tsx`](Z:/00_sagb/src/modules/nagi/components/IngestionSection.tsx) | Entrada, revisão, lote, painéis | Ingestão de documentos | Médio — ajustes de tokens e microcopy |
| [`NagiItemCard.tsx`](Z:/00_sagb/src/modules/nagi/components/NagiItemCard.tsx) | Card individual com score, badges, ações | Componente de card reutilizado | Alto — variantes de card + hover state |

### Pontos visuais atuais que serão substituídos

| Token atual (hardcoded) | Onde aparece | Será substituído por |
|-------------------------|--------------|----------------------|
| `text-slate-950` | Títulos, botões primários | `var(--nagi-text)` |
| `text-slate-500` | Texto secundário | `var(--nagi-muted)` |
| `text-slate-400` | Metadados, timestamps | `var(--nagi-muted)` |
| `bg-[#F8F6F4]` | Fundo da view | `var(--nagi-bg)` |
| `bg-white` | Cards, superfícies | `var(--nagi-surface)` |
| `border-[rgba(102,91,83,0.11)]` | Bordas de cards | `var(--nagi-line)` |
| `bg-emerald-50` / `text-emerald-700` | Badges de sucesso/catálogo | `var(--nagi-success)` + `var(--nagi-success-soft)` |
| `bg-amber-50` / `text-amber-700` | Badges de alerta/triagem | `var(--nagi-warning)` + `var(--nagi-warning-soft)` |
| `bg-rose-50` / `text-rose-700` | Badges de erro/duplicata | `var(--nagi-danger)` + `var(--nagi-danger-soft)` |
| `bg-cyan-50` / `text-cyan-700` | Badges de informação/docs | `var(--nagi-info)` + `var(--nagi-info-soft)` |

### Partes que devem ser PRESERVADAS (não mudar)

- **Lógica de negócio**: todos os services (nagiService, nagiIngestionService, nagiPromotionService, nagiHandoffService, nagiNicBridge)
- **Repositories**: INagiRepository, LocalStorageNagiRepository, INagiIngestionRepository
- **Domain types**: NagiItem, NagiIngestionDocument, enums — exceto renomeação de labels
- **Classificador heurístico**: nagiIngestionClassifier.ts — regras de classificação
- **Dados seed**: nagiBlueprint.ts — dados de exemplo
- **Pipeline de 7 estágios**: a lógica permanece, apenas a apresentação visual muda
- **Métricas no header**: preservar, mas com tokens
- **Cards com radius 22px**: manter como assinatura visual

### Partes que podem ser REDESENHADAS

- **NAGIView.tsx**: adicionar breadcrumbs e topbar (Opção B de navegação)
- **TriageSection.tsx**: pipeline colapsado em 3 zonas
- **NagiItemDetail.tsx**: modal → slide-in panel
- **NagiItemCard.tsx**: variantes de card + hover + sombra
- **CatalogSection.tsx**: visualização lista/tabela opcional
- **IngestionSection.tsx**: ajustes de tokens e microcopy

### Partes que exigem mais cuidado

| Parte | Risco | Cuidado necessário |
|-------|-------|--------------------|
| Pipeline 7 estágios → 3 zonas | Perder visão geral se colapsado | Manter toggle "Visão completa" |
| Modal → slide-in panel | Perder scroll position | Preservar estado ao abrir/fechar |
| CSS variables em badges semânticos | Badge verde virar cinza se token errado | Testar cada badge após substituição |
| Microcopy em labels de enum | Quebrar mapeamento de constantes | Alterar apenas labels de exibição, não valores internos |

### O que muda sem afetar a lógica de negócio

1. Cores hardcoded → CSS variables (apenas apresentação)
2. Layout de navegação (topbar + breadcrumbs) — não afeta services
3. Pipeline visual — não altera estágios, apenas apresentação
4. Modal → slide-in panel — mesmas actions, mesmo conteúdo
5. Variantes de card — dados continuam os mesmos
6. Microcopy — apenas texto de exibição
7. Estados vazios/loading — aditivo, não altera nada existente

---

## 8. Plano de Refatoração por Fases

### Fase 0 — Mapa Atual e Estratégia de Preservação

**Já documentada na seção 7 acima.** Serve como contrato de preservação para toda a execução.

### Fase 1 — Fundação Visual (tokenização e identidade)

**Objetivo:** Substituir cores hardcoded por CSS variables, criar identidade visual do NAGI.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 1.1 | Criar `nagi-tokens.css` com variáveis do módulo (paleta NAGI baseada no Alice UI) | Novo arquivo em `Z:\00_sagb\src\modules\nagi\styles\` |
| 1.2 | Substituir `text-slate-950` por `var(--nagi-text)` em todos os componentes | NAGIView, CatalogSection, TriageSection, NagiItemDetail, IngestionSection |
| 1.3 | Substituir `bg-[#F8F6F4]` por `var(--nagi-bg)` | NAGIView |
| 1.4 | Substituir `bg-white` por `var(--nagi-surface)` | Todos os componentes |
| 1.5 | Criar selo/badge NAGI com gradiente (teal, `#0E7C7B` → `#14A8A6`) para o header | NAGIView |
| 1.6 | Aplicar escala tipográfica do Alice UI (`--page-title`, `--screen-title`, `--module-title`) | NAGIView, CatalogSection, TriageSection |
| 1.7 | Garantir fonte Rubik via CSS global do módulo | Import no módulo |

### Fase 2 — Topbar + Breadcrumbs (navegação final - Opção B)

**Objetivo:** Melhorar a navegação do módulo com topbar, breadcrumbs e badges de contagem nas abas, sem criar sidebar ou layout lateral.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 2.1 | Adicionar breadcrumbs no topo do conteúdo: "NAGI / [Aba atual]" | NAGIView |
| 2.2 | Badge NAGI com gradiente teal + nome "NAGI" + tagline "governança de ideias" na topbar | NAGIView |
| 2.3 | Abas internas com badges de contagem e hover state | NAGIView |
| 2.4 | Botão de ação principal alinhado às abas | NAGIView |

### Fase 3 — Refatoração do Pipeline de Triagem

**Objetivo:** Reduzir a carga cognitiva do pipeline de 7 colunas sem perder a informação.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 3.1 | Agrupar 7 estágios em 3 zonas visuais: "Entrada", "Análise", "Decisão" | TriageSection |
| 3.2 | Cada zona com coluna expansível — mostra cards internos ao clicar | TriageSection |
| 3.3 | Badge de contagem por zona (ex: "3 em análise") | TriageSection |
| 3.4 | Cards de triagem mais compactos — remover resumo, manter título + badges | TriageSection |
| 3.5 | Indicador de elegibilidade mantido com tooltip explicativo | TriageSection |
| 3.6 | Toggle "Visão completa" / "Visão por zona" | TriageSection |
| 3.7 | Scroll horizontal suave com snap points | TriageSection |

### Fase 4 — Refatoração de Cards e Listas

**Objetivo:** Dar variedade e hierarquia aos cards, preparar variantes de visualização.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 4.1 | Três variantes de card: `card-compact` (triage), `card-default` (catálogo), `card-highlight` (destaque) | CatalogSection, TriageSection, NagiItemCard |
| 4.2 | Hover state com `shadow-sm` e `translateY(-1px)` | Todos os cards |
| 4.3 | Opção de visualização lista/tabela para Catálogo | CatalogSection |
| 4.4 | Grid responsivo: 4 colunas → 3 → 2 → 1 | CatalogSection |
| 4.5 | Cards de métrica no header com gradiente sutil | NAGIView |

### Fase 5 — Refatoração de Detalhe e Ações

**Objetivo:** Melhorar a experiência de detalhamento e ação sem perder contexto.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 5.1 | Substituir modal overlay por **slide-in panel** (lateral direita) | NagiItemDetail |
| 5.2 | Animação: `transform: translateX(0)` com `transition: 0.25s` | NagiItemDetail |
| 5.3 | Manter scroll position ao abrir/fechar detalhe | NagiItemDetail |
| 5.4 | Score bars com gradiente (Alice Gradient System) e tooltip de breakdown | NagiItemDetail |
| 5.5 | Histórico de decisão em timeline vertical com dots SVG | NagiItemDetail |
| 5.6 | Botões com hierarquia: primário (preenchido), secundário (borda), terciário (texto) | NagiItemDetail, NAGIView |
| 5.7 | Formulários inline no slide-panel, não em modal separada | NagiItemDetail |

### Fase 6 — Estados Visuais

**Objetivo:** Tratar todos os estados da interface — vazio, carregando, erro, sucesso.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 6.1 | Estado vazio para Documentos: ilustração SVG + "Nenhum documento ainda" + CTA | IngestionSection |
| 6.2 | Estado vazio para Triagem: "Nenhuma ideia em análise" + sugestão de criar | TriageSection |
| 6.3 | Estado vazio para Catálogo: "Nada no catálogo ainda" + sugestão de promover | CatalogSection |
| 6.4 | Loading skeleton com pulse animation para cards e listas | Todos os componentes |
| 6.5 | Toast de feedback após ações: "Item promovido", "Documento salvo" | NAGIView |
| 6.6 | Indicador de refresh: animação sutil no botão | NAGIView |

### Fase 7 — Microcopy e Linguagem

**Objetivo:** Revisar todos os textos da interface para linguagem mais leve, clara e amigável.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 7.1 | Revisar labels de botões (ver diagnóstico de linguagem) | NAGIView, IngestionSection, NagiItemDetail |
| 7.2 | Revisar textos de ajuda e subtítulos | NAGIView |
| 7.3 | Revisar placeholders de input | IngestionSection, NagiItemDetail |
| 7.4 | Revisar labels de status nos componentes de exibição | types.ts (constantes) + componentes |

### Fase 8 — Filtros e Busca

**Objetivo:** Criar sistema de filtros consistente entre abas, com busca global.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 8.1 | Barra de busca global no header do módulo | NAGIView |
| 8.2 | Filtros por tipo, status, governança, prioridade | CatalogSection, TriageSection, IngestionSection |
| 8.3 | Preservar filtros ao trocar de aba | NAGIView (state lifting) |
| 8.4 | Badge de "filtro ativo" + "Limpar filtros" | CatalogSection, TriageSection |

### Fase 9 — Responsividade

**Objetivo:** Adaptar o layout para telas menores sem perder funcionalidade.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 9.1 | Abas scrolláveis horizontalmente em telas estreitas | NAGIView |
| 9.2 | Pipeline de triagem vira scroll horizontal com snap | TriageSection |
| 9.3 | Grid de catálogo: 4 → 2 → 1 coluna | CatalogSection |
| 9.4 | Fonte ajustada para mobile (Operação Leveza Mobile) | Todos |

### Fase 10 — Modo Escuro

**Objetivo:** Implementar `body[data-mode="dark"]` completo para o módulo.

| Item | O que fazer | Arquivos afetados |
|------|-------------|-------------------|
| 10.1 | Definir tokens dark no `nagi-tokens.css` | nagi-tokens.css |
| 10.2 | Ajustar contraste de cores para dark mode | Todos os componentes |
| 10.3 | Testar todos os componentes em ambos os modos | Todos |

---

## 9. Decisão de Navegação: Opção A × Opção B

### Contexto da decisão

O plano anterior propunha sidebar como direção forte, inspirado no TaskZei. No entanto, o NAGI tem apenas 3 frentes principais (Documentos, Triagem, Catálogo) contra 9 do TaskZei. Sidebar pode ser over-engineering para 3 itens. Esta seção apresenta as duas opções comparativas e justifica a escolha pela Opção B.

---

### Opção A — Sidebar + Breadcrumbs (hipótese, não recomendada)

**Estrutura:**
```
┌──────── Sidebar 240px ────────┐  ┌── Breadcrumbs ───────┐
│ [NZ] NAGI                     │  │ NAGI / Documentos     │
│ governança de ideias          │  └───────────────────────┘
│                               │
│ [Documentos]     (12)         │  ─── Conteúdo ───
│ [Ideias em análise]  (8)      │
│ [Catálogo]          (15)      │
│                               │
│ ┌── Workspace ────────────┐   │
│ │ Demanda Geral           │   │
│ │ Ecossistema SagB        │   │
│ └─────────────────────────┘   │
│                               │
│ ← Voltar ao SagB              │
└───────────────────────────────┘
```

**Vantagens:**
- Identidade de módulo forte (logo, tagline, workspace)
- Hierarquia clara com breadcrumbs
- Espaço para métricas, workspace context e ações na sidebar
- Alinhado com o padrão que o TaskZei estabeleceu
- Preparado para futuras sub-páginas (Governança, Estatísticas, Configurações)

**Desvantagens:**
- Over-engineering para apenas 3 itens de navegação
- Consome 240px horizontal que poderiam ser usados pelo conteúdo
- Sidebar com 3 itens pode parecer "espaço sobrando"
- Exige criação de `NAGILayout.tsx` — nova camada de componente
- Impacto maior em telas pequenas (1366px)

**Impacto em UX:**
- Ganho: sensação de produto, localização clara, identidade
- Perda: espaço horizontal, simplicidade de abas

**Impacto visual:**
- Ganho: módulo com personalidade, workspace context, breadcrumbs
- Perda: conteúdo mais estreito

**Impacto estrutural:**
- Cria `NAGILayout.tsx` (novo componente)
- Move navegação do `NAGIView.tsx` para o layout
- `NAGIView.tsx` vira apenas o conteúdo da área principal
- Breadcrumbs exigem estado de navegação compartilhado

---

### Opção B — Topbar + Abas + Breadcrumbs (recomendada)

**Estrutura:**
```
┌── Topbar ──────────────────────────────────────────────┐
│ [NZ] NAGI  |  governança de ideias                     │
├────────────────────────────────────────────────────────┤
│ NAGI  /  Documentos                                    │
├────────────────────────────────────────────────────────┤
│ [Documentos 12]  [Ideias em análise 8]  [Catálogo 15]  │
│                                                   [+Novo]│
├────────────────────────────────────────────────────────┤
│                                                        │
│ ─── Conteúdo da aba ───                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Vantagens:**
- Mais simples: não exige layout novo, apenas melhora os existentes
- Preserva 100% do espaço horizontal para conteúdo
- Navegação direta: 3 cliques, zero atrito
- Mais fácil de manter: menos componentes, menos estados
- Alinhado com o que o NAGI já tem (evolução, não revolução)
- Funciona bem em telas menores sem colapso

**Desvantagens:**
- Não dá identidade de módulo tão forte quanto a sidebar
- Sem workspace context visível
- Sem espaço para métricas persistentes na navegação
- Pode parecer "sistema de abas" em vez de "produto modular"
- Menos preparado para expansão futura (sub-páginas)

**Impacto em UX:**
- Ganho: simplicidade, velocidade de navegação, espaço para conteúdo
- Perda: sensação de produto modular, workspace context, identidade visual forte

**Impacto visual:**
- Ganho: layout mais limpo, mais espaço, menos componentes na tela
- Perda: menos personalidade visual

**Impacto estrutural:**
- Não cria novos componentes de layout
- Melhora `NAGIView.tsx` com breadcrumbs e topbar
- Breadcrumbs adicionados como componente inline
- Abas internas ganham badges de contagem e hover state

---

### Comparação direta

| Critério | Opção A — Sidebar | Opção B — Topbar |
|----------|-------------------|------------------|
| Identidade de módulo | Forte | Moderada |
| Simplicidade de implementação | Média (novo layout) | Alta (melhora existente) |
| Espaço para conteúdo | Perde 240px | 100% disponível |
| Navegação rápida | Sempre visível | Abas no topo |
| Breadcrumbs | Naturais | Possíveis |
| Workspace context | Incluso | Não incluso |
| Preparação para crescimento | 9+ views cabem | 3-5 views no máximo |
| Responsividade | Precisa colapsar | Mais adaptável |
| Manutenibilidade | Mais complexa | Mais simples |
| Consistência com TaskZei | Mesmo padrão | Diferente |

---

### Recomendação final

**Opção B — Topbar + Abas + Breadcrumbs.**

Motivos:

1. **O NAGI tem apenas 3 frentes.** Sidebar para 3 itens é desproporcional. O TaskZei justifica sidebar porque tem 9 views. O NAGI não precisa.

2. **Preserva o que já funciona.** As abas atuais são funcionais e os usuários já conhecem o fluxo. Melhorar as abas (com breadcrumbs, badges, hover) dá ganho sem causar estranheza.

3. **Menos risco, mais velocidade.** Não criar `NAGILayout.tsx` reduz o escopo da refatoração em aproximadamente 20%. A Fase 2 pode ser executada em menos tempo e com menos pontos de falha.

4. **Foco no que realmente importa.** O ganho real não está na navegação — está no pipeline refatorado, nos estados tratados, no slide-in panel. A energia deve ir para lá.

5. **Breadcrumbs + topbar resolvem o problema de contexto.** O problema atual não é "não ter sidebar", é "não saber onde está". Breadcrumbs resolvem isso sem o custo de uma sidebar.

**Se no futuro o NAGI crescer** (ex: Governança virar view separada, Estatísticas, Configurações), aí sim vale reavaliar sidebar. Mas para o estado atual, topbar + breadcrumbs é a escolha certa.

---

## 10. Paleta e Identidade Visual do NAGI

### Natureza desta proposta

> **Esta seção descreve a proposta de direção visual do NAGI para esta refatoração.**
> Ela é uma direção validável — será testada e ajustada durante a execução da Fase 1.
> Não é uma nova paleta paralela do ecossistema. A base permanece herdada do Alice UI Standard / GrupoB UI Standard.
> As cores semânticas continuam sendo estritamente semânticas (success, warning, danger, info, neutral).
> A única cor de marca adicionada é `--nagi-brand` (teal), e mesmo ela está dentro do espectro cromático já presente no ecossistema.

### Paleta oficial base (herdada do ecossistema)

| Token | Valor | Origem | Uso no NAGI |
|-------|-------|--------|-------------|
| `--nagi-bg` | `#F8F6F4` | Alice UI `--bg` | Fundo da view |
| `--nagi-surface` | `#FFFFFF` | Alice UI `--surface` | Cards, painéis, superfícies |
| `--nagi-surface-soft` | `#FCFBFA` | Alice UI `--surface-soft` | Hover states, seções secundárias |
| `--nagi-line` | `rgba(102,91,83,0.11)` | Alice UI `--line` | Bordas de cards, separadores |
| `--nagi-text` | `#1E1B1A` | Alice UI `--text` | Títulos e texto principal |
| `--nagi-muted` | `#8A7F78` | Alice UI `--muted` | Metadados, timestamps, subtítulos |
| `--nagi-primary` | `#555555` | GrupoB `--primary` | Ações primárias, badges |
| `--nagi-primary-soft` | `#EEEEEE` | GrupoB `--primary-soft` | Hover de primary, backgrounds |

### Cor de marca / identidade do NAGI

A única adição de identidade visual do módulo:

| Token | Valor | Função |
|-------|-------|--------|
| `--nagi-brand` | `#0E7C7B` | Verde-azulado escuro — cor de assinatura do módulo |
| `--nagi-brand-soft` | `#E8F5F5` | Versão suave para backgrounds de badge |

**Por que verde-azulado (teal) e não cyan?**
- Cyan (`#0891B2`) é muito próximo do azil de informação, podendo confundir com badges semânticos
- Teal (verde-azulado) é distinto de verde (success), azul (info) e âmbar (warning)
- Transmite **governança, confiança, estabilidade** — alinhado ao papel do NAGI

**Gradiente do badge NAGI:**
```
background: linear-gradient(135deg, #0E7C7B, #14A8A6)
```
Verde-azulado escuro → verde-azulado claro. Sóbrio, profissional.

### Cores semânticas de status (apenas estas — não criar mais)

| Token | Valor | Badge soft correspondente | Uso |
|-------|-------|--------------------------|-----|
| `--nagi-success` | `#059669` | `bg-[#ECFDF5]` | Catálogo, aprovado, promovido, sucesso |
| `--nagi-warning` | `#D97706` | `bg-[#FFFBEB]` | Triagem, alerta, precisa de atenção |
| `--nagi-danger` | `#DC2626` | `bg-[#FEF2F2]` | Erro, duplicata, descartado, rejeitado |
| `--nagi-info` | `#0E7C7B` | `bg-[#E8F5F5]` | Informação, docs — alinhado ao brand |
| `--nagi-neutral` | `#555555` | `bg-[#F5F5F5]` | Status neutro, pendente, não classificado |

### Como isso respeita o Alice UI sem criar paleta paralela

1. **Tokens base são herdados** do Alice UI (`--bg`, `--surface`, `--line`, `--text`, `--muted`)
2. **Tokens de status** seguem o padrão de cores semânticas do ecossistema (success = verde, warning = âmbar, danger = vermelho)
3. **Apenas uma cor de marca** (`--nagi-brand` = teal) é adicionada — variação do espectro verde-azulado já presente no ecossistema
4. **Nenhuma cor solta.** Toda cor usada no módulo passa por um token `var(--nagi-*)`

---

## 11. Proposta de Nova Direção Visual

### Sensação geral

O NAGI refatorado deve transmitir:

> **"Centro de comando de ideias — robusto, claro e confiável."**

Não deve ser leve como uma landing page. Deve ser organizado como um cockpit: denso quando precisa ser, claro quando o usuário precisa decidir.

### Nível de leveza

- **7/10** na escala Alice UI (TaskZei está em 6/10 — mais denso)
- Cards com `border-radius: 22px` (mantido, é diferencial)
- Espaçamento generoso vertical, densidade controlada horizontal
- Fonte: Rubik (Alice UI)
- Paleta: neutro + teal (brand) + semânticas (success, warning, danger, info)

### Como os cards devem parecer

```
┌────────────────────────────────┐
│ ████████░░  85%  ★ Catálogo   │
│                                │
│ Nome do Item                   │
│ Resumo curto...                │
│                                │
│ [Empresa] [Memória Op.]        │
│ há 2 dias                      │
└────────────────────────────────┘
```

- Três variantes de altura: compacta (triage, 48px), padrão (catálogo, aproximadamente 120px), destaque (180px)
- Hover: `shadow-sm` + `translateY(-1px)`
- Score como barra de progresso com gradiente (teal → success)
- Badge de tipo no canto superior esquerdo
- Badge de destino (Catálogo/Triagem) no canto superior direito

### Como os filtros devem parecer

```
[Buscar... (ícone lupa)]  [Tipo ▼]  [Status ▼]  [Governança ▼]
                                                      [Limpar filtros]
```

- Altura de 32px
- Input de busca com ícone de lupa SVG à esquerda
- Dropdowns com padding justo
- Badge "1 filtro ativo" ao lado de "Limpar filtros"
- Ícones SVG inline (Heroicons ou similar)

### Como o detalhe deve parecer (slide-in panel)

```
┌──────────────────────┐
│ Voltar (seta)    Fechar (X)    │
│                                │
│ Nome do Item                   │
│ badge tipo    badge status     │
│                                │
│ ─── Score ─────────────────   │
│ ████████░░  85/100             │
│                                │
│ ─── Info ───────────────────  │
│ Categoria:                     │
│ Tags:                          │
│ Responsável:                   │
│                                │
│ ─── Ações ──────────────────  │
│ [Classificar]                  │
│ [Qualificar]                   │
│ [Aprovar]                      │
│                                │
│ ─── Timeline ───────────────  │
│ (dot) 02/06  Classificado      │
│ (dot) 01/06  Recebido          │
│ (dot) 30/05  Criado            │
└──────────────────────┘
```

- Largura: `min(420px, 50vw)`
- Animação: slide da direita com `transform: translateX` + `transition: 0.25s`
- Timeline vertical com dots SVG e linhas conectoras

### Como a topbar + abas + breadcrumbs devem parecer

```
┌── Topbar ──────────────────────────────────────────────────┐
│ (badge NZ)  NAGI  |  governança de ideias                  │
├────────────────────────────────────────────────────────────┤
│ NAGI  /  Documentos                                        │
├────────────────────────────────────────────────────────────┤
│ [Documentos 12]  [Ideias em análise 8]  [Catálogo 15]     │
│                                                     [+Novo]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ─── Conteúdo da aba ───                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- Badge NAGI com gradiente `linear-gradient(135deg, #0E7C7B, #14A8A6)`, iniciais "NZ" em branco
- Subtítulo "governança de ideias" em muted
- Breadcrumbs com separador "/" em muted
- Abas com badges de contagem e hover state
- Botão de ação principal com ícone SVG `+` à esquerda

### Como o módulo conversa com o Alice UI Standard

| Token Alice UI | Aplicação no NAGI |
|----------------|-------------------|
| `--page-title: 31px 850` | Título da página NAGI |
| `--screen-title: 23px 800` | Título de seção (Documentos, Catálogo) |
| `--module-title: 20px 720` | Título de card expandido |
| `--body: 12px 400` | Texto de cards, listas |
| `--muted: 11px 400` | Metadados, timestamps |
| `--surface: #FFFFFF` | Cards, painéis, superfícies |
| `--bg: #F8F6F4` | Fundo da view |
| `--line: rgba(102,91,83,.11)` | Bordas |
| `--primary: #555555` | Ações primárias, badges |
| Rubik | Fonte única em todo o módulo |

### Ícones

**Regra:** todos os ícones devem ser SVG inline (Heroicons Outline ou similar). Nada de emoji como ícone de navegação.

- Navegação (abas): ícones de documento, lâmpada/ideia, livro/catálogo
- Ações: mais (+), seta de volta (←), fechar (X), lupa (busca)
- Badges: estrela (elegível), bandeira (prioridade), check (concluído)
- Score: gráfico de barras, alvo
- Timeline: círculo preenchido com linha vertical

---

## 12. NAGI como Módulo Referência

### Pode virar referência?

**Sim.** O NAGI tem potencial para ser o módulo mais bem organizado do SagB porque:
1. A lógica é a mais madura (repository, services, classifiers, rules)
2. O domínio é complexo o suficiente para testar os limites do Alice UI
3. Tem três frentes (documentos, triagem, catálogo) que representam padrões recorrentes

### Padrões reaproveitáveis do NAGI para outros módulos

| Padrão NAGI | Pode ser reaproveitado por | O que copiar |
|-------------|---------------------------|--------------|
| **Card system** (3 variantes) | Qualquer módulo com cards | Estrutura CSS com tokens `--card-compact`, `--card-default`, `--card-highlight` |
| **Slide-in panel** | Detalhes de item em qualquer módulo | Componente `SlidePanel` com animação, backdrop, transição |
| **Pipeline visual** | NICO (workflow), Aprovações, Processos | Componente `StagePipeline` com estágios configuráveis |
| **Heuristic classifier** | Qualquer módulo que precise classificar texto | Serviço `HeuristicClassifier` com regras configuráveis |
| **Filtros com preservação de estado** | Módulos com múltiplas abas/views | Hook `usePersistedFilters` |
| **Estado vazio com onboarding** | Qualquer módulo com listas vazias | Componente `EmptyState` com props de ícone, título, descrição, CTA |
| **Tokens CSS de módulo** | Todos os módulos | Arquivo `{modulo}-tokens.css` seguindo o padrão `var(--{modulo}-*)` |
| **Breadcrumbs** | Módulos com profundidade maior que 1 | Componente `Breadcrumbs` com trail array |

### O que do NAGI pode virar padrão visual

1. **Variantes de card com tokens.** Se o NAGI estabelecer `card-compact`, `card-default`, `card-highlight` com tokens CSS, qualquer módulo pode usar a mesma estrutura sem recriar.

2. **Score bar com gradiente.** O componente de barra de progresso com breakdown tooltip é reutilizável em dashboards, avaliações e métricas.

3. **Timeline de decisão.** O histórico de governança com dots e linhas conectoras pode ser usado em approvals, workflows e auditorias.

### O que do NAGI pode virar padrão de UX

1. **Pipeline de estágios com colapso.** A UX de "visão geral → foco em zona → ação" é um padrão forte para qualquer workflow.

2. **Slide-in panel vs modal.** A decisão de usar slide-in para detalhes e modal para formulários define quando cada padrão deve ser usado.

3. **Estado vazio com onboarding progressivo.** Em vez de "Nenhum item", guiar o usuário para a primeira ação.

### O que do NAGI pode virar padrão estrutural

1. **Organização de módulo:**
```
src/modules/{modulo}/
  domain/types.ts          → tipos e enums
  repository/              → persistência (interface + localStorage)
  services/                → lógica de negócio
  components/              → UI (view, seções, cards, detalhes)
  styles/                  → tokens CSS do módulo
  plans/                   → documentação, planos, auditorias
  changelog.md             → histórico de versões
  module-doc.ts            → documentação viva do módulo
```

2. **Separação view / section / componente.** A view orquestra, as sections contêm a UI, os componentes são atômicos.

### O que NÃO deve ser copiado do NAGI para outros módulos

1. **Complexidade de tipos.** O `NagiItem` tem aproximadamente 20 campos. Módulos mais simples não precisam copiar essa complexidade.
2. **Pipeline de 7 estágios.** É específico do NAGI. Módulos com menos estágios não devem criar pipeline de 7 colunas só porque "o NAGI tem".
3. **Regras de promoção.** A lógica de promoção triagem → catálogo é específica do domínio do NAGI.
4. **Handoff tracking.** O handoff faz sentido no NAGI porque ele encaminha para especialistas. Módulos internos não precisam.

---

## 13. Ordem Recomendada de Execução

### Critério de priorização

1. **Impacto visual imediato** — o que o usuário vê na primeira tela
2. **Base técnica** — o que precisa existir para o resto funcionar
3. **Risco baixo** — o que não quebra funcionalidade existente
4. **Retorno rápido** — o que dá mais resultado com menos esforço

### Ordem

| Prioridade | Fase | O que faz | Motivo |
|------------|------|-----------|--------|
| **P1** | **Fase 0** | Mapa atual, contrato de preservação | Já documentado. Revisar antes de começar |
| **P1** | **Fase 1** | Tokens CSS + identidade visual | Base para tudo; sem isso, refatoração visual é superficial |
| **P1** | **Fase 6** | Estados visuais (vazio, loading, toast) | Impacto imediato: estados vazios e loading são o que mais pecam hoje |
| **P2** | **Fase 3** | Pipeline refatorado (3 zonas) | Principal diferencial do NAGI precisa ficar bom |
| **P2** | **Fase 2** | Navegacao (Opção B — topbar + breadcrumbs) | Melhora contexto sem over-engineering |
| **P3** | **Fase 5** | Slide-in panel | Substitui modal, melhora fluxo de detalhe |
| **P3** | **Fase 4** | Variantes de card | Refinamento visual |
| **P4** | **Fase 7** | Microcopy | Rapido e de alto impacto |
| **P4** | **Fase 8** | Filtros unificados | UX avancada |
| **P5** | **Fase 9** | Responsividade | Essencial mas nao urgente para desktop |
| **P5** | **Fase 10** | Modo escuro | Diferencial, nao urgente |

### O que NÃO fazer agora

- Não recriar a lógica de negócio (services, repository, classifier)
- Não trocar localStorage por Supabase (é outra etapa)
- Não adicionar IA ao classificador
- Não criar lib `@sagb/ui` ainda (pode absorver os componentes no módulo e extrair depois)
- Não refatorar o TaskZei junto

---

## 14. Fechamento Executivo

### O que fica mantido

| Item | Decisão |
|------|---------|
| Pipeline visual de estágios | Mantido, mas refatorado (3 zonas + toggle) |
| Métricas no header | Mantidas, com tokens |
| Cards com radius 22px | Mantidos como assinatura visual |
| Classificador heurístico | Mantido sem alteração |
| Regras de promoção | Mantidas sem alteração |
| Handoff tracking | Mantido sem alteração |
| Entrada governada de documentos | Mantida, com microcopy revisado |
| Estrutura de abas (Documentos, Triagem, Catálogo) | Mantida como navegação principal |

### O que muda

| Item | Mudança |
|------|---------|
| Cores | Hardcoded → CSS variables (`var(--nagi-*)`) |
| Navegacao | Abas simples → Topbar + breadcrumbs + badges de contagem |
| Pipeline | 7 colunas → 3 zonas expansíveis + toggle visão completa |
| Cards | Tamanho único → 3 variantes (compact, default, highlight) |
| Detalhe | Modal overlay → Slide-in panel (420px) com animação |
| Estados | Não tratados → Vazio, loading, erro, toast |
| Filtros | Inexistentes → Busca global + filtros preservados |
| Microcopy | Técnico → Mais leve, claro e funcional |
| Paleta | Cores soltas → Tokens base Alice UI + brand teal + semânticas |

### O que depende de aprovação

| Item | Depende de aprovação? |
|------|-----------------------|
| Paleta (teal como brand) | Sim |
| Opção B (topbar + abas) como navegação | Sim |
| Pipeline 3 zonas (vs 7 colunas) | Sim |
| Slide-in panel (vs modal) | Sim |
| Ordem de execução (P1 a P5) | Sim |
| Todas as fases (1 a 10) | Sim, como parte do plano |

### O que é hipótese

| Item | Hipótese | Como validar |
|------|----------|--------------|
| Sidebar seria over-engineering | Se o NAGI crescer para 5+ views, reavaliar | Monitorar após refatoração |
| Teal como brand funciona com o ecossistema | Testar visualmente com o Alice UI | Protótipo rápido depois da Fase 1 |
| Pipeline em 3 zonas não esconde informação | Usuário pode alternar para visão completa | Toggle incluído na implementação |

### Recomendação como melhor caminho

1. Aprovar este plano como guia da refatoração
2. Iniciar pela Fase 1 (tokens) + Fase 6 (estados) — base técnica + impacto imediato
3. Seguir para Fase 3 (pipeline) + Fase 2 (navegação Opção B) — transformação real
4. Finalizar com Fases 5, 4, 7, 8 — refinamento
5. Deixar Fases 9 e 10 para depois — diferenciais

### Ordem ideal de execução (após aprovação)

```
Fase 1 (tokens) → Fase 6 (estados)
    → Fase 3 (pipeline) → Fase 2 (navegação)
        → Fase 5 (slide-in) → Fase 4 (cards)
            → Fase 7 (microcopy) → Fase 8 (filtros)
                → Fase 9 (responsivo) → Fase 10 (dark)
```

---

## 15. Reflexão Crítica

### Riscos

1. **Pipeline colapsado pode esconder informação.** Se o toggle "Visão completa" não for implementado, o usuário perde a visão geral dos 7 estágios. **Mitigação:** toggle incluso na Fase 3.

2. **Slide-in panel em tela pequena.** 420px fixo não cabe em 1366px. **Mitigação:** usar `min(420px, 50vw)`.

3. **Teal como brand pode não agradar.** Cor é subjetiva. **Mitigação:** validar na aprovação; se necessário, ajustar para outro tom do espectro verde-azulado.

4. **Tokenização pode quebrar badges semânticos.** Se `--nagi-success` for mapeado errado, badges verdes viram cinza. **Mitigação:** testar cada badge após a substituição.

5. **Refatoração puramente visual sem revisão de UX.** Se a interface ficar mais bonita mas igualmente confusa, o usuário não ganha nada. **Mitigação:** Fase 3 (pipeline) e Fase 5 (slide-in) são de UX tanto quanto de UI.

### O que pode dar errado se mal conduzido

1. **Código fica mais difícil de manter.** Se a refatoração criar muitos arquivos sem clareza, o ganho visual não compensa a perda de legibilidade.
2. **Performance piora.** Se cards usarem `box-shadow` em hover, o navegador pode reflow. Preferir `transform` para animações.
3. **Funcionalidade quebra.** Se CSS variables mudarem cores de badges semânticos, o significado visual se perde.
4. **Usuário rejeita a mudança.** Se a interface ficar muito diferente, pode causar estranheza. Especialmente o pipeline — manter toggle "Visão completa" como transição.

### O que não pode ser perdido

- Pipeline visual (reorganizado, não removido)
- Métricas no header
- Cards com radius 22px
- Lógica de negócio (classificador, promoção, handoff, evidência)
- Entrada em lote

### O que vale ajustar agora (sem esperar aprovação)

- Revisar microcopy (Fase 7) é texto puro, sem risco de quebra
- Tratar estados vazios (Fase 6, itens 6.1-6.3) é aditivo, não altera nada existente

### O que pode esperar

- Responsividade (Fase 9) e Modo escuro (Fase 10)
- Sidebar (Opção A) — reavaliar se o NAGI crescer para 5+ views
- Lib `@sagb/ui` — extrair depois que o padrão estiver consolidado

---

## Checklist de aprovação

| Item | Status |
|------|--------|
| Path corrigido para `Z:\00_sagb\src\modules\nagi\plans\` | Ok |
| Regra de governança documental inserida | Ok |
| Sidebar tratada como hipótese com comparação A × B | Ok |
| Recomendação: Opção B (topbar + abas + breadcrumbs) | Ok |
| Emoji removido — todos os ícones descritos como SVG | Ok |
| Paleta definida: herança Alice UI + brand teal + semânticas | Ok |
| Fase 0 criada com mapa de superfície impactada | Ok |
| Caráter de módulo referência detalhado com padrões reaproveitáveis | Ok |
| Fechamento executivo direto, sem redundância | Ok |
| Navegação coerente do início ao fim | Ok |
| Seção de paleta com linguagem precisa (proposta validável, não paleta paralela) | Ok |

---

### Pronto para aprovação final?

**Sim.** O plano está 100% coerente:

- **Navegação:** Opção B (topbar + abas + breadcrumbs) é a recomendação e está consistente do começo ao fim — sem resquícios de sidebar como direção principal.
- **Paleta:** descrita como proposta validável, não como paleta paralela. Herança do Alice UI + uma cor de marca (teal) + semânticas.
- **Emoji:** removido de todos os mocks e exemplos. Substituído por descrição textual ou referência a SVG inline.
- **Fase 0:** mapeia exatamente o que será preservado vs alterado, com riscos por componente.
- **Fechamento:** direto, sem redundância entre seção 14 e parágrafos finais.
- **Path:** governança documental fixada em `Z:\00_sagb\src\modules\nagi\plans\`.

O plano completo está em:
[`Z:\00_sagb\src\modules\nagi\plans\NAGI-REFATORACAO-VISUAL-UX-UI-MEGAPLANO.md`](Z:/00_sagb/src/modules/nagi/plans/NAGI-REFATORACAO-VISUAL-UX-UI-MEGAPLANO.md)
