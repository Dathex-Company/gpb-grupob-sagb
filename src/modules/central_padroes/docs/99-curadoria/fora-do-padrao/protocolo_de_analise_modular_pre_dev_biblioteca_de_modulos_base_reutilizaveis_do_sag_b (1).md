# Protocolo de Análise Modular Pré-Dev — Biblioteca de Módulos Base Reutilizáveis do SagB

## 1. Objetivo

Este documento define o **Protocolo de Análise Modular Pré-Dev** do SagB.

O objetivo é garantir que nenhuma demanda de sistema, app, produto digital, plataforma, automação robusta ou módulo técnico avance para a **Sala Dev** sem antes passar por uma análise de reaproveitamento modular, validação de padrões, identificação de riscos e registro de lacunas.

A lógica central é:

> Antes de desenvolver algo novo, verificar o que já existe, o que pode ser reaproveitado, o que precisa ser configurado, o que precisa ser adaptado e o que realmente precisa ser criado.

Este protocolo transforma a **Biblioteca de Módulos Base Reutilizáveis do SagB** em um **Gate Modular Pré-Dev**, conectado à Central de Padrões, ao NAGI, ao AJUP/Audacus e à Sala Dev.

---

## 2. Escopo

### Este protocolo cobre

- demandas que podem virar sistema, app, plataforma, produto digital ou ferramenta interna;
- demandas que podem exigir módulos base reutilizáveis;
- demandas que precisam ser avaliadas antes de entrar na Sala Dev;
- composição modular de produtos;
- identificação de módulos existentes;
- identificação de módulos ausentes;
- identificação de módulos que precisam refatoração;
- relação entre Biblioteca de Módulos Base e Central de Padrões;
- critérios mínimos para liberar uma demanda para Dev;
- registro de lacunas, riscos, decisões e pendências.

### Este protocolo não cobre

- programação direta;
- implementação técnica detalhada;
- decisão final de negócio;
- aprovação jurídica final;
- desenho visual completo de UX/UI;
- criação do plano de negócio;
- criação de metodologia, curso ou mentoria, salvo quando houver componente técnico associado;
- aprovação canônica de padrões, que pertence à Central de Padrões/Pietro.

---

## 3. Responsáveis

### Responsável normativo

**Pietro Carboni** — Guardião dos Padrões, Metodologias e Estruturas Oficiais do GrupoB.

Responsável por validar se o protocolo está coerente com a Central de Padrões e se o Pacote Modular Pré-Dev respeita a arquitetura normativa do GrupoB / Loze / SagB.

### Responsável técnico

**Sávio Codare / Loze** — responsável pelos padrões técnicos, arquitetura de sistemas, módulos, repositórios, Supabase, APIs, deploy e programação.

### Executor técnico

**Cássio/Procássio** — executor técnico/programador quando a demanda chegar à etapa de implementação ou carga no módulo.

### Responsáveis correlatos

- **NAGI** — entrega ideia/produto qualificado, priorizado e com escopo inicial.
- **AJUP/Audacus** — valida riscos jurídicos, LGPD, contratos, saúde, financeiro, promessa comercial e dados sensíveis.
- **Pedro Gazan** — valida segurança, permissões, dados sensíveis, credenciais, logs e riscos digitais.
- **Alice Montini** — valida UX/UI, interface, componentes, fluxo e experiência.
- **Pierre Zanulli** — valida agentes, automações, memória, MCPs de agentes, autonomia e orquestração.
- **Klaus Wagen** — valida modelos de IA, fornecedores, custos, RAI, termos e retenção.
- **Yuri Sague** — valida processos, TaskZei, registros, tarefas e rastreabilidade operacional.
- **Noah Verdili** — valida naming quando houver nome, marca, domínio ou banco de marcas.
- **César Tulli / StartyB** — valida se a demanda tocar negócio, marca, empresa, venture, plano de negócio ou modelo de receita.
- **Rodrigues/Kane** — validação estratégica quando houver impacto relevante no GrupoB, Loze ou SagB.

---

## 4. Como usar este documento

Este protocolo deve ser usado sempre que uma demanda sair do NAGI com potencial de virar execução técnica.

A pergunta inicial é:

> Essa demanda precisa ir para a Sala Dev ou para um módulo especialista?

