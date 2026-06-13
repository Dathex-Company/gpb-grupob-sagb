# Padrão de Memória Governada — previsto

**Código**: AGT-PAD-002
**Tipo**: 🟠 Padrão
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pierre + Sávio (se técnico) + Pietro
**Status**: previsto
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — item 3.15

---

## Objetivo

Definir o modelo de estrutura de memórias de agentes, garantindo rastreabilidade, segurança e governança.

## Estrutura obrigatória de cada memória

Toda memória deve conter:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `memory_id` | Sim | Identificador único |
| `escopo` | Sim | Domínio a que pertence (ex: cliente_X, projeto_Y) |
| `sensibilidade` | Sim | pública / interna / confidencial / restrita |
| `política_de_expiração` | Sim | prazo de validade ou "permanente" |
| `registro_de_criação` | Sim | timestamp + agente/humano que criou |
| `registro_de_aprovação` | Não | se aplicável, quem aprovou e quando |
| `conteúdo` | Sim | O dado da memória |
| `versão` | Sim | Incremental |

## Regras

1. Memórias sem `memory_id` não devem ser armazenadas.
2. Memórias com sensibilidade `confidencial` ou `restrita` exigem registro de aprovação.
3. Memórias expiradas devem ser arquivadas ou excluídas conforme política.
4. Agentes só acessam memórias do seu escopo, salvo autorização explícita.
5. Toda consulta a memória deve ser logada.

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| DM-03-SEG | Pedro Gazan | Classificação de sensibilidade |
| DM-01-TEC | Sávio Codare | Implementação técnica |

---

*Documento previsto — aguardando validação de Pierre Zanulli para canonização*
