export { nideManifest } from './manifest';
export { nideRoutes } from './routes';
export { nideDoc } from './module-doc';

// Core
export { NideShell } from './core/NideShell';
export { NideProvider } from './core/NideProvider';
export { NIDE_APP_NAME, NIDE_FULL_NAME, NIDE_VERSION } from './core/constants';

// Pages
export { NideHomePage } from './pages/NideHomePage';

// Hooks
export { useNide } from './hooks/useNide';

// Store (runtime bridge)
export { setNideRuntimeContext, getNideRuntimeContext } from './store';
export type { NideRuntimeContext } from './store';

// Types
export type { NideContextState, DomainStatus } from './types/nide.types';
