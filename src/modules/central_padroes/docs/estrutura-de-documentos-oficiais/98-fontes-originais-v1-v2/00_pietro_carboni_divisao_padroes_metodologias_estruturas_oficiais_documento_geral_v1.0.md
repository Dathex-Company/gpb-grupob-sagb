# Arquitetura Mestra e Governança da Central de Padrões — GrupoB / Loze

## 1. Objetivo do documento

Este documento define a arquitetura mestra, a governança, os responsáveis, os fluxos, os tipos normativos, as matrizes, os checklists, os protocolos, os registros e as regras de funcionamento da **Central de Padrões do GrupoB / Loze dentro do SagB**.

A função deste documento é servir como base limpa, profunda e organizada para estruturar a próxima versão da Central de Padrões, tanto como pasta de trabalho quanto como módulo navegável dentro do SagB.

A Central de Padrões não é apenas uma pasta de documentos. Ela deve funcionar como a camada normativa do GrupoB / Loze: o lugar onde padrões são criados, classificados, revisados, aprovados, versionados, relacionados a responsáveis e conectados aos módulos executores.

---

## 2. Papel do Pietro Carboni

O Pietro Carboni atua como **Guardião dos Padrões, Metodologias e Estruturas Oficiais do GrupoB**.

Sua função não é substituir os responsáveis especializados. Cada responsável continua sendo dono técnico, operacional ou conceitual da própria área. O papel do Pietro é:

* organizar;
* classificar;
* consolidar;
* cruzar dependências;
* identificar conflitos;
* evitar duplicidades;
* padronizar nomenclaturas;
* definir estrutura normativa;
* separar princípio, política, regra, padrão, protocolo, processo, procedimento, checklist, matriz e registro;
* aprovar a entrada de documentos na Central de Padrões;
* decidir o que vira padrão oficial;
* definir o que precisa validação;
* estruturar a Arquitetura Mestra da Central de Padrões.

### 2.1. Regra central do Pietro

```text
Pietro consolida.
Pietro classifica.
Pietro cruza dependências.
Pietro aprova.
Os responsáveis especializados alimentam suas áreas.
```

### 2.2. O que Pietro não faz como execução principal

Pietro não executa como responsável principal:

* programação;
* deploy;
* banco de dados;
* design visual;
* segurança operacional;
* criação técnica de agentes;
* escolha operacional de modelos de IA;
* pesquisa de naming;
* plano de negócio completo;
* criação de cursos, trilhas e mentorias;
* operação de tarefas no TaskZei;
* operação comercial ou financeira.

Essas áreas têm seus responsáveis próprios.

---

## 3. Definição da Central de Padrões

A **Central de Padrões** é a camada oficial de organização normativa do GrupoB / Loze dentro do SagB.

Ela organiza:

* padrões oficiais;
* princípios;
* políticas;
* regras;
* protocolos;
* processos;
* procedimentos;
* checklists;
* matrizes;
* registros;
* documentos internos;
* documentos externos;
* responsáveis;
* dependências;
* aprovações;
* lacunas;
* validações;
* estrutura dos módulos;
* estrutura institucional;
* estrutura técnica;
* estrutura de agentes;
* estrutura de metodologias;
* estrutura de marcas, empresas, ventures e produtos;
* fluxo de criação, revisão, consolidação e aprovação.

A Central de Padrões deve responder:

1. O que já está definido?
2. Quem é responsável?
3. Qual documento é canônico?
4. O que ainda está em rascunho?
5. O que precisa validação?
6. Que padrão se aplica a cada situação?
7. Que módulo executor aplica esse padrão?
8. Que dependências existem entre áreas?
9. Quais riscos de duplicidade existem?
10. O que pode ser publicado externamente?

---

## 4. Princípios da Central de Padrões

### 🔵 Princípio 1 — Padrão antes da escala

Antes de escalar sistemas, agentes, processos, marcas, métodos ou documentos, deve existir um padrão mínimo para evitar retrabalho, duplicidade e confusão.

### 🔵 Princípio 2 — Responsável claro por área

Todo padrão deve ter responsável, área, escopo, validações e dependências explícitas.

### 🔵 Princípio 3 — Documento nasce bruto, evolui e só depois vira canônico

Nenhum conteúdo bruto deve ser tratado automaticamente como padrão oficial. A evolução deve seguir o fluxo: bruto → tratado → consolidado → aprovado → canônico.

### 🔵 Princípio 4 — Não chamar tudo de protocolo

Cada item deve ser classificado corretamente. Protocolo só existe quando houver situação específica, sequência obrigatória, responsável e saída esperada.

### 🔵 Princípio 5 — Central define, módulo executor aplica

A Central de Padrões define o padrão. Os módulos do SagB, Loze e demais frentes aplicam o padrão na operação.

### 🔵 Princípio 6 — Dependência registrada evita conflito

Quando uma área encostar em outra, deve existir dependência explícita. Isso evita que duas áreas criem padrões contraditórios.

### 🔵 Princípio 7 — Fonte canônica precisa de aprovação

Documento só vira fonte canônica depois de passar por revisão, validação do responsável e aprovação de Pietro.

---

## 5. O que a Central define e o que não define

### 5.1. A Central define

* estrutura normativa dos padrões;
* responsáveis por área;
* tipos normativos;
* matrizes gerais;
* checklists gerais;
* protocolos gerais;
* registros obrigatórios;
* processo de aprovação;
* processo de documentação canônica;
* relacionamento entre áreas;
* arquitetura mestra;
* identidade, classificação e arquitetura do ecossistema;
* documentação interna e externa;
* processo de triagem de conhecimento;
* ciclo de vida de documentos;
* ciclo de vida de padrões;
* critérios para entrada na Central.

### 5.2. A Central não executa

