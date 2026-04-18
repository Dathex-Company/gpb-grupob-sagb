# Padrão Oficial GrupoB — QGs e Módulos Vendáveis

## Objetivo

Estabelecer o padrão único para:

1. construção de QGs dentro do repositório SagB
2. criação de módulos reutilizáveis/vendáveis a partir dos QGs
3. continuidade de governança (owner humano + agente + histórico + decisões)

> Escopo deste documento: **origem QG -> produto vendável**.
> Estrutura técnica padrão de módulo plugável no runtime SagB é definida em `docs/governanca/padrao_modulos_plugaveis.md`.

---

## Estrutura base por QG

```txt
_qgs/
  [qg-id]/
    _readme.md
    modules/
      [modulo-vendavel]/
        manifest.ts
        module-doc.ts
        changelog.md
        agent/
          owner.md
          persona.md
```

> Observação: no estágio inicial, o QG pode apontar para fonte em `docs/QGs GrupoB/*` via `data/qgRegistry.ts`.

---

## Contrato mínimo de um módulo vendável

Todo módulo que nascer em um QG e tiver potencial comercial deve ter, no mínimo:

1. `manifest.ts` (identidade técnica e rota)
2. `module-doc.ts` (contexto oficial, escopo, integrações)
3. `changelog.md` (histórico próprio)
4. `agent/owner.md` (responsável humano)
5. `agent/persona.md` (agente operador)

Sem esses 5 itens, o módulo fica como `PARCIAL` para comercialização.

---

## Fluxo de transformação (QG -> Produto)

1. **Nasce no QG** como módulo operacional interno.
2. **Padroniza governança** (arquivos mínimos acima).
3. **Valida maturidade funcional** (uso real + estabilidade).
4. **Classifica estratégia** no `qgRegistry`:
   - `operacao-interna`
   - `produto-vendavel`
   - `hibrido`
5. **Extrai/empacota** para oferta comercial mantendo trilha de continuidade.

---

## Regras de governança

1. Todo QG deve existir no `data/qgRegistry.ts`.
2. Toda mudança relevante deve ser registrada no `changelog.md` do módulo.
3. Todo módulo vendável deve ter owner principal e backup nomeados.
4. Decisão sem responsável explícito não fecha ciclo de governança.
