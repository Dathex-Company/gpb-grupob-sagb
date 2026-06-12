# SagB by Loze | Matriz canônica de módulos

**Etapa:** ET-02  
**Status:** classificação inicial  
**Critério:** auditoria documental e estrutural, sem execução de build/testes nesta etapa.

---

## Legenda de status

| Status | Significado |
|---|---|
| core | Módulo estratégico que deve ser preservado, documentado e evoluído. |
| parcial | Módulo funcional ou relevante, mas com pendências de integração, documentação ou maturidade. |
| lab | Módulo experimental, mockado ou de baixa maturidade. |
| legado-protegido | Parte legada importante ou Golden Seal; não mexer sem decisão. |
| confuso | Módulo com sobreposição, nome/rota ambígua ou fronteira pouco clara. |
| pendente de validação | Precisa checagem técnica adicional antes de classificar definitivamente. |

## Módulos registrados no registry

| Nome | Caminho | Status | Registry | Manifest | Routes | Module-doc | Docs | Supabase | Function relacionada | Riscos | Recomendação |
|---|---|---|---|---|---|---|---|---|---|---|---|
| API SagB | `src/modules/api_sagb/` | core | sim | sim | sim | sim | parcial | sim | `api-sagb-router.mjs`, `api-sagb-audit.mjs` | Contratos e auth precisam hardening | Documentar contratos e segurança |
| Hub de Integrações | `src/modules/hub-integracao/` | core | sim | sim | sim | sim | parcial | sim | `whatsapp-webhook.mjs`, `whatsapp-qr.mjs`, `email-sync-background.ts`, `email-titan-driver.ts` | localStorage e credenciais sensíveis | Priorizar hardening e matriz de integrações |
| Agentes Comerciais | `src/modules/agentes_comerciais/` | lab/confuso | sim | sim | sim | sim | mínimo | não confirmado | não identificada | Serviço mockado e sobreposição com Quadro de Elite | Revisar fronteira antes de evoluir |
| Cadastro de Empresas | `src/modules/cadastro-empresas/` | parcial | sim | sim | sim | sim | mínimo | sim | não identificada | Compatibilidade com `ventures` e QGs | Unificar com LOZE-OPP |
| Núcleo Conversacional | `src/modules/nucleo-conversacional/` | parcial | sim | sim | sim | sim | sim | sim | não identificada | Duplicidade de ids e tabs | Normalizar alias e docs |
| Núcleo de Agentes | `src/modules/nucleo_de_agentes/` | confuso/parcial | sim | sim | sim | sim | sim | sim | não identificada | Callbacks placeholder; sobrepõe Governance/Quadro | Definir papel como visão ou core |
| Central de Padrões | `src/modules/central_padroes/` | core | sim | sim | sim | sim | sim | sim | não identificada | Precisa virar Loze Docs sem dispersar | Manter como centro canônico |
| Monitoramento | `src/modules/monitoramento/` | parcial | sim | sim | sim | sim | sim | sim | não identificada | Métricas reais ainda a validar | Evoluir após inventário Supabase |
| NAGI | `src/modules/nagi/` | parcial/lab | sim | sim | sim | sim | sim | sim | não identificada | Dados estáticos e sobreposição com RAI/NIC | Manter como visão executiva |
| NIC | `src/modules/nic/` | lab | sim | sim | sim | sim | sim | parcial | não identificada | Documentos mockados | Integrar ao CID antes de promover |
| Quadro de Elite | `src/modules/quadro_de_elite/` | core | sim | sim | sim | sim | sim | sim | não identificada | Duplicidade com AgentFactory/Agentes Comerciais | Definir como fonte única de agentes |
| Sala Dev | `src/modules/sala-dev/` | parcial | sim | sim | sim | sim | sim | sim | não identificada | Fallback mock e tabelas dev divergentes | Documentar provider e schemas |
| Mentorias | `src/modules/mentorias/` | parcial | sim | sim | sim | sim | sim | sim | não identificada | Abas em breve | Completar docs de fluxo |
| Metodologias | `src/modules/metodologias/` | core | sim | sim | sim | sim | sim | sim | não identificada | Muitos fluxos e tabelas | Usar como referência LOZE-DAS |
| Missões | `src/modules/missoes/` | parcial | sim | sim | sim | sim | mínimo | sim | não identificada | Precisa alinhar agentes reais | Vincular ao Quadro de Elite |
| RAI | `src/modules/rai/` | parcial | sim | sim | sim | sim | sim | sim | `rai-rss-fetch.mjs` | Fallback mock e integração externa | Validar pipeline real |
| Karaokê | `src/modules/karaoke/` | lab | sim | sim | sim | sim | mínimo | não confirmado | não identificada | Consumidor provável do Studio | Classificar como lab até integrar |
| Studio | `src/modules/studio/` | core | sim | sim | sim | sim | sim | sim | não identificada | Storage pesado e transcrição | Documentar operação e storage |
| CID | `src/modules/cid/` | core | sim | sim | sim | sim | sim | sim | `cid-processor.mjs`, `cid-search.mjs`, `cid-apply-prompt-background.mjs` | Extração complexa e jobs | Consolidar pipeline documental |
| TaskZei | `src/modules/taskzei/` | core | sim | sim | sim | sim | sim | sim | `taskzei-send-notification.mjs` | RLS permissiva e provider mock | Priorizar hardening |
| CRM Ziplia | `src/modules/crm_ziplia/` | parcial/core comercial | sim | sim | sim | sim | sim | sim | possivelmente via Hub | Abas mapeadas e migração em andamento | Evoluir após Hub e Supabase |
| Configurações | `src/modules/configuracoes-ambiente/` | lab/parcial | sim | sim | sim | sim | mínimo | não confirmado | não identificada | Muitas seções em breve | Manter hidden até maturar |
| Gestão Financeira | `src/modules/gestao_financeira/` | parcial/core financeiro | sim | sim | sim | sim | sim | sim | não identificada | Schema financeiro precisa validação | Auditar tabelas e RLS |
| Telas Avançadas | `src/modules/telas_avancadas/` | lab | sim | sim | sim | sim | mínimo | não | não identificada | localStorage e TODO edição | Quarentena como lab |
| Vídeos IA | `src/modules/videos-ia/` | lab | sim | sim | sim | sim | mínimo | não confirmado | não identificada | Providers a validar | Manter como lab |
| Foco Total | `src/modules/foco_total/` | lab/parcial | sim | sim | sim | sim | mínimo | não confirmado | não identificada | Persistência local/store | Manter como produto experimental |
| SagB Bridge | `src/modules/sagb_bridge/` | lab estratégico | sim | sim | sim | sim | sim | sim | não identificada | Etapas pendentes | Planejar após ET-03 |
| MCP SagB | `src/modules/mcp_sagb/` | lab estratégico | sim | sim | sim | sim | sim | localStorage | não identificada | Modo mock dominante | Documentar como LOZE-DEV lab |
| FluxoB | `src/modules/fluxob/` | lab | sim | sim | sim | sim | sim | não confirmado | não identificada | Pre-alpha | Não evoluir antes de definição de workflows |

