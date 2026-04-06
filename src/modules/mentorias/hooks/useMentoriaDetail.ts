import { useState, useEffect, useCallback } from 'react';
import { Mentoria, MentoriaSessao, MentoriaMaterial, MentoriaBloco } from '../types/mentorias.types';
import { mentoriasService } from '../services/mentorias.service';

interface UseMentoriaDetailReturn {
  mentoria: Mentoria | null;
  sessions: MentoriaSessao[];
  materials: MentoriaMaterial[];
  blocks: MentoriaBloco[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMentoriaDetail = (mentoriaId: string | null): UseMentoriaDetailReturn => {
  const [mentoria, setMentoria] = useState<Mentoria | null>(null);
  const [sessions, setSessions] = useState<MentoriaSessao[]>([]);
  const [materials, setMaterials] = useState<MentoriaMaterial[]>([]);
  const [blocks, setBlocks] = useState<MentoriaBloco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!mentoriaId) {
      setMentoria(null);
      setSessions([]);
      setMaterials([]);
      setBlocks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Carregar dados em paralelo usando a instância do serviço
      const [mentoriaData, sessionsData, materialsData, blocksData] = await Promise.all([
        mentoriasService.getMentoriaById(mentoriaId),
        mentoriasService.getSessoesByMentoriaId(mentoriaId),
        mentoriasService.getMateriaisByMentoriaId(mentoriaId),
        mentoriasService.getBlocosByMentoriaId(mentoriaId),
      ]);

      setMentoria(mentoriaData);
      setSessions(sessionsData);
      setMaterials(materialsData);
      setBlocks(blocksData);
    } catch (err) {
      console.error('Erro ao carregar detalhes da mentoria:', err);
      setError('Falha ao carregar dados da mentoria');
    } finally {
      setLoading(false);
    }
  }, [mentoriaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    mentoria,
    sessions,
    materials,
    blocks,
    loading,
    error,
    refresh: loadData,
  };
};

export default useMentoriaDetail;
