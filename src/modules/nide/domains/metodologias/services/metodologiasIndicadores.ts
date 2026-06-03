import { AtivoCanonico, AtivoEmEstruturacao, EntradaMetodologicaBruta } from '../types';

export interface IndicadoresNucleo {
  visaoGeral: {
    totalEntradasBrutas: number;
    totalEmEstruturacao: number;
    totalCanonicos: number;
    totalPromovidos: number;
    totalComBlocosInternos: number;
    totalCanonicosComBlocos: number;
    totalComSnapshotIntegro: number;
    totalComVersoes: number;
    totalComRelacoes: number;
    totalComManutencaoRecente: number;
  };
  cobertura: {
    percentualCorpoEstruturado: number;
    percentualSnapshotIntegro: number;
    percentualRelacoes: number;
    percentualGovernanca: number;
    percentualDefinicaoObjetivo: number;
  };
  atencao: {
    semBlocos: number;
    semSnapshot: number;
    semRelacoes: number;
    semManutencaoRecente: number;
    estruturacaoTravada: number;
  };
  saude: {
    status: 'Saudável' | 'Atenção' | 'Crítico';
    pontuacao: number; // 0 a 100
  };
}

const isManutencaoRecente = (dateStr: string) => {
  const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30; // 30 days
};

export const calcularIndicadoresNucleo = (
  entradas: EntradaMetodologicaBruta[],
  estruturacoes: AtivoEmEstruturacao[],
  canonicos: AtivoCanonico[]
): IndicadoresNucleo => {
  const totalEntradasBrutas = entradas.length;
  const totalEmEstruturacao = estruturacoes.length;
  const totalCanonicos = canonicos.length;

  let totalPromovidos = 0;
  let totalComBlocosInternos = 0;
  let totalCanonicosComBlocos = 0;
  let totalComSnapshotIntegro = 0;
  let totalComVersoes = 0;
  let totalComRelacoes = 0;
  let totalComManutencaoRecente = 0;

  // Cobertura helpers
  let canonicosComCorpoEstruturado = 0;
  let canonicosComGovernanca = 0;
  let canonicosComDefinicaoObjetivo = 0;

  estruturacoes.forEach((estrut) => {
    if (estrut.blocos_internos && estrut.blocos_internos.length > 0) {
      totalComBlocosInternos++;
    }
  });

  canonicos.forEach((canonico) => {
    if (canonico.promovido_por) totalPromovidos++;

    const temBlocos = canonico.blocos_canonicos && canonico.blocos_canonicos.length > 0;
    if (temBlocos) {
      totalCanonicosComBlocos++;
      canonicosComCorpoEstruturado++;
    }

    const temVersoes = canonico.versoes_canonicas && canonico.versoes_canonicas.length > 0;
    if (temVersoes) totalComVersoes++;

    // Consider integer snapshot if it has valid versions (assuming valid versions have snapshots)
    // or if `snapshot_valido` could be extracted. For now, simple presence of versions.
    let snapshotIntegro = false;
    if (canonico.versoes_canonicas && canonico.versoes_canonicas.some(v => v.snapshot)) {
      snapshotIntegro = true;
      totalComSnapshotIntegro++;
    }

    const temRelacoes = canonico.relacoes_ativos && canonico.relacoes_ativos.length > 0;
    if (temRelacoes) totalComRelacoes++;

    if (canonico.updated_at && isManutencaoRecente(canonico.updated_at)) {
      totalComManutencaoRecente++;
    }

    if (canonico.governanca_estado) canonicosComGovernanca++;
    if (canonico.definicao?.trim() && canonico.objetivo?.trim()) canonicosComDefinicaoObjetivo++;
  });

  const percentualCorpoEstruturado = totalCanonicos ? (canonicosComCorpoEstruturado / totalCanonicos) * 100 : 0;
  const percentualSnapshotIntegro = totalCanonicos ? (totalComSnapshotIntegro / totalCanonicos) * 100 : 0;
  const percentualRelacoes = totalCanonicos ? (totalComRelacoes / totalCanonicos) * 100 : 0;
  const percentualGovernanca = totalCanonicos ? (canonicosComGovernanca / totalCanonicos) * 100 : 0;
  const percentualDefinicaoObjetivo = totalCanonicos ? (canonicosComDefinicaoObjetivo / totalCanonicos) * 100 : 0;

  const estruturacaoTravada = estruturacoes.filter(e => e.updated_at && !isManutencaoRecente(e.updated_at)).length;

  const atencao = {
    semBlocos: totalCanonicos - totalCanonicosComBlocos,
    semSnapshot: totalCanonicos - totalComSnapshotIntegro,
    semRelacoes: totalCanonicos - totalComRelacoes,
    semManutencaoRecente: totalCanonicos - totalComManutencaoRecente,
    estruturacaoTravada
  };

  // Calculo simples de saúde
  // Pontuação baseada nos percentuais de cobertura
  const pontuacao = Math.round(
    (percentualCorpoEstruturado + percentualSnapshotIntegro + percentualRelacoes + percentualGovernanca + percentualDefinicaoObjetivo) / 5
  );

  let status: 'Saudável' | 'Atenção' | 'Crítico' = 'Saudável';
  if (pontuacao < 40) status = 'Crítico';
  else if (pontuacao < 70) status = 'Atenção';

  // Se não houver canônicos mas houver em estruturação
  if (totalCanonicos === 0 && totalEmEstruturacao > 0) {
     status = 'Atenção';
  }

  return {
    visaoGeral: {
      totalEntradasBrutas,
      totalEmEstruturacao,
      totalCanonicos,
      totalPromovidos,
      totalComBlocosInternos,
      totalCanonicosComBlocos,
      totalComSnapshotIntegro,
      totalComVersoes,
      totalComRelacoes,
      totalComManutencaoRecente
    },
    cobertura: {
      percentualCorpoEstruturado,
      percentualSnapshotIntegro,
      percentualRelacoes,
      percentualGovernanca,
      percentualDefinicaoObjetivo
    },
    atencao,
    saude: {
      status,
      pontuacao
    }
  };
};
