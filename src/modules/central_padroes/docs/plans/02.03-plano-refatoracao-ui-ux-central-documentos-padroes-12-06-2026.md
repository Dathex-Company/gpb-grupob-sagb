# 🎯 Plano de Refatoração UI/UX — Central de Documentos e Padrões — 12-06-2026

## Estratégia

Refatoração local (R3), sem alterar Supabase, migrations, policies ou secrets. Foco nas telas com pior experiência visual.

---

## 1. Correções Críticas (P0)

### 1.1 Painel de Governança — Zeros Grudados
- **Problema**: `.cp-governance-count` aparece colado ao título da seção
- **Correção**: CSS — adicionar `margin-left: 8px` e `::before { content: "· " }` ou espaçamento
- **Arquivos**: `centralDocs.css`

### 1.2 Painel de Governança — Cards de Métrica
- **Problema**: Seções são listas textuais sem cards visuais
- **Correção**: Adicionar summary cards no topo com totais (pendências, vencidos, sem dono, decisões)
- **Arquivos**: `GovernancePanelPage.tsx`, `centralDocs.css`

---

## 2. Correções Prioritárias (P1)

### 2.1 Chat Pietro — Card de Apresentação
- **Correção**: Adicionar `cp-chat-intro` card com avatar, nome, descrição e chips de perguntas sugeridas
- **Arquivos**: `ChatPietroPage.tsx`, `centralDocs.css`

### 2.2 Chat Pietro — Input e Loading
- **Correção**: Melhorar input area visual, adicionar animação de loading (dots pulsantes)
- **Arquivos**: `ChatPietroPage.tsx`, `centralDocs.css`

---

## 3. Padronização (P2)

### 3.1 Layout — Max-width e Respiro
- **Correção**: `.cp-docs-wrap` com `max-width: 960px`, `margin: 0 auto`, padding lateral
- **Arquivos**: `centralDocs.css`

### 3.2 Estados Vazios
- **Correção**: Componente `EmptyState` reutilizável
- **Arquivos**: `components/EmptyState.tsx` (já existe, revisar)

---

## 4. Arquivos que serão alterados

| Arquivo | Escopo |
|---|---|
| `pages/GovernancePanelPage.tsx` | Cards de métrica + estrutura visual |
| `pages/ChatPietroPage.tsx` | Intro card, chips, loading, input |
| `styles/centralDocs.css` | CSS para governance, chat, layout |
| `components/EmptyState.tsx` | Revisão e padronização |

**Total: 4 arquivos** (dentro do limite de 10 para checkpoint)

---

## 5. O que NÃO será alterado

- Supabase / migrations / policies
- Secrets / env vars
- Lógica de negócio dos serviços
- Rotas (já funcionam)
- Sidebar (funcional, polimento futuro)
- Telas com status 🟢 (já aceitáveis)
