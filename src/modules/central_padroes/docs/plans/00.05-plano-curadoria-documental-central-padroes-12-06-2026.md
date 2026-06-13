# 🧭 Plano de Curadoria Documental — Central de Padrões — 12-06-2026

## 📌 Resumo
Plano para decidir o destino dos documentos preservados em docs/99-curadoria após a limpeza estrutural.

## ✅ Manter
| Item | Motivo | Próxima ação |
|---|---|---|
| docs/standards | Padrões oficiais atuais | Manter como fonte canônica |
| docs/audits | Auditorias oficiais recentes | Manter no padrão visual |
| docs/reports | Relatórios e LOZE-TRACE | Manter e revisar periodicamente |
| docs/README.md | Índice humano | Atualizar sempre que houver reorganização |

## 🟡 Revisar
| Item | Motivo | Próxima ação |
|---|---|---|
| docs/99-curadoria/fora-do-padrao | Documentos úteis soltos ou com naming antigo | Classificar um a um |
| docs/99-curadoria/legado | Acervo histórico | Identificar documentos canônicos reaproveitáveis |
| docs/plans com prefixos antigos | Planos úteis com nome fora do padrão novo | Criar versões canonizadas se necessário |

## 🧩 Fundir
| Item | Possível destino | Critério |
|---|---|---|
| Inventários técnicos | docs/overview ou docs/reports | Se forem atuais e úteis |
| Stack/infra | docs/standards | Se virar padrão oficial |
| Design system | docs/standards ou docs/guides | Se for regra ativa |
| ADRs antigas | docs/decisions | Se forem decisões vigentes |

## 🟠 Mover para legado
| Item | Critério |
|---|---|
| Documentos históricos sem aplicação atual | Manter em legado, não apagar |
| Relatórios de etapas antigas | Manter como evidência histórica |
| Rollbacks antigos | Manter se vinculados a migrations passadas |

## 🔴 Apagar somente depois de aprovação
| Item | Condição |
|---|---|
| Duplicados exatos | Confirmar que há cópia canônica |
| Arquivos vazios | Confirmar sem valor histórico |
| Lixo técnico futuro | Pode apagar se não for documento útil |

## ➡️ Próximos passos
1. Inventariar arquivos em docs/99-curadoria/fora-do-padrao.
2. Definir documento canônico para cada tema.
3. Criar versões novas em kebab-case com data dd-mm-aaaa quando necessário.
4. Registrar decisão antes de apagar qualquer documento útil.
