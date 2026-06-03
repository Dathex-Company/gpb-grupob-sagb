// ============================================================
// Testes — Serviço de Reconciliação (T2.2)
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { centralPadroesReconciliationService, ReconciliationDiff } from '../services/centralPadroesReconciliationService';
import { centralPadroesFallbackData } from '../data/fallbackData';

// Mock do repository
vi.mock('../services/centralPadroesRepository', () => ({
  centralPadroesRepository: {
    getSnapshot: vi.fn().mockResolvedValue({
      areas: [],
      standards: [],
      documents: [],
      checklists: [],
      decisions: [],
      modules: [],
      baseModules: [],
      agents: [],
      isOnline: false,
    }),
  },
}));

describe('centralPadroesReconciliationService', () => {
  describe('generateReport()', () => {
    it('retorna relatório com timestamp', async () => {
      const report = await centralPadroesReconciliationService.generateReport();
      expect(report).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(new Date(report.timestamp).toISOString()).toBe(report.timestamp);
    });

    it('identifica itens apenas no fallback quando Supabase vazio', async () => {
      const report = await centralPadroesReconciliationService.generateReport();
      expect(report.totalDiffs).toBeGreaterThan(0);
      expect(report.summary.onlyInFallback).toBeDefined();
      // Fallback tem áreas, standards, etc. — todos devem estar "apenas no fallback"
      expect(report.summary.onlyInFallback.areas).toBe(centralPadroesFallbackData.areas.length);
    });
  });

  describe('generateMarkdownReport()', () => {
    it('gera relatório em markdown', async () => {
      const markdown = await centralPadroesReconciliationService.generateMarkdownReport();
      expect(markdown).toContain('# Relatório de Reconciliação');
      expect(markdown).toContain('Central de Padrões');
      expect(markdown).toContain('## Resumo');
    });
  });

  describe('reconcile()', () => {
    it('registra reconciliação sem erros', async () => {
      const result = await centralPadroesReconciliationService.reconcile('fallback_to_supabase');
      expect(result.errors).toHaveLength(0);
      expect(result.applied).toBe(0); // Nenhum merge automático ainda
    });
  });
});
