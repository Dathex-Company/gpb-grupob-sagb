import { ReactNode } from 'react';

export interface ModuleManifest {
  id: string; // The TabId string used in the system
  internalName: string;
  displayName: string;
  baseRoute: string;
  icon: string;
  initialStatus: 'active' | 'inactive';
}

export interface ModuleRoute {
  path: string;
  element: ReactNode;
}

export interface PluggableModule {
  manifest: ModuleManifest;
  routes: ModuleRoute;
}
