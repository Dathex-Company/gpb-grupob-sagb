# Central de Padrões

Módulo oficial do SagB para consolidar, validar e publicar padrões de código, design,
nomenclatura e arquitetura.

## 🔵 Supabase-First (14-06-2026)

**Supabase é a fonte canônica oficial.** 267 documentos importados com hash SHA-256.

| Fonte | Papel |
|---|---|
| Supabase `central_padroes_documents` | 🔵 Fonte canônica oficial |
| `docs/` | Seed/importação/backup técnico |
| `data/officialDocumentsIndex.ts` | Apoio/fallback local |
| `data/fallbackData.ts` | Base legada preservada |
| `data/centralDocumentsManifest.ts` | Referência técnica |

RPCs: `cp_document_hash`, `cp_import_document`, `cp_create_document`.
Import: `npm run cp:docs:dry-run` / `npm run cp:docs:import`.

## Central de Padrões V1

A versão V1 transforma o módulo em portal vivo de governança com:

- Dashboard normativo.
- Biblioteca de padrões e documentos.
- Responsáveis e áreas oficiais.
- Relação com módulos plugáveis e módulos base reutilizáveis.
- Matrizes, checklists, decisões, exceções, auditorias e evidências.
- Modo Dev e Modo Agente.
- Busca textual V1 e base para grafo de relacionamentos.
- Publicador legado preservado para `governance_rules`.

## Como usar

1. Leia os padrões em [`docs/`](docs/) antes de iniciar qualquer novo módulo ou projeto.
2. Consulte o [`design-system.md`](docs/design-system.md) para tokens visuais e diretrizes de interface.
3. Consulte o [`stack-e-infra.md`](docs/stack-e-infra.md) para padrão técnico.
4. Registre desvios explicitamente com justificativa técnica em [`DECISIONS.md`](DECISIONS.md).

## Ativos Reutilizáveis

| Ativo | Tipo | Onde encontrar |
|---|---|---|
| Catálogo único de padrões | Documentação | [`docs/`](docs/) |
| Design System | Tokens visuais | [`docs/design-system.md`](docs/design-system.md) |
| Stack e Infra | Padrão técnico | [`docs/stack-e-infra.md`](docs/stack-e-infra.md) |
| Portal V1 | Governança operacional | [`docs/implantacao_v1/central-padroes-run-01.md`](docs/implantacao_v1/central-padroes-run-01.md) |

## Riscos de Duplicação

- Padrões paralelos em docs soltos podem gerar conflitos de implementação.
- **Prevenção:** toda decisão de padrão deve ser registrada em [`DECISIONS.md`](DECISIONS.md) e referenciada aqui.

## Links

- [Padrão de Módulos Plugáveis](../../docs/governanca_sagb/padrao_modulos_plugaveis.md)
- [Padrão Unificado de Governança](../../docs/governanca_sagb/padrao_unificado_governanca.md)


## Curadoria Geral das Divisões

Em 2026-06-01 foi carregada operacionalmente a Curadoria Geral das Divisões da Central de Padrões (ET-10 a ET-20), usando a ET-09 do Sávio como modelo. A carga inclui documentos-mãe, itens normativos atômicos, checklists, matrizes, registros/evidências, decisões propostas/lacunas e dependências por área. A canonicidade final permanece pendente de validação Pietro.
