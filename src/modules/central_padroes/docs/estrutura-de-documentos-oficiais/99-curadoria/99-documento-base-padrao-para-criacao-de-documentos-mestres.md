Cole este conteúdo no arquivo:

`99-documento-base-padrao-para-criacao-de-documentos-mestres-v1.0-07-06-2026.md`

```markdown
# Documento Base Padrão para Criação de Documentos Mestres — v1.0 — 07-06-2026

## Cabeçalho interno

| Campo | Informação |
|---|---|
| Código do documento | GOV-PAD-002 |
| Documento | Documento Base Padrão para Criação de Documentos Mestres |
| Tipo normativo | Padrão |
| Domínio normativo | Governança da Central de Padrões |
| Versão | v1.0 |
| Data da versão | 07-06-2026 |
| Status | em_curadoria |
| Formato | Markdown .md |
| Pasta de destino | MD-central-de-padroes/ |
| Validação final | Pietro Carboni |
| Uso principal | Orientar a criação dos Documentos Mestres v3.0 dos domínios normativos |
| Fonte operacional futura | Supabase |
| Acervo auditável | Pasta MD-central-de-padroes |

---

## 1. Objetivo deste documento

Este documento define o padrão obrigatório para criação dos **Documentos Mestres dos Domínios Normativos** da Central de Padrões.

Ele deve ser usado como régua para transformar documentos antigos, rascunhos, versões anteriores, auditorias e materiais de curadoria em documentos novos, organizados, neutros, rastreáveis e prontos para alimentar a Central de Padrões.

Este documento não é um modelo de contrato, plano de negócio, relatório técnico, PRD, ata ou checklist específico.

Ele é o **padrão-base para criação de Documentos Mestres**.

A lógica é:

~~~text
Fontes antigas v1.0 / v2.0
↓
Análise comparativa
↓
Consolidação
↓
Documento Mestre v3.0
↓
Subdocumentos derivados futuros
↓
Carga estruturada na Central de Padrões
~~~

---

## 2. Diferença entre Padrão Geral, Documento Mestre e Subdocumento

### 2.1. Padrão Geral

O padrão geral define regras amplas que valem para todos os documentos oficiais:

| Elemento | Função |
|---|---|
| Nome do arquivo | Garantir rastreabilidade |
| Código interno | Identificar o documento de forma estável |
| Versão | Controlar evolução |
| Data | Registrar atualização |
| Status | Indicar maturidade |
| Responsável | Definir guardião |
| Validação | Definir quem aprova |
| Estrutura | Manter consistência |
| Recursos visuais | Facilitar leitura |
| Metadados | Permitir busca conversacional |

### 2.2. Documento Mestre

O Documento Mestre é o documento principal de um domínio normativo.

Ele reúne:

- princípios;
- políticas;
- regras;
- padrões;
- protocolos;
- processos;
- procedimentos;
- checklists;
- matrizes;
- registros/evidências;
- riscos;
- lacunas;
- decisões;
- dependências;
- exemplos;
- subdocumentos futuros.

Ele funciona como o documento-mãe do domínio.

### 2.3. Subdocumento derivado

O subdocumento derivado é um documento específico extraído do Documento Mestre.

Exemplos:

| Tipo | Exemplo |
|---|---|
| Política | Política de Acesso Mínimo |
| Regra | Regra de Nomeação de Arquivos |
| Padrão | Padrão de Documento Técnico |
| Protocolo | Protocolo de Aprovação de Padrão |
| Processo | Processo de Decisão para Execução |
| Checklist | Checklist Pré-Dev |
| Matriz | Matriz de Classificação Normativa |
| Registro/Evidência | Registro de Decisão |

---

## 3. Estrutura oficial da pasta MD-central-de-padroes

A estrutura de trabalho deve ser:

~~~text
MD-central-de-padroes/
├── 97.0-tarefa-organizar-md-central-de-padroes-e-gerar-documentos-mestres-v3.0-07-06-2026.md
├── 98.0-plano-geracao-documentos-mestres-v3.0-07-06-2026.md
├── 99-documento-base-padrao-para-criacao-de-documentos-mestres-v1.0-07-06-2026.md
├── fontes-originais-v1-v2/
└── estrutura-de-documentos-oficiais/
    ├── 00-governanca-central-padroes/
    ├── 01-padroes-tecnicos-loze/
    ├── 02-processos-execucao-registros-operacionais/
    ├── 03-seguranca-digital-risco-protecao/
    ├── 04-ux-ui-experiencia-interface/
    ├── 05-agentes-autonomos-ia-orquestracao/
    ├── 06-modelos-ia-radar-tecnologico-governanca-ia/
    ├── 07-naming-disponibilidade-banco-marcas/
    ├── 08-exploracao-classificacao-inicial-ideias/
    ├── 09-metodologias-frameworks-estruturas-intelectuais/
    ├── 10-educacao-mentorias-cursos-trilhas-programas-formacao/
    └── 11-marcas-empresas-ventures-planos-negocio/
~~~

---

## 4. Função de cada pasta e arquivo raiz

| Item | Função |
|---|---|
| `97.0-tarefa...` | Tarefa operacional para o agente executar |
| `98.0-plano...` | Plano criado antes da execução |
| `99-documento-base...` | Este documento-base padrão |
| `fontes-originais-v1-v2/` | Guarda documentos antigos usados como fonte |
| `estrutura-de-documentos-oficiais/` | Guarda os documentos mestres e futuros derivados |

Regra:

~~~text
A pasta fontes-originais-v1-v2 preserva o histórico.
A pasta estrutura-de-documentos-oficiais guarda a nova estrutura limpa.
~~~

---

## 5. Domínios normativos oficiais

| Nº | Código do Documento Mestre | Domínio normativo | Responsável atual |
|---|---|---|---|
| 00 | DM-00-GOV | Governança da Central de Padrões | Pietro Carboni |
| 01 | DM-01-TEC-LOZE | Padrões Técnicos da Loze | Sávio Codare |
| 02 | DM-02-PROC | Processos, Execução e Registros Operacionais | Yuri Sague |
| 03 | DM-03-SEG | Segurança Digital, Risco e Proteção | Pedro Gazan |
| 04 | DM-04-UX | UX/UI, Experiência e Interface | Alice Montini |
| 05 | DM-05-AGT | Agentes Autônomos, IA e Orquestração | Pierre Zanulli |
| 06 | DM-06-IA | Modelos de IA, Radar Tecnológico e Governança de IA | Klaus Wagen |
| 07 | DM-07-NAM | Naming, Disponibilidade e Banco de Marcas | Noah Verdili |
| 08 | DM-08-IDE | Exploração e Classificação Inicial de Ideias | Dante Montoya |
| 09 | DM-09-MET | Metodologias, Frameworks e Estruturas Intelectuais | Nilo Barret |
| 10 | DM-10-EDU | Educação, Mentorias, Cursos, Trilhas e Programas de Formação | Júlio Mosqueira |
| 11 | DM-11-NEG | Marcas, Empresas, Ventures e Planos de Negócio | César Tulli |

---

## 6. Regra de neutralidade institucional

Os nomes dos documentos e pastas devem ser neutros, institucionais e reutilizáveis.

Empresas, produtos, ventures, módulos e marcas específicas podem aparecer como exemplos dentro do conteúdo, mas não devem nomear o documento principal.

Responsáveis humanos ou agentes aparecem como responsáveis, guardiões ou validadores, mas não como donos do padrão.

Exemplos corretos:

~~~text
10-educacao-mentorias-cursos-trilhas-programas-formacao/
11-marcas-empresas-ventures-planos-negocio/
04-ux-ui-experiencia-interface/
~~~

Exemplos incorretos:

~~~text
10-acadb-mentorias-cursos-trilhas/
11-startyb-marcas-empresas-ventures/
04-padrao-alice-ui/
~~~

Regra central:

~~~text
Documento de padrão = neutro.
Responsável = pessoa/agente guardião.
Empresa/venture/produto = aplicação do padrão.
~~~

---

## 7. Separação entre GrupoB, Loze e aplicações

A Central de Padrões deve separar claramente:

| Camada | Função |
|---|---|
| GrupoB | Camada institucional, normativa, estratégica e metodológica |
| Loze | Camada técnica de sistemas, arquitetura, programação e tecnologia aplicada |
| Empresas / ventures / produtos | Aplicações dos padrões |
| Central de Padrões | Fonte normativa viva |
| Supabase | Fonte operacional canônica futura |
| Pasta MD | Acervo auditável e fonte documental organizada |
| Módulo SagB | Interface executora e consultável |

Regra:

~~~text
Padrões técnicos de sistemas pertencem à camada Loze.
Padrões institucionais e estratégicos pertencem à camada GrupoB.
Empresas e ventures usam padrões, mas não definem o nome neutro do padrão.
~~~

---

## 8. Nomes finais dos Documentos Mestres v3.0

Criar exatamente estes arquivos:

~~~text
estrutura-de-documentos-oficiais/00-governanca-central-padroes/dm-00-gov-documento-mestre-governanca-central-padroes-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/01-padroes-tecnicos-loze/dm-01-tec-loze-documento-mestre-padroes-tecnicos-loze-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/02-processos-execucao-registros-operacionais/dm-02-proc-documento-mestre-processos-execucao-registros-operacionais-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/03-seguranca-digital-risco-protecao/dm-03-seg-documento-mestre-seguranca-digital-risco-protecao-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/04-ux-ui-experiencia-interface/dm-04-ux-documento-mestre-ux-ui-experiencia-interface-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/dm-05-agt-documento-mestre-agentes-autonomos-ia-orquestracao-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/06-modelos-ia-radar-tecnologico-governanca-ia/dm-06-ia-documento-mestre-modelos-ia-radar-tecnologico-governanca-ia-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/07-naming-disponibilidade-banco-marcas/dm-07-nam-documento-mestre-naming-disponibilidade-banco-marcas-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/08-exploracao-classificacao-inicial-ideias/dm-08-ide-documento-mestre-exploracao-classificacao-inicial-ideias-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/09-metodologias-frameworks-estruturas-intelectuais/dm-09-met-documento-mestre-metodologias-frameworks-estruturas-intelectuais-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/10-educacao-mentorias-cursos-trilhas-programas-formacao/dm-10-edu-documento-mestre-educacao-mentorias-cursos-trilhas-programas-formacao-v3.0-07-06-2026.md

estrutura-de-documentos-oficiais/11-marcas-empresas-ventures-planos-negocio/dm-11-neg-documento-mestre-marcas-empresas-ventures-planos-negocio-v3.0-07-06-2026.md
~~~

---

## 9. Regra de nomeação de arquivos e pastas

Todos os novos arquivos e pastas devem seguir:

~~~text
letras minúsculas
hífen entre palavras
sem underline
sem espaço
sem acento
sem caractere especial
versão antes da data
data no final
extensão .md para documentos
~~~

Exemplo correto:

~~~text
dm-03-seg-documento-mestre-seguranca-digital-risco-protecao-v3.0-07-06-2026.md
~~~

Exemplo incorreto:

~~~text
03_pedro_gazan_divisao_seguranca_digital_risco_protecao_documento_geral_v3.0.md
~~~

---

## 10. Códigos internos dos Documentos Mestres

Os códigos internos dos Documentos Mestres são estáveis.

A versão e a data podem mudar.

O código não muda.

| Código | Documento |
|---|---|
| DM-00-GOV | Documento Mestre de Governança da Central de Padrões |
| DM-01-TEC-LOZE | Documento Mestre de Padrões Técnicos da Loze |
| DM-02-PROC | Documento Mestre de Processos, Execução e Registros Operacionais |
| DM-03-SEG | Documento Mestre de Segurança Digital, Risco e Proteção |
| DM-04-UX | Documento Mestre de UX/UI, Experiência e Interface |
| DM-05-AGT | Documento Mestre de Agentes Autônomos, IA e Orquestração |
| DM-06-IA | Documento Mestre de Modelos de IA, Radar Tecnológico e Governança de IA |
| DM-07-NAM | Documento Mestre de Naming, Disponibilidade e Banco de Marcas |
| DM-08-IDE | Documento Mestre de Exploração e Classificação Inicial de Ideias |
| DM-09-MET | Documento Mestre de Metodologias, Frameworks e Estruturas Intelectuais |
| DM-10-EDU | Documento Mestre de Educação, Mentorias, Cursos, Trilhas e Programas de Formação |
| DM-11-NEG | Documento Mestre de Marcas, Empresas, Ventures e Planos de Negócio |

---

## 11. Códigos dos subdocumentos derivados

Os subdocumentos derivados usam o padrão:

~~~text
SIGLA- TIPO - NUMERO
~~~

Sem espaços no código.

Exemplo:

~~~text
SEG-POL-001
NEG-MTZ-001
TEC-CHK-001
GOV-PRT-001
~~~

### 11.1. Siglas dos domínios

| Sigla | Domínio |
|---|---|
| GOV | Governança da Central de Padrões |
| TEC | Padrões Técnicos da Loze |
| PROC | Processos, Execução e Registros Operacionais |
| SEG | Segurança Digital, Risco e Proteção |
| UX | UX/UI, Experiência e Interface |
| AGT | Agentes Autônomos, IA e Orquestração |
| IA | Modelos de IA, Radar Tecnológico e Governança de IA |
| NAM | Naming, Disponibilidade e Banco de Marcas |
| IDE | Exploração e Classificação Inicial de Ideias |
| MET | Metodologias, Frameworks e Estruturas Intelectuais |
| EDU | Educação, Mentorias, Cursos, Trilhas e Programas de Formação |
| NEG | Marcas, Empresas, Ventures e Planos de Negócio |

### 11.2. Siglas dos tipos normativos

| Sigla | Tipo |
|---|---|
| PRI | Princípio |
| POL | Política |
| RGR | Regra |
| PAD | Padrão |
| PRT | Protocolo |
| PRC | Processo |
| POP | Procedimento operacional |
| CHK | Checklist |
| MTZ | Matriz |
| RGT | Registro/Evidência |
| DEC | Decisão |
| RSC | Risco |
| LAC | Lacuna |

---

## 12. Exemplos de subdocumentos derivados

### 12.1. Governança

| Código | Tipo | Arquivo futuro sugerido |
|---|---|---|
| GOV-POL-001 | Política | gov-pol-001-politica-canonicidade-padroes-v1.0-07-06-2026.md |
| GOV-PRT-001 | Protocolo | gov-prt-001-protocolo-aprovacao-padrao-v1.0-07-06-2026.md |
| GOV-MTZ-001 | Matriz | gov-mtz-001-matriz-classificacao-normativa-v1.0-07-06-2026.md |

### 12.2. Segurança

| Código | Tipo | Arquivo futuro sugerido |
|---|---|---|
| SEG-POL-001 | Política | seg-pol-001-politica-acesso-minimo-v1.0-07-06-2026.md |
| SEG-PRT-001 | Protocolo | seg-prt-001-protocolo-incidente-seguranca-v1.0-07-06-2026.md |
| SEG-CHK-001 | Checklist | seg-chk-001-checklist-dados-sensiveis-v1.0-07-06-2026.md |

### 12.3. Negócios

| Código | Tipo | Arquivo futuro sugerido |
|---|---|---|
| NEG-PAD-001 | Padrão | neg-pad-001-documento-descricao-inicial-negocio-v1.0-07-06-2026.md |
| NEG-MTZ-001 | Matriz | neg-mtz-001-matriz-go-ajustes-freeze-no-go-v1.0-07-06-2026.md |
| NEG-PRT-001 | Protocolo | neg-prt-001-protocolo-handoff-negocio-para-execucao-v1.0-07-06-2026.md |

---

## 13. Versionamento oficial

Usar esta régua:

| Versão | Quando usar |
|---|---|
| v1.0 | Primeira versão oficial do documento próprio |
| v1.1 | Melhoria pequena ou acréscimo sem mudar regra |
| v1.2 | Evolução incremental relevante |
| v2.0 | Mudança estrutural, mudança de escopo, mudança de regra central ou substituição de padrão |
| v3.0 | Consolidação excepcional a partir de versões anteriores |

Neste ciclo:

~~~text
Documentos Mestres consolidados = v3.0
Subdocumentos futuros = v1.0
~~~

### 13.1. Não muda versão

Não alterar versão para:

- correção de digitação;
- ajuste de espaçamento;
- correção de link;
- formatação de tabela;
- ajuste visual sem mudança de sentido.

### 13.2. Muda para v1.1 ou v1.2

Alterar versão incremental quando houver:

- novo exemplo;
- nova seção complementar;
- nova matriz complementar;
- novo checklist complementar;
- esclarecimento relevante;
- melhoria de fluxo sem mudar a regra central.

### 13.3. Muda para v2.0

Alterar para versão maior quando houver:

- mudança de escopo;
- mudança de regra obrigatória;
- mudança de responsável oficial;
- mudança de fluxo principal;
- substituição de padrão;
- alteração que impacta outro domínio normativo;
- mudança de status canônico.

---

## 14. Status oficiais permitidos

Usar apenas estes status:

| Status | Uso |
|---|---|
| bruto | Material ainda não tratado |
| rascunho | Documento inicial sem revisão |
| em_revisao | Em revisão por responsável |
| em_curadoria | Em organização para virar referência |
| homologado | Validado operacionalmente |
| canonico_operacional | Usado como referência prática, ainda não final |
| canonico_oficial | Aprovado como fonte oficial |
| publicado | Liberado para uso externo ou amplo |
| obsoleto | Não recomendado para uso |
| arquivado | Guardado apenas como histórico |
| bloqueado | Suspenso por risco ou conflito |
| precisa_validacao | Depende de validação antes de avançar |

Regra:

~~~text
Nenhum Documento Mestre v3.0 deve ser marcado como canonico_oficial sem validação final.
~~~

Status sugerido para os Documentos Mestres v3.0:

~~~text
em_curadoria
~~~

---

## 15. Estrutura obrigatória de cada Documento Mestre v3.0

Cada Documento Mestre v3.0 deve começar assim:

~~~markdown
# Documento Mestre — [Nome do Domínio Normativo] — v3.0 — 07-06-2026

## Cabeçalho interno

| Campo | Informação |
|---|---|
| Código do documento | DM-XX-YYY |
| Documento | Documento Mestre |
| Domínio normativo | [Nome do domínio] |
| Responsável atual | [Nome do responsável] |
| Versão | v3.0 |
| Data da versão | 07-06-2026 |
| Status | em_curadoria |
| Formato | Markdown .md |
| Pasta de destino | estrutura-de-documentos-oficiais/[pasta-do-dominio]/ |
| Validação final | Pietro Carboni |
| Palavras-chave | ... |
| Exemplos de uso | ... |
| Domínios relacionados | ... |
| Responsáveis relacionados | ... |
~~~

Depois deve seguir esta estrutura mínima:

~~~markdown
## 1. Objetivo do documento
## 2. Escopo do domínio normativo
## 3. O que este domínio define
## 4. O que este domínio não define
## 5. Fontes analisadas
## 6. Síntese executiva
## 7. Mapa visual do domínio
## 8. Princípios
## 9. Políticas
## 10. Regras centrais
## 11. Padrões oficiais e candidatos a padrão
## 12. Protocolos reais
## 13. Processos
## 14. Procedimentos operacionais
## 15. Checklists obrigatórios
## 16. Matrizes obrigatórias
## 17. Registros e evidências obrigatórias
## 18. Fluxos Mermaid
## 19. Dependências com outros domínios
## 20. Conflitos de escopo
## 21. Riscos se os padrões não forem seguidos
## 22. O que deve ser monitorado pela Central de Monitoramento
## 23. Relação com Biblioteca de Módulos Base, se aplicável
## 24. Relação com módulos executores, se aplicável
## 25. Lacunas e validações pendentes
## 26. Decisões já tomadas
## 27. Subdocumentos oficiais previstos para extração
## 28. Padrões atômicos sugeridos para o módulo SagB
## 29. Ordem recomendada de canonização
## 30. Síntese final
~~~

---

## 16. Recursos visuais obrigatórios

Todo Documento Mestre deve ter recursos visuais.

Obrigatório incluir:

- tabelas;
- matrizes;
- fluxos Mermaid;
- listas hierárquicas;
- quadros de síntese;
- color code;
- checklists;
- mapas de dependência;
- exemplos práticos;
- fluxos de aprovação ou handoff, quando aplicável.

Cada Documento Mestre deve ter pelo menos:

| Recurso | Obrigatório |
|---|---|
| Mapa visual do domínio | Sim |
| Fluxo Mermaid principal | Sim |
| Matriz de dependências | Sim |
| Tabela de inventário normativo | Sim |
| Tabela de subdocumentos derivados | Sim |
| Checklist final | Sim |
| Quadro de riscos | Sim |
| Quadro de monitoramento | Sim |
| Seção de exemplos práticos | Sim |

Regra:

~~~text
Documento sem recurso visual suficiente deve ser tratado como incompleto.
~~~

---

## 17. Mermaid obrigatório

Todo Documento Mestre deve ter pelo menos um fluxo Mermaid.

Exemplo base:

~~~mermaid
flowchart TB
    A[Entrada da demanda] --> B[Análise do domínio]
    B --> C[Classificação normativa]
    C --> D[Registro de padrão ou lacuna]
    D --> E[Validação com domínios dependentes]
    E --> F[Curadoria]
    F --> G[Candidato a canônico]
~~~

Quando houver handoff, usar fluxo:

~~~mermaid
flowchart LR
    A[Domínio de origem] --> B[Análise]
    B --> C{Precisa de outro domínio?}
    C -->|Sim| D[Registrar dependência]
    C -->|Não| E[Seguir curadoria]
    D --> F[Validação cruzada]
    F --> E
~~~

---

## 18. Color code obrigatório

Usar color code para facilitar leitura:

| Código visual | Significado |
|---|---|
| 🟢 | Bom, aprovado, suficiente ou funcionando |
| 🟡 | Atenção, parcial ou precisa ajuste |
| 🔴 | Crítico, ausente ou risco alto |
| 🔵 | Oportunidade estratégica |
| 🟣 | Governança, padrão ou decisão estrutural |
| ⚫ | Contexto neutro |
| 🚨 | Bloqueador ou alto impacto |

---

## 19. Tabelas obrigatórias

Cada Documento Mestre deve conter, no mínimo, estas tabelas:

### 19.1. Inventário normativo

| Código | Item | Tipo normativo | Status | Prioridade | Responsável | Validação necessária |
|---|---|---|---|---|---|---|

### 19.2. Dependências

| Tema | Depende de quem | Motivo | Tipo de dependência | Registro sugerido |
|---|---|---|---|---|

### 19.3. Lacunas

| Lacuna | Impacto | Quem valida | Prioridade | Recomendação |
|---|---|---|---|---|

### 19.4. Riscos

| Risco | Causa provável | Impacto | Como prevenir | Quem acompanha |
|---|---|---|---|---|

### 19.5. Monitoramento

| Item a monitorar | Por que monitorar | Origem do dado | Responsável | Ação se der alerta |
|---|---|---|---|---|

### 19.6. Subdocumentos previstos

| Código sugerido | Tipo | Nome do subdocumento | Prioridade | Status | Arquivo futuro sugerido |
|---|---|---|---|---|---|

---

## 20. Subdocumentos oficiais previstos para extração

Cada Documento Mestre v3.0 deve conter a seção:

~~~markdown
## 27. Subdocumentos oficiais previstos para extração
~~~

Com a tabela:

~~~markdown
| Código sugerido | Tipo | Nome do subdocumento | Prioridade | Status | Arquivo futuro sugerido |
|---|---|---|---|---|---|
~~~

Não criar os subdocumentos derivados nesta fase.

Apenas listar dentro dos Documentos Mestres.

Regra:

~~~text
Documento Mestre v3.0 lista os derivados.
Derivados serão criados depois, em fase própria, começando em v1.0.
~~~

---

## 21. Relação com Central de Monitoramento

Cada Documento Mestre deve indicar o que precisa ser monitorado.

A lógica é:

~~~text
Central de Padrões define.
Central de Monitoramento observa.
Módulo executor aciona.
Responsável responde.
~~~

Exemplos de itens monitoráveis:

- padrão vencido;
- documento sem responsável;
- decisão sem registro;
- checklist não preenchido;
- dependência sem validação;
- risco sem dono;
- padrão em conflito;
- demanda executada sem padrão consultado;
- item usando versão obsoleta;
- documento sem evidência;
- subdocumento previsto, mas não criado.

---

## 22. Busca conversacional futura

Os documentos devem conter metadados suficientes para permitir busca conversacional.

A Central de Padrões deve permitir perguntas como:

~~~text
Quero criar uma venture. Quais padrões preciso seguir?
Quero criar um app. O que preciso consultar antes da Dev?
Quero criar um curso. Quais documentos devo olhar?
Tenho um risco de dados sensíveis. Qual padrão vale?
Quero criar um agente. Quais regras existem?
~~~

Cada Documento Mestre deve incluir:

| Campo | Função |
|---|---|
| Palavras-chave | Ajudar busca semântica |
| Exemplos de uso | Mostrar aplicação real |
| Domínios relacionados | Sugerir leitura cruzada |
| Responsáveis relacionados | Encaminhar dúvidas |
| Status | Evitar uso indevido |
| Validação final | Indicar autoridade normativa |

Regra:

~~~text
O usuário não precisa saber o nome exato do padrão para encontrar o caminho correto.
~~~

---

## 23. Relação com aplicações dos padrões

Cada Documento Mestre deve permitir identificar onde seus padrões podem ser aplicados.

Exemplos de aplicações:

| Tipo de aplicação | Exemplo de uso |
|---|---|
| Empresa | Usa padrões de negócio, naming, segurança e processos |
| Venture | Usa padrões de ideia, negócio, naming, plano e governança |
| Produto digital | Usa padrões técnicos, UX, segurança e módulos |
| Curso | Usa padrões educacionais, metodológicos e de registro |
| Agente | Usa padrões de agentes, IA, segurança e logs |
| Metodologia | Usa padrões de métodos, autoria, versão e aplicação |
| App | Usa padrões técnicos, UX, segurança e Biblioteca de Módulos |

Regra:

~~~text
O padrão é neutro.
A aplicação registra onde ele é usado.
~~~

---

## 24. Relação com Biblioteca de Módulos Base

Quando o domínio tiver impacto em sistemas, apps, agentes, IA, automações, produtos digitais ou execução técnica, o Documento Mestre deve registrar relação com:

- Biblioteca de Módulos Base;
- Gate Modular Pré-Dev;
- Pacote Modular Pré-Dev;
- Sala Dev;
- módulos executores.

Se não houver relação direta, escrever:

~~~text
Este domínio não possui relação direta com a Biblioteca de Módulos Base nesta versão, mas pode gerar dependências futuras.
~~~

---

## 25. Proibições

Não fazer:

~~~text
apagar fontes antigas
sobrescrever v1.0 ou v2.0
marcar documento como canonico_oficial sem validação
usar nomes de empresas como título principal neutro
usar nomes de pessoas como nome de padrão
criar subdocumentos derivados nesta fase
criar pastas extras sem necessidade
alterar conteúdo conceitual sem preservar fonte
misturar padrão técnico com padrão institucional sem registrar dependência
~~~

---

## 26. Checklist de conformidade do Documento Mestre

Antes de considerar um Documento Mestre pronto, verificar:

| Item | Conferência |
|---|---|
| Nome do arquivo está correto? |  |
| Código interno está correto? |  |
| Domínio normativo está neutro? |  |
| Responsável atual está no cabeçalho? |  |
| Versão está correta? |  |
| Data está no final do arquivo? |  |
| Status não é canônico oficial? |  |
| Fontes v1.0/v2.0 foram consideradas? |  |
| Falas soltas de chat foram removidas? |  |
| O conteúdo útil foi preservado? |  |
| Há mapa visual? |  |
| Há fluxo Mermaid? |  |
| Há inventário normativo? |  |
| Há tabela de dependências? |  |
| Há tabela de riscos? |  |
| Há tabela de monitoramento? |  |
| Há seção de subdocumentos previstos? |  |
| Há exemplos práticos? |  |
| Há lacunas e validações pendentes? |  |
| Há síntese final? |  |

---

## 27. Critério de pronto

Um Documento Mestre v3.0 está pronto para curadoria quando:

1. está na pasta correta;
2. tem nome correto;
3. tem código interno;
4. tem cabeçalho completo;
5. usa domínio neutro;
6. preserva o melhor das fontes v1.0 e v2.0;
7. remove ruídos de chat;
8. usa recursos visuais;
9. lista subdocumentos futuros;
10. registra riscos, lacunas e dependências;
11. não marca nada como canônico oficial;
12. está em Markdown `.md`.

Status final recomendado:

~~~text
em_curadoria
~~~

---

## 28. Síntese final

Este documento `99` é a régua para criação dos Documentos Mestres v3.0 da Central de Padrões.

Ele define:

- estrutura de pastas;
- nomes dos domínios;
- nomes dos arquivos;
- códigos internos;
- versionamento;
- status;
- recursos visuais;
- neutralidade institucional;
- relação entre Documento Mestre e subdocumentos;
- relação com Central de Monitoramento;
- relação com busca conversacional;
- regras mínimas de qualidade.

A regra final é:

~~~text
Cada domínio normativo terá uma pasta.
Cada pasta terá um Documento Mestre v3.0.
Cada Documento Mestre listará seus subdocumentos futuros.
Os subdocumentos serão criados depois, na mesma pasta, começando em v1.0.
~~~

Fechamento:

~~~text
Este documento deve ser usado como padrão obrigatório para gerar os Documentos Mestres v3.0 dentro de MD-central-de-padroes.
~~~
```
