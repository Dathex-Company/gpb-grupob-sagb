# ET-21 — Auditoria de Cobertura da Curadoria Geral das Divisões

**Data:** 2026-06-01
**Executor técnico:** Cássio/Procássio
**Solicitante:** Pietro Carboni / Rodrigues
**Status geral:** Curadoria Geral das Divisões — concluída operacionalmente
**Canonicidade final:** pendente de validação Pietro
**Regra:** nada marcado como canônico final

---

## 1. Objetivo da auditoria

Esta auditoria verifica a cobertura da Curadoria Geral das Divisões carregada no módulo Central de Padrões, após aprovação operacional da ET-10 a ET-20.

Foram avaliados, por divisão:

1. cadastro do documento-mãe;
2. aderência dos itens atômicos ao conteúdo do documento;
3. lacunas de princípios, políticas, regras, padrões, protocolos, processos, checklists, matrizes e registros;
4. suficiência dos 6 itens criados por divisão;
5. dependências vinculadas;
6. duplicidades entre áreas;
7. classificação normativa;
8. completude dos relatórios ET-10 a ET-20.

---

## 2. Síntese executiva

A Curadoria Geral das Divisões está **concluída operacionalmente** e cobre todas as áreas solicitadas, com documentos-mãe cadastrados, itens atômicos iniciais, checklists, matrizes, registros/evidências, decisões/lacunas e relatórios por ET.

Entretanto, a auditoria indica que os **6 itens por divisão são suficientes como carga inicial operacional**, mas **não são suficientes como extração normativa completa**. Cada documento de divisão contém mais itens do que a primeira carga operacional capturou.

Portanto:

- a carga atual é adequada como **V1 operacional**;
- a canonicidade final deve continuar pendente;
- uma próxima etapa deve ampliar a extração por divisão, priorizando itens críticos.

---

## 3. Status geral registrado

| Campo | Status |
|---|---|
| Curadoria Geral das Divisões | concluída operacionalmente |
| Canonicidade final | pendente de validação Pietro |
| Itens novos | em revisão / candidatos |
| Documentos-mãe | em revisão / candidatos a canônicos |
| Relatórios ET-10 a ET-20 | criados |
| Build | pendente nesta etapa até validação final |

---

## 4. Auditoria por divisão

### 4.1 ET-10 — Pietro / Governança Geral

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-GOV-002 a CP-GOV-007 |
| Representatividade | Boa para núcleo mínimo: padrão antes da escala, classificação normativa, canonicidade, dependências, aprovação e registros |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem vinculadas como base transversal |
| Duplicidade | Baixa; CP-GOV deve funcionar como camada-mãe das demais áreas |
| Classificação normativa | Adequada |
| Relatório ET-10 | Criado, mas sintético |

**Itens importantes que ficaram de fora ou precisam expansão:**

- ciclo de vida de documentos;
- ciclo de vida de padrões;
- matriz de maturidade documental;
- matriz de responsabilidade por área;
- matriz de uso interno x externo;
- protocolo de ingestão em `99_triagem`;
- registro de documento canônico;
- registro de conflito entre áreas;
- política de documentação interna/externa.

**Parecer:** cobertura inicial adequada, mas Pietro requer expansão normativa por ser a área-mãe.

---

### 4.2 ET-09 — Sávio / Técnica

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim — doc-006 e documento geral reconciliado |
| Itens atômicos criados | CP-TEC-001 a CP-TEC-026 |
| Representatividade | Forte; foi a curadoria-modelo |
| Suficiência | Boa para V1 operacional |
| Dependências | Bem vinculadas com Alice, Pedro, Pierre, Klaus, Yuri, Pietro e Kane/Rodrigues |
| Duplicidade | Controlada; CP-MOD-001 preservado sem duplicar CP-TEC |
| Classificação normativa | Ajustada, incluindo CP-TEC-026 como registro/evidência |
| Relatórios | ET-09A e ET-09B criados |

**Itens que ainda podem entrar em versões futuras:**

