import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const RelationshipsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return <CentralPageShell title="Relacionamentos / Grafo" subtitle="Representação textual V1 das dependências entre padrões, módulos e agentes."><SectionPanel title="Dependências entre padrões"><div className="space-y-3">{snapshot?.standards.map((standard) => <div key={standard.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4 text-[12px]"><strong>{standard.key}</strong> depende de {standard.dependencies.length ? standard.dependencies.join(', ') : 'nenhum padrão'}</div>)}</div></SectionPanel></CentralPageShell>;
};
export default RelationshipsPage;

