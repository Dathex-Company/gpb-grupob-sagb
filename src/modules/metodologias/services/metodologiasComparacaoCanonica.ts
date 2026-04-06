import type {
  AtivoCanonico,
  AtivoCanonicoVersao,
  AtivoCanonicoVersaoSnapshot,
  CampoBaseCanonicoComparavel,
  ComparacaoVersaoCanonica,
  MudancaBlocoCanonicoResumo,
  MudancaCampoCanonico
} from '../types';
import { validarIntegridadeSnapshotCanonico } from './metodologiasCanonicoSnapshot';

const CAMPOS_BASE_COMPARAVEIS: Array<{ campo: CampoBaseCanonicoComparavel; label: string }> = [
  { campo: 'nome', label: 'Nome' },
  { campo: 'resumo', label: 'Resumo' },
  { campo: 'definicao', label: 'Definição' },
  { campo: 'objetivo', label: 'Objetivo' },
  { campo: 'tipo_de_ativo', label: 'Tipo de ativo' },
  { campo: 'status_editorial', label: 'Status editorial' },
  { campo: 'maturidade_pratica', label: 'Maturidade prática' },
  { campo: 'governanca_estado', label: 'Governança' }
];

const normalizarTexto = (valor?: string): string => (valor ?? '').trim();

const compararCamposBase = (anterior: AtivoCanonicoVersaoSnapshot, atual: AtivoCanonicoVersaoSnapshot): MudancaCampoCanonico[] => {
  return CAMPOS_BASE_COMPARAVEIS.flatMap(({ campo, label }) => {
    const valorAnterior = String(anterior[campo] ?? '');
    const valorAtual = String(atual[campo] ?? '');
    if (normalizarTexto(valorAnterior) === normalizarTexto(valorAtual)) return [];

    return [
      {
        campo,
        label,
        valor_anterior: valorAnterior,
        valor_atual: valorAtual
      }
    ];
  });
};

const compararBlocos = (anterior: AtivoCanonicoVersaoSnapshot, atual: AtivoCanonicoVersaoSnapshot): MudancaBlocoCanonicoResumo[] => {
  const porIdAnterior = new Map(anterior.blocos.map((bloco) => [bloco.bloco_origem_estruturacao_id, bloco]));
  const porIdAtual = new Map(atual.blocos.map((bloco) => [bloco.bloco_origem_estruturacao_id, bloco]));
  const ids = Array.from(new Set([...porIdAnterior.keys(), ...porIdAtual.keys()]));

  const mudancas = ids.flatMap((id): MudancaBlocoCanonicoResumo[] => {
    const blocoAnterior = porIdAnterior.get(id);
    const blocoAtual = porIdAtual.get(id);

    if (!blocoAnterior && blocoAtual) {
      return [
        {
          tipo: 'criado',
          bloco_origem_estruturacao_id: id,
          titulo_depois: blocoAtual.titulo,
          tipo_depois: blocoAtual.tipo_de_bloco,
          alterou_titulo: false,
          alterou_tipo: false,
          alterou_conteudo: false
        }
      ];
    }

    if (blocoAnterior && !blocoAtual) {
      return [
        {
          tipo: 'removido',
          bloco_origem_estruturacao_id: id,
          titulo_antes: blocoAnterior.titulo,
          tipo_antes: blocoAnterior.tipo_de_bloco,
          alterou_titulo: false,
          alterou_tipo: false,
          alterou_conteudo: false
        }
      ];
    }

    if (!blocoAnterior || !blocoAtual) return [];

    const alterouTitulo = normalizarTexto(blocoAnterior.titulo) !== normalizarTexto(blocoAtual.titulo);
    const alterouTipo = blocoAnterior.tipo_de_bloco !== blocoAtual.tipo_de_bloco;
    const alterouConteudo = normalizarTexto(blocoAnterior.conteudo) !== normalizarTexto(blocoAtual.conteudo);
    if (!alterouTitulo && !alterouTipo && !alterouConteudo) return [];

    return [
      {
        tipo: 'alterado',
        bloco_origem_estruturacao_id: id,
        titulo_antes: blocoAnterior.titulo,
        titulo_depois: blocoAtual.titulo,
        tipo_antes: blocoAnterior.tipo_de_bloco,
        tipo_depois: blocoAtual.tipo_de_bloco,
        alterou_titulo: alterouTitulo,
        alterou_tipo: alterouTipo,
        alterou_conteudo: alterouConteudo
      }
    ];
  });

  return mudancas;
};

const gerarResumoTextual = (comparacao: Omit<ComparacaoVersaoCanonica, 'resumo_textual'>): string => {
  const partes: string[] = [];

  if (comparacao.total_campos_alterados > 0) {
    partes.push(`${comparacao.total_campos_alterados} campo(s)-base alterado(s)`);
  }
  if (comparacao.total_blocos_criados > 0) {
    partes.push(`${comparacao.total_blocos_criados} bloco(s) criado(s)`);
  }
  if (comparacao.total_blocos_removidos > 0) {
    partes.push(`${comparacao.total_blocos_removidos} bloco(s) removido(s)`);
  }
  if (comparacao.total_blocos_alterados > 0) {
    partes.push(`${comparacao.total_blocos_alterados} bloco(s) alterado(s)`);
  }

  if (!partes.length) {
    return 'Sem mudanças relevantes detectadas entre os marcos selecionados.';
  }

  return `Mudanças detectadas: ${partes.join(', ')}.`;
};

