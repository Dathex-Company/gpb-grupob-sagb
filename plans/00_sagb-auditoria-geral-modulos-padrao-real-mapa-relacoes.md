Segue a tarefa pronta em bloco único, seguindo o padrão copiável e o protocolo de auditoria que definimos.  

````text
TAREFA:
SagB | Auditoria Geral de Módulos | MEGA-ETAPA 01 | Inventário Mestre, Padrão Modular Real e Mapa de Relações

Cássio, tudo bem?

Vamos iniciar uma auditoria geral, brutal e estruturante de todos os módulos do SagB.

Esta tarefa é de auditoria, diagnóstico, inventário, extração de padrão real, leitura de governança e análise de relacionamento entre módulos.

Não é uma tarefa de implementação.

Trabalhe exclusivamente no caminho oficial dos módulos:

[COLAR AQUI O CAMINHO OFICIAL DA PASTA DE MÓDULOS]

Exemplo provável:
Z:\00_sagb\src\modules

Se houver necessidade de consultar arquivos complementares fora da pasta de módulos, como moduleRegistry, tipos centrais, App.tsx, rotas globais, Supabase, docs ou package.json, você pode consultar, mas registre todos os caminhos adicionais analisados.

IMPORTANTE:
Esta auditoria deve seguir os documentos base do projeto:

1. DOC-BASE | Padrões Operacionais Para Tarefas, Agentes e Implementações
2. PROTOCOLO | Auditoria de Sistemas, Módulos e Projetos
3. MATRIZ | Comandos Permitidos, Restritos e Bloqueados
4. DOC-BASE | Regra de Tarefas em Bloco Único Copiável
5. Alice UI Standard v1.0, quando houver análise visual/UI

Regras centrais:

1. Auditoria não implementa.
2. Não alterar código.
3. Não criar arquivos funcionais.
4. Não criar migration.
5. Não criar tabela.
6. Não criar bucket.
7. Não alterar RLS.
8. Não alterar policy.
9. Não fazer commit.
10. Não fazer push.
11. Não fazer deploy.
12. Não mover arquivos.
13. Não apagar arquivos.
14. Não refatorar.
15. Não rodar `npm run dev` como padrão.
16. Antes de rodar comandos, verificar o `package.json`.
17. Executar apenas comandos compatíveis com auditoria.
18. Registrar comandos executados, não executados, inexistentes e comandos que exigiriam autorização.
19. Nunca expor conteúdo de .env, tokens, API keys, secrets, credenciais ou chaves privadas.
20. Separar fato verificado, inferência técnica, recomendação e pendente de validação.
21. Toda afirmação relevante deve ter evidência mínima: caminho, arquivo, comando, resultado ou observação técnica.

Objetivo principal:

Criar um documento mestre que sirva como base oficial para entender todos os módulos atuais do SagB, o padrão modular real que já existe, a maturidade de cada módulo, as lacunas, os riscos, as duplicidades, as relações entre módulos e as recomendações para a Central de Padrões.

Esse documento será usado como base para:

- Central de Padrões;
- Pietro;
- Biblioteca de Módulos Base;
- padronização de novos módulos;
- refatorações futuras;
- auditorias futuras;
- decisões de arquitetura;
- definição de templates oficiais;
- definição de checklists oficiais;
- entendimento geral do ecossistema SagB.

Nome sugerido do relatório final:

sagb-auditoria-geral-modulos-padrao-real-mapa-relacoes.md

Local sugerido para salvar:

[COLAR AQUI O LOCAL ONDE DEVE SER SALVO O RELATÓRIO]

Se nenhum local for informado, sugerir um local adequado dentro da documentação do SagB, mas não criar fora do padrão sem registrar.

------------------------------------------------------------
1. CONTEXTO DA AUDITORIA
------------------------------------------------------------

O SagB possui vários módulos em `src/modules`.

Até agora, muitos módulos foram criados, ajustados, amadurecidos e documentados em momentos diferentes.

A partir de agora, precisamos entender o estado real do conjunto inteiro.

Não queremos auditar apenas um módulo isolado.

Queremos entender:

