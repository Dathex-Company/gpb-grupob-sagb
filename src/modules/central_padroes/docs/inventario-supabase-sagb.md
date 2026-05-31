# SagB by Loze | Inventário Supabase por módulo

**Etapa:** ET-02  
**Fonte:** migrations, services e auditoria estrutural.  
**Status:** inventário inicial, pendente de validação contra banco remoto.

---

## 1. Observações gerais

- O SagB usa Supabase Auth, PostgREST, Storage e uma camada shim em `services/supabase.ts`.
- O front usa tanto `restFetch` quanto funções estilo Firestore como `collection`, `addDoc`, `getDocs`, `onSnapshot`.
- Há migrations com RLS por workspace e também políticas permissivas que precisam de revisão.
- Alguns módulos possuem fallback mock/localStorage.

## 2. Tabelas por domínio

| Domínio/Módulo | Tabelas identificadas | Storage | Risco inicial | Recomendação |
|---|---|---|---|---|
| Governança | `audit_events`, `workspace_members`, `governance_global_culture`, `governance_compliance_rules`, `vault_items`, `knowledge_nodes`, `knowledge_attachments`, `governance_rules` | não identificado | Sobreposição com Central/Núcleo | Padronizar owner documental |
| Agentes | `agents`, `agent_memories`, `agent_quality_events`, `agent_dna_profiles`, `agent_dna_effective` | não identificado | RLS hotfix permissivo em `agents` | Hardening e fonte única Quadro de Elite |
| Chat/Núcleo Conversacional | `chat_sessions`, `chat_messages` | `sagb_chat_attachments` | Alias de rota/id confuso | Formalizar contrato de conversas |
| CID | `cid_assets`, `cid_asset_files`, `cid_batches`, `cid_processing_jobs`, `cid_chunks`, `cid_outputs`, `cid_tags`, `cid_asset_tags`, `cid_links`, `cid_batch_items`, `cid_prompts`, `cid_prompt_runs`, `cid_prompt_run_items` | `cid-assets` | Pipeline pesado e extração complexa | Documentar jobs e storage |
| Intelligence Flow | `intelligence_flows`, `intelligence_flow_steps` | não identificado | Fora do registry | Avaliar formalização como módulo |
| Continuous Memory | `continuous_memory_sessions`, `continuous_memory_chunks`, `continuous_memory_files`, `continuous_memory_jobs`, `continuous_memory_outputs`, `continuous_memory_labels`, `continuous_memory_chunk_labels`, `continuous_memory_extracted_items`, `continuous_memory_links` | `continuous-memory` | Fora do registry | Virar módulo ou submódulo documentado |
| NAGI | `nagi_ecosystem_entities`, `nagi_entity_relations`, `nagi_external_signals`, `nagi_insight_distributions`, `nagi_ecosystem_decisions` | não identificado | Dados estáticos vs banco | Validar uso real |
| Sala Dev / SagB Bridge | `dev_projects`, `dev_tasks`, `dev_task_runs`, `dev_developer_sessions`, `dev_task_launches`, possíveis `dev_runs`, `dev_logs`, `dev_artifacts` por service | não identificado | Divergência entre migrations e services | Auditar schema antes de executar |
| Missões | `agent_missions`, `agent_mission_steps`, `agent_artifacts`, `agent_handoffs`, `agent_mission_blueprints`, `agent_mission_blueprint_roles`, `agent_mission_events`, `agent_mission_checkpoints`, `agent_mission_participants` | não identificado | V1/V2 coexistem | Consolidar engine e participantes |
| Studio | `studio_sessions`, `studio_chunks`, `studio_session_cameras`, `studio_camera_files`, `studio_audio_tracks` | `studio` | Arquivos grandes e transcrição | Documentar retenção e limites |
| Metodologias | `metodologias_entradas_brutas`, `metodologias_ativos_em_estruturacao`, `metodologias_blocos_estruturacao`, `metodologias_catalogo_canonico`, `metodologias_blocos_canonicos`, `metodologias_versoes_canonicas`, `metodologias_eventos_manutencao_canonica`, `metodologias_relacoes_canonicas`, `metodologias_relacoes_estruturacao` | não identificado | Políticas amplas para authenticated | Revisar RLS por workspace |
| TaskZei | `taskzei_tasks`, `taskzei_task_checklist_items`, `taskzei_task_comments`, `taskzei_notifications`, `taskzei_meetings`, `taskzei_meeting_agenda_items`, `taskzei_decisions`, `taskzei_inbox_items`, `taskzei_audit_log`, `taskzei_push_devices`, `taskzei_doc_nodes`, `taskzei_doc_contents`, `taskzei_entity_links`, `taskzei_doc_attachments`, `taskzei_task_attachments`, `taskzei_custom_field_definitions`, `taskzei_task_custom_values` | `cid-assets` | Algumas policies `using true`; provider mock | Hardening prioritário |
| Financeiro | `plano_de_contas`, `transacoes`, `configuracoes_api`, `conciliacoes`, `finance_core` e chart of accounts | não identificado | Schema/module-doc precisa validação | Auditar migration vs service |
| ACADB | `acadb_tracks`, `acadb_courses`, `acadb_modules`, `acadb_lessons`, `acadb_enrollments`, `acadb_lesson_progress` | não identificado | Fora do registry principal | Classificar como QG/produto |
| RAI | `rai_configs`, `rai_captures` | não identificado | Fallback mock | Validar pipeline RSS |
| Hub Integração | `hub_inbox_messages`, `hub_channel_methods`, `hub_channel_configs`, `hub_module_bindings` | não identificado | Fallback localStorage e credenciais | Mover sensíveis para camada segura |
| CRM Ziplia | `leads`, `stage_configs` | não identificado | Migrations não evidentes na lista auditada | Localizar schema CRM completo |

## 3. Buckets identificados

| Bucket | Módulo principal | Uso |
|---|---|---|
| `cid-assets` | CID / TaskZei | Uploads documentais e anexos. |
| `continuous-memory` | Continuous Memory | Arquivos de memória contínua. |
| `studio` | Studio | Áudio/vídeo bruto e trilhas. |
| `sagb_chat_attachments` | Núcleo Conversacional | Anexos de chat. |

## 4. Riscos de segurança priorizados

1. Políticas permissivas temporárias em `agents`.
2. Policies `using true` em tabelas TaskZei de reuniões/inbox/audit.
3. Políticas amplas por authenticated em metodologias e governance rules.
4. Credenciais ou configs sensíveis em localStorage no Hub Integração.
5. Mistura de dados por `workspace_id` e `workspaceId`.

## 5. Próxima validação técnica

Executar ET-04 para comparar migrations com banco remoto real, policies ativas, grants, buckets e variáveis de ambiente.