export const compararVersoesCanonicas = (params: {
  ativo_canonico_id: string;
  versao_anterior: AtivoCanonicoVersao;
  versao_atual: AtivoCanonicoVersao;
}): ComparacaoVersaoCanonica | null => {
  const snapshotAnterior = params.versao_anterior.snapshot;
  const snapshotAtual = params.versao_atual.snapshot;
  if (!snapshotAnterior || !snapshotAtual) return null;

  const integridadeAnterior = validarIntegridadeSnapshotCanonico(snapshotAnterior);
  const integridadeAtual = validarIntegridadeSnapshotCanonico(snapshotAtual);
  if (integridadeAnterior.status !== 'integro' || integridadeAtual.status !== 'integro') {
    return null;
  }

  const mudancasCampos = compararCamposBase(snapshotAnterior, snapshotAtual);
  const mudancasBlocos = compararBlocos(snapshotAnterior, snapshotAtual);
  const totalBlocosCriados = mudancasBlocos.filter((item) => item.tipo === 'criado').length;
  const totalBlocosRemovidos = mudancasBlocos.filter((item) => item.tipo === 'removido').length;
  const totalBlocosAlterados = mudancasBlocos.filter((item) => item.tipo === 'alterado').length;

  const comparacaoBase = {
    ativo_canonico_id: params.ativo_canonico_id,
    versao_anterior: {
      id: params.versao_anterior.id,
      numero_versao: params.versao_anterior.numero_versao,
      status_da_versao: params.versao_anterior.status_da_versao,
      publicada_em: params.versao_anterior.publicada_em
    },
    versao_atual: {
      id: params.versao_atual.id,
      numero_versao: params.versao_atual.numero_versao,
      status_da_versao: params.versao_atual.status_da_versao,
      publicada_em: params.versao_atual.publicada_em
    },
    total_campos_alterados: mudancasCampos.length,
    total_blocos_antes: snapshotAnterior.blocos.length,
    total_blocos_depois: snapshotAtual.blocos.length,
    total_blocos_criados: totalBlocosCriados,
    total_blocos_removidos: totalBlocosRemovidos,
    total_blocos_alterados: totalBlocosAlterados,
    mudancas_campos: mudancasCampos,
    mudancas_blocos: mudancasBlocos
  };

  return {
    ...comparacaoBase,
    resumo_textual: gerarResumoTextual(comparacaoBase)
  };
};

export const calcularComparacaoLeveVigenteVsAnterior = (ativo: AtivoCanonico): {
  comparacao: ComparacaoVersaoCanonica | null;
  mensagem: string;
} => {
  const versoes = [...(ativo.versoes_canonicas ?? [])].sort((a, b) => +new Date(b.publicada_em) - +new Date(a.publicada_em));
  if (versoes.length < 2) {
    return {
      comparacao: null,
      mensagem: 'Ainda não há marcos suficientes para comparação leve (mínimo de 2 versões).'
    };
  }

  const vigente = versoes.find((versao) => versao.status_da_versao === 'vigente') ?? versoes[0];
  const anterior = versoes.find((versao) => versao.id !== vigente.id);
  if (!anterior) {
    return {
      comparacao: null,
      mensagem: 'Não foi possível identificar uma versão anterior para comparar com a vigente.'
    };
  }

  const comparacao = compararVersoesCanonicas({
    ativo_canonico_id: ativo.id,
    versao_anterior: anterior,
    versao_atual: vigente
  });

  if (!comparacao) {
    return {
      comparacao: null,
      mensagem: 'Comparação indisponível: as versões selecionadas ainda não possuem snapshot mínimo completo.'
    };
  }

  return {
    comparacao,
    mensagem: ''
  };
};

export const calcularComparacaoLevePorVersoes = (params: {
  ativo: AtivoCanonico;
  versaoAnteriorId: string;
  versaoAtualId: string;
}): {
  comparacao: ComparacaoVersaoCanonica | null;
  mensagem: string;
} => {
  if (params.versaoAnteriorId === params.versaoAtualId) {
    return {
      comparacao: null,
      mensagem: 'Selecione duas versões diferentes para comparar.'
    };
  }

  const versoes = params.ativo.versoes_canonicas ?? [];
  const anterior = versoes.find((item) => item.id === params.versaoAnteriorId);
  const atual = versoes.find((item) => item.id === params.versaoAtualId);

  if (!anterior || !atual) {
    return {
      comparacao: null,
      mensagem: 'As versões selecionadas não foram localizadas no ativo canônico atual.'
    };
  }

  const comparacao = compararVersoesCanonicas({
    ativo_canonico_id: params.ativo.id,
    versao_anterior: anterior,
    versao_atual: atual
  });

  if (!comparacao) {
    return {
      comparacao: null,
      mensagem: 'Comparação indisponível: uma das versões selecionadas não possui snapshot mínimo.'
    };
  }

  return {
    comparacao,
    mensagem: ''
  };
};
