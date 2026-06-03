// ============================================================
// Testes — Gate de Canonicidade (T2.2)
// ============================================================

import { describe, it, expect } from 'vitest';
import { centralPadroesCanonicalGateService } from '../services/centralPadroesCanonicalGateService';
import { CentralStandard, CentralProfileRole } from '../types';

const makeStandard = (overrides: Partial<CentralStandard> = {}): CentralStandard => ({
  id: 'std-001',
  key: 'CP-TEST-001',
  title: 'Test',
  type: 'padrao',
  status: 'rascunho',
  areaId: 'pietro',
  owner: 'test@test.com',
  summary: 'Test standard',
  risk: 'medio',
  version: 1,
  agentAvailable: false,
  dependencies: [],
  relatedModules: [],
  updatedAt: '2026-06-01',
  ...overrides,
});

describe('centralPadroesCanonicalGateService', () => {
  describe('findGate()', () => {
    it('encontra gate bruto → rascunho', () => {
      const gate = centralPadroesCanonicalGateService.findGate('bruto', 'rascunho');
      expect(gate).toBeDefined();
      expect(gate!.from).toBe('bruto');
      expect(gate!.to).toBe('rascunho');
    });

    it('retorna undefined para transição inválida', () => {
      const gate = centralPadroesCanonicalGateService.findGate('bruto', 'canonico_oficial');
      expect(gate).toBeUndefined();
    });
  });

  describe('validateTransition()', () => {
    it('permite editor avançar bruto → rascunho', () => {
      const standard = makeStandard({ status: 'bruto' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'rascunho', 'editor'
      );
      expect(result.allowed).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('bloqueia leitor de avançar bruto → rascunho', () => {
      const standard = makeStandard({ status: 'bruto' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'rascunho', 'leitor'
      );
      expect(result.allowed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('perfil');
    });

    it('exige evidência para em_curadoria → homologado', () => {
      const standard = makeStandard({ status: 'em_curadoria' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'homologado', 'aprovador', { evidenceId: 'ev-001' }
      );
      expect(result.allowed).toBe(true);
    });

    it('bloqueia em_curadoria → homologado sem evidência', () => {
      const standard = makeStandard({ status: 'em_curadoria' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'homologado', 'aprovador'
      );
      expect(result.allowed).toBe(false);
      expect(result.errors[0]).toContain('evidência');
    });

    it('rejeita transição inválida', () => {
      const standard = makeStandard({ status: 'rascunho' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'publicado', 'administrador'
      );
      expect(result.allowed).toBe(false);
      expect(result.errors[0]).toContain('não é uma transição válida');
    });

    it('avisa sobre aprovação necessária para homologado → canonico_operacional', () => {
      const standard = makeStandard({ status: 'homologado' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'canonico_operacional', 'administrador', { evidenceId: 'ev-001' }
      );
      expect(result.allowed).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('aprovação');
    });

    it('permite mesmo status (no-op)', () => {
      const standard = makeStandard({ status: 'rascunho' });
      const result = centralPadroesCanonicalGateService.validateTransition(
        standard, 'rascunho', 'leitor'
      );
      expect(result.allowed).toBe(true);
      expect(result.warnings[0]).toContain('mesmo');
    });
  });

  describe('getAvailableTransitions()', () => {
    it('retorna transições disponíveis a partir de rascunho', () => {
      const transitions = centralPadroesCanonicalGateService.getAvailableTransitions('rascunho');
      expect(transitions.length).toBe(2); // em_revisao + bloqueado
      expect(transitions.map((t) => t.to)).toContain('em_revisao');
      expect(transitions.map((t) => t.to)).toContain('bloqueado');
    });

    it('retorna transições a partir de homologado', () => {
      const transitions = centralPadroesCanonicalGateService.getAvailableTransitions('homologado');
      expect(transitions.map((t) => t.to)).toContain('canonico_operacional');
    });
  });
});
