# Changelog do Studio

## 2026-04-18
- Implementada captura multicâmera ao vivo no `StudioPage` com meta estável de até 2 câmeras simultâneas.
- Adicionada seleção de dispositivos de vídeo via `enumerateDevices` com preview em grid por câmera.
- Implementada gravação paralela por câmera com arquivo independente por stream.
- Implementada gravação de áudio mestre único por sessão para transcrição/chunking.
- Evoluído `services/studio.ts` com contratos e pipelines para:
  - registro de câmeras por sessão (`registerSessionCameras`);
  - persistência de arquivos por câmera (`saveCameraFilePipeline`);
  - persistência de trilha de áudio mestre (`saveMasterAudioPipeline`).
- Adicionado fallback de persistência em `payload` quando tabelas canônicas ainda não existirem no ambiente.
- Criada migração `supabase/migrations/20260419000101_studio_multicamera.sql` com tabelas canônicas:
  - `studio_session_cameras`
  - `studio_camera_files`
  - `studio_audio_tracks`
- Governança de agente do módulo Studio formalizada para Fabi Nunes (owner/persona/prompt/diretriz/log).
