import { useNideContext } from '../core/NideProvider';

/**
 * Hook público do NIDE.
 * Retorna o contexto atual do módulo NIDE para uso em componentes filhos.
 */
export const useNide = () => {
  const { state, setActiveDomain, setFullscreen } = useNideContext();
  return {
    ...state,
    setActiveDomain,
    setFullscreen
  };
};