Se a resposta envolver sistema, app, plataforma, produto digital, módulo técnico, automação robusta, integração, IA aplicada ou ferramenta interna, a demanda deve passar pelo **Gate Modular Pré-Dev**.

---

## 5. Identidade visual: emojis e color code

Este protocolo segue a lógica normativa da Central de Padrões:

| Emoji | Tipo | Uso |
|---|---|---|
| 🔵 | Princípio | Ideia-base que orienta decisões |
| 🟣 | Política | Posição oficial sobre o tema |
| 🔴 | Regra | Obrigação, limite ou proibição |
| 🟠 | Padrão | Formato correto e repetível |
| 🟢 | Protocolo | Sequência obrigatória para situação específica |
| ⚙️ | Processo | Fluxo completo de ponta a ponta |
| 🧩 | Procedimento | Passo técnico ou operacional específico |
| ✅ | Checklist | Lista de conferência |
| 📊 | Matriz | Tabela de decisão ou classificação |
| 🧾 | Registro/Evidência | Log, parecer, histórico, ata ou prova |
| ⚠️ | Risco | Ponto de atenção ou vulnerabilidade |
| 📌 | Decisão | Decisão registrada |
| 💡 | Recomendação | Sugestão de melhoria |
| 🚨 | Crítico | Bloqueador ou alto impacto |

---

## 6. Princípios do Gate Modular Pré-Dev

### 🔵 6.1. Reaproveitar antes de criar

**Frase-base:** nenhum sistema deve nascer do zero sem antes verificar módulos, padrões, presets, componentes e estruturas já existentes.

**Para que serve:** reduzir retrabalho, duplicidade técnica e inconsistência entre produtos do SagB.

**Aplicação prática:** antes da Sala Dev, a Biblioteca deve verificar se já existem módulos como `auth_core`, `users_core`, `permissions_core`, `documents_core`, `calendar_core`, `tasks_workflow_core` ou outros.

**Risco que reduz:** criação duplicada de tabelas, componentes, módulos, permissões, integrações e fluxos.

### 🔵 6.2. Modularizar sem fragmentar

**Frase-base:** nem tudo que se repete merece virar módulo; só vira módulo o que é reutilizável, isolável, documentável e seguro.

**Para que serve:** evitar que a Biblioteca vire um catálogo caótico de peças pequenas demais.

**Aplicação prática:** diferenciar módulo base, módulo plugável, módulo de produto, service, helper e componente.

**Risco que reduz:** excesso de módulos frágeis, acoplamento indevido e manutenção difícil.

### 🔵 6.3. Central de Padrões antes e depois da Biblioteca

**Frase-base:** a Central define os padrões que a Biblioteca usa e valida o pacote modular antes da execução.

**Para que serve:** garantir coerência normativa.

**Aplicação prática:** a Biblioteca monta o Pacote Modular Pré-Dev; a Central valida se ele respeita padrões oficiais.

**Risco que reduz:** Biblioteca operar solta, sem padrão, sem aprovação e sem rastreabilidade.

### 🔵 6.4. Cliente configura, SagB compõe

**Frase-base:** a camada interna do SagB define a composição modular; a camada do cliente final apenas ativa/desativa recursos autorizados.

**Para que serve:** separar arquitetura interna de customização de produto.

**Aplicação prática:** a decisão de usar `cadastros_core`, `forms_fields_core`, `permissions_core` e `documents_core` é interna. O cliente final apenas configura campos permitidos dentro do sistema pronto.

**Risco que reduz:** cliente final alterar arquitetura do sistema sem controle.

---

## 7. Políticas do Gate Modular Pré-Dev

### 🟣 7.1. Política de passagem obrigatória pela Biblioteca

Toda demanda aprovada pelo NAGI que possa virar sistema, app, produto digital, plataforma, automação robusta ou módulo técnico deve passar pela Biblioteca de Módulos Base antes da Sala Dev.

### 🟣 7.2. Política de validação pela Central de Padrões

Todo Pacote Modular Pré-Dev deve passar por validação da Central de Padrões antes de seguir para a Sala Dev ou Módulos Especialistas.

### 🟣 7.3. Política de acionamento do AJUP/Audacus

AJUP/Audacus deve ser acionado quando a demanda envolver:

- LGPD;
- dados pessoais;
- dados sensíveis;
- saúde;
- financeiro;
- contratos;
- promessa comercial;
- marca;
- risco regulatório;
- responsabilidade jurídica;
- relação com cliente externo.

