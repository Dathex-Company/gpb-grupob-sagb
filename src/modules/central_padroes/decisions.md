# DECISIONS — Central de Padrões

Registro das decisões estruturais e operacionais do módulo.

| Data | Decisão | Motivo |
|---|---|---|
| 2026-04-12 | Mover documentação de `docs/standards` para `src/modules/central_padroes` | Alinhar à arquitetura oficial de módulo plugável |
| 2026-04-12 | Nomear agente como Zico Padron | Definição do diretor estratégico |
| 2026-04-13 | Owner no manifest.ts, module-doc em estrutura padrão | Alinhamento ao padrão do piloto |
| 2026-05-05 | Supabase definido como fonte primária de verdade para regras de governança | Eliminar drift entre runtime e documentação |
| 2026-05-05 | Publicação passa a incrementar versão e recalcular `checksum_sha256` antes do sync | Garantir trilha auditável mínima por regra |
| 2026-05-05 | Sync documental realizado por função serverless idempotente com status `pending/synced/failed` | Isolar falhas de materialização sem invalidar dado canônico no banco |
| 2026-05-31 | Implantar Central de Padrões V1 com portal de 18 agentes e schema `central_padroes_*` preservando `governance_rules` | Evoluir de publicador legado para portal vivo de governança sem quebrar o embrião existente |
| 2026-05-31 | Executar ET-02 a ET-08 em commits por bloco com fallback quando dependências remotas não existirem | Completar capacidades de CRUD, approval, relacionamento, triagem, busca, segurança e deploy sem bloquear por pgvector/roles granulares |
| 2026-05-31 | Adotar padrão de módulo full screen com sidebar própria no `central_padroes` | Padronizar navegação com base no Alice UI Standard + referência taskzei |
| 2026-05-31 | Ocultar sidebar global do SagB quando `activeTab === 'central_padroes'` | Garantir substituição limpa entre sidebar global e sidebar do módulo |
| 2026-05-31 | Navegação de retorno via evento `sagb:navigate` com `detail: 'ecosystem'` | Unificar comportamento "Voltar ao SagB" entre módulos plugáveis |
| 2026-06-01 | Incorporar curadoria técnica Sávio como ET-09 | Validar e extrair padrões atômicos do checklist total de sistemas, programação e arquitetura técnica |
| 2026-06-01 | CP-TEC-001 atualizado: "Loze como camada oficial de tecnologia aplicada" (v2) | Alinhar ao plano diretor de tecnologia; tipo: política, versão: v2 (campos separados) |
| 2026-06-01 | CP-MOD-001 criado com antigo conteúdo de módulos plugáveis | Preservar padrão existente sem conflito com nova numeração |
| 2026-06-01 | Documento-mãe Sávio v1.1 movido para `/plans/` como plano operacional | Evitar confusão com sequência numérica de documentos de divisão |
| 2026-06-01 | Lacunas e validações registradas como decisões propostas (dec-003 a dec-008) | Não elevar à padrão oficial sem validação cruzada |
| 2026-06-01 | ET-09B: 5 matrizes técnicas adicionadas (CP-TEC-016 a CP-TEC-020) | Complementar curadoria técnica conforme solicitado |
| 2026-06-01 | ET-09B: 6 registros/evidências adicionados (CP-TEC-021 a CP-TEC-026) | Provar ações técnicas com histórico auditável |
| 2026-06-01 | ET-09B: Decisões propostas vinculadas a documento-mãe e padrões | Rastreabilidade completa de lacunas e validações |

| | 2026-06-01 | Iniciar Curadoria Geral das Divisões ET-10 a ET-20 | Carregar documentos-mãe, itens normativos, checklists, matrizes, registros e lacunas sem canonicidade final |
| | 2026-06-01 | Manter Sávio como ET-09 concluída operacionalmente | Não duplicar CP-TEC-001 a CP-TEC-026; apenas reconciliar documento geral |
| | 2026-06-01 | Canonicidade final pendente de validação Pietro | Todos os novos itens ficam em revisão/candidato |
| | 2026-06-01 | ET-21: Auditoria de Cobertura da Curadoria Geral | Curadoria concluída operacionalmente; cobertura inicial suficiente; expansão normativa recomendada |
| | 2026-06-01 | ET-21: Correção de build por filesystem | Build passou a usar `--emptyOutDir false` e `assets_build` para evitar bloqueio de permissão em `dist/assets` |