- matriz módulo/tabela/API/service;
- matriz de ambientes;
- inventário de repositórios;
- inventário de APIs;
- inventário de MCPs técnicos;
- protocolo de incidente técnico crítico expandido;
- protocolo de criação de tabela crítica.

**Parecer:** melhor cobertura entre as divisões; serve como referência.

---

### 4.3 ET-11 — Alice / UX UI

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-UX-001 a CP-UX-006 |
| Representatividade | Boa para variação visual, design system, gate visual, matriz de tela, release e evidência visual |
| Suficiência dos 6 itens | Parcial |
| Dependências | Vinculada a Sávio, Pedro, Pierre e Pietro; precisa detalhar mais |
| Duplicidade | Risco médio com Sávio (tokens/componentes), Pedro (mensagens de risco) e Pierre (UX de agente) |
| Classificação normativa | Adequada |
| Relatório ET-11 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- política de exceção visual;
- ciclo de vida de componentes;
- matriz de severidade de mensagens;
- matriz permissão x experiência visual;
- matriz autonomia visual de agente;
- registro de tela aprovada;
- registro de componente oficial;
- protocolo de UX de aprovação humana;
- protocolo de logs visíveis ao usuário;
- padrão de link bio e páginas públicas.

**Parecer:** núcleo V1 suficiente, mas Alice demanda extração ampliada.

---

### 4.4 ET-12 — Pedro / Segurança

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-SEG-001 a CP-SEG-006 |
| Representatividade | Boa para Bitwarden, CAD, MFA/2FA, chaves, incidente e exceção |
| Suficiência dos 6 itens | Parcial |
| Dependências | Vinculada a Sávio, Alice, Pierre, Pietro e jurídico conceitualmente; precisa ampliar em dados |
| Duplicidade | Risco médio com Sávio em Supabase/RLS/logs e com Pierre em agentes |
| Classificação normativa | Adequada |
| Relatório ET-12 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- política oficial do Bitwarden;
- governança do Bitwarden;
- política de identidade e acesso;
- matriz de permissões;
- matriz de sensibilidade da informação;
- matriz de autenticadores por criticidade;
- protocolo de vazamento de credencial;
- protocolo de vazamento de token/chave;
- registro de concessão de acesso;
- registro de revisão de acesso;
- registro de rotação de credencial;
- política de proteção de documentos estratégicos.

**Parecer:** cobertura inicial boa, porém segurança precisa de expansão prioritária.

---

### 4.5 ET-13 — Pierre / Agentes e IA

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-AGT-001 a CP-AGT-006 |
| Representatividade | Boa para ficha, macrocamadas, autonomia, memória, escalonamento e criação de agente |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Sávio, Pedro, Alice, Klaus, Yuri e Pietro |
| Duplicidade | Risco alto com Sávio (tool use/MCPs), Pedro (segurança), Klaus (modelos) e Alice (UX de agente) |
| Classificação normativa | Adequada |
| Relatório ET-13 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- matriz de tipos de memória;
- matriz agente/capacidade/automação/ferramenta;
- matriz de risco por ferramenta;
- matriz de pausa de agente;
- protocolo de pausa de agente;
- protocolo de aprendizado revisado;
- protocolo de confusão de contexto;
- protocolo de incidente por tool use;
- catálogo oficial de agentes;
- registro de tool use;
- registro de aprendizado candidato/aprovado;
- registro de handoff entre agentes;
- padrão do núcleo conversacional.

**Parecer:** carga inicial cobre núcleo, mas agentes exigem segunda rodada mais profunda.

---

