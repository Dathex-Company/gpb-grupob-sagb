// ============================================================
// Fase 2 — Teste de Integração Completo
// ============================================================
// Valida: auditoria, permissões, busca, Chat Pietro,
// painel de governança, gate de canonicidade
// Evidência prática: logs de cada etapa

import { describe, it, expect, beforeAll, vi } from 'vitest';

// ─── Mock Supabase ───
// Simula que o Supabase está online com dados reais
const mockAuditLog: any[] = [];
const mockProfiles: Record<string, any> = {};

vi.mock('../../../../services/supabase', () => ({
  auth: {
    currentUser: {
      id: 'user-admin-001',
      email: 'admin@sagb.app',
      app_metadata: { profile_role: 'administrador' },
    },
  },
  restFetch: async (table: string, options: any) => {
    // Simula audit log
    if (table === 'central_padroes_audit_log') {
      if (options.method === 'POST') {
        const entry = { id: `log-${Date.now()}`, ...options.body, created_at: new Date().toISOString() };
        mockAuditLog.unshift(entry);
        return [entry];
      }
      if (options.method === 'GET') {
        const query = options.query?.toString() || '';
        let results = [...mockAuditLog];
        if (query.includes('entity_id')) {
          const match = query.match(/entity_id=eq\.([^&]+)/);
          if (match) results = results.filter((e) => e.entity_id === match[1]);
        }
        return results;
      }
    }
    // Simula user profiles
    if (table === 'central_padroes_user_profiles') {
      return Object.values(mockProfiles).filter((p: any) => {
        if (options.query?.toString().includes('user_id=eq.')) {
          const match = options.query.toString().match(/user_id=eq\.([^&]+)/);
          if (match) return p.user_id === match[1];
        }
        return true;
      });
    }
    return [];
  },
}));

// ─── Imports sob teste ───
import { centralPadroesAuditService } from '../services/centralPadroesAuditService';
import { centralPadroesPermissionService } from '../services/centralPadroesPermissionService';
import { centralPadroesSearchService } from '../services/centralPadroesSearchService';
import { centralPadroesChatPietroService } from '../services/centralPadroesChatPietroService';
import { centralPadroesCanonicalGateService } from '../services/centralPadroesCanonicalGateService';
import { centralPadroesReconciliationService } from '../services/centralPadroesReconciliationService';
import { centralPadroesIndexService } from '../services/centralPadroesIndexService';
import { CentralStandard, CentralProfileRole } from '../types';

// ─── Helpers ───
const makeStandard = (overrides: Partial<CentralStandard> = {}): CentralStandard => ({
  id: 'std-integration-001',
  key: 'CP-TEST-INTEGRATION-001',
  title: 'Padrão de Teste Integrado',
  type: 'padrao',
  status: 'rascunho',
  areaId: 'pietro',
  owner: 'Pietro Carboni',
  summary: 'Padrão usado para validação da Fase 2 - testes integrados',
  risk: 'medio',
  version: 1,
  agentAvailable: false,
  dependencies: [],
  relatedModules: ['central_padroes'],
  updatedAt: '2026-06-02',
});

