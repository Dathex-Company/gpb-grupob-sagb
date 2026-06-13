# Auditoria e Revisão do Bloco Modelos de IA, RAI e Radar Tecnológico — Central de Padrões

**Bloco auditado:** Modelos de IA, RAI e Radar Tecnológico
**Responsável da área:** Klaus Wagen
**Solicitante:** Pietro Carboni
**Contexto:** Central de Padrões do GrupoB / Loze dentro do SagB
**Missão:** Missão 2 — Auditoria, Cruzamento e Revisão da Estrutura do Bloco
**Status:** Documento de auditoria para consolidação por Pietro Carboni
**Data:** 30/05/2026

---

## 1. Objetivo da auditoria

Auditar criticamente a estrutura criada na Missão 1 para o bloco **Modelos de IA, RAI e Radar Tecnológico**, cruzando a estrutura inicial com tudo que já apareceu neste chat sobre:

* modelos de IA;
* fornecedores de IA;
* famílias de modelos;
* modelos específicos;
* RAI — Radar de Inteligências Artificiais;
* Klaus Wagen como mentor e curador de IA;
* Plantão RAI;
* atualização diária do mercado de IA;
* documentação oficial;
* benchmarks;
* system cards;
* model cards;
* preços e APIs;
* riscos de fornecedor;
* retenção de dados;
* uso de dados para treinamento;
* recomendações de uso por frente do GrupoB;
* dependências com Pierre, Sávio, Pedro Gazan, Alice, Pietro e Kane/Rodrigues.

O objetivo é transformar a primeira estrutura em uma versão mais limpa, completa, prática e adequada para virar pasta real dentro da Central de Padrões.

---

## 2. Escopo analisado

Esta auditoria analisa somente a área de responsabilidade de **Klaus Wagen**.

### Dentro do escopo

* Curadoria de modelos de IA.
* Curadoria de fornecedores de IA.
* Radar tecnológico de IA.
* RAI — Radar de Inteligências Artificiais.
* Monitoramento de atualizações de mercado.
* Classificação de modelos por uso.
* Recomendação de modelos por tarefa.
* Custos, APIs, pricing e limites.
* Termos de uso, retenção de dados e uso para treinamento como análise inicial.
* Benchmarks, testes e qualidade por tipo de tarefa.
* Alertas de mudança crítica em IA.
* Documentos oficiais de modelos, como system cards, model cards, API docs, changelogs, pricing pages e safety reports.

### Fora do escopo principal

* Arquitetura profunda de agentes autônomos.
* Autonomia A0–A6.
* Memória aplicada de agentes.
* Tool use operacional.
* Orquestração multiagente.
* Implementação técnica de APIs.
* Banco de dados do SagB.
* Deploy e infraestrutura.
* Segurança digital operacional.
* Credenciais e permissões.
* UX/UI e design system.
* Planos de negócio.
* Naming de marcas.
* Metodologia educacional.

Quando esses temas encostam na área de Klaus, devem ser registrados como dependência, não assumidos como responsabilidade direta.

---

## 3. Fontes consideradas

Foram consideradas as seguintes fontes internas deste chat:

1. Estrutura criada na Missão 1 para o bloco **Modelos de IA, RAI e Radar Tecnológico**.
2. Documento anterior **Padrões de Modelos de IA, RAI e Radar Tecnológico — GrupoB**.
3. Conversas sobre o **Observatório Global de IA** dentro do SagB.
4. Conversas sobre o agente **Klaus Wagen**.
5. Conversas sobre **Plantão RAI**.
6. Discussões sobre modelos de IA, LLMs, vídeo, voz, imagem, APIs e fornecedores.
7. Discussões sobre RAI como radar vivo alimentado diariamente.
8. Discussões sobre dados simulados no HTML do painel.
9. Discussões sobre árvore **empresa mãe → família de modelos → modelo específico**.
10. Discussões sobre benchmarking, model cards, system cards, documentação oficial e obrigação ou não de publicação de desempenho.
11. Discussões sobre a **Máquina de Agentes Autônomos**, apenas quando encostam no RAI ou nos agentes pesquisadores que alimentam Klaus.
12. Modelo normativo geral definido por Pietro Carboni: princípio, política, regra, padrão, protocolo, processo, procedimento, checklist, matriz, registro/evidência, risco, recomendação, decisão, dúvida e crítico.

Não foram inventadas decisões finais onde elas ainda não existem. Itens ainda indefinidos foram marcados como **PRECISA VALIDAÇÃO**.

---

## 4. Resumo da estrutura criada na Missão 1

A estrutura da Missão 1 organizou o bloco em torno dos seguintes eixos:

* visão geral da área;
* princípios, políticas e regras;
* fornecedores de IA;
* modelos e famílias de IA;
* RAI — Radar de Inteligências Artificiais;
* preços, APIs, termos e dados;
* testes, benchmarks e qualidade;
* recomendações de uso por frente;
* dependências com outras áreas;
* checklists;
* matrizes;
* registros e evidências;
* lacunas, dúvidas e validações;
* documentos derivados.

A estrutura estava correta como primeira versão. Ela já separava bem fornecedor, família, modelo, custo, API, RAI, benchmark, recomendação e dependências.

Entretanto, a auditoria mostrou que alguns temas importantes discutidos neste chat precisam entrar de forma mais clara ou mudar de lugar.

---

## 5. O que está correto na estrutura atual

### 5.1 Separação entre fornecedor, família e modelo

A estrutura acertou ao separar:

* fornecedor de IA;
* família de modelos;
* modelo específico;
* recomendações por uso;
* custos e APIs;
* registros de atualização.

Essa separação é essencial porque evita confusão entre, por exemplo:

* OpenAI como fornecedor;
* GPT como família;
* GPT-5.5 como modelo;
* ChatGPT como produto;
* Sora como modelo de vídeo;
* API como canal técnico de uso.

Classificação: 🔵 princípio / 🟠 padrão
Status: definido

---

### 5.2 Criação de bloco próprio para o RAI

Foi correto criar o bloco `04_rai_radar_de_inteligencias_artificiais/`.

O RAI é um eixo operacional próprio, porque não é apenas catálogo. Ele deve:

* varrer fontes;
* detectar novidades;
* registrar evidências;
* classificar impacto;
* gerar alertas;
* recomendar ação;
* encaminhar revisão humana quando necessário.

Classificação: ⚙️ processo / 🟢 protocolo em casos críticos
Status: definido, mas precisa detalhamento operacional

---

### 5.3 Inclusão de preços, APIs, termos e dados

O bloco `05_precos_apis_termos_e_dados/` está correto porque uma IA não deve ser avaliada apenas pela qualidade técnica.

Também importam:

* custo;
* pricing;
* limite de contexto;
* política de dados;
* retenção;
* uso para treinamento;
* API;
* mudança de termos;
* disponibilidade.

