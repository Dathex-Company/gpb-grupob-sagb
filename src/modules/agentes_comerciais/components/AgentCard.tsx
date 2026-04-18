import React from 'react';
import { MailIcon, CheckIcon, ClockIcon, UserPlusIcon, MicIcon, BriefcaseIcon, PlayIcon } from '../../../../components/Icon';
import { Agente } from '../types';

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

interface AgentCardProps {
  agente: Agente;
  onSelect?: (agente: Agente) => void;
  onEdit?: (agente: Agente) => void;
  onClone?: (agente: Agente) => void;
  onSupervise?: (agente: Agente) => void;
  className?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ agente, onSelect, onEdit, onClone, onSupervise, className = '' }) => {
  const getFuncaoColor = (funcao: string) => {
    switch (funcao) {
      case 'SDR': return 'bg-orange-500 text-white';
      case 'CLOSER': return 'bg-purple-600 text-white';
      case 'FARMER': return 'bg-emerald-600 text-white';
      case 'CRC': return 'bg-blue-500 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'INATIVO': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return '---';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div 
      className={`group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer overflow-hidden relative ${className}`}
      onClick={() => onSelect?.(agente)}
    >
      {/* Badge de Função Destaque */}
      <div className={`absolute top-0 right-0 px-8 py-1.5 rotate-45 translate-x-12 translate-y-2 text-[10px] font-black tracking-widest uppercase shadow-lg z-10 ${getFuncaoColor(agente.funcao)}`}>
        {agente.funcao}
      </div>

      <div className="flex items-start gap-5">
        <div className="relative">
          <div className="p-1 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
             <img 
               src={agente.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agente.nome)}&background=4f46e5&color=fff`}
               alt={agente.nome}
               className="w-16 h-16 rounded-xl object-cover border-2 border-white/50"
             />
          </div>
          {agente.status === 'ATIVO' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 text-lg truncate tracking-tight">{agente.nome}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
             <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100/50 uppercase">
                {agente.vertical || 'Geral'}
             </span>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${getStatusColor(agente.status)}`}>
                {agente.status.toLowerCase().replace('_', ' ')}
             </span>
          </div>
        </div>
      </div>

      {/* Persona / Bio Curta */}
      {agente.persona?.bio && (
        <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 relative group-hover:bg-white group-hover:border-blue-100 transition-all">
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
            "{agente.persona.bio}"
          </p>
        </div>
      )}

      {/* Atributos do Squad */}
      <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-4">
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <MailIcon className="w-3.5 h-3.5 mr-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="truncate">{agente.email}</span>
        </div>
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <BriefcaseIcon className="w-3.5 h-3.5 mr-2 text-slate-400 group-hover:text-blue-500" />
          <span>Cap. {agente.capacidade_concorrente}</span>
        </div>
        {agente.voz && (
          <div className="flex items-center text-xs text-blue-600 font-black">
            <MicIcon className="w-3.5 h-3.5 mr-2" />
            <span className="uppercase tracking-tighter">Voz Habilitada</span>
            <PlayIcon className="w-3 h-3 ml-1 animate-pulse" />
          </div>
        )}
        <div className="flex items-center text-xs text-slate-400">
          <ClockIcon className="w-3.5 h-3.5 mr-2" />
          <span>{formatDate(agente.updated_at)}</span>
        </div>
      </div>

      {/* Métricas Visual Impact */}
      {agente.metricas && (
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2">
           <div className="text-center group-hover:scale-105 transition-transform">
             <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Sales</div>
             <div className="text-sm font-black text-slate-800">{agente.metricas.atendimentos_concluidos}</div>
             <div className="mt-1 h-1 w-8 mx-auto bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '70%' }}></div>
             </div>
           </div>
           <div className="text-center border-x border-slate-50 group-hover:scale-105 transition-transform">
             <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Rating</div>
             <div className="text-sm font-black text-slate-800">{agente.metricas.satisfacao_media.toFixed(1)}</div>
             <div className="mt-1 h-1 w-8 mx-auto bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '90%' }}></div>
             </div>
           </div>
           <div className="text-center group-hover:scale-105 transition-transform">
             <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Time</div>
             <div className="text-sm font-black text-slate-800">{agente.metricas.tempo_medio_resposta}s</div>
             <div className="mt-1 h-1 w-8 mx-auto bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '40%' }}></div>
             </div>
           </div>
        </div>
      )}

      {/* Actions (Hover) */}
      {/* Actions (Hover) */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit?.(agente); }}
          className="flex-1 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
        >
          Configurar DNA
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClone?.(agente); }}
          className="px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest"
          title="Clonar Agente"
        >
          Clonar
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSupervise?.(agente); }}
          className="px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest"
          title="Supervisionar (Shadowing)"
        >
          Supervisionar
        </button>
      </div>
    </div>
  );
};

export default AgentCard;