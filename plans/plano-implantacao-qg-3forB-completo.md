# Plano de Implantação — QG da 3forB

> **Documentos de referência:** [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md) (norma transversal), [`padrao_modulos_plugaveis.md`](docs/governanca_sagb/padrao_modulos_plugaveis.md) (norma operacional de módulos)
>
> **Pasta alvo:** `z:/empresas_b/qg_3forB/`
>
> **Fontes:**
> - Módulos da raiz: `z:/empresas_b/3forB/modules/` (gestao-midias-pagas, valuation, sites-landing-pages, vendas)
> - QG original: `z:/empresas_b/3forB/_triagem/3forB_QG/` (18 módulos)
> - Package.json base: `z:/empresas_b/3forB/_triagem/_backup_processados/arquivos_originais/package.json`

---

## Fase 0 — Setup da Infraestrutura Base

Criar a estrutura de diretórios e arquivos de configuração do projeto.

### 0.1 Estrutura de diretórios

```
z:/empresas_b/qg_3forB/
├── agent/
├── governance/
├── src/
│   ├── core/
│   │   └── modules/
│   ├── modules/
│   ├── shell/
│   └── styles/
└── _triagem/
```

**Comando PowerShell:**
```powershell
cd z:/empresas_b/qg_3forB
mkdir agent, governance, src/core/modules, src/modules, src/shell, src/styles, _triagem
```

### 0.2 package.json

Arquivo: `z:/empresas_b/qg_3forB/package.json`

```json
{
  "name": "qg-3forb",
  "version": "1.0.0",
  "description": "QG da 3forB — Módulos plugáveis no padrão SagB",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5100 --strictPort",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "^6.0.2",
    "vite": "^8.0.3",
    "vitest": "^4.1.2"
  }
}
```

### 0.3 vite.config.ts

Arquivo: `z:/empresas_b/qg_3forB/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5100,
    strictPort: true,
  },
});
```

### 0.4 tsconfig.json

Arquivo: `z:/empresas_b/qg_3forB/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### 0.5 tsconfig.tsbuildinfo (placeholder vazio)

Arquivo: `z:/empresas_b/qg_3forB/tsconfig.tsbuildinfo`

```json
{ "version": "6.0.2" }
```

### 0.6 index.html

Arquivo: `z:/empresas_b/qg_3forB/index.html`

```html
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QG 3forB</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 0.7 src/main.tsx

Arquivo: `z:/empresas_b/qg_3forB/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### 0.8 src/App.tsx

Arquivo: `z:/empresas_b/qg_3forB/src/App.tsx`

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { moduleRegistry } from './core/modules/moduleRegistry';

export default function App() {
  return (
    <Routes>
      {moduleRegistry.map((mod) =>
        mod.routes.map((route, i) => (
          <Route key={`${mod.id}-${i}`} path={route.path} element={route.element} />
        ))
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### 0.9 src/core/modules/types.ts

Arquivo: `z:/empresas_b/qg_3forB/src/core/modules/types.ts`

```typescript
export interface ModuleManifest {
  id: string;
  displayName: string;
  status: 'draft' | 'hibrido' | 'migrating' | 'active' | 'deprecated';
  version?: string;
  basePath?: string;
  category?: string;
  entryRoute?: string;
  source?: string;
  owner: {
    type: 'agent' | 'user' | 'team';
    id: string;
    displayName: string;
  };
}

export interface ModuleRoute {
  path: string;
  element: React.ReactNode;
}

export interface ModuleDoc {
  contexto: string;
  objetivo: string;
  escopoInicial: string[];
}

export interface PluggableModule {
  id: string;
  manifest: ModuleManifest;
  routes: ModuleRoute[];
  moduleDoc: ModuleDoc;
}
```

### 0.10 src/core/modules/moduleRegistry.ts

Arquivo: `z:/empresas_b/qg_3forB/src/core/modules/moduleRegistry.ts`

```typescript
import type { PluggableModule } from './types';

export const moduleRegistry: PluggableModule[] = [];
```

---

## Fase 1 — Governança do Próprio QG

Criar os arquivos de governança do agente do QG e o espelho dos documentos canônicos.

### 1.1 agent/persona.md

Arquivo: `z:/empresas_b/qg_3forB/agent/persona.md`

```markdown
# persona — QG 3forB

## identidade
Agente arquiteto e operador do QG da 3forB. Responsável por manter a estrutura de módulos plugáveis, aplicar o padrão de governança SagB e garantir a conformidade de todos os módulos do ecossistema 3forB.

## responsabilidade principal
- Manter a arquitetura do QG conforme `padrao_modulos_plugaveis.md`
- Aplicar o checklist de conformidade em cada módulo
- Migrar módulos da triagem para o QG oficial
- Garantir a presença dos 4 arquivos canônicos em cada módulo

