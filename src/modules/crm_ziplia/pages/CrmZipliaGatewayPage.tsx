import React from 'react';

const CRM_ZIPLIA_URL = 'http://localhost:3000';

export const CrmZipliaGatewayPage: React.FC = () => {
  const handleOpenCrm = () => {
    window.open(CRM_ZIPLIA_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex-1 p-10 bg-white dark:bg-sagb-bg text-gray-900 dark:text-sagb-text min-h-full transition-colors duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">CRM Ziplia</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          Acesso ao CRM externo da Venture Ziplia, mantendo o SagB como cockpit principal.
        </p>
      </header>

      <section className="bg-gray-50 dark:bg-sagb-card rounded-2xl p-8 border border-gray-200 dark:border-sagb-border max-w-3xl">
        <h2 className="text-xl font-bold mb-3">Conector Externo</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Este módulo funciona como ponte. O CRM permanece fora do runtime interno do SagB, dentro da estrutura da Ziplia.
        </p>

        <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <p><span className="font-semibold">Origem:</span> Venture Ziplia</p>
          <p><span className="font-semibold">Tipo:</span> Acesso externo</p>
          <p><span className="font-semibold">URL padrão:</span> {CRM_ZIPLIA_URL}</p>
        </div>

        <button
          onClick={handleOpenCrm}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Abrir CRM Ziplia
        </button>
      </section>
    </div>
  );
};

export default CrmZipliaGatewayPage;

