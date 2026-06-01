# plano_modulo — sala-dev

## 1. visão do módulo

A Sala Dev é o cockpit operacional da esteira Dathex dentro do SagB.

Ela não substitui a esteira completa e não substitui o núcleo oficial de agentes.
Seu papel é organizar, coordenar e tornar auditável a execução de runs.

## 1.1 status executivo

- fase atual: `Fase 3 | Evolução Sala Dev v3.0.0 — 18 agentes oficiais`
- responsavel atual: `denise_bogado`
- progresso estimado: `Fase 1 documental da evolução 11 → 18 agentes iniciada`
- proximo marco: `Fase 2 técnica | tipos, mocks, hook central, componentes e sidebar plugável com 18 agentes`
- bloqueio principal: alinhar documentos, personas e prompts antes de alterar o motor visual/código da Sala Dev

## 1.2 changelog curto

### 31/05/2026

- iniciada evolução oficial da Sala Dev para `v3.0.0` com 18 agentes CA-01 a CA-18
- atualizado modelo metodológico de 11 agentes para 5 blocos operacionais
- definidos blocos: Entrada e Organização, Arquitetura e Documentação, Construção Técnica, Segurança e Qualidade, Deploy e Operação
- criadas personas dos novos agentes críticos: CA-08, CA-09, CA-11, CA-12, CA-13, CA-15 e CA-17
- criados prompts de ativação dos novos agentes
- `AGENTS.md`, `PROJECT_BOOTSTRAP.md` e `CONTEXT.md` atualizados para Sala Dev v3.0.0
- implementada Fase 2 técnica inicial: constantes dos 18 agentes, `BlockEntity`, snapshot com `blocks`, mock v3, store com avanço de bloco, hook com seleção/orquestração de blocos, visual `BlockFlowVisual`, header `V3` e integração no fluxo
- build de produção validado com sucesso via `npm run build`
- criado plano arquitetural para transformar a Sala Dev em AI Studio de programação total: `plans/sala_dev_ai_studio_programacao_total.md`
- decisão arquitetural: Sala Dev ainda não substitui VS Code/Roo Code porque a ponte técnica atual bloqueia escrita de arquivos, comandos, sync e deploy por segurança
- próximo caminho recomendado: implementar primeiro Studio Mock Interativo antes de liberar filesystem/comandos reais

### 01/05/2026

- estruturado plano canônico do módulo em 9 etapas
- definidos critérios de aceitação e fora de escopo por etapa
- adicionada camada de leitura rápida com status executivo
- concluída etapa `02/09 ET | Modularização oficial`
- concluída etapa `03/09 ET | Contrato de domínio mínimo`
- consolidada etapa `04/09 ET | Layout base oficial com 3 painéis`
- iniciada e consolidada etapa `05/09 ET | Macrocamadas da esteira` (modo compacto + detalhado)
- iniciada e consolidada etapa `06/09 ET | Handoffs e gates operacionais` (cards, detalhe e ações simuladas)
- iniciada e consolidada etapa `07/09 ET | Agentes convocados, disponíveis e recomendados` (grupos operacionais + ações simuladas)
- iniciada e consolidada etapa `08/09 ET | Artefatos, logs, versões e auditoria` (trilha de auditoria formal em modo local/mock)
- iniciada e consolidada etapa `09/09 ET | Supabase, núcleo de agentes e preparação VS Code / Roo Code` (modelagem, contratos e camada de transição)
- iniciada e consolidada etapa `10/10 ET | Consolidação técnica e plano da Fase 2` (fechamento da Fase 1 sem novas features)

## 6.1 etapa 10 — consolidação técnica e plano da fase 2

**objetivo**
Fechar a Fase 1 (ET01–ET09), validar consistência arquitetural do módulo e definir sequência controlada da Fase 2 sem atropelar Supabase, agentes reais ou VS Code/Roo.

**critérios de aceitação**
- trilha ET01–ET09 consolidada em documentação oficial
- guardrails da Fase 2 definidos (sem integração real antecipada)
- backlog de ativação incremental priorizado por risco e dependência
- confirmação de manutenção do modo mock como fallback operacional

