import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const AreasPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return (
    <CentralPageShell title="Responsáveis e Áreas" subtitle="Os 12 domínios da arquitetura mestra como backbone de ownership e curadoria.">
      <SectionPanel title="Domínios oficiais">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {snapshot?.areas.map((area) => (
            <article key={area.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sagb-muted">{area.id}</p>
              <h3 className="mt-1 font-bold text-sagb-text">{area.name}</h3>
              <p className="mt-2 text-[12px] text-sagb-muted">Owner: <strong>{area.owner}</strong></p>
              <p className="mt-1 text-[12px] text-sagb-muted">{area.focus}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </CentralPageShell>
  );
};

export default AreasPage;

