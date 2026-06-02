import React, { useMemo, useState } from 'react';
import { countSupabaseTableRowsSafely, supabaseMovementReadiness, supabaseObservedAssets, SupabaseObservedAsset } from '../services';

const statusStyle: Record<string, string> = {
  real: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/30',
  inferido: 'bg-sky-500/10 text-sky-600 border-sky-400/30',
  pendente: 'bg-slate-500/10 text-slate-500 border-slate-400/30',
  erro: 'bg-red-500/10 text-red-600 border-red-400/30',
  sem_permissao: 'bg-orange-500/10 text-orange-600 border-orange-400/30',
  nao_encontrado: 'bg-violet-500/10 text-violet-600 border-violet-400/30'
};

const MonitoramentoSupabasePage: React.FC = () => {
  const [assets, setAssets] = useState<SupabaseObservedAsset[]>(supabaseObservedAssets);
  const [query, setQuery] = useState('');
  const [isCounting, setIsCounting] = useState(false);

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return assets;
    return assets.filter((asset) => `${asset.tableName} ${asset.moduleName} ${asset.status}`.toLowerCase().includes(normalized));
  }, [assets, query]);

  const grouped = useMemo(() => {
    return filteredAssets.reduce<Record<string, SupabaseObservedAsset[]>>((acc, asset) => {
      acc[asset.moduleName] ||= [];
      acc[asset.moduleName].push(asset);
      return acc;
    }, {});
  }, [filteredAssets]);

  const totalKnownRecords = assets.reduce((sum, asset) => sum + (asset.recordCount || 0), 0);
  const inferred = assets.filter((asset) => asset.status === 'inferido').length;
  const validated = assets.filter((asset) => asset.status === 'real').length;
  const noPermission = assets.filter((asset) => asset.status === 'sem_permissao').length;
  const readErrors = assets.filter((asset) => asset.status === 'erro').length;
  const lastCheck = assets.find((asset) => asset.lastReadAt !== 'não executada')?.lastReadAt || 'não executada';

  const runSafeCounts = async () => {
    setIsCounting(true);
    const results: SupabaseObservedAsset[] = [];

    for (const asset of assets) {
      const countResult = await countSupabaseTableRowsSafely(asset);
      results.push({
        ...asset,
        recordCount: countResult.recordCount,
        status: countResult.status,
        lastReadAt: countResult.lastReadAt,
        note: countResult.note,
        origin: countResult.origin,
        sourceEvidence: countResult.sourceEvidence
      });
    }

    setAssets(results);
    setIsCounting(false);
  };

  return (
    <section className="space-y-5">
      <header className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
        <span className="text-[9px] font-black uppercase tracking-[0.34em] text-cyan-500">Database Observatory</span>
        <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Supabase / Database</h1>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Mapeamento por módulo com contagem HEAD segura quando acionada. Não lê linhas nem exibe dados pessoais.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tabela, módulo ou status" className="min-w-[260px] rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none" />
          <button type="button" onClick={runSafeCounts} disabled={isCounting} className="rounded-2xl bg-cyan-500 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-60">
            {isCounting ? 'Contando...' : 'Contar registros com segurança'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 xl:grid-cols-7 gap-3">
        {[
          ['Assets mapeados', String(assets.length)],
          ['Inferidas', String(inferred)],
          ['Validadas', String(validated)],
          ['Registros conhecidos', String(totalKnownRecords)],
          ['Sem permissão', String(noPermission)],
          ['Erros', String(readErrors)],
          ['Última verificação', lastCheck === 'não executada' ? 'pendente' : 'realizada']
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-3">
            <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
            <strong className="text-lg font-black text-slate-950 dark:text-white">{value}</strong>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([moduleName, assets]) => (
          <section key={moduleName} className="rounded-[22px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 px-4 py-3">
              <h2 className="text-sm font-black text-slate-950 dark:text-white">{moduleName}</h2>
              <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[9px] font-black uppercase text-cyan-600">{assets.length} itens</span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5 text-[9px] uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Registros</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Origem</th>
                    <th className="px-4 py-2">Movimentação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {assets.map((asset) => (
                    <tr key={`${asset.moduleName}-${asset.tableName}`} className="text-xs text-slate-600 dark:text-slate-300">
                      <td className="px-4 py-2 font-black text-slate-900 dark:text-white">{asset.tableName}</td>
                      <td className="px-4 py-2">{asset.kind}</td>
                      <td className="px-4 py-2">{asset.recordCount ?? 'pendente'}</td>
                      <td className="px-4 py-2"><span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase ${statusStyle[asset.status]}`}>{asset.status}</span></td>
                      <td className="px-4 py-2">{asset.origin}</td>
                      <td className="px-4 py-2" title={asset.note}>{asset.movementStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-[22px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-4 shadow-sm">
        <h2 className="text-sm font-black text-slate-950 dark:text-white">Movimentações futuras</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {supabaseMovementReadiness.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2">
              <strong className="block text-xs text-slate-800 dark:text-slate-100">{item.label}</strong>
              <span className="text-[10px] font-bold text-slate-500">{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default MonitoramentoSupabasePage;
