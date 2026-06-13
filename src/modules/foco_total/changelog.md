# Changelog — Foco Total (Zen Folk | Foco AI)

Todas as mudanças relevantes no módulo **foco_total** serão registradas aqui.

---

## [0.2.0] — 2026-06-13

### Corrigido
- FT-001: `module-doc.ts` reescrito em contrato `ModuleDoc` oficial do SagB.
- FT-002: Encoding do `changelog.md` corrigido (UTF-8 limpo).
- FT-020: `fonte_de_origem` corrigida para `src/modules/foco_total/_triagem/foco ai coach chat gpt`.
- FT-021: `internalName` padronizado para `foco_total` (removido ponto inicial).
- FT-022: Stack documentada separada entre atual (React/TypeScript/Zustand/localStorage/Gemini TTS/Browser Speech) e futura (Tauri/OpenAI/SQLite/Supabase).

### Adicionado
- `README.md` com visão, execução, arquitetura, limites e próximos passos.
- Decisões registradas em `decisions.md` sobre histórico local, timer por tempo real, voz configurável e facade pública.

---

## [0.1.0] — 2026-04-17

### Adicionado
- Estrutura inicial oficial do módulo (`index.ts`, `manifest.ts`, `routes.tsx`, `pages/FocoTotalPage.tsx`).
- Documento técnico-estratégico `module-doc.ts` com identidade do agente **Zen Folk**.
- Serviço de voz `zenVoice.ts` com Gemini TTS + fallback browser SpeechSynthesis.
- Store Zustand `focusStore.ts` com ciclo de vida de sessão (start/pause/resume/stop/tick).
- Componentes `FocusTimer.tsx` e `SessionConfigModal.tsx`.
- Página principal `FocoTotalPage.tsx`.
- Governança documental: `changelog.md`, `decisions.md`, `manifest.ts`.
- Pasta `_triagem/` com material de origem.
- Pasta `agent/` com persona, prompt de ativação e session log do Zen Folk.
