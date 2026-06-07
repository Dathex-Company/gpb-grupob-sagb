import React from 'react';
import { CidProcessingJob } from '../../../../types';
import { cidFormatDate, cidStatusBadge, cidToLabel } from '../cid-utils';

interface CidProcessingQueueProps {
  jobs: CidProcessingJob[];
  onBack: () => void;
}

const CidProcessingQueue: React.FC<CidProcessingQueueProps> = ({ jobs, onBack }) => {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-5 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">CID Operacional</p>
            <h2 className="text-xl font-black text-slate-900">Fila de Processamento</h2>
          </div>
          <button onClick={onBack} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">← Voltar</button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1fr_130px_100px_90px_150px] gap-3 px-4 py-3 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Job</span><span>Status</span><span>Progresso</span><span>Tentativas</span><span>Criado em</span>
          </div>
          {jobs.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">Nenhum job encontrado.</div>
          ) : jobs.map((job) => (
            <div key={job.id} className="grid grid-cols-[1fr_130px_100px_90px_150px] gap-3 px-4 py-3 border-t border-slate-100 text-xs items-center hover:bg-slate-50 transition-colors">
              <div className="min-w-0">
                <p className="font-black text-slate-800 truncate">{job.jobType || 'ingestion'}</p>
                <p className="text-[10px] text-slate-400 truncate">{job.id}</p>
              </div>
              <span><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black ${cidStatusBadge(job.status)}`}>{cidToLabel(job.status)}</span></span>
              <span className="font-bold text-slate-600">{Number(job.progressPct || 0)}%</span>
              <span className="text-slate-500">{Number(job.retries || 0)}/{Number(job.maxRetries || 3)}</span>
              <span className="text-slate-500 whitespace-nowrap">{cidFormatDate(job.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CidProcessingQueue;

