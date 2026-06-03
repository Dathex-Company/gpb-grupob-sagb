import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  Timestamp
} from '../../../../../services/supabase';
import { ATIVO_METODOLOGICO_RELACAO_TIPOS } from '../types';
import type {
  AtivoCanonico,
  AtivoCanonicoBloco,
  AtivoCanonicoBlocoInput,
  AtivoCanonicoBlocoPatch,
  AtivoEmEstruturacaoRelacao,
  AtivoEmEstruturacaoRelacaoDirecao,
  AtivoEmEstruturacaoRelacaoInput,
  AtivoMetodologicoRelacao,
  AtivoMetodologicoRelacaoTipo,
  AtivoCanonicoEventoManutencao,
  AtivoCanonicoEventoManutencaoTipo,
  AtivoCanonicoPromocaoPreview,
  AtivoCanonicoPatch,
  AtivoCanonicoVersao,
  AtivoCanonicoVersaoSnapshot,
  AtivoCanonicoVersaoStatus,
  VersionamentoCanonicoInicialResultado,
  AtivoEmEstruturacaoBlocoInterno,
  AtivoEmEstruturacaoBlocoInternoInput,
  AtivoEmEstruturacaoBlocoInternoPatch,
  AtivoEmEstruturacaoBlocoStatus,
  AtivoEmEstruturacaoBlocoTipo,
  AtivoEmEstruturacao,
  AtivoEmEstruturacaoEtapaFluxo,
  AtivoEmEstruturacaoPatch,
  ConversaoAssistidaAtivoPreview,
  EntradaMetodologicaBruta,
  EntradaMetodologicaStatusEstruturacao,
  EntradaMetodologicaTipoDeEntrada
} from '../types';
import { validarIntegridadeSnapshotCanonico } from './metodologiasCanonicoSnapshot';

const ENTRADAS_TABLE = 'metodologias_entradas_brutas';
const ATIVOS_TABLE = 'metodologias_ativos_em_estruturacao';
const BLOCOS_TABLE = 'metodologias_blocos_estruturacao';
const RELACOES_ESTRUTURACAO_TABLE = 'metodologias_relacoes_estruturacao';
const CANONICOS_TABLE = 'metodologias_catalogo_canonico';
const BLOCOS_CANONICOS_TABLE = 'metodologias_blocos_canonicos';
const RELACOES_CANONICAS_TABLE = 'metodologias_relacoes_canonicas';
const VERSOES_CANONICAS_TABLE = 'metodologias_versoes_canonicas';
const EVENTOS_MANUTENCAO_CANONICA_TABLE = 'metodologias_eventos_manutencao_canonica';

type TimestampLike = { toDate: () => Date };

interface BaseRow {
  id: string;
  created_at?: string | Date | TimestampLike | null;
  updated_at?: string | Date | TimestampLike | null;
}

const toIso = (value: string | Date | TimestampLike | null | undefined): string => {
  if (!value) return new Date().toISOString();
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const chunkIds = (ids: string[], size = 30): string[][] => {
  const output: string[][] = [];
  for (let i = 0; i < ids.length; i += size) output.push(ids.slice(i, i + size));
  return output;
};

const addMapItem = <T>(map: Map<string, T[]>, key: string, value: T): void => {
  const current = map.get(key) ?? [];
  current.push(value);
  map.set(key, current);
};

const mapEntrada = (row: BaseRow & Record<string, unknown>): EntradaMetodologicaBruta => ({
  id: String(row.id),
  titulo: String(row.titulo ?? ''),
  tipo_de_entrada: row.tipo_de_entrada as EntradaMetodologicaTipoDeEntrada,
  conteudo_bruto: String(row.conteudo_bruto ?? ''),
  origem: String(row.origem ?? ''),
  status_de_estruturacao: row.status_de_estruturacao as EntradaMetodologicaStatusEstruturacao,
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at)
});

const mapBlocoInterno = (row: BaseRow & Record<string, unknown>): AtivoEmEstruturacaoBlocoInterno => ({
  id: String(row.id),
  ativo_em_estruturacao_id: String(row.ativo_em_estruturacao_id),
  tipo_de_bloco: row.tipo_de_bloco as AtivoEmEstruturacaoBlocoTipo,
  titulo: String(row.titulo ?? ''),
  conteudo: String(row.conteudo ?? ''),
  ordem: Number(row.ordem ?? 1),
  status_do_bloco: (row.status_do_bloco ?? 'ativo') as AtivoEmEstruturacaoBlocoStatus,
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at)
});

const mapBlocoCanonico = (row: BaseRow & Record<string, unknown>): AtivoCanonicoBloco => ({
  id: String(row.id),
  ativo_canonico_id: String(row.ativo_canonico_id),
  bloco_origem_estruturacao_id: String(row.bloco_origem_estruturacao_id),
  tipo_de_bloco: row.tipo_de_bloco,
  titulo: String(row.titulo ?? ''),
  conteudo: String(row.conteudo ?? ''),
  ordem: Number(row.ordem ?? 1),
  status_do_bloco: row.status_do_bloco ?? 'ativo',
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at)
});

const mapVersaoCanonica = (row: BaseRow & Record<string, unknown>): AtivoCanonicoVersao => ({
  id: String(row.id),
  ativo_canonico_id: String(row.ativo_canonico_id),
  numero_versao: String(row.numero_versao ?? ''),
  titulo: row.titulo ? String(row.titulo) : undefined,
  resumo_da_versao: String(row.resumo_da_versao ?? ''),
  status_da_versao: (row.status_da_versao ?? 'rascunho') as AtivoCanonicoVersaoStatus,
  publicada_em: toIso(row.publicada_em),
  created_at: toIso(row.created_at),
  snapshot: row.snapshot ?? undefined,
  snapshot_status: row.snapshot_status ?? undefined,
  snapshot_validado_em: row.snapshot_validado_em ? toIso(row.snapshot_validado_em) : undefined
});

const mapEventoManutencaoCanonica = (row: BaseRow & Record<string, unknown>): AtivoCanonicoEventoManutencao => ({
  id: String(row.id),
  ativo_canonico_id: String(row.ativo_canonico_id),
  bloco_canonico_id: row.bloco_canonico_id ? String(row.bloco_canonico_id) : undefined,
  tipo_de_evento: row.tipo_de_evento as AtivoCanonicoEventoManutencaoTipo,
  descricao: String(row.descricao ?? ''),
  ocorrido_em: toIso(row.ocorrido_em),
  created_at: toIso(row.created_at)
});