### 🟣 7.4. Política de status dos módulos base

Nenhum módulo pode ser considerado pronto para reuso sem status definido.

Status possíveis:

- ideia;
- em análise;
- existente;
- precisa refatorar;
- reutilizável com restrições;
- aprovado para reuso;
- legado;
- descartado.

---

## 8. Regras centrais

1. Toda demanda técnica pós-NAGI deve passar por análise modular antes da Sala Dev.
2. A Biblioteca não aprova padrão oficial; ela monta a composição modular.
3. A Central de Padrões valida a coerência normativa do Pacote Modular Pré-Dev.
4. Nenhum módulo inexistente deve ser tratado como pronto.
5. Nenhum módulo em refatoração deve ser usado sem restrição declarada.
6. Nenhum módulo com dado sensível deve avançar sem validação de segurança.
7. Nenhum módulo com risco jurídico deve avançar sem AJUP/Audacus.
8. Nenhum pacote modular deve seguir para Dev sem documento de origem, responsáveis, módulos recomendados, riscos, lacunas e critérios de uso.
9. Toda lacuna deve ser registrada como pendência, e não mascarada como padrão pronto.
10. Toda decisão de criar módulo novo deve gerar registro de decisão e justificativa.

---

## 9. Padrões do Pacote Modular Pré-Dev

### 🟠 9.1. Nome padrão do pacote

Usar o formato:

**Pacote Modular Pré-Dev — [Nome do Produto/Sistema] — v[versão]**

Exemplos:

- Pacote Modular Pré-Dev — Clínica Inteligente — v1.0
- Pacote Modular Pré-Dev — Plataforma de Cursos AcadB — v1.0
- Pacote Modular Pré-Dev — Agenda Interna SagB — v1.0

### 🟠 9.2. Estrutura mínima do pacote

Todo pacote deve conter:

1. identificação da demanda;
2. origem da demanda;
3. decisão do NAGI;
4. parecer AJUP/Audacus, quando aplicável;
5. objetivo do produto/sistema;
6. público ou usuário principal;
7. MVP;
8. funcionalidades principais;
9. módulos base recomendados;
10. módulos plugáveis recomendados;
11. presets sugeridos;
12. campos configuráveis;
13. permissões necessárias;
14. tabelas prováveis;
15. buckets prováveis;
16. integrações prováveis;
17. IA/agentes envolvidos, quando houver;
18. padrões da Central aplicáveis;
19. o que será reaproveitado;
20. o que será adaptado;
21. o que será criado novo;
22. lacunas;
23. riscos;
24. validações necessárias;
25. destino recomendado;
26. critérios de liberação para Dev.

### 🟠 9.3. Padrão de classificação modular

Cada item técnico deve ser classificado como:

- módulo base;
- módulo plugável;
- módulo de produto;
- service;
- helper;
- componente;
- preset;
- campo configurável;
- integração;
- automação;
- agente;
- tabela;
- bucket.

---

## 10. Protocolo oficial — Análise Modular Pré-Dev

### 🟢 10.1. Quando usar

Usar quando uma demanda já passou pelo NAGI e possui:

- objetivo claro;
- público ou usuário provável;
- MVP ou escopo inicial;
- funcionalidades principais;
- prioridade definida;
- encaminhamento para execução técnica ou módulo especialista.

### 🟢 10.2. Responsável pela condução

A condução inicial pertence à **Biblioteca de Módulos Base Reutilizáveis do SagB**.

A validação normativa pertence à **Central de Padrões / Pietro**.

A validação técnica pertence à **Sávio/Loze**, com execução por Cássio/Procássio quando aplicável.

### 🟢 10.3. Entradas obrigatórias vindas do NAGI

O NAGI deve entregar:

1. nome provisório da demanda;
2. descrição simples;
3. problema que resolve;
4. público/usuário;
5. MVP;
6. funcionalidades principais;
7. prioridade;
8. escopo inicial;
9. destino sugerido;
10. dúvidas abertas;
11. riscos percebidos;
12. decisão de avanço.

Se o NAGI não entregar esses itens mínimos, a Biblioteca deve devolver para complementação.

### 🟢 10.4. Passos obrigatórios