Classificação: 🟣 política / 📊 matriz / 🧾 registro
Status: correto

---

### 5.4 Inclusão de testes, benchmarks e qualidade

O bloco `06_testes_benchmarks_e_qualidade/` está correto porque as decisões sobre modelos precisam de avaliação comparável.

Deve cobrir:

* benchmarks oficiais;
* benchmarks independentes;
* testes internos;
* avaliação por tipo de tarefa;
* comportamento em regressão;
* qualidade para análise, código, voz, vídeo, imagem, agentes e atendimento.

Classificação: 📊 matriz / 🧾 registro / ⚙️ processo
Status: correto, mas precisa reforço

---

### 5.5 Inclusão de dependências com outras áreas

A estrutura acertou ao prever dependências, especialmente com:

* Pietro Carboni;
* Pierre Zanulli;
* Sávio Codare;
* Pedro Gazan;
* Alice Montini;
* Yuri Sague;
* Kane/Rodrigues.

Classificação: 🟠 padrão / 🧾 registro
Status: correto

---

## 6. O que ficou incompleto

### 6.1 Faltou um bloco explícito para Klaus Wagen e governança do radar

A Missão 1 citou o RAI, mas não criou um bloco próprio para o papel do **Klaus Wagen** como agente mentor, curador e coordenador do radar.

Isso precisa entrar porque o chat definiu Klaus como:

* mentor de IA do SagB/Loze;
* curador estratégico;
* filtro contra hype;
* coordenador dos agentes pesquisadores;
* responsável por transformar novidades em decisão;
* voz do Plantão RAI.

Recomendação: criar bloco específico:

```text
04_governanca_klaus_wagen_e_plantao_rai/
```

ou incorporar isso dentro de `04_rai_radar_de_inteligencias_artificiais/`.

Melhor decisão: manter dentro do RAI para evitar excesso de blocos, mas criar arquivos explícitos.

Classificação: 💡 recomendação
Status: precisa ajuste

---

### 6.2 Faltou estrutura mais forte para documentos oficiais

A estrutura mencionou documentação, mas não criou um bloco específico para:

* system cards;
* model cards;
* technical reports;
* API docs;
* pricing pages;
* safety reports;
* release notes;
* changelogs;
* papers;
* GitHub releases;
* termos de uso;
* políticas de privacidade.

Isso apareceu fortemente no chat, inclusive na discussão sobre a obrigação ou não das empresas publicarem desempenho.

Recomendação: criar bloco próprio:

```text
06_documentacoes_oficiais_e_fontes/
```

ou mover parte do conteúdo para dentro de RAI.

Melhor decisão: criar bloco próprio, porque documentação oficial é evidência central para decisões.

Classificação: 🧾 registro ou evidência / 🟠 padrão
Status: faltou entrar

---

### 6.3 Faltou bloco de alertas e Plantão RAI com mais clareza

O chat definiu a ideia de:

* Plantão RAI;
* Alerta Klaus;
* níveis de alerta;
* mensagem direta ao Rodrigues quando houver novidade crítica;
* alerta por mudança de modelo, preço, API, termo, retenção ou comportamento.

A Missão 1 tinha `niveis_de_alerta_do_rai.md` e `protocolo_de_alerta_de_mudanca_critica_em_ia.md`, mas o tema merece uma área mais visível.

Recomendação: criar subbloco dentro do RAI:

```text
alertas_e_plantao_rai/
```

Classificação: 🟢 protocolo / 🧾 registro / 🚨 crítico
Status: precisa reforço

---

### 6.4 Faltou campo específico para “modelo muda comportamento”

A conversa destacou que modelos podem mudar comportamento mesmo mantendo nome parecido.

Isso precisa virar documento próprio:

```text
protocolo_de_mudanca_de_comportamento_de_modelo.md
registro_de_mudanca_de_comportamento_de_modelo.md
checklist_de_regressao_de_comportamento_de_modelo.md
```

Classificação: 🟢 protocolo / ✅ checklist / 🧾 registro
Status: faltou entrar com força

---

### 6.5 Faltou conexão explícita com agentes pesquisadores do RAI

A área de Klaus não é responsável por arquitetura profunda de agentes, mas o chat definiu que Klaus coordena agentes pesquisadores do RAI.

Isso precisa ser registrado como dependência com Pierre Zanulli e Sávio Codare.

Documento sugerido:

```text
criterios_para_agentes_pesquisadores_do_rai.md
```

Mas o documento deve ser limitado ao que Klaus precisa desses agentes, sem definir autonomia, memória ou orquestração.

Classificação: 🟠 padrão / ⚠️ risco de escopo
Status: precisa validação com Pierre

---

### 6.6 Faltou explicitar que o painel HTML tinha dados simulados

No chat houve correção: os dados do HTML eram mockados, não reais.

A estrutura deve prever um padrão para diferenciar:

* dado real;
* dado simulado;
* dado estimado;
* dado de fonte oficial;
* dado de fonte secundária;
* dado pendente de validação.

Documento sugerido:

```text
padrao_de_status_da_informacao_no_rai.md
```

Classificação: 🟠 padrão / 🔴 regra
Status: precisa adicionar

---

## 7. O que apareceu no chat e não entrou na estrutura

1. Papel formal do **Klaus Wagen** como mentor e coordenador do radar.
2. Ideia de **Plantão RAI** com alertas diretos ao Rodrigues.
3. Rotina de varredura em múltiplos horários ao dia.
4. Níveis de alerta: baixo, médio, alto, crítico.
5. Agentes pesquisadores subordinados ao RAI/Klaus.
6. Separação entre dado real, mockado, estimado e validado.
7. Discussão sobre obrigação regulatória de publicar desempenho.
8. System cards, model cards e safety reports como documentos oficiais prioritários.
9. Registro de mudança de comportamento de modelo.
10. Protocolo de modelo descontinuado.
11. Matriz de modelo barato vs modelo premium.
12. Critérios para usar modelo em agente.
13. Critérios para comunicar Pierre, Sávio, Pedro, Alice, Pietro e Kane/Rodrigues.
14. Boletim diário ou semanal de IA.
15. Padrão de recomendação automática do Klaus.
16. Ficha de empresa mãe → família → modelo → versão → documentos → benchmarks → preço.
17. Campos para ranking de relevância para Loze/SagB.
18. Índice de risco de hype.
19. Monitoramento de mudanças de API/pricing/licença.
20. Diferenciação entre ferramenta que usa IA e modelo próprio.

---

## 8. Itens que devem ser adicionados

### 8.1 Arquivos novos recomendados

```text
04_rai_radar_de_inteligencias_artificiais/
├── papel_do_klaus_wagen_no_rai.md
├── plantao_rai.md
├── rotina_diaria_do_rai.md
├── rotina_de_varredura_critica_do_rai.md
├── criterios_para_agentes_pesquisadores_do_rai.md
├── padrao_de_status_da_informacao_no_rai.md
└── protocolo_de_comunicacao_de_alerta_rai.md
```

