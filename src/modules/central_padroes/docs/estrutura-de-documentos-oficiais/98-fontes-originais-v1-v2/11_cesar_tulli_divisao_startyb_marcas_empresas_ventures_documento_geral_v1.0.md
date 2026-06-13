# Auditoria e Revisão do Bloco Negócios, Ventures e Planos — César Tulli — v1

**Bloco auditado:** Negócios, Ventures e Planos
**Responsável conceitual:** César Tulli / StartyB
**Solicitante:** Pietro Carboni
**Contexto:** Central de Padrões do GrupoB / Loze dentro do SagB
**Status:** Documento de auditoria e revisão estrutural
**Versão:** v1

---

## Índice

1. Objetivo da auditoria
2. Escopo analisado
3. Fontes consideradas
4. Resumo da estrutura criada na Missão 1
5. O que está correto na estrutura atual
6. O que ficou incompleto
7. O que apareceu no chat e não entrou na estrutura
8. Itens que devem ser adicionados
9. Itens que devem ser removidos ou movidos
10. Duplicidades e conflitos de escopo
11. Dependências com outras áreas
12. Riscos de manter a estrutura como está
13. Checklists que precisam existir
14. Matrizes que precisam existir
15. Registros e evidências que precisam existir
16. Protocolos reais que precisam existir
17. Documentos derivados prioritários
18. Lacunas, dúvidas e validações
19. Versão revisada da estrutura do bloco
20. Ordem recomendada de criação dos documentos
21. Síntese final

---

## 1. Objetivo da auditoria

Esta auditoria tem como objetivo revisar criticamente a estrutura criada na Missão 1 para o bloco **Negócios, Ventures e Planos** dentro da Central de Padrões do GrupoB / Loze no SagB.

A missão é cruzar a estrutura proposta com tudo que foi discutido no chat sobre StartyB, criação de empresas, ventures, marcas, planos de negócio, organogramas, ativos, triagens, documentos oficiais, QGs, operações, métodos, Loze, PapoB, PapoB como teste da Fase 02, estrutura de pastas e governança de ideias.

O objetivo final é chegar a uma versão mais limpa, prática e confiável do bloco, sem assumir responsabilidades de outras áreas e sem transformar tudo em protocolo.

---

## 2. Escopo analisado

O escopo analisado é exclusivamente o bloco:

```text
central_de_padroes/
└── negocios_ventures_e_planos/
```

Este bloco cobre os padrões relacionados a:

* nascimento de ideias;
* exploração inicial com Dante Montoya;
* classificação de iniciativas;
* roteamento para StartyB, Loze, AcadB, 3forB, Métodos ou outras frentes;
* DOC-000 — Descritivo Estrutural da Empresa;
* DOC-001 — Plano de Negócio Oficial;
* estrutura multiagente do plano de negócio;
* organograma evolutivo V1/V2/V3;
* ventures;
* empresas B;
* ativos próprios versus ativos do GrupoB usados por empresas e ventures;
* triagem bruta e consolidação de materiais;
* prontidão para valuation, sócios, captação ou venda;
* decisões GO, GO com ajustes, FREEZE e NO GO.

Este bloco não cobre diretamente:

* naming jurídico final;
* identidade visual final;
* arquitetura técnica da Loze;
* UX/UI;
* segurança digital;
* operação comercial detalhada da 3forB;
* pedagogia da AcadB;
* documentação técnica de sistemas;
* contratos jurídicos finais;
* DNA completo de agentes do SagB.

---

## 3. Fontes consideradas

Foram consideradas as seguintes fontes de contexto do próprio chat e decisões anteriores:

1. Estrutura da Missão 1 para o bloco **Negócios, Ventures e Planos**.
2. Discussões sobre a StartyB como frente de estruturação de empresas, ventures, planos de negócio, agentes e modelos operacionais.
3. Definição do DOC-000 — Descritivo Estrutural da Empresa.
4. Definição do DOC-001 — Plano de Negócio Oficial.
5. Discussões sobre os 4 pilares, 12 blocos e 43 tópicos do plano de negócio.
6. Estrutura de agentes do plano de negócio: Dante, César, agentes de evidência, 43 analistas, 12 gerentes, 4 auditores e 3 auditores sistêmicos.
7. Discussões sobre a Central de Padrões e a Arquitetura Mestra de Padrões.
8. Definição do bloco **Identidade, Classificação e Arquitetura do Ecossistema**.
9. Discussões sobre Dante Montoya como porta inicial de ideias do GrupoB.
10. Discussões sobre Loze como destino de produtos digitais, sistemas, apps e plataformas.
11. Discussões sobre Noah Verdili e banco de marcas.
12. Discussões sobre Nilo Barreti e métodos.
13. Estrutura macro do GrupoB: `01_empresas_b/`, `02_ventures/`, `03_metodos/`.
14. Fase 01 — Triagem Única em métodos, empresas B e ventures.
15. Fase 02 — teste PapoB para extração de novas informações.
16. Discussões sobre ativo próprio da empresa versus ativo do GrupoB usado pela empresa.
17. Discussões sobre operações por conta atendida.
18. Discussões sobre valuation, sócios, captação e data room.
19. Discussões sobre documentos oficiais por empresa.
20. Decisão de que todo documento oficial deve começar com índice.

---

## 4. Resumo da estrutura criada na Missão 1

A estrutura criada na Missão 1 propôs o bloco:

