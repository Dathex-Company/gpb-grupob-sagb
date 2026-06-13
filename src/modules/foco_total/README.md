# Foco Total — Zen Folk | Foco AI

**Módulo:** `foco_total`
**Versão:** `0.2.0`
**Rota:** `/foco-total/*`
**Agente:** Zen Folk

---

## Visão

Copiloto de execução pessoal guiado por IA. O agente **Zen Folk** acompanha sprints de foco, sustenta concentração, provoca retomada quando há desvio e fecha cada sessão com registro objetivo de progresso.

---

## Arquitetura

```
src/modules/foco_total/
├── index.ts                          # Entrada pública do módulo
├── manifest.ts                       # ModuleManifest (registro no SagB)
├── module-doc.ts                     # ModuleDoc canônico
├── routes.tsx                        # Rota /foco-total/*
├── README.md                         # Este documento
├── changelog.md                      # Histórico de versões
├── decisions.md                      # Decisões estruturais (ADR)
│
├── types/
│   └── index.ts                      # FocusSession, SessionLog, SessionStatus
│
├── stores/
│   └── focusStore.ts                 # Zustand store (estado da sessão)
│
├── services/
│   └── zenVoice.ts                   # Voz: Gemini TTS + Browser SpeechSynthesis
│
├── components/
│   ├── FocusTimer.tsx                # Timer circular com progresso
│   └── SessionConfigModal.tsx        # Modal de configuração de sessão
│
├── pages/
│   └── FocoTotalPage.tsx             # Página principal do módulo
│
├── agent/
│   ├── persona.md                    # Persona do Zen Folk
│   ├── prompt_ativacao_cline.md      # Prompt de ativação
│   ├── falas_user.md                 # Falas do usuário
│   └── session_log.md                # Log de sessão do agente
│
├── docs/
│   └── plans/                        # Auditorias e planos de correção
│
└── _triagem/
    └── foco ai coach chat gpt        # Material de origem
```

---

## Estado atual (MVP 0.2.0)

### O que funciona
- Configuração de sessão (tarefa + duração).
- Timer circular com pausa/retomada/encerramento.
- Voz opcional (Gemini TTS com fallback para browser SpeechSynthesis).
- Logs de sessão (start, pause, resume, stop).
- Integração com TaskZei via FocusWidget (ainda acoplado à store — em transição para facade).

### O que está em correção (plano 00-01)
- Histórico local versionado (`localStorage`).
- Fechamento obrigatório com registro de resultado.
- Timer por tempo real (clock-based, sem drift).
- Checkpoints automáticos do Zen Folk.
- Separação de side effects (voz) da store.
- Contrato público `focusSessionFacade.ts`.
- UX acessível e tokens `--sagb-*`.

---

## Limites

- **Não faz:** tracking de janela, ociosidade, leitura de tela, contexto avançado (roadmap fases 3-4).
- **Não armazena:** dados em Supabase ou SQLite (apenas `localStorage`).
- **Não coleta:** dados do usuário sem consentimento explícito.

---

## Integração

### TaskZei (FocusWidget)
O widget `src/modules/taskzei/components/tasks/FocusWidget.tsx` consome a store `useFocusStore` diretamente. Em transição para consumir `focusSessionFacade` (Fase 6 do plano de correção).

### Voz
- **Gemini TTS:** Chamada via `callAiProxy('gemini_tts', ...)`.
- **Browser SpeechSynthesis:** Fallback automático em caso de falha do Gemini.

---

## Próximos passos (roadmap)

1. **Fase 2:** Histórico local + fechamento obrigatório.
2. **Fase 3:** Timer robusto + checkpoints do agente.
3. **Fase 4:** Política de voz (modos, permissões, cache).
4. **Fase 5:** UX acessível + tokens `--sagb-*`.
5. **Fase 6:** Facade pública + desacoplamento TaskZei.
6. **Fase 7:** Testes + validação.

---

## Como executar

```bash
# Build do projeto SagB
npm run build

# Typecheck
npm run typecheck
```

Acesse `/foco-total` no SagB para usar o módulo.
