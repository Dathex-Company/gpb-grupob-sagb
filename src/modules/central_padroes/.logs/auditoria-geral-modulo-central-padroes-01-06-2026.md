# Auditoria Geral — Central de Padrões
**Data:** 2026-06-01  
**Auditor:** Cássio Mendes (Engenharia Consultiva)  
**Propósito:** Varredura técnica, funcional e conceitual completa do módulo.

---

## 1. Estado Atual do Módulo

### 1.1 Estrutura de Arquivos

```
src/modules/central_padroes/
├── index.ts              → exporta manifest, routes, moduleDoc
├── manifest.ts           → registro oficial como módulo plugável (ativo)
├── routes.tsx            → rota /central_padroes/*
├── module-doc.ts         → documentação do módulo
├── CHANGELOG.md          → mantido
├── DECISIONS.md          → mantido
├── README.md             → ok
├── PLANNED.md            → plano de evolução
├── layout/
│   └── CentralPadroesLayout.tsx   → shell com sidebar + topbar + páginas
├── pages/                → 20 páginas (dashboard, documents, search, etc.)
├── components/           → 12 componentes reutilizáveis
├── services/             → 11 serviços (CRUD, sync, search, seed, etc.)
├── hooks/
│   └── useCentralPadroes.ts
├── types/
│   └── index.ts          → tipos completos e filtros
├── data/
│   └── fallbackData.ts   → ~2020 linhas de dados operacionais
├── styles/
│   └── centralDocs.css   → CSS scoped do módulo
├── agent/                → persona Pietro para ativação via comando
├── docs/                 → documentação completa estruturada
├── scripts/
│   └── auto-ingest-central-padroes.mjs
└── .logs/                → revisões e QA
└── .specs/               → especificações
```

**Estrutura madura e completa.** O módulo segue o padrão de módulos plugáveis do SagB (manifest → routes → layout → pages → services).

### 1.2 O que já funciona bem

| Item | Status |
|---|---|
| Layout com sidebar própria | ✅ Funcional com seções agrupadas e busca |
| Alternância claro/escuro | ✅ Implementada com variáveis CSS |
| Biblioteca de Documentos | ✅ CRUD completo, filtros, busca local, modal de criação |
| Integração Supabase | ✅ Services lêem/escrevem via `restFetch` |
| Seed Synapse | ✅ Serviço criado para migrar fallback → Supabase |
| Busca textual | ✅ `hybridSearch` com score de relevância |
| Dashboard | ✅ Métricas básicas funcionais |
| 20 páginas de navegação | ✅ Todas roteadas internamente |
| Dark mode | ✅ Implementado com variáveis CSS |
| Persistência de dados | ✅ Supabase para operacional + fallback local |
| Documentação do módulo | ✅ README, CHANGELOG, DECISIONS, PLANNED, docs/ |
| Validações de curadoria (ET-09 a ET-21) | ✅ Executadas e registradas |

### 1.3 O que ainda é mock, fallback, placeholder ou não persistente

| Item | Problema |
|---|---|
| **fallbackData.ts** (~2020 linhas) | Principal fonte de dados silenciosa. Contém ~80 padrões, 22 documentos, 20 decisões, 4 módulos, 18 agentes. Já existe `centralPadroesSeedService` para migrar, mas ainda não foi executado. |
| **`centralPadroesRepository.getSnapshot()`** | Ainda carrega fallback como base (`cloneFallback()`) e mescla com Supabase. O fallback `areas` e `agents` ainda vêm do `fallbackData`. |
| **`searchService.hybridSearch()`** | É puramente textual (`scoreText`). Apesar de se chamar `semanticSearch` e `hybridSearch`, não há embedding, pgvector ou semântica real. |
| **`BaseModulesPage.tsx`** | Placeholder puro: `const BaseModulesPage = () => <ModulesPage />`. Não tem conteúdo próprio nem estrutura de dados dedicada. |
| **`searchService.reindexAll()`** | `console.info` — não faz nada real. |
| **Muitas páginas** não têm conteúdo próprio | AuditPage, ArchivePage, InternalDocsPage, ExternalDocsPage, RelationshipsPage, ApprovalsPage, AgentsPage, DevModePage, SettingsPage, CentralPadroesPage — algumas podem ser vazias ou placeholder. |
| **AgentsPage → Modo Agente** | Redireciona para página inexistente ou vazia. |
| **Dashboard** | Métricas básicas sem gráficos, sem visualização por área/status/tipo. |
| **Busca (SearchPage)** | Interface com CSS do SagB antigo (`sagb-line`, `sagb-bg-2`), não usa tokens da Central. |

