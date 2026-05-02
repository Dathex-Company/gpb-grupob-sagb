# decisions — sala-dev

## 2026-04-30
- Decidido tratar `sala-dev` como módulo oficial prioritário de alta urgência por possuir estrutura operacional relevante, mas sem contrato plugável completo.
- Mantida compatibilidade inicial com `components/DevRoomView.tsx` por meio de wrapper em `pages/SalaDevPage.tsx`.

## 2026-05-01
- Atualizado `plano_modulo.md` como guia canônico de governança com as 9 etapas definidas para migração segura.
- Adotado `DevRoomView.tsx` modularizado com cópia direta preservando equivalência visual (mock-first), desconectado de `App.tsx` para garantir segurança no refatoramento isolado.
- Adotada migração bottom-up: interface → store local simulada → repositório → integração (Supabase).

## 2026-05-01 — etapa 03/09 et
- Definido contrato de domínio estrito (`types/salaDev.domain.ts`) antes da UI para garantir que os 3 painéis leiam de uma estrutura pronta para Supabase/VSCode-Roo futuramente.
- Consolidada máquina de estados de domínios em `types/salaDev.status.ts` reduzindo risco de strings soltas.
- Adotado padrão Snapshot no Store local para representar de forma previsível o estado transacional completo da sala.

## 2026-05-01 — etapa 04/09 et
- Aprovada estrutura de layout principal com 3 painéis (Centro de Comando, Esteira e Fluxo, Artefatos e Auditoria).
- Decidido consumir dados puramente via Snapshot de Domínio (`domain` do store), desativando mock de dados não canônicos na camada de visualização.

## 2026-05-01 — etapa 05/09 et
- Definida Macrocamada como unidade primária de navegação na Sala Dev: o status do projeto e as próximas ações recomendadas são lidos com base no `currentMacroLayerId` no Snapshot de Domínio.
- Aprovada representação visual compacta (cards na timeline) e detalhada (drawer lateral) da macrocamada para melhor controle de densidade de informação.

## 2026-05-01 — etapa 06/09 et
- Aprovada separação conceitual entre "Handoff" (passagem de bastão entre agentes) e "Gate" (ponto de controle e decisão estrutural).
- Implementada manipulação local e simulada de status (`pending`, `completed`, `review`, `approved`) no store e persistência simulada sem acoplar backend na UI.
- Definido que aprovação de Gate bloqueia/libera avanço de macrocamada na esteira oficial.

## 2026-05-01 — etapa 07/09 et
- Aprovada representação de agentes dividida em três frentes estritas: Convocados (na run), Disponíveis (no catálogo) e Recomendados (via IA/regras de negócio).
- Definido que a Sala Dev deve referenciar, mas nunca ser a fonte primária de criação do "DNA" do agente (campo `isOfficialAgentReference` para auditoria futura com núcleo de agentes).
- Mantida independência da camada mock local, isolando testes simulados no `AgentGroupPanel` de possíveis quebras na API de agentes.

## 2026-05-01 — etapa 08/09 et
- Aprovada integração das entidades finais de auditoria no contrato de domínio: Versões de Artefato, Logs de Execução, Decisões, Checklists de Gate e Auditoria Final.
- Definida a hierarquia de rastreabilidade: Artefatos geram Versões; Gates exigem Decisões e Checklists; Runs geram Logs e uma Auditoria Final (parecer consolidado).
- Decidido que a visualização será centralizada no `WorkspacePanel` (Artefatos e Auditoria), com subpainéis organizados por abas focadas em uma única entidade selecionada.

