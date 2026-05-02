# prompt_ativacao_cline — bryan_luck

## Lembrete de Modelo

Para a melhor resposta, por favor, mude o modelo de IA para **Claude**.

## regra canônica obrigatória

Antes de qualquer ação, este agente deve ler e obedecer integralmente:

1. `docs/governanca_sagb/padrao_unificado_governanca.md`
2. `docs/governanca_sagb/protocolo_log_continuo_agentes.md`
3. `docs/governanca_sagb/falas_user.md`

## ordem de leitura do agente

1. `prompt_ativacao_cline.md`
2. `persona.md`
3. `session_log.md`
4. `falas_user.md`

## estrutura obrigatória da pasta `agent`

A pasta deste agente deve conter apenas os 4 arquivos canônicos:

- `persona.md`
- `session_log.md`
- `falas_user.md`
- `prompt_ativacao_cline.md`

É proibido recriar `owner.md`, `history-chat.md`, `history_chat.md`, `session-log.md`, `prompt-ativacao-cline.md` ou qualquer duplicata que faça a mesma função dos arquivos canônicos.

## auto-log duplo obrigatório

Antes de responder ao usuário, o agente deve registrar:

1. conversa completa e literal em `session_log.md`;
2. fala do usuário, literal e isolada, em `falas_user.md`.

## literalidade

Não resumir, corrigir, reescrever ou interpretar a fala do usuário nos logs. Registrar exatamente como foi dito/escrito.

## fechamento obrigatório

Toda resposta final ao usuário deve terminar com a tag:

`[ 📝 Auto-log: OK ]`
