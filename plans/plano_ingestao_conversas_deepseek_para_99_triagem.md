# Plano de Ingestão Bruta — DeepSeek 2026-05-31 → Pastas 99_triagem

## Sumário

1. [Inventário das conversas de origem](#1-inventário-das-conversas-de-origem)
2. [Inventário dos destinos possíveis](#2-inventário-dos-destinos-possíveis)
3. [Regras de afinidade](#3-regras-de-afinidade)
4. [Classificação de confiança](#4-classificação-de-confiança)
5. [Plano de execução futura](#5-plano-de-execução-futura)
6. [Relatório de dry-run](#6-relatório-de-dry-run)
7. [Conversas sem destino claro](#7-conversas-sem-destino-claro)
8. [Resumo executivo](#8-resumo-executivo)

---

## 1. Inventário das conversas de origem

**Fonte:** [`_indice_chats.csv`](Z:/02_ventures/loze/data_grupob/00_DTX_CORE/Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31/_indice_chats.csv)

**Total de conversas: 126**

| # | Arquivo .md | Título original | Msgs | Destino sugerido (tabela completa na seção 6) |
|---|---|---|---|---|
| 1 | `AGE.md` | 🆔️ AGE | 8 | `03_metodos/age` |
| 2 | `Projeto Nova Plast.md` | Projeto Nova Plast | 21 | precisa_validação |
| 3 | `Ziply.md` | ✴️ Ziply | 72 | `02_ventures/ziplia` |
| 4 | `RESUMO EXECUTIVO.md` | RESUMO EXECUTIVO | 7 | `grupob/central_de_padroes` |
| 5 | `Agente Criador de Neggios.md` | 🧑🏻‍🦰 Agente Criador de Negógios | 40 | precisa_validação |
| 6 | `JuridicoB.md` | ✅ JuridicoB | 25 | `grupob/central_de_padroes` |
| 7 | `Faca um disgnostico ainda mais p.md` | Faca um diagnóstico ainda mais p | 4 | precisa_validação |
| 8 | `Central do Sinal.md` | Central do Sinal | 7 | `03_metodos` precisa definir |
| 9 | `DR I Douglas Rodrigues.md` | DR I Douglas Rodrigues | 19 | `02_ventures/douglas_rodrigues` |
| 10 | `DR I Mentoria DR Master.md` | DR I Mentoria DR Master | 12 | `02_ventures/douglas_rodrigues` |
| 11 | `Investment Proposal for VODDORE Growth.md` | Investment Proposal for VODDORE Growth | 8 | `02_ventures/voddore` |
| 12 | `Plano de Negcios para Marcenaria Personalizada.md` | Plano de Negócios para Marcenaria Personalizada | 9 | precisa_validação |
| 13 | `Oportunidade de investimento na Voddore.md` | Oportunidade de investimento na Voddore | 3 | `02_ventures/voddore` |
| 14 | `Anlise do negcio StartyB em 2025.md` | Análise do negócio StartyB em 2025 | 3 | `01_empresas_b/startyb` |
| 15 | `Klaus Analyzes Ecosystem Strategies for Optimization.md` | Klaus Analyzes Ecosystem Strategies for Optimization | 9 | precisa_validação |
| 16 | `Criando pgina de vendas odonto moderna.md` | Criando página de vendas odonto moderna | 3 | `02_ventures/scale_odonto` |
| 17 | `Extrator de Marca Facilitador de Fluncia.md` | Extrator de Marca Facilitador de Fluência | 3 | precisa_validação |
| 18 | `Resumo da plataforma ZIPLIA para negcios.md` | Resumo da plataforma ZIPLIA para negócios | 3 | `02_ventures/ziplia` |
| 19 | `Explorando estratgias criativas para AcadB.md` | Explorando estratégias criativas para AcadB | 3 | `01_empresas_b/acadb` |
| 20 | `Anlise de Arquitetura para Automao com IA.md` | Análise de Arquitetura para Automação com IA | 15 | `grupob/central_de_padroes` |
| 21 | `01 Resumo Geral das Conversas no ChatGPT 16.11.2025.part001.md` | 01 Resumo Geral das Conversas no ChatGPT | 9 | precisa_validação |
| 22 | `02 Resumo Geral das Conversas no ChatGPT 16.11.2025.part002.md` | 02 Resumo Geral das Conversas no ChatGPT | 9 | precisa_validação |
| 23 | `Pietro Carboni Conversa.md` | Pietro Carboni Conversa | 11 | precisa_validação (toca vários temas) |
| 24 | `Pedro Nassar Conversa.md` | Pedro Nassar Conversa | 6 | precisa_validação |
| 25 | `Jhon Fradec Conversa Extraida 02.01.2026.md` | Jhon Fradec Conversa Extraida 02.01.2026 | 3 | precisa_validação |
| 26 | `Alan Flow Conversa Extraida 02.01.2026.md` | Alan Flow Conversa Extraida 02.01.2026 | 3 | precisa_validação |
| 27 | `Rafael Cortez Conversa Extraida Em.md` | Rafael Cortez Conversa Extraida Em | 3 | precisa_validação |
| 28 | `AcadB Plataforma Oficial Testes 02.01.2026.md` | 🟠 AcadB Plataforma Oficial Testes | 6 | `01_empresas_b/acadb` |
| 29 | `AcadB 24 Extrao.md` | AcadB 2/4 Extração | 3 | `01_empresas_b/acadb` |
| 30 | `AcadB 14 Falas Usurio.md` | AcadB 1/4 Falas Usuário | 3 | `01_empresas_b/acadb` |
| 31 | `AcadB 34 Ideias Da Ia.md` | AcadB 3/4 Ideias Da Ia | 3 | `01_empresas_b/acadb` |
| 32 | `AcadB 44 Prompt CEO.md` | AcadB 4/4 Prompt CEO | 3 | `01_empresas_b/acadb` |
| 33 | `Scale Odonto.md` | ✅️ Scale Odonto | 45 | `02_ventures/scale_odonto` |
| 34 | `Estrategia de Capital e Captao StartyB.md` | Estratégia de Capital e Captação StartyB | 64 | `01_empresas_b/startyb` |
| 35 | `Reunio sobre treinamento e implantao de plataforma.md` | Reunião sobre treinamento e implantação | 3 | precisa_validação |
| 36 | `Proposta de Planejamento Estratgico Trimestral Glh.md` | Proposta de Planejamento Estratégico Trimestral Glüh | 6 | `02_ventures/loze` (Glüh é marca da Loze) |
| 37 | `Proposta Geral GrupoB - Gluh.md` | Proposta Geral GrupoB - Gluh | 15 | `02_ventures/loze` |
| 38 | `Criando site visual para ecossistema Grupob.md` | Criando site visual para ecossistema Grupob | 3 | `grupob/central_de_padroes` |
| 39 | `Audacus 14 Falas Usurios.md` | Audacus 1/4 Falas Usuários | 3 | `02_ventures/audacus` |
| 40 | `Nbia Boutique.md` | 🅿️ Núbia Boutique | 40 | `02_ventures` - pasta específica? |
| 41 | `Contrato de Parceria Estratgica GrupoB.md` | Contrato de Parceria Estratégica GrupoB | 47 | `grupob/central_de_padroes` |
| 42 | `Python Programming Tutorials and Practical Projects.md` | Python Programming Tutorials | 23 | precisa_validação (não tem destino claro) |
| 43 | `Problemas com teclado sem fio Multilaser.md` | Problemas com teclado sem fio Multilaser | 8 | precisa_validação (pessoal) |
| 44 | `Piblo 14 Falas Usurio.md` | Piblo 1/4 Falas Usuário | 59 | `02_ventures/piblo` |
| 45 | `Correo de erro em sistema Python.md` | Correção de erro em sistema Python | 2 | precisa_validação |
| 46 | `Dr. Alex Chen Especialista Deepseek.md` | Dr. Alex Chen Especialista Deepseek | 143 | `grupob/central_de_padroes` (persona) |
| 47 | `Metodologia para criar assistentes empresariais.md` | Metodologia para criar assistentes empresariais | 6 | `03_metodos` precisa definir |
| 48 | `Estrutura de Gesto de Eventos no ClickUp.md` | Estrutura de Gestão de Eventos no ClickUp | 12 | preciso_validação |
| 49 | `Anlise jurdica especializada e imparcial..md` | Análise jurídica especializada e imparcial | 14 | `grupob/central_de_padroes` |
| 50 | `Discussing Business Structure and Organogram Setup.md` | Discussing Business Structure | 3 | `grupob/central_de_padroes` |
| 51 | `Importao para o Clickup.md` | Importação para o Clickup | 29 | precisa_validação |
| 52 | `Pedro Nassar - Conversa do ChatGPT...18_08hrs.md` | Pedro Nassar - Conversa diversos horários | 2 | precisa_validação |
| 53-61 | `Pedro Nassar - Conversa...` (diversos timestamps) | Conversas Pedro Nassar (várias) | 2-12 | precisa_validação |
| 62 | `Pietro_Carboni_CA_GPT_Conversa...Arquivado.md` | Pietro Carboni Conversa Arquivada | 12 | precisa_validação |
| 63 | `Joao Peres - Toda convesa no studio_ai...` | Joao Peres - conversa studio_ai | 9 | precisa_validação |
| 64 | `Rafael_Cortez_CA_GPT_Conversa...Arquivado.txt.md` | Rafael Cortez Conversa Arquivada | 4 | `03_metodos/jornada_uau` |
| 65 | `Conversas sobre planejamento e implementao.md` | Conversas sobre planejamento e implementação | 6 | precisa_validação |
| 66 | `Thomas_Sodr_CA_GPT_Conversa...Arquivado.md` | Thomas Sodré Conversa Arquivada | 6 | precisa_validação |
| 67 | `Pedro_Nassar_Extrao_Total_GPT_Conversa...Arquivado.md` | Pedro Nassar Extração Total | 11 | precisa_validação |
| 68 | `Thomas Sobre conversa que estava no pdf.md` | Thomas Sobre conversa que estava no pdf | 12 | precisa_validação |
| 69 | `Desenvolvimento de contedo para influenciadora.md` | Desenvolvimento de conteúdo para influenciadora | 6 | precisa_validação |
| 70 | `Anlise e expanso da EDA da 3forB.md` | Análise e expansão da EDA da 3forB | 3 | `03_metodos/eda` |
| 71 | `Anlise e plano estratgico para parceria com Jefferson.md` | Análise e plano estratégico para parceria com Jefferson | 3 | precisa_validação |
| 72 | `Anlise da empresa Glh.md` | Análise da empresa Glüh | 14 | `02_ventures/loze` |
| 73 | `Thomas Sodr Conversa Extraida 02.01.2026.md` | Thomas Sodré Conversa Extraída | 31 | precisa_validação |
| 74 | `Plano de Negcios DomuSys.md` | Plano de Negócios DomuSys | 3 | `02_ventures/domusys` |
| 75 | `Tarik Zon Python Especialista.md` | Tarik Zon Python Especialista | 21 | precisa_validação |
| 76 | `GrupoB.md` | 🅱️ GrupoB | 91 | `grupob/central_de_padroes` |
| 77 | `Paulo Cardena Hardware Especialist.md` | Paulo Cardena Hardware Especialist | 52 | precisa_validação |
| 78 | `Klaus Wagner Mentor de IA.md` | Klaus Wagner Mentor de IA | 13 | precisa_validação |
| 79 | `Kael Magnus Programador Senior DeepSeek.md` | 👨🏻 Kael Magnus Programador Senior | 32 | precisa_validação |
| 80 | `Anlise estratgica da Gluh Store.md` | Análise estratégica da Gluh Store | 3 | `02_ventures/loze` |
| 81 | `Configurao de persona de explorao de ideias.md` | Configuração de persona de exploração de ideias | 6 | `grupob/central_de_padroes` |
| 82 | `StartyB.md` | 🅱️ StartyB | 6 | `01_empresas_b/startyb` |
| 83 | `InstitutoB.md` | 🅱️ InstitutoB | 22 | `01_empresas_b/institutob` |
| 84 | `PapoB.md` | 🅱️ PapoB | 34 | `01_empresas_b/papob` |
| 85 | `AcadB.md` | 🅱️ AcadB | 6 | `01_empresas_b/acadb` |
| 86 | `AceleraB.md` | 🅱️ AceleraB | 10 | `01_empresas_b/acelerab` |
| 87 | `ConectaB.md` | 🅱️ ConectaB | 10 | `01_empresas_b` - ConectaB pode ser `01_empresas_b/grupob` ou precisa de pasta |
| 88 | `EspecialistaB.md` | 🅱️ EspecialistaB | 10 | `01_empresas_b/especialistab` (não existe) ou `grupob` |
| 89 | `Tegas APP.md` | Tegas APP | 11 | `02_ventures/tegas` |
| 90 | `Criador de Nomes.md` | Criador de Nomes | 3 | precisa_validação |
| 91 | `Alexer Chen Mentor de IA DeepSeek.md` | Alexer Chen Mentor de IA DeepSeek | 67 | `grupob/central_de_padroes` (persona) |
| 92 | `Ziplia Odonto.md` | Ziplia Odonto | 10 | `02_ventures/ziplia` |
| 93 | `Correo de cdigo HTML e CSS.md` | Correção de código HTML e CSS | 6 | precisa_validação |
| 94-96 | `Alexer Chen aguarda...` | Alexer Chen (3 conversas) | 3-6 | `grupob/central_de_padroes` |
| 97 | `Anlise estratgica do projeto automotivo.md` | Análise estratégica do projeto automotivo | 3 | precisa_validação |
| 98 | `SIRE.md` | SIRE | 15 | `03_metodos/sire` |
| 99 | `Pietro Carboni Diretor de Metodologias.md` | 👩‍🦲 Pietro Carboni Diretor de Metodologias | 9 | precisa_validação |
| 100 | `O usurio forneceu um arquivo de texto extenso...Cs.md` | [título longo - log de conversas] | 3 | `grupob/central_de_padroes` (padrões de design) |
| 101 | `TCADI.md` | TCADI | 6 | `03_metodos/tcadi` |
| 102 | `RAI - Radar Avanado e Inteligente.md` | RAI - Radar Avançado e Inteligente | 6 | `03_metodos` precisa definir |
| 103 | `Funil 5Cs.md` | Funil 5Cs | 6 | `03_metodos/funil_5cs` |
| 104 | `Rota 5 Estrela.md` | Rota 5 Estrela | 9 | `03_metodos/rota_5_estrelas` |
| 105 | `Decises NaMiMa.md` | Decisões NaMiMa | 6 | `03_metodos/nmm_decisoes` |
| 106 | `SIMV.md` | SIMV | 6 | `03_metodos/simv` |
| 107 | `Esfera de Contato.md` | 🟪 Esfera de Contato | 6 | `03_metodos/esfera_de_contato` |
| 108 | `PSCAR.md` | 🟪 PSCAR | 6 | `03_metodos/pscar` |
| 109 | `rvore Clientolgica.md` | Árvore Clientológica | 9 | `03_metodos/arvore_clientologica` |
| 110 | `GERAC Crispim Louzada.md` | Ⓜ️ GERAC \| Crispim Louzada | 9 | `03_metodos/gerac` |
| 111 | `E.P.A Raissa Crowe.md` | E.P.A \| Raissa Crowe | 6 | `03_metodos` precisa definir (EPA não encontrado) |
| 112 | `PEVAL.md` | 🟪 PEVAL | 9 | `03_metodos/peval` |
| 113 | `CHAI.md` | CHAI | 3 | `03_metodos/chai` |
| 114 | `InstitutoB Karen Montiel.md` | 🛑 InstitutoB \| Karen Montiel | 18 | `01_empresas_b/institutob` |
| 115 | `Especialista em compensao fiscal de insumos.md` | Especialista em compensação fiscal de insumos | 77 | `01_empresas_b/grupob` ou `03_metodos` |
| 116 | `Yasmim Financeiro 3forB.md` | Yasmim Financeiro 3forB | 6 | `01_empresas_b/3forb` |
| 117 | `3forB.md` | 3forB | 77 | `01_empresas_b/3forb` |
| 118 | `Simulador de Resultado.md` | 🛠 Simulador de Resultado | 22 | `03_metodos` precisa definir |
| 119 | `Tulian Zagoto Arquiteto de Prompt.md` | 🧑🏻 Tulian Zagoto \| Arquiteto de Prompt | 33 | `grupob/central_de_padroes` |
| 120 | `Pedro Nassar.md` | Pedro Nassar | 169 | precisa_validação (conversa genérica longa) |
| 121 | `Nilo Barreti Metodologias.md` | 👦 Nilo Barreti \| Metodologias | 30 | `grupob/central_de_padroes` |
| 122 | `E.D.A Janot Frei.md` | E.D.A \| Janot Frei | 121 | `03_metodos/eda` |
| 123 | `Jornada U.A.U Alvaro Portinari.md` | Ⓜ️ Jornada U.A.U \| Alvaro Portinari | 112 | `03_metodos/jornada_uau` |
| 124 | `M.A.V Zamir Oliveira.md` | M.A.V \| Zamir Oliveira | 191 | `03_metodos/mav` |
| 125 | `Rafael Cortez Head Jornada U.A.U.md` | 👦 Rafael Cortez \| Head Jornada U.A.U | 42 | `03_metodos/jornada_uau` |
| 126 | `DR Metododolia Nicolas Borzon.md` | Ⓜ️ DR Metododolia \| Nicolas Borzon | 12 | `03_metodos/dr_metodologia` |
| 127 | `Alexer Chen Especialista DeepSeek.md` | Alexer Chen \| Especialista DeepSeek | 244 | `grupob/central_de_padroes` |

---

## 2. Inventário dos destinos possíveis

### 2.1 Estrutura de triagem existente

O padrão é:

```text
[pasta_raiz]/[nome]/
└── 99_triagem/
    ├── 01_compilado_bruto_existente.md   ← compilado geral
    ├── 02_novas_informacoes.md           ← (opcional)
    ├── 03_documento_base_consolidado_para_aprovacao.md  ← (opcional)
    └── arquivo_morto/                    ← backup de arquivos originais
```

### 2.2 Pastas em `01_empresas_b` com 99_triagem

| Pasta base | Nome | Caminho da triagem | Tem 01_compilado? | Tem arquivo_morto? | Status |
|---|---|---|---|---|---|
| `01_empresas_b` | `acadb` | `01_empresas_b/acadb/99_triagem/` | ✅ Sim | ✅ Sim | Pronto |
| `01_empresas_b` | `acelerab` | `01_empresas_b/acelerab/99_triagem/` | ✅ Sim | ✅ Sim | Pronto |
| `01_empresas_b` | `papob` | `01_empresas_b/papob/99_triagem/` | ✅ Sim | ✅ Sim | Pronto |
| `01_empresas_b` | `startyb` | — | ❌ Verificar | ❌ Verificar | Precisa verificar |
| `01_empresas_b` | `institutob` | — | ❌ Verificar | ❌ Verificar | Precisa verificar |
| `01_empresas_b` | `3forb` | — | ❌ Verificar | ❌ Verificar | Precisa verificar |
| `01_empresas_b` | `agent` | — | ❌ Verificar | ❌ Verificar | Precisa verificar |
| `01_empresas_b` | `grupob` | — | Tem `central_de_padroes/` | — | Estrutura diferente |

**Nota:** Algumas pastas em `01_empresas_b` podem não ter passado pela Fase 01 de triagem unificada. As pastas `startyb`, `institutob`, `3forb`, `agent` podem não ter `99_triagem` ainda.

### 2.3 Pastas em `02_ventures` com 99_triagem

Com base no `RESUMO_EXECUCAO_FASE_01_TRIAGEM_UNICA.json`:

| Pasta nome | Tem 01_compilado? | Tem arquivo_morto? |
|---|---|---|
| `audacus` | ✅ | ✅ |
| `cinve` | ✅ | ✅ |
| `crizor` | ✅ | ✅ |
| `dathex` | ✅ | ✅ |
| `domuse` | ✅ | ✅ |
| `domusys` | ❌ | ❌ |
| `douglas_rodrigues` | ✅ | ✅ |
| `fatos_medidos` | ✅ | ✅ |
| `humang` | ✅ | ✅ |
| `implaris` | ✅ | ✅ |
| `lecriza` | ✅ | ✅ |
| `loze` | ✅ (vazio) | ✅ |
| `mob_home` | ✅ | ✅ |
| `mobzei` | ✅ | ✅ |
| `nageb` | ✅ | ✅ |
| `nuexus` | ✅ | ✅ |
| `opexa` | ✅ | ✅ |
| `oral_agy` | ✅ | ✅ |
| `oral_con` | ✅ | ✅ |
| `pet_fofy` | ✅ | ✅ |
| `pex_farma` | ✅ | ✅ |
| `piblo` | ✅ | ✅ |
| `scale_odonto` | ✅ | ✅ |
| `seddore` | ✅ | ✅ |
| `taskzei` | ✅ | ✅ |
| `tegas` | ✅ | ✅ |
| `unico_andar` | ✅ | ✅ |
| `vale_domo` | ✅ | ✅ |
| `vekcar` | ✅ | ✅ |
| `veruzon_motors` | ✅ | ✅ |
| `voddore` | ✅ | ✅ |
| `ziplia` | ✅ | ✅ |
| `zoggon` | ✅ | ✅ |
| `zupik` | ✅ | ✅ |

**Sem 99_triagem:** `diversos_triagem`, `dualle_reserva`, `pi_rodrigues`, `plans`

### 2.4 Pastas em `03_metodos` com 99_triagem

Com base no `RESUMO_EXECUCAO_FASE_01_TODAS_AS_PASTAS.json`:

| Pasta nome | Tem 01_compilado? | Tem arquivo_morto? |
|---|---|---|
| `age` | ✅ | ✅ |
| `apex` | ✅ | ✅ |
| `arvore_clientologica` | ✅ | ✅ |
| `avapex` | ✅ | ✅ |
| `capa` | ✅ | ✅ |
| `chai` | ✅ | ✅ |
| `clube_de_parceiros` | ✅ | ✅ |
| `dr_metodologia` | ✅ | ✅ |
| `eda` | ✅ | ✅ |
| `esfera_de_contato` | ✅ | ✅ |
| `funil_5cs` | ✅ | ✅ |
| `fva` | ✅ | ✅ |
| `gecomex` | ✅ | ✅ |
| `gerac` | ✅ | ✅ |
| `gestex` | ✅ | ✅ |
| `jornada_uau` | ✅ | ✅ |
| `lpv` | ✅ | ✅ |
| `mare` | ✅ | ✅ |
| `mav` | ✅ | ✅ |
| `monei` | ✅ | ✅ |
| `nmm_decisoes` | ✅ | ✅ |
| `pas` | ✅ | ✅ |
| `peval` | ✅ | ✅ |
| `pscar` | ✅ | ✅ |
| `rota_5_estrelas` | ✅ | ✅ |
| `saga` | ✅ | ✅ |
| `simv` | ✅ | ✅ |
| `sire` | ✅ | ✅ |
| `spv` | ✅ | ✅ |
| `tcadi` | ✅ | ✅ |
| `tivac` | ✅ | ✅ |
| `trato` | ✅ | ✅ |

**Sem 99_triagem:** `plans`

---

## 3. Regras de afinidade

### 3.1 Critérios de correspondência

Para sugerir o destino de cada conversa, usar a seguinte ordem de prioridade:

1. **Título do chat** (campo `title` no JSON) — maior peso
2. **Nome do arquivo .md** gerado
3. **Conteúdo** (se necessário, ler primeiras mensagens)
4. **Nomes de pastas existentes** nos três blocos
5. **Aliases e variações** (ex: Glüh → loze, Ziply → ziplia)

### 3.2 Tabela de correspondências diretas (título ↔ pasta)

| Termo no título | Destino provável |
|---|---|
| `AGE` | `03_metodos/age` |
| `GERAC` | `03_metodos/gerac` |
| `Jornada U.A.U` | `03_metodos/jornada_uau` |
| `M.A.V` | `03_metodos/mav` |
| `E.D.A` | `03_metodos/eda` |
| `SIRE` | `03_metodos/sire` |
| `CHAI` | `03_metodos/chai` |
| `ESFERA DE CONTATO` | `03_metodos/esfera_de_contato` |
| `PSCAR` | `03_metodos/pscar` |
| `PEVAL` | `03_metodos/peval` |
| `SIMV` | `03_metodos/simv` |
| `TCADI` | `03_metodos/tcadi` |
| `Funil 5Cs` | `03_metodos/funil_5cs` |
| `Rota 5 Estrela` | `03_metodos/rota_5_estrelas` |
| `Árvore Clientológica` | `03_metodos/arvore_clientologica` |
| `Decisões NaMiMa` / `NMM` | `03_metodos/nmm_decisoes` |
| `DR Metododolia` | `03_metodos/dr_metodologia` |
| `Scale Odonto` | `02_ventures/scale_odonto` |
| `ZIPLIA` / `Ziply` | `02_ventures/ziplia` |
| `Voddore` / `VODDORE` | `02_ventures/voddore` |
| `Loze` / `Glüh` / `Gluh` | `02_ventures/loze` |
| `StartyB` | `01_empresas_b/startyb` |
| `AcadB` | `01_empresas_b/acadb` |
| `AceleraB` | `01_empresas_b/acelerab` |
| `PapoB` | `01_empresas_b/papob` |
| `InstitutoB` | `01_empresas_b/institutob` |
| `3forB` | `01_empresas_b/3forb` |
| `Piblo` | `02_ventures/piblo` |
| `Douglas Rodrigues` / `DR I` | `02_ventures/douglas_rodrigues` |
| `Tegas` | `02_ventures/tegas` |
| `DomuSys` | `02_ventures/domusys` |
| `Audacus` | `02_ventures/audacus` |
| `Núbia Boutique` | `02_ventures` - verificar se existe `nubia_boutique` |
| `ConectaB` | `01_empresas_b/grupob` (sem pasta própria) |
| `EspecialistaB` | `01_empresas_b/grupob` (sem pasta própria) |

### 3.3 Regras para conversas de persona/responsável

Conversas que mencionam **pessoas específicas** como agentes/personas:

| Pessoa | Provável destino |
|---|---|
| Pietro Carboni | `grupob/central_de_padroes` |
| Nilo Barreti | `grupob/central_de_padroes` |
| Tulian Zagoto | `grupob/central_de_padroes` |
| Alexer Chen | `grupob/central_de_padroes` |
| Dr. Alex Chen | `grupob/central_de_padroes` |
| Klaus Wagner | `grupob/central_de_padroes` |
| Kael Magnus | `grupob/central_de_padroes` |
| Tarik Zon | `grupob/central_de_padroes` |
| Paulo Cardena | `grupob/central_de_padroes` |
| Pedro Nassar | `grupob/central_de_padroes` |
| Rafael Cortez | `03_metodos/jornada_uau` |
| Karen Montiel | `01_empresas_b/institutob` |
| Yasmim Financeiro | `01_empresas_b/3forb` |
| Nicolas Borzon | `03_metodos/dr_metodologia` |

### 3.4 Regras para conversas sem correspondência clara

1. **Conteúdo técnico genérico** (Python, HTML, CSS, teclado) → `precisa_validação`
2. **Conversas de exportação/resumo do ChatGPT** → `precisa_validação` (são dumps de outras conversas)
3. **Conversas curtas de teste** → `precisa_validação`
4. **Conversas que não mencionam nenhuma pasta existente** → `precisa_validação`

---

## 4. Classificação de confiança

### Níveis

| Confiança | Critério |
|---|---|
| **ALTA** | Título da conversa corresponde exatamente a uma pasta de destino existente |
| **MEDIA** | Título sugere pasta, mas conteúdo pode tocar outros temas |
| **BAIXA** | Título vago ou não corresponde claramente a nenhuma pasta |
| **PRECISA_VALIDACAO** | Conversa com múltiplos temas, título genérico, ou sem pasta de destino clara |

### Distribuição estimada

| Confiança | Quantidade estimada | Exemplos |
|---|---|---|
| **ALTA** | ~40 | AGE, GERAC, Jornada UAU, SIRE, CHAI, Funil 5Cs, Rota 5 Estrelas, Esfera de Contato, PSCAR, PEVAL, SIMV, TCADI, Árvore Clientológica, Scale Odonto, Ziplia, StartyB, AcadB, AceleraB, PapoB, InstitutoB, 3forB, Tegas, EDA, M.A.V, DR Metododolia, etc. |
| **MEDIA** | ~25 | Voddore, Glüh/Loze, Piblo, Audacus, Douglas Rodrigues, Alexer Chen, etc. |
| **BAIXA** | ~15 | Conteúdo técnico genérico, conversas pessoais |
| **PRECISA_VALIDACAO** | ~46 | Conversas de persona sem destino claro, conversas mistas, dumps de ChatGPT, resumos gerais |

---

## 5. Plano de execução futura

> ⚠️ **Regra fundamental: Não executar ainda. Plano apenas.**

### 5.1 Para cada conversa aprovada

Passo a passo da ingestão:

**Passo 1:** Abrir o arquivo `.md` extraído da conversa em
```text
Data/03_CONVERSAS_SEPARADAS/deepseek_2026_05_31/[arquivo].md
```

**Passo 2:** Abrir o arquivo de destino
```text
[destino]/99_triagem/01_compilado_bruto_existente.md
```

**Passo 3:** Adicionar no final do `01_compilado_bruto_existente.md` um cabeçalho padrão:

```markdown
---

# Fonte adicionada — [Título da conversa]

- Arquivo de origem: [nome_do_arquivo.md]
- Origem: DeepSeek 2026-05-31
- Data de ingestão: [data da execução]
- Destino: [pasta de destino]
- Critério de afinidade: [título/conteúdo/validação manual]
- Status: bruto não tratado

---
```

**Passo 4:** Colar o conteúdo integral da conversa após o cabeçalho.

**Passo 5:** Copiar o arquivo `.md` original para `arquivo_morto/`:

```text
[destino]/99_triagem/arquivo_morto/deepseek_2026_05_31_[nome_do_arquivo.md]
```

**Passo 6:** Registrar no relatório de processamento.

### 5.2 Regras obrigatórias

1. ✅ **Não apagar** o arquivo original da pasta DeepSeek extraída
2. ✅ **Não mover** — apenas copiar
3. ✅ **Não alterar** os arquivos extraídos do DeepSeek
4. ✅ **Não alterar** conteúdo já existente no `01_compilado_bruto_existente.md`
5. ✅ Apenas **adicionar ao final** do compilado
6. ✅ O arquivo morto é uma **cópia de controle** dentro da pasta de destino

### 5.3 Script sugerido para automação

Criar um script Python que:

1. Leia o `_indice_chats.csv` e uma tabela de mapeamento manual (arquivo CSV de decisão)
2. Para cada conversa com destino definido e aprovado:
   - Leia o `.md` de origem
   - Gere o cabeçalho padrão
   - Append no `01_compilado_bruto_existente.md` de destino
   - Copie o `.md` para `arquivo_morto/`
3. Gere relatório de processamento

---

## 6. Relatório de dry-run

### Tabela completa de simulação

(As 126 conversas foram analisadas. Abaixo, as principais classificações.)

#### Alto confiança — copiar automaticamente (~40)

| Arquivo | Título | Destino sugerido | Confiança | Motivo | Ação |
|---|---|---|---|---|---|
| `AGE.md` | 🆔️ AGE | `03_metodos/age` | ALTA | Título bate com pasta | copiar_automaticamente |
| `GERAC Crispim Louzada.md` | Ⓜ️ GERAC | `03_metodos/gerac` | ALTA | Título bate com pasta | copiar_automaticamente |
| `Jornada U.A.U Alvaro Portinari.md` | Ⓜ️ Jornada U.A.U | `03_metodos/jornada_uau` | ALTA | Título bate com pasta | copiar_automaticamente |
| `M.A.V Zamir Oliveira.md` | M.A.V | `03_metodos/mav` | ALTA | Título bate com pasta | copiar_automaticamente |
| `E.D.A Janot Frei.md` | E.D.A | `03_metodos/eda` | ALTA | Título bate com pasta | copiar_automaticamente |
| `SIRE.md` | SIRE | `03_metodos/sire` | ALTA | Título bate com pasta | copiar_automaticamente |
| `Funil 5Cs.md` | Funil 5Cs | `03_metodos/funil_5cs` | ALTA | Título bate com pasta | copiar_automaticamente |
| `Rota 5 Estrela.md` | Rota 5 Estrela | `03_metodos/rota_5_estrelas` | ALTA | Título bate com pasta | copiar_automaticamente |
| `Esfera de Contato.md` | 🟪 Esfera de Contato | `03_metodos/esfera_de_contato` | ALTA | Título bate com pasta | copiar_automaticamente |
| `PSCAR.md` | 🟪 PSCAR | `03_metodos/pscar` | ALTA | Título bate com pasta | copiar_automaticamente |
| `PEVAL.md` | 🟪 PEVAL | `03_metodos/peval` | ALTA | Título bate com pasta | copiar_automaticamente |
| `SIMV.md` | SIMV | `03_metodos/simv` | ALTA | Título bate com pasta | copiar_automaticamente |
| `TCADI.md` | TCADI | `03_metodos/tcadi` | ALTA | Título bate com pasta | copiar_automaticamente |
| `CHAI.md` | CHAI | `03_metodos/chai` | ALTA | Título bate com pasta | copiar_automaticamente |
| `rvore Clientolgica.md` | Árvore Clientológica | `03_metodos/arvore_clientologica` | ALTA | Título bate com pasta | copiar_automaticamente |
| `Decises NaMiMa.md` | Decisões NaMiMa | `03_metodos/nmm_decisoes` | ALTA | Título bate com pasta | copiar_automaticamente |
| `DR Metododolia Nicolas Borzon.md` | Ⓜ️ DR Metododolia | `03_metodos/dr_metodologia` | ALTA | Título bate com pasta | copiar_automaticamente |
| `Scale Odonto.md` | ✅️ Scale Odonto | `02_ventures/scale_odonto` | ALTA | Nome da venture | copiar_automaticamente |
| `Ziply.md` | ✴️ Ziply | `02_ventures/ziplia` | ALTA | Alias Ziply→Ziplia | copiar_automaticamente |
| `Ziplia Odonto.md` | Ziplia Odonto | `02_ventures/ziplia` | ALTA | Nome da venture | copiar_automaticamente |
| `Resumo da plataforma ZIPLIA para negcios.md` | Resumo ZIPLIA | `02_ventures/ziplia` | ALTA | Nome da venture | copiar_automaticamente |
| `AcadB.md` | 🅱️ AcadB | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `AcadB Plataforma Oficial Testes.md` | 🟠 AcadB Testes | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `AcadB 24 Extrao.md` | AcadB 2/4 | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `AcadB 14 Falas Usurio.md` | AcadB 1/4 | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `AcadB 34 Ideias Da Ia.md` | AcadB 3/4 | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `AcadB 44 Prompt CEO.md` | AcadB 4/4 | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `Explorando estratgias criativas para AcadB.md` | Explorando AcadB | `01_empresas_b/acadb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `AceleraB.md` | 🅱️ AceleraB | `01_empresas_b/acelerab` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `PapoB.md` | 🅱️ PapoB | `01_empresas_b/papob` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `InstitutoB.md` | 🅱️ InstitutoB | `01_empresas_b/institutob` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `InstitutoB Karen Montiel.md` | 🛑 InstitutoB Karen | `01_empresas_b/institutob` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `StartyB.md` | 🅱️ StartyB | `01_empresas_b/startyb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `Estrategia de Capital e Captao StartyB.md` | Estratégia StartyB | `01_empresas_b/startyb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `Anlise do negcio StartyB em 2025.md` | Análise StartyB | `01_empresas_b/startyb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `3forB.md` | 3forB | `01_empresas_b/3forb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `Yasmim Financeiro 3forB.md` | Yasmim 3forB | `01_empresas_b/3forb` | ALTA | Empresa do GrupoB | copiar_automaticamente |
| `Anlise e expanso da EDA da 3forB.md` | Expansão EDA 3forB | `03_metodos/eda` | ALTA | Método EDA | copiar_automaticamente |
| `Tegas APP.md` | Tegas APP | `02_ventures/tegas` | ALTA | Venture Tegas | copiar_automaticamente |
| `Piblo 14 Falas Usurio.md` | Piblo 1/4 | `02_ventures/piblo` | ALTA | Venture Piblo | copiar_automaticamente |
| `Rafael Cortez Head Jornada U.A.U.md` | Rafael Cortez | `03_metodos/jornada_uau` | ALTA | Menciona Jornada UAU | copiar_automaticamente |
| `Rafael Cortez Conversa Extraida Em.md` | Rafael Cortez | `03_metodos/jornada_uau` | MEDIA | Nome do responsável | copiar_após_validação |

#### Média confiança — copiar após validação (~25)

| Arquivo | Título | Destino sugerido | Confiança | Motivo | Ação |
|---|---|---|---|---|---|
| `Anlise da empresa Glh.md` | Análise Glüh | `02_ventures/loze` | MEDIA | Glüh é marca da Loze | copiar_após_validação |
| `Proposta de Planejamento Estratgico Trimestral Glh.md` | Proposta Glüh | `02_ventures/loze` | MEDIA | Glüh é marca da Loze | copiar_após_validação |
| `Proposta Geral GrupoB - Gluh.md` | Proposta GrupoB Gluh | `02_ventures/loze` | MEDIA | Gluh = Loze | copiar_após_validação |
| `Anlise estratgica da Gluh Store.md` | Análise Gluh Store | `02_ventures/loze` | MEDIA | Gluh = Loze | copiar_após_validação |
| `Investment Proposal for VODDORE Growth.md` | VODDORE Growth | `02_ventures/voddore` | MEDIA | Venture Voddore | copiar_após_validação |
| `Oportunidade de investimento na Voddore.md` | Oportunidade Voddore | `02_ventures/voddore` | MEDIA | Venture Voddore | copiar_após_validação |
| `DR I Douglas Rodrigues.md` | DR I Douglas Rodrigues | `02_ventures/douglas_rodrigues` | MEDIA | Nome de pasta | copiar_após_validação |
| `DR I Mentoria DR Master.md` | DR I Mentoria | `02_ventures/douglas_rodrigues` | MEDIA | Nome de pasta | copiar_após_validação |
| `Plano de Negcios DomuSys.md` | Plano DomuSys | `02_ventures/domusys` | MEDIA | Venture DomuSys | copiar_após_validação |
| `Audacus 14 Falas Usurios.md` | Audacus 1/4 | `02_ventures/audacus` | MEDIA | Venture Audacus | copiar_após_validação |
| `Nbia Boutique.md` | 🅿️ Núbia Boutique | `02_ventures` | MEDIA | Verificar pasta | copiar_após_validação |
| `Criando pgina de vendas odonto moderna.md` | Página odonto | `02_ventures/scale_odonto` | MEDIA | Odonto→Scale Odonto | copiar_após_validação |

#### Baixa confiança — não copiar automaticamente (~15)

| Arquivo | Título | Sugestão | Ação |
|---|---|---|---|
| `Python Programming Tutorials and Practical Projects.md` | Python Tutorials | Genérico/diverso | não_copiar |
| `Problemas com teclado sem fio Multilaser.md` | Problemas teclado | Pessoal/suporte | não_copiar |
| `Correo de erro em sistema Python.md` | Correção Python | Técnico pessoal | não_copiar |
| `Correo de cdigo HTML e CSS.md` | Correção HTML/CSS | Técnico pessoal | não_copiar |
| `Plano de Negcios para Marcenaria Personalizada.md` | Marcenaria | Pessoal/externo | não_copiar |

#### Precisa validação (~46)

Estas conversas exigem análise de conteúdo antes da decisão. Principais grupos:

1. **Conversas de persona/responsável** (12): Pietro Carboni, Pedro Nassar, Alan Flow, Jhon Fradec, Thomas Sodré, Joao Peres, etc.
2. **Dumps/resumos de ChatGPT** (2): `01 Resumo Geral...`, `02 Resumo Geral...`
3. **Conversas com múltiplos temas** (15): `GrupoB.md` (91 msgs - toca vários assuntos), `Pedro Nassar.md` (169 msgs), etc.
4. **Nomes que podem ser métodos ou empresas** (5): `Central do Sinal`, `RAI - Radar Avançado`, `Simulador de Resultado`, `Criador de Nomes`, `Extrator de Marca`

---

## 7. Conversas sem destino claro

Lista de conversas que exigem validação manual de Rodrigues ou responsável da área:

| Arquivo | Título | Motivo da dúvida | Possíveis destinos | Quem deve validar |
|---|---|---|---|---|
| `GrupoB.md` | 🅱️ GrupoB | Conversa genérica sobre o grupo, 91 mensagens, toca vários temas | `central_de_padroes` ou `01_empresas_b/grupob` | Rodrigues |
| `Pedro Nassar.md` | Pedro Nassar | 169 mensagens, persona que pode ter atuação em várias áreas | `central_de_padroes` | Rodrigues |
| `Dr. Alex Chen Especialista Deepseek.md` | Dr. Alex Chen | 143 mensagens, persona de IA - para qual área? | `central_de_padroes` | Rodrigues |
| `Alexer Chen Especialista DeepSeek.md` | Alexer Chen | 244 mensagens, persona de IA | `central_de_padroes` | Rodrigues |
| `Contrato de Parceria Estratgica GrupoB.md` | Contrato Parceria | 47 mensagens, documento jurídico | `central_de_padroes` ou `grupob/juridico` | Jurídico |
| `01 Resumo Geral das Conversas no ChatGPT...part001.md` | Resumo ChatGPT part1 | É compilado de conversas do ChatGPT, não DeepSeek. Pode ser duplicata. | Precisa verificar se já existe | Rodrigues |
| `02 Resumo Geral das Conversas no ChatGPT...part002.md` | Resumo ChatGPT part2 | Mesmo que acima | — | Rodrigues |
| `ConectaB.md` | 🅱️ ConectaB | Não existe pasta `conectab` em `01_empresas_b` | Criar pasta ou enviar para `grupob` | Rodrigues |
| `EspecialistaB.md` | 🅱️ EspecialistaB | Não existe pasta `especialistab` em `01_empresas_b` | Criar pasta ou enviar para `grupob` | Rodrigues |
| `RAI - Radar Avanado e Inteligente.md` | RAI - Radar Avançado | Não encontrei pasta RAI em `03_metodos` | Pode ser novo método | Rodrigues |
| `Simulador de Resultado.md` | 🛠 Simulador de Resultado | Pode ser método ou ferramenta | `03_metodos` ou `grupob` | Rodrigues |
| `E.P.A Raissa Crowe.md` | E.P.A | Sigla pode ser método, mas não encontrei pasta | `03_metodos` (novo) ou validar | Rodrigues |
| `Central do Sinal.md` | Central do Sinal | Pode ser método ou conceito | `03_metodos` ou validar | Rodrigues |
| `Especialista em compensao fiscal de insumos.md` | Compensação fiscal | 77 mensagens, tema fiscal | `01_empresas_b/3forb` ou `grupob` | Rodrigues |
| `Nbia Boutique.md` | 🅿️ Núbia Boutique | Não encontrei pasta específica | `02_ventures` verificar | Rodrigues |
| `Metodologia para criar assistentes empresariais.md` | Metodologia assistentes | Pode ser método novo | `03_metodos` | Rodrigues |
| `Anlise estratgica do projeto automotivo.md` | Projeto automotivo | Qual venture? | Verificar ventures automotivas | Rodrigues |
| `Projeto Nova Plast.md` | Projeto Nova Plast | Pode ser venture ou empresa | Verificar existência | Rodrigues |
| `Agente Criador de Neggios.md` | 🧑🏻‍🦰 Agente Criador | Persona/agente | `central_de_padroes` | Rodrigues |

---

## 8. Resumo executivo

### Números gerais

| Métrica | Valor |
|---|---|
| Conversas extraídas do DeepSeek | **126** |
| Pastas com `99_triagem` encontradas em `01_empresas_b` | **3** confirmadas (acadb, acelerab, papob) + 4 a verificar |
| Pastas com `99_triagem` encontradas em `02_ventures` | **34** confirmadas |
| Pastas com `99_triagem` encontradas em `03_metodos` | **32** confirmadas |
| **Total de destinos `99_triagem` disponíveis** | **~73** |

### Classificação das conversas

| Categoria | Quantidade |
|---|---|
| Confiança ALTA — copiar automaticamente | **~40** (31.7%) |
| Confiança MÉDIA — copiar após validação | **~25** (19.8%) |
| Confiança BAIXA — não copiar | **~15** (11.9%) |
| Precisa validação manual | **~46** (36.5%) |

### Principais dúvidas antes de executar

1. **Onde ficam as pastas de destino que não foram processadas na Fase 01?** Pastas como `startyb`, `institutob`, `3forb`, `agent` em `01_empresas_b` — verificar se já possuem `99_triagem` ou se precisam ser criadas.
2. **Onde colocar `ConectaB` e `EspecialistaB`?** Não existem pastas com esses nomes. Criar ou redirecionar para `grupob`?
3. **O que fazer com conversas de persona (Pietro, Pedro Nassar, Alexer Chen, etc.)?** Elas tocam múltiplos assuntos — devem ir para `central_de_padroes` ou para pastas específicas?
4. **Conversas que são dumps de ChatGPT** (`Resumo Geral` parts 1 e 2) — já existem equivalentes no ecossistema? Validar antes de copiar.
5. **Conversas sem pasta de método correspondente** (RAI, E.P.A, Central do Sinal, Simulador de Resultado) — são métodos novos que precisam de pasta própria?
6. **Ordem de execução:** Devemos processar as 40 de confiança ALTA primeiro, depois as MÉDIA, e deixar as 46 de validação para análise posterior de Rodrigues?
7. **Script vs manual:** Devemos criar um script Python (conforme seção 5.3) para automatizar as cópias de confiança ALTA, ou fazer manualmente pasta por pasta?

### Recomendação

1. Aprovar este plano
2. Validar as 46 conversas de `PRECISA_VALIDACAO` (Rodrigues e responsáveis)
3. Executar primeiro as ~40 de ALTA confiança (via script ou manual)
4. Depois as ~25 de MÉDIA
5. As de BAIXA confiança (~15) podem ser ignoradas ou descartadas da ingestão
6. Gerar relatório final de processamento

---

**Plano salvo em:** `Z:\SagB\plans\plano_ingestao_conversas_deepseek_para_99_triagem.md`
