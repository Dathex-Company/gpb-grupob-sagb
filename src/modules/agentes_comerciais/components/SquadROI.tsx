import React from 'react';

interface SquadROIProps {
  stats: {
    total: number;
    atendimentos_totais: number;
    roi_estimado?: number;
    custo_operacional?: number;
  };
}

const SquadROI: React.FC<SquadROIProps> = ({ stats }) => {
  const roiValue = stats.roi_estimado || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Card ROI Principal */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-blue-100">ROI ESTIMADO SQUAD</span>
          <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-black">MENSAL</div>
        </div>
        <div className="text-5xl font-black mb-2 tracking-tighter">
          {Math.round(roiValue * 100)}%
        </div>
        <p className="text-blue-100 text-sm font-medium">Retorno sobre o custo operacional do squad comercial.</p>
        
        <div className="mt-8 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, roiValue * 10)}%` }}></div>
        </div>
      </div>

      {/* Custo Operacional */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">INVESTIMENTO ATIVO</div>
        <div className="text-4xl font-black text-slate-800 tracking-tight">
          R$ {stats.custo_operacional?.toLocaleString('pt-BR') || '0'}
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Custo IAs</span>
            <span className="font-bold text-slate-700 tracking-tight">R$ 1.300</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Serviços Voice</span>
            <span className="font-bold text-slate-700 tracking-tight">R$ 450</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t">
            <span className="text-slate-500 uppercase text-[10px] font-black">Burn Mensal</span>
            <span className="font-black text-blue-600">R$ 1.750</span>
          </div>
        </div>
      </div>

      {/* Performance de Volume */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">VOLUME DE CONVERSÃO</div>
        <div className="text-4xl font-black text-slate-800 tracking-tight">
          {stats.atendimentos_totais.toLocaleString('pt-BR')}
        </div>
        <p className="text-slate-500 text-sm font-medium mt-1">Sessões de qualificação concluídas.</p>
        
        {/* Fake Mini Graph */}
        <div className="mt-8 flex items-end gap-1.5 h-16">
          {[40, 60, 45, 90, 100, 80, 120, 95].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-slate-100 rounded-t-lg transition-all hover:bg-blue-200"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SquadROI;
