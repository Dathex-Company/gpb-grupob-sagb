import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const DecisionsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return (
    <CentralPageShell title="Decisões e Exceções" subtitle="Registro mestre de decisões arquiteturais e exceções futuras vinculadas a padrões.">
      <SectionPanel title="Decisões estruturais">
        <div className="space-y-3">
          {snapshot?.decisions.map((decision) => (
            <article key={decision.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <div className="flex items-start justify-between gap-3"><h3 className="font-black text-sagb-text">{decision.title}</h3><StatusBadge value={decision.status} /></div>
              <p className="mt-2 text-[12px] text-sagb-muted">{decision.summary}</p>
              <p className="mt-2 text-[11px] text-sagb-muted">Impactos: {decision.impacts.join(', ')}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </CentralPageShell>
  );
};
export default DecisionsPage;