```text
central_de_padroes/
└── negocios_ventures_e_planos/
```

Com os seguintes blocos principais:

```text
00_indice_e_visao_geral/
01_principios_politicas_regras/
02_nascimento_de_ideias/
03_classificacao_de_iniciativas/
04_documentos_base_de_negocio/
05_plano_de_negocio_startyb/
06_organograma_e_departamentos/
07_ativos_relacoes_e_valor/
08_ventures/
09_fluxos_de_encaminhamento/
10_sistema_multiagente_plano_de_negocio/
checklists/
matrizes/
registros_e_evidencias/
lacunas_duvidas_validacoes/
documentos_derivados/
```

A estrutura foi forte ao separar nascimento de ideias, classificação, plano de negócio, organograma, ventures e sistema multiagente. Porém, após cruzar com o histórico do chat, ficaram faltando alguns blocos importantes, especialmente:

* triagem e consolidação de materiais;
* empresas B;
* operações por conta atendida;
* data room, valuation e sócios em camada mais explícita;
* documentos oficiais por empresa e venture;
* relação entre métodos usados e valuation;
* separação entre marca, empresa, venture e método;
* versão mais clara dos limites com o bloco de identidade/naming.

---

## 5. O que está correto na estrutura atual

A estrutura atual está correta nos seguintes pontos:

### 5.1. Nome funcional do bloco

**Item:** Negócios, Ventures e Planos
**Tipo:** 🟠 padrão
**Avaliação:** correto

O nome é melhor do que “StartyB” para a Central de Padrões, porque a área organiza uma função do ecossistema, não apenas uma empresa.

### 5.2. Separação entre nascimento de ideias e plano de negócio

**Item:** `02_nascimento_de_ideias/` e `05_plano_de_negocio_startyb/`
**Tipo:** ⚙️ processo
**Avaliação:** correto

A ideia não deve entrar direto no plano de negócio. Dante explora primeiro; César/StartyB entra quando existe potencial de negócio, empresa, venture ou modelo de receita.

### 5.3. Bloco de classificação de iniciativas

**Item:** `03_classificacao_de_iniciativas/`
**Tipo:** 📊 matriz
**Avaliação:** correto e central

Esse bloco é obrigatório para evitar que tudo vire empresa, produto, sistema ou metodologia sem critério.

### 5.4. DOC-000 e DOC-001

**Item:** `04_documentos_base_de_negocio/`
**Tipo:** 🟠 padrão
**Avaliação:** correto

O DOC-000 resolve a necessidade de organizar empresas/marcas antes do plano completo. O DOC-001 é o plano de negócio oficial.

### 5.5. Plano de negócio em 4 pilares, 12 blocos e 43 tópicos

**Item:** `05_plano_de_negocio_startyb/`
**Tipo:** 🟠 padrão
**Avaliação:** correto

Esse é um dos padrões mais maduros da StartyB.

### 5.6. Organograma evolutivo V1/V2/V3

**Item:** `06_organograma_e_departamentos/`
**Tipo:** 🟠 padrão / 📊 matriz
**Avaliação:** correto

A empresa pode começar pequena na operação, mas precisa nascer adulta no desenho.

### 5.7. Ativos, relações e valor

**Item:** `07_ativos_relacoes_e_valor/`
**Tipo:** 🧾 registro / 📊 matriz
**Avaliação:** correto e crítico

Esse bloco protege valuation, sociedade e entrada de sócios.

### 5.8. Sistema multiagente do plano de negócio

**Item:** `10_sistema_multiagente_plano_de_negocio/`
**Tipo:** ⚙️ processo / 🟢 protocolo em partes específicas
**Avaliação:** correto

A estrutura de agentes precisa ficar separada dos agentes gerais do SAGB.

---

## 6. O que ficou incompleto

### 6.1. Fase 01 e Fase 02 de triagem ficaram fora da estrutura

**Tipo:** ⚙️ processo / 🧾 registro
**Status:** precisa adicionar
**Prioridade:** 🚨 crítico

No chat, foi definido um fluxo prático de triagem para `01_empresas_b/`, `02_ventures/` e `03_metodos/`. Isso não entrou na estrutura da Missão 1 com força suficiente.

A estrutura precisa incluir um bloco específico para:

* Fase 01 — Compilado bruto existente;
* Fase 02 — Novas informações extraídas;
* Fase 03 — Documento base consolidado para aprovação.

### 6.2. Empresas B ficaram implícitas, mas não estruturadas

**Tipo:** 🟠 padrão
**Status:** precisa adicionar
**Prioridade:** alta

A estrutura fala de ventures, mas não criou bloco específico para empresas B, mesmo que o chat tenha definido a raiz:

```text
01_empresas_b/
```

Esse bloco precisa existir para diferenciar empresa B de venture.

### 6.3. Operações por conta atendida ficou fora

**Tipo:** 🟠 padrão / ⚙️ processo
**Status:** precisa adicionar
**Prioridade:** alta

Foi discutido que não faz sentido separar tudo como “interno versus externo”. O conceito melhor é que operações executa por **conta atendida**. A própria empresa pode ser sua conta.

Isso precisa virar padrão dentro do bloco, ou pelo menos documento derivado dependente de Operações/Yuri.

### 6.4. Valuation, sócios, captação e data room ficaram diluídos

**Tipo:** 🟣 política / 📊 matriz / 🧾 registro
**Status:** precisa reforçar
**Prioridade:** alta

