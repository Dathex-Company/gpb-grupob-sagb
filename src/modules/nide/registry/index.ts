// Types
export type {
  NideDomainCategory,
  NideDomainStatus,
  NideDomainOwner,
  NideDomainManifest,
  NideDomainRoute,
  NideDomainActivationState,
  NideDomain
} from './domain.types';

// Registry
export {
  domainRegistry,
  getDomainRegistry,
  getDomainManifestById
} from './domainRegistry';

// Activation
export {
  getAllDomains,
  getActiveDomains,
  getPlannedDomains,
  getInactiveDomains,
  getDomainById,
  activateDomain,
  deactivateDomain,
  isDomainActive,
  getCurrentDomainByPath
} from './domainActivation';

// Hook
export { useDomainRegistry } from './useDomainRegistry';
