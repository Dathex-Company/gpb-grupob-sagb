# ðŸ§­ PadrÃ£o de Recursos Visuais para DocumentaÃ§Ã£o â€” Loze

**Data:** 12-06-2026  
**Status:** ðŸŸ¢ Oficial inicial  
**Tipo:** PadrÃ£o visual de Markdown para documentos humanos  
**AplicaÃ§Ã£o:** padrÃµes, auditorias, matrizes, relatÃ³rios, planos, guias e decisÃµes.

---

## ðŸ“Œ SumÃ¡rio navegÃ¡vel

- [ðŸ“Œ Resumo executivo](#-resumo-executivo)
- [âœ… Regra principal](#-regra-principal)
- [## Legenda visual](#legenda-visual)
- [ðŸ§± Estrutura recomendada](#-estrutura-recomendada)
- [ðŸ§¾ Blocos visuais obrigatÃ³rios](#-blocos-visuais-obrigatÃ³rios)
- [ðŸ§­ Fluxo visual recomendado](#-fluxo-visual-recomendado)
- [ðŸ§ª CritÃ©rios de pronto](#-critÃ©rios-de-pronto)

---

## ðŸ“Œ Resumo executivo

Documentos oficiais da Loze nÃ£o devem ser apenas texto corrido. Eles precisam orientar leitura, decisÃ£o e execuÃ§Ã£o com recursos visuais claros.

> ðŸ”µ **Em linguagem simples:** um documento oficial precisa permitir que uma pessoa entenda rÃ¡pido o status, o risco, o caminho, a decisÃ£o e o prÃ³ximo passo.

---

## âœ… Regra principal

Todo documento oficial deve usar, quando fizer sentido:

- âœ… status visual;
- ðŸ”´ risco crÃ­tico;
- ðŸŸ  risco alto;
- ðŸŸ¡ atenÃ§Ã£o;
- ðŸŸ¢ aprovado/seguro;
- ðŸ”µ informaÃ§Ã£o;
- ðŸŸ£ decisÃ£o;
- âš« bloqueado;
- ðŸ“Œ resumo executivo;
- ðŸ§­ navegaÃ§Ã£o;
- ðŸ§± estrutura;
- ðŸ§ª validaÃ§Ã£o;
- ðŸ›¡ï¸ seguranÃ§a;
- ðŸ§¾ evidÃªncia;
- ðŸ§  explicaÃ§Ã£o guiada;
- ðŸ§© mÃ³dulo;
- âš™ï¸ comando tÃ©cnico;
- ðŸš« nÃ£o fazer;
- âž¡ï¸ prÃ³ximo passo.

---

## Legenda visual

| SÃ­mbolo | Significado | Uso |
|---|---|---|
| ðŸŸ¢ | Seguro / aprovado | Pode seguir |
| ðŸŸ¡ | AtenÃ§Ã£o | Revisar antes |
| ðŸŸ  | Alto risco | Precisa cuidado |
| ðŸ”´ | CrÃ­tico | Exige autorizaÃ§Ã£o |
| âš« | Bloqueado | NÃ£o executar |
| ðŸ§¾ | EvidÃªncia | Prova/registro |
| ðŸ§ª | Teste | ValidaÃ§Ã£o obrigatÃ³ria |
| ðŸ›¡ï¸ | SeguranÃ§a | Chaves, acesso, RLS, segredo |
| ðŸŸ£ | DecisÃ£o | DireÃ§Ã£o aprovada ou recomendada |
| âš™ï¸ | Comando tÃ©cnico | CLI, script, build, migration |
| âž¡ï¸ | PrÃ³ximo passo | Continuidade recomendada |

---

## ðŸ§± Estrutura recomendada

```text
documento.md
â”œâ”€â”€ ðŸ“Œ Resumo executivo
â”œâ”€â”€ ðŸ§­ SumÃ¡rio navegÃ¡vel
â”œâ”€â”€ ðŸ§¾ Contexto e evidÃªncias
â”œâ”€â”€ ðŸ§± Estrutura / escopo
â”œâ”€â”€ ðŸ›¡ï¸ Riscos e seguranÃ§a
â”œâ”€â”€ ðŸ§ª ValidaÃ§Ã£o
â”œâ”€â”€ ðŸŸ£ DecisÃ£o
â”œâ”€â”€ âœ… CritÃ©rios de pronto
â””â”€â”€ âž¡ï¸ PrÃ³ximos passos
```

---

## ðŸ§¾ Blocos visuais obrigatÃ³rios

### ðŸ”´ Bloco de risco

> ðŸ”´ **Risco crÃ­tico:** esta aÃ§Ã£o pode afetar produÃ§Ã£o, banco remoto, secrets ou dados reais. Exige autorizaÃ§Ã£o explÃ­cita.

### ðŸŸ£ Bloco de decisÃ£o

> ðŸŸ£ **DecisÃ£o recomendada:** manter a Central de PadrÃµes como mÃ³dulo oficial e usar o TaskZei como piloto documental.

### ðŸ§ª Bloco de validaÃ§Ã£o

| ValidaÃ§Ã£o | Status | EvidÃªncia |
|---|---|---|
| Build | ðŸŸ¢ OK | `npm run build` |
| Typecheck | ðŸŸ¡ Pendente | erros preexistentes |

### âœ… Checklist

- [ ] Tem resumo executivo?
- [ ] Tem legenda visual?
- [ ] Tem caminhos copiÃ¡veis?
- [ ] Tem riscos?
- [ ] Tem critÃ©rios de pronto?
- [ ] NÃ£o expÃµe segredo?

---

## ðŸ§­ Fluxo visual recomendado

```mermaid
flowchart TD
  A[Documento oficial] --> B[Resumo executivo]
  B --> C[Legenda visual]
  C --> D[Contexto e decisÃ£o]
  D --> E[Riscos e validaÃ§Ã£o]
  E --> F[Caminhos copiÃ¡veis]
  F --> G[PrÃ³ximos passos]
```

---

## ðŸ” Exemplo antes/depois

### ðŸš« Antes

```text
R5 = Supabase migration.
```

### âœ… Depois

> ðŸ”´ **R5 â€” Banco/Supabase/Migration**  
> Este nÃ­vel representa comandos que mexem em banco remoto, Supabase ou estrutura de dados.  
> Em linguagem simples: Ã© quando o agente pode mudar onde os dados reais ficam salvos.  
> **Regra:** nÃ£o executar sem autorizaÃ§Ã£o explÃ­cita, rollback e LOZE-TRACE.

---

## ðŸ§ª CritÃ©rios de pronto

| CritÃ©rio | Status esperado |
|---|---|
| SumÃ¡rio navegÃ¡vel | ðŸŸ¢ Presente |
| Legenda visual | ðŸŸ¢ Presente |
| Tabelas visuais | ðŸŸ¢ Presentes |
| Mermaid quando Ãºtil | ðŸŸ¢ Presente |
| Caminhos copiÃ¡veis | ðŸŸ¢ Presentes |
| Segredos expostos | ðŸŸ¢ NÃ£o |
| PrÃ³ximos passos | ðŸŸ¢ Claros |
