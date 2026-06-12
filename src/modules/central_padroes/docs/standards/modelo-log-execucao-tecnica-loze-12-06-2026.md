# RelatÃ³rio LOZE-TRACE â€” [Projeto] â€” [dd-mm-aaaa]

## ðŸ“Œ Resumo executivo

| Campo | Valor |
|---|---|
| Projeto |  |
| Executor |  |
| Ambiente |  |
| InÃ­cio |  |
| Fim |  |
| Resultado | ðŸŸ¢ Aprovado / ðŸŸ¡ Parcial / ðŸ”´ Falhou |
| Maior risco executado | R0-R6 |

---

## Legenda de risco

| Risco | SÃ­mbolo | Significado |
|---|---|---|
| R0 | ðŸŸ¢ | Leitura / inspeÃ§Ã£o |
| R1 | ðŸŸ¢ | ValidaÃ§Ã£o local segura |
| R2 | ðŸŸ¡ | AlteraÃ§Ã£o local |
| R3 | ðŸŸ  | Build/instalaÃ§Ã£o/geraÃ§Ã£o |
| R4 | ðŸŸ  | Git remoto/local relevante |
| R5 | ðŸ”´ | Banco/Supabase/remoto |
| R6 | âš« | ProduÃ§Ã£o/segredo/irreversÃ­vel |

---

## ðŸ§­ Fluxo da execuÃ§Ã£o

```mermaid
flowchart TD
  A[InÃ­cio] --> B[DiagnÃ³stico]
  B --> C[ExecuÃ§Ã£o]
  C --> D[ValidaÃ§Ã£o]
  D --> E[RelatÃ³rio]
```

---

## âš™ï¸ Comandos executados

| Ordem | Risco | Pasta | Comando | Objetivo | Resultado | Erro | EvidÃªncia |
|---|---|---|---|---|---|---|---|
| 1 | ðŸŸ¢ R0 | `Z:\...` | `npm run build` | Validar build | âœ… OK | â€” | log |

---

## ðŸ§± Arquivos afetados

### Criados

| Arquivo | Motivo | Risco |
|---|---|---|

### Alterados

| Arquivo | Motivo | Risco |
|---|---|---|

### Removidos

| Arquivo | Motivo | Risco |
|---|---|---|

---

## ðŸ§¾ EvidÃªncias

| EvidÃªncia | Resultado |
|---|---|
| Build |  |
| Typecheck |  |
| Smoke test |  |

---

## ðŸ”´ Erros encontrados

| Erro | Impacto | DecisÃ£o |
|---|---|---|

---

## âš« AÃ§Ãµes bloqueadas

| AÃ§Ã£o | Motivo | PrÃ³ximo passo |
|---|---|---|

---

## âž¡ï¸ PrÃ³ximos passos

| Ordem | AÃ§Ã£o | ResponsÃ¡vel |
|---|---|---|