## 2026-05-01 — etapa 09/09 et
- Aprovada modelagem de persistência (`DevRunRow`, etc) em `salaDev.persistence.ts` paralela ao domínio para garantir isolamento de contratos.
- Definida adoção do padrão Repository + Adapter (`ISalaDevRepository`, `SalaDevMockRepository`) para garantir inversão de controle na fonte de dados (mock vs real).
- Aprovada criação de estado técnico de ambiente (`not_connected` até `failed`) para mapear prontidão do VS Code / Roo Code sem iniciar comunicação remota nesta fase.
- Confirmado fechamento da Fase 1 restrito a Mock, preparando estrutura pronta para recebimento incremental do Supabase na Fase 2.

## 2026-05-01 — etapa 10/10 et
- Oficializado o encerramento da Fase 1 (estruturação técnica e mock) da Sala Dev sem migração direta de lógica complexa de runtime no momento.
- Aprovado roadmap da Fase 2 (ativação controlada), limitando integrações a 3 ondas obrigatórias (1: persistência; 2: agentes oficiais; 3: controle de execução) para mitigar riscos de quebra.
- Decidido que o `SalaDevMockRepository` não será deletado, operando permanentemente como fallback de segurança.

## 2026-05-01 — UX V1 (lapidação de clareza)
- Aprovado dicionário visual único de status em PT-BR para reduzir inconsistência semântica entre domínio interno e leitura de interface.
- Formalizado aviso explícito de `modo simulado/mockado` no Centro de Comando para evitar falsa percepção de persistência real.
- Definida ordenação previsível para leitura operacional (`versões` e `decisões` mais recentes primeiro) sem alterar o contrato de domínio.

## 2026-05-01 — fase 2, onda 1 (planejamento)
- Definida entrada incremental obrigatória com fallback mock: `dev_runs`/`dev_execution_environments` → `dev_run_macro_layers` → `dev_handoffs`/`dev_gates` → trilha de auditoria.
- Confirmado que a primeira implementação real deve persistir run + macrocamadas antes de handoffs/gates/artefatos para reduzir risco de inconsistência relacional.
- Aprovado uso de feature flag no adapter de repositório para alternar provider (`mock` ou `supabase`) com rollback imediato para mock em falha.
- Mantido fora de escopo da Onda 1: integração real com núcleo oficial de agentes e execução VS Code/Roo.

## 2026-05-01 — fase 2 (registro oficial)
- Fase 2 oficializada no módulo em 3 ondas e 10 etapas para ativação real controlada.
- Registrado que nenhuma onda pode remover fallback mock antes de validação real de estabilidade e rollback.
- Confirmada precedência de segurança: sem integração real VS Code/Roo sem contrato e limites operacionais explícitos.
- Reforçada governança de responsabilidade: núcleo de agentes segue como fonte oficial; Sala Dev apenas referencia e convoca.

## 2026-05-01 — fase 2, onda 1A (provider supabase mínimo)
- Aprovado provider com seleção por feature flag `VITE_SALA_DEV_DATA_PROVIDER` com padrão `mock`.
- Formalizado fallback automático para mock em quatro cenários: env ausente, falha de conexão, falha de mapeamento e falha no bootstrap inicial.
- Delimitado escopo técnico da Onda 1A para apenas `dev_runs`, `dev_run_macro_layers` e leitura de `dev_execution_environments`.
- Mantido fora de escopo: agentes reais, handoffs, gates, artefatos, logs, decisões, checklists, auditoria final e integração VS Code/Roo.

## 2026-05-01 — fase 2, onda 1B (handoffs e gates reais)
- Aprovada extensão incremental do provider Supabase para leitura e gravação de `dev_handoffs` e `dev_gates` sem alterar o padrão visual da Sala Dev.
- Confirmado ajuste de contrato do repositório para persistir `run`, `macroLayers`, `handoffs` e `gates` de forma unificada, mantendo fallback mock obrigatório.
- Formalizada evolução do mapper para conversões domínio ↔ persistência de handoffs e gates, incluindo campos de rastreabilidade temporal e decisão operacional.
- Mantido fora de escopo da Onda 1B: `dev_run_agents`, `dev_artifacts`, `dev_artifact_versions`, `dev_logs`, `dev_decisions`, `dev_gate_checklists`, `dev_final_audits`, núcleo oficial de agentes e VS Code/Roo.

