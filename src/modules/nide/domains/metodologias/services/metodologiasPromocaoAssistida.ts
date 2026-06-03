import type {
  AtivoCanonico,
  AtivoCanonicoPromocaoPreview,
  AtivoEmEstruturacao,
  DiagnosticoPromocaoAssistida,
  DiagnosticoPromocaoCriterio,
  PromocaoAssistidaResultado
} from '../types';
import {
  criarVersaoCanonicaInicialSeNecessario,
  criarAtivoCanonicoPromovidoPersistido,
  promoverBlocosInternosParaCanonicoPersistido,
  salvarRelacoesCanonicasPersistidas
} from './metodologiasPersistencia';
import { criarSnapshotCanonicoFromAtivo } from './metodologiasCanonicoSnapshot';

const isTextoPreenchido = (valor?: string | null): boolean => {
  return typeof valor === 'string' && valor.trim().length > 0;
};

const normalizarSlug = (valor: string): string => {
  return valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const diagnosticarProntidaoPromocaoAssistida = (ativo: AtivoEmEstruturacao): DiagnosticoPromocaoAssistida => {
  const criterios: DiagnosticoPromocaoCriterio[] = [
    {
      id: 'promocao-criterio-nome',
      codigo: 'nome_preenchido',
      titulo: 'Nome preenchido',
      descricao: 'O ativo em estruturação precisa ter um nome claro.',
      criticidade: 'alta',
      atendido: isTextoPreenchido(ativo.nome)
    },
    {
      id: 'promocao-criterio-resumo',
      codigo: 'resumo_preenchido',
      titulo: 'Resumo preenchido',
      descricao: 'Resumo curto para leitura rápida no catálogo canônico.',
      criticidade: 'alta',
      atendido: isTextoPreenchido(ativo.resumo)
    },
    {
      id: 'promocao-criterio-definicao',
      codigo: 'definicao_preenchida',
      titulo: 'Definição preenchida',
      descricao: 'Definição semântica mínima para distinguir o ativo no domínio.',
      criticidade: 'alta',
      atendido: isTextoPreenchido(ativo.definicao)
    },
    {
      id: 'promocao-criterio-objetivo',
      codigo: 'objetivo_preenchido',
      titulo: 'Objetivo preenchido',
      descricao: 'Objetivo prático explícito para orientar uso e revisão.',
      criticidade: 'alta',
      atendido: isTextoPreenchido(ativo.objetivo)
    },
    {
      id: 'promocao-criterio-tipo',
      codigo: 'tipo_de_ativo_definido',
      titulo: 'Tipo de ativo definido',
      descricao: 'Classificação mínima para entrada canônica consistente.',
      criticidade: 'alta',
      atendido: Boolean(ativo.tipo_de_ativo)
    },
    {
      id: 'promocao-criterio-maturidade',
      codigo: 'maturidade_pratica_definida',
      titulo: 'Maturidade prática definida',
      descricao: 'Nível de maturidade para contextualizar a promoção no catálogo.',
      criticidade: 'media',
      atendido: Boolean(ativo.maturidade_pratica)
    },
    {
      id: 'promocao-criterio-governanca',
      codigo: 'governanca_minima_definida',
      titulo: 'Governança mínima definida',
      descricao: 'Estado de governança informado para preservar contexto do ciclo de vida.',
      criticidade: 'alta',
      atendido: Boolean(ativo.governanca?.estado)
    },
    {
      id: 'promocao-criterio-bloco',
      codigo: 'bloco_interno_persistido',
      titulo: 'Ao menos 1 bloco interno persistido',
      descricao: 'A promoção exige corpo estrutural mínimo além dos metadados.',
      criticidade: 'alta',
      atendido: (ativo.blocos_internos ?? []).length > 0
    }
  ];

  const criteriosAtendidos = criterios.filter((criterio) => criterio.atendido).length;
  const totalCriterios = criterios.length;
  const criteriosPendentes = totalCriterios - criteriosAtendidos;
  const pendencias = criterios.filter((criterio) => !criterio.atendido);
  const prontoParaPromocao = criteriosPendentes === 0;

  const recomendacao = prontoParaPromocao
    ? 'Pronto para promoção assistida. Gere o ativo canônico com rastreabilidade de origem.'
    : 'Ainda não está pronto para promoção. Complete os critérios pendentes e revise novamente.';

  return {
    pronto_para_promocao: prontoParaPromocao,
    total_criterios: totalCriterios,
    criterios_atendidos: criteriosAtendidos,
    criterios_pendentes: criteriosPendentes,
    percentual_prontidao: Math.round((criteriosAtendidos / totalCriterios) * 100),
    criterios,
    pendencias,
    recomendacao
  };
};

export const gerarPreviewPromocaoAtivoCanonico = (ativo: AtivoEmEstruturacao): AtivoCanonicoPromocaoPreview => {
  const slugBase = normalizarSlug(ativo.nome) || `ativo-${ativo.id_estruturacao.slice(0, 8)}`;

  return {
    id_preview_promocao: `promocao-preview-${ativo.id_estruturacao}`,
    slug_sugerido: slugBase,
    nome: ativo.nome,
    resumo: ativo.resumo,
    definicao: ativo.definicao,
    objetivo: ativo.objetivo,
    tipo_de_ativo: ativo.tipo_de_ativo,
    status_editorial: 'em_revisao',
    maturidade_pratica: ativo.maturidade_pratica,
    governanca_estado: ativo.governanca.estado,
    versao_atual: '1.0.0',
    origem_entrada_bruta_id: ativo.origem_entrada_id,
    origem_ativo_em_estruturacao_id: ativo.id_estruturacao
  };
};

export const promoverAtivoEmEstruturacaoParaCanonico = async (params: {
  ativo: AtivoEmEstruturacao;
  promovidoPor?: string;
  reprocessarBlocosCanonicos?: boolean;
}): Promise<PromocaoAssistidaResultado> => {
  const diagnostico = diagnosticarProntidaoPromocaoAssistida(params.ativo);
  const preview = gerarPreviewPromocaoAtivoCanonico(params.ativo);

  if (!diagnostico.pronto_para_promocao) {
    throw new Error('Ativo em estruturação ainda não atende os critérios mínimos para promoção assistida.');
  }

  const ativoCanonico: AtivoCanonico = await criarAtivoCanonicoPromovidoPersistido(preview, params.promovidoPor);
  const blocosCanonicos = await promoverBlocosInternosParaCanonicoPersistido({
    ativoCanonicoId: ativoCanonico.id,
    ativoEmEstruturacaoId: params.ativo.id_estruturacao,
    reprocessar: params.reprocessarBlocosCanonicos
  });

  const relacoesParaPromocao =
    params.ativo.relacoes_estruturacao?.map((relacao, index) => ({
      id: relacao.id ?? `rel-promovida-${ativoCanonico.id}-${index + 1}`,
      tipo_de_relacao: relacao.tipo_de_relacao,
      ativo_origem_id: relacao.direcao === 'saida' ? ativoCanonico.id : relacao.ativo_relacionado_canonico_id,
      ativo_destino_id: relacao.direcao === 'saida' ? relacao.ativo_relacionado_canonico_id : ativoCanonico.id,
      observacao: relacao.observacao
    })) ?? [];

  const relacoesCanonicas = await salvarRelacoesCanonicasPersistidas({
    ativo_canonico_id: ativoCanonico.id,
    relacoes: relacoesParaPromocao
  });

  await criarVersaoCanonicaInicialSeNecessario({
    ativoCanonicoId: ativoCanonico.id,
    numeroVersaoBase: ativoCanonico.versao_atual,
    titulo: 'Versão canônica inicial',
    resumoDaVersao: 'Marco inicial criado automaticamente no momento da promoção assistida para o catálogo canônico.',
    snapshot: criarSnapshotCanonicoFromAtivo({
      ...ativoCanonico,
      blocos_canonicos: blocosCanonicos
    })
  });

  return {
    diagnostico,
    preview,
    ativo_canonico: {
      ...ativoCanonico,
      blocos_canonicos: blocosCanonicos,
      relacoes_ativos: relacoesCanonicas
    },
    total_blocos_promovidos: blocosCanonicos.length,
    mensagem: `Promoção assistida concluída. Ativo canônico criado com vínculo de origem preservado e ${blocosCanonicos.length} blocos canônicos promovidos.`
  };
};