- todos os módulos existentes;
- como cada módulo está estruturado;
- quais arquivos cada módulo possui;
- quais padrões aparecem com frequência;
- quais padrões estão ausentes;
- como está a governança interna dos módulos;
- como está a documentação;
- como está a relação entre módulos;
- quais módulos deveriam conversar;
- quais módulos já conversam;
- quais módulos estão duplicando responsabilidades;
- quais módulos são base reutilizável;
- quais módulos são produto;
- quais módulos são operacionais;
- quais módulos são governança;
- quais módulos estão maduros;
- quais módulos estão frágeis;
- qual padrão modular real o SagB já está formando.

A finalidade é extrair do código e dos documentos o padrão real do SagB, não apenas imaginar um padrão ideal.

------------------------------------------------------------
2. ESCOPO DA AUDITORIA
------------------------------------------------------------

Auditar todos os módulos encontrados no caminho informado.

Não deixar nenhum módulo de fora.

Para cada módulo, analisar:

1. nome do módulo;
2. caminho;
3. existência de index.ts;
4. existência de manifest.ts;
5. existência de routes.tsx;
6. existência de module-doc.ts;
7. existência de README.md;
8. existência de DECISIONS.md;
9. existência de CHANGELOG.md;
10. existência de PLANNED.md;
11. existência de docs/;
12. existência de agent/;
13. existência de session_log.md;
14. existência de pages/;
15. existência de components/;
16. existência de hooks/;
17. existência de services/;
18. existência de store/;
19. existência de types/;
20. existência de constants/;
21. existência de utils/helpers;
22. existência de layout próprio;
23. existência de sidebar própria;
24. existência de dashboard;
25. existência de integração Supabase;
26. existência de dados mockados;
27. existência de fallback local;
28. existência de integração com outros módulos;
29. existência de documentação de governança;
30. existência de decisões registradas;
31. existência de próximos passos;
32. existência de padrão visual;
33. maturidade geral;
34. riscos;
35. lacunas;
36. duplicidades;
37. recomendações.

------------------------------------------------------------
3. FASE 1 — LEITURA DO AMBIENTE E CAMINHOS
------------------------------------------------------------

Antes de analisar módulo por módulo:

1. confirmar o caminho principal analisado;
2. listar todos os diretórios encontrados dentro da pasta de módulos;
3. identificar quais diretórios são módulos reais;
4. identificar diretórios auxiliares, se houver;
5. identificar módulos com nomenclatura fora do padrão;
6. identificar módulos vazios ou quase vazios;
7. identificar módulos com estrutura canônica;
8. identificar módulos com estrutura parcial;
9. identificar módulos antigos/legados;
10. identificar módulos que parecem duplicados;
11. registrar total de módulos encontrados.

Também consultar, se necessário:

- moduleRegistry;
- App.tsx;
- rotas globais;
- configuração de sidebar;
- package.json;
- Supabase/migrations, apenas para mapear;
- services globais;
- tipos globais;
- docs gerais do projeto.

Registrar todos os caminhos adicionais consultados.

------------------------------------------------------------
4. FASE 2 — INVENTÁRIO MESTRE DOS MÓDULOS
------------------------------------------------------------

Criar uma tabela geral com todos os módulos.

Colunas mínimas:

- número;
- nome do módulo;
- caminho;
- rota principal;
- aparece no registry?;
- possui manifest?;
- possui routes?;
- possui páginas?;
- possui componentes?;
- possui services?;
- possui hooks?;
- possui types?;
- possui store?;
- possui docs?;
- possui agent?;
- possui README?;
- possui DECISIONS?;
- possui CHANGELOG?;
- possui PLANNED?;
- possui dashboard?;
- possui sidebar própria?;
- usa Supabase?;
- usa dados mockados?;
- possui fallback?;
- status de maturidade;
- classificação;
- risco principal;
- observação.

Classificações possíveis:

- módulo de produto;
- módulo base reutilizável;
- módulo operacional;
- módulo de governança;
- módulo técnico;
- módulo de suporte;
- módulo experimental;
- módulo legado;
- módulo incompleto;
- módulo duplicado;
- módulo órfão;
- módulo a investigar.

Status de maturidade:

- vazio;
- inicial;
- parcial;
- funcional;
- avançado;
- maduro;
- legado;
- crítico;
- desconhecido.

------------------------------------------------------------
5. FASE 3 — AUDITORIA INDIVIDUAL DE CADA MÓDULO
------------------------------------------------------------

Para cada módulo, criar uma seção própria no relatório.

Modelo obrigatório por módulo:

## [Nome do módulo]

### 1. Identificação
- caminho:
- rota:
- título no manifest:
- owner/responsável, se existir:
- categoria inferida:

