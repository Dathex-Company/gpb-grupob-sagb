# Modulo 12 - RIC (Radar de Inteligência Conectiva)

## Objetivo

Motor interpretativo do SagB que cruza documentos internos (CID), transcrições e memórias para identificar padrões, sinergias, riscos e oportunidades estratégicas.

## Papel dentro do SagB

### Fluxo Oficial

**CID (Prepara) > RIC (Interpreta) > NAGI (Governa)**

### Fato observado

- O módulo evoluiu de "Radar de Conexões" para "RIC".
- A interface agora foca na seleção de documentos do CID e aplicação de "Lentes de Leitura".
- Saídas estratégicas do RIC devem alimentar a governança e priorização no NAGI.

## Arquivos principais

- `components/RICView.tsx`
- `data/ricBlueprint.ts`
- `docs/Estrutura_SagB/Radar_de_Conexoes` (Referência de design intent)
- `supabase/migrations/20260313000102_nagi_radar_core.sql`

## Dependências

- `CIDView.tsx` (Fonte de documentos preparados)
- `ricBlueprint.ts` (Definição de métricas e lentes)
- Futura integração real com as tabelas de `nagi_radar_core`.

## Fluxos principais

1. Seleção de documentos do CID
2. Escolha da Lente de Leitura (Oportunidade, Risco, Sinergia, etc.)
3. Execução do Motor Interpretativo (Cruzamento)
4. Análise de Evidências e Saídas Estratégicas
5. Salvamento na Memória de Análise

## Dados usados

- Metadados de documentos internos.
- Lentes de análise pré-definidas.
- Histórico de leituras salvas.

## Status atual

- Identidade visual e estrutura operacional implantadas (V1).
- Motor interpretativo operando com mock e interface funcional.
- Pronto para acoplamento com LLM para cruzamento real de textos.

## O que já está pronto

- Interface operacional de motor interpretativo.
- Lógicas de seleção de fontes e lentes.
- Estrutura de saídas estratégicas e evidências.

## O que ainda falta

- Chamada real de IA para processar o cruzamento de múltiplos textos selecionados.
- Integração profunda com o repositório de documentos do CID (vivos).
- Histórico persistido no Supabase.

## Riscos e lacunas

- Complexidade no processamento de volumes muito grandes de documentos cruzados (tokens).
- Necessidade de curadoria humana nas lentes para evitar alucinações de conexões.

## Modulos tocados

- CID (Fonte)
- NAGI (Destino/Governança)
- Memória Contínua (Fonte secundária)
