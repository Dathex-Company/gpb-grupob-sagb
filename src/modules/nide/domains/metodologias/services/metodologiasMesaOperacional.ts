import type {
  AtivoEmEstruturacao,
  EntradaMetodologicaBruta,
  EntradaMetodologicaStatusEstruturacao,
  MesaEstruturacaoAgrupamentoOperacional,
  MesaEstruturacaoClassificacaoOperacional,
  MesaEstruturacaoFiltrosOperacionais,
  MesaEstruturacaoGrupoOperacional,
  MesaEstruturacaoItemOperacional,
  MesaEstruturacaoLeituraOperacional,
  MesaEstruturacaoOrdenacaoOperacional,
  MesaEstruturacaoProntidao
} from '../types';
import {
  diagnosticarAtivoEmEstruturacao,
  getStatusEstruturacaoLabel,
  getTipoEntradaBrutaLabel
} from './metodologiasCatalog';
import { diagnosticarProntidaoPromocaoAssistida } from './metodologiasPromocaoAssistida';

const JANELA_ATIVIDADE_RECENTE_DIAS = 7;
const LIMITE_ITEM_PARADO_DIAS = 30;

const CLASSIFICACAO_LABEL: Record<MesaEstruturacaoClassificacaoOperacional, string> = {
  travado: 'Travado',
  em_andamento: 'Em andamento',
  quase_pronto: 'Quase pronto',
  pronto_para_revisao: 'Pronto para revisão',
  precisa_de_acao: 'Precisa de ação'
};

const PRONTIDAO_LABEL: Record<MesaEstruturacaoProntidao, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  revisao: 'Em revisão'
};

const toDate = (value?: string): Date => {
  if (!value) return new Date(0);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
};

