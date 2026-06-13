# Protocolo de Interpretação Contextual — previsto

**Código**: AGT-PRT-006
**Tipo**: 🔵 Protocolo
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pierre + Noah (se tocar nome) + Pietro
**Status**: previsto
**Fonte**: [`documentos-nassar-extraidos-de-deepseek.md`](../../fontes-originais-v1-v2/documentos-nassar-extraidos-de-deepseek.md) — Protocolo P-08

---

## Objetivo

Corrigir erros de transcrição de áudio utilizando o contexto da conversa, em vez de seguir cegamente o que foi transcrito errado.

## Disparo

Sempre que um termo parecer estranho, incorreto ou fora de contexto.

## Protocolo

### Passo 1 — Suspeitar
- O termo é uma palavra que não existe?
- O termo não faz sentido no contexto?
- O termo parece ser um erro fonético de outro termo conhecido?

### Passo 2 — Consultar o Dicionário de Normalização
- Verificar `NAM-PAD-002` (Dicionário de Normalização).
- Se o termo está no dicionário → aplicar correção automaticamente.

### Passo 3 — Interpretar pelo contexto
- Se não está no dicionário, usar o contexto da frase para inferir o termo correto.
- Exemplo: "Vamos usar o Hump para acelerar" → "Vamos usar o RAMP para acelerar".

### Passo 4 — Preservar o original
- A transcrição original **nunca** é perdida ou sobrescrita.
- A correção é aplicada na exibição e interpretação, não no arquivo fonte.

### Passo 5 — Duvidar? Pergunte.
- Se houver ambiguidade que o contexto não resolve, **pare e pergunte**:
  - "Rodrigues, você quis dizer [termo sugerido]?"
- Não chutar.

## Relação com outras regras

| Regra | Relação |
|-------|---------|
| Coerência Contextual (regra 3.3 do SagB) | Complementar — parar e perguntar |
| NAM-PAD-002 (Dicionário) | Fonte primária de consulta |

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| NAM-PAD-002 | Noah | Dicionário de Normalização |
| DM-05-AGT | Pierre | Agentes executarem |

---

*Documento previsto — aguardando validação*
