# Auditoria de Scripts de Extração JSON — SagB

## Scripts candidatos encontrados

### Candidato 1 (recomendado): `extrair_conversas_deepseek.py`

| Campo | Valor |
|---|---|
| **Caminho completo** | [`Z:\02_ventures\loze\data_grupob\00_DTX_CORE\Scripts\extrair_conversas_deepseek.py`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Scripts/extrair_conversas_deepseek.py) |
| **Linguagem** | Python 3 |
| **Função** | Extrair conversas de JSON do DeepSeek para arquivos `.md` individuais + índice `.csv` |
| **Entrada esperada** | JSON com estrutura DeepSeek (`conversations.json` contendo array de conversas, cada uma com campo `mapping` em árvore) |
| **Saída gerada** | Um arquivo `.md` por conversa + `_indice_chats.csv` com metadados |
| **Extração de mensagens** | ✅ Sim — percorre árvore `mapping` do JSON, ordena por `inserted_at` |
| **Separa por conversa** | ✅ Sim — gera um arquivo por conversa |
| **Formato de saída** | `.md` (Markdown) + `.csv` (índice) |
| **Seguro para executar?** | ✅ Sim — apenas leitura do JSON e escrita em `Data/03_CONVERSAS_SEPARADAS/deepseek/` |
| **Precisa ajuste?** | ✅ Sim — caminho do JSON de entrada está hardcoded |

### Candidato 2: `agente_construtor.py`

| Campo | Valor |
|---|---|
| **Caminho completo** | [`Z:\02_ventures\loze\data_grupob\00_DTX_CORE\Scripts\agente_construtor.py`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Scripts/agente_construtor.py) |
| **Linguagem** | Python 3 |
| **Função** | Construtor de agentes no Firebase/Firestore a partir de pastas locais |
| **Entrada esperada** | Firebase credentials + estrutura de pastas em `D:\DATHEX_STACK` |
| **Saída gerada** | Dados no Firestore |
| **Extrai mensagens de JSON?** | ❌ Não |
| **Relevante?** | ❌ Não — é para construção de agentes no Firebase |

### Candidato 3: `rebuild_dathex_agents.py`

| Campo | Valor |
|---|---|
| **Caminho completo** | [`Z:\SagB\scripts\rebuild_dathex_agents.py`](Z:/SagB/scripts/rebuild_dathex_agents.py) |
| **Linguagem** | Python 3 |
| **Função** | Reconstruir sessão de agentes a partir de `session_log.md` e `falas_user.md` |
| **Extrai mensagens de JSON?** | ❌ Não — trabalha com `.md` |
| **Relevante?** | ❌ Parcial — tem conceito de "extrair conversa" mas de markdown, não JSON |

### Outros arquivos examinados (SagB)

| Arquivo | Extrai de JSON? | Relevante? |
|---|---|---|
| `tools/check-history.mjs` | ❌ | Não — check de histórico |
| `tools/local_whisper_server.py` | ❌ | Não — transcrição de áudio |
| `tools/webhook-mock-server.js` | ❌ | Não — mock de webhook |
| `scripts/setup-meta-webhook.ts` | ❌ | Não — setup de webhook |
| `scripts/start-crm-ziplia.bat` | ❌ | Não — script de start |

## Script recomendado

**`extrair_conversas_deepseek.py`** — único script encontrado que realmente extrai conversas de JSON.

## Ajustes necessários antes de executar

O script tem caminhos **hardcoded** que precisam ser ajustados para a realidade atual:

### Ajuste 1 — Caminho do JSON de entrada

**Atual (linha 7):**
```python
SOURCE_JSON = Path("Conversa deepseek_data-2026-03-27/conversations.json")
```

**Necessário (conforme estrutura atual):**
```python
SOURCE_JSON = Path("deepseek_data-2026-05-31/conversations.json")
```

### Ajuste 2 — Diretório de saída

**Atual (linha 8):**
```python
OUTPUT_DIR = Path("Data/03_CONVERSAS_SEPARADAS/deepseek")
```

Pode manter ou alterar conforme preferir. Se quiser que a saída vá para um local específico, ajustar.

### Ajuste 3 — Execução (working directory)

O script deve ser executado **de dentro da pasta** onde estão os dados, ou seja:
```
Z:\02_ventures\loze\data_grupob\00_DTX_CORE\
```

Porque os caminhos são relativos a esse diretório.

## Comando provável para executar

```bash
cd Z:\02_ventures\loze\data_grupob\00_DTX_CORE
python Scripts\extrair_conversas_deepseek.py
```

## Riscos e cuidados

1. **Fazer backup do JSON original antes de qualquer execução** — embora o script não altere o original, é sempre bom ter cópia de segurança.
2. **Verificar espaço em disco** — um JSON grande pode gerar muitos arquivos `.md`. O DeepSeek export pode ter centenas de conversas.
3. **Nome dos arquivos de saída** — o script sanitiza títulos para nome de arquivo. Títulos com caracteres especiais podem gerar nomes truncados.
4. **Encoding** — o script usa `utf-8`, que é adequado para português.

## Observações sobre o script

- ✅ Já foi testado anteriormente (existe saída em `Data/03_CONVERSAS_SEPARADAS/deepseek/` com as conversas extraídas da versão de março)
- ✅ Trata estrutura de árvore do DeepSeek (`mapping` com `children`, `parent`)
- ✅ Ordena mensagens por data (`inserted_at`)
- ✅ Gera índice CSV com metadados (título, arquivo, ID, datas, total de mensagens)
- ✅ Não modifica o JSON original
- ✅ Gera saída em Markdown limpo e legível

## Recomendação do próximo passo

**Opção A (recomendada):** Cássio ajusta os 2 caminhos hardcoded no script e executa contra o JSON atual em `deepseek_data-2026-05-31/conversations.json`.

**Opção B:** Se a conversa grande for de outro formato (ChatGPT, Claude, etc.), criar script novo específico para aquele formato.

**Opção C:** Testar primeiro com uma cópia pequena do JSON (extrair 2-3 conversas) para validar o funcionamento antes da extração completa.
