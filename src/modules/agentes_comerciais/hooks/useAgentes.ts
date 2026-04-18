import { useState, useEffect, useCallback } from 'react';
import { Agente, AgenteDraft } from '../types';
import { agenteService } from '../services';

export const useAgentes = () => {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAgentes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agenteService.buscarAgentes();
      setAgentes(data);
    } catch (err) {
      setError('Erro ao carregar agentes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const criarAgente = useCallback(async (draft: AgenteDraft) => {
    try {
      const novoAgente = await agenteService.criarAgente(draft);
      setAgentes(prev => [...prev, novoAgente]);
      return novoAgente;
    } catch (err) {
      console.error('Erro ao criar agente:', err);
      throw err;
    }
  }, []);

  const atualizarAgente = useCallback(async (id: string, dados: Partial<Agente>) => {
    try {
      const atualizado = await agenteService.atualizarAgente(id, dados);
      if (atualizado) {
        setAgentes(prev => prev.map(a => a.id === id ? atualizado : a));
      }
      return atualizado;
    } catch (err) {
      console.error('Erro ao atualizar agente:', err);
      throw err;
    }
  }, []);

  const removerAgente = useCallback(async (id: string) => {
    try {
      const sucesso = await agenteService.removerAgente(id);
      if (sucesso) {
        setAgentes(prev => prev.filter(a => a.id !== id));
      }
      return sucesso;
    } catch (err) {
      console.error('Erro ao remover agente:', err);
      throw err;
    }
  }, []);

  const buscarAgentePorId = useCallback(async (id: string) => {
    try {
      return await agenteService.buscarAgentePorId(id);
    } catch (err) {
      console.error('Erro ao buscar agente:', err);
      throw err;
    }
  }, []);

  const filtrarPorStatus = useCallback(async (status: string) => {
    try {
      return await agenteService.filtrarPorStatus(status as any);
    } catch (err) {
      console.error('Erro ao filtrar agentes:', err);
      throw err;
    }
  }, []);

  const obterEstatisticas = useCallback(async () => {
    try {
      return await agenteService.obterEstatisticas();
    } catch (err) {
      console.error('Erro ao obter estatísticas:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadAgentes();
  }, [loadAgentes]);

  return {
    agentes,
    loading,
    error,
    criarAgente,
    atualizarAgente,
    removerAgente,
    buscarAgentePorId,
    filtrarPorStatus,
    obterEstatisticas,
    recarregar: loadAgentes
  };
};