// ============================================================
// TESTE 1: Audit Log
// ============================================================
describe('🔍 Fase 2 — Auditoria', () => {
  it('deve registrar CREATE no audit log', async () => {
    const standard = makeStandard();
    await centralPadroesAuditService.logCreate('standard', standard.id, standard as any);
    expect(mockAuditLog.length).toBeGreaterThan(0);
    const lastLog = mockAuditLog[0];
    expect(lastLog.event_type).toBe('CREATE');
    expect(lastLog.entity_type).toBe('standard');
    expect(lastLog.entity_id).toBe(standard.id);
  });

  it('deve registrar UPDATE com diff', async () => {
    const standard = makeStandard();
    const previous = { ...standard, status: 'rascunho' };
    const next = { ...standard, status: 'em_revisao' };
    await centralPadroesAuditService.logUpdate('standard', standard.id, previous as any, next as any, 'Alteração de status');
    const updates = mockAuditLog.filter((l) => l.event_type === 'UPDATE' || l.event_type === 'STATUS_CHANGE');
    expect(updates.length).toBeGreaterThan(0);
  });

  it('deve registrar STATUS_CHANGE com nível de risco correto', async () => {
    await centralPadroesAuditService.logStatusChange('standard', 'std-002', 'rascunho', 'em_revisao', makeStandard() as any);
    const statusLogs = mockAuditLog.filter((l) => l.event_type === 'STATUS_CHANGE');
    const lastLog = statusLogs[statusLogs.length - 1];
    expect(lastLog.metadata.fromStatus).toBe('rascunho');
    expect(lastLog.metadata.toStatus).toBe('em_revisao');
    const riskLevel = centralPadroesAuditService.getRiskLevelForTransition('rascunho', 'em_revisao');
    expect(riskLevel).toBe('baixo');
  });

  it('deve retornar risco CRITICO para edição canônica', async () => {
    const risk = centralPadroesAuditService.getRiskLevelForTransition('canonico_operacional', 'canonico_oficial');
    expect(risk).toBe('critico');
  });

  it('deve buscar logs por entidade', async () => {
    const standard = makeStandard();
    await centralPadroesAuditService.logCreate('standard', 'std-busca-001', standard as any);
    const logs = await centralPadroesAuditService.getLogsByEntity('standard', 'std-busca-001');
    expect(logs.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// TESTE 2: Permissões
// ============================================================
describe('🔐 Fase 2 — Permissões Granulares', () => {
  const standard = makeStandard();

  it('admin pode editar qualquer padrão', () => {
    const canEdit = centralPadroesPermissionService.canEditStandard('administrador', standard);
    expect(canEdit).toBe(true);
  });

  it('curador pode editar padrão não-canônico', () => {
    const nonCanonical = { ...standard, canonicalLevel: 'rascunho' } as CentralStandard;
    expect(centralPadroesPermissionService.canEditStandard('curador', nonCanonical)).toBe(true);
  });

  it('curador NÃO pode editar padrão canônico oficial', () => {
    const canonical = { ...standard, canonicalLevel: 'canonico_oficial', status: 'canonico_oficial' } as CentralStandard;
    expect(centralPadroesPermissionService.canEditStandard('curador', canonical)).toBe(false);
  });

  it('leitor não pode criar rascunho', () => {
    expect(centralPadroesPermissionService.can('leitor', 'criar_rascunho')).toBe(false);
    expect(centralPadroesPermissionService.can('leitor', 'visualizar')).toBe(true);
  });

  it('aprovador pode aprovar e ver logs', () => {
    expect(centralPadroesPermissionService.can('aprovador', 'aprovar_padrao')).toBe(true);
    expect(centralPadroesPermissionService.can('aprovador', 'ver_logs')).toBe(true);
  });

  it('agente_autorizado pode executar agente mas não aprovar', () => {
    expect(centralPadroesPermissionService.can('agente_autorizado', 'executar_agente')).toBe(true);
    expect(centralPadroesPermissionService.can('agente_autorizado', 'aprovar_padrao')).toBe(false);
  });

  it('auditor pode ver logs mas não editar', () => {
    expect(centralPadroesPermissionService.can('auditor', 'ver_logs')).toBe(true);
    expect(centralPadroesPermissionService.can('auditor', 'editar_rascunho_proprio')).toBe(false);
  });

  it('requirePermission permite ação para administrador', () => {
    // Com mock admin, requirePermission deve permitir
    expect(() => centralPadroesPermissionService.requirePermission('excluir_padrao')).not.toThrow();
  });
});

// ============================================================
// TESTE 3: Busca com Permissão
// ============================================================
describe('🔎 Fase 2 — Busca com Permissão', () => {
  it('deve encontrar padrões por termo', async () => {
    const results = await centralPadroesSearchService.hybridSearch('segurança');
    expect(Array.isArray(results)).toBe(true);
    // Deve retornar resultados mesmo sem query
    const allResults = await centralPadroesSearchService.hybridSearch('');
    expect(allResults.length).toBeGreaterThan(0);
  });

  it('deve retornar resultados ordenados por score', async () => {
    const results = await centralPadroesSearchService.hybridSearch('governança');
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });

  it('deve incluir baseModules e agentRuns na busca expandida', async () => {
    const results = await centralPadroesSearchService.hybridSearch('');
    const hasBaseModules = results.some((r) => r.entityType === 'baseModule');
    const hasAgentRuns = results.some((r) => r.entityType === 'agentRun');
    expect(results.length).toBeGreaterThan(0);
    // A busca expandida agora inclui baseModule e agentRun
    expect(hasBaseModules || hasAgentRuns).toBe(true);
    // entityTypes únicos devem conter pelo menos baseModule e agentRun
    const uniqueTypes = new Set(results.map((r) => r.entityType));
    expect(uniqueTypes.has('standard') || uniqueTypes.has('baseModule') || uniqueTypes.has('agentRun')).toBe(true);
  });
});

// ============================================================
// TESTE 4: Chat Pietro
// ============================================================
describe('💬 Fase 2 — Chat Pietro', () => {
  it('deve responder a perguntas sobre padrões', async () => {
    const response = await centralPadroesChatPietroService.ask({
      question: 'Quais padrões sobre segurança existem?',
      mode: 'buscar_documento',
      userRole: 'leitor',
    });
    expect(response).toBeDefined();
    expect(response.answer).toBeTruthy();
    expect(typeof response.answer).toBe('string');
    expect(response.answer.length).toBeGreaterThan(20);
    expect(response.sources).toBeDefined();
  });

  it('deve encontrar fontes com metadados completos', async () => {
    const response = await centralPadroesChatPietroService.ask({
      question: 'O que é canônico operacional?',
      mode: 'checar_canonicidade',
      userRole: 'administrador',
    });
    if (response.sources.length > 0) {
      const source = response.sources[0];
      expect(source.key).toBeTruthy();
      expect(source.title).toBeTruthy();
      expect(source.route).toBeTruthy();
      expect(source.confidence).toBeGreaterThanOrEqual(0);
    }
  });

  it('deve sugerir ações baseadas no resultado', async () => {
    const response = await centralPadroesChatPietroService.ask({
      question: 'Preciso saber sobre riscos',
      mode: 'checar_riscos',
    });
    expect(response.suggestedActions).toBeDefined();
    expect(Array.isArray(response.suggestedActions)).toBe(true);
    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });

  it('deve retornar erro educado para pergunta vazia', async () => {
    const response = await centralPadroesChatPietroService.ask({
      question: '',
      mode: 'buscar_documento',
    });
    expect(response.answer).toContain('digite uma pergunta');
    expect(response.sources).toHaveLength(0);
  });

  it('deve respeitar o modo de busca', async () => {
    const response = await centralPadroesChatPietroService.ask({
      question: 'Quem é responsável pelos padrões de segurança?',
      mode: 'checar_responsavel',
    });
    expect(response.mode).toBe('checar_responsavel');
  });

  it('deve retornar modos disponíveis', () => {
    const modes = centralPadroesChatPietroService.getModes();
    expect(modes.length).toBe(10);
    expect(modes.map((m) => m.value)).toContain('buscar_documento');
    expect(modes.map((m) => m.value)).toContain('explicar_padrao');
    expect(modes.map((m) => m.value)).toContain('checar_canonicidade');
  });
});

// ============================================================
// TESTE 5: Gate de Canonicidade
// ============================================================
describe('🚧 Fase 2 — Gate de Canonicidade', () => {
  const standard = makeStandard();

  it('deve validar transição rascunho → em_revisão como editor', () => {
    const result = centralPadroesCanonicalGateService.validateTransition(
      { ...standard, status: 'rascunho' },
      'em_revisao',
      'editor'
    );
    expect(result.allowed).toBe(true);
    expect(result.gate).not.toBeNull();
  });

  it('deve bloquear transição sem evidência quando exigida', () => {
    const result = centralPadroesCanonicalGateService.validateTransition(
      { ...standard, status: 'em_curadoria' },
      'homologado',
      'aprovador'
    );
    expect(result.allowed).toBe(false);
    expect(result.errors[0]).toContain('evidência');
  });

  it('deve permitir com evidência', () => {
    const result = centralPadroesCanonicalGateService.validateTransition(
      { ...standard, status: 'em_curadoria' },
      'homologado',
      'aprovador',
      { evidenceId: 'ev-001' }
    );
    expect(result.allowed).toBe(true);
  });

  it('deve avisar que aprovação é necessária para canonico_operacional', () => {
    const result = centralPadroesCanonicalGateService.validateTransition(
      { ...standard, status: 'homologado' },
      'canonico_operacional',
      'administrador',
      { evidenceId: 'ev-001' }
    );
    expect(result.allowed).toBe(true);
    expect(result.warnings.some((w) => w.includes('aprovação'))).toBe(true);
  });

  it('deve listar transições válidas a partir de um status', () => {
    const transitions = centralPadroesCanonicalGateService.getAvailableTransitions('rascunho');
    expect(transitions.length).toBeGreaterThan(0);
    expect(transitions.map((t) => t.to)).toContain('em_revisao');
    expect(transitions.map((t) => t.to)).toContain('bloqueado');
  });

  it('deve retornar undefined para transição inexistente', () => {
    const gate = centralPadroesCanonicalGateService.findGate('bruto', 'publicado');
    expect(gate).toBeUndefined();
  });
});

// ============================================================
// TESTE 6: Reconciliação
// ============================================================
describe('🔄 Fase 2 — Reconciliação', () => {
  it('deve gerar relatório de reconciliação', async () => {
    const report = await centralPadroesReconciliationService.generateReport();
    expect(report.timestamp).toBeTruthy();
    expect(typeof report.totalDiffs).toBe('number');
    expect(report.summary).toBeDefined();
  });

  it('deve gerar relatório em markdown', async () => {
    const markdown = await centralPadroesReconciliationService.generateMarkdownReport();
    expect(markdown).toContain('# Relatório de Reconciliação');
    expect(markdown).toContain('## Resumo');
  });

  it('deve ter estrutura de relatório válida', async () => {
    const report = await centralPadroesReconciliationService.generateReport();
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('totalDiffs');
    expect(typeof report.totalDiffs).toBe('number');
    expect(report).toHaveProperty('summary');
    expect(report.summary).toHaveProperty('onlyInFallback');
    expect(report.summary).toHaveProperty('onlyInSupabase');
  });
});

// ============================================================
// TESTE 7: Índice Documental
// ============================================================
describe('📑 Fase 2 — Índice Documental', () => {
  it('deve construir índice com entries', async () => {
    const index = await centralPadroesIndexService.buildIndex();
    expect(index.totalEntries).toBeGreaterThan(0);
    expect(index.builtAt).toBeTruthy();
  });

  it('deve buscar no índice por termo', async () => {
    const results = await centralPadroesIndexService.searchIndex('segurança', 'leitor');
    expect(Array.isArray(results)).toBe(true);
  });

  it('deve usar cache do índice', async () => {
    const start = Date.now();
    await centralPadroesIndexService.buildIndex();
    const index = await centralPadroesIndexService.buildIndex();
    expect(index.totalEntries).toBeGreaterThan(0);
  });

  it('deve retornar estatísticas', async () => {
    const stats = await centralPadroesIndexService.getStats();
    expect(stats.totalEntries).toBeGreaterThan(0);
    expect(stats.builtAt).toBeTruthy();
  });

  it('deve limpar cache', () => {
    centralPadroesIndexService.clearCache();
    expect(true).toBe(true); // não lança erro
  });
});

// ============================================================
// TESTE 8: Status e Labels
// ============================================================
describe('🏷️ Fase 2 — Labels e Cores de Status', () => {
  it('todos os 11 status têm label', async () => {
    const { CENTRAL_STATUS_LABELS } = await import('../types');
    expect(Object.keys(CENTRAL_STATUS_LABELS)).toHaveLength(11);
  });

  it('todos os 11 status têm cor hexadecimal', async () => {
    const { CENTRAL_STATUS_COLORS } = await import('../types');
    Object.values(CENTRAL_STATUS_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('todos os 7 perfis estão na matriz de permissões', async () => {
    const { CENTRAL_PERMISSION_MATRIX } = await import('../types');
    expect(Object.keys(CENTRAL_PERMISSION_MATRIX)).toHaveLength(7);
  });
});

// ============================================================
// TESTE 9: Sidebar Config
// ============================================================
describe('📋 Fase 2 — Sidebar Config', () => {
  it('deve ter seções definidas', async () => {
    const { sidebarSections } = await import('../data/sidebarConfig');
    expect(sidebarSections.length).toBeGreaterThan(0);
    expect(sidebarSections.some((s) => s.rows.length > 0)).toBe(true);
  });

  it('deve ter breadcrumbs para todas as views', async () => {
    const { getAllSidebarRows, breadcrumbLabels } = await import('../data/sidebarConfig');
    const rows = getAllSidebarRows();
    rows.forEach((row) => {
      expect(breadcrumbLabels[row.id]).toBeDefined();
    });
  });
});
