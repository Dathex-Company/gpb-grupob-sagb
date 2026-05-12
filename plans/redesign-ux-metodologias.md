# Redesign Radical de UX/UI — Módulo Metodologias

## Diagnóstico: 12 Problemas Críticos

### 🔴 1. Tirania do tamanho de fonte
Virtualmente **todo texto** usa `text-[10px]`, `text-[11px]` ou `text-[12px]`. A interface inteira grita "dashboard de dados", não "ferramenta humana". O usuário precisa forçar a vista para ler qualquer coisa.

### 🔴 2. Gritaria tipográfica
`font-black uppercase tracking-[0.16em]` em **todo label** da aplicação. É como se cada frase estivesse sendo gritada. Não há hierarquia — tudo tem o mesmo peso visual, logo nada se destaca.

### 🔴 3. Explosão cromática
Cada cartão, badge e seção tem uma cor semântica diferente: **verde-esmeralda, âmbar, rosa, índigo, ciano, violeta, azul SagB**. Sete cores competindo simultaneamente. O resultado não é hierarquia — é **poluição visual**.

### 🔴 4. Inferno de badges
Cada item tem entre 3 e 5 badges coloridos. Na página Catálogo, um único card de metodologia pode ter **5 badges diferentes**. O cérebro do usuário trava tentando processar tanta informação por item.

### 🔴 5. Jargão técnico (o pior de todos)
A terminologia é 100% orientada ao desenvolvedor do módulo:

| Termo atual | Tradução para o usuário |
|---|---|
| "Base mínima preenchida" | "Preencha os campos obrigatórios" |
| "Lacuna crítica" | "Falta preencher algo importante" |
| "Prontidão operacional" | "Este item está pronto?" |
| "Snapshot equivalente íntegro mínimo" | "Versão salva com segurança" |
| "Rastreabilidade preservada" | "De onde veio esta metodologia" |
| "Cockpit do Núcleo" | "Painel principal" |
| "Ativo canônico" | "Metodologia oficial" |
| "Ativo em estruturação" | "Rascunho da metodologia" |
| "Maturidade prática" | "Nível de maturidade" |
| "Status editorial" | "Estágio de publicação" |
| "Entradas brutas" | "Documentos recebidos" |
| "Mesa de estruturação" | "Área de trabalho" |

### 🟡 6. Navegação sem identidade
- Sidebar usa **emojis genéricos** (🏠 🪟 📋 ❤️) que parecem placeholder
- Navegação por hash sem transições — muda instantaneamente sem feedback
- Nenhum breadcrumb, nenhum senso de "onde estou"
- Título do header repete o que já está na sidebar

### 🟡 7. Painéis de filtro colossais
- Catálogo: **12 selects + 2 ordenações + busca textual** — tudo visível ao mesmo tempo
- Mesa: **5 filtros + 3 ordenações/agrupamentos** — mesma abordagem
- O usuário precisa entender 17 controles diferentes antes de conseguir filtrar algo

### 🟡 8. Formulários crus
As páginas de edição (`AtivoEditarPage`, `CanonicoEditarPage`) são **form builders**:
- Campos expostos como "Status editorial", "Maturidade prática", "Governança" — zero contexto
- Nenhuma orientação sobre o que cada campo significa
- Nenhuma validação visual progressiva
- Nenhum wizard ou passo a passo

### 🟡 9. Estados vazios sem alma
- "Sem movimentos recentes registrados"
- "Nenhum bloco interno ainda"
- "Ainda não há conexões registradas"
- Zero personalidade, zero orientação, zero motivação

### 🟡 10. Densidade visual sufocante
- `space-y-3`, `space-y-4` com padding mínimo
- Múltiplos `grid-cols-5`, `grid-cols-6` — tudo apertado
- Nenhum espaço para respirar, nenhum ritmo visual

### 🔵 11. Banner de erro técnico
- Fundo âmbar vibrante com texto "Persistência em modo degradado"
- Mensagem assustadora para um usuário que só quer saber se salvou ou não
- Zero empatia com a situação do usuário

### 🔵 12. Sem identidade visual própria
- O módulo usa tokens SagB genéricos (`bg-sagb-panel`, `text-sagb-text`)
- Nada no design comunica "Metodologias" como uma marca/missão
- Visual intercambiável com qualquer outro módulo

---

## Proposta de Redesign Radical

### Filosofia Central

