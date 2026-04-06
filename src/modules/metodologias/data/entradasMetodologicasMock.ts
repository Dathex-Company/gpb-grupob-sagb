import type { EntradaMetodologicaBruta } from '../types';

export const ENTRADAS_METODOLOGICAS_BRUTAS_MOCK: EntradaMetodologicaBruta[] = [
  {
    id: 'ent-bruta-001',
    titulo: 'Rascunho de rito semanal de validação em campo',
    tipo_de_entrada: 'rascunho',
    conteudo_bruto:
      'Tenho uma ideia de rito semanal para validar se a metodologia está funcionando em campo. Ainda está solto, sem fases e sem critérios claros. Hoje usamos perguntas abertas e resultados variam muito entre times.',
    origem: 'Anotação interna do Núcleo de Metodologias',
    status_de_estruturacao: 'em_analise',
    created_at: '2026-04-05T10:05:00.000Z',
    updated_at: '2026-04-05T10:15:00.000Z'
  },
  {
    id: 'ent-bruta-002',
    titulo: 'Resumo de PDF sobre framework de aprendizagem em ciclos curtos',
    tipo_de_entrada: 'resumo_pdf',
    conteudo_bruto:
      'Resumo manual de PDF: framework com fases curtas de testar, observar e ajustar. O texto fala de hipóteses, registro de evidências e melhoria contínua, mas não define governança.',
    origem: 'Resumo manual de material externo (PDF)',
    status_de_estruturacao: 'bruto',
    created_at: '2026-04-05T09:20:00.000Z',
    updated_at: '2026-04-05T09:20:00.000Z'
  },
  {
    id: 'ent-bruta-003',
    titulo: 'Checklist parcial para onboarding metodológico',
    tipo_de_entrada: 'framework_parcial',
    conteudo_bruto:
      'Lista inicial com pontos de onboarding: contexto, objetivo, passos mínimos e riscos. Já existe esqueleto de checklist, mas falta distinguir o que é regra canônica e o que é adaptação local.',
    origem: 'Contribuição de curadoria aplicada',
    status_de_estruturacao: 'estruturado_parcialmente',
    created_at: '2026-04-04T18:10:00.000Z',
    updated_at: '2026-04-05T08:50:00.000Z'
  },
  {
    id: 'ent-bruta-004',
    titulo: 'Protocolo de revisão cruzada convertido em ativo oficial',
    tipo_de_entrada: 'bloco_doutrinario',
    conteudo_bruto:
      'Base conceitual para revisão por pares entre curadoria e governança. Estrutura já consolidada no catálogo como protocolo.',
    origem: 'Histórico interno do núcleo',
    status_de_estruturacao: 'convertido_em_ativo',
    created_at: '2026-03-27T11:00:00.000Z',
    updated_at: '2026-04-03T16:30:00.000Z'
  }
];
