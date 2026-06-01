# Plano: Construção do Documento "Central de Padrões por 18 Agentes"

> Este documento descreve **como** vou estruturar o documento executivo final que divide toda a implantação da Central de Padrões pelos 18 agentes da Sala Dev (CA-01 a CA-18).

---

## 1. Objetivo do documento final

Criar um **plano executivo completo** que qualquer executor (Cássio) possa ler e saber **exatamente**:

- **Quem** faz o quê (qual agente CA)
- **Quando** faz (qual ET e em que ordem)
- **O que** cria (arquivos, componentes, migrations, services)
- **Para quem** entrega (próximo agente na esteira)
- **O que** valida (checklist por etapa)
- **O que** precisa receber para começar (dependências)

---

## 2. Estrutura do documento final

```
CENTRAL DE PADRÕES — PLANO EXECUTIVO POR 18 AGENTES DA ESTEIRA SALA DEV
│
├── 0. CAPA E OVERVIEW
│   ├── Mapa visual da esteira
│   ├── Matriz resumo: agente → ET → entregável principal
│   ├── Regras gerais de execução
│   └── Glossário de cores/códigos
│
├── 1. BLOCO 1 — ENTRADA E ORGANIZAÇÃO (ET preliminar)
│   ├── CA-01 Orquestrador Técnico
│   ├── CA-18 Guardião de Reaproveitamento
│   └── CA-13 Catálogo Técnico
│
├── 2. BLOCO 2 — ARQUITETURA E DOCUMENTAÇÃO (ET-03 e ET-04)
│   ├── CA-02 Arquiteto de Sistemas
│   ├── CA-03 Documentação Técnica
│   └── CA-16 UX/UI Técnico
│
├── 3. BLOCO 3 — CONSTRUÇÃO TÉCNICA (ET-06)
│   ├── CA-06 Database Engineer  ─── Migration SQL
│   ├── CA-05 Backend Engineer   ─── Services/Repository
│   ├── CA-04 Frontend Engineer  ─── Páginas/Componentes
│   ├── CA-07 Integrations Eng.  ─── APIs/Webhooks
│   └── CA-14 Agentes/MCPs       ─── Automações
│
├── 4. BLOCO 4 — SEGURANÇA E QUALIDADE (ET-07)
│   ├── CA-08 Segurança Técnica
│   ├── CA-15 Revisor de Código
│   ├── CA-10 QA / Testes
│   └── CA-11 Logs e Observabilidade
│
├── 5. BLOCO 5 — DEPLOY E OPERAÇÃO (ET-08)
│   ├── CA-12 Versionamento Técnico
│   ├── CA-09 DevOps / Deploy
│   └── CA-17 Operação e Runbooks
│
├── 6. AUDITORIA FINAL
│   ├── CA-01 Orquestrador (retorna)
│   ├── CA-03 Documentação (fecha docs)
│   ├── CA-08 Segurança (valida final)
│   ├── CA-10 QA (parecer final)
│   └── CA-15 Revisor (parecer final)
│
└── 7. APÊNDICES
    ├── A. Dependências entre agentes
    ├── B. Ordem de execução linear
    ├── C. Sumário de artefatos por agente
    └── D. Checklist de validação final
```

---

## 3. Template de cada seção de agente

Cada agente terá UMA seção com este formato padronizado:

```markdown
### CA-NN — Nome do Agente

| Campo | Valor |
|---|---|
| **ET** | ET-0X |
| **Bloco** | Nome do Bloco |
| **Depende de** | CA-XX, CA-YY |
| **Entrega para** | CA-ZZ |
| **Input** | O que recebe para começar |
| **Output** | O que produz ao terminar |

#### O que este agente constrói na Central de Padrões

[Lista de arquivos/componentes/services que cria]

| Arquivo | Ação | Descrição |
|---|---|---|
| `caminho/arquivo.ts` | Criar/Modificar | O que faz |

#### Regras específicas deste agente

[Se houver regras especiais]

#### Checklist de validação do agente

- [ ] Item 1
- [ ] Item 2

#### Artefatos que entrega

[Cada arquivo que este agente gera]
```

---

## 4. Critério de distribuição das tarefas entre os 18 agentes