```text
06_documentacoes_oficiais_e_fontes/
├── tipos_de_documentos_oficiais_de_modelos.md
├── padrao_de_registro_de_system_card.md
├── padrao_de_registro_de_model_card.md
├── padrao_de_registro_de_api_docs.md
├── padrao_de_registro_de_pricing_page.md
├── padrao_de_registro_de_safety_report.md
├── fontes_oficiais_prioritarias.md
└── matriz_de_confiabilidade_da_fonte.md
```

```text
07_testes_benchmarks_e_qualidade/
├── checklist_de_regressao_de_comportamento_de_modelo.md
├── protocolo_de_mudanca_de_comportamento_de_modelo.md
├── registro_de_mudanca_de_comportamento_de_modelo.md
├── matriz_modelo_barato_vs_modelo_premium.md
└── criterios_de_qualidade_por_tipo_de_tarefa.md
```

### 8.2 Itens conceituais que precisam entrar

* Fonte oficial primeiro.
* Status da informação: real, simulado, estimado, validado, pendente.
* Diferença entre fornecedor, família, modelo, produto e interface.
* Alerta crítico quando muda API, preço, licença, retenção ou comportamento.
* Separação entre recomendação técnica e aprovação oficial.
* Registro de evidência antes de comunicar alerta.
* Não usar ranking sem critério claro.

---

## 9. Itens que devem ser removidos ou movidos

### 9.1 `recomendacoes_para_agentes_autonomos.md`

Na Missão 1, esse arquivo apareceu dentro de recomendações por frente.

Ele deve ser ajustado para não invadir Pierre Zanulli.

Novo nome sugerido:

```text
recomendacoes_de_modelos_para_uso_em_agentes.md
```

Motivo: Klaus recomenda modelos para agentes, mas Pierre define arquitetura, autonomia, memória, tool use e orquestração.

Classificação: ⚠️ risco de escopo
Ação: mover/renomear

---

### 9.2 `politica_de_uso_de_modelos_externos.md`

Esse documento encosta fortemente em segurança, dados e jurídico.

Deve continuar na área de Klaus como análise inicial, mas com dependência explícita com Pedro Gazan e Pietro Carboni.

Ação: manter, mas adicionar validação obrigatória.

---

### 9.3 `registro_de_mudancas_de_api.md`

Esse registro está no bloco de preços/APIs, mas também afeta Sávio Codare.

Ação: manter no bloco de Klaus como radar/evidência e criar dependência com Sávio.

---

### 9.4 `manual_operacional_do_rai.md`

Este documento pode parecer processo de Yuri/Sávio.

Ação: manter na área de Klaus apenas como manual de inteligência e curadoria. A operação técnica ou automação do RAI deve depender de Sávio e Yuri.

---

## 10. Duplicidades e conflitos de escopo

### 10.1 Klaus x Pierre

Conflito potencial: modelos para agentes.

* Klaus define quais modelos são adequados para agentes.
* Pierre define como agentes operam, autonomia, memória, tool use e orquestração.

Ação: criar dependência explícita.

---

### 10.2 Klaus x Sávio

Conflito potencial: API e integração.

* Klaus monitora API, preço, documentação e mudança.
* Sávio implementa, integra e define arquitetura técnica.

Ação: separar `registro_de_api` de `implementacao_de_api`.

---

### 10.3 Klaus x Pedro Gazan

Conflito potencial: retenção de dados e segurança.

* Klaus identifica política do fornecedor.
* Pedro valida risco, dados sensíveis, credenciais e segurança.

Ação: toda análise de dados sensíveis deve ir para Pedro.

---

### 10.4 Klaus x Alice

Conflito potencial: IA em interface.

* Klaus avalia capacidade do modelo.
* Alice define experiência, interface e design system.

Ação: quando um modelo impactar interface, registrar dependência.

---

### 10.5 Klaus x Pietro

Conflito potencial: recomendação virar padrão oficial.

* Klaus recomenda.
* Pietro aprova como padrão.

Ação: todo documento de política, regra ou padrão deve ter campo de validação por Pietro.

---

### 10.6 Klaus x Yuri

Conflito potencial: rotina operacional do RAI.

* Klaus define a inteligência do radar.
* Yuri pode ajudar a organizar o processo operacional e rotina sistêmica.

Ação: processo recorrente do RAI deve ser validado com Yuri quando virar operação sistêmica.

---

## 11. Dependências com outras áreas

| Tema                              | Depende de qual área | Motivo                                                             | Arquivo de dependência sugerido                                           |
| --------------------------------- | -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Uso de modelo em agente           | Pierre Zanulli       | Pierre define agentes, autonomia, memória, tool use e orquestração | `dependencias_com_pierre_zanulli.md`                                      |
| API, SDK e integração             | Sávio Codare         | Sávio define implementação, arquitetura, módulos e deploy          | `dependencias_com_savio_codare.md`                                        |
| Retenção de dados e treinamento   | Pedro Gazan          | Pedro valida segurança, dados sensíveis e riscos digitais          | `dependencias_com_pedro_gazan.md`                                         |
| IA na interface                   | Alice Montini        | Alice define UX/UI, experiência e design system                    | `dependencias_com_alice_montini.md`                                       |
| Padrão oficial                    | Pietro Carboni       | Pietro valida classificação normativa e canetada final             | `dependencias_com_pietro_carboni.md`                                      |
| Rotina operacional do RAI         | Yuri Sague           | Yuri organiza processos e operação sistêmica                       | `dependencias_com_yuri_sague.md`                                          |
| Decisão estratégica de fornecedor | Kane/Rodrigues       | Impacta custo, estratégia e direção da Loze                        | `dependencias_com_kane_rodrigues.md`                                      |
| Agentes pesquisadores do RAI      | Pierre + Sávio       | Pierre define lógica agentic; Sávio implementa tecnicamente        | `dependencias_com_pierre_zanulli.md` e `dependencias_com_savio_codare.md` |

---

## 12. Riscos de manter a estrutura como está

### ⚠️ Risco 1 — RAI virar catálogo estático

Se o RAI não tiver rotina, alertas e registros de atualização, ele vira apenas uma lista de IAs.

Impacto: perde valor estratégico.

Ação: reforçar processo diário, Plantão RAI e registro de varreduras.

---

### ⚠️ Risco 2 — Confundir modelo com agente

Se o bloco não separar bem modelo de agente, Klaus pode invadir escopo de Pierre.

Impacto: duplicidade e conflito de decisão.

Ação: criar regra clara: Klaus recomenda modelo; Pierre define agente.

---

### ⚠️ Risco 3 — Recomendar fornecedor sem análise de dados

Se o bloco recomendar ferramentas sem analisar retenção e uso de dados para treinamento, pode haver risco de segurança.

