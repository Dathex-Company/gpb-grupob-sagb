# Decisões Estruturais — Foco Total (Zen Folk | Foco AI)

---

## 2026-06-13 — Correção Total v1 (Remediação FT-001 a FT-022)

### Histórico local versionado
**Decisão:** Persistir sessões concluídas em `localStorage` com chave versionada `sagb:foco_total:sessions:v1`.

**Justificativa:**
- Independência de backend no MVP atual.
- Versionamento da chave permite migração futura sem quebrar dados existentes.
- `safeParse` com fallback para array vazio garante resiliência contra dados corrompidos.

### Timer por tempo real (clock-based)
**Decisão:** Calcular tempo restante com base em `Date.now()` e `targetEndAt`, não por decremento cumulativo.

**Justificativa:**
- Elimina drift acumulado quando a aba perde foco ou o intervalo é pausado pelo navegador.
- Previne múltiplos ticks concorrentes quando o componente é montado em mais de um local (página + widget).

### Voz configurável e segura
**Decisão:** Expor modo de voz (`muted` | `browser` | `gemini_tts`) com ativação explícita pelo usuário.

**Justificativa:**
- Evita custo inesperado de chamadas Gemini TTS.
- Respeita políticas de autoplay do navegador.
- Permite fallback transparente para browser SpeechSynthesis.

### Facade pública de integração
**Decisão:** Expor `focusSessionFacade.ts` como contrato público do módulo. Módulos externos (TaskZei) devem consumir a facade, não a store diretamente.

**Justificativa:**
- Reduz acoplamento e permite evoluir a store internamente sem quebrar consumidores.
- Contrato documentado facilita integração futura com outros módulos.

### Separação de side effects da store
**Decisão:** Extrair chamadas de voz e mensagens do agente para `focusEffects.ts`. A store gerencia apenas estado puro.

**Justificativa:**
- Torna a store testável sem dependência de áudio.
- Facilita troca de implementação de voz sem alterar lógica de estado.

---

## 2026-04-17 — Fundação do Módulo

### Nome oficial do agente
**Decisão:** Definido o agente oficial do módulo como **Zen Folk**.

**Justificativa:**
- Nome aprovado diretamente pelo usuário.
- Reforça posicionamento de presença de foco com tom equilibrado entre firmeza e calma.

### Estratégia de evolução em fases
**Decisão:** Organizar o produto em quatro fases: MVP, agente inteligente, tracking comportamental e contexto avançado.

**Justificativa:**
- Reduz risco de complexidade prematura.
- Entrega valor rápido no MVP sem bloquear evolução técnica.

### Stack de referência inicial
**Decisão:** Adotar como referência arquitetural inicial: **React + Tauri + OpenAI + SQLite local**.

**Justificativa:**
- Leveza para desktop e boa base para expansão futura.
- Compatível com a visão de monitoramento progressivo de foco.

**Nota (2026-06-13):** Stack atual de produção é React (SagB Web) + TypeScript + Zustand + localStorage + Gemini TTS (via aiProxy) + Browser SpeechSynthesis. Tauri, OpenAI e SQLite permanecem como roadmap futuro.
