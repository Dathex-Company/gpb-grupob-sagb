# Auditoria e Revisão do Bloco Sistemas, Arquitetura Técnica e Programação — Central de Padrões

**Bloco:** Sistemas, Arquitetura Técnica e Programação
**Responsável:** Sávio Codare
**Destino:** Central de Padrões do GrupoB / Loze dentro do SagB
**Solicitante:** Pietro Carboni / Rodrigues
**Status:** revisão crítica da Missão 2 — versão para consolidação

---

## 1. Objetivo da auditoria

Esta auditoria tem como objetivo revisar criticamente a estrutura criada na Missão 1 para o bloco **Sistemas, Arquitetura Técnica e Programação**, cruzando a estrutura proposta com tudo que foi discutido no chat sobre Loze, SagB, Central de Padrões, documentação técnica, módulos, repositórios, sistemas, APIs, Supabase, deploy, versionamento, logs, erros, Sala Dev e migração técnica.

A missão não é documentar a Central de Padrões inteira. O foco é somente o bloco técnico sob responsabilidade de Sávio Codare.

O objetivo prático é responder:

* a estrutura criada está completa?
* o que ficou correto?
* o que ficou genérico demais?
* o que apareceu no chat e não entrou?
* o que precisa ser movido, removido ou reclassificado?
* quais documentos devem nascer primeiro?
* quais dependências precisam ficar explícitas?
* qual é a versão revisada da estrutura do bloco?

Esta auditoria também separa claramente o que pertence à área técnica do que pertence a outras áreas, como estrutura institucional do GrupoB, marcas, ventures, métodos, UX/UI, segurança digital, agentes autônomos e governança normativa.

---

## 2. Escopo analisado

O bloco analisado é:

```text
sistemas_arquitetura_tecnica_programacao
```

Este bloco cobre:

* arquitetura técnica de sistemas;
* programação;
* repositórios;
* caminhos e pastas técnicas;
* front-end técnico;
* back-end;
* services;
* Supabase;
* banco de dados técnico;
* migrations;
* APIs;
* endpoints;
* integrações técnicas;
* bridges;
* MCPs técnicos;
* módulos plugáveis;
* documentação técnica;
* deploy;
* ambientes;
* variáveis de ambiente;
* testes;
* QA técnico;
* logs técnicos;
* observabilidade técnica;
* versionamento;
* branches;
* commits;
* releases;
* catálogos técnicos;
* Quarentena Técnica;
* refatoração;
* migração;
* legado técnico;
* dependências e bibliotecas;
* handoff técnico;
* critérios de pronto técnico;
* Sala Dev / esteira técnica.

Não cobre como responsabilidade principal:

* naming institucional;
* classificação de empresas, marcas, ventures e métodos;
* estrutura de plano de negócio;
* estratégia empresarial;
* UX/UI conceitual;
* design system visual final;
* política de segurança digital;
* credenciais, riscos e incidentes de segurança como governança;
* autonomia, memória e comportamento de agentes;
* metodologia, framework e ativo intelectual;
* cursos, trilhas e programas educacionais;
* decisão estratégica final da Loze.

---

## 3. Fontes consideradas

Foram considerados os seguintes pontos discutidos no chat:

1. Estrutura criada na Missão 1 para o bloco técnico.
2. Documento anterior **Padrões de Sistemas, Arquitetura Técnica e Programação — GrupoB**.
3. Discussões sobre Loze como casa de tecnologia aplicada do GrupoB.
4. Decisão de Dathex como legado técnico.
5. Separação entre Produto, Conta Interna e Operação.
6. Discussões sobre QG da 3forB, Plataforma AcadB, VOX/Ziplia e SagB by Loze.
7. Definição da estrutura macro do GrupoB:

   * `01_empresas_b/`
   * `02_ventures/`
   * `03_metodos/`
8. Separação entre estrutura institucional e estrutura técnica.
9. Criação da estrutura inicial da Loze em `02_ventures/loze/`.
10. Preparação do destino futuro do SagB em `sagb/09_repositorios/sagb_web/`.
11. Discussões sobre nomenclatura técnica sem siglas inventadas, sem duplo underline, sem hífen e com `snake_case` quando necessário.
12. Discussões sobre Central de Padrões, Loze Docs, ADRs, Quarentena Técnica e Matriz Onde Mora.
13. Discussões sobre padrão de módulos plugáveis do SagB versus possível padrão geral Loze.
14. Validação do Pietro sobre o escopo do Sávio.
15. Ajustes propostos por Pietro para incluir segurança técnica aplicada, performance, refatoração, dependências, handoff técnico e critérios de pronto técnico.
16. Discussões sobre Sala Dev / esteira técnica com Roo Code / VS Code.
17. Discussões sobre necessidade de separar tecnologia interna da Loze e soluções para clientes.
18. Discussões sobre migração segura do SagB.

---

## 4. Resumo da estrutura criada na Missão 1

A estrutura criada na Missão 1 propôs o bloco:

```text
central_de_padroes/
└── sistemas_arquitetura_tecnica_programacao/
```

Com os principais blocos:

```text
00_indice_e_visao_geral/
01_principios_politicas_regras/
02_arquitetura_de_sistemas/
03_estrutura_de_pastas_e_repositorios/
04_documentacao_tecnica/
05_frontend_tecnico/
06_backend_services_e_funcoes/
07_supabase_banco_e_dados_tecnicos/
08_apis_integracoes_bridges_mcps/
09_modulos_plugaveis_templates_reuso/
10_logs_erros_observabilidade_tecnica/
11_qa_testes_validacao/
12_deploy_ambientes_publicacao/
13_versionamento_branches_commits_releases/
14_catalogos_tecnicos/
15_quarentena_tecnica/
16_sala_dev_esteira_tecnica/
17_seguranca_tecnica_aplicada/
18_performance_otimizacao/
19_refatoracao_migracao_legado/
20_dependencias_pacotes_bibliotecas/
21_handoff_prd_tecnico/
22_criterios_de_pronto_tecnico/
23_checklists/
24_matrizes/
25_registros_e_evidencias/
26_lacunas_duvidas_validacoes/
27_documentos_derivados/
```

