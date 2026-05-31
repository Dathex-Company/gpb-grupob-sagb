# Central de Padrões

Módulo oficial do SagB para consolidar, validar e publicar padrões de código, design,
nomenclatura e arquitetura. Serve como a fonte única da verdade para todas as regras
que os módulos e QGs do ecossistema devem seguir.

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
