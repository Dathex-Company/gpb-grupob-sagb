# Changelog do Módulo configuracoes-ambiente

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **configuracoes-ambiente**.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.

## [v1.1.0-runtime-module-toggle] - 2026-05-02

### Alterado
- Controle de módulos deixou de ser apenas visual e passou a ser funcional em runtime.
- Sidebar passou a consumir estado central de ativação de módulos.
- Renderização dinâmica no App passou a validar status de ativação antes de renderizar módulos registrados.

### Adicionado
- Serviço central de ativação/persistência de módulos em `src/core/modules/moduleActivation.ts`.
- Plano técnico da entrega em `src/modules/configuracoes-ambiente/plano.md`.

### Resultado
- Toggle OFF remove navegação e bloqueia renderização do módulo.
- Toggle ON reabilita imediatamente sem rebuild.
- Persistência mantida por escopo de workspace no localStorage.

## [v1.2.0-ui-redesign] - 2026-05-02

### Alterado
- Interface do módulo migrada do layout de cards+modais para grid com sub-sidebar + painel de conteúdo (padrão Monitoramento).
- ConfigAmbientePage.tsx reescrito com grid `lg:grid-cols-[280px_1fr]`.
- "Configurações do Sistema" removido do sidebar — acesso exclusivo pelo botão da barra superior direita.

### Adicionado
- Catálogo de 7 categorias de configuração em `configuracoesCatalog.ts`.
- Componente `ConfiguracoesInternalMenu.tsx` (sub-sidebar com navegação entre categorias).
- Placeholders estruturais para: Idioma e Região, Notificações, Perfil do Usuário, Privacidade e Dados, Atalhos de Teclado.

### Removido
- Texto "beta" da interface do módulo.
- Badges de ID interno (`module.id`) e "Ativo/Inativo" da lista de módulos (toggle é suficiente).
- Seção "Informações Técnicas" no rodapé da página.

## [v1.3.0-module-reorder] - 2026-05-02

### Adicionado
- Funções de ordenação personalizada de módulos em `moduleActivation.ts`: `readModuleOrder`, `writeModuleOrder`, `readModuleOrderLocked`, `writeModuleOrderLocked`, `sortModulesByOrder`.
- Cadeado 🔒/🔓 na seção "Módulos" do ConfigAmbientePage que libera/bloqueia reordenação por drag and drop.
- HTML5 Drag and Drop nativo na lista de módulos (sem bibliotecas extras).
- Persistência da ordem em localStorage (`sagb:module-order:v1`).
- Sincronização cross-componente via evento `sagb:module-order-changed`.
- Sidebar passou a respeitar a ordem personalizada dos módulos.

### Alterado
- `ConfigAmbientePage.tsx`: lista de módulos agora usa `sortedModules` ordenada por `sortModulesByOrder`.
- `Sidebar.tsx`: `dynamicModules` passou a ser ordenado por `sortModulesByOrder(modules, moduleOrder)`.

### Resultado
- Usuário pode travar/destravar a ordenação com um clique no cadeado.
- Destravado → alça de arrasto aparece, itens podem ser reposicionados por drag and drop.
- Travado → lista estática, sem risco de mover acidentalmente.
- A Sidebar reflete a nova ordem automaticamente em tempo real.
