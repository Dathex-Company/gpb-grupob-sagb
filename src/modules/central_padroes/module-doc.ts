import { ModuleDoc } from '../../core/modules/module.types';

export const moduleDoc: ModuleDoc = {
  displayName: 'Central de Padrões',
  purpose: 'Consolidar, validar e publicar padrões oficiais de código, design, nomenclatura e arquitetura do SagB.',
  version: '1.0.0',
  boundaries: [
    'não implementa padrões — apenas os documenta e audita',
    'não substitui o design system — apenas o referencia',
    'não gerencia código de outros módulos — apenas define as regras'
  ],
  integrations: {
    internal: [
      'src/core/modules/moduleRegistry.ts'
    ],
    external: [
      'AI Proxy (consulta de padrões)',
      'Governança SagB'
    ]
  },
  dataDependencies: {
    supabaseTables: [],
    storageBuckets: [],
    localStorageKeys: []
  }
};
