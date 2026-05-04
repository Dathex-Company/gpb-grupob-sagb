# Changelog do Studio

## 03/05/2026
- Atualizado `module-doc.ts` com todas as 5 tabelas canônicas e integrações atuais.
- Corrigido link quebrado na `persona.md` (referenciava `prompt-ativacao-cline.md` → `prompt_ativacao_cline.md`).
- Adicionada funcionalidade de **exportação/download**: download de áudio master, download de arquivos de câmera, exportação de transcrições por sessão.
- Registradas decisões de evolução P2-P4 em `decisions.md`.

## 18/04/2026
- Implementada captura multicâmera ao vivo no `StudioPage` com meta estável de até 2 câmeras simultâneas.
- Adicionada seleção de dispositivos de vídeo via `enumerateDevices` com preview em grid por câmera.
- Implementada gravação paralela por câmera com arquivo independente por stream.
- Implementada gravação de áudio mestre único por sessão para transcrição/chunking.
- Evoluído `services/studio.ts` com contratos e pipelines para:
  - registro de câmeras por sessão (`registerSessionCameras`);
  - persistência de arquivos por câmera (`saveCameraFilePipeline`);
  - persistência de trilha de áudio mestre (`saveMasterAudioPipeline`).
- Adicionado fallback de persistência em `payload` quando tabelas canônicas ainda não existirem no ambiente.
- Criada migração `supabase/migrations/20260324000101_studio_papob.sql` com tabelas canônicas:
  - `studio_session_cameras`
  - `studio_camera_files`
  - `studio_audio_tracks`
- Governança de agente do módulo Studio formalizada para Fabi Nunes (owner/persona/prompt/diretriz/log).
