import type {
  AtivoMetodologicoRelacao,
  AtivoMetodologicoRelacaoTipo,
  Metodologia
} from '../types';
import { getTipoRelacaoLabel } from './metodologiasCatalog';

export type RelacaoDirecaoVisual = 'saida' | 'entrada';

export interface RelacaoVisualItem {
  id: string;
  direcao: RelacaoDirecaoVisual;
  tipo_de_relacao: AtivoMetodologicoRelacaoTipo;
  tipo_relacao_label: string;
  ativo_origem_id: string;
  ativo_destino_id: string;
  ativo_relacionado_id: string;
  ativo_relacionado_nome: string;
  ativo_relacionado_slug: string;
  observacao?: string;
}

export interface RelacoesVisuaisAtivo {
  ativo_id: string;
  total_relacoes: number;
  saida: RelacaoVisualItem[];
  entrada: RelacaoVisualItem[];
}

export interface MapaConexaoAresta {
  id: string;
  origem_id: string;
  origem_nome: string;
  origem_slug: string;
  destino_id: string;
  destino_nome: string;
  destino_slug: string;
  tipo_de_relacao: AtivoMetodologicoRelacaoTipo;
  tipo_relacao_label: string;
}

export interface MapaConexaoNoResumo {
  ativo_id: string;
  nome: string;
  slug: string;
  total_saidas: number;
  total_entradas: number;
  total_conexoes: number;
}

export interface MapaConexoesVisual {
  total_ativos: number;
  total_arestas: number;
  total_ativos_conectados: number;
  arestas: MapaConexaoAresta[];
  ativos_mais_conectados: MapaConexaoNoResumo[];
}

const getRelacoesAtivo = (ativo: Metodologia): AtivoMetodologicoRelacao[] => {
  return ativo.relacoes_ativos ?? [];
};

const mapById = (ativos: Metodologia[]): Map<string, Metodologia> => {
  return new Map(ativos.map((ativo) => [ativo.id, ativo]));
};

export const listarRelacoesVisuaisDoAtivo = (params: {
  ativoId: string;
  ativos: Metodologia[];
}): RelacoesVisuaisAtivo => {
  const ativosMap = mapById(params.ativos);
  const saida: RelacaoVisualItem[] = [];
  const entrada: RelacaoVisualItem[] = [];

  params.ativos.forEach((ativo) => {
    getRelacoesAtivo(ativo).forEach((relacao) => {
      if (relacao.ativo_origem_id === params.ativoId) {
        const relacionado = ativosMap.get(relacao.ativo_destino_id);
        saida.push({
          id: `${relacao.id}:saida`,
          direcao: 'saida',
          tipo_de_relacao: relacao.tipo_de_relacao,
          tipo_relacao_label: getTipoRelacaoLabel(relacao.tipo_de_relacao),
          ativo_origem_id: relacao.ativo_origem_id,
          ativo_destino_id: relacao.ativo_destino_id,
          ativo_relacionado_id: relacao.ativo_destino_id,
          ativo_relacionado_nome: relacionado?.nome ?? relacao.ativo_destino_id,
          ativo_relacionado_slug: relacionado?.slug ?? '',
          observacao: relacao.observacao
        });
      }

      if (relacao.ativo_destino_id === params.ativoId) {
        const relacionado = ativosMap.get(relacao.ativo_origem_id);
        entrada.push({
          id: `${relacao.id}:entrada`,
          direcao: 'entrada',
          tipo_de_relacao: relacao.tipo_de_relacao,
          tipo_relacao_label: getTipoRelacaoLabel(relacao.tipo_de_relacao),
          ativo_origem_id: relacao.ativo_origem_id,
          ativo_destino_id: relacao.ativo_destino_id,
          ativo_relacionado_id: relacao.ativo_origem_id,
          ativo_relacionado_nome: relacionado?.nome ?? relacao.ativo_origem_id,
          ativo_relacionado_slug: relacionado?.slug ?? '',
          observacao: relacao.observacao
        });
      }
    });
  });

  return {
    ativo_id: params.ativoId,
    total_relacoes: saida.length + entrada.length,
    saida,
    entrada
  };
};

export const montarMapaConexoesVisuais = (params: {
  ativos: Metodologia[];
  limiteArestas?: number;
}): MapaConexoesVisual => {
  const ativosMap = mapById(params.ativos);
  const arestas: MapaConexaoAresta[] = [];

  params.ativos.forEach((ativo) => {
    getRelacoesAtivo(ativo).forEach((relacao) => {
      const origem = ativosMap.get(relacao.ativo_origem_id);
      const destino = ativosMap.get(relacao.ativo_destino_id);

      arestas.push({
        id: relacao.id,
        origem_id: relacao.ativo_origem_id,
        origem_nome: origem?.nome ?? relacao.ativo_origem_id,
        origem_slug: origem?.slug ?? '',
        destino_id: relacao.ativo_destino_id,
        destino_nome: destino?.nome ?? relacao.ativo_destino_id,
        destino_slug: destino?.slug ?? '',
        tipo_de_relacao: relacao.tipo_de_relacao,
        tipo_relacao_label: getTipoRelacaoLabel(relacao.tipo_de_relacao)
      });
    });
  });

  const limiteArestas = Math.max(1, params.limiteArestas ?? 24);
  const arestasLimitadas = arestas.slice(0, limiteArestas);

  const conectividadePorAtivo = params.ativos.map((ativo) => {
    const saidas = arestas.filter((aresta) => aresta.origem_id === ativo.id).length;
    const entradas = arestas.filter((aresta) => aresta.destino_id === ativo.id).length;
    return {
      ativo_id: ativo.id,
      nome: ativo.nome,
      slug: ativo.slug,
      total_saidas: saidas,
      total_entradas: entradas,
      total_conexoes: saidas + entradas
    };
  });

  const ativosConectados = conectividadePorAtivo.filter((item) => item.total_conexoes > 0);

  return {
    total_ativos: params.ativos.length,
    total_arestas: arestas.length,
    total_ativos_conectados: ativosConectados.length,
    arestas: arestasLimitadas,
    ativos_mais_conectados: [...conectividadePorAtivo].sort((a, b) => b.total_conexoes - a.total_conexoes).slice(0, 6)
  };
};
