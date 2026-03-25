import React from 'react';

const RAIStatsStrip: React.FC = () => {
  const stats = [
    { label: 'Agentes Ativos', value: '12', color: 'text-emerald-500' },
    { label: 'Capturas 24h', value: '1,428', color: 'text-blue-500' },
    { label: 'Sinais Críticos', value: '03', color: 'text-rose-500' },
    { label: 'Tendências em Alta', value: '08', color: 'text-amber-500' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{stat.label}</p>
          <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default RAIStatsStrip;