## Módulos e áreas fora do registry

| Nome | Caminho | Status | Registry | Manifest | Routes | Module-doc | Supabase | Risco | Recomendação |
|---|---|---|---|---|---|---|---|---|---|
| Dashboard Home | `components/DashboardHome.tsx` | parcial | não | não | tab | não | parcial | Core preso ao shell | Documentar como área core do shell |
| Hub/Ecosystem | `components/HubView.tsx` | parcial/core | não | não | tab | não | parcial | Sobrepõe Cadastro de Empresas | Definir como visão de navegação |
| Systemic Vision | `components/SystemicVision.tsx` | legado-protegido | não | não | tab | não | sim | Golden Seal | Proteger |
| Management | `components/ManagementView.tsx` | legado-protegido | não | não | tab | não | sim | Golden Seal e overlap TaskZei | Proteger e documentar |
| Governance | `components/GovernanceView.tsx` | confuso/core legado | não | não | tab | não | sim | Sobrepõe Central/Núcleo | Avaliar modularização futura |
| Continuous Memory | `components/ContinuousMemoryView.tsx` | parcial/core dados | não | não | tab | não | sim | Fora do registry apesar de migrations | Candidato a módulo formal |
| Intelligence Flow | `components/IntelligenceFlowView.tsx` | parcial | não | não | tab | não | sim | Fora do registry | Candidato a módulo formal |
| Quality Sensor | `components/QualitySensorView.tsx` | parcial | não | não | subrota | não | sim | Submódulo solto | Anexar a Monitoramento ou Agentes |
| 3forB/Audacus/StartyB | `components/*View.tsx` | parcial | não | não | tabs BU | não | variável | QGs sem padrão LOZE-OPP | Criar matriz QG/empresa |

## Mapa resumido por status

- **Core:** API SagB, Hub Integração, Central de Padrões, Quadro de Elite, Metodologias, Studio, CID, TaskZei.
- **Parcial:** Cadastro Empresas, Núcleo Conversacional, Monitoramento, Sala Dev, Mentorias, Missões, RAI, CRM Ziplia, Gestão Financeira, NAGI.
- **Lab:** Agentes Comerciais, NIC, Karaokê, Configurações, Telas Avançadas, Vídeos IA, Foco Total, SagB Bridge, MCP SagB, FluxoB.
- **Legado-protegido:** Systemic Vision, Management.
- **Confuso:** Governance, Núcleo de Agentes, Agentes Comerciais, áreas QG/Hub/Ventures.
