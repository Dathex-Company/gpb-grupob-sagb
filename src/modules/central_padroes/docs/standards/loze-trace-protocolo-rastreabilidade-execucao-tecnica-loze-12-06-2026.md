# ðŸ§¾ LOZE-TRACE â€” Protocolo de Rastreabilidade de ExecuÃ§Ã£o TÃ©cnica Loze

**Data:** 12-06-2026  
**Status:** ðŸŸ¢ Oficial inicial  
**Escopo:** pessoa, agente, CLI, MCP, automaÃ§Ã£o e execuÃ§Ã£o assistida.

---

## ðŸ“Œ Resumo executivo

LOZE-TRACE Ã© o protocolo para registrar 100% das aÃ§Ãµes tÃ©cnicas feitas em projetos Loze/SagB.

> ðŸ”µ **Em linguagem simples:** se alguÃ©m ou algum agente mexeu em cÃ³digo, arquivo, banco, deploy, CLI ou automaÃ§Ã£o, precisa ficar claro o que foi feito, onde foi feito, por que foi feito, qual risco tinha e como foi validado.

---

## ðŸ§­ Fluxo visual da execuÃ§Ã£o

```mermaid
flowchart LR
  A[Tarefa recebida] --> B[Leitura do contexto]
  B --> C[ClassificaÃ§Ã£o de risco]
  C --> D[ExecuÃ§Ã£o controlada]
  D --> E[Registro comando a comando]
  E --> F[ValidaÃ§Ã£o]
  F --> G[RelatÃ³rio LOZE-TRACE]
  G --> H[Monitoramento SagB]
```

---

## âœ… O que nunca pode faltar

| Campo | ObrigatÃ³rio? | Por quÃª |
|---|---|---|
| Tarefa | âœ… | Identifica o motivo |
| Executor | âœ… | Pessoa/agente responsÃ¡vel |
| Projeto | âœ… | Evita confusÃ£o entre repositÃ³rios |
| Caminho | âœ… | Permite reproduzir |
| Comando | âœ… | Mostra aÃ§Ã£o real |
| Pasta do comando | âœ… | Contexto de execuÃ§Ã£o |
| Risco | âœ… | Define autorizaÃ§Ã£o |
| Resultado | âœ… | Mostra se funcionou |
| Erro | âœ… | Ajuda diagnÃ³stico |
| Arquivos afetados | âœ… | Mostra impacto |
| ValidaÃ§Ã£o | âœ… | Prova final |
| Segredos | âœ… sem valor | SeguranÃ§a |

---

## âš™ï¸ Tabela obrigatÃ³ria de comandos

| Ordem | Data/hora | Pasta | Comando | Objetivo | Risco | Resultado | Erro | Arquivos afetados | ObservaÃ§Ã£o |
|---|---|---|---|---|---|---|---|---|---|

---

## ðŸ§ª Checklist antes/depois

### Antes

- [ ] Entendi a tarefa?
- [ ] Sei a pasta correta?
- [ ] Classifiquei o risco?
- [ ] Precisa autorizaÃ§Ã£o?
- [ ] Pode expor segredo?
- [ ] Tem rollback se for R5/R6?

### Depois

- [ ] Registrei comandos?
- [ ] Registrei erros?
- [ ] Listei arquivos afetados?
- [ ] Rodei validaÃ§Ã£o?
- [ ] Registrei pendÃªncias?
- [ ] NÃ£o expus segredo?

---

## ðŸ§¾ Exemplo preenchido

| Ordem | Data/hora | Pasta | Comando | Objetivo | Risco | Resultado | Erro | Arquivos afetados | ObservaÃ§Ã£o |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 12-06-2026 00:00 | `Z:\projeto` | `npm run build` | Validar build | ðŸŸ  R3 | âœ… OK | â€” | `dist` | Build local |

---

## ðŸŸ¡ Erro comum

> ðŸš« **Erro:** dizer â€œrodei build e deu erroâ€ sem copiar o erro.  
> âœ… **Correto:** registrar comando, pasta, saÃ­da, arquivo afetado e decisÃ£o tomada depois.

---

## ðŸ›¡ï¸ SeguranÃ§a

Nunca registrar valores reais de service role, tokens, API keys, senhas, chaves privadas ou connection strings sensÃ­veis.

Se aparecer segredo, mascarar com `********`.

---

## ðŸ“¡ Como alimenta o Monitoramento

O Monitoramento SagB deve receber eventos de execuÃ§Ã£o, comandos, falhas, risco, duraÃ§Ã£o, bloqueios e arquivos alterados. Isso permite saber onde o agente falhou, qual comando quebrou e se a tarefa deve ser quebrada em partes menores.