1. Receber a demanda aprovada pelo NAGI.
2. Conferir se existe material mínimo.
3. Verificar se AJUP/Audacus deve entrar antes da análise modular.
4. Classificar a natureza da demanda.
5. Listar funcionalidades principais.
6. Mapear módulos base possíveis.
7. Mapear módulos plugáveis possíveis.
8. Mapear services, helpers, componentes e presets aplicáveis.
9. Verificar módulos já existentes.
10. Verificar módulos em refatoração.
11. Verificar módulos inexistentes.
12. Identificar permissões necessárias.
13. Identificar tabelas, buckets e estruturas prováveis.
14. Identificar padrões da Central aplicáveis.
15. Identificar riscos técnicos, jurídicos, de segurança, UX, IA e operação.
16. Registrar lacunas.
17. Montar o Pacote Modular Pré-Dev.
18. Enviar para validação da Central de Padrões.
19. Receber parecer: aprovado, aprovado com ajustes, devolver ou bloquear.
20. Encaminhar para Sala Dev ou Módulos Especialistas.

### 🟢 10.5. Saída esperada

A saída obrigatória é o **Pacote Modular Pré-Dev**.

Sem esse pacote, a demanda não deve seguir para Sala Dev.

### 🟢 10.6. Registros gerados

- Registro de Análise Modular Pré-Dev;
- Pacote Modular Pré-Dev;
- Registro de lacunas;
- Registro de módulos inexistentes;
- Registro de módulos em refatoração;
- Registro de validações necessárias;
- Parecer da Central de Padrões;
- Decisão de encaminhamento.

---

## 11. Processo completo: ideia até Dev

### ⚙️ Processo oficial

```text
CID + RAI
↓
NICO
↓
NAGI
↓
AJUP / Audacus, quando necessário
↓
Biblioteca de Módulos Base
↓
Central de Padrões / Pietro
↓
Sala Dev ou Módulos Especialistas
```

### Função de cada camada

| Camada | Função |
|---|---|
| CID | Prepara material bruto interno |
| RAI | Observa sinais externos |
| NICO | Conecta, expande e encontra oportunidades |
| NAGI | Qualifica, prioriza e define encaminhamento |
| AJUP/Audacus | Protege juridicamente e reduz risco preventivo |
| Biblioteca de Módulos Base | Monta composição modular reutilizável |
| Central de Padrões | Valida padrões, coerência, documentação e arquitetura normativa |
| Sala Dev | Executa desenvolvimento técnico |
| Módulos Especialistas | Executam quando não for demanda técnica direta |

---

## 12. Procedimentos do Gate Modular Pré-Dev

### 🧩 12.1. Procedimento de análise de módulos existentes

1. Listar funcionalidades do produto.
2. Consultar catálogo de módulos base.
3. Consultar módulos plugáveis.
4. Consultar módulos de produto semelhantes.
5. Consultar services, helpers e componentes.
6. Marcar cada item como:
   - reaproveitar;
   - adaptar;
   - refatorar;
   - criar novo;
   - não usar;
   - precisa validação.
7. Registrar justificativa.

### 🧩 12.2. Procedimento de identificação de presets

1. Identificar variações comuns do módulo.
2. Separar configuração interna de configuração do cliente final.
3. Definir presets iniciais.
4. Definir campos configuráveis.
5. Definir limites de personalização.
6. Registrar dependências.

### 🧩 12.3. Procedimento de acionamento do AJUP/Audacus

1. Verificar se há dados pessoais ou sensíveis.
2. Verificar se há promessa comercial.
3. Verificar se há contrato, cobrança ou financeiro.
4. Verificar se há saúde, jurídico, marca ou risco regulatório.
5. Se houver, acionar AJUP/Audacus.
6. Registrar parecer, lacuna ou bloqueio.

---

## 13. Checklists

### ✅ 13.1. Checklist para acionar o Gate Modular Pré-Dev

- A demanda passou pelo NAGI?
- Existe objetivo claro?
- Existe público/usuário definido?
- Existe MVP?
- Existem funcionalidades principais?
- Existe prioridade?
- Existe destino sugerido?
- Há risco jurídico ou LGPD?
- Há potencial de virar sistema, app, plataforma ou produto digital?

### ✅ 13.2. Checklist do Pacote Modular Pré-Dev

