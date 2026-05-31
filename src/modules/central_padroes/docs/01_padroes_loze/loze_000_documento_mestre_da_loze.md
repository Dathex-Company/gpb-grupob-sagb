# LOZE-000 | Documento Mestre da Loze

**Tipo:** documento canônico institucional  
**Status geral:** em validação

---

## 1. Objetivo do documento

Definir a base institucional da Loze como camada oficial de tecnologia aplicada do GrupoB, estabelecendo fronteiras de atuação, governança documental e relação com sistemas como SagB by Loze.

## 2. O que é a Loze

- **Definido:** Loze é a casa oficial de tecnologia aplicada do GrupoB.
- **Definido:** Loze organiza produto, engenharia, documentação canônica e evolução de sistemas.
- **Em validação:** escopo final de serviços públicos versus escopo interno por conta.

## 3. Por que a Loze assume a tecnologia do GrupoB

- **Definido:** reduzir dispersão de padrões técnicos.
- **Definido:** consolidar documentação e governança.
- **Definido:** preservar histórico e acelerar evolução por reutilização.

## 4. O que acontece com a Dathex

- **Definido:** Dathex passa a ser legado técnico e histórico de origem.
- **Definido:** artefatos Dathex relevantes não devem ser apagados sem validação.
- **Pendente de decisão:** política formal de arquivamento e nomenclatura final de legado.

## 5. O que a Loze governa

- padrões canônicos;
- arquitetura de sistemas;
- documentação técnica oficial;
- processo de evolução modular;
- governança de decisões estruturais (ADR);
- política de quarentena técnica antes de limpeza.

## 6. Relação entre Loze, GrupoB, empresas atendidas e produtos digitais

- **Loze:** camada técnica e de produto.
- **GrupoB:** guarda-chuva estratégico e operacional.
- **Conta Interna:** vínculo de relacionamento/entrega para cada frente.
- **Empresa atendida:** uso diário da operação e execução no contexto de negócio.

## 7. Separação oficial

- **Produto** = o que a Loze constrói.
- **Conta Interna** = para quem a Loze entrega.
- **Operação da empresa** = como a empresa usa.

## 8. Regra prática oficial

- **Definido:** Código fica na Loze.
- **Definido:** Relacionamento fica na Conta Interna.
- **Definido:** Uso diário fica na empresa atendida.

## 9. Onde ficam os principais artefatos

| Artefato | Onde fica | Status |
|---|---|---|
| Código | Repositórios de produto da Loze | definido |
| Documentação técnica | repo + Central de Padrões/Loze Docs | definido |
| Padrões canônicos | `src/modules/central_padroes/docs/01_padroes_loze/` | definido |
| Escopo | Conta Interna + artefato de produto | em validação |
| Demanda | Conta Interna / gestão operacional | em validação |
| SLA | Conta Interna | em validação |
| Suporte | Conta Interna + operação | em validação |
| Reuniões internas | Conta Interna e/ou empresa atendida | em validação |
| Decisões internas | ADR e registros decisórios | definido |
| Incidentes | runbooks, logs e gestão operacional | em validação |
| ADRs | pasta de decisões da Central de Padrões | definido |
| Legado Dathex | repositórios e docs legados referenciados | definido |

## 10. Lista inicial de documentos canônicos da Loze

- LOZE-000 (este documento)
- Matriz Onde Mora
- Revisão 04 de padrões técnicos
- LOZE-GOV
- LOZE-OPP
- Template LOZE-DAS para `module-doc.ts`

## 11. Papéis e aprovações

| Papel | Responsável | Status |
|---|---|---|
| Direção estratégica | Kane | em validação |
| Engenharia consultiva | Cássio | definido |
| Coordenação técnica | Pedro Nassar | em validação |
| Arquitetura técnica | Sávio | em validação |
| Organização estrutural | Pietro | em validação |
| UI/UX e linguagem visual | Alice | em validação |
| Produto/operação | Pedro Gazan | em validação |

## 12. Fontes oficiais dos documentos

| Fonte | Papel | Status |
|---|---|---|
| GitHub/repositório | fonte técnica oficial versionada | definido |
| QG Loze | governança e contexto operacional | em validação |
| Canva/Lousa | material de apoio visual | sugestão |
| Drive | suporte documental complementar | em validação |
| TaskZei/ClickUp | gestão de execução e backlog | em validação |

## 13. Relação com SagB by Loze

- **Definido:** SagB by Loze é plataforma reaproveitada/evoluída sob padrões Loze.
- **Definido:** Central de Padrões do SagB é embrião do Loze Docs.

## 14. Relação com Loze Docs

- **Definido:** Loze Docs é a central documental canônica.
- **Dúvida:** nome final de exposição (Loze Docs vs Central de Padrões) para comunicação externa.

## 15. O que já está definido

1. Loze como camada oficial de tecnologia.
2. Dathex como legado técnico.
3. Separação Produto / Conta Interna / Operação.
4. Regra: Código na Loze; relacionamento na Conta Interna; uso diário na empresa.
5. Decisão estrutural vira ADR.

## 16. O que ainda precisa validação

1. Estrutura final de pastas corporativas.
2. Política de precedência completa entre artefatos.
3. Workflow de aprovação por papel.
4. Política oficial de incidentes e observabilidade.

## 17. Próximos documentos a criar

1. ADR de oficialização da Loze como camada técnica.
2. ADR da regra Produto/Conta Interna/Operação.
3. ADR de governança documental e precedência.
4. Checklist operacional de publicação de padrão canônico.

