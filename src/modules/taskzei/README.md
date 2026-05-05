# TaskZei — Agenda Inteligente

Módulo plugável do ecossistema SagB para gestão operacional de tarefas, agenda inteligente, projetos, processos e integrações de produtividade.

## Identidade

| Campo           | Valor                        |
|-----------------|------------------------------|
| **ID canônico** | `agenda`                     |
| **InternalName**| `TaskZei`                    |
| **DisplayName** | Agenda Inteligente           |
| **Status**      | `active`                     |
| **Versão**      | `1.6.0`                      |
| **Owner**       | Dani Freitas                 |
| **Rota base**   | `/agenda-inteligente`        |

## Estrutura de Arquivos

```
src/modules/taskzei/
├── manifest.ts               # Contrato do módulo (ID, rotas, owner)
├── module-doc.ts             # Documentação técnica tipada (ModuleDoc)
├── plano_modulo.md           # Plano de evolução do módulo
├── changelog.md              # Histórico de versões
├── decisions.md              # Registro de decisões arquiteturais
├── routes.tsx                # Rotas do módulo
├── index.ts                  # Ponto de exportação
├── agent/                    # Pasta do agente responsável
│   ├── persona.md
│   ├── session_log.md
│   ├── falas_user.md
│   └── prompt_ativacao_cline.md
├── components/               # Componentes React
├── layout/                   # Layout do módulo
├── pages/                    # Páginas do módulo
├── services/                 # Camada de serviços (facade, adapters, providers)
├── store/                    # Estado global (Zustand)
├── types/                    # Tipos TypeScript
└── docs/                     # Documentação adicional
```

## Stack

- **Runtime:** React 18 + TypeScript
- **Estado:** Zustand
- **Estilo:** Tailwind CSS (com tokens Semânticos SagB pendentes de migração)
- **Persistência:** localStorage (mock provider) → Supabase (planejado)
- **Build:** Vite

## Conformidade

- [x] `manifest.ts` com owner declarado
- [x] `module-doc.ts` implementa `ModuleDoc` (interface tipada)
- [x] Pasta `agent/` com 4 arquivos canônicos
- [x] Registrado em `src/core/modules/moduleRegistry.ts`
- [ ] Conformidade visual canônica (hex inline pendente de migração para tokens `--sagb-*`)

## Owner

**Dani Freitas** — Produto TaskZei  
Dúvidas técnicas: Cássio Mendes (engenharia)  
Dúvidas estratégicas: Douglas (GrupoB)
