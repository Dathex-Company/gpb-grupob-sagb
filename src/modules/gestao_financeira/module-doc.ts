/**
 * Guia de Ativos Técnicos - Gestão Financeira
 * Responsável: Yasmin Rangel
 */

export const gestaoFinanceiraDocs = {
  responsible: 'Yasmin Rangel',
  status: 'Core Implemented (v2.0)',
  database: {
    provider: 'Supabase',
    schema: 'finance',
    tables: [
      {
        name: 'plano_de_contas',
        description: 'Estrutura hierárquica de contas (Ativo, Passivo, etc).'
      },
      {
        name: 'transacoes',
        description: 'Registro de todas as entradas e saídas financeiras.'
      },
      {
        name: 'configuracoes_api',
        description: 'Configurações de integração bancária (Asaas, Iugu, etc).'
      },
      {
        name: 'conciliacoes',
        description: 'Rastreabilidade de eventos de webhook e conciliação automática.'
      }
    ]
  },
  integrations: [
    {
      name: 'Bank API',
      type: 'REST/Webhooks',
      status: 'Connected via provider config + sync routine'
    }
  ],
  assets: [
    {
      name: 'bankIntegrationService',
      type: 'Service Class',
      path: './services/bankIntegrationService.ts'
    },
    {
      name: 'financeService',
      type: 'Persistence + Conciliação Service',
      path: './services/financeService.ts'
    }
  ]
};
