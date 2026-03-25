import React from 'react';
import { useTheme } from '../../../core/context/ThemeContext';

const ConfigAmbientePage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex-1 p-10 bg-white dark:bg-sagb-bg text-gray-900 dark:text-sagb-text min-h-full transition-colors duration-300">
      <header className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Configurações do Ambiente</h1>
        <p className="text-gray-400 dark:text-sagb-muted uppercase text-[10px] font-bold tracking-widest mt-2">
          Personalize sua experiência no ecossistema SagB
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-gradient-to-b dark:from-[#24272e] dark:to-[#292d35] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6">Tema e Visual</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl border border-gray-200 dark:border-white/10 transition-colors duration-300">
              <div>
                <p className="text-sm font-bold">Modo de Exibição</p>
                <p className="text-xs text-gray-400 dark:text-sagb-muted">Alternar entre tema claro e escuro</p>
              </div>
              
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-500 focus:outline-none shadow-inner ${theme === 'dark' ? 'bg-gradient-switch-on' : 'bg-gradient-switch-off'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-gradient-switch-handle shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="p-4 bg-sagb-blue/10 border border-sagb-blue/20 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-sagb-blue mb-1">Nota técnica</p>
                <p className="text-xs leading-relaxed text-sagb-text opacity-80">
                    O sistema de tokens oficial do SagB está ativo. As cores do ambiente são sincronizadas globalmente via variáveis CSS.
                </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-sagb-panel p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 opacity-50 cursor-not-allowed transition-colors duration-300">
           <h2 className="text-sm font-black uppercase tracking-widest mb-6">Preferências de Operação</h2>
           <p className="text-xs italic text-gray-400 dark:text-sagb-muted">Em breve: configurações de densidade, sons e notificações.</p>
        </section>
      </div>
    </div>
  );
};

export default ConfigAmbientePage;
