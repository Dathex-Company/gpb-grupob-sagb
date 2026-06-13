# Padrão Técnico de Versionamento — previsto

**Código**: TEC-PAD-003
**Tipo**: 🟠 Padrão Técnico
**Domínio**: Padrões Técnicos Loze (DM-01)
**Responsável**: Sávio Codare
**Validação necessária**: Sávio + Pietro
**Status**: previsto
**Fonte**: AGT-RECLASS-001 (Pierre Zanulli) — item 8.4

---

## Objetivo

Garantir que agentes, prompts, capacidades, ferramentas, matrizes e documentos normativos possuam versionamento quando impactarem operação, comportamento ou decisão.

## Itens versionáveis

| Item | O que versionar | Frequência |
|------|----------------|------------|
| Ficha de agente | Escopo, nível de autonomia, ferramentas | A cada alteração |
| Prompt base | Comportamento, instruções, regras | A cada alteração |
| Ferramentas autorizadas | Lista, permissões, limites | A cada alteração |
| Memória procedural | Regras de recuperação e escrita | A cada alteração |
| Matriz de autonomia | Níveis, permissões, gates | A cada revisão |
| Padrões de comportamento | Regras, limites | A cada revisão |
| Protocolos | Etapas, responsáveis, saídas | A cada revisão |
| Documentos canônicos | Conteúdo, validação, versão | A cada canonização |

## Formato de versionamento

```
v[major].[minor].[patch]
```

- **Major**: mudança estrutural que altera comportamento ou quebra compatibilidade.
- **Minor**: adição ou ajuste que não quebra compatibilidade.
- **Patch**: correção sem alteração de conteúdo ou comportamento.

## Metadado obrigatório

Todo item versionável deve conter no cabeçalho:

```yaml
Versão: vX.Y.Z
Data: DD-MM-AAAA
Responsável: [nome]
Status: [rascunho / previsto / canônico / arquivado]
```

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-00-GOV | Pietro | Documentos canônicos da Central |
| DM-05-AGT | Pierre | Fichas e prompts de agentes |

---

*Documento previsto — baseado na reclassificação de Pierre Zanulli (AGT-RECLASS-001)*