## escopo
- `z:/empresas_b/qg_3forB/` — pasta raiz do QG
- Todos os módulos em `src/modules/`
- Integração com o sistema de módulos do SagB quando aplicável
```

### 1.2 agent/prompt_ativacao_cline.md

Arquivo: `z:/empresas_b/qg_3forB/agent/prompt_ativacao_cline.md`

```markdown
# prompt_ativacao_cline — QG 3forB

## missão
Estruturar e manter o QG da 3forB no padrão SagB de módulos plugáveis.

## arquivos canônicos obrigatórios
Sempre que interagir com um módulo, verificar a presença destes 4 arquivos em `agent/`:
1. `persona.md`
2. `session_log.md`
3. `falas_user.md`
4. `prompt_ativacao_cline.md`

## auto-log duplo obrigatório
Antes de responder ao usuário:
1. Registrar no `session_log.md` — transcrição literal do diálogo
2. Registrar no `falas_user.md` — fala do usuário isolada
3. Finalizar resposta com `[ 📝 Auto-log: OK ]`
```

### 1.3 agent/session_log.md

Arquivo: `z:/empresas_b/qg_3forB/agent/session_log.md`

```markdown
# session_log — QG 3forB
```

### 1.4 agent/falas_user.md

Arquivo: `z:/empresas_b/qg_3forB/agent/falas_user.md`

```markdown
# falas_user — QG 3forB
```

### 1.5 governance/padrao_unificado_governanca.md

Arquivo: `z:/empresas_b/qg_3forB/governance/padrao_unificado_governanca.md`

```markdown
# espelho local — padrao_unificado_governanca

fonte canonica oficial: `Z:/SagB/docs/governanca_sagb/padrao_unificado_governanca.md`.
uso local para continuidade operacional fora do workspace principal.

## regra local de precedencia
1. usar este espelho local para execução imediata;
2. em dúvida normativa, prevalece o canônico central;
3. manter nomenclatura lowercase + underscore.

## arquivos canônicos por agente
- persona.md
- session_log.md
- falas_user.md
- prompt_ativacao_cline.md
```

### 1.6 governance/padrao_modulos_plugaveis.md

Arquivo: `z:/empresas_b/qg_3forB/governance/padrao_modulos_plugaveis.md`

```markdown
# espelho local — padrao_modulos_plugaveis

fonte canonica oficial: `Z:/SagB/docs/governanca_sagb/padrao_modulos_plugaveis.md`.

## checklist minimo de conformidade
1. pasta criada em `src/modules/<id_canonico_do_modulo>/` seguindo nomenclatura oficial
2. presenca de `manifest.ts`, `routes.tsx`, `index.ts`, `module-doc.ts`
3. `module-doc.ts` implementa a interface `ModuleDoc` (tipado)
4. presenca de `README.md`, `CHANGELOG.md`, `DECISIONS.md` (UPPERCASE)
5. `PLANNED.md` opcional (so obrigatorio se houver plano ativo de evolucao)
6. pasta `agent` com os 4 arquivos canonicos:
   - `persona.md`
   - `session_log.md`
   - `falas_user.md`
   - `prompt_ativacao_cline.md`
7. owner declarado no `manifest.ts` (campo `owner` no formato `{ type, id, displayName }`)
8. modulo registrado em `src/core/modules/moduleRegistry.ts`
9. conformidade visual canonica obrigatoria

## estrutura de diretorios basica
```
src/modules/<id_canonico_do_modulo>/
├── index.ts                     # Ponto de exportacao (manifest, routes, moduleDoc)
├── manifest.ts                  # Metadados + owner (ModuleManifest tipado)
├── module-doc.ts                # Contrato tecnico TIPADO (interface ModuleDoc)
├── routes.tsx                   # Rotas React (ModuleRoute tipado)
├── README.md                    # Visao executiva (UPPERCASE)
├── CHANGELOG.md                 # Historico de versoes (UPPERCASE)
├── DECISIONS.md                 # Decisoes arquiteturais (UPPERCASE)
├── PLANNED.md                   # Plano de evolucao (OPCIONAL)
├── agent/                       # 4 arquivos canonicos
│   ├── prompt_ativacao_cline.md
│   ├── persona.md
│   ├── session_log.md
│   └── falas_user.md
├── pages/                       # Telas React
├── components/                  # Componentes exclusivos
├── services/                    # Logica de API
├── store/                       # Estado local
└── docs/                        # Documentos auxiliares
```
```

### 1.7 governance/decisions.md

Arquivo: `z:/empresas_b/qg_3forB/governance/decisions.md`

```markdown
# decisions — QG 3forB

