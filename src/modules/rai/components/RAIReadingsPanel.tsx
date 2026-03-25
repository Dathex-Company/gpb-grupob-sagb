import React from 'react';
import { RAIReading } from '../types';

interface RAIReadingsPanelProps {
  readings: RAIReading[];
}

const RAIReadingsPanel: React.FC<RAIReadingsPanelProps> = ({ readings }) => {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Sínteses & Leituras</h3>
        <button className="text-[10px] font-black text-blue-500 uppercase hover:underline">Ver Todas</button>
      </div>

      <div className="space-y-6">
        {readings.map((reading) => (
          <div key={reading.id} className="relative pl-6 border-l-2 border-gray-100 dark:border-white/5">
            <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            
            <div className="flex items-center gap-2 mb-2">
               <h4 className="text-xs font-black text-gray-900 dark:text-white">{reading.title}</h4>
               {reading.trend === 'up' && <span className="text-emerald-500 text-[10px]">▲</span>}
            </div>
            
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-4">
              {reading.synthesis}
            </p>
            
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mb-4">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Key Points</p>
               <ul className="space-y-2">
                 {reading.keyPoints.map((point, idx) => (
                   <li key={idx} className="text-[10px] text-gray-500 dark:text-gray-400 flex items-start gap-2">
                     <span className="text-blue-500 font-bold">•</span>
                     {point}
                   </li>
                 ))}
               </ul>
            </div>
            
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter">
                 <span className="text-gray-400">Sentimento: <span className={reading.sentiment === 'positive' ? 'text-emerald-500' : 'text-amber-500'}>{reading.sentiment}</span></span>
                 <span className="text-gray-400">Capturas Relacionadas: <span className="text-blue-500">{reading.relatedCaptures.length}</span></span>
               </div>
               <button className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                 Gerar Relatório
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RAIReadingsPanel;
