/* ============================================================
 *  Naming Schema — Tipos do módulo de governança de nomes
 *  Mantido simples e sem jargão técnico para UX limpa
 * ============================================================ */

export type NamingStatus =
  | 'aprovado'       // Nome aprovado e publicado
  | 'pendente'       // Aguardando análise
  | 'em_ajuste'      // Precisa de correção
  | 'recusado'       // Não passou na curadoria
  | 'arquivado';     // Não será usado agora

export type NamingCategory =
  | 'projeto'
  | 'produto'
  | 'empresa'
  | 'servico'
  | 'metodo'
  | 'modulo'
  | 'iniciativa'
  | 'outro';

export interface NamingItem {
  id: string;
  nomeOficial: string;
  slugSistema: string;
  categoria: NamingCategory;
  pilar: string;
  empresaVinculada: string;
  status: NamingStatus;
  aliases: string[];
  tags: string[];
  origem: string;
  anotacoes: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  aprovadoPor?: string;
}

export interface NamingConflict {
  id: string;
  nomeA: string;
  nomeB: string;
  tipoConflito: 'alias_duplicado' | 'nome_repetido' | 'categoria_divergente' | 'grafia_diferente';
  descricao: string;
  status: 'aberto' | 'resolvido' | 'ignorado';
  resolvidoEm?: string;
  resolvidoPor?: string;
  decisao?: string;
}

export interface NamingDecision {
  id: string;
  itemId: string;
  decisao: 'aprovado' | 'ajustar' | 'recusado';
  justificativa: string;
  decididoPor: string;
  data: string;
}

export interface NamingScanResult {
  nome: string;
  arquivo: string;
  projeto: string;
  confianca: 'alta' | 'media' | 'baixa';
  sugestaoCategoria: NamingCategory;
  jaCatalogado: boolean;
}

export function statusLabel(s: NamingStatus): string {
  const map: Record<NamingStatus, string> = {
    aprovado: 'Aprovado',
    pendente: 'Pendente',
    em_ajuste: 'Em Ajuste',
    recusado: 'Recusado',
    arquivado: 'Arquivado'
  };
  return map[s];
}

export function statusColor(s: NamingStatus): string {
  const map: Record<NamingStatus, string> = {
    aprovado: 'green',
    pendente: 'orange',
    em_ajuste: 'purple',
    recusado: 'red',
    arquivado: 'gray'
  };
  return map[s];
}
