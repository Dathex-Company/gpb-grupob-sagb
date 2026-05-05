import { ModuleDoc } from '../../core/modules/module.types';

/**
 * module-doc — MCP SagB
 * Documentação oficial do módulo seguindo o padrão ModuleDoc.
 */
export const moduleDoc: ModuleDoc = {
  displayName: 'MCP SagB',
  purpose:
    'Model Context Protocol do SagB — camada de conhecimento e automação focada em VS Code, ' +
    'produtividade de desenvolvimento, organização de workspace e configuração de ambiente local. ' +
    'Operacionaliza o conhecimento de ambiente como ferramentas MCP mock/real, ' +
    'mentoria técnica e automação de fluxos de desenvolvimento.',
  version: '1.0.0',
  boundaries: [
    'NÃO cria regras de negócio — apenas operacionaliza conhecimento técnico',
    'NÃO substitui o SagB Bridge (ponte técnica VS Code) — é complementar',
    'NÃO executa deploys — orienta sobre como fazê-los',
    'NÃO gerencia infraestrutura diretamente — documenta boas práticas',
  ],
  integrations: {
    internal: [
      'sagb_bridge — complementar: Bridge é a ponte técnica, MCP SagB é o conhecimento VS Code',
      'hub_integracao — indireta: ambas são camadas técnicas do ecossistema',
      'api_sagb — MCP pode consumir API para estender capacidades',
    ],
    external: [
      'VS Code — workspaces, multi-root, extensões, atalhos',
      'Netlify — deploys, functions, env vars',
      'Supabase — migrations, RLS, storage, realtime',
      'GitHub — repos, actions, workflows',
    ],
  },
  dataDependencies: {
    supabaseTables: [],
    storageBuckets: [],
    localStorageKeys: ['sagb:mcp-tools-config', 'sagb:mcp-preferences'],
  },
};
