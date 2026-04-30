# Changelog - Quadro de Elite

Todas as mudanças relevantes no módulo Quadro de Elite serão registradas aqui.

## [Unreleased]
### Adicionado
- Migração do legado `AgentFactory` para dentro do módulo `quadro_de_elite`.
- Implementação do cabeçalho padrão `Docs + Responsável` com botão de documentação.
- Tipografia operacional de 12px aplicada ao container principal.
- Documentação de decisões arquiteturais em `decisions.md`.
- Atualização do `module-doc.ts` com referências corretas aos arquivos movidos.
- Campo `canonicalId` no cadastro estrutural com padrão canônico `nome_empresa3_setor3_nivel1_seq3`.
- Validação de `canonicalId` com parsing semântico (`empresa3`, `setor3`, `nivel1`, `seq3`) e bloqueio de edição após criação.
- Exibição de `canonicalId` na tabela e inclusão no filtro de busca do Quadro de Elite.

### Alterado
- `QuadroDeElitePage.tsx` agora importa e renderiza o `AgentFactory` local.
- Ajuste de imports em `AgentFactory.tsx` para caminhos relativos corretos.
- Atualização do `session-log.md` com registro da migração.
- `types.ts` agora inclui `canonicalId` no contrato de `Agent`.
- `module-doc.ts` atualizado para versão `1.1.0` com seção de convenção de identidade canônica.

### Removido
- (Nenhuma remoção significativa; os arquivos originais permanecem em `components/` por enquanto para evitar quebra imediata.)

### Próximos passos
- Integração com serviços reais (Supabase) para carregamento de dados.
- Remoção de ruídos visuais excessivos nos subcomponentes.
- Definição de owner_backup no `module-doc.ts`.
