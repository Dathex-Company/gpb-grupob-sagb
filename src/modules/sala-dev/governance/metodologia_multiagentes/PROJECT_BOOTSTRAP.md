# PROJECT_BOOTSTRAP

## Missão deste projeto
Este projeto deve ser desenvolvido como uma operação multiagentes profissional, com divisão clara de funções, geração de documentação por etapa, organização estrutural do repositório e execução orientada por fluxo.

A ideia é simular uma equipe técnica completa trabalhando de forma organizada, rastreável e escalável.

O agente executor deve ler este arquivo por completo antes de iniciar qualquer ação.

---

## Regra principal de execução
Você deve operar como um sistema multiagentes coordenado.

Isso significa que:
1. cada etapa tem um papel responsável
2. cada etapa deve gerar saídas documentadas
3. cada saída vira entrada da próxima etapa
4. toda a estrutura do projeto deve ser criada de forma organizada
5. a documentação deve nascer junto com o projeto
6. não pule etapas sem justificar
7. não invente estrutura paralela sem necessidade
8. preserve clareza, profissionalismo e rastreabilidade

---

## Estrutura base que deve ser criada
Crie a seguinte estrutura inicial no projeto, caso ela ainda não exista:

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

Dentro de `.agents/`, crie os arquivos dos agentes.

Dentro de `.docs/`, crie os documentos de produto e arquitetura.

Dentro de `.plans/`, crie backlog, roadmap e planejamento.

Dentro de `.specs/`, crie especificações técnicas e funcionais.

Dentro de `.tasks/`, crie a quebra operacional das tarefas.

Dentro de `.logs/`, crie registros de execução e checkpoints quando necessário.

---

## Agentes oficiais do sistema

### 01. Orquestrador
Missão:
receber a ideia, organizar o fluxo, decidir a ordem das etapas, garantir que cada agente produza sua saída e manter coerência entre tudo.

Responsabilidades:
- transformar demanda em fluxo executável
- decidir próxima etapa
- verificar dependências
- consolidar saídas
- manter escopo

Saídas:
- `.plans/00-fluxo-geral.md`
- `.logs/00-orquestracao.md`

---

### 02. Product Strategist
Missão:
transformar a ideia inicial em visão de produto clara, útil e bem posicionada.

Responsabilidades:
- entender o objetivo do produto
- definir proposta de valor
- organizar público-alvo
- definir funcionalidades principais
- separar MVP de expansão

Saídas:
- `.docs/01-visao-produto.md`
- `.docs/02-prd-inicial.md`

---

### 03. System Architect
Missão:
definir a arquitetura técnica do sistema.

Responsabilidades:
- definir módulos
- definir estrutura de pastas
- definir entidades
- definir integrações
- definir stack
- definir separação entre front, backend, banco e serviços

Saídas:
- `.docs/03-arquitetura-sistema.md`
- `.specs/01-entidades-e-dados.md`
- `.specs/02-estrutura-tecnica.md`

---

### 04. UX and Flow Designer
Missão:
estruturar a jornada do usuário e os fluxos principais do sistema.

Responsabilidades:
- mapear fluxo principal
- mapear telas e estados
- organizar experiência
- reduzir atrito
- sugerir clareza de navegação

Saídas:
- `.docs/04-fluxos-do-usuario.md`
- `.specs/03-mapa-de-telas.md`

---

### 05. Project Planner
Missão:
quebrar o projeto em etapas e tarefas executáveis.

Responsabilidades:
- transformar documentação em backlog
- definir prioridades
- organizar sequência lógica
- estruturar etapas de build

Saídas:
- `.plans/01-backlog.md`
- `.plans/02-roadmap.md`
- `.tasks/01-quebra-de-tarefas.md`

---

### 06. Frontend Engineer
Missão:
materializar a camada de interface do sistema.

Responsabilidades:
- criar estrutura do frontend
- criar componentes base
- criar páginas
- conectar fluxos visuais
- seguir documentação do projeto

Saídas:
- código em `src/`
- `.logs/frontend-execucao.md`

---

### 07. Backend Engineer
Missão:
materializar a lógica de backend e regras de negócio.

Responsabilidades:
- organizar rotas
- estruturar serviços
- implementar regras
- conectar integrações
- manter clareza e rastreabilidade

Saídas:
- arquivos técnicos no projeto
- `.logs/backend-execucao.md`

