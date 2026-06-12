# Runbook — Central de Padrões V1

## Acesso

Abrir `/central_padroes` no SagB.

Produção: https://sagb.grupob.com.br

## Como criar um padrão

1. Abrir Biblioteca de Padrões.
2. Clicar em **Novo Padrão**.
3. Preencher chave, tipo, título, owner, área, resumo e conteúdo.
4. Salvar e validar toast de sucesso.

## Como solicitar aprovação

1. Na Biblioteca de Padrões, clicar em **Aprovar**.
2. Abrir **Aprovações e Revisões**.
3. Analisar a solicitação.
4. Aprovar ou rejeitar com notas.

## Como fazer deploy

1. Executar `npm run build`.
2. Executar `npx netlify deploy --prod --dir=dist`.

## Como aplicar rollback

1. Reverter commit do bloco afetado.
2. Rodar build.
3. Reaplicar deploy.
4. Se necessário, usar scripts `.rollback.sql` manuais para tabelas complementares.

## Como verificar saúde

- Dashboard carrega métricas.
- Busca retorna resultados.
- Modo Dev > Triagem carrega fila.
- Relacionamentos renderiza grafo.
- Aprovações lista pendências ou estado vazio.

## Responsáveis

- Governança: Pietro Carboni.
- Sistemas: Sávio Codare.
- Segurança: Pedro Gazan.
- Agentes: Pierre Zanulli.

## Validação rápida

1. Conferir dashboard.
2. Abrir Biblioteca de Padrões.
3. Abrir Modo Dev.
4. Abrir Modo Agente.
5. Abrir Publicador legado e confirmar que `governance_rules` segue disponível.

## Fallback

Se Supabase estiver indisponível, o portal usa dados locais em `data/fallbackData.ts`.
