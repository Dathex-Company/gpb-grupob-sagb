/**
 * Guia técnico do módulo CRM Ziplia nativo no SagB
 */

export const crmZipliaModuleDoc = {
  responsible: 'Denic Celmi',
  status: 'Migração em andamento (Fase 1 e Fase 2)',
  objective:
    'Internalizar o CRM Ziplia no runtime do SagB, removendo dependência de iframe e servidor externo para operação principal.',
  assets: [
    {
      name: 'CrmZipliaNativePage',
      type: 'Page',
      path: './pages/CrmZipliaNativePage.tsx'
    },
    {
      name: 'crmZipliaService',
      type: 'Service',
      path: './services/crmZipliaService.ts'
    },
    {
      name: 'CrmPipelineBoard',
      type: 'Component',
      path: './components/CrmPipelineBoard.tsx'
    }
  ],
  dataSource: {
    primary: 'Supabase via services/supabase.ts (restFetch)',
    strategy: 'Migração total para consumo direto no SagB'
  }
};

