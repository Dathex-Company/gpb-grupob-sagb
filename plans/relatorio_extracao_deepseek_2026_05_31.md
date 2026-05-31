# Relatório de Extração DeepSeek — 2026-05-31

## Origem

- **Caminho:** `Z:\02_ventures\loze\data_grupob\00_DTX_CORE\deepseek_data-2026-05-31\conversations.json`
- **Formato:** JSON minificado, array de objetos
- **Backup:** `conversations_backup.json` (cópia no mesmo diretório)

## Script usado

- **Script:** [`extrair_conversas_deepseek.py`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Scripts/extrair_conversas_deepseek.py)
- **Ajustes aplicados:**
  - Caminho `SOURCE_JSON` atualizado para `deepseek_data-2026-05-31/conversations.json`
  - Diretório `OUTPUT_DIR` alterado para `Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31`
  - Truncamento de nome de arquivo para 120 caracteres (evita limite Windows de 260 caracteres)
  - Tratamento de erro por conversa (try/except) — falha em uma conversa não aborta as demais

## Diretório de saída

- **Pasta:** [`Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31/)
- **Separado da extração anterior:** ✅ Diretório novo (`deepseek_2026_05_31`), não sobrescreve `deepseek/`

## Total de conversas no JSON

**126 conversas**

## Total de arquivos gerados

**126 arquivos .md** + 1 índice CSV

| Item | Quantidade |
|---|---|
| Arquivos `.md` gerados | 126 |
| Arquivos com erro | 0 |
| Índice CSV | `_indice_chats.csv` (127 linhas: 1 header + 126 dados) |

## Conversas com erro

**Nenhuma.** Todas as 126 conversas foram extraídas com sucesso.

## Conversas sem título

Nenhuma. Todas as 126 conversas possuem título no JSON.

## Conversas longas (top 10)

| Arquivo | Mensagens | Linhas |
|---|---|---|
| `Alexer Chen Especialista DeepSeek.md` | 244 | — |
| `M.A.V Zamir Oliveira.md` | 191 | — |
| `Pedro Nassar.md` | 169 | — |
| `Dr. Alex Chen Especialista Deepseek.md` | 143 | — |
| `E.D.A Janot Frei.md` | 121 | — |
| `Jornada U.A.U Alvaro Portinari.md` | 112 | — |
| `GrupoB.md` | 91 | 6.445 |
| `3forB.md` | 77 | — |
| `Especialista em compensacao fiscal de insumos.md` | 77 | — |
| `Ziply.md` | 72 | — |

## Amostra validada

| Arquivo | Status | Observação |
|---|---|---|
| `AGE.md` | ✅ OK | Emoji 🆔️ preservado, 8 mensagens, formatação correta |
| `GrupoB.md` | ✅ OK | 91 mensagens, modelo `deepseek-reasoner`, metadados completos |
| `O usurio forneceu um arquivo...Cs.md` | ✅ OK | Conversa #99 com título longo truncado, 3 mensagens, tipo `THINK` |

### Estrutura validada de cada `.md`:

```markdown
# Título (com emojis preservados)

## Metadados
- **Título original:** ...
- **ID da conversa:** uuid
- **Criada em:** timestamp
- **Atualizada em:** timestamp
- **Origem:** deepseek_data-2026-05-31/conversations.json
- **Total de mensagens:** N

---

## Mensagens

### Mensagem 1
**Autor:** Usuário (REQUEST) ou IA (RESPONSE) ou THINK
**Data:** timestamp
**Modelo:** deepseek-chat / deepseek-reasoner

[conteúdo completo]

---
```

## Observações

1. **Arquivos grandes mantidos sem truncamento** — Conversas com muitas mensagens (ex: `GrupoB.md` com 6.445 linhas) foram preservadas integralmente.
2. **Emojis preservados** — Títulos como `🆔️ AGE`, `🅱️ GrupoB`, etc. aparecem nos arquivos `.md`.
3. **Modelos diferentes** — Algumas conversas usam `deepseek-chat`, outras `deepseek-reasoner`, conforme original.
4. **Tipos de fragmento** — Além de `REQUEST`/`RESPONSE`, aparecem também fragmentos `THINK` (do `deepseek-reasoner`, que gera pensamentos internos). O script mapeia como autor "THINK".
5. **Conteúdo sensível** — As conversas contêm dados empresariais do GrupoB. Não foi feita curadoria. Para triagem posterior.

## Próximos passos

1. ✅ Extração concluída — 126/126 conversas
2. ⏸️ Aguardando decisão sobre:
   - Necessidade de curadoria/filtragem de conteúdo sensível
   - Conversão para outros formatos (TXT, PDF, etc.)
   - Análise de conteúdo por assunto/persona
