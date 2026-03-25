import React from 'react';

const RAIHero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden border border-white/10">
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Intelligence Unit</span>
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter leading-none">RAI: Radar Avançado de Inteligência</h1>
        <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
          Monitoramento estratégico do ecossistema externo. Transformando sinais dispersos em inteligência útil para o GrupoB.
        </p>
      </div>
      
      {/* Elemento Visual Radar */}
      <div className="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[400px] h-[400px] opacity-10 pointer-events-none">
        <div className="w-full h-full rounded-full border border-blue-400 animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-[50px] rounded-full border border-blue-400/50 animate-[spin_7s_linear_infinite_reverse]"></div>
        <div className="absolute inset-[100px] rounded-full border border-blue-400/30"></div>
      </div>
    </div>
  );
};

export default RAIHero;
