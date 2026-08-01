import { ModuleDoc } from '../../core/modules/module.types';

export const simuladorMentoriasModuleDoc: ModuleDoc = {
  displayName: 'Simulador de Mentorias',
  purpose: 'Planejar, comparar e acompanhar a viabilidade financeiro-comercial de turmas de mentoria com cenários, alertas e planejado versus realizado.',
  version: '0.1.0',
  boundaries: [
    'Não processa pagamentos',
    'Não emite documentos fiscais',
    'Não substitui CRM completo',
    'Não recalcula silenciosamente snapshots aprovados',
    'Não usa IA dentro do motor de cálculo'
  ],
  integrations: {
    internal: ['src/core/modules/moduleRegistry.ts', 'NIDE / Mentorias'],
    external: ['Supabase planejado para persistência em etapa posterior']
  },
  dataDependencies: {
    supabaseTables: [
      'mentorship_simulations',
      'mentorship_simulation_scenarios',
      'mentorship_price_tiers',
      'mentorship_acquisition_channels',
      'mentorship_cost_items',
      'mentorship_upsell_offers',
      'mentorship_simulation_results',
      'mentorship_simulation_actuals',
      'mentorship_simulation_approvals',
      'mentorship_simulation_history'
    ],
    localStorageKeys: []
  }
};
