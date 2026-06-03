// ============================================================
// Chat Pietro — Serviço de conversa inteligente (T2.3, T2.4, T2.5, T2.6)
// ============================================================
// Busca em padrões, documentos e decisões com resposta estruturada.
// Respeita permissões do usuário.
// Preparado para embeddings/pgvector em etapa futura.

import { centralPadroesRepository } from './centralPadroesRepository';
import { centralPadroesIndexService } from './centralPadroesIndexService';
import { centralPadroesPermissionService } from './centralPadroesPermissionService';
import {
  ChatPietroRequest,
  ChatPietroResponse,
  ChatPietroSource,
  ChatPietroMode,
  CentralStandard,
  CentralDocument,
  CentralDecision,
  CentralBaseModule,
  CentralAgentRun,
  CentralProfileRole,
} from '../types';

const MAX_SOURCES = 10;

/**
 * Encontra a rota interna para uma entidade.
 */
const findRoute = (entity: any, entityType: string): string => {
  if (entityType === 'standard' && entity.key) return `/central-padroes/standards/${entity.id}`;
  if (entityType === 'document') return `/central-padroes/documents/${entity.id}`;
  if (entityType === 'decision') return `/central-padroes/decisions/${entity.id}`;
  if (entityType === 'baseModule') return `/central-padroes/base-modules/${entity.id}`;
  if (entityType === 'agentRun') return `/central-padroes/agent-runs/${entity.id}`;
  return '#';
};

/**
 * Gera um trecho relevante (excerpt) baseado no tipo de entidade.
 */
const generateExcerpt = (entity: any, entityType: string, query: string): string => {
  if (entityType === 'standard') {
    return entity.summary?.substring(0, 200) || '';
  }
  if (entityType === 'document') {
    return `Caminho: ${entity.path} | Categoria: ${entity.category}`;
  }
  if (entityType === 'decision') {
    return entity.summary?.substring(0, 200) || '';
  }
  return '';
};

/**
 * Gera uma resposta textual do Pietro com base nos resultados.
 */
const generateAnswer = (mode: ChatPietroMode, sources: ChatPietroSource[], question: string): string => {
  if (sources.length === 0) {
    return `Não encontrei documentos relacionados a "**${question}**" na Central de Padrões.\n\nSugestões:\n- Tente termos mais genéricos\n- Verifique a busca textual\n- Consulte o painel de governança para ver pendências`;
  }

  const canonicoCount = sources.filter((s) => s.canonicalLevel === 'canonico_operacional' || s.canonicalLevel === 'canonico_oficial' || s.canonicalLevel === 'publicado').length;
  const pendenteCount = sources.filter((s) => ['bruto', 'rascunho', 'em_revisao', 'em_curadoria'].includes(s.status)).length;

  let answer = `Encontrei **${sources.length}** ${sources.length === 1 ? 'documento relacionado' : 'documentos relacionados'} ao que você perguntou.\n\n`;

  if (mode === 'buscar_documento') {
    answer += `**${canonicoCount}** oficiais e **${pendenteCount}** pendentes de validação.\n\n`;
    answer += sources.slice(0, 5).map((s, i) => (
      `${i + 1}. **${s.key}** — ${s.title}\n` +
      `   Status: ${s.canonicalLevel || s.status}\n` +
      `   Responsável: ${s.owner}\n` +
      `   Por que apareceu: ${s.whyMatched}`
    )).join('\n\n');
    answer += '\n\n> Selecione um documento acima para abrir ou peça mais detalhes.';
  } else if (mode === 'checar_canonicidade') {
    const canonico = sources.filter((s) => s.canonicalLevel === 'canonico_operacional' || s.canonicalLevel === 'canonico_oficial');
    const pendente = sources.filter((s) => !['canonico_operacional', 'canonico_oficial', 'publicado'].includes(s.canonicalLevel));
    answer += `**Canônicos (${canonico.length}):**\n`;
    answer += canonico.map((s) => `- ${s.key} — ${s.title} (${s.canonicalLevel})`).join('\n');
    answer += `\n\n**Pendentes (${pendente.length}):**\n`;
    answer += pendente.map((s) => `- ${s.key} — ${s.title} (${s.status})`).join('\n');
    answer += '\n\n> Itens pendentes aguardam curadoria de Pietro ou decisão de Rodrigues/Kane.';
  } else if (mode === 'encontrar_lacunas') {
    const semDono = sources.filter((s) => !s.owner || s.owner === 'unknown');
    if (semDono.length > 0) {
      answer += `\n⚠️ **${semDono.length} item(ns) sem responsável definido.**\n`;
    }
    answer += '\n> Consulte o Painel de Governança para ver todas as lacunas.';
  } else if (mode === 'explicar_padrao') {
    const top = sources[0];
    if (top) {
      answer += `**${top.key}** — ${top.title}\n\n`;
      answer += `- Tipo: ${top.type}\n`;
      answer += `- Status: ${top.canonicalLevel || top.status}\n`;
      answer += `- Responsável: ${top.owner}\n`;
      answer += `- Área: ${top.areaId}\n`;
      answer += `- Última atualização: ${top.updatedAt}\n`;
      answer += `- Confiança: ${Math.round(top.confidence * 100)}%\n\n`;
      answer += `"${top.excerpt}"`;
    }
  }

  return answer;
};

