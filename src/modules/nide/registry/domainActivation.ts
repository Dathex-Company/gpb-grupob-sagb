import { NideDomainManifest, NideDomainActivationState, NideDomain } from './domain.types';
import { getDomainRegistry } from './domainRegistry';

/**
 * Camada de ativação/desativação de domínios internos do NIDE.
 *
 * Por enquanto, funciona baseada no manifest e defaults.
 * Futuramente poderá ser estendida com:
 * - Supabase (ativação por workspace)
 * - localStorage (preferências do usuário)
 * - toggle por workspace
 */

// Estado de ativação em memória (volátil, reset ao recarregar)
const activationStore = new Map<string, NideDomainActivationState>();

function ensureActivationEntry(manifest: NideDomainManifest): NideDomainActivationState {
  if (!activationStore.has(manifest.id)) {
    activationStore.set(manifest.id, {
      domainId: manifest.id,
      isActive: !manifest.isPlanned && manifest.isEnabledByDefault,
      isEnabled: manifest.isEnabledByDefault,
      activatedAt: !manifest.isPlanned && manifest.isEnabledByDefault
        ? new Date().toISOString()
        : undefined
    });
  }
  return activationStore.get(manifest.id)!;
}

/** Retorna todos os domínios com estado de ativação */
export function getAllDomains(): NideDomain[] {
  const registry = getDomainRegistry();
  return registry.map(manifest => ({
    manifest,
    activation: ensureActivationEntry(manifest)
  }));
}

/** Retorna apenas domínios ativos (isActive === true) */
export function getActiveDomains(): NideDomain[] {
  return getAllDomains().filter(d => d.activation.isActive);
}

/** Retorna apenas domínios planejados (isPlanned === true) */
export function getPlannedDomains(): NideDomain[] {
  return getAllDomains().filter(d => d.manifest.isPlanned);
}

/** Retorna apenas domínios inativos */
export function getInactiveDomains(): NideDomain[] {
  return getAllDomains().filter(d => !d.activation.isActive);
}

/** Retorna um domínio pelo ID */
export function getDomainById(id: string): NideDomain | undefined {
  return getAllDomains().find(d => d.manifest.id === id);
}

/** Ativa um domínio */
export function activateDomain(id: string): boolean {
  const domain = getDomainById(id);
  if (!domain) return false;
  activationStore.set(id, {
    ...domain.activation,
    isActive: true,
    isEnabled: true,
    activatedAt: domain.activation.activatedAt || new Date().toISOString()
  });
  return true;
}

/** Desativa um domínio */
export function deactivateDomain(id: string): boolean {
  const domain = getDomainById(id);
  if (!domain) return false;
  if (domain.manifest.isCore) return false; // Core domains can't be deactivated
  activationStore.set(id, {
    ...domain.activation,
    isActive: false
  });
  return true;
}

/** Verifica se um domínio está ativo */
export function isDomainActive(id: string): boolean {
  const domain = getDomainById(id);
  return domain?.activation.isActive ?? false;
}

/** Obtém domínio atual baseado no path */
export function getCurrentDomainByPath(path: string): NideDomain | undefined {
  return getAllDomains().find(d => path.startsWith(d.manifest.basePath));
}
