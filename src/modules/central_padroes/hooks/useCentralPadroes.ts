import { useEffect, useMemo, useState } from 'react';
import { centralPadroesRepository } from '../services/centralPadroesRepository';
import { CentralOperationState, CentralRepositorySnapshot, CreateStandardInput, UpdateStandardInput } from '../types';

export const useCentralPadroes = () => {
  const [snapshot, setSnapshot] = useState<CentralRepositorySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<CentralOperationState>({ loading: false, error: null });

  const load = async (mounted = true) => {
      try {
        setLoading(true);
        setError(null);
        const data = await centralPadroesRepository.getSnapshot();
        if (mounted) setSnapshot(data);
      } catch (err) {
        if (mounted) {
          setSnapshot(null);
          setError(String((err as Error)?.message || err));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

  useEffect(() => {
    let mounted = true;
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const runOperation = async <T,>(fn: () => Promise<T>) => {
    setOperation({ loading: true, error: null });
    try {
      const result = await fn();
      await load(true);
      setOperation({ loading: false, error: null });
      return result;
    } catch (err) {
      const message = String((err as Error)?.message || err);
      setOperation({ loading: false, error: message });
      throw err;
    }
  };

  const createStandard = (input: CreateStandardInput) => runOperation(() => centralPadroesRepository.createStandard(input));
  const updateStandard = (id: string, input: UpdateStandardInput) => runOperation(() => centralPadroesRepository.updateStandard(id, input));
  const deleteStandard = (id: string) => runOperation(() => centralPadroesRepository.deleteStandard(id));

  const metrics = useMemo(() => (snapshot ? centralPadroesRepository.getMetrics(snapshot) : null), [snapshot]);

  return { snapshot, metrics, loading, error, operation, refetch: () => load(true), createStandard, updateStandard, deleteStandard };
};
