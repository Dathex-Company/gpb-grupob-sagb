import { useMemo } from 'react';
import type { MetodologiasOverview } from '../types';
import { getEntradasMetodologicasBrutas, getMetodologias, getTaxonomiaOficialAtivos } from '../services';

export const useMetodologiasOverview = (): MetodologiasOverview => {
  const metodologias = useMemo(() => getMetodologias(), []);
  const entradas_brutas = useMemo(() => getEntradasMetodologicasBrutas(), []);
  const taxonomia_oficial = useMemo(() => getTaxonomiaOficialAtivos(), []);

  return {
    titulo: 'Núcleo de Metodologias',
    subtitulo: 'Centro vivo de construção e consolidação metodológica',
    descricao:
      'Ambiente estruturante para organizar, evoluir e governar ativos metodológicos do ecossistema SagB com rastreabilidade, versionamento e clareza semântica.',
    taxonomia_oficial,
    metodologias,
    entradas_brutas,
    metodologia_destaque: metodologias[0] ?? null
  };
};