A entrada de sócio, valuation e captação são temas centrais para ventures, mas ficaram espalhados entre ativos, ventures e documentos derivados.

### 6.5. Relação com métodos ficou subdimensionada

**Tipo:** 🧾 registro / 🔴 regra
**Status:** precisa adicionar
**Prioridade:** alta

Foi definido que métodos como Jornada U.A.U., GERAC, MAV, EDA, SIRE e outros são ativos do GrupoB/Douglas Rodrigues e podem ser usados por empresas, mas não viram automaticamente ativos próprios dessas empresas.

Isso precisa estar claro na estrutura.

### 6.6. Padrão de QG ficou fora

**Tipo:** 🟠 padrão
**Status:** precisa adicionar como dependência
**Prioridade:** média

QG não é responsabilidade total deste bloco, mas impacta diretamente empresas e ventures. A área deve definir o que precisa existir do ponto de vista de negócio, e depender de Loze/Sávio/Yuri para estrutura técnica e documental.

---

## 7. O que apareceu no chat e não entrou na estrutura

1. **Fase 01 — Triagem Única** para empresas B, ventures e métodos.
2. **Fase 02 — Extração de Novas Informações** usando PapoB como teste.
3. Critério de que o arquivo `03_documento_base_consolidado_para_aprovacao.md` não deve ser preenchido antes da validação do arquivo 02.
4. Raiz macro do GrupoB com três pilares: `01_empresas_b/`, `02_ventures/`, `03_metodos/`.
5. Decisão de que Loze deve ficar em `02_ventures/`, não em empresas B.
6. Regra de que cada pasta deve ter seu próprio `99_triagem/`.
7. Necessidade de separar falas reais do Rodrigues de respostas de IA.
8. Necessidade de identificar conteúdo de IA como apoio, não decisão.
9. Operações por conta atendida.
10. Exemplo de PapoB como teste de extração.
11. Regra de que métodos usados por empresas não entram automaticamente no valuation como ativos próprios.
12. Necessidade de registrar dono do método, tipo de uso, licença/autorização e impacto operacional.
13. Necessidade de estruturar empresas B e ventures antes do plano de negócio completo.
14. Possível confusão entre produto próprio da venture e entrega técnica da Loze.
15. Exemplo VOX: produto da Ziplia, desenvolvimento técnico pela Loze.
16. Regra de que pasta/QG não cria departamento; plano de negócio e organograma criam a estrutura.
17. Decisão de que todo documento oficial deve começar com índice.

---

## 8. Itens que devem ser adicionados

### 8.1. Novo bloco: `02_triagem_e_consolidacao_de_materiais/`

**Tipo:** ⚙️ processo / 🧾 registro
**Prioridade:** 🚨 crítico

Deve organizar Fase 01, Fase 02 e Fase 03.

### 8.2. Novo bloco: `09_empresas_b/`

**Tipo:** 🟠 padrão
**Prioridade:** alta

Deve definir como empresas B são organizadas, triadas, documentadas e preparadas para plano de negócio.

### 8.3. Reforçar `08_ventures/`

**Tipo:** 🟠 padrão / 📊 matriz
**Prioridade:** alta

Deve incluir data room, captação, valuation, empresa autônoma e transição de venture.

### 8.4. Novo sub-bloco em ativos: uso de métodos do GrupoB

**Tipo:** 🔴 regra / 🧾 registro
**Prioridade:** alta

Precisa registrar ativos intelectuais usados por empresas e ventures.

### 8.5. Novo bloco ou arquivo: operações por conta atendida

**Tipo:** 🟠 padrão / ⚙️ processo
**Prioridade:** média/alta

Deve explicar a lógica operacional, com dependência de Yuri/Sávio/Loze.

### 8.6. Novo arquivo: `regra_de_nao_confundir_ia_com_decisao.md`

**Tipo:** 🔴 regra
**Prioridade:** alta

Fundamental para triagens e consolidações.

---

## 9. Itens que devem ser removidos ou movidos

### 9.1. `processo_ideia_para_metodos.md`

**Ação recomendada:** manter, mas marcar dependência com Nilo/Pietro.
**Motivo:** métodos não são responsabilidade final deste bloco.

### 9.2. `processo_ideia_para_loze.md`

**Ação recomendada:** manter como encaminhamento, mas não como protocolo técnico.
**Motivo:** a Loze define o processo técnico de desenvolvimento.

### 9.3. `estrutura_de_data_room_para_venture.md`

**Ação recomendada:** manter dentro de ventures, mas com dependência jurídica/financeira.
**Motivo:** não deve virar documento de investimento sem validação especializada.

### 9.4. `dependencias_com_loze.md`

**Ação recomendada:** separar em `dependencias_com_savio_codare.md` e `dependencias_com_loze.md`.
**Motivo:** Sávio pode ser responsável técnico, mas Loze é frente/empresa.

### 9.5. Conteúdos de naming

**Ação recomendada:** mover para dependência com Noah e bloco de Identidade/Classificação.
**Motivo:** este bloco não deve assumir aprovação de nomes.

---

## 10. Duplicidades e conflitos de escopo

### 10.1. Classificação de iniciativas x Identidade do Ecossistema

**Risco:** duplicar a diferença entre empresa, marca, produto, método e venture.
**Ação:** este bloco usa a classificação para decisão de negócio; o bloco de Identidade guarda nomenclatura oficial e arquitetura institucional.

### 10.2. Naming x criação de marca

