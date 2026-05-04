export const moduleDoc = {
  title: 'Studio',
  description: 'Módulo de gravação de mídias, chunking e transcrição. Atua como o Produtor de dados de voz/vídeo para outros módulos consumidores (ex: Karaokê, NIC).',
  tables: [
    {
      name: 'studio_sessions',
      type: 'supabase',
      description: 'Sessões de gravação de áudio/vídeo (live ou upload)',
      responsable: 'studio'
    },
    {
      name: 'studio_chunks',
      type: 'supabase',
      description: 'Partições de mídia com transcrição vinculadas às sessões',
      responsable: 'studio'
    },
    {
      name: 'studio_session_cameras',
      type: 'supabase',
      description: 'Registro de câmeras configuradas por sessão (deviceId, label, ordem)',
      responsable: 'studio'
    },
    {
      name: 'studio_camera_files',
      type: 'supabase',
      description: 'Arquivos de vídeo brutos por câmera, armazenados no storage',
      responsable: 'studio'
    },
    {
      name: 'studio_audio_tracks',
      type: 'supabase',
      description: 'Trilhas de áudio master por sessão, vinculadas ao storage',
      responsable: 'studio'
    }
  ],
  storages: [
    {
      name: 'studio',
      type: 'supabase-storage',
      description: 'Armazena arquivos .webm (áudio/vídeo) brutos gravados no Studio — bucket: "studio"'
    }
  ],
  integrations: [
    'Gemini API (Transcrição de áudio/vídeo)',
    'CID — Centro de Inteligência Documental (Assets de transcrição)',
    'NIC — Núcleo de Inteligência Conectiva (Knowledge items) — ⏳ Em planejamento',
    'QualitySensor — Eventos de qualidade de gravação — ⏳ Em planejamento'
  ],
  reusableAssets: [
    'src/modules/studio/services/studio.ts (createStudioSession, processAudioChunkPipeline, saveCameraFilePipeline, saveMasterAudioPipeline, sendChunkToCID)',
    'src/modules/studio/pages/StudioPage.tsx (Componente de captura multicâmera reutilizável)'
  ]
};