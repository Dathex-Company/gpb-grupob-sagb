/**
 * Store para gerenciamento de estado das Telas Avançadas
 * V2: Suporte a URL externa, arquivo HTML e código HTML
 */

import * as React from 'react';
import { create } from 'zustand';
import { TelaAvancada, TelaAvancadaFormData, TelasAvancadasStore } from '../types/telasAvancadas.types';
import * as telasService from '../services/telasAvancadas.service';

export const useTelasAvancadasStore = create<TelasAvancadasStore>((set, get) => ({
  telas: [],
  isLoading: false,
  error: null,
  
  // Carrega todas as telas do storage
  loadTelas: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const telas = telasService.getAllTelas();
      set({ telas, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar telas',
        isLoading: false 
      });
    }
  },
  
  // Adiciona uma nova tela (suporte a múltiplos tipos)
  addTela: async (formData: TelaAvancadaFormData) => {
    set({ isLoading: true, error: null });
    
    try {
      const novaTela = await telasService.addTela(formData);
      const telasAtualizadas = [...get().telas, novaTela];
      
      set({ 
        telas: telasAtualizadas,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao adicionar tela',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Remove uma tela pelo ID
  removeTela: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      telasService.removeTela(id);
      const telasAtualizadas = get().telas.filter(tela => tela.id !== id);
      
      set({ 
        telas: telasAtualizadas,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao remover tela',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Obtém uma tela pelo ID
  getTelaById: (id: string) => {
    return get().telas.find(tela => tela.id === id) || null;
  },
  
  // Atualiza uma tela existente
  updateTela: async (id: string, updates: Partial<TelaAvancada>) => {
    set({ isLoading: true, error: null });
    
    try {
      const telaAtualizada = telasService.updateTela(id, updates);
      
      if (!telaAtualizada) {
        throw new Error('Tela não encontrada');
      }
      
      const telasAtualizadas = get().telas.map(tela => 
        tela.id === id ? telaAtualizada : tela
      );
      
      set({ 
        telas: telasAtualizadas,
        isLoading: false 
      });
      
      return telaAtualizada;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar tela',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Limpa erros
  clearError: () => {
    set({ error: null });
  }
}));

/**
 * Hook personalizado para usar o store com carregamento inicial
 */
export const useTelasAvancadas = () => {
  const store = useTelasAvancadasStore();
  
  // Carrega as telas na inicialização
  React.useEffect(() => {
    store.loadTelas();
  }, []);
  
  return store;
};