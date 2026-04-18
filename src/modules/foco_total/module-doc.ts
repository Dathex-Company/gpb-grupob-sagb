export const moduleDoc = {
  nome_oficial: 'Zen Folk | Foco AI',
  versao: '0.1.0',
  resumo:
    'Módulo oficial para evolução do produto Foco AI guiado por IA, com o agente Zen Folk como presença operacional durante sprints de execução.',
  proposta_de_valor:
    'Transformar blocos de trabalho em sprints assistidos por IA, com sustentação ativa de foco, recuperação de desvio e fechamento orientado por progresso.',
  ownership: {
    owner_principal: 'Zen Folk',
    owner_backup: 'A DEFINIR'
  },
  pilares_mvp: [
    'Timer de sprint com tarefa e duração',
    'Intervenções motivacionais curtas durante a sessão',
    'Fechamento obrigatório com registro de resultado',
    'Histórico local de sessões para aprendizado progressivo'
  ],
  roadmap_faseado: {
    fase_1_mvp: [
      'Sprint setup (tarefa + tempo)',
      'Timer operacional',
      'Mensagens de reforço por texto',
      'Voz opcional',
      'Resumo e histórico da sessão'
    ],
    fase_2_agente_inteligente: [
      'Mensagens dinâmicas por IA conforme momento do sprint',
      'Perfis de tom do agente (firme, calmo, parceiro, modo TDAH)',
      'Sugestão de micro-metas e fechamento adaptativo'
    ],
    fase_3_tracking: [
      'Detecção de perda de foco da janela',
      'Detecção de ociosidade',
      'Alertas de retorno e score de permanência'
    ],
    fase_4_contexto_avancado: [
      'Leitura contextual de tela (com consentimento explícito)',
      'Inferência de desvio de tarefa por contexto visual'
    ]
  },
  stack_sugerida: ['React', 'Tauri', 'OpenAI', 'SQLite local'],
  riscos_e_cuidados: [
    'Privacidade e permissões para monitoramento avançado',
    'Evitar complexidade excessiva no MVP',
    'Controlar custo de chamadas de IA e voz',
    'Manter alertas firmes sem experiência punitiva'
  ],
  fonte_de_origem: ['src/modules/.foco_total/_triagem/foco ai coach chat gpt']
};