### 2. Estrutura encontrada
- index.ts:
- manifest.ts:
- routes.tsx:
- module-doc.ts:
- pages/:
- components/:
- hooks/:
- services/:
- store/:
- types/:
- constants/:
- layout/:
- docs/:
- agent/:

### 3. Documentação e governança
- README:
- DECISIONS:
- CHANGELOG:
- PLANNED:
- docs internos:
- agent/session_log:
- decisões registradas:
- próximos passos registrados:
- lacunas documentais:

### 4. Interface e UX
- possui dashboard?;
- possui sidebar própria?;
- usa layout próprio?;
- usa sidebar global?;
- usa Alice UI ou padrão semelhante?;
- tem dark mode?;
- tem estados vazios?;
- tem loading?;
- tem error state?;
- riscos visuais:

### 5. Dados e integrações
- usa Supabase?;
- quais services usam dados?;
- existem mocks?;
- existe fallback?;
- usa localStorage?;
- usa API externa?;
- usa função serverless?;
- usa arquivos/documentos?;
- tabelas inferidas ou referenciadas:

### 6. Relação com outros módulos
- módulos que ele consome:
- módulos que deveriam consumi-lo:
- módulos relacionados:
- dependências aparentes:
- duplicidades aparentes:
- oportunidades de integração:

### 7. Classificação arquitetural
Classificar como:
- produto;
- base reutilizável;
- operacional;
- governança;
- suporte;
- experimental;
- legado;
- indefinido.

### 8. Maturidade
Classificar:
- vazio;
- inicial;
- parcial;
- funcional;
- avançado;
- maduro;
- crítico.

### 9. Achados
Separar em:
- fato verificado;
- inferência técnica;
- recomendação;
- pendente de validação.

### 10. Riscos
Classificar riscos:
- baixo;
- médio;
- alto;
- crítico.

### 11. Recomendação para o módulo
Dizer:
- manter como está;
- documentar melhor;
- refatorar futuramente;
- consolidar com outro;
- transformar em módulo base;
- transformar em submódulo;
- arquivar;
- revisar com urgência;
- investigar mais.

------------------------------------------------------------
6. FASE 4 — EXTRAÇÃO DO PADRÃO MODULAR REAL DO SAGB
------------------------------------------------------------

Depois de auditar todos os módulos, identificar qual padrão real já está aparecendo no SagB.

Não trabalhar só com o padrão ideal.

Extrair o padrão real a partir dos arquivos encontrados.

Responder:

1. Quais arquivos aparecem na maioria dos módulos?
2. Quais pastas aparecem na maioria dos módulos?
3. Quais documentos aparecem com mais frequência?
4. Qual estrutura parece ser a mais comum?
5. Quais módulos seguem melhor o padrão?
6. Quais módulos fogem mais do padrão?
7. Quais padrões parecem oficiais, mesmo que ainda não estejam formalizados?
8. Quais padrões deveriam ser oficializados na Central de Padrões?
9. Quais padrões deveriam virar checklist?
10. Quais padrões deveriam virar template?
11. Quais padrões deveriam virar validação obrigatória?
12. Quais padrões deveriam ser abandonados?
13. Quais padrões estão inconsistentes?
14. Quais nomes de pastas variam indevidamente?
15. Quais arquivos aparecem com nomes diferentes para a mesma função?
16. Quais módulos têm governança mais forte?
17. Quais módulos têm documentação mais forte?
18. Quais módulos têm arquitetura mais clara?
19. Quais módulos podem servir de referência?
20. Qual seria o padrão modular recomendado para novos módulos?

Gerar uma seção chamada:

## Padrão Modular Real Encontrado

E outra seção chamada:

## Padrão Modular Recomendado Para Oficialização

------------------------------------------------------------
7. FASE 5 — ANÁLISE DE GOVERNANÇA DOS MÓDULOS
------------------------------------------------------------

Analisar a governança interna de cada módulo.

Verificar presença e qualidade de:

- README.md;
- DECISIONS.md;
- CHANGELOG.md;
- PLANNED.md;
- docs/;
- agent/;
- session_log.md;
- module-doc.ts;
- comentários de decisão;
- histórico;
- próximos passos;
- padrões registrados;
- relação com Central de Padrões.

Criar uma matriz:

Módulo | README | DECISIONS | CHANGELOG | PLANNED | docs | agent | session_log | nível de governança | observação

Níveis de governança:

