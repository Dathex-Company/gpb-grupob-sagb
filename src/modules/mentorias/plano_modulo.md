# Plano do Módulo — Central de Mentorias

> **Estado:** Ativo  
> **ID do manifesto:** `mentorias`  
> **Rota base:** `/mentorias`  
> **Responsável:** Agente de Mentorias  
> **Última atualização:** 2026-05-03

---

## 1. Objetivo do Módulo

Governar a biblioteca, acompanhamento e operação de mentorias do SagB. O módulo oferece um hub para estruturação, execução e evolução de programas de mentoria vivos.

---

## 2. Estrutura de Diretórios

```
src/modules/mentorias/
├── agent/
│   ├── falas_user.md
│   ├── persona.md
│   ├── prompt_ativacao_cline.md
│   └── session_log.md
├── hooks/
│   ├── useMentoriaDetail.ts      # Hook de detalhamento (mentoria + relações)
│   └── useMentorias.ts           # Hook de listagem com CRUD completo
├── pages/
│   ├── MentoriasDashboardPage.tsx # Página inicial (Dashboard)
│   ├── MentoriasLibraryPage.tsx   # Biblioteca de mentorias
│   └── MentoriaDetailPage.tsx     # Detalhamento com abas
├── services/
│   └── mentorias.service.ts      # Serviço de dados (Supabase/Firestore)
├── store/
│   └── mentorias.store.ts        # Estado global (Zustand-ready)
├── types/
│   └── mentorias.types.ts        # Tipos e interfaces
├── changelog.md                  # Histórico de versões
├── decisions.md                  # Decisões arquiteturais
├── index.ts                      # Barramento de exportação
├── manifest.ts                   # Manifesto do módulo
├── module-doc.ts                 # Documentação canônica
├── plano_modulo.md               # Este arquivo
└── routes.tsx                    # Roteamento com view state interno
```

---

## 3. Páginas e Funcionalidades

### 3.1 Dashboard (`MentoriasDashboardPage.tsx`)

**Funcionalidades:**
- Visão geral do módulo com header canônico 2 colunas
- Badge "Módulo Oficial" com metadados
- Botão de Docs e "Voltar ao SagB"
- 4 cards de métricas (Total, Em Construção, Sessões, Engajamento)
- Lista de atividade recente (3 itens mockados)
- Painel de próximas sessões
- Card de insights de IA

**Navegação:**
- Botão "Nova Mentoria" → Library
- Clique em item de atividade → Detail
- "Ver Tudo" → Library

### 3.2 Library (`MentoriasLibraryPage.tsx`)

**Funcionalidades:**
- Header com título e busca textual
- Campo de busca com ícone
- Botão de filtros
- Grid de cards de mentorias
- Badge de status (Oficial / Em Construção)
- Estado de loading com spinner
- "Voltar ao Dashboard"

**Dados:**
- Consome `useMentorias()` hook
- Integração com Supabase (`mentorias` table)
- Filtro por `searchTerm` (título e tipo)

### 3.3 Detail (`MentoriaDetailPage.tsx`)

**Funcionalidades:**
- Header com breadcrumb, badge de tipo, versão e título
- Botões "Exportar" e "Nova Versão"
- Navegação por abas: Estrutura, Materiais, Sessões, Agentes, Histórico
- Aba Estrutura: módulos com aulas
- Aba Materiais: grid de arquivos
- Aba Sessões: cards com sala virtual
- Abas Agentes e Histórico: placeholder "Em Breve"
- Estado de loading e "não encontrado"

**Dados:**
- Consome `useMentoriaDetail()` hook
- Carrega dados em paralelo: mentoria + blocos + materiais + sessões
- Integração com Supabase (7 tabelas relacionadas)

---

## 4. Modelo de Dados (Supabase)

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `mentorias` | Entidade principal de mentoria |
| `mentorias_blocos` | Blocos/estrutura de conteúdo |
| `mentorias_materiais` | Materiais de apoio |
| `mentorias_sessoes` | Sessões agendadas |
| `mentorias_versoes` | Histórico de versões |
| `mentorias_agentes` | Agentes vinculados |
| `mentorias_historico` | Log de alterações |

