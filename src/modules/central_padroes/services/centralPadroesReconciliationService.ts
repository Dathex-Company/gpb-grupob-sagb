// ============================================================
// Serviço de Reconciliação — Central de Padrões (T2.1)
// ============================================================
// Compara fallback local com Supabase e gera relatório de divergências.

import { centralPadroesRepository } from './centralPadroesRepository';
import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralRepositorySnapshot } from '../types';

export interface ReconciliationDiff {
  entityType: string;
  field: string;
  entityId: string;
  entityKey: string;
  fallbackValue: unknown;
  supabaseValue: unknown;
  driftType: 'missing_in_supabase' | 'missing_in_fallback' | 'value_mismatch';
}

export interface ReconciliationReport {
  timestamp: string;
  totalDiffs: number;
  diffs: ReconciliationDiff[];
  summary: {
    onlyInFallback: Record<string, number>;
    onlyInSupabase: Record<string, number>;
    mismatched: Record<string, number>;
  };
}

const compareArrays = (a: unknown, b: unknown): boolean => {
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
};

const compareField = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) return compareArrays(a, b);
  return a === b;
};

export const centralPadroesReconciliationService = {
  /**
   * Compara o fallback local com o Supabase e retorna relatório de divergências.
   */
  async generateReport(): Promise<ReconciliationReport> {
    const diffs: ReconciliationDiff[] = [];
    const supabase = await centralPadroesRepository.getSnapshot();

    const onlyInFallback: Record<string, number> = {};
    const onlyInSupabase: Record<string, number> = {};
    const mismatched: Record<string, number> = {};

    // Função auxiliar para comparar entidades
    const compareEntities = (
      entityType: string,
      fallbackItems: any[],
      supabaseItems: any[],
      idField: string,
      compareFields: string[]
    ) => {
      const fallbackById = new Map(fallbackItems.map((item) => [item[idField], item]));
      const supabaseById = new Map(supabaseItems.map((item) => [item[idField] || item.id, item]));

      // Itens apenas no fallback
      for (const [id, item] of fallbackById) {
        if (!supabaseById.has(id)) {
          diffs.push({
            entityType,
            field: idField,
            entityId: id,
            entityKey: item.key || item.title || id,
            fallbackValue: item,
            supabaseValue: null,
            driftType: 'missing_in_supabase',
          });
          onlyInFallback[entityType] = (onlyInFallback[entityType] || 0) + 1;
        }
      }

      // Itens apenas no Supabase
      for (const [id, item] of supabaseById) {
        if (!fallbackById.has(id)) {
          diffs.push({
            entityType,
            field: idField,
            entityId: id,
            entityKey: item.key || item.title || id,
            fallbackValue: null,
            supabaseValue: item,
            driftType: 'missing_in_fallback',
          });
          onlyInSupabase[entityType] = (onlyInSupabase[entityType] || 0) + 1;
        }
      }

      // Comparação de campos para itens que existem em ambos
      for (const [id, fbItem] of fallbackById) {
        const sbItem = supabaseById.get(id);
        if (!sbItem) continue;

        for (const field of compareFields) {
          const fbVal = fbItem[field] ?? fbItem[field.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];
          const sbVal = sbItem[field] ?? sbItem[field.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];
          if (fbVal !== undefined && sbVal !== undefined && !compareField(fbVal, sbVal)) {
            diffs.push({
              entityType,
              field,
              entityId: id,
              entityKey: fbItem.key || fbItem.title || id,
              fallbackValue: fbVal,
              supabaseValue: sbVal,
              driftType: 'value_mismatch',
            });
            mismatched[entityType] = (mismatched[entityType] || 0) + 1;
          }
        }
      }
    };

    // Comparar áreas
    compareEntities('areas', centralPadroesFallbackData.areas, supabase.areas, 'id', ['name', 'owner', 'focus']);

    // Comparar standards
    compareEntities('standards', centralPadroesFallbackData.standards, supabase.standards, 'id', [
      'key', 'title', 'type', 'status', 'areaId', 'owner', 'summary', 'risk', 'version',
    ]);

    // Comparar documentos
    compareEntities('documents', centralPadroesFallbackData.documents, supabase.documents, 'id', [
      'title', 'path', 'status', 'category', 'areaId',
    ]);

    // Comparar decisões
    compareEntities('decisions', centralPadroesFallbackData.decisions, supabase.decisions, 'id', [
      'title', 'status', 'areaId', 'summary',
    ]);

    // Comparar checklists
    compareEntities('checklists', centralPadroesFallbackData.checklists, supabase.checklists, 'id', [
      'title', 'context', 'owner',
    ]);

    // Comparar módulos
    compareEntities('modules', centralPadroesFallbackData.modules, supabase.modules, 'id', [
      'moduleId', 'moduleName', 'kind', 'status',
    ]);

    // Comparar módulos base
    compareEntities('baseModules', centralPadroesFallbackData.baseModules, supabase.baseModules, 'id', [
      'name', 'moduleType', 'status', 'owner',
    ]);

    // Comparar agentes
    compareEntities('agents', centralPadroesFallbackData.agents, supabase.agents, 'id', [
      'agentCode', 'agentName', 'block', 'status',
    ]);

    return {
      timestamp: new Date().toISOString(),
      totalDiffs: diffs.length,
      diffs,
      summary: { onlyInFallback, onlyInSupabase, mismatched },
    };
  },

  /**
   * Gera relatório em formato Markdown.
   */
  async generateMarkdownReport(): Promise<string> {
    const report = await this.generateReport();
    const lines: string[] = [];

    lines.push('# Relatório de Reconciliação — Central de Padrões');
    lines.push('');
    lines.push(`**Data/Hora:** ${report.timestamp}`);
    lines.push(`**Total de divergências:** ${report.totalDiffs}`);
    lines.push('');

    lines.push('## Resumo');
    lines.push('');
    lines.push('| Tipo | Apenas no Fallback | Apenas no Supabase | Valores Divergentes |');
    lines.push('|---|---|---|---|');

    const allTypes = new Set([
      ...Object.keys(report.summary.onlyInFallback),
      ...Object.keys(report.summary.onlyInSupabase),
      ...Object.keys(report.summary.mismatched),
    ]);

    for (const type of [...allTypes].sort()) {
      lines.push(`| ${type} | ${report.summary.onlyInFallback[type] || 0} | ${report.summary.onlyInSupabase[type] || 0} | ${report.summary.mismatched[type] || 0} |`);
    }

    if (report.diffs.length > 0) {
      lines.push('');
      lines.push('## Divergências Detalhadas');
      lines.push('');
      for (const diff of report.diffs) {
        lines.push(`### ${diff.entityType} — ${diff.entityKey} (${diff.entityId})`);
        lines.push(`- **Tipo:** ${diff.driftType}`);
        lines.push(`- **Campo:** ${diff.field}`);
        if (diff.driftType === 'missing_in_supabase') {
          lines.push('- **Estado:** Item existe no fallback mas NÃO existe no Supabase');
        } else if (diff.driftType === 'missing_in_fallback') {
          lines.push('- **Estado:** Item existe no Supabase mas NÃO existe no fallback');
        } else {
          lines.push(`- **Fallback:** \`${JSON.stringify(diff.fallbackValue)}\``);
          lines.push(`- **Supabase:** \`${JSON.stringify(diff.supabaseValue)}\``);
        }
        lines.push('');
      }
    } else {
      lines.push('');
      lines.push('**Nenhuma divergência encontrada. Fallback e Supabase estão sincronizados.**');
    }

    return lines.join('\n');
  },

  /**
   * Reconcilia divergências aplicando merge prioritário.
   * @param direction 'fallback_to_supabase' | 'supabase_to_fallback'
   */
  async reconcile(direction: 'fallback_to_supabase' | 'supabase_to_fallback' = 'fallback_to_supabase'): Promise<{ applied: number; errors: string[] }> {
    const report = await this.generateReport();
    let applied = 0;
    const errors: string[] = [];

    // O merge real depende do Supabase estar online e do serviço CRUD.
    // Por enquanto, registramos as divergências e retornamos o relatório.
    if (direction === 'fallback_to_supabase') {
      // Lógica futura: chamar seedService para itens onlyInFallback
      console.info(`[reconciliation] Reconciliação pendente: ${report.totalDiffs} divergências detectadas.`);
      console.info(`[reconciliation] Itens apenas no fallback: ${JSON.stringify(report.summary.onlyInFallback)}`);
    } else {
      console.info(`[reconciliation] Merge supabase→fallback registrado. ${report.totalDiffs} divergências.`);
    }

    return { applied, errors };
  },
};
