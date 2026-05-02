# Padrão de Módulos Plugáveis — SagB

Este documento descreve a estrutura arquitetural e de arquivos obrigatória para a criação de um **Módulo Oficial** no SagB, conforme definido no contrato de código `src/core/modules/module.types.ts`.

## precedência canônica

Este documento é uma norma operacional de módulo e deve respeitar a norma transversal em [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md).

Em caso de conflito, prevalece [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md).

## 1. Estrutura de Diretórios Básica

Todo novo módulo deve residir em `src/modules/<id_canonico_do_modulo>/` e seguir estritamente a taxonomia abaixo.

Regra de nomenclatura obrigatória:
- minúsculas
- `_` (underscore) como separador
- sem hífen, sem espaço, sem acento

> **Obrigatórios:** arquivos de contrato técnico, governança e operação do agente.
> **Complementares:** estruturas de UI, serviços e documentação auxiliar.

```text
src/modules/<id_canonico_do_modulo>/
├── index.ts                     # Ponto de exportação do módulo (manifest e rotas)
├── manifest.ts                  # Configuração visual e metadados do módulo (implementa ModuleManifest)
├── module-doc.ts                # Documentação técnica e estratégica do módulo
├── routes.tsx                   # Definição das rotas React (implementa ModuleRoute)
├── plano_modulo.md              # Planejamento oficial do módulo (obrigatório)
├── changelog.md                 # Histórico de versionamento e mudanças do módulo (obrigatório)
├── decisions.md                 # Decisões consolidadas e justificadas do módulo (obrigatório)
│
├── agent/                       # QG do Agente
│   ├── prompt_ativacao_cline.md # Prompt oficial de ativação (obrigatório)
│   ├── persona.md               # Identidade, missões e tom de voz do agente do módulo
│   ├── session_log.md           # Log Contínuo de sessões (seguindo o Protocolo de Log)
│   └── falas_user.md            # Fala literal do usuário (obrigatório)
│
├── pages/                       # Telas React
│   └── <Modulo>Page.tsx         # Página(s) principal(is)
│
├── components/                  # Componentes React exclusivos do módulo
├── services/                    # Lógica de API e conexão com Supabase do módulo
├── store/                       # Estado local (Zustand) do módulo
└── docs/                        # Documentos auxiliares e referências em markdown
```

### 1.1 Regra de localização do prompt de ativação

- Local **canônico obrigatório**: `agent/prompt_ativacao_cline.md`
- `prompt_ativacao_cline.md` na raiz do módulo é considerado **legado** e não deve ser criado em módulos novos.

Para módulos novos, o caminho canônico em `agent/` deve existir obrigatoriamente.

### 1.1.1 Regra de ownership

- O owner oficial do módulo deve ser declarado em `manifest.ts` no campo `owner`.
- Não usar `agent/owner.md` como arquivo obrigatório de governança.
- Para módulo com status ativo, o owner não pode estar vazio, placeholder (`a_definir`) ou valor equivalente.
- Troca de owner só é válida com atualização no mesmo PR/ciclo de: `manifest.ts`, `decisions.md`, `changelog.md` e `agent/persona.md`.

### 1.2 Papel de cada trilha documental (sem sobreposição)

- `decisions.md`: síntese decisória (o que foi decidido e por quê).
- `changelog.md`: mudanças/versionamento do módulo (o que foi entregue/alterado).
- `plano_modulo.md`: planejamento executivo e trilha de evolução do módulo.
- `agent/session_log.md`: histórico oficial e log operacional turno a turno do agente.
- `agent/falas_user.md`: trilha literal de falas do usuário.
- `history-chat.md` e `history_chat.md`: legados. Não criar em módulos novos e remover em padronizações canônicas.

## 2. Contrato de Exportação

Todo módulo deve exportar seu `manifest` e suas `routes` no arquivo `index.ts`, para que seja consumível pelo `moduleRegistry.ts`.

Exemplo:
```typescript
export { manifest as centralPadroesManifest } from './manifest';
export { routes as centralPadroesRoutes } from './routes';
```

## 3. Registro do Módulo

Após criado, o módulo deve ser registrado na central do ecossistema:
1. Abra `src/core/modules/moduleRegistry.ts`.
2. Importe o `manifest` e as `routes` criadas.
3. Adicione o objeto no array `moduleRegistry`.

Isso fará com que o módulo apareça na página de **Configurações de Ambiente**, permitindo ligar e desligar a funcionalidade dinamicamente na "App Store" interna do SagB.

