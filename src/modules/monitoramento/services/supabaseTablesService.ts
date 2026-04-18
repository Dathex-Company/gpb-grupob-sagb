import { ModuleDoc } from '../../../core/modules/module.types';

interface TableUsage {
  tableName: string;
  modules: string[];
  usageCount: number;
  category: 'alta' | 'media' | 'baixa';
}

interface ModuleTableData {
  moduleId: string;
  moduleName: string;
  tables: string[];
}

/**
 * Serviço para análise de uso de tabelas Supabase entre módulos
 * Varre todos os module-doc.ts e monta mapa de tabela → módulos
 */
export class SupabaseTablesService {
  private moduleDocs: ModuleDoc[] = [];

  /**
   * Carrega todos os module-doc.ts disponíveis no sistema
   * Nota: Em produção, isso seria feito via import dinâmico ou API
   */
  async loadModuleDocs(): Promise<void> {
    try {
      // Em ambiente real, buscaríamos todos os módulos registrados
      // Por enquanto, simulamos com alguns módulos conhecidos
      this.moduleDocs = [
        // Módulos que sabemos que existem
        await import('../module-doc').then(m => m.moduleDoc),
        // Outros módulos seriam carregados dinamicamente
      ];
    } catch (error) {
      console.warn('Não foi possível carregar todos os module-doc.ts:', error);
    }
  }

  /**
   * Extrai dados de tabelas de todos os módulos carregados
   */
  extractTableData(): ModuleTableData[] {
    return this.moduleDocs
      .filter(doc => doc.fontes_de_dados?.supabase_tabelas?.length > 0)
      .map(doc => ({
        moduleId: doc.id,
        moduleName: doc.displayName,
        tables: doc.fontes_de_dados.supabase_tabelas
      }));
  }

  /**
   * Agrega uso de tabelas por módulo
   */
  aggregateTableUsage(): TableUsage[] {
    const moduleData = this.extractTableData();
    const tableMap = new Map<string, string[]>();

    // Construir mapa tabela → [módulos]
    moduleData.forEach(({ moduleName, tables }) => {
      tables.forEach(table => {
        if (!tableMap.has(table)) {
          tableMap.set(table, []);
        }
        tableMap.get(table)!.push(moduleName);
      });
    });

    // Converter para array de TableUsage
    return Array.from(tableMap.entries()).map(([tableName, modules]) => {
      const usageCount = modules.length;
      let category: 'alta' | 'media' | 'baixa' = 'baixa';
      
      if (usageCount >= 3) category = 'alta';
      else if (usageCount === 2) category = 'media';

      return {
        tableName,
        modules,
        usageCount,
        category
      };
    });
  }

  /**
   * Retorna tabelas ordenadas por uso (mais usadas primeiro)
   */
  getTablesByUsage(): TableUsage[] {
    const usage = this.aggregateTableUsage();
    return usage.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Retorna tabelas usadas por apenas um módulo (potencialmente órfãs)
   */
  getOrphanTables(): TableUsage[] {
    const usage = this.aggregateTableUsage();
    return usage.filter(table => table.usageCount === 1);
  }

  /**
   * Retorna tabelas usadas por múltiplos módulos (dependências críticas)
   */
  getSharedTables(): TableUsage[] {
    const usage = this.aggregateTableUsage();
    return usage.filter(table => table.usageCount >= 2);
  }

  /**
   * Retorna módulos que usam uma tabela específica
   */
  getModulesUsingTable(tableName: string): string[] {
    const usage = this.aggregateTableUsage();
    const table = usage.find(t => t.tableName === tableName);
    return table?.modules || [];
  }

  /**
   * Retorna estatísticas gerais
   */
  getStats() {
    const usage = this.aggregateTableUsage();
    const totalTables = usage.length;
    const orphanTables = usage.filter(t => t.usageCount === 1).length;
    const sharedTables = usage.filter(t => t.usageCount >= 2).length;
    const highUsageTables = usage.filter(t => t.category === 'alta').length;

    return {
      totalTables,
      orphanTables,
      sharedTables,
      highUsageTables,
      modulesAnalyzed: this.moduleDocs.length
    };
  }
}

// Instância singleton para uso global
export const supabaseTablesService = new SupabaseTablesService();