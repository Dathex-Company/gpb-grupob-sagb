import type {
  AtivoMetodologicoEstadoGovernanca,
  AtivoMetodologicoTipo,
  Metodologia,
  MetodologiaMaturidadePratica,
  MetodologiaStatusEditorial
} from '../types';
import {
  getEstadoGovernancaLabel,
  getMaturidadePraticaLabel,
  getStatusEditorialLabel,
  getTipoDeAtivoLabel,
  getVersaoVigente
} from './metodologiasCatalog';

export type CatalogoOrdenacao =
  | 'mais_recente'
  | 'mais_antigo'
  | 'nome_az'
  | 'nome_za'
  | 'maior_qtd_blocos'
  | 'manutencao_recente';

export type CatalogoAgrupamento = 'nenhum' | 'tipo_de_ativo' | 'status_editorial' | 'maturidade_pratica';

export interface CatalogoFiltrosAvancados {
  tipo_de_ativo: 'todos' | AtivoMetodologicoTipo;
  status_editorial: 'todos' | MetodologiaStatusEditorial;
  maturidade_pratica: 'todos' | MetodologiaMaturidadePratica;
  governanca_estado: 'todos' | AtivoMetodologicoEstadoGovernanca;
  possui_blocos_canonicos: 'todos' | 'sim' | 'nao';
  possui_versao_vigente: 'todos' | 'sim' | 'nao';
  snapshot_equivalencia: 'todos' | 'integro_minimo' | 'pendente';
  vindo_de_promocao: 'todos' | 'sim' | 'nao';
  origem_rastreavel: 'todos' | 'sim' | 'nao';
  manutencao_recente: 'todos' | 'sim' | 'nao';
}

export interface CatalogoFacetas {
  tipos: AtivoMetodologicoTipo[];
  status: MetodologiaStatusEditorial[];
  maturidades: MetodologiaMaturidadePratica[];
  governancas: AtivoMetodologicoEstadoGovernanca[];
}

export interface CatalogoResumoEstado {
  total_ativos_base: number;
  total_resultados: number;
  possui_filtros_ativos: boolean;
  filtros_ativos: string[];
  oficiais_no_resultado: number;
  com_blocos_canonicos_no_resultado: number;
  com_versao_vigente_no_resultado: number;
}

export interface CatalogoGrupo {
  chave: string;
  label: string;
  itens: Metodologia[];
}

export interface ExplorarCatalogoResult {
  itens: Metodologia[];
  grupos: CatalogoGrupo[];
  resumo: CatalogoResumoEstado;
}

const JANELA_MANUTENCAO_RECENTE_DIAS = 45;

const normalizarTexto = (valor: string): string =>
  valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const getTemBlocosCanonicos = (ativo: Metodologia): boolean => (ativo.blocos_canonicos?.length ?? 0) > 0;

const getTemVersaoVigente = (ativo: Metodologia): boolean => Boolean(getVersaoVigente(ativo));

const getSnapshotEquivalencia = (ativo: Metodologia): 'integro_minimo' | 'pendente' => {
  return getTemBlocosCanonicos(ativo) && getTemVersaoVigente(ativo) ? 'integro_minimo' : 'pendente';
};

const getVindoDePromocao = (ativo: Metodologia): boolean => {
  return (ativo.historico_estruturado ?? []).some(
    (evento) =>
      evento.tipo_de_evento === 'oficializado' &&
      (evento.id.startsWith('hist-promocao-') || evento.descricao.toLowerCase().includes('promoção assistida'))
  );
};

const getOrigemRastreavel = (ativo: Metodologia): boolean => {
  const origemPorHistorico = (ativo.historico_estruturado ?? []).some((evento) =>
    (evento.observacao ?? '').toLowerCase().includes('origem entrada bruta')
  );
  const origemPorBlocos = (ativo.blocos_canonicos ?? []).some((bloco) => bloco.bloco_origem_estruturacao_id.trim().length > 0);
  return origemPorHistorico || origemPorBlocos;
};

const getDataUltimaManutencao = (ativo: Metodologia): number => {
  const dataMaisRecente = (ativo.historico_estruturado ?? []).reduce<number>((maior, evento) => {
    const valor = +new Date(evento.ocorrido_em);
    return Number.isFinite(valor) && valor > maior ? valor : maior;
  }, 0);
  return dataMaisRecente;
};

const getTemManutencaoRecente = (ativo: Metodologia): boolean => {
  const ultima = getDataUltimaManutencao(ativo);
  if (!ultima) return false;
  const janelaMs = JANELA_MANUTENCAO_RECENTE_DIAS * 24 * 60 * 60 * 1000;
  return Date.now() - ultima <= janelaMs;
};