* não programa sistemas;
* não desenha todas as telas;
* não executa deploy;
* não opera segurança diariamente;
* não cria todas as marcas;
* não executa o plano de negócio;
* não ministra cursos;
* não opera TaskZei;
* não substitui os responsáveis das áreas;
* não substitui os módulos executores do SagB.

---

## 6. Arquitetura Mestra da Central de Padrões

A Arquitetura Mestra é a estrutura de organização macro da Central de Padrões. Ela serve como mapa normativo, navegação principal e referência para a criação dos blocos por área.

### 6.1. Estrutura física proposta

Esta estrutura é uma **proposta de organização**. Parte dela já existe fisicamente, como `01_responsaveis` e `02_documentos_atuais`; o restante deve ser validado antes de criação física completa.

```text
central_de_padroes/
├── 00_indice_geral.md
├── 01_consolidado_geral.md
├── 01_responsaveis/
├── 02_documentos_atuais/
├── 03_arquitetura_mestra/
├── 04_identidade_classificacao_ecossistema/
├── 05_tipos_normativos/
├── 06_matrizes_gerais/
├── 07_checklists_gerais/
├── 08_protocolos_gerais/
├── 09_registros_e_evidencias/
├── 10_documentacao_interna/
├── 11_documentacao_externa/
└── 12_validacoes_pendencias_decisoes/
```

### 6.2. Lógica da estrutura

* `00_indice_geral.md`: navegação geral da Central.
* `01_consolidado_geral.md`: resumo das decisões, responsáveis e estrutura macro.
* `01_responsaveis/`: blocos de trabalho por responsável.
* `02_documentos_atuais/`: documentos existentes que servem como base, mas ainda não são necessariamente canônicos.
* `03_arquitetura_mestra/`: documentos estruturais da Central.
* `04_identidade_classificacao_ecossistema/`: Registro Mestre do Ecossistema e nomenclaturas.
* `05_tipos_normativos/`: classificação normativa oficial.
* `06_matrizes_gerais/`: matrizes transversais.
* `07_checklists_gerais/`: checklists transversais.
* `08_protocolos_gerais/`: protocolos centrais.
* `09_registros_e_evidencias/`: modelos de registros e evidências.
* `10_documentacao_interna/`: padrões de documentação interna.
* `11_documentacao_externa/`: padrões de documentação externa.
* `12_validacoes_pendencias_decisoes/`: lacunas, decisões e validações pendentes.

---

## 7. Estrutura de navegação/sidebar

No SagB, a Central de Padrões deve ser navegável por sidebar. A navegação não deve ser uma lista infinita; deve ter camadas.

### 7.1. Níveis de navegação

```text
Nível 1 — Bloco principal
Exemplo: Responsáveis, Arquitetura Mestra, Tipos Normativos.

Nível 2 — Área, responsável ou tema
Exemplo: Sávio, Segurança, UX/UI, Registro Mestre.

Nível 3 — Documento, matriz, checklist ou protocolo
Exemplo: checklist_pre_publicacao.md, matriz_de_risco.md.
```

### 7.2. Sidebar recomendada

```text
Central de Padrões
├── Visão Geral
├── Arquitetura Mestra
├── Identidade, Classificação e Arquitetura do Ecossistema
├── Responsáveis
├── Tipos Normativos
├── Matrizes Gerais
├── Checklists Gerais
├── Protocolos Gerais
├── Registros e Evidências
├── Documentação Interna
├── Documentação Externa
├── Validações, Pendências e Decisões
└── Módulos Executores do SagB
```

---

## 8. Blocos principais da Central

A Central de Padrões deve organizar os blocos abaixo:

```text
Arquitetura Mestra de Padrões
├── 00. Fundações GrupoB / Loze
├── 01. Governança dos Padrões
├── 02. Central de Padrões no SagB
├── 03. Identidade, Classificação e Arquitetura do Ecossistema
├── 04. Entrada, Classificação e Roteamento
├── 05. Sistemas, Arquitetura Técnica e Programação
├── 06. UX/UI, Experiência e Interface
├── 07. Segurança Digital, Risco e Proteção
├── 08. Agentes Autônomos, IA e Orquestração
├── 09. Modelos de IA, RAI e Radar Tecnológico
├── 10. Processos, Execução, Registros e TaskZei
├── 11. Naming, Disponibilidade e Banco de Marcas
├── 12. Metodologias, Frameworks e Estruturas Intelectuais
├── 13. AcadB, Mentorias, Cursos e Trilhas
├── 14. StartyB, Marcas, Empresas e Ventures
├── 15. Dados, Conhecimento, Memória e RAG
├── 16. APIs, MCPs, Bridges e Integrações
├── 17. Documentação Interna e Externa
├── 18. Auditoria, Evidências e Relatórios
├── 19. Descontinuação, Legado e Transição
└── 20. Módulos Executores do SagB
```

### 8.1. Observação sobre blocos transversais

Alguns blocos aparecem como temas próprios, mas também atravessam responsáveis:

* Dados, Conhecimento, Memória e RAG: envolve Pietro, Sávio, Pierre, Pedro e Klaus.
* APIs, MCPs, Bridges e Integrações: envolve Sávio, Pierre, Pedro e Klaus.
* Documentação Interna e Externa: envolve Pietro, Yuri, Alice, Pedro e Sávio.
* Módulos Executores: envolve SagB, Loze e responsáveis de cada área.

Esses blocos devem ser tratados como **transversais**, não como domínio isolado de uma única pessoa.

---

## 9. Mapa dos 12 responsáveis

