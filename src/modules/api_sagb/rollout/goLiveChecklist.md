# Go-Live Checklist — API SagB v1.0.0

## Pré-requisitos

### Infraestrutura
- [ ] Função Netlify `api-sagb-router.mjs` deployada em produção
- [ ] Função Netlify `api-sagb-audit.mjs` deployada em produção
- [ ] Migração Supabase `api_audit_log` aplicada
- [ ] Domínio configurado: `https://api.sagb.com.br`
- [ ] TLS/SSL ativo e válido
- [ ] CDN configurada (se aplicável)
- [ ] Rate limiting configurado (baseline: 1000 req/min)

### Segurança
- [ ] API Keys de produção geradas e rotacionadas
- [ ] Scopes definidos para cada API Key
- [ ] Environment `production` ativo nas chaves
- [ ] CORS configurado para origens conhecidas
- [ ] Headers de segurança verificados (X-Request-Id, etc.)
- [ ] Logs de auditoria sendo persistidos no Supabase

### Testes
- [ ] Suíte de testes passando (Vitest)
- [ ] Teste de carga k6 concluído sem falhas
- [ ] Validação de contrato OpenAPI (schemas, rotas, responses)
- [ ] Teste de autenticação (401 sem key, 403 sem scope)
- [ ] Teste de versionamento (headers, fallback)
- [ ] Teste de circuit breaker (simular falha de adapter)

### Documentação
- [ ] OpenAPI spec atualizada (`openapi_v1.yaml`)
- [ ] Changelog da API publicado (`CHANGELOG_API.md`)
- [ ] Política de depreciação documentada
- [ ] Guia de migração disponível (se aplicável)
- [ ] Postman Collection exportada
- [ ] README do módulo atualizado

### Monitoramento
- [ ] Dashboard de monitoramento configurado (Datadog/Grafana)
- [ ] Alertas configurados (erro > 1%, latência > 2s)
- [ ] Logs estruturados habilitados
- [ ] Healthcheck endpoint respondendo (`GET /v1/health`)

### Operacional
- [ ] Procedimento de rollback documentado e testado
- [ ] Times internos notificados (Kaique, Sandri, Suporte)
- [ ] Canais de comunicação definidos (Discord #api-sagb)
- [ ] On-call escalado para primeira semana
- [ ] SLA definido e comunicado

## Check-list Go-Live

### H-24h
- [ ] Executar suíte completa de testes
- [ ] Verificar logs de auditoria em sandbox
- [ ] Confirmar com todos os adapters (CRM, TaskZei, Studio, Vox)
- [ ] Revisar ultimo deploy em sandbox
- [ ] Preparar comunicado interno

### H-1h
- [ ] Pausar novos deploys
- [ ] Verificar healthcheck do ambiente
- [ ] Confirmar que rollback procedure está acessível
- [ ] Notificar equipe de monitoramento

### H-0 (Go-Live)
- [ ] Deploy da função Netlify em produção
- [ ] Verificar healthcheck: `GET /v1/health`
- [ ] Validar autenticação: `GET /v1/health` com API Key
- [ ] Validar 401 sem API Key
- [ ] Executar smoke tests manuais (1 endpoint por domínio)
- [ ] Verificar logs de auditoria
- [ ] Anunciar go-live no canal #api-sagb

### Pós-Go-Live (30 min)
- [ ] Monitorar taxa de erro em tempo real
- [ ] Verificar latência p95 e p99
- [ ] Confirmar que logs estão sendo gerados
- [ ] Responder a qualquer alerta imediato

### Pós-Go-Live (24h)
- [ ] Revisar métricas de uso
- [ ] Verificar se há erros não detectados
- [ ] Coletar feedback dos primeiros consumidores
- [ ] Avaliar necessidade de ajustes nos rate limits

## Responsáveis

| Papel | Nome | Contato |
|-------|------|---------|
| Guardião da API | Dande Conec | dande.conec@sagb.com.br |
| DevOps | Kaique Zambram | kaique@sagb.com.br |
| QA | Sandri Bacoli | sandri@sagb.com.br |
| Suporte | Equipe de Agentes | suporte@sagb.com.br |

## Pós-Implantação

- [ ] Documentar lições aprendidas
- [ ] Atualizar este checklist para próxima versão
- [ ] Revisar métricas de SLA semanalmente no primeiro mês
