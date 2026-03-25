import React from 'react';
import { RAICapture } from '../types';

interface RAICapturesPanelProps {
  captures: RAICapture[];
}

const RAICapturesPanel: React.FC<RAICapturesPanelProps> = ({ captures }) => {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Últimas Capturas</h3>
        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full"></div>
           </button>
        </div>
      </div>

      <div className="space-y-4">
        {captures.map((cap) => (
          <div key={cap.id} className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-blue-500/20 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                {cap.category}
              </span>
              <span className="text-[9px] text-gray-400 font-medium">
                {new Date(cap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 className="text-xs font-black text-gray-900 dark:text-white mb-2 leading-tight">
              {cap.title}
            </h4>
            <div className="flex items-center gap-2 mb-3">
               {cap.tags.slice(0, 3).map(tag => (
                 <span key={tag} className="text-[8px] font-bold text-gray-400 bg-white dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-100 dark:border-white/5">
                   #{tag}
                 </span>
               ))}
            </div>
            <div className="flex items-center justify-between text-[10px]">
               <span className="text-gray-400">Fonte: <span className="text-gray-600 dark:text-gray-300 font-bold">{cap.sourceName}</span></span>
               <div className="flex items-center gap-1">
                  <div className="w-8 h-1 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500" style={{ width: `${cap.relevance}%` }}></div>
                  </div>
                  <span className="text-[8px] font-black text-blue-500">{cap.relevance}%</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RAICapturesPanel;
