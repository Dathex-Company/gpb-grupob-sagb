import { useState, useEffect, useCallback } from 'react';
import { collection, db, onSnapshot, query, where, orderBy, limit } from '../services/supabase';
import { getProvidersHealth, ProvidersHealthMap } from '../services/providerHealth';

export interface TelemetryData {
  // Memórias e dados
  totalMemories: number;
  pendingChunks: number;
  cidAssetsCount: number;
  totalAgents: number;
  recentWrites: Array<{
    id: string;
    tipo: string;
    origem: string;
    status: string;
    timeRaw: Date | string;
  }>;
  
  // Saúde dos provedores
  providersHealth: Partial<ProvidersHealthMap>;
  providersHealthCheckedAt: string;
  
  // Eventos de qualidade
  qualityEvents: any[];
  
  // Status do sistema
  systemStatus: 'nominal' | 'warning' | 'error';
  lastUpdated: Date;
}

export const useTelemetryData = (workspaceId?: string | null) => {
  const [data, setData] = useState<TelemetryData>({
    totalMemories: 0,
    pendingChunks: 0,
    cidAssetsCount: 0,
    totalAgents: 0,
    recentWrites: [],
    providersHealth: {},
    providersHealthCheckedAt: '',
    qualityEvents: [],
    systemStatus: 'nominal',
    lastUpdated: new Date()
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar saúde dos provedores
  const loadProvidersHealth = useCallback(async () => {
    try {
      const result = await getProvidersHealth();
      setData(prev => ({
        ...prev,
        providersHealth: result.providers || {},
        providersHealthCheckedAt: result.checkedAt || '',
        lastUpdated: new Date()
      }));
    } catch (err) {
      console.error('Erro ao carregar saúde dos provedores:', err);
    }
  }, []);

  // Efeito para assinaturas do Supabase
  useEffect(() => {
    let unsubscribeMemories = () => {};
    let unsubscribeChunks = () => {};
    let unsubscribeCid = () => {};
    let unsubscribeAgents = () => {};
    let healthInterval: NodeJS.Timeout;

    const setupSubscriptions = () => {
      try {
        // Memórias de agentes
        const qMemories = workspaceId 
          ? query(collection(db, 'agent_memories'), where('workspaceId', '==', workspaceId))
          : collection(db, 'agent_memories');
        
        unsubscribeMemories = onSnapshot(qMemories, (snapshot) => {
          const totalMemories = snapshot.docs.length;
          const recentWrites = snapshot.docs.map(d => ({
            id: d.id,
            tipo: 'Refinamento',
            origem: 'Memória',
            status: 'ok',
            timeRaw: d.data().createdAt || d.data().created_at || new Date()
          })).sort((a, b) => new Date(b.timeRaw).getTime() - new Date(a.timeRaw).getTime()).slice(0, 5);

          setData(prev => ({
            ...prev,
            totalMemories,
            recentWrites,
            lastUpdated: new Date()
          }));
        });

        // Chunks pendentes
        const qChunks = workspaceId
          ? query(collection(db, 'continuous_memory_chunks'), 
              where('workspaceId', '==', workspaceId), 
              where('status', 'in', ['captured', 'transcribing', 'stored']))
          : query(collection(db, 'continuous_memory_chunks'), 
              where('status', 'in', ['captured', 'transcribing', 'stored']));
        
        unsubscribeChunks = onSnapshot(qChunks, (snapshot) => {
          setData(prev => ({
            ...prev,
            pendingChunks: snapshot.docs.length,
            lastUpdated: new Date()
          }));
        });

        // Ativos CID
        const qCid = workspaceId 
          ? query(collection(db, 'cid_assets'), where('workspaceId', '==', workspaceId))
          : collection(db, 'cid_assets');
        
        unsubscribeCid = onSnapshot(qCid, (snapshot) => {
          setData(prev => ({
            ...prev,
            cidAssetsCount: snapshot.docs.length,
            lastUpdated: new Date()
          }));
        });

        // Agentes
        unsubscribeAgents = onSnapshot(collection(db, 'agents'), (snapshot) => {
          setData(prev => ({
            ...prev,
            totalAgents: snapshot.docs.length,
            lastUpdated: new Date()
          }));
        });

        // Saúde dos provedores - carregar inicialmente e depois a cada minuto
        loadProvidersHealth();
        healthInterval = setInterval(loadProvidersHealth, 60000);

        setLoading(false);
      } catch (err) {
        console.error('Erro ao configurar assinaturas:', err);
        setError('Falha ao conectar com o banco de dados');
        setLoading(false);
      }
    };

    setupSubscriptions();

    return () => {
      unsubscribeMemories();
      unsubscribeChunks();
      unsubscribeCid();
      unsubscribeAgents();
      if (healthInterval) clearInterval(healthInterval);
    };
  }, [workspaceId, loadProvidersHealth]);

  // Calcular status do sistema baseado nos dados
  const systemStatus = (() => {
    const { pendingChunks, providersHealth } = data;
    
    // Se muitos chunks pendentes
    if (pendingChunks > 50) return 'error';
    if (pendingChunks > 20) return 'warning';
    
    // Se algum provedor está offline
    const offlineProviders = Object.values(providersHealth).filter(p => !p?.ok);
    if (offlineProviders.length > 0) return 'warning';
    
    return 'nominal';
  })();

  // Atualizar status do sistema
  useEffect(() => {
    setData(prev => ({
      ...prev,
      systemStatus
    }));
  }, [systemStatus]);

  return {
    data: {
      ...data,
      systemStatus
    },
    loading,
    error,
    refresh: loadProvidersHealth
  };
};

export default useTelemetryData;