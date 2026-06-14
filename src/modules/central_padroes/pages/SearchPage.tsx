import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CentralEmptyState, CentralErrorState, CentralFilterBar, CentralLoadingState } from '../components/CentralUI';
import { SearchResult, centralPadroesSearchRoadmap, centralPadroesSearchService } from '../services/centralPadroesSearchService';

type SearchPageProps = {
  onNavigate?: (viewId: string) => void;
  onOpenDocument?: (documentId: string) => void;
};

const resultLabels: Record<string, string> = {
  all: 'Todos',
  standard: 'Padrões',
  document: 'Documentos',
  decision: 'Decisões',
  report: 'Relatórios',
  audit: 'Auditorias',
  curadoria: 'Curadoria',
  traceLog: 'LOZE-TRACE'
};

const routeByType: Record<string, string> = {
  standard: 'standards',
  document: 'documents',
  decision: 'decisions',
  baseModule: 'base-modules',
  agentRun: 'agent-mode',
  report: 'relatorios',
  audit: 'audits',
  curadoria: 'curadoria',
  traceLog: 'agent-mode'
};

const getResultTitle = (result: SearchResult) => result.meta?.title || ('title' in result.entity ? String(result.entity.title) : result.entityType);

const SearchPage: React.FC<SearchPageProps> = ({ onNavigate, onOpenDocument }) => {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState<'all' | 'standard' | 'document' | 'decision' | 'report' | 'audit' | 'curadoria' | 'traceLog'>('all');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      centralPadroesSearchService.textSearch(query)
        .then(setResults)
        .catch((err) => {
          setError(String((err as Error)?.message || err));
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const filtered = tab === 'all' ? results : results.filter((result) => result.entityType === tab);
  const navigateToResult = (result: SearchResult) => {
    if (result.entityType === 'document' && 'id' in result.entity) {
      onOpenDocument?.(String(result.entity.id));
      return;
    }
    onNavigate?.(result.routeId || routeByType[result.entityType] || 'search');
  };

  return (
    <CentralPageShell title="Busca Textual da Central" subtitle="Busca textual ampliada da Central. A busca semântica com embeddings e pgvector fica preparada como evolução futura, mas ainda não está ativa.">
      <section className="cp-docs-search-hero">
        <div>
          <p className="cp-docs-kicker">Modo atual: {centralPadroesSearchRoadmap.currentMode}</p>
          <h2>Pesquisar padrões, documentos e decisões</h2>
          <p>Campos considerados: título, tipo, categoria, status, risco, owner, tags, caminhos, resumo, conteúdo, origem, data e metadados disponíveis.</p>
        </div>
        <CentralFilterBar activeCount={(query.trim() ? 1 : 0) + (tab !== 'all' ? 1 : 0)} onClear={(query.trim() || tab !== 'all') ? () => { setQuery(''); setTab('all'); } : undefined}>
          <label className="cp-docs-big-search">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex: decisão com IA, rastreabilidade, deploy, criar tabela Supabase" />
          </label>
        </CentralFilterBar>
      </section>

      <div className="cp-docs-tab-row">
        {(['all', 'standard', 'document', 'decision', 'report', 'audit', 'curadoria', 'traceLog'] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`cp-docs-filter ${tab === item ? 'active' : ''}`}>{resultLabels[item]}</button>
        ))}
      </div>

      <section className="cp-docs-result-list">
        {loading && <CentralLoadingState label="Buscando registros na Central..." />}
        {error && <CentralErrorState title="Não foi possível concluir a busca" message={error} />}
        {filtered.map((result, index) => (
          <article key={`${result.entityType}-${index}`} className="cp-docs-result-card">
            <div>
              <p className="cp-docs-kicker">{result.originLabel || resultLabels[result.entityType] || result.entityType}</p>
              <h3>{getResultTitle(result)}</h3>
              <p>{result.excerpt}</p>
              {result.meta && (
                <div className="cp-docs-search-meta">
                  {result.meta.type && <span>{result.meta.type}</span>}
                  {result.meta.category && <span>{result.meta.category}</span>}
                  {result.meta.status && <span>{result.meta.status}</span>}
                  {result.meta.risk && <span>{result.meta.risk}</span>}
                  {result.meta.owner && <span>{result.meta.owner}</span>}
                  {(result.meta.pathRelative || result.meta.pathAbsolute) && <span>{result.meta.pathRelative || result.meta.pathAbsolute}</span>}
                  {result.meta.tags?.map((tag) => <span key={tag}>#{tag}</span>)}
                </div>
              )}
            </div>
            <div className="cp-docs-result-actions">
              <span className="cp-docs-score">score {(result.score * 100).toFixed(0)}%</span>
              <button type="button" className="cp-docs-mini-btn" onClick={() => navigateToResult(result)}>Abrir origem</button>
            </div>
          </article>
        ))}
        {!loading && filtered.length === 0 && <CentralEmptyState icon="🔎" title="Nenhum resultado encontrado" description="Tente buscar por título, tag, owner, caminho, status, risco ou categoria." />}
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
