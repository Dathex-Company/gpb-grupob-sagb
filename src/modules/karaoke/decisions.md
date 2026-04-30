# Decisions

- **[2026-04-18]**: Oficializada **Nanis Pelta** como agente responsável principal do módulo `karaoke`, com documentação de persona, ownership e prompt de ativação dedicados.
- **[2026-04-18]**: Definido que o Karaokê seguirá arquitetura de **módulo consumidor** do Studio (sem duplicar captura/transcrição), focado exclusivamente em playback e leitura sincronizada.
- **[2026-04-18]**: Aprovada criação de `runtimeBridge` no módulo para suportar `workspaceId` dinâmico e reduzir acoplamento com fallback fixo.
- **[2026-04-19]**: Mudança de direção do produto aprovada: o Karaokê deixa de depender do Studio e passa a operar como **módulo independente**, com upload local de mídia (áudio/vídeo) e entrada própria de letra.
