# Plano — Liga/Desliga Real de Módulos (Runtime)

## Objetivo
Transformar o controle de módulos de visual para funcional, com persistência e aplicação única no menu e no carregamento de conteúdo.

## Escopo implementado
- Leitura dinâmica dos módulos a partir do registry.
- Persistência de ativação por módulo com escopo de workspace.
- Fonte única para decisão de módulo ativo/inativo.
- Aplicação do filtro no Sidebar e no carregamento/renderização das rotas dinâmicas.
- Fallback seguro para tab desativada/inexistente.

## Componentes técnicos
- Serviço central: `src/core/modules/moduleActivation.ts`
- Consumo no painel de configurações: `src/modules/configuracoes-ambiente/pages/ConfigAmbientePage.tsx`
- Consumo no Sidebar: `components/Sidebar.tsx`
- Consumo no runtime de renderização: `App.tsx`

## Fluxo funcional
1. Novo módulo é registrado no registry.
2. O painel de configurações lista os manifests dinamicamente.
3. O toggle altera estado persistido por workspace.
4. Sidebar e App reagem ao evento de alteração e reaplicam filtros.
5. Módulo OFF some da navegação e não renderiza conteúdo.
6. Módulo ON volta imediatamente sem rebuild.

