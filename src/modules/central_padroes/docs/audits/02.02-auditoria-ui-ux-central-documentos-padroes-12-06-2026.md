# 🎨 Auditoria UI/UX — Central de Documentos e Padrões — 12-06-2026

## 📋 Resumo

Auditoria visual completa de todas as telas da Central de Documentos e Padrões. O módulo está funcional (Supabase, CRUD, build, testes OK), mas o acabamento visual ainda é de protótipo técnico.

---

## Tabela de Status por Tela

| # | Tela | Arquivo | Status | Problemas |
|---|---|---|---|---|
| 1 | Início (Dashboard) | `DashboardPage.tsx` | 🟡 Aceitável | Gráficos funcionais, métricas OK, mas sem hierarquia visual forte |
| 2 | Pergunte ao Pietro | `ChatPietroPage.tsx` | 🟠 Ruim | Sem card de apresentação, input pequeno, sem chips de sugestão, experiência de chat crua |
| 3 | Buscar | `SearchPage.tsx` | 🟡 Aceitável | Funcional mas sem polimento visual |
| 4 | Painel de Governança | `GovernancePanelPage.tsx` | 🔴 Crítico | Zeros grudados no título, sem cards de métrica, layout textual, sem grid |
| 5 | Documentos | `DocumentsPage.tsx` | 🟡 Aceitável | Tabela funcional, sem problemas graves |
| 6 | Padrões | `StandardsPage.tsx` | 🟡 Aceitável | Similar a Documentos |
| 7 | Decisões | `DecisionsPage.tsx` | 🟡 Aceitável | Similar a Documentos |
| 8 | Checklists | `ChecklistsPage.tsx` | 🟡 Aceitável | Similar a Documentos |
| 9 | Auditorias | `AuditsPage.tsx` | 🟢 Bom | CRUD padronizado via CentralGovernanceRecordsPage |
| 10 | Relatórios | `RelatoriosPage.tsx` | 🟢 Bom | CRUD padronizado |
| 11 | Execuções LOZE-TRACE | `AgentsPage.tsx` | 🟢 Bom | CRUD standalone com formulário dedicado |
| 12 | Evidências | (plannedView) | 🟡 Aceitável | Tela placeholder, planejada |
| 13 | Módulos Base | `BaseModulesPage.tsx` | 🟡 Aceitável | Tabela funcional |
| 14 | Links de Módulos | `ModulesPage.tsx` | 🟡 Aceitável | Tabela funcional |
| 15 | Dependências | `RelationshipsPage.tsx` | 🟡 Aceitável | Tabela funcional |
| 16 | Tags | (plannedView) | 🟡 Aceitável | Tela placeholder |
| 17 | Curadoria | `CuradoriaPage.tsx` | 🟢 Bom | CRUD padronizado (nova página) |
| 18 | Aprovações Pendentes | `ApprovalsPage.tsx` | 🟡 Aceitável | Funcional, sem problemas graves |
| 19 | Configurações | `SettingsPage.tsx` | 🟡 Aceitável | Funcional |
| 20 | Modo Dev | `DevModePage.tsx` | 🟡 Aceitável | Funcional |

---

## Problemas Críticos (🔴)

### 1. Painel de Governança — Zeros Grudados

**Arquivo**: `GovernancePanelPage.tsx` + `centralDocs.css`

**Problema**: O contador de itens aparece como `Pietro0` ao invés de `Pietro: 0` porque o `<span className="cp-governance-count">` está colado ao título sem espaçamento no CSS.

**Correção**: Adicionar `margin-left: 8px` ao `.cp-governance-count` e garantir separador visual.

### 2. Painel de Governança — Sem Cards de Métrica

**Problema**: Seções são listas textuais sem cards visuais. Falta grid de indicadores com cards de métrica mostrando totais por categoria.

**Correção**: Substituir lista por grid de cards usando `MetricCard` ou criar cards de governança.

---

## Problemas Graves (🟠)

### 3. Chat Pietro — Sem Card de Apresentação

**Arquivo**: `ChatPietroPage.tsx`

**Problema**: A primeira mensagem do assistente é a única "apresentação", sem card visual destacando quem é Pietro, o que ele faz, e exemplos clicáveis.

**Correção**: Adicionar card de boas-vindas com foto/ícone, texto de apresentação e chips de sugestão clicáveis.

### 4. Chat Pietro — Input Pequeno e Sem Polimento

**Problema**: O textarea de input está funcional mas visualmente pobre. Falta:
- Placeholder mais convidativo
- Botão de envio mais proeminente
- Atalho visual (Enter ⏎ para enviar)

**Correção**: Melhorar CSS do input area, aumentar padding, adicionar dica de atalho.

### 5. Chat Pietro — Loading State Básico

**Problema**: Estado de carregamento é texto simples "Pietro está pensando..." sem animação ou indicador visual.

**Correção**: Adicionar animação de dots pulsantes ou spinner.

---

## Problemas Médios (🟡)

### 6. Layout — Espaçamento e Respiro

**Arquivo**: `CentralPadroesLayout.tsx` + `centralDocs.css`

**Problema**: Conteúdo principal ocupa mal o espaço. Falta `max-width` no conteúdo e padding adequado nas laterais.

**Correção**: `.cp-docs-wrap` com `max-width: 960px` e `margin: 0 auto`.

### 7. Breadcrumb Visual

**Problema**: Breadcrumb funcional mas sem peso visual. Poderia ter separadores mais claros e link para níveis anteriores.

**Correção**: Melhorar CSS dos separadores, adicionar hover state.

### 8. Estados Vazios Padronizados

**Problema**: Alguns estados vazios usam texto simples (`∅ Nenhum registro...`) enquanto outros usam ícone. Falta consistência.

**Correção**: Criar componente `EmptyState` reutilizável com ícone, título, descrição e ação sugerida.

---

## Problemas Leves (🟢)

### 9. Tabelas de Dados — Consistência

As tabelas em Documents, Standards, Decisions, Checklists usam padrões diferentes de colunas e formatação.

### 10. Sidebar — Polimento

Sidebar funcional mas poderia ter melhor espaçamento entre seções e ícones mais consistentes.

---

## Prioridade de Correção

| Prioridade | Tela | Problema |
|---|---|---|
| 🔴 P0 | Painel de Governança | Zeros grudados no título |
| 🔴 P0 | Painel de Governança | Sem cards de métrica |
| 🟠 P1 | Chat Pietro | Card de apresentação + chips |
| 🟠 P1 | Chat Pietro | Input visual + loading state |
| 🟡 P2 | Layout geral | max-width + respiro |
| 🟡 P2 | Estados vazios | Componente padronizado |
| 🟢 P3 | Demais telas | Consistência de tabelas e sidebar |
