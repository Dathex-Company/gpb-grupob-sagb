import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RAIAgent, RAICapture, RAIConfig, RAIReading, RAIAlert, RAIFilters } from '../types';
import { raiAgentsService, raiCapturesService, raiInsightsService } from '../services/raiServices';
import { raiSupabaseService } from '../services/raiSupabaseService';
import { auth } from '../../../../services/supabase';
import { useRAIStore } from '../store';

/**
 * Flag para alternar entre dados reais (Supabase) e mocks.
 */
const USE_REAL_DATA = true;

/**
 * Obtém workspaceId do usuário atual.
 */
const getWorkspaceId = (): string | null => {
  const user = auth.currentUser;
  if (user?.app_metadata?.workspaceId) {
    return user.app_metadata.workspaceId;
  }
  const workspaceId = user?.user_metadata?.workspaceId;
  return workspaceId || (user ? 'default' : null);
};

// ===================== Helpers de composição =====================

/**
 * Recebe Agent[] do SagB + RAIConfig[] e produz RAIAgent[] composto.
 * Cada Agent vira um RAIAgent. Se tiver config, enriquece com dados do radar.
 * Se não tiver config, fica com config: null e valores default.
 */
const composeRAIAgents = (
  sagbAgents: any[], // Agent[] do SagB
  configs: RAIConfig[]
): RAIAgent[] => {
  const configByAgentId = new Map(configs.map((c) => [c.agentId, c]));

  return sagbAgents.map((agent): RAIAgent => {
    const config = configByAgentId.get(agent.id) || null;
    return {
      id: agent.id,
      name: agent.name || agent.shortDescription || '',
      config,
      // Atalhos: delegam para config ou usam defaults
      theme: config?.theme || 'general',
      objective: config?.objective || '',
      frequency: config?.frequency || 'daily',
      status: config?.status || 'active',
      sources: config?.sources || [],
      lastRun: config?.lastRun,
      nextRun: config?.nextRun,
    };
  });
};

/**
 * Hook auxiliar para extrair APENAS as ações do store zustand,
 * sem inscrever o componente em todo o estado. Isso evita
 * infinite loop causado por store.set*() → re-render → novo objeto store → nova dependência.
 */
const useRAIStoreActions = () => {
  const setLoading = useRAIStore((s) => s.setLoading);
  const setError = useRAIStore((s) => s.setError);
  const setConfigs = useRAIStore((s) => s.setConfigs);
  const setCaptures = useRAIStore((s) => s.setCaptures);
  const reset = useRAIStore((s) => s.reset);
  return { setLoading, setError, setConfigs, setCaptures, reset };
};

/**
 * Hook auxiliar para ler valores reativos do store sem causar loops.
 */
const useRAIStoreValues = () => {
  const loading = useRAIStore((s) => s.loading);
  const error = useRAIStore((s) => s.error);
  const captures = useRAIStore((s) => s.captures);
  const configs = useRAIStore((s) => s.configs);
  return { loading, error, captures, configs };
};

// ===================== Agents (composição SagB + RAI) =====================

/**
 * @param sagbAgents - Lista de Agent[] do SagB (do activatedAgents da App.tsx).
 * Se não fornecido, tenta usar mocks.
 */
export const useRAIAgents = (sagbAgents?: any[]) => {
  const { setLoading, setError: setStoreError, setConfigs } = useRAIStoreActions();
  const storeValues = useRAIStoreValues();
  const [localError, setLocalError] = useState<string | null>(null);

  // Ref estável para evitar que sagbAgents (array novo a cada render) force recriação
  const sagbAgentsRef = useRef(sagbAgents);
  sagbAgentsRef.current = sagbAgents;

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setStoreError(null);

    try {
      const currentSagbAgents = sagbAgentsRef.current;
      if (USE_REAL_DATA && currentSagbAgents && currentSagbAgents.length > 0) {
        const workspaceId = getWorkspaceId();
        if (workspaceId) {
          const configs = await raiSupabaseService.getConfigs(workspaceId);
          const composed = composeRAIAgents(currentSagbAgents, configs);
          setConfigs(configs);
          return composed;
        }
      }

      // Fallback: mocks
      const mockAgents = await raiAgentsService.getAgents();
      return mockAgents;
    } catch (err: any) {
      const msg = err?.message || 'Erro ao carregar agentes';
      setLocalError(msg);
      setStoreError(msg);

      // Fallback para mocks
      try {
        return await raiAgentsService.getAgents();
      } catch {
        return [];
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, setStoreError, setConfigs]); // dependências estáveis — sem infinite loop!

  const [agents, setLocalAgents] = useState<RAIAgent[]>([]);

  useEffect(() => {
    fetchAgents().then((result) => {
      if (result && Array.isArray(result)) {
        setLocalAgents(result as RAIAgent[]);
      }
    });
  }, [fetchAgents]);

  return {
    agents,
    loading: storeValues.loading,
    error: localError || storeValues.error,
    refetch: fetchAgents,
  };
};