```text
01_responsaveis/
├── 01_pietro_carboni_padroes_metodologias_estruturas/
├── 02_savio_codare_sistemas/
├── 03_alice_montini_ux_ui/
├── 04_pedro_gazan_seguranca/
├── 05_pierre_zanulli_agentes_ia/
├── 06_klaus_wagen_modelos_ia/
├── 07_yuri_sague_processos/
├── 08_noah_verdili_naming/
├── 09_dante_montoya_ideias/
├── 10_nilo_barret_metodologias/
├── 11_julio_mosqueira_acadb/
└── 12_cesar_tulli_startyb/
```

Cada responsável deve ter, no mínimo:

```text
00_responsavel_escopo.md
01_conversas_base.md
02_definicoes_atuais.md
03_resposta_nova.md
```

### 9.1. Tabela dos 12 responsáveis

| Nº | Responsável     | Bloco                                              | O que define                                                                    | O que não define                                              | Dependências principais                                       |
| -: | --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| 01 | Pietro Carboni  | Padrões, Metodologias e Estruturas Oficiais        | Governança, classificação normativa, Arquitetura Mestra, aprovação final        | Execução técnica ou operacional das áreas                     | Todos os responsáveis, Rodrigues e Kane                       |
| 02 | Sávio Codare    | Sistemas, Arquitetura Técnica e Programação        | Sistemas, repositórios, APIs, Supabase, deploy, módulos, logs técnicos          | Marca, venture, UX conceitual, segurança como regra principal | Alice, Pedro, Pierre, Klaus, Yuri, Pietro                     |
| 03 | Alice Montini   | UX/UI, Experiência e Interface                     | Telas, fluxos, componentes, design system, microcopy, usabilidade               | Código, banco, segurança, agentes, negócio                    | Sávio, Pedro, Pierre, Noah, Pietro                            |
| 04 | Pedro Gazan     | Segurança Digital, Risco e Proteção                | Acessos, credenciais, dados sensíveis, incidentes, risco digital                | Arquitetura completa, UX, modelos de IA, negócio              | Sávio, Pierre, Klaus, Alice, Yuri, Pietro                     |
| 05 | Pierre Zanulli  | Agentes Autônomos, IA e Orquestração               | Agentes, autonomia, memória, tool use, handoff, logs de agentes                 | Segurança principal, modelos globais, UX visual, banco        | Sávio, Pedro, Klaus, Alice, Yuri, Pietro                      |
| 06 | Klaus Wagen     | Modelos de IA, RAI e Radar Tecnológico             | Modelos, fornecedores, custos, termos, retenção, alertas                        | Arquitetura de agentes, implementação, segurança operacional  | Pierre, Sávio, Pedro, Alice, Pietro                           |
| 07 | Yuri Sague      | Processos, Execução, Registros e TaskZei           | Decisão em tarefa, acompanhamento, bloqueios, status, registros operacionais    | Conteúdo técnico das áreas e decisão estratégica              | Todos os responsáveis, Pietro                                 |
| 08 | Noah Verdili    | Naming, Disponibilidade e Banco de Marcas          | Nome, pesquisa, disponibilidade, banco de marcas, uso do B                      | Aprovação final de marca, jurídico formal, plano de negócio   | Dante, César, Alice, Sávio, Jurídico, Pietro                  |
| 09 | Dante Montoya   | Exploração e Classificação Inicial de Ideias       | Ideias brutas, hipóteses, riscos iniciais, destino provável                     | Aprovação de ideia, marca, sistema ou padrão                  | Noah, César, Sávio, Nilo, Júlio, Pierre, Yuri, Pietro         |
| 10 | Nilo Barret     | Metodologias, Frameworks e Estruturas Intelectuais | Métodos, frameworks, matrizes conceituais, modelos mentais                      | Cursos, mentorias, sistemas, marcas, empresas                 | Júlio, Noah, César, Sávio, Pierre, Pietro                     |
| 11 | Júlio Mosqueira | AcadB, Mentorias, Cursos e Trilhas                 | Mentorias, cursos, trilhas, programas educacionais, experiência de aprendizagem | Metodologia base, sistemas, segurança, marcas                 | Nilo, Sávio, Alice, Pedro, Pierre, Klaus, Noah, César, Pietro |
| 12 | César Tulli     | StartyB, Marcas, Empresas e Ventures               | Marcas, empresas, ventures, DOC-000, plano de negócio, organograma              | Produto comum, código, UX, segurança, curso, metodologia      | Dante, Noah, Sávio, Alice, Yuri, Pietro, Rodrigues/Kane       |

---

## 10. Bloco 01 — Pietro Carboni

O bloco do Pietro é a camada de governança geral da Central de Padrões.

### 10.1. Estrutura sugerida do bloco Pietro

```text
central_de_padroes/
└── 01_pietro_carboni_padroes_metodologias_estruturas/
    ├── 00_indice_e_visao_geral/
    │   ├── README.md
    │   ├── indice_da_area.md
    │   ├── escopo_pietro_carboni.md
    │   ├── mapa_dos_documentos_da_area.md
    │   └── status_da_area.md
    │
    ├── 01_governanca_da_central/
    │   ├── governanca_da_central_de_padroes.md
    │   ├── papel_do_pietro_carboni.md
    │   ├── processo_de_aprovacao_final.md
    │   └── criterio_de_entrada_na_central.md
    │
    ├── 02_arquitetura_mestra/
    │   ├── arquitetura_mestra_de_padroes.md
    │   ├── estrutura_sidebar_sagb.md
    │   ├── blocos_principais_da_central.md
    │   └── mapa_de_responsaveis.md
    │
    ├── 03_classificacao_normativa/
    │   ├── tipos_normativos_oficiais.md
    │   ├── matriz_classificacao_normativa.md
    │   └── regra_nao_chamar_tudo_de_protocolo.md
    │
    ├── 04_dependencias_e_conflitos/
    │   ├── matriz_dependencias_entre_areas.md
    │   ├── registro_conflitos_de_escopo.md
    │   └── protocolo_correcao_padrao_conflitante.md
    │
    ├── 05_documentos_canonicos/
    │   ├── protocolo_documento_canonico.md
    │   ├── ciclo_de_vida_documento.md
    │   └── registro_documento_aprovado.md
    │
    ├── checklists/
    ├── matrizes/
    ├── protocolos/
    ├── registros_e_evidencias/
    ├── lacunas_duvidas_validacoes/
    └── documentos_derivados/
```