**Risco:** César/StartyB assumir naming.
**Ação:** StartyB define se a ideia pode virar marca; Noah/Pietro/Alice validam nome, disponibilidade e identidade.

### 10.3. Métodos x produtos educacionais

**Risco:** confundir método com curso, trilha ou mentoria.
**Ação:** Nilo/Pietro definem método; AcadB define curso/trilha/mentoria.

### 10.4. Produto digital x venture

**Risco:** todo app virar venture ou toda venture virar sistema.
**Ação:** matriz de classificação precisa separar produto digital, plataforma, sistema, app, empresa e venture.

### 10.5. Documento 02 x Documento 03 da triagem

**Risco:** preencher o documento final cedo demais.
**Ação:** Fase 02 preenche `02_novas_informacoes.md`; Fase 03 só depois preenche o documento base consolidado.

### 10.6. Operação interna x operação por conta

**Risco:** criar estrutura feia e confusa de interno/externo.
**Ação:** usar lógica de conta atendida, com a própria empresa podendo ser cliente/conta da operação.

---

## 11. Dependências com outras áreas

| Tema                                     | Depende de qual área          | Motivo                                                                                          | Arquivo de dependência sugerido        |
| ---------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------- |
| Naming, nomes oficiais e disponibilidade | Noah Verdili / Pietro / Alice | O bloco não aprova nome sozinho                                                                 | `dependencias_com_noah_verdili.md`     |
| Identidade visual e percepção de marca   | Alice Montini                 | Visual, UX e identidade não são responsabilidade da StartyB                                     | `dependencias_com_alice_montini.md`    |
| Métodos e ativos intelectuais            | Nilo Barreti / Pietro         | Métodos pertencem ao bloco de Métodos                                                           | `dependencias_com_nilo_barreti.md`     |
| Sistemas, apps e plataformas             | Loze / Sávio Codare           | Tecnologia e desenvolvimento são responsabilidade da Loze                                       | `dependencias_com_savio_codare.md`     |
| Segurança, acessos e credenciais         | Pedro Gazan                   | Bloco não define segurança digital                                                              | `dependencias_com_pedro_gazan.md`      |
| Organização documental e QG              | Yuri Sague                    | Estrutura de pastas, fonte canônica e documentos operacionais dependem de organização sistêmica | `dependencias_com_yuri_sague.md`       |
| Cursos, trilhas e mentorias              | AcadB / Julio Mosqueira       | Produto educacional não é definido integralmente pela StartyB                                   | `dependencias_com_julio_mosqueira.md`  |
| Decisão estratégica final                | Rodrigues / Kane              | Empresas, ventures, captação e sócios exigem validação estratégica                              | `dependencias_com_rodrigues_e_kane.md` |
| Contratos, cap table e sociedade         | Audacus / jurídico            | Requer validação especializada                                                                  | `dependencias_com_juridico.md`         |
| Execução e tarefas                       | TaskZei / Yuri                | Decisão precisa virar tarefa rastreável                                                         | `dependencias_com_taskzei.md`          |

---

## 12. Riscos de manter a estrutura como está

1. **Risco de não capturar a triagem real**
   Sem o bloco de triagem, a estrutura pula uma etapa que já virou prática operacional.

2. **Risco de confundir resposta de IA com decisão do Rodrigues**
   Isso pode contaminar documentos oficiais e planos de negócio.

3. **Risco de tratar métodos como ativos das empresas**
   Pode inflar valuation e gerar erro societário.

4. **Risco de Loze receber ideia imatura**
   Sem checklist de passagem, tecnologia pode começar antes da validação de negócio.

5. **Risco de toda marca virar empresa**
   Sem matriz de classificação, o GrupoB cria estrutura demais.

6. **Risco de toda ideia interessante virar plano completo**
   O plano de 43 tópicos não deve ser usado para tudo.

7. **Risco de empresas B e ventures seguirem padrões diferentes demais**
   A estrutura precisa diferenciar sem fragmentar.

8. **Risco de confusão entre produto da venture e entrega técnica da Loze**
   Exemplo: VOX é produto da Ziplia, mas pode ser desenvolvido pela Loze.

---

## 13. Checklists que precisam existir

| Checklist                                      | Tipo        | Motivo                                             | Prioridade |
| ---------------------------------------------- | ----------- | -------------------------------------------------- | ---------- |
| `checklist_fase_01_triagem_bruta.md`           | ✅ checklist | Garantir compilado bruto sem interpretação         | 🚨 crítico |
| `checklist_fase_02_novas_informacoes.md`       | ✅ checklist | Garantir extração correta antes do documento final | 🚨 crítico |
| `checklist_antes_de_preencher_documento_03.md` | ✅ checklist | Evitar consolidação precoce                        | alta       |
| `checklist_antes_de_criar_negocio.md`          | ✅ checklist | Evitar empresa por impulso                         | alta       |
| `checklist_antes_de_criar_venture.md`          | ✅ checklist | Validar se há tese, risco e estrutura              | alta       |
| `checklist_antes_de_abrir_plano_de_negocio.md` | ✅ checklist | Verificar entrada mínima                           | alta       |
| `checklist_antes_de_enviar_para_loze.md`       | ✅ checklist | Evitar tecnologia sem escopo                       | alta       |
| `checklist_antes_de_entrada_de_socio.md`       | ✅ checklist | Proteger sociedade e valuation                     | alta       |
| `checklist_ativos_que_entram_no_valuation.md`  | ✅ checklist | Separar ativo próprio de ativo usado               | alta       |
| `checklist_operacoes_por_conta_atendida.md`    | ✅ checklist | Organizar execução sem misturar contas             | média      |

