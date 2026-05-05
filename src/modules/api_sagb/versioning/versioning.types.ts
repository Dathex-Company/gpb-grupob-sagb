/**
 * Tipagens para o sistema de versionamento da API SagB.
 */

/**
 * Versão semântica da API.
 */
export interface ApiVersion {
  major: number;
  minor: number;
  patch: number;
}

/**
 * Estado do ciclo de vida de uma versão.
 */
export type VersionStatus = 'active' | 'deprecated' | 'sunset';

/**
 * Metadados de uma versão da API.
 */
export interface VersionInfo {
  version: string;          // ex: "1.0.0"
  prefix: string;           // ex: "v1"
  status: VersionStatus;
  releasedAt: string;       // ISO date
  deprecatedAt?: string;    // ISO date
  sunsetAt?: string;        // ISO date
  changelog: string;        // Link ou resumo das mudanças
  migrationGuide?: string;  // Link para guia de migração da versão anterior
}

/**
 * Resultado da resolução de versão.
 */
export interface VersionResolution {
  requestedVersion: string;
  resolvedVersion: string;
  status: VersionStatus;
  headers: Record<string, string>; // Headers de versão para resposta
}

/**
 * Configuração do gerenciador de versões.
 */
export interface VersionManagerConfig {
  defaultVersion: string;
  supportedVersions: VersionInfo[];
  deprecationWarningDays: number;  // Dias antes do sunset para começar a avisar
  headerName: string;              // Header de requisição para versão (ex: Accept-Version)
}