---

## 11. Blocos dos demais responsáveis

Cada responsável deve criar a própria estrutura seguindo o padrão:

```text
central_de_padroes/
└── [nome_da_area]/
    ├── 00_indice_e_visao_geral/
    ├── 01_principios_politicas_regras/
    ├── 02_[bloco_especifico]/
    ├── 03_[bloco_especifico]/
    ├── 04_[bloco_especifico]/
    ├── checklists/
    ├── matrizes/
    ├── registros_e_evidencias/
    ├── lacunas_duvidas_validacoes/
    └── documentos_derivados/
```

### 11.1. Regra para os blocos dos responsáveis

Cada responsável deve responder:

* o que a área define;
* o que a área não define;
* de quem depende;
* quem depende dela;
* quais documentos precisam nascer primeiro;
* quais checklists são obrigatórios;
* quais matrizes são obrigatórias;
* quais registros provam execução;
* quais riscos de duplicidade existem;
* quais lacunas precisam validação.

---

## 12. Identidade, Classificação e Arquitetura do Ecossistema

Este bloco organiza quem é quem, o que cada coisa é, como se chama, para onde vai e quais registros precisam existir antes de virar execução.

### 12.1. Estrutura do bloco

```text
Identidade, Classificação e Arquitetura do Ecossistema
├── Registro Mestre do Ecossistema
├── Nomes oficiais
├── Nomes em validação
├── Nomes legados
├── Nomes corrigidos
├── Empresas do GrupoB
├── Ventures
├── Produtos
├── Sistemas
├── Apps
├── Plataformas
├── Metodologias
├── Frameworks
├── Mentorias
├── Cursos
├── Programas
├── Campanhas
├── Agentes
├── Clusters estratégicos
├── Relações com empresas do GrupoB
└── Status institucional
```

### 12.2. Regras importantes

* Loze não é gaveta de produtos.
* StartyB não é gaveta de marcas.
* Venture não é pasta.
* Cada item deve ter campos de classificação.
* Nome oficial deve ser separado de nome legado, nome em validação e nome corrigido.

---

## 13. Registro Mestre do Ecossistema

O Registro Mestre do Ecossistema deve ser o cadastro oficial dos itens do GrupoB.

### 13.1. Campos mínimos

```text
Nome oficial
Natureza
Origem
Empresa responsável
Construção tecnológica
Responsável
Status
Tem vida própria?
Cluster
Precisa validação?
Documentos relacionados
```

### 13.2. Naturezas possíveis

* empresa;
* venture;
* produto;
* sistema;
* app;
* plataforma;
* metodologia;
* framework;
* mentoria;
* curso;
* programa;
* campanha;
* agente;
* cliente/operação;
* nome legado;
* nome em validação;
* indefinido.

### 13.3. Status possíveis

* ativo;
* em desenvolvimento;
* rascunho;
* pausado;
* legado;
* em revisão;
* aprovado;
* canônico;
* precisa validação;
* descartado.

---

## 14. Estrutura institucional interna do GrupoB

A estrutura institucional deve mostrar a relação entre GrupoB, Loze, SagB e demais empresas/frentes.

### 14.1. Função esperada

* GrupoB: ecossistema central.
* Loze: casa de tecnologia aplicada e construção de sistemas/plataformas/produtos digitais.
* SagB: sistema/plataforma onde a Central de Padrões aparece e opera.
* StartyB: estruturação de marcas, empresas, ventures e plano de negócio.
* AcadB: educação, mentorias, cursos, trilhas e programas educacionais.
* 3forB: marketing, vendas, expansão e contas.
* AceleraB: aceleração, performance, crescimento e investimento, quando aplicável.
* PapoB: mídia, comunidade, conversas e conteúdo relacional.
* InstitutoB: impacto social, formação, inclusão e projetos institucionais.
* Ziplia: venture/empresa de inteligência artificial para negócios, com vida própria. Precisa manter classificação oficial em Registro Mestre.

### 14.2. Pontos que precisam validação

* lista completa de empresas e frentes oficiais;
* status oficial de cada item;
* responsáveis/CEOs;
* relação entre marcas, produtos e ventures;
* nomes legados e nomes corrigidos;
* jurídico/DPO responsável.

---

## 15. Documentação interna

Documentação interna é tudo que serve para operação, governança, decisão, auditoria, técnica, segurança ou registro do GrupoB.

```text
documentacao/
└── interna/
    ├── padrões internos
    ├── decisões
    ├── registros
    ├── checklists internos
    ├── matrizes internas
    ├── processos operacionais
    ├── documentação técnica interna
    ├── pareceres
    ├── logs
    └── documentos sensíveis
```

### 15.1. Pode ficar interno

* padrões técnicos;
* decisões estratégicas;
* credenciais e acessos;
* logs sensíveis;
* registros de incidente;
* planos internos;
* avaliações de risco;
* documentos de governança;
* conversas brutas;
* documentos ainda em validação.

---

## 16. Documentação externa

Documentação externa é tudo que pode ser publicado ou entregue para usuários, clientes, parceiros ou público.

```text
documentacao/
└── externa/
    ├── guias para usuários
    ├── documentação pública
    ├── documentação de API pública
    ├── manuais de uso
    ├── onboarding externo
    ├── termos visíveis
    ├── páginas de ajuda
    └── materiais publicados
```

