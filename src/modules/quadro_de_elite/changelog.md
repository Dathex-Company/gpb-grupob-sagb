# Changelog - Quadro de Elite

Todas as mudanÃ§as relevantes no mÃ³dulo Quadro de Elite serÃ£o registradas aqui.

## [Unreleased]
### Adicionado
- MigraÃ§Ã£o do legado `AgentFactory` para dentro do mÃ³dulo `quadro_de_elite`.
- ImplementaÃ§Ã£o do cabeÃ§alho padrÃ£o `Docs + ResponsÃ¡vel` com botÃ£o de documentaÃ§Ã£o.
- Tipografia operacional de 12px aplicada ao container principal.
- DocumentaÃ§Ã£o de decisÃµes arquiteturais em `decisions.md`.
- AtualizaÃ§Ã£o do `module-doc.ts` com referÃªncias corretas aos arquivos movidos.
- Campo `canonicalId` no cadastro estrutural com padrÃ£o canÃ´nico `nome_empresa3_setor3_nivel1_seq3`.
- ValidaÃ§Ã£o de `canonicalId` com parsing semÃ¢ntico (`empresa3`, `setor3`, `nivel1`, `seq3`) e bloqueio de ediÃ§Ã£o apÃ³s criaÃ§Ã£o.
- ExibiÃ§Ã£o de `canonicalId` na tabela e inclusÃ£o no filtro de busca do Quadro de Elite.

### Alterado
- `QuadroDeElitePage.tsx` agora importa e renderiza o `AgentFactory` local.
- Ajuste de imports em `AgentFactory.tsx` para caminhos relativos corretos.
- AtualizaÃ§Ã£o do `session_log.md` com registro da migraÃ§Ã£o.
- `types.ts` agora inclui `canonicalId` no contrato de `Agent`.
- `module-doc.ts` atualizado para versÃ£o `1.1.0` com seÃ§Ã£o de convenÃ§Ã£o de identidade canÃ´nica.

### Removido
- (Nenhuma remoÃ§Ã£o significativa; os arquivos originais permanecem em `components/` por enquanto para evitar quebra imediata.)

### PrÃ³ximos passos
- IntegraÃ§Ã£o com serviÃ§os reais (Supabase) para carregamento de dados.
- RemoÃ§Ã£o de ruÃ­dos visuais excessivos nos subcomponentes.
- DefiniÃ§Ã£o de owner_backup no `module-doc.ts`.