| Data | Decisao | Motivo |
|------|---------|--------|
| 06/05/2026 | Estrutura inicial do QG baseada no padrao SagB de modulos plugaveis | Alinhamento com a governanca corporativa do SagB |
```

---

## Fase 2 — Migração do Módulo gestao-midias-pagas

**Status atual:** `hibrido` — ~60% conforme. Precisa de ajustes de governança e nomenclatura.

### Ações

1. Copiar pasta `z:/empresas_b/3forB/modules/gestao-midias-pagas/` → `z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/` (tudo)
2. Atualizar `manifest.ts` — adicionar owner, corrigir source
3. Criar `agent/session_log.md` (vazio)
4. Criar `agent/falas_user.md` (vazio)
5. Criar `agent/prompt_ativacao_cline.md`
6. Renomear `changelog.md` → `CHANGELOG.md` (UPPERCASE)
7. Criar `DECISIONS.md` com data/decisão/motivo
8. Criar `README.md` na raiz do módulo
9. Remover `agent/owner.md` (legado)
10. Tipar `module-doc.ts` com a interface `ModuleDoc`
11. Registrar no `moduleRegistry.ts`

### 2.1 Comando de cópia

```powershell
Copy-Item -Path "z:/empresas_b/3forB/modules/gestao-midias-pagas" -Destination "z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas" -Recurse -Force
```

### 2.2 manifest.ts (atualizado)

Arquivo: `z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/manifest.ts`

```typescript
export const manifest = {
  id: 'gestao-midias-pagas',
  displayName: 'Gestão de Mídias Pagas',
  status: 'hibrido',
  version: '1.0.0',
  source: '_triagem/3forB_QG/src/modules/gestao-midias-pagas',
  owner: {
    type: 'agent',
    id: 'gestor-midias-pagas',
    displayName: 'Gestor de Mídias Pagas',
  },
};
```

### 2.3 module-doc.ts (tipado)

Arquivo: `z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/module-doc.ts`

```typescript
import type { ModuleDoc } from '../../core/modules/types';

export const moduleDoc: ModuleDoc = {
  contexto:
    'Módulo operacional da 3forB para comando de mídia paga ponta a ponta: cockpit executivo, operação de canais/campanhas/criativos, leitura de funil central, integração comercial/CRM e rotina decisória.',
  objetivo:
    'Padronizar e produtizar o módulo no padrão SagB como oferta híbrida (operação interna + produto vendável), preservando profundidade operacional sem perder clareza executiva.',
  escopoInicial: [
    'Mapear artefatos atuais no legado 3forB_QG',
    'Definir arquitetura alvo no QG 3forB',
    'Preparar trilha de comercialização',
    'Consolidar fronteiras de domínio (cockpit, operação, funil, saúde técnica, decisão e memória)',
    'Definir contrato mínimo plugável para snapshots e leituras executivas',
    'Estruturar roadmap de extração progressiva sem quebrar operação atual',
  ],
};
```

### 2.4 agent/prompt_ativacao_cline.md

Arquivo: `z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/agent/prompt_ativacao_cline.md`

```markdown
# prompt_ativacao_cline — Gestao de Midias Pagas

## missao
Operar e evoluir o modulo de Gestao de Midias Pagas da 3forB, mantendo conformidade com o padrao SagB de modulos plugaveis.

## artefatos do modulo
- 64 componentes React em `components/`
- Pagina principal em `pages/Index.tsx`
- 19 arquivos de tipo em `types/`
- Servicos em `services/`

## auto-log duplo obrigatorio
Sempre registrar em `agent/session_log.md` e `agent/falas_user.md` antes de responder.
```

### 2.5 DECISIONS.md

Arquivo: `z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/DECISIONS.md`

```markdown
# Decisoes Arquiteturais — Gestao de Midias Pagas

| Data | Decisao | Motivo |
|------|---------|--------|
| 10/04/2026 | Estrutura criada no padrao oficial de modulos vendeveis | Alinhamento com o ecossistema SagB |
| 06/05/2026 | Owner movido de agent/owner.md para manifest.ts | Conformidade com padrao_modulos_plugaveis.md regra 1.1.1 |
```

### 2.6 README.md

Arquivo: `z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/README.md`

```markdown
# Gestao de Midias Pagas

Modulo operacional da 3forB para comando de midia paga ponta a ponta.

## Status
`hibrido` — Operacao interna ativa + preparacao para produto vendevel.

## Estrutura
- `pages/Index.tsx` — Pagina principal com visao executiva completa
- `components/` — 64 paineis de visualizacao e controle
- `types/` — 19 definicoes de tipo
- `services/` — Logica de dados e mock
- `store/` — Estado local (Zustand, em preparacao)

