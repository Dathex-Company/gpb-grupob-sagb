# Plano de Rollout — API SagB v1.0.0

## Visão Geral

Rollout da API SagB em ondas progressivas para minimizar riscos e permitir validação incremental.

## Ondas de Rollout

### 🌊 Onda 0 — Pré-Produção (Ambiente Controlado)
**Duração:** 3 dias úteis

| Atividade | Responsável | Prazo |
|-----------|-------------|-------|
| Deploy da função Netlify `api-sagb-router.mjs` em ambiente sandbox | DevOps | Dia 1 |
| Deploy da migração Supabase `api_audit_log` | DevOps | Dia 1 |
| Criar API Keys de teste para cada adapter (CRM, TaskZei, Studio, Vox) | Dande Conec | Dia 1 |
| Validar healthcheck (`GET /v1/health`) | QA | Dia 1 |
| Validar autenticação (401 sem key, 403 sem escopo) | QA | Dia 1 |
| Executar suíte de testes automatizados | QA | Dia 2 |
| Teste de carga (k6) com baseline de 10 VUs | QA | Dia 2 |
| Validar logs de auditoria no Supabase | QA | Dia 2 |
| Homologação interna com time SagB | Dande Conec | Dia 3 |

**Critério de avanço:** 100% dos testes passando, latência p95 < 2s, 0 erros críticos.

### 🌊 Onda 1 — Alpha (Consumidores Internos)
**Duração:** 5 dias úteis

| Atividade | Responsável | Prazo |
|-----------|-------------|-------|
| Liberar acesso para time de agentes (Kaique, Sandri) | Dande Conec | Dia 1 |
| Monitorar logs e métricas de uso | DevOps | Contínuo |
| Coletar feedback sobre documentação OpenAPI | Dande Conec | Dia 3 |
| Ajustes baseados em feedback | Time | Dia 4-5 |

**Critério de avanço:** Mínimo 3 consumidores internos usando ativamente, < 5% de erros.

### 🌊 Onda 2 — Beta (Parceiros Selecionados)
**Duração:** 7 dias úteis

| Atividade | Responsável | Prazo |
|-----------|-------------|-------|
| Onboarding de 2-3 parceiros (CRM, Studio) | Dande Conec | Dia 1-2 |
| Disponibilizar collection Postman | Dande Conec | Dia 1 |
| Webinar técnico de integração | Dande Conec | Dia 3 |
| Suporte dedicado via Discord | Agentes | Contínuo |
| Monitorar escalabilidade (alvo: 50 VUs simultâneos) | DevOps | Contínuo |

**Critério de avanço:** Taxa de sucesso > 99%, sem incidentes de segurança.

### 🌊 Onda 3 — GA (Disponibilidade Geral)
**Duração:** Lançamento único

| Atividade | Responsável | Prazo |
|-----------|-------------|-------|
| Anúncio oficial no painel SagB | Comunicação | Dia 1 |
| Publicação no portal de desenvolvedores | Dande Conec | Dia 1 |
| Disponibilizar rate limits definitivos | DevOps | Dia 1 |
| Iniciar SLA oficial (99.5% uptime) | Time | Dia 1 |

## Métricas de Sucesso

| Métrica | Alvo Onda 0 | Alvo Onda 1 | Alvo Onda 2 | Alvo GA |
|---------|-------------|-------------|-------------|---------|
| Latência p95 | < 3s | < 2s | < 1.5s | < 1s |
| Taxa de erro | < 2% | < 1% | < 0.5% | < 0.1% |
| Cobertura de testes | > 70% | > 75% | > 80% | > 85% |
| Uptime | — | 99% | 99.5% | 99.9% |

## Plano de Rollback

Ver [`rollbackProcedure.md`](./rollbackProcedure.md).

## Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Adapter upstream fora do ar | Média | Alto | Circuit breaker + fallback |
| Vazamento de API Key | Baixa | Crítico | Rotação automática de chaves |
| Quebra de contrato OpenAPI | Média | Médio | Testes de contrato no CI |
| Overscoping de permissões | Baixa | Alto | Revisão manual de scopes |