**fora de escopo**
- construção de novas features funcionais
- integração real Supabase
- integração real com núcleo oficial de agentes
- integração real VS Code/Roo

## 2. precedência canônica obrigatória

Este planejamento segue a norma canônica:

- `docs/governanca_sagb/padrao_unificado_governanca.md`

Em caso de conflito, a norma canônica prevalece.

## 3. decisões oficiais

1. A Sala Dev não é a esteira inteira.
2. A Sala Dev é o cockpit visual e operacional da esteira.
3. O núcleo de agentes do SagB é a fonte oficial dos agentes.
4. A Sala Dev convoca, organiza e exibe agentes em uma run.
5. Handoff é a unidade operacional central.
6. Gate é o controle obrigatório de avanço.
7. Artefatos, logs, versões e auditoria são rastro obrigatório.
8. VS Code / Roo Code ficam como camada futura, sem integração real nesta fase.
9. Supabase entra após base modular e contrato de domínio mínimo.
10. A Sala Dev v3.0.0 passa a operar com 18 agentes oficiais CA-01 a CA-18.
11. O modelo de 11 agentes permanece como histórico, mas não é mais a referência operacional principal.
12. A organização oficial passa de 6 macrocamadas visuais para 5 blocos operacionais multiagentes.

## 4. estado atual

- módulo `sala-dev` existente em `src/modules/sala-dev`
- rota modular ativa via `manifest.ts` + `routes.tsx`
- compatibilidade com tela legado por wrapper
- implementação principal ainda acoplada a `components/DevRoomView.tsx` e `components/dev-room/*`
- predominância de dados mockados

## 5. estado alvo

Consolidar a Sala Dev como módulo plugável completo em `src/modules/sala-dev` com domínio explícito, rastreabilidade operacional e base preparada para persistência futura.

## 6. trilha oficial em 9 etapas

### etapa 1 — auditoria do estado atual

**objetivo**
Mapear estado real antes de mudanças.

**critérios de aceitação**
- identificar arquivos, componentes, rotas e dados mockados
- mapear dependências e pontos frágeis
- registrar reaproveitamento possível

**fora de escopo**
- implementação funcional

**status**
Concluída.

### etapa 2 — modularização oficial

**objetivo**
Levar implementação real para `src/modules/sala-dev`.

**critérios de aceitação**
- internalizar componentes do módulo
- internalizar tipos
- isolar mocks em `services`
- criar `hooks` e `store` mínimos
- manter visual atual funcionando
- reduzir acoplamento com `components/DevRoomView.tsx` e `components/dev-room/*`

**fora de escopo**
- redesign de interface
- Supabase

### etapa 3 — contrato de domínio mínimo

**objetivo**
Definir base de domínio antes de expansão visual e banco.

**critérios de aceitação**
- tipos e relações mínimas para: run, macrocamada, handoff, gate, artefato, agente convocado/disponível/recomendado, status, decisão e risco
- estados padronizados
- separação clara entre domínio, mock e UI

**fora de escopo**
- persistência real

### etapa 4 — layout base com 3 painéis

**objetivo**
Consolidar layout oficial:
1. Centro de Comando
2. Esteira e Fluxo
3. Artefatos e Auditoria

**critérios de aceitação**
- leitura executiva da run ativa
- etapa atual e agente responsável visíveis
- área de artefatos, logs e auditoria visível

**fora de escopo**
- lógica avançada de recomendação

### etapa 5 — macrocamadas da esteira

**objetivo**
Implementar as 6 macrocamadas:
1. Escopo e Requisitos
2. Arquitetura
3. Construção
4. Revisão e Segurança
5. Deploy e Observabilidade
6. Auditoria Final

**critérios de aceitação**
- status por macrocamada
- progresso e etapa ativa
- modo compacto e modo detalhado

**fora de escopo**
- integração externa de execução técnica

### etapa 6 — handoffs e gates operacionais

**objetivo**
Tornar fluxo rastreável.

**critérios de aceitação**
- handoff com origem, destino, motivo, input, output esperado, artefato vinculado, status e gate relacionado
- gate com nome, etapa, checklist, status, aprovador/agente, riscos e decisão
- estados mínimos: `pending`, `running`, `review`, `approved`, `rejected`, `blocked`, `completed`