## Owner
Gestor de Midias Pagas (agent)
```

### 2.7 CHANGELOG.md (renomeado de changelog.md)

Manter o mesmo conteúdo de `changelog.md` original, apenas renomear o arquivo.

### 2.8 Registrar no moduleRegistry.ts

Adicionar no arquivo `z:/empresas_b/qg_3forB/src/core/modules/moduleRegistry.ts`:

```typescript
import { gestaoMidiasPagasManifest } from '../modules/gestao-midias-pagas/manifest';
import { gestaoMidiasPagasRoutes } from '../modules/gestao-midias-pagas/routes';
import { moduleDoc as gestaoMidiasPagasModuleDoc } from '../modules/gestao-midias-pagas/module-doc';

// ... (mantendo os imports existentes)

export const moduleRegistry: PluggableModule[] = [
  {
    id: 'gestao-midias-pagas',
    manifest: gestaoMidiasPagasManifest,
    routes: gestaoMidiasPagasRoutes,
    moduleDoc: gestaoMidiasPagasModuleDoc,
  },
];
```

### 2.9 Remover agent/owner.md (legado)

```powershell
Remove-Item -Path "z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/agent/owner.md" -Force
```

---

## Fase 3 — Migração do Módulo valuation

**Status atual:** `migrating` — ~50% conforme. Estrutura com `src/` aninhado, precisa de ajustes.

### Ações

1. Copiar pasta `z:/empresas_b/3forB/modules/valuation/` → `z:/empresas_b/qg_3forB/src/modules/valuation/` (tudo)
2. Criar `index.ts` na raiz do módulo exportando de `src/`
3. Atualizar `src/manifest.ts` — adicionar owner
4. Renomear `agent/session.md` → `agent/session_log.md`
5. Criar `agent/falas_user.md` (vazio)
6. Criar `agent/prompt_ativacao_cline.md`
7. Renomear `changelog.md` → `CHANGELOG.md`
8. Criar `DECISIONS.md`
9. Remover `agent/owner.md` (legado)
10. Converter `migration-plan.md` → `PLANNED.md`
11. Tipar `module-doc.ts` com interface `ModuleDoc`
12. Registrar no `moduleRegistry.ts`

### 3.1 Comando de cópia

```powershell
Copy-Item -Path "z:/empresas_b/3forB/modules/valuation" -Destination "z:/empresas_b/qg_3forB/src/modules/valuation" -Recurse -Force
```

### 3.2 index.ts (novo, na raiz do módulo)

Arquivo: `z:/empresas_b/qg_3forB/src/modules/valuation/index.ts`

```typescript
export { manifest as valuationManifest } from './src/manifest';
export { valuationSimulacoesRoutes } from './src/routes';
export { moduleDoc as valuationModuleDoc } from './module-doc';
```

### 3.3 src/manifest.ts (atualizado)

Arquivo: `z:/empresas_b/qg_3forB/src/modules/valuation/src/manifest.ts`

```typescript
export const manifest = {
  id: 'valuation',
  displayName: 'Valuation e Simulações',
  status: 'migrating',
  version: '1.0.0',
  basePath: '/gestao/financeiro',
  category: 'gestao',
  entryRoute: '/gestao/financeiro/valuation-simulacoes',
  source: '_triagem/3forB_QG/src/modules/valuation',
  owner: {
    type: 'agent',
    id: 'especialista-valuation',
    displayName: 'Especialista em Valuation',
  },
};
```

### 3.4 module-doc.ts (tipado)

Arquivo: `z:/empresas_b/qg_3forB/src/modules/valuation/module-doc.ts`

```typescript
import type { ModuleDoc } from '../../core/modules/types';

export const moduleDoc: ModuleDoc = {
  contexto: 'Ferramenta de decisão estratégica da 3forB para valuation, análise de receita, simulações e cenários. Alimenta o módulo Evaluation com leitura especializada de valor, receita e riscos.',
  objetivo: 'Padronizar e produtizar o módulo no padrão SagB, transformando a ferramenta analítica em produto comercializável para análise de valor empresarial.',
  escopoInicial: [
    'Mapear artefatos atuais no legado 3forB_QG',
    'Definir arquitetura alvo no QG 3forB',
    'Preparar trilha de comercialização',
    'Extrair lógica core para pacote independente',
    'Configurar sistema de dependências e integração',
  ],
};
```

### 3.5 agent/prompt_ativacao_cline.md

Arquivo: `z:/empresas_b/qg_3forB/src/modules/valuation/agent/prompt_ativacao_cline.md`

```markdown
# prompt_ativacao_cline — Valuation e Simulacoes