| Tarefa do Plano Diretor | Agente responsável (18) | Justificativa |
|---|---|---|
| Migration SQL com 19 tabelas | **CA-06** Database Engineer | É o especialista em banco |
| Seeds de áreas, responsáveis, padrões | **CA-06** Database Engineer | Faz parte da migration |
| Layout + Sidebar + 17 páginas | **CA-04** Frontend Engineer | É o construtor de interface |
| Tipos TypeScript fortes | **CA-04** Frontend Engineer + **CA-05** Backend Engineer | Cada um cuida dos seus tipos |
| Repository Pattern + Interface | **CA-05** Backend Engineer | Camada de lógica |
| Services por entidade | **CA-05** Backend Engineer | Regras de negócio |
| Hooks e Store | **CA-05** Backend Engineer | Integração front/back |
| Hooks de UI | **CA-04** Frontend Engineer | Estados visuais |
| Componentes reutilizáveis | **CA-04** Frontend Engineer | Design system |
| Fallback local | **CA-05** Backend Engineer + **CA-06** Database Engineer | Resiliência |
| Adapter governance_rules | **CA-05** Backend Engineer + **CA-13** Catálogo Técnico | Compatibilidade legado |
| RLS Policies | **CA-08** Segurança Técnica + **CA-06** Database Engineer | Segurança de dados |
| Buckets Storage | **CA-06** Database Engineer + **CA-07** Integrations Engineer | Infra de arquivos |
| Netlify function governance-sync-doc | **CA-07** Integrations Engineer | Integração externa |
| Deploy automático | **CA-09** DevOps Engineer | Publicação |
| Versionamento Git | **CA-12** Versionamento Técnico | Controle de versão |
| Revisão de código | **CA-15** Revisor de Código | Qualidade do código |
| Testes e QA | **CA-10** QA Reviewer | Validação funcional |
| Segurança e RLS | **CA-08** Segurança Técnica | Auditoria de segurança |
| Logs e observabilidade | **CA-11** Logs e Observabilidade | Rastreabilidade |
| Documentação técnica | **CA-03** Documentação Técnica | ADRs, changelog, README |
| UX e fluxos | **CA-16** UX/UI Técnico | Experiência do usuário |
| Catálogo de módulos existentes | **CA-13** Catálogo Técnico | Reaproveitamento |
| Verificação de duplicidade | **CA-18** Guardião de Reaproveitamento | Evitar retrabalho |
| Automação de triagem | **CA-14** Agentes/MCPs | Ingestão automatizada |
| Runbook operacional | **CA-17** Operação e Runbooks | Manual de uso |
| Coordenação geral | **CA-01** Orquestrador Técnico | Fluxo e handoffs |

---

## 5. Ordem de escrita (sequência de seções)

1. **Overview geral** — visão de quem faz o quê
2. **CA-01 Orquestrador** — coordenação
3. **CA-18 Guardião** — verificação prévia
4. **CA-13 Catálogo** — inventário
5. **CA-02 Arquiteto** — desenho técnico
6. **CA-16 UX/UI** — fluxos e telas
7. **CA-03 Documentação** — docs iniciais
8. **CA-06 Database** — migration e seeds
9. **CA-05 Backend** — services e repository
10. **CA-04 Frontend** — páginas e componentes
11. **CA-07 Integrations** — APIs e webhooks
12. **CA-14 Agentes/MCPs** — automação
13. **CA-08 Segurança** — RLS e políticas
14. **CA-15 Revisor** — code review
15. **CA-10 QA** — testes e validação
16. **CA-11 Logs** — observabilidade
17. **CA-12 Versionamento** — Git/release
18. **CA-09 DevOps** — deploy
19. **CA-17 Operação** — runbook
20. **Auditoria final** — fechamento
21. **Apêndices** — dependências, ordem, sumário

---

## 6. Diferenciais do documento final

1. **Cada seção é independente** — um executor pode pegar apenas a seção de um agente e executar
2. **Templates de código** incluídos em cada seção — não apenas "crie o service", mas exemplos de código
3. **Dependências explícitas** — cada agente sabe exatamente quem precisa esperar
4. **Checklists por agente** — cada um tem sua própria validação
5. **Artefatos rastreáveis** — tudo que cada agente gera
6. **Ordem de execução linear** no apêndice para execução sequencial
7. **Mapeamento direto com o Plano Diretor original** — cada seção referencia as seções do documento de Pietro

---

## 7. Formato e tamanho estimado

| Item | Estimativa |
|---|---|
| Total de seções de agente | 18 |
| Total de páginas (estimado) | 60-80 páginas |
| Total de arquivos de código referenciados | ~80 |
| Total de artefatos gerados | ~100 (código + docs + specs) |
| Nível de detalhe | Profundo: cada linha de código relevante terá exemplo ou template |

---

## 8. Entrega final

O documento final será salvo em:
```
00_sagb/src/modules/sala-dev/plans/central_padroes_por_18_agentes_COMPLETO.md
```

E poderá ser lido por Cássio (ou qualquer executor) que:
1. Abre o documento
2. Vai na seção do agente atual
3. Lê o que precisa fazer
4. Executa
5. Marca o checklist
6. Avança para o próximo agente