> **"Menos informação, mais clareza. Menos jargão, mais conversa. Menos cores, mais hierarquia."**

1. **Humano primeiro**: TODO texto deve ser conversacional em português brasileiro
2. **Divulgação progressiva**: Mostre o mínimo necessário para a ação atual
3. **Respiração visual**: Fontes maiores, whitespace generoso, ritmo claro
4. **Guias e assistentes**: Wizards em vez de formulários crus
5. **Prazer sutil**: Micro-interações, tons quentes, personalidade
6. **Navegação óbvia**: Onde estou, para onde posso ir, como volto
7. **Paleta enxuta**: Máximo 3 cores de acento (não 7)

---

### Roadmap de Implementação

Organizado por **áreas de impacto**, do mais transformador ao mais incremental.

---

## ESTÁGIO 1 — Nova Identidade Visual do Módulo ⭐

**Arquivos:** [`MetodologiasHubPage.tsx`](src/modules/metodologias/pages/MetodologiasHubPage.tsx), [`Sidebar.tsx`](components/Sidebar.tsx)

### O que mudar:

1. **Sidebar com ícones customizados SVG** (substituir emojis):
   - Home: ícone de casa simples
   - Mesa: ícone de mesa/penteadeira
   - Catálogo: ícone de livro/prateleira
   - Saúde: ícone de coração com batimento
   - Usar `strokeWidth={1.5}` para consistência com o resto do SagB