export const getCatalogoFacetas = (ativos: Metodologia[]): CatalogoFacetas => ({
  tipos: Array.from(new Set(ativos.map((a) => a.tipo_de_ativo))),
  status: Array.from(new Set(ativos.map((a) => a.status_editorial))),
  maturidades: Array.from(new Set(ativos.map((a) => a.maturidade_pratica))),
  governancas: Array.from(new Set(ativos.map((a) => a.governanca.estado_ciclo_vida)))
});

export const buscarCatalogoCanonico = (ativos: Metodologia[], busca: string, incluirTitulosBlocos = true): Metodologia[] => {
  const termo = normalizarTexto(busca);
  if (!termo) return ativos;

  return ativos.filter((ativo) => {
    const camposBase = [ativo.nome, ativo.resumo, ativo.definicao, ativo.objetivo];
    const camposBlocos = incluirTitulosBlocos ? (ativo.blocos_canonicos ?? []).map((bloco) => bloco.titulo) : [];
    return [...camposBase, ...camposBlocos].some((campo) => normalizarTexto(campo).includes(termo));
  });
};

export const filtrarCatalogoCanonico = (ativos: Metodologia[], filtros: CatalogoFiltrosAvancados): Metodologia[] => {
  return ativos.filter((ativo) => {
    if (filtros.tipo_de_ativo !== 'todos' && ativo.tipo_de_ativo !== filtros.tipo_de_ativo) return false;
    if (filtros.status_editorial !== 'todos' && ativo.status_editorial !== filtros.status_editorial) return false;
    if (filtros.maturidade_pratica !== 'todos' && ativo.maturidade_pratica !== filtros.maturidade_pratica) return false;
    if (filtros.governanca_estado !== 'todos' && ativo.governanca.estado_ciclo_vida !== filtros.governanca_estado) return false;

    const temBlocosCanonicos = getTemBlocosCanonicos(ativo);
    if (filtros.possui_blocos_canonicos === 'sim' && !temBlocosCanonicos) return false;
    if (filtros.possui_blocos_canonicos === 'nao' && temBlocosCanonicos) return false;

    const temVersaoVigente = getTemVersaoVigente(ativo);
    if (filtros.possui_versao_vigente === 'sim' && !temVersaoVigente) return false;
    if (filtros.possui_versao_vigente === 'nao' && temVersaoVigente) return false;

    const snapshotEquivalencia = getSnapshotEquivalencia(ativo);
    if (filtros.snapshot_equivalencia !== 'todos' && snapshotEquivalencia !== filtros.snapshot_equivalencia) return false;

    const vindoDePromocao = getVindoDePromocao(ativo);
    if (filtros.vindo_de_promocao === 'sim' && !vindoDePromocao) return false;
    if (filtros.vindo_de_promocao === 'nao' && vindoDePromocao) return false;

    const origemRastreavel = getOrigemRastreavel(ativo);
    if (filtros.origem_rastreavel === 'sim' && !origemRastreavel) return false;
    if (filtros.origem_rastreavel === 'nao' && origemRastreavel) return false;

    const manutencaoRecente = getTemManutencaoRecente(ativo);
    if (filtros.manutencao_recente === 'sim' && !manutencaoRecente) return false;
    if (filtros.manutencao_recente === 'nao' && manutencaoRecente) return false;

    return true;
  });
};

export const ordenarCatalogoCanonico = (ativos: Metodologia[], ordenacao: CatalogoOrdenacao): Metodologia[] => {
  const base = [...ativos];

  switch (ordenacao) {
    case 'mais_antigo':
      return base.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    case 'nome_az':
      return base.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    case 'nome_za':
      return base.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
    case 'maior_qtd_blocos':
      return base.sort((a, b) => (b.blocos_canonicos?.length ?? 0) - (a.blocos_canonicos?.length ?? 0));
    case 'manutencao_recente':
      return base.sort((a, b) => getDataUltimaManutencao(b) - getDataUltimaManutencao(a));
    case 'mais_recente':
    default:
      return base.sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
  }
};

