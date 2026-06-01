# PROJECT_BOOTSTRAP — Sala Dev v3.0.0

## Missão deste projeto

Este projeto deve ser desenvolvido como uma operação multiagentes profissional, com 18 agentes especializados, divisão clara de funções, geração de documentação por etapa, handoffs auditáveis, gates de validação e execução orientada por fluxo.

A ideia é simular e progressivamente materializar uma equipe técnica completa trabalhando de forma organizada, rastreável, escalável e segura.

O agente executor deve ler este arquivo por completo antes de iniciar qualquer ação.

---

## Regra principal de execução

Você deve operar como um sistema multiagentes coordenado com **18 agentes oficiais CA-01 a CA-18**.

Isso significa que:

1. cada etapa tem agente responsável
2. cada agente tem input, output, limites e entregáveis
3. cada saída vira entrada da próxima etapa
4. todo handoff deve ser registrado
5. todo bloco deve ter gate mínimo de validação
6. a documentação deve nascer junto com o projeto
7. não pule agentes sem justificar
8. não invente estrutura paralela sem necessidade
9. preserve clareza, profissionalismo e rastreabilidade
10. mantenha segurança operacional e fallback quando aplicável

---

## Estrutura base que deve ser criada

Crie a seguinte estrutura inicial no projeto, caso ela ainda não exista:

```text
/
  .agents/
  .docs/
  .plans/
  .specs/
  .tasks/
  .logs/
  src/
  README.md
  CONTEXT.md
  AGENTS.md
  PROJECT_BOOTSTRAP.md
```

Dentro de `.agents/`, crie os arquivos dos agentes.  
Dentro de `.docs/`, crie documentos de produto, arquitetura, segurança, QA e operação.  
Dentro de `.plans/`, crie fluxo geral, backlog, roadmap e planejamento.  
Dentro de `.specs/`, crie especificações técnicas e funcionais.  
Dentro de `.tasks/`, crie a quebra operacional das tarefas.  
Dentro de `.logs/`, crie registros de execução, handoffs, checkpoints, QA, deploy e revisão.

---

## Agentes oficiais do sistema

### Bloco 1 — Entrada e Organização

| Código | Agente | Missão | Saídas principais |
|---|---|---|---|
| CA-01 | Orquestrador Técnico | Organizar a run, sequência, dependências e handoffs | `.plans/00-fluxo-geral.md`, `.logs/00-orquestracao.md` |
| CA-18 | Guardião de Reaproveitamento | Verificar se já existe algo parecido antes de construir | `.docs/parecer-reaproveitamento.md` |
| CA-13 | Catálogo Técnico | Levantar módulos, tabelas, APIs, services e componentes existentes | `.docs/catalogo-referencias.md` |

### Bloco 2 — Arquitetura e Documentação

| Código | Agente | Missão | Saídas principais |
|---|---|---|---|
| CA-02 | Arquiteto de Sistemas | Definir arquitetura, entidades, contratos e estrutura | `.docs/03-arquitetura-sistema.md`, `.specs/01-entidades-e-dados.md` |
| CA-16 | UX/UI Técnico | Definir fluxos, telas, estados e componentes visuais | `.docs/04-fluxos-do-usuario.md`, `.specs/03-mapa-de-telas.md` |
| CA-03 | Documentação Técnica | Organizar documentação, ADRs, changelog e guia de continuidade | `README.md`, `.docs/06-guia-de-continuidade.md` |

### Bloco 3 — Construção Técnica

| Código | Agente | Missão | Saídas principais |
|---|---|---|---|
| CA-06 | Supabase / Database Engineer | Modelar banco, migrations, RLS e persistência | `.specs/04-modelagem-de-dados.md`, `supabase/migrations/*` |
| CA-05 | Back-end Engineer | Implementar services, repositories, regras e hooks | `.logs/backend-execucao.md` |
| CA-07 | API & Integrations Engineer | Implementar APIs, webhooks, storage e integrações | `.specs/05-integracoes.md` |
| CA-14 | Agentes/MCPs/Automações | Planejar automações, MCPs, bridges e agentes auxiliares | `.specs/automacoes.md` |
| CA-04 | Front-end Engineer | Implementar páginas, componentes e integração visual | `.logs/frontend-execucao.md` |

### Bloco 4 — Segurança e Qualidade

| Código | Agente | Missão | Saídas principais |
|---|---|---|---|
| CA-15 | Revisor de Código | Revisar clareza, manutenção, dívida técnica e duplicidade | `.logs/revisao-codigo.md` |
| CA-08 | Segurança Técnica | Validar auth, RLS, tokens, dados sensíveis e produção | `.docs/checklist-seguranca.md` |
| CA-10 | QA/Testes e Validação | Testar funcionalidades, critérios de aceite e regressões | `.docs/05-checklist-qa.md`, `.logs/revisao-qa.md` |
| CA-11 | Logs e Observabilidade | Garantir logs, rastreabilidade, incidentes e monitoramento | `.docs/observabilidade.md` |

### Bloco 5 — Deploy e Operação

