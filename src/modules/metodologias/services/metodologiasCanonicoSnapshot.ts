import type {
  AtivoCanonico,
  AtivoCanonicoBloco,
  AtivoCanonicoVersao,
  AtivoCanonicoVersaoSnapshot,
  AtivoCanonicoVersaoSnapshotBloco,
  IntegridadeSnapshotCanonico,
  SnapshotCanonicoStatus,
  SnapshotCanonicoStatusVersao
} from '../types';

export const SNAPSHOT_CANONICO_FORMATO_ATUAL = '2';
export const SNAPSHOT_CANONICO_FORMATOS_COMPATIVEIS = ['1', SNAPSHOT_CANONICO_FORMATO_ATUAL];
const TOTAL_CAMPOS_BASE_SNAPSHOT = 8;

const CAMPOS_BASE_SNAPSHOT: Array<keyof AtivoCanonicoVersaoSnapshot> = [
  'nome',
  'resumo',
  'definicao',
  'objetivo',
  'tipo_de_ativo',
  'status_editorial',
  'maturidade_pratica',
  'governanca_estado'
];

const isTextoPreenchido = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0;

const calcularStatusSnapshot = (params: {
  possui_snapshot: boolean;
  estrutura_integra: boolean;
  formato_compativel_comparador: boolean;
  possui_campos_base_esperados: boolean;
  possui_blocos: boolean;
}): SnapshotCanonicoStatus => {
  if (!params.possui_snapshot) return 'ausente';
  if (!params.estrutura_integra || !params.formato_compativel_comparador) return 'incompativel';
  if (!params.possui_campos_base_esperados || !params.possui_blocos) return 'incompleto';
  return 'integro';
};

export const criarSnapshotCanonicoFromAtivo = (ativo: Pick<
  AtivoCanonico,
  | 'nome'
  | 'resumo'
  | 'definicao'
  | 'objetivo'
  | 'tipo_de_ativo'
  | 'status_editorial'
  | 'maturidade_pratica'
  | 'governanca_estado'
> & {
  blocos_canonicos?: AtivoCanonicoBloco[];
}): AtivoCanonicoVersaoSnapshot => {
  const geradoEm = new Date().toISOString();
  const blocos: AtivoCanonicoVersaoSnapshotBloco[] = [...(ativo.blocos_canonicos ?? [])]
    .sort((a, b) => a.ordem - b.ordem)
    .map((bloco) => ({
      bloco_origem_estruturacao_id: bloco.bloco_origem_estruturacao_id,
      tipo_de_bloco: bloco.tipo_de_bloco,
      titulo: bloco.titulo,
      conteudo: bloco.conteudo,
      ordem: bloco.ordem,
      status_do_bloco: bloco.status_do_bloco
    }));

  return {
    nome: ativo.nome,
    resumo: ativo.resumo,
    definicao: ativo.definicao,
    objetivo: ativo.objetivo,
    tipo_de_ativo: ativo.tipo_de_ativo,
    status_editorial: ativo.status_editorial,
    maturidade_pratica: ativo.maturidade_pratica,
    governanca_estado: ativo.governanca_estado,
    blocos,
    meta: {
      formato_versao: SNAPSHOT_CANONICO_FORMATO_ATUAL,
      gerado_em: geradoEm,
      total_blocos: blocos.length,
      total_campos_base: TOTAL_CAMPOS_BASE_SNAPSHOT
    }
  };
};

export const validarIntegridadeSnapshotCanonico = (
  snapshot?: AtivoCanonicoVersaoSnapshot | null
): IntegridadeSnapshotCanonico => {
  if (!snapshot) {
    return {
      status: 'ausente',
      possui_snapshot: false,
      possui_campos_base_esperados: false,
      possui_blocos: false,
      estrutura_integra: false,
      formato_compativel_comparador: false,
      pendencias: ['Snapshot ausente para a versão.']
    };
  }

  const pendencias: string[] = [];
  const estruturaBasicaIntegra = typeof snapshot === 'object' && Array.isArray(snapshot.blocos);

  if (!estruturaBasicaIntegra) {
    pendencias.push('Estrutura base inválida: blocos ausente ou não é array.');
  }

  const camposBaseIntegrais = CAMPOS_BASE_SNAPSHOT.every((campo) => isTextoPreenchido(snapshot[campo]));
  if (!camposBaseIntegrais) {
    pendencias.push('Campos-base esperados estão ausentes ou vazios.');
  }

  const possuiBlocos = Array.isArray(snapshot.blocos) && snapshot.blocos.length > 0;
  if (!possuiBlocos) {
    pendencias.push('Snapshot sem blocos canônicos.');
  }

  const blocosIntegrais =
    Array.isArray(snapshot.blocos) &&
    snapshot.blocos.every(
      (bloco) =>
        isTextoPreenchido(bloco.bloco_origem_estruturacao_id) &&
        isTextoPreenchido(bloco.titulo) &&
        isTextoPreenchido(bloco.conteudo) &&
        Number.isFinite(bloco.ordem)
    );
  if (!blocosIntegrais) {
    pendencias.push('Um ou mais blocos do snapshot estão estruturalmente inválidos.');
  }

  const formatoSnapshot = snapshot.meta?.formato_versao ?? '1';
  const formatoCompativel = SNAPSHOT_CANONICO_FORMATOS_COMPATIVEIS.includes(formatoSnapshot);
  if (!formatoCompativel) {
    pendencias.push(`Formato de snapshot incompatível com comparador atual (${formatoSnapshot}).`);
  }

  const estruturaIntegra = estruturaBasicaIntegra && blocosIntegrais;
  const status = calcularStatusSnapshot({
    possui_snapshot: true,
    estrutura_integra: estruturaIntegra,
    formato_compativel_comparador: formatoCompativel,
    possui_campos_base_esperados: camposBaseIntegrais,
    possui_blocos: possuiBlocos
  });

  return {
    status,
    possui_snapshot: true,
    possui_campos_base_esperados: camposBaseIntegrais,
    possui_blocos: possuiBlocos,
    estrutura_integra: estruturaIntegra,
    formato_compativel_comparador: formatoCompativel,
    pendencias
  };
};

export const listarStatusSnapshotsPorVersao = (versoes: AtivoCanonicoVersao[]): SnapshotCanonicoStatusVersao[] => {
  return versoes.map((versao) => {
    const integridade = validarIntegridadeSnapshotCanonico(versao.snapshot);
    return {
      versao_id: versao.id,
      numero_versao: versao.numero_versao,
      status: integridade.status,
      integridade
    };
  });
};