**fora de escopo**
- automação de aprovação externa

### etapa 7 — agentes convocados, disponíveis e recomendados

**objetivo**
Representar inteligência operacional da run.

**critérios de aceitação**
- separação entre convocados, disponíveis e recomendados
- recomendação por etapa, risco, complexidade e necessidade técnica
- sem transformar Sala Dev em fonte oficial de agentes

**fora de escopo**
- cadastro oficial de agentes

### etapa 8 — artefatos, logs, versões e auditoria

**objetivo**
Criar rastro formal da execução.

**critérios de aceitação**
- trilha de artefatos, versões, logs, decisões, checklists e parecer final
- histórico da run com vínculo agente-etapa-artefato-gate

**fora de escopo**
- analytics avançado

### etapa 9 — Supabase, núcleo de agentes e preparação VS Code / Roo Code

**objetivo**
Preparar conexão com dados reais e integração futura.

**critérios de aceitação**
- modelagem inicial Supabase
- relação com agentes oficiais do SagB
- preparação arquitetural para VS Code / Roo Code
- sem integração real com VS Code / Roo Code nesta etapa

**fora de escopo**
- execução técnica remota real por VS Code / Roo Code

## 7. riscos arquiteturais

- acoplamento legado prolongado
- duplicação de responsabilidade entre telas paralelas
- expansão de mock sem contrato de domínio
- rastreabilidade incompleta de handoff/gate

## 8. dependências futuras

- contrato estável com núcleo de agentes do SagB
- modelagem de dados para Supabase
- política de auditoria por run

## 9. relação com núcleo de agentes

A Sala Dev consome agentes oficiais do SagB.
Não cria fonte alternativa de verdade para cadastro de agentes.

## 10. relação futura com VS Code / Roo Code

VS Code / Roo Code permanecem como camada futura de execução técnica.
Nesta fase, apenas preparação arquitetural e contratos.

## 11. próxima etapa recomendada

`Fase 2 | ativação incremental controlada (persistência real, agentes oficiais e execução técnica)`

## 11.1 fase 2 — onda 1 (planejamento técnico)

**objetivo da onda 1**
Ativar persistência real de forma incremental no Supabase mantendo fallback mock obrigatório.

**ordem recomendada de entrada**
1. etapa A — `dev_runs` + `dev_execution_environments`
2. etapa B — `dev_run_macro_layers`
3. etapa C — `dev_handoffs` + `dev_gates`
4. etapa D — `dev_artifacts` + `dev_artifact_versions` + `dev_logs` + `dev_decisions` + `dev_gate_checklists` + `dev_final_audits`

**escopo mínimo da primeira implementação real**
- leitura/escrita de `dev_runs`
- leitura/escrita de `dev_run_macro_layers`
- leitura de `dev_execution_environments` como referência de status
- sem migração de agentes oficiais nesta onda

**fallback mock obrigatório**
- manter `SalaDevMockRepository` ativo como provider padrão de segurança
- alternância por flag de execução em adapter de repositório
- rollback imediato para mock em caso de falha de conexão/mapeamento

**fora de escopo da onda 1**
- integração real com núcleo oficial de agentes
- integração real VS Code/Roo
- migração completa de histórico legado

## 11.2 fase 2 — ativação real controlada

**objetivo da fase 2**
Iniciar a transição gradual da Sala Dev de mock para operação real sem perder fallback, estabilidade e rastreabilidade.

### onda 1 — persistência real no supabase

**objetivo**
Começar leitura/escrita real da Sala Dev no Supabase com fallback mock obrigatório.

**etapas da onda 1**
1. **onda 1A — provider supabase mínimo**
   - `dev_runs`
   - `dev_run_macro_layers`
   - `dev_execution_environments`
   - feature flag/provider
   - fallback mock obrigatório
2. **onda 1B — handoffs e gates reais**
   - `dev_handoffs`
   - `dev_gates`
   - persistência gradual
   - fallback mock
3. **onda 1C — artefatos, logs e decisões reais**
   - `dev_artifacts`
   - `dev_artifact_versions`
   - `dev_logs`
   - `dev_decisions`
4. **onda 1D — checklists e auditoria final real**
   - `dev_gate_checklists`
   - `dev_final_audits`
   - parecer final real da run