const mapRelacaoCanonica = (row: BaseRow & Record<string, unknown>): AtivoMetodologicoRelacao => ({
  id: String(row.id),
  tipo_de_relacao: row.tipo_de_relacao as AtivoMetodologicoRelacaoTipo,
  ativo_origem_id: String(row.ativo_origem_id),
  ativo_destino_id: String(row.ativo_destino_id),
  observacao: row.observacao ? String(row.observacao) : undefined
});

const mapRelacaoEstruturacao = (row: BaseRow & Record<string, unknown>): AtivoEmEstruturacaoRelacao => ({
  id: String(row.id),
  ativo_em_estruturacao_id: String(row.ativo_em_estruturacao_id),
  ativo_relacionado_canonico_id: String(row.ativo_relacionado_canonico_id),
  tipo_de_relacao: row.tipo_de_relacao as AtivoMetodologicoRelacaoTipo,
  direcao: (row.direcao ?? 'saida') as AtivoEmEstruturacaoRelacaoDirecao,
  observacao: row.observacao ? String(row.observacao) : undefined,
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at)
});

const mapAtivo = (
  row: BaseRow & Record<string, unknown>,
  origemEntradaTitulo: string,
  blocosInternos: AtivoEmEstruturacaoBlocoInterno[] = [],
  relacoesEstruturacao: AtivoEmEstruturacaoRelacao[] = []
): AtivoEmEstruturacao => ({
  id_estruturacao: String(row.id),
  origem_preview_id: String(row.origem_preview_id ?? `preview-${row.id}`),
  origem_entrada_id: String(row.entrada_bruta_id),
  origem_entrada_titulo: origemEntradaTitulo,
  etapa_fluxo: row.etapa_fluxo,
  nome: String(row.nome ?? ''),
  resumo: String(row.resumo ?? ''),
  tipo_de_ativo: row.tipo_de_ativo,
  definicao: String(row.definicao ?? ''),
  objetivo: String(row.objetivo ?? ''),
  status_editorial: row.status_editorial,
  maturidade_pratica: row.maturidade_pratica,
  governanca: {
    estado: row.governanca_estado
  },
  blocos_internos: [...blocosInternos].sort((a, b) => a.ordem - b.ordem),
  relacoes_estruturacao: relacoesEstruturacao,
  relacoes_ativos: relacoesEstruturacao.map((relacao) => ({
    id: relacao.id,
    tipo_de_relacao: relacao.tipo_de_relacao,
    ativo_origem_id: relacao.direcao === 'saida' ? String(row.id) : relacao.ativo_relacionado_canonico_id,
    ativo_destino_id: relacao.direcao === 'saida' ? relacao.ativo_relacionado_canonico_id : String(row.id),
    observacao: relacao.observacao
  })),
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at)
});

const mapAtivoCanonico = (
  row: BaseRow & Record<string, unknown>,
  blocosCanonicos: AtivoCanonicoBloco[] = [],
  relacoesAtivos: AtivoMetodologicoRelacao[] = [],
  versoesCanonicas: AtivoCanonicoVersao[] = [],
  eventosManutencao: AtivoCanonicoEventoManutencao[] = []
): AtivoCanonico => ({
  id: String(row.id),
  slug: String(row.slug ?? ''),
  nome: String(row.nome ?? ''),
  resumo: String(row.resumo ?? ''),
  definicao: String(row.definicao ?? ''),
  objetivo: String(row.objetivo ?? ''),
  tipo_de_ativo: row.tipo_de_ativo,
  status_editorial: row.status_editorial,
  maturidade_pratica: row.maturidade_pratica,
  governanca_estado: row.governanca_estado,
  versao_atual: String(row.versao_atual ?? '1.0.0'),
  origem_entrada_bruta_id: String(row.origem_entrada_bruta_id ?? ''),
  origem_ativo_em_estruturacao_id: String(row.origem_ativo_em_estruturacao_id ?? ''),
  promovido_em: toIso(row.promovido_em),
  promovido_por: row.promovido_por ? String(row.promovido_por) : undefined,
  blocos_canonicos: [...blocosCanonicos].sort((a, b) => a.ordem - b.ordem),
  relacoes_ativos: relacoesAtivos,
  versoes_canonicas: [...versoesCanonicas].sort((a, b) => +new Date(b.publicada_em) - +new Date(a.publicada_em)),
  eventos_manutencao: [...eventosManutencao].sort((a, b) => +new Date(b.ocorrido_em) - +new Date(a.ocorrido_em)),
  created_at: toIso(row.created_at),
  updated_at: toIso(row.updated_at)
});

const listarBlocosCanonicosPorAtivosIds = async (ativosIds: string[]): Promise<Map<string, AtivoCanonicoBloco[]>> => {
  const agrupado = new Map<string, AtivoCanonicoBloco[]>();
  if (!ativosIds.length) return agrupado;
  const t0 = performance.now();
  const chunks = chunkIds(ativosIds);
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(query(collection(db, BLOCOS_CANONICOS_TABLE), where('ativo_canonico_id', 'in', ids), orderBy('ordem', 'asc')))
    )
  );

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item: any) => {
      const bloco = mapBlocoCanonico({ id: item.id, ...item.data() });
      addMapItem(agrupado, bloco.ativo_canonico_id, bloco);
    });
  });

  if (performance.now() - t0 > 10) {
    console.info('[metodologiasPersistencia] listarBlocosCanonicosPorAtivosIds>10ms', { totalAtivos: ativosIds.length });
  }

  return agrupado;
};

const listarVersoesCanonicasPorAtivosIds = async (ativosIds: string[]): Promise<Map<string, AtivoCanonicoVersao[]>> => {
  const agrupado = new Map<string, AtivoCanonicoVersao[]>();
  if (!ativosIds.length) return agrupado;

  const chunks = chunkIds(ativosIds);
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(query(collection(db, VERSOES_CANONICAS_TABLE), where('ativo_canonico_id', 'in', ids), orderBy('publicada_em', 'desc')))
    )
  );

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item: any) => {
      const versao = mapVersaoCanonica({ id: item.id, ...item.data() });
      addMapItem(agrupado, versao.ativo_canonico_id, versao);
    });
  });

  return agrupado;
};

