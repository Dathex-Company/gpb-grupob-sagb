import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';

function ApiSagbPage(): JSX.Element {
  return (
    <div className="flex-1 p-10 bg-white dark:bg-sagb-bg text-gray-900 dark:text-sagb-text">
      <h1 className="text-3xl font-black uppercase tracking-tighter">API SagB</h1>
      <p className="mt-2 text-[12px] text-gray-500 dark:text-sagb-muted">
        Camada oficial de API do SagB para consumo de sistemas internos e externos com governança,
        segurança e rastreabilidade.
      </p>
    </div>
  );
}

export const apiSagbRoutes: ModuleRoute = {
  path: '/api-sagb/*',
  element: <ApiSagbPage />
};

