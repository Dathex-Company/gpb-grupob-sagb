# Simulador de Mentorias

Módulo plugável para simular viabilidade e resultado financeiro-comercial de mentorias.

## Objetivo

Permitir criar, comparar, aprovar e acompanhar simulações de turmas de mentoria com receita, custos, aquisição, upsells, ponto de equilíbrio, ROI, CAC, ROAS, alertas e planejado versus realizado.

## Conformidade técnica

- Padrão de módulos plugáveis: TEC-PAD-003.
- UI: Loze UI Ultra Clean com Rubik, superfícies neutras, sombras suaves, raios amplos e ausência de bordas visíveis.
- Referência visual adotada: Ultra Clean Gradient Sidebar.
- Motor de cálculo puro em `services/calculationEngine.ts`.
- UI sem fórmulas de negócio.

## Status

MVP funcional local com dados mockados e motor determinístico. Persistência Supabase, RLS, snapshots reais e exportação ficam planejados para etapas seguintes.

## Rota

`/simulador-mentorias`