### Tipos Principais

```typescript
interface Mentoria {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  version: string;
  type: 'Carreira' | 'Técnica' | 'Produto' | 'Gestão' | 'Outro';
  lastUpdate: string;
  isActive: boolean;
  blocks?: MentoriaBloco[];
  materials?: MentoriaMaterial[];
  sessions?: MentoriaSessao[];
  versions?: MentoriaVersao[];
  agents?: MentoriaAgente[];
  history?: MentoriaHistorico[];
}
```

---

## 5. Serviço de Dados (`mentorias.service.ts`)

Classe `MentoriasService` com métodos CRUD completos para todas as 7 tabelas:

- `getMentorias(filters)` — listagem com filtros por status/tipo
- `getMentoriaById(id)` — detalhamento com todas as relações
- `createMentoria`, `updateMentoria`, `deleteMentoria` — CRUD principal
- CRUD individual para blocos, materiais, sessões, versões, agentes, histórico
- `uploadMaterial` — placeholder para upload de arquivos

---

## 6. Roteamento

### Roteamento Externo (SagB)
- **Rota:** `/mentorias`
- **Manifest ID:** `mentorias`
- **Fullscreen:** ✅ Ativado
- **Registrado em:** `moduleRegistry.ts`

### Roteamento Interno (View State)
O módulo gerencia suas sub-páginas via estado React, sem poluir o roteador global:

```
MentoriasModuleContainer
├── view = 'dashboard' → <MentoriasDashboardPage>
├── view = 'library'   → <MentoriasLibraryPage>
└── view = 'detail'    → <MentoriaDetailPage>
```

---

## 7. Padrão Canônico Aplicado

| Dimensão | Status |
|----------|--------|
| Container: `flex-1 p-10 bg-sagb-bg text-sagb-text min-h-full font-inter` | ✅ |
| Header canônico 2 colunas com badge + metadata | ✅ |
| Tipografia: `text-3xl font-black`, `text-[12px]`, `text-[10px] font-black` | ✅ |
| Tokens exclusivos (`bg-sagb-*`, `text-sagb-*`, `border-sagb-*`) | ✅ |
| Sem uso de `dark:` prefix | ✅ |
| Sem cores hardcoded (hex/rgb/hsl) | ✅ |
| Owner definido no `manifest.ts` | ✅ |
| `module-doc.ts` sem whitespace | ✅ |
| Fullscreen ativado (`fullscreen: true` na rota) | ✅ |
| Botão de voltar ao SagB (`sagb:navigate` event) | ✅ |
| `plano_modulo.md` documentado | ✅ |
| Pasta `agent/` com 4 arquivos canônicos | ✅ |
| `changelog.md` e `decisions.md` | ✅ |

---

## 8. Integrações

- **ModuleRegistry:** Registrado como `mentoriasManifest` + `mentoriasRoutes`
- **Sidebar:** Ativado via toggle de módulo
- **Fullscreen:** Controlado por `isImmersiveMode` no App.tsx
- **Evento de navegação:** `sagb:navigate` para retorno ao ecosystem

---

## 9. Pendências e Observações

- Dados mockados no Dashboard (atividade recente, próximas sessões)
- Abas "Agentes" e "Histórico" do Detail em estado placeholder
- Método `uploadMaterial` com implementação placeholder
- Store (Zustand) pronto para integração futura
- Owner definido como `'mentorias-agent'` — ajustar quando houver responsável humano definido

---

## 10. Assets Existentes

- Migration: `20260403000001_create_mentorias_tables.sql` (7 tabelas)
- Hooks: `useMentorias` (CRUD), `useMentoriaDetail` (detalhamento)
- Store: Estrutura Zustand-ready
- Service: CRUD completo com Supabase
- Types: 7 entidades tipadas + enums de status/tipo/material