// ===================== Captures =====================

export const useRAICaptures = (initialFilters?: RAIFilters) => {
  const { setLoading, setError: setStoreError, setCaptures } = useRAIStoreActions();
  const storeValues = useRAIStoreValues();
  const [filters, setFilters] = useState<RAIFilters>(initialFilters || {});
  const [localError, setLocalError] = useState<string | null>(null);

  // Ref para evitar que filters como dependência cause loop
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchCaptures = useCallback(async () => {
    setLoading(true);
    setStoreError(null);

    try {
      const currentFilters = filtersRef.current;
      if (USE_REAL_DATA) {
        const workspaceId = getWorkspaceId();
        if (workspaceId) {
          const realCaptures = await raiSupabaseService.getCaptures(workspaceId, {
            agentId: currentFilters.agentId,
            status: currentFilters.status,
            category: currentFilters.category,
          });
          const filteredReal = realCaptures.filter((cap) => {
            if (currentFilters.query) {
              const q = currentFilters.query.toLowerCase();
              const haystack = `${cap.title} ${cap.content} ${cap.summary || ''} ${cap.sourceName} ${cap.tags.join(' ')}`.toLowerCase();
              if (!haystack.includes(q)) return false;
            }
            if (typeof currentFilters.minRelevance === 'number' && cap.relevance < currentFilters.minRelevance) return false;
            if (currentFilters.startDate && cap.timestamp < currentFilters.startDate) return false;
            if (currentFilters.endDate && cap.timestamp > currentFilters.endDate) return false;
            if (currentFilters.tags?.length) {
              const capTags = new Set(cap.tags.map((t) => t.toLowerCase()));
              const ok = currentFilters.tags.every((t) => capTags.has(t.toLowerCase()));
              if (!ok) return false;
            }
            return true;
          });
          setCaptures(filteredReal);
          setLoading(false);
          return;
        }
      }

      // Fallback para mocks
      const mockData = await raiCapturesService.getCaptures(currentFilters);
      const filteredMock = mockData.filter((cap) => {
        if (currentFilters.query) {
          const q = currentFilters.query.toLowerCase();
          const haystack = `${cap.title} ${cap.content} ${cap.summary || ''} ${cap.sourceName} ${cap.tags.join(' ')}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        if (currentFilters.agentId && cap.agentId !== currentFilters.agentId) return false;
        if (currentFilters.status && cap.status !== currentFilters.status) return false;
        if (currentFilters.category && cap.category !== currentFilters.category) return false;
        if (typeof currentFilters.minRelevance === 'number' && cap.relevance < currentFilters.minRelevance) return false;
        return true;
      });
      setCaptures(filteredMock);
    } catch (err: any) {
      const msg = err?.message || 'Erro ao carregar capturas';
      const isMissingRaiTable =
        msg.includes("Could not find the table 'public.rai_captures'") ||
        msg.includes("rai_captures") && msg.toLowerCase().includes('schema cache');

      // Se a tabela ainda não existe no ambiente, não quebrar a UX:
      // segue com fallback mock sem exibir erro técnico para o usuário.
      if (!isMissingRaiTable) {
        setLocalError(msg);
        setStoreError(msg);
      } else {
        setLocalError(null);
        setStoreError(null);
      }

      try {
        const mockData = await raiCapturesService.getCaptures(filtersRef.current);
        setCaptures(mockData);
      } catch {
        // Silencia
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, setStoreError, setCaptures]); // dependências estáveis!

  useEffect(() => {
    fetchCaptures();
  }, [fetchCaptures]);

  return {
    captures: storeValues.captures,
    filters,
    setFilters,
    loading: storeValues.loading,
    error: localError || storeValues.error,
    refetch: fetchCaptures,
  };
};

// ===================== Insights =====================

export const useRAIInsights = () => {
  const [readings, setReadings] = useState<RAIReading[]>([]);
  const [alerts, setAlerts] = useState<RAIAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [r, a] = await Promise.all([
        raiInsightsService.getReadings(),
        raiInsightsService.getAlerts(),
      ]);
      setReadings(r);
      setAlerts(a);
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar insights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { readings, alerts, loading, error, refetch: fetchInsights };
};
