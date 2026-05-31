import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StandardTable } from '../components/StandardTable';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const SearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const { snapshot } = useCentralPadroes();
  const standards = (snapshot?.standards || []).filter((standard) => `${standard.title} ${standard.summary} ${standard.key}`.toLowerCase().includes(query.toLowerCase()));
  return <CentralPageShell title="Busca Inteligente" subtitle="Busca textual V1; base preparada para busca semântica futura."><SectionPanel title="Pesquisar padrões"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex: criar módulo novo" className="mb-4 w-full rounded-2xl border border-sagb-line bg-sagb-bg-2 px-4 py-3 text-[13px] text-sagb-text outline-none" /><StandardTable standards={standards} /></SectionPanel></CentralPageShell>;
};
export default SearchPage;