Impacto: risco jurídico, privacidade e exposição de dados.

Ação: checklist de retenção e validação com Pedro.

---

### ⚠️ Risco 4 — Alertas sem evidência oficial

Se o Plantão RAI usar notícia ou rumor sem fonte oficial, pode gerar ruído.

Impacto: decisões precipitadas.

Ação: matriz de confiabilidade da fonte.

---

### ⚠️ Risco 5 — Dados mockados parecerem reais

O HTML do observatório usou dados simulados. Se isso não for padronizado, pode confundir usuário.

Impacto: perda de confiança.

Ação: padrão de status da informação: simulado, estimado, oficial, validado.

---

### ⚠️ Risco 6 — Custo invisível

Sem matriz de custo, um modelo barato por unidade pode ficar caro em escala.

Impacto: prejuízo operacional.

Ação: registrar custo por tipo de cobrança.

---

### ⚠️ Risco 7 — Mudança de comportamento sem registro

Modelos podem mudar comportamento, recusa, qualidade e formato de resposta.

Impacto: agentes, documentos e automações podem perder confiabilidade.

Ação: protocolo de mudança de comportamento de modelo.

---

## 13. Checklists que precisam existir

| Checklist                                              | Por que precisa existir                                      | Prioridade |
| ------------------------------------------------------ | ------------------------------------------------------------ | ---------- |
| `checklist_de_avaliacao_de_novo_modelo_de_ia.md`       | Evita aprovar modelo sem fornecedor, docs, custo e risco     | V1         |
| `checklist_de_avaliacao_de_novo_fornecedor.md`         | Avalia empresa, país, termos, API e confiabilidade           | V1         |
| `checklist_de_retencao_e_treinamento_de_dados.md`      | Verifica retenção, uso para treinamento e risco de dados     | crítico    |
| `checklist_de_mudanca_de_modelo.md`                    | Padroniza análise de atualização de modelo                   | V1         |
| `checklist_de_regressao_de_comportamento_de_modelo.md` | Testa se modelo mudou comportamento                          | importante |
| `checklist_de_modelo_para_uso_em_agentes.md`           | Avalia se modelo é adequado para agentes, sem invadir Pierre | V1         |
| `checklist_de_modelo_para_dados_sensiveis.md`          | Garante validação com Pedro antes de uso sensível            | crítico    |
| `checklist_de_aprovacao_de_ferramenta_de_ia.md`        | Decide testar, aprovar, monitorar ou rejeitar                | V1         |
| `checklist_de_documentacao_oficial_encontrada.md`      | Confirma system card, model card, API docs, pricing e safety | V1         |
| `checklist_de_alerta_rai.md`                           | Confirma evidência antes de alertar Rodrigues ou áreas       | V1         |

---

## 14. Matrizes que precisam existir

| Matriz                                         | Por que precisa existir                                          | Prioridade |
| ---------------------------------------------- | ---------------------------------------------------------------- | ---------- |
| `matriz_de_escolha_de_modelo_de_ia.md`         | Escolher modelo por critério, não por hype                       | V1         |
| `matriz_de_custo_qualidade_velocidade.md`      | Comparar custo, qualidade e performance                          | V1         |
| `matriz_modelo_barato_vs_modelo_premium.md`    | Decidir quando usar modelo barato ou premium                     | V1         |
| `matriz_de_risco_de_fornecedor.md`             | Avaliar dependência, país, estabilidade, termos e suporte        | V1         |
| `matriz_de_privacidade_e_retencao_de_dados.md` | Classificar risco de dados e necessidade de Pedro                | crítico    |
| `matriz_de_modelo_por_tipo_de_tarefa.md`       | Recomendar modelo para análise, código, voz, vídeo, agentes etc. | V1         |
| `matriz_testar_aprovar_monitorar_rejeitar.md`  | Definir status no RAI                                            | V1         |
| `matriz_de_prioridade_rai.md`                  | Definir o que merece alerta e o que só entra no registro         | importante |
| `matriz_de_confiabilidade_da_fonte.md`         | Separar fonte oficial, secundária, rumor e dado simulado         | V1         |
| `matriz_de_benchmarks_por_tipo_de_tarefa.md`   | Relacionar benchmarks a tarefas reais do GrupoB                  | V2         |

---

## 15. Registros e evidências que precisam existir

| Registro                                            | Por que precisa existir                                      | Prioridade |
| --------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| `registro_de_atualizacao_de_modelo.md`              | Guardar mudança de modelo e impacto                          | V1         |
| `registro_de_alerta_critico_de_ia.md`               | Registrar alertas do Plantão RAI                             | V1         |
| `registro_de_decisao_sobre_modelo.md`               | Guardar decisão de uso, rejeição ou monitoramento            | V1         |
| `registro_de_avaliacao_de_fornecedor.md`            | Guardar análise de fornecedor                                | V1         |
| `registro_de_custo_por_modelo.md`                   | Guardar preço por data e tipo de cobrança                    | V1         |
| `registro_de_testes_realizados.md`                  | Guardar teste interno e resultado                            | V1         |
| `registro_de_descontinuacao_de_modelo.md`           | Preparar substituição de modelo legado/descontinuado         | importante |
| `registro_de_mudanca_de_comportamento_de_modelo.md` | Guardar mudança de comportamento observada                   | importante |
| `registro_de_documentacao_oficial.md`               | Evidenciar system card, model card, API docs e safety report | V1         |
| `registro_de_recomendacao_para_frente_do_grupob.md` | Guardar recomendação para Loze, SagB, AcadB etc.             | V1         |
| `registro_de_varreduras_do_rai.md`                  | Provar o que foi checado pelo RAI                            | V1         |

---

## 16. Protocolos reais que precisam existir

Nem tudo deve ser chamado de protocolo. Dentro deste bloco, os protocolos reais são os que têm situação específica, sequência obrigatória, responsável e saída esperada.

### 🟢 Protocolo 1 — Alerta de mudança crítica em IA

Quando usar:

* mudança de preço;
* mudança de API;
* mudança de termos;
* mudança de retenção;
* mudança de política de treinamento;
* novo modelo disruptivo;
* descontinuação;
* mudança relevante de comportamento.

Responsável inicial: Klaus Wagen
Saída esperada: alerta registrado, áreas informadas e recomendação emitida.

---

### 🟢 Protocolo 2 — Avaliação de nova IA

Quando usar:

* nova ferramenta;
* novo modelo;
* novo fornecedor;
* nova API;
* novo framework ou plataforma relevante.

Responsável inicial: Klaus Wagen
Saída esperada: item classificado como testar, aprovar, monitorar, rejeitar ou precisa validação.

---

### 🟢 Protocolo 3 — Modelo descontinuado

Quando usar:

* fornecedor anuncia fim de suporte;
* modelo vira legado;
* API será removida;
* modelo será substituído.

