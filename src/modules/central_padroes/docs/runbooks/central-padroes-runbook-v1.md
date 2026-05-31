# Runbook — Central de Padrões V1

## Acesso

Abrir `/central_padroes` no SagB.

## Validação rápida

1. Conferir dashboard.
2. Abrir Biblioteca de Padrões.
3. Abrir Modo Dev.
4. Abrir Modo Agente.
5. Abrir Publicador legado e confirmar que `governance_rules` segue disponível.

## Fallback

Se Supabase estiver indisponível, o portal usa dados locais em `data/fallbackData.ts`.

