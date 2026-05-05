# Plano de Estruturação — QG AcadB

## Contexto

Este plano define todas as fases necessárias para estruturar o **QG AcadB** dentro do diretório [`z:/empresas_b/acadb/qg_acadb`](z:/empresas_b/acadb/qg_acadb), seguindo o [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md) e o [`padrao_modulos_plugaveis.md`](docs/governanca_sagb/padrao_modulos_plugaveis.md).

A AcadB possui **1 módulo ativo**: [`acadb-cursos`](z:/empresas_b/acadb/modules/acadb-cursos) (status: MVP Estruturado v1.0, owner: Zoe Burne).

---

## Arquitetura Alvo

```
acadb/
├── _reunioes/                       # ATAS de reunião
├── _triagem/                        # Pipeline de triagem (já completo)
├── decisoes/                        # Decisões do QG
├── insights/                        # Insights processados
├── pendencias/                      # Pendências a resolver
├── raw/                             # Conteúdo bruto não processado
│
├── modules/
│   └── acadb_cursos/                # (renomeado → underscore)
│       ├── agent/
│       │   ├── persona.md
│       │   ├── session_log.md       # (renomeado)
│       │   ├── falas_user.md        # (criado)
│       │   └── prompt_ativacao_cline.md  # (renomeado)
│       ├── data/
│       ├── pages/
│       ├── services/
│       └── types/
│       ├── changelog.md
│       ├── decisions.md
│       ├── index.ts
│       ├── manifest.ts              # id corrigido
│       ├── module-doc.ts            # refatorado com ModuleDoc
│       └── routes.tsx               # corrigido para ModuleRoute[]
│
├── qg_acadb/                        # QG central
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── DECISIONS.md
│   ├── PLANNED.md
│   │
│   ├── agent/                       # 4 arquivos canônicos
│   │   ├── persona.md
│   │   ├── session_log.md
│   │   ├── falas_user.md
│   │   └── prompt_ativacao_cline.md
│   │
│   └── governance/                  # Espelho do canônico
│       └── padrao_unificado_governanca.md
│
└── ... (demais pastas existentes)
```

---

## Checklist de Conformidade — Módulo acadb_cursos

### Estado Atual

| Item | Status | Ação |
|------|--------|------|
| **Estrutura de diretórios** | ✅ | manifest, module-doc, routes, index, agent, pages, services, types, data |
| **id do módulo** (underscore) | ❌ | `acadb-cursos` → `acadb_cursos` |
| **Owner no manifest** | ✅ | Zoe Burne |
| **module-doc com ModuleDoc** | ❌ | Usa estrutura proprietária `acadbCursosDocs` |
| **routes exporta ModuleRoute[]** | ❌ | Exporta objeto único |
| **Import de module.types** | ❌ | `../../core/modules/module.types` não existe |
| **agent/persona.md** | ✅ | Conteúdo bom |
| **agent/prompt_ativacao_cline.md** | ❌ | Hífen → underscore |
| **agent/session_log.md** | ❌ | Hífen → underscore |
| **agent/falas_user.md** | ❌ | Não existe |
| **agent/owner.md** (LEGADO) | ❌ | Remover |
| **history-chat.md** (LEGADO) | ❌ | Remover |
| **changelog.md** | ✅ | Presente |
| **decisions.md** | ✅ | Presente |

---

## Fases de Implantação

### Fase 0: Setup da Infraestrutura do QG

Criar a estrutura base do [`qg_acadb`](z:/empresas_b/acadb/qg_acadb) com os arquivos fundamentais.

#### Arquivos a criar

**1. [`qg_acadb/README.md`](z:/empresas_b/acadb/qg_acadb/README.md)**

