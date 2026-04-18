import React, { useEffect, useState } from 'react';
import { CadastroEmpresasView } from '../components';
import CadastroEmpresaDetailPage from './CadastroEmpresaDetailPage';
import { buildEmpresaDetailPath, findEmpresaByIdOrSlug, normalizeEmpresas } from '../services';
import { getCadastroEmpresasRuntimeContext } from '../store';

export const CadastroEmpresasPage: React.FC = () => {
  const {
    empresas,
    ventures,
    agents,
    onAddEmpresa,
    onRemoveEmpresa,
    onUpdateEmpresa,
    onAddVenture,
    onRemoveVenture,
    onUpdateVenture
  } = getCadastroEmpresasRuntimeContext();

  const empresasView = empresas?.length ? empresas : normalizeEmpresas(ventures as any[]).map((item) => item.empresa);
  const handleAddEmpresa = onAddEmpresa ?? onAddVenture;
  const handleRemoveEmpresa = onRemoveEmpresa ?? onRemoveVenture;
  const handleUpdateEmpresa = onUpdateEmpresa ?? onUpdateVenture;

  const [pathname, setPathname] = useState(() => window.location.pathname || '');

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname || '');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateToPath = (nextPath: string) => {
    window.history.pushState(null, '', nextPath);
    setPathname(nextPath);
  };

  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const detalhePrefixo = '/cadastro-empresas/';
  const emDetalhe = normalizedPath.startsWith(detalhePrefixo);
  const empresaIdOrSlug = emDetalhe
    ? decodeURIComponent(normalizedPath.slice(detalhePrefixo.length))
    : '';

  const empresaSelecionada = emDetalhe
    ? findEmpresaByIdOrSlug(empresasView, empresaIdOrSlug)
    : null;

  if (emDetalhe) {
    return (
      <CadastroEmpresaDetailPage
        empresa={empresaSelecionada}
        empresaIdOrSlug={empresaIdOrSlug}
        onBackToList={() => navigateToPath('/cadastro-empresas')}
      />
    );
  }

  return (
    <CadastroEmpresasView
      empresas={empresasView}
      agents={agents}
      onAddEmpresa={handleAddEmpresa}
      onRemoveEmpresa={handleRemoveEmpresa}
      onUpdateEmpresa={handleUpdateEmpresa}
      onOpenEmpresaDetail={(empresaId) => navigateToPath(buildEmpresaDetailPath(empresaId))}
    />
  );
};

export default CadastroEmpresasPage;