---

## 2. Busca Atual — Análise Detalhada

### 2.1 Como funciona hoje

Arquivo: [`centralPadroesSearchService.ts`](00_sagb/src/modules/central_padroes/services/centralPadroesSearchService.ts)

```typescript
const scoreText = (haystack: string, query: string) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  const lower = haystack.toLowerCase();
  return terms.reduce((acc, term) => acc + (lower.includes(term) ? 1 : 0), 0) / terms.length;
};
```

**Mecanismo:**
- Divide a query em termos (por espaço).
- Para **cada termo**, verifica se existe (`.includes`) no texto completo.
- Score = proporção de termos encontrados.
- Ordena por score descendente.
- Retorna até 20 resultados.

**Campos considerados por entidade:**

| Entidade | Campos pesquisados |
|---|---|
| `standard` | `key`, `title`, `summary`, `owner` |
| `document` | `title`, `path`, `category` |
| `decision` | `title`, `summary`, `impacts` |

**Não considera:**
- `areaId` como filtro (embora exista no filtro de listagem)
- `status`
- `type`/`normativeType`
- `risk`
- `dependencies`
- `relatedModules`
- Conteúdo do documento ou padrão
- Tags ou metadados

**Camada de UI:**
- Página [`SearchPage.tsx`](00_sagb/src/modules/central_padroes/pages/SearchPage.tsx) com debounce de 250ms
- Abas para filtrar por tipo de entidade
- Exibe score em porcentagem
- **Usa CSS antigo do SagB** (`sagb-line`, `sagb-bg-2`), não tokens da Central

### 2.2 Limitações atuais

1. **Semântica zero**: `"decisão com IA"` não encontra DAI, rastreabilidade, protocolos, mentor DAI.
2. **Sem stemming ou fuzzy**: `"modulo"` não encontra `"módulos"`, `"modular"`.
3. **Sem pgvector**: não há embedding armazenado no Supabase.
4. **Sem cache ou índice**: busca sempre varre toda a snapshot em memória.
5. **Sem busca por conteúdo interno**: só metadados (título, resumo).
6. **Score linear**: qualquer termo encontrado = peso 1, independente de posição ou relevância.
7. **Sem faceta**: não filtra por área, status, tipo, risco.
8. **UI usa tokens errados**: mistura tokens do SagB antigo com CSS da Central.

### 2.3 Preparo para busca semântica

Não há preparo hoje. `reindexAll()` é um `console.info` vazio. Não existe:
- Tabela `central_padroes_embeddings` no Supabase
- Job de geração de embeddings
- Integração com OpenAI/Claude para embedding
- pgvector instalado/configurado

---

## 3. Viabilidade — Chat Inteligente Pietro Carbone

### 3.1 Análise técnica

**Reaproveitamento do módulo de conversas:**
O SagB já possui [`módulo núcleo-conversacional`](00_sagb/src/modules/nucleo-conversacional) com estrutura de chat (NChat, ncDb, agentes conversacionais). Técnicamente, é possível:
- Criar um agente específico ("Pietro Carbone") para a Central
- Reaproveitar o sistema de mensagens do núcleo-conversacional
- Adicionar contexto de busca restrito ao escopo da Central

**Formato ideal para MVP:**

| Formato | Prós | Contras | Recomendação |
|---|---|---|---|
| **Modal** | Simples, rápido de implementar | Perde contexto ao fechar | ❌ |
| **Drawer lateral** | Não sai do fluxo, visível enquanto navega | Concorre com sidebar | ❌ |
| **Popover expandido** | Leve, acoplado ao botão de busca | Pouco espaço para resultados | ❌ |
| **Área própria (página dedicada)** | Experiência completa, espaço total | Sai do fluxo da página atual | ⭐ MVP |
| **Drawer direito** | Acessível de qualquer página, não interfere na navegação | Precisa de layout adaptável | ⭐ Evolução |

