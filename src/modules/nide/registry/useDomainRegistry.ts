import { useState, useMemo, useCallback } from 'react';
import { NideDomain } from './domain.types';
import {
  getAllDomains,
  getActiveDomains,
  getPlannedDomains,
  getInactiveDomains,
  getDomainById,
  activateDomain,
  deactivateDomain
} from './domainActivation';

/**
 * Hook para acessar o registry interno de domínios do NIDE.
 *
 * Fornece acesso reativo aos domínios registrados, com suporte a
 * filtros por status e ativação/desativação.
 */
export function useDomainRegistry() {
  // Força re-render via estado local (a store é volátil em memória)
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion(v => v + 1);
  }, []);

  const allDomains = useMemo(() => getAllDomains(), [version]);
  const activeDomains = useMemo(() => getActiveDomains(), [version]);
  const plannedDomains = useMemo(() => getPlannedDomains(), [version]);
  const inactiveDomains = useMemo(() => getInactiveDomains(), [version]);

  const getDomain = useCallback((id: string): NideDomain | undefined => {
    return getDomainById(id);
  }, [version]);

  const activate = useCallback((id: string): boolean => {
    const result = activateDomain(id);
    if (result) refresh();
    return result;
  }, [refresh]);

  const deactivate = useCallback((id: string): boolean => {
    const result = deactivateDomain(id);
    if (result) refresh();
    return result;
  }, [refresh]);

  return {
    allDomains,
    activeDomains,
    plannedDomains,
    inactiveDomains,
    getDomain,
    activate,
    deactivate,
    refresh
  };
}