A estrutura já veio mais madura do que a primeira versão inicial, porque incorporou os ajustes de Pietro e separou com mais clareza o que é técnico do que é institucional.

---

## 5. O que está correto na estrutura atual

### 📌 5.1. O escopo técnico está correto

A estrutura está alinhada com a responsabilidade de Sávio: sistemas, arquitetura técnica, programação, repositórios, documentação técnica, Supabase, APIs, deploy, testes, logs, versionamento e catálogos técnicos.

### 📌 5.2. A separação institucional x técnica ficou correta

Ficou claro que Sávio não define:

* nome de marca;
* classificação de ventures;
* classificação de métodos;
* estrutura institucional do GrupoB;
* estratégia de empresa;
* naming;
* plano de negócio.

Sávio define a camada técnica que será aplicada por produtos e sistemas.

### 📌 5.3. A inclusão de caminhos e repositórios está correta

O bloco `03_estrutura_de_pastas_e_repositorios/` é necessário, porque a área técnica precisa definir:

* onde fica código;
* onde ficam repositórios;
* onde ficam docs técnicos;
* onde fica ADR;
* onde ficam logs técnicos;
* como nomear repos;
* como separar produto, repo e componente.

### 📌 5.4. A inclusão de Quarentena Técnica é correta

A Quarentena Técnica é crítica para migrações, refatorações e limpeza de sistemas existentes, principalmente o SagB.

### 📌 5.5. A inclusão de Refatoração, Migração e Legado é correta

Pietro acertou ao sugerir esse bloco, porque a Loze não vai apenas criar sistemas novos. Ela também vai reorganizar, migrar e limpar sistemas existentes.

### 📌 5.6. A inclusão da Sala Dev é correta

A Sala Dev / Esteira Técnica apareceu com força no chat, envolvendo agentes técnicos, workflows, handoffs, gates, logs e runs. Deve estar no bloco técnico, com dependência de Pierre quando envolver agentes autônomos.

### 📌 5.7. A estrutura respeita dependências

A estrutura já indica dependência com:

* Alice para UX/UI;
* Pedro Gazan para segurança;
* Pierre para agentes e IA;
* Pietro para padrão oficial;
* Cássio para viabilidade técnica;
* Kane/Rodrigues para decisão estratégica.

---

## 6. O que ficou incompleto

### ❓ 6.1. Falta separar melhor “padrões canônicos” de “templates operacionais”

Algumas pastas misturam documentos canônicos, templates e checklists. Exemplo:

```text
04_documentacao_tecnica/
```

Contém tanto `loze_das_documentacao_arquitetura_sistemas.md` quanto `template_adr.md` e `template_readme_repo.md`.

Isso é aceitável, mas a estrutura precisa indicar que:

* documentos canônicos explicam o padrão;
* templates são modelos de uso;
* checklists validam execução;
* registros provam que algo foi feito.

### ❓ 6.2. Falta bloco explícito para “ambientes locais e instalação”

O bloco de deploy cobre ambientes, mas o chat trouxe também necessidade de rodar sistemas localmente, clonar GitHub, executar `npm install`, `npm run dev`, `npm run build` e validar ambiente.

Isso pode ficar dentro de:

```text
12_deploy_ambientes_publicacao/
```

mas precisa de arquivos mais explícitos:

```text
padrao_ambiente_local.md
checklist_setup_local.md
```

### ❓ 6.3. Falta explicitar “migração de repositório local”

A migração do `Z:\SagB` para o novo caminho da Loze mostrou que precisamos de um padrão próprio para migração local segura de repositório.

Deve entrar em:

```text
19_refatoracao_migracao_legado/
```

com arquivo:

```text
checklist_migracao_repositorio_local.md
```

### ❓ 6.4. Falta definir padrão para produtos técnicos dentro da Loze

Foi discutido que produtos técnicos como SagB, VOX, QG 3forB e Plataforma AcadB devem ter estrutura semelhante, mas sem siglas inventadas e sem duplo underline.

Isso precisa entrar em:

```text
03_estrutura_de_pastas_e_repositorios/
```

com documento próprio:

```text
padrao_produtos_tecnicos_loze.md
```

### ❓ 6.5. Falta documento para “tecnologia interna x soluções para clientes”

A discussão sobre Loze mostrou uma lacuna crítica: a Loze tem tecnologia para ela mesma e soluções que entrega para clientes/contas internas.

Isso deve ser documentado tecnicamente em:

```text
03_estrutura_de_pastas_e_repositorios/
```

ou em:

```text
02_arquitetura_de_sistemas/
```

Arquivo recomendado:

```text
padrao_tecnologia_interna_vs_solucoes_para_clientes.md
```

### ❓ 6.6. Falta diferenciar MCP técnico de MCP de agente

O bloco `08_apis_integracoes_bridges_mcps/` inclui MCPs técnicos. Precisa ficar claro que:

* Sávio cuida da integração técnica do MCP;
* Pierre cuida do uso do MCP por agentes;
* Pedro Gazan valida riscos, credenciais e acessos.

### ❓ 6.7. Falta tratar documentação pública, interna e restrita

A ideia de Loze Docs e documentação estilo Odoo apareceu no chat. A estrutura atual não separa bem:

* documentação pública;
* documentação interna;
* documentação restrita;
* documentação técnica sensível.

Isso deve entrar em `04_documentacao_tecnica/` com dependência de Pietro, Alice e Pedro Gazan.

---

## 7. O que apareceu no chat e não entrou na estrutura

### 💡 7.1. Padrão de migração manual do SagB

A necessidade de preparar checklist de migração do SagB apareceu depois da estrutura. Precisa entrar.

Destino sugerido:

```text
19_refatoracao_migracao_legado/checklist_migracao_repositorio_local.md
```

### 💡 7.2. Padrão para produtos técnicos da Loze

Exemplos discutidos:

* `sagb/` com repo `sagb_web/`;
* `vox/` com repos `vox_web/`, `vox_mobile/`, `vox_api/`;
* `qg_3forb/` com repo `qg_3forb_web/`;
* `plataforma_acadb/` com repo `plataforma_acadb_web/`.

Destino sugerido:

