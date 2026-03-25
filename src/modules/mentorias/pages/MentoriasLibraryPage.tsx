import React, { useEffect, useState } from 'react';
import { Mentoria } from '../types/mentorias.types';
import { mentoriasService } from '../services/mentorias.service';
import { SearchIcon, FilterIcon, BookIcon, ArrowRightIcon } from '../../../../components/Icon';

interface MentoriasLibraryPageProps {
  onNavigate: (view: 'dashboard' | 'detail', id?: string) => void;
}

export const MentoriasLibraryPage: React.FC<MentoriasLibraryPageProps> = ({ onNavigate }) => {
  const [mentorias, setMentorias] = useState<Mentoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    mentoriasService.getMentorias().then(data => {
      setMentorias(data);
      setIsLoading(false);
    });
  }, []);

  const filteredMentorias = mentorias.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <header className="p-8 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biblioteca de Mentorias</h1>
            <p className="text-xs text-gray-500">Gerencie e explore todo o acervo de conhecimento.</p>
          </div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por título, tipo ou tecnologia..." 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 rounded-2xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm text-gray-600 dark:text-gray-400">
            <FilterIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Filtros</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando Acervo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentorias.map(mentoria => (
              <div 
                key={mentoria.id}
                onClick={() => onNavigate('detail', mentoria.id)}
                className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                    <BookIcon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    mentoria.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {mentoria.status === 'active' ? 'Oficial' : 'Em Construção'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {mentoria.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-6 flex-1 italic">
                  {mentoria.description}
                </p>

                <div className="pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-tighter block">Versão</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{mentoria.version}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-tighter block">Tipo</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{mentoria.type}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Abrir Estrutura</span>
                  <ArrowRightIcon className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