## 2026-05-01 — fase 2, onda 1C (artefatos, versões, logs e decisões reais)
- Aprovada extensão incremental do provider Supabase para leitura e gravação de `dev_artifacts`, `dev_artifact_versions`, `dev_logs` e `dev_decisions`.
- Contrato de persistência do repositório ampliado para incluir artefatos, versões, logs e decisões mantendo `ISalaDevRepository` como contrato canônico.
- Mapper consolidado com conversões row → domínio para artefatos, versões, logs e decisões, preservando equivalência semântica com o contrato atual.
- Mantido fallback mock obrigatório e padrão `mock`, sem mudanças visuais e sem integração com núcleo oficial de agentes/VS Code/Roo.

## 2026-05-01 — fase 2, onda 1D (checklists e auditoria final reais)
- Aprovada extensão incremental do provider Supabase para leitura e gravação de `dev_gate_checklists` e `dev_final_audits`.
- Formalizada ampliação do contrato `ISalaDevRepository` para persistir checklist e auditoria final junto ao estado da run, mantendo fallback mock obrigatório.
- Mapper consolidado com conversão `finalAudit row -> domínio`, além de reutilização do mapeamento de checklists já existente.
- Registrado fechamento oficial da Onda 1 (A→D) com cobertura de persistência real incremental e mock como padrão de segurança.

## 2026-05-01 — fase 2, onda 2 (planejamento do núcleo oficial de agentes)
- Aprovada arquitetura de leitura state-driven para o catálogo oficial de agentes: a Sala Dev consumirá o state da Store Principal (`App.tsx` / `dbAgents` hidratados) repassado como props, em vez de assinar diretamente o banco, garantindo que o catálogo de agentes na Sala Dev sempre reflita a fonte da verdade da plataforma.
- Aprovada estruturação de `dev_run_agents` em 3 camadas conceituais durante a run:
  1.  **Recomendado**: Agentes sugeridos por IA/regras com base no escopo e riscos da macrocamada ativa (persiste como registro de apoio).
  2.  **Convocado/Pendente**: Agente associado à run, aguardando aprovação humana ou start do step.
  3.  **Ativo/Engajado**: Agente efetivamente gerando artefatos, logando decisões e consumindo context da run.
- Formalizada persistência de "Snapshot Histórico" (Onda 2C) na tabela `dev_run_agents`, imutável após a run:
  - `official_agent_id` (UUID oficial do Supabase).
  - `dna_version_id` e `model_provider` exatos usados no instante da convocação, para fins de auditoria de qualidade.
  - `role_in_run` e escopo, blindando contra alterações futuras no perfil oficial do agente.
- Aprovada estratégia de Fallback Híbrido: caso a assinatura oficial (`agents` do Supabase via prop) falhe ou venha vazia, a Sala Dev deve recorrer à sua base local em `SalaDevMockRepository`, garantindo resiliência total para testes de UI e offline.

## 2026-05-01 — fase 2, onda 2A (leitura do catálogo oficial via props)
- Aprovada injeção explícita de `agents: Agent[]` no fluxo de render da Sala Dev, com repasse controlado `App.tsx -> SalaDevPage -> DevRoomView -> useSalaDevRun`, sem criação de novos listeners/queries no módulo.
- Aprovada substituição apenas do bloco `domain.availableAgents` na carga inicial da run, usando `salaDevAgentCatalogAdapter.adaptFromOfficial(...)` e preservando o restante do payload do repositório (mock/supabase) sem ruptura de contrato.
- Confirmada manutenção do fallback mock obrigatório quando a lista oficial vier ausente, inválida ou sem agentes elegíveis, garantindo resiliência e continuidade operacional da UI.