```text
03_estrutura_de_pastas_e_repositorios/padrao_produtos_tecnicos_loze.md
```

### 💡 7.3. Regra de não usar sigla inventada

A discussão rejeitou `loz` e o duplo underline. Isso precisa virar regra técnica de nomenclatura.

Destino sugerido:

```text
03_estrutura_de_pastas_e_repositorios/padrao_nomes_repositorios.md
```

### 💡 7.4. Separação entre estrutura institucional e caminho técnico

A árvore institucional:

```text
01_empresas_b/
02_ventures/
03_metodos/
```

não é responsabilidade principal de Sávio, mas Sávio precisa respeitar os caminhos técnicos derivados dela.

Destino sugerido:

```text
03_estrutura_de_pastas_e_repositorios/dependencia_com_estrutura_institucional.md
```

### 💡 7.5. Checklist para criar estrutura de produto antes de mover código

A criação da estrutura da Loze e do SagB antes da migração mostrou que deve existir um checklist próprio.

Destino sugerido:

```text
23_checklists/checklist_preparar_produto_tecnico.md
```

### 💡 7.6. Modelo de decisão de preparação de migração

Foi criado `decisao_001_preparacao_migracao_sagb_para_loze.md`. Isso deve virar modelo.

Destino sugerido:

```text
25_registros_e_evidencias/modelo_decisao_migracao_tecnica.md
```

### 💡 7.7. Índices de navegação para macro pastas técnicas

Cássio sugeriu criar índices de navegação. Isso pode virar padrão técnico para produtos e repos.

Destino sugerido:

```text
04_documentacao_tecnica/padrao_indices_navegacao_tecnica.md
```

---

## 8. Itens que devem ser adicionados

1. `padrao_produtos_tecnicos_loze.md`
2. `padrao_tecnologia_interna_vs_solucoes_para_clientes.md`
3. `checklist_migracao_repositorio_local.md`
4. `checklist_setup_local.md`
5. `padrao_ambiente_local.md`
6. `modelo_decisao_migracao_tecnica.md`
7. `dependencia_com_estrutura_institucional.md`
8. `padrao_documentacao_publica_interna_restrita.md`
9. `matriz_produto_repo_componente.md`
10. `padrao_nome_produto_repo_componente.md`
11. `checklist_preparar_produto_tecnico.md`
12. `modelo_status_produto_tecnico.md`
13. `padrao_indices_navegacao_tecnica.md`

---

## 9. Itens que devem ser removidos ou movidos

### 9.1. Nada deve ser removido agora

A estrutura da Missão 1 não deve ser apagada. A recomendação é ajustar e complementar.

### 9.2. Possível ajuste: reduzir duplicidade entre `23_checklists/` e checklists dentro de blocos

Hoje há checklists dentro dos blocos específicos e também uma pasta geral `23_checklists/`.

Recomendação:

* checklists específicos podem ficar no bloco temático;
* `23_checklists/` deve funcionar como índice consolidado ou espelho de checklists principais;
* evitar duplicação de conteúdo.

### 9.3. Possível ajuste: `27_documentos_derivados/` não deve virar pasta de versões finais duplicadas

Os documentos canônicos devem morar nos blocos temáticos. A pasta `27_documentos_derivados/` deve listar e controlar documentos derivados, não duplicar todos.

Recomendação:

* manter `lista_documentos_derivados.md`;
* usar links/referências para documentos finais nos blocos correspondentes;
* evitar cópia duplicada de `loze_dev.md`, `loze_api.md`, etc., se eles já estiverem nos blocos próprios.

### 9.4. Possível ajuste: `17_seguranca_tecnica_aplicada/` deve ter nome claro

Manter o bloco, mas explicitar que ele trata de aplicação técnica, não governança de segurança.

---

## 10. Duplicidades e conflitos de escopo

| Tema                              | Possível conflito                             | Resolução recomendada                                                     |
| --------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| Estrutura institucional de pastas | Pode parecer responsabilidade de Sávio        | Sávio só define aplicação técnica dos caminhos e repositórios             |
| Segurança técnica aplicada        | Pode conflitar com Pedro Gazan                | Pedro define política; Sávio implementa tecnicamente                      |
| UX técnico                        | Pode conflitar com Alice                      | Alice define experiência; Sávio implementa componentes e padrões técnicos |
| MCP técnico                       | Pode conflitar com Pierre                     | Sávio define conexão técnica; Pierre define uso por agentes               |
| Logs técnicos                     | Pode conflitar com logs de segurança          | Logs técnicos com Sávio; logs de segurança e incidente com Pedro          |
| Documentação técnica              | Pode conflitar com documentação institucional | Técnica com Sávio; estrutura normativa com Pietro                         |
| Módulos plugáveis SagB            | Pode virar padrão geral sem validação         | Fazer auditoria SagB x Loze antes de oficializar LOZE-MOD                 |
| Catálogo técnico                  | Pode cruzar com BI ou governança              | Catálogo técnico registra artefatos técnicos, não indicadores de negócio  |
| Sala Dev                          | Pode cruzar com agentes autônomos             | Esteira técnica com Sávio; agente/autonomia com Pierre                    |

---

## 11. Dependências com outras áreas

| Tema                                     | Depende de qual área   | Motivo                                                      | Arquivo de dependência sugerido              |
| ---------------------------------------- | ---------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| Governança de padrões                    | Pietro Carboni         | Aprovação normativa e classificação correta                 | `dependencias_com_pietro_carboni.md`         |
| Viabilidade técnica                      | Cássio Mendes          | Validar execução real no código, repo e deploy              | `dependencias_com_cassio_mendes.md`          |
| UX/UI                                    | Alice Montini          | Validar telas, componentes, experiência e microcopy         | `dependencias_com_alice_montini.md`          |
| Segurança, RLS, tokens e dados sensíveis | Pedro Gazan            | Definir política de segurança, risco e acessos              | `dependencias_com_pedro_gazan.md`            |
| Agentes, IA e MCPs usados por agentes    | Pierre Zanulli         | Definir autonomia, memória, tool use e comportamento        | `dependencias_com_pierre_zanulli.md`         |
| Estratégia Loze                          | Kane/Rodrigues         | Decisões estratégicas de produtos, prioridades e estrutura  | `dependencias_com_kane_rodrigues.md`         |
| Estrutura institucional do GrupoB        | Pietro/César/Nilo/Yuri | Sávio só usa a estrutura como base técnica, não a define    | `dependencia_com_estrutura_institucional.md` |
| Métodos                                  | Nilo Barret            | Métodos não são sistemas, mas podem virar produtos digitais | `dependencias_com_nilo_barret.md`            |
| AcadB                                    | Júlio Mosqueira        | Métodos e sistemas podem virar trilhas/cursos               | `dependencias_com_julio_mosqueira.md`        |

