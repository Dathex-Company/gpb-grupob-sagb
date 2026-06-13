# 🧭 Índice Humano — Central de Documentos e Padrões

## 📌 O que é
A Central de Documentos e Padrões é o módulo oficial para documentos, padrões, decisões, checklists, auditorias, planos, relatórios, LOZE-TRACE e curadoria da Loze/SagB.

## 🧭 Como navegar
| Área | Pasta/Tela | Uso |
|---|---|---|
| Documentos | docs/ e tela Documentos | Registrar e consultar documentos |
| Padrões | docs/standards e tela Padrões | Regras oficiais |
| Decisões | docs/decisions e tela Decisões | ADRs e exceções |
| Checklists | docs/checklists e tela Checklists | Validações operacionais |
| Auditorias | docs/audits e tela Auditorias | Achados e evidências |
| Relatórios | docs/reports e tela Relatórios | Relatórios técnicos |
| Planos | docs/plans | Planos de execução |
| Curadoria | docs/99-curadoria | Legado, duplicados e fora do padrão |

## 📖 Ler primeiro
1. Este README.
2. docs/overview/00.06-mapa-documental-central-padroes-12-06-2026.md.
3. docs/reports/01.13-relatorio-loze-trace-refatoracao-central-padroes-12-06-2026.md.
4. docs/reports/01.21-relatorio-refatoracao-funcional-central-padroes-12-06-2026.md.

## ✅ Como registrar novo padrão
Criar pela tela Padrões ou documentar em docs/standards com nome kebab-case, data dd-mm-aaaa, status, risco, owner e decisão relacionada quando aplicável.

## ⚙️ Como registrar LOZE-TRACE
Registrar comando, pasta, objetivo, risco R0-R6, resultado, erro, arquivos afetados e observação em docs/reports ou futuramente em central_padroes_trace_logs.

## 🛡️ Regras
Não expor secrets, não usar service role no frontend, não aplicar migration remota sem classificar risco R5 e não apagar documento útil sem curadoria.
