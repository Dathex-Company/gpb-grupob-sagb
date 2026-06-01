/**
 * Catálogo de Layouts com Zonas
 * MEGA-ETAPA 06 — Composer Visual V1
 *
 * Cada layout model define zonas espaciais coerentes
 * que guiam a composição visual dos blocos na tela.
 */
import {
  LayoutComZonas,
} from '../types/telasAvancadas.types';

export const LAYOUT_ZONES: LayoutComZonas[] = [
  {
    layout: 'dashboard_grid',
    nome: 'Dashboard Grid',
    descricao: 'Grade de indicadores com KPIs no topo e blocos de detalhamento no centro.',
    zonas: [
      {
        id: 'dg_header_kpis',
        label: 'Header KPIs',
        descricao: 'Indicadores principais e métricas de resumo',
        posicao: 'header_kpis',
        ordem: 1,
      },
      {
        id: 'dg_grid_principal',
        label: 'Grid Principal',
        descricao: 'Blocos de conteúdo distribuídos em grade',
        posicao: 'grid_principal',
        ordem: 2,
      },
      {
        id: 'dg_rodape',
        label: 'Rodapé',
        descricao: 'Informações complementares e status do sistema',
        posicao: 'rodape',
        ordem: 3,
      },
    ],
  },
  {
    layout: 'lateral_esquerda',
    nome: 'Lateral Esquerda',
    descricao: 'Painel de navegação/controle à esquerda com conteúdo principal à direita.',
    zonas: [
      {
        id: 'le_topo',
        label: 'Topo',
        descricao: 'Cabeçalho com contexto da tela',
        posicao: 'topo',
        ordem: 1,
      },
      {
        id: 'le_lateral',
        label: 'Lateral Esquerda',
        descricao: 'Painel de navegação, filtros ou controle',
        posicao: 'lateral_esquerda',
        ordem: 2,
      },
      {
        id: 'le_centro',
        label: 'Conteúdo Principal',
        descricao: 'Área central com o conteúdo principal',
        posicao: 'centro',
        ordem: 3,
      },
      {
        id: 'le_rodape',
        label: 'Rodapé',
        descricao: 'Informações de status e ações secundárias',
        posicao: 'rodape',
        ordem: 4,
      },
    ],
  },
  {
    layout: 'lateral_direita',
    nome: 'Lateral Direita',
    descricao: 'Conteúdo principal à esquerda com painel de apoio à direita.',
    zonas: [
      {
        id: 'ld_topo',
        label: 'Topo',
        descricao: 'Cabeçalho com contexto da tela',
        posicao: 'topo',
        ordem: 1,
      },
      {
        id: 'ld_centro',
        label: 'Conteúdo Principal',
        descricao: 'Área central com o conteúdo principal',
        posicao: 'centro',
        ordem: 2,
      },
      {
        id: 'ld_lateral',
        label: 'Lateral Direita',
        descricao: 'Painel de apoio, detalhes ou metadados',
        posicao: 'lateral_direita',
        ordem: 3,
      },
      {
        id: 'ld_rodape',
        label: 'Rodapé',
        descricao: 'Informações de status e ações secundárias',
        posicao: 'rodape',
        ordem: 4,
      },
    ],
  },
  {
    layout: 'centro_orbitais',
    nome: 'Centro com Orbitais',
    descricao: 'Núcleo central com blocos orbitais ao redor — ideal para networks e mapas vivos.',
    zonas: [
      {
        id: 'co_nucleo',
        label: 'Núcleo Central',
        descricao: 'Elemento principal da visualização',
        posicao: 'nucleo',
        ordem: 1,
      },
      {
        id: 'co_orbital_superior',
        label: 'Orbital Superior',
        descricao: 'Bloco orbital na posição superior',
        posicao: 'orbital',
        ordem: 2,
      },
      {
        id: 'co_orbital_inferior',
        label: 'Orbital Inferior',
        descricao: 'Bloco orbital na posição inferior',
        posicao: 'orbital',
        ordem: 3,
      },
      {
        id: 'co_painel_tecnico',
        label: 'Painel Técnico',
        descricao: 'Logs, métricas técnicas e diagnósticos',
        posicao: 'painel_tecnico',
        ordem: 4,
      },
      {
        id: 'co_trilha_inferior',
        label: 'Trilha Inferior',
        descricao: 'Linha do tempo ou progresso horizontal',
        posicao: 'trilha_inferior',
        ordem: 5,
      },
    ],
  },
  {
    layout: 'esteira_horizontal',
    nome: 'Esteira Horizontal',
    descricao: 'Fluxo linear horizontal com etapas sequenciais — ideal para pipelines e esteiras.',
    zonas: [
      {
        id: 'eh_entrada',
        label: 'Entrada',
        descricao: 'Ponto de entrada do fluxo',
        posicao: 'entrada',
        ordem: 1,
      },
      {
        id: 'eh_esteira',
        label: 'Esteira Principal',
        descricao: 'Etapas do fluxo principal em sequência',
        posicao: 'esteira',
        ordem: 2,
      },
      {
        id: 'eh_painel_apoio',
        label: 'Painel de Apoio',
        descricao: 'Informações contextuais e detalhes laterais',
        posicao: 'painel_apoio',
        ordem: 3,
      },
      {
        id: 'eh_conclusao',
        label: 'Conclusão',
        descricao: 'Resultado final e entrega do fluxo',
        posicao: 'conclusao',
        ordem: 4,
      },
    ],
  },
  {
    layout: 'mapa_central_paineis',
    nome: 'Mapa Central com Painéis',
    descricao: 'Mapa/interação central com painéis de contexto ao redor.',
    zonas: [
      {
        id: 'mc_mapa_central',
        label: 'Mapa Central',
        descricao: 'Visualização principal do mapa ou território',
        posicao: 'mapa_central',
        ordem: 1,
      },
      {
        id: 'mc_painel_apoio',
        label: 'Painel de Apoio',
        descricao: 'Informações contextuais sobre a região selecionada',
        posicao: 'painel_apoio',
        ordem: 2,
      },
      {
        id: 'mc_painel_tecnico',
        label: 'Painel Técnico',
        descricao: 'Métricas, logs e dados técnicos',
        posicao: 'painel_tecnico',
        ordem: 3,
      },
      {
        id: 'mc_faixa_progresso',
        label: 'Faixa de Progresso',
        descricao: 'Indicador de carregamento ou progresso geral',
        posicao: 'faixa_progresso',
        ordem: 4,
      },
    ],
  },
  {
    layout: 'fluxo_vertical',
    nome: 'Fluxo Vertical',
    descricao: 'Fluxo linear vertical com etapas sequenciais — ideal para timelines e processos.',
    zonas: [
      {
        id: 'fv_entrada',
        label: 'Entrada',
        descricao: 'Ponto de entrada do fluxo vertical',
        posicao: 'entrada',
        ordem: 1,
      },
      {
        id: 'fv_trilha_vertical',
        label: 'Trilha Vertical',
        descricao: 'Etapas do fluxo principal em sequência vertical',
        posicao: 'trilha_vertical',
        ordem: 2,
      },
      {
        id: 'fv_saida',
        label: 'Saída',
        descricao: 'Resultado e entrega final do fluxo',
        posicao: 'saida',
        ordem: 3,
      },
      {
        id: 'fv_painel_tecnico',
        label: 'Painel Técnico',
        descricao: 'Diagnósticos, logs e dados complementares',
        posicao: 'painel_tecnico',
        ordem: 4,
      },
    ],
  },
];

/**
 * Retorna as zonas de um layout específico.
 */
export const getLayoutZonas = (layout: LayoutComZonas['layout']): LayoutComZonas | undefined =>
  LAYOUT_ZONES.find((lz) => lz.layout === layout);

/**
 * Retorna todas as zonas de um layout como array simples.
 */
export const getZonasForLayout = (layout: LayoutComZonas['layout']): LayoutComZonas['zonas'] =>
  LAYOUT_ZONES.find((lz) => lz.layout === layout)?.zonas ?? [];

/**
 * Catálogo nomeado para uso em selectors.
 */
export const LAYOUT_OPTIONS: { value: LayoutComZonas['layout']; label: string; descricao: string }[] =
  LAYOUT_ZONES.map((lz) => ({
    value: lz.layout,
    label: lz.nome,
    descricao: lz.descricao,
  }));