2. **Paleta reduzida para 3 acentos**:
   - **Azul índigo** (#6366f1): cor primária do módulo (ações, links, foco)
   - **Âmbar** (#f59e0b): cor de alerta/atenção (usar com moderação)
   - **Verde** (#10b981): cor de sucesso/conclusão
   - Remover: rosa, ciano, violeta, verde-esmeralda como acentos independentes

3. **Header do módulo com identidade própria**:
   - Gradiente sutil em vez de `bg-sagb-panel`
   - Logo ou marca d'água "Metodologias" com opacidade
   - Breadcrumb de navegação: `SagB > Metodologias > [Página atual]`

4. **Transição suave entre rotas**:
   - Adicionar `animate-fadeIn` ou transição CSS simples ao trocar de página
   - Feedback visual de que a navegação ocorreu

5. **Tamanhos de fonte revisitados**:
   - Texto base: `text-sm` (14px) em vez de `text-[12px]`
   - Labels: `text-xs font-semibold` em vez de `text-[10px] font-black uppercase`
   - Títulos: `text-lg` a `text-2xl` em vez de `text-[12px] uppercase`
   - **NUNCA usar `font-black uppercase tracking-wide` como padrão**

---

## ESTÁGIO 2 — Humanização da Linguagem 🗣️

**Arquivos:** Todas as 8 páginas, todos os services com getLabel()

### Glossário de substituições:

| Termo antigo | Novo termo | Ocorrências |
|---|---|---|
| "Cockpit do Núcleo" | "Painel Principal" | HomePage |
| "Ativo canônico" | "Metodologia oficial" | Catálogo, AtivoPage |
| "Ativo em estruturação" | "Rascunho de metodologia" | Mesa, EditarPage |
| "Entradas brutas" | "Documentos recebidos" | HomePage, Mesa |
| "Mesa de estruturação" | "Área de trabalho" | Mesa, HubPage |
| "Base mínima preenchida" | "Campos obrigatórios ok ✅" | EditarPage |
| "Lacuna crítica" | "Atenção: falta preencher" | EditarPage |
| "Prontidão operacional" | "Pronto para publicar?" | Mesa |
| "Snapshot" | "Cópia de segurança" | CanonicoEditarPage |
| "Rastreabilidade preservada" | "Origem registrada" | CanonicoEditarPage |
| "Promoção assistida" | "Publicar metodologia" | AtivoEditarPage |
| "Status editorial" | "Estágio de publicação" | Todas |
| "Maturidade prática" | "Nível de maturidade" | Todas |
| "Governança" | "Ciclo de governança" | Todas |
| "Saúde do Núcleo" | "Painel de métricas" | SaudePage |
| "Versão canônica" | "Versão oficial" | CanonicoEditarPage |
| "Evento de manutenção" | "Registro de alteração" | CanonicoEditarPage |

### Implementação:

- Criar um **hook ou utility** `useHumanLabels()` que traduz os termos dos types para linguagem natural
- Modificar as funções `getTipoDeAtivoLabel`, `getStatusEditorialLabel` etc. no [`services/index.ts`](src/modules/metodologias/services/index.ts) para usar linguagem simplificada
- Adicionar **tooltips contextuais** (`title` ou popover) nos campos de formulário explicando em 1 linha o que aquele campo significa

---

## ESTÁGIO 3 — HomePage: Redesign Completo 🏠

**Arquivo:** [`MetodologiasHomePage.tsx`](src/modules/metodologias/pages/MetodologiasHomePage.tsx)

### Estrutura atual:
- Header gradiente com 3 botões
- 3 cartões de indicadores
- 3 colunas de listas (movimentos, entradas, ativos)

### Estrutura proposta:

```
┌──────────────────────────────────────────┐
│  🏠 Painel Principal                     │
│  SagB > Metodologias > Home              │
├──────────────────────────────────────────┤
│  ┌─ Boas-vindas ──────────────────────┐  │
│  │ Olá! Aqui você gerencia            │  │
│  │ metodologias da sua equipe.        │  │
│  │                                     │  │
│  │ [➕ Nova metodologia] [📋 Catálogo]  │  │
│  └─────────────────────────────────────┘  │
│                                          │
│  ┌─ Resumo rápido ────────────────────┐  │
│  │  📄 12 metodologias                │  │
│  │  📥 5 documentos recebidos         │  │
│  │  ✅ 8 metodologias oficiais        │  │
│  └─────────────────────────────────────┘  │
│                                          │
│  ┌─ Últimas atividades ───────────────┐  │
│  │  • Ontem: "Design Sprint" atualizado│  │
│  │  • 2 dias: "OKR Framework" criado   │  │
│  │  • 5 dias: "Kanban" revisado       │  │
│  └─────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Mudanças específicas:

1. **Boas-vindas em vez de "Cockpit"**:
   - Mensagem de boas-vindas dinâmica (baseada em hora do dia)
   - Botões grandes e convidativos: "Nova metodologia" e "Explorar catálogo"
   - Remover gradiente multicolorido — usar fundo limpo

2. **Resumo em cards grandes e legíveis**:
   - 3 cards horizontais com ícone + número + label humano
   - Fonte 2xl-3xl para números, text-sm para labels
   - Cada card clicável leva à página relevante

3. **Timeline de atividades**:
   - Substituir 3 colunas por timeline vertical única
   Cada atividade com: data relativa ("Ontem", "Há 2 dias"), ícone de ação, título
   - Muito mais escaneável que 3 colunas de cards

4. **CTA principal proeminente**:
   - "Criar nova metodologia" como botão grande, primário, no topo
   - Acesso rápido à ação mais importante do módulo

---

## ESTÁGIO 4 — MesaPage: Simplificação Radical 🪟

**Arquivo:** [`MetodologiasMesaPage.tsx`](src/modules/metodologias/pages/MetodologiasMesaPage.tsx)

### Problemas atuais:
- 5 indicadores no topo (muita informação)
- 5 filtros + ordenação + agrupamento (12 controles)
- Cada item na lista tem 3-4 badges
- Painel de conversão assistida complexo

### Mudanças propostas:

1. **Indicadores compactados em 3 cards grandes**:
   - "Documentos recebidos" (total de entradas)
   - "Em andamento" (itens sendo trabalhados)
   - "Metodologias criadas" (consolidados)
   - Remover indicadores de "prontidão média", "lacunas" etc. do topo

2. **Filtros em painel colapsável**:
   - Por padrão: apenas busca textual + filtro de status
   - "Filtros avançados" expande o restante
   - Reduzir de 12 controles visíveis para **2 visíveis + 1 expansor**

3. **Lista de itens simplificada**:
   - Cada item é um **cartão vertical** com: título, 1 badge de status, data relativa
   - Badges secundárias aparecem apenas no hover ou expansão
   - Botão de ação principal: "Editar" ou "Revisar"

4. **Formulário de entrada reestruturado**:
   - Aba/guia "Novo documento" com assistente de 2 passos:
     - Passo 1: Cole o texto ou anexe arquivos
     - Passo 2: Dê um título e selecione o tipo
   - Em vez do formulário único com 5 campos + file input

5. **Painel de conversão em modal**:
   - Em vez de ocupar metade da tela, abre como modal/drawer
   - Mais foco na tarefa atual

---

## ESTÁGIO 5 — Catálogo: Navegação por Facetas 📋

**Arquivo:** [`MetodologiasCatalogoPage.tsx`](src/modules/metodologias/pages/MetodologiasCatalogoPage.tsx)

### Problemas atuais:
- 12 filtros + ordenação + agrupamento + busca = 15 controles
- Preview lateral ocupa espaço precioso
- Mapa de conexões é informação avançada demais para landing page

### Mudanças propostas:

1. **Filtros em barra compacta com dropdowns**:
   - 3-4 filtros primários visíveis (tipo, status, maturidade)
   - "Mais filtros" botão que expande os demais
   - Busca textual proeminente no topo

2. **Grid de cards com preview em hover**:
   - Cards maiores (fonte maior, menos badges)
   - Ao passar o mouse: tooltip/dropdown com preview rápido
   - Ao clicar: vai direto para página do ativo

3. **Mapa de conexões movido para página dedicada ou modal**:
   - Não poluir a visualização principal
   - Acesso por botão "Ver mapa de conexões"

4. **Agrupamento visual tabs em vez de select**:
   - Tabs horizontais: "Todos" | "Por tipo" | "Por status"
   - Muito mais intuitivo que select + label técnico

5. **Preview em slide-out panel**:
   - Em vez de sidebar fixa, abrir como drawer lateral
   - Mais espaço para o grid de cards

---

## ESTÁGIO 6 — Editor de Metodologia: Experiência Guiada ✏️

**Arquivos:** [`MetodologiaAtivoEditarPage.tsx`](src/modules/metodologias/pages/MetodologiaAtivoEditarPage.tsx), [`MetodologiaCanonicoEditarPage.tsx`](src/modules/metodologias/pages/MetodologiaCanonicoEditarPage.tsx)

### Problemas atuais:
- Formulários crus com labels técnicos
- Campos de bloco repetitivos e densos
- Seção de promoção complexa e técnica

### Mudanças propostas:

1. **Wizard de 3 etapas em vez de formulário único**:
   - **Etapa 1 — Dados básicos**: Nome, tipo, resumo, objetivo
   - **Etapa 2 — Conteúdo**: Blocos internos (edição com preview)
   - **Etapa 3 — Conexões e publicação**: Relações, revisão, publicação

2. **Labels com contexto amigável**:
   - "Nome da metodologia" em vez de "Nome"
   - "O que esta metodologia faz?" em vez de "Resumo"
   - "Para que serve?" em vez de "Objetivo"
   - Help text abaixo de cada campo explicando em 1 frase

3. **Blocos com preview visual**:
   - Em vez de lista vertical de campos, usar cards com preview
   - Ordenação drag-and-drop (ou pelo menos visual mais clara)
   - Botão "Adicionar bloco" mais proeminente

4. **Seção de promoção simplificada**:
   - "Publicar metodologia" como ação principal
   - Checklist visual de pré-requisitos (ícones ✅ / ❌)
   - Barra de progresso "Prontidão para publicação"
   - Remover métricas e dados de rastreabilidade (manter em segundo plano)

5. **Editor canônico focado em versões**:
   - Aba "Versões" como primária (em vez de seção âmbar)
   - Aba "Blocos" como secundária
   - Comparação de versão simplificada (mostrar só diff relevante)

---

## ESTÁGIO 7 — Página do Ativo: Leitura Prazerosa 📖

**Arquivo:** [`MetodologiaAtivoPage.tsx`](src/modules/metodologias/pages/MetodologiaAtivoPage.tsx)

### Problemas atuais:
- Header genérico com badges técnicas
- Seção de relações visualmente pesada
- Lista de camadas (AtivoDetalheCamadas) não analisada

### Mudanças propostas:

1. **Header como "capa do ativo"**:
   - Nome grande (text-3xl) com subtítulo de tipo
   - Badges em linha horizontal, discretas
   - Ações no canto: "Editar", "Compartilhar" (se aplicável)

2. **Relacionamentos em grafo visual**:
   - Em vez de lista de cards, usar grafo SVG simples
   - Ou cards estilizados com setas direcionais visuais
   - "Este ativo está relacionado com..." em linguagem natural

3. **Camadas como seções colapsáveis**:
   - Por padrão, apenas 2 primeiras camadas expandidas
   - "Ver mais" para expandir as demais
   - Navegação por âncoras suaves

---

## ESTÁGIO 8 — Saúde do Núcleo: Painel Executivo ❤️

**Arquivo:** [`MetodologiasSaudePage.tsx`](src/modules/metodologias/pages/MetodologiasSaudePage.tsx)

### Problemas atuais:
- Indicadores numéricos sem contexto
- "Pontos de atenção" com jargão ("Canônicos sem corpo", "Estruturação travada")
- Sem recomendações acionáveis

### Mudanças propostas:

1. **Métrica de saúde como gauge visual**:
   - Gauge circular mostrando score (0-100)
   - Label em linguagem natural: "Saudável ✅", "Atenção ⚠️", "Crítico ❌"
   - Abaixo: "O que isso significa?" em 1-2 frases

2. **Cards de métrica com ícone + valor + label humana**:
   - Em vez de "Canônicos sem corpo": "📦 3 metodologias sem conteúdo"
   - Em vez de "Estruturação travada": "⏸️ 2 rascunhos parados há +30 dias"

3. **Recomendações geradas automaticamente**:
   - Abaixo de cada métrica: "O que fazer?"
   - "📦 3 metodologias sem conteúdo → [Revisar agora]"
   - "⏸️ 2 rascunhos parados → [Continuar edição]"

4. **Botão "Gerar relatório"** (exportável):
   - Para quem quiser compartilhar o status com a equipe

---

## ESTÁGIO 9 — Micro-Interações e Delight ✨

**Arquivos:** Globais (CSS, hooks)

1. **Transições suaves**:
   - `transition-all duration-200` em cards e botões (já parcialmente implementado)
   - `animate-fadeIn` ao trocar de rota (novo)
   - Skeleton loaders em vez de "Carregando..."

2. **Feedback de ação**:
   - Toast de confirmação após salvar ("Metodologia salva! ✅")
   - Loading state em botões de ação
   - Validação inline em formulários

3. **Empty states com personalidade**:
   - "Nenhuma metodologia ainda. Que tal criar a primeira? 🚀"
   - "Sem documentos recebidos. Comece adicionando um texto ou arquivo."
   - Ilustrações simples (ícones decorativos)

4. **Tooltips contextuais**:
   - `title` ou popover em todo label técnico inevitável
   - Explicação em 1 linha do que o campo significa

---

## ESTÁGIO 10 — Limpeza Pós-Redesign 🧹

**Arquivos:** Todos

1. **Remover arquivos/componentes não utilizados**:
   - `MetodologiasFrontCard` (se substituído por novo card)
   - Qualquer badge component que não seja mais usado
   - Constantes e types dead code

2. **Atualizar `changelog.md`** com cada estágio
3. **Atualizar `decisions.md`** com as decisões de redesign
4. **Atualizar `module-doc.ts`** se necessário

---

## Ordem de Execução Sugerida

| Prioridade | Estágio | Esforço | Impacto |
|---|---|---|---|
| 🔴 P0 | **Estágio 2** — Humanização da linguagem | Médio | Transformador |
| 🔴 P0 | **Estágio 3** — HomePage redesign | Alto | Transformador |
| 🔴 P0 | **Estágio 1** — Identidade visual | Médio | Muito alto |
| 🟡 P1 | **Estágio 4** — MesaPage simplificação | Alto | Muito alto |
| 🟡 P1 | **Estágio 6** — Editor guiado | Muito alto | Muito alto |
| 🟡 P1 | **Estágio 7** — AtivoPage leitura | Médio | Alto |
| 🟢 P2 | **Estágio 5** — Catálogo facetado | Alto | Alto |
| 🟢 P2 | **Estágio 8** — SaúdePage executivo | Baixo | Médio |
| 🔵 P3 | **Estágio 9** — Micro-interações | Médio | Alto (delight) |
| 🔵 P3 | **Estágio 10** — Limpeza | Baixo | Manutenção |

---

## Resumo do Que Será Diferente

| Aspecto | Antes | Depois |
|---|---|---|
| Fonte base | 10-12px | 14-16px |
| Badges por item | 3-5 | 1-2 (máx) |
| Cores simultâneas | 7+ | 3 |
| Jargão técnico | 40+ termos | <5 termos |
| Filtros visíveis | 12-15 | 3-4 + expansor |
| Etapas do editor | Formulário único | Wizard 3 passos |
| Navegação | Hash sem transição | Breadcrumb + fade |
| Estados vazios | "Sem registros" | Mensagem + ação |
| Identidade | Genérica SagB | Marca própria |