---

## 12. Riscos de manter a estrutura como está

### 🚨 12.1. Risco de duplicar checklists

Se cada bloco tiver checklist e a pasta `23_checklists/` também tiver versões próprias, pode haver divergência.

Recomendação: criar `indice_checklists_tecnicos.md` e manter o conteúdo principal em um único lugar.

### 🚨 12.2. Risco de oficializar padrão SagB como padrão Loze sem auditoria

O padrão de módulos plugáveis do SagB pode ser bom, mas não deve subir automaticamente para Loze.

Recomendação: manter `analise_sagb_vs_loze_modulos.md` como documento obrigatório antes de LOZE-MOD final.

### 🚨 12.3. Risco de confundir estrutura institucional com técnica

A discussão de `01_empresas_b`, `02_ventures` e `03_metodos` não é do Sávio, mas afeta caminhos técnicos. Se isso não ficar claro, o bloco técnico pode assumir escopo errado.

Recomendação: criar documento de dependência com estrutura institucional.

### 🚨 12.4. Risco de migração errada do SagB

O SagB é grande, pesado e já complexo. Mover sem checklist pode quebrar Git, Netlify, env vars ou caminhos locais.

Recomendação: criar checklist de migração manual antes de mover.

### 🚨 12.5. Risco de nome técnico inconsistente

A conversa já rejeitou sigla inventada (`loz`) e duplo underline. Sem padrão, produtos podem nascer com nomes confusos.

Recomendação: criar padrão de nome produto/repo/componente.

### 🚨 12.6. Risco de tecnologia interna e soluções para clientes se misturarem

A Loze tem sistemas internos e soluções que entrega para contas/clientes. Se isso misturar, vai gerar confusão em operação, BI, suporte e faturamento.

Recomendação: criar padrão técnico para separar tecnologia interna e soluções para clientes.

---

## 13. Checklists que precisam existir

| Checklist                                 | Tipo        | Prioridade | Observação                           |
| ----------------------------------------- | ----------- | ---------- | ------------------------------------ |
| `checklist_criar_sistema.md`              | ✅ checklist | V1         | Antes de criar sistema novo          |
| `checklist_criar_modulo.md`               | ✅ checklist | V1         | Antes de criar módulo                |
| `checklist_criar_repositorio.md`          | ✅ checklist | V1         | Antes de criar repo                  |
| `checklist_preparar_produto_tecnico.md`   | ✅ checklist | V1         | Antes de criar estrutura de produto  |
| `checklist_migracao_repositorio_local.md` | ✅ checklist | V1 crítico | Para mover SagB e similares          |
| `checklist_criar_tabela.md`               | ✅ checklist | V1         | Antes de criar tabela Supabase       |
| `checklist_criar_api.md`                  | ✅ checklist | V1         | Antes de criar endpoint/API          |
| `checklist_deploy.md`                     | ✅ checklist | V1         | Antes de publicar                    |
| `checklist_documentacao_minima.md`        | ✅ checklist | V1         | Antes de considerar entrega completa |
| `checklist_saida_quarentena.md`           | ✅ checklist | V1         | Antes de remover item técnico        |
| `checklist_setup_local.md`                | ✅ checklist | V1         | Para rodar projeto localmente        |
| `checklist_refatoracao.md`                | ✅ checklist | V2         | Para refatorar sem quebrar           |
| `checklist_performance.md`                | ✅ checklist | V2         | Para otimização                      |
| `checklist_antes_adicionar_biblioteca.md` | ✅ checklist | V2         | Para dependências/pacotes            |
| `checklist_entrega_tecnica.md`            | ✅ checklist | V1         | Critério final de pronto técnico     |

---

## 14. Matrizes que precisam existir

| Matriz                                | Tipo      | Prioridade | Observação                                     |
| ------------------------------------- | --------- | ---------- | ---------------------------------------------- |
| `matriz_onde_mora_tecnico.md`         | 📊 matriz | V1         | Onde fica código, repo, doc, ADR, logs         |
| `matriz_reaproveitamento_tecnico.md`  | 📊 matriz | V1         | Reaproveitar, adaptar, criar módulo ou sistema |
| `matriz_app_modulo_adaptacao.md`      | 📊 matriz | V1         | Decidir app separado, módulo ou adaptação      |
| `matriz_produto_repo_componente.md`   | 📊 matriz | V1         | Produto x repo web/mobile/api                  |
| `matriz_gravidade_erros.md`           | 📊 matriz | V1         | Baixa, média, alta, crítica                    |
| `matriz_modulo_tabela_api_service.md` | 📊 matriz | V1         | Relação técnica entre artefatos                |
| `matriz_status_modulos.md`            | 📊 matriz | V1         | Core, parcial, legado, lab, confuso etc.       |
| `matriz_validacao_cruzada.md`         | 📊 matriz | V1         | Quem valida o quê                              |
| `matriz_dependencia_modulos.md`       | 📊 matriz | V2         | Dependências entre módulos                     |
| `matriz_risco_tecnico.md`             | 📊 matriz | V2         | Riscos técnicos por área                       |
| `matriz_ambientes.md`                 | 📊 matriz | V2         | Dev, homologação, produção                     |
| `matriz_integracoes.md`               | 📊 matriz | V2         | APIs, webhooks, MCPs e bridges                 |

---

## 15. Registros e evidências que precisam existir

