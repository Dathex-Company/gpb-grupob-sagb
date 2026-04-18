import { Agent } from '../../../../types';
import { Venture } from '../../../../types';
import { normalizeEmpresas, toLegacyVentureCompat } from '../services';
import { Empresa } from '../types';

export interface CadastroEmpresasRuntimeContext {
  empresas: Empresa[];
  agents: Agent[];
  onAddEmpresa?: (empresa: Empresa) => void;
  onRemoveEmpresa?: (id: string) => void;
  onUpdateEmpresa?: (empresa: Empresa) => void;

  /** Compatibilidade temporária com contratos legados */
  ventures: Venture[];
  onAddVenture?: (venture: Venture) => void;
  onRemoveVenture?: (id: string) => void;
  onUpdateVenture?: (venture: Venture) => void;
}

let runtimeContext: CadastroEmpresasRuntimeContext = {
  empresas: [],
  ventures: [],
  agents: []
};

export const setCadastroEmpresasRuntimeContext = (next: Partial<CadastroEmpresasRuntimeContext>) => {
  const onAddEmpresaCompat =
    next.onAddEmpresa
    ?? (next.onAddVenture
      ? (empresa: Empresa) => next.onAddVenture?.(toLegacyVentureCompat(empresa) as Venture)
      : runtimeContext.onAddEmpresa);

  const onAddVentureCompat =
    next.onAddVenture
    ?? (next.onAddEmpresa
      ? (venture: Venture) => {
        const [normalizada] = normalizeEmpresas([venture as any]);
        next.onAddEmpresa?.(normalizada.empresa);
      }
      : runtimeContext.onAddVenture);

  const onUpdateEmpresaCompat =
    next.onUpdateEmpresa
    ?? (next.onUpdateVenture
      ? (empresa: Empresa) => next.onUpdateVenture?.(toLegacyVentureCompat(empresa) as Venture)
      : runtimeContext.onUpdateEmpresa);

  const onUpdateVentureCompat =
    next.onUpdateVenture
    ?? (next.onUpdateEmpresa
      ? (venture: Venture) => {
        const [normalizada] = normalizeEmpresas([venture as any]);
        next.onUpdateEmpresa?.(normalizada.empresa);
      }
      : runtimeContext.onUpdateVenture);

  runtimeContext = {
    ...runtimeContext,
    ...next,
    empresas: Array.isArray(next.empresas)
      ? next.empresas
      : Array.isArray(next.ventures)
        ? normalizeEmpresas(next.ventures as any[]).map((item) => item.empresa)
        : runtimeContext.empresas,
    ventures: Array.isArray(next.ventures)
      ? next.ventures
      : Array.isArray(next.empresas)
        ? next.empresas.map((empresa) => toLegacyVentureCompat(empresa) as Venture)
        : runtimeContext.ventures,
    agents: Array.isArray(next.agents) ? next.agents : runtimeContext.agents,
    onAddEmpresa: onAddEmpresaCompat,
    onRemoveEmpresa: next.onRemoveEmpresa ?? next.onRemoveVenture ?? runtimeContext.onRemoveEmpresa,
    onUpdateEmpresa: onUpdateEmpresaCompat,
    onAddVenture: onAddVentureCompat,
    onRemoveVenture: next.onRemoveVenture ?? next.onRemoveEmpresa ?? runtimeContext.onRemoveVenture,
    onUpdateVenture: onUpdateVentureCompat
  };
};

export const getCadastroEmpresasRuntimeContext = (): CadastroEmpresasRuntimeContext => runtimeContext;
