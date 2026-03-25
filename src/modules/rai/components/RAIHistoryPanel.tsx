import React from 'react';

const RAIHistoryPanel: React.FC = () => {
  const history = [
    { date: 'Hoje', count: 142, trend: '+12%' },
    { date: 'Ontem', count: 310, trend: '+5%' },
    { date: '23 Mar', count: 285, trend: '-2%' },
    { date: '22 Mar', count: 420, trend: '+18%' },
  ];

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Volume Histórico</h3>
      </div>
      
      <div className="space-y-4">
        {history.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.date}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-gray-900 dark:text-white">{item.count} capturas</span>
              <span className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
        <button className="w-full py-3 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-blue-500/50 hover:text-blue-500 transition-all">
          Exportar Histórico Completo
        </button>
      </div>
    </div>
  );
};

export default RAIHistoryPanel;