const diasSemMovimento = (updatedAt?: string): number => {
  const diffMs = Date.now() - toDate(updatedAt).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

const isAtividadeRecente = (dias: number): boolean => dias <= JANELA_ATIVIDADE_RECENTE_DIAS;
const isParado = (dias: number): boolean => dias >= LIMITE_ITEM_PARADO_DIAS;

const clamp = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const resolveProntidao = (params: {
  prontoParaRevisao: boolean;
  proximidadePromocao: number;
}): MesaEstruturacaoProntidao => {
  if (params.prontoParaRevisao) return 'revisao';
  if (params.proximidadePromocao >= 75) return 'alta';
  if (params.proximidadePromocao >= 45) return 'media';
  return 'baixa';
};

const resolveClassificacaoAtivo = (params: {
  prontoParaRevisao: boolean;
  lacunaCritica: boolean;
  temBlocos: boolean;
  temRelacoes: boolean;
  proximidadePromocao: number;
  diasParado: number;
}): MesaEstruturacaoClassificacaoOperacional => {
  if (params.prontoParaRevisao) return 'pronto_para_revisao';

  if (params.lacunaCritica && (!params.temBlocos || params.diasParado >= 14)) {
    return 'travado';
  }

  if (params.proximidadePromocao >= 75) {
    return 'quase_pronto';
  }

  if (params.lacunaCritica || !params.temBlocos || !params.temRelacoes) {
    return 'precisa_de_acao';
  }

  return 'em_andamento';
};

const resolveClassificacaoEntrada = (
  status: EntradaMetodologicaStatusEstruturacao,
  diasParado: number
): MesaEstruturacaoClassificacaoOperacional => {
  if (status === 'convertido_em_ativo') return 'pronto_para_revisao';
  if (status === 'bruto' && diasParado >= 14) return 'travado';
  if (status === 'estruturado_parcialmente') return 'em_andamento';
  if (status === 'em_analise') return 'em_andamento';
  return 'precisa_de_acao';
};

export const criarLeituraOperacionalMesa = (
  entradas: EntradaMetodologicaBruta[],
  ativos: AtivoEmEstruturacao[]
): MesaEstruturacaoLeituraOperacional => {
  const entradasMap = new Map(entradas.map((entrada) => [entrada.id, entrada]));

  const itensAtivos: MesaEstruturacaoItemOperacional[] = ativos.map((ativo) => {
    const entradaOrigem = entradasMap.get(ativo.origem_entrada_id);
    const diagnosticoEstruturacao = diagnosticarAtivoEmEstruturacao(ativo);
    const diagnosticoPromocao = diagnosticarProntidaoPromocaoAssistida(ativo);

    const totalLacunasCriticas = diagnosticoEstruturacao.lacunas.filter((lacuna) => lacuna.criticidade === 'alta').length;
    const lacunaCritica = totalLacunasCriticas > 0;
    const temBlocos = (ativo.blocos_internos ?? []).length > 0;
    const temRelacoes = (ativo.relacoes_estruturacao ?? []).length > 0;
    const diasSemAtualizacao = diasSemMovimento(ativo.updated_at);
    const prontoParaRevisao =
      ativo.etapa_fluxo === 'pronto_para_revisao_manual' || diagnosticoPromocao.pronto_para_promocao || ativo.governanca.estado === 'em_revisao';

    const proximidadePromocao = clamp(
      diagnosticoPromocao.percentual_prontidao - (temBlocos ? 0 : 20) - (temRelacoes ? 0 : 10) - (lacunaCritica ? 20 : 0)
    );

    return {
      id: `ativo:${ativo.id_estruturacao}`,
      tipo_item: 'ativo_estruturacao',
      titulo: ativo.nome,
      subtitulo: ativo.origem_entrada_titulo,
      origem_label: entradaOrigem ? getTipoEntradaBrutaLabel(entradaOrigem.tipo_de_entrada) : 'Sem origem mapeada',
      status_label: prontoParaRevisao ? 'Pronto para revisão manual' : 'Em estruturação',
      atualizado_em: ativo.updated_at,
      dias_sem_movimento: diasSemAtualizacao,
      base_minima_preenchida: diagnosticoEstruturacao.base_minima_preenchida,
      pronto_para_revisao: prontoParaRevisao,
      tem_blocos: temBlocos,
      tem_relacoes: temRelacoes,
      lacuna_critica: lacunaCritica,
      atividade_recente: isAtividadeRecente(diasSemAtualizacao),
      parado: isParado(diasSemAtualizacao),
      prontidao: resolveProntidao({ prontoParaRevisao, proximidadePromocao }),
      classificacao_operacional: resolveClassificacaoAtivo({
        prontoParaRevisao,
        lacunaCritica,
        temBlocos,
        temRelacoes,
        proximidadePromocao,
        diasParado: diasSemAtualizacao
      }),
      proximidade_promocao: proximidadePromocao,
      entrada_origem_id: ativo.origem_entrada_id,
      tipo_entrada: entradaOrigem?.tipo_de_entrada,
      status_estruturacao: entradaOrigem?.status_de_estruturacao,
      etapa_fluxo: ativo.etapa_fluxo
    };
  });

  const itensEntradas: MesaEstruturacaoItemOperacional[] = entradas.map((entrada) => {
    const diasSemAtualizacao = diasSemMovimento(entrada.updated_at);
    const classificacao = resolveClassificacaoEntrada(entrada.status_de_estruturacao, diasSemAtualizacao);

    const proximidadePromocao =
      entrada.status_de_estruturacao === 'convertido_em_ativo'
        ? 70
        : entrada.status_de_estruturacao === 'estruturado_parcialmente'
        ? 45
        : entrada.status_de_estruturacao === 'em_analise'
        ? 25
        : 5;

    return {
      id: `entrada:${entrada.id}`,
      tipo_item: 'entrada_bruta',
      titulo: entrada.titulo,
      subtitulo: entrada.origem,
      origem_label: getTipoEntradaBrutaLabel(entrada.tipo_de_entrada),
      status_label: getStatusEstruturacaoLabel(entrada.status_de_estruturacao),
      atualizado_em: entrada.updated_at,
      dias_sem_movimento: diasSemAtualizacao,
      base_minima_preenchida: false,
      pronto_para_revisao: entrada.status_de_estruturacao === 'convertido_em_ativo',
      tem_blocos: false,
      tem_relacoes: false,
      lacuna_critica: entrada.status_de_estruturacao === 'bruto' || entrada.status_de_estruturacao === 'em_analise',
      atividade_recente: isAtividadeRecente(diasSemAtualizacao),
      parado: isParado(diasSemAtualizacao),
      prontidao:
        entrada.status_de_estruturacao === 'convertido_em_ativo'
          ? 'alta'
          : entrada.status_de_estruturacao === 'estruturado_parcialmente'
          ? 'media'
          : 'baixa',
      classificacao_operacional: classificacao,
      proximidade_promocao: proximidadePromocao,
      entrada_origem_id: entrada.id,
      tipo_entrada: entrada.tipo_de_entrada,
      status_estruturacao: entrada.status_de_estruturacao
    };
  });

  const itens = [...itensAtivos, ...itensEntradas].sort(
    (a, b) => toDate(b.atualizado_em).getTime() - toDate(a.atualizado_em).getTime()
  );

  const indicadores = {
    total_itens_em_estruturacao: ativos.length,
    entradas_brutas_sem_conversao: entradas.filter((entrada) => entrada.status_de_estruturacao !== 'convertido_em_ativo').length,
    ativos_sem_blocos: itensAtivos.filter((item) => !item.tem_blocos).length,
    ativos_sem_relacoes: itensAtivos.filter((item) => !item.tem_relacoes).length,
    ativos_com_base_minima: itensAtivos.filter((item) => item.base_minima_preenchida).length,
    itens_quase_prontos: itens.filter((item) => item.classificacao_operacional === 'quase_pronto').length,
    itens_travados: itens.filter((item) => item.classificacao_operacional === 'travado').length,
    ativos_prontos_para_revisao: itensAtivos.filter((item) => item.pronto_para_revisao).length,
    ativos_com_lacuna_critica: itensAtivos.filter((item) => item.lacuna_critica).length,
    itens_com_atividade_recente: itens.filter((item) => item.atividade_recente).length,
    itens_parados: itens.filter((item) => item.parado).length
  };

  return { indicadores, itens };
};

export const getClassificacaoOperacionalMesaLabel = (
  classificacao: MesaEstruturacaoClassificacaoOperacional
): string => CLASSIFICACAO_LABEL[classificacao];

export const getProntidaoOperacionalMesaLabel = (prontidao: MesaEstruturacaoProntidao): string => PRONTIDAO_LABEL[prontidao];

export const criarFiltrosOperacionaisMesaIniciais = (): MesaEstruturacaoFiltrosOperacionais => ({
  status_estruturacao: 'todos',
  tipo_entrada: 'todos',
  prontidao: 'todos',
  presenca_blocos: 'todos',
  presenca_relacoes: 'todos',
  atividade: 'todos',
  lacuna_critica: 'todos',
  classificacao: 'todos',
  tipo_item: 'todos'
});

export const filtrarItensOperacionaisMesa = (
  itens: MesaEstruturacaoItemOperacional[],
  filtros: MesaEstruturacaoFiltrosOperacionais
): MesaEstruturacaoItemOperacional[] => {
  return itens.filter((item) => {
    if (filtros.tipo_item !== 'todos' && item.tipo_item !== filtros.tipo_item) return false;

    if (filtros.status_estruturacao !== 'todos' && item.status_estruturacao !== filtros.status_estruturacao) return false;

    if (filtros.tipo_entrada !== 'todos' && item.tipo_entrada !== filtros.tipo_entrada) return false;

    if (filtros.prontidao !== 'todos' && item.prontidao !== filtros.prontidao) return false;

    if (filtros.classificacao !== 'todos' && item.classificacao_operacional !== filtros.classificacao) return false;

    if (filtros.presenca_blocos === 'com_blocos' && !item.tem_blocos) return false;
    if (filtros.presenca_blocos === 'sem_blocos' && item.tem_blocos) return false;

    if (filtros.presenca_relacoes === 'com_relacoes' && !item.tem_relacoes) return false;
    if (filtros.presenca_relacoes === 'sem_relacoes' && item.tem_relacoes) return false;

    if (filtros.atividade === 'recente' && !item.atividade_recente) return false;
    if (filtros.atividade === 'parado' && !item.parado) return false;

    if (filtros.lacuna_critica === 'com_lacuna_critica' && !item.lacuna_critica) return false;
    if (filtros.lacuna_critica === 'sem_lacuna_critica' && item.lacuna_critica) return false;

    return true;
  });
};

export const ordenarItensOperacionaisMesa = (
  itens: MesaEstruturacaoItemOperacional[],
  ordenacao: MesaEstruturacaoOrdenacaoOperacional
): MesaEstruturacaoItemOperacional[] => {
  const copia = [...itens];

  switch (ordenacao) {
    case 'mais_antigos':
      return copia.sort((a, b) => toDate(a.atualizado_em).getTime() - toDate(b.atualizado_em).getTime());
    case 'mais_proximos_promocao':
      return copia.sort(
        (a, b) => b.proximidade_promocao - a.proximidade_promocao || toDate(b.atualizado_em).getTime() - toDate(a.atualizado_em).getTime()
      );
    case 'mais_incompletos':
      return copia.sort((a, b) => a.proximidade_promocao - b.proximidade_promocao || Number(b.lacuna_critica) - Number(a.lacuna_critica));
    case 'mais_parados':
      return copia.sort((a, b) => b.dias_sem_movimento - a.dias_sem_movimento);
    case 'mais_recentes':
    default:
      return copia.sort((a, b) => toDate(b.atualizado_em).getTime() - toDate(a.atualizado_em).getTime());
  }
};

export const agruparItensOperacionaisMesa = (
  itens: MesaEstruturacaoItemOperacional[],
  agrupamento: MesaEstruturacaoAgrupamentoOperacional
): MesaEstruturacaoGrupoOperacional[] => {
  if (agrupamento === 'nenhum') {
    return [
      {
        id: 'grupo-geral',
        label: 'Fila operacional',
        total: itens.length,
        itens
      }
    ];
  }

  const buckets = new Map<string, MesaEstruturacaoGrupoOperacional>();
  const upsertBucket = (id: string, label: string, item: MesaEstruturacaoItemOperacional) => {
    const atual = buckets.get(id);
    if (!atual) {
      buckets.set(id, { id, label, total: 1, itens: [item] });
      return;
    }

    atual.itens.push(item);
    atual.total += 1;
  };

  itens.forEach((item) => {
    if (agrupamento === 'status') {
      upsertBucket(`status:${item.status_label}`, item.status_label, item);
      return;
    }

    if (agrupamento === 'prontidao') {
      const label = getProntidaoOperacionalMesaLabel(item.prontidao);
      upsertBucket(`prontidao:${item.prontidao}`, label, item);
      return;
    }

    if (agrupamento === 'origem') {
      upsertBucket(`origem:${item.origem_label}`, item.origem_label, item);
      return;
    }

    const id = item.lacuna_critica ? 'lacuna:com' : 'lacuna:sem';
    const label = item.lacuna_critica ? 'Com lacuna crítica' : 'Sem lacuna crítica';
    upsertBucket(id, label, item);
  });

  return Array.from(buckets.values()).sort((a, b) => b.total - a.total || a.label.localeCompare(b.label, 'pt-BR'));
};