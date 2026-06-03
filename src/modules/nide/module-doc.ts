import { ModuleDoc } from '../../core/modules/module.types';

export const nideDoc: ModuleDoc = {
  displayName: 'NIDE',
  purpose: 'Núcleo Inteligente de Desenvolvimento de Estruturas — módulo-mãe responsável por desenvolver, organizar, estruturar, versionar e preparar estruturas proprietárias do SagB. Incorpora Missões como core funcional (ET 03), Metodologias como domínio interno (ET 05), Mentorias como domínio interno (ET 06). A ET 09 ocultou os módulos originais do menu global. A ET 10 adicionou redirects via tabAliases. O ciclo 01-10 de migração está concluído.',
  version: '0.7.0',
  boundaries: [
    'NÃO substitui módulos existentes — todos preservados como fallback',
    'NÃO apaga pastas originais — Missões, Metodologias, Mentorias intactas',
    'NÃO altera Supabase — nenhuma tabela, migration ou RLS',
    'NÃO remove do moduleRegistry — módulos originais ainda registrados',
    'Rotas legadas redirecionam via tabAliases (não quebram)',
    'Metodologias e Mentorias como domínios internos coexistem com módulos globais originais',
    'Missões como core funcional coexiste com módulo global original',
    'Não gerencia dados financeiros',
    'Não se conecta diretamente a APIs externas sem adaptador explícito',
    'Não substitui o TaskZei para alocação de ações corretivas',
    'Domínios internos não substituem o moduleRegistry global',
    'Metodologias e Mentorias utilizam lazy loading para não impactar bundle principal',
    'Menu global do SagB exibe apenas NIDE como entrada principal'
  ],
  integrations: {
    internal: [
      'moduleRegistry — registro como módulo plugável',
      'sagbNavigate — navegação global via CustomEvent',
      'domainRegistry — registry interno de domínios plugáveis',
      'metodologiasDomain — domínio Metodologias (lazy loaded, hash-based routing)',
      'mentoriasDomain — domínio Mentorias (lazy loaded, view-based routing)',
      'monitoramento — futuramente alimentará métricas de domínios'
    ],
    external: []
  },
  dataDependencies: {
    supabaseTables: [],
    storageBuckets: [],
    localStorageKeys: [
      'sagb:module-toggles:v3',
      'sagb:module-order:v1'
    ]
  }
};