**Recomendação MVP:** Página dedicada (reaproveitando SearchPage ou criando página de chat) com possibilidade futura de virar Drawer direito.

### 3.2 O que o chat Pietro poderia fazer (MVP)

1. **Perguntas sobre padrões**: "Qual o padrão para criar tabela Supabase?"
2. **Navegação guiada**: "Me mostre os checklists da área do Sávio"
3. **Contextualização**: "O que diz a CP-TEC-001?"
4. **Descoberta**: "Existe algum padrão sobre segurança?"
5. **Relacionamentos**: "O que CP-GOV-001 impacta?"

### 3.3 O que exigiria backend/API/IA real

1. Embedding dos padrões + pgvector no Supabase
2. Integração com LLM (OpenAI/Claude) para interpretação de perguntas
3. RAG (Retrieval Augmented Generation) para buscar contexto antes de responder
4. Histórico de conversas por usuário
5. Streaming de resposta token a token

### 3.4 Dependências técnicas

- Núcleo conversacional já existe → dependência baixa
- Agente Pietro existe como persona (em `agent/`) → dependência baixa
- Embedding + pgvector → dependência média/alta
- LLM API key + custo → dependência operacional

---

## 4. Sidebar / Menu Interno — Proposta de Reorganização

### 4.1 Como está hoje

A sidebar foi refatorada recentemente para usar seções agrupadas:

```
Portal
  ├── Visão Geral
  ├── Arquitetura Mestra
  └── Responsáveis e Áreas
Bibliotecas
  ├── Documentos
  ├── Padrões
  └── Registro Mestre
Governança
  ├── Matrizes e Checklists
  ├── Auditorias e Evidências
  ├── Decisões e Exceções
  └── Aprovações e Revisões
Documentação
  ├── Documentação Interna
  ├── Documentação Externa
  └── Arquivo / Legado
Módulos e IA
  ├── Módulos Base
  ├── Módulos Plugáveis
  ├── Relacionamentos / Grafo
  ├── Busca Inteligente
  └── Modo Agente
Sistema
  ├── Modo Dev
  └── Publicador legado
```

### 4.2 O que precisa melhorar

1. **Módulos Base** → precisa de estrutura própria (hoje é placeholder de ModulesPage)
2. **Documentação Interna/Externa/Arquivo** → podem ser sub-itens de um grupo recolhível "Documentação"
3. **Busca Inteligente** → poderia ser atalho da topbar em vez de item fixo no menu
4. **Publicador legado** → pode ficar em Configurações
5. **Modo Agente e Modo Dev** → poderiam ser um grupo recolhível "Modos Especiais"

### 4.3 Proposta de menu com accordion

```
📋 Portal (recolhível)
  ├── Visão Geral
  ├── Arquitetura Mestra
  └── Responsáveis

📚 Biblioteca (recolhível)
  ├── Documentos
  ├── Padrões Atômicos
  └── Registro Mestre

⚖️ Governança (recolhível)
  ├── Matrizes e Checklists
  ├── Auditorias
  ├── Decisões e Exceções
  └── Aprovações

📖 Documentação (recolhível)
  ├── Interna
  ├── Externa
  └── Arquivo / Legado

🧩 Módulos (recolhível)
  ├── Módulos Base Reutilizáveis ← estrutura própria
  ├── Módulos Plugáveis
  └── Relacionamentos

🔧 Sistema (recolhível, sempre visível no final)
  ├── Configurações
  ├── Modo Dev
  └── Publicador Legado
```

**Busca Inteligente** → sai do menu fixo e vira ação global na topbar (já implementado).

---

## 5. Dashboard com Gráficos — Proposta

### 5.1 Estado atual

O [`DashboardPage.tsx`](00_sagb/src/modules/central_padroes/pages/DashboardPage.tsx) hoje mostra:
- 7 MetricCards (Padrões, Documentos, Checklists, Decisões, Módulos vinculados, Riscos altos, Aprovações pendentes)
- Tabela de padrões prioritários (6 primeiros)
- **Sem gráficos, sem visualização por área, status, tipo ou risco**

