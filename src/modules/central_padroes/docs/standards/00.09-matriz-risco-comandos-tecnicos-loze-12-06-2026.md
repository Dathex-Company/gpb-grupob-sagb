# ðŸ›¡ï¸ Matriz de Risco de Comandos TÃ©cnicos â€” Loze

**Data:** 12-06-2026  
**Status:** ðŸŸ¢ Oficial inicial  
**PadrÃ£o relacionado:** LOZE-TRACE

---

## ðŸ“Œ Resumo executivo

Esta matriz define como classificar comandos tÃ©cnicos antes de executar qualquer aÃ§Ã£o. Ela existe para proteger cÃ³digo, banco, produÃ§Ã£o, segredos e dados reais.

> ðŸ”µ **Em linguagem simples:** antes de rodar comando, o agente precisa saber se estÃ¡ apenas olhando, alterando arquivo, mexendo em Git, mexendo em banco ou tocando produÃ§Ã£o.

---

## Matriz visual de risco

| NÃ­vel | Cor | Nome | Exemplo | Pode executar sozinho? | Exige autorizaÃ§Ã£o? |
|---|---|---|---|---|---|
| R0 | ðŸŸ¢ | Leitura / inspeÃ§Ã£o | `ls`, `pwd`, `cat README.md` | Sim | NÃ£o |
| R1 | ðŸŸ¢ | ValidaÃ§Ã£o local segura | `npm run typecheck` | Sim | NÃ£o |
| R2 | ðŸŸ¡ | AlteraÃ§Ã£o local de arquivo | editar `.md`, `.ts`, `.tsx` | Sim, com log | Depende |
| R3 | ðŸŸ  | InstalaÃ§Ã£o/build/geraÃ§Ã£o | `npm install`, `npm run build` | Com cuidado | Depende |
| R4 | ðŸŸ  | Git/branch/commit/push | `git commit`, `git push` | NÃ£o sem regra | Sim |
| R5 | ðŸ”´ | Banco/Supabase/migration/remoto | `supabase db push`, SQL remoto | NÃ£o | Sim |
| R6 | âš« | ProduÃ§Ã£o/segredo/irreversÃ­vel | deploy prod, secret, delete dados | NÃ£o | Sim, obrigatÃ³rio |

---

## ðŸ§­ Fluxo de decisÃ£o antes de executar

```mermaid
flowchart TD
  A[Agente vai executar comando] --> B{Qual risco?}
  B -->|R0/R1| C[Executa e registra]
  B -->|R2/R3| D[Executa com LOZE-TRACE e validaÃ§Ã£o]
  B -->|R4| E[Exige regra Git e autorizaÃ§Ã£o]
  B -->|R5| F[Exige autorizaÃ§Ã£o, backup e rollback]
  B -->|R6| G[Bloqueado atÃ© aprovaÃ§Ã£o humana explÃ­cita]
```

---

## âš™ï¸ Exemplos de comandos

| Comando / aÃ§Ã£o | Risco | O que pode dar errado | Registrar no LOZE-TRACE |
|---|---|---|---|
| `pwd` | ðŸŸ¢ R0 | Nada persistente | Pasta atual |
| `ls` | ðŸŸ¢ R0 | Nada persistente | Caminho listado |
| `npm run typecheck` | ðŸŸ¢ R1 | Falhar por erro TS | Resultado e erros |
| `npm run build` | ðŸŸ  R1/R3 | Build falhar ou gerar artefatos | Resultado, tempo e saÃ­da |
| `npm install` | ðŸŸ  R3 | Alterar lockfile/deps | Pacotes afetados |
| editar `.md` | ðŸŸ¡ R2 | Quebrar padrÃ£o documental | Arquivo alterado |
| editar `.ts/.tsx` | ðŸŸ  R2/R3 | Quebrar build/runtime | Arquivo e validaÃ§Ã£o |
| `git commit` | ðŸŸ  R4 | Registrar mudanÃ§a errada | Hash e mensagem |
| `git push` | ðŸŸ  R4 | Alterar remoto | Branch e autorizaÃ§Ã£o |
| `npx supabase db push` | ðŸ”´ R5 | Alterar banco remoto | Projeto, migration, rollback |
| SQL remoto | ðŸ”´ R5 | Quebrar dados/RLS | SQL, resultado, backup |
| deploy prod | âš« R6 | Afetar usuÃ¡rios reais | AprovaÃ§Ã£o explÃ­cita |
| expor segredo real | âš« R6 bloqueado | Incidente de seguranÃ§a | Mascarar e registrar incidente |

---

## ðŸ”´ R5 â€” Banco/Supabase/Migration

Este nÃ­vel representa comandos que mexem em banco remoto, Supabase ou estrutura de dados.

**Em linguagem simples:** Ã© quando o agente pode mudar onde os dados reais ficam salvos.

Exemplos:

- executar SQL no Supabase;
- rodar migration;
- alterar RLS;
- criar tabela;
- alterar policy.

Riscos:

- quebrar salvamento;
- abrir acesso indevido;
- travar tela;
- afetar dados reais.

Regra: **nÃ£o executar sem autorizaÃ§Ã£o explÃ­cita e registro LOZE-TRACE**.

---

## âœ… Checklist obrigatÃ³rio antes de R5/R6

| Pergunta | Status |
|---|---|
| Afeta banco remoto? | â¬œ |
| Afeta produÃ§Ã£o? | â¬œ |
| Altera env? | â¬œ |
| Usa segredo? | â¬œ |
| Altera deploy? | â¬œ |
| Pode apagar dados? | â¬œ |
| Tem rollback? | â¬œ |
| Tem backup? | â¬œ |
| Tem autorizaÃ§Ã£o? | â¬œ |
| Tem relatÃ³rio? | â¬œ |
| Tem teste depois? | â¬œ |
