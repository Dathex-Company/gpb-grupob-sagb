# padrao_agentes_responsaveis

## objetivo

Manter a matriz oficial de responsabilidade entre agentes e módulos do SagB, alinhada ao runtime real.

## precedência canônica

Este documento é operacional e não substitui normas transversais.
Em qualquer conflito, prevalece [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md).

## regras de referência desta matriz

1. Lista oficial de módulos vem de [`moduleRegistry.ts`](src/core/modules/moduleRegistry.ts).
2. Owner oficial vem do campo `owner` em cada `src/modules/<id_canonico_do_modulo>/manifest.ts`.
3. Evidência operacional do agente deve existir na pasta `agent`, com os 4 arquivos canônicos:
   - `persona.md`
   - `session_log.md`
   - `falas_user.md`
   - `prompt_ativacao_cline.md`
4. Nomenclatura de módulo e arquivo segue padrão canônico (minúsculo + underscore, sem hífen/espaço/acento).

## pacotes de domínio oficiais (modelo atual)

1. governança normativa: `central_padroes`
2. api oficial de produto: `api_sagb`
3. conectores de integrações externas: `hub_integracao` (runtime atual em pasta `hub-integracao`)
4. runtime protocolar mcp: `mcp_sagb` (módulo canônico criado)
5. orquestração de workflows e bridge entre agentes: `sagb_bridge`
6. engine de workflows de processos de negócio: `fluxob`

## matriz oficial de responsabilidade (núcleo estratégico)

| modulo | dominio | owner_atual | status | evidencia_minima |
|---|---|---|---|---|
| `central_padroes` | governança | `zico_padron` | ativo | `manifest.ts` + pasta `agent` canônica |
| `api_sagb` | api oficial | `dante_conec` | ativo | `manifest.ts` + pasta `agent` canônica |
| `hub_integracao` | integrações | a definir | ativo | `manifest.ts` + pasta `agent` canônica |
| `mcp_sagb` | runtime mcp | `savio_codare` | ativo | `manifest.ts` + pasta `agent` canônica |
| `sagb_bridge` | bridge/orquestração | `alan_flow` | ativo | `manifest.ts` + pasta `agent` canônica |
| `fluxob` | workflow engine | `alan_flow` | pre_alpha | `manifest.ts` + pasta `agent` canônica |

## protocolo de nomeação e troca de owner

### nomeação

Uma nomeação só é válida quando houver atualização simultânea em:

1. `owner` do `src/modules/<id_canonico_do_modulo>/manifest.ts`
2. identificação do responsável em `agent/persona.md`
3. registro no `agent/session_log.md`
4. fala/diretriz no `agent/falas_user.md` quando houver comando humano explícito
5. atualização desta matriz

### transição

1. registrar decisão em [`decisoes_e_pendencias.md`](docs/governanca_sagb/decisoes_e_pendencias.md)
2. atualizar `manifest.ts` e `persona.md`
3. registrar handoff no `session_log.md`
4. atualizar esta matriz no mesmo ciclo

### regra anti-drift para troca de owner

- Toda troca de owner deve ser executada no **mesmo PR/ciclo**, sem exceção, com atualização sincronizada em:
  1. `src/modules/<id_canonico_do_modulo>/manifest.ts`
  2. `src/modules/<id_canonico_do_modulo>/decisions.md`
  3. `src/modules/<id_canonico_do_modulo>/changelog.md`
  4. `src/modules/<id_canonico_do_modulo>/agent/persona.md`
- Para módulo ativo, owner vazio/placeholder (`a_definir`) é não-conformidade.

## checklist de conformidade do módulo

Antes de considerar módulo conforme neste documento:

1. módulo existente no runtime (`moduleRegistry.ts`)
2. `manifest.ts` com owner definido
3. pasta `agent` com 4 arquivos canônicos
4. presença de `plano_modulo.md`, `decisions.md` e `changelog.md`
5. nomenclatura canônica sem duplicidade hífen/underscore

## integração com outros documentos

Documentos vinculados:

1. [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md)
2. [`owners_e_accountability.md`](docs/governanca_sagb/owners_e_accountability.md)
3. [`decisoes_e_pendencias.md`](docs/governanca_sagb/decisoes_e_pendencias.md)
4. [`padrao_modulos_plugaveis.md`](docs/governanca_sagb/padrao_modulos_plugaveis.md)

## manutenção

- responsável atual: pierre zanulli
- revisão obrigatória: sempre que houver criação de módulo, troca de owner ou alteração de domínio
- status: ativo
