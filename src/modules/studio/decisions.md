# Decisions do Studio

- **[18/04/2026]**: Aprovado e implementado o modelo de gravação multicâmera simultânea no navegador com meta operacional inicial de **2 câmeras estáveis**, mantendo arquitetura preparada para expansão futura.
- **[18/04/2026]**: Definida a estratégia de mídia por sessão: **arquivo de vídeo por câmera** + **áudio mestre único** para transcrição e integração CID.
- **[18/04/2026]**: Adoção de compatibilidade progressiva: uso de tabelas canônicas (`studio_session_cameras`, `studio_camera_files`, `studio_audio_tracks`) com fallback em `payload` para ambientes ainda não migrados.
- **[18/04/2026]**: Formalizada a governança de owner do módulo Studio com **Fabi Nunes** como responsável principal ativa.
- **[03/05/2026]**: Atualizado `module-doc.ts` com todas as 5 tabelas canônicas e integrações atuais (Gemini, CID, NIC, QualitySensor).
- **[03/05/2026]**: Corrigido link quebrado na `persona.md` (referenciava `prompt-ativacao-cline.md` → `prompt_ativacao_cline.md`).
- **[03/05/2026]**: Adicionada funcionalidade de exportação/download de áudio master, arquivos de câmera e transcrições.
- **[03/05/2026]**: Iniciado plano de evolução P2-P4: memória, rate limiting, permissões, integrações, testes e dados legados.
