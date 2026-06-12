# ET-09 — Curadoria Técnica Sávio / Central de Padrões

**Data:** 2026-06-01
**Executor:** Cássio/Procássio
**Responsável do padrão:** Sávio Codare
**Classificação normativa e aprovação final:** Pietro Carboni
**Validação estratégica:** Rodrigues/Kane
**Status:** Concluída

---

## 1. Arquivo de origem

```
plans/savio_checklist_total_sistemas_programacao_arquitetura_tecnica_loze_v1.1.md
```

**Nome original:** `01_savio_codare_checklist_total_sistemas_programacao_arquitetura_tecnica_loze_v1.1.md`

**Ajuste:** O arquivo foi movido da sequência numérica de documentos de divisão (`01_...`) para a pasta `/plans/` como plano operacional, para não conflitar com os documentos gerais das divisões (00_pietro..., 01_savio..., 02_alice... etc.).

---

## 2. Documento-mãe criado

| Campo | Valor |
|---|---|
| Código | doc-006 |
| Título | Checklist Total — Sistemas, Programação e Arquitetura Técnica / Loze — v1.1 |
| Tipo | documento_mãe |
| Área | Sistemas e Arquitetura (savio) |
| Responsável | Sávio Codare |
| Executor técnico | Cássio/Procássio |
| Status | revisao (candidato_a_canônico) |
| Categoria | Técnico |
| Path | plans/savio_checklist_total_sistemas_programacao_arquitetura_tecnica_loze_v1.1.md |
| Deve se tornar | padrão |

---

## 3. Padrões atômicos criados

| Código | Título | Tipo | Status | Versão |
|---|---|---|---|---|
| CP-TEC-001 | Loze como camada oficial de tecnologia aplicada | política | revisao | v2 |
| CP-TEC-002 | Código técnico aplicado fica na Loze | regra | revisao | v1 |
| CP-TEC-003 | Estrutura de produto técnico ativo | padrão | revisao | v1 |
| CP-TEC-004 | Nome de produto, repositório e componente | padrão | revisao | v1 |
| CP-TEC-005 | Matriz Onde Mora Técnico | matriz | revisao | v1 |
| CP-TEC-006 | Checklist antes de criar módulo | checklist | revisao | v1 |
| CP-TEC-007 | Checklist antes de criar tabela Supabase | checklist | revisao | v1 |
| CP-TEC-008 | Checklist antes de deploy | checklist | revisao | v1 |
| CP-TEC-009 | ADR para decisão estrutural | registro | revisao | v1 |
| CP-TEC-010 | Quarentena Técnica | processo | revisao | v1 |
| CP-TEC-011 | Migração segura de repositório local | padrão | revisao | v1 |
| CP-TEC-012 | Ambiente local de desenvolvimento | padrão | revisao | v1 |
| CP-TEC-013 | Documentação pública, interna, restrita e sensível | política | revisao | v1 |
| CP-TEC-014 | MCP técnico não é MCP de agente | regra | revisao | v1 |
| CP-TEC-015 | Separação tecnologia interna x solução para cliente | padrão | revisao | v1 |

**Nota:** CP-TEC-001 existia anteriormente como "Padrão de Módulos Plugáveis SagB" (type: padrao). Foi atualizado para v2 com o novo título e tipo. O conteúdo anterior foi preservado como CP-MOD-001.

### CP-MOD-001 (preservado)

| Campo | Valor |
|---|---|
| Código | CP-MOD-001 |
| Título | Padrão de Módulos Plugáveis SagB |
| Tipo | padrão |
| Status | aprovado |
| Responsável | Sávio Codare |

---

## 4. Checklists criados

| ID | Título | Contexto | Itens |
|---|---|---|---|
| chk-004 | Antes de criar sistema | criar_sistema | 6 |
| chk-005 | Antes de criar repositório | criar_repositorio | 6 |
| chk-006 | Antes de criar API | criar_api | 6 |
| chk-007 | Antes de deploy | deploy | 7 |
| chk-008 | Antes de adicionar biblioteca/dependência | adicionar_biblioteca | 5 |
| chk-009 | Antes de refatorar legado | refatorar_legado | 6 |
| chk-010 | Antes de preparar produto técnico | preparar_produto_tecnico | 6 |

---

## 5. Matrizes criadas

| Código | Título | Tipo |
|---|---|---|
| CP-TEC-005 | Matriz Onde Mora Técnico | matriz |

As demais matrizes (Matriz App x Módulo x Adaptação, Matriz de Reaproveitamento Técnico, Matriz de Gravidade de Erros, Matriz de Status de Módulos, Matriz de Validação Cruzada) estão pendentes para versões futuras.

---

## 6. Registros/evidências criados

| Código | Título | Tipo |
|---|---|---|
| CP-TEC-009 | ADR para decisão estrutural | registro |

