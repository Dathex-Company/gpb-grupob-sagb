import React, { useState } from 'react';
import { Mentoria } from '../types/mentorias.types';
import { useMentorias } from '../hooks/useMentorias';
import { SearchIcon, FilterIcon, BookIcon, ArrowRightIcon } from '../../../../../components/Icon';

interface MentoriasLibraryPageProps {
  onNavigate: (view: 'dashboard' | 'detail', id?: string) => void;
}

export const MentoriasLibraryPage: React.FC<MentoriasLibraryPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { mentorias, loading } = useMentorias();

  const filteredMentorias = mentorias.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-sagb-bg text-sagb-text font-inter min-h-full">
      <header className="p-8 border-b border-sagb-line bg-sagb-panel/50 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-sagb-text tracking-tight">Biblioteca de Mentorias</h1>
            <p className="text-[12px] text-sagb-muted">Gerencie e explore todo o acervo de conhecimento.</p>
          </div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-[10px] font-black text-sagb-muted uppercase tracking-widest hover:text-sagb-blue transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sagb-muted" />
            <input 
              type="text" 
              placeholder="Buscar por título, tipo ou tecnologia..." 
              className="w-full pl-12 pr-4 py-3 bg-sagb-panel border border-sagb-line rounded-2xl text-[12px] focus:ring-2 focus:ring-sagb-blue outline-none transition-all shadow-sm text-sagb-text placeholder-sagb-muted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-sagb-panel border border-sagb-line rounded-2xl flex items-center gap-2 hover:bg-sagb-bg-2 transition-all shadow-sm text-sagb-muted">
            <FilterIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filtros</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
             <div className="w-8 h-8 border-4 border-sagb-blue border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Carregando Acervo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentorias.map(mentoria => (
              <div 
                key={mentoria.id}
                onClick={() => onNavigate('detail', mentoria.id)}
                className="bg-sagb-panel rounded-3xl p-6 border border-sagb-line shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-sagb-blue/10 rounded-2xl flex items-center justify-center text-sagb-blue">
                    <BookIcon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    mentoria.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {mentoria.status === 'active' ? 'Oficial' : 'Em Construção'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-sagb-text mb-2 group-hover:text-sagb-blue transition-colors">
                  {mentoria.title}
                </h3>
                <p className="text-[12px] text-sagb-muted line-clamp-2 mb-6 flex-1 italic">
                  {mentoria.description}
                </p>

                <div className="pt-6 border-t border-sagb-line flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-sagb-muted uppercase tracking-tighter block">Versão</span>
                    <span className="text-[12px] font-bold text-sagb-text">{mentoria.version}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-sagb-muted uppercase tracking-tighter block">Tipo</span>
                    <span className="text-[12px] font-bold text-sagb-text">{mentoria.type}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-sagb-blue font-bold uppercase tracking-widest">Abrir Estrutura</span>
                  <ArrowRightIcon className="w-4 h-4 text-sagb-blue" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