Responsável inicial: Klaus Wagen
Dependências: Sávio se houver integração; Pierre se houver agente; Pedro se houver dados.

---

### 🟢 Protocolo 4 — Mudança de comportamento de modelo

Quando usar:

* resposta piorou;
* tom mudou;
* recusa aumentou;
* formato mudou;
* raciocínio caiu;
* velocidade mudou;
* agente começou a falhar por causa do modelo.

Responsável inicial: Klaus Wagen
Saída esperada: registro de comportamento, teste de regressão e recomendação.

---

### 🟢 Protocolo 5 — Comunicação de alerta para responsáveis

Quando usar:

* mudança afeta outra área.

Responsável inicial: Klaus Wagen
Saída esperada: mensagem com impacto, evidência, risco, recomendação e responsável acionado.

---

## 17. Documentos derivados prioritários

| Documento                                         | Tipo                    | Por que precisa existir                        | Prioridade | Responsável            |
| ------------------------------------------------- | ----------------------- | ---------------------------------------------- | ---------- | ---------------------- |
| `manual_do_rai.md`                                | 🟠 padrão / ⚙️ processo | Define como o radar funciona                   | V1         | Klaus / Pietro         |
| `catalogo_oficial_de_fornecedores_de_ia.md`       | 🧾 registro             | Centraliza fornecedores monitorados            | V1         | Klaus                  |
| `catalogo_oficial_de_modelos_de_ia.md`            | 🧾 registro             | Centraliza modelos, famílias e status          | V1         | Klaus                  |
| `guia_de_escolha_de_modelos_de_ia.md`             | 🟠 padrão               | Ajuda times a escolher modelo correto          | V1         | Klaus / Pietro         |
| `checklist_de_avaliacao_de_novo_modelo_de_ia.md`  | ✅ checklist             | Evita aprovação sem análise mínima             | V1         | Klaus                  |
| `matriz_de_escolha_de_modelo_de_ia.md`            | 📊 matriz               | Compara custo, qualidade, risco e uso          | V1         | Klaus                  |
| `protocolo_de_alerta_de_mudanca_critica_em_ia.md` | 🟢 protocolo            | Garante reação rápida a mudanças críticas      | crítico    | Klaus / Pietro         |
| `padrao_de_status_da_informacao_no_rai.md`        | 🟠 padrão               | Evita confundir simulado com real              | V1         | Klaus / Pietro         |
| `registro_de_atualizacao_de_modelo.md`            | 🧾 registro             | Guarda histórico de mudanças                   | V1         | Klaus                  |
| `politica_de_uso_de_ia_externa.md`                | 🟣 política             | Define limites de uso de fornecedores externos | crítico    | Klaus / Pedro / Pietro |
| `matriz_de_privacidade_e_retencao_de_dados.md`    | 📊 matriz               | Avalia risco de dados                          | crítico    | Klaus / Pedro          |
| `boletim_rai_modelo_padrao.md`                    | 🧾 registro             | Padroniza comunicação periódica                | V2         | Klaus                  |
| `relatorio_mensal_de_inteligencia_artificial.md`  | 🧾 registro             | Consolida tendências e recomendações           | futuro     | Klaus                  |

---

## 18. Lacunas, dúvidas e validações

### Tabela de lacunas

| Lacuna                                             | Impacto                                                  | Quem valida               | Prioridade | Recomendação                                                |
| -------------------------------------------------- | -------------------------------------------------------- | ------------------------- | ---------- | ----------------------------------------------------------- |
| Falta definir onde o RAI será operado tecnicamente | Pode virar só documento, sem sistema                     | Sávio Codare / Yuri Sague | V1         | Definir se será pasta, banco, módulo SagB ou painel         |
| Falta definir autonomia real do RAI                | Pode gerar alertas demais ou de menos                    | Pietro / Kane / Rodrigues | V1         | Definir níveis de alerta e quem recebe                      |
| Falta definir agentes pesquisadores do RAI         | Pode invadir escopo de Pierre                            | Pierre Zanulli            | importante | Klaus define necessidade; Pierre define arquitetura agentic |
| Falta padrão para dado real vs mockado             | Pode reduzir confiança no painel                         | Pietro Carboni            | V1         | Criar padrão de status da informação                        |
| Falta critério oficial para aprovar modelo externo | Pode gerar adoção insegura                               | Pietro / Pedro / Sávio    | crítico    | Criar política de uso de IA externa                         |
| Falta matriz de privacidade e retenção             | Risco de dados sensíveis                                 | Pedro Gazan               | crítico    | Criar matriz e checklist obrigatórios                       |
| Falta lista oficial de modelos em uso              | Dificulta controle de custo e risco                      | Sávio / Klaus             | V1         | Levantar uso real atual                                     |
| Falta rotina de testes internos                    | Recomendações podem ser baseadas só em benchmark externo | Klaus / Pietro            | V2         | Criar conjunto mínimo de testes GrupoB                      |
| Falta regra de comunicação com Rodrigues           | Pode gerar ruído ou ausência de alerta importante        | Kane / Rodrigues / Pietro | importante | Definir Plantão RAI e níveis de mensagem                    |
| Falta política de custo por fornecedor             | Pode gerar custo invisível                               | Kane / Rodrigues          | importante | Definir teto, aprovação e registro de custo                 |

### Dúvidas principais

* O RAI será um módulo do SagB, uma pasta documental ou ambos?
* O Plantão RAI pode enviar alerta direto para Rodrigues ou precisa passar por Kane/Pietro?
* Quais fornecedores já estão aprovados hoje?
* Quais modelos já estão em uso em agentes atuais?
* Qual nível de documentação oficial é mínimo para uma IA entrar como “aprovada”?
* Quais dados o GrupoB nunca deve enviar para modelos externos?
* O relatório mensal de IA será obrigatório ou opcional?

---

## 19. Versão revisada da estrutura do bloco

Abaixo está a versão revisada e melhorada da estrutura do bloco.