### 5.2 Proposta de gráficos (sem dependência externa)

Usar CSS + SVG puro (sem biblioteca) ou Chart.js leve:

| Gráfico | Fonte de dados | Tipo |
|---|---|---|
| Pizza por status | `standards.map(s => s.status)` | SVG doughnut |
| Barras por divisão | `standards grouped by areaId` | Barras horizontais |
| Barras por tipo normativo | `standards grouped by type` | Barras verticais |
| Quantidade por área | `standards grouped by areaId` | Tabela colorida |
| Itens pendentes de canonização | `standards.filter(s => s.status !== 'publicado')` | Card métrico |
| Decisões abertas | `decisions.filter(d => d.status === 'proposta')` | Card métrico |
| Dependências transversais | `standards.filter(s => s.dependencies.length > 2)` | Card métrico |
| Cobertura da curadoria | `areas.length` vs `standards by area > 0` | Barra de progresso |

### 5.3 Implementação

Recomendo **SVG puro** para os gráficos principais (sem dependência de biblioteca externa), com componente `DashboardChart` reutilizável. O SagB já tem os dados no snapshot — é só agregar e renderizar.

---

## 6. ET-22 — Saneamento do Modelo Padrão

### 6.1 Problemas identificados

Analisando o [`fallbackData.ts`](00_sagb/src/modules/central_padroes/data/fallbackData.ts):

**Duplicidade de numeração na seção 3:**
- `CP-UX-001` aparece em dois lugares diferentes:
  - Linha 507: `CP-UX-001` — "Design System SagB" (área: alice, status: aprovado)
  - Linha 639: `CP-UX-001` — "Variação visual real não é troca de cor" (área: alice, status: revisao)

Isso é um **conflito grave** — duas entradas com a mesma chave `CP-UX-001`. Uma veio da carga original (ET-09), outra da Curadoria Geral (ET-10 a ET-20).

**Duplicidade/salto de numeração na seção 25:**
- Padrões de Sávio vão de `CP-TEC-001` a `CP-TEC-026` — aparentemente contínuos.
- Padrões de Curadoria Geral usam `CP-GOV-001` a `CP-GOV-007`, `CP-UX-001` a `CP-UX-006`, `CP-SEG-001` a `CP-SEG-005`, etc.
- O problema é que `CP-UX-001` colidiu com o já existente.

**"Registro/Evidência" como grupo normativo:**
- O tipo `registro` é usado para: ADRs (CP-TEC-009), erros técnicos (CP-TEC-021), incidentes (CP-TEC-022), deploys (CP-TEC-023), rollbacks (CP-TEC-024), refatorações (CP-TEC-025), evidências (CP-TEC-026).
- Mas não há distinção entre "Registro" e "Evidência" no type — ambos usam `registro`.
- O tipo `evidencia` existe no union type `CentralNormativeType` mas **nunca é usado**.

### 6.2 Impacto nos documentos já cadastrados

1. **Na tabela Supabase**: se ambos os `CP-UX-001` foram inseridos, o segundo sobrescreve o primeiro (dependendo da constraint ON CONFLICT). O seed service usa `standard_key` como chave de unicidade.
2. **No fallback**: ambos existem — o seed vai pular o segundo por key duplicada (se `exists()` detectar o primeiro).
3. **Usuários**: quem consultar `CP-UX-001` pode ver o conteúdo errado.

### 6.3 Ação necessária

1. Renomear `CP-UX-001` duplicado da curadoria para `CP-UX-007` (próximo disponível).
2. Revisar todas as chaves da Curadoria Geral para garantir unicidade.
3. Verificar se `CP-GOV-007` (registro de decisão) deveria ser `CP-GOV-008` se houver salto.

---

## 7. Biblioteca de Módulos Base Reutilizáveis

### 7.1 Situação atual

- [`BaseModulesPage.tsx`](00_sagb/src/modules/central_padroes/pages/BaseModulesPage.tsx) é **placeholder**: `const BaseModulesPage = () => <ModulesPage />`
- Não há estrutura de dados dedicada para módulos base
- O menu trata como página separada mas o conteúdo é o mesmo de ModulesPage
- O tipo `CentralModuleLink` tem `kind: 'base_reutilizavel'` que contempla o conceito

