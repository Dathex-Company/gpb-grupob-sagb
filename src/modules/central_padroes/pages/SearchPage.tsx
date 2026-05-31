import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { SearchResult, centralPadroesSearchService } from '../services/centralPadroesSearchService';

const SearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState<'all' | 'standard' | 'document' | 'decision'>('all');
  const [results, setResults] = React.useState<SearchResult[]>([]);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      centralPadroesSearchService.hybridSearch(query).then(setResults).catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const filtered = tab === 'all' ? results : results.filter((result) => result.entityType === tab);

  return (
    <CentralPageShell title="Busca Inteligente" subtitle="Busca híbrida V1 com score de relevância, abas por entidade e fallback textual quando pgvector/embedding não estiver disponível.">
      <SectionPanel title="Pesquisar padrões, documentos e decisões">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex: criar módulo novo, Supabase, segurança" className="mb-4 w-full rounded-2xl border border-sagb-line bg-sagb-bg-2 px-4 py-3 text-[13px] text-sagb-text outline-none" />
        <div className="mb-4 flex flex-wrap gap-2">{(['all', 'standard', 'document', 'decision'] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-2 text-[12px] font-black ${tab === item ? 'bg-blue-600 text-white' : 'bg-sagb-bg-2 text-sagb-muted'}`}>{item}</button>)}</div>
        <div className="space-y-3">
          {filtered.map((result, index) => <article key={`${result.entityType}-${index}`} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-sagb-muted">{result.entityType}</p><h3 className="font-black text-sagb-text">{'title' in result.entity ? result.entity.title : result.entityType}</h3><p className="mt-2 text-[12px] text-sagb-muted">{result.excerpt}</p></div><StatusBadge value={`score ${(result.score * 100).toFixed(0)}%`} /></div></article>)}
          {filtered.length === 0 && <p className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4 text-[12px] text-sagb-muted">Nenhum resultado encontrado.</p>}
        </div>
      </SectionPanel>
    </CentralPageShell>
  );
};
export default SearchPage;