### 4.6 ET-14 — Klaus / Modelos IA e RAI

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-IA-001 a CP-IA-006 |
| Representatividade | Boa para fonte oficial, RAI, status da informação, matriz de modelo, alerta e registro de atualização |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Pierre, Sávio, Pedro, Alice, Yuri e Pietro |
| Duplicidade | Risco médio com Pierre (IA para agentes) e Sávio (APIs/modelos integrados) |
| Classificação normativa | Adequada |
| Relatório ET-14 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- catálogo oficial de fornecedores;
- catálogo oficial de modelos;
- ficha padrão de modelo;
- matriz custo/qualidade/velocidade;
- matriz privacidade/retenção;
- matriz confiabilidade da fonte;
- checklist retenção e treinamento de dados;
- protocolo de modelo descontinuado;
- protocolo de mudança de comportamento de modelo;
- registro de documentação oficial;
- registro de custo por modelo;
- registro de varreduras do RAI.

**Parecer:** cobertura inicial boa, mas RAI precisa expansão documental para virar operação viva.

---

### 4.7 ET-15 — Yuri / Processos e TaskZei

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-PROC-001 a CP-PROC-006 |
| Representatividade | Boa para regra central, decisão/tarefa, campos mínimos, matriz conceitual, encerramento e registro mínimo |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para todos os responsáveis |
| Duplicidade | Risco médio com Pietro (documentos canônicos), Pierre (handoff inteligente) e Sávio (TaskZei técnico) |
| Classificação normativa | Adequada |
| Relatório ET-15 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- processo de entrada de demanda;
- matriz de classificação de entrada;
- matriz de prioridade operacional;
- matriz de owner e validador;
- protocolo de escalonamento de bloqueio;
- protocolo de reunião com saída executável;
- protocolo de handoff operacional;
- registro de bloqueio;
- registro de handoff;
- política de fontes limpas e canvas de trabalho;
- padrão de tabela viva operacional.

**Parecer:** cobertura inicial adequada, mas processos demandam extração ampliada.

---

### 4.8 ET-16 — Noah / Naming

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-NAM-001 a CP-NAM-006 |
| Representatividade | Boa para parecer x jurídico, padrão de nome, categoria, curadoria, checklist e registro |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Dante, Pietro, César, Alice, Sávio, Nilo, Júlio e jurídico |
| Duplicidade | Risco médio com César/StartyB (marca/empresa), Nilo (metodologias) e Júlio (cursos) |
| Classificação normativa | Adequada |
| Relatório ET-16 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- política de criação de nomes;
- política de pesquisa de disponibilidade;
- política de uso do B;
- matriz de status do nome;
- matriz de risco de confusão;
- matriz nome atual x nome oficial;
- protocolo de nome com risco jurídico;
- registro de nomes legados;
- registro de nomes descartados;
- registro de pesquisa de nome;
- registro de domínios e redes sociais;
- modelo de parecer de naming.

**Parecer:** cobertura boa como núcleo, mas naming precisa segunda extração.

---

### 4.9 ET-17 — Dante / Ideias

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-IDEIA-001 a CP-IDEIA-006 |
| Representatividade | Boa para regra central, não execução prematura, matriz origem/tipo/destino, protocolo, checklist e registro |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Noah, César, Loze/Sávio, Nilo, Júlio, Pierre, Klaus, Pedro, Yuri e Pietro |
| Duplicidade | Risco médio com César (negócio), Noah (naming), Nilo (metodologia), Júlio (educação) |
| Classificação normativa | Adequada |
| Relatório ET-17 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- padrão de status da ideia;
- matriz de maturidade da ideia;
- matriz de duplicidade/sobreposição;
- matriz ideia/hipótese/tese/oportunidade/decisão;
- protocolo de separação de ideia misturada;
- protocolo de handoff de ideia;
- protocolo de bloqueio de execução prematura;
- registro de origem da ideia;
- registro de versões da ideia;
- registro de encaminhamento;
- checklist de risco sensível digital.

**Parecer:** cobertura inicial adequada; Dante precisa expansão para status, origem e duplicidade.

---