### onda 2 — núcleo oficial de agentes

**objetivo**
Substituir gradualmente agentes mockados por referência aos agentes oficiais do núcleo do SagB.

**etapas da onda 2**
5. **onda 2A — leitura do catálogo oficial de agentes**
   - consumir agentes oficiais
   - manter mocks como fallback
   - preservar separação entre núcleo e Sala Dev
6. **onda 2B — convocação real de agentes para run**
   - `dev_run_agents`
   - agente convocado
   - agente recomendado
   - agente disponível
   - vínculo com macrocamada
7. **onda 2C — snapshot de DNA, versão e função na run**
   - `official_agent_id`
   - `dna_version_id`
   - papel na run
   - motivo de convocação
   - rastreabilidade histórica

### onda 3 — execução técnica VS Code/Roo

**objetivo**
Preparar camada operacional entre Sala Dev e execução técnica sem automação perigosa ou controle remoto prematuro.

**etapas da onda 3**
8. **onda 3A — ambiente técnico e status operacional**
   - ambiente configurado
   - status
   - projeto/repositório relacionado
   - referência ao workspace técnico
9. **onda 3B — exportação de pacote/tarefa técnica**
   - pacote de artefatos
   - documentação para execução
   - tarefa técnica para VS Code/Roo
   - sem execução remota automática
10. **onda 3C — ponte futura VS Code/Roo**
   - preparar contrato de integração
   - limites de segurança
   - status de sincronização
   - sem controle remoto perigoso nesta fase

### regras oficiais da fase 2
1. Mock continua como fallback obrigatório.
2. Supabase entra progressivamente, não tudo de uma vez.
3. Nenhuma integração real com VS Code/Roo sem contrato de segurança.
4. Sala Dev continua sendo cockpit, não executor remoto autônomo.
5. Núcleo de agentes continua sendo fonte oficial dos agentes.
6. Sala Dev apenas referencia e convoca agentes.
7. Toda etapa deve atualizar documentação.
8. Toda implementação deve preservar rollback para mock quando aplicável.
9. Nenhuma etapa deve remover mocks antes de validação real.
10. Toda persistência deve respeitar o contrato de domínio e os mappers existentes.

## 12. versionamento

### v3.0.0 - 31/05/2026

- Evolução metodológica da Sala Dev de 11 para 18 agentes oficiais iniciada.
- `AGENTS.md` reestruturado para CA-01 a CA-18 com blocos, missões, inputs, outputs, limites e entregáveis.
- `PROJECT_BOOTSTRAP.md` atualizado para refletir esteira de 5 blocos e 18 agentes.
- `CONTEXT.md` atualizado com foco atual da Fase 1 documental da v3.0.0.
- Criadas personas dos novos agentes: CA-08 Segurança Técnica, CA-09 DevOps/Deploy, CA-11 Logs e Observabilidade, CA-12 Versionamento Técnico, CA-13 Catálogo Técnico, CA-15 Revisor de Código e CA-17 Operação e Runbooks.
- Criados prompts de ativação dos novos agentes em `agent/prompts/`.
- Tipos, mocks, hook central, store e componentes principais atualizados para refletir 18 agentes no frontend.
- Criado `salaDev.agentConstants.ts` com catálogo CA-01 a CA-18 e `BLOCK_CONFIG` dos 5 blocos.
- Criado `BlockFlowVisual.tsx` para exibir a esteira v3 por 5 blocos operacionais.
- Build de produção validado com sucesso após a implementação técnica inicial.
- Próxima etapa técnica: refinar sidebar plugável, persistência real de blocks no Supabase e ações interativas avançadas de avanço/aprovação por bloco.

### Caminho AI Studio de Programação Total

- Documento-base criado em `plans/sala_dev_ai_studio_programacao_total.md`.
- Prioridade 1: criar aba Studio dentro da Sala Dev com chat operacional, plano, arquivos impactados, diff simulado, aprovações, terminal simulado e preview placeholder.
- Prioridade 2: backend mínimo local com sandbox para leitura/escrita controlada.
- Prioridade 3: agente programador real com geração de patches e revisão CA-10/CA-15/CA-08.
- Prioridade 4: persistência Supabase completa para sessões, mensagens, patches, comandos e logs.
- Prioridade 5: preview real, terminal seguro e deploy aprovado.

