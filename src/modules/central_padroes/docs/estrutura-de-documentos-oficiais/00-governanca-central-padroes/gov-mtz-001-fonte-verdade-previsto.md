# Matriz de Fonte da Verdade — previsto

**Código**: GOV-MTZ-001
**Tipo**: 📊 Matriz
**Domínio**: Governança da Central de Padrões (DM-00)
**Responsável**: Pietro Carboni
**Validação necessária**: Pietro + Rodrigues (se necessário)
**Status**: previsto
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — item 3.14

---

## Objetivo

Definir a hierarquia de precedência de fontes de informação no ecossistema GrupoB. Quando houver conflito entre duas fontes, a de maior prioridade prevalece.

## Matriz de precedência

| Prioridade | Fonte | Descrição |
|------------|-------|-----------|
| 1 (maior) | **Contrato Assinado** | Documento legal com assinatura |
| 2 | **Decisão Registrada** | Decisão formal documentada no ClickUp/SagB |
| 3 | **Dado do CRM** | Registro oficial no sistema de CRM |
| 4 | **Cofre** | Documento armazenado no cofre oficial |
| 5 | **Transcrição Original** | Áudio transcrito sem edição |
| 6 (menor) | **Resumo de Chat** | Resumo processado por IA |

## Regras de aplicação

1. Fonte de maior prioridade **sobrescreve** fonte de menor prioridade.
2. Conflito entre fontes do **mesmo nível** resolve-se pela mais recente.
3. Ausência de fonte obrigatória deve ser tratada como **lacuna**, não como fato.
4. Toda decisão crítica deve ter no mínimo **2 fontes independentes** para ser validada.

## Exemplos

| Conflito | Resolução |
|----------|-----------|
| Contrato diz X, CRM diz Y | Contrato (prioridade 1) prevalece |
| Decisão registrada diz A, resumo de chat diz B | Decisão registrada (prioridade 2) prevalece |
| Duas decisões registradas conflitantes | A mais recente prevalece |

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-02-PROC | Yuri Sague | Registro de decisões |
| DM-05-AGT | Pierre | Agentes consumirem esta matriz |
| DM-00-GOV | Pietro | Governança da Central |

---

*Documento previsto — aguardando validação para canonização*
