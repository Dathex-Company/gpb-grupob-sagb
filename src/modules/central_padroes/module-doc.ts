import { ModuleDoc } from '../../core/modules/module.types';

export const moduleDoc: ModuleDoc = {
  displayName: 'Central de Padrões',
  purpose: 'Consolidar, validar, publicar e relacionar padrões oficiais, documentos, decisões, módulos, agentes, checklists e evidências do SagB.',
  version: '1.1.0',
  boundaries: [
    'não implementa padrões — apenas os documenta e audita',
    'não substitui o design system — apenas o referencia',
    'não gerencia código de outros módulos — apenas define as regras'
  ],
  integrations: {
    internal: [
      'src/core/modules/moduleRegistry.ts',
      'src/modules/central_padroes/services/governanceRulesService.ts',
      'src/modules/central_padroes/services/centralPadroesRepository.ts'
    ],
    external: [
      'AI Proxy (consulta de padrões)',
      'Governança SagB'
    ]
  },
  dataDependencies: {
    supabaseTables: [
      'governance_rules',
      'central_padroes_areas',
      'central_padroes_standards',
      'central_padroes_standard_dependencies',
      'central_padroes_documents',
      'central_padroes_decisions',
      'central_padroes_checklists',
      'central_padroes_module_links',
      'central_padroes_agent_runs',
      'central_padroes_approval_requests',
      'central_padroes_evidence_records'
    ],
    storageBuckets: [
      'cp-documents',
      'cp-evidence'
    ],
    localStorageKeys: []
  }
};
