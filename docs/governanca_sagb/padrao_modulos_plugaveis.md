# Padrão de Módulos Plugáveis — SagB

Este documento descreve a estrutura arquitetural e de arquivos obrigatória para a criação de um **Módulo Oficial** no SagB, conforme definido no contrato de código `src/core/modules/module.types.ts`.

## 1. Estrutura de Diretórios Básica

Todo novo módulo deve residir em `src/modules/<nome-do-modulo>/` e seguir estritamente a taxonomia abaixo.

> **Obrigatórios:** arquivos de contrato técnico, governança e operação do agente.
> **Complementares:** estruturas de UI, serviços e documentação auxiliar.

```text
src/modules/<nome-do-modulo>/
├── index.ts                     # Ponto de exportação do módulo (manifest e rotas)
├── manifest.ts                  # Configuração visual e metadados do módulo (implementa ModuleManifest)
├── module-doc.ts                # Documentação técnica e estratégica do módulo
├── routes.tsx                   # Definição das rotas React (implementa ModuleRoute)
├── changelog.md                 # Histórico de versionamento e mudanças do módulo (obrigatório)
├── decisions.md                 # Decisões consolidadas e justificadas do módulo (obrigatório)
├── prompt_ativacao_cline.md     # Prompt oficial de inicialização do Agente Guardião (opcional, ver regra)
│
├── agent/                       # QG do Agente
│   ├── prompt_ativacao_cline.md # Local preferencial do prompt de ativação
│   ├── persona.md               # Identidade, missões e tom de voz do agente do módulo
│   ├── owner.md                 # Responsável humano (Accountability)
│   ├── session_log.md           # Log Contínuo de sessões (seguindo o Protocolo de Log)
│   └── _triagem/                # Inbox isolado para logs brutos, rascunhos e contexto pré-processamento
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

- Local **preferencial**: `agent/prompt_ativacao_cline.md`
- Local **aceito por compatibilidade**: `prompt_ativacao_cline.md` na raiz do módulo

Ao menos um dos dois caminhos deve existir.

### 1.2 Papel de cada trilha documental (sem sobreposição)

- `decisions.md`: síntese decisória (o que foi decidido e por quê).
- `changelog.md`: mudanças/versionamento do módulo (o que foi entregue/alterado).
- `agent/session_log.md`: histórico oficial e log operacional turno a turno do agente.
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
