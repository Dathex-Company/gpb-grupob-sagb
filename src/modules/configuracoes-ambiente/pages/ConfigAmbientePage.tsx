import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../core/context/ThemeContext';
import { moduleRegistry } from '../../../core/modules/moduleRegistry';

type ModuleToggleMap = Record<string, boolean>;
const MODULE_TOGGLE_STORAGE_KEY = 'sagb:module-toggles:v1';

const ConfigAmbientePage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const modules = useMemo(() => moduleRegistry.map(mod => mod.manifest), []);
  const [moduleToggles, setModuleToggles] = useState<ModuleToggleMap>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODULE_TOGGLE_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as ModuleToggleMap;
      setModuleToggles(parsed || {});
    } catch (error) {
      console.warn('[ConfigAmbientePage] Falha ao carregar toggles de módulo:', error);
    }
  }, []);

  const persistModuleToggles = (next: ModuleToggleMap) => {
    setModuleToggles(next);
    try {
      localStorage.setItem(MODULE_TOGGLE_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('[ConfigAmbientePage] Falha ao salvar toggles de módulo:', error);
    }
  };

  const isModuleActive = (moduleId: string, initialStatus: 'active' | 'inactive') => {
    if (moduleId in moduleToggles) return !!moduleToggles[moduleId];
    return initialStatus === 'active';
  };

  const handleToggleModule = (moduleId: string, current: boolean) => {
    persistModuleToggles({
      ...moduleToggles,
      [moduleId]: !current
    });
  };

  const activeCount = modules.filter(m => isModuleActive(m.id, m.initialStatus)).length;

  return (
    <div className="flex-1 p-10 bg-white dark:bg-sagb-bg text-gray-900 dark:text-sagb-text min-h-full transition-colors duration-300">
      <header className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Configurações do Sistema</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          Gerencie temas, cores, perfis e preferências globais do sistema.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seção de Tema */}
        <section className="bg-gray-50 dark:bg-sagb-card rounded-2xl p-8 border border-gray-200 dark:border-sagb-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Tema do Sistema
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Escolha entre tema claro ou escuro. A mudança afeta toda a interface do SagB.
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tema atual: <span className="font-bold">{theme === 'dark' ? 'Escuro' : 'Claro'}</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                O sistema de tokens oficial do SagB está ativo. As cores do ambiente são sincronizadas globalmente via variáveis CSS.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Alternar para {theme === 'dark' ? 'Claro' : 'Escuro'}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-sagb-border">
            Nesta etapa beta, o toggle persiste no navegador (localStorage). O próximo passo é persistir por workspace no Supabase para habilitar
            controle real por empresa/ambiente.
          </p>
        </section>

        {/* Seção de Módulos */}
        <section className="bg-gray-50 dark:bg-sagb-card rounded-2xl p-8 border border-gray-200 dark:border-sagb-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Módulos do Sistema ({activeCount} ativos)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Controle quais módulos estão visíveis no menu principal. Desative temporariamente módulos que não estão em uso.
          </p>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {modules.map(module => {
              const active = isModuleActive(module.id, module.initialStatus);
              return (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-sagb-bg border border-gray-200 dark:border-sagb-border"
                >
                  <div>
                    <h3 className="font-bold">{module.displayName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {module.id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleModule(module.id, active)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'}`}
                  >
                    {active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-sagb-border">
            Esta configuração afeta apenas a visibilidade no menu. O código do módulo continua carregado.
          </p>
        </section>
      </div>

      {/* Seção de Informações Técnicas */}
      <section className="mt-12 bg-gray-50 dark:bg-sagb-card rounded-2xl p-8 border border-gray-200 dark:border-sagb-border">
        <h2 className="text-xl font-bold mb-6">Informações Técnicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white dark:bg-sagb-bg rounded-xl border border-gray-200 dark:border-sagb-border">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Persistência</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              As configurações são salvas no localStorage do navegador. Futuramente migraremos para Supabase por workspace.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-sagb-bg rounded-xl border border-gray-200 dark:border-sagb-border">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Escopo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Este módulo gerencia apenas preferências de interface. Configurações de ambiente de desenvolvimento ficam em central_padroes.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-sagb-bg rounded-xl border border-gray-200 dark:border-sagb-border">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Próximos Passos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              • Perfis de usuário<br />
              • Paletas customizadas<br />
              • Configurações por empresa
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConfigAmbientePage;