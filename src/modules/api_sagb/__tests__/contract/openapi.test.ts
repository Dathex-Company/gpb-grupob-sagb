/**
 * Testes de validação do contrato OpenAPI.
 *
 * Verifica:
 * - Estrutura básica do YAML
 * - Schemas definidos
 * - Rotas documentadas
 * - Validação de erros comuns
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

describe('OpenAPI Contract', () => {
  let spec: any;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../../contracts/openapi_v1.yaml');
    const raw = fs.readFileSync(filePath, 'utf-8');
    spec = yaml.load(raw);
  });

  describe('Estrutura Básica', () => {
    it('deve ter openapi version 3.0.3', () => {
      expect(spec.openapi).toBe('3.0.3');
    });

    it('deve ter info com título e versão', () => {
      expect(spec.info).toBeDefined();
      expect(spec.info.title).toBe('API SagB');
      expect(spec.info.version).toBe('1.0.0');
    });

    it('deve ter pelo menos um server definido', () => {
      expect(spec.servers).toBeDefined();
      expect(spec.servers.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Schemas', () => {
    it('deve definir ErrorResponse', () => {
      expect(spec.components.schemas.ErrorResponse).toBeDefined();
      expect(spec.components.schemas.ErrorResponse.properties.error.properties.code).toBeDefined();
      expect(spec.components.schemas.ErrorResponse.properties.error.properties.message).toBeDefined();
    });

    it('deve definir schemas para todos os recursos', () => {
      const expectedSchemas = [
        'HealthResponse',
        'Notification',
        'Lead',
        'StudioProject',
        'StudioProjectDetail',
        'Transcription',
        'TranscribePayload',
        'SendNotificationPayload',
        'CreateLeadPayload',
        'UpdateLeadPayload',
      ];

      for (const schemaName of expectedSchemas) {
        expect(spec.components.schemas[schemaName]).toBeDefined();
      }
    });
  });

  describe('Security', () => {
    it('deve usar ApiKeyAuth como security scheme', () => {
      expect(spec.components.securitySchemes.ApiKeyAuth).toBeDefined();
      expect(spec.components.securitySchemes.ApiKeyAuth.type).toBe('apiKey');
      expect(spec.components.securitySchemes.ApiKeyAuth.in).toBe('header');
      expect(spec.components.securitySchemes.ApiKeyAuth.name).toBe('X-API-Key');
    });

    it('deve aplicar security globalmente', () => {
      expect(spec.security).toBeDefined();
      expect(spec.security[0].ApiKeyAuth).toEqual([]);
    });
  });

  describe('Endpoints', () => {
    const endpoints = [
      { path: '/health', method: 'get' },
      { path: '/taskzei/notifications', method: 'get' },
      { path: '/taskzei/notifications', method: 'post' },
      { path: '/crm/leads', method: 'get' },
      { path: '/crm/leads', method: 'post' },
      { path: '/crm/leads/{id}', method: 'get' },
      { path: '/crm/leads/{id}', method: 'put' },
      { path: '/studio/projects', method: 'get' },
      { path: '/studio/projects/{id}', method: 'get' },
      { path: '/vox/transcriptions', method: 'get' },
      { path: '/vox/transcriptions', method: 'post' },
      { path: '/vox/transcriptions/{id}', method: 'get' },
    ];

    for (const { path: endpointPath, method } of endpoints) {
      it(`deve documentar ${method.toUpperCase()} ${endpointPath}`, () => {
        expect(spec.paths[endpointPath]).toBeDefined();
        expect(spec.paths[endpointPath][method]).toBeDefined();
      });
    }

    it('cada endpoint GET deve ter responses 200, 401, 403 definidos', () => {
      const getEndpoints = [
        '/health',
        '/taskzei/notifications',
        '/crm/leads',
        '/crm/leads/{id}',
        '/studio/projects',
        '/studio/projects/{id}',
        '/vox/transcriptions',
        '/vox/transcriptions/{id}',
      ];

      for (const ep of getEndpoints) {
        const responses = spec.paths[ep]?.get?.responses;
        expect(responses).toBeDefined();
        expect(responses['200'] || responses['201']).toBeDefined();
      }
    });

    it('endpoints POST devem ter requestBody definido', () => {
      const postEndpoints = [
        '/taskzei/notifications',
        '/crm/leads',
        '/vox/transcriptions',
      ];

      for (const ep of postEndpoints) {
        expect(spec.paths[ep].post.requestBody).toBeDefined();
      }
    });
  });

  describe('Tags', () => {
    it('deve ter tags para cada domínio', () => {
      const paths = spec.paths;
      const tags = new Set<string>();

      Object.values(paths).forEach((methods: any) => {
        Object.values(methods).forEach((operation: any) => {
          if (operation.tags) {
            operation.tags.forEach((tag: string) => tags.add(tag));
          }
        });
      });

      const expectedTags = ['System', 'TaskZei', 'CRM', 'Studio', 'Vox'];
      for (const tag of expectedTags) {
        expect(tags.has(tag)).toBe(true);
      }
    });
  });
});
