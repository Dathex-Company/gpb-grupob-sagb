import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const DocumentsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return (
    <CentralPageShell title="Biblioteca de Documentos" subtitle="Documentos canônicos, brutos, em revisão, legados e externos com destino normativo sugerido.">
      <SectionPanel title="Inventário documental V1">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {snapshot?.documents.map((doc) => (
            <article key={doc.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <div className="flex items-start justify-between gap-3"><h3 className="font-black text-sagb-text">{doc.title}</h3><StatusBadge value={doc.status} /></div>
              <p className="mt-2 font-mono text-[11px] text-sagb-muted">{doc.path}</p>
              <p className="mt-2 text-[12px] text-sagb-muted">Categoria: {doc.category} · Destino: {doc.shouldBecome}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </CentralPageShell>
  );
};

export default DocumentsPage;

