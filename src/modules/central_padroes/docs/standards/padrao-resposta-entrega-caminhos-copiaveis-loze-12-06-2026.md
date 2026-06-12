# ðŸ“ PadrÃ£o de Resposta com Caminhos CopiÃ¡veis â€” Loze

**Data:** 12-06-2026  
**Status:** ðŸŸ¢ Oficial inicial  
**Objetivo:** garantir que qualquer pessoa, agente ou automaÃ§Ã£o consiga localizar arquivos sem depender do workspace atual.

---

## ðŸ“Œ Resumo executivo

Toda resposta de entrega tÃ©cnica deve trazer **caminho absoluto copiÃ¡vel** e, quando fizer sentido, tambÃ©m o caminho relativo.

> ðŸ”µ **Por quÃª:** links clicÃ¡veis em Markdown podem depender do workspace. Caminho absoluto permite copiar, colar e abrir direto no Windows, terminal, VS Code ou automaÃ§Ã£o.

---

## âœ… Regra obrigatÃ³ria

NÃ£o responder apenas com link clicÃ¡vel como:

```md
[README.md](10-taskzei-loze-web/README.md)
```

Usar tambÃ©m:

```txt
Z:\00_sagb\src\modules\central_padroes\docs\standards\arquivo.md
```

---

## ðŸ§¾ Formato obrigatÃ³rio por arquivo

## Arquivo criado

**Nome:** `matriz-risco-comandos-tecnicos-loze-12-06-2026.md`

**Caminho absoluto copiÃ¡vel:**

```txt
Z:\00_sagb\src\modules\central_padroes\docs\standards\matriz-risco-comandos-tecnicos-loze-12-06-2026.md
```

**Caminho relativo:**

```txt
src\modules\central_padroes\docs\standards\matriz-risco-comandos-tecnicos-loze-12-06-2026.md
```

---

## ðŸ“‹ SeÃ§Ã£o obrigatÃ³ria no final da entrega

```md
## Caminhos copiÃ¡veis

| Item | Caminho absoluto |
|---|---|
| RelatÃ³rio principal | `Z:\...` |
| PadrÃ£o criado | `Z:\...` |

## Status final

| CritÃ©rio | Status |
|---|---|
| Documentos visuais | ðŸŸ¢ Feito |
| Caminhos absolutos | ðŸŸ¢ Feito |
| Segredos expostos | ðŸŸ¢ NÃ£o |
| AÃ§Ã£o destrutiva | ðŸŸ¢ NÃ£o |
| PendÃªncias | ðŸŸ¡ Listadas |
```

---

## ðŸ›¡ï¸ SeguranÃ§a

| Item | Regra |
|---|---|
| `.env` | Pode citar caminho, nÃ£o valor de segredo |
| Secret real | Nunca mostrar |
| Token/API key | Nunca mostrar |
| Service role | Nunca mostrar |
| Senha | Nunca mostrar |

---

## ðŸ§ª CritÃ©rio de pronto

- [ ] Cada arquivo importante tem caminho absoluto.
- [ ] Cada arquivo tem tipo e nome claro.
- [ ] A resposta final tem tabela de caminhos.
- [ ] A resposta final tem tabela de status.
- [ ] Nenhum segredo foi exposto.
