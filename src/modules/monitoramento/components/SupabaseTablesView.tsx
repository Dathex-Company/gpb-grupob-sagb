import React, { useState, useEffect } from 'react';
import { supabaseTablesService } from '../services';

interface TableUsage {
  tableName: string;
  modules: string[];
  usageCount: number;
  category: 'alta' | 'media' | 'baixa';
}

const SupabaseTablesView: React.FC = () => {
  const [tables, setTables] = useState<TableUsage[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await supabaseTablesService.loadModuleDocs();
      const tablesData = supabaseTablesService.getTablesByUsage();
      const statsData = supabaseTablesService.getStats();
      
      setTables(tablesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados de tabelas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: 'alta' | 'media' | 'baixa') => {
    switch (category) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'baixa': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  const getCategoryLabel = (category: 'alta' | 'media' | 'baixa') => {
    switch (category) {
      case 'alta': return 'Alto uso';
      case 'media': return 'Uso médio';
      case 'baixa': return 'Baixo uso';
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Carregando análise de tabelas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <header>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Monitoramento de Tabelas Supabase</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Análise de uso de tabelas entre módulos do SagB. Identifica duplicação, dependências críticas e tabelas órfãs.
        </p>
      </header>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Tabelas analisadas</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalTables}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
            <div className="text-sm text-gray-500 dark:text-gray-400">Tabelas órfãs</div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400">{stats.orphanTables}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
            <div className="text-sm text-gray-500 dark:text-gray-400">Tabelas compartilhadas</div>
            <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{stats.sharedTables}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30">
            <div className="text-sm text-gray-500 dark:text-gray-400">Módulos analisados</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.modulesAnalyzed}</div>
          </div>
        </div>
      )}

      {/* Tabela de uso */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tabelas por uso</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ordenadas pelas mais utilizadas entre módulos
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tabela
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Módulos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tables.map((table) => (
                <tr 
                  key={table.tableName}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/30 cursor-pointer"
                  onClick={() => setSelectedTable(table.tableName)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{table.tableName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {table.modules.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {table.usageCount} módulo{table.usageCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(table.category)}`}>
                      {getCategoryLabel(table.category)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes da tabela selecionada */}
      {selectedTable && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalhes: {selectedTable}
            </h3>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Fechar
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Módulos que usam esta tabela:</h4>
              <ul className="space-y-1">
                {supabaseTablesService.getModulesUsingTable(selectedTable).map((moduleName, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    • {moduleName}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recomendações:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {supabaseTablesService.getModulesUsingTable(selectedTable).length === 1 && (
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">⚠</span>
                    <span>Esta tabela é usada por apenas um módulo. Considere se pode ser consolidada com outras.</span>
                  </li>
                )}
                {supabaseTablesService.getModulesUsingTable(selectedTable).length >= 3 && (
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">🔗</span>
                    <span>Esta tabela é uma dependência crítica para múltiplos módulos. Alterações podem impactar vários sistemas.</span>
                  </li>
                )}
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">ℹ</span>
                  <span>Verifique o `module-doc.ts` de cada módulo para detalhes completos de uso.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Legenda das categorias:</h4>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Alto uso (3+ módulos)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Uso médio (2 módulos)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Baixo uso (1 módulo)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTablesView;