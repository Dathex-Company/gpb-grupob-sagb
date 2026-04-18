# Protocolo de Log Contínuo de Agentes — SagB

## Objetivo

Estabelecer o padrão oficial de registro contínuo de conversa para agentes do SagB, garantindo rastreabilidade operacional tanto em interações de planejamento quanto de execução.

## Regra oficial

Todo agente deve manter **log contínuo, incremental e cronológico** da conversa.

Isso significa registrar:

1. a fala do usuário
2. a resposta do agente
3. a fala seguinte do usuário
4. a resposta seguinte do agente

Sem depender de encerramento de sessão.

## Aplicação

O padrão vale para:

- interações em modo de planejamento
- interações em modo de execução
- agentes de módulo
- agentes operacionais especializados

## Estrutura padrão por agente/módulo

Cada agente ou módulo deve possuir:

- `agent/persona.md` com referência explícita ao protocolo
- `prompt-ativacao-cline.md` com obrigação operacional de log
- `agent/session-log.md` como arquivo oficial de registro contínuo

## Formato mínimo por turno

Cada entrada deve conter:

- timestamp
- autor (`usuario` ou identificador do agente)
- conteúdo da mensagem

Exemplo:

```md
## 2026-04-10 17:39
**usuario:** quero estruturar uma receita de vídeo para anúncio de 30s

## 2026-04-10 17:39
**jhonel-videoli:** vamos organizar briefing, estilo e provider ideal
```

## Observação técnica importante

Este protocolo define a **obrigação documental e operacional** dos agentes.

Ele **não substitui**, por si só, mecanismos sistêmicos de persistência automática.

Ou seja:

- a regra é obrigatória do ponto de vista de governança
- a automação confiável do registro pode exigir evolução técnica adicional no produto

## Convenção recomendada de arquivo

Para módulos:

- `src/modules/<modulo>/agent/session-log.md`

Para outras estruturas especializadas, a convenção deve preservar:

- proximidade com a persona do agente
- rastreabilidade por módulo
- leitura humana simples

## Critério de aderência

Um agente só está plenamente aderente a este protocolo quando possuir:

- persona com regra de log contínuo
- prompt de ativação com obrigação explícita de registro
- arquivo `session-log.md` criado e pronto para uso
