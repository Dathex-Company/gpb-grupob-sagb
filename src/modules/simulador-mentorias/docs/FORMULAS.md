# Fórmulas — Simulador de Mentorias

Fonte: documento técnico de origem em `99-curadoria/01-em-analise/`.

## Implementadas no MVP

- Receita principal bruta.
- Receita de upsell.
- Receita bruta total.
- Perdas por reembolso.
- Taxas de pagamento.
- Impostos.
- Receita líquida.
- Custos fixos, variáveis e percentuais.
- Custo total.
- Resultado operacional com e sem upsell.
- Margem operacional.
- ROI.
- ROAS.
- CAC pago.
- Ticket médio.
- Ocupação.
- Ponto de equilíbrio.
- Leads necessários.
- Planejado versus realizado.

## Observação técnica

Valores monetários trafegam em centavos no front-end para evitar erro de formatação e reduzir risco de ponto flutuante na UI. Persistência definitiva deve usar `numeric` no PostgreSQL.
