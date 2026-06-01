/**
 * Composer Service — MEGA-ETAPA 06
 *
 * Gerencia o estado visual de composição (ComposerState):
 * - Mapeia blocos do projeto para zonas do layout
 * - Define ordem visual dentro de cada zona
 * - Atribui PapelVisual a cada bloco
 * - Persiste o estado em localStorage (chave separada)
 */
import {
  BlocoTela,
  BlockInspectorData,
  BlocoMeta,
  ComposerBlockState,
  ComposerState,
  EfeitoVisualPreset,
  LayoutModelo,
  LayoutZone,
  PapelBloco,
} from '../../types/telasAvancadas.types';
import { getZonasForLayout } from '../../data/layouts';
import { loadCentralData, makeId, saveCentralData } from '../repository/central.repository';

const COMPOSER_KEY = 'sagb_telas_avancadas_composer_v1';

/* ── Persistência ── */

const loadComposerData = (): Record<string, ComposerState> => {
  try {
    const raw = localStorage.getItem(COMPOSER_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const saveComposerData = (data: Record<string, ComposerState>) => {
  localStorage.setItem(COMPOSER_KEY, JSON.stringify(data));
};

/* ── Estado do Composer ── */

/**
 * Obtém o ComposerState de um projeto.
 * Se não existir, constrói a partir do layout atual e blocos existentes.
 */
export const getComposerState = (projetoId: string): ComposerState | null => {
  const all = loadComposerData();
  const stored = all[projetoId];
  if (stored) return stored;
  return buildComposerState(projetoId);
};

/**
 * Persiste o ComposerState de um projeto.
 */
export const persistComposerState = (projetoId: string, state: ComposerState) => {
  const all = loadComposerData();
  all[projetoId] = state;
  saveComposerData(all);
};

/* ── Construção ── */

/**
 * Constrói um ComposerState inicial a partir do layout atual e blocos do projeto.
 * Blocos existentes são distribuídos automaticamente nas zonas compatíveis.
 */
export const buildComposerState = (projetoId: string): ComposerState | null => {
  const central = loadCentralData();
  const projeto = central.projetos.find((p) => p.id === projetoId);
  if (!projeto) return null;

  const layout = projeto.layout || 'dashboard_grid';
  const zonas = getZonasForLayout(layout);
  const blocosDoProjeto = central.blocos
    .filter((b) => b.projetoId === projetoId)
    .sort((a, b) => a.ordem - b.ordem);

  if (zonas.length === 0 || blocosDoProjeto.length === 0) {
    const empty: ComposerState = { layoutAtual: layout, zonas, blocos: [] };
    return empty;
  }

  // Distribui blocos nas zonas — o primeiro bloco vai para a primeira zona, etc.
  const blocos: ComposerBlockState[] = blocosDoProjeto.map((b, idx) => {
    const zonaIdx = idx % zonas.length;
    const zona = zonas[zonaIdx];
    const ordemNaZona = blocosDoProjeto
      .slice(0, idx)
      .filter((prev) => prev.projetoId === b.projetoId)
      .filter((_, i) => (i % zonas.length) === zonaIdx).length + 1;

    return {
      blocoId: b.id,
      zonaId: zona.id,
      ordemZona: ordemNaZona,
    };
  });

  const state: ComposerState = { layoutAtual: layout, zonas, blocos };
  return state;
};

/**
 * Reconstrói o composer state forçadamente (útil após troca de layout).
 */
export const rebuildComposerState = (projetoId: string): ComposerState | null => {
  const state = buildComposerState(projetoId);
  if (state) persistComposerState(projetoId, state);
  return state;
};

/* ── Operações de Atribuição ── */

/**
 * Atribui um bloco a uma zona específica do layout.
 */
export const assignBlocoToZona = (
  projetoId: string,
  blocoId: string,
  zonaId: string
): ComposerState | null => {
  const state = getComposerState(projetoId);
  if (!state) return null;

  const zona = state.zonas.find((z) => z.id === zonaId);
  if (!zona) return state;

  const existing = state.blocos.filter((b) => b.zonaId === zonaId);
  const newOrdem = existing.length + 1;

  const idx = state.blocos.findIndex((b) => b.blocoId === blocoId);
  if (idx >= 0) {
    state.blocos[idx] = {
      ...state.blocos[idx],
      zonaId,
      ordemZona: newOrdem,
    };
  } else {
    state.blocos.push({ blocoId, zonaId, ordemZona: newOrdem });
  }

  persistComposerState(projetoId, state);
  return state;
};

/**
 * Remove um bloco da composição (não deleta o bloco, apenas tira da zona).
 */
export const removeBlocoFromComposer = (
  projetoId: string,
  blocoId: string
): ComposerState | null => {
  const state = getComposerState(projetoId);
  if (!state) return null;

  state.blocos = state.blocos.filter((b) => b.blocoId !== blocoId);
  persistComposerState(projetoId, state);
  return state;
};

/**
 * Reordena um bloco dentro de sua zona atual.
 */
export const reorderBlocoInZona = (
  projetoId: string,
  blocoId: string,
  newOrdem: number
): ComposerState | null => {
  const state = getComposerState(projetoId);
  if (!state) return null;

  const idx = state.blocos.findIndex((b) => b.blocoId === blocoId);
  if (idx < 0) return state;

  state.blocos[idx].ordemZona = Math.max(1, newOrdem);
  persistComposerState(projetoId, state);
  return state;
};

/**
 * Define o PapelVisual de um bloco na composição.
 */
export const setBlocoPapelVisual = (
  projetoId: string,
  blocoId: string,
  papel: PapelBloco
): ComposerState | null => {
  const state = getComposerState(projetoId);
  if (!state) return null;

  const idx = state.blocos.findIndex((b) => b.blocoId === blocoId);
  if (idx < 0) return state;

  state.blocos[idx] = { ...state.blocos[idx], papelVisual: papel };
  persistComposerState(projetoId, state);
  return state;
};

/**
 * Altera o layout de um projeto e reconstrói a composição.
 */
export const changeLayout = (
  projetoId: string,
  novoLayout: LayoutModelo
): ComposerState | null => {
  const central = loadCentralData();
  const projeto = central.projetos.find((p) => p.id === projetoId);
  if (!projeto) return null;

  projeto.layout = novoLayout;
  projeto.updatedAt = new Date();
  saveCentralData(central);

  return rebuildComposerState(projetoId);
};

/* ── Inspetor de Bloco ── */

const ALL_METAS: BlocoMeta[] = [
  { tipo: 'entrada_ideia', nome: 'Entrada de Ideia', descricao: 'Campo de input para novas ideias.', ajuda: 'Use como ponto de partida do fluxo.', icone: '📥', categoria: 'entrada' },
  { tipo: 'card_agente', nome: 'Card de Agente', descricao: 'Exibe informações de um agente.', ajuda: 'Ideal para perfis ou cards de entidade.', icone: '🧑‍💻', categoria: 'exibicao' },
  { tipo: 'conector', nome: 'Conector', descricao: 'Liga dois pontos do fluxo.', ajuda: 'Use entre blocos para criar transições.', icone: '🔗', categoria: 'conexao' },
  { tipo: 'painel_lateral', nome: 'Painel Lateral', descricao: 'Painel de contexto complementar.', ajuda: 'Coloque à direita ou esquerda do conteúdo.', icone: '📋', categoria: 'exibicao' },
  { tipo: 'logs', nome: 'Logs', descricao: 'Linha do tempo de eventos.', ajuda: 'Histórico ou feed de atividades.', icone: '📜', categoria: 'exibicao' },
  { tipo: 'artefatos', nome: 'Artefatos', descricao: 'Exibição de documentos, links ou mídia.', ajuda: 'Galeria de arquivos e referências.', icone: '📎', categoria: 'exibicao' },
  { tipo: 'gates', nome: 'Gates / Decisões', descricao: 'Ponto de decisão no fluxo.', ajuda: 'Crie branchs visuais com condições.', icone: '🚦', categoria: 'processamento' },
  { tipo: 'nucleo_central', nome: 'Núcleo Central', descricao: 'Elemento central da visualização.', ajuda: 'Destaque principal da tela.', icone: '🎯', categoria: 'exibicao' },
  { tipo: 'mapa_termico', nome: 'Mapa Térmico', descricao: 'Mapa de calor operacional.', ajuda: 'Visualize concentração de dados.', icone: '🔥', categoria: 'exibicao' },
  { tipo: 'timeline', nome: 'Timeline', descricao: 'Linha do tempo vertical.', ajuda: 'Sequência cronológica de eventos.', icone: '⏳', categoria: 'exibicao' },
  { tipo: 'indicadores', nome: 'Indicadores / KPIs', descricao: 'Métricas e números destacados.', ajuda: 'Resumo numérico para painéis.', icone: '📊', categoria: 'exibicao' },
  { tipo: 'capsula', nome: 'Cápsula de Conteúdo', descricao: 'Bloco compacto de conteúdo.', ajuda: 'Use para highlights e resumos.', icone: '💊', categoria: 'exibicao' },
  { tipo: 'bloco_final_entrega', nome: 'Bloco Final / Entrega', descricao: 'Bloco de conclusão do fluxo.', ajuda: 'Sinaliza o fim do pipeline.', icone: '🏁', categoria: 'entrega' },
];

const getEfeitoByTipo = (tipo: string): EfeitoVisualPreset | undefined => {
  const map: Record<string, EfeitoVisualPreset> = {
    nucleo_central: 'glow_ativo',
    conector: 'linha_viva',
    gates: 'pausa_gate',
    bloco_final_entrega: 'flash_conclusao',
    mapa_termico: 'particulas_sutis',
    timeline: 'pulso',
    indicadores: 'card_respirando',
  };
  return map[tipo];
};

/**
 * Constrói os dados completos para o BlockInspector a partir do bloco e seu estado no composer.
 */
export const buildInspectorData = (
  bloco: BlocoTela,
  state: ComposerState | null
): BlockInspectorData => {
  const meta = ALL_METAS.find((m) => m.tipo === bloco.tipo) ?? null;
  const cs = state?.blocos.find((b) => b.blocoId === bloco.id);
  const zona = state?.zonas.find((z) => z.id === cs?.zonaId) ?? null;

  return {
    bloco,
    meta,
    zona,
    ordem: cs?.ordemZona ?? bloco.ordem,
    papelVisual: cs?.papelVisual,
    efeitoAplicado: getEfeitoByTipo(bloco.tipo),
    grupo: bloco.grupo,
  };
};

/**
 * Retorna todos os BlockInspectorData de um projeto para uso no Preview.
 */
export const buildAllInspectorData = (projetoId: string): BlockInspectorData[] => {
  const central = loadCentralData();
  const state = getComposerState(projetoId);
  const blocos = central.blocos
    .filter((b) => b.projetoId === projetoId)
    .sort((a, b) => a.ordem - b.ordem);

  return blocos.map((b) => buildInspectorData(b, state));
};

/* ── Helpers para UI ── */

/**
 * Retorna blocos agrupados por zona para renderização no ComposerCanvas.
 */
export const getBlocosAgrupadosPorZona = (
  projetoId: string
): { zona: LayoutZone; blocos: ComposerBlockState[] }[] => {
  const state = getComposerState(projetoId);
  if (!state) return [];

  return state.zonas.map((zona) => ({
    zona,
    blocos: state.blocos
      .filter((b) => b.zonaId === zona.id)
      .sort((a, b) => a.ordemZona - b.ordemZona),
  }));
};

/**
 * Obtém os blocos disponíveis (não atribuídos a nenhuma zona) de um projeto.
 */
export const getBlocosDisponiveis = (projetoId: string): BlocoTela[] => {
  const central = loadCentralData();
  const state = getComposerState(projetoId);
  const blocosDoProjeto = central.blocos.filter((b) => b.projetoId === projetoId);
  const assignedIds = new Set(state?.blocos.map((b) => b.blocoId) ?? []);
  return blocosDoProjeto.filter((b) => !assignedIds.has(b.id));
};

/* ── Export ALL_METAS para uso externo ── */
export { ALL_METAS };
