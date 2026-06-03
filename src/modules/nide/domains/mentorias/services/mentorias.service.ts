import {
  addDoc,
  collection,
  db,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as queryLimit,
  Timestamp
} from '../../../../../../services/supabase';
import { Mentoria, MentoriaBloco, MentoriaMaterial, MentoriaSessao, MentoriaVersao, MentoriaAgente, MentoriaHistorico, MentoriaStatus, MentoriaType, MaterialType } from '../types/mentorias.types';

const MENTORIAS_TABLE = 'mentorias';
const MENTORIAS_BLOCOS_TABLE = 'mentorias_blocos';
const MENTORIAS_MATERIAIS_TABLE = 'mentorias_materiais';
const MENTORIAS_SESSOES_TABLE = 'mentorias_sessoes';
const MENTORIAS_VERSOES_TABLE = 'mentorias_versoes';
const MENTORIAS_AGENTES_TABLE = 'mentorias_agentes';
const MENTORIAS_HISTORICO_TABLE = 'mentorias_historico';

const resolveWorkspaceId = (workspaceId?: string) => {
  // TODO: Implementar lógica para obter workspaceId do usuário autenticado
  // Por enquanto, retorna um workspace fixo ou usa o valor fornecido
  return workspaceId || 'default-workspace';
};

class MentoriasService {
  private workspaceId: string;

  constructor(workspaceId?: string) {
    this.workspaceId = resolveWorkspaceId(workspaceId);
  }

  // ===== MENTORIAS (main) =====
  async getMentorias(filters?: {
    status?: MentoriaStatus;
    type?: MentoriaType;
    limit?: number;
  }): Promise<Mentoria[]> {
    try {
      const conditions = [];
      conditions.push(where('workspace_id', '==', this.workspaceId));
      
      if (filters?.status) {
        conditions.push(where('status', '==', filters.status));
      }
      
      if (filters?.type) {
        conditions.push(where('type', '==', filters.type));
      }
      
      conditions.push(orderBy('last_update', 'desc'));
      
      if (filters?.limit) {
        conditions.push(queryLimit(filters.limit));
      }
      
      const q = query(collection(db, MENTORIAS_TABLE), ...conditions);
      const snapshot = await getDocs(q);
      
      const mentorias: Mentoria[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          mentorias.push({
            id: docSnapshot.id,
            ...data,
            lastUpdate: data.lastUpdate?.toDate?.()?.toISOString() || data.lastUpdate,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          } as Mentoria);
        }
      });
      
