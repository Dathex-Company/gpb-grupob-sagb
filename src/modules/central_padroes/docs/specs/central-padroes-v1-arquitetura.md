# Especificação — Arquitetura Central de Padrões V1

## Camadas

1. UI Portal — sidebar com áreas de governança.
2. Repository — `centralPadroesRepository` combinando Supabase legado e fallback.
3. Dados — fallback local + futuro schema `central_padroes_*`.
4. Legado preservado — `governance_rules` e publicador existente.

## Critério de compatibilidade

Nenhuma tela V1 depende exclusivamente da migration nova para renderizar.