| Registro/Evidência                   | Tipo        | Prioridade | Observação                                         |
| ------------------------------------ | ----------- | ---------- | -------------------------------------------------- |
| `registro_erros_tecnicos.md`         | 🧾 registro | V1         | Falhas técnicas recorrentes                        |
| `registro_incidentes_tecnicos.md`    | 🧾 registro | V1         | Incidentes técnicos, com Pedro se houver segurança |
| `registro_deploy.md`                 | 🧾 registro | V1         | Evidência de publicação                            |
| `registro_releases.md`               | 🧾 registro | V1         | Versões publicadas                                 |
| `registro_validacoes.md`             | 🧾 registro | V1         | Evidência de QA/validação                          |
| `registro_refatoracoes.md`           | 🧾 registro | V2         | Mudanças estruturais em código                     |
| `registro_migracoes.md`              | 🧾 registro | V1         | Migrações como SagB para Loze                      |
| `registro_adrs.md`                   | 🧾 registro | V1         | Decisões arquiteturais                             |
| `modelo_decisao_migracao_tecnica.md` | 🧾 registro | V1         | Modelo para decisões como SagB                     |
| `inventario_tabelas.md`              | 🧾 registro | V1         | Supabase/tabelas                                   |
| `inventario_apis_integracoes.md`     | 🧾 registro | V1         | APIs e integrações                                 |
| `inventario_repositorios.md`         | 🧾 registro | V1         | Repositórios técnicos                              |
| `inventario_dependencias.md`         | 🧾 registro | V2         | Bibliotecas e pacotes                              |
| `inventario_mcps.md`                 | 🧾 registro | V2         | MCPs técnicos                                      |
| `changelog_padrao.md`                | 🧾 registro | V1         | Evolução e mudanças                                |

---

## 16. Protocolos reais que precisam existir

Nem todo item é protocolo. Os protocolos reais da área técnica devem ser poucos e claros.

### 🟢 16.1. Protocolo de incidente técnico crítico

**Situação:** falha crítica em produção, perda de serviço, falha de integração grave ou erro técnico com impacto operacional.
**Responsável:** responsável técnico / Cássio / equipe técnica.
**Saída esperada:** incidente registrado, impacto contido, correção aplicada e aprendizado documentado.

Sequência:

1. registrar incidente;
2. classificar gravidade;
3. conter impacto;
4. acionar responsáveis;
5. corrigir;
6. validar correção;
7. registrar aprendizado;
8. avaliar prevenção.

Dependência: Pedro Gazan se envolver segurança, acessos ou dados sensíveis.

### 🟢 16.2. Protocolo de deploy em produção

**Situação:** publicação de sistema ou módulo em produção.
**Responsável:** responsável técnico da entrega.
**Saída esperada:** release publicada com validação e possibilidade de rollback.

Sequência:

1. checklist de deploy;
2. build;
3. validação de env vars;
4. validação de rotas;
5. validação de integrações;
6. publicação;
7. validação pós-deploy;
8. registro de release;
9. rollback se necessário.

### 🟢 16.3. Protocolo de Quarentena Técnica

**Situação:** arquivo, módulo, tabela, rota, mock ou service parece duplicado, órfão, antigo, sensível ou confuso.
**Responsável:** responsável técnico.
**Saída esperada:** item classificado antes de qualquer remoção.

Sequência:

1. registrar item;
2. classificar tipo;
3. verificar uso real;
4. avaliar impacto;
5. recomendar ação;
6. validar com responsável;
7. registrar decisão.

### 🟢 16.4. Protocolo de migração técnica de repositório

**Situação:** mudança de caminho de repositório ou reorganização de sistema existente, como o SagB.
**Responsável:** Rodrigues / Cássio / responsável técnico.
**Saída esperada:** repositório migrado sem perda, com Git preservado e build validado.

Sequência:

1. criar destino;
2. registrar decisão;
3. preparar checklist;
4. copiar/mover com segurança;
5. preservar Git e configs;
6. validar instalação;
7. validar dev;
8. validar build;
9. atualizar documentação;
10. manter backup temporário.

### 🟢 16.5. Protocolo de criação de tabela crítica

**Situação:** necessidade de nova tabela com impacto em dados, permissões ou produto.
**Responsável:** responsável técnico / database engineer.
**Saída esperada:** tabela criada com migration, owner, RLS avaliado e inventário atualizado.

Dependência: Pedro Gazan para RLS, dados sensíveis e policies.

---

## 17. Documentos derivados prioritários

| Documento                                              | Tipo                    | Por que precisa existir                        | Prioridade | Responsável             |
| ------------------------------------------------------ | ----------------------- | ---------------------------------------------- | ---------- | ----------------------- |
| LOZE-DEV — Padrões Técnicos de Desenvolvimento         | 🟠 padrão               | Consolidar front/back/services/base técnica    | V1         | Sávio / Cássio          |
| LOZE-SYS — Processo Técnico de Criação de Sistemas     | ⚙️ processo             | Evitar criar sistema sem análise               | V1         | Sávio / Pietro          |
| LOZE-DAS — Documentação de Arquitetura e Sistemas      | 🟠 padrão               | Padronizar docs técnicos por sistema           | V1         | Sávio / Pietro          |
| LOZE-MOD — Padrões de Módulos Plugáveis                | 🟠 padrão               | Normalizar módulos do SagB/Loze                | V1         | Sávio / Cássio / Pietro |
| LOZE-API — APIs, Endpoints, Bridges e Integrações      | 🟠 padrão               | Evitar APIs duplicadas e inseguras             | V1         | Sávio / Cássio / Pedro  |
| LOZE-SUPABASE — Banco, Supabase e Dados Técnicos       | 🟠 padrão               | Padronizar tabelas, migrations e RLS técnico   | V1         | Sávio / Cássio / Pedro  |
| LOZE-OBS — Logs, Erros e Observabilidade Técnica       | 🟠 padrão               | Registrar erros e evitar repetição             | V1         | Sávio / Cássio          |
| LOZE-DEPLOY — Deploy, Ambientes e Publicação           | 🟠 padrão               | Reduzir risco de publicação                    | V1         | Sávio / Cássio          |
| LOZE-VCS — Versionamento, Branches, Commits e Releases | 🟠 padrão               | Organizar Git e releases                       | V1         | Sávio / Cássio          |
| LOZE-REFATORA — Refatoração, Migração e Legado Técnico | ⚙️ processo / 🟠 padrão | Apoiar migrações como SagB                     | V1 crítico | Sávio / Cássio          |
| LOZE-SEC-TEC — Segurança Técnica Aplicada              | 🟠 padrão               | Aplicar tecnicamente padrões de segurança      | V2         | Sávio / Pedro           |
| LOZE-SALA-DEV — Esteira Técnica de Agentes             | ⚙️ processo             | Organizar agentes técnicos no VS Code/Roo Code | V2         | Sávio / Pierre / Cássio |
| CATALOGO-TEC — Catálogo Técnico                        | 🧾 registro             | Inventariar módulos, repos, APIs, tabelas      | V1         | Sávio / Cássio          |
| Padrão Técnico de Caminhos, Pastas e Repositórios      | 🟠 padrão               | Resolver onde cada coisa técnica mora          | V1 crítico | Sávio / Pietro          |
| Padrão de Produtos Técnicos Loze                       | 🟠 padrão               | Padronizar SagB, VOX, QG, AcadB etc.           | V1 crítico | Sávio / Cássio          |
| Checklist Migração Manual de Repositório               | ✅ checklist             | Evitar quebrar SagB ao mover                   | V1 crítico | Sávio / Cássio          |

