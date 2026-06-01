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
- Auditoria conceitual do estado atual do mÃ³dulo, registrada em `docs/auditoria-renomeacao-sistema-nomes-2026-06-01.md`.
- RecomendaÃ§Ã£o de renomeaÃ§Ã£o conceitual para **NÃºcleo de Identidades**.
- Desenho inicial do sistema de criaÃ§Ã£o e validaÃ§Ã£o de nomes com bloqueio de duplicidade exata e evoluÃ§Ã£o para similaridade/reserva.
- Helper `normalizeAgentName` para normalizaÃ§Ã£o de nomes operacionais.
- Helper `validateAgentNameAvailability` para validar duplicidade exata e similaridade inicial contra a lista de `agents` carregada.
- Feedback visual no campo `Nome` do formulÃ¡rio estrutural com estados vazio, disponÃ­vel, duplicado e parecido.
- RenomeaÃ§Ã£o visual do mÃ³dulo para **NÃºcleo de Identidades**, preservando `id`, rota e pasta tÃ©cnica `quadro_de_elite`.

### Alterado
- `QuadroDeElitePage.tsx` agora importa e renderiza o `AgentFactory` local.
- Ajuste de imports em `AgentFactory.tsx` para caminhos relativos corretos.
- AtualizaÃ§Ã£o do `session_log.md` com registro da migraÃ§Ã£o.
- `types.ts` agora inclui `canonicalId` no contrato de `Agent`.
- `module-doc.ts` atualizado para versÃ£o `1.1.0` com seÃ§Ã£o de convenÃ§Ã£o de identidade canÃ´nica.
- Salvamento do cadastro estrutural agora bloqueia nomes duplicados exatos normalizados antes de persistir em `agents`.
- Manifesto, cabeÃ§alho da pÃ¡gina e header operacional passam a exibir **NÃºcleo de Identidades**.

### Removido
- (Nenhuma remoÃ§Ã£o significativa; os arquivos originais permanecem em `components/` por enquanto para evitar quebra imediata.)

### PrÃ³ximos passos
- IntegraÃ§Ã£o com serviÃ§os reais (Supabase) para carregamento de dados.
- RemoÃ§Ã£o de ruÃ­dos visuais excessivos nos subcomponentes.
- DefiniÃ§Ã£o de owner_backup no `module-doc.ts`.
- Evoluir validaÃ§Ã£o de nomes para consulta direta ao banco e reserva formal de nomes.

