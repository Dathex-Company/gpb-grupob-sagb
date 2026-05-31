import { useEffect, useMemo, useState } from 'react';
import { centralPadroesRepository } from '../services/centralPadroesRepository';
import { CentralRepositorySnapshot } from '../types';

export const useCentralPadroes = () => {
  const [snapshot, setSnapshot] = useState<CentralRepositorySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await centralPadroesRepository.getSnapshot();
        if (mounted) setSnapshot(data);
      } catch (err) {
        if (mounted) setError(String((err as Error)?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => (snapshot ? centralPadroesRepository.getMetrics(snapshot) : null), [snapshot]);

  return { snapshot, metrics, loading, error };
};