---

## 14. Matrizes que precisam existir

| Matriz                                            | Tipo      | Motivo                                        | Prioridade |
| ------------------------------------------------- | --------- | --------------------------------------------- | ---------- |
| `matriz_ideia_projeto_produto_empresa_venture.md` | 📊 matriz | Classificar iniciativas                       | 🚨 crítico |
| `matriz_de_destino_no_ecossistema.md`             | 📊 matriz | Encaminhar para área correta                  | 🚨 crítico |
| `matriz_de_maturidade_da_iniciativa.md`           | 📊 matriz | Saber se é ideia, projeto, venture ou empresa | alta       |
| `matriz_go_go_ajustes_freeze_no_go.md`            | 📊 matriz | Padronizar decisão                            | alta       |
| `matriz_ativo_proprio_vs_ativo_usado.md`          | 📊 matriz | Proteger valuation e sociedade                | 🚨 crítico |
| `matriz_de_prontidao_para_plano_de_negocio.md`    | 📊 matriz | Evitar plano completo cedo demais             | alta       |
| `matriz_de_prontidao_para_captacao.md`            | 📊 matriz | Saber se pode captar ou receber sócio         | média/alta |
| `matriz_de_operacoes_por_conta_atendida.md`       | 📊 matriz | Separar execução por conta                    | média      |
| `matriz_empresas_b_vs_ventures_vs_metodos.md`     | 📊 matriz | Cruzar os três pilares da raiz do GrupoB      | alta       |

---

## 15. Registros e evidências que precisam existir

| Registro                                 | Tipo        | Motivo                                    | Prioridade |
| ---------------------------------------- | ----------- | ----------------------------------------- | ---------- |
| `registro_de_ideia.md`                   | 🧾 registro | Não perder origem da ideia                | alta       |
| `registro_de_falas_reais_rodrigues.md`   | 🧾 registro | Preservar autoria e intenção              | 🚨 crítico |
| `registro_de_extracao_fase_02.md`        | 🧾 registro | Rastrear o que foi extraído do bruto      | 🚨 crítico |
| `registro_de_decisao_startyb.md`         | 🧾 registro | Rastrear decisão de negócio               | alta       |
| `registro_de_congelamento.md`            | 🧾 registro | Registrar por que não avançou             | alta       |
| `registro_de_ativo_usado.md`             | 🧾 registro | Saber o que a empresa usa, mas não possui | 🚨 crítico |
| `registro_de_uso_de_metodo_do_grupob.md` | 🧾 registro | Proteger métodos e valuation              | 🚨 crítico |
| `registro_de_passagem_para_loze.md`      | 🧾 registro | Rastrear envio para tecnologia            | alta       |
| `registro_de_entrada_de_socio.md`        | 🧾 registro | Separar o que entra na sociedade          | alta       |
| `registro_de_parecer_go_freeze_no_go.md` | 🧾 registro | Guardar parecer final                     | alta       |

---

## 16. Protocolos reais que precisam existir

Nem tudo abaixo é protocolo. Só deve ser chamado de protocolo quando houver situação específica, sequência obrigatória, responsável e saída esperada.

### 16.1. `protocolo_de_exploracao_de_ideia.md`

**Tipo:** 🟢 protocolo
**Situação:** quando uma ideia nova nasce no GrupoB.
**Responsável:** Dante Montoya.
**Saída esperada:** tese preliminar, riscos, perguntas e destino sugerido.

### 16.2. `protocolo_de_abertura_de_plano_de_negocio.md`

**Tipo:** 🟢 protocolo
**Situação:** quando uma ideia pode virar negócio, empresa ou venture.
**Responsável:** César / StartyB.
**Saída esperada:** autorização ou recusa de abertura do DOC-001.

### 16.3. `protocolo_de_passagem_para_loze.md`

**Tipo:** 🟢 protocolo
**Situação:** quando a iniciativa exige sistema, app, plataforma, automação ou produto digital.
**Responsável:** StartyB + Loze/Sávio.
**Saída esperada:** briefing mínimo validado para tecnologia.

### 16.4. `protocolo_de_documento_canonico.md`

**Tipo:** 🟢 protocolo
**Situação:** quando documento sai da lousa/triagem e vira fonte oficial.
**Responsável:** Yuri/Pietro.
**Saída esperada:** documento canônico versionado.

### 16.5. `protocolo_de_congelamento_de_iniciativa.md`

**Tipo:** 🟢 protocolo
**Situação:** quando iniciativa é interessante, mas não deve avançar agora.
**Responsável:** César/Pietro/Rodrigues, conforme impacto.
**Saída esperada:** registro de congelamento e condição de reabertura.

### 16.6. `protocolo_de_entrada_de_socio_ou_captacao.md`

**Tipo:** 🟢 protocolo
**Situação:** quando empresa/venture pode receber sócio, captar ou vender participação.
**Responsável:** César + jurídico + Rodrigues/Kane.
**Saída esperada:** checklist societário, ativos, valuation e aprovação.

---

## 17. Documentos derivados prioritários

