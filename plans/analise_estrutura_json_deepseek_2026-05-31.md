# Análise da Estrutura JSON — DeepSeek Data 2026-05-31

## Caminho analisado

```
Z:\02_ventures\loze\data_grupob\00_DTX_CORE\deepseek_data-2026-05-31
```

## Arquivos encontrados

| Arquivo | Tipo | Tamanho | Observação |
|---|---|---|---|
| `conversations.json` | JSON (minificado, uma linha) | Grande (indeterminado) | Array de conversas DeepSeek — é o arquivo principal |
| `user.json` | JSON | Pequeno | Apenas metadados do usuário (user_id, email: `adm@3forb.com.br`) |

## Estrutura do JSON

O arquivo `conversations.json` é um **array de objetos**, cada objeto representando uma conversa. A estrutura é:

```
[
  {conversa_1},
  {conversa_2},
  {conversa_3},
  ...
]
```

Cada objeto de conversa tem esta estrutura:

```
{
  "id": "uuid-da-conversa",
  "title": "título da conversa",
  "inserted_at": "timestamp ISO",
  "updated_at": "timestamp ISO",
  "mapping": {
    "root": { "id": "root", "parent": null, "children": ["1"], "message": null },
    "1": { "id": "1", "parent": "root", "children": ["2"], "message": { ... } },
    "2": { "id": "2", "parent": "1", "children": [...], "message": { ... } },
    ...
  }
}
```

O campo `mapping` é uma **árvore de mensagens** onde cada nó tem:

```json
{
  "id": "node_id",
  "parent": "parent_node_id",
  "children": ["child_1", "child_2"],
  "message": {
    "files": [],
    "model": "deepseek-chat",
    "inserted_at": "timestamp",
    "fragments": [
      {"type": "REQUEST", "content": "texto do usuário"},
      {"type": "RESPONSE", "content": "texto do assistente"}
    ]
  }
}
```

## As conversas estão separadas?

**✅ Sim — completamente separadas.**

O JSON é um array de nível superior. Cada elemento do array é uma conversa independente com seu próprio:

- `id` único (UUID)
- `title`
- `inserted_at` / `updated_at`
- `mapping` (árvore de mensagens)

## Campos importantes encontrados

| Campo | Função aparente | Exemplo |
|---|---|---|
| `id` | UUID único da conversa | `7f8606a4-4b1e-4a2c-9dcf-85224a91fcb9` |
| `title` | Título da conversa | `🆔️ AGE` |
| `inserted_at` | Timestamp de criação | `2025-01-30T10:52:40.790000+08:00` |
| `updated_at` | Timestamp de última atualização | `2025-02-23T04:49:48.671000+08:00` |
| `mapping.root` | Nó raiz (não contém mensagem) | `{id:"root", parent:null, children:["1"], message:null}` |
| `mapping[n].message.model` | Modelo de IA usado | `deepseek-chat` |
| `mapping[n].message.inserted_at` | Timestamp da mensagem | `2025-01-30T10:52:41.432000+08:00` |
| `mapping[n].message.fragments[].type` | Tipo do fragmento | `REQUEST` (usuário) ou `RESPONSE` (IA) |
| `mapping[n].message.fragments[].content` | Conteúdo textual | Texto completo da mensagem |
| `mapping[n].message.files` | Arquivos anexados | `[]` (vazio) |

## Estrutura das mensagens

- **Usuário:** Fragmento com `type: "REQUEST"` no campo `content`
- **Assistente (IA):** Fragmento com `type: "RESPONSE"` no campo `content`
- **Timestamp:** Cada nó tem `inserted_at`
- **Ordem:** As mensagens são organizadas em árvore via `parent`/`children`. O script ordena por `inserted_at` para obter sequência cronológica.
- **Título:** Cada conversa tem `title`
- **ID da conversa:** Cada conversa tem `id` UUID
- **Metadados:** Modelo da IA (`model`), timestamps de criação/atualização

## Compatibilidade com o script encontrado

| Script | Compatível? | Precisa ajuste? | Observação |
|---|---|---|---|
| [`extrair_conversas_deepseek.py`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Scripts/extrair_conversas_deepseek.py) | ✅ **Sim, 100%** | ⚠️ Apenas o caminho do JSON de entrada | Script criado exatamente para este formato. Já extraiu versão anterior (março/2026) com sucesso — saída em [`Data/03_CONVERSAS_SEPARADAS/deepseek/`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Data/03_CONVERSAS_SEPARADAS/deepseek/) (aproximadamente 90+ conversas extraídas). |

