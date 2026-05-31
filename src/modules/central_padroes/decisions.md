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
| 2026-05-31 | Adotar padrão de módulo full screen com sidebar própria no `central_padroes` | Padronizar navegação com base no Alice UI Standard + referência taskzei |
| 2026-05-31 | Ocultar sidebar global do SagB quando `activeTab === 'central_padroes'` | Garantir substituição limpa entre sidebar global e sidebar do módulo |
| 2026-05-31 | Navegação de retorno via evento `sagb:navigate` com `detail: 'ecosystem'` | Unificar comportamento “Voltar ao SagB” entre módulos plugáveis |