## missao
Operar e evoluir o modulo de Valuation e Simulacoes da 3forB, mantendo conformidade com o padrao SagB.

## artefatos do modulo
- 59 componentes React em `src/components/`
- Pagina principal em `src/pages/Index.tsx`
- 9 arquivos de tipo em `src/types/`
- 7 servicos em `src/services/`
- Motor de calculo em `src/core/`

## auto-log duplo obrigatorio
Sempre registrar em `agent/session_log.md` e `agent/falas_user.md` antes de responder.
```

### 3.6 DECISIONS.md

Arquivo: `z:/empresas_b/qg_3forB/src/modules/valuation/DECISIONS.md`

```markdown
# Decisoes Arquiteturais — Valuation e Simulacoes

| Data | Decisao | Motivo |
|------|---------|--------|
| 17/04/2026 | Estrutura inicial criada no padrao de modulos vendeveis | Alinhamento ecossistema SagB |
| 17/04/2026 | Contrato plugavel versionado v1 implementado | Exposicao segura de API do modulo |
| 06/05/2026 | Owner movido de agent/owner.md para manifest.ts | Conformidade padrao_modulos_plugaveis.md |
```

### 3.7 PLANNED.md (convertido de migration-plan.md)

Arquivo: `z:/empresas_b/qg_3forB/src/modules/valuation/PLANNED.md`

```markdown
# Plano de Migracao — Valuation e Simulacoes

## Objetivo
Migrar o modulo do legado 3forB_QG para o padrao SagB de modulos plugaveis.

## Etapas
- [x] Estrutura inicial criada
- [x] Contrato plugavel v1 implementado
- [ ] Integracao com modulo Evaluation
- [ ] Testes unitarios (vitest)
- [ ] Documentacao de API
```

### 3.8 Registrar no moduleRegistry.ts

Adicionar no `moduleRegistry.ts`:

```typescript
import { valuationManifest } from '../modules/valuation';
import { valuationSimulacoesRoutes } from '../modules/valuation';
import { valuationModuleDoc } from '../modules/valuation';

// No array moduleRegistry:
{
  id: 'valuation',
  manifest: valuationManifest,
  routes: valuationSimulacoesRoutes,
  moduleDoc: valuationModuleDoc,
},
```

---

## Fase 4 — Construção do Módulo sites-landing-pages

**Status atual:** `draft` — precisa ser construído do zero no padrão. O código-fonte existe na triagem.

### Ações

1. Copiar `components/`, `pages/`, `services/`, `store/`, `types/` da triagem
2. Criar `manifest.ts` com owner
3. Criar `module-doc.ts` tipado
4. Criar `routes.tsx`
5. Criar `index.ts`
6. Criar `README.md`, `CHANGELOG.md`, `DECISIONS.md`
7. Criar `agent/` com 4 canônicos
8. Remover `agent/owner.md` (legado)
9. Registrar no `moduleRegistry.ts`

### 4.1 Comandos de cópia

```powershell
# Criar estrutura
New-Item -ItemType Directory -Path "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages" -Force

# Copiar código-fonte da triagem
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/components" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/components" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/pages" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/pages" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/services" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/services" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/store" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/store" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/types" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/types" -Recurse -Force
```

### 4.2 manifest.ts

Arquivo: `z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/manifest.ts`

```typescript
export const manifest = {
  id: 'sites-landing-pages',
  displayName: 'Sites e Landing Pages',
  status: 'draft',
  version: '0.1.0',
  basePath: '/sites',
  category: 'operacao',
  entryRoute: '/sites',
  source: '_triagem/3forB_QG/src/modules/sites-landing-pages',
  owner: {
    type: 'agent',
    id: 'designer-sites',
    displayName: 'Designer de Sites e Landing Pages',
  },
};
```

### 4.3 module-doc.ts

Arquivo: `z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/module-doc.ts`

```typescript
import type { ModuleDoc } from '../../core/modules/types';

export const moduleDoc: ModuleDoc = {
  contexto: 'Módulo de criação, edição e gerenciamento de sites e landing pages da 3forB. Integra living models, publicação e versões.',
  objetivo: 'Produtizar a criação de sites e landing pages da 3forB como módulo plugável no padrão SagB.',
  escopoInicial: [
    'Extrair componentes e páginas do legado 3forB_QG',
    'Definir arquitetura de living models integrada',
    'Preparar pipeline de publicação',
    'Estruturar biblioteca de componentes de site',
  ],
};
```

### 4.4 routes.tsx

Arquivo: `z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/routes.tsx`

```typescript
import type { ModuleRoute } from '../../core/modules/types';
import Page from './pages/Index';
import { manifest } from './manifest';

