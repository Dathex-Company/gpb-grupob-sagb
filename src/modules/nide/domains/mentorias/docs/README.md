# Mentorias — Domínio Interno do NIDE

## Status

**Versão:** 0.1.0 (migrado como domínio plugável)  
**Status:** Active  
**Migrado em:** ET 06/08 (Megaetapa 06-08)  
**Módulo original:** `src/modules/mentorias/` (preservado como fallback)

## Propósito

Domínio especialista para estruturação, aplicação, acompanhamento, versionamento e evolução de mentorias dentro do NIDE.

## Estrutura Mantida

```
domains/mentorias/
├── index.ts              # Barrel
├── domain-manifest.ts    # NideDomainManifest
├── routes.tsx            # Rota interna (MentoriasDomainContainer)
├── pages/                # Páginas (Dashboard, Library, Detail)
├── hooks/                # Hooks (useMentorias, useMentoriaDetail)
├── services/             # Service (mentorias.service.ts — 570 linhas)
├── store/                # Store (mentorias.store.ts — preparado para Zustand)
├── types/                # Tipos
├── docs/                 # Documentação
└── agent/                # Persona e prompts do agente
```

## O que foi preservado

- Toda a lógica de Dashboard, Biblioteca e Detalhe
- Service de CRUD com Supabase (mentorias.service.ts)
- Hooks (useMentorias, useMentoriaDetail)
- Tipos (Mentoria, MentoriaBloco, MentoriaMaterial, etc.)
- Store preparada para Zustand
- Agente especialista (persona, prompts, falas)

## O que foi ajustado

- **4 imports** foram ajustados (devido à profundidade adicional do diretório):

| Arquivo | Import antigo | Import novo |
|---------|---------------|-------------|
| `services/mentorias.service.ts` | `../../../../services/supabase` | `../../../../../services/supabase` |
| `pages/MentoriaDetailPage.tsx` | `../../../../components/Icon` | `../../../../../components/Icon` |
| `pages/MentoriasDashboardPage.tsx` | `../../../../components/MetricCard` | `../../../../../components/MetricCard` |
| `pages/MentoriasDashboardPage.tsx` | `../../../../components/Icon` | `../../../../../components/Icon` |
| `pages/MentoriasLibraryPage.tsx` | `../../../../components/Icon` | `../../../../../components/Icon` |

## Diferenças do MentoriasModuleContainer original

O `MentoriasDomainContainer` (`routes.tsx` do domínio) foi adaptado:
- **Removido**: botão "Voltar ao SagB" (quem gerencia isso é o NideShell)
- **Removido**: fullscreen próprio (o NideShell já é fullscreen)
- **Preservado**: sidebar interna própria (Dashboard + Biblioteca)
- **Preservada**: lógica de navegação interna (view state)

## Módulo original

O módulo original em `src/modules/mentorias/` foi **preservado como fallback temporário**. Ele continua:
- Registrado no moduleRegistry global
- Acessível via rota `/mentorias`
- Com todos os seus dados e services intactos

A limpeza e remoção do fallback será feita em etapa futura.
