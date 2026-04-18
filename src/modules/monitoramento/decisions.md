# Decisões Arquiteturais — Módulo Monitoramento

Este documento registra decisões estratégicas e arquiteturais que impactam a evolução do módulo.

---

## 2026-04-13 | Decisão: Escopo Oficial do Módulo
**Contexto:** O módulo monitoramento existia apenas com estrutura visual (catálogo de rótulos) sem documentação oficial ou implementação real.

**Decisão:** Definir escopo oficial baseado no catálogo existente (132 itens em 13 submódulos) e estruturar conforme padrão novo do SagB.

**Impacto:**
- Criação de `module-doc.ts` com fronteiras claras
- Owner definido como Pierre Zanulli (Agente Mestre da Orquestração)
- Categorização como módulo operacional
- Definição de fontes de dados e riscos de duplicação

**Status:** Implementado

---

## 2026-04-13 | Decisão: Priorização de Implementação
**Contexto:** O catálogo possui 132 itens de monitoramento, mas a implementação real é zero.

**Decisão:** Priorizar implementação em fases:
1. **Fase 1:** Monitoramento de tabelas Supabase (tabela → módulos)
2. **Fase 2:** Coleta de métricas de infraestrutura básica
3. **Fase 3:** Sistema de alertas centralizado
4. **Fase 4:** Dashboard executivo agregado

**Justificativa:** Começar pelo item de maior valor imediato (visibilidade sobre duplicação de tabelas) e evoluir gradualmente.

**Status:** Em planejamento

---

## 2026-04-13 | Decisão: Estrutura de Coleta de Métricas
**Contexto:** Necessidade de coletar métricas de múltiplas fontes (infra, serviços, custos).

**Decisão:** Adotar arquitetura baseada em:
1. **Coletores leves** por domínio (infra, backend, frontend, custos)
2. **Agregador central** que normaliza e armazena em Supabase
3. **API de consulta** para dashboards e alertas

**Padrão técnico:** Usar `system_metrics` (Supabase) como tabela canônica, com schema flexível para diferentes tipos de métricas.

**Status:** A ser implementado

---

## 2026-04-13 | Decisão: Integração com Módulo Docs
**Contexto:** Cada módulo possui `module-doc.ts` com `fontes_de_dados.supabase_tabelas`.

**Decisão:** Criar serviço que varre todos os `module-doc.ts` e monta mapa `tabela → [módulos]` para exibição no monitoramento.

**Benefício:** Evita duplicação de tabelas e identifica dependências críticas.

**Status:** Em implementação (próxima tarefa)

---

## 2026-04-13 | Decisão: Política de Alertas
**Contexto:** Múltiplos serviços podem gerar alertas de forma descoordenada.

**Decisão:** Centralizar gestão de alertas no módulo monitoramento:
1. **Padrão de severidade:** crítico, alto, médio, baixo
2. **Canal único:** `alert_logs` (Supabase)
3. **Responsabilidade:** Monitoramento consolida, outros módulos apenas emitem

**Status:** A ser implementado

---

## 2026-04-13 | Decisão: Owner do Módulo
**Contexto:** O módulo não tinha owner definido no `manifest.ts`.

**Decisão:** Designar **Pierre Zanulli** como owner, por ser o Agente Mestre da Orquestração e ter visão sistêmica do ecossistema.

**Justificativa:** Monitoramento é função transversal que requer conhecimento de todo o sistema.

**Status:** Implementado em `module-doc.ts` e `manifest.ts`