```text
central_de_padroes/
└── modelos_ia_rai_radar_tecnologico/
    ├── 00_indice_e_visao_geral/
    │   ├── README.md
    │   ├── indice_da_area.md
    │   ├── escopo_da_area.md
    │   ├── mapa_dos_documentos_da_area.md
    │   ├── glossario_modelos_ia_rai.md
    │   ├── status_da_area.md
    │   └── mapa_empresa_familia_modelo_produto.md
    │
    ├── 01_principios_politicas_regras/
    │   ├── principios_da_area.md
    │   ├── politicas_de_uso_e_avaliacao_de_ia.md
    │   ├── politica_de_uso_de_ia_externa.md
    │   ├── regras_centrais_de_modelos_e_fornecedores.md
    │   ├── regra_de_fonte_oficial_primeiro.md
    │   ├── regra_de_nao_confundir_modelo_agente_produto.md
    │   ├── classificacao_normativa.md
    │   └── limites_de_responsabilidade_da_area.md
    │
    ├── 02_fornecedores_de_ia/
    │   ├── cadastro_de_fornecedores_de_ia.md
    │   ├── ficha_padrao_de_fornecedor.md
    │   ├── politica_de_avaliacao_de_fornecedor.md
    │   ├── matriz_de_risco_de_fornecedor.md
    │   ├── registro_de_fornecedores_monitorados.md
    │   ├── fornecedores_prioritarios_para_o_rai.md
    │   ├── fornecedores_aprovados.md
    │   ├── fornecedores_em_observacao.md
    │   └── fornecedores_nao_recomendados.md
    │
    ├── 03_modelos_familias_versoes_e_usos/
    │   ├── catalogo_de_familias_de_modelos.md
    │   ├── catalogo_de_modelos_especificos.md
    │   ├── ficha_padrao_de_modelo_de_ia.md
    │   ├── classificacao_de_modelos_por_modalidade.md
    │   ├── classificacao_de_modelos_por_tarefa.md
    │   ├── lista_de_modelos_aprovados_por_uso.md
    │   ├── lista_de_modelos_em_teste.md
    │   ├── lista_de_modelos_monitorados.md
    │   ├── lista_de_modelos_rejeitados_ou_nao_recomendados.md
    │   ├── registro_de_modelos_descontinuados.md
    │   └── registro_de_mudanca_de_comportamento_de_modelo.md
    │
    ├── 04_rai_governanca_klaus_e_plantao/
    │   ├── manual_operacional_do_rai.md
    │   ├── papel_do_klaus_wagen_no_rai.md
    │   ├── plantao_rai.md
    │   ├── rotina_diaria_do_rai.md
    │   ├── rotina_de_varredura_critica_do_rai.md
    │   ├── processo_diario_de_varredura_do_rai.md
    │   ├── fontes_monitoradas_pelo_rai.md
    │   ├── niveis_de_alerta_do_rai.md
    │   ├── criterios_para_entrada_no_rai.md
    │   ├── criterios_para_teste_aprovacao_monitoramento_rejeicao.md
    │   ├── criterios_para_agentes_pesquisadores_do_rai.md
    │   ├── padrao_de_status_da_informacao_no_rai.md
    │   ├── protocolo_de_alerta_de_mudanca_critica_em_ia.md
    │   ├── protocolo_de_comunicacao_de_alerta_rai.md
    │   ├── boletim_de_atualizacoes_de_ia.md
    │   └── registro_de_varreduras_do_rai.md
    │
    ├── 05_precos_apis_termos_dados_e_licencas/
    │   ├── padrao_de_registro_de_custo_por_modelo.md
    │   ├── matriz_de_custo_por_tipo_de_modelo.md
    │   ├── registro_de_precos_e_planos.md
    │   ├── registro_de_mudancas_de_api.md
    │   ├── registro_de_mudancas_de_termos_de_uso.md
    │   ├── checklist_de_analise_de_termos_de_uso.md
    │   ├── checklist_de_retencao_e_uso_de_dados.md
    │   ├── matriz_de_privacidade_e_retencao_de_dados.md
    │   ├── registro_de_licencas_de_modelos.md
    │   └── registro_de_uso_de_dados_para_treinamento.md
    │
    ├── 06_documentacoes_oficiais_e_fontes/
    │   ├── tipos_de_documentos_oficiais_de_modelos.md
    │   ├── fontes_oficiais_prioritarias.md
    │   ├── matriz_de_confiabilidade_da_fonte.md
    │   ├── padrao_de_registro_de_system_card.md
    │   ├── padrao_de_registro_de_model_card.md
    │   ├── padrao_de_registro_de_api_docs.md
    │   ├── padrao_de_registro_de_pricing_page.md
    │   ├── padrao_de_registro_de_safety_report.md
    │   ├── registro_de_documentacao_oficial.md
    │   └── registro_de_fontes_secundarias_utilizadas.md
    │
    ├── 07_testes_benchmarks_qualidade_e_regressao/
    │   ├── padrao_de_teste_de_modelo_de_ia.md
    │   ├── matriz_de_benchmarks_por_tipo_de_tarefa.md
    │   ├── criterios_de_qualidade_por_uso.md
    │   ├── criterios_de_qualidade_por_tipo_de_tarefa.md
    │   ├── procedimento_de_comparacao_de_modelos.md
    │   ├── checklist_de_regressao_de_comportamento_de_modelo.md
    │   ├── protocolo_de_mudanca_de_comportamento_de_modelo.md
    │   ├── matriz_modelo_barato_vs_modelo_premium.md
    │   ├── registro_de_testes_internos_de_modelos.md
    │   ├── registro_de_benchmarks_oficiais.md
    │   └── registro_de_benchmarks_independentes.md
    │
    ├── 08_recomendacoes_de_uso_por_frente/
    │   ├── recomendacoes_para_loze.md
    │   ├── recomendacoes_para_sagb.md
    │   ├── recomendacoes_para_acadb.md
    │   ├── recomendacoes_para_startyb.md
    │   ├── recomendacoes_para_3forb.md
    │   ├── recomendacoes_para_scale_odonto.md
    │   ├── recomendacoes_de_modelos_para_uso_em_agentes.md
    │   ├── recomendacoes_para_uso_experimental.md
    │   └── registro_de_recomendacao_para_frente_do_grupob.md
    │
    ├── 09_dependencias_com_outras_areas/
    │   ├── dependencias_com_pietro_carboni.md
    │   ├── dependencias_com_pierre_zanulli.md
    │   ├── dependencias_com_savio_codare.md
    │   ├── dependencias_com_pedro_gazan.md
    │   ├── dependencias_com_alice_montini.md
    │   ├── dependencias_com_yuri_sague.md
    │   ├── dependencias_com_julio_mosqueira.md
    │   └── dependencias_com_kane_rodrigues.md
    │
    ├── checklists/
    │   ├── checklist_de_avaliacao_de_novo_modelo_de_ia.md
    │   ├── checklist_de_avaliacao_de_novo_fornecedor.md
    │   ├── checklist_de_documentacao_oficial_encontrada.md
    │   ├── checklist_de_retencao_e_treinamento_de_dados.md
    │   ├── checklist_de_mudanca_de_modelo.md
    │   ├── checklist_de_regressao_de_comportamento_de_modelo.md
    │   ├── checklist_de_modelo_para_uso_em_agentes.md
    │   ├── checklist_de_modelo_para_dados_sensiveis.md
    │   ├── checklist_de_aprovacao_de_ferramenta_de_ia.md
    │   └── checklist_de_alerta_rai.md
    │
    ├── matrizes/
    │   ├── matriz_de_escolha_de_modelo_de_ia.md
    │   ├── matriz_de_custo_qualidade_velocidade.md
    │   ├── matriz_modelo_barato_vs_modelo_premium.md
    │   ├── matriz_de_risco_de_fornecedor.md
    │   ├── matriz_de_privacidade_e_retencao_de_dados.md
    │   ├── matriz_de_modelo_por_tipo_de_tarefa.md
    │   ├── matriz_testar_aprovar_monitorar_rejeitar.md
    │   ├── matriz_de_prioridade_rai.md
    │   ├── matriz_de_confiabilidade_da_fonte.md
    │   └── matriz_de_benchmarks_por_tipo_de_tarefa.md
    │
    ├── registros_e_evidencias/
    │   ├── registro_de_atualizacao_de_modelo.md
    │   ├── registro_de_alerta_critico_de_ia.md
    │   ├── registro_de_decisao_sobre_modelo.md
    │   ├── registro_de_avaliacao_de_fornecedor.md
    │   ├── registro_de_custo_por_modelo.md
    │   ├── registro_de_testes_realizados.md
    │   ├── registro_de_descontinuacao_de_modelo.md
    │   ├── registro_de_mudanca_de_comportamento_de_modelo.md
    │   ├── registro_de_documentacao_oficial.md
    │   ├── registro_de_varreduras_do_rai.md
    │   └── registro_de_recomendacao_para_frente_do_grupob.md
    │
    ├── lacunas_duvidas_validacoes/
    │   ├── lacunas_da_area.md
    │   ├── duvidas_para_pietro_carboni.md
    │   ├── duvidas_para_pierre_zanulli.md
    │   ├── duvidas_para_savio_codare.md
    │   ├── duvidas_para_pedro_gazan.md
    │   ├── duvidas_para_alice_montini.md
    │   ├── duvidas_para_yuri_sague.md
    │   ├── duvidas_para_kane_rodrigues.md
    │   └── validacoes_pendentes.md
    │
    └── documentos_derivados/
        ├── catalogo_oficial_de_fornecedores_de_ia.md
        ├── catalogo_oficial_de_modelos_de_ia.md
        ├── manual_do_rai.md
        ├── guia_de_escolha_de_modelos_de_ia.md
        ├── guia_de_custo_por_modelo.md
        ├── politica_de_uso_de_ia_externa.md
        ├── lista_de_modelos_recomendados_por_caso_de_uso.md
        ├── boletim_rai_modelo_padrao.md
        ├── relatorio_mensal_de_inteligencia_artificial.md
        ├── indice_de_risco_de_hype_em_ia.md
        └── mapa_global_de_fornecedores_de_ia.md
```

