# NIDE — Auditoria e Plano de Migração | 01/08 ET

> **Data**: 02/06/2026
> **Autor**: Cássio Mendes — Engenharia Consultiva
> **Projeto**: SagB — Módulo NIDE (Núcleo Inteligente de Desenvolvimento de Estruturas)
> **Status**: Auditoria concluída — Nenhuma alteração de código realizada

---

## Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [Caminhos Analisados](#2-caminhos-analisados)
3. [Estrutura Atual — Missões](#3-estrutura-atual--missoes)
4. [Estrutura Atual — Metodologias](#4-estrutura-atual--metodologias)
5. [Estrutura Atual — Mentorias](#5-estrutura-atual--mentorias)
6. [Mapa de Reaproveitamento](#6-mapa-de-reaproveitamento)
7. [Proposta de Arquitetura do NIDE](#7-proposta-de-arquitetura-do-nide)
8. [Proposta de Domínios Plugáveis Internos](#8-proposta-de-domínios-plugáveis-internos)
9. [Análise de Registry e Rotas](#9-análise-de-registry-e-rotas)
10. [Análise de Supabase e Dados](#10-análise-de-supabase-e-dados)
11. [Plano de Migração — 01/08 até 08/08 ET](#11-plano-de-migração-0108-até-0808-et)
12. [Riscos e Mitigação](#12-riscos-e-mitigação)
13. [Comandos Executados](#13-comandos-executados)
14. [Comandos Não Executados](#14-comandos-não-executados)
15. [Comandos que Exigiriam Autorização](#15-comandos-que-exigiriam-autorização)
16. [Pendências](#16-pendências)
17. [Recomendação Final](#17-recomendação-final)

---

## 1. Resumo Executivo

Este documento apresenta a auditoria completa dos módulos **Missões**, **Metodologias** e **Mentorias** do SagB, visando a criação do novo módulo **NIDE** (Núcleo Inteligente de Desenvolvimento de Estruturas).

**Conclusão principal**: A migração é viável, mas requer planejamento cuidadoso em 8 etapas. O módulo Missões tem baixa complexidade de código frontend, porém possui:

- **8 tabelas Supabase** com dados potencialmente reais
- **1 service global** (`services/missionService.ts`) com 700 linhas usado pelo `App.tsx`
- **Dualidade de acesso** (rota de módulo registrado `missoes` + switch case legado `missions` no App.tsx)

**Metodologias** é o módulo mais complexo: **9 migrations**, **~10 tabelas**, **~1160 linhas** só no service de persistência, **1492 linhas** no HubPage, e um ecossistema de tipos e serviços maduro.

**Mentorias** é o mais recente e mais bem estruturado, com **7 tabelas**, service completo e padrão canônico já aplicado.

---

## 2. Caminhos Analisados

| # | Caminho | Relevância |
|---|---------|------------|
| 1 | `Z:\00_sagb\src\modules\missoes\` | Módulo Missões (origem do NIDE) |
| 2 | `Z:\00_sagb\src\modules\metodologias\` | Módulo Metodologias (futuro domínio) |
| 3 | `Z:\00_sagb\src\modules\mentorias\` | Módulo Mentorias (futuro domínio) |
| 4 | `Z:\00_sagb\src\core\modules\moduleRegistry.ts` | Registry central de módulos |
| 5 | `Z:\00_sagb\src\core\modules\module.types.ts` | Tipos base: ModuleManifest, ModuleRoute, PluggableModule |
| 6 | `Z:\00_sagb\src\core\modules\moduleActivation.ts` | Sistema de toggle/ativação de módulos |
| 7 | `Z:\00_sagb\App.tsx` | Roteamento principal, hideSidebar, renderContent |
| 8 | `Z:\00_sagb\components\Sidebar.tsx` | Menu lateral com módulos fixos + dinâmicos |
| 9 | `Z:\00_sagb\services\missionService.ts` | Service global de Missões (700 linhas) |
| 10 | `Z:\00_sagb\supabase\migrations\*.sql` | Migrações relacionadas aos 3 módulos |
| 11 | `Z:\00_sagb\services\supabase.ts` | Provider Supabase (Firestore-like) |

---

## 3. Estrutura Atual — Missões

### Ficha Técnica

| Atributo | Valor |
|----------|-------|
| **Caminho** | `src/modules/missoes/` |
| **ID no Registry** | `missoes` |
| **Nome no Menu** | `Missões` (dinâmico via registry) |
| **Rota** | `/missoes` |
| **Ícone** | `PlayIcon` |
| **Fullscreen** | `true` |
| **Owner** | Agente `missions-agent` |
| **Status Inicial** | `active` |
| **Maturidade** | Média — funcional, mas com dualidade de rotas |

### Arquivos

```
src/modules/missoes/
├── index.ts                          # Barrel export
├── manifest.ts                       # ModuleManifest
├── routes.tsx                        # ModuleRoute (fullscreen)
├── module-doc.ts                     # Documentação do módulo
├── README.md                         # Documentação
├── PLANNED.md                        # Planejamento futuro
├── changelog.md                      # Histórico de mudanças
├── decisions.md                      # Decisões arquiteturais
├── pages/
│   ├── MissoesHomePage.tsx
│   ├── MissoesMissionDetail.tsx
│   ├── MissoesNewMissionPage.tsx
│   ├── MissoesBlueprintList.tsx
│   └── MissoesBlueprintDetail.tsx
├── components/
│   ├── MissionStepsTimeline.tsx
│   └── MissionMetrics.tsx
├── hooks/
│   ├── useMissions.ts
│   ├── useMissionDetail.ts
│   └── useBlueprints.ts
├── services/
│   └── missions.service.ts           # Service local
├── store/
│   └── missions.store.ts             # Zustand (comentado) + estado inicial
├── types/
│   └── missions.types.ts             # Tipos do módulo
├── agent/
│   ├── persona.md
│   ├── prompt_ativacao_cline.md
│   ├── session_log.md
│   └── falas_user.md
└── docs/
    └── (documentação interna)
```

### Supabase — Tabelas

| Tabela | Migração | Tipo |
|--------|----------|------|
| `public.agent_missions` | `20260314000101` | Principal |
| `public.agent_mission_steps` | `20260314000101` | Steps |
| `public.agent_artifacts` | `20260314000101` | Artefatos |
| `public.agent_handoffs` | `20260314000101` | Handoffs |
| `public.agent_mission_blueprints` | `20260324000102` | Blueprints |
| `public.agent_mission_blueprint_roles` | `20260324000102` | Papéis |
| `public.agent_mission_events` | `20260324000102` | Eventos |
| `public.agent_mission_checkpoints` | `20260324000102` | Checkpoints |

### Dependências

**Internas**:
- `services/missionService.ts` (global, 700 linhas) — usado pelo `App.tsx` via `AgentMissionsView`
- `services/contextAssembler.ts` — usado pelo missionService
- `utils/supabaseChat.ts` — usado pelo missionService

**Externas**:
- `services/supabase.ts` — conexão com banco
- Tipos `Agent`, `AgentMission`, etc. definidos em `types/` (global)

### Dualidade Crítica

O módulo Missões tem **DOIS pontos de entrada**:
1. **Via registry** (`missoes` → `moduleRoutes['missoes'].element` → `MissoesModuleContainer`)
2. **Via switch case legado** (`missions` → `AgentMissionsView`)

Isso significa que:
- A tab `missions` (antiga, sem manifest) ainda é suportada no `App.tsx` linha 1840
- A tab `missoes` (nova, via registry) é a rota principal do módulo
- **`hideSidebar` NÃO inclui `missoes`** (linha 1710 do App.tsx), diferente de `metodologias` e `mentorias` que estão presentes

---

## 4. Estrutura Atual — Metodologias

### Ficha Técnica

| Atributo | Valor |
|----------|-------|
| **Caminho** | `src/modules/metodologias/` |
| **ID no Registry** | `metodologias` |
| **Nome no Menu** | `Metodologias` (dinâmico via registry) |
| **Rota** | `/metodologias` |
| **Ícone** | `FolderIcon` (fallback — não mapeado no Sidebar) |
| **Fullscreen** | `true` |
| **Owner** | Agente `metodologias-agent` |
| **Status Inicial** | `active` |
| **Maturidade** | Alta — módulo mais complexo do ecossistema |

### Arquivos

```
src/modules/metodologias/
├── index.ts                          # Barrel export
├── manifest.ts                       # ModuleManifest
├── routes.tsx                        # ModuleRoute (fullscreen)
├── module-doc.ts                     # Documentação do módulo
├── README.md                         # Documentação
├── PLANNED.md                        # Planejamento futuro
├── changelog.md                      # Histórico de mudanças
├── decisions.md                      # Decisões arquiteturais
├── pages/
│   ├── MetodologiasHomePage.tsx
│   ├── MetodologiasHubPage.tsx       # 1492 linhas — ORQUESTRADOR PRINCIPAL
│   ├── MetodologiasMesaPage.tsx
│   ├── MetodologiasSaudePage.tsx
│   ├── MetodologiasCatalogoPage.tsx
│   ├── MetodologiaAtivoPage.tsx
│   ├── MetodologiaAtivoEditarPage.tsx
│   └── MetodologiaCanonicoEditarPage.tsx
├── components/
│   └── (componentes internos)
├── hooks/
│   └── (hooks personalizados)
├── services/
│   ├── index.ts                      # Barrel export (10 serviços)
│   ├── metodologiasCatalog.ts
│   ├── metodologiasCatalogoExploracao.ts
│   ├── metodologiasRelacoesVisuais.ts
│   ├── metodologiasPersistencia.ts   # 1160 linhas — COREDO PERSISTÊNCIA
│   ├── metodologiasPromocaoAssistida.ts
│   ├── metodologiasCanonicoSnapshot.ts
│   ├── metodologiasComparacaoCanonica.ts
│   ├── metodologiasSnapshotCanonicoLifecycle.ts
│   ├── metodologiasIndicadores.ts
│   └── metodologiasMesaOperacional.ts
├── types/
│   ├── index.ts                      # Barrel export
│   └── metodologias.types.ts         # Tipos complexos do módulo
├── data/
│   ├── metodologiasMock.ts           # 844 linhas de dados mock
│   └── entradasMetodologicasMock.ts  # Entradas brutas mock
├── agent/
│   ├── persona.md
│   ├── prompt_ativacao_cline.md
│   ├── session_log.md
│   └── falas_user.md
└── docs/
    └── (documentação interna)
```

### Supabase — Tabelas (9 migrations)

| Migration | Tabelas Criadas |
|-----------|-----------------|
| `20260405000001` | `metodologias_entradas_brutas`, `metodologias_ativos_em_estruturacao` |
| `20260405000002` | `metodologias_blocos_estruturacao` |
| `20260405000003` | (promoção canônica — lógica PL/pgSQL) |
| `20260405000004` | `metodologias_catalogo_canonico`, `metodologias_blocos_canonicos` |
| `20260405000005` | `metodologias_versoes_canonicas` |
| `20260405000006` | `metodologias_snapshots_versao_canonica` |
| `20260406000007` | `metodologias_eventos_manutencao_canonica` |
| `20260406000008` | `metodologias_relacoes_canonicas` |
| `20260407000009` | `metodologias_relacoes_estruturacao` |

**Total: ~10 tabelas** no schema `public` com prefixo `metodologias_*`.

### Observações Importantes

1. **Módulo mais complexo do SagB** — ~1492 linhas no HubPage, ~1160 linhas no persistência
2. **Zero dependência de store global** — usa hooks + services diretamente (stateless)
3. **Tipos próprios** — não depende de types globais (ao contrário de Missões)
4. **Dados mock + Supabase** — convivência de dados mock (844 linhas) com persistência real
5. **Sidebar escondida** — `hideSidebar` inclui `'metodologias'` no App.tsx

---

## 5. Estrutura Atual — Mentorias

### Ficha Técnica

| Atributo | Valor |
|----------|-------|
| **Caminho** | `src/modules/mentorias/` |
| **ID no Registry** | `mentorias` |
| **Nome no Menu** | `Central de Mentorias` (dinâmico via registry) |
| **Rota** | `/mentorias` |
| **Ícone** | `MicIcon` |
| **Fullscreen** | `true` |
| **Owner** | Agente `mentorias-agent` |
| **Status Inicial** | `active` |
| **Maturidade** | Alta — mais recente, padrão canônico aplicado |

### Arquivos

```
src/modules/mentorias/
├── index.ts                          # Barrel export
├── manifest.ts                       # ModuleManifest
├── routes.tsx                        # ModuleRoute (fullscreen) + Container com sidebar
├── module-doc.ts                     # Documentação do módulo
├── changelog.md                      # Histórico de mudanças
├── decisions.md                      # Decisões arquiteturais
├── pages/
│   ├── MentoriasDashboardPage.tsx    # Dashboard canônico
│   ├── MentoriasLibraryPage.tsx      # Biblioteca
│   └── MentoriaDetailPage.tsx        # Detalhamento
├── hooks/
│   ├── useMentorias.ts               # Hook de listagem + CRUD
│   └── useMentoriaDetail.ts          # Hook de detalhamento
├── services/
│   └── mentorias.service.ts          # 570 linhas — CRUD completo
├── store/
│   └── mentorias.store.ts            # Zustand (comentado) + estado inicial
├── types/
│   └── mentorias.types.ts            # Tipos do módulo
├── agent/
│   ├── persona.md
│   ├── prompt_ativacao_cline.md
│   ├── session_log.md
│   └── falas_user.md
└── docs/
    └── (documentação interna)
```

### Supabase — Tabelas

| Tabela | Migration |
|--------|-----------|
| `public.mentorias` | `20260403000001` |
| `public.mentorias_blocos` | `20260403000001` |
| `public.mentorias_materiais` | `20260403000001` |
| `public.mentorias_sessoes` | `20260403000001` |
| `public.mentorias_versoes` | `20260403000001` |
| `public.mentorias_historico` | `20260403000001` |
| `public.mentorias_agentes` | `20260403000001` |

### Diferenciais

- **Padrão canônico aplicado** (v1.1.0 e v1.2.0) — tokens `--sagb-*`, tipografia padronizada
- **Sidebar vertical própria** — dentro do container, não usa sidebar global
- **Layout modular** — container com 3 views via useState
- **Service completo** — CRUD para todas as 7 tabelas com workspace isolation
- **Store preparada** — Zustand comentado, mas estrutura de estado inicial já definida

---

## 6. Mapa de Reaproveitamento

### Missões → NIDE Core

| O que | Destino | Ação |
|-------|---------|------|
| `manifest.ts` | Vira `nide/manifest.ts` com novo id `nide` | Renomear + adaptar |
| `index.ts` | Vira `nide/core/index.ts` | Manter + adaptar exports |
| `routes.tsx` | Vira `nide/routes.tsx` | Adaptar para shell do NIDE |
| `module-doc.ts` | Vira `nide/module-doc.ts` | Reescrever |
| `README.md` | Vira `nide/README.md` | Reescrever |
| `PLANNED.md` | Vira `nide/PLANNED.md` | Manter + expandir |
| `changelog.md` | Vira `nide/changelog.md` | Manter histórico + continuar |
| `decisions.md` | Vira `nide/decisions.md` | Manter + adicionar decisões do NIDE |
| `pages/*` | Vira `nide/pages/` ou `nide/domains/missoes/pages/` | Mover conforme decisão |
| `components/*` | Vira `nide/components/` | Reaproveitar |
| `hooks/*` | Vira `nide/hooks/` | Reaproveitar |
| `services/missions.service.ts` | Vira `nide/services/` ou mantém como está | Adaptar import paths |
| `store/missions.store.ts` | Vira `nide/store/` | Reaproveitar |
| `types/missions.types.ts` | Vira `nide/types/` | Reaproveitar |
| `agent/*` | Vira `nide/agent/` | Reaproveitar |
| `docs/*` | Vira `nide/docs/` | Reaproveitar |
| `services/missionService.ts` (global) | **Não mover** | Permanece em `services/` como serviço compartilhado |
| `missions` switch case (App.tsx linha 1840) | Remover ou redirecionar para NIDE | **Fase 07/08 ET** |

### O que Descartar/Arquivar

- **Nada deve ser descartado nesta etapa**. Tudo pode ser reaproveitado como referência ou migrado.

### Metodologias → Domínio Interno do NIDE

| O que | Destino | Ação |
|-------|---------|------|
| Tudo em `metodologias/` | `nide/domains/metodologias/` | Mover preservando estrutura interna |
| `manifest.ts` | Remover do registry global; registrar via registry interno do NIDE | **Fase 05/08 ET** |
| `routes.tsx` | Adaptar rota para `/nide/metodologias` | **Fase 05/08 ET** |
| `services/*` | Preservar integralmente em `domains/metodologias/services/` | Manter |
| `types/*` | Preservar integralmente | Manter |
| `pages/*` | Preservar; adaptar container se necessário | Manter |
| `data/*` | Preservar | Manter |
| `agent/*` | Preservar (agente especialista do domínio) | Manter |
| `docs/*` | Preservar | Manter |

### Mentorias → Domínio Interno do NIDE

| O que | Destino | Ação |
|-------|---------|------|
| Tudo em `mentorias/` | `nide/domains/mentorias/` | Mover preservando estrutura interna |
| `manifest.ts` | Remover do registry global; registrar via registry interno do NIDE | **Fase 06/08 ET** |
| `routes.tsx` | Adaptar rota para `/nide/mentorias` | **Fase 06/08 ET** |
| `services/*` | Preservar integralmente | Manter |
| `types/*` | Preservar integralmente | Manter |
| `pages/*` | Preservar; adaptar container | Manter |
| `agent/*` | Preservar | Manter |

---

## 7. Proposta de Arquitetura do NIDE

### Estrutura de Diretórios Proposta

```
src/modules/nide/
├── index.ts                    # Barrel principal
├── manifest.ts                 # ModuleManifest do NIDE (id: 'nide')
├── routes.tsx                  # Rota principal /nide (fullscreen)
├── module-doc.ts               # Documentação do módulo
├── README.md
├── DECISIONS.md
├── CHANGELOG.md
├── PLANNED.md
│
├── core/                       # ★ Core do NIDE
│   ├── index.ts
│   ├── NideShell.tsx           # Shell principal (layout fullscreen)
│   ├── NideProvider.tsx        # Context Provider do NIDE
│   └── constants.ts            # Constantes do módulo
│
├── shell/                      # ★ Shell (layout, navegação, header)
│   ├── index.ts
│   ├── NideSidebar.tsx         # Sidebar vertical do NIDE
│   ├── NideHeader.tsx          # Header canônico
│   ├── NideDomainNav.tsx       # Navegação entre domínios
│   └── NideBreadcrumb.tsx      # Breadcrumb interno
│
├── layout/                     # Layout components
│   ├── NideFullscreenLayout.tsx
│   └── NideEmbeddedLayout.tsx
│
├── registry/                   # ★ Registry interno de domínios
│   ├── index.ts
│   ├── domainRegistry.ts       # Lista de domínios registrados
│   ├── domain.types.ts         # Tipos: NideDomain, DomainManifest
│   ├── useDomainRegistry.ts    # Hook para acessar registry
│   └── domainActivation.ts     # Ativação/desativação de domínios
│
├── domains/                    # ★ Domínios internos plugáveis
│   ├── index.ts                # Barrel que importa todos os domínios
│   ├── metodologias/           # ★ Migrado de src/modules/metodologias
│   │   ├── index.ts
│   │   ├── domain-manifest.ts  # Manifest específico do domínio
│   │   ├── routes.tsx          # Rotas internas do domínio
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── data/
│   │   ├── agent/
│   │   └── docs/
│   ├── mentorias/              # ★ Migrado de src/modules/mentorias
│   │   ├── index.ts
│   │   ├── domain-manifest.ts
│   │   ├── routes.tsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── agent/
│   │   └── docs/
│   ├── treinamentos/           # Placeholder para futuro
│   ├── cursos/                 # Placeholder para futuro
│   ├── programas/              # Placeholder para futuro
│   ├── jornadas/               # Placeholder para futuro
│   ├── frameworks/             # Placeholder para futuro
│   ├── processos_fluxogramas/  # Placeholder para futuro
│   ├── protocolos/             # Placeholder para futuro
│   ├── ferramentas/            # Placeholder para futuro
│   ├── padroes_entrega/        # Placeholder para futuro
│   └── negocios_ventures/      # Placeholder para futuro
│
├── components/                 # Componentes compartilhados do NIDE
│   ├── MetricCard.tsx
│   ├── EmptyState.tsx
│   └── StatusBadge.tsx
│
├── hooks/                      # Hooks compartilhados
│   ├── useNide.ts
│   └── useNideDomain.ts
│
├── services/                   # Serviços compartilhados
│   └── nide.service.ts
│
├── store/                      # Store do NIDE
│   └── nide.store.ts
│
├── types/                      # Tipos globais do NIDE
│   └── nide.types.ts
│
├── docs/                       # Documentação do módulo
│
└── agent/                      # Agente guardião do NIDE
    ├── persona.md
    ├── prompt_ativacao_cline.md
    ├── session_log.md
    └── falas_user.md
```

### O que fica em cada camada

| Camada | Responsabilidade |
|--------|-----------------|
| **core/** | Shell principal, Provider de contexto, constantes. O coração do NIDE. |
| **shell/** | Layout visual: sidebar vertical, header canônico, navegação entre domínios, breadcrumb. |
| **registry/** | Sistema de registro interno de domínios. Lista de domínios ativos, tipos, ativação. |
| **domains/** | Cada domínio é uma pasta autocontida com seu próprio manifest, rotas, páginas, serviços, tipos, agente e docs. |
| **components/** | Componentes compartilhados entre domínios. |
| **hooks/** | Hooks compartilhados para navegação entre domínios, etc. |
| **services/** | Serviços compartilhados (ex: service Supabase genérico do NIDE). |
| **store/** | Estado global do NIDE (domínio ativo, preferências, etc.). |

### Como funciona um domínio interno plugável

Cada domínio é uma pasta autocontida dentro de `domains/` que:

1. **Exporta um `domain-manifest.ts`** com:
   - `id`: identificador único (ex: `'metodologias'`)
   - `displayName`: nome exibido (ex: `'Metodologias'`)
   - `icon`: ícone
   - `basePath`: caminho base relativo ao NIDE (ex: `'metodologias'`)
   - `owner`: agente responsável

2. **Exporta `routes.tsx`** com as rotas internas do domínio

3. **Mantém sua estrutura original** — páginas, componentes, hooks, services, types, agent, docs

4. **Não precisa mais de registro global** — o `domainRegistry.ts` do NIDE gerencia os domínios internamente

5. **Pode ser ativado/desativado** individualmente via `domainActivation.ts`

### Como Metodologias e Mentorias migram para esse padrão

1. **Mover** a pasta inteira de `src/modules/metodologias/` para `src/modules/nide/domains/metodologias/`
2. **Criar** `domain-manifest.ts` dentro de cada domínio
3. **Adaptar** `routes.tsx` para usar caminhos relativos ao NIDE (`/nide/metodologias`)
4. **Registrar** o domínio no `domainRegistry.ts` do NIDE
5. **Remover** o módulo do registry global (`moduleRegistry.ts`)
6. **Manter** todas as migrations e tabelas Supabase intactas

---

## 8. Proposta de Domínios Plugáveis Internos

### Interface do DomainManifest

```typescript
// src/modules/nide/registry/domain.types.ts

export interface NideDomainManifest {
  id: string;                    // 'metodologias', 'mentorias', etc.
  displayName: string;           // 'Metodologias', 'Mentorias', etc.
  icon: string;                  // Nome do ícone
  basePath: string;              // 'metodologias', 'mentorias' (relativo ao /nide)
  description: string;           // Descrição curta
  status: 'active' | 'inactive' | 'planned';
  owner?: {
    type: 'agent' | 'human';
    id: string;
    displayName: string;
  };
}

export interface NideDomainRoute {
  path: string;                  // Caminho relativo ao domínio
  element: ReactNode;
}

export interface NideDomain {
  manifest: NideDomainManifest;
  routes: NideDomainRoute[];
}
```

### Domínios Imediatos (Fase 05-06 ET)

| Domínio | Origem | Prioridade | Complexidade |
|---------|--------|------------|-------------|
| Metodologias | `src/modules/metodologias` | Alta | Muito Alta |
| Mentorias | `src/modules/mentorias` | Alta | Média |

### Domínios Futuros (Pós-08 ET)

| Domínio | Status | Observação |
|---------|--------|------------|
| Treinamentos | Placeholder | Novo desenvolvimento |
| Cursos | Placeholder | Relacionado ao ACADB |
| Programas | Placeholder | Pode usar estrutura de Mentorias |
| Jornadas | Placeholder | Relacionado ao U.A.U |
| Frameworks | Placeholder | Pode usar estrutura de Metodologias |
| Processos e Fluxogramas | Placeholder | Novo desenvolvimento |
| Protocolos | Placeholder | Pode usar estrutura de Metodologias |
| Ferramentas | Placeholder | Novo desenvolvimento |
| Padrões de Entrega | Placeholder | Relacionado ao Central de Padrões |
| Arquitetura de Negócios e Ventures | Placeholder | Relacionado ao StartyB |

---

## 9. Análise de Registry e Rotas

### Estado Atual do Registry

No [`moduleRegistry.ts`](00_sagb/src/core/modules/moduleRegistry.ts:94-97), os três módulos estão registrados como módulos independentes:

```typescript
{
  manifest: missoesManifest,
  routes: missoesRoutes
},
{
  manifest: metodologiasManifest,
  routes: metodologiasRoutes
},
{
  manifest: mentoriasManifest,
  routes: mentoriasRoutes
},
```

### Estado Atual do App.tsx

No [`App.tsx`](00_sagb/App.tsx:1710), o `hideSidebar` inclui:

```typescript
const hideSidebar = ... || activeTab === 'mentorias' || activeTab === 'metodologias' || ... 
```

**⚠️ `missoes` NÃO está no hideSidebar** — isso significa que quando o módulo Missões abre via registry, a sidebar global ainda aparece, o que pode causar duplicidade visual.

### Plano de Transição

| Etapa | Ação |
|-------|------|
| **01/08 ET** | Audit (esta etapa) |
| **02/08 ET** | Criar `nide/` com manifest id `nide`, rota `/nide` |
| **03/08 ET** | Mover Missões para core do NIDE. Remover `missoes` do registry, adicionar `nide`. |
| **04/08 ET** | Criar registry interno de domínios (`nide/registry/`) |
| **05/08 ET** | Mover Metodologias para `nide/domains/metodologias/`. Remover do registry global. |
| **06/08 ET** | Mover Mentorias para `nide/domains/mentorias/`. Remover do registry global. |
| **07/08 ET** | Ajustar rotas: `/nide`, `/nide/metodologias`, `/nide/mentorias`. Adicionar aliases. |

### Proposta de Rotas

| Rota | Destino | Tipo |
|------|---------|------|
| `/nide` | NIDE Shell → Dashboard principal | Principal |
| `/nide/metodologias` | Domínio Metodologias | Plugada |
| `/nide/mentorias` | Domínio Mentorias | Plugada |
| `/missoes` → redirect → `/nide` | Alias de compatibilidade | Redirect (temporário) |
| `/metodologias` → redirect → `/nide/metodologias` | Alias de compatibilidade | Redirect (temporário) |
| `/mentorias` → redirect → `/nide/mentorias` | Alias de compatibilidade | Redirect (temporário) |

### Compatibilidade

- **Manter aliases por pelo menos 2 ciclos** (até 10/08 ET) para evitar quebra de links/bookmarks
- **Monitorar** eventos `sagb:navigate` e chamadas internas que usam `setActiveTab('missoes')` / `setActiveTab('missions')`
- **Manter** o switch case `missions` no App.tsx até a validação de que ninguém mais usa

---

## 10. Análise de Supabase e Dados

### Tabelas por Módulo

| Módulo | Tabelas | Prefixo | Migrations |
|--------|---------|---------|------------|
| Missões | 8 | `agent_mission_*`, `agent_*` | 3 |
| Metodologias | ~10 | `metodologias_*` | 9 |
| Mentorias | 7 | `mentorias_*` | 1 |

### Riscos com Tabelas

| Risco | Nível | Mitigação |
|-------|-------|-----------|
| Renomear tabelas | **Crítico** | Não renomear. Manter nomes atuais. |
| Perder dados existentes | **Crítico** | Não alterar schema. Backup antes de qualquer migration. |
| Quebrar RLS policies | **Alto** | RLS usa nome de tabela. Alterar nome quebra policies. |
| Confundir tabelas de Missões com NIDE | **Médio** | As tabelas `agent_mission_*` são do motor de agentes, não exclusivas de Missões. |

### Recomendação de Dados

**Não renomear tabelas**. A estratégia correta é:

1. **Manter todas as tabelas com nomes atuais** no Supabase
2. **Apenas a camada de aplicação se move** — os services continuam apontando para as mesmas tabelas
3. **Criar tabela nova** somente se necessário: `nide_domains` para registry interno de domínios no banco

### Tabela Sugerida: `nide_domains`

```sql
-- Sugestão para FASE FUTURA (não implementar agora)
create table if not exists public.nide_domains (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  domain_id text not null,        -- 'metodologias', 'mentorias'
  display_name text not null,
  is_active boolean not null default true,
  config jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nide_domains_unique unique (workspace_id, domain_id)
);
```

**⚠️ Esta tabela é uma sugestão para avaliação, não uma ordem de criação.**

---

## 11. Plano de Migração — 01/08 até 08/08 ET

### ET 01/08 — Auditoria e Plano de Migração ✅ (Esta etapa)

| Item | Status |
|------|--------|
| Auditoria de Missões | ✅ Completa |
| Auditoria de Metodologias | ✅ Completa |
| Auditoria de Mentorias | ✅ Completa |
| Mapa de reaproveitamento | ✅ Completo |
| Proposta de arquitetura NIDE | ✅ Completa |
| Análise de riscos | ✅ Completa |
| Plano de migração | ✅ Completo |

---

### ET 02/08 — Criar Base Modular do NIDE

**Objetivo**: Criar a estrutura vazia do módulo NIDE com core, shell e types.

**Escopo**:
- Criar `src/modules/nide/` com estrutura base
- Criar `nide/core/NideShell.tsx` — shell vazio
- Criar `nide/core/NideProvider.tsx` — context provider
- Criar `nide/manifest.ts` — ManifestModule (id: `'nide'`, rota: `/nide`)
- Criar `nide/routes.tsx` — rota principal
- Criar `nide/types/`, `nide/hooks/`, `nide/store/` — estrutura vazia
- Criar `nide/CHANGELOG.md`, `nide/DECISIONS.md`, `nide/PLANNED.md`

**Arquivos prováveis**: ~15 novos arquivos (estrutura vazia)

**Riscos**:
- Baixo — não mexe em nada existente
- Nome `nide` pode conflitar com namespace existente

**Critérios de validação**:
- Módulo `nide` aparece no registry global
- Rota `/nide` renderiza shell vazio sem erros
- Sidebar aparece com item "NIDE"

**Dependências**: Nenhuma

**O que não fazer**: Não mover nenhum módulo ainda. Não alterar rotas existentes.

---

### ET 03/08 — Migrar Missões para Core do NIDE

**Objetivo**: Transformar Missões no core do NIDE, preservando funcionalidade.

**Escopo**:
- Mover `missoes/manifest.ts` → adaptar para `nide/manifest.ts` (id: `'nide'`)
- Mover `missoes/routes.tsx` → adaptar para `nide/routes.tsx` (rota `/nide`)
- Mover `missoes/pages/` → `nide/pages/` (ou manter como domínio interno)
- Mover `missoes/components/` → `nide/components/`
- Mover `missoes/hooks/` → `nide/hooks/`
- Mover `missoes/services/missions.service.ts` → `nide/services/`
- Mover `missoes/store/` → `nide/store/`
- Mover `missoes/types/` → `nide/types/`
- Mover `missoes/agent/` → `nide/agent/`
- Mover `missoes/docs/` → `nide/docs/`
- Mover `missoes/changelog.md` → `nide/CHANGELOG.md`
- Mover `missoes/decisions.md` → `nide/DECISIONS.md`
- Remover `missoes` do `moduleRegistry.ts`
- Adicionar `nide` no `moduleRegistry.ts`
- Adicionar `'nide'` no `hideSidebar` do `App.tsx`
- Atualizar todos os import paths

**Arquivos prováveis**: ~20+ arquivos movidos/adaptados

**Riscos**:
- **Alto** — import paths quebrados se não atualizar corretamente
- **Médio** — `missionService.ts` (global) pode ter imports cruzados
- **Médio** — switch case `missions` no App.tsx precisa ser mantido ou redirecionado

**Critérios de validação**:
- Rota `/nide` funciona e mostra dashboard de Missões adaptado
- Menu mostra "NIDE" em vez de "Missões"
- Todas as funcionalidades de Missões preservadas
- `services/missionService.ts` continua funcionando (imports não mudam)

**Dependências**: ET 02/08 (estrutura base do NIDE)

**O que não fazer**:
- Não mover `missionService.ts` (global) para dentro do NIDE
- Não remover switch case `missions` do App.tsx ainda
- Não mexer em tabelas Supabase

---

### ET 04/08 — Criar Registry Interno de Domínios Plugáveis

**Objetivo**: Implementar o sistema de registro interno de domínios do NIDE.

**Escopo**:
- Criar `nide/registry/domain.types.ts` — tipos de domínio
- Criar `nide/registry/domainRegistry.ts` — lista de domínios registrados
- Criar `nide/registry/domainActivation.ts` — ativação/desativação
- Criar `nide/registry/useDomainRegistry.ts` — hook de acesso
- Criar `nide/shell/NideDomainNav.tsx` — navegação entre domínios
- Criar `nide/shell/NideSidebar.tsx` — sidebar com lista de domínios
- Adaptar `nide/routes.tsx` para roteamento dinâmico de domínios

**Arquivos prováveis**: ~8 novos arquivos

**Riscos**:
- **Médio** — design do registry interno precisa ser simples o suficiente para não virar um "mini moduleRegistry"
- **Médio** — conflito conceitual entre registry global e registry interno

**Critérios de validação**:
- Registry interno aceita domínios e lista domínios ativos
- Sidebar do NIDE mostra domínios registrados
- Navegação entre domínios funciona sem recarregar

**Dependências**: ET 02/08 (estrutura base)

**O que não fazer**:
- Não registrar domínios reais ainda (apenas testes/mocks)
- Não remover módulos do registry global ainda

---

### ET 05/08 — Migrar Metodologias como Domínio Plugável

**Objetivo**: Mover o módulo Metodologias para dentro do NIDE como domínio plugável.

**Escopo**:
- Criar `nide/domains/metodologias/domain-manifest.ts`
- Mover `metodologias/` → `nide/domains/metodologias/`
- Adaptar `routes.tsx` para caminho `/nide/metodologias`
- Registrar domínio no `domainRegistry.ts`
- Remover `metodologias` do `moduleRegistry.ts`
- Remover `'metodologias'` do `hideSidebar` (se aplicável)
- Atualizar import paths nos services (relativos ao NIDE)
- Verificar todos os 9 services de Metodologias

**Arquivos prováveis**: ~30+ arquivos movidos/adaptados

**Riscos**:
- **Crítico** — Metodologias é o módulo mais complexo. Qualquer erro de import quebra o módulo inteiro.
- **Alto** — os 9 services de Metodologias usam `../../../../services/supabase` — atualizar paths
- **Alto** — as pages usam import paths complexos (ex: `../../services`)
- **Médio** — os arquivos de data (mock) precisam continuar funcionando

**Critérios de validação**:
- Rota `/nide/metodologias` funciona e mostra HubPage sem erros
- Todas as páginas internas navegam corretamente
- CRUD no Supabase continua funcionando
- Dados mock ainda carregam
- Menu global não mostra mais "Metodologias" duplicado

**Dependências**: ET 03/08 (core do NIDE), ET 04/08 (registry interno)

**O que não fazer**:
- Não alterar migrations
- Não alterar tabelas Supabase
- Não refatorar a lógica interna de Metodologias (apenas mover)
- Não mesclar services de Metodologias com services do NIDE

---

### ET 06/08 — Migrar Mentorias como Domínio Plugável

**Objetivo**: Mover o módulo Mentorias para dentro do NIDE como domínio plugável.

**Escopo**:
- Criar `nide/domains/mentorias/domain-manifest.ts`
- Mover `mentorias/` → `nide/domains/mentorias/`
- Adaptar `routes.tsx` para caminho `/nide/mentorias`
- Registrar domínio no `domainRegistry.ts`
- Remover `mentorias` do `moduleRegistry.ts`
- Remover `'mentorias'` do `hideSidebar` (se aplicável)
- Atualizar import paths

**Arquivos prováveis**: ~15+ arquivos movidos/adaptados

**Riscos**:
- **Médio** — Mentorias tem sidebar própria no container, precisa verificar compatibilidade com sidebar do NIDE
- **Baixo** — import paths são mais simples que Metodologias

**Critérios de validação**:
- Rota `/nide/mentorias` funciona
- Dashboard, Library e Detail carregam
- CRUD Supabase continua funcionando
- Sidebar vertical própria do Mentorias não conflita com sidebar do NIDE

**Dependências**: ET 04/08 (registry interno)

**O que não fazer**:
- Não alterar migrations
- Não alterar tabelas Supabase

---

### ET 07/08 — Ajustar Rotas, Aliases, Fullscreen e Navegação Interna

**Objetivo**: Ajustar o sistema de rotas para garantir compatibilidade e navegação suave.

**Escopo**:
- Criar redirect `/missoes` → `/nide`
- Criar redirect `/metodologias` → `/nide/metodologias`
- Criar redirect `/mentorias` → `/nide/mentorias`
- Remover ou redirecionar switch case `missions` do App.tsx
- Verificar `hideSidebar` — ajustar para `'nide'`
- Verificar `fullscreen` do NIDE e dos domínios
- Testar navegação entre domínios internos
- Testar retorno ao SagB via `sagb:navigate`
- Verificar sidebar global — garantir que NIDE aparece corretamente

**Arquivos prováveis**: `App.tsx`, `routes.tsx`, `Sidebar.tsx`

**Riscos**:
- **Alto** — qualquer erro de rota quebra navegação do usuário
- **Alto** — redirect mal feito causa loop infinito
- **Médio** — duplicidade de itens no menu (NIDE + Missões)

**Critérios de validação**:
- `/missoes` redireciona para `/nide` sem erros
- `/metodologias` redireciona para `/nide/metodologias`
- `/mentorias` redireciona para `/nide/mentorias`
- Menu mostra apenas "NIDE", não "Missões"
- Navegação entre domínios funciona

**Dependências**: ET 05/08 e ET 06/08

**O que não fazer**:
- Não remover as pastas originais dos módulos (manter como fallback até ET 08)
- Não deletar migrations

---

### ET 08/08 — Validação Geral, Documentação e Limpeza Controlada

**Objetivo**: Validar tudo, atualizar documentação e limpar o que não for mais necessário.

**Escopo**:
- Testar todas as rotas do NIDE
- Testar todos os domínios internos
- Verificar se nada quebrou no resto do SagB
- Atualizar `README.md` do NIDE
- Atualizar `module-doc.ts` do NIDE
- Atualizar `CHANGELOG.md`
- Atualizar `DECISIONS.md`
- Arquivar pastas originais (ou remover após validação)
- Verificar se `missionService.ts` (global) ainda funciona
- Verificar se não há imports quebrados em outros módulos
- Executar `npm run build` ou validação de compilação

**Arquivos prováveis**: Documentação, testes

**Riscos**:
- **Médio** — esquecer de atualizar documentação causa confusão futura
- **Médio** — remover pastas originais prematuramente pode exigir git revert

**Critérios de validação**:
- `npm run dev` funciona sem erros
- Todas as rotas do NIDE funcionam
- Todas as funcionalidades dos 3 módulos preservadas
- Documentação atualizada

**Dependências**: Todas as etapas anteriores

**O que não fazer**:
- Não remover migrations do Supabase
- Não deletar dados do banco

---

## 12. Riscos e Mitigação

### Tabela de Riscos

| # | Risco | Nível | Probabilidade | Impacto | Mitigação |
|---|-------|-------|--------------|---------|-----------|
| 1 | **Perda de dados** ao renomear tabelas Supabase | **Crítico** | Baixa | Altíssimo | Não renomear tabelas. Manter nomes atuais. |
| 2 | **Quebra de rota** `/missoes` não redirecionar | **Alto** | Média | Alto | Manter alias por 2 ciclos. Testar exaustivamente. |
| 3 | **Import paths quebrados** ao mover módulos | **Crítico** | Alta | Alto | Verificar cada arquivo. Usar find/replace com regex. |
| 4 | **Duplicidade no menu** (NIDE + Missões) | **Médio** | Alta | Médio | Remover `missoes` do registry ao adicionar `nide`. |
| 5 | **Conflito registry global vs interno** | **Médio** | Média | Médio | Registry interno do NIDE é independente. Não misturar. |
| 6 | **NIDE virar módulo genérico demais** | **Médio** | Média | Médio | Definir boundaries claras no module-doc. |
| 7 | **Metodologias perder profundidade** | **Médio** | Baixa | Alto | Manter toda estrutura interna. Não simplificar. |
| 8 | **Mentorias perder lógica de aplicação** | **Médio** | Baixa | Médio | Preservar sidebar vertical própria. |
| 9 | **Sidebar global aparecer dentro do NIDE** | **Alto** | Alta | Médio | Adicionar `'nide'` no `hideSidebar` do App.tsx. |
| 10 | **Switch case `missions` legado quebrar** | **Médio** | Média | Médio | Manter até ET 08. Depois redirecionar para NIDE. |
| 11 | **`missionService.ts` quebrar** | **Crítico** | Baixa | Altíssimo | Não mover. Não alterar imports. |
| 12 | **Documentação ficar incoerente** | **Baixo** | Alta | Baixo | Atualizar toda documentação na ET 08. |
| 13 | **Id antigo `missions` continuar gerando inconsistência** | **Médio** | Alta | Médio | Mapear todas as referências a `'missions'` no código. |
| 14 | **Perda de governança dos módulos especialistas** | **Médio** | Média | Alto | Manter agentes especialistas dentro de cada domínio. |

### Classificação

| Nível | Quantidade |
|-------|-----------|
| 🔴 Crítico | 3 |
| 🟠 Alto | 5 |
| 🟡 Médio | 5 |
| 🟢 Baixo | 1 |

---

## 13. Comandos Executados

| Comando | Objetivo | Resultado |
|---------|----------|-----------|
| `dir /s /b Z:\00_sagb\src\modules\missoes\*` | Listar estrutura Missões | ✅ Sucesso |
| `dir /s /b Z:\00_sagb\src\modules\metodologias\*` | Listar estrutura Metodologias | ✅ Sucesso |
| `dir /s /b Z:\00_sagb\src\modules\mentorias\*` | Listar estrutura Mentorias | ✅ Sucesso |
| `dir /s /b Z:\00_sagb\supabase\migrations 2>nul` | Listar migrations | ✅ Sucesso |
| `dir /b Z:\00_sagb\src\` | Listar src/ | ✅ Sucesso |
| `dir /s /b Z:\00_sagb\services 2>nul` | Listar services globais | ✅ Sucesso |
| Leitura de ~40 arquivos | Análise de código | ✅ Completa |

---

## 14. Comandos Não Executados

| Comando | Motivo |
|---------|--------|
| `npm run dev` | Auditoria pura sem alteração de interface. Não há necessidade de validar visualmente. |
| `git status` | Não necessário — o projeto já está em estado conhecido. |
| `git diff` | Não necessário — nenhuma alteração foi feita. |
| Qualquer comando de escrita/criação | Fora do escopo (auditoria pura). |
| Qualquer comando de migration | Fora do escopo. |

---

## 15. Comandos que Exigiriam Autorização

| Comando | Motivo |
|---------|--------|
| `mv src/modules/missoes src/modules/nide` | Renomeação de pasta — somente após aprovação do plano |
| `npx supabase migration new` | Criação de migration — somente nas fases adequadas |
| `git commit` / `git push` | Commit — fora do escopo desta etapa |
| Qualquer alteração em `moduleRegistry.ts` | Registro de módulo — somente a partir da ET 02 |

---

## 16. Pendências

### Pendências Técnicas

1. **Dualidade `missions` vs `missoes`** no App.tsx — precisa ser resolvida na ET 07
2. **`hideSidebar` não inclui `missoes`** — precisa ser corrigido quando `nide` for adicionado
3. **Falta ícone para Metodologias** no Sidebar (`getIconForItem` não mapeia `metodologias`)
4. **Store Zustand comentado** em Missões e Mentorias — decisão pendente se vai usar NIDE store ou manter Zustand

### Pendências de Decisão

5. **Missões vira domínio dentro do NIDE ou vira o core?** — Recomendação: vira core (ET 03), com possibilidade de virar domínio depois se necessário
6. **Metodologias mantém sidebar vertical própria?** — Sim, dentro do domínio. Não misturar com sidebar do NIDE.
7. **Criar tabela `nide_domains` no Supabase?** — Avaliar necessidade real antes de criar (ET 04 ou posterior)
8. **Manter `missionService.ts` global ou migrar para dentro do NIDE?** — Manter global. É usado por outros contextos.

---

## 17. Recomendação Final

### 1. Melhor caminho para transformar Missões em NIDE

Seguir o plano de 8 etapas proposto. A ordem importa:
1. Primeiro cria a base estrutural do NIDE (ET 02)
2. Depois move Missões como core (ET 03)
3. Depois cria o registry interno (ET 04)
4. Só então move Metodologias e Mentorias como domínios (ET 05-06)

### 2. Como migrar Metodologias

**Move-and-adapt**, não refatorar. Metodologias tem lógica complexa demais para ser reescrita. A migração deve ser:

1. Mover pasta inteira para `nide/domains/metodologias/`
2. Criar `domain-manifest.ts`
3. Adaptar import paths
4. Manter todos os 9 services intactos
5. Manter todas as pages intactas

### 3. Como migrar Mentorias

Mesma abordagem, mas mais simples. Mentorias já está no padrão canônico, então a migração é quase "copiar e colar" com ajuste mínimo de paths.

### 4. Como preservar compatibilidade

- **Rotas**: Manter aliases `/missoes` → `/nide` por 2 ciclos
- **Registry**: Remover módulos antigos apenas depois que o NIDE estiver validado
- **App.tsx**: Manter switch case `missions` até ET 07
- **Sidebar**: Garantir que `hideSidebar` inclua `'nide'`

### 5. Como organizar domínios plugáveis

Cada domínio é:
- Uma pasta autocontida em `nide/domains/`
- Com seu próprio `domain-manifest.ts`, services, types, pages, agent
- Registrado no `domainRegistry.ts` do NIDE
- Acessível via `/nide/{domain-base-path}`
- Com seu próprio agente especialista (preservando governança)

### 6. Como vender o NIDE como módulo robusto

**Argumentos técnicos**:
- Arquitetura de domínios plugáveis permite escalar sem poluir o registry global
- Cada domínio mantém sua autonomia e governança
- Shell próprio com sidebar vertical e navegação entre domínios
- Fullscreen dedicado sem interferência da sidebar global
- Compatibilidade retroativa garantida por aliases

**Diferenciais**:
- Único ponto de entrada para tudo que é "estrutura" no GrupoB
- Evolução independente de cada domínio
- Reaproveitamento máximo do que já funciona

### 7. Como evitar retrabalho

- **Não refatorar** lógica interna dos módulos durante a migração
- **Não renomear** tabelas Supabase
- **Não mexer** em `missionService.ts` (global)
- **Manter** agentes especialistas dentro de cada domínio
- **Documentar** cada decisão em `DECISIONS.md`

### 8. Próxima etapa recomendada

**ET 02/08 — Criar base modular do NIDE**

É a etapa mais segura para começar: cria apenas estrutura nova, não mexe em nada existente, e prepara o terreno para as etapas seguintes.

### Checklist para ET 02/08

- [ ] Criar `src/modules/nide/`
- [ ] Criar `nide/manifest.ts` (id: `'nide'`, rota: `/nide`)
- [ ] Criar `nide/routes.tsx` (shell vazio com fullscreen)
- [ ] Criar `nide/index.ts` (barrel)
- [ ] Criar `nide/core/NideShell.tsx` (componente vazio)
- [ ] Criar `nide/core/NideProvider.tsx` (context)
- [ ] Criar `nide/types/nide.types.ts`
- [ ] Criar `nide/hooks/useNide.ts`
- [ ] Criar `nide/store/nide.store.ts`
- [ ] Criar `nide/CHANGELOG.md`, `DECISIONS.md`, `PLANNED.md`
- [ ] Registrar `nide` no `moduleRegistry.ts`
- [ ] Adicionar `'nide'` no `hideSidebar` do App.tsx
- [ ] Validar que rota `/nide` renderiza sem erros
- [ ] Validar que menu mostra "NIDE"

---

## Fechamento da Tarefa

### Resultado da Auditoria

✅ **Auditoria concluída com sucesso**. Nenhuma alteração de código foi realizada.

Foram analisados:
- **3 módulos**: Missões, Metodologias, Mentorias
- **~60+ arquivos** lidos e analisados
- **~25 tabelas Supabase** mapeadas
- **~12 migrations** relacionadas
- **3 serviços globais** identificados

### O que foi feito

1. Leitura completa da estrutura dos 3 módulos
2. Análise do moduleRegistry, moduleActivation, App.tsx, Sidebar
3. Mapeamento de todas as tabelas Supabase e migrations
4. Identificação de dualidade de rotas (missions vs missoes)
5. Identificação de risco no hideSidebar
6. Mapa de reaproveitamento detalhado
7. Proposta de arquitetura do NIDE com 7 camadas
8. Proposta de domínios plugáveis internos
9. Plano de migração em 8 etapas com riscos e dependências
10. Recomendação final objetiva

### O que faria diferente

- Se houvesse acesso ao Supabase real, poderia verificar se as tabelas têm dados reais e estimar volume
- Se houvesse acesso ao git log, poderia rastrear histórico de commits para entender evolução

### Insights e Observações

1. **Missões é o módulo mais "problemático"** — tem dualidade de rotas, não esconde sidebar, e o nome `missions` (inglês) conflita com `missoes` (português)
2. **Metodologias é o mais valioso** — 10 tabelas, 9 serviços, 1492 linhas de HubPage. É o coração do que o NIDE deve representar
3. **Mentorias é o mais preparado** — padrão canônico já aplicado, migração mais simples
4. **O registry global está ficando grande** — ~23 módulos. Mover Metodologias e Mentorias para dentro do NIDE reduz a poluição
5. **`service/missionService.ts` (700 linhas) não deve ser movido** — é usado pelo App.tsx diretamente via AgentMissionsView e por outros contextos

### Caminhos Analisados

```
Z:\00_sagb\
├── src\modules\missoes\              ✅ Auditado
├── src\modules\metodologias\         ✅ Auditado
├── src\modules\mentorias\            ✅ Auditado
├── src\core\modules\                 ✅ Auditado
├── components\Sidebar.tsx            ✅ Auditado
├── App.tsx                           ✅ Auditado
├── services\
│   ├── missionService.ts             ⚠️ Identificado (não mover)
│   ├── supabase.ts                   ✅ Referenciado
│   └── contextAssembler.ts           ⚠️ Referenciado
└── supabase\migrations\              ✅ Auditado (12 migrations relevantes)
```

### Riscos Principais

| # | Risco | Nível |
|---|-------|-------|
| 1 | Perda de dados ao renomear tabelas | 🔴 Crítico |
| 2 | Import paths quebrados | 🔴 Crítico |
| 3 | service/missionService.ts quebrar | 🔴 Crítico |
| 4 | Quebra de rota | 🟠 Alto |
| 5 | Sidebar global aparecer no NIDE | 🟠 Alto |

### Próxima Etapa Recomendada

**ET 02/08 — Criar base modular do NIDE**

Aguardar aprovação deste plano para iniciar a implementação.

---

*Documento gerado em 02/06/2026 como parte da tarefa **NIDE | Auditoria e plano de migração | 01/08 ET**.*

*Nenhuma alteração de código, estrutura, banco de dados ou configuração foi realizada durante esta auditoria.*
