// ============================================================
// Testes — Tipos expandidos da Central de Padrões (T2.2)
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_GATES,
  CENTRAL_PERMISSION_MATRIX,
  CENTRAL_STATUS_LABELS,
  CENTRAL_STATUS_COLORS,
} from '../types';

describe('CentralStandardStatus — 11 níveis', () => {
  it('deve ter exatamente 11 status definidos', () => {
    const labels = Object.keys(CENTRAL_STATUS_LABELS);
    expect(labels).toHaveLength(11);
  });

  it('deve conter todos os status canônicos', () => {
    expect(Object.keys(CENTRAL_STATUS_LABELS)).toEqual(
      expect.arrayContaining([
        'bruto', 'rascunho', 'em_revisao', 'em_curadoria', 'homologado',
        'canonico_operacional', 'canonico_oficial', 'publicado',
        'obsoleto', 'arquivado', 'bloqueado'
      ])
    );
  });

  it('deve ter labels amigáveis para cada status', () => {
    expect(CENTRAL_STATUS_LABELS.bruto).toBe('Bruto');
    expect(CENTRAL_STATUS_LABELS.canonico_operacional).toBe('Canônico Operacional');
    expect(CENTRAL_STATUS_LABELS.canonico_oficial).toBe('Canônico Oficial');
    expect(CENTRAL_STATUS_LABELS.publicado).toBe('Publicado');
    expect(CENTRAL_STATUS_LABELS.bloqueado).toBe('Bloqueado');
  });

  it('cada status deve ter uma cor definida', () => {
    const keys = Object.keys(CENTRAL_STATUS_LABELS);
    keys.forEach((key) => {
      expect(CENTRAL_STATUS_COLORS[key as keyof typeof CENTRAL_STATUS_COLORS]).toBeDefined();
      expect(CENTRAL_STATUS_COLORS[key as keyof typeof CENTRAL_STATUS_COLORS]).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe('CentralProfileRole — 7 papéis', () => {
  it('deve conter todos os 7 perfis na matriz de permissões', () => {
    expect(Object.keys(CENTRAL_PERMISSION_MATRIX)).toHaveLength(7);
    expect(Object.keys(CENTRAL_PERMISSION_MATRIX)).toEqual(
      expect.arrayContaining([
        'leitor', 'editor', 'curador', 'aprovador', 'administrador',
        'agente_autorizado', 'auditor'
      ])
    );
  });

  it('leitor deve ter apenas visualizar', () => {
    expect(CENTRAL_PERMISSION_MATRIX.leitor).toEqual(['visualizar']);
  });

  it('administrador deve ter todas as ações', () => {
    const adminActions = CENTRAL_PERMISSION_MATRIX.administrador;
    expect(adminActions).toContain('visualizar');
    expect(adminActions).toContain('criar_rascunho');
    expect(adminActions).toContain('aprovar_padrao');
    expect(adminActions).toContain('publicar_padrao');
    expect(adminActions).toContain('executar_agente');
    expect(adminActions).toContain('ver_logs');
  });

  it('agente_autorizado deve ter visualizar + executar_agente', () => {
    expect(CENTRAL_PERMISSION_MATRIX.agente_autorizado).toEqual(
      expect.arrayContaining(['visualizar', 'executar_agente'])
    );
  });

  it('auditor deve ter visualizar + ver_logs', () => {
    expect(CENTRAL_PERMISSION_MATRIX.auditor).toEqual(
      expect.arrayContaining(['visualizar', 'ver_logs'])
    );
  });
});

describe('Canonical Gates', () => {
  it('deve ter gates definidos para transições principais', () => {
    expect(CANONICAL_GATES.length).toBeGreaterThan(5);

    // Verificar gate bruto → rascunho
    const gate = CANONICAL_GATES.find((g) => g.from === 'bruto' && g.to === 'rascunho');
    expect(gate).toBeDefined();
    expect(gate!.requiredRole).toBe('editor');
    expect(gate!.logMandatory).toBe(true);
  });

  it('gate canonico_operacional → canonico_oficial exige validação Pietro', () => {
    const gate = CANONICAL_GATES.find((g) => g.from === 'canonico_operacional' && g.to === 'canonico_oficial');
    expect(gate).toBeDefined();
    expect(gate!.requiresPietroValidation).toBe(true);
    expect(gate!.requiredRole).toBe('administrador');
  });

  it('gate homologado → canonico_operacional exige evidência e aprovação', () => {
    const gate = CANONICAL_GATES.find((g) => g.from === 'homologado' && g.to === 'canonico_operacional');
    expect(gate).toBeDefined();
    expect(gate!.requiresEvidence).toBe(true);
    expect(gate!.requiresApproval).toBe(true);
  });

  it('qualquer status pode ir para bloqueado', () => {
    const blockedGates = CANONICAL_GATES.filter((g) => g.to === 'bloqueado');
    expect(blockedGates.length).toBeGreaterThanOrEqual(2);
    blockedGates.forEach((g) => {
      expect(g.requiresEvidence).toBe(false);
    });
  });
});

describe('CentralAction — tipagem', () => {
  it('deve ter pelo menos 9 ações definidas', () => {
    const allActions: Set<string> = new Set();
    Object.values(CENTRAL_PERMISSION_MATRIX).forEach((actions) => {
      actions.forEach((a) => allActions.add(a));
    });
    expect(allActions.size).toBeGreaterThanOrEqual(9);
    expect(allActions).toContain('visualizar');
    expect(allActions).toContain('aprovar_padrao');
    expect(allActions).toContain('executar_agente');
  });
});
