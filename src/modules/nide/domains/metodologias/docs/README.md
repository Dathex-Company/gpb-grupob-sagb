# Metodologias — Domínio Interno do NIDE

## Status

**Versão:** 0.1.0 (migrado como domínio plugável)  
**Status:** Active  
**Migrado em:** ET 05/08  
**Módulo original:** `src/modules/metodologias/` (preservado como fallback)

## Propósito

Domínio especialista para estruturação, governança, versionamento e aplicação de metodologias proprietárias do SagB dentro do NIDE.

## Estrutura Mantida

```
domains/metodologias/
├── index.ts              # Barrel
├── domain-manifest.ts    # NideDomainManifest
├── routes.tsx            # Rota interna
├── pages/                # Páginas (HubPage + subpáginas)
├── components/           # Componentes específicos
├── hooks/                # Hooks
├── services/             # 10 services (mesma lógica original)
├── types/                # Tipos
├── data/                 # Dados mockados
├── store/                # Store (vazio, preservado)
├── docs/                 # Documentação
└── agent/                # Persona e prompts do agente
```

## O que foi preservado

- Toda a lógica de HubPage, Mesa, Catálogo, Saúde, Ativo, Edição
- Todos os services (canonico snapshot, catalog, comparação canônica, indicadores, mesa operacional, persistência, promoção assistida, relações visuais, snapshot lifecycle)
- Todos os tipos
- Componentes (AtivoDetalheCamadas, MetodologiasFrontCard, MetodologiasInternalMenu)
- Hooks
- Dados mockados
- Agente especialista

## O que foi ajustado

- **Apenas um import** em `services/metodologiasPersistencia.ts`: ajustado o path de `../../../../services/supabase` para `../../../../../services/supabase` (devido à profundidade adicional do diretório)
- Navegação hash-based preservada (rota interna `/nide/metodologias` com hash `#/metodologias/...`)

## Módulo original

O módulo original em `src/modules/metodologias/` foi **preservado como fallback temporário**. Ele continua:
- Registrado no moduleRegistry global
- Acessível via rota `/metodologias`
- Com todos os seus dados e services intactos

A limpeza e remoção do fallback será feita em etapa futura (ET 07/08).
