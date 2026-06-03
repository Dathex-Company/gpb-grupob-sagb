# Padrão de Domínio Plugável — NIDE

## O que é um domínio plugável do NIDE?

Um **domínio plugável** é uma área de conhecimento ou estrutura que pode ser registrada, ativada, desativada e futuramente roteada dentro do NIDE (Núcleo Inteligente de Desenvolvimento de Estruturas).

Diferente de um **módulo global do SagB** (como TaskZei, Monitoramento, etc.), um domínio do NIDE:

- Vive **dentro** do NIDE, não no moduleRegistry global
- Segue o **NideDomainManifest**, não o ModuleManifest
- É listado no **domainRegistry** interno, não no moduleRegistry
- Pode ser ativado/desativado sem impacto no ecossistema global
- Não tem rota global — suas rotas são filhas de `/nide`

## Diferença entre módulo global e domínio interno

| Aspecto | Módulo Global (SagB) | Domínio Interno (NIDE) |
|---------|---------------------|----------------------|
| Registro | moduleRegistry | domainRegistry |
| Rota | Própria (ex: /metodologias) | Filha de /nide (ex: /nide/metodologias) |
| Manifest | ModuleManifest | NideDomainManifest |
| Fullscreen | Pode ter | Sempre dentro do NIDE |
| Ativação | moduleToggles (global) | domainActivation (interna) |
| Independência | Total | Dentro do NIDE |

## Estrutura esperada de um domínio

```
domains/{domain-name}/
├── index.ts              # Barrel export
├── manifest.ts           # NideDomainManifest (ou re-export do registry)
├── pages/                # Páginas do domínio
│   └── DominoPage.tsx
├── components/           # Componentes específicos
├── hooks/                # Hooks específicos
├── services/             # Serviços específicos
├── types/                # Tipos específicos
└── docs/                 # Documentação do domínio
```

OBS: A estrutura dentro de `domains/` ainda não está definida definitivamente e pode ser ajustada conforme a necessidade de cada domínio.

## Padrão de manifest

```typescript
const domainManifest: NideDomainManifest = {
  id: 'meu-dominio',
  displayName: 'Meu Domínio',
  description: 'Descrição curta do propósito.',
  icon: 'NomeDoIcone',
  basePath: '/nide/meu-dominio',
  status: 'planned',       // planned | in-progress | active | paused | deprecated
  order: 10,               // posição na lista
  category: 'estrutura',   // core | estrutura | ensino | aplicacao | negocio | processo | governanca | futuro
  owner: {
    type: 'agent',
    id: 'meu-agente',
    displayName: 'Agente do Domínio'
  },
  tags: ['tag1', 'tag2'],
  isCore: false,
  isPlanned: false,
  isEnabledByDefault: true
};
```

## Padrão de owner

Cada domínio deve ter um owner responsável. Os tipos possíveis:

- `agent`: um agente do SagB é responsável
- `user`: um usuário específico
- `team`: um time
- `auto`: gerenciado automaticamente pelo NIDE

Domínios core (como Missões) têm owner `auto` com id `nide-core`.

Domínios planejados sem dono definido podem usar `nide-futuro`.

## Padrão de ativação

A ativação de domínios é gerenciada por `domainActivation.ts`.

Regras atuais:

- Domínios **core** não podem ser desativados
- Domínios **planejados** (isPlanned: true) começam inativos
- Domínios **não-planejados** com `isEnabledByDefault: true` começam ativos
- A ativação é volátil (em memória) nesta versão
- Futuramente será persistida por workspace

## Como Metodologias foi migrado (ET 05 — Concluído ✅)

1. ✅ Criado `domains/metodologias/` com toda a estrutura
2. ✅ Copiados pages, components, hooks, services, types, data, agent, store de `src/modules/metodologias`
3. ✅ Registrado no domainRegistry como 'active', isPlanned: false
4. ✅ Rota interna `/nide/metodologias` preparada (hash-based routing preservado)
5. ✅ Módulo original preservado como fallback (rota `/metodologias` intacta)
6. ✅ Service global `services/metodologiasPersistencia.ts` permanece no lugar (original + cópia no domínio)

### Ajustes realizados na migração

- Apenas **1 import** foi ajustado: `services/metodologiasPersistencia.ts` — path do Supabase de `../../../../services/supabase` para `../../../../../services/supabase`
- Nenhuma lógica interna foi alterada
- Nenhuma tabela Supabase foi modificada
- Nenhuma migration foi criada ou alterada
- O HubPage (1492 linhas) é carregado via `React.lazy()` no NideShell

## Como Mentorias foi migrado (ET 06 — Concluído ✅)

Mesmo padrão de Metodologias, adaptado para `domains/mentorias/`.

1. ✅ Criado `domains/mentorias/` com toda a estrutura
2. ✅ Copiados pages, hooks, services, store, types, agent de `src/modules/mentorias`
3. ✅ Registrado no domainRegistry como 'active', isPlanned: false
4. ✅ Rota interna `/nide/mentorias` preparada (view-based navigation com sidebar própria)
5. ✅ Módulo original preservado como fallback (rota `/mentorias` intacta)
6. ✅ MentoriasDomainContainer adaptado (sem botão "Voltar ao SagB", sem fullscreen redundante)

