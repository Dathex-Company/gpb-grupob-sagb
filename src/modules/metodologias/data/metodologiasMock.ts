import type { Metodologia } from '../types';

export const METODOLOGIAS_MOCK: Metodologia[] = [
  {
    id: 'met-sagb-canonica',
    tipo_de_ativo: 'metodologia',
    nome: 'Arquitetura Metodológica Canônica SagB',
    slug: 'arquitetura-metodologica-canonica-sagb',
    resumo:
      'Base oficial para estruturar metodologias como ativos vivos, com clareza ontológica e rastreabilidade evolutiva.',
    definicao:
      'Metodologia estruturante que define os princípios, blocos e contratos mínimos para criação, leitura e evolução de metodologias no ecossistema SagB.',
    objetivo:
      'Padronizar como uma metodologia nasce, amadurece e se consolida no sistema, evitando expansão sem semântica comum.',
    status_editorial: 'oficial',
    maturidade_pratica: 'modelada',
    governanca: {
      estado_ciclo_vida: 'oficial',
      oficializado_em: '2026-04-05T07:00:00.000Z',
      observacao: 'Ativo canônico de referência para o núcleo.',
      responsaveis: [
        { id: 'gov-cassio', nome: 'Cássio', papel: 'responsavel_principal' },
        { id: 'gov-lia', nome: 'Lia M. Rocha', papel: 'curador' },
        { id: 'gov-heitor', nome: 'Heitor S.', papel: 'aprovador' }
      ]
    },
    versao_atual: 'v0.2.0-et02',
    created_at: '2026-04-05T07:00:00.000Z',
    updated_at: '2026-04-05T07:00:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Identidade, definição e propósito metodológico.'
      },
      {
        id: 'bloco-estrutura',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Composição mínima, fases e elementos nucleares da metodologia.'
      },
      {
        id: 'bloco-aplicacao',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Diretrizes para uso prático em unidades, operações e ciclos reais.'
      },
      {
        id: 'bloco-governanca',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Critérios de decisão, atualização e responsabilidade evolutiva.'
      }
    ],
    versoes_oficiais: [
      {
        id: 'ver-met-sagb-canonica-0.1.0',
        ativo_id: 'met-sagb-canonica',
        numero_versao: 'v0.1.0',
        titulo: 'Fundação canônica inicial',
        resumo_da_versao:
          'Primeira formalização da estrutura-base com blocos nucleares e contrato mínimo de governança.',
        status_da_versao: 'superada',
        publicada_em: '2026-03-20T10:30:00.000Z',
        observacao: 'Marco da consolidação da ET 01 e ET 02.'
      },
      {
        id: 'ver-met-sagb-canonica-0.2.0',
        ativo_id: 'met-sagb-canonica',
        numero_versao: 'v0.2.0-et02',
        titulo: 'Taxonomia e governança estruturadas',
        resumo_da_versao:
          'Evolução oficial com refinamento da taxonomia de ativos e separação explícita de responsabilidades de governança.',
        status_da_versao: 'vigente',
        publicada_em: '2026-04-05T07:00:00.000Z',
        observacao: 'Versão vigente no hub para leitura institucional.'
      },
      {
        id: 'ver-met-sagb-canonica-0.3.0-draft',
        ativo_id: 'met-sagb-canonica',
        numero_versao: 'v0.3.0-draft',
        titulo: 'Histórico estruturado e camadas evolutivas',
        resumo_da_versao:
          'Rascunho da próxima consolidação formal para incluir trilha histórica estruturada e marcos de evolução semântica.',
        status_da_versao: 'rascunho',
        publicada_em: '2026-04-06T09:00:00.000Z',
        observacao: 'Em construção na ET 07.'
      }
    ],
    historico_estruturado: [
      {
        id: 'evt-met-sagb-canonica-001',
        ativo_id: 'met-sagb-canonica',
        tipo_de_evento: 'criado',
        descricao: 'Ativo metodológico criado como fonte canônica do núcleo.',
        ocorrido_em: '2026-03-18T09:00:00.000Z'
      },
      {
        id: 'evt-met-sagb-canonica-002',
        ativo_id: 'met-sagb-canonica',
        tipo_de_evento: 'enviado_para_revisao',
        descricao: 'Submetido para revisão cruzada entre curadoria e governança.',
        ocorrido_em: '2026-03-28T14:00:00.000Z'
      },
      {
        id: 'evt-met-sagb-canonica-003',
        ativo_id: 'met-sagb-canonica',
        tipo_de_evento: 'oficializado',
        descricao: 'Oficialização da versão v0.2.0-et02 como referência institucional.',
        ocorrido_em: '2026-04-05T07:00:00.000Z',
        observacao: 'Convergência com a camada de governança formal.'
      },
      {
        id: 'evt-met-sagb-canonica-004',
        ativo_id: 'met-sagb-canonica',
        tipo_de_evento: 'aplicacao_registrada',
        descricao: 'Aplicação registrada no onboarding metodológico da Unidade NEXA.',
        ocorrido_em: '2026-04-05T08:45:00.000Z'
      },
      {
        id: 'evt-met-sagb-canonica-005',
        ativo_id: 'met-sagb-canonica',
        tipo_de_evento: 'derivado_criado',
        descricao: 'Criação de checklist operacional derivado para gate de publicação.',
        ocorrido_em: '2026-04-05T09:40:00.000Z'
      }
    ],
    versoes_ids: ['met-sagb-canonica-v0.1.0', 'met-sagb-canonica-v0.2.0'],
    historico_ids: ['hist-001', 'hist-002'],
    aplicacoes_ids: ['apl-001'],
    relacoes: [{ metodologia_id: 'proc-ciclo-validacao', tipo_relacao: 'complementa' }],
    relacoes_ativos: [
      {
        id: 'rel-001',
        tipo_de_relacao: 'complementa',
        ativo_origem_id: 'met-sagb-canonica',
        ativo_destino_id: 'proc-ciclo-validacao',
        observacao: 'A arquitetura canônica ganha concretude quando aplicada ao ciclo de validação.'
      },
      {
        id: 'rel-002',
        tipo_de_relacao: 'usa_como_base',
        ativo_origem_id: 'met-sagb-canonica',
        ativo_destino_id: 'princ-clareza-semantica',
        observacao: 'A clareza semântica é fundamento para leitura e evolução da arquitetura.'
      },
      {
        id: 'rel-003',
        tipo_de_relacao: 'operacionaliza',
        ativo_origem_id: 'met-sagb-canonica',
        ativo_destino_id: 'chk-publicacao',
        observacao: 'Checklist traduz contratos canônicos em critérios operacionais de publicação.'
      }
    ],
    evidencias_aplicacao: [
      {
        id: 'evid-001',
        ativo_id: 'met-sagb-canonica',
        contexto: 'Onboarding metodológico de nova célula operacional',
        aplicado_em: 'Unidade NEXA • Ciclo 2026-Q1',
        descricao: 'Uso da estrutura canônica para guiar entendimento de essência, estrutura e governança.',
        resultado_percebido: 'Redução de ruído semântico entre curadoria e execução em campo.',
        aprendizados: 'Explicitar exemplos por tipo de ativo acelera assimilação da taxonomia.',
        validou_ativo: true,
        observacao: 'Demandou reforço visual da camada de aplicação no material de apoio.'
      },
      {
        id: 'evid-002',
        ativo_id: 'met-sagb-canonica',
        contexto: 'Revisão cruzada entre times de produto e governança',
        aplicado_em: 'Ritual de revisão ET 04 → ET 05',
        descricao: 'Arquitetura usada como referência comum para resolver divergências de escopo.',
        resultado_percebido: 'Decisões mais rápidas com menor retrabalho de modelagem.',
        aprendizados: 'Relações explícitas entre ativos evitam interpretação isolada da metodologia.',
        validou_ativo: true
      }
    ],
    ativos_derivados: [
      {
        id: 'der-met-sagb-checklist-publicacao-v2',
        ativo_origem_id: 'met-sagb-canonica',
        tipo_de_projecao: 'checklist_operacional',
        nome: 'Checklist Operacional de Publicação Canônica',
        resumo:
          'Checklist derivado da fonte canônica para garantir consistência mínima antes da publicação de ativos no hub.',
        objetivo:
          'Traduzir critérios nucleares da metodologia-fonte em validações objetivas e rápidas para o fluxo editorial.',
        status_editorial: 'aprovada',
        versao_atual: 'v1.1.0',
        created_at: '2026-04-05T09:40:00.000Z',
        updated_at: '2026-04-05T09:55:00.000Z',
        observacao:
          'Não substitui a metodologia-fonte; serve como desdobramento operacional para ritual de publicação.'
      },
      {
        id: 'der-met-sagb-playbook-onboarding',
        ativo_origem_id: 'met-sagb-canonica',
        tipo_de_projecao: 'playbook_operacional',
        nome: 'Playbook de Onboarding Metodológico',
        resumo:
          'Playbook orientado a líderes de célula para aplicação da arquitetura metodológica nos primeiros ciclos.',
        objetivo:
          'Acelerar adoção em contexto real sem descaracterizar os contratos conceituais da fonte canônica.',
        status_editorial: 'em_revisao',
        versao_atual: 'v0.4.2',
        created_at: '2026-04-05T08:10:00.000Z',
        updated_at: '2026-04-05T09:30:00.000Z'
      },
      {
        id: 'der-met-sagb-roteiro-curadoria',
        ativo_origem_id: 'met-sagb-canonica',
        tipo_de_projecao: 'roteiro_treinamento',
        nome: 'Roteiro de Treinamento para Curadoria Metodológica',
        resumo:
          'Trilha de capacitação para curadores com foco em leitura semântica, governança e evidência de aplicação.',
        objetivo:
          'Capacitar curadores para operar o núcleo sem confundir metodologia-fonte com materiais operacionais.',
        status_editorial: 'em_estruturacao',
        versao_atual: 'v0.2.0',
        created_at: '2026-04-05T07:50:00.000Z',
        updated_at: '2026-04-05T09:10:00.000Z'
      }
    ],
    agentes_vinculados: [{ agente_id: 'agt-cassio', papel: 'curador_metodologico' }]
  },
  {
    id: 'proc-ciclo-validacao',
    tipo_de_ativo: 'processo',
    nome: 'Processo de Validação Metodológica',
    slug: 'processo-validacao-metodologica',
    resumo: 'Fluxo incremental para validar hipóteses metodológicas antes da oficialização.',
    definicao:
      'Fluxo de teste progressivo para verificar consistência, utilidade e aplicabilidade de uma metodologia em ambiente controlado.',
    objetivo:
      'Reduzir risco de adoção prematura e aumentar evidência prática para decisões editoriais e de governança.',
    status_editorial: 'em_revisao',
    maturidade_pratica: 'testada',
    governanca: {
      estado_ciclo_vida: 'em_revisao',
      observacao: 'Em revisão por pares antes de decisão de oficialização.',
      responsaveis: [
        { id: 'gov-ana', nome: 'Ana Beatriz', papel: 'responsavel_principal' },
        { id: 'gov-cassio', nome: 'Cássio', papel: 'curador' },
        { id: 'gov-rafa', nome: 'Rafael T.', papel: 'revisor' }
      ]
    },
    versao_atual: 'v0.7.3-et03',
    created_at: '2026-03-18T10:00:00.000Z',
    updated_at: '2026-04-02T18:00:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia-cvm',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Hipóteses, escopo e critérios de valor esperado.'
      },
      {
        id: 'bloco-estrutura-cvm',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Sequência de experimentos, checkpoints e métricas de validação.'
      },
      {
        id: 'bloco-aplicacao-cvm',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Pilotos controlados com feedback operacional contextualizado.'
      },
      {
        id: 'bloco-governanca-cvm',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Revisão por pares, critérios de aprovação e trilha de decisão.'
      }
    ],
    versoes_oficiais: [
      {
        id: 'ver-proc-ciclo-validacao-0.6.0',
        ativo_id: 'proc-ciclo-validacao',
        numero_versao: 'v0.6.0',
        resumo_da_versao:
          'Primeira versão formal com etapas mínimas de experimento e checkpoints de validação.',
        status_da_versao: 'superada',
        publicada_em: '2026-03-24T17:00:00.000Z'
      },
      {
        id: 'ver-proc-ciclo-validacao-0.7.3',
        ativo_id: 'proc-ciclo-validacao',
        numero_versao: 'v0.7.3-et03',
        resumo_da_versao:
          'Refino de critérios de saída e vínculo explícito com ativos canônicos de base.',
        status_da_versao: 'vigente',
        publicada_em: '2026-04-02T18:00:00.000Z'
      }
    ],
    historico_estruturado: [
      {
        id: 'evt-proc-ciclo-validacao-001',
        ativo_id: 'proc-ciclo-validacao',
        tipo_de_evento: 'criado',
        descricao: 'Processo criado para validar hipóteses metodológicas em ambiente controlado.',
        ocorrido_em: '2026-03-18T10:00:00.000Z'
      },
      {
        id: 'evt-proc-ciclo-validacao-002',
        ativo_id: 'proc-ciclo-validacao',
        tipo_de_evento: 'atualizado',
        descricao: 'Ajuste de checkpoints e métricas de decisão após pilotos iniciais.',
        ocorrido_em: '2026-03-30T16:20:00.000Z'
      },
      {
        id: 'evt-proc-ciclo-validacao-003',
        ativo_id: 'proc-ciclo-validacao',
        tipo_de_evento: 'enviado_para_revisao',
        descricao: 'Versão vigente submetida para revisão por pares antes de oficialização.',
        ocorrido_em: '2026-04-02T17:40:00.000Z'
      }
    ],
    relacoes_ativos: [
      {
        id: 'rel-004',
        tipo_de_relacao: 'depende_de',
        ativo_origem_id: 'proc-ciclo-validacao',
        ativo_destino_id: 'met-sagb-canonica',
        observacao: 'O processo depende dos contratos definidos na arquitetura canônica.'
      },
      {
        id: 'rel-005',
        tipo_de_relacao: 'especializa',
        ativo_origem_id: 'proc-ciclo-validacao',
        ativo_destino_id: 'apl-onboarding-times',
        observacao: 'Define uma variação aplicada ao contexto específico de onboarding.'
      }
    ],
    evidencias_aplicacao: [
      {
        id: 'evid-003',
        ativo_id: 'proc-ciclo-validacao',
        contexto: 'Piloto de validação em duas squads simultâneas',
        aplicado_em: 'Programa de aceleração metodológica • Sprint 11',
        descricao: 'Checkpoints aplicados para testar consistência de hipóteses metodológicas.',
        resultado_percebido: 'Hipóteses frágeis foram descartadas antes de oficialização.',
        aprendizados: 'Critérios de saída precisam ser mais objetivos na etapa de revisão por pares.',
        validou_ativo: true
      }
    ],
    ativos_derivados: [
      {
        id: 'der-proc-validacao-resumo-exec',
        ativo_origem_id: 'proc-ciclo-validacao',
        tipo_de_projecao: 'resumo_executivo',
        nome: 'Resumo Executivo do Ciclo de Validação',
        resumo:
          'Síntese para decisão executiva com riscos, hipóteses aceitas e recomendações de avanço do ciclo.',
        objetivo:
          'Viabilizar leitura rápida da liderança sem reduzir a rastreabilidade metodológica do processo-fonte.',
        status_editorial: 'aprovada',
        versao_atual: 'v0.9.0',
        created_at: '2026-04-02T19:10:00.000Z',
        updated_at: '2026-04-04T08:00:00.000Z'
      }
    ]
  },
  {
    id: 'prot-documentacao',
    tipo_de_ativo: 'protocolo',
    nome: 'Protocolo de Documentação Metodológica',
    slug: 'protocolo-documentacao-metodologica',
    resumo: 'Padrão para documentar ativos metodológicos em linguagem técnica e executiva.',
    definicao:
      'Conjunto de orientações para tornar metodologias legíveis, auditáveis e transmissíveis entre contextos e equipes.',
    objetivo:
      'Garantir continuidade cognitiva da metodologia e facilitar manutenção evolutiva entre versões.',
    status_editorial: 'arquivada',
    maturidade_pratica: 'conceitual',
    governanca: {
      estado_ciclo_vida: 'arquivado',
      arquivado_em: '2026-04-04T14:15:00.000Z',
      motivo_arquivamento: 'Substituído por diretriz transversal de documentação integrada.',
      observacao: 'Mantido para referência histórica de estrutura documental.',
      responsaveis: [
        { id: 'gov-marina', nome: 'Marina L.', papel: 'responsavel_principal' },
        { id: 'gov-vitor', nome: 'Vitor C.', papel: 'curador' }
      ]
    },
    versao_atual: 'v0.1.0',
    created_at: '2026-04-01T09:30:00.000Z',
    updated_at: '2026-04-04T14:15:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia-tdm',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Posicionamento semântico da documentação metodológica.'
      },
      {
        id: 'bloco-estrutura-tdm',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Template mínimo de conteúdo, metadados e convenções de escrita.'
      },
      {
        id: 'bloco-aplicacao-tdm',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Uso da documentação em revisão, onboarding e execução de campo.'
      },
      {
        id: 'bloco-governanca-tdm',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Políticas de versionamento, ownership e qualidade documental.'
      }
    ],
    versoes_oficiais: [
      {
        id: 'ver-prot-documentacao-0.1.0',
        ativo_id: 'prot-documentacao',
        numero_versao: 'v0.1.0',
        titulo: 'Versão inicial de padronização documental',
        resumo_da_versao:
          'Estrutura inaugural de documentação metodológica com foco em legibilidade e transmissão.',
        status_da_versao: 'superada',
        publicada_em: '2026-04-01T09:30:00.000Z'
      }
    ],
    historico_estruturado: [
      {
        id: 'evt-prot-documentacao-001',
        ativo_id: 'prot-documentacao',
        tipo_de_evento: 'criado',
        descricao: 'Protocolo criado para organizar documentação de ativos do núcleo.',
        ocorrido_em: '2026-04-01T09:30:00.000Z'
      },
      {
        id: 'evt-prot-documentacao-002',
        ativo_id: 'prot-documentacao',
        tipo_de_evento: 'arquivado',
        descricao: 'Protocolo arquivado por substituição em diretriz transversal integrada.',
        ocorrido_em: '2026-04-04T14:15:00.000Z',
        observacao: 'Mantido para leitura histórica; não é mais ativo vigente.'
      }
    ]
  },
  {
    id: 'chk-publicacao',
    tipo_de_ativo: 'checklist',
    nome: 'Checklist de Publicação de Ativo Metodológico',
    slug: 'checklist-publicacao-ativo-metodologico',
    resumo: 'Lista prática de conferência para publicação consistente no Núcleo de Metodologias.',
    definicao:
      'Checklist operacional para validar requisitos mínimos antes de publicar qualquer ativo metodológico no catálogo oficial.',
    objetivo:
      'Reduzir inconsistências de documentação e metadados no momento da entrada de novos ativos.',
    status_editorial: 'aprovada',
    maturidade_pratica: 'validada',
    governanca: {
      estado_ciclo_vida: 'oficial',
      oficializado_em: '2026-04-05T09:00:00.000Z',
      observacao: 'Checklist mandatória para entrada no catálogo oficial.',
      responsaveis: [
        { id: 'gov-lia', nome: 'Lia M. Rocha', papel: 'responsavel_principal' },
        { id: 'gov-ana', nome: 'Ana Beatriz', papel: 'revisor' },
        { id: 'gov-heitor', nome: 'Heitor S.', papel: 'aprovador' }
      ]
    },
    versao_atual: 'v1.0.0',
    created_at: '2026-04-03T11:00:00.000Z',
    updated_at: '2026-04-05T09:00:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia-chk',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Critérios obrigatórios de publicação e consistência mínima.'
      },
      {
        id: 'bloco-estrutura-chk',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Sequência de verificação por item e nível de criticidade.'
      },
      {
        id: 'bloco-aplicacao-chk',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Uso em revisão editorial, curadoria e publicação final.'
      },
      {
        id: 'bloco-governanca-chk',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Responsáveis por validar, auditar e manter o checklist atualizado.'
      }
    ],
    versoes_oficiais: [
      {
        id: 'ver-chk-publicacao-0.9.0',
        ativo_id: 'chk-publicacao',
        numero_versao: 'v0.9.0',
        resumo_da_versao:
          'Versão de validação interna com critérios iniciais de publicação e rastreabilidade mínima.',
        status_da_versao: 'superada',
        publicada_em: '2026-04-04T16:20:00.000Z'
      },
      {
        id: 'ver-chk-publicacao-1.0.0',
        ativo_id: 'chk-publicacao',
        numero_versao: 'v1.0.0',
        titulo: 'Checklist oficial de entrada no catálogo',
        resumo_da_versao:
          'Marco formal de oficialização do checklist como gate do núcleo metodológico.',
        status_da_versao: 'vigente',
        publicada_em: '2026-04-05T09:00:00.000Z'
      }
    ],
    historico_estruturado: [
      {
        id: 'evt-chk-publicacao-001',
        ativo_id: 'chk-publicacao',
        tipo_de_evento: 'criado',
        descricao: 'Checklist criada para reduzir inconsistências antes da publicação de ativos.',
        ocorrido_em: '2026-04-03T11:00:00.000Z'
      },
      {
        id: 'evt-chk-publicacao-002',
        ativo_id: 'chk-publicacao',
        tipo_de_evento: 'oficializado',
        descricao: 'Checklist oficializada como requisito para entrada no catálogo canônico.',
        ocorrido_em: '2026-04-05T09:00:00.000Z'
      },
      {
        id: 'evt-chk-publicacao-003',
        ativo_id: 'chk-publicacao',
        tipo_de_evento: 'aplicacao_registrada',
        descricao: 'Primeira aplicação registrada na janela semanal de curadoria.',
        ocorrido_em: '2026-04-05T09:40:00.000Z'
      }
    ],
    relacoes_ativos: [
      {
        id: 'rel-006',
        tipo_de_relacao: 'operacionaliza',
        ativo_origem_id: 'chk-publicacao',
        ativo_destino_id: 'met-sagb-canonica',
        observacao: 'Transforma diretrizes canônicas em verificação prática de publicação.'
      },
      {
        id: 'rel-007',
        tipo_de_relacao: 'substitui',
        ativo_origem_id: 'chk-publicacao',
        ativo_destino_id: 'der-kit-campo',
        observacao: 'Consolida artefatos do kit obsoleto em um fluxo único de conferência.'
      }
    ],
    evidencias_aplicacao: [
      {
        id: 'evid-004',
        ativo_id: 'chk-publicacao',
        contexto: 'Publicação de novos ativos no catálogo canônico',
        aplicado_em: 'Núcleo de Metodologias • Janela semanal de curadoria',
        descricao: 'Checklist utilizada como gate antes da entrada oficial no hub.',
        resultado_percebido: 'Queda de inconsistências de metadados em submissões iniciais.',
        aprendizados: 'Itens de relacionamento e evidência devem ser obrigatórios na próxima etapa.',
        validou_ativo: true
      }
    ]
  },
  {
    id: 'princ-clareza-semantica',
    tipo_de_ativo: 'principio',
    nome: 'Princípio de Clareza Semântica',
    slug: 'principio-clareza-semantica',
    resumo: 'Diretriz para não colapsar diferentes ativos sob o mesmo rótulo metodológico.',
    definicao:
      'Princípio orientador que exige tipagem explícita dos ativos para preservar leitura de domínio e evitar ambiguidade estrutural.',
    objetivo:
      'Garantir crescimento sustentável do núcleo com distinções conceituais visíveis e consistentes.',
    status_editorial: 'oficial',
    maturidade_pratica: 'escalavel',
    governanca: {
      estado_ciclo_vida: 'oficial',
      oficializado_em: '2026-04-04T10:20:00.000Z',
      observacao: 'Princípio base para leitura semântica e decisões de evolução.',
      responsaveis: [
        { id: 'gov-cassio', nome: 'Cássio', papel: 'responsavel_principal' },
        { id: 'gov-lia', nome: 'Lia M. Rocha', papel: 'curador' },
        { id: 'gov-heitor', nome: 'Heitor S.', papel: 'aprovador' }
      ]
    },
    versao_atual: 'v1.0.0',
    created_at: '2026-04-02T08:45:00.000Z',
    updated_at: '2026-04-05T08:30:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia-princ',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Fundamento semântico para governança e modelagem de ativos.'
      },
      {
        id: 'bloco-estrutura-princ',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Regras de tipagem, nomenclatura e rastreabilidade de origem.'
      },
      {
        id: 'bloco-aplicacao-princ',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Aplicado em desenho de catálogo, documentação e leitura de interface.'
      },
      {
        id: 'bloco-governanca-princ',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Critérios de conformidade para evolução taxonômica do núcleo.'
      }
    ],
    historico_estruturado: [
      {
        id: 'evt-princ-clareza-semantica-001',
        ativo_id: 'princ-clareza-semantica',
        tipo_de_evento: 'criado',
        descricao: 'Princípio registrado como fundamento de coerência semântica do núcleo.',
        ocorrido_em: '2026-04-02T08:45:00.000Z'
      },
      {
        id: 'evt-princ-clareza-semantica-002',
        ativo_id: 'princ-clareza-semantica',
        tipo_de_evento: 'oficializado',
        descricao: 'Princípio oficializado como referência para taxonomia e modelagem.',
        ocorrido_em: '2026-04-04T10:20:00.000Z'
      }
    ],
    relacoes_ativos: [
      {
        id: 'rel-008',
        tipo_de_relacao: 'usa_como_base',
        ativo_origem_id: 'princ-clareza-semantica',
        ativo_destino_id: 'met-sagb-canonica',
        observacao: 'A arquitetura assume o princípio como base de modelagem semântica.'
      },
      {
        id: 'rel-009',
        tipo_de_relacao: 'complementa',
        ativo_origem_id: 'princ-clareza-semantica',
        ativo_destino_id: 'proc-ciclo-validacao',
        observacao: 'A clareza semântica melhora a leitura dos resultados de validação.'
      }
    ],
    evidencias_aplicacao: [
      {
        id: 'evid-005',
        ativo_id: 'princ-clareza-semantica',
        contexto: 'Refino de nomenclatura entre ativos processo/protocolo/checklist',
        aplicado_em: 'Sessão de arquitetura de domínio • ET 03',
        descricao: 'Princípio utilizado para separar ativos que estavam semanticamente colapsados.',
        resultado_percebido: 'Catálogo ficou mais legível e com menor ambiguidade de tipagem.',
        aprendizados: 'Labels explícitos na UI reduzem debates improdutivos sobre nomenclatura.',
        validou_ativo: true
      }
    ]
  },
  {
    id: 'apl-onboarding-times',
    tipo_de_ativo: 'aplicacao',
    nome: 'Aplicação de Onboarding Metodológico para Times',
    slug: 'aplicacao-onboarding-metodologico-times',
    resumo: 'Uso contextual da base metodológica para acelerar entrada de novos times no SagB.',
    definicao:
      'Aplicação prática da metodologia canônica em contexto de onboarding, com trilha guiada e checkpoints de entendimento.',
    objetivo:
      'Reduzir curva de aprendizado e melhorar aderência ao padrão metodológico oficial.',
    status_editorial: 'em_revisao',
    maturidade_pratica: 'testada',
    governanca: {
      estado_ciclo_vida: 'em_desenvolvimento',
      observacao: 'Ainda em ciclos de desenvolvimento aplicado, apesar de revisão editorial inicial.',
      responsaveis: [
        { id: 'gov-paula', nome: 'Paula N.', papel: 'responsavel_principal' },
        { id: 'gov-vitor', nome: 'Vitor C.', papel: 'curador' },
        { id: 'gov-rafa', nome: 'Rafael T.', papel: 'revisor' },
        { id: 'gov-heitor', nome: 'Heitor S.', papel: 'aprovador' }
      ]
    },
    versao_atual: 'v0.3.1',
    created_at: '2026-04-04T13:10:00.000Z',
    updated_at: '2026-04-05T09:20:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia-apl',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Aplicação orientada a contexto de adoção e aceleração de entendimento.'
      },
      {
        id: 'bloco-estrutura-apl',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Roteiro de onboarding com marcos de assimilação e validação.'
      },
      {
        id: 'bloco-aplicacao-apl',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Execução em ciclos de entrada, com apoio de curadoria metodológica.'
      },
      {
        id: 'bloco-governanca-apl',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Medição de aderência e ajustes contínuos conforme feedback dos times.'
      }
    ],
    relacoes_ativos: [
      {
        id: 'rel-010',
        tipo_de_relacao: 'deriva_de',
        ativo_origem_id: 'apl-onboarding-times',
        ativo_destino_id: 'met-sagb-canonica',
        observacao: 'Aplicação derivada da metodologia principal para contexto de entrada de times.'
      },
      {
        id: 'rel-011',
        tipo_de_relacao: 'depende_de',
        ativo_origem_id: 'apl-onboarding-times',
        ativo_destino_id: 'chk-publicacao',
        observacao: 'A adoção utiliza checklist para garantir consistência dos ativos apresentados.'
      }
    ],
    evidencias_aplicacao: [
      {
        id: 'evid-006',
        ativo_id: 'apl-onboarding-times',
        contexto: 'Onboarding de time recém-integrado ao ecossistema',
        aplicado_em: 'Time Atlas • Ciclo de entrada abril/2026',
        descricao: 'Roteiro aplicado com checkpoints de assimilação semanal.',
        resultado_percebido: 'Aderência inicial ao padrão subiu, mas com sobrecarga no primeiro sprint.',
        aprendizados: 'Dividir onboarding em trilhas por tipo de ativo melhora retenção.',
        validou_ativo: false,
        observacao: 'Necessita simplificação de parte do material para contexto iniciante.'
      }
    ]
  },
  {
    id: 'der-kit-campo',
    tipo_de_ativo: 'ativo_derivado',
    nome: 'Kit Operacional Derivado para Execução em Campo',
    slug: 'ativo-derivado-kit-operacional-campo',
    resumo: 'Material derivado da metodologia canônica para uso tático em operação real.',
    definicao:
      'Conjunto derivado de guias, templates e checkpoints originado da metodologia principal para acelerar execução prática.',
    objetivo:
      'Traduzir estruturas nucleares em artefatos de uso direto sem perder alinhamento semântico com o ativo de origem.',
    status_editorial: 'em_estruturacao',
    maturidade_pratica: 'modelada',
    governanca: {
      estado_ciclo_vida: 'obsoleto',
      substituido_por_ativo_id: 'chk-publicacao',
      observacao: 'Superado por kit integrado ao checklist oficial de publicação.',
      responsaveis: [
        { id: 'gov-marina', nome: 'Marina L.', papel: 'responsavel_principal' },
        { id: 'gov-lia', nome: 'Lia M. Rocha', papel: 'curador' }
      ]
    },
    versao_atual: 'v0.2.4',
    created_at: '2026-04-01T16:40:00.000Z',
    updated_at: '2026-04-05T09:25:00.000Z',
    blocos_base: [
      {
        id: 'bloco-essencia-der',
        tipo: 'essencia',
        titulo: 'Essência',
        resumo: 'Derivação controlada para manter fidelidade ao ativo metodológico de origem.'
      },
      {
        id: 'bloco-estrutura-der',
        tipo: 'estrutura',
        titulo: 'Estrutura',
        resumo: 'Pacote de artefatos operacionais com composição padronizada.'
      },
      {
        id: 'bloco-aplicacao-der',
        tipo: 'aplicacao',
        titulo: 'Aplicação',
        resumo: 'Uso em campo para acelerar aplicação sem redesenho completo.'
      },
      {
        id: 'bloco-governanca-der',
        tipo: 'governanca',
        titulo: 'Governança',
        resumo: 'Rastreabilidade da origem e controle de atualização do material derivado.'
      }
    ],
    historico_estruturado: [
      {
        id: 'evt-der-kit-campo-001',
        ativo_id: 'der-kit-campo',
        tipo_de_evento: 'criado',
        descricao: 'Kit operacional derivado criado para acelerar execução em campo.',
        ocorrido_em: '2026-04-01T16:40:00.000Z'
      },
      {
        id: 'evt-der-kit-campo-002',
        ativo_id: 'der-kit-campo',
        tipo_de_evento: 'marcado_como_obsoleto',
        descricao: 'Ativo marcado como obsoleto após consolidação do checklist oficial.',
        ocorrido_em: '2026-04-05T09:25:00.000Z',
        observacao: 'A obsolescência não exige novo marco de versão oficial.'
      }
    ],
    relacoes_ativos: [
      {
        id: 'rel-012',
        tipo_de_relacao: 'substitui',
        ativo_origem_id: 'der-kit-campo',
        ativo_destino_id: 'chk-publicacao',
        observacao: 'Relação histórica: kit foi incorporado e substituído por checklist oficial.'
      },
      {
        id: 'rel-013',
        tipo_de_relacao: 'simplifica',
        ativo_origem_id: 'der-kit-campo',
        ativo_destino_id: 'met-sagb-canonica',
        observacao: 'Buscou simplificar a aplicação tática da arquitetura em campo.'
      }
    ],
    evidencias_aplicacao: [
      {
        id: 'evid-007',
        ativo_id: 'der-kit-campo',
        contexto: 'Execução de operação piloto com baixa maturidade metodológica',
        aplicado_em: 'Operação Campo Sul • Fase beta',
        descricao: 'Kit utilizado para acelerar aplicação sem exigir leitura integral da metodologia.',
        resultado_percebido: 'Ajudou no curto prazo, porém gerou desalinhamento semântico acumulado.',
        aprendizados: 'Simplificação sem vínculo forte com governança tende a perder coerência de longo prazo.',
        validou_ativo: false
      }
    ]
  }
];
