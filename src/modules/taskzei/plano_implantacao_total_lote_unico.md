# Plano de Implantação Total — TaskZei (Lote Único)

## Objetivo

Executar em um único ciclo as frentes de maior impacto operacional do TaskZei sem depender do destravamento financeiro da FASE 2 (Supabase dedicado).

## Escopo deste lote

1. Home com dados reais do módulo
2. Health check periódico + status operacional
3. Inbox inbound operacional via Hub
4. Atualização de handoff/governança

## Ondas de execução

### Onda 1 — Base operacional
- Home: trocar KPIs mock por cálculo real (`metricsService` + stores)
- Carregamento inicial de tasks, meetings e inbox

### Onda 2 — Confiabilidade
- Health check a cada 60s
- Registro de sucesso/erro no `monitorService`
- Alertas de latência para degradação de provider

### Onda 3 — Inbox inbound
- Auto-refresh ao receber `hub:inbound-message`
- Filtro rápido para itens inbound (`whatsapp`/`email`)
- Contador de pendências inbound

### Onda 4 — Governança
- Atualizar handoff para refletir estado atual (Hub operacional)
- Manter trilha de decisão e sessão alinhada

## Critérios de aceite

- Home exibe métricas reais (sem cards fixos)
- Monitor indica saúde com atualização periódica
- Inbox reage a entrada do Hub sem refresh manual obrigatório
- Handoff atualizado com status real das integrações

## Fora de escopo deste lote

- Migração para Supabase dedicado (depende de dono financeiro)
- Build standalone e CI/CD independente
- Marketplace de integrações