const listarRelacoesCanonicasPorAtivosIds = async (
  ativosIds: string[]
): Promise<Map<string, AtivoMetodologicoRelacao[]>> => {
  const agrupado = new Map<string, AtivoMetodologicoRelacao[]>();
  if (!ativosIds.length) return agrupado;

  const chunks = chunkIds(ativosIds);
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(query(collection(db, RELACOES_CANONICAS_TABLE), where('ativo_origem_id', 'in', ids), orderBy('created_at', 'asc')))
    )
  );

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item: any) => {
      const relacao = mapRelacaoCanonica({ id: item.id, ...item.data() });
      addMapItem(agrupado, relacao.ativo_origem_id, relacao);
    });
  });

  return agrupado;
};

const listarEventosManutencaoCanonicaPorAtivosIds = async (
  ativosIds: string[]
): Promise<Map<string, AtivoCanonicoEventoManutencao[]>> => {
  const agrupado = new Map<string, AtivoCanonicoEventoManutencao[]>();
  if (!ativosIds.length) return agrupado;

  const chunks = chunkIds(ativosIds);
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(query(collection(db, EVENTOS_MANUTENCAO_CANONICA_TABLE), where('ativo_canonico_id', 'in', ids), orderBy('ocorrido_em', 'desc')))
    )
  );

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item: any) => {
      const evento = mapEventoManutencaoCanonica({ id: item.id, ...item.data() });
      addMapItem(agrupado, evento.ativo_canonico_id, evento);
    });
  });

  return agrupado;
};

const listarBlocosPorAtivosIds = async (ativosIds: string[]): Promise<Map<string, AtivoEmEstruturacaoBlocoInterno[]>> => {
  const agrupado = new Map<string, AtivoEmEstruturacaoBlocoInterno[]>();
  if (!ativosIds.length) return agrupado;

  const chunks = chunkIds(ativosIds);
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(query(collection(db, BLOCOS_TABLE), where('ativo_em_estruturacao_id', 'in', ids), orderBy('ordem', 'asc')))
    )
  );

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item: any) => {
      const bloco = mapBlocoInterno({ id: item.id, ...item.data() });
      addMapItem(agrupado, bloco.ativo_em_estruturacao_id, bloco);
    });
  });

  return agrupado;
};

const listarRelacoesEstruturacaoPorAtivosIds = async (
  ativosIds: string[]
): Promise<Map<string, AtivoEmEstruturacaoRelacao[]>> => {
  const agrupado = new Map<string, AtivoEmEstruturacaoRelacao[]>();
  if (!ativosIds.length) return agrupado;

  const chunks = chunkIds(ativosIds);
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(query(collection(db, RELACOES_ESTRUTURACAO_TABLE), where('ativo_em_estruturacao_id', 'in', ids), orderBy('created_at', 'asc')))
    )
  );

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item: any) => {
      const relacao = mapRelacaoEstruturacao({ id: item.id, ...item.data() });
      addMapItem(agrupado, relacao.ativo_em_estruturacao_id, relacao);
    });
  });

  return agrupado;
};

export const listarBlocosInternosDoAtivoPersistido = async (
  ativoEmEstruturacaoId: string
): Promise<AtivoEmEstruturacaoBlocoInterno[]> => {
  const snapshot = await getDocs(
    query(collection(db, BLOCOS_TABLE), where('ativo_em_estruturacao_id', '==', ativoEmEstruturacaoId), orderBy('ordem', 'asc'))
  );

  return snapshot.docs.map((item: any) => mapBlocoInterno({ id: item.id, ...item.data() })).sort((a, b) => a.ordem - b.ordem);
};

export const listarRelacoesEstruturacaoDoAtivoPersistido = async (
  ativoEmEstruturacaoId: string
): Promise<AtivoEmEstruturacaoRelacao[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, RELACOES_ESTRUTURACAO_TABLE),
      where('ativo_em_estruturacao_id', '==', ativoEmEstruturacaoId),
      orderBy('created_at', 'asc')
    )
  );

  return snapshot.docs.map((item: any) => mapRelacaoEstruturacao({ id: item.id, ...item.data() }));
};

const validarTipoDeRelacaoEstruturacao = (tipo: string) => {
  if (!ATIVO_METODOLOGICO_RELACAO_TIPOS.includes(tipo as AtivoMetodologicoRelacaoTipo)) {
    throw new Error('Tipo de relação inválido para o núcleo de metodologias.');
  }
};

const validarNaoSelfLoopRelacaoEstruturacao = async (params: {
  ativoEmEstruturacaoId: string;
  ativoRelacionadoCanonicoId: string;
}) => {
  const snapshotCanonicoOrigem = await getDocs(
    query(
      collection(db, CANONICOS_TABLE),
      where('origem_ativo_em_estruturacao_id', '==', params.ativoEmEstruturacaoId)
    )
  );

  const canonicoOrigem = snapshotCanonicoOrigem.docs[0];
  if (canonicoOrigem && canonicoOrigem.id === params.ativoRelacionadoCanonicoId) {
    throw new Error('Não é permitido criar self-loop entre ativo em estruturação e seu canônico correspondente.');
  }
};

const validarDuplicacaoRelacaoEstruturacao = async (params: {
  ativoEmEstruturacaoId: string;
  ativoRelacionadoCanonicoId: string;
  tipoDeRelacao: AtivoMetodologicoRelacaoTipo;
  direcao: AtivoEmEstruturacaoRelacaoDirecao;
}) => {
  const existentes = await listarRelacoesEstruturacaoDoAtivoPersistido(params.ativoEmEstruturacaoId);
  const duplicada = existentes.some(
    (relacao) =>
      relacao.ativo_relacionado_canonico_id === params.ativoRelacionadoCanonicoId &&
      relacao.tipo_de_relacao === params.tipoDeRelacao &&
      relacao.direcao === params.direcao
  );

  if (duplicada) {
    throw new Error('Relação já registrada nesta estruturação com o mesmo tipo e direção.');
  }
};

