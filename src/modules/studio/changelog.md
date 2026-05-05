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

## 05/05/2026
- Adicionado `fetchSessionAudioTracks()` no service — busca trilhas individuais de áudio por sessão.
- Implementado **VU Meter** em tempo real: `AnalyserNode` por fonte + `requestAnimationFrame` com cálculo RMS, barras visuais coloridas (verde/âmbar/rosa) na UI de áudio.
- Implementado **controle de ganho individual**: `GainNode` por deviceId com slider `input[type=range]` (0–2), ajuste em tempo real durante gravação.
- Implementado **Pause/Resume**: botão entre "Iniciar" e "Finalizar", usa `MediaRecorder.pause()` / `.resume()` em todos os gravadores.
- Implementadas **labels editáveis**: clique duplo no nome do microfone para renomear, persistência em `localStorage('studio_device_labels')`.
- Implementado **download individual de trilhas**: botões por track na sidebar de sessões, usa `downloadBlobFromSupabaseStorage` + `triggerBlobDownload`.
- Áudio do sistema também ganhou VU meter e gain slider próprios.
- Compilação validada com `npx tsc --noEmit`: zero erros no módulo Studio.
- Implementado **gate de permissão de workspace** no frontend para iniciar gravação e processar upload.
- Implementado **controle anti-concorrência** em gravação com lock de transição start/stop e cooldown de 2 segundos para nova inicialização.
- Implementado **hardening de memória** para gravações longas com `MediaRecorder.start(15000)` e limite de buffer em RAM por gravador (`pushPartWithCap`).