## 4. Política Visual (Faseada)

### v1 (atual)

- Todos os módulos devem seguir o **estilo global básico** do SagB.
- Base visual unificada (fonte, cores, espaçamento e tokens globais).
- Não criar paletas paralelas por módulo nesta fase.

### v2 (posterior)

- Permitida identidade visual leve por módulo, sem quebrar tokens globais.
- Customizações devem respeitar guardrails da plataforma.

## 5. Política de Versionamento

O ecossistema adota modelo híbrido:

1. **Versão global da plataforma (SagB)**
2. **Versão independente por módulo**

Padrão recomendado: **SemVer**

- `MAJOR`: quebra de contrato
- `MINOR`: nova funcionalidade compatível
- `PATCH`: correção/ajuste incremental

## 6. Fiscalização Automática (Obrigatória)

### Fase 1

- Validação automática da presença dos arquivos obrigatórios de módulo.

### Fase 2

- Validação automática de conformidade visual/tokens (regras de design system global).

Sem validação automática, a regra é considerada apenas recomendação operacional.

## 7. checklist mínimo de conformidade

Antes de considerar um módulo como canônico:

1. pasta criada em `src/modules/<id_canonico_do_modulo>/` seguindo nomenclatura oficial
2. presença de `manifest.ts`, `routes.tsx`, `index.ts`, `module-doc.ts`
3. presença de `plano_modulo.md`, `decisions.md`, `changelog.md`
4. pasta `agent` com os 4 arquivos canônicos:
   - `persona.md`
   - `session_log.md`
   - `falas_user.md`
   - `prompt_ativacao_cline.md`
5. owner declarado no `manifest.ts`
6. módulo registrado em `src/core/modules/moduleRegistry.ts`
7. conformidade visual canônica obrigatória:
   - uso de fonte **Inter** via padrão global da plataforma
   - uso obrigatório de tokens semânticos `--sagb-*` para cores, superfícies, textos e bordas
   - proibição explícita de hardcode de cor (`hex`, `rgb`, `hsl`) inline em elementos de UI estruturais
   - **tipografia interna padronizada:**
     - container raiz do módulo deve declarar `font-inter` explicitamente
     - body text em `text-[12px]` (pixel exato obrigatório; proibido `text-sm` ou `text-xs` do Tailwind scale)
     - labels decorativas e metadados em `text-[10px] font-black uppercase tracking-widest`
     - títulos de seção em `text-2xl font-black` (nunca inferior a `text-xl`)
     - hierarquia de pesos: `font-black` > `font-bold` > `font-semibold` > `font-medium`
     - proibido uso de valores fora da tabela canônica (`text-[13px]`, `text-[11px]`, etc.)
   - **header canônico do módulo (obrigatório):**
     - layout em duas colunas: título + descrição à esquerda, metadados à direita
     - badge "Módulo Oficial" em `text-[10px] font-black uppercase tracking-widest`
     - nome do módulo em `text-lg font-bold` (deve refletir `manifest.displayName`)
     - linha "Responsável: <nome>" em `text-[12px]`, lendo de `manifest.owner.displayName`
     - botão "Docs" com ícone `BookIcon`, estilo `bg-blue-600 text-white rounded-lg text-[12px] font-semibold`
     - `manifest.owner` obrigatório no formato `{ type, id, displayName }`

## 8. controle anti-drift documental (obrigatório)

Para manter coerência entre runtime e governança, aplicar estes controles mínimos:

1. **fonte da verdade por tema (sem sobreposição)**
   - contrato técnico de criação: `padrao_modulos_plugaveis.md`
   - ownership e transição: `padrao_agentes_responsaveis.md`
   - precedência transversal: `padrao_unificado_governanca.md`

2. **sincronização de owner no mesmo ciclo**
   - qualquer alteração de owner em `src/modules/<id_canonico_do_modulo>/manifest.ts`
   - exige atualização no mesmo PR/ciclo em `decisions.md`, `changelog.md` e `agent/persona.md`

3. **validação estrutural cruzada**
   - módulo presente no `moduleRegistry.ts`
   - owner válido no `manifest.ts`
   - pasta `agent` com os 4 arquivos canônicos
   - presença da tríade `plano_modulo.md`, `decisions.md`, `changelog.md`

Em caso de conflito de interpretação, prevalece `padrao_unificado_governanca.md`.