- O pacote tem identificação da demanda?
- O pacote tem origem e decisão do NAGI?
- AJUP/Audacus foi acionado quando necessário?
- Os módulos base foram listados?
- Os módulos plugáveis foram listados?
- O que será reaproveitado está claro?
- O que será adaptado está claro?
- O que será criado novo está claro?
- As permissões foram identificadas?
- As tabelas prováveis foram identificadas?
- Os padrões da Central foram vinculados?
- Os riscos foram registrados?
- As lacunas foram registradas?
- O destino final foi definido?

### ✅ 13.3. Checklist de liberação para Sala Dev

- Pacote Modular Pré-Dev criado?
- Central de Padrões validou?
- Segurança validou, se aplicável?
- AJUP/Audacus validou, se aplicável?
- UX/UI validou, se houver interface relevante?
- IA/agentes validaram, se houver agentes ou IA?
- Módulos inexistentes foram registrados?
- Módulos em refatoração foram tratados?
- Lacunas críticas foram resolvidas ou aceitas?
- Responsável técnico foi definido?

---

## 14. Matrizes

### 📊 14.1. Matriz de decisão: destino da demanda

| Condição | Destino |
|---|---|
| Sistema, app, plataforma ou ferramenta técnica | Sala Dev, após Gate Modular |
| Metodologia, framework ou modelo mental | Nilo / Metodologias |
| Curso, trilha, mentoria ou formação | Júlio / AcadB |
| Marca, empresa, venture ou plano de negócio | César / StartyB |
| Nome, domínio ou banco de marcas | Noah / Naming |
| Processo, tarefa, rotina ou execução | Yuri / Processos / TaskZei |
| Agente, IA operacional ou automação inteligente | Pierre / Agentes |
| Modelo de IA, fornecedor ou RAI | Klaus / Modelos IA |
| Segurança, acesso, dado sensível ou incidente | Pedro Gazan / Segurança |

### 📊 14.2. Matriz de reaproveitamento modular

| Situação | Decisão |
|---|---|
| Módulo existe e está aprovado para reuso | Reaproveitar |
| Módulo existe, mas precisa ajuste leve | Adaptar |
| Módulo existe, mas está acoplado ou legado | Refatorar antes de usar |
| Módulo não existe e é reutilizável | Criar novo módulo base |
| Módulo não existe e é específico do produto | Criar módulo de produto |
| Item é pequeno demais para módulo | Criar service/helper/componente |
| Há risco jurídico, segurança ou LGPD | Pausar e validar |

### 📊 14.3. Matriz de status do módulo base

| Status | Significado | Pode usar? |
|---|---|---|
| ideia | Ainda é apenas proposta | Não |
| em análise | Está sendo avaliado | Não sem validação |
| existente | Existe em algum sistema | Depende |
| precisa refatorar | Existe, mas não está pronto para reuso | Não direto |
| reutilizável com restrições | Pode usar em casos controlados | Sim, com restrição |
| aprovado para reuso | Pronto para uso amplo | Sim |
| legado | Antigo, não recomendado | Não, salvo exceção |
| descartado | Não deve ser usado | Não |

---

## 15. Registros e evidências

### 🧾 15.1. Registro de Análise Modular Pré-Dev

Campos mínimos:

- data;
- demanda;
- origem;
- responsável;
- decisão do NAGI;
- módulos avaliados;
- decisão por módulo;
- riscos;
- lacunas;
- validações necessárias;
- parecer da Central;
- destino final.

### 🧾 15.2. Registro de módulo inexistente

Campos mínimos:

- nome sugerido;
- função;
- por que não existe equivalente;
- se deve virar módulo base ou módulo de produto;
- responsável sugerido;
- risco;
- prioridade.

### 🧾 15.3. Registro de módulo em refatoração

Campos mínimos:

- módulo;
- onde existe;
- problema atual;
- risco de uso;
- adaptação necessária;
- responsável;
- decisão.

### 🧾 15.4. Registro de liberação para Dev

Campos mínimos:

- pacote aprovado;
- padrões vinculados;
- validações realizadas;
- pendências aceitas;
- responsável técnico;
- data;
- destino.

---

## 16. Riscos e pontos de atenção

### ⚠️ 16.1. Riscos principais