      return mentorias;
    } catch (error) {
      console.error('Erro ao buscar mentorias:', error);
      throw error;
    }
  }

  async getMentoriaById(id: string): Promise<Mentoria | null> {
    try {
      const q = query(
        collection(db, MENTORIAS_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('id', '==', id)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const docSnapshot = snapshot.docs[0];
      const data = docSnapshot.data();
      
      // Buscar dados relacionados
      const [blocos, materiais, sessoes, versoes, agentes, historico] = await Promise.all([
        this.getBlocosByMentoriaId(id),
        this.getMateriaisByMentoriaId(id),
        this.getSessoesByMentoriaId(id),
        this.getVersoesByMentoriaId(id),
        this.getAgentesByMentoriaId(id),
        this.getHistoricoByMentoriaId(id),
      ]);
      
      return {
        id: docSnapshot.id,
        ...data,
        lastUpdate: data.lastUpdate?.toDate?.()?.toISOString() || data.lastUpdate,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        blocks: blocos,
        materials: materiais,
        sessions: sessoes,
        versions: versoes,
        agents: agentes,
        history: historico,
      } as Mentoria;
    } catch (error) {
      console.error(`Erro ao buscar mentoria ${id}:`, error);
      throw error;
    }
  }

  async createMentoria(data: Omit<Mentoria, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const mentoriaData = {
        ...data,
        workspaceId: this.workspaceId,
        lastUpdate: now,
        createdAt: now,
        updatedAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_TABLE), mentoriaData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar mentoria:', error);
      throw error;
    }
  }

  async updateMentoria(id: string, data: Partial<Mentoria>): Promise<void> {
    try {
      const updateData = {
        ...data,
        lastUpdate: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, MENTORIAS_TABLE, id), updateData);
    } catch (error) {
      console.error(`Erro ao atualizar mentoria ${id}:`, error);
      throw error;
    }
  }

  async deleteMentoria(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MENTORIAS_TABLE, id));
      // Os registros relacionados serão deletados por cascade no Supabase
    } catch (error) {
      console.error(`Erro ao deletar mentoria ${id}:`, error);
      throw error;
    }
  }

  // ===== BLOCOS =====
  async getBlocosByMentoriaId(mentoriaId: string): Promise<MentoriaBloco[]> {
    try {
      const q = query(
        collection(db, MENTORIAS_BLOCOS_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('mentoria_id', '==', mentoriaId),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const blocos: MentoriaBloco[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          blocos.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          } as MentoriaBloco);
        }
      });
      
      return blocos;
    } catch (error) {
      console.error(`Erro ao buscar blocos da mentoria ${mentoriaId}:`, error);
      throw error;
    }
  }

  async createBloco(data: Omit<MentoriaBloco, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const blocoData = {
        ...data,
        workspaceId: this.workspaceId,
        createdAt: now,
        updatedAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_BLOCOS_TABLE), blocoData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar bloco:', error);
      throw error;
    }
  }

  async updateBloco(id: string, data: Partial<MentoriaBloco>): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, MENTORIAS_BLOCOS_TABLE, id), updateData);
    } catch (error) {
      console.error(`Erro ao atualizar bloco ${id}:`, error);
      throw error;
    }
  }

  async deleteBloco(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MENTORIAS_BLOCOS_TABLE, id));
    } catch (error) {
      console.error(`Erro ao deletar bloco ${id}:`, error);
      throw error;
    }
  }

  // ===== MATERIAIS =====
  async getMateriaisByMentoriaId(mentoriaId: string): Promise<MentoriaMaterial[]> {
    try {
      const q = query(
        collection(db, MENTORIAS_MATERIAIS_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('mentoria_id', '==', mentoriaId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const materiais: MentoriaMaterial[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          materiais.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          } as MentoriaMaterial);
        }
      });
      
      return materiais;
    } catch (error) {
      console.error(`Erro ao buscar materiais da mentoria ${mentoriaId}:`, error);
      throw error;
    }
  }

  async createMaterial(data: Omit<MentoriaMaterial, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const materialData = {
        ...data,
        workspaceId: this.workspaceId,
        createdAt: now,
        updatedAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_MATERIAIS_TABLE), materialData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar material:', error);
      throw error;
    }
  }

  async updateMaterial(id: string, data: Partial<MentoriaMaterial>): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, MENTORIAS_MATERIAIS_TABLE, id), updateData);
    } catch (error) {
      console.error(`Erro ao atualizar material ${id}:`, error);
      throw error;
    }
  }

  async deleteMaterial(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MENTORIAS_MATERIAIS_TABLE, id));
    } catch (error) {
      console.error(`Erro ao deletar material ${id}:`, error);
      throw error;
    }
  }

  // ===== SESSÕES =====
  async getSessoesByMentoriaId(mentoriaId: string): Promise<MentoriaSessao[]> {
    try {
      const q = query(
        collection(db, MENTORIAS_SESSOES_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('mentoria_id', '==', mentoriaId),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const sessoes: MentoriaSessao[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          sessoes.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          } as MentoriaSessao);
        }
      });
      
      return sessoes;
    } catch (error) {
      console.error(`Erro ao buscar sessões da mentoria ${mentoriaId}:`, error);
      throw error;
    }
  }

  async createSessao(data: Omit<MentoriaSessao, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const sessaoData = {
        ...data,
        workspaceId: this.workspaceId,
        createdAt: now,
        updatedAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_SESSOES_TABLE), sessaoData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }
  }

  async updateSessao(id: string, data: Partial<MentoriaSessao>): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, MENTORIAS_SESSOES_TABLE, id), updateData);
    } catch (error) {
      console.error(`Erro ao atualizar sessão ${id}:`, error);
      throw error;
    }
  }

  async deleteSessao(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MENTORIAS_SESSOES_TABLE, id));
    } catch (error) {
      console.error(`Erro ao deletar sessão ${id}:`, error);
      throw error;
    }
  }

  // ===== VERSÕES =====
  async getVersoesByMentoriaId(mentoriaId: string): Promise<MentoriaVersao[]> {
    try {
      const q = query(
        collection(db, MENTORIAS_VERSOES_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('mentoria_id', '==', mentoriaId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const versoes: MentoriaVersao[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          versoes.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          } as MentoriaVersao);
        }
      });
      
      return versoes;
    } catch (error) {
      console.error(`Erro ao buscar versões da mentoria ${mentoriaId}:`, error);
      throw error;
    }
  }

  async createVersao(data: Omit<MentoriaVersao, 'id' | 'createdAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const versaoData = {
        ...data,
        workspaceId: this.workspaceId,
        createdAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_VERSOES_TABLE), versaoData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar versão:', error);
      throw error;
    }
  }

  // ===== AGENTES =====
  async getAgentesByMentoriaId(mentoriaId: string): Promise<MentoriaAgente[]> {
    try {
      const q = query(
        collection(db, MENTORIAS_AGENTES_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('mentoria_id', '==', mentoriaId),
        orderBy('created_at', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const agentes: MentoriaAgente[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          agentes.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          } as MentoriaAgente);
        }
      });
      
      return agentes;
    } catch (error) {
      console.error(`Erro ao buscar agentes da mentoria ${mentoriaId}:`, error);
      throw error;
    }
  }

  async createAgente(data: Omit<MentoriaAgente, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const agenteData = {
        ...data,
        workspaceId: this.workspaceId,
        createdAt: now,
        updatedAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_AGENTES_TABLE), agenteData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      throw error;
    }
  }

  async updateAgente(id: string, data: Partial<MentoriaAgente>): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, MENTORIAS_AGENTES_TABLE, id), updateData);
    } catch (error) {
      console.error(`Erro ao atualizar agente ${id}:`, error);
      throw error;
    }
  }

  async deleteAgente(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MENTORIAS_AGENTES_TABLE, id));
    } catch (error) {
      console.error(`Erro ao deletar agente ${id}:`, error);
      throw error;
    }
  }

  // ===== HISTÓRICO =====
  async getHistoricoByMentoriaId(mentoriaId: string): Promise<MentoriaHistorico[]> {
    try {
      const q = query(
        collection(db, MENTORIAS_HISTORICO_TABLE),
        where('workspace_id', '==', this.workspaceId),
        where('mentoria_id', '==', mentoriaId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const historico: MentoriaHistorico[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          historico.push({
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          } as MentoriaHistorico);
        }
      });
      
      return historico;
    } catch (error) {
      console.error(`Erro ao buscar histórico da mentoria ${mentoriaId}:`, error);
      throw error;
    }
  }

  async createHistoricoEntry(data: Omit<MentoriaHistorico, 'id' | 'createdAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const historicoData = {
        ...data,
        workspaceId: this.workspaceId,
        createdAt: now,
      };
      
      const ref = await addDoc(collection(db, MENTORIAS_HISTORICO_TABLE), historicoData);
      return ref.id;
    } catch (error) {
      console.error('Erro ao criar entrada de histórico:', error);
      throw error;
    }
  }

  // Método para upload de materiais (usando Supabase Storage)
  async uploadMaterial(mentoriaId: string, file: File): Promise<string> {
    console.log(`Uploading ${file.name} for mentoria ${mentoriaId}`);
    // TODO: Implementar upload usando services/storage.ts
    return 'url-placeholder';
  }
}

// Exportar uma instância padrão
export const mentoriasService = new MentoriasService();

// Exportar também a classe para casos onde se precisa de múltiplos workspaces
export { MentoriasService };