| Documento                                     | Tipo         | Por que precisa existir                     | Prioridade | Responsável           |
| --------------------------------------------- | ------------ | ------------------------------------------- | ---------- | --------------------- |
| `padrao_fase_01_triagem_unica.md`             | 🟠 padrão    | Já está em uso e precisa ser normatizado    | 🚨 crítico | Yuri / César / Pietro |
| `padrao_fase_02_novas_informacoes.md`         | 🟠 padrão    | Foi testado na PapoB e precisa virar padrão | 🚨 crítico | César / Yuri          |
| `modelo_doc_000_descritivo_estrutural.md`     | 🟠 padrão    | Base antes do plano completo                | alta       | César                 |
| `modelo_doc_001_plano_de_negocio_oficial.md`  | 🟠 padrão    | Documento estrutural principal              | alta       | César                 |
| `estrutura_4_pilares_12_blocos_43_topicos.md` | 🟠 padrão    | Base do plano StartyB                       | alta       | César                 |
| `padrao_organograma_evolutivo_v1_v2_v3.md`    | 🟠 padrão    | Toda empresa precisa de evolução estrutural | alta       | César                 |
| `padrao_ativos_relacoes_e_valor.md`           | 🟠 padrão    | Protege valuation e sócios                  | 🚨 crítico | César / Jurídico      |
| `matriz_ativo_proprio_vs_ativo_usado.md`      | 📊 matriz    | Evita confusão com métodos do GrupoB        | 🚨 crítico | César / Pietro / Nilo |
| `estrutura_padrao_de_venture.md`              | 🟠 padrão    | Define venture como empresa em formação     | alta       | César                 |
| `estrutura_padrao_de_empresa_b.md`            | 🟠 padrão    | Faltou na Missão 1                          | alta       | César / Pietro        |
| `protocolo_de_passagem_para_loze.md`          | 🟢 protocolo | Evita tecnologia sem validação              | alta       | César / Sávio         |
| `registro_de_falas_reais_rodrigues.md`        | 🧾 registro  | Preserva intenção e autoria                 | 🚨 crítico | Yuri / César          |

---

## 18. Lacunas, dúvidas e validações

| Lacuna                                    | Impacto                                      | Quem valida                | Prioridade | Recomendação                                          |
| ----------------------------------------- | -------------------------------------------- | -------------------------- | ---------- | ----------------------------------------------------- |
| Nome final do bloco                       | Pode gerar conflito com StartyB como empresa | Pietro / Rodrigues         | média      | Validar se mantém Negócios, Ventures e Planos         |
| Se Empresas B devem ter bloco próprio     | Sem isso, só ventures ficam estruturadas     | Pietro / César             | alta       | Adicionar bloco `09_empresas_b/`                      |
| Critério de transição venture → empresa B | Afeta organização e governança               | Rodrigues / Pietro / César | alta       | Criar matriz específica                               |
| Critério de método usado no valuation     | Pode inflar valor societário                 | Pietro / Nilo / Jurídico   | 🚨 crítico | Criar regra e registro obrigatório                    |
| Critério de preenchimento do documento 03 | Pode consolidar cedo demais                  | Rodrigues / Yuri / César   | alta       | Documento 03 só após validação do 02                  |
| Responsável final por QG e pastas         | Pode duplicar com Yuri/Sávio                 | Yuri / Sávio / Pietro      | média      | Negócio define necessidade; sistema organiza execução |
| Protocolo de passagem para Loze           | Pode atrasar ou pular validação              | Kane / Sávio / César       | alta       | Criar protocolo real                                  |
| Status oficial da PapoB após Fase 02      | PapoB foi teste, mas precisa validação       | Rodrigues / César          | média      | Auditar 02 antes da Fase 03                           |
| Regras de conta atendida em operações     | Pode confundir operações internas e clientes | Yuri / César / Sávio       | média      | Criar padrão dependente de Operações                  |
| Uso de IA em consolidações                | Risco de IA virar decisão                    | Pietro / César / Yuri      | 🚨 crítico | Criar regra de autoria e origem                       |

---

## 19. Versão revisada da estrutura do bloco

Versão revisada recomendada:

