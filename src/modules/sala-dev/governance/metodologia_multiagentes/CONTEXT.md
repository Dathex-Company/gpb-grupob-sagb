# CONTEXT.md — Contexto da Sala Dev v3.0.0

## Nome do Projeto

**Sala Dev — Esteira Multiagentes do SagB**

## Objetivo do Produto

Transformar a Sala Dev no cockpit operacional de desenvolvimento do SagB, capaz de receber uma ideia/projeto, organizar a execução em uma esteira multiagentes, registrar handoffs, gates, artefatos, logs, decisões, revisões, segurança, versionamento, deploy e operação.

A versão v3.0.0 tem como foco estrutural a evolução do modelo de **11 agentes documentados** para **18 agentes oficiais CA-01 a CA-18**, reduzindo acúmulo de funções, alucinação operacional e perda de contexto.

## Stack Principal

- Frontend: React + TypeScript
- Módulo: `src/modules/sala-dev`
- Persistência preparada: Supabase via repository/mapper já existente
- Provider atual: mock como fallback obrigatório, Supabase como ativação controlada futura
- Execução técnica VS Code/Roo: prevista por contrato seguro, ainda sem execução remota autônoma

## Foco Atual

**Fase 1 — Alinhamento da metodologia para 18 agentes**

- Atualizar `AGENTS.md` para CA-01 a CA-18
- Atualizar `PROJECT_BOOTSTRAP.md` com 5 blocos operacionais
- Criar/atualizar personas e prompts dos agentes
- Registrar evolução v3.0.0 em `plano_modulo.md`

## Regras de Execução

1. **Multiagentes:** Operar como sistema coordenado de 18 agentes especializados.
2. **Blocos:** Executar por 5 blocos: Entrada, Arquitetura, Construção, Qualidade e Deploy/Operação.
3. **Documentação:** Cada agente deve gerar saída documentada ou log.
4. **Handoff:** Toda entrega deve declarar input recebido, output produzido e próximo agente.
5. **Gates:** Nenhum bloco avança sem gate mínimo validado.
6. **Rastreabilidade:** Decisões, riscos e bloqueios devem ser registrados.
7. **Reaproveitamento:** CA-18 e CA-13 entram antes de construir coisa nova.
8. **Segurança:** CA-08 pode bloquear publicação quando houver risco crítico.
9. **Fallback:** Mock permanece fallback obrigatório até validação real de Supabase/motor.
10. **Segurança operacional:** VS Code/Roo continuam sem execução remota autônoma até nova governança explícita.

## Blocos Oficiais

| Bloco | Nome | Agentes |
|---|---|---|
| 1 | Entrada e Organização | CA-01, CA-18, CA-13 |
| 2 | Arquitetura e Documentação | CA-02, CA-16, CA-03 |
| 3 | Construção Técnica | CA-06, CA-05, CA-07, CA-14, CA-04 |
| 4 | Segurança e Qualidade | CA-15, CA-08, CA-10, CA-11 |
| 5 | Deploy e Operação | CA-12, CA-09, CA-17 |

## Status Atual

✅ Análise completa da Sala Dev realizada  
✅ Plano profundo de evolução 11 → 18 agentes criado  
✅ `AGENTS.md` atualizado para v3.0.0  
✅ `CONTEXT.md` atualizado para v3.0.0  
✅ `PROJECT_BOOTSTRAP.md` atualizado para v3.0.0  
⬜ Personas e prompts CA completos  
⬜ Código frontend atualizado para 18 agentes  
⬜ Motor de orquestração criado  

## Próximos Passos

1. Concluir Fase 1 documental.
2. Atualizar mocks, tipos e componentes para 18 agentes.
3. Criar motor de orquestração v0.1.

---

*Este documento será atualizado conforme a evolução da Sala Dev v3.0.0.*
