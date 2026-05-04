import React, { useState, useEffect, useCallback } from 'react';
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

// ===================== Agents (composição SagB + RAI) =====================

/**
 * @param sagbAgents - Lista de Agent[] do SagB (do activatedAgents da App.tsx).
 * Se não fornecido, tenta usar mocks.
 */
export const useRAIAgents = (sagbAgents?: any[]) => {
  const store = useRAIStore();
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);

    try {
      if (USE_REAL_DATA && sagbAgents && sagbAgents.length > 0) {
        const workspaceId = getWorkspaceId();
        if (workspaceId) {
          const configs = await raiSupabaseService.getConfigs(workspaceId);
          const composed = composeRAIAgents(sagbAgents, configs);
          store.setConfigs(configs);
          return composed;
        }
      }

      // Fallback: mocks
      const mockAgents = await raiAgentsService.getAgents();
      return mockAgents;
    } catch (err: any) {
      const msg = err?.message || 'Erro ao carregar agentes';
      setError(msg);
      store.setError(msg);

      // Fallback para mocks
      try {
        return await raiAgentsService.getAgents();
      } catch {
        return [];
      }
    } finally {
      store.setLoading(false);
    }
  }, [store, sagbAgents]);

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
    loading: store.loading,
    error: error || store.error,
    refetch: fetchAgents,
  };
};

// ===================== Captures =====================

export const useRAICaptures = (initialFilters?: RAIFilters) => {
  const store = useRAIStore();
  const [filters, setFilters] = useState<RAIFilters>(initialFilters || {});
  const [error, setError] = useState<string | null>(null);

  const fetchCaptures = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);

    try {
      if (USE_REAL_DATA) {
        const workspaceId = getWorkspaceId();
        if (workspaceId) {
          const realCaptures = await raiSupabaseService.getCaptures(workspaceId, {
            agentId: filters.agentId,
            status: filters.status,
            category: filters.category,
          });
          if (realCaptures.length > 0) {
            store.setCaptures(realCaptures);
            store.setLoading(false);
            return;
          }
        }
      }

      // Fallback para mocks
      const mockData = await raiCapturesService.getCaptures(filters);
      store.setCaptures(mockData);
    } catch (err: any) {
      const msg = err?.message || 'Erro ao carregar capturas';
      setError(msg);
      store.setError(msg);

      try {
        const mockData = await raiCapturesService.getCaptures(filters);
        store.setCaptures(mockData);
      } catch {
        // Silencia
      }
    } finally {
      store.setLoading(false);
    }
  }, [store, filters]);

  useEffect(() => {
    fetchCaptures();
  }, [fetchCaptures]);

  return {
    captures: store.captures,
    filters,
    setFilters,
    loading: store.loading,
    error: error || store.error,
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
