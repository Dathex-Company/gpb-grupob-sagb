import { Empresa } from '../types';

const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();

/**
 * Resolve empresa por identificador de rota, aceitando id (preferencial)
 * e fallback por slug para compatibilidade de navegação interna.
 */
export const findEmpresaByIdOrSlug = (
  empresas: Empresa[],
  empresaIdOrSlug?: string | null
): Empresa | null => {
  const target = normalize(empresaIdOrSlug);
  if (!target) return null;

  return (
    (empresas || []).find((empresa) => normalize(empresa.id) === target)
    || (empresas || []).find((empresa) => normalize(empresa.slug) === target)
    || null
  );
};

export const buildEmpresaDetailPath = (empresaId: string) => `/cadastro-empresas/${encodeURIComponent(empresaId)}`;