export const criarRelacaoEstruturacaoPersistida = async (
  ativoEmEstruturacaoId: string,
  input: AtivoEmEstruturacaoRelacaoInput
): Promise<AtivoEmEstruturacaoRelacao> => {
  const ativoRelacionadoCanonicoId = String(input.ativo_relacionado_canonico_id ?? '').trim();
  if (!ativoRelacionadoCanonicoId) {
    throw new Error('Ativo relacionado é obrigatório para registrar relação em estruturação.');
  }

  validarTipoDeRelacaoEstruturacao(input.tipo_de_relacao);
  const direcao = input.direcao ?? 'saida';

  await validarNaoSelfLoopRelacaoEstruturacao({
    ativoEmEstruturacaoId,
    ativoRelacionadoCanonicoId
  });

  await validarDuplicacaoRelacaoEstruturacao({
    ativoEmEstruturacaoId,
    ativoRelacionadoCanonicoId,
    tipoDeRelacao: input.tipo_de_relacao,
    direcao
  });

  const now = Timestamp.now();
  const ref = await addDoc(collection(db, RELACOES_ESTRUTURACAO_TABLE), {
    ativo_em_estruturacao_id: ativoEmEstruturacaoId,
    ativo_relacionado_canonico_id: ativoRelacionadoCanonicoId,
    tipo_de_relacao: input.tipo_de_relacao,
    direcao,
    observacao: input.observacao?.trim() ? input.observacao.trim() : null,
    created_at: now,
    updated_at: now
  });

  return {
    id: ref.id,
    ativo_em_estruturacao_id: ativoEmEstruturacaoId,
    ativo_relacionado_canonico_id: ativoRelacionadoCanonicoId,
    tipo_de_relacao: input.tipo_de_relacao,
    direcao,
    observacao: input.observacao?.trim() ? input.observacao.trim() : undefined,
    created_at: now.toDate().toISOString(),
    updated_at: now.toDate().toISOString()
  };
};

export const removerRelacaoEstruturacaoPersistida = async (relacaoId: string): Promise<void> => {
  await deleteDoc(doc(db, RELACOES_ESTRUTURACAO_TABLE, relacaoId));
};

export const listarBlocosCanonicosPorAtivoPersistido = async (ativoCanonicoId: string): Promise<AtivoCanonicoBloco[]> => {
  const snapshot = await getDocs(
    query(collection(db, BLOCOS_CANONICOS_TABLE), where('ativo_canonico_id', '==', ativoCanonicoId), orderBy('ordem', 'asc'))
  );

  return snapshot.docs.map((item: any) => mapBlocoCanonico({ id: item.id, ...item.data() })).sort((a, b) => a.ordem - b.ordem);
};

export const buscarBlocosCanonicosPorAtivoPersistido = async (ativoCanonicoId: string): Promise<AtivoCanonicoBloco[]> => {
  return listarBlocosCanonicosPorAtivoPersistido(ativoCanonicoId);
};

const obterProximaOrdemDeBlocoCanonico = async (ativoCanonicoId: string): Promise<number> => {
  const blocos = await listarBlocosCanonicosPorAtivoPersistido(ativoCanonicoId);
  if (!blocos.length) return 1;
  return Math.max(...blocos.map((bloco) => bloco.ordem)) + 1;
};

const obterProximaOrdemDeBloco = async (ativoEmEstruturacaoId: string): Promise<number> => {
  const blocos = await listarBlocosInternosDoAtivoPersistido(ativoEmEstruturacaoId);
  if (!blocos.length) return 1;
  return Math.max(...blocos.map((bloco) => bloco.ordem)) + 1;
};

export const criarBlocoInternoPersistido = async (
  ativoEmEstruturacaoId: string,
  input: AtivoEmEstruturacaoBlocoInternoInput
): Promise<AtivoEmEstruturacaoBlocoInterno> => {
  const now = Timestamp.now();
  const ordem = input.ordem && input.ordem > 0 ? input.ordem : await obterProximaOrdemDeBloco(ativoEmEstruturacaoId);

  const ref = await addDoc(collection(db, BLOCOS_TABLE), {
    ativo_em_estruturacao_id: ativoEmEstruturacaoId,
    tipo_de_bloco: input.tipo_de_bloco,
    titulo: input.titulo,
    conteudo: input.conteudo,
    ordem,
    status_do_bloco: input.status_do_bloco ?? 'ativo',
    created_at: now,
    updated_at: now
  });

  return {
    id: ref.id,
    ativo_em_estruturacao_id: ativoEmEstruturacaoId,
    tipo_de_bloco: input.tipo_de_bloco,
    titulo: input.titulo,
    conteudo: input.conteudo,
    ordem,
    status_do_bloco: input.status_do_bloco ?? 'ativo',
    created_at: now.toDate().toISOString(),
    updated_at: now.toDate().toISOString()
  };
};

export const atualizarBlocoInternoPersistido = async (
  blocoId: string,
  patch: AtivoEmEstruturacaoBlocoInternoPatch
): Promise<void> => {
  const payload: Record<string, unknown> = {
    updated_at: Timestamp.now()
  };

  if (patch.tipo_de_bloco !== undefined) payload.tipo_de_bloco = patch.tipo_de_bloco;
  if (patch.titulo !== undefined) payload.titulo = patch.titulo;
  if (patch.conteudo !== undefined) payload.conteudo = patch.conteudo;
  if (patch.ordem !== undefined) payload.ordem = patch.ordem;
  if (patch.status_do_bloco !== undefined) payload.status_do_bloco = patch.status_do_bloco;

  await updateDoc(doc(db, BLOCOS_TABLE, blocoId), payload);
};

export const removerBlocoInternoPersistido = async (blocoId: string): Promise<void> => {
  await deleteDoc(doc(db, BLOCOS_TABLE, blocoId));
};

export const reordenarBlocosInternosPersistidos = async (
  ativoEmEstruturacaoId: string,
  blocosIdsNaNovaOrdem: string[]
): Promise<void> => {
  if (!blocosIdsNaNovaOrdem.length) return;

  await Promise.all(
    blocosIdsNaNovaOrdem.map((blocoId, index) =>
      updateDoc(doc(db, BLOCOS_TABLE, blocoId), {
        ativo_em_estruturacao_id: ativoEmEstruturacaoId,
        ordem: index + 1,
        updated_at: Timestamp.now()
      })
    )
  );
};