### 7.2 Proposta de encaixe

**Dentro da Central de Padrões, como seção própria:**

1. **Nova aba/seção**: "Biblioteca de Módulos Base" como grupo recolhível no menu
2. **Nova estrutura de dados**: `CentralBaseModule` (extends `CentralModuleLink` com campos adicionais: `prerequisites`, `dependencies`, `tags`, `version`)
3. **Gate Modular Pré-Dev**: conectar com checklists existentes (`CP-TEC-006` — "Antes de criar módulo")
4. **Fluxo**: Biblioteca consultada → verifica se módulo base atende → se sim, usa; se não, passa para Sala Dev

### 7.3 Fluxo conceitual validado

```
CID + RAI → NICO → NAGI → AJUP/Audacus → Biblioteca Módulos Base → Pietro/Central → Sala Dev
```

A Central de Padrões é o **gate de governança** antes da implementação. A Biblioteca de Módulos Base se encaixa naturalmente como:
- Local de consulta obrigatória (antes de construir)
- Catálogo de ativos reutilizáveis
- Fonte de verificação para o princípio "Antes de construir, verificar o que já existe"

### 7.4 Recomendação

- **Local técnico**: já existe (BaseModulesPage), mas precisa de conteúdo real
- **Nova aba**: sim, com estrutura própria de dados
- **Conexão com padrões**: módulos base devem referenciar os padrões que implementam
- **Conexão com checklists**: checklist CP-TEC-006 deve consultar esta biblioteca

---

## 8. Resumo e Próximos Passos

### 8.1 O que já está funcionando bem ✅

1. Estrutura completa de módulo plugável (manifest → routes → layout → pages)
2. Layout com sidebar própria, topbar, dark mode, busca no menu
3. CRUD completo com Supabase
4. 20 páginas de navegação internas
5. Biblioteca de Documentos funcional com filtros e criação
6. Serviço de seed para migrar fallback → Supabase
7. Documentação viva (CHANGELOG, DECISIONS, README, PLANNED)
8. Execução de ET-09 a ET-21
9. Dados operacionais carregados (80+ padrões, 22 docs, 20 decisões, etc.)

### 8.2 O que ainda é mock/fallback/placeholder ⚠️

1. `fallbackData.ts` como fonte de dados (precisa migrar 100% para Supabase)
2. `areas` e `agents` no repositório vêm do fallback local
3. `BaseModulesPage` → placeholder que redireciona para ModulesPage
4. `searchService.reindexAll()` → `console.info` vazio
5. Várias páginas (Archive, InternalDocs, ExternalDocs, Relationships, Approvals, Agents, DevMode, Settings, CentralPadroesPage) sem conteúdo próprio significativo
6. Busca puramente textual, sem embedding ou semântica
7. Dashboard sem gráficos
8. SearchPage com CSS do SagB antigo em vez de tokens da Central
9. CP-UX-001 duplicado (conflito entre ET-09 e Curadoria Geral)

### 8.3 Pontos críticos que precisam correção 🔴

1. **Chave duplicada CP-UX-001** → conflito entre dois registros com o mesmo identificador
2. **BaseModulesPage é placeholder** → precisa de conteúdo real para o Gate Modular Pré-Dev
3. **Busca não é semântica** → `hybridSearch` e `semanticSearch` são nomes enganosos para busca textual pura
4. **Dashboard não tem gráficos** → métricas existem mas não são visualizadas
5. **SearchPage usa CSS errado** → tokens do SagB antigo em vez de `cp-*`
6. **`areas` e `agents` ainda no fallback** → não estão no Supabase

### 8.4 Oportunidades de melhoria 💡

1. **Chat Pietro Carbone** → agente contextual da Central de Padrões
2. **Dashboard com gráficos SVG** → pizza, barras, progresso sem dependência externa
3. **Sidebar com accordion** → grupos recolhíveis para navegação mais limpa
4. **Busca semântica com pgvector** → embedding dos padrões no Supabase
5. **Biblioteca de Módulos Base** → conteúdo real para o Gate Modular Pré-Dev
6. **Distinção Registro vs Evidência** → usar `evidencia` no type
7. **Responsividade** → já existe, mas pode melhorar em telas médias