1. Biblioteca virar catálogo bagunçado.
2. Sala Dev continuar criando tudo do zero.
3. Módulos serem reutilizados sem documentação.
4. Cliente final ganhar poder de customizar arquitetura interna.
5. AJUP/Audacus ser acionado tarde demais.
6. Central de Padrões validar apenas depois que a Dev já começou.
7. Módulos inexistentes serem tratados como prontos.
8. Módulos em refatoração serem usados sem restrição.
9. Falta de registro de lacunas.
10. Confusão entre módulo base, módulo plugável e módulo de produto.

### ⚠️ 16.2. Prevenções

- Gate obrigatório antes da Dev;
- ficha técnica por módulo;
- status de módulo;
- pacote modular obrigatório;
- validação da Central;
- acionamento preventivo do AJUP/Audacus;
- registro de lacunas;
- matriz de reaproveitamento;
- checklist de liberação para Dev.

---

## 17. Lacunas atuais

| Lacuna | Impacto | Prioridade | Recomendação |
|---|---|---|---|
| Biblioteca ainda não possui estrutura final no SagB | Pode virar catálogo solto | Alta | Criar estrutura dentro da Central e/ou módulo próprio |
| Ficha Técnica de Módulo Base ainda precisa ser criada | Módulos podem nascer sem contrato claro | Alta | Criar documento próprio como próxima etapa |
| Catálogo real de módulos existentes ainda precisa ser auditado | Risco de decidir com base em suposição | Alta | Fazer inventário técnico dos módulos existentes |
| Critério de preset e configuração do cliente final ainda precisa detalhar | Risco de customização excessiva | Média | Criar política de customização permitida |
| Relação Biblioteca x Sala Dev precisa virar fluxo operacional no sistema | Risco de uso manual inconsistente | Alta | Criar tela/fluxo de Pacote Modular Pré-Dev |

---

## 18. Recomendações

### Ações imediatas

1. Aprovar este protocolo como candidato a padrão.
2. Criar o modelo da Ficha Técnica de Módulo Base.
3. Criar o modelo do Pacote Modular Pré-Dev.
4. Criar checklist de liberação para Sala Dev.
5. Criar inventário inicial dos módulos base existentes.

### Ações estruturais

1. Criar área da Biblioteca de Módulos Base dentro da Central de Padrões.
2. Criar relação entre módulos base e padrões da Central.
3. Criar status oficial dos módulos.
4. Criar fluxo no SagB para gerar Pacote Modular Pré-Dev.
5. Integrar Biblioteca com Sala Dev.

### Ações futuras

1. Criar assistente interno para sugerir módulos base.
2. Criar detecção de módulos duplicados.
3. Criar ranking de maturidade dos módulos.
4. Criar histórico de reaproveitamento por sistema.
5. Criar presets por segmento: clínica, escola, financeiro, treinamento, agenda, consultoria etc.

---

## 19. Documentos derivados

Devem virar documentos próprios:

1. **Ficha Técnica de Módulo Base**.
2. **Modelo de Pacote Modular Pré-Dev**.
3. **Checklist de Liberação para Sala Dev**.
4. **Matriz de Reaproveitamento Modular**.
5. **Política de Customização Permitida pelo Cliente Final**.
6. **Catálogo Inicial de Módulos Base Reutilizáveis**.
7. **Protocolo de Criação de Novo Módulo Base**.
8. **Registro de Módulo Inexistente**.
9. **Registro de Módulo em Refatoração**.
10. **Padrão de Presets por Segmento**.

---

## 20. Síntese final

O **Protocolo de Análise Modular Pré-Dev** oficializa a Biblioteca de Módulos Base Reutilizáveis como uma etapa obrigatória da esteira do SagB antes da Sala Dev.

A Biblioteca não substitui a Central de Padrões. Ela opera com base nos padrões definidos pela Central e gera o **Pacote Modular Pré-Dev**, que deve ser validado antes da execução.

A lógica final é:

```text
NAGI define o produto.
AJUP/Audacus protege quando houver risco.
Biblioteca modulariza.
Central de Padrões valida coerência normativa.
Sala Dev ou Módulos Especialistas executam.
```

Este protocolo reduz retrabalho, evita duplicidade, protege a arquitetura do SagB e cria uma ponte clara entre estratégia, reaproveitamento modular, governança e execução técnica.

A próxima etapa recomendada é criar o documento **Ficha Técnica de Módulo Base**, que definirá o contrato mínimo para um módulo ser considerado reutilizável.