### 16.1. Critérios para sair para documentação externa

Antes de publicar externamente, verificar:

* não contém dados sensíveis;
* não contém estratégia interna;
* não contém credenciais;
* não expõe arquitetura crítica;
* passou por revisão de segurança;
* passou por revisão de linguagem/UX;
* está aprovado pelo responsável da área;
* tem validação final de Pietro quando for padrão.

---

## 17. Processo de triagem e ingestão de conhecimento

A triagem organiza conteúdos brutos antes de virarem documentos oficiais.

### 17.1. Estrutura da pasta `99_triagem`

```text
99_triagem/
├── arquivo_morto/
├── 01_compilado_bruto_existente.md
├── 02_novas_informacoes.md
└── 03_documento_base_consolidado_para_aprovacao.md
```

### 17.2. O que entra no `01_compilado_bruto_existente.md`

Entram conteúdos brutos ou sem tratamento final, como:

* conversas de chat;
* extrações de JSON;
* respostas antigas;
* documentos soltos;
* anotações;
* textos históricos;
* materiais que ainda precisam leitura.

### 17.3. O que entra no `02_novas_informacoes.md`

Entram informações já extraídas do bruto, com alguma curadoria:

* achados;
* decisões aparentes;
* conceitos importantes;
* padrões mencionados;
* nomes citados;
* lacunas;
* perguntas;
* pontos que devem virar documento.

### 17.4. O que entra no `03_documento_base_consolidado_para_aprovacao.md`

Entram conteúdos já estruturados para revisão:

* proposta de documento;
* versão consolidada;
* estrutura revisada;
* síntese validável;
* materiais prontos para ir para lousa/canvas.

### 17.5. Quando vai para arquivo morto

O arquivo bruto original copiado para a triagem pode ser mantido em `arquivo_morto/` como cópia de controle depois que seu conteúdo foi incorporado ao `01_compilado_bruto_existente.md`.

O arquivo-mãe original deve permanecer intacto quando possível.

---

## 18. Ciclo de vida dos documentos

```text
conversa_bruta / documento_atual / arquivo_extraido
↓
99_triagem/01_compilado_bruto_existente.md
↓
99_triagem/02_novas_informacoes.md
↓
99_triagem/03_documento_base_consolidado_para_aprovacao.md
↓
lousa/canvas
↓
revisão Pietro
↓
aprovação
↓
fonte canônica / Central de Padrões
```

### 18.1. Regra do documento canônico

Documento canônico não nasce como rascunho em fonte oficial.

Ele deve passar por:

1. bruto;
2. tratamento;
3. consolidação;
4. lousa/canvas;
5. revisão;
6. validação;
7. aprovação;
8. publicação como fonte canônica.

---

## 19. Ciclo de vida dos padrões

```text
prática recorrente
↓
registro bruto
↓
análise
↓
classificação normativa
↓
documento da área
↓
revisão de dependências
↓
validação do responsável
↓
aprovação Pietro
↓
padrão oficial
↓
revisão periódica
```

### 19.1. Status de padrão

* rascunho;
* em análise;
* em revisão;
* aprovado;
* canônico;
* legado;
* suspenso;
* substituído;
* descartado;
* precisa validação.

---

## 20. Tipos normativos oficiais

| Emoji | Tipo               | Uso                                            |
| ----- | ------------------ | ---------------------------------------------- |
| 🔵    | Princípio          | Ideia-base que orienta decisões                |
| 🟣    | Política           | Posição oficial sobre um tema                  |
| 🔴    | Regra              | Obrigação, limite ou proibição                 |
| 🟠    | Padrão             | Formato correto e repetível                    |
| 🟢    | Protocolo          | Sequência obrigatória para situação específica |
| ⚙️    | Processo           | Fluxo completo de ponta a ponta                |
| 🧩    | Procedimento       | Passo técnico ou operacional específico        |
| ✅     | Checklist          | Lista de conferência                           |
| 📊    | Matriz             | Tabela de decisão, classificação ou comparação |
| 🧾    | Registro/Evidência | Ata, log, parecer, histórico ou prova          |
| ⚠️    | Risco              | Ponto de atenção ou vulnerabilidade            |
| 💡    | Recomendação       | Sugestão de melhoria                           |
| 📌    | Decisão            | Decisão registrada                             |
| ❓     | Dúvida             | Item pendente de validação                     |
| 🚨    | Crítico            | Urgente, bloqueador ou alto impacto            |

### 20.1. Regra central

```text
Não chamar tudo de protocolo.
```

### 20.2. Tabela de tipos normativos

| Tipo         | Quando usar                                    | Exemplo                              | Quem valida               |
| ------------ | ---------------------------------------------- | ------------------------------------ | ------------------------- |
| Princípio    | Direção de pensamento                          | Estrutura antes de escala            | Pietro                    |
| Política     | Posição oficial                                | Documento canônico só após validação | Pietro + responsável      |
| Regra        | Obrigação ou proibição                         | Senha não circula em chat comum      | Área responsável + Pietro |
| Padrão       | Formato repetível                              | Estrutura de documento por área      | Pietro                    |
| Protocolo    | Sequência obrigatória para situação específica | Protocolo de incidente               | Responsável + Pietro      |
| Processo     | Fluxo completo                                 | Processo de criação de sistema       | Responsável da área       |
| Procedimento | Passo operacional/técnico                      | Como revisar acesso                  | Responsável da área       |
| Checklist    | Conferência                                    | Checklist antes de deploy            | Responsável da área       |
| Matriz       | Decisão ou classificação                       | Matriz de destino da ideia           | Pietro + área             |
| Registro     | Evidência                                      | Registro de decisão                  | Yuri + Pietro             |

---

## 21. Matrizes obrigatórias