export const listarEntradasBrutasPersistidas = async (): Promise<EntradaMetodologicaBruta[]> => {
  const q = query(collection(db, ENTRADAS_TABLE), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item: any) => mapEntrada({ id: item.id, ...item.data() }));
};

export const criarEntradaBrutaPersistida = async (input: {
  titulo: string;
  tipo_de_entrada: EntradaMetodologicaTipoDeEntrada;
  conteudo_bruto: string;
  origem: string;
  status_de_estruturacao?: EntradaMetodologicaStatusEstruturacao;
}): Promise<EntradaMetodologicaBruta> => {
  const now = Timestamp.now();
  const ref = await addDoc(collection(db, ENTRADAS_TABLE), {
    titulo: input.titulo,
    tipo_de_entrada: input.tipo_de_entrada,
    conteudo_bruto: input.conteudo_bruto,
    origem: input.origem,
    status_de_estruturacao: input.status_de_estruturacao ?? 'bruto',
    created_at: now,
    updated_at: now
  });

  return {
    id: ref.id,
    titulo: input.titulo,
    tipo_de_entrada: input.tipo_de_entrada,
    conteudo_bruto: input.conteudo_bruto,
    origem: input.origem,
    status_de_estruturacao: input.status_de_estruturacao ?? 'bruto',
    created_at: now.toDate().toISOString(),
    updated_at: now.toDate().toISOString()
  };
};

export const listarAtivosEmEstruturacaoPersistidos = async (): Promise<AtivoEmEstruturacao[]> => {
  const [snapshotAtivos, entradas] = await Promise.all([
    getDocs(query(collection(db, ATIVOS_TABLE), orderBy('updated_at', 'desc'))),
    listarEntradasBrutasPersistidas()
  ]);

  const entradasMap = new Map(entradas.map((entrada) => [entrada.id, entrada.titulo]));

  const ativosRows = snapshotAtivos.docs.map((item: any) => ({ id: item.id, ...item.data() }));
  const [blocosPorAtivo, relacoesPorAtivo] = await Promise.all([
    listarBlocosPorAtivosIds(ativosRows.map((row) => String(row.id))),
    listarRelacoesEstruturacaoPorAtivosIds(ativosRows.map((row) => String(row.id)))
  ]);

  return ativosRows.map((row: any) => {
    const tituloEntrada = entradasMap.get(String(row.entrada_bruta_id)) ?? 'Entrada não localizada';
    return mapAtivo(
      row,
      tituloEntrada,
      blocosPorAtivo.get(String(row.id)) ?? [],
      relacoesPorAtivo.get(String(row.id)) ?? []
    );
  });
};

export const listarAtivosCanonicosPersistidos = async (): Promise<AtivoCanonico[]> => {
  const snapshot = await getDocs(query(collection(db, CANONICOS_TABLE), orderBy('created_at', 'desc')));
  const ativosRows = snapshot.docs.map((item: any) => ({ id: item.id, ...item.data() }));
  const ativosIds = ativosRows.map((row) => String(row.id));
  const [blocosPorAtivo, relacoesPorAtivo, versoesPorAtivo, eventosPorAtivo] = await Promise.all([
    listarBlocosCanonicosPorAtivosIds(ativosIds),
    listarRelacoesCanonicasPorAtivosIds(ativosIds),
    listarVersoesCanonicasPorAtivosIds(ativosIds),
    listarEventosManutencaoCanonicaPorAtivosIds(ativosIds)
  ]);

  return ativosRows.map((row: any) =>
    mapAtivoCanonico(
      row,
      blocosPorAtivo.get(String(row.id)) ?? [],
      relacoesPorAtivo.get(String(row.id)) ?? [],
      versoesPorAtivo.get(String(row.id)) ?? [],
      eventosPorAtivo.get(String(row.id)) ?? []
    )
  );
};

export const salvarRelacoesCanonicasPersistidas = async (params: {
  ativo_canonico_id: string;
  relacoes: AtivoMetodologicoRelacao[];
}): Promise<AtivoMetodologicoRelacao[]> => {
  const existentes = await getDocs(
    query(collection(db, RELACOES_CANONICAS_TABLE), where('ativo_origem_id', '==', params.ativo_canonico_id))
  );
  if (existentes.docs.length) {
    await Promise.all(existentes.docs.map((item: any) => deleteDoc(doc(db, RELACOES_CANONICAS_TABLE, item.id))));
  }

  await Promise.all(
    params.relacoes.map((relacao) =>
      addDoc(collection(db, RELACOES_CANONICAS_TABLE), {
        ativo_canonico_id: params.ativo_canonico_id,
        tipo_de_relacao: relacao.tipo_de_relacao,
        ativo_origem_id: relacao.ativo_origem_id,
        ativo_destino_id: relacao.ativo_destino_id,
        observacao: relacao.observacao ?? null,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      })
    )
  );

  const snapshot = await getDocs(
    query(collection(db, RELACOES_CANONICAS_TABLE), where('ativo_origem_id', '==', params.ativo_canonico_id), orderBy('created_at', 'asc'))
  );

  return snapshot.docs.map((item: any) => mapRelacaoCanonica({ id: item.id, ...item.data() }));
};

export const listarVersoesCanonicasPorAtivoPersistido = async (ativoCanonicoId: string): Promise<AtivoCanonicoVersao[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, VERSOES_CANONICAS_TABLE),
      where('ativo_canonico_id', '==', ativoCanonicoId),
      orderBy('publicada_em', 'desc')
    )
  );

  return snapshot.docs
    .map((item: any) => mapVersaoCanonica({ id: item.id, ...item.data() }))
    .sort((a, b) => +new Date(b.publicada_em) - +new Date(a.publicada_em));
};

export const listarEventosManutencaoCanonicaPorAtivoPersistido = async (
  ativoCanonicoId: string,
  limite = 20
): Promise<AtivoCanonicoEventoManutencao[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, EVENTOS_MANUTENCAO_CANONICA_TABLE),
      where('ativo_canonico_id', '==', ativoCanonicoId),
      orderBy('ocorrido_em', 'desc')
    )
  );

  return snapshot.docs
    .map((item: any) => mapEventoManutencaoCanonica({ id: item.id, ...item.data() }))
    .sort((a, b) => +new Date(b.ocorrido_em) - +new Date(a.ocorrido_em))
    .slice(0, Math.max(1, limite));
};

