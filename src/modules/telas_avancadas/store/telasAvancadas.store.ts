import { create } from 'zustand';
import {
  BlocoTela,
  BlueprintTela,
  BlueprintEditorFields,
  CentralTab,
  ExportacaoTela,
  ProjetoTela,
  ProjectVisualConfig,
  QuickEditData,
  ReferenciaTela,
  StudioPresetId,
  StudioStepId,
  TelaAvancada,
  TelaAvancadaFormData,
  TelaTemplateId,
  VisualDirectionConfig,
} from '../types/telasAvancadas.types';
import * as telasService from '../services/telasAvancadas.service';
import {
  addBloco,
  addReferencia,
  applyPresetToProjeto,
  applyTemplateToProjeto,
  createProjeto,
  duplicateBloco,
  gerarExportacao,
  getStudioSnapshot,
  moveBloco,
  publicarExportacaoNaBiblioteca,
  saveBlueprint,
  saveProjectVisual,
  toggleBlocoVisibility,
  updateBlocoMeta,
} from '../services/studio.service';
import { loadCentralData, saveCentralData } from '../services/repository/central.repository';

type CentralState = {
  // ── Dados ──
  telas: TelaAvancada[];
  projetos: ProjetoTela[];
  blueprints: BlueprintTela[];
  visuais: ProjectVisualConfig[];
  referencias: ReferenciaTela[];
  blocos: BlocoTela[];
  exportacoes: ExportacaoTela[];

  // ── Navegação ──
  activeTab: CentralTab['id'];
  selectedProjectId: string | null;

  // ── Estúdio: step tracking ──
  studioStep: StudioStepId;
  studioBlueprint: BlueprintEditorFields;
  studioVisual: VisualDirectionConfig;

  // ── Biblioteca: filtros ──
  search: string;
  filterStatus: string;
  filterCategory: string;
  filterOrigin: string;
  editingTelaId: string | null;

  // ── UI ──
  isLoading: boolean;
  error: string | null;

  // ── Actions ──
  loadAll: () => Promise<void>;
  setActiveTab: (tab: CentralTab['id']) => void;
  setSelectedProjectId: (id: string | null) => void;

  // Estúdio steps
  setStudioStep: (step: StudioStepId) => void;
  setStudioBlueprint: (fields: BlueprintEditorFields) => void;
  setStudioVisual: (config: Partial<VisualDirectionConfig>) => void;

  // Biblioteca
  setSearch: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setFilterOrigin: (value: string) => void;
  setEditingTelaId: (id: string | null) => void;

  addTela: (formData: TelaAvancadaFormData) => Promise<TelaAvancada>;
  removeTela: (id: string) => Promise<void>;
  updateTela: (id: string, updates: Partial<TelaAvancada>) => Promise<TelaAvancada>;
  quickEditTela: (id: string, data: QuickEditData) => Promise<TelaAvancada>;

  createProjeto: (input: Omit<ProjetoTela, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'versao'>) => Promise<ProjetoTela>;
  saveBlueprint: (blueprint: BlueprintTela) => Promise<void>;
  addBloco: (projetoId: string, tipo: BlocoTela['tipo']) => Promise<BlocoTela>;
  duplicateBloco: (blocoId: string) => Promise<BlocoTela>;
  moveBloco: (blocoId: string, direction: 'up' | 'down') => Promise<void>;
  toggleBlocoVisibility: (blocoId: string) => Promise<void>;
  updateBlocoMeta: (blocoId: string, input: { grupo?: string; presetId?: string }) => Promise<void>;
  removeBloco: (blocoId: string) => Promise<void>;
  applyTemplate: (projetoId: string, templateId: TelaTemplateId) => Promise<void>;
  applyPreset: (projetoId: string, presetId: StudioPresetId) => Promise<void>;
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
    visuais: snapshot.visuais,
    exportacoes: snapshot.exportacoes,
  });
};

const normalizeQuickEdit = (data: QuickEditData): Partial<TelaAvancada> => {
  const out: Partial<TelaAvancada> = {};
  if (typeof data.title === 'string') out.title = data.title.trim();
  if (data.status) out.status = data.status;
  if (data.category) out.category = data.category;
  if (data.source) out.source = data.source;
  if (typeof data.version === 'string') out.version = data.version.trim();
  return out;
};

const defaultBlueprintFields = (): BlueprintEditorFields => ({
  comunicacao: '',
  fluxoPrincipal: '',
  areas: [],
  elementosVivos: '',
  motionAjuda: '',
  efeitosDesejados: '',
  evitar: '',
  observacoes: '',
});

const defaultVisualConfig = (): VisualDirectionConfig => ({
  paleta: 'escura',
  densidadeVisual: 'media',
  intensidadeMotion: 'moderada',
  estiloBorda: 'arredondada',
  grid: 'ativa',
  glass: true,
  modoDemo: false,
  tomVisual: 'Profissional',
});

export const useTelasAvancadasStore = create<CentralState>((set, get) => ({
  telas: [],
  projetos: [],
  blueprints: [],
  visuais: [],
  referencias: [],
  blocos: [],
  exportacoes: [],
  activeTab: 'biblioteca',
  selectedProjectId: null,
  studioStep: 'informacoes',
  studioBlueprint: defaultBlueprintFields(),
  studioVisual: defaultVisualConfig(),
  search: '',
  filterStatus: 'todos',
  filterCategory: 'todos',
  filterOrigin: 'todos',
  editingTelaId: null,
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

  // ── Estúdio Steps ──
  setStudioStep: (step) => set({ studioStep: step }),
  setStudioBlueprint: (fields) => set({ studioBlueprint: fields }),
  setStudioVisual: (config) => set((s) => ({ studioVisual: { ...s.studioVisual, ...config } })),

  // ── Biblioteca ──
  setSearch: (value) => set({ search: value }),
  setFilterStatus: (value) => set({ filterStatus: value }),
  setFilterCategory: (value) => set({ filterCategory: value }),
  setFilterOrigin: (value) => set({ filterOrigin: value }),
  setEditingTelaId: (id) => set({ editingTelaId: id }),

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

  quickEditTela: async (id, data) => {
    const safe = normalizeQuickEdit(data);
    const updated = telasService.updateTela(id, safe);
    if (!updated) throw new Error('Tela não encontrada');
    set({ telas: get().telas.map((t) => (t.id === id ? updated : t)), editingTelaId: null });
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

  applyTemplate: async (projetoId, templateId) => {
    applyTemplateToProjeto(projetoId, templateId);
    refreshCentral(set);
  },

  applyPreset: async (projetoId, presetId) => {
    applyPresetToProjeto(projetoId, presetId);
    refreshCentral(set);
  },

  addBloco: async (projetoId, tipo) => {
    const bloco = addBloco(projetoId, tipo);
    refreshCentral(set);
    return bloco;
  },

  duplicateBloco: async (blocoId) => {
    const bloco = duplicateBloco(blocoId);
    refreshCentral(set);
    return bloco;
  },

  moveBloco: async (blocoId, direction) => {
    moveBloco(blocoId, direction);
    refreshCentral(set);
  },

  toggleBlocoVisibility: async (blocoId) => {
    toggleBlocoVisibility(blocoId);
    refreshCentral(set);
  },

  updateBlocoMeta: async (blocoId, input) => {
    updateBlocoMeta(blocoId, input);
    refreshCentral(set);
  },

  removeBloco: async (blocoId) => {
    const data = loadCentralData();
    data.blocos = data.blocos.filter((b) => b.id !== blocoId);
    saveCentralData(data);
    refreshCentral(set);
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