### 21.1. Matriz de Classificação Normativa

Serve para decidir se algo é princípio, política, regra, padrão, protocolo, processo, procedimento, checklist, matriz ou registro.

### 21.2. Matriz de Responsabilidade por Área

Serve para identificar quem cuida do quê e evitar que uma área assuma responsabilidade de outra.

### 21.3. Matriz de Dependência entre Áreas

Serve para mapear quando uma decisão depende de outra área.

### 21.4. Matriz de Maturidade do Documento

```text
bruto → tratado → consolidado → aprovado → canônico
```

### 21.5. Matriz de Destino da Ideia no Ecossistema

Define se uma ideia vai para Dante, Noah, César, Loze, AcadB, Nilo, Pietro ou outro responsável.

### 21.6. Matriz de Uso Interno x Externo

Classifica documento como público, interno, restrito ou sensível.

### 21.7. Matriz de Reaproveitamento Técnico

Antes de criar sistema, módulo, tabela ou componente novo, verifica se já existe algo reutilizável.

### 21.8. Matriz de Status de Padrão

Classifica padrão como rascunho, em revisão, aprovado, canônico, legado, suspenso ou substituído.

---

## 22. Checklists obrigatórios

1. Checklist antes de criar novo padrão.
2. Checklist antes de aprovar documento canônico.
3. Checklist antes de transformar conversa em documento.
4. Checklist antes de publicar documentação externa.
5. Checklist antes de criar módulo técnico.
6. Checklist antes de criar marca/nome.
7. Checklist antes de enviar demanda para Loze.
8. Checklist antes de abrir plano StartyB.
9. Checklist de revisão de dependências entre áreas.
10. Checklist de encerramento de lacuna.

### 22.1. Exemplo — Checklist antes de criar novo padrão

* Existe necessidade recorrente?
* Existe responsável?
* A área correta foi identificada?
* Já existe padrão parecido?
* Existem dependências com outras áreas?
* O tipo normativo foi classificado corretamente?
* Há risco de duplicidade?
* Precisa validação de Pietro?
* Precisa virar documento canônico?

---

## 23. Protocolos reais obrigatórios

Protocolos devem ser poucos e bem definidos.

### 23.1. Protocolo de Aprovação de Padrão

Quando usar: quando uma proposta precisa virar padrão oficial.

Passos:

1. registrar proposta;
2. classificar tipo normativo;
3. identificar responsável;
4. revisar dependências;
5. validar com área responsável;
6. resolver conflitos;
7. enviar para Pietro;
8. aprovar, devolver ou rejeitar;
9. registrar decisão.

Saída esperada: padrão aprovado, pendente ou rejeitado.

### 23.2. Protocolo de Documento Canônico

Quando usar: quando um documento consolidado deve virar fonte oficial.

Passos:

1. confirmar origem do documento;
2. verificar se passou por triagem;
3. revisar conteúdo;
4. validar responsável;
5. revisar risco interno/externo;
6. aprovar versão;
7. registrar como canônico;
8. publicar na Central.

### 23.3. Protocolo de Correção de Padrão Conflitante

Quando usar: quando dois padrões entram em conflito.

Passos:

1. identificar conflito;
2. listar áreas envolvidas;
3. registrar impacto;
4. convocar responsáveis;
5. definir prevalência;
6. ajustar documento;
7. registrar decisão.

### 23.4. Protocolo de Publicação de Documentação Externa

Quando usar: antes de qualquer documento ser publicado para fora.

Passos:

1. classificar conteúdo;
2. remover dados sensíveis;
3. revisar linguagem;
4. revisar segurança;
5. validar responsável;
6. aprovar publicação;
7. registrar versão publicada.

### 23.5. Protocolo de Revisão de Dependência entre Áreas

Quando usar: quando uma área cria padrão que toca outra área.

Passos:

1. registrar dependência;
2. identificar área impactada;
3. enviar para revisão;
4. registrar parecer;
5. ajustar documento;
6. aprovar ou marcar pendência.

### 23.6. Protocolo de Registro de Decisão Estratégica

Quando usar: quando uma decisão altera padrão, estrutura, nomenclatura, responsável ou direção.

Passos:

1. registrar decisão;
2. registrar motivo;
3. registrar responsável;
4. registrar impacto;
5. registrar data;
6. vincular documentos afetados.

### 23.7. Protocolo de Ingestão de Conteúdo Bruto em `99_triagem`

Quando usar: quando conversas, documentos ou extrações precisam entrar na base de triagem.

Passos:

1. identificar fonte;
2. definir destino por predominância temática;
3. copiar conteúdo bruto para `01_compilado_bruto_existente.md`;
4. copiar arquivo de origem para `arquivo_morto/` como controle, se aplicável;
5. registrar ingestão;
6. marcar como bruto não tratado.

### 23.8. Protocolo de Transformação de Bruto em Documento Consolidado

Quando usar: quando a triagem já tem material suficiente para virar documento base.

Passos:

1. revisar conteúdo bruto;
2. extrair novas informações;
3. preencher `02_novas_informacoes.md`;
4. consolidar estrutura em `03_documento_base_consolidado_para_aprovacao.md`;
5. criar documento na lousa/canvas;
6. enviar para revisão;
7. aprovar ou devolver.

---

## 24. Registros e evidências obrigatórios

Registros mínimos da Central:

* Registro de decisão;
* Registro de padrão aprovado;
* Registro de padrão em revisão;
* Registro de exceção;
* Registro de dependência;
* Registro de lacuna;
* Registro de conflito entre áreas;
* Registro de documento canônico;
* Registro de documento legado;
* Registro de ingestão de conteúdo;
* Registro de publicação externa;
* Registro de alteração de nomenclatura.

### 24.1. Campos mínimos de um registro