- inexistente;
- fraca;
- básica;
- boa;
- forte;
- referência.

Responder:

1. Quais módulos têm governança forte?
2. Quais módulos não têm governança?
3. Quais módulos deveriam receber documentação urgente?
4. Quais documentos deveriam ser obrigatórios em todos os módulos?
5. Qual padrão de governança deve ser oficializado?
6. Qual módulo pode servir de modelo?
7. O que a Central de Padrões deve absorver dessa análise?

------------------------------------------------------------
8. FASE 6 — ANÁLISE DE DOCUMENTAÇÃO E DOCS
------------------------------------------------------------

Auditar tudo que estiver em docs/ dentro de cada módulo.

Para cada módulo com docs/:

1. listar arquivos encontrados;
2. resumir função de cada arquivo;
3. classificar:
   - relatório;
   - plano;
   - auditoria;
   - especificação;
   - padrão;
   - guia;
   - histórico;
   - prompt;
   - referência;
   - rascunho;
   - legado;
4. identificar documentos que deveriam ir para a Central de Padrões;
5. identificar documentos que deveriam virar padrão oficial;
6. identificar documentos que deveriam virar checklist;
7. identificar documentos que deveriam virar template;
8. identificar documentos duplicados;
9. identificar documentos desatualizados;
10. identificar lacunas.

Criar uma seção:

## Documentos Internos Encontrados nos Módulos

E uma matriz:

Módulo | Arquivo | Tipo | Status inferido | Deve ir para Central de Padrões? | Observação

------------------------------------------------------------
9. FASE 7 — ANÁLISE DE ARQUIVOS MODULARES PADRÃO
------------------------------------------------------------

Analisar a presença e qualidade dos arquivos padrão de módulo.

Arquivos esperados:

- index.ts;
- manifest.ts;
- routes.tsx;
- module-doc.ts;
- README.md;
- DECISIONS.md;
- CHANGELOG.md;
- PLANNED.md.

Para cada arquivo, responder:

1. quantos módulos têm esse arquivo?
2. quantos não têm?
3. quais têm versão forte?
4. quais têm versão fraca?
5. quais usam nomes diferentes?
6. quais deveriam ser obrigatórios?
7. quais deveriam ser opcionais?
8. quais devem virar template?
9. qual conteúdo mínimo deve existir em cada um?

Criar seção:

## Arquivos Padrão de Módulo

Com checklist recomendado para novos módulos.

------------------------------------------------------------
10. FASE 8 — ANÁLISE DE RELAÇÃO ENTRE MÓDULOS
------------------------------------------------------------

Esta é uma das partes mais importantes.

Analisar como os módulos se conversam e como poderiam se conversar.

Identificar:

1. dependências reais;
2. dependências inferidas;
3. módulos que deveriam consumir outros;
4. módulos que deveriam ser base reutilizável;
5. módulos que deveriam ser plugáveis;
6. módulos que deveriam ser submódulos;
7. módulos que deveriam ser fundidos;
8. módulos que deveriam ser separados;
9. módulos que estão duplicando função;
10. módulos que estão isolados sem necessidade;
11. módulos que deveriam enviar eventos para outro módulo;
12. módulos que deveriam aparecer na Central de Monitoramento;
13. módulos que deveriam seguir padrões da Central de Padrões;
14. módulos que deveriam consumir Biblioteca de Módulos Base;
15. módulos que deveriam conversar com TaskZei;
16. módulos que deveriam conversar com Agenda Inteligente;
17. módulos que deveriam conversar com Central de Padrões;
18. módulos que deveriam conversar com API SagB;
19. módulos que deveriam conversar com agentes;
20. módulos que deveriam conversar com Supabase compartilhado.

Criar:

## Mapa de Relações Entre Módulos

Formato sugerido:

Módulo origem | Módulo destino | Relação atual | Relação recomendada | Tipo de relação | Prioridade | Observação

Tipos de relação:

- consome;
- fornece;
- depende de;
- deveria depender de;
- duplica;
- substitui;
- complementa;
- governa;
- monitora;
- registra;
- notifica;
- audita;
- integra;
- herda padrão;
- compartilha dados;
- usa service;
- usa componente;
- usa tipo;
- gera evento;
- recebe evento.

Também criar uma visão em árvore ou grafo textual:

