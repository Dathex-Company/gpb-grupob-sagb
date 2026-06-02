import React, { useMemo, useState } from 'react';
import { Agent } from '../../types';
import { NameCreatorStyle } from './nameLists';
import { GeneratedNameSuggestion, generateAgentNameSuggestions } from './nameGenerator';

interface NameCreatorPanelProps {
  agents: Agent[];
  onUseName: (name: string) => void;
}

const statusTone = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  similar: 'border-amber-200 bg-amber-50 text-amber-700'
};

const statusLabel = {
  available: 'Disponível',
  similar: 'Parecido'
};

export const NameCreatorPanel: React.FC<NameCreatorPanelProps> = ({ agents, onUseName }) => {
  const [count, setCount] = useState(4);
  const [style, setStyle] = useState<NameCreatorStyle>('MISTO');
  const [suggestions, setSuggestions] = useState<GeneratedNameSuggestion[]>([]);
  const [copyFeedback, setCopyFeedback] = useState('');

  const registeredNamesCount = useMemo(
    () => agents.filter((agent) => String(agent.name || '').trim()).length,
    [agents]
  );

  const handleGenerate = () => {
    setCopyFeedback('');
    setSuggestions(generateAgentNameSuggestions({ agents, count, style }));
  };

  const handleCountChange = (value: number) => {
    if (Number.isNaN(value)) {
      setCount(1);
      return;
    }
    setCount(Math.max(1, Math.min(24, value)));
  };

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopyFeedback(`${name} copiado.`);
    } catch {
      setCopyFeedback(`Selecione e copie manualmente: ${name}`);
    }
  };

  return (
    <section className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-sagb-panel px-8 py-3 transition-colors duration-300">
      <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Criador de Nomes</p>
            <h2 className="mt-0.5 text-sm font-black text-bitrix-nav dark:text-sagb-text">Gerar identidades operacionais</h2>
            <p className="mt-0.5 max-w-3xl text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Gere nomes no padrão Nome + Sobrenome, evitando nomes comuns, duplicados e conflitos com os {registeredNamesCount} cadastros carregados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_150px_auto]">
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Quantidade</span>
              <input
                type="number"
                min={1}
                max={24}
                step={1}
                value={count}
                onChange={(event) => handleCountChange(Number(event.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-indigo-300"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Estilo</span>
              <select
                value={style}
                onChange={(event) => setStyle(event.target.value as NameCreatorStyle)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-indigo-300"
              >
                <option value="MISTO">Misto</option>
                <option value="FEMININO">Feminino</option>
                <option value="MASCULINO">Masculino</option>
              </select>
            </label>

            <button
              onClick={handleGenerate}
              className="rounded-xl bg-bitrix-nav px-5 py-2 text-[10px] font-black uppercase tracking-wider text-white shadow-md transition hover:bg-black"
            >
              Gerar nomes
            </button>
          </div>
        </div>

        {copyFeedback && <p className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500">{copyFeedback}</p>}

        {suggestions.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-[minmax(160px,1fr)_110px_minmax(180px,1.4fr)_160px] border-b border-gray-100 bg-gray-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
              <span>Nome sugerido</span>
              <span>Status</span>
              <span>Validação</span>
              <span className="text-right">Ações</span>
            </div>
            <div className="max-h-72 overflow-auto">
              {suggestions.map((suggestion) => (
                <div key={suggestion.normalizedName} className="grid grid-cols-[minmax(160px,1fr)_110px_minmax(180px,1.4fr)_160px] items-center gap-2 border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-50/80">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-black text-gray-800">{suggestion.name}</p>
                    <p className="truncate font-mono text-[10px] font-semibold text-gray-400">{suggestion.normalizedName}</p>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${statusTone[suggestion.status]}`}>
                      {statusLabel[suggestion.status]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-gray-500">{suggestion.message}</p>
                    {suggestion.conflicts.length > 0 && (
                      <p className="truncate text-[10px] font-bold text-amber-600">
                        Conflito: {suggestion.conflicts.map((conflict) => conflict.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleCopy(suggestion.name)} className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-600 transition hover:bg-gray-50">
                      Copiar
                    </button>
                    <button onClick={() => onUseName(suggestion.name)} className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-indigo-700">
                      Usar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
