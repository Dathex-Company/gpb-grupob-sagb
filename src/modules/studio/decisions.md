# Decisions do Studio

- **[2026-04-18]**: Aprovado e implementado o modelo de gravação multicâmera simultânea no navegador com meta operacional inicial de **2 câmeras estáveis**, mantendo arquitetura preparada para expansão futura.
- **[2026-04-18]**: Definida a estratégia de mídia por sessão: **arquivo de vídeo por câmera** + **áudio mestre único** para transcrição e integração CID.
- **[2026-04-18]**: Adoção de compatibilidade progressiva: uso de tabelas canônicas (`studio_session_cameras`, `studio_camera_files`, `studio_audio_tracks`) com fallback em `payload` para ambientes ainda não migrados.
- **[2026-04-18]**: Formalizada a governança de owner do módulo Studio com **Fabi Nunes** como responsável principal ativa.