```text
Central de Padrões
├── governa padrões de todos os módulos
├── recebe documentos e decisões
└── fornece checklists

Central de Monitoramento
├── recebe eventos de módulos críticos
├── exibe alertas
└── aciona TaskZei

TaskZei
├── recebe tarefas geradas por módulos
├── registra execução
└── conversa com Agenda Inteligente
````

Adaptar aos módulos reais encontrados.

---

11. FASE 9 — IDENTIFICAÇÃO DE MÓDULOS BASE REUTILIZÁVEIS

---

Identificar quais módulos atuais poderiam ser ou virar módulos base reutilizáveis.

Classificar:

* já é módulo base;
* pode virar módulo base;
* deve continuar como módulo de produto;
* deve virar submódulo;
* deve virar preset;
* deve virar service compartilhado;
* deve ser mantido isolado;
* deve ser repensado.

Considerar possíveis módulos base:

* auth_core;
* users_core;
* permissions_core;
* settings_core;
* cadastros_core;
* forms_fields_core;
* catalogo_core;
* documents_core;
* files_storage_core;
* calendar_core;
* tasks_workflow_core;
* notifications_core;
* messages_core;
* financeiro_core;
* reports_core;
* dashboard_core;
* audit_logs_core;
* integrations_core;
* ai_core;
* backup_security_core.

Comparar com os módulos reais encontrados.

Criar seção:

## Potenciais Módulos Base Reutilizáveis

Com matriz:

Módulo atual | Poderia virar core? | Tipo recomendado | Dependências | Risco | Recomendação

---

12. FASE 10 — ANÁLISE DE PADRÃO VISUAL E UI

---

Auditar visualmente/estruturalmente a UI dos módulos, sem alterar nada.

Verificar:

* usa Alice UI?;
* usa Rubik?;
* usa tokens?;
* usa layout próprio?;
* usa sidebar própria?;
* usa sidebar global?;
* possui dashboard?;
* possui tabela/lista compacta?;
* possui cards?;
* possui empty state?;
* possui loading?;
* possui error state?;
* possui dark mode?;
* possui responsividade?;
* possui padrão visual consistente?;
* possui estilos locais soltos?;
* possui duplicidade de componentes visuais?;
* parece parte do mesmo ecossistema?

Criar seção:

## Diagnóstico Visual dos Módulos

Classificar módulos em:

* visual forte;
* visual aceitável;
* visual parcial;
* visual fraco;
* visual inexistente;
* não avaliado.

Indicar quais módulos devem ser referência visual.

---

13. FASE 11 — ANÁLISE DE SUPABASE E DADOS POR MÓDULO

---

Sem criar ou alterar nada.

Mapear:

* quais módulos usam Supabase;
* quais services acessam Supabase;
* quais tabelas são referenciadas;
* quais migrations parecem relacionadas;
* quais módulos usam mock;
* quais usam fallback;
* quais não têm dados reais;
* quais deveriam ter dados estruturados;
* quais podem compartilhar tabelas;
* quais parecem duplicar tabelas;
* quais precisam de revisão de RLS/policy futura.

Criar seção:

## Mapa de Dados e Supabase Por Módulo

Matriz:

Módulo | Usa Supabase? | Services | Tabelas inferidas | Mock/Fallback | Risco | Recomendação

Não expor credenciais.

Não alterar Supabase.

---

14. FASE 12 — ANÁLISE DE ROTAS E REGISTRY

---

Verificar:

* todos os módulos estão registrados no moduleRegistry?;
* todos possuem manifest?;
* todos possuem routes?;
* rotas estão consistentes?;
* existe rota quebrada?;
* existe módulo sem rota?;
* existe rota sem módulo?;
* existe módulo duplicado no registry?;
* nomes exibidos estão consistentes?;
* existem módulos ocultos?;
* existe regra de sidebar própria?;
* quais módulos usam full screen?;
* quais ficam dentro do shell global?;
* quais deveriam mudar futuramente?

Criar seção:

## Rotas, Registry e Exposição dos Módulos

---

15. FASE 13 — RISCOS GERAIS DO ECOSSISTEMA MODULAR

---

Identificar riscos globais.

Exemplos:

* módulos duplicando função;
* módulos sem documentação;
* módulos sem owner;
* módulos sem rota clara;
* módulos sem padrão visual;
* módulos com dados mockados permanentes;
* módulos sem integração;
* módulos que deveriam conversar e não conversam;
* módulos com responsabilidade ampla demais;
* módulos que deveriam ser divididos;
* módulos que deveriam ser fundidos;
* ausência de módulo base reutilizável;
* ausência de checklist para novo módulo;
* ausência de governança documental;
* ausência de padrão de relação entre módulos;
* ausência de eventos/logs entre módulos.

Classificar cada risco:

* baixo;
* médio;
* alto;
* crítico.

Para cada risco:

* fato/evidência;
* impacto;
* recomendação;
* prioridade.

---

16. FASE 14 — RECOMENDAÇÕES PARA A CENTRAL DE PADRÕES

---

Criar uma seção específica para o Pietro e para a Central de Padrões.

Responder:

1. Quais padrões reais encontrados devem ser oficializados?
2. Quais documentos devem ir para a Central de Padrões?
3. Quais checklists devem ser criados?
4. Quais templates devem ser criados?
5. Qual deve ser o template oficial de módulo?
6. Quais arquivos devem ser obrigatórios em todo módulo?
7. Quais arquivos devem ser opcionais?
8. Qual padrão de governança modular deve ser aprovado?
9. Qual padrão visual deve ser exigido?
10. Qual padrão de documentação deve ser exigido?
11. Qual padrão de relação entre módulos deve ser criado?
12. Qual padrão de classificação modular deve ser usado?
13. Como a Central de Padrões deve usar este relatório?
14. Como o Pietro deve consultar este relatório?
15. Como novos módulos devem nascer depois desta auditoria?

Criar seção:

## Recomendações Para a Central de Padrões

---

17. FASE 15 — PROPOSTA DE TEMPLATE OFICIAL DE MÓDULO

---

Com base no padrão real encontrado, sugerir um template oficial para novos módulos.

Não criar arquivos.
Apenas propor.

Modelo sugerido:

src/modules/[nome_modulo]/
index.ts
manifest.ts
routes.tsx
module-doc.ts
README.md
DECISIONS.md
CHANGELOG.md
PLANNED.md
pages/
components/
hooks/
services/
store/
types/
constants/
layout/
docs/
agent/

Mas ajustar conforme o que for encontrado.

Para cada item, dizer:

* obrigatório;
* recomendado;
* opcional;
* depende do tipo de módulo.

Criar seção:

## Template Oficial Recomendado Para Novos Módulos

---

18. FASE 16 — PROPOSTA DE CLASSIFICAÇÃO OFICIAL DOS MÓDULOS

---

Propor uma taxonomia oficial.

Exemplo:

1. Módulo de Produto
2. Módulo Base Reutilizável
3. Módulo Plugável
4. Módulo Operacional
5. Módulo de Governança
6. Módulo Técnico
7. Módulo de Integração
8. Módulo Experimental
9. Módulo Legado
10. Módulo Arquivado

Para cada tipo:

* definição;
* quando usar;
* exemplos encontrados;
* padrão mínimo;
* documentos mínimos;
* riscos.

Criar seção:

## Classificação Oficial Recomendada dos Módulos

---

19. FASE 17 — MATRIZ DE PRIORIDADE PÓS-AUDITORIA

---

Criar uma matriz final de prioridade.

Colunas:

* prioridade;
* módulo;
* problema/oportunidade;
* tipo de ação;
* impacto;
* esforço;
* risco;
* recomendação;
* próxima tarefa sugerida.

Tipos de ação:

* documentar;
* padronizar;
* refatorar;
* integrar;
* fundir;
* separar;
* transformar em módulo base;
* criar checklist;
* criar template;
* revisar visual;
* revisar Supabase;
* revisar governança;
* arquivar;
* investigar.

---

20. FASE 18 — DOCUMENTO FINAL

---

Criar relatório em Markdown.

Nome sugerido:

sagb-auditoria-geral-modulos-padrao-real-mapa-relacoes.md

Título do documento:

# SagB | Auditoria Geral de Módulos | Inventário Mestre, Padrão Modular Real e Mapa de Relações

Estrutura obrigatória:

## 1. Objetivo da auditoria

## 2. Escopo analisado

## 3. Caminho principal analisado

## 4. Caminhos complementares analisados

## 5. Caminhos não encontrados ou inacessíveis

## 6. Metodologia

## 7. Comandos executados

## 8. Comandos não executados

## 9. Comandos inexistentes

## 10. Comandos que exigiriam autorização

## 11. Inventário geral de módulos

## 12. Tabela mestre dos módulos

## 13. Auditoria individual dos módulos

## 14. Padrão modular real encontrado

## 15. Padrão modular recomendado para oficialização

## 16. Governança dos módulos

## 17. Documentos internos encontrados nos módulos

## 18. Arquivos padrão de módulo

## 19. Rotas, registry e exposição dos módulos

## 20. Relações atuais entre módulos

## 21. Relações recomendadas entre módulos

## 22. Mapa de relações entre módulos

## 23. Potenciais módulos base reutilizáveis

## 24. Diagnóstico visual dos módulos

## 25. Mapa de dados e Supabase por módulo

## 26. Riscos gerais do ecossistema modular

## 27. Duplicidades encontradas

## 28. Lacunas encontradas

## 29. Módulos referência

## 30. Módulos críticos

## 31. Módulos órfãos ou indefinidos

## 32. Recomendações para a Central de Padrões

## 33. Template oficial recomendado para novos módulos

## 34. Classificação oficial recomendada dos módulos

## 35. Checklists recomendados

## 36. Próximas megatarefas sugeridas

## 37. Matriz de prioridade pós-auditoria

## 38. Fato verificado, inferência, recomendação e pendentes de validação

## 39. Conclusão executiva

## 40. Anexos, se necessário

---

21. FASE 19 — RESUMO EXECUTIVO FINAL

---

Além do relatório completo, responder no chat com resumo curto contendo:

1. relatório salvo em;
2. caminho principal analisado;
3. total de módulos encontrados;
4. módulos mais maduros;
5. módulos mais críticos;
6. padrão modular real encontrado;
7. maior lacuna de governança;
8. maior risco técnico;
9. principais relações recomendadas;
10. recomendações para a Central de Padrões;
11. comandos executados;
12. comandos não executados;
13. próximos passos sugeridos.

---

22. VALIDAÇÕES E COMANDOS

---

Como esta é uma auditoria, não é obrigatório rodar build, lint ou testes.

Antes de executar qualquer comando:

1. verificar o package.json;
2. verificar se o comando faz sentido para auditoria;
3. não executar comandos destrutivos;
4. não executar comandos Git restritos;
5. não executar deploy;
6. não rodar npm run dev como padrão.

Comandos geralmente úteis nesta auditoria, se disponíveis e seguros:

* listar diretórios;
* buscar arquivos por nome;
* buscar manifest.ts;
* buscar routes.tsx;
* buscar README.md;
* buscar DECISIONS.md;
* buscar CHANGELOG.md;
* buscar PLANNED.md;
* buscar docs/;
* buscar agent/;
* buscar referências a Supabase;
* buscar referências entre módulos;
* buscar moduleRegistry;
* buscar imports cruzados.

Registrar tudo.

---

23. FORA DE ESCOPO

---

Não fazer nesta tarefa:

* implementação;
* refatoração;
* correção;
* criação de template real;
* criação de arquivos funcionais;
* criação de migration;
* alteração de Supabase;
* alteração de UI;
* commit;
* push;
* deploy;
* remoção de módulo;
* fusão de módulo;
* alteração de rotas;
* alteração de registry.

Esta tarefa é diagnóstico e relatório.

---

24. RESPOSTA FINAL ESPERADA

---

Ao finalizar, responder com:

1. Resumo executivo.
2. Caminho onde salvou o relatório.
3. Total de módulos analisados.
4. Lista de módulos encontrados.
5. Principais achados verdes.
6. Principais achados amarelos.
7. Principais achados vermelhos.
8. Principais achados cinzas.
9. Padrão modular real encontrado.
10. Padrão modular recomendado.
11. Principais relações atuais entre módulos.
12. Principais relações recomendadas.
13. Potenciais módulos base reutilizáveis.
14. Recomendações para a Central de Padrões.
15. Template oficial recomendado.
16. Comandos executados.
17. Comandos não executados.
18. Comandos inexistentes.
19. Comandos que exigiriam autorização.
20. Pendências.
21. Próximas megatarefas sugeridas.
22. O que fez.
23. O que faria diferente.
24. Insights, observações e cuidados.

Lembre-se:

Auditoria é mapa, não obra.

O objetivo desta tarefa é criar o documento base que vai orientar todas as próximas decisões sobre módulos no SagB.

FECHAMENTO DA TAREFA:
SagB | Auditoria Geral de Módulos | MEGA-ETAPA 01 | Inventário Mestre, Padrão Modular Real e Mapa de Relações

```
```