---

## 20. Ordem recomendada de criação dos documentos

### Primeiro

* `README.md`
* `escopo_da_area.md`
* `glossario_modelos_ia_rai.md`
* `mapa_empresa_familia_modelo_produto.md`
* `principios_da_area.md`
* `regras_centrais_de_modelos_e_fornecedores.md`
* `regra_de_fonte_oficial_primeiro.md`
* `manual_operacional_do_rai.md`
* `papel_do_klaus_wagen_no_rai.md`
* `padrao_de_status_da_informacao_no_rai.md`
* `checklist_de_avaliacao_de_novo_modelo_de_ia.md`
* `matriz_de_escolha_de_modelo_de_ia.md`

### Depois

* `cadastro_de_fornecedores_de_ia.md`
* `catalogo_de_familias_de_modelos.md`
* `catalogo_de_modelos_especificos.md`
* `ficha_padrao_de_modelo_de_ia.md`
* `fontes_monitoradas_pelo_rai.md`
* `niveis_de_alerta_do_rai.md`
* `protocolo_de_alerta_de_mudanca_critica_em_ia.md`
* `registro_de_atualizacao_de_modelo.md`
* `registro_de_documentacao_oficial.md`
* `matriz_de_confiabilidade_da_fonte.md`
* `checklist_de_retencao_e_treinamento_de_dados.md`

### Em seguida

* `politica_de_uso_de_ia_externa.md`
* `matriz_de_privacidade_e_retencao_de_dados.md`
* `matriz_modelo_barato_vs_modelo_premium.md`
* `protocolo_de_mudanca_de_comportamento_de_modelo.md`
* `checklist_de_regressao_de_comportamento_de_modelo.md`
* `registro_de_mudanca_de_comportamento_de_modelo.md`
* `boletim_de_atualizacoes_de_ia.md`
* `registro_de_varreduras_do_rai.md`

### Por último

* recomendações por frente;
* relatório mensal;
* mapa global de fornecedores;
* índice de risco de hype;
* painel de benchmarks;
* histórico de preços por fornecedor;
* relatórios executivos para Rodrigues/Kane.

---

## 21. Síntese final

Minha leitura final é que o bloco **Modelos de IA, RAI e Radar Tecnológico** já possui como base **a separação entre fornecedores, famílias de modelos, modelos específicos, custos, APIs, termos de uso, benchmarks, recomendações por tarefa, dependências e alertas do RAI**, mas precisa evoluir em **governança explícita do Klaus Wagen, Plantão RAI, documentação oficial como evidência, distinção entre dado real e mockado, mudança de comportamento de modelos, agentes pesquisadores do RAI e política de uso de IA externa**. A versão revisada da estrutura deve priorizar **manual do RAI, catálogo de fornecedores, catálogo de modelos, matriz de escolha de modelo, checklist de avaliação de novo modelo, padrão de status da informação, protocolo de alerta crítico e registros de atualização**, manter dependência com **Pietro Carboni, Pierre Zanulli, Sávio Codare, Pedro Gazan, Alice Montini, Yuri Sague e Kane/Rodrigues** e evitar **confusão entre modelo e agente, API avaliada e API implementada, recomendação técnica e padrão oficial, dado simulado e dado validado, radar tecnológico e operação técnica do SagB**.

Esta entrega será usada por Pietro Carboni para consolidar todos os blocos, cruzar dependências entre áreas e preparar a próxima versão da Central de Padrões do GrupoB / Loze no SagB.

---

# Tabelas obrigatórias consolidadas

## 7.1. Tabela de achados

