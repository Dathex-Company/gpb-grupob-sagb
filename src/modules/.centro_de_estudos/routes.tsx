import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';

function CentroDeEstudosPage(): JSX.Element {
  return (
    <div className=p-4>
      <h1 className=text-xl font-semibold>Centro de Estudos</h1>
      <p className=mt-2 text-sm opacity-80>Módulo em padronização canônica.</p>
    </div>
  );
}

export const centroDeEstudosRoutes: ModuleRoute = {
  path: '/centro_de_estudos/*',
  element: <CentroDeEstudosPage />
};

