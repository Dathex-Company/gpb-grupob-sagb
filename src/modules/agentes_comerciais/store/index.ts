import { create } from 'zustand';
import { Agente } from '../types';
import { agenteService } from '../services';

interface AgentesStore {
  agentes: Agente[];
  loading: boolean;
  error: string | null;
  carregarAgentes: () => Promise<void>;
  criarAgente: (draft: any) => Promise<Agente | null>;
  atualizarAgente: (id: string, dados: Partial<Agente>) => Promise<Agente | null>;
  removerAgente: (id: string) => Promise<boolean>;
}

export const useAgentesStore = create<AgentesStore>((set, get) => ({
  agentes: [],
  loading: false,
  error: null,

  carregarAgentes: async () => {
    set({ loading: true, error: null });
    try {
      const agentes = await agenteService.buscarAgentes();
      set({ agentes, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar agentes', loading: false });
      console.error(error);
    }
  },

  criarAgente: async (draft) => {
    try {
      const novoAgente = await agenteService.criarAgente(draft);
      set(state => ({ agentes: [...state.agentes, novoAgente] }));
      return novoAgente;
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      return null;
    }
  },

  atualizarAgente: async (id, dados) => {
    try {
      const atualizado = await agenteService.atualizarAgente(id, dados);
      if (atualizado) {
        set(state => ({
          agentes: state.agentes.map(a => a.id === id ? atualizado : a)
        }));
      }
      return atualizado;
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      return null;
    }
  },

  removerAgente: async (id) => {
    try {
      const sucesso = await agenteService.removerAgente(id);
      if (sucesso) {
        set(state => ({
          agentes: state.agentes.filter(a => a.id !== id)
        }));
      }
      return sucesso;
    } catch (error) {
      console.error('Erro ao remover agente:', error);
      return false;
    }
  }
}));

// Função para obter contexto de runtime (similar ao cadastro-empresas)
export const getAgentesAtendentesRuntimeContext = () => {
  const store = useAgentesStore.getState();
  return {
    agentes: store.agentes,
    loading: store.loading,
    error: store.error,
    onAddAgente: store.criarAgente,
    onUpdateAgente: store.atualizarAgente,
    onRemoveAgente: store.removerAgente
  };
};