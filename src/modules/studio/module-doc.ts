export const moduleDoc = {
  title: 'Studio',
  description: 'Módulo de gravação de mídias, chunking e transcrição. Atua como o Produtor de dados de voz/vídeo para outros módulos consumidores (ex: Karaokê).',
  tables: [
    {
      name: 'studio_sessions',
      type: 'supabase',
      description: 'Sessões de gravação de áudio/vídeo',
      responsable: 'studio'
    },
    {
      name: 'studio_chunks',
      type: 'supabase',
      description: 'Partições de mídia com transcrição vinculadas às sessões',
      responsable: 'studio'
    }
  ],
  storages: [
    {
      name: 'studio-media',
      type: 'supabase-storage',
      description: 'Armazena arquivos .webm (áudio/vídeo) brutos gravados no Studio'
    }
  ],
  integrations: [
    'Gemini API (Transcrição)'
  ],
  reusableAssets: [
    'src/modules/studio/services/studio.ts (createStudioSession, processAudioChunkPipeline)'
  ]
};