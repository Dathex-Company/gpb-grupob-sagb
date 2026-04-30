# Changelog - CRM Ziplia

Todas as mudanças relevantes do módulo **crm_ziplia** serão registradas aqui.

## [Unreleased]

### Adicionado
- Plano executivo de migração total para módulo nativo em [`plans/plano-migracao-crm-ziplia-modulo-sagb.md`](plans/plano-migracao-crm-ziplia-modulo-sagb.md).
- Página nativa inicial do CRM em [`CrmZipliaNativePage.tsx`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx).
- Componentes de MVP interno: [`CrmKpiCard.tsx`](src/modules/crm_ziplia/components/CrmKpiCard.tsx) e [`CrmPipelineBoard.tsx`](src/modules/crm_ziplia/components/CrmPipelineBoard.tsx).
- Tipos internos do domínio CRM em [`types.ts`](src/modules/crm_ziplia/types.ts).
- Serviço de dados com Supabase direto em [`crmZipliaService.ts`](src/modules/crm_ziplia/services/crmZipliaService.ts).
- Documento técnico do módulo em [`module-doc.ts`](src/modules/crm_ziplia/module-doc.ts).

### Alterado
- Rota principal do módulo mudou de iframe para página nativa em [`routes.tsx`](src/modules/crm_ziplia/routes.tsx).
- Identidade interna do manifesto atualizada para `crm_ziplia_modulo_nativo` em [`manifest.ts`](src/modules/crm_ziplia/manifest.ts).