## 2026-05-02 — fase 2, onda 3B (exportação de pacote técnico auditável)
- Aprovado contrato `TechnicalExecutionPackage` para transferência técnica controlada da run com checksum lógico, instruções humanas e guardrails explícitos.
- Aprovada criação de service dedicado de exportação com sanitização de dados sensíveis (sem prompt completo, sem memória privada, sem segredos/tokens/credenciais).
- Aprovado registro auditável da exportação como artefato interno + log operacional, sem abrir VS Code/Roo e sem automação remota.

## 2026-05-02 — fase 2, onda 3C (contrato de ponte futura VS Code/Roo)
- Aprovado contrato `TechnicalBridgeContract` com handshake, estados de sincronização e trilha de aprovação humana obrigatória.
- Definida capability matrix inicial com política **deny-by-default**: apenas capacidades explícitas de leitura/exportação manual são permitidas nesta fase.
- Capacidades sensíveis (`execute_command`, `open_ide`, `sync_repository`, `write_files_directly`, `access_secrets`, `read_private_memory`, `modify_agent_dna`, `deploy_automatically`) permanecem negadas por padrão.
- Confirmado que a ponte permanece em modo planejado/não conectada, com execução remota desabilitada e sem integração real com VS Code/Roo.
- Encerramento de Fase 2 aprovado com trilha completa das Ondas 1, 2 e 3 em conformidade com governança e segurança.

## 2026-05-02 — consolidação técnica da fase 2 e diretriz da fase 3
- Consolidado que a Sala Dev permanece cockpit de governança/auditoria, sem papel de executor remoto.
- Confirmado que VS Code/Roo continuam apenas como destino técnico futuro, sem integração real, sem comandos externos e com `deny-by-default` preservado.
- Confirmado que o núcleo oficial de agentes permanece fonte oficial; Sala Dev apenas referencia, convoca e audita participação em run.
- Validada diretriz para Fase 3: priorizar robustez operacional (testes, validação de contratos, trilha auditável e hardening de segurança) antes de qualquer integração ativa.

## 2026-05-02 — ux core de entrada (novo projeto + briefing inicial)
- Aprovado novo ponto de entrada da Sala Dev orientado a jornada: primeiro captura de projeto/ideia, depois geração de briefing e somente então abertura da esteira técnica.
- Definido gating explícito de UX com estado local (`pipelineStarted`) para ocultar os 3 painéis técnicos até confirmação humana de "Iniciar esteira de desenvolvimento".
- Aprovado que a geração de briefing inicial é local/mockada e não altera contratos de persistência, mantendo fallback mock e provider Supabase sem mudanças estruturais.
- Ação de exportação técnica reclassificada como avançada (não primária), preservando governança de segurança e reduzindo ambiguidade no primeiro passo do usuário.

## 2026-05-02 — ux core (ação novo projeto)
- Aprovada inclusão de ação explícita de `Novo Projeto` no header da Sala Dev para reinício controlado da jornada sem depender de navegação externa.
- Definido reset local obrigatório de `pipelineStarted`, `generatedBriefing` e `projectEntryForm` para evitar persistência visual indevida de contexto anterior.
- Confirmado que o reset não altera contratos de domínio/persistência e não aciona integrações externas, mantendo escopo estritamente de UX da jornada.

## 2026-05-02 — ux copy v1 (linguagem de entrada)
- Aprovada simplificação de linguagem na entrada para reduzir termos internos/técnicos sem alterar fluxo: cabeçalho `Novo Projeto` e orientação direta de preenchimento.
- Aprovada reformulação do campo de restrições para abordagem mais humana (`Alguma limitação importante?`) com exemplos não técnicos na primeira leitura.
- Aprovado ajuste de clareza do header técnico para `Painel técnico do projeto`, mantendo o mesmo comportamento funcional.
- Aprovada inclusão de orientação discreta de jornada (`1. Ideia → 2. Briefing → 3. Esteira`) e reforço de contraste do bloco de briefing, sem redesign estrutural.