export const criarVersaoCanonicaPersistida = async (input: {
  ativo_canonico_id: string;
  numero_versao: string;
  titulo?: string;
  resumo_da_versao: string;
  status_da_versao?: AtivoCanonicoVersaoStatus;
  publicada_em?: string;
  snapshot?: AtivoCanonicoVersaoSnapshot;
}): Promise<AtivoCanonicoVersao> => {
  const now = Timestamp.now();
  const publicadaEmIso = input.publicada_em ?? now.toDate().toISOString();
  const snapshotIntegridade = validarIntegridadeSnapshotCanonico(input.snapshot);
  const snapshotValidadoEm = now.toDate().toISOString();

  if (input.status_da_versao === 'vigente') {
    const vigentes = await listarVersoesCanonicasPorAtivoPersistido(input.ativo_canonico_id);
    await Promise.all(
      vigentes
        .filter((versao) => versao.status_da_versao === 'vigente')
        .map((versao) =>
          updateDoc(doc(db, VERSOES_CANONICAS_TABLE, versao.id), {
            status_da_versao: 'superada'
          })
        )
    );
  }

  const ref = await addDoc(collection(db, VERSOES_CANONICAS_TABLE), {
    ativo_canonico_id: input.ativo_canonico_id,
    numero_versao: input.numero_versao,
    titulo: input.titulo ?? null,
    resumo_da_versao: input.resumo_da_versao,
    status_da_versao: input.status_da_versao ?? 'rascunho',
    publicada_em: publicadaEmIso,
    snapshot: input.snapshot ?? null,
    snapshot_status: snapshotIntegridade.status,
    snapshot_validado_em: snapshotValidadoEm,
    created_at: now
  });

  return {
    id: ref.id,
    ativo_canonico_id: input.ativo_canonico_id,
    numero_versao: input.numero_versao,
    titulo: input.titulo,
    resumo_da_versao: input.resumo_da_versao,
    status_da_versao: input.status_da_versao ?? 'rascunho',
    publicada_em: publicadaEmIso,
    created_at: now.toDate().toISOString(),
    snapshot: input.snapshot,
    snapshot_status: snapshotIntegridade.status,
    snapshot_validado_em: snapshotValidadoEm
  };
};

export const atualizarSnapshotVersaoCanonicaPersistida = async (params: {
  versao: AtivoCanonicoVersao;
  snapshot?: AtivoCanonicoVersaoSnapshot;
}): Promise<AtivoCanonicoVersao> => {
  const validadoEmIso = new Date().toISOString();
  const integridade = validarIntegridadeSnapshotCanonico(params.snapshot);

  await updateDoc(doc(db, VERSOES_CANONICAS_TABLE, params.versao.id), {
    snapshot: params.snapshot ?? null,
    snapshot_status: integridade.status,
    snapshot_validado_em: validadoEmIso
  });

  return {
    ...params.versao,
    snapshot: params.snapshot,
    snapshot_status: integridade.status,
    snapshot_validado_em: validadoEmIso
  };
};

export const registrarEventoManutencaoCanonicaPersistido = async (input: {
  ativo_canonico_id: string;
  bloco_canonico_id?: string;
  tipo_de_evento: AtivoCanonicoEventoManutencaoTipo;
  descricao: string;
  ocorrido_em?: string;
}): Promise<AtivoCanonicoEventoManutencao> => {
  const now = Timestamp.now();
  const ocorridoEmIso = input.ocorrido_em ?? now.toDate().toISOString();

  const ref = await addDoc(collection(db, EVENTOS_MANUTENCAO_CANONICA_TABLE), {
    ativo_canonico_id: input.ativo_canonico_id,
    bloco_canonico_id: input.bloco_canonico_id ?? null,
    tipo_de_evento: input.tipo_de_evento,
    descricao: input.descricao,
    ocorrido_em: ocorridoEmIso,
    created_at: now
  });

  return {
    id: ref.id,
    ativo_canonico_id: input.ativo_canonico_id,
    bloco_canonico_id: input.bloco_canonico_id,
    tipo_de_evento: input.tipo_de_evento,
    descricao: input.descricao,
    ocorrido_em: ocorridoEmIso,
    created_at: now.toDate().toISOString()
  };
};

export const criarVersaoCanonicaInicialSeNecessario = async (params: {
  ativoCanonicoId: string;
  numeroVersaoBase?: string;
  titulo?: string;
  resumoDaVersao: string;
  snapshot?: AtivoCanonicoVersaoSnapshot;
}): Promise<VersionamentoCanonicoInicialResultado | null> => {
  const existentes = await listarVersoesCanonicasPorAtivoPersistido(params.ativoCanonicoId);
  if (existentes.length > 0) {
    return null;
  }

  const versaoCriada = await criarVersaoCanonicaPersistida({
    ativo_canonico_id: params.ativoCanonicoId,
    numero_versao: params.numeroVersaoBase ?? '1.0.0',
    titulo: params.titulo,
    resumo_da_versao: params.resumoDaVersao,
    status_da_versao: 'vigente',
    publicada_em: new Date().toISOString(),
    snapshot: params.snapshot
  });

  const eventoRegistrado = await registrarEventoManutencaoCanonicaPersistido({
    ativo_canonico_id: params.ativoCanonicoId,
    tipo_de_evento: 'versao_canonica_criada',
    descricao: `Versão canônica ${versaoCriada.numero_versao} criada (${versaoCriada.status_da_versao}).`
  });

  return {
    ativo_canonico_id: params.ativoCanonicoId,
    versao_criada: versaoCriada,
    evento_registrado: eventoRegistrado
  };
};