```markdown
# QG AcadB

QG (Quartel-General) do projeto AcadB — plataforma interna B2B de cursos.

## Camadas

| Camada | Caminho | Finalidade |
|--------|---------|------------|
| **Raw** | `raw/` | Conteúdo bruto não processado |
| **Triagem** | `_triagem/` | Pipeline de entrada/saída/falas/log |
| **Insights** | `insights/` | Insights processados |
| **Decisões** | `decisoes/` | Decisões registradas |
| **Pendências** | `pendencias/` | Pendências a resolver |
| **Reuniões** | `_reunioes/` | ATAs formais |
| **Módulos** | `modules/` | Módulos plugáveis do SagB |
| **QG Central** | `qg_acadb/` | Governança, agente e documentação |

## Regra estrutural

- Tudo que é **raw** → entra por `raw/` ou `_triagem/01_entrada/`
- Tudo que é **processado** → `_triagem/02_saida/`
- Tudo que é **fala do usuário** → `_triagem/03_saida_fala_user/`
- Tudo que é **decisão consolidada** → `decisoes/`
- Tudo que é **pendência aberta** → `pendencias/`
```

**2. [`qg_acadb/CHANGELOG.md`](z:/empresas_b/acadb/qg_acadb/CHANGELOG.md)**

```markdown
# Changelog — QG AcadB

## 2026-05-05 — Estruturação inicial do QG
- Criação do diretório `qg_acadb/`
- Estruturação da governança e agente do QG
- Correção de nomenclatura e LEGADOs do módulo `acadb_cursos`
```

**3. [`qg_acadb/DECISIONS.md`](z:/empresas_b/acadb/qg_acadb/DECISIONS.md)**

```markdown
# Decisions — QG AcadB

## 2026-05-05 — Fundação do QG
- O QG AcadB fica dentro de `z:/empresas_b/acadb/qg_acadb/`
- Segue o padrão unificado de governança SagB
- Módulo `acadb-cursos` renomeado para `acadb_cursos` (underscore)
- Owner: Zoe Burne (mantido)
```

**4. [`qg_acadb/PLANNED.md`](z:/empresas_b/acadb/qg_acadb/PLANNED.md)**

```markdown
# Planned — QG AcadB

## Próximos passos
- [ ] Conectar serviço ao Supabase real (substituir mock)
- [ ] Implementar permissões por papel (admin_conteudo, aluno)
- [ ] Adicionar certificado sem checkout (opcional)
- [ ] Expandir módulos da AcadB (novos módulos além de cursos)
```

---

### Fase 1: Governança do QG

Criar os **4 arquivos canônicos** do agente do QG e o **espelho de governança**.

**5. [`qg_acadb/agent/persona.md`](z:/empresas_b/acadb/qg_acadb/agent/persona.md)**

```markdown
# Persona: Orquestrador QG AcadB

## Identidade
Agente responsável pela governança, estruturação e evolução do QG AcadB.

## Postura e Conduta
- Manter os 4 arquivos canônicos atualizados
- Aplicar lowercase_underscore em toda nomenclatura
- Garantir auto-log duplo (session_log + falas_user)
- Registrar decisões arquiteturais em DECISIONS.md

## Responsabilidades
- Governança do diretório `qg_acadb/`
- Correção e manutenção dos módulos plugáveis
- Pipeline de triagem (entrada → saída → falas → log)
```

**6. [`qg_acadb/agent/session_log.md`](z:/empresas_b/acadb/qg_acadb/agent/session_log.md)**

```markdown
# Session Log — QG AcadB

## 05/05/2026 12:00 BRT
- Criação do diretório `qg_acadb/` dentro de `z:/empresas_b/acadb/`
- Estruturação inicial do QG: README, CHANGELOG, DECISIONS, PLANNED
- Criação dos 4 arquivos canônicos do agente do QG
- Criação do espelho de governança
```

**7. [`qg_acadb/agent/falas_user.md`](z:/empresas_b/acadb/qg_acadb/agent/falas_user.md)**

```markdown
# Falas do Usuário — QG AcadB

## 05/05/2026
- "quero que verifique da mesma forma que fez com a 3forB, a AcadB agora."
- "vamos voltar ao projeto acadb. Quero fazer a mesma coisa que fizemos com a 3forb..."
- "quero criar o qg dentro da pasta principal... Z:/empresas_b/acadb/qg_acadb"
```

**8. [`qg_acadb/agent/prompt_ativacao_cline.md`](z:/empresas_b/acadb/qg_acadb/agent/prompt_ativacao_cline.md)**

