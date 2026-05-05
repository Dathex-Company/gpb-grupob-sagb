import type {
  AtivoCanonico,
  AtivoCanonicoVersao,
  BackfillSnapshotFalha,
  BackfillSnapshotResultado,
  IntegridadeSnapshotCanonico,
  SnapshotCanonicoStatusVersao
} from '../types';
import { criarSnapshotCanonicoFromAtivo, listarStatusSnapshotsPorVersao, validarIntegridadeSnapshotCanonico } from './metodologiasCanonicoSnapshot';
import { atualizarSnapshotVersaoCanonicaPersistida, listarVersoesCanonicasPorAtivoPersistido } from './metodologiasPersistencia';

const temBaseMinimaConfiavelParaSnapshot = (ativo: AtivoCanonico): { ok: boolean; motivo?: string } => {
  const snapshotCandidato = criarSnapshotCanonicoFromAtivo(ativo);
  const integridade = validarIntegridadeSnapshotCanonico(snapshotCandidato);
  if (integridade.status === 'integro') return { ok: true };

  return {
    ok: false,
    motivo: `Estado canônico atual sem base mínima confiável para snapshot (${integridade.pendencias.join(' | ')})`
  };
};

export const listarStatusSnapshotsPorAtivoCanonico = (ativo: AtivoCanonico): SnapshotCanonicoStatusVersao[] => {
  return listarStatusSnapshotsPorVersao(ativo.versoes_canonicas ?? []);
};

export const revalidarSnapshotVersaoCanonica = async (versao: AtivoCanonicoVersao): Promise<{
  versao_atualizada: AtivoCanonicoVersao;
  integridade: IntegridadeSnapshotCanonico;
}> => {
  const versaoAtualizada = await atualizarSnapshotVersaoCanonicaPersistida({
    versao,
    snapshot: versao.snapshot
  });

  return {
    versao_atualizada: versaoAtualizada,
    integridade: validarIntegridadeSnapshotCanonico(versaoAtualizada.snapshot)
  };
};

export const regenerarSnapshotVersaoCanonicaControlado = async (params: {
  ativo: AtivoCanonico;
  versao: AtivoCanonicoVersao;
}): Promise<{
  versao_atualizada: AtivoCanonicoVersao;
  integridade: IntegridadeSnapshotCanonico;
}> => {
  const confianca = temBaseMinimaConfiavelParaSnapshot(params.ativo);
  if (!confianca.ok) {
    throw new Error(confianca.motivo ?? 'Não foi possível regenerar snapshot com confiança mínima.');
  }

  const snapshot = criarSnapshotCanonicoFromAtivo(params.ativo);
  const versaoAtualizada = await atualizarSnapshotVersaoCanonicaPersistida({
    versao: params.versao,
    snapshot
  });

  return {
    versao_atualizada: versaoAtualizada,
    integridade: validarIntegridadeSnapshotCanonico(snapshot)
  };
};

export const executarBackfillSnapshotsCanonicosDoAtivo = async (ativo: AtivoCanonico): Promise<BackfillSnapshotResultado> => {
  const versoes = await listarVersoesCanonicasPorAtivoPersistido(ativo.id);
  const semSnapshot = versoes.filter((versao) => !versao.snapshot);

  if (!semSnapshot.length) {
    return {
      ativo_canonico_id: ativo.id,
      total_sem_snapshot: 0,
      total_preenchidas: 0,
      total_falhas: 0,
      falhas: [],
      versoes_atualizadas: []
    };
  }

  const confianca = temBaseMinimaConfiavelParaSnapshot(ativo);
  if (!confianca.ok) {
    const falhas: BackfillSnapshotFalha[] = semSnapshot.map((versao) => ({
      versao_id: versao.id,
      numero_versao: versao.numero_versao,
      motivo: confianca.motivo ?? 'Sem base confiável para reconstrução de snapshot.'
    }));

    return {
      ativo_canonico_id: ativo.id,
      total_sem_snapshot: semSnapshot.length,
      total_preenchidas: 0,
      total_falhas: falhas.length,
      falhas,
      versoes_atualizadas: []
    };
  }

  const resultados = await Promise.allSettled(
    semSnapshot.map(async (versao) => {
      const snapshot = criarSnapshotCanonicoFromAtivo(ativo);
      const atualizada = await atualizarSnapshotVersaoCanonicaPersistida({ versao, snapshot });
      return { versao, atualizada };
    })
  );

  const versoesAtualizadas: AtivoCanonicoVersao[] = resultados
    .filter((resultado): resultado is PromiseFulfilledResult<{ versao: AtivoCanonicoVersao; atualizada: AtivoCanonicoVersao }> =>
      resultado.status === 'fulfilled'
    )
    .map((resultado) => resultado.value.atualizada);

  const falhas: BackfillSnapshotFalha[] = resultados
    .filter((resultado): resultado is PromiseRejectedResult => resultado.status === 'rejected')
    .map((resultado, index) => ({
      versao_id: semSnapshot[index]?.id ?? 'desconhecida',
      numero_versao: semSnapshot[index]?.numero_versao ?? 'desconhecida',
      motivo: resultado.reason instanceof Error ? resultado.reason.message : 'Falha não identificada no backfill de snapshot.'
    }));

  return {
    ativo_canonico_id: ativo.id,
    total_sem_snapshot: semSnapshot.length,
    total_preenchidas: versoesAtualizadas.length,
    total_falhas: falhas.length,
    falhas,
    versoes_atualizadas: versoesAtualizadas
  };
};
