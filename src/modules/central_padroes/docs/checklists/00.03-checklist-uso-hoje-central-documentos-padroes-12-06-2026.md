# ✅ Checklist de Uso Hoje — Central de Documentos e Padrões — 12-06-2026

| Pergunta | Status | Observação |
|---|---|---|
| Posso criar documento hoje? | 🟡 Sim, com ressalva | Para documento persistente real, usar Relatórios, Auditorias ou Curadoria; tela Documentos ainda é acervo/fallback. |
| Posso encontrar documento hoje? | 🟢 Sim | Pela busca da própria tela CRUD usando título, owner, caminho, tags, tipo, categoria, status, risco e datas. |
| Posso registrar auditoria hoje? | 🟢 Sim | CRUD auth pronto em `central_padroes_audits`. |
| Posso registrar relatório hoje? | 🟢 Sim | CRUD auth pronto em `central_padroes_reports`. |
| Posso registrar curadoria hoje? | 🟢 Sim | CRUD auth pronto em `central_padroes_curadoria`. |
| Posso registrar LOZE-TRACE hoje? | 🟢 Sim | Criação/listagem pronta em `central_padroes_trace_logs`. |
| Posso confiar na busca? | 🟡 Sim, com ressalva | Busca por tela foi ampliada; busca global ainda não indexa CRUDs novos. |
| Posso confiar nos filtros? | 🟢 Sim | Filtros de status/risco nos CRUDs principais. |
| Posso confiar nos caminhos copiáveis? | 🟢 Sim | Copia caminho absoluto/relativo; se vazio, mostra erro amigável. |
| Posso usar no dark mode? | 🟢 Sim | Integrado ao tema global do SagB. |
| Posso usar sem quebrar tela? | 🟢 Sim | Navegação por sidebar cobre todas as entradas; placeholders têm CTA. |

## Regra prática para não perder documento

Ao salvar qualquer item, preencher obrigatoriamente:

- título claro;
- tipo;
- categoria;
- status;
- risco;
- owner;
- caminho absoluto;
- caminho relativo;
- tags;
- resumo com contexto.

## Ressalva principal

A busca global da Central ainda não deve ser o único meio de recuperação de registros novos. Usar também a busca da tela específica.