export const sitesLandingPagesRoutes: ModuleRoute[] = [
  {
    path: manifest.entryRoute ?? '/sites',
    element: <Page />,
  },
];
```

### 4.5 index.ts

Arquivo: `z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/index.ts`

```typescript
export { manifest as sitesLandingPagesManifest } from './manifest';
export { sitesLandingPagesRoutes } from './routes';
export { moduleDoc as sitesLandingPagesModuleDoc } from './module-doc';
```

### 4.6 Arquivos de documentação

**README.md:**
```markdown
# Sites e Landing Pages

Modulo de criacao e gerenciamento de sites e landing pages da 3forB.

## Status
`draft` — Estrutura inicial, aguardando desenvolvimento.

## Owner
Designer de Sites e Landing Pages (agent)
```

**CHANGELOG.md:**
```markdown
# Changelog

## 06/05/2026
- Estrutura inicial criada no padrao oficial de modulos vendeveis.
```

**DECISIONS.md:**
```markdown
# Decisoes Arquiteturais — Sites e Landing Pages

| Data | Decisao | Motivo |
|------|---------|--------|
| 06/05/2026 | Estrutura criada no padrao SagB de modulos plugaveis | Alinhamento ecossistema SagB |
```

### 4.7 agent/ (4 canônicos)

**agent/persona.md:**
```markdown
# persona — Sites e Landing Pages

## identidade
Agente especialista em criacao e gerenciamento de sites e landing pages da 3forB.

## responsabilidade principal
- Criar e manter sites e landing pages
- Gerenciar living models e publicacao
- Manter biblioteca de componentes de site
```

**agent/prompt_ativacao_cline.md:**
```markdown
# prompt_ativacao_cline — Sites e Landing Pages

## missao
Operar e evoluir o modulo de Sites e Landing Pages da 3forB.

## auto-log duplo obrigatorio
Sempre registrar em agent/session_log.md e agent/falas_user.md.
```

**agent/session_log.md** (vazio) e **agent/falas_user.md** (vazio).

### 4.8 Remover legado

```powershell
Remove-Item -Path "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/agent/owner.md" -Force
```

---

## Fase 5 — Construção do Módulo vendas

**Status atual:** `draft` — só tem `agent/owner.md`. Precisa ser construído do zero.

### Ações

1. Copiar `components/`, `pages/`, `services/`, `store/`, `types/` da triagem
2. Criar `manifest.ts` com owner
3. Criar `module-doc.ts` tipado
4. Criar `routes.tsx`
5. Criar `index.ts`
6. Criar `README.md`, `CHANGELOG.md`, `DECISIONS.md`
7. Criar `agent/` com 4 canônicos
8. Remover `agent/owner.md` (legado)
9. Registrar no `moduleRegistry.ts`

### 5.1-5.9 (mesmo padrão da Fase 4, adaptando para vendas)

```powershell
New-Item -ItemType Directory -Path "z:/empresas_b/qg_3forB/src/modules/vendas" -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/components" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/components" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/pages" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/pages" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/services" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/services" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/store" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/store" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/types" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/types" -Recurse -Force
```

---

## Fase 6 — Importação dos Módulos Prioritários da Triagem

Módulos a importar de `z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/`:

| Prioridade | Módulo | Ação |
|------------|--------|------|
| Alta | dashboard-executivo | Importar + criar agent/ com 4 canônicos + docs UPPERCASE |
| Alta | eda | Importar + criar agent/ com 4 canônicos + docs UPPERCASE |
| Alta | financeiro | Importar + criar agent/ com 4 canônicos + docs UPPERCASE |
| Alta | comercial | Importar + criar agent/ com 4 canônicos + docs UPPERCASE |

### Template de criação para cada módulo

Para cada módulo `{nome}` importado da triagem:

```powershell
# Criar estrutura
$modulo = "{nome}"
New-Item -ItemType Directory -Path "z:/empresas_b/qg_3forB/src/modules/$modulo" -Force

