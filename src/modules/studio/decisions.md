# Decisions do Studio

- **[18/04/2026]**: Aprovado e implementado o modelo de gravação multicâmera simultânea no navegador com meta operacional inicial de **2 câmeras estáveis**, mantendo arquitetura preparada para expansão futura.
- **[18/04/2026]**: Definida a estratégia de mídia por sessão: **arquivo de vídeo por câmera** + **áudio mestre único** para transcrição e integração CID.
- **[18/04/2026]**: Adoção de compatibilidade progressiva: uso de tabelas canônicas (`studio_session_cameras`, `studio_camera_files`, `studio_audio_tracks`) com fallback em `payload` para ambientes ainda não migrados.
- **[18/04/2026]**: Formalizada a governança de owner do módulo Studio com **Fabi Nunes** como responsável principal ativa.
- **[03/05/2026]**: Atualizado `module-doc.ts` com todas as 5 tabelas canônicas e integrações atuais (Gemini, CID, NIC, QualitySensor).
- **[03/05/2026]**: Corrigido link quebrado na `persona.md` (referenciava `prompt-ativacao-cline.md` → `prompt_ativacao_cline.md`).
- **[03/05/2026]**: Adicionada funcionalidade de exportação/download de áudio master, arquivos de câmera e transcrições.
- **[03/05/2026]**: Iniciado plano de evolução P2-P4: memória, rate limiting, permissões, integrações, testes e dados legados.
- **[05/05/2026]**: Implementado **VU Meter** com `AnalyserNode` (fftSize=256) + `requestAnimationFrame` com cálculo RMS por quadro. Barras visuais com thresholds: <50% verde, 50-80% âmbar, >80% rosa.
- **[05/05/2026]**: Implementado **controle de ganho individual** com `GainNode` por deviceId. Slider range 0–2 em steps de 0.05. Valor aplicado em tempo real ao nó de áudio durante gravação.
- **[05/05/2026]**: Implementado **Pause/Resume** via `MediaRecorder.pause()` / `.resume()` em todos os gravadores simultaneamente (master + tracks + câmeras). Estado `isPaused` reflete UI.
- **[05/05/2026]**: Implementadas **labels editáveis** com persistência em `localStorage('studio_device_labels')`. Clique duplo no nome do microfone ativa `input[type=text]` inline.
- **[05/05/2026]**: Implementado **download individual de trilhas** na sidebar de sessões. Serviço `fetchSessionAudioTracks` busca tracks da tabela `studio_audio_tracks` com fallback em `payload.audioTracks`.
- **[05/05/2026]**: Decisão de manter items P1/P2 (Waveform, Preview áudio, IndexedDB, Silent Detection, Metadata) para próxima sprint, pois exigem componentes visuais complexos ou novos serviços de persistência.
- **[05/05/2026]**: Implementado **gate de permissão de workspace** no frontend do Studio para iniciar gravação e upload, com validação por `workspaceId` + `ownerUserId`/papéis privilegiados em `userProfile`.
- **[05/05/2026]**: Implementado **controle de concorrência de start/stop** com lock transacional (`isStartStopTransitionRef`) e cooldown de 2s entre inícios para evitar corrida e dupla inicialização.
- **[05/05/2026]**: Implementado **hardening de memória para gravações longas** com `MediaRecorder.start(timeslice=15000)` + buffer cap de partes (`pushPartWithCap`) para limitar crescimento de blobs em RAM.
