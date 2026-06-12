# SagB by Loze | Decisões que precisam virar ADR

**Etapa:** ET-02  
**Status:** lista inicial para formalização.

---

| ADR | Decisão proposta | Motivo | Prioridade |
|---|---|---|---|
| ADR-001 | Adotar Central de Padrões como embrião do Loze Docs | Já existe estrutura, docs e módulo | alta |
| ADR-002 | Manter arquitetura de módulos plugáveis como padrão LOZE-DEV | Evita recriação e organiza evolução | alta |
| ADR-003 | Preservar Golden Seal como legado protegido | Reduz risco em SystemicVision e Management | alta |
| ADR-004 | Definir modelo único de `module-doc.ts` LOZE-DAS | Hoje há formatos variados | alta |
| ADR-005 | Instituir Quarentena Técnica antes de limpeza | Evita remoção acidental de itens em uso | alta |
| ADR-006 | Definir classificação oficial de módulos | Necessário para priorizar roadmap | alta |
| ADR-007 | Separar conceito de tab interna e rota URL | Evita bugs em navegação e registry | média |
| ADR-008 | Padronizar ids de módulos novos | Evita mistura snake/kebab/camel | média |
| ADR-009 | Definir Quadro de Elite como fonte única de agentes | Evita duplicidade em agentes comerciais/núcleo | alta |
| ADR-010 | Definir política Supabase por workspace/owner | Risco de policies permissivas | alta |
| ADR-011 | Definir tratamento de localStorage sensível | Hub e configs podem expor dados | alta |
| ADR-012 | Formalizar status lab para módulos experimentais | Evita confundir mock com produção | média |

## Próxima ação recomendada

Criar arquivos ADR individuais apenas após aprovação explícita da ET-03 ou ET-04, começando por ADR-001, ADR-002, ADR-003 e ADR-010.
