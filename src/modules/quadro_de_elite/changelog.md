# Changelog - Quadro de Elite

Todas as mudanças relevantes no módulo Quadro de Elite serão registradas aqui.

## [Unreleased]
### Adicionado
- Migração do legado `AgentFactory` para dentro do módulo `quadro_de_elite`.
- Implementação do cabeçalho padrão `Docs + Responsável` com botão de documentação.
- Tipografia operacional de 12px aplicada ao container principal.
- Documentação de decisões arquiteturais em `decisions.md`.
- Atualização do `module-doc.ts` com referências corretas aos arquivos movidos.

### Alterado
- `QuadroDeElitePage.tsx` agora importa e renderiza o `AgentFactory` local.
- Ajuste de imports em `AgentFactory.tsx` para caminhos relativos corretos.
- Atualização do `session-log.md` com registro da migração.

### Removido
- (Nenhuma remoção significativa; os arquivos originais permanecem em `components/` por enquanto para evitar quebra imediata.)

### Próximos passos
- Integração com serviços reais (Supabase) para carregamento de dados.
- Remoção de ruídos visuais excessivos nos subcomponentes.
- Definição de owner_backup no `module-doc.ts`.
