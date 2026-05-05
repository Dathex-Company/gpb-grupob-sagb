/**
 * Testes do sistema de versionamento.
 *
 * Verifica:
 * - Resolução de versão (padrão, explícita, header)
 * - Deprecação e sunset
 * - Headers de versão
 * - Extração de prefixo
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  configureVersionManager,
  resetVersionConfig,
  getSupportedVersions,
  getLatestVersion,
  parseVersion,
  resolveVersion,
  extractVersionPrefix,
  isVersionSupported,
} from '../../versioning/versionRouter';

describe('VersionRouter', () => {
  beforeEach(() => {
    resetVersionConfig();
  });

  describe('getSupportedVersions', () => {
    it('deve retornar lista de versões suportadas', () => {
      const versions = getSupportedVersions();
      expect(versions.length).toBeGreaterThan(0);
      expect(versions[0].prefix).toBe('v1');
    });
  });

  describe('getLatestVersion', () => {
    it('deve retornar a versão ativa mais recente', () => {
      const latest = getLatestVersion();
      expect(latest.status).toBe('active');
      expect(latest.prefix).toBe('v1');
    });

    it('deve retornar a última versão se nenhuma estiver ativa', () => {
      configureVersionManager({
        supportedVersions: [
          {
            version: '1.0.0',
            prefix: 'v1',
            status: 'sunset',
            releasedAt: '2026-01-01T00:00:00.000Z',
            changelog: '/CHANGELOG_API.md#v100',
          },
        ],
      });

      const latest = getLatestVersion();
      expect(latest.prefix).toBe('v1');
    });
  });

  describe('parseVersion', () => {
    it('deve parsear "v1" para ApiVersion', () => {
      const result = parseVersion('v1');
      expect(result).not.toBeNull();
      expect(result?.major).toBe(1);
    });

    it('deve parsear "v2" para ApiVersion', () => {
      const result = parseVersion('v2');
      expect(result).not.toBeNull();
      expect(result?.major).toBe(2);
    });

    it('deve retornar null para formato inválido', () => {
      expect(parseVersion('version1')).toBeNull();
      expect(parseVersion('')).toBeNull();
      expect(parseVersion('v')).toBeNull();
    });
  });

  describe('resolveVersion', () => {
    it('deve resolver versão explícita', () => {
      const resolution = resolveVersion('v1');
      expect(resolution.resolvedVersion).toBe('v1');
      expect(resolution.status).toBe('active');
      expect(resolution.headers['X-API-Version']).toBe('1.0.0');
    });

    it('deve usar versão padrão quando não especificada', () => {
      const resolution = resolveVersion();
      expect(resolution.resolvedVersion).toBe('v1');
    });

    it('deve adicionar prefixo v se não existir', () => {
      const resolution = resolveVersion('1');
      expect(resolution.resolvedVersion).toBe('v1');
    });

    it('deve retornar fallback para versão não encontrada com warning', () => {
      const resolution = resolveVersion('v99');
      expect(resolution.resolvedVersion).toBe('v1'); // fallback para latest
      expect(resolution.headers['Warning']).toBeDefined();
    });

    it('deve incluir headers de deprecação quando status é deprecated', () => {
      configureVersionManager({
        supportedVersions: [
          {
            version: '0.9.0',
            prefix: 'v0',
            status: 'deprecated',
            releasedAt: '2026-01-01T00:00:00.000Z',
            deprecatedAt: '2026-04-01T00:00:00.000Z',
            sunsetAt: '2026-07-01T00:00:00.000Z',
            changelog: '/CHANGELOG_API.md#v090',
          },
          {
            version: '1.0.0',
            prefix: 'v1',
            status: 'active',
            releasedAt: '2026-05-05T00:00:00.000Z',
            changelog: '/CHANGELOG_API.md#v100',
          },
        ],
      });

      const resolution = resolveVersion('v0');
      expect(resolution.resolvedVersion).toBe('v0');
      expect(resolution.status).toBe('deprecated');
      expect(resolution.headers['Warning']).toBeDefined();
      expect(resolution.headers['Sunset']).toBe('2026-07-01T00:00:00.000Z');
    });

    it('deve incluir warning para versão sunset', () => {
      configureVersionManager({
        supportedVersions: [
          {
            version: '0.8.0',
            prefix: 'v0',
            status: 'sunset',
            releasedAt: '2025-01-01T00:00:00.000Z',
            sunsetAt: '2026-01-01T00:00:00.000Z',
            changelog: '/CHANGELOG_API.md#v080',
          },
          {
            version: '1.0.0',
            prefix: 'v1',
            status: 'active',
            releasedAt: '2026-05-05T00:00:00.000Z',
            changelog: '/CHANGELOG_API.md#v100',
          },
        ],
      });

      const resolution = resolveVersion('v0');
      expect(resolution.status).toBe('sunset');
      expect(resolution.headers['Warning']).toContain('sunset');
    });
  });

  describe('extractVersionPrefix', () => {
    it('deve extrair prefixo de path', () => {
      expect(extractVersionPrefix('/v1/health')).toBe('v1');
      expect(extractVersionPrefix('/v2/taskzei/notifications')).toBe('v2');
    });

    it('deve retornar null para path sem versão', () => {
      expect(extractVersionPrefix('/health')).toBeNull();
      expect(extractVersionPrefix('/')).toBeNull();
    });

    it('deve retornar null para path vazio', () => {
      expect(extractVersionPrefix('')).toBeNull();
    });
  });

  describe('isVersionSupported', () => {
    it('deve retornar true para versão suportada', () => {
      expect(isVersionSupported('/v1/health')).toBe(true);
    });

    it('deve retornar false para versão não suportada', () => {
      expect(isVersionSupported('/v99/test')).toBe(false);
    });

    it('deve retornar false para path sem versão', () => {
      expect(isVersionSupported('/health')).toBe(false);
    });
  });

  describe('configureVersionManager', () => {
    it('deve permitir configurar versões customizadas', () => {
      const customVersions = [
        {
          version: '2.0.0',
          prefix: 'v2',
          status: 'active' as const,
          releasedAt: '2026-06-01T00:00:00.000Z',
          changelog: '/CHANGELOG_API.md#v200',
        },
      ];

      configureVersionManager({
        defaultVersion: 'v2',
        supportedVersions: customVersions,
      });

      expect(getLatestVersion().prefix).toBe('v2');
      expect(getSupportedVersions()).toHaveLength(1);
    });

    it('deve resetar para configuração padrão', () => {
      configureVersionManager({ defaultVersion: 'v2' });
      resetVersionConfig();
      expect(getLatestVersion().prefix).toBe('v1');
    });
  });
});
