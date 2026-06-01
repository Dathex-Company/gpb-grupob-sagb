import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SearchResult, centralPadroesSearchRoadmap, centralPadroesSearchService } from '../services/centralPadroesSearchService';

const SearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState<'all' | 'standard' | 'document' | 'decision'>('all');
  const [results, setResults] = React.useState<SearchResult[]>([]);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      centralPadroesSearchService.textSearch(query).then(setResults).catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const filtered = tab === 'all' ? results : results.filter((result) => result.entityType === tab);

  return (
    <CentralPageShell title="Busca Textual da Central" subtitle="Busca textual ampliada da ET-22. A busca semântica com embeddings, pgvector e Chat Pietro fica preparada como evolução futura, mas ainda não está ativa.">
      <section className="cp-docs-search-hero">
        <div>
          <p className="cp-docs-kicker">Modo atual: {centralPadroesSearchRoadmap.currentMode}</p>
          <h2>Pesquisar padrões, documentos e decisões</h2>
          <p>Campos considerados: chave, título, resumo, responsável, área, status, tipo, risco, dependências, módulos relacionados e metadados disponíveis.</p>
        </div>
        <label className="cp-docs-big-search">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex: decisão com IA, rastreabilidade, deploy, criar tabela Supabase" />
        </label>
      </section>

      <div className="cp-docs-tab-row">
        {(['all', 'standard', 'document', 'decision'] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`cp-docs-filter ${tab === item ? 'active' : ''}`}>{item === 'all' ? 'Todos' : item}</button>
        ))}
      </div>

      <section className="cp-docs-result-list">
        {filtered.map((result, index) => (
          <article key={`${result.entityType}-${index}`} className="cp-docs-result-card">
            <div>
              <p className="cp-docs-kicker">{result.entityType}</p>
              <h3>{'title' in result.entity ? result.entity.title : result.entityType}</h3>
              <p>{result.excerpt}</p>
            </div>
            <span className="cp-docs-score">score {(result.score * 100).toFixed(0)}%</span>
          </article>
        ))}
        {filtered.length === 0 && <div className="cp-docs-empty-note">Nenhum resultado encontrado na busca textual ampliada.</div>}
      </section>

      <section className="cp-docs-panel cp-docs-roadmap-box">
        <p className="cp-docs-kicker">Preparação futura</p>
        <p><strong>Híbrida:</strong> {centralPadroesSearchRoadmap.futureHybrid}</p>
        <p><strong>Semântica:</strong> {centralPadroesSearchRoadmap.futureSemantic}</p>
      </section>
    </CentralPageShell>
  );
};
export default SearchPage;
