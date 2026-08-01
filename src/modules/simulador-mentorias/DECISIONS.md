# Decisões — Simulador de Mentorias

## DEC-001 — Motor puro antes da persistência

O MVP implementa primeiro o motor determinístico e testável, sem depender de Supabase, seguindo a ordem recomendada no documento técnico.

## DEC-002 — UI sem fórmulas

A página consome resultados calculados por `services/calculationEngine.ts`. Fórmulas não ficam espalhadas nos componentes.

## DEC-003 — Dados mockados no MVP

Enquanto migrations, RLS e repositories não forem aprovados/aplicados, o módulo usa `data/defaultSimulation.ts` como entrada controlada para validação visual e funcional.

## DEC-004 — Registro como módulo plugável independente

O simulador foi registrado no registry global como módulo plugável independente. A integração profunda em `/nide/mentorias/:mentoriaId/simulacoes` fica planejada para etapa seguinte porque altera navegação interna do domínio NIDE/Mentorias.