---

## 18. Lacunas, dúvidas e validações

### ❓ 18.1. Lacunas principais

| Lacuna                                                | Impacto                           | Quem valida        | Prioridade | Recomendação                                 |
| ----------------------------------------------------- | --------------------------------- | ------------------ | ---------- | -------------------------------------------- |
| Padrão final de produtos técnicos Loze                | Confusão em SagB, VOX, QG e AcadB | Pietro/Cássio/Kane | crítico    | Criar documento próprio                      |
| Padrão de migração manual de repositório              | Risco de quebrar SagB             | Cássio             | crítico    | Criar checklist antes de mover               |
| Separação tecnologia interna x soluções para clientes | Confusão operacional e financeira | César/Kane/Cássio  | crítico    | Criar padrão técnico + validação estratégica |
| Padrão de branches                                    | Git inconsistente                 | Cássio             | V1         | Criar LOZE-VCS                               |
| Padrão de commits                                     | Histórico ruim                    | Cássio             | V1         | Criar LOZE-VCS                               |
| Padrão de releases                                    | Deploys sem rastreio              | Cássio/Kane        | V1         | Criar LOZE-VCS                               |
| Testes mínimos                                        | Produção frágil                   | Cássio             | V1         | Criar LOZE-DEV/QA                            |
| Observabilidade                                       | Erros invisíveis                  | Cássio/Pedro       | V2         | Criar LOZE-OBS                               |
| Módulos plugáveis SagB x Loze                         | Oficializar padrão errado         | Pietro/Cássio      | crítico    | Criar análise comparativa                    |
| Documentação pública/interna/restrita                 | Vazamento ou confusão             | Pietro/Pedro/Alice | V2         | Criar padrão específico                      |
| MCP técnico x MCP agente                              | Conflito Sávio/Pierre             | Pierre/Cássio      | V2         | Criar dependência explícita                  |

### ❓ 18.2. Dúvidas abertas

1. A stack React/TypeScript/Tailwind/Vite/Supabase/Netlify é obrigatória ou preferencial?
2. Todos os produtos técnicos devem ter `web`, `mobile` e `api` previstos ou apenas quando existirem?
3. A pasta `09_repositorios/` deve ser padrão universal dentro de produtos técnicos?
4. A numeração das pastas de produto técnico deve ser igual para todos os produtos Loze?
5. O padrão de módulos plugáveis do SagB sobe para LOZE-MOD ou fica específico do SagB?
6. O Loze Docs será interno, público ou híbrido?
7. Qual ferramenta oficial de observabilidade será usada?
8. Qual será o fluxo oficial de PR/review?
9. Quem aprova remoção final de itens da Quarentena Técnica?
10. Qual a fronteira exata entre catálogo técnico e BI operacional?

---

## 19. Versão revisada da estrutura do bloco

A versão revisada incorpora os ajustes da auditoria, adicionando arquivos que faltavam e corrigindo pontos de ambiguidade.

