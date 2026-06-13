import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { Toast } from '../components/Toast';
import { centralPadroesTriagemService } from '../services/centralPadroesTriagemService';
import { CentralIngestionItem } from '../types';

type TriagemIngestaoPageProps = {
  onOpenDocuments?: () => void;
};

const TriagemIngestaoPage: React.FC<TriagemIngestaoPageProps> = ({ onOpenDocuments }) => {
  const [items, setItems] = React.useState<CentralIngestionItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await centralPadroesTriagemService.listQueue());
    } catch (err) {
      setError(String((err as Error)?.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const accept = async (item: CentralIngestionItem) => {
    try {
      await centralPadroesTriagemService.acceptSuggestion(item.id);
      setToast({ message: 'Sugestão aceita. Abra Documentos para concluir metadados e curadoria.', type: 'success' });
      await load();
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  const ignore = async (item: CentralIngestionItem) => {
    try {
      await centralPadroesTriagemService.ignore(item.id);
      setToast({ message: 'Sugestão ignorada.', type: 'success' });
      await load();
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title="Triagem e Ingestão" subtitle="Fila operacional de documentos candidatos. Aceitar não faz merge automático; abre caminho para curadoria segura.">
      {loading && <div className="cp-docs-inline-alert">Carregando fila de ingestão...</div>}
      {error && <div className="cp-docs-inline-alert error">Falha ao carregar triagem: {error}</div>}
      <section className="cp-docs-panel">
        <div className="cp-docs-toolbar">
          <p className="cp-docs-kicker">Itens na fila: {items.length}</p>
          <button type="button" className="cp-docs-top-link" onClick={load}>Atualizar</button>
        </div>
        <section className="cp-docs-result-list">
          {items.map((item) => (
            <article key={item.id} className="cp-docs-result-card">
              <div>
                <p className="cp-docs-kicker">{item.sourceKind} • {item.status} • confiança {Math.round(item.confidence)}%</p>
                <h3>{item.title}</h3>
                <p>{item.sourcePath || 'Sem caminho informado'} — destino sugerido: {item.suggestedDestination}</p>
              </div>
              <div className="cp-docs-result-actions">
                <button type="button" className="cp-docs-mini-btn" onClick={() => accept(item)}>Aceitar</button>
                <button type="button" className="cp-docs-mini-btn" onClick={() => ignore(item)}>Ignorar</button>
                <button type="button" className="cp-docs-mini-btn" onClick={onOpenDocuments}>Abrir Documentos</button>
              </div>
            </article>
          ))}
          {!loading && items.length === 0 && <div className="cp-docs-empty-note">Nenhum item na fila de ingestão.</div>}
        </section>
      </section>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default TriagemIngestaoPage;