### Saída da extração anterior (março/2026)

Já existe um diretório com as conversas extraídas da versão anterior:

```text
Data/03_CONVERSAS_SEPARADAS/deepseek/
├── _indice_chats.csv
├── 🆔️ AGE.md
├── AcadB.md
├── AceleraB.md
├── Alan Flow Conversa Extraida 02.01.2026.md
├── Anlise da empresa Glh.md
├── ... (aproximadamente 90+ arquivos)
└── Ziply.md
```

Isso comprova que o script funciona corretamente.

## Plano recomendado de extração

### 1. Backup de segurança (opcional)

Criar uma cópia do JSON original antes de qualquer operação:
```bash
copy deepseek_data-2026-05-31\conversations.json deepseek_data-2026-05-31\conversations_backup.json
```

### 2. Ajustar caminhos no script

Editar as linhas 7–8 do script:

```python
# De:
SOURCE_JSON = Path("Conversa deepseek_data-2026-03-27/conversations.json")
OUTPUT_DIR = Path("Data/03_CONVERSAS_SEPARADAS/deepseek")

# Para:
SOURCE_JSON = Path("deepseek_data-2026-05-31/conversations.json")
OUTPUT_DIR = Path("Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31")
```

> **Nota:** Use um diretório de saída diferente (`deepseek_2026_05_31`) para não misturar com a extração anterior.

### 3. Executar extração

```bash
cd Z:\02_ventures\loze\data_grupob\00_DTX_CORE
python Scripts\extrair_conversas_deepseek.py
```

### 4. Validar saída

- Verificar se os arquivos `.md` foram gerados
- Confirmar que o índice CSV foi criado
- Conferir 2-3 conversas aleatórias para verificar qualidade

## Formato sugerido de saída

```text
Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31/
├── _indice_chats.csv            ← Índice com metadados
├── 🆔️ AGE.md                   ← Cada conversa vira um .md
├── ...                          ← Demais conversas
```

Cada arquivo `.md` terá:

```markdown
# Título da Conversa

## Metadados
- **Título original:** ...
- **ID da conversa:** ...
- **Criada em:** ...
- **Atualizada em:** ...
- **Origem:** deepseek_data-2026-05-31/conversations.json
- **Total de mensagens:** X

---

## Mensagens

### Mensagem 1
**Autor:** Usuário
**Data:** ...
**Modelo:** deepseek-chat

[conteúdo]

---

### Mensagem 2
**Autor:** IA
**Data:** ...
**Modelo:** deepseek-chat

[conteúdo]

---
```

## Riscos e cuidados

1. **Arquivo muito grande** — O JSON é minificado em uma única linha. O Python precisa carregar tudo na memória. Pode consumir RAM significativa se houver muitas conversas.
2. **Encoding** — O script usa `utf-8`, que é adequado para português e emojis (🆔️, etc.).
3. **Campos inconsistentes** — Se alguma conversa tiver estrutura diferente (ex: `mapping` ausente), o script pode pular ou gerar erro. O script atual já trata nós vazios com `if not node: return`.
4. **Conversa sem título** — O script tem fallback para `conversa_<id>` quando `title` está vazio.
5. **Mensagens fora de ordem** — O script ordena por `inserted_at`, então a ordem deve ser preservada.
6. **Nomes de arquivo com caracteres especiais** — O script sanitiza: remove `\ / : * ? " < > |`, converte para ASCII, substitui espaços.

## Próximo passo recomendado

**Podemos executar a extração completa imediatamente.**

### Checklist de aprovação

| Pergunta | Resposta |
|---|---|
| As conversas estão separadas? | ✅ Sim — array de objetos independentes |
| Qual campo separa cada conversa? | `id` (UUID) — título: `title` |
| O script encontrado consegue extrair corretamente? | ✅ Sim — já extraiu versão anterior com sucesso |
| Qual será o nome e destino dos arquivos? | `Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31/` — 1 `.md` por conversa |

### Ações necessárias antes de executar

1. Ajustar 2 caminhos hardcoded no script (linhas 7-8)
2. Executar a partir de `Z:\02_ventures\loze\data_grupob\00_DTX_CORE\`
3. Usar diretório de saída diferente da extração anterior
