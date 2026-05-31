# SagB by Loze | QUARENTENA TÉCNICA

**Etapa:** ET-02  
**Regra:** nada deve ser removido nesta etapa. Tudo aqui é classificação para validação futura.

---

## 1. Critérios

Entram nesta quarentena itens que parecem resquício, duplicado, órfão, legado, mockado, confuso, arriscado, sensível ou não removível sem validação.

## 2. Itens em quarentena

| Item | Tipo | Caminho | Motivo da suspeita | Módulo relacionado | Risco de remover | Recomendação | Observação técnica |
|---|---|---|---|---|---|---|---|
| App antigo | legado | `docs/legacy/App_Antigo.tsx` | Cópia antiga do shell | Shell | alto | proteger | Pode conter referência histórica útil |
| AgentFactory legado | duplicado/sensível | `components/AgentFactory.tsx` | Coexiste com `src/modules/quadro_de_elite` | Quadro de Elite | alto | proteger | Usado no `App.tsx` |
| AgentFactory modular | duplicado | `src/modules/quadro_de_elite/components/agent-factory/` | Implementação nova do mesmo domínio | Quadro de Elite | médio | revisar | Definir fonte única |
| AgentsFlowPanel legado | duplicado | `components/dev-room/AgentsFlowPanel.tsx` | Duplicado com Sala Dev | Sala Dev | médio | revisar | Validar referências |
| AgentsFlowPanel modular | duplicado | `src/modules/sala-dev/components/AgentsFlowPanel.tsx` | Duplicado com legado | Sala Dev | médio | manter | Preferir modular após validação |
| NAGIView legado | duplicado | `components/NAGIView.tsx` | Coexiste com módulo NAGI | NAGI | médio | revisar | Validar qual é renderizada |
| NAGIView modular | duplicado | `src/modules/nagi/components/NAGIView.tsx` | Coexiste com componente legado | NAGI | médio | manter | Preferir padrão modular |
| MonitoramentoView legado | duplicado | `components/MonitoramentoView.tsx` | Coexiste com módulo Monitoramento | Monitoramento | médio | revisar | Usado no shell |
| CIDView legado | duplicado | `components/CIDView.tsx` | Coexiste com `src/modules/cid` | CID | alto | proteger | Pode ser UI principal real |
| Continuous Memory | fora do registry | `components/ContinuousMemoryView.tsx` | Tem migrations, mas não módulo formal | Memória | alto | revisar | Candidato a módulo core |
| Intelligence Flow | fora do registry | `components/IntelligenceFlowView.tsx` | Tem migrations, mas não módulo formal | IA/Fluxos | alto | revisar | Candidato a módulo |
| GovernanceView | sobreposição | `components/GovernanceView.tsx` | Sobrepõe Central e Núcleo de Agentes | Governança | alto | proteger | Pode ser core legado |
| ManagementView | Golden Seal | `components/ManagementView.tsx` | Coexiste com TaskZei | Management/TaskZei | crítico | proteger | Golden Seal no README |
| SystemicVision | Golden Seal | `components/SystemicVision.tsx` | Chat sistêmico sensível | IA/Agentes | crítico | proteger | Golden Seal no README |
| Agentes Comerciais | mock/sobreposição | `src/modules/agentes_comerciais/` | `agenteService.ts` usa mock e duplica agentes | Agentes | médio | revisar | Não promover sem fonte única |
| Núcleo de Agentes | placeholder/sobreposição | `src/modules/nucleo_de_agentes/` | Lê real, escreve placeholder | Agentes/Governança | médio | revisar | Definir papel |
| Telas Avançadas | localStorage/TODO | `src/modules/telas_avancadas/` | Backend localStorage e edição TODO | Lab | baixo | manter como lab | Não tratar como core |
| MCP SagB | mock/live futuro | `src/modules/mcp_sagb/` | Modo mock dominante | LOZE-DEV | baixo | manter como lab | Estratégico, mas não pronto |
| FluxoB | pre-alpha | `src/modules/fluxob/` | Declarado pre_alpha | Workflow | baixo | manter como lab | Não evoluir sem ADR |
| NIC docs mockadas | mock | `src/modules/nic/pages/NICPage.tsx` | Usa `mockDocs` | NIC/CID | médio | revisar | Integrar ao CID |
| CRM Ziplia abas futuras | parcial | `src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx` | Abas mapeadas para próxima implementação | CRM | baixo | manter | Documentar roadmap |
| Configurações do Sistema | incompleto | `src/modules/configuracoes-ambiente/` | Várias seções em breve | Configurações | baixo | manter hidden | Não promover ainda |
| Hub credentials localStorage | sensível | `src/modules/hub-integracao/services/credentialManager.ts` | Credenciais em localStorage | Hub | alto | revisar | Migrar para backend seguro |
| Hub inbox localStorage | fallback | `src/modules/hub-integracao/services/integrationService.ts` | Fallback localStorage para inbox | Hub/CRM | médio | revisar | OK para dev, risco em prod |
| Telas storage localStorage | fallback | `src/modules/telas_avancadas/services/telasAvancadas.service.ts` | localStorage como backend | Telas Avançadas | baixo | manter lab | Não remover |
| MCP config localStorage | fallback | `src/modules/mcp_sagb/services/mcpSagbService.ts` | Configs persistidas localmente | MCP SagB | baixo | revisar | Evitar dados sensíveis |
| `agents` RLS hotfix | segurança | `supabase/migrations/20260307000102_agents_rls_hotfix.sql` | Política permissiva temporária | Agentes | crítico | revisar | Prioridade ET-04 |
| TaskZei policies using true | segurança | `supabase/migrations/20260505000103_taskzei_meetings_inbox_audit.sql` | Policies amplas | TaskZei | crítico | revisar | Prioridade ET-04 |
| Metodologias all authenticated | segurança | `supabase/migrations/20260405*.sql` | Policies amplas por authenticated | Metodologias | alto | revisar | Validar workspace |
| `_orquestracao-principal` | fora do registry | `src/modules/_orquestracao-principal/` | Módulo existente não registrado | Orquestração | médio | revisar | Decidir se entra no registry |
| `.centro_de_estudos` | pasta confusa | `src/modules/.centro_de_estudos/` | Pasta oculta em módulos | Estudos | baixo | revisar | Classificar no LOZE-OPP |
| Arquivo estranho Netlify | resquício | `` `ziplia-vox.netlify.app``n`n### `` | Nome anômalo na raiz | Deploy | baixo | revisar | Validar existência/uso no filesystem |
| `supabase-cli-darwin` | binário/plataforma | `supabase-cli-darwin` | Binário Darwin em projeto Windows | Infra | baixo | revisar | Não remover sem validação |

## 3. Rotas/tabs em quarentena

| Item | Tipo | Motivo | Recomendação |
|---|---|---|---|
| `conversations` vs `nucleo-conversacional` vs `/conversas` | rota confusa | Três identificadores para domínio semelhante | Definir alias canônico |
| `management` vs `agenda`/TaskZei | sobreposição | Duas gestões de tarefas | Proteger Management e evoluir TaskZei |
| `missions` vs `/missoes` | naming | Id inglês e rota PT-BR | Documentar compatibilidade |
| `quadro_de_elite` vs `/quadro_de_elite` | naming | Snake_case público | Aceitar por legado ou planejar alias |
| `central_padroes` vs `/central_padroes` | naming | Snake_case público | Aceitar por legado ou planejar alias |

## 4. Itens que não podem ser removidos sem validação

- `components/SystemicVision.tsx`.
- `components/ManagementView.tsx`.
- `components/AgentFactory.tsx`.
- `components/CIDView.tsx`.
- `components/GovernanceView.tsx`.
- `services/supabase.ts`.
- `supabase/migrations/*`.
- `netlify/functions/*`.
- `plans/*`.
- `docs/legacy/App_Antigo.tsx`.
