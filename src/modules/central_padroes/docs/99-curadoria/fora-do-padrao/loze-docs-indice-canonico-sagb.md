# SagB by Loze | Loze Docs | Índice canônico inicial

**Etapa:** ET-02  
**Origem:** auditoria ET-01 em `plans/sagb-et-01-auditoria-geral-sistema-modulos-documentacao.md`  
**Status:** base inicial criada para documentação canônica  
**Regra:** antes de construir, verificar o que já existe.

---

## 1. Função deste índice

Este documento é o índice inicial do Loze Docs para o SagB by Loze. Ele não substitui os documentos existentes; organiza o ponto de entrada canônico para auditoria, evolução e decisão técnica.

## 2. Documentos canônicos da ET-02

| Documento | Função | Caminho |
|---|---|---|
| Índice canônico | Ponto de entrada da documentação SagB by Loze | `src/modules/central_padroes/docs/loze-docs-indice-canonico-sagb.md` |
| Matriz de módulos | Classificação oficial inicial dos módulos | `src/modules/central_padroes/docs/matriz-canonica-modulos-sagb.md` |
| Matriz de rotas e tabs | Mapa de navegação e rotas declaradas | `src/modules/central_padroes/docs/matriz-rotas-tabs-sagb.md` |
| Inventário Supabase | Tabelas, buckets e riscos por domínio | `src/modules/central_padroes/docs/inventario-supabase-sagb.md` |
| Inventário Netlify Functions | Funções serverless por domínio | `src/modules/central_padroes/docs/inventario-netlify-functions-sagb.md` |
| Arquitetura de módulos plugáveis | Como o sistema modular funciona hoje | `src/modules/central_padroes/docs/arquitetura-modulos-plugaveis-sagb.md` |
| Modelo LOZE-DAS de module-doc | Template padrão de documentação viva por módulo | `src/modules/central_padroes/docs/modelo-module-doc-loze-das.md` |
| Quarentena Técnica | Itens suspeitos, duplicados, legados ou sensíveis | `src/modules/central_padroes/docs/QUARENTENA_TECNICA.md` |
| Decisões para ADR | Decisões estruturais pendentes | `src/modules/central_padroes/docs/decisoes-para-adr-et-02.md` |

## 3. Camadas Loze aplicadas ao SagB

| Camada | Papel no SagB |
|---|---|
| Loze | Camada oficial de tecnologia, documentação, governança e evolução. |
| SagB by Loze | Plataforma existente aproveitada e evoluída sob padrões Loze. |
| LOZE-DAS | Documentação de sistemas, módulos, decisões, riscos e contratos. |
| LOZE-OPP | Organização de pastas, produtos, empresas, QGs e domínios. |
| LOZE-DEV | Padrões técnicos de módulo, registry, Supabase, serverless, testes e deploy. |

## 4. Fontes existentes que continuam válidas

| Fonte | Uso recomendado |
|---|---|
| `README.md` | Visão geral e instruções de execução/deploy. |
| `DEV_LOG.md` | Histórico executivo de evolução. |
| `docs/` | Documentos técnicos gerais já existentes. |
| `plans/` | Planos, auditorias, handoffs e histórico tático. |
| `src/modules/*/module-doc.ts` | Documentação viva por módulo. Deve ser padronizada. |
| `src/modules/central_padroes/docs/` | Local canônico da documentação Loze Docs dentro do SagB. |
| `_qgs/` | Governança e documentos específicos de QGs/empresas. |

## 5. Regras de continuidade

1. Não criar módulo novo sem consultar registry, docs, migrations, rotas, tabelas, services e módulos semelhantes.
2. Não remover arquivos classificados em Quarentena Técnica sem validação explícita.
3. Não alterar Golden Seal sem aprovação formal.
4. Toda decisão estrutural deve virar ADR antes de execução técnica relevante.
5. Todo módulo deve possuir `manifest.ts`, `routes.tsx` quando plugável e `module-doc.ts` no padrão LOZE-DAS.

## 6. Próxima etapa recomendada

Executar ET-03 com foco em normalização documental do registry e dos `module-doc.ts`, sem refatorar regra de negócio.
