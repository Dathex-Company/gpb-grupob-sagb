import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesRelationshipService, ImpactAnalysis } from '../services/centralPadroesRelationshipService';

const RelationshipsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  const [selectedId, setSelectedId] = React.useState<string>('');
  const [impact, setImpact] = React.useState<ImpactAnalysis | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  React.useEffect(() => {
    const id = selectedId || snapshot?.standards[0]?.key;
    if (!id) return;
    setSelectedId(id);
    centralPadroesRelationshipService.getImpactAnalysis(id).then(setImpact).catch((err) => setToast({ message: String((err as Error)?.message || err), type: 'error' }));
  }, [snapshot, selectedId]);

  return (
    <CentralPageShell title="Relacionamentos / Grafo" subtitle="Grafo visual V1 das dependências entre padrões, módulos e riscos de alteração.">
      <SectionPanel title="Grafo de dependências" description="Nós representam padrões. Arestas textuais indicam dependências declaradas no fallback ou no Supabase.">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl border border-sagb-line bg-sagb-bg-2 p-5">
            <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_55%)]">
              {(snapshot?.standards || []).map((standard, index) => {
                const angle = (index / Math.max(snapshot?.standards.length || 1, 1)) * Math.PI * 2;
                const left = 45 + Math.cos(angle) * 32;
                const top = 45 + Math.sin(angle) * 32;
                return (
                  <button key={standard.id} onClick={() => setSelectedId(standard.key)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-left shadow-sm transition-transform hover:scale-105 ${selectedId === standard.key ? 'border-blue-500 bg-blue-500/20' : 'border-sagb-line bg-sagb-panel'}`} style={{ left: `${left}%`, top: `${top}%` }}>
                    <p className="font-mono text-[10px] font-black text-sagb-text">{standard.key}</p>
                    <p className="max-w-36 truncate text-[11px] text-sagb-muted">{standard.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="rounded-3xl border border-sagb-line bg-sagb-bg-2 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sagb-muted">Análise de impacto</p>
            <h3 className="mt-2 text-lg font-black text-sagb-text">{selectedId || 'Selecione um padrão'}</h3>
            {impact && (
              <div className="mt-4 space-y-3 text-[12px] text-sagb-muted">
                <StatusBadge value={impact.breakingChanges ? 'critico' : impact.riskScore > 0 ? 'medio' : 'baixo'} />
                <p>Score de risco: <strong>{impact.riskScore}</strong></p>
                <p>Dependentes diretos: {impact.directDependents.length ? impact.directDependents.join(', ') : 'nenhum'}</p>
                <p>Dependentes indiretos: {impact.indirectDependents.length ? impact.indirectDependents.join(', ') : 'nenhum'}</p>
              </div>
            )}
          </aside>
        </div>
      </SectionPanel>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default RelationshipsPage;

