# ðŸ“¡ IntegraÃ§Ã£o com Monitoramento de ExecuÃ§Ãµes TÃ©cnicas â€” Loze

**Data:** 12-06-2026  
**Status:** ðŸŸ¢ Desenho oficial inicial

---

## ðŸ“Œ Resumo executivo

O Monitoramento deve receber execuÃ§Ãµes, erros, comandos, logs, risco, status, tempo, arquivos alterados, falhas, bloqueios e aÃ§Ãµes com Supabase, GitHub, Netlify, MCP e CLI.

---

## ðŸ§­ Fluxo futuro

```mermaid
sequenceDiagram
  participant A as Agente
  participant L as LOZE-TRACE
  participant M as Monitoramento
  participant H as Humano
  A->>L: registra comando, risco e resultado
  L->>M: envia evento tÃ©cnico
  M->>M: agrupa falhas e bloqueios
  M->>H: alerta quando precisa aprovaÃ§Ã£o
```

---

## ðŸ§¾ Evento mÃ­nimo

| Campo | Exemplo |
|---|---|
| execution_id | `loze-trace-id` |
| project | `taskzei-loze-web` |
| executor | `agent` |
| status | ðŸŸ¢ success / ðŸŸ¡ partial / ðŸ”´ failed / âš« blocked |
| max_risk | `R5` |
| commands | lista sanitizada |
| files_changed | lista |
| errors | lista sem segredo |

---

## âœ… Regras

- Todo R5/R6 deve gerar evento.
- Todo erro de comando deve gerar evento.
- Toda execuÃ§Ã£o bloqueada deve gerar evento.
- Segredos nunca devem ser enviados em valor real.
- Eventos repetidos devem ser agrupados.