```text
central_de_padroes/
└── negocios_ventures_e_planos/
    ├── 00_indice_e_visao_geral/
    │   ├── README.md
    │   ├── indice_da_area.md
    │   ├── escopo_da_area.md
    │   ├── mapa_dos_documentos_da_area.md
    │   ├── status_da_area.md
    │   └── glossario_da_area.md
    │
    ├── 01_principios_politicas_regras/
    │   ├── principios_da_area.md
    │   ├── politicas_da_area.md
    │   ├── regras_centrais_da_area.md
    │   ├── classificacao_normativa.md
    │   ├── regra_de_documento_antes_da_execucao.md
    │   ├── regra_de_evidencia_antes_de_conclusao.md
    │   ├── regra_de_nao_confundir_ia_com_decisao.md
    │   └── politica_de_congelamento_de_iniciativas.md
    │
    ├── 02_triagem_e_consolidacao_de_materiais/
    │   ├── padrao_fase_01_triagem_unica.md
    │   ├── padrao_fase_02_novas_informacoes.md
    │   ├── padrao_fase_03_documento_base_para_aprovacao.md
    │   ├── checklist_fase_01_triagem_bruta.md
    │   ├── checklist_fase_02_novas_informacoes.md
    │   ├── checklist_antes_de_preencher_documento_03.md
    │   ├── registro_de_falas_reais_rodrigues.md
    │   ├── registro_de_origem_de_informacao.md
    │   └── regra_de_separacao_fala_ia_prompt_documento.md
    │
    ├── 03_nascimento_de_ideias/
    │   ├── processo_de_nascimento_de_ideia.md
    │   ├── padrao_de_registro_minimo_de_ideia.md
    │   ├── protocolo_de_exploracao_de_ideia.md
    │   ├── saida_padrao_do_dante_montoya.md
    │   ├── criterios_para_encaminhamento_da_ideia.md
    │   └── registro_de_ideia_modelo.md
    │
    ├── 04_classificacao_de_iniciativas/
    │   ├── matriz_ideia_projeto_produto_empresa_venture.md
    │   ├── matriz_empresas_b_ventures_metodos.md
    │   ├── matriz_de_maturidade_da_iniciativa.md
    │   ├── criterio_para_virar_marca.md
    │   ├── criterio_para_virar_empresa_b.md
    │   ├── criterio_para_virar_venture.md
    │   ├── criterio_para_virar_produto_digital.md
    │   ├── criterio_para_congelar_iniciativa.md
    │   └── criterio_para_descartar_iniciativa.md
    │
    ├── 05_documentos_base_de_negocio/
    │   ├── padrao_doc_000_descritivo_estrutural.md
    │   ├── padrao_doc_001_plano_de_negocio_oficial.md
    │   ├── padrao_documentos_oficiais_por_empresa.md
    │   ├── regra_de_indice_obrigatorio_em_documentos.md
    │   ├── regra_de_canvas_antes_de_fonte_canonica.md
    │   └── processo_de_documento_canonico.md
    │
    ├── 06_plano_de_negocio_startyb/
    │   ├── estrutura_4_pilares_12_blocos_43_topicos.md
    │   ├── mapa_dos_4_pilares.md
    │   ├── mapa_dos_12_blocos.md
    │   ├── mapa_dos_43_topicos.md
    │   ├── protocolo_de_abertura_de_plano_de_negocio.md
    │   ├── criterio_de_entrada_minima_para_plano.md
    │   ├── saida_final_go_ajustes_freeze_no_go.md
    │   └── modelo_de_parecer_final_do_plano.md
    │
    ├── 07_organograma_e_departamentos/
    │   ├── padrao_organograma_evolutivo_v1_v2_v3.md
    │   ├── matriz_de_departamentos_base.md
    │   ├── matriz_de_funcoes_acumuladas.md
    │   ├── mapa_de_humanos_agentes_e_vazios.md
    │   ├── mapa_de_servicos_compartilhados_grupob.md
    │   ├── criterios_de_evolucao_v1_v2_v3.md
    │   └── checklist_de_organograma_minimo.md
    │
    ├── 08_ativos_relacoes_e_valor/
    │   ├── padrao_ativos_relacoes_e_valor.md
    │   ├── matriz_ativo_proprio_vs_ativo_do_grupob.md
    │   ├── registro_de_metodos_usados_pela_empresa.md
    │   ├── regra_de_ativo_que_entra_no_valuation.md
    │   ├── regra_de_uso_de_metodos_do_grupob.md
    │   ├── checklist_pre_entrada_de_socio.md
    │   └── registro_de_licenca_ou_autorizacao_de_uso.md
    │
    ├── 09_empresas_b/
    │   ├── estrutura_padrao_de_empresa_b.md
    │   ├── criterio_para_empresa_b_ativa.md
    │   ├── criterio_para_empresa_b_em_revisao.md
    │   ├── criterio_para_empresa_b_congelada.md
    │   ├── documentos_minimos_de_empresa_b.md
    │   ├── relacao_empresa_b_com_metodos.md
    │   └── checklist_empresa_b_pronta_para_plano.md
    │
    ├── 10_ventures/
    │   ├── estrutura_padrao_de_venture.md
    │   ├── criterio_para_venture_em_exploracao.md
    │   ├── criterio_para_venture_em_estruturação.md
    │   ├── criterio_para_venture_operacional.md
    │   ├── criterio_para_venture_virar_empresa_b.md
    │   ├── estrutura_de_data_room_para_venture.md
    │   ├── checklist_de_prontidao_para_captacao.md
    │   └── regra_de_venture_como_empresa_em_formacao.md
    │
    ├── 11_operacoes_por_conta_atendida/
    │   ├── conceito_de_conta_atendida.md
    │   ├── regra_de_empresa_poder_ser_sua_propria_conta.md
    │   ├── matriz_de_contas_atendidas.md
    │   ├── checklist_operacoes_por_conta.md
    │   └── dependencias_com_yuri_e_savio.md
    │
    ├── 12_fluxos_de_encaminhamento/
    │   ├── matriz_de_destino_no_ecossistema.md
    │   ├── processo_ideia_para_startyb.md
    │   ├── processo_ideia_para_loze.md
    │   ├── processo_ideia_para_acadb.md
    │   ├── processo_ideia_para_3forb.md
    │   ├── processo_ideia_para_metodos.md
    │   └── processo_decisao_para_taskzei.md
    │
    ├── 13_sistema_multiagente_plano_de_negocio/
    │   ├── arquitetura_multiagente_do_plano.md
    │   ├── agentes_de_evidencia.md
    │   ├── agentes_analistas_43_topicos.md
    │   ├── gerentes_de_bloco_12.md
    │   ├── auditores_de_pilar_4.md
    │   ├── auditores_sistemicos_3.md
    │   ├── padrao_de_saida_dos_agentes.md
    │   └── limites_dos_agentes_do_plano.md
    │
    ├── checklists/
    │   ├── checklist_fase_01_triagem_bruta.md
    │   ├── checklist_fase_02_novas_informacoes.md
    │   ├── checklist_antes_de_criar_negocio.md
    │   ├── checklist_antes_de_criar_venture.md
    │   ├── checklist_antes_de_criar_empresa_b.md
    │   ├── checklist_antes_de_abrir_plano_de_negocio.md
    │   ├── checklist_antes_de_enviar_para_loze.md
    │   ├── checklist_antes_de_entrada_de_socio.md
    │   └── checklist_antes_de_valorizar_ativo.md
    │
    ├── matrizes/
    │   ├── matriz_ideia_projeto_produto_empresa_venture.md
    │   ├── matriz_empresas_b_ventures_metodos.md
    │   ├── matriz_de_destino_no_ecossistema.md
    │   ├── matriz_go_go_ajustes_freeze_no_go.md
    │   ├── matriz_de_risco_do_negocio.md
    │   ├── matriz_de_prioridade_de_iniciativas.md
    │   ├── matriz_de_maturidade_da_empresa.md
    │   └── matriz_ativo_proprio_vs_ativo_usado.md
    │
    ├── registros_e_evidencias/
    │   ├── registro_de_ideia.md
    │   ├── registro_de_falas_reais_rodrigues.md
    │   ├── registro_de_exploracao_dante.md
    │   ├── registro_de_decisao_startyb.md
    │   ├── registro_de_congelamento.md
    │   ├── registro_de_ativo_usado.md
    │   ├── registro_de_passagem_para_outra_area.md
    │   ├── registro_de_parecer_go_freeze_no_go.md
    │   └── registro_de_uso_de_metodo_do_grupob.md
    │
    ├── lacunas_duvidas_validacoes/
    │   ├── lacunas_da_area.md
    │   ├── duvidas_para_rodrigues.md
    │   ├── validacoes_com_pietro_carboni.md
    │   ├── dependencias_com_dante_montoya.md
    │   ├── dependencias_com_noah_verdili.md
    │   ├── dependencias_com_nilo_barreti.md
    │   ├── dependencias_com_savio_codare.md
    │   ├── dependencias_com_yuri_sague.md
    │   ├── dependencias_com_loze.md
    │   └── dependencias_com_juridico.md
    │
    └── documentos_derivados/
        ├── modelo_doc_000_descritivo_estrutural.md
        ├── modelo_doc_001_plano_de_negocio_oficial.md
        ├── modelo_02_novas_informacoes.md
        ├── modelo_03_documento_base_consolidado_para_aprovacao.md
        ├── modelo_organograma_evolutivo.md
        ├── modelo_ativos_relacoes_e_valor.md
        ├── modelo_estrutura_padrao_de_empresa_b.md
        ├── modelo_estrutura_padrao_de_venture.md
        ├── modelo_parecer_startyb.md
        └── modelo_registro_de_decisao.md
```

