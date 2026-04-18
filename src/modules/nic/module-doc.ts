export const moduleDoc = {
  nomeOficial: 'Núcleo de Inteligência Conectiva (NIC)',
  objetivo:
    'Cruzar materiais internos preparados pelo CID e por outras fontes internas do SagB para identificar conexões, padrões, tensões, riscos e oportunidades que alimentam a governança estratégica.',
  responsavelTecnico: 'A DEFINIR',
  status: 'Em teste',
  tipo: 'Módulo Oficial',

  tabelasSupabase: [
    'A DEFINIR (sem schema transacional próprio claramente exposto no frontend atual)'
  ],

  bucketsStorage: [
    'Não é storage primário; consome materiais preparados por camadas como CID e memória operacional'
  ],

  integracoes: [
    'CID (fonte documental principal)',
    'NAGI (destino de governança e priorização)',
    'Memória Contínua (fonte complementar)',
    'Fluxo de Inteligência (saídas estratégicas futuras)'
  ],

  estruturasExclusivas: [
    'src/modules/nic/pages/NICPage.tsx',
    'src/modules/nic/data/nicBlueprint.ts',
    'src/modules/nic/agent/owner.md',
    'src/modules/nic/agent/persona.md',
    'src/modules/nic/changelog.md'
  ],

  estruturasCompartilhadas: [
    'src/core/modules/module.types.ts',
    'components/Icon.tsx'
  ],

  fluxosPrincipais: [
    '1. Seleção de fontes: o NIC recebe ou referencia documentos internos preparados por módulos como o CID.',
    '2. Aplicação de lentes: o usuário escolhe uma lente de leitura (risco, oportunidade, sinergia, contradição, metodologia ou padrão recorrente).',
    '3. Interpretação: o módulo cruza materiais e gera leitura estratégica com evidências, hipóteses e recomendações.',
    '4. Encaminhamento: as saídas estratégicas devem alimentar governança, priorização e próximos passos no NAGI.'
  ],

  pendenciasPrincipais: [
    'Substituir documentos mockados por seleção real de materiais do CID.',
    'Implementar motor real de cruzamento e interpretação, hoje representado principalmente por blueprint e interface.',
    'Definir schema persistente para histórico de leituras e saídas estratégicas.',
    'Conectar saídas do NIC ao NAGI com fluxo vivo de priorização.',
    'Definir owner principal e backup com nomeação formal.'
  ]
};
