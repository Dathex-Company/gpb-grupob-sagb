export const moduleDoc = {
  nomeOficial: 'Centro de Ingestão Documental (CID)',
  objetivo: 'Camada de preparação documental: upload, armazenamento, transcrição, extração de texto, fragmentação, organização de ativos e geração de metadados operacionais. O CID prepara a matéria-prima — inteligência profunda, cruzamento, leitura estratégica e recomendações pertencem a camadas posteriores do SagB.',
  responsavelTecnico: '@Rodrigues (definição pendente)',
  status: 'Ativo',
  tipo: 'Módulo Oficial — Camada Base de Preparação Documental',
  maturidade: 'Funcional',
  
  posicionamentoEstrategico: {
    fazParteDoCID: [
      'Upload e armazenamento de documentos',
      'Extração de texto (TXT, PDF, DOCX, DOC)',
      'Transcrição de áudio e vídeo',
      'Fragmentação em chunks',
      'Geração de metadados operacionais e outputs técnicos de preparação',
      'Store now, process later',
      'Organização de ativos documentais para consumo por módulos posteriores'
    ],
    naoFazParteDoCID: [
      'Inteligência profunda e análise estratégica',
      'Radar de Conexões',
      'NICO (Núcleo de Inteligência e Conexões)',
      'NAGI (Núcleo de Análise e Gestão da Informação)',
      'Cruzamento estratégico entre documentos',
      'Busca semântica vetorial como leitura estratégica',
      'Execução de prompts de interpretação, consolidação ou recomendação'
    ]
  },

  tabelasSupabase: [
    'cid_assets — Registro principal de ativos documentais',
    'cid_asset_files — Arquivos físicos vinculados aos ativos',
    'cid_processing_jobs — Jobs de processamento',
    'cid_chunks — Fragmentos de texto extraído',
    'cid_outputs — Saídas técnicas do processamento (texto extraído, transcrição, metadados)',
    'cid_tags — Tags para categorização',
    'cid_links — Vínculos entre ativos',
    'cid_batches — Lotes de processamento consolidado',
    'cid_batch_items — Itens de cada lote'
  ],

  bucketsStorage: [
    'cid-storage — Armazenamento de arquivos dos ativos'
  ],

  funcoesServerless: [
    'cid-processor.mjs — Processador principal: extração, transcrição, fragmentação, resumo',
    'cid-search.mjs — Busca full-text nos assets, chunks e outputs'
  ],

  integracoes: [
    'Supabase Storage (Upload)',
    'Supabase Database (Firestore shim)',
    'Netlify Functions (cid-processor.mjs, cid-search.mjs)',
    'Gemini API (fallback controlado para transcrição/extração quando necessário)'
  ],

  estruturasExclusivas: [
    'components/CIDView.tsx — UI principal do módulo (Shell explorador documental: sidebar + lista + detalhe + painel contextual)',
    'netlify/functions/cid-processor.mjs — Pipeline de processamento back-end',
    'netlify/functions/cid-search.mjs — Busca full-text',
    'src/modules/cid/agent/owner.md — Definição de owner',
    'src/modules/cid/agent/persona.md — Persona do módulo',
    'src/modules/cid/README.md — Documentação do módulo',
    'src/modules/cid/plans/ — Diretório de planos estratégicos'
  ],

  estruturasCompartilhadas: [
    'services/supabase.ts — Shim Firestore-like com normalização de tabelas',
    'services/storage.ts — Utilitários de storage'
  ],

  fluxosPrincipais: [
    '1. Upload: Usuário seleciona arquivo(s) no CIDView, preenche metadados e envia.',
    '2. Armazenamento: Front-end faz upload para bucket Supabase + cria registro em cid_asset_files.',
    '3. Asset + Job: Cria registro em cid_assets (status "queued") e cid_processing_jobs.',
    '4. Processamento: Chama cid-processor.mjs (Netlify) que baixa o arquivo, extrai texto, transcreve quando aplicável, fragmenta em chunks e gera outputs técnicos.',
    '5. Store Only: Se desired_action for "store_only", o processor apenas marca como concluído sem processar.',
    '6. Consulta: Busca full-text via cid-search.mjs em assets, chunks e outputs.',
    '7. Saída: Ativos preparados ficam disponíveis para camadas posteriores de inteligência.'
  ],

  fluxosSuportados: [
    'store_only — Apenas armazenar o arquivo',
    'store_transcribe — Armazenar + transcrever (áudio/vídeo)',
    'store_summarize — Armazenar + resumir',
    'store_transcribe_summarize — Armazenar + transcrever + resumir técnico'
  ],

  pontosFortes: [
    'Pipeline completo de upload a processamento funcionando',
    'Store now, process later implementado corretamente',
    'Fragmentação e organização de chunks',
    'Dashboard geral do CID e dashboard local de raízes implementados',
    'Firestore shim com normalização para todas as tabelas do CID',
    'Queue guard para recuperação de jobs órfãos',
    'Suporte a múltiplos formatos (TXT, PDF, DOCX, DOC, áudio, vídeo, imagens)'
  ],

  pontosFrageis: [
    'Componentes ainda parcialmente concentrados em CIDView.tsx',
    'Owner ainda não definido formalmente',
    'Processador depende de GEMINI_API_KEY configurada no ambiente',
    'Busca semântica vetorial não implementada',
    'Monitoramento de jobs sem interface administrativa',
    'Sem testes automatizados',
    'Extração de PDF usa heurística simples sem OCR dedicado',
    'Limite de 30MB para processamento no back-end (Netlify Function)'
  ],

  pendenciasPrincipais: [
    'Definir owner formal do módulo (@Rodrigues)',
    'Adicionar chaves de API reais no .env.local (GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY)',
    'Extração de texto de PDFs complexos com OCR (Tesseract ou Gemini Vision)',
    'Busca semântica (Vector Search) para complementar busca full-text',
    'Orquestração de fila mais robusta para jobs de processamento',
    'Definir contrato formal de saída para camadas posteriores (NICO, NAGI, Radar de Conexões)',
    'Tratamento de arquivos muito grandes (>100MB) com processamento assíncrono',
    'Testes de integração do pipeline completo'
  ]
};
