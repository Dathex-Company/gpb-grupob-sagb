/**
 * Módulo Telas Avançadas - Ponto de entrada
 * V2: Suporte a 3 tipos (URL externa, arquivo HTML, código HTML)
 */

// Exportações principais para o registry
export { telasAvancadasManifest as manifest } from './manifest';
export { telasAvancadasRoutes as routes } from './routes';

// Tipos
export type {
  TelaAvancada,
  TelaAvancadaType,
  TelaAvancadaExternalUrl,
  TelaAvancadaHtmlFile,
  TelaAvancadaHtmlCode,
  TelaAvancadaFormData,
} from './types/telasAvancadas.types';

export {
  isExternalUrl,
  isHtmlFile,
  isHtmlCode,
  migrateLegacyTela,
} from './types/telasAvancadas.types';

// Componentes
export { TelaAvancadaCard } from './components/TelaAvancadaCard';
export { TelaAvancadaForm } from './components/TelaAvancadaForm';
export { TelaAvancadaTypeSelector } from './components/TelaAvancadaTypeSelector';
export { TelaAvancadaViewer } from './components/TelaAvancadaViewer';

// Store
export { useTelasAvancadasStore } from './store/telasAvancadas.store';

// Serviços
export { 
  addTela, 
  getAllTelas as getTelas, 
  removeTela, 
  loadTelasFromStorage,
  generateId,
  isValidUrl,
  clearAllTelas,
  getTelaById,
  updateTela
} from './services/telasAvancadas.service';