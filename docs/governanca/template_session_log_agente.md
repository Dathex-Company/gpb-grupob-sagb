# Template — Session Log de Agente

Use este modelo para novos agentes e módulos.

```md
# Session Log — <nome-do-agente>

Log contínuo e incremental da conversa do agente.

## Regras do arquivo

- Registrar cada turno da conversa em ordem cronológica.
- Nunca depender de encerramento de sessão para salvar.
- Usar os autores `usuario` e `<identificador-do-agente>`.

## Modelo de registro

## 2026-04-10 17:39
**usuario:** mensagem do usuário

## 2026-04-10 17:39
**<identificador-do-agente>:** resposta do agente
```
