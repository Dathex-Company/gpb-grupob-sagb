import { useState, useEffect, useCallback } from 'react';
import { Mentoria, MentoriaStatus, MentoriaType } from '../types/mentorias.types';
import { mentoriasService } from '../services/mentorias.service';

export interface MentoriasFilters {
  status?: MentoriaStatus;
  type?: MentoriaType;
  limit?: number;
}

export const useMentorias = (filters?: MentoriasFilters) => {
  const [mentorias, setMentorias] = useState<Mentoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMentorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentoriasService.getMentorias(filters);
      setMentorias(data);
    } catch (err) {
      console.error('Erro ao carregar mentorias:', err);
      setError('Falha ao carregar mentorias. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadMentorias();
  }, [loadMentorias]);

  const createMentoria = useCallback(async (data: Omit<Mentoria, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await mentoriasService.createMentoria(data);
      await loadMentorias(); // recarrega a lista
      return id;
    } catch (err) {
      console.error('Erro ao criar mentoria:', err);
      throw err;
    }
  }, [loadMentorias]);

  const updateMentoria = useCallback(async (id: string, data: Partial<Mentoria>) => {
    try {
      await mentoriasService.updateMentoria(id, data);
      await loadMentorias(); // recarrega a lista
    } catch (err) {
      console.error('Erro ao atualizar mentoria:', err);
      throw err;
    }
  }, [loadMentorias]);

  const deleteMentoria = useCallback(async (id: string) => {
    try {
      await mentoriasService.deleteMentoria(id);
      await loadMentorias(); // recarrega a lista
    } catch (err) {
      console.error('Erro ao deletar mentoria:', err);
      throw err;
    }
  }, [loadMentorias]);

  return {
    mentorias,
    loading,
    error,
    refresh: loadMentorias,
    createMentoria,
    updateMentoria,
    deleteMentoria,
  };
};