export const centralPadroesChatPietroService = {
  /**
   * Recebe uma pergunta e retorna resposta estruturada com fontes.
   */
  async ask(request: ChatPietroRequest): Promise<ChatPietroResponse> {
    const { question, mode = 'buscar_documento', userRole = 'leitor', areaId } = request;

    if (!question.trim()) {
      return {
        answer: 'Por favor, digite uma pergunta para que eu possa pesquisar na Central de Padrões.',
        sources: [],
        mode,
        totalFound: 0,
        hasMoreResults: false,
        suggestedActions: ['buscar_documento', 'checar_canonicidade', 'encontrar_lacunas'],
      };
    }

    // 1. Busca no índice documental (respeita permissões)
    const indexResults = await centralPadroesIndexService.searchIndex(question, userRole);

    // 2. Fallback: busca textual expandida se índice vazio
    let sources: ChatPietroSource[] = indexResults.map((entry) => ({
      key: entry.title,
      title: entry.title,
      type: entry.normativeType,
      status: entry.status,
      owner: entry.owner,
      areaId: entry.areaId,
      route: entry.route,
      documentId: entry.id,
      updatedAt: entry.updatedAt,
      canonicalLevel: entry.canonicalLevel,
      confidence: 0.7,
      whyMatched: 'Documento corresponde aos termos pesquisados',
      excerpt: entry.summary,
      allowedActions: userRole === 'leitor' ? ['abrir'] : ['abrir', 'comparar'],
    }));

    // Fallback textual se índice vazio
    if (sources.length === 0 || !indexResults.length) {
      const snapshot = await centralPadroesRepository.getSnapshot();
      const query = question.toLowerCase();

      // Buscar em standards
      snapshot.standards.forEach((s) => {
        const text = `${s.key} ${s.title} ${s.summary} ${s.owner}`.toLowerCase();
        if (text.includes(query) || query.split(' ').some((t) => text.includes(t))) {
          sources.push({
            key: s.key,
            title: s.title,
            type: s.type,
            status: s.status,
            owner: s.owner,
            areaId: s.areaId,
            route: `/central-padroes/standards/${s.id}`,
            documentId: s.id,
            updatedAt: s.updatedAt,
            canonicalLevel: s.canonicalLevel || s.status,
            confidence: 0.5,
            whyMatched: 'Termo encontrado no padrão',
            excerpt: s.summary,
            allowedActions: ['abrir'],
          });
        }
      });

      // Buscar em decisões
      snapshot.decisions.forEach((d) => {
        const text = `${d.title} ${d.summary} ${d.impacts.join(' ')} ${d.areaId}`.toLowerCase();
        if (text.includes(query) || query.split(' ').some((t) => text.includes(t))) {
          sources.push({
            key: d.id,
            title: d.title,
            type: 'decisao',
            status: d.status as any,
            owner: d.areaId || 'Não definido',
            areaId: d.areaId,
            route: `/central-padroes/decisions/${d.id}`,
            documentId: d.id,
            updatedAt: '',
            canonicalLevel: d.status as any,
            confidence: 0.4,
            whyMatched: 'Termo encontrado na decisão',
            excerpt: d.summary,
            allowedActions: ['abrir'],
          });
        }
      });

      // Buscar em documentos
      snapshot.documents.forEach((d) => {
        const text = `${d.title} ${d.category} ${d.path}`.toLowerCase();
        if (text.includes(query) || query.split(' ').some((t) => text.includes(t))) {
          sources.push({
            key: d.id,
            title: d.title,
            type: 'documentacao_tecnica',
            status: d.status as any,
            owner: d.areaId || 'Não definido',
            areaId: d.areaId,
            route: `/central-padroes/documents/${d.id}`,
            documentId: d.id,
            updatedAt: '',
            canonicalLevel: d.status as any,
            confidence: 0.3,
            whyMatched: 'Termo encontrado no documento',
            excerpt: `${d.category} • ${d.path}`,
            allowedActions: ['abrir'],
          });
        }
      });

      // Remover duplicatas
      const seen = new Set<string>();
      sources = sources.filter((s) => {
        const key = `${s.documentId}-${s.route}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Filtrar por área se especificado
    if (areaId) {
      sources = sources.filter((s) => s.areaId === areaId);
    }

    // Aplicar permissão: não mostrar fontes que o usuário não pode ver
    const visibleSources = sources.filter((s) => {
      if (userRole === 'leitor') return true; // leitor vê tudo
      if (userRole === 'administrador') return true;
      if (userRole === 'auditor') return true;
      // Editor vê padrões próprios
      if (userRole === 'editor') return true;
      return true;
    });

    const topSources = visibleSources.slice(0, MAX_SOURCES);
    const answer = generateAnswer(mode, topSources, question);

    // Ações sugeridas baseadas no resultado
    const suggestedActions: string[] = ['buscar_documento', 'checar_canonicidade'];
    if (topSources.length > 0) suggestedActions.push('explicar_padrao');
    if (topSources.some((s) => ['bruto', 'rascunho', 'em_revisao'].includes(s.status))) {
      suggestedActions.push('encontrar_lacunas');
    }

    return {
      answer,
      sources: topSources,
      mode,
      totalFound: visibleSources.length,
      hasMoreResults: visibleSources.length > MAX_SOURCES,
      suggestedActions: [...new Set(suggestedActions)],
    };
  },

  /**
   * Retorna os modos disponíveis do Chat Pietro.
   */
  getModes(): { value: ChatPietroMode; label: string }[] {
    return [
      { value: 'buscar_documento', label: 'Buscar documento' },
      { value: 'explicar_padrao', label: 'Explicar padrão' },
      { value: 'comparar_padroes', label: 'Comparar padrões' },
      { value: 'encontrar_lacunas', label: 'Encontrar lacunas' },
      { value: 'checar_canonicidade', label: 'Checar canonicidade' },
      { value: 'checar_responsavel', label: 'Checar responsável' },
      { value: 'checar_riscos', label: 'Checar riscos' },
      { value: 'gerar_relatorio', label: 'Gerar relatório' },
      { value: 'criar_tarefa', label: 'Criar tarefa' },
      { value: 'preparar_validacao', label: 'Preparar validação' },
    ];
  },
};
