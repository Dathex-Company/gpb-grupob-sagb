import React from 'react';
import { ModuleHeader } from '../../../../components/ui/ModuleHeader';

const FocoTotalPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-sagb-bg text-gray-900 dark:text-sagb-text p-6 font-sans">
      <ModuleHeader
        moduleName="Zen Folk | Foco AI"
        ownerName="Zen Folk"
        moduleDocPath="../module-doc.ts"
        className="mb-6 border-b border-gray-200 dark:border-sagb-border pb-4"
      />

      <div className="max-w-5xl space-y-6 text-[12px]">
        <section className="rounded-xl border border-gray-200 dark:border-sagb-border bg-gray-50 dark:bg-sagb-card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-sagb-text">Visão do Produto</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            O Foco AI é um copiloto de execução pessoal guiado por IA. O agente Zen Folk acompanha cada sprint,
            sustenta concentração, provoca retomada quando houver desvio e fecha cada sessão com registro objetivo
            de progresso.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-sagb-border bg-gray-50 dark:bg-sagb-card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-sagb-text">Pilar Operacional do MVP</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Definir missão da sessão (tarefa + duração).</li>
            <li>Executar cronômetro com checkpoints estratégicos.</li>
            <li>Emitir mensagens curtas de foco no tom do Zen Folk.</li>
            <li>Realizar fechamento obrigatório da sessão com histórico.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FocoTotalPage;
