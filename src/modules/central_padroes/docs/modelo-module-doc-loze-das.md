# LOZE-DAS | Modelo padrão de module-doc.ts

**Etapa:** ET-02  
**Objetivo:** padronizar documentação viva por módulo do SagB by Loze.

---

## 1. Regra

Todo módulo plugável deve possuir `module-doc.ts`. Módulos legados, submódulos e labs também devem ter documentação equivalente antes de evolução relevante.

## 2. Template recomendado

```ts
export const moduleDoc = {
  lozeDasVersion: '0.1',
  id: 'id-do-modulo',
  displayName: 'Nome exibido',
  internalName: 'nome_interno',
  status: 'core | parcial | lab | legado-protegido | confuso | pendente de validação',
  categoria: 'core | operacional | ia | integracao | qg | lab | governanca',
  owner: {
    type: 'agent | human | team | a-definir',
    id: 'owner_id',
    displayName: 'Nome do responsável'
  },
  purpose: 'Objetivo claro do módulo.',
  scope: {
    includes: ['O que o módulo faz'],
    excludes: ['O que o módulo não deve fazer']
  },
  navigation: {
    registryId: 'id-no-moduleRegistry',
    baseRoute: '/rota-base',
    tabs: ['tabs internas se houver'],
    aliases: ['aliases legados se houver']
  },
  files: {
    root: 'src/modules/modulo',
    manifest: 'src/modules/modulo/manifest.ts',
    routes: 'src/modules/modulo/routes.tsx',
    pages: [],
    services: [],
    hooks: [],
    components: []
  },
  data: {
    provider: 'supabase | localStorage | mock | hybrid | none',
    supabaseTables: [],
    storageBuckets: [],
    localStorageKeys: [],
    netlifyFunctions: []
  },
  dependencies: {
    modules: [],
    externalServices: [],
    agents: []
  },
  maturity: {
    current: 'pronto | parcial | rascunho | confuso',
    evidence: ['Evidências técnicas'],
    blockers: ['Bloqueios conhecidos']
  },
  risks: [
    {
      type: 'seguranca | dados | ux | arquitetura | duplicidade | operacional',
      description: 'Descrição do risco',
      severity: 'baixa | media | alta | critica',
      recommendation: 'Ação recomendada'
    }
  ],
  quarantineRefs: [],
  adrRefs: [],
  pendingDecisions: [],
  nextRecommendedActions: []
};
```

## 3. Campos mínimos obrigatórios

- `id`
- `displayName`
- `status`
- `purpose`
- `navigation.registryId`
- `navigation.baseRoute`
- `files.root`
- `data.provider`
- `risks`
- `nextRecommendedActions`

## 4. Critério de aceite para promover módulo a core

1. Possuir `manifest.ts`, `routes.tsx`, `module-doc.ts` e docs mínimas.
2. Ter status claro e owner definido.
3. Ter tabelas/functions/storage documentados.
4. Não depender de mock silencioso em fluxo principal.
5. Ter riscos conhecidos registrados.
6. Ter relação com Loze Docs e ADRs quando houver decisão estrutural.