export const promoverBlocosInternosParaCanonicoPersistido = async (params: {
  ativoCanonicoId: string;
  ativoEmEstruturacaoId: string;
  reprocessar?: boolean;
}): Promise<AtivoCanonicoBloco[]> => {
  const blocosOrigem = await listarBlocosInternosDoAtivoPersistido(params.ativoEmEstruturacaoId);
  if (!blocosOrigem.length) return [];

  if (params.reprocessar) {
    const existentes = await listarBlocosCanonicosPorAtivoPersistido(params.ativoCanonicoId);
    if (existentes.length) {
      await Promise.all(existentes.map((bloco) => deleteDoc(doc(db, BLOCOS_CANONICOS_TABLE, bloco.id))));
    }
  }

  const blocosExistentes = await listarBlocosCanonicosPorAtivoPersistido(params.ativoCanonicoId);
  const origemExistente = new Set(blocosExistentes.map((bloco) => bloco.bloco_origem_estruturacao_id));

  const now = Timestamp.now();
  const blocosCriados = await Promise.all(
    blocosOrigem
      .filter((blocoOrigem) => !origemExistente.has(blocoOrigem.id))
      .map(async (blocoOrigem) => {
        const ref = await addDoc(collection(db, BLOCOS_CANONICOS_TABLE), {
          ativo_canonico_id: params.ativoCanonicoId,
          bloco_origem_estruturacao_id: blocoOrigem.id,
          tipo_de_bloco: blocoOrigem.tipo_de_bloco,
          titulo: blocoOrigem.titulo,
          conteudo: blocoOrigem.conteudo,
          ordem: blocoOrigem.ordem,
          status_do_bloco: blocoOrigem.status_do_bloco,
          created_at: now,
          updated_at: now
        });

        return {
          id: ref.id,
          ativo_canonico_id: params.ativoCanonicoId,
          bloco_origem_estruturacao_id: blocoOrigem.id,
          tipo_de_bloco: blocoOrigem.tipo_de_bloco,
          titulo: blocoOrigem.titulo,
          conteudo: blocoOrigem.conteudo,
          ordem: blocoOrigem.ordem,
          status_do_bloco: blocoOrigem.status_do_bloco,
          created_at: now.toDate().toISOString(),
          updated_at: now.toDate().toISOString()
        } as AtivoCanonicoBloco;
      })
  );

  return [...blocosExistentes, ...blocosCriados].sort((a, b) => a.ordem - b.ordem);
};

const garantirSlugCanonicoUnico = async (slugBase: string): Promise<string> => {
  const slugInicial = slugBase.trim() || `ativo-canonico-${Date.now()}`;
  const snapshot = await getDocs(query(collection(db, CANONICOS_TABLE), where('slug', '==', slugInicial)));
  if (!snapshot.docs.length) return slugInicial;
  return `${slugInicial}-${Date.now().toString().slice(-6)}`;
};

export const criarAtivoCanonicoPromovidoPersistido = async (
  preview: AtivoCanonicoPromocaoPreview,
  promovidoPor?: string
): Promise<AtivoCanonico> => {
  const now = Timestamp.now();
  const slug = await garantirSlugCanonicoUnico(preview.slug_sugerido);

  const ref = await addDoc(collection(db, CANONICOS_TABLE), {
    slug,
    nome: preview.nome,
    resumo: preview.resumo,
    definicao: preview.definicao,
    objetivo: preview.objetivo,
    tipo_de_ativo: preview.tipo_de_ativo,
    status_editorial: preview.status_editorial,
    maturidade_pratica: preview.maturidade_pratica,
    governanca_estado: preview.governanca_estado,
    versao_atual: preview.versao_atual,
    origem_entrada_bruta_id: preview.origem_entrada_bruta_id,
    origem_ativo_em_estruturacao_id: preview.origem_ativo_em_estruturacao_id,
    promovido_em: now,
    promovido_por: promovidoPor ?? null,
    created_at: now,
    updated_at: now
  });

  await Promise.all([
    updateDoc(doc(db, ENTRADAS_TABLE, preview.origem_entrada_bruta_id), {
      status_de_estruturacao: 'convertido_em_ativo',
      updated_at: now
    }),
    updateDoc(doc(db, ATIVOS_TABLE, preview.origem_ativo_em_estruturacao_id), {
      etapa_fluxo: 'pronto_para_revisao_manual',
      status_editorial: 'em_revisao',
      updated_at: now
    })
  ]);

  return {
    id: ref.id,
    slug,
    nome: preview.nome,
    resumo: preview.resumo,
    definicao: preview.definicao,
    objetivo: preview.objetivo,
    tipo_de_ativo: preview.tipo_de_ativo,
    status_editorial: preview.status_editorial,
    maturidade_pratica: preview.maturidade_pratica,
    governanca_estado: preview.governanca_estado,
    versao_atual: preview.versao_atual,
    origem_entrada_bruta_id: preview.origem_entrada_bruta_id,
    origem_ativo_em_estruturacao_id: preview.origem_ativo_em_estruturacao_id,
    promovido_em: now.toDate().toISOString(),
    promovido_por: promovidoPor,
    created_at: now.toDate().toISOString(),
    updated_at: now.toDate().toISOString()
  };
};

export const buscarAtivoEmEstruturacaoPorEntradaId = async (
  entradaBrutaId: string
): Promise<AtivoEmEstruturacao | null> => {
  const [snapshot, entradas] = await Promise.all([
    getDocs(query(collection(db, ATIVOS_TABLE), where('entrada_bruta_id', '==', entradaBrutaId))),
    listarEntradasBrutasPersistidas()
  ]);

  if (!snapshot.docs.length) return null;

  const row = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  const entrada = entradas.find((item) => item.id === entradaBrutaId);
  const [blocosInternos, relacoesEstruturacao] = await Promise.all([
    listarBlocosInternosDoAtivoPersistido(String(row.id)),
    listarRelacoesEstruturacaoDoAtivoPersistido(String(row.id))
  ]);
  return mapAtivo(row, entrada?.titulo ?? 'Entrada não localizada', blocosInternos, relacoesEstruturacao);
};

