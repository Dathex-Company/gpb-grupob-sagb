import React from 'react';

const RAIFiltersBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl mb-8">
      <div className="flex-1 min-w-[200px] relative">
        <input 
          type="text" 
          placeholder="Filtrar inteligência..." 
          className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-blue-500/50 rounded-xl px-4 py-2 text-xs outline-none transition-all"
        />
      </div>
      <select className="bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-xs outline-none cursor-pointer">
        <option>Todos os Agentes</option>
        <option>Radar Tech</option>
        <option>Sondagem de Mercado</option>
      </select>
      <select className="bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-xs outline-none cursor-pointer">
        <option>Todas as Categorias</option>
        <option>Tecnologia</option>
        <option>Financeiro</option>
        <option>Concorrência</option>
      </select>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-gray-400 uppercase">Relevância:</span>
        <input type="range" className="w-24 accent-blue-500" />
      </div>
    </div>
  );
};

export default RAIFiltersBar;