### Ajustes realizados na migração

**5 imports ajustados** em 4 arquivos:

| Arquivo | Import antigo | Import novo |
|---------|---------------|-------------|
| `services/mentorias.service.ts` | `../../../../services/supabase` | `../../../../../services/supabase` |
| `pages/MentoriaDetailPage.tsx` | `../../../../components/Icon` | `../../../../../components/Icon` |
| `pages/MentoriasDashboardPage.tsx` | `../../../../components/MetricCard` | `../../../../../components/MetricCard` |
| `pages/MentoriasDashboardPage.tsx` | `../../../../components/Icon` | `../../../../../components/Icon` |
| `pages/MentoriasLibraryPage.tsx` | `../../../../components/Icon` | `../../../../../components/Icon` |

## Domínios migrados (status atual)

| Domínio | Status | Tamanho | Routing | Lazy load |
|---------|--------|---------|---------|-----------|
| Missões (core) | ✅ Core | MissionsCorePage | Estático | Não |
| Metodologias | ✅ Migrado | 1492 linhas (HubPage) | Hash-based | `React.lazy()` |
| Mentorias | ✅ Migrado | 570 linhas (service) | View-based | `React.lazy()` |

## Situação do menu global (ET 09 — resolvido ✅)

**Antes (ET 08):** Sidebar exibia NIDE + Missões + Metodologias + Mentorias (4 entradas duplicadas).

**Depois (ET 09):** Sidebar exibe apenas NIDE. Missões, Metodologias e Mentorias foram ocultados via filtro na Sidebar.

### Como foi feito

Em `components/Sidebar.tsx`, adicionamos um Set de IDs migrados:

```typescript
const NIDE_MIGRATED_MODULE_IDS = new Set(['missions', 'metodologias', 'mentorias']);
```

E um `.filter()` extra no cálculo de `dynamicModules`:

```typescript
.filter((mod) => !NIDE_MIGRATED_MODULE_IDS.has(mod.manifest.id))
```

### O que foi preservado

- Módulos originais no moduleRegistry — intactos
- Rotas antigas (`/missoes`, `/metodologias`, `/mentorias`) — funcionais
- Toggles de módulo — intactos
- App.tsx — routing intacto

### Por que não remover do moduleRegistry?

Remover os módulos do moduleRegistry quebraria:
1. Rotas antigas (usuários que acessam `/missoes` diretamente)
2. Toggles de módulo salvos em localStorage
3. Possíveis referências em outros módulos

O filtro na Sidebar é a abordagem mais segura: módulos continuam funcionando via URL direta, mas desaparecem do menu.

### Redirects implementados (ET 10 — Concluído ✅)

Os redirects foram implementados via `tabAliases` no App.tsx:

```typescript
const tabAliases: Partial<Record<TabId, TabId>> = {
  hub: 'ecosystem',
  'missions': 'nide',
  'metodologias': 'nide',
  'mentorias': 'nide'
};
```

**Comportamento:**
- `activeTab = 'missions'` → `resolvedActiveTab = 'nide'` → renderiza NIDE
- `activeTab = 'metodologias'` → `resolvedActiveTab = 'nide'` → renderiza NIDE
- `activeTab = 'mentorias'` → `resolvedActiveTab = 'nide'` → renderiza NIDE

**Nota:** Todos redirecionam para o NIDE principal (Missões core). Não há deep-link para domains específicos porque o NIDE usa estado interno (`selectedDomain`) para navegação entre domains, não URL-based routing.

**hideSidebar também atualizado** para incluir `'missions'` (já tinha `'metodologias'` e `'mentorias'`).

### Rotas finais

| Rota | Comportamento | Status |
|------|---------------|--------|
| `/nide` | Renderiza NIDE | ✅ Oficial |
| `/nide/metodologias` | Domain interno Metodologias (hash routing) | ✅ Oficial |
| `/nide/mentorias` | Domain interno Mentorias (view routing) | ✅ Oficial |
| `/missions`, `/missoes` | Alias → `/nide` | 🔶 Legado c/ alias |
| `/metodologias` | Alias → `/nide` | 🔶 Legado c/ alias |
| `/mentorias` | Alias → `/nide` | 🔶 Legado c/ alias |

### Módulos originais

Todos preservados como fallback técnico. A remoção definitiva do moduleRegistry pode ser feita em etapa futura.

## Cuidados

1. **Não transformar o NIDE em módulo genérico demais.** Cada domínio deve ter um propósito claro e não sobrepor outros módulos do SagB.
2. **Não duplicar services globais.** Services como `missionService.ts`, `metodologiasPersistencia.ts` e `mentorias.service.ts` devem permanecer onde estão.
3. **Não criar dependência circular.** Domínios do NIDE não devem importar outros domínios do NIDE.
4. **Preservar compatibilidade.** Módulos antigos devem continuar funcionando até a limpeza final (ET 07/08).
5. **Manter o core enxuto.** O core do NIDE (MissionsCorePage) não deve ser alterado durante migrações de domínio.
