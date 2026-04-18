export const moduleDoc = {
  nomeOficial: 'Centro de Inteligência Documental (CID)',
  objetivo: 'Transformar documentos, áudios e vídeos em ativos processáveis por meio de ingestão, fragmentação, transcrição, resumo e consolidação.',
  responsavelTecnico: 'A DEFINIR',
  status: 'Ativo',
  tipo: 'Módulo Oficial',
  
  tabelasSupabase: [
    'cid_assets',
    'cid_asset_files',
    'cid_processing_jobs'
  ],
  
  bucketsStorage: [
    'cid-storage (iniciado pelo client-side via Supabase Storage)'
  ],

  integracoes: [
    'Supabase Storage (Upload)',
    'Netlify Functions (cid-processor.mjs, cid-search.mjs)',
    'Gemini API (Transcrição de áudio/vídeo e Geração de Resumos)'
  ],

  estruturasExclusivas: [
    'components/CIDView.tsx',
    'netlify/functions/cid-processor.mjs',
    'netlify/functions/cid-search.mjs',
    'src/modules/cid/agent/owner.md',
    'src/modules/cid/agent/persona.md'
  ],

  estruturasCompartilhadas: [
    'services/storage.ts'
  ],

  fluxosPrincipais: [
    '1. Upload: Usuário seleciona o arquivo e metadados no CIDView.',
    '2. Iniciação: O front-end envia o arquivo para o storage e cria os registros no banco de dados (status "queued").',
    '3. Processamento no Back-end: Netlify Function (cid-processor.mjs) executa extração, transcrição e resumo, atualizando status em tempo real.',
    '4. Consulta: Busca full-text via Netlify Function (cid-search.mjs) em todos os assets, chunks e outputs do CID.'
  ],

  pendenciasPrincipais: [
    'Extração de texto de arquivos complexos (.pdf, .docx) no back-end.',
    'Busca semântica (Vector Search) para complementar a busca por texto atual.',
    'Orquestração de fila mais sofisticada (ex: RabbitMQ ou Supabase MQ) para gerenciar os jobs de processamento.',
    'Integração com Agentes e RAG: Conectar os documentos processados do CID ao contexto dos agentes para consultas.',
    'Limitação de processamento da Netlify para arquivos muito grandes (>100MB).'
  ]
};