---

## 7. Decisões propostas (lacunas/validações)

| ID | Título | Status | Validação necessária |
|---|---|---|---|
| dec-003 | Stack técnica obrigatória ou preferencial? | proposta | Sávio, Cássio, Pietro |
| dec-004 | Padrão final de produtos técnicos Loze | proposta | Sávio, Cássio, Pietro, Kane/Rodrigues |
| dec-005 | Separação tecnologia interna x soluções para clientes | proposta | César, Kane/Rodrigues |
| dec-006 | Módulos plugáveis SagB como padrão geral Loze? | proposta | Sávio, Pietro |
| dec-007 | Documentação pública, interna e restrita — critérios | proposta | Pietro, Pedro, Alice |
| dec-008 | Ferramenta oficial de observabilidade | proposta | Sávio, Cássio |

---

## 8. Dependências registradas

| Área | Responsável | Dependência | Padrões vinculados |
|---|---|---|---|
| UX/UI | Alice Montini | UI, design, experiência | CP-TEC-013 |
| Segurança | Pedro Gazan | RLS, credenciais, logs sensíveis | CP-TEC-007, CP-TEC-008, CP-TEC-013 |
| Agentes | Pierre Zanulli | MCPs, automações, orquestração | CP-TEC-014 |
| Modelos IA | Klaus Wagen | APIs de IA, fornecedores, RAI | - |
| Processos | Yuri Sague | TaskZei, execução, registros | - |
| Curadoria | Pietro Carboni | Classificação normativa, aprovação | Todos CP-TEC |
| Estratégia | Kane/Rodrigues | Direção Loze/SagB | CP-TEC-001, CP-TEC-015 |

---

## 9. Arquivos alterados

| Arquivo | Tipo de alteração |
|---|---|
| [`data/fallbackData.ts`](00_sagb/src/modules/central_padroes/data/fallbackData.ts) | Modificado — dados expandidos |
| [`CHANGELOG.md`](00_sagb/src/modules/central_padroes/CHANGELOG.md) | Modificado — entrada v1.3.0 |
| [`DECISIONS.md`](00_sagb/src/modules/central_padroes/DECISIONS.md) | Modificado — decisões ET-09 |
| [`docs/07_validacoes/central-padroes-et-09-curadoria-savio-tecnica.md`](00_sagb/src/modules/central_padroes/docs/07_validacoes/central-padroes-et-09-curadoria-savio-tecnica.md) | Criado — este relatório |

---

## 10. Build

Pendente — executar `npm run build` na raiz do SagB.

---

## 11. Pendências

1. **Validação de Pietro** — aprovar os padrões CP-TEC-001 a CP-TEC-015 como canônicos ou solicitar ajustes.
2. **Matriz App x Módulo x Adaptação** — extrair do v1.1 e cadastrar como padrão tipo matriz.
3. **Matriz de Reaproveitamento Técnico** — extrair do v1.1 e cadastrar.
4. **Matriz de Gravidade de Erros** — definir critérios e cadastrar.
5. **Matriz de Status de Módulos** — extrair do v1.1 e cadastrar.
6. **Matriz de Validação Cruzada** — definir critérios e cadastrar.
7. **Registro de erro técnico** — criar padrão tipo registro para logs de erro.
8. **Registro de incidente técnico** — criar padrão tipo registro.
9. **Log de deploy** — criar padrão tipo registro.
10. **Evidência de validação** — criar padrão tipo registro.
11. **Registro de rollback** — criar padrão tipo registro.
12. **Registro de refatoração** — criar padrão tipo registro.
13. **Changelog técnico** — criar padrão tipo registro.
14. **Stack técnica obrigatória** — decisão dec-003 precisa ser validada.
15. **Separação interno x cliente** — decisão dec-005 precisa de César e Kane/Rodrigues.
16. **Módulos plugáveis Loze** — decisão dec-006 precisa de análise comparativa.
17. **Documentação níveis de acesso** — decisão dec-007 precisa de Alice e Pedro.
18. **Ferramenta de observabilidade** — decisão dec-008 precisa ser definida.

---

## 12. Próximos passos recomendados

1. Pietro validar este relatório e aprovar os padrões.
2. Sávio revisar os padrões CP-TEC-001 a CP-TEC-015 e confirmar alinhamento.
3. Alice e Pedro validarem CP-TEC-013 (documentação sensível).
4. Pierre validar CP-TEC-014 (MCP técnico x MCP de agente).
5. César e Kane/Rodrigues validarem CP-TEC-015 (separação interno x cliente).
6. Extrair matrizes faltantes do v1.1.
7. Criar registros/evidências faltantes.
8. Validar stack técnica (dec-003).

---

*Relatório gerado automaticamente pela ET-09. Cássio/Procássio — 2026-06-01.*