```text
Data
Responsável
Área
Item afetado
Tipo de registro
Descrição
Motivo
Decisão ou status
Documento relacionado
Próxima ação
Validação necessária
```

---

## 25. Dependências entre áreas

### 25.1. Tabela de dependências entre áreas

| Área origem | Depende de | Tema                                  | Motivo                                        | Arquivo de dependência sugerido     |
| ----------- | ---------- | ------------------------------------- | --------------------------------------------- | ----------------------------------- |
| Sávio       | Alice      | Front-end e componentes               | Implementação precisa respeitar UX/UI         | dependencias_com_alice_montini.md   |
| Sávio       | Pedro      | Segurança técnica aplicada            | APIs, RLS, credenciais e dados sensíveis      | dependencias_com_pedro_gazan.md     |
| Sávio       | Pierre     | MCPs e integrações usadas por agentes | Integrações técnicas podem operar agentes     | dependencias_com_pierre_zanulli.md  |
| Alice       | Sávio      | Viabilidade técnica                   | Tela precisa ser implementável                | dependencias_com_savio_codare.md    |
| Pedro       | Sávio      | Implementação dos controles           | Segurança precisa virar configuração técnica  | dependencias_com_savio_codare.md    |
| Pierre      | Klaus      | Modelos de IA                         | Agentes usam modelos avaliados por Klaus      | dependencias_com_klaus_wagen.md     |
| Pierre      | Pedro      | Risco de autonomia e dados            | Agentes podem acessar dados sensíveis         | dependencias_com_pedro_gazan.md     |
| Klaus       | Pedro      | Termos, retenção e privacidade        | Fornecedor de IA pode envolver risco de dados | dependencias_com_pedro_gazan.md     |
| Yuri        | Todos      | Execução e rastreabilidade            | Decisões viram tarefas e processos            | dependencias_com_responsaveis.md    |
| Noah        | César      | Nome de marca/empresa/venture         | Naming precisa de validação de negócio        | dependencias_com_cesar_tulli.md     |
| Noah        | Jurídico   | Risco de marca e registro             | Pesquisa preliminar não substitui jurídico    | dependencias_com_juridico.md        |
| Dante       | Todos      | Destino da ideia                      | Ideia pode ir para várias áreas               | dependencias_com_responsaveis.md    |
| Nilo        | Júlio      | Metodologia que vira curso/mentoria   | Método pode virar produto educacional         | dependencias_com_julio_mosqueira.md |
| Júlio       | Nilo       | Curso baseado em metodologia          | Educação precisa respeitar método base        | dependencias_com_nilo_barret.md     |
| César       | Noah       | Nome e banco de marcas                | Marca/empresa precisa naming validado         | dependencias_com_noah_verdili.md    |
| César       | Sávio      | Venture que vira tecnologia           | Empresa pode exigir app/sistema/plataforma    | dependencias_com_savio_codare.md    |

---

## 26. Riscos de duplicidade e conflito de escopo

### 26.1. Tabela de riscos

| Risco                                 | Áreas envolvidas   | Exemplo                                        | Como evitar                                            |
| ------------------------------------- | ------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| Segurança técnica x segurança digital | Sávio e Pedro      | RLS ou credencial sendo tratada só como código | Sávio aplica, Pedro define regra de segurança          |
| UX implementado x UX conceitual       | Sávio e Alice      | Componente criado sem padrão visual            | Alice define experiência, Sávio implementa             |
| Agente de IA x modelo de IA           | Pierre e Klaus     | Agente escolhe modelo sem radar                | Pierre define uso operacional, Klaus recomenda modelos |
| Metodologia x curso                   | Nilo e Júlio       | Método vira curso sem estrutura educacional    | Nilo estrutura método, Júlio estrutura aprendizagem    |
| Marca x empresa                       | Noah e César       | Nome aprovado como se fosse negócio validado   | Noah dá parecer; César estrutura negócio               |
| Produto digital x venture             | Sávio/Loze e César | App vira empresa sem plano                     | Produto comum vai para Loze; venture vai para StartyB  |
| Processo x protocolo                  | Yuri e Pietro      | Toda rotina sendo chamada protocolo            | Usar classificação normativa                           |
| Documento bruto x documento oficial   | Todos              | Conversa colada como padrão final              | Seguir fluxo 99_triagem → canvas → aprovação           |
| Loze como gaveta de produtos          | Sávio/Kane/Pietro  | Tudo técnico sendo chamado produto Loze        | Usar Registro Mestre com campos                        |
| StartyB como gaveta de marcas         | César/Noah/Pietro  | Todo nome indo para StartyB                    | Usar classificação por natureza e destino              |

---

## 27. Lacunas e validações pendentes

| Lacuna                                           | Impacto                                            | Quem valida                | Prioridade | Recomendação                                 |
| ------------------------------------------------ | -------------------------------------------------- | -------------------------- | ---------- | -------------------------------------------- |
| Lista completa de empresas/frentes oficiais      | Registro Mestre incompleto                         | Rodrigues/Pietro           | Alta       | Consolidar inventário institucional          |
| Status oficial de Ziplia, Dathex e itens legados | Confusão de classificação                          | Rodrigues/Kane/Pietro      | Alta       | Validar natureza e status no Registro Mestre |
| Responsável jurídico/DPO                         | Risco em naming, LGPD e contratos                  | Rodrigues/Kane             | Alta       | Definir responsável ou frente jurídica       |
| Política de uso do “B”                           | Nomes podem ficar inconsistentes                   | Rodrigues/Kane/Pietro/Noah | Alta       | Criar política oficial                       |
| Documentação externa                             | Risco de publicar material interno                 | Pietro/Pedro/Alice/Sávio   | Alta       | Criar protocolo de publicação externa        |
| Status físico da estrutura proposta              | Pode existir diferença entre proposta e pasta real | Pietro/Cássio              | Média      | Fazer auditoria de estrutura física          |
| Critério de canonicidade                         | Rascunho pode virar fonte indevida                 | Pietro                     | Alta       | Aprovar protocolo de documento canônico      |
| Matriz de destino de ideias                      | Ideias podem ir para área errada                   | Pietro/Dante/César/Kane    | Alta       | Criar matriz oficial                         |
| Matriz de reaproveitamento técnico               | Risco de retrabalho técnico                        | Sávio/Pietro               | Alta       | Criar matriz antes de novos módulos          |

