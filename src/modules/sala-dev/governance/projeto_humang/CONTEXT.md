# CONTEXT.md - Contexto do Projeto

## Nome do Projeto
**PROJETO_HUMANG**

## Objetivo do Produto
Desenvolver uma aplicação multiagentes profissional que simula uma equipe técnica completa, com divisão clara de funções, geração de documentação por etapa e execução orientada por fluxo. O objetivo é criar uma base sólida para desenvolvimento de software com organização, rastreabilidade e profissionalismo.

## Stack Principal
**Stack definida pelo System Architect (ET-03):**
- **Backend:** Python 3.11+ com FastAPI, SQLAlchemy, Pydantic
- **Frontend:** React 18+ com TypeScript, Vite, Material-UI, TailwindCSS
- **Banco de Dados:** PostgreSQL 15+ (relacional + JSONB), Redis 7+ (cache)
- **Infraestrutura:** Docker, Docker Compose, AWS/DigitalOcean (opções)
- **IA/ML:** spaCy, Transformers, Whisper, Tesseract, Scikit-learn
- **Integrações:** Google Calendar, SendGrid, Twilio, LinkedIn API

## Foco Atual
**ET-03 COMPLETA ✅ PRÓXIMO: ET-04 - UX and Flow Designer**
- ✅ ET-01: Orquestração e Bootstrap concluída
- ✅ ET-02: Estratégia de Produto concluída
- ✅ ET-03: System Architect concluída (arquitetura técnica definida)
- 🔄 ET-04: UX and Flow Designer (próxima etapa)
- ⬜ ET-05: Project Planner
- ⬜ ET-06: Implementação Técnica
- ⬜ ET-07: Revisão de Qualidade
- ⬜ ET-08: Documentação Final

## Entregáveis Gerados (ET-03)
1. **`.docs/03-arquitetura-sistema.md`** - Arquitetura geral do sistema
2. **`.specs/01-entidades-e-dados.md`** - Modelo completo de entidades e dados
3. **`.specs/02-estrutura-tecnica.md`** - Estrutura técnica detalhada e integrações

## Regras de Execução
1. **Multiagentes:** Operar como sistema coordenado de 11 agentes especializados
2. **Documentação:** Cada etapa gera saídas documentadas obrigatórias
3. **Dependências:** Seguir sequência ET-01 a ET-08 sem pular etapas
4. **Rastreabilidade:** Todas as decisões devem ser documentadas para continuidade
5. **Organização:** Manter estrutura de pastas definida em PROJECT_BOOTSTRAP.md
6. **Profissionalismo:** Garantir padrões de qualidade em todas as entregas

## Observações Importantes
- **Metodologia:** Baseada em PROJECT_BOOTSTRAP.md com fluxo oficial de 8 etapas
- **Agentes:** 11 agentes especializados com missões específicas
- **Estrutura:** Pastas `.agents/`, `.docs/`, `.plans/`, `.specs/`, `.tasks/`, `.logs/`, `src/`
- **Documentação:** README.md, AGENTS.md, CONTEXT.md como documentos centrais
- **Próximos Passos:** Iniciar ET-04 (UX and Flow Designer) para estruturar jornadas de usuário

## Status Atual
✅ Estrutura base criada
✅ Agentes materializados em `.agents/`
✅ AGENTS.md consolidado
✅ ET-01: Orquestração concluída
✅ ET-02: Product Strategist concluída
✅ ET-03: System Architect concluída
⬜ ET-04: UX and Flow Designer (próximo)
⬜ `.plans/00-fluxo-geral.md` (gerado pelo Orquestrador)
⬜ `.logs/00-orquestracao.md` (registro de execução)

---

*Este documento será atualizado conforme o progresso do projeto e decisões técnicas tomadas pelos agentes.*