### 8.5 Viabilidade da Busca Inteligente

| Requisito | Viabilidade | Esforço |
|---|---|---|
| Busca textual melhorada (fuzzy, stemming) | Alta — biblioteca JS pura | Baixo |
| Filtros por faceta (área, status, tipo) | Alta — já existe na UI de documentos | Baixo |
| Embedding + pgvector | Média — requer tabela + job + API | Médio |
| RAG com LLM | Média — requer integração com API | Alto |
| Chat Pietro (MVP textual) | Alta — reaproveita núcleo conversacional | Médio |
| Chat Pietro (com RAG) | Média — requer embedding + LLM | Alto |

### 8.6 Viabilidade do Chat Pietro Carbone

**MVP viável imediatamente** usando:
- Estrutura do núcleo conversacional existente
- Persona já definida em `agent/persona.md`
- Busca textual como fonte de conhecimento
- Respostas baseadas em template + contexto da busca

**Evolução futura** com:
- Embedding real dos padrões
- RAG para respostas mais precisas
- Streaming de resposta
- Contexto do usuário logado (divisão, permissões)

### 8.7 Riscos Técnicos

| Risco | Severidade | Mitigação |
|---|---|---|
| `fallbackData.ts` ficar dessincronizado do Supabase | Alta | Executar seed ASAP e remover fallback como fonte de leitura |
| Chaves duplicadas (CP-UX-001) causarem dados inconsistentes | Alta | Sanear antes de qualquer nova carga |
| BaseModulesPage enganar usuários | Média | Implementar conteúdo real ou remover do menu |
| Busca enganosa (chamada de "semântica" sem ser) | Média | Renomear para `textSearch` ou implementar embedding |
| Páginas placeholder gerarem frustração | Média | Mapear e dar conteúdo mínimo ou ocultar do menu |
| `useCentralPadroes` depender de snapshot do fallback | Média | Completar migração Supabase |

### 8.8 Recomendação de Próxima ET

**ET-22 — Saneamento, Correção e Consolidação**

Prioridade máxima:

1. **Sanear chave duplicada CP-UX-001** e verificar unicidade de todas as chaves
2. **Executar seed Supabase** (botão "Sincronizar" já existe)
3. **Remover fallback como fonte de leitura** (já parcialmente feito, mas `areas` e `agents` ainda vêm do fallback)
4. **Dar conteúdo real à BaseModulesPage** ou remover placeholder
5. **Renomear `hybridSearch`** para `textSearch` (ou implementar embedding real)
6. **Corrigir SearchPage** para usar tokens `cp-*` da Central
7. **Adicionar gráficos ao Dashboard** (pizza por status e barras por área)

### 8.9 Ordem ideal de execução

```
Fase 1 — Saneamento crítico (1-2 dias)
├── 1. Sanear chaves duplicadas (CP-UX-001 e verificar todas)
├── 2. Executar seed Supabase
├── 3. Remover fallback como fonte de leitura (áreas, agents)
└── 4. Validar integridade dos dados no Supabase

Fase 2 — Correções funcionais (2-3 dias)
├── 5. BaseModulesPage: conteúdo real ou remover placeholder
├── 6. Renomear hybridSearch → textSearch
├── 7. Corrigir SearchPage para tokens cp-*
├── 8. Dar conteúdo mínimo para páginas placeholder
└── 9. Adicionar gráficos SVG ao dashboard

Fase 3 — Evolução (3-5 dias)
├── 10. Sidebar com accordion (seções recolhíveis)
├── 11. Chat Pietro Carbone MVP (página dedicada)
├── 12. Biblioteca de Módulos Base (estrutura + dados)
├── 13. Distinção Registro vs Evidência no tipo normativo
└── 14. Preparar terreno para pgvector (tabela de embeddings)

Fase 4 — Inteligência (médio prazo)
├── 15. Embedding real + pgvector no Supabase
├── 16. RAG para busca semântica
├── 17. Chat Pietro com respostas inteligentes
└── 18. Contexto do usuário logado
```

---

*Relatório completo. Nenhuma alteração foi implementada — apenas auditoria, análise e proposição.*
