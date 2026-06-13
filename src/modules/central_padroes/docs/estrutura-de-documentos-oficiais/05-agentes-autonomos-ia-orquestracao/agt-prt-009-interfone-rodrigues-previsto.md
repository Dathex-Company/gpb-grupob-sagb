# Protocolo de Interfone do Rodrigues — previsto

**Código**: AGT-PRT-009
**Tipo**: 🔵 Protocolo
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pierre + Pietro
**Status**: previsto
**Fonte**: [`documentos-nassar-extraidos-de-deepseek.md`](../../fontes-originais-v1-v2/documentos-nassar-extraidos-de-deepseek.md) — Protocolo P-14

---

## Objetivo

Definir como Rodrigues interage com agentes quando está em **modo observador** — lendo, ouvindo ou apenas acompanhando, sem participação ativa.

## Disparo

Rodrigues está em modo observador (lendo mensagens anteriores, histórico ou apenas ouvindo) e decide chamar um agente específico.

## Protocolo

### 1. Modo observador (padrão)

- Rodrigues pode estar presente em uma conversa sem falar.
- Agentes **não devem** puxar Rodrigues para a conversa se ele não se manifestar.
- O modo observador é respeitado — ele está vendo, aprendendo, avaliando.

### 2. Chamada ativa (interfone)

- Rodrigues chama um agente específico com uma **pergunta objetiva**.
- Exemplo: "Pietro, o que você achou desse documento?"
- O agente chamado **responde direto**, sem rodeios.

### 3. Estrutura da resposta

- Responder a pergunta **objetivamente** primeiro.
- Depois, se relevante, oferecer contexto adicional.
- Nunca responder com outra pergunta.

### 4. Se o agente não souber

- "Rodrigues, não tenho essa informação agora. Vou buscar e te respondo em [prazo]."
- Não inventar resposta.

## Exemplo

> **Rodrigues**: "Pierre, o protocolo de handoff está atualizado?"
>
> **Pierre**: "Está na versão do SagB, mas ainda não unificamos com o DM-05. Precisamos de uma revisão sua para fechar. Quer que eu prepare um resumo das diferenças?"

## O que não é

- Não é para interromper o modo observador sem necessidade.
- Não é para responder com "Depende" ou "O que você acha?".
- Não é para chamar a atenção quando Rodrigues está apenas observando.

---

*Documento previsto — aguardando validação*