### v0.9.0 - 01/05/2026

- etapa `10/10 ET` adicionada para consolidação técnica da Fase 1
- status executivo atualizado para fechamento ET01–ET09 sem novas implementações
- plano da Fase 2 estruturado com guardrails para ativação incremental

### v0.9.1 - 01/05/2026

- lapidação UX V1 aplicada para melhorar clareza antes da Fase 2
- status/chips padronizados em PT-BR para leitura operacional
- reforço visual de modo simulado/mockado em ações de comando

### v0.9.2 - 01/05/2026

- planejamento técnico da Onda 1 da Fase 2 registrado
- ordem incremental de persistência Supabase formalizada
- estratégia de fallback mock e rollback documentada

### v1.0.0 - 01/05/2026

- Fase 2 registrada oficialmente no módulo com 3 ondas e 10 etapas
- regras oficiais de ativação real controlada documentadas
- transição mock → real estruturada sem implementação funcional nesta atualização

### v1.1.0 - 01/05/2026

- Onda 1A iniciada com provider Supabase mínimo controlado por feature flag `VITE_SALA_DEV_DATA_PROVIDER`.
- Escopo aplicado apenas para `dev_runs`, `dev_run_macro_layers` e leitura de `dev_execution_environments`.
- Fallback mock obrigatório implementado para ausência de env, falhas de conexão, mapeamento e bootstrap inicial.

### v1.2.0 - 01/05/2026

- Onda 1B iniciada com persistência incremental de `dev_handoffs` e `dev_gates` no provider Supabase.
- Mapper evoluído para conversão domínio ↔ persistência de handoffs e gates com campos de status, decisão e datas operacionais.
- Contrato de repositório ampliado para persistir `run`, `macroLayers`, `handoffs` e `gates` mantendo fallback mock obrigatório.

### v1.3.0 - 01/05/2026

- Onda 1C iniciada com persistência incremental de `dev_artifacts`, `dev_artifact_versions`, `dev_logs` e `dev_decisions` no provider Supabase.
- Contrato do repositório ampliado para incluir trilha de artefatos, versões, logs e decisões sem quebrar compatibilidade com fallback mock.
- Mapper consolidado com conversões row → domínio para leitura real e domínio → row para escrita incremental dessas entidades.

### v1.4.0 - 01/05/2026

- Onda 1D iniciada com persistência incremental de `dev_gate_checklists` e `dev_final_audits` no provider Supabase.
- Contrato do repositório ampliado para incluir checklist e auditoria final junto do estado persistido da run.
- Fechamento oficial da Onda 1 registrado (1A, 1B, 1C, 1D) com fallback mock obrigatório preservado.

### v1.5.0 - 01/05/2026

- Onda 2A iniciada com leitura do catálogo oficial via props (`agents: Agent[]`) no fluxo da Sala Dev.
- Encadeamento de props formalizado em `App.tsx -> SalaDevPage -> DevRoomView -> useSalaDevRun`, sem criação de novos listeners/queries no módulo.
- `domain.availableAgents` passa a ser resolvido por adapter (`salaDevAgentCatalogAdapter`) com fallback mock obrigatório quando lista oficial estiver indisponível/vazia.

### v2.0.0 - 02/05/2026

- Onda 3B iniciada com contrato de pacote técnico auditável (`TechnicalExecutionPackage`) para transferência controlada da run.
- Service dedicado de exportação técnica criado com sanitização de dados sensíveis e guardrails explícitos de segurança.
- Exportação representada como artefato interno + log auditável da Sala Dev, sem abrir VS Code/Roo e sem execução remota.

### v2.1.0 - 02/05/2026

- Onda 3C iniciada com contrato de ponte futura (`TechnicalBridgeContract`) entre Sala Dev e VS Code/Roo em modo planejado/não conectado.
- Capability matrix formalizada com deny-by-default e aprovação humana obrigatória para capacidades sensíveis.
- Execução remota mantida desabilitada por contrato, encerrando a Fase 2 com segurança e rastreabilidade.

### v2.2.0 - 02/05/2026