| Item encontrado                          | Tipo                       | Onde apareceu                          | Entrou na estrutura? | Ação recomendada                                     | Prioridade |
| ---------------------------------------- | -------------------------- | -------------------------------------- | -------------------- | ---------------------------------------------------- | ---------- |
| Separação empresa → família → modelo     | 🔵 princípio / 🟠 padrão   | Missão 1 e discussões do painel Klaus  | Sim                  | Manter e reforçar com arquivo próprio                | V1         |
| Klaus Wagen como mentor de IA            | 📌 decisão / 🟠 padrão     | Conversa sobre prompt oficial do Klaus | Parcial              | Adicionar `papel_do_klaus_wagen_no_rai.md`           | V1         |
| Plantão RAI                              | 🟢 protocolo / 🚨 crítico  | Conversa sobre alertas ao Rodrigues    | Parcial              | Criar `plantao_rai.md` e protocolo de comunicação    | V1         |
| Dados mockados no HTML                   | ⚠️ risco / 🔴 regra        | Conversa sobre HTML do painel          | Não                  | Criar padrão de status da informação                 | V1         |
| System cards e model cards               | 🧾 registro/evidência      | Conversa sobre docs e desempenho       | Parcial              | Criar bloco de documentações oficiais                | V1         |
| Obrigação de publicar desempenho         | ❓ dúvida / ⚠️ risco        | Conversa sobre benchmarks e regulação  | Não                  | Registrar como informação dependente de fonte/região | V2         |
| Mudança de comportamento de modelo       | 🟢 protocolo / 🧾 registro | Documento anterior e chat              | Parcial              | Criar protocolo e registro específicos               | importante |
| Modelo descontinuado                     | 🟢 protocolo               | Documento anterior                     | Sim                  | Manter e reforçar dependência com Sávio/Pierre       | importante |
| Modelo barato vs premium                 | 📊 matriz                  | Conversas sobre custo e uso            | Não                  | Criar matriz própria                                 | V1         |
| Agentes pesquisadores do RAI             | 🟠 padrão / ⚠️ risco       | Conversa sobre Klaus coordenar agentes | Não                  | Criar critérios limitados e validar com Pierre       | importante |
| Retenção e uso de dados para treinamento | 🟣 política / ✅ checklist  | Documento e Missão 1                   | Sim                  | Reforçar com Pedro Gazan como validação obrigatória  | crítico    |
| Custos por tipo de modelo                | 📊 matriz / 🧾 registro    | Conversas sobre API e vídeo            | Sim                  | Manter e detalhar por unidade de cobrança            | V1         |
| Recomendações por frente                 | 💡 recomendação            | Missão 1                               | Sim                  | Ajustar `agentes_autonomos` para não invadir Pierre  | V1         |
| Fontes oficiais primeiro                 | 🔵 princípio / 🔴 regra    | Documento e chat                       | Sim                  | Criar regra própria                                  | V1         |
| Risco de hype                            | ⚠️ risco / 📊 matriz       | Discussões sobre IA e radar            | Parcial              | Criar índice/matriz de hype                          | V2         |

## 7.2. Tabela de lacunas

| Lacuna                                    | Impacto                                              | Quem valida           | Prioridade | Recomendação                                     |
| ----------------------------------------- | ---------------------------------------------------- | --------------------- | ---------- | ------------------------------------------------ |
| Falta bloco de documentações oficiais     | Decisões podem ficar sem evidência forte             | Pietro Carboni        | V1         | Criar `06_documentacoes_oficiais_e_fontes/`      |
| Falta padrão real/simulado/estimado       | Pode confundir painel e usuários                     | Pietro Carboni        | V1         | Criar `padrao_de_status_da_informacao_no_rai.md` |
| Falta política formal de IA externa       | Pode gerar risco com dados e fornecedores            | Pedro Gazan / Pietro  | crítico    | Criar política com validação de segurança        |
| Falta rotina técnica do RAI               | O radar pode não rodar de verdade                    | Sávio / Yuri          | V1         | Definir operação técnica e processo              |
| Falta definição de alertas para Rodrigues | Pode gerar ruído ou atraso                           | Kane/Rodrigues/Pietro | importante | Definir níveis do Plantão RAI                    |
| Falta teste interno padronizado           | Recomendações podem depender só de benchmark externo | Klaus/Pietro          | V2         | Criar conjunto de testes GrupoB                  |
| Falta lista de modelos já usados          | Dificulta governança real                            | Sávio/Klaus           | V1         | Levantar uso atual                               |
| Falta fronteira com agentes pesquisadores | Pode invadir Pierre                                  | Pierre                | importante | Criar dependência e limite claro                 |

## 7.3. Tabela de dependências

| Tema                      | Depende de qual área | Motivo                                          | Arquivo de dependência sugerido      |
| ------------------------- | -------------------- | ----------------------------------------------- | ------------------------------------ |
| Uso de modelo em agentes  | Pierre Zanulli       | Agentes, autonomia, memória e tool use são dele | `dependencias_com_pierre_zanulli.md` |
| Integração com API        | Sávio Codare         | Implementação técnica, SDK, deploy e módulos    | `dependencias_com_savio_codare.md`   |
| Retenção de dados         | Pedro Gazan          | Segurança, privacidade e dados sensíveis        | `dependencias_com_pedro_gazan.md`    |
| IA na interface           | Alice Montini        | UX/UI e experiência visual                      | `dependencias_com_alice_montini.md`  |
| Padrão oficial            | Pietro Carboni       | Canetada final e classificação normativa        | `dependencias_com_pietro_carboni.md` |
| Rotina operacional do RAI | Yuri Sague           | Processo sistêmico e operação recorrente        | `dependencias_com_yuri_sague.md`     |
| Custo e estratégia        | Kane/Rodrigues       | Decisão executiva e estratégica                 | `dependencias_com_kane_rodrigues.md` |

## 7.4. Tabela de documentos derivados

| Documento                                         | Tipo                    | Por que precisa existir                        | Prioridade | Responsável        |
| ------------------------------------------------- | ----------------------- | ---------------------------------------------- | ---------- | ------------------ |
| `manual_do_rai.md`                                | 🟠 padrão / ⚙️ processo | Explica como o radar funciona                  | V1         | Klaus              |
| `catalogo_oficial_de_fornecedores_de_ia.md`       | 🧾 registro             | Centraliza fornecedores                        | V1         | Klaus              |
| `catalogo_oficial_de_modelos_de_ia.md`            | 🧾 registro             | Centraliza modelos e status                    | V1         | Klaus              |
| `guia_de_escolha_de_modelos_de_ia.md`             | 🟠 padrão               | Ajuda times a escolher modelo certo            | V1         | Klaus/Pietro       |
| `politica_de_uso_de_ia_externa.md`                | 🟣 política             | Define limites de uso externo                  | crítico    | Klaus/Pedro/Pietro |
| `protocolo_de_alerta_de_mudanca_critica_em_ia.md` | 🟢 protocolo            | Responde a mudanças críticas                   | crítico    | Klaus/Pietro       |
| `padrao_de_status_da_informacao_no_rai.md`        | 🟠 padrão               | Diferencia real, simulado, estimado e validado | V1         | Klaus/Pietro       |
| `boletim_rai_modelo_padrao.md`                    | 🧾 registro             | Padroniza comunicação do radar                 | V2         | Klaus              |
| `relatorio_mensal_de_inteligencia_artificial.md`  | 🧾 registro             | Consolida inteligência executiva               | futuro     | Klaus              |
| `indice_de_risco_de_hype_em_ia.md`                | 📊 matriz               | Evita priorizar modismo sem maturidade         | futuro     | Klaus              |
