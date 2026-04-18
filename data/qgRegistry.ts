import { TabId } from '../types';

export type QgEntryType = 'internal-tab' | 'external-url';
export type QgStatus = 'ativo' | 'beta' | 'planejado';

export interface QgRegistryEntry {
  id: string;
  buId: string;
  qgName: string;
  status: QgStatus;
  entryType: QgEntryType;
  strategy: 'operacao-interna' | 'produto-vendavel' | 'hibrido';
  tab?: TabId;
  url?: string;
  sourcePath?: string;
  notes?: string;
}

export const qgRegistry: QgRegistryEntry[] = [
  {
    id: 'qg-startyb',
    buId: 'startyb',
    qgName: 'QG StartyB',
    status: 'beta',
    entryType: 'internal-tab',
    strategy: 'hibrido',
    tab: 'startyb-home',
    sourcePath: 'docs/QGs GrupoB/StartyB_QG',
    notes: 'Piloto de integração do QG dentro do ecossistema SagB.'
  },
  {
    id: 'qg-3forb',
    buId: '3forb',
    qgName: 'QG 3forB',
    status: 'ativo',
    entryType: 'internal-tab',
    strategy: 'produto-vendavel',
    tab: '3forb-home',
    sourcePath: 'docs/QGs GrupoB/3forb_QG',
    notes: 'QG avançado com foco em módulos que podem virar produto comercial.'
  },
  {
    id: 'qg-institutob',
    buId: 'institutob',
    qgName: 'QG InstitutoB',
    status: 'planejado',
    entryType: 'internal-tab',
    strategy: 'hibrido',
    tab: 'unit-room',
    sourcePath: 'qgs/institutob',
    notes: 'Estrutura inicial para evolução do QG do InstitutoB dentro do mesmo repositório.'
  }
];

export const getQgByBuId = (buId?: string | null): QgRegistryEntry | null => {
  if (!buId) return null;
  return qgRegistry.find((entry) => entry.buId === buId) || null;
};
