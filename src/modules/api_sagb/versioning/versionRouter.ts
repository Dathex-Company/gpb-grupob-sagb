/**
 * VersionRouter — Gerenciamento de versões da API SagB.
 *
 * Responsabilidades:
 * - Resolver a versão solicitada (via header ou padrão)
 * - Gerenciar deprecação e sunset de versões antigas
 * - Anexar headers de versão nas respostas
 * - Roteamento para handlers específicos de versão
 */

import { ApiRequest, ApiResponse } from '../endpoints/endpoints.types';
import {
  ApiVersion,
  VersionInfo,
  VersionStatus,
  VersionResolution,
  VersionManagerConfig,
} from './versioning.types';

/**
 * Configuração padrão do versionamento.
 */
const DEFAULT_CONFIG: VersionManagerConfig = {
  defaultVersion: 'v1',
  supportedVersions: [
    {
      version: '1.0.0',
      prefix: 'v1',
      status: 'active',
      releasedAt: '2026-05-05T00:00:00.000Z',
      changelog: '/CHANGELOG_API.md#v100',
    },
  ],
  deprecationWarningDays: 90,
  headerName: 'Accept-Version',
};

let config: VersionManagerConfig = { ...DEFAULT_CONFIG };

/**
 * Atualiza a configuração do version manager (útil para testes).
 */
export function configureVersionManager(customConfig: Partial<VersionManagerConfig>): void {
  config = { ...config, ...customConfig };
}

/**
 * Reseta para a configuração padrão.
 */
export function resetVersionConfig(): void {
  config = { ...DEFAULT_CONFIG };
}

/**
 * Obtém a lista de versões suportadas.
 */
export function getSupportedVersions(): VersionInfo[] {
  return [...config.supportedVersions];
}

/**
 * Retorna a versão ativa mais recente.
 */
export function getLatestVersion(): VersionInfo {
  const active = config.supportedVersions.filter((v) => v.status === 'active');
  return active[active.length - 1] || config.supportedVersions[0];
}

/**
 * Converte string "v1" para objeto ApiVersion.
 */
export function parseVersion(prefix: string): ApiVersion | null {
  const match = prefix.match(/^v(\d+)$/);
  if (!match) return null;

  const major = parseInt(match[1]);
  return { major, minor: 0, patch: 0 };
}

/**
 * Resolve a versão a partir de um header ou default.
 */
export function resolveVersion(requestVersion?: string): VersionResolution {
  const versionPrefix = requestVersion || config.defaultVersion;
  const normalizedPrefix = versionPrefix.startsWith('v') ? versionPrefix : `v${versionPrefix}`;

  const found = config.supportedVersions.find((v) => v.prefix === normalizedPrefix);

  if (!found) {
    // Versão não encontrada: retorna default com warning
    const latest = getLatestVersion();
    return {
      requestedVersion: normalizedPrefix,
      resolvedVersion: latest.prefix,
      status: latest.status,
      headers: {
        'X-API-Version': latest.version,
        'X-API-Version-Prefix': latest.prefix,
        'Warning': `299 api.sagb.com.br: "Version '${normalizedPrefix}' not found, using '${latest.prefix}'"`,
      },
    };
  }

  const resolution: VersionResolution = {
    requestedVersion: normalizedPrefix,
    resolvedVersion: found.prefix,
    status: found.status,
    headers: {
      'X-API-Version': found.version,
      'X-API-Version-Prefix': found.prefix,
    },
  };

  // Adiciona aviso de deprecação se necessário
  if (found.status === 'deprecated' && found.sunsetAt) {
    const daysUntilSunset = Math.ceil(
      (new Date(found.sunsetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    resolution.headers['Warning'] =
      `299 api.sagb.com.br: "Version '${found.prefix}' is deprecated, sunset in ${daysUntilSunset} days"`;
    resolution.headers['Sunset'] = found.sunsetAt;
  }

  if (found.status === 'sunset') {
    resolution.headers['Warning'] =
      `299 api.sagb.com.br: "Version '${found.prefix}' is sunset. Please migrate to ${getLatestVersion().prefix}"`;
  }

  return resolution;
}

/**
 * Middleware-style: extrai headers de versão do request, resolve,
 * e anexa os headers de versão na resposta.
 */
export function applyVersionHeaders(
  request: ApiRequest,
  response: ApiResponse,
): ApiResponse {
  const requestVersion = typeof request.headers[config.headerName] === 'string'
    ? (request.headers[config.headerName] as string)
    : undefined;

  const resolution = resolveVersion(requestVersion);

  return {
    ...response,
    headers: {
      ...response.headers,
      ...resolution.headers,
    },
  };
}

/**
 * Verifica se uma rota pertence à versão suportada e retorna o prefixo.
 * Ex: "/v1/taskzei/notifications" => "v1"
 */
export function extractVersionPrefix(path: string): string | null {
  const match = path.match(/^\/(v\d+)\//);
  return match ? match[1] : null;
}

/**
 * Valida se o path contém uma versão suportada.
 */
export function isVersionSupported(path: string): boolean {
  const prefix = extractVersionPrefix(path);
  if (!prefix) return false;
  return config.supportedVersions.some((v) => v.prefix === prefix);
}
