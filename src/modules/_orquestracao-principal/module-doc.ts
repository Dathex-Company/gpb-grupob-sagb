export const moduleDoc = {
  nomeOficial: 'Orquestração Principal',
  objetivo:
    'Vigiar e governar a malha inteira do SagB. Controlar e alterar a Sidebar, App, App.tsx, Rotas Globais e Registro de Módulos. É o Módulo do "Agente Mestre".',
  responsavelTecnico: 'Pierre Zanulli',
  status: 'Ativo',
  tipo: 'Módulo Oficial',

  tabelasSupabase: [
    'N/A'
  ],

  bucketsStorage: [
    'N/A'
  ],

  integracoes: [
    'Todos os módulos plugáveis'
  ],

  estruturasExclusivas: [
    'src/modules/_orquestracao-principal/agent/persona.md',
    'src/modules/_orquestracao-principal/agent/prompt-ativacao-cline.md'
  ],

  estruturasCompartilhadas: [
    'src/core/modules/moduleRegistry.ts',
    'components/Sidebar.tsx',
    'App.tsx'
  ],

  fluxosPrincipais: [
    '1. Ajustes em Sidebar e Menus.',
    '2. Orquestração e resolução de conflitos entre outros agentes/módulos.',
    '3. Modificações de rotas e layout geral do SagB.'
  ],

  pendenciasPrincipais: []
};
