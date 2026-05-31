/* ============================================================
 *  Serviço de Naming — Lógica de curadoria e governança
 *  Interface limpa, sem jargão técnico
 * ============================================================ */

import {
  NamingItem,
  NamingConflict,
  NamingDecision,
  NamingScanResult,
  NamingStatus
} from '../naming/namingSchema';
import {
  mockNames,
  mockConflicts,
  mockDecisions,
  mockScanResults
} from '../naming/namingData';

class NicNamingService {
  // ---- Catálogo ----

  listarNomes(filtroStatus?: NamingStatus): NamingItem[] {
    let lista = [...mockNames];
    if (filtroStatus) {
      lista = lista.filter(n => n.status === filtroStatus);
    }
    return lista;
  }

  buscarNome(termo: string): NamingItem[] {
    const t = termo.toLowerCase();
    return mockNames.filter(
      n =>
        n.nomeOficial.toLowerCase().includes(t) ||
        n.slugSistema.toLowerCase().includes(t) ||
        n.aliases.some(a => a.toLowerCase().includes(t))
    );
  }

  obterNome(id: string): NamingItem | undefined {
    return mockNames.find(n => n.id === id);
  }

  // ---- Estatísticas ----

  obterResumo() {
    return {
      total: mockNames.length,
      aprovados: mockNames.filter(n => n.status === 'aprovado').length,
      pendentes: mockNames.filter(n => n.status === 'pendente').length,
      emAjuste: mockNames.filter(n => n.status === 'em_ajuste').length,
      conflitosAbertos: mockConflicts.filter(c => c.status === 'aberto').length,
      totalDecisoes: mockDecisions.length,
      candidatosVarredura: mockScanResults.filter(s => !s.jaCatalogado).length
    };
  }

  // ---- Conflitos ----

  listarConflitos(): NamingConflict[] {
    return [...mockConflicts];
  }

  // ---- Decisões ----

  listarDecisoes(): NamingDecision[] {
    return [...mockDecisions].sort((a, b) => b.data.localeCompare(a.data));
  }

  // ---- Varredura ----

  listarCandidatos(): NamingScanResult[] {
    return [...mockScanResults];
  }

  aprovarNome(itemId: string, justificativa: string, por: string): NamingDecision {
    const item = mockNames.find(n => n.id === itemId);
    if (item) {
      item.status = 'aprovado';
      item.aprovadoPor = por;
      item.ultimaAtualizacao = new Date().toISOString().split('T')[0];
    }
    const decisao: NamingDecision = {
      id: `d${Date.now()}`,
      itemId,
      decisao: 'aprovado',
      justificativa,
      decididoPor: por,
      data: new Date().toISOString().split('T')[0]
    };
    mockDecisions.push(decisao);
    return decisao;
  }

  solicitarAjuste(itemId: string, justificativa: string, por: string): NamingDecision {
    const item = mockNames.find(n => n.id === itemId);
    if (item) {
      item.status = 'em_ajuste';
      item.ultimaAtualizacao = new Date().toISOString().split('T')[0];
    }
    const decisao: NamingDecision = {
      id: `d${Date.now()}`,
      itemId,
      decisao: 'ajustar',
      justificativa,
      decididoPor: por,
      data: new Date().toISOString().split('T')[0]
    };
    mockDecisions.push(decisao);
    return decisao;
  }
}

export const nicNamingService = new NicNamingService();
