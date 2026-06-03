// ============================================================
// Testes — Serviço de Permissões (T2.2)
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { centralPadroesPermissionService } from '../services/centralPadroesPermissionService';
import { CentralProfileRole, CentralStandard } from '../types';

// Mock do auth — simula um editor logado
vi.mock('../../../../services/supabase', () => ({
  auth: {
    currentUser: {
      email: 'editor@test.com',
      app_metadata: { profile_role: 'editor' },
    },
  },
}));

describe('centralPadroesPermissionService', () => {
  const makeMockStandard = (overrides: Partial<CentralStandard> = {}): CentralStandard => ({
    id: 'std-001',
    key: 'CP-TEST-001',
    title: 'Test Standard',
    type: 'padrao',
    status: 'rascunho',
    areaId: 'pietro',
    owner: 'editor@test.com',
    summary: 'Test',
    risk: 'baixo',
    version: 1,
    agentAvailable: false,
    dependencies: [],
    relatedModules: [],
    updatedAt: '2026-06-01',
    ...overrides,
  });

  describe('can()', () => {
    it('leitor só pode visualizar', () => {
      expect(centralPadroesPermissionService.can('leitor', 'visualizar')).toBe(true);
      expect(centralPadroesPermissionService.can('leitor', 'criar_rascunho')).toBe(false);
      expect(centralPadroesPermissionService.can('leitor', 'aprovar_padrao')).toBe(false);
    });

    it('administrador pode fazer qualquer ação', () => {
      expect(centralPadroesPermissionService.can('administrador', 'visualizar')).toBe(true);
      expect(centralPadroesPermissionService.can('administrador', 'criar_rascunho')).toBe(true);
      expect(centralPadroesPermissionService.can('administrador', 'aprovar_padrao')).toBe(true);
      expect(centralPadroesPermissionService.can('administrador', 'publicar_padrao')).toBe(true);
      expect(centralPadroesPermissionService.can('administrador', 'executar_agente')).toBe(true);
    });

    it('auditor pode ver logs mas não aprovar', () => {
      expect(centralPadroesPermissionService.can('auditor', 'ver_logs')).toBe(true);
      expect(centralPadroesPermissionService.can('auditor', 'aprovar_padrao')).toBe(false);
    });
  });

  describe('canEditStandard()', () => {
    it('admin pode editar qualquer padrão', () => {
      const standard = makeMockStandard({ status: 'publicado', canonicalLevel: 'publicado' });
      expect(centralPadroesPermissionService.canEditStandard('administrador', standard)).toBe(true);
    });

    it('curador pode editar padrão não-canônico', () => {
      const standard = makeMockStandard({ status: 'em_revisao' });
      expect(centralPadroesPermissionService.canEditStandard('curador', standard)).toBe(true);
    });

    it('curador NÃO pode editar padrão canônico', () => {
      const standard = makeMockStandard({ status: 'canonico_oficial', canonicalLevel: 'canonico_oficial' });
      expect(centralPadroesPermissionService.canEditStandard('curador', standard)).toBe(false);
    });

    it('editor pode editar rascunho próprio', () => {
      const standard = makeMockStandard({ status: 'rascunho', owner: 'editor@test.com' });
      expect(centralPadroesPermissionService.canEditStandard('editor', standard)).toBe(true);
    });

    it('editor NÃO pode editar rascunho de outro', () => {
      const standard = makeMockStandard({ status: 'rascunho', owner: 'outro@test.com' });
      expect(centralPadroesPermissionService.canEditStandard('editor', standard)).toBe(false);
    });

    it('leitor não pode editar nada', () => {
      const standard = makeMockStandard();
      expect(centralPadroesPermissionService.canEditStandard('leitor', standard)).toBe(false);
    });
  });

  describe('canApproveStandard()', () => {
    it('aprovador pode aprovar', () => {
      const standard = makeMockStandard();
      expect(centralPadroesPermissionService.canApproveStandard('aprovador', standard)).toBe(true);
    });

    it('agente_autorizado NÃO pode aprovar o próprio output', () => {
      const standard = makeMockStandard();
      expect(centralPadroesPermissionService.canApproveStandard('agente_autorizado', standard, 'CA-01')).toBe(false);
    });
  });

  describe('canPublishStandard()', () => {
    it('só administrador pode publicar', () => {
      expect(centralPadroesPermissionService.canPublishStandard('administrador')).toBe(true);
      expect(centralPadroesPermissionService.canPublishStandard('aprovador')).toBe(false);
      expect(centralPadroesPermissionService.canPublishStandard('curador')).toBe(false);
    });
  });

  describe('canViewLogs()', () => {
    it('auditor, admin e aprovador podem ver logs', () => {
      expect(centralPadroesPermissionService.canViewLogs('auditor')).toBe(true);
      expect(centralPadroesPermissionService.canViewLogs('administrador')).toBe(true);
      expect(centralPadroesPermissionService.canViewLogs('aprovador')).toBe(true);
    });

    it('leitor e editor não podem ver logs', () => {
      expect(centralPadroesPermissionService.canViewLogs('leitor')).toBe(false);
      expect(centralPadroesPermissionService.canViewLogs('editor')).toBe(false);
    });
  });

  describe('getAllowedActions()', () => {
    it('retorna ações corretas para cada perfil', () => {
      expect(centralPadroesPermissionService.getAllowedActions('leitor')).toContain('visualizar');
      expect(centralPadroesPermissionService.getAllowedActions('editor')).toContain('criar_rascunho');
      expect(centralPadroesPermissionService.getAllowedActions('curador')).toContain('editar_padrao_oficial');
      expect(centralPadroesPermissionService.getAllowedActions('aprovador')).toContain('aprovar_padrao');
      expect(centralPadroesPermissionService.getAllowedActions('administrador')).toContain('excluir_padrao');
    });
  });
});