```text
central_de_padroes/
└── sistemas_arquitetura_tecnica_programacao/
    ├── 00_indice_e_visao_geral/
    │   ├── README.md
    │   ├── indice_da_area.md
    │   ├── escopo_da_area.md
    │   ├── mapa_dos_documentos_tecnicos.md
    │   └── status_da_area.md
    │
    ├── 01_principios_politicas_regras/
    │   ├── principios_tecnicos.md
    │   ├── politicas_tecnicas.md
    │   ├── regras_centrais_tecnicas.md
    │   └── classificacao_normativa.md
    │
    ├── 02_arquitetura_de_sistemas/
    │   ├── loze_sys_processo_tecnico_criacao_sistemas.md
    │   ├── padrao_arquitetura_sistemas.md
    │   ├── padrao_tecnologia_interna_vs_solucoes_para_clientes.md
    │   ├── matriz_app_modulo_adaptacao.md
    │   ├── matriz_reaproveitamento_tecnico.md
    │   └── checklist_antes_criar_sistema.md
    │
    ├── 03_estrutura_de_pastas_e_repositorios/
    │   ├── padrao_tecnico_caminhos_pastas_repositorios.md
    │   ├── padrao_produtos_tecnicos_loze.md
    │   ├── padrao_repositorios_produtos.md
    │   ├── padrao_nome_produto_repo_componente.md
    │   ├── matriz_onde_mora_tecnico.md
    │   ├── matriz_produto_repo_componente.md
    │   ├── dependencia_com_estrutura_institucional.md
    │   └── checklist_antes_criar_repositorio.md
    │
    ├── 04_documentacao_tecnica/
    │   ├── loze_das_documentacao_arquitetura_sistemas.md
    │   ├── padrao_docs_repositorio.md
    │   ├── padrao_documentacao_publica_interna_restrita.md
    │   ├── padrao_indices_navegacao_tecnica.md
    │   ├── template_documento_mestre_sistema.md
    │   ├── template_adr.md
    │   ├── template_readme_repo.md
    │   └── checklist_documentacao_minima.md
    │
    ├── 05_frontend_tecnico/
    │   ├── padrao_frontend_react_typescript.md
    │   ├── padrao_components_tecnicos.md
    │   ├── padrao_hooks_store_context.md
    │   ├── padrao_rotas_pages_layouts.md
    │   └── dependencias_com_alice_montini.md
    │
    ├── 06_backend_services_e_funcoes/
    │   ├── padrao_backend_services.md
    │   ├── padrao_funcoes_serverless.md
    │   ├── padrao_validacoes_erros.md
    │   ├── padrao_services_repositories_helpers.md
    │   └── checklist_backend.md
    │
    ├── 07_supabase_banco_e_dados_tecnicos/
    │   ├── loze_supabase_banco_dados.md
    │   ├── padrao_tabelas_colunas_relacionamentos.md
    │   ├── padrao_migrations.md
    │   ├── padrao_rls_policies_tecnico.md
    │   ├── inventario_tabelas.md
    │   ├── inventario_buckets_storage.md
    │   └── checklist_antes_criar_tabela.md
    │
    ├── 08_apis_integracoes_bridges_mcps/
    │   ├── loze_api_apis_endpoints_integracoes.md
    │   ├── padrao_endpoints.md
    │   ├── padrao_contratos_api.md
    │   ├── padrao_webhooks.md
    │   ├── padrao_bridges.md
    │   ├── padrao_mcps_tecnicos.md
    │   ├── dependencia_com_pierre_zanulli.md
    │   ├── dependencia_com_pedro_gazan.md
    │   ├── inventario_apis_integracoes.md
    │   └── checklist_antes_criar_api.md
    │
    ├── 09_modulos_plugaveis_templates_reuso/
    │   ├── loze_mod_modulos_plugaveis.md
    │   ├── analise_sagb_vs_loze_modulos.md
    │   ├── padrao_module_doc.md
    │   ├── padrao_manifest_routes_index.md
    │   ├── template_modulo_plugavel.md
    │   ├── matriz_status_modulos.md
    │   └── checklist_antes_criar_modulo.md
    │
    ├── 10_logs_erros_observabilidade_tecnica/
    │   ├── loze_obs_logs_erros_observabilidade.md
    │   ├── padrao_registro_erros.md
    │   ├── padrao_logs_tecnicos.md
    │   ├── matriz_gravidade_erros.md
    │   ├── registro_incidentes_tecnicos.md
    │   └── checklist_pos_incidente.md
    │
    ├── 11_qa_testes_validacao/
    │   ├── padrao_testes_minimos.md
    │   ├── checklist_pre_deploy.md
    │   ├── checklist_setup_local.md
    │   ├── checklist_validacao_build.md
    │   ├── checklist_validacao_rotas.md
    │   ├── checklist_validacao_integracoes.md
    │   └── evidencias_validacao.md
    │
    ├── 12_deploy_ambientes_publicacao/
    │   ├── loze_deploy_ambientes_publicacao.md
    │   ├── padrao_ambientes.md
    │   ├── padrao_ambiente_local.md
    │   ├── padrao_variaveis_ambiente.md
    │   ├── padrao_netlify.md
    │   ├── padrao_rollback.md
    │   ├── checklist_deploy.md
    │   └── registro_releases.md
    │
    ├── 13_versionamento_branches_commits_releases/
    │   ├── loze_vcs_versionamento.md
    │   ├── padrao_branches.md
    │   ├── padrao_commits.md
    │   ├── padrao_pull_requests.md
    │   ├── padrao_tags_releases.md
    │   └── changelog_padrao.md
    │
    ├── 14_catalogos_tecnicos/
    │   ├── catalogo_produtos_tecnicos.md
    │   ├── catalogo_repositorios.md
    │   ├── catalogo_modulos.md
    │   ├── catalogo_tabelas.md
    │   ├── catalogo_apis.md
    │   ├── catalogo_services.md
    │   ├── catalogo_integracoes.md
    │   └── catalogo_mcps.md
    │
    ├── 15_quarentena_tecnica/
    │   ├── padrao_quarentena_tecnica.md
    │   ├── itens_nao_remover_sem_validacao.md
    │   ├── arquivos_orfaos.md
    │   ├── duplicidades.md
    │   ├── mocks_fallbacks.md
    │   ├── rotas_mortas.md
    │   └── checklist_saida_quarentena.md
    │
    ├── 16_sala_dev_esteira_tecnica/
    │   ├── loze_sala_dev_esteira_tecnica.md
    │   ├── agentes_tecnicos.md
    │   ├── workflows_tecnicos.md
    │   ├── handoffs.md
    │   ├── gates_aprovacao.md
    │   ├── logs_runs_outputs.md
    │   └── estrutura_roo_code_vs_code.md
    │
    ├── 17_seguranca_tecnica_aplicada/
    │   ├── seguranca_tecnica_aplicada.md
    │   ├── aplicacao_padroes_pedro_gazan.md
    │   ├── checklist_seguranca_tecnica.md
    │   └── dependencias_com_pedro_gazan.md
    │
    ├── 18_performance_otimizacao/
    │   ├── padrao_performance_frontend.md
    │   ├── padrao_performance_backend.md
    │   ├── padrao_otimizacao_queries.md
    │   └── checklist_performance.md
    │
    ├── 19_refatoracao_migracao_legado/
    │   ├── loze_refatora_migracao_legado.md
    │   ├── padrao_refatoracao_segura.md
    │   ├── padrao_migracao_sistemas.md
    │   ├── padrao_migracao_repositorio_local.md
    │   ├── padrao_tratamento_legado.md
    │   ├── checklist_migracao_repositorio_local.md
    │   └── checklist_refatoracao.md
    │
    ├── 20_dependencias_pacotes_bibliotecas/
    │   ├── padrao_dependencias.md
    │   ├── politica_pacotes_npm.md
    │   ├── inventario_dependencias.md
    │   └── checklist_antes_adicionar_biblioteca.md
    │
    ├── 21_handoff_prd_tecnico/
    │   ├── padrao_handoff_produto_para_tecnico.md
    │   ├── template_prd_tecnico.md
    │   ├── template_tarefa_tecnica.md
    │   └── checklist_recebimento_demanda.md
    │
    ├── 22_criterios_de_pronto_tecnico/
    │   ├── definition_of_done_tecnico.md
    │   ├── criterios_pronto_mvp.md
    │   ├── criterios_pronto_producao.md
    │   └── checklist_entrega_tecnica.md
    │
    ├── 23_checklists/
    │   ├── indice_checklists_tecnicos.md
    │   ├── checklist_criar_sistema.md
    │   ├── checklist_criar_modulo.md
    │   ├── checklist_criar_repositorio.md
    │   ├── checklist_preparar_produto_tecnico.md
    │   ├── checklist_criar_tabela.md
    │   ├── checklist_criar_api.md
    │   ├── checklist_deploy.md
    │   └── checklist_documentacao_minima.md
    │
    ├── 24_matrizes/
    │   ├── indice_matrizes_tecnicas.md
    │   ├── matriz_onde_mora_tecnico.md
    │   ├── matriz_reaproveitamento_tecnico.md
    │   ├── matriz_app_modulo_adaptacao.md
    │   ├── matriz_produto_repo_componente.md
    │   ├── matriz_gravidade_erros.md
    │   ├── matriz_modulo_tabela_api_service.md
    │   └── matriz_validacao_cruzada.md
    │
    ├── 25_registros_e_evidencias/
    │   ├── modelo_registro_erro.md
    │   ├── modelo_registro_incidente.md
    │   ├── modelo_log_deploy.md
    │   ├── modelo_evidencia_validacao.md
    │   ├── modelo_changelog.md
    │   ├── modelo_decisions.md
    │   └── modelo_decisao_migracao_tecnica.md
    │
    ├── 26_lacunas_duvidas_validacoes/
    │   ├── duvidas_tecnicas_abertas.md
    │   ├── itens_precisam_validacao_cassio.md
    │   ├── itens_precisam_validacao_pietro.md
    │   ├── itens_precisam_validacao_pedro_gazan.md
    │   ├── itens_precisam_validacao_alice.md
    │   ├── itens_precisam_validacao_pierre.md
    │   └── itens_precisam_validacao_kane_rodrigues.md
    │
    └── 27_documentos_derivados/
        ├── lista_documentos_derivados.md
        ├── prioridade_1.md
        ├── prioridade_2.md
        └── futuro.md
```

