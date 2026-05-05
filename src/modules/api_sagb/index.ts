// API SagB — Module Exports
export { apiSagbManifest } from './manifest';
export { apiSagbRoutes } from './routes';
export { moduleDoc as apiSagbModuleDoc } from './module-doc';

// Audit
export type { AuditEntry, RequestContext } from './audit/audit.types';
export { createRequestContext, extractRequestId, calculateDuration } from './audit/requestContext';
export { AuditLogger } from './audit/auditLogger';

// Security
export type { ApiScope, ApiClient, ApiKey, AuthContext } from './security/auth.types';
export { validateApiKey, requireScopes } from './security/authMiddleware';

// Integration
export { HttpClient } from './integration/httpClient';
export { CircuitBreaker } from './integration/circuitBreaker';
export { TaskzeiAdapter } from './integration/adapters/taskzeiAdapter';
export { CrmAdapter } from './integration/adapters/crmAdapter';
export { StudioAdapter } from './integration/adapters/studioAdapter';
export { VoxAdapter } from './integration/adapters/voxAdapter';

// Endpoints
export type { ApiHandler, ApiRequest, ApiResponse } from './endpoints/endpoints.types';
export { ok, created, apiError, matchParams } from './endpoints/endpoints.types';
export { dispatchRequest } from './endpoints/router';

// Versioning
export type { ApiVersion, VersionInfo, VersionStatus, VersionResolution, VersionManagerConfig } from './versioning/versioning.types';
export {
  configureVersionManager,
  getSupportedVersions,
  getLatestVersion,
  resolveVersion,
  extractVersionPrefix,
  isVersionSupported,
} from './versioning/versionRouter';

// Feature Flags
export type { FeatureFlags } from './rollout/featureFlags';
export { loadFeatureFlags, getFeatureFlags, setFeatureFlags, isDomainEnabled } from './rollout/featureFlags';