```markdown
<task>
SagB | QG AcadB | Estruturação e Governança
</task>

## Ativação
A partir de agora, você assume a persona de **Orquestrador do QG AcadB**.

## Ação Obrigatória Inicial (Log Contínuo)
1. Antes de qualquer ação, leia `qg_acadb/agent/persona.md`
2. Atualize `qg_acadb/agent/session_log.md` a cada turno
3. Decisões arquiteturais em `qg_acadb/DECISIONS.md`

## Escopo
- Governança e estruturação do QG AcadB
- Correção de conformidade dos módulos
- Pipeline de triagem
```

**9. [`qg_acadb/governance/padrao_unificado_governanca.md`](z:/empresas_b/acadb/qg_acadb/governance/padrao_unificado_governanca.md)**

Espelho do canônico em [`docs/governanca_sagb/padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md).

---

### Fase 2: Correção do Módulo acadb_cursos

#### 2.1 Renomear arquivos do agent/

```powershell
# De:
z:\empresas_b\acadb\modules\acadb-cursos\agent\prompt-ativacao-cline.md
z:\empresas_b\acadb\modules\acadb-cursos\agent\session-log.md

# Para:
z:\empresas_b\acadb\modules\acadb-cursos\agent\prompt_ativacao_cline.md
z:\empresas_b\acadb\modules\acadb-cursos\agent\session_log.md
```

**Comando PowerShell:**
```powershell
mv "z:\empresas_b\acadb\modules\acadb-cursos\agent\prompt-ativacao-cline.md" "z:\empresas_b\acadb\modules\acadb-cursos\agent\prompt_ativacao_cline.md"
mv "z:\empresas_b\acadb\modules\acadb-cursos\agent\session-log.md" "z:\empresas_b\acadb\modules\acadb-cursos\agent\session_log.md"
```

#### 2.2 Criar falas_user.md

**10. [`modules/acadb_cursos/agent/falas_user.md`](z:/empresas_b/acadb/modules/acadb-cursos/agent/falas_user.md)**

```markdown
# Falas do Usuário — AcadB Cursos (Zoe Burne)

## 20/04/2026
- "iniciar a estruturação da plataforma de cursos da AcadB com foco no MVP interno B2B"
```

#### 2.3 Remover LEGADOS

```powershell
del "z:\empresas_b\acadb\modules\acadb-cursos\agent\owner.md"
del "z:\empresas_b\acadb\modules\acadb-cursos\history-chat.md"
```

#### 2.4 Renomear pasta do módulo (acadb-cursos → acadb_cursos)

```powershell
mv "z:\empresas_b\acadb\modules\acadb-cursos" "z:\empresas_b\acadb\modules\acadb_cursos"
```

#### 2.5 Refatorar manifest.ts

**Antes:**
```typescript
import { ModuleManifest } from '../../core/modules/module.types';
export const acadbCursosManifest: ModuleManifest = {
  id: 'acadb-cursos',
  internalName: 'acadb_cursos',
  displayName: 'AcadB Cursos',
  baseRoute: '/acadb-cursos',
  icon: 'BookIcon',
  initialStatus: 'active',
  owner: { type: 'agent', id: 'zoe_burne', displayName: 'Zoe Burne' }
};
```

**Depois:**
```typescript
import { ModuleManifest } from '../../../../src/core/modules/module.types';
export const acadbCursosManifest: ModuleManifest = {
  id: 'acadb_cursos',
  internalName: 'acadb_cursos',
  displayName: 'AcadB Cursos',
  baseRoute: '/acadb_cursos',
  icon: 'BookIcon',
  initialStatus: 'active',
  owner: { type: 'agent', id: 'zoe_burne', displayName: 'Zoe Burne' }
};
```

> **Nota:** Todos os módulos plugáveis do SagB apontam para `src/core/modules/module.types` no projeto principal. O import `../../core/modules/module.types` (local) não existe. Correção: padronizar para `../../../../src/core/modules/module.types` (relativo ao SagB, igual routes.tsx já usa).

#### 2.6 Refatorar module-doc.ts para usar ModuleDoc

**11. [`modules/acadb_cursos/module-doc.ts`](z:/empresas_b/acadb/modules/acadb_cursos/module-doc.ts)**

```typescript
import { ModuleDoc } from '../../../../src/core/modules/module.types';

export const acadbCursosModuleDoc: ModuleDoc = {
  contexto: 'Plataforma interna B2B da AcadB para gestão e consumo de cursos corporativos.',
  objetivo: 'Catálogo, trilhas, player de aulas, progresso por aluno e administração de conteúdo sem checkout neste ciclo.',
  escopoInicial: [
    'Catálogo de cursos matriculados',
    'Visão de trilhas (programa/trilha)',
    'Player básico de aulas (video/artigo/material)',
    'Registro de progresso por aluno',
    'CRUD de trilha, curso, módulo e aula (admin)',
    'Publicação draft/published',
    'Vínculo de matrícula aluno-empresa-curso'
  ]
};
```

#### 2.7 Refatorar routes.tsx para ModuleRoute[]

**12. [`modules/acadb_cursos/routes.tsx`](z:/empresas_b/acadb/modules/acadb_cursos/routes.tsx)**

```typescript
import React from 'react';
import { ModuleRoute } from '../../../../src/core/modules/module.types';
import { acadbCursosManifest } from './manifest';
import { AcadBCursosPage } from './pages/AcadBCursosPage';

export const acadbCursosRoutes: ModuleRoute[] = [
  {
    path: acadbCursosManifest.baseRoute,
    element: <AcadBCursosPage />
  }
];
```

#### 2.8 Atualizar index.ts (caminho do import)

**13. [`modules/acadb_cursos/index.ts`](z:/empresas_b/acadb/modules/acadb_cursos/index.ts)**

```typescript
import { PluggableModule } from '../../../../src/core/modules/module.types';
import { acadbCursosManifest } from './manifest';
import { acadbCursosRoutes } from './routes';

export { acadbCursosManifest } from './manifest';
export { acadbCursosRoutes } from './routes';

export const acadbCursosModule: PluggableModule = {
  manifest: acadbCursosManifest,
  routes: acadbCursosRoutes
};

export default acadbCursosModule;
```

---

### Fase 3: Documentação Raiz

Criar um [`README.md`](z:/empresas_b/acadb/README.md) na raiz do projeto AcadB (fora do qg_acadb).

**14. [`acadb/README.md`](z:/empresas_b/acadb/README.md)**

```markdown
# AcadB

Plataforma interna B2B de cursos corporativos.

## Estrutura

| Diretório | Finalidade |
|-----------|------------|
| `_reunioes/` | ATAs de reunião |
| `_triagem/` | Pipeline de triagem documental |
| `decisoes/` | Decisões registradas |
| `insights/` | Insights processados |
| `modules/` | Módulos plugáveis |
| `pendencias/` | Pendências a resolver |
| `qg_acadb/` | QG central (governança, agente, docs) |
| `raw/` | Conteúdo bruto |

## Módulos

| Módulo | Status | Owner |
|--------|--------|-------|
| acadb_cursos | MVP Estruturado (v1.0) | Zoe Burne |
```

---

### Fase 4: População de Diretórios Vazios

Os diretórios [`decisoes/`](z:/empresas_b/acadb/decisoes), [`insights/`](z:/empresas_b/acadb/insights), [`pendencias/`](z:/empresas_b/acadb/pendencias), [`raw/`](z:/empresas_b/acadb/raw) estão vazios.

Manter vazios com um `.gitkeep` cada, ou criar README.md descritivo:

```powershell
echo. 2>"z:\empresas_b\acadb\decisoes\.gitkeep"
echo. 2>"z:\empresas_b\acadb\insights\.gitkeep"
echo. 2>"z:\empresas_b\acadb\pendencias\.gitkeep"
echo. 2>"z:\empresas_b\acadb\raw\.gitkeep"
```

---

### Fase 5: Comandos de Finalização

```powershell
# Navegar até a raiz da AcadB
cd z:\empresas_b\acadb

# Verificar estrutura final
tree /f

# Verificar quebra de imports
findstr "module.types" modules\acadb_cursos\*.ts
```

---

## Resumo de Arquivos a Criar/Modificar/Remover

### Criar (14 arquivos)

| # | Arquivo | Fase |
|---|---------|------|
| 1 | `qg_acadb/README.md` | Fase 0 |
| 2 | `qg_acadb/CHANGELOG.md` | Fase 0 |
| 3 | `qg_acadb/DECISIONS.md` | Fase 0 |
| 4 | `qg_acadb/PLANNED.md` | Fase 0 |
| 5 | `qg_acadb/agent/persona.md` | Fase 1 |
| 6 | `qg_acadb/agent/session_log.md` | Fase 1 |
| 7 | `qg_acadb/agent/falas_user.md` | Fase 1 |
| 8 | `qg_acadb/agent/prompt_ativacao_cline.md` | Fase 1 |
| 9 | `qg_acadb/governance/padrao_unificado_governanca.md` | Fase 1 |
| 10 | `modules/acadb_cursos/agent/falas_user.md` | Fase 2 |
| 11 | `modules/acadb_cursos/module-doc.ts` (reescrita) | Fase 2 |
| 12 | `modules/acadb_cursos/routes.tsx` (reescrita) | Fase 2 |
| 13 | `modules/acadb_cursos/index.ts` (reescrita) | Fase 2 |
| 14 | `README.md` (raiz da AcadB) | Fase 3 |

### Modificar (2 arquivos)

| # | Arquivo | Mudança | Fase |
|---|---------|---------|------|
| 1 | `modules/acadb_cursos/manifest.ts` | id + import path | Fase 2 |
| 2 | `modules/acadb_cursos/agent/prompt_ativacao_cline.md` | conteúdo (já existe, só renomear) | Fase 2 |

### Renomear (2 arquivos + 1 pasta)

| # | De | Para | Fase |
|---|----|------|------|
| 1 | `modules/acadb-cursos/agent/prompt-ativacao-cline.md` | `prompt_ativacao_cline.md` | Fase 2 |
| 2 | `modules/acadb-cursos/agent/session-log.md` | `session_log.md` | Fase 2 |
| 3 | `modules/acadb-cursos/` (pasta) | `modules/acadb_cursos/` | Fase 2 |

### Remover (2 arquivos)

| # | Arquivo | Motivo | Fase |
|---|---------|--------|------|
| 1 | `modules/acadb_cursos/agent/owner.md` | LEGADO — owner já no manifest | Fase 2 |
| 2 | `modules/acadb_cursos/history-chat.md` | LEGADO — não faz parte do padrão | Fase 2 |

---

## Diagrama de Fluxo

```
Estado Atual                          Estado Final
=============                         ============
acadb/                                acadb/
├── modules/                          ├── README.md (novo)
│   └── acadb-cursos/                 ├── modules/
│       ├── agent/                    │   └── acadb_cursos/ (renomeado)
│       │   ├── owner.md (LEGADO)     │       ├── agent/
│       │   ├── persona.md ✅         │       │   ├── persona.md ✅
│       │   ├── prompt-ativação-      │       │   ├── prompt_ativacao_
│       │   │   cline.md ❌           │       │   │   cline.md ✅
│       │   └── session-log.md ❌     │       │   ├── session_log.md ✅
│       ├── history-chat.md (LEGADO)  │       │   └── falas_user.md (novo)
│       ├── manifest.ts ❌ (import)   │       ├── manifest.ts ✅
│       ├── module-doc.ts ❌ (prop)   │       ├── module-doc.ts ✅ (ModuleDoc)
│       └── routes.tsx ❌ (obj único) │       └── routes.tsx ✅ (array)
│                                     │
├── qg_acadb/ 🆕                      │
│   ├── README.md                     │
│   ├── CHANGELOG.md                  │
│   ├── DECISIONS.md                  │
│   ├── PLANNED.md                    │
│   ├── agent/                        │
│   │   ├── persona.md                │
│   │   ├── session_log.md            │
│   │   ├── falas_user.md             │
│   │   └── prompt_ativacao_cline.md  │
│   └── governance/                   │
│       └── padrao_unificado_         │
│           governanca.md             │
│                                     │
└── decisoes/ (vazio → .gitkeep)      │
```