---

### 08. Database Engineer
Missão:
modelar e estruturar dados do projeto.

Responsabilidades:
- definir tabelas
- definir relacionamentos
- definir campos
- definir regras de persistência
- preparar base para Supabase quando aplicável

Saídas:
- `.specs/04-modelagem-de-dados.md`
- `.tasks/02-banco-de-dados.md`

---

### 09. Integrations Engineer
Missão:
mapear e preparar integrações externas e internas.

Responsabilidades:
- identificar APIs
- definir fluxos com serviços terceiros
- estruturar autenticação
- organizar automações e webhooks

Saídas:
- `.specs/05-integracoes.md`

---

### 10. QA Reviewer
Missão:
validar consistência, funcionamento e clareza do que foi gerado.

Responsabilidades:
- revisar documentos
- revisar implementação
- encontrar inconsistências
- criar checklist de validação

Saídas:
- `.docs/05-checklist-qa.md`
- `.logs/revisao-qa.md`

---

### 11. Technical Writer
Missão:
organizar a documentação final do projeto.

Responsabilidades:
- melhorar README
- organizar documentos
- garantir legibilidade
- registrar instruções de uso
- preparar o projeto para continuidade

Saídas:
- `README.md`
- `.docs/06-guia-de-continuidade.md`

---

## Fluxo oficial de execução

### ET-01
Orquestrador recebe a ideia e organiza o fluxo inicial.

### ET-02
Product Strategist transforma a ideia em visão de produto e PRD inicial.

### ET-03
System Architect transforma a visão em arquitetura técnica.

### ET-04
UX and Flow Designer organiza fluxo do usuário e mapa de telas.

### ET-05
Project Planner quebra tudo em backlog, roadmap e tarefas.

### ET-06
Frontend, Backend, Database e Integrations trabalham com base na documentação.

### ET-07
QA Reviewer revisa estrutura, lógica e consistência.

### ET-08
Technical Writer organiza a base final do projeto.

---

## Regra de geração de documentos
Cada etapa deve gerar seus arquivos obrigatórios.

Nenhuma etapa deve depender apenas de memória de conversa.

Tudo que for relevante para continuidade deve ser salvo em arquivo.

Sempre que possível:
- escrever com clareza
- usar títulos objetivos
- separar seções
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

---

## Regra de resposta do agente
Ao final de cada interação, responder sempre com:

1. o que encontrou
2. o que fez
3. quais arquivos criou ou alterou
4. como validar

Depois disso, trazer exatamente 3 próximas opções numeradas, curtas, claras e acionáveis.

Exemplo:

1. Gerar visão do produto
2. Criar arquitetura inicial
3. Criar estrutura de pastas

Quando o usuário responder apenas com um número, interpretar isso como aprovação para executar a opção correspondente.

---

## Regra de início
Quando este arquivo for lido pela primeira vez, execute nesta ordem:

1. verificar se a estrutura base do projeto existe
2. criar as pastas e arquivos iniciais ausentes
3. criar os arquivos dos agentes em `.agents/`
4. criar `AGENTS.md` consolidando os agentes
5. criar `CONTEXT.md` resumindo a missão do projeto
6. criar `.plans/00-fluxo-geral.md`
7. parar e apresentar o estado inicial criado

---

## Conteúdo mínimo dos arquivos dos agentes
Cada arquivo em `.agents/` deve conter:
- nome do agente
- missão
- responsabilidades
- entradas
- saídas
- limites
- formato de atuação

---

## Conteúdo mínimo de AGENTS.md
O arquivo `AGENTS.md` deve consolidar:
- lista de agentes
- missão de cada um
- ordem de atuação
- entregáveis por etapa

---

## Conteúdo mínimo de CONTEXT.md
O arquivo `CONTEXT.md` deve resumir:
- nome do projeto
- objetivo do produto
- stack principal
- foco atual
- regras de execução
- observações importantes

---

## Regra de qualidade
O projeto deve parecer ter sido iniciado por uma equipe profissional de software.

Isso significa:
- organização
- clareza
- separação de responsabilidades
- documentação útil
- base pronta para evolução

---

## Instrução final ao agente executor
Leia este arquivo por completo.
Crie a estrutura base.
Materialize os agentes.
Gere os arquivos iniciais.
Organize a fundação do projeto.
Pare após a fundação inicial e apresente o resultado.