# Copiar código-fonte
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/$modulo/components" -Destination "z:/empresas_b/qg_3forB/src/modules/$modulo/components" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/$modulo/pages" -Destination "z:/empresas_b/qg_3forB/src/modules/$modulo/pages" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/$modulo/services" -Destination "z:/empresas_b/qg_3forB/src/modules/$modulo/services" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/$modulo/store" -Destination "z:/empresas_b/qg_3forB/src/modules/$modulo/store" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/$modulo/types" -Destination "z:/empresas_b/qg_3forB/src/modules/$modulo/types" -Recurse -Force
```

**Arquivos obrigatórios a criar para cada módulo:**
- `manifest.ts` — com id, displayName, status: 'draft', owner
- `module-doc.ts` — import type ModuleDoc, contexto/objetivo/escopoInicial
- `routes.tsx` — import ModuleRoute, import Page, export routes array
- `index.ts` — export manifest, routes, moduleDoc
- `README.md` — visão executiva
- `CHANGELOG.md` — data inicial
- `DECISIONS.md` — tabela data/decisão/motivo
- `agent/persona.md`
- `agent/prompt_ativacao_cline.md`
- `agent/session_log.md` (vazio)
- `agent/falas_user.md` (vazio)

---

## Fase 7 — Documentação Raiz do QG

### 7.1 README.md

Arquivo: `z:/empresas_b/qg_3forB/README.md`

```markdown
# QG 3forB

Centro de operacoes da 3forB — conjunto de modulos plugaveis no padrao SagB.

## Modulos

| Modulo | Status | Descricao |
|--------|--------|-----------|
| gestao-midias-pagas | hibrido | Comando de midia paga ponta a ponta |
| valuation | migrating | Valuation e simulacoes financeiras |
| sites-landing-pages | draft | Criacao e publicacao de sites |
| vendas | draft | Gestao de vendas |

## Camadas

- `src/modules/` — Modulos plugaveis
- `src/core/modules/` — Sistema de registro de modulos
- `agent/` — Agente do QG
- `governance/` — Documentos de governanca

## Referencias

- `Z:/SagB/docs/governanca_sagb/padrao_unificado_governanca.md`
- `Z:/SagB/docs/governanca_sagb/padrao_modulos_plugaveis.md`
```

### 7.2 CHANGELOG.md

Arquivo: `z:/empresas_b/qg_3forB/CHANGELOG.md`

```markdown
# Changelog — QG 3forB

## 06/05/2026
- Estrutura inicial do QG criada
- Modulo gestao-midias-pagas migrado e padronizado
- Modulo valuation migrado e ajustado
- Modulos sites-landing-pages e vendas criados (draft)
- Sistema de registro de modulos implementado
- Documentacao de governanca espelhada
```

### 7.3 DECISIONS.md

Arquivo: `z:/empresas_b/qg_3forB/DECISIONS.md`

```markdown
# Decisoes Arquiteturais — QG 3forB

| Data | Decisao | Motivo |
|------|---------|--------|
| 06/05/2026 | QG estruturado como projeto standalone com modulos plugaveis | Independencia do workspace SagB principal |
| 06/05/2026 | Modulos da raiz 3forB migrados para src/modules/ do QG | Unificar estrutura e aplicar padrao |
| 06/05/2026 | Padrao de governanca SagB adotado como norma transversal | Consistencia com ecossistema corporativo |
```

### 7.4 PLANNED.md

Arquivo: `z:/empresas_b/qg_3forB/PLANNED.md`

```markdown
# Roadmap — QG 3forB

## Proximo
- [ ] Importar modulos dashboard-executivo, eda, financeiro, comercial da triagem
- [ ] Configurar integracao com Vite dev server (porta 5100)
- [ ] Testar build e dev do QG

## Medio prazo
- [ ] Importar demais modulos da triagem
- [ ] Configurar CI/CD (Netlify ou similar)
- [ ] Estabelecer pipeline de deploy autonomo

## Longo prazo
- [ ] Integracao com o moduleRegistry do SagB
- [ ] Publicacao como pacote npm ou micro-frontend
```

---

## Fase 8 — Instalação e Build

### 8.1 Instalar dependências

```powershell
cd z:/empresas_b/qg_3forB
npm install
```

### 8.2 Build de verificação

```powershell
npm run build
```

### 8.3 Dev server

```powershell
npm run dev
```

---

## Resumo de Todos os Arquivos a Criar/Modificar

### Novos (criar)
| Arquivo | Fase |
|---------|------|
| `package.json` | 0.2 |
| `vite.config.ts` | 0.3 |
| `tsconfig.json` | 0.4 |
| `tsconfig.tsbuildinfo` | 0.5 |
| `index.html` | 0.6 |
| `src/main.tsx` | 0.7 |
| `src/App.tsx` | 0.8 |
| `src/core/modules/types.ts` | 0.9 |
| `src/core/modules/moduleRegistry.ts` | 0.10 |
| `agent/persona.md` | 1.1 |
| `agent/prompt_ativacao_cline.md` | 1.2 |
| `agent/session_log.md` | 1.3 |
| `agent/falas_user.md` | 1.4 |
| `governance/padrao_unificado_governanca.md` | 1.5 |
| `governance/padrao_modulos_plugaveis.md` | 1.6 |
| `governance/decisions.md` | 1.7 |
| `gestao-midias-pagas/agent/prompt_ativacao_cline.md` | 2.4 |
| `gestao-midias-pagas/DECISIONS.md` | 2.5 |
| `gestao-midias-pagas/README.md` | 2.6 |
| `valuation/index.ts` | 3.2 |
| `valuation/agent/prompt_ativacao_cline.md` | 3.5 |
| `valuation/DECISIONS.md` | 3.6 |
| `valuation/PLANNED.md` | 3.7 |
| `sites-landing-pages/*` (todos os arquivos) | 4 |
| `vendas/*` (todos os arquivos) | 5 |
| Modulos da triagem (4 prioritarios + template) | 6 |
| `README.md` (raiz) | 7.1 |
| `CHANGELOG.md` (raiz) | 7.2 |
| `DECISIONS.md` (raiz) | 7.3 |
| `PLANNED.md` (raiz) | 7.4 |

### Modificados (alterar)
| Arquivo | Fase | Mudança |
|---------|------|---------|
| `gestao-midias-pagas/manifest.ts` | 2.2 | Adicionar owner |
| `gestao-midias-pagas/module-doc.ts` | 2.3 | Tipar com ModuleDoc |
| `gestao-midias-pagas/changelog.md` → `CHANGELOG.md` | 2.6 | Renomear |
| `valuation/src/manifest.ts` | 3.3 | Adicionar owner |
| `valuation/module-doc.ts` | 3.4 | Tipar com ModuleDoc |
| `valuation/changelog.md` → `CHANGELOG.md` | 3.7 | Renomear |
| `valuation/migration-plan.md` → `PLANNED.md` | 3.7 | Renomear/converter |
| `moduleRegistry.ts` | 2.8, 3.8 | Adicionar registros |

### Removidos (deletar)
| Arquivo | Fase | Motivo |
|---------|------|--------|
| `gestao-midias-pagas/agent/owner.md` | 2.9 | Legado |
| `valuation/agent/owner.md` | 3.9 | Legado |
| `sites-landing-pages/agent/owner.md` | 4.8 | Legado |
| `vendas/agent/owner.md` | 5 | Legado |

---

## Sumário de Comandos (PowerShell)

```powershell
# === FASE 0: Setup ===
cd z:/empresas_b/qg_3forB
mkdir agent, governance, src/core/modules, src/modules, src/shell, src/styles, _triagem

# === FASE 2: gestao-midias-pagas ===
Copy-Item -Path "z:/empresas_b/3forB/modules/gestao-midias-pagas" -Destination "z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas" -Recurse -Force
Remove-Item -Path "z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/agent/owner.md" -Force
Move-Item -Path "z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/changelog.md" -Destination "z:/empresas_b/qg_3forB/src/modules/gestao-midias-pagas/CHANGELOG.md" -Force

# === FASE 3: valuation ===
Copy-Item -Path "z:/empresas_b/3forB/modules/valuation" -Destination "z:/empresas_b/qg_3forB/src/modules/valuation" -Recurse -Force
Remove-Item -Path "z:/empresas_b/qg_3forB/src/modules/valuation/agent/owner.md" -Force
Move-Item -Path "z:/empresas_b/qg_3forB/src/modules/valuation/agent/session.md" -Destination "z:/empresas_b/qg_3forB/src/modules/valuation/agent/session_log.md" -Force
Move-Item -Path "z:/empresas_b/qg_3forB/src/modules/valuation/changelog.md" -Destination "z:/empresas_b/qg_3forB/src/modules/valuation/CHANGELOG.md" -Force
Move-Item -Path "z:/empresas_b/qg_3forB/src/modules/valuation/migration-plan.md" -Destination "z:/empresas_b/qg_3forB/src/modules/valuation/PLANNED.md" -Force

# === FASE 4: sites-landing-pages ===
New-Item -ItemType Directory -Path "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages" -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/components" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/components" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/pages" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/pages" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/services" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/services" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/store" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/store" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/sites-landing-pages/types" -Destination "z:/empresas_b/qg_3forB/src/modules/sites-landing-pages/types" -Recurse -Force

# === FASE 5: vendas ===
New-Item -ItemType Directory -Path "z:/empresas_b/qg_3forB/src/modules/vendas" -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/components" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/components" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/pages" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/pages" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/services" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/services" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/store" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/store" -Recurse -Force
Copy-Item -Path "z:/empresas_b/3forB/_triagem/3forB_QG/src/modules/vendas/types" -Destination "z:/empresas_b/qg_3forB/src/modules/vendas/types" -Recurse -Force

# === FASE 8: Instalar e build ===
cd z:/empresas_b/qg_3forB
npm install
npm run build
```
