import React from 'react';
import { Agente } from '../types';

interface SquadTopologyProps {
  agentes: Agente[];
}

const SquadTopology: React.FC<SquadTopologyProps> = ({ agentes }) => {
  // Encontrar o fluxo SDR -> Closer -> Farmer
  const sdr = agentes.find(a => a.funcao === 'SDR');
  const closer = agentes.find(a => a.funcao === 'CLOSER');
  const farmer = agentes.find(a => a.funcao === 'FARMER');

  const Node = ({ agente, title }: { agente?: Agente, title: string }) => (
    <div className="flex flex-col items-center z-10">
      <div className={`w-32 h-32 rounded-3xl border-4 ${agente ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-slate-100 border-dashed'} bg-white flex flex-col items-center justify-center p-4 transition-all hover:scale-105`}>
        {agente ? (
          <>
            <img 
              src={agente.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agente.nome)}`} 
              className="w-12 h-12 rounded-xl mb-2 shadow-sm"
              alt={agente.nome} 
            />
            <span className="text-[10px] font-black text-slate-800 text-center uppercase tracking-tighter leading-none line-clamp-2">
              {agente.nome}
            </span>
            <span className="text-[8px] font-bold text-blue-600 mt-1 uppercase tracking-widest">{agente.funcao}</span>
          </>
        ) : (
          <span className="text-[10px] font-bold text-slate-300 uppercase italic">Vazio</span>
        )}
      </div>
      <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
        {title}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 rounded-[40px] p-12 border border-slate-200 relative overflow-hidden min-h-[400px] flex items-center justify-center">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#004e92 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
          </marker>
        </defs>
        
        {/* SDR to Closer Line */}
        {sdr && closer && (
          <line 
            x1="33%" y1="50%" x2="45%" y2="50%" 
            stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" 
            markerEnd="url(#arrow)"
            className="animate-[dash_20s_linear_infinite]"
          />
        )}

        {/* Closer to Farmer Line */}
        {closer && farmer && (
          <line 
            x1="55%" y1="50%" x2="66%" y2="50%" 
            stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" 
            markerEnd="url(#arrow)"
            className="animate-[dash_20s_linear_infinite]"
          />
        )}
      </svg>

      <div className="flex items-center justify-around w-full max-w-5xl relative">
        {/* Lead Entry */}
        <div className="hidden md:flex flex-col items-center">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entrada Lead</span>
        </div>

        <Node agente={sdr} title="Qualificação" />
        <Node agente={closer} title="Fechamento" />
        <Node agente={farmer} title="Retenção" />

        {/* Closed Won */}
        <div className="hidden md:flex flex-col items-center">
           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Venda Concluída</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}} />
    </div>
  );
};

export default SquadTopology;
