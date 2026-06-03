# NIDE

**Núcleo Inteligente de Desenvolvimento de Estruturas**

Módulo-mãe de governança e desenvolvimento estrutural do SagB.

O antigo módulo **Missões** foi absorvido como core funcional (ET 03/08).  
**Metodologias** foi migrado como domínio plugável (ET 05/08).  
**Mentorias** foi migrado como domínio plugável (ET 06/08).

A **ET 09/10** realizou a limpeza controlada pós-migração: Missões, Metodologias e Mentorias foram ocultados do menu global. NIDE passou a ser a única entrada principal no sidebar do SagB.

## Status

- **Versão:** 0.6.0
- **Status:** Core funcional (Missões) + 2 domínios reais (Metodologias, Mentorias) + 11 domínios planejados
- **Fullscreen:** Sim (hideSidebar + hideHeader)
- **Menu global:** ✅ Apenas NIDE (Missões, Metodologias, Mentorias ocultados)

## Estrutura

```
src/modules/nide/
├── index.ts              # Barrel export
├── manifest.ts           # ModuleManifest
├── routes.tsx            # ModuleRoute (fullscreen)
├── module-doc.ts         # ModuleDoc
├── README.md             # Este arquivo
├── DECISIONS.md          # Registro de decisões
├── CHANGELOG.md          # Histórico de versões
├── PLANNED.md            # Roadmap
├── core/                 # Shell, Provider, constantes
├── shell/                # Sidebar, Header, DomainNav
├── registry/             # Registry interno de domínios plugáveis
├── layout/               # FullscreenLayout
├── domains/              # Domínios plugáveis
│   ├── README.md
│   ├── metodologias/     # ✅ Domínio Metodologias
│   ├── mentorias/        # ✅ Domínio Mentorias
│   └── placeholders/     # Placeholders planejados
├── pages/                # Páginas do NIDE
├── components/           # Componentes compartilhados
├── hooks/                # Hooks
├── services/             # Serviços
├── store/                # Estado global + runtimeBridge
├── types/                # Tipos
├── docs/                 # Documentação
└── agent/                # Persona e prompts do agente
```

## Domínios ativos

| Domínio | Status | Categoria | Onde está |
|---------|--------|-----------|-----------|
| Missões | ✅ Core | core | `core/missions/` |
| Metodologias | ✅ Migrado | estrutura | `domains/metodologias/` |
| Mentorias | ✅ Migrado | ensino | `domains/mentorias/` |

## Domínios planejados

Treinamentos, Cursos, Programas, Jornadas, Frameworks, Processos e Fluxogramas, Protocolos, Ferramentas, Padrões de Entrega, Arquitetura de Negócios e Ventures.

## Navegação

O NIDE utiliza a sidebar esquerda para navegação entre domínios.

### Rotas oficiais

| Rota | Conteúdo | Status |
|------|----------|--------|
| `/nide` | NIDE — entrada principal (sidebar de domínios) | ✅ Oficial |
| `/nide/metodologias` | Metodologias (dentro do NIDE) | ✅ Oficial (hash routing) |
| `/nide/mentorias` | Mentorias (dentro do NIDE) | ✅ Oficial (view routing) |

### Rotas legadas (com alias para NIDE)

| Rota | Conteúdo | Status |
|------|----------|--------|
| `/missoes` / `missions` | Alias → `/nide` | 🔶 Legado c/ alias |
| `/metodologias` | Alias → `/nide` | 🔶 Legado c/ alias |
| `/mentorias` | Alias → `/nide` | 🔶 Legado c/ alias |

### Menu global — antes e depois

| Estado | Entradas no sidebar |
|--------|---------------------|
| Antes (ET 08) | NIDE + Missões + Metodologias + Mentorias |
| Depois (ET 09) | ✅ **Apenas NIDE** como entrada principal |

## Documentação complementar

- [`DECISIONS.md`](DECISIONS.md) — registro de decisões arquiteturais
- [`CHANGELOG.md`](CHANGELOG.md) — histórico de versões
- [`PLANNED.md`](PLANNED.md) — roadmap
- [`docs/domain-plugin-standard.md`](docs/domain-plugin-standard.md) — padrão de migração de domínios