---

## 20. Ordem recomendada de criação dos documentos

```text
Primeiro:
- escopo_da_area.md
- principios_da_area.md
- regra_de_nao_confundir_ia_com_decisao.md
- padrao_fase_01_triagem_unica.md
- padrao_fase_02_novas_informacoes.md
- matriz_ideia_projeto_produto_empresa_venture.md
- matriz_empresas_b_ventures_metodos.md
- matriz_de_destino_no_ecossistema.md

Depois:
- modelo_doc_000_descritivo_estrutural.md
- modelo_doc_001_plano_de_negocio_oficial.md
- estrutura_4_pilares_12_blocos_43_topicos.md
- padrao_organograma_evolutivo_v1_v2_v3.md
- padrao_ativos_relacoes_e_valor.md
- estrutura_padrao_de_empresa_b.md
- estrutura_padrao_de_venture.md

Por último:
- protocolo_de_abertura_de_plano_de_negocio.md
- protocolo_de_passagem_para_loze.md
- protocolo_de_congelamento_de_iniciativa.md
- estrutura_de_data_room_para_venture.md
- checklist_de_prontidao_para_captacao.md
- matriz_de_prontidao_para_captacao.md
- modelo_de_parecer_para_investidor.md
```

---

## 21. Síntese final

Minha leitura final é que o bloco **Negócios, Ventures e Planos** já possui como base a estruturação de ideias, classificação de iniciativas, DOC-000, DOC-001, plano de negócio StartyB, organograma evolutivo, ativos e sistema multiagente, mas precisa evoluir em triagem e consolidação de materiais, empresas B, operações por conta atendida, separação entre fala real do Rodrigues e resposta de IA, relação entre métodos usados e valuation, e critérios de passagem entre empresas B, ventures, métodos e Loze. A versão revisada da estrutura deve priorizar **Fase 01 Triagem Única**, **Fase 02 Novas Informações**, **matriz ideia/projeto/produto/empresa/venture**, **matriz empresas B/ventures/métodos**, **DOC-000**, **DOC-001**, **ativos, relações e valor**, e **estrutura padrão de empresa B e venture**, manter dependência com **Pietro, Dante, Noah, Nilo, Sávio/Loze, Yuri, jurídico, Rodrigues e Kane**, e evitar os principais riscos de duplicidade ou confusão de escopo: naming versus estratégia, método versus ativo próprio da empresa, produto digital versus venture, resposta de IA versus decisão do Rodrigues, e operação por conta versus estrutura departamental.