---

## 20. Ordem recomendada de criação dos documentos

### Primeiro

1. `00_indice_e_visao_geral/README.md`
2. `00_indice_e_visao_geral/escopo_da_area.md`
3. `01_principios_politicas_regras/principios_tecnicos.md`
4. `01_principios_politicas_regras/regras_centrais_tecnicas.md`
5. `03_estrutura_de_pastas_e_repositorios/padrao_tecnico_caminhos_pastas_repositorios.md`
6. `03_estrutura_de_pastas_e_repositorios/padrao_produtos_tecnicos_loze.md`
7. `03_estrutura_de_pastas_e_repositorios/padrao_nome_produto_repo_componente.md`
8. `04_documentacao_tecnica/loze_das_documentacao_arquitetura_sistemas.md`
9. `24_matrizes/matriz_onde_mora_tecnico.md`
10. `23_checklists/checklist_documentacao_minima.md`

### Depois

1. `02_arquitetura_de_sistemas/loze_sys_processo_tecnico_criacao_sistemas.md`
2. `09_modulos_plugaveis_templates_reuso/analise_sagb_vs_loze_modulos.md`
3. `09_modulos_plugaveis_templates_reuso/loze_mod_modulos_plugaveis.md`
4. `07_supabase_banco_e_dados_tecnicos/loze_supabase_banco_dados.md`
5. `08_apis_integracoes_bridges_mcps/loze_api_apis_endpoints_integracoes.md`
6. `10_logs_erros_observabilidade_tecnica/loze_obs_logs_erros_observabilidade.md`
7. `12_deploy_ambientes_publicacao/loze_deploy_ambientes_publicacao.md`
8. `13_versionamento_branches_commits_releases/loze_vcs_versionamento.md`
9. `14_catalogos_tecnicos/catalogo_repositorios.md`
10. `14_catalogos_tecnicos/catalogo_produtos_tecnicos.md`

### Por último

1. `16_sala_dev_esteira_tecnica/loze_sala_dev_esteira_tecnica.md`
2. `17_seguranca_tecnica_aplicada/seguranca_tecnica_aplicada.md`
3. `18_performance_otimizacao/padrao_performance_frontend.md`
4. `18_performance_otimizacao/padrao_performance_backend.md`
5. `19_refatoracao_migracao_legado/loze_refatora_migracao_legado.md`
6. `20_dependencias_pacotes_bibliotecas/padrao_dependencias.md`
7. `21_handoff_prd_tecnico/padrao_handoff_produto_para_tecnico.md`
8. `22_criterios_de_pronto_tecnico/definition_of_done_tecnico.md`

---

## 21. Síntese final

Minha leitura final é que o bloco **Sistemas, Arquitetura Técnica e Programação** já possui como base **escopo técnico bem definido, separação correta entre institucional e técnico, estrutura de arquitetura, pastas técnicas, repositórios, documentação técnica, front-end, back-end, Supabase, APIs, módulos, logs, deploy, versionamento, catálogos técnicos, Quarentena Técnica e Sala Dev**, mas precisa evoluir em **padrão de produtos técnicos Loze, migração segura de repositórios, separação entre tecnologia interna e soluções para clientes, documentação pública/interna/restrita, padrão final de módulos plugáveis, branches, commits, testes, observabilidade e validações cruzadas**. A versão revisada da estrutura deve priorizar **escopo da área, princípios e regras técnicas, padrão técnico de caminhos/pastas/repositórios, LOZE-DAS, padrão de produtos técnicos Loze, matriz onde mora técnico e checklist de documentação mínima**, manter dependência com **Pietro, Cássio, Pedro Gazan, Alice, Pierre e Kane/Rodrigues** e evitar **confusão entre estrutura institucional e técnica, padrão SagB e padrão Loze, segurança aplicada e segurança digital, UX técnico e UX conceitual, MCP técnico e MCP de agente, produto digital e venture**.
