# decisions — configuracoes-ambiente

## 2026-05-02 — Liga/Desliga real de módulos em runtime

- Decidido centralizar leitura/escrita/avaliação de ativação de módulos em `src/core/modules/moduleActivation.ts` para eliminar divergência entre Sidebar, Configurações e App.
- Decidido usar persistência em localStorage com escopo por workspace como etapa atual (sem dependência de backend) para viabilizar efeito imediato.
- Decidido aplicar o mesmo critério de ativação no menu e na renderização de conteúdo para garantir bloqueio real de módulo OFF.
- Decidido manter fallback seguro para tabs desativadas/inexistentes retornando Home.

## 2026-05-02 — Redesign UI e padronização com Monitoramento

- Decidido adotar o padrão de sub-sidebar + painel de conteúdo (mesmo do Monitoramento) para Configurações do Sistema, antecipando crescimento do módulo para 7+ categorias.
- Decidido usar tokens `--sagb-*` no sub-sidebar em vez de cores fixas, mantendo consistência visual com o restante do sistema.
- Decidido remover "Configurações do Sistema" do sidebar, mantendo acesso exclusivo pelo botão da barra superior direita.
- Decidido criar placeholders estruturais para as novas categorias (Idioma, Notificações, Perfil, Privacidade, Atalhos) para facilitar implementação futura.

## 2026-05-02 — Reordenação de módulos por drag and drop com cadeado

- Decidido implementar reordenação de módulos via HTML5 Drag and Drop nativo (sem dependências externas) para manter o bundle enxuto.
- Decidido centralizar as funções de ordem (`readModuleOrder`, `writeModuleOrder`, `sortModulesByOrder`) no mesmo serviço `moduleActivation.ts` que já gerencia os toggles, mantendo a coerência do módulo.
- Decidido usar o padrão de cadeado (lock/unlock) para evitar reordenação acidental: por padrão a lista fica travada, e o usuário precisa destravar explicitamente para arrastar.
- Decidido persistir o estado do cadeado em localStorage (`sagb:module-order-lock:v1`) para manter a preferência entre sessões.
- Decidido que módulos novos (não presentes no array de ordem) vão para o final da lista, garantindo que nunca "sumam" da Sidebar.
- Decidido usar evento customizado `sagb:module-order-changed` para sincronizar a ordem entre ConfigAmbientePage e Sidebar em tempo real.