### 4.10 ET-18 — Nilo / Metodologias

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-MET-001 a CP-MET-006 |
| Representatividade | Boa para fala autoral, 99_triagem, classificação intelectual, extração autoral, checklist e registro |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Pietro, Douglas/Rodrigues, Júlio, César, Sávio, Noah e Pierre |
| Duplicidade | Risco alto com Júlio (metodologia x curso) e César (método x ativo de empresa) |
| Classificação normativa | Adequada |
| Relatório ET-18 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- matriz de maturidade metodológica;
- matriz dono/usuário/dependências;
- matriz titularidade/uso/licença/valuation;
- matriz certificação/selo/metodologia/framework;
- padrão do repositório `03_metodos`;
- regra de dono intelectual e uso por empresas;
- padrão de certificação/selo;
- registro de metodologias;
- registro de frameworks;
- registro de certificações e selos;
- registro de uso por empresas/ventures/produtos;
- registro de licenças/cessões/autorização.

**Parecer:** cobertura inicial correta, mas Nilo requer expansão crítica por impacto em propriedade intelectual.

---

### 4.11 ET-19 — Júlio / AcadB

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-ACADB-001 a CP-ACADB-006 |
| Representatividade | Boa para política AcadB, produto educacional, matriz educacional, protocolo, checklist e registro |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Nilo, Sávio, Alice, Pedro, Pierre, Klaus, Noah, César e Pietro |
| Duplicidade | Risco alto com Nilo (método x curso), César (produto educacional vendável) e Sávio (plataforma AcadB) |
| Classificação normativa | Adequada |
| Relatório ET-19 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- política de certificação;
- política de revisão de conteúdo;
- matriz curso/trilha/programa/mentoria;
- matriz origem do conteúdo educacional;
- matriz critérios de certificação;
- matriz escada de produtos educacionais;
- protocolo de transformação de metodologia em produto educacional;
- protocolo de publicação na AcadB;
- protocolo de certificação;
- registro de curso;
- registro de trilha;
- registro de mentoria;
- registro de certificação;
- histórico de versões educacionais.

**Parecer:** cobertura inicial adequada; AcadB precisa expansão para certificação e plataforma.

---

### 4.12 ET-20 — César / StartyB

| Critério | Avaliação |
|---|---|
| Documento-mãe cadastrado | Sim |
| Itens atômicos criados | CP-STARTYB-001 a CP-STARTYB-006 |
| Representatividade | Boa para documento antes da execução, DOC-000/DOC-001, matriz de iniciativa, abertura de plano, checklist e decisão |
| Suficiência dos 6 itens | Parcial |
| Dependências | Bem orientada para Dante, Noah, Nilo, Sávio, Yuri, jurídico, Rodrigues/Kane e Pietro |
| Duplicidade | Risco alto com Dante (ideia), Noah (naming), Nilo (ativos intelectuais) e Sávio (produto digital x venture) |
| Classificação normativa | Adequada |
| Relatório ET-20 | Criado, mas sintético |

**Itens importantes que ficaram de fora:**

- padrão Fase 01 Triagem Única;
- padrão Fase 02 Novas Informações;
- checklist antes de preencher documento 03;
- matriz empresas B x ventures x métodos;
- matriz GO / GO com ajustes / FREEZE / NO GO;
- matriz ativo próprio x ativo usado;
- estrutura padrão de empresa B;
- estrutura padrão de venture;
- padrão organograma evolutivo V1/V2/V3;
- protocolo de passagem para Loze;
- protocolo de congelamento de iniciativa;
- protocolo de entrada de sócio/captação;
- registro de falas reais Rodrigues;
- registro de ativo usado;
- registro de uso de método do GrupoB.

**Parecer:** cobertura inicial boa; StartyB precisa expansão crítica para triagem, valuation, empresas B e ventures.

---

## 5. Achados transversais

### 5.1 Os 6 itens por divisão são suficientes?

**Resposta:** são suficientes para carga inicial operacional, mas não para cobertura completa.

O modelo atual criou um "núcleo mínimo" por divisão. Isso permite navegação e rastreabilidade inicial no módulo, mas cada documento contém dezenas de itens normativos adicionais.

### 5.2 Há duplicidade entre áreas?

Sim, mas a maioria está controlada por dependências. Pontos mais sensíveis:

| Duplicidade potencial | Áreas | Encaminhamento |
|---|---|---|
| UX de agente x comportamento de agente | Alice / Pierre | Alice define experiência; Pierre define funcionamento |
| Segurança técnica x implementação técnica | Pedro / Sávio | Pedro define requisito; Sávio implementa |
| Modelo IA x agente IA | Klaus / Pierre | Klaus recomenda modelo; Pierre define agente |
| Metodologia x curso | Nilo / Júlio | Nilo define método; Júlio transforma em educação |
| Nome x empresa/venture | Noah / César | Noah dá parecer; César estrutura negócio |
| Ideia x negócio | Dante / César | Dante explora; César decide negócio |
| Produto digital x venture | Sávio / César | Sávio define tecnologia; César define empresa/venture |
| Documentos oficiais x tarefas | Pietro / Yuri | Pietro canoniza; Yuri operacionaliza |

### 5.3 Há tipos normativos errados?

Não há erro crítico detectado na carga inicial. Contudo, alguns itens podem precisar refinamento em versões futuras:

- alguns "padrões" podem ser melhor tratados como política ou processo após revisão do conteúdo completo;
- alguns registros/evidências aparecem internamente como `registro`, por compatibilidade de tipo do módulo;
- algumas matrizes estão representadas como item normativo, enquanto o módulo ainda não possui entidade própria estruturada para matriz;
- alguns checklists estão duplicados como item normativo e como checklist operacional, aceitável nesta fase.

### 5.4 Relatórios ET-10 a ET-20 estão completos?

Estão completos como **relatórios operacionais sintéticos**, mas não como relatórios profundos equivalentes à ET-09B do Sávio. Recomenda-se aprofundamento futuro.

---

## 6. Recomendações

### 6.1 Próxima rodada de expansão normativa

Prioridade recomendada:

1. Pedro / Segurança;
2. Pietro / Governança;
3. César / StartyB;
4. Nilo / Metodologias;
5. Pierre / Agentes;
6. Júlio / AcadB;
7. Alice / UX;
8. Klaus / RAI;
9. Yuri / Processos;
10. Noah / Naming;
11. Dante / Ideias.

### 6.2 Evoluir modelo de dados

O módulo ainda representa matrizes e registros/evidências como standards normativos. Futuramente, recomenda-se criar entidades próprias:

- `matrices`;
- `evidenceRecords`;
- `dependencies`;
- `sourceDocuments`;
- `normativeItems` com `sourceDocumentId` explícito.

### 6.3 Expandir relatórios

Recomenda-se criar versões detalhadas dos relatórios ET-10 a ET-20 no mesmo nível de detalhe da ET-09B antes de canonicidade.

---

## 7. Validação final

| Item | Resultado |
|---|---|
| Documento-mãe por divisão | Validado operacionalmente |
| Itens atômicos por divisão | Validado como núcleo mínimo |
| Checklists | Validado como carga inicial |
| Matrizes | Validado como tipo normativo inicial |
| Registros/evidências | Validado como tipo `registro` compatível |
| Decisões/lacunas | Validadas como propostas |
| Dependências | Validadas com ressalvas de expansão |
| Duplicidades | Identificadas e controláveis |
| Classificação normativa | Sem erro crítico detectado |
| Relatórios ET-10 a ET-20 | Completos como sintéticos; aprofundamento recomendado |
| Canonicidade | Pendente de validação Pietro |

---

## 8. Conclusão

A Curadoria Geral das Divisões está operacionalmente concluída e com cobertura inicial suficiente para navegação, validação e governança no módulo Central de Padrões.

A auditoria confirma que a carga foi bem estruturada, sem marcação indevida de canonicidade final, mas recomenda expansão futura porque os documentos de origem são muito mais ricos do que os 6 itens iniciais por divisão.

**ET-21 — Auditoria de Cobertura da Curadoria Geral concluída.**

**Canonicidade final — pendente de validação Pietro.**
