/**
 * CidDashboard.tsx
 *
 * Dashboard geral do módulo CID.
 * Exibe métricas agregadas, últimos uploads, processamentos e status geral.
 */
import React, { useMemo } from 'react';
import { CidAsset, CidChunk, CidOutput, CidProcessingJob } from '../../../types';

interface CidDashboardProps {
  assets: CidAsset[];
  jobs: CidProcessingJob[];
  chunks: CidChunk[];
  outputs: CidOutput[];
  onNavigate?: (view: string) => void;
}

const LABEL_MAP: Record<string, string> = {
  completed: 'Concluído', completed_warning: 'Concluído c/ aviso',
  error: 'Erro', processing: 'Processando', queued: 'Na fila', received: 'Recebido',
};

const toLabel = (v: any) => LABEL_MAP[String(v || '').toLowerCase()] || String(v || '-');

const fmt = (value: any) => {
  if (!value) return '-';
  try { return new Date(value).toLocaleString('pt-BR'); } catch { return String(value); }
};

const statusColor: Record<string, string> = {
  completed: 'bg-emerald-500', completed_warning: 'bg-amber-500',
  error: 'bg-red-500', processing: 'bg-blue-500', queued: 'bg-gray-400', received: 'bg-indigo-400',
};

const CidDashboard: React.FC<CidDashboardProps> = ({ assets, jobs, chunks, outputs }) => {
  const totalAssets = assets.length;
  const totalJobs = jobs.length;
  const totalChunks = chunks.length;
  const totalOutputs = outputs.length;

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      const status = String(a.status || 'unknown').toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [assets]);

  const processingCount = useMemo(() =>
    jobs.filter((j) => ['queued', 'processing', 'fragmenting', 'transcribing', 'summarizing', 'consolidating'].includes(String(j.status || '').toLowerCase())).length,
  [jobs]);

  const materialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      const t = String(a.materialType || 'other').toLowerCase();
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [assets]);

  const recentAssets = useMemo(() =>
    [...assets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
  [assets]);

  const recentJobs = useMemo(() =>
    [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6),
  [jobs]);

  const recentOutputs = useMemo(() =>
    [...outputs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
  [outputs]);

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      const s = String(a.sourceKind || 'unknown').toLowerCase();
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [assets]);

  return (
    <div className="h-full overflow-auto bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-violet-800 to-indigo-900 text-white px-6 md:px-10 pt-7 pb-8 shadow-lg">
        <p className="text-[10px] uppercase tracking-[0.25em] font-black text-indigo-300/70">CID • Central de Inteligência Documental</p>
        <h1 className="text-2xl md:text-3xl font-black mt-1">Dashboard Geral</h1>
        <p className="text-sm text-indigo-200/70 mt-2">Panorama geral do acervo, processamentos e atividade recente.</p>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Ativos</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalAssets}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Processando</p>
            <p className={`text-3xl font-black mt-1 ${processingCount > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{processingCount}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Jobs</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalJobs}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Fragmentos</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalChunks}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Outputs</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalOutputs}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Origens</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{Object.keys(sourceCounts).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Status dos ativos */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Status do Acervo</h3>
            <div className="space-y-3">
              {Object.entries(statusCounts).sort(([, a], [, b]) => b - a).map(([status, count]) => (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">{toLabel(status)}</span>
                    <span className="font-black text-slate-400">{count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${statusColor[status] || 'bg-slate-400'}`}
                      style={{ width: `${(count / Math.max(1, totalAssets)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimos uploads */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Últimos Uploads</h3>
            <div className="space-y-3">
              {recentAssets.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhum ativo ainda.</p>
              ) : (
                recentAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{asset.title || 'Sem título'}</p>
                      <p className="text-[10px] text-slate-400">{fmt(asset.createdAt)}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${String(asset.status || '').toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {toLabel(asset.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Últimos processamentos */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Últimos Processamentos</h3>
            <div className="space-y-3">
              {recentJobs.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhum job ainda.</p>
              ) : (
                recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{job.jobType || 'job'}</p>
                      <p className="text-[10px] text-slate-400">{fmt(job.createdAt)}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColor[job.status || ''] ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {toLabel(job.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Por tipo de material */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Por Tipo de Material</h3>
            {Object.keys(materialCounts).length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum dado.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(materialCounts).sort(([, a], [, b]) => b - a).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">{type}</span>
                      <span className="font-black text-slate-400">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${(count / Math.max(1, totalAssets)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Por origem */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Por Origem</h3>
            {Object.keys(sourceCounts).length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum dado.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(sourceCounts).sort(([, a], [, b]) => b - a).map(([source, count]) => (
                  <div key={source}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">{source}</span>
                      <span className="font-black text-slate-400">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(count / Math.max(1, totalAssets)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Últimos outputs */}
        {recentOutputs.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Últimos Outputs Gerados</h3>
            <div className="space-y-2">
              {recentOutputs.map((out) => (
                <div key={out.id} className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">{out.outputType || 'output'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">{fmt(out.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CidDashboard;