export const resumirEstadoCatalogoCanonico = (params: {
  totalBase: number;
  resultados: Metodologia[];
  busca: string;
  filtros: CatalogoFiltrosAvancados;
}): CatalogoResumoEstado => {
  const filtrosAtivos: string[] = [];
  if (params.busca.trim()) filtrosAtivos.push(`Busca: "${params.busca.trim()}"`);
  if (params.filtros.tipo_de_ativo !== 'todos') filtrosAtivos.push(`Tipo: ${getTipoDeAtivoLabel(params.filtros.tipo_de_ativo)}`);
  if (params.filtros.status_editorial !== 'todos') {
    filtrosAtivos.push(`Status editorial: ${getStatusEditorialLabel(params.filtros.status_editorial)}`);
  }
  if (params.filtros.maturidade_pratica !== 'todos') {
    filtrosAtivos.push(`Maturidade: ${getMaturidadePraticaLabel(params.filtros.maturidade_pratica)}`);
  }
  if (params.filtros.governanca_estado !== 'todos') {
    filtrosAtivos.push(`Governança: ${getEstadoGovernancaLabel(params.filtros.governanca_estado)}`);
  }
  if (params.filtros.possui_blocos_canonicos !== 'todos') {
    filtrosAtivos.push(`Blocos canônicos: ${params.filtros.possui_blocos_canonicos === 'sim' ? 'com' : 'sem'}`);
  }
  if (params.filtros.possui_versao_vigente !== 'todos') {
    filtrosAtivos.push(`Versão vigente: ${params.filtros.possui_versao_vigente === 'sim' ? 'sim' : 'não'}`);
  }
  if (params.filtros.snapshot_equivalencia !== 'todos') {
    filtrosAtivos.push(`Integridade canônica: ${params.filtros.snapshot_equivalencia === 'integro_minimo' ? 'íntegro mínimo' : 'pendente'}`);
  }
  if (params.filtros.vindo_de_promocao !== 'todos') {
    filtrosAtivos.push(`Vindo de promoção: ${params.filtros.vindo_de_promocao === 'sim' ? 'sim' : 'não'}`);
  }
  if (params.filtros.origem_rastreavel !== 'todos') {
    filtrosAtivos.push(`Origem rastreável: ${params.filtros.origem_rastreavel === 'sim' ? 'sim' : 'não'}`);
  }
  if (params.filtros.manutencao_recente !== 'todos') {
    filtrosAtivos.push(`Manutenção recente: ${params.filtros.manutencao_recente === 'sim' ? 'sim' : 'não'}`);
  }

  return {
    total_ativos_base: params.totalBase,
    total_resultados: params.resultados.length,
    possui_filtros_ativos: filtrosAtivos.length > 0,
    filtros_ativos: filtrosAtivos,
    oficiais_no_resultado: params.resultados.filter((item) => item.status_editorial === 'oficial').length,
    com_blocos_canonicos_no_resultado: params.resultados.filter(getTemBlocosCanonicos).length,
    com_versao_vigente_no_resultado: params.resultados.filter(getTemVersaoVigente).length
  };
};

export const agruparCatalogoCanonico = (itens: Metodologia[], agrupamento: CatalogoAgrupamento): CatalogoGrupo[] => {
  if (agrupamento === 'nenhum') {
    return [{ chave: 'todos', label: 'Resultados', itens }];
  }

  const mapa = new Map<string, Metodologia[]>();
  const push = (chave: string, item: Metodologia) => {
    const atual = mapa.get(chave) ?? [];
    atual.push(item);
    mapa.set(chave, atual);
  };

  itens.forEach((item) => {
    if (agrupamento === 'tipo_de_ativo') push(item.tipo_de_ativo, item);
    if (agrupamento === 'status_editorial') push(item.status_editorial, item);
    if (agrupamento === 'maturidade_pratica') push(item.maturidade_pratica, item);
  });

  return Array.from(mapa.entries()).map(([chave, itensDoGrupo]) => {
    let label = chave;
    if (agrupamento === 'tipo_de_ativo') label = getTipoDeAtivoLabel(chave as AtivoMetodologicoTipo);
    if (agrupamento === 'status_editorial') label = getStatusEditorialLabel(chave as MetodologiaStatusEditorial);
    if (agrupamento === 'maturidade_pratica') label = getMaturidadePraticaLabel(chave as MetodologiaMaturidadePratica);
    return { chave, label, itens: itensDoGrupo };
  });
};

export const explorarCatalogoCanonico = (params: {
  ativos: Metodologia[];
  busca: string;
  filtros: CatalogoFiltrosAvancados;
  ordenacao: CatalogoOrdenacao;
  agrupamento: CatalogoAgrupamento;
}): ExplorarCatalogoResult => {
  const comBusca = buscarCatalogoCanonico(params.ativos, params.busca, true);
  const filtrados = filtrarCatalogoCanonico(comBusca, params.filtros);
  const ordenados = ordenarCatalogoCanonico(filtrados, params.ordenacao);
  const grupos = agruparCatalogoCanonico(ordenados, params.agrupamento);
  const resumo = resumirEstadoCatalogoCanonico({
    totalBase: params.ativos.length,
    resultados: ordenados,
    busca: params.busca,
    filtros: params.filtros
  });

  return {
    itens: ordenados,
    grupos,
    resumo
  };
};