export const salvarAtivoEmEstruturacaoFromPreview = async (
  preview: ConversaoAssistidaAtivoPreview,
  etapaFluxo: AtivoEmEstruturacaoEtapaFluxo = 'edicao_guiada'
): Promise<AtivoEmEstruturacao> => {
  const existente = await buscarAtivoEmEstruturacaoPorEntradaId(preview.origem_entrada_id);
  const now = Timestamp.now();

  const payload = {
    entrada_bruta_id: preview.origem_entrada_id,
    origem_preview_id: preview.id_preview,
    nome: preview.nome,
    resumo: preview.resumo,
    tipo_de_ativo: preview.tipo_de_ativo,
    definicao: preview.definicao,
    objetivo: preview.objetivo,
    status_editorial: preview.status_editorial,
    maturidade_pratica: preview.maturidade_pratica,
    governanca_estado: preview.governanca.estado,
    etapa_fluxo: etapaFluxo,
    updated_at: now
  };

  if (existente) {
    await updateDoc(doc(db, ATIVOS_TABLE, existente.id_estruturacao), payload);
  } else {
    await addDoc(collection(db, ATIVOS_TABLE), {
      ...payload,
      created_at: now
    });
  }

  await updateDoc(doc(db, ENTRADAS_TABLE, preview.origem_entrada_id), {
    status_de_estruturacao: 'estruturado_parcialmente',
    updated_at: now
  });

  const atualizado = await buscarAtivoEmEstruturacaoPorEntradaId(preview.origem_entrada_id);
  if (!atualizado) {
    throw new Error('Falha ao carregar ativo em estruturação após persistência.');
  }

  return atualizado;
};

export const atualizarAtivoEmEstruturacaoPersistido = async (
  ativoId: string,
  patch: AtivoEmEstruturacaoPatch
): Promise<void> => {
  const payload: Record<string, unknown> = {
    updated_at: Timestamp.now()
  };

  if (patch.nome !== undefined) payload.nome = patch.nome;
  if (patch.resumo !== undefined) payload.resumo = patch.resumo;
  if (patch.tipo_de_ativo !== undefined) payload.tipo_de_ativo = patch.tipo_de_ativo;
  if (patch.definicao !== undefined) payload.definicao = patch.definicao;
  if (patch.objetivo !== undefined) payload.objetivo = patch.objetivo;
  if (patch.status_editorial !== undefined) payload.status_editorial = patch.status_editorial;
  if (patch.maturidade_pratica !== undefined) payload.maturidade_pratica = patch.maturidade_pratica;
  if (patch.governanca?.estado !== undefined) payload.governanca_estado = patch.governanca.estado;

  await updateDoc(doc(db, ATIVOS_TABLE, ativoId), payload);
};

export const atualizarAtivoCanonicoPersistido = async (
  ativoCanonicoId: string,
  patch: AtivoCanonicoPatch
): Promise<void> => {
  const payload: Record<string, unknown> = {
    updated_at: Timestamp.now()
  };

  if (patch.nome !== undefined) payload.nome = patch.nome;
  if (patch.resumo !== undefined) payload.resumo = patch.resumo;
  if (patch.definicao !== undefined) payload.definicao = patch.definicao;
  if (patch.objetivo !== undefined) payload.objetivo = patch.objetivo;
  if (patch.tipo_de_ativo !== undefined) payload.tipo_de_ativo = patch.tipo_de_ativo;
  if (patch.status_editorial !== undefined) payload.status_editorial = patch.status_editorial;
  if (patch.maturidade_pratica !== undefined) payload.maturidade_pratica = patch.maturidade_pratica;
  if (patch.governanca_estado !== undefined) payload.governanca_estado = patch.governanca_estado;

  await updateDoc(doc(db, CANONICOS_TABLE, ativoCanonicoId), payload);
};

export const criarBlocoCanonicoPersistido = async (
  ativoCanonicoId: string,
  input: AtivoCanonicoBlocoInput
): Promise<AtivoCanonicoBloco> => {
  if (!input.bloco_origem_estruturacao_id) {
    throw new Error(
      'Criação de bloco canônico adicional exige bloco_origem_estruturacao_id válido para preservar rastreabilidade nesta etapa.'
    );
  }

  const now = Timestamp.now();
  const ordem = input.ordem && input.ordem > 0 ? input.ordem : await obterProximaOrdemDeBlocoCanonico(ativoCanonicoId);

  const ref = await addDoc(collection(db, BLOCOS_CANONICOS_TABLE), {
    ativo_canonico_id: ativoCanonicoId,
    bloco_origem_estruturacao_id: input.bloco_origem_estruturacao_id,
    tipo_de_bloco: input.tipo_de_bloco,
    titulo: input.titulo,
    conteudo: input.conteudo,
    ordem,
    status_do_bloco: input.status_do_bloco ?? 'ativo',
    created_at: now,
    updated_at: now
  });

  return {
    id: ref.id,
    ativo_canonico_id: ativoCanonicoId,
    bloco_origem_estruturacao_id: input.bloco_origem_estruturacao_id,
    tipo_de_bloco: input.tipo_de_bloco,
    titulo: input.titulo,
    conteudo: input.conteudo,
    ordem,
    status_do_bloco: input.status_do_bloco ?? 'ativo',
    created_at: now.toDate().toISOString(),
    updated_at: now.toDate().toISOString()
  };
};

export const atualizarBlocoCanonicoPersistido = async (
  blocoCanonicoId: string,
  patch: AtivoCanonicoBlocoPatch
): Promise<void> => {
  const payload: Record<string, unknown> = {
    updated_at: Timestamp.now()
  };

  if (patch.tipo_de_bloco !== undefined) payload.tipo_de_bloco = patch.tipo_de_bloco;
  if (patch.titulo !== undefined) payload.titulo = patch.titulo;
  if (patch.conteudo !== undefined) payload.conteudo = patch.conteudo;
  if (patch.ordem !== undefined) payload.ordem = patch.ordem;
  if (patch.status_do_bloco !== undefined) payload.status_do_bloco = patch.status_do_bloco;

  await updateDoc(doc(db, BLOCOS_CANONICOS_TABLE, blocoCanonicoId), payload);
};

export const removerBlocoCanonicoPersistido = async (blocoCanonicoId: string): Promise<void> => {
  await deleteDoc(doc(db, BLOCOS_CANONICOS_TABLE, blocoCanonicoId));
};

export const reordenarBlocosCanonicosPersistidos = async (
  ativoCanonicoId: string,
  blocosIdsNaNovaOrdem: string[]
): Promise<void> => {
  if (!blocosIdsNaNovaOrdem.length) return;

  await Promise.all(
    blocosIdsNaNovaOrdem.map((blocoId, index) =>
      updateDoc(doc(db, BLOCOS_CANONICOS_TABLE, blocoId), {
        ativo_canonico_id: ativoCanonicoId,
        ordem: index + 1,
        updated_at: Timestamp.now()
      })
    )
  );
};