| Código | Agente | Missão | Saídas principais |
|---|---|---|---|
| CA-12 | Versionamento Técnico | Organizar commits, release notes, tags e changelog | `CHANGELOG.md`, `.logs/versionamento.md` |
| CA-09 | DevOps / Deploy Engineer | Validar build, ambiente, deploy, preview e rollback | `.logs/deploy-execucao.md`, `.docs/plano-rollback.md` |
| CA-17 | Operação e Runbooks | Criar runbook, manual operacional e recuperação | `.docs/runbook-operacional.md` |

---

## Fluxo oficial de execução

### Bloco 1 — Entrada e Organização

1. CA-01 recebe a ideia e cria o fluxo geral.
2. CA-18 verifica reaproveitamento e duplicidade.
3. CA-13 cataloga ativos técnicos existentes.
4. Gate: briefing, reaproveitamento e catálogo validados.

### Bloco 2 — Arquitetura e Documentação

1. CA-02 define arquitetura e estrutura técnica.
2. CA-16 define fluxos, telas e estados.
3. CA-03 inicia documentação técnica e decisões.
4. Gate: arquitetura, UX e docs iniciais validadas.

### Bloco 3 — Construção Técnica

1. CA-06 modela dados e persistência.
2. CA-05 implementa services/regras.
3. CA-07 implementa integrações.
4. CA-14 implementa/planeja automações quando necessário.
5. CA-04 implementa interface.
6. Gate: build/artefatos técnicos integrados.

### Bloco 4 — Segurança e Qualidade

1. CA-15 revisa código.
2. CA-08 revisa segurança.
3. CA-10 executa QA.
4. CA-11 valida observabilidade.
5. Gate: sem bloqueios críticos.

### Bloco 5 — Deploy e Operação

1. CA-12 organiza versionamento e release.
2. CA-09 valida deploy/build/rollback.
3. CA-17 cria runbook operacional.
4. CA-03 consolida documentação final quando necessário.
5. CA-01 encerra com auditoria final.

---

## Regra de geração de documentos

Cada agente deve gerar seus arquivos obrigatórios.

Nenhuma etapa deve depender apenas de memória de conversa.

Tudo que for relevante para continuidade deve ser salvo em arquivo.

Sempre que possível:
- escrever com clareza
- usar títulos objetivos
- separar seções
- declarar input e output
- registrar riscos e pendências
- deixar pronto para leitura por outro agente

---

## Regra de execução técnica

Ao executar ações no projeto:

- trabalhar apenas na pasta atual do projeto
- não alterar arquivos sem necessidade
- não criar duplicação de estruturas
- seguir a stack já definida no contexto do projeto
- informar quais arquivos foram criados ou alterados
- registrar progresso em logs quando fizer sentido
- preservar fallback mock quando houver integração Supabase
- manter VS Code/Roo sem execução remota autônoma até autorização explícita

---

## Regra de resposta do agente

Ao final de cada interação, responder sempre com:

1. o que encontrou
2. o que fez
3. quais arquivos criou ou alterou
4. como validar

Depois disso, trazer exatamente 3 próximas opções numeradas, curtas, claras e acionáveis.

Quando o usuário responder apenas com um número, interpretar como aprovação para executar a opção correspondente.

---

## Regra de início

Quando este arquivo for lido pela primeira vez, execute nesta ordem:

1. verificar se a estrutura base do projeto existe
2. criar as pastas e arquivos iniciais ausentes
3. criar os arquivos dos 18 agentes em `.agents/`
4. criar/atualizar `AGENTS.md` consolidando os 18 agentes
5. criar/atualizar `CONTEXT.md` resumindo missão e foco atual
6. criar `.plans/00-fluxo-geral.md`
7. parar e apresentar o estado inicial criado

---

## Conteúdo mínimo dos arquivos dos agentes

Cada arquivo em `.agents/` deve conter:

- código CA
- nome do agente
- bloco
- missão
- responsabilidades
- entradas
- saídas
- limites
- entregável principal
- formato de atuação
- próximo agente padrão

---

## Conteúdo mínimo de AGENTS.md

O arquivo `AGENTS.md` deve consolidar:

- visão geral da esteira
- lista dos 18 agentes
- missão de cada um
- bloco de atuação
- ordem de atuação
- entregáveis por etapa
- regras de execução
- gates por bloco

---

## Conteúdo mínimo de CONTEXT.md

O arquivo `CONTEXT.md` deve resumir:

- nome do projeto
- objetivo do produto
- stack principal
- foco atual
- regras de execução
- status atual
- próximos passos

---

## Regra de qualidade

O projeto deve parecer ter sido iniciado por uma equipe profissional de software.

Isso significa:

- organização
- clareza
- separação de responsabilidades
- documentação útil
- rastreabilidade
- handoffs claros
- gates objetivos
- base pronta para evolução

---

## Instrução final ao agente executor

Leia este arquivo por completo.  
Crie a estrutura base.  
Materialize os 18 agentes.  
Gere os arquivos iniciais.  
Organize a fundação do projeto.  
Pare após a fundação inicial e apresente o resultado.

---

*Última atualização: Sala Dev v3.0.0 — evolução oficial para 18 agentes.*