- Consolidação técnica da Fase 2 registrada: Ondas 1, 2 e 3 concluídas com progressão controlada, reversível e com fallback mock ativo.
- Diretriz inicial da Fase 3 formalizada com foco em hardening: testes de contrato, validação de trilhas auditáveis e robustez operacional antes de qualquer integração ativa.
- Confirmado escopo de segurança da Fase 3: Sala Dev permanece cockpit, VS Code/Roo seguem sem execução real até nova governança explícita.

### v2.3.0 - 02/05/2026

- UX Core de entrada implementado com jornada explícita: `Novo Projeto -> Gerar briefing inicial -> Revisar briefing -> Iniciar esteira`.
- Nova superfície de entrada criada em `NewProjectEntryPanel.tsx` com estado local/mockado e sem alteração de contratos de persistência.
- `DevRoomView.tsx` passou a exibir os 3 painéis técnicos apenas após confirmação humana de início de esteira (`pipelineStarted`).
- `useSalaDevRun.ts` ampliado com estado de entrada (`projectEntryForm`, `generatedBriefing`, `pipelineStarted`) preservando fallback mock e provider Supabase sem integração externa.
- Ação de exportação técnica rebaixada para contexto avançado em `CommandCenterPanel.tsx`, removendo protagonismo no início da jornada.

### v2.4.0 - 02/05/2026

- Ação explícita de `Novo Projeto` adicionada no header da Sala Dev para reiniciar a jornada sem sair do módulo.
- Reset controlado da entrada definido no hook: limpeza de `pipelineStarted`, `generatedBriefing` e `projectEntryForm`.
- Retorno imediato para a tela “Qual projeto você quer criar?” com formulário limpo e briefing anterior removido.
- Fluxo técnico preservado: cockpit só reaparece após novo ciclo `Gerar briefing inicial -> Iniciar esteira de desenvolvimento`.

### v2.5.0 - 02/05/2026

- Lapidação de copy UX V1 aplicada na entrada para reduzir linguagem interna/técnica sem alterar fluxo ou arquitetura.
- Cabeçalho da entrada simplificado para `Novo Projeto` e inclusão de orientação de jornada `1. Ideia → 2. Briefing → 3. Esteira`.
- Campo de restrições simplificado para `Alguma limitação importante?` com exemplos mais humanos de preenchimento.
- Subtítulo do header técnico simplificado para `Painel técnico do projeto`.
- Bloco `Briefing inicial gerado` recebeu reforço de contraste visual para sinalizar avanço de fase sem redesign estrutural.

### v0.8.0 - 01/05/2026

- status executivo atualizado para etapa `09/09 ET`
- modelagem inicial de persistência e adaptação de repository/mappers registrada
- próxima fase indicada como ativação incremental de integrações reais

### v0.7.0 - 01/05/2026

- status executivo atualizado para etapa `08/09 ET`
- próxima etapa recomendada atualizada para `09/09 ET`
- registro de consolidação da trilha de artefatos, versões, logs, decisões, checklists e auditoria final inicial

### v0.6.0 - 01/05/2026

- status executivo atualizado para etapa `07/09 ET`
- próxima etapa recomendada atualizada para `08/09 ET`
- registro de consolidação da camada de agentes (convocados, disponíveis, recomendados)

### v0.5.0 - 01/05/2026

- status executivo atualizado para etapa `06/09 ET`
- próximas ações do plano atualizadas para etapa `07/09 ET`
- registro de consolidação de handoffs e gates operacionais com ações simuladas

### v0.4.0 - 01/05/2026

- status executivo atualizado para etapa `05/09 ET`
- trilha evoluída com representação operacional das 6 macrocamadas
- próxima etapa recomendada atualizada para `06/09 ET`

### v0.3.0 - 01/05/2026

- status executivo atualizado para refletir avanço até a etapa 04/09
- próxima etapa recomendada atualizada para `05/09 ET`
- changelog curto do plano atualizado com marcos 02/09, 03/09 e 04/09

### v0.2.0 - 01/05/2026

- planejamento oficial reestruturado no padrão canônico
- trilha de evolução consolidada em 9 etapas
- critérios de aceitação e fora de escopo definidos por etapa
