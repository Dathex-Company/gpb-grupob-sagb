import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { CentralIngestionItem } from '../types';
import { centralPadroesTriagemService } from '../services/centralPadroesTriagemService';

const shortcuts = ['Criar sistema novo', 'Criar módulo novo', 'Criar tabela Supabase', 'Criar API', 'Criar componente', 'Criar integração', 'Criar agente técnico', 'Fazer deploy', 'Refatorar legado', 'Reaproveitar módulo existente'];

const DevModePage: React.FC = () => {
  const [tab, setTab] = React.useState<'atalhos' | 'triagem'>('atalhos');
  const [queue, setQueue] = React.useState<CentralIngestionItem[]>([]);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const load = React.useCallback(async () => setQueue(await centralPadroesTriagemService.listQueue()), []);
  React.useEffect(() => { load(); }, [load]);

  const act = async (id: string, action: 'accept' | 'ignore') => {
    try {
      if (action === 'accept') await centralPadroesTriagemService.acceptSuggestion(id);
      else await centralPadroesTriagemService.ignore(id);
      setToast({ message: action === 'accept' ? 'Sugestão aceita.' : 'Item ignorado.', type: 'success' });
      await load();
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title="Modo Dev / Programador" subtitle="Atalhos e triagem para responder rapidamente qual padrão consultar antes de construir.">
      <div className="flex gap-2"><button onClick={() => setTab('atalhos')} className="rounded-xl bg-sagb-panel px-4 py-2 text-[12px] font-black text-sagb-text">Atalhos</button><button onClick={() => setTab('triagem')} className="rounded-xl bg-sagb-panel px-4 py-2 text-[12px] font-black text-sagb-text">Triagem</button></div>
      {tab === 'atalhos' ? (
        <SectionPanel title="Antes de construir">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">{shortcuts.map((shortcut) => <article key={shortcut} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4 text-[12px] font-black text-sagb-text">{shortcut}</article>)}</div>
        </SectionPanel>
      ) : (
        <SectionPanel title="Fila de triagem" description="Documentos brutos com sugestão de destino e confiança.">
          <div className="space-y-3">
            {queue.map((item) => <article key={item.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black text-sagb-text">{item.title}</h3><p className="mt-1 font-mono text-[11px] text-sagb-muted">{item.sourcePath}</p><p className="mt-2 text-[12px] text-sagb-muted">Área: {item.suggestedAreaId || 'indefinida'} · Destino: {item.suggestedDestination} · Confiança: {item.confidence}%</p></div><StatusBadge value={item.status} /></div><div className="mt-4 flex gap-2"><button onClick={() => act(item.id, 'accept')} className="rounded-xl bg-emerald-600 px-4 py-2 text-[12px] font-black text-white">Aceitar sugestão</button><button onClick={() => act(item.id, 'ignore')} className="rounded-xl bg-sagb-panel px-4 py-2 text-[12px] font-black text-sagb-muted">Ignorar</button></div></article>)}
          </div>
        </SectionPanel>
      )}
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};
export default DevModePage;

