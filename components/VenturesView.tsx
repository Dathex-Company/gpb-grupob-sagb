import { useMemo, useState } from 'react';
import { Agent, Venture } from '../types';

interface VenturesViewProps {
  ventures: Venture[];
  agents: Agent[];
  onAddVenture: (venture: Venture) => void;
  onRemoveVenture: (ventureId: string) => void;
}

const VenturesView: React.FC<VenturesViewProps> = ({ ventures, agents, onAddVenture, onRemoveVenture }) => {
  const [name, setName] = useState('');
  const [segment, setSegment] = useState('');

  const venturesOrdered = useMemo(
    () => [...ventures].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [ventures]
  );

  const agentsByVenture = useMemo(() => {
    const map: Record<string, number> = {};
    agents.forEach((agent) => {
      const key = String(agent.ventureId || '').trim();
      if (!key) return;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [agents]);

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const newVenture: Venture = {
      id: `venture-${Date.now()}`,
      name: trimmedName,
      logo: '🏢',
      type: 'Projeto',
      status: 'IDEIA',
      statusLab: 'Pendente',
      segment: segment.trim() || undefined,
      timestamp: new Date()
    };

    onAddVenture(newVenture);
    setName('');
    setSegment('');
  };

  return (
    <div className="h-full w-full bg-[#F9FAFB] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 p-6 md:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">Nova venture</label>
            <input
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 outline-none"
              placeholder="Nome da venture"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">Segmento (opcional)</label>
            <input
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 outline-none"
              placeholder="Ex.: SaaS, Educação, Saúde"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold"
          >
            Adicionar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {venturesOrdered.map((venture) => (
            <article key={venture.id} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{venture.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {venture.segment || venture.niche || 'Sem segmento definido'}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveVenture(venture.id)}
                  className="text-xs rounded-lg px-2 py-1 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:text-red-300"
                >
                  Remover
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">{venture.status}</span>
                <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">{venture.type}</span>
                <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">Lab: {venture.statusLab}</span>
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Agentes vinculados: <strong>{agentsByVenture[venture.id] || 0}</strong>
              </p>
            </article>
          ))}
        </div>

        {venturesOrdered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/15 p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhuma venture cadastrada ainda.
          </div>
        )}
      </div>
    </div>
  );
};

export default VenturesView;