---

## 28. Versão revisada da Arquitetura Mestra

A versão revisada recomendada é:

```text
central_de_padroes/
├── 00_indice_geral.md
├── 01_consolidado_geral.md
│
├── 01_responsaveis/
│   ├── 01_pietro_carboni_padroes_metodologias_estruturas/
│   ├── 02_savio_codare_sistemas/
│   ├── 03_alice_montini_ux_ui/
│   ├── 04_pedro_gazan_seguranca/
│   ├── 05_pierre_zanulli_agentes_ia/
│   ├── 06_klaus_wagen_modelos_ia/
│   ├── 07_yuri_sague_processos/
│   ├── 08_noah_verdili_naming/
│   ├── 09_dante_montoya_ideias/
│   ├── 10_nilo_barret_metodologias/
│   ├── 11_julio_mosqueira_acadb/
│   └── 12_cesar_tulli_startyb/
│
├── 02_documentos_atuais/
│
├── 03_arquitetura_mestra/
│   ├── arquitetura_mestra_e_governanca.md
│   ├── sidebar_central_de_padroes.md
│   ├── mapa_blocos_principais.md
│   └── mapa_responsaveis.md
│
├── 04_identidade_classificacao_ecossistema/
│   ├── registro_mestre_ecossistema.md
│   ├── nomenclatura_oficial.md
│   ├── classificacao_iniciativas.md
│   ├── matriz_destino_ecossistema.md
│   └── politica_uso_do_b.md
│
├── 05_tipos_normativos/
│   ├── tipos_normativos_oficiais.md
│   ├── matriz_classificacao_normativa.md
│   └── regra_nao_chamar_tudo_de_protocolo.md
│
├── 06_matrizes_gerais/
├── 07_checklists_gerais/
├── 08_protocolos_gerais/
├── 09_registros_e_evidencias/
├── 10_documentacao_interna/
├── 11_documentacao_externa/
└── 12_validacoes_pendencias_decisoes/
```

---

## 29. Ordem recomendada de criação dos documentos

### Primeiro

1. `arquitetura_mestra_e_governanca.md`
2. `tipos_normativos_oficiais.md`
3. `mapa_responsaveis.md`
4. `registro_mestre_ecossistema.md`
5. `protocolo_documento_canonico.md`
6. `protocolo_ingestao_99_triagem.md`
7. `matriz_responsabilidade_por_area.md`
8. `matriz_dependencias_entre_areas.md`

### Depois

9. `matriz_destino_ecossistema.md`
10. `politica_uso_do_b.md`
11. `checklist_aprovacao_documento_canonico.md`
12. `checklist_publicacao_documentacao_externa.md`
13. `protocolo_aprovacao_padrao.md`
14. `registro_decisao.md`
15. `registro_dependencia.md`

### Por último

16. guias externos;
17. documentação pública;
18. manuais de usuário;
19. documentos de treinamento;
20. automações e telas finais no SagB.

---

## 30. Síntese final

Minha leitura final é que a Central de Padrões deve funcionar como a camada normativa do GrupoB / Loze dentro do SagB. Ela deve organizar padrões, responsáveis, documentos, matrizes, checklists, registros, dependências e aprovações, sem substituir os módulos executores.

O papel do Pietro Carboni é consolidar, classificar, cruzar dependências e aprovar a versão final, garantindo que cada área tenha autonomia para produzir seus padrões, mas sem duplicidade, conflito ou perda de rastreabilidade.

A estrutura atual já tem uma base forte: responsáveis definidos, pasta de responsáveis criada, fluxo de documentos atuais, processo `99_triagem`, Missão 1 e Missão 2, e visão clara de que documentos brutos não viram padrão automaticamente.

As principais lacunas são: finalizar o Registro Mestre do Ecossistema, validar estrutura física completa da Central, definir política de uso do “B”, formalizar documentação externa, aprovar matriz de destino de ideias e estabelecer o protocolo de documento canônico.

---

# Próximas decisões para Rodrigues validar

1. Aprovar o nome definitivo: **Arquitetura Mestra de Padrões**.
2. Aprovar o bloco **Identidade, Classificação e Arquitetura do Ecossistema** como seção oficial da Central.
3. Validar a estrutura física proposta além das pastas já criadas.
4. Definir responsável jurídico/DPO ou frente equivalente.
5. Validar se Ziplia, Dathex e demais nomes legados entram como empresa, venture, produto, legado ou em validação.

---

# Primeiras 10 ações recomendadas

1. Criar ou confirmar fisicamente a pasta `03_arquitetura_mestra/`.
2. Salvar este documento como base da Arquitetura Mestra.
3. Criar o documento `tipos_normativos_oficiais.md`.
4. Criar o documento `mapa_responsaveis.md` com os 12 responsáveis.
5. Criar o documento `registro_mestre_ecossistema.md`.
6. Criar a `matriz_classificacao_normativa.md`.
7. Criar a `matriz_dependencias_entre_areas.md`.
8. Criar o `protocolo_documento_canonico.md`.
9. Criar o `protocolo_ingestao_99_triagem.md`.
10. Consolidar as respostas da Missão 2 dos 12 responsáveis.
