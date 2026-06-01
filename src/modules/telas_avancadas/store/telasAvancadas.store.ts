import { create } from 'zustand';
import {
  BlocoTela,
  BlueprintTela,
  CentralTab,
  ExportacaoTela,
  ProjetoTela,
  ReferenciaTela,
  TelaAvancada,
  TelaAvancadaFormData,
} from '../types/telasAvancadas.types';
import * as telasService from '../services/telasAvancadas.service';
import {
  addBloco,
  addReferencia,
  createProjeto,
  gerarExportacao,
  getStudioSnapshot,
  publicarExportacaoNaBiblioteca,
  saveBlueprint,
} from '../services/studio.service';

type CentralState = {
  telas: TelaAvancada[];
  projetos: ProjetoTela[];
  blueprints: BlueprintTela[];
  referencias: ReferenciaTela[];
  blocos: BlocoTela[];
  exportacoes: ExportacaoTela[];
  activeTab: CentralTab['id'];
  selectedProjectId: string | null;
  search: string;
  filterStatus: string;
  filterCategory: string;
  isLoading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
  setActiveTab: (tab: CentralTab['id']) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSearch: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setFilterCategory: (value: string) => void;
  addTela: (formData: TelaAvancadaFormData) => Promise<TelaAvancada>;
  removeTela: (id: string) => Promise<void>;
  updateTela: (id: string, updates: Partial<TelaAvancada>) => Promise<TelaAvancada>;
  createProjeto: (input: Omit<ProjetoTela, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'versao'>) => Promise<ProjetoTela>;
  saveBlueprint: (blueprint: BlueprintTela) => Promise<void>;
  addBloco: (projetoId: string, tipo: BlocoTela['tipo']) => Promise<BlocoTela>;
  addReferencia: (ref: Omit<ReferenciaTela, 'id' | 'createdAt'>) => Promise<ReferenciaTela>;
  gerarExportacao: (projetoId: string) => Promise<ExportacaoTela>;
  publicarExportacao: (exportacaoId: string) => Promise<TelaAvancada>;
  clearError: () => void;
};

const refreshCentral = (set: (p: Partial<CentralState>) => void) => {
  const snapshot = getStudioSnapshot();
  set({
    projetos: snapshot.projetos,
    blueprints: snapshot.blueprints,
    referencias: snapshot.referencias,
    blocos: snapshot.blocos,
    exportacoes: snapshot.exportacoes,
  });
};

export const useTelasAvancadasStore = create<CentralState>((set, get) => ({
  telas: [],
  projetos: [],
  blueprints: [],
  referencias: [],
  blocos: [],
  exportacoes: [],
  activeTab: 'biblioteca',
  selectedProjectId: null,
  search: '',
  filterStatus: 'todos',
  filterCategory: 'todos',
  isLoading: false,
  error: null,

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ telas: telasService.getAllTelas() });
      refreshCentral(set);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Erro ao carregar central' });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSearch: (value) => set({ search: value }),
  setFilterStatus: (value) => set({ filterStatus: value }),
  setFilterCategory: (value) => set({ filterCategory: value }),

  addTela: async (formData) => {
    const novaTela = await telasService.addTela(formData);
    set({ telas: [...get().telas, novaTela] });
    return novaTela;
  },

  removeTela: async (id) => {
    telasService.removeTela(id);
    set({ telas: get().telas.filter((t) => t.id !== id) });
  },

  updateTela: async (id, updates) => {
    const updated = telasService.updateTela(id, updates);
    if (!updated) throw new Error('Tela não encontrada');
    set({ telas: get().telas.map((t) => (t.id === id ? updated : t)) });
    return updated;
  },

  createProjeto: async (input) => {
    const projeto = createProjeto(input);
    refreshCentral(set);
    set({ selectedProjectId: projeto.id, activeTab: 'estudio' });
    return projeto;
  },

  saveBlueprint: async (blueprint) => {
    saveBlueprint(blueprint);
    refreshCentral(set);
  },

  addBloco: async (projetoId, tipo) => {
    const bloco = addBloco(projetoId, tipo);
    refreshCentral(set);
    return bloco;
  },

  addReferencia: async (ref) => {
    const created = addReferencia(ref);
    refreshCentral(set);
    return created;
  },

  gerarExportacao: async (projetoId) => {
    const exp = gerarExportacao(projetoId);
    refreshCentral(set);
    return exp;
  },

  publicarExportacao: async (exportacaoId) => {
    const tela = await publicarExportacaoNaBiblioteca(exportacaoId);
    set({ telas: telasService.getAllTelas(), activeTab: 'biblioteca' });
    refreshCentral(set);
    return tela;
  },

  clearError: () => set({ error: null }),
}));

