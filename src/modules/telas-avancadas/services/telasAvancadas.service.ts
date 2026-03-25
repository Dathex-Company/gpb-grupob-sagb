/**
 * Serviço de persistência para Telas Avançadas
 * V2: Suporte a URL externa, arquivo HTML e código HTML
 * Usa localStorage como backend, preparado para migração futura
 */

import { 
  TelaAvancada, 
  TelaAvancadaFormData,
  TelaAvancadaExternalUrl,
  TelaAvancadaHtmlFile,
  TelaAvancadaHtmlCode,
  LegacyTelaAvancada,
  migrateLegacyTela
} from '../types/telasAvancadas.types';

const STORAGE_KEY = 'sagb_telas_avancadas_v2';
const LEGACY_STORAGE_KEY = 'sagb_telas_avancadas';

/**
 * Gera um ID único para uma nova tela
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Valida se uma URL é válida
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * Migra dados da V1 para V2 se necessário
 */
const migrateLegacyDataIfNeeded = (): void => {
  try {
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyData) return;
    
    const legacyTelas: LegacyTelaAvancada[] = JSON.parse(legacyData).map((tela: any) => ({
      ...tela,
      createdAt: new Date(tela.createdAt)
    }));
    
    if (legacyTelas.length > 0) {
      const migratedTelas = legacyTelas.map(migrateLegacyTela);
      
      // Salva os dados migrados
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedTelas));
      
      // Remove os dados legados
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      
      console.log(`Migrados ${legacyTelas.length} registros da V1 para V2`);
    }
  } catch (error) {
    console.error('Erro ao migrar dados da V1:', error);
  }
};

/**
 * Carrega todas as telas do localStorage com migração automática
 */
export const loadTelasFromStorage = (): TelaAvancada[] => {
  try {
    // Verifica e migra dados da V1 se necessário
    migrateLegacyDataIfNeeded();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    
    // Converte strings de data para Date objects
    return data.map((tela: any) => ({
      ...tela,
      createdAt: new Date(tela.createdAt),
      updatedAt: tela.updatedAt ? new Date(tela.updatedAt) : undefined
    }));
  } catch (error) {
    console.error('Erro ao carregar telas do localStorage:', error);
    return [];
  }
};

/**
 * Salva todas as telas no localStorage
 */
export const saveTelasToStorage = (telas: TelaAvancada[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(telas));
  } catch (error) {
    console.error('Erro ao salvar telas no localStorage:', error);
  }
};

/**
 * Lê o conteúdo de um arquivo HTML
 */
const readHtmlFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo HTML'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Adiciona uma nova tela (suporte a múltiplos tipos)
 */
export const addTela = async (formData: TelaAvancadaFormData): Promise<TelaAvancada> => {
  // Validação comum: título
  if (!formData.title.trim()) {
    throw new Error('O título da tela é obrigatório');
  }
  
  let novaTela: TelaAvancada;
  const now = new Date();
  
  switch (formData.type) {
    case 'external_url':
      // Validações específicas para URL
      if (!formData.url.trim()) {
        throw new Error('A URL da tela é obrigatória');
      }
      
      if (!isValidUrl(formData.url)) {
        throw new Error('URL inválida. Use http:// ou https://');
      }
      
      novaTela = {
        id: generateId(),
        type: 'external_url',
        title: formData.title.trim(),
        url: formData.url.trim(),
        createdAt: now,
        updatedAt: now
      } as TelaAvancadaExternalUrl;
      break;
      
    case 'html_file':
      // Validações específicas para arquivo HTML
      if (!formData.file) {
        throw new Error('Por favor, selecione um arquivo HTML');
      }
      
      // Valida extensão do arquivo
      const fileName = formData.file.name.toLowerCase();
      if (!fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
        throw new Error('Por favor, selecione um arquivo HTML (.html ou .htm)');
      }
      
      // Lê o conteúdo do arquivo
      const htmlContent = await readHtmlFile(formData.file);
      
      if (!htmlContent.trim()) {
        throw new Error('O arquivo HTML está vazio');
      }
      
      novaTela = {
        id: generateId(),
        type: 'html_file',
        title: formData.title.trim(),
        fileName: formData.file.name,
        htmlContent: htmlContent.trim(),
        fileSize: formData.file.size,
        fileType: formData.file.type,
        createdAt: now,
        updatedAt: now
      } as TelaAvancadaHtmlFile;
      break;
      
    case 'html_code':
      // Validações específicas para código HTML
      if (!formData.htmlContent.trim()) {
        throw new Error('O código HTML é obrigatório');
      }
      
      if (formData.htmlContent.trim().length < 10) {
        throw new Error('O código HTML parece muito curto. Verifique se colou o conteúdo completo.');
      }
      
      novaTela = {
        id: generateId(),
        type: 'html_code',
        title: formData.title.trim(),
        htmlContent: formData.htmlContent.trim(),
        createdAt: now,
        updatedAt: now
      } as TelaAvancadaHtmlCode;
      break;
      
    default:
      throw new Error('Tipo de tela não suportado');
  }
  
  const telasExistentes = loadTelasFromStorage();
  const novasTelas = [...telasExistentes, novaTela];
  
  saveTelasToStorage(novasTelas);
  
  return novaTela;
};

/**
 * Remove uma tela pelo ID
 */
export const removeTela = (id: string): void => {
  const telasExistentes = loadTelasFromStorage();
  const novasTelas = telasExistentes.filter(tela => tela.id !== id);
  
  saveTelasToStorage(novasTelas);
};

/**
 * Obtém uma tela pelo ID
 */
export const getTelaById = (id: string): TelaAvancada | null => {
  const telas = loadTelasFromStorage();
  return telas.find(tela => tela.id === id) || null;
};

/**
 * Obtém todas as telas
 */
export const getAllTelas = (): TelaAvancada[] => {
  return loadTelasFromStorage();
};

/**
 * Limpa todas as telas (para testes/debug)
 */
export const clearAllTelas = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
};

/**
 * Atualiza uma tela existente
 */
export const updateTela = (id: string, updates: Partial<TelaAvancada>): TelaAvancada | null => {
  const telas = loadTelasFromStorage();
  const index = telas.findIndex(tela => tela.id === id);
  
  if (index === -1) return null;
  
  // Preserva o tipo original da tela
  const telaOriginal = telas[index];
  const telaAtualizada = {
    ...telaOriginal,
    ...updates,
    updatedAt: new Date()
  } as TelaAvancada;
  
  const novasTelas = [...telas];
  novasTelas[index] = telaAtualizada;
  
  saveTelasToStorage(novasTelas);
  
  return telaAtualizada;
};