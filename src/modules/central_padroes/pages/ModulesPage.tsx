import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const ModulesPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return (
    <CentralPageShell title="Módulos Plugáveis" subtitle="Matriz inicial de relação entre módulos e padrões aplicáveis.">
      <SectionPanel title="Módulo ↔ Padrão">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {snapshot?.modules.map((module) => (
            <article key={module.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <div className="flex items-start justify-between gap-3"><h3 className="font-black text-sagb-text">{module.moduleName}</h3><StatusBadge value={module.status} /></div>
              <p className="mt-2 text-[12px] text-sagb-muted">Tipo: {module.kind}</p>
              <p className="mt-2 text-[12px] text-sagb-muted">Padrões: {module.standards.length ? module.standards.join(', ') : 'sem vínculo'}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </CentralPageShell>
  );
};

export default ModulesPage;

