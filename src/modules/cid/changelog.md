# CHANGELOG — CID

## [2026-06-04]

### Adicionado
- Normalização das tabelas `cid_prompts`, `cid_prompt_runs` e `cid_prompt_run_items` no shim do Supabase (leitura e escrita)
- `README.md` do módulo CID com documentação completa
- `agent/owner.md` com definição de owner pendente
- Estados de vazio (empty state) para Library e Processing tabs
- Indicador de "Processando..." quando ativo está em andamento sem outputs

### Alterado
- **Contraste de UI**: labels do formulário de `text-gray-500` para `text-gray-700`, bordas de `border-gray-100` para `border-gray-200`, inputs com `bg-white` e foco visível
- **Cores de feedback**: feedback de upload agora tem cores contextualizadas (verde para sucesso, vermelho para erro, azul para processando)
- **Status badge na library**: cores e contraste melhorados para todos os estados
- **Tabela de processamento**: cabeçalho com `text-gray-700`, linhas com `border-gray-200`, barra de progresso com indicador percentual
- **Detalhes do asset**: metadados expandidos (owner, tamanho do arquivo, payload de extração)
- **Tratamento do processor fetch**: agora a resposta é verificada (antes era fire-and-forget sem await)
- **module-doc.ts**: atualizado com posicionamento estratégico, tabelas, funções serverless, pontos fortes/fracos

### Corrigido
- Chamada `fetch('/.netlify/functions/cid-processor', ...)` agora é awaitada e verifica `response.ok`
- Labels de sensibilidade em português nos selects
- Placeholders nos inputs para melhor usabilidade

## [2026-06-06] — CID Explorer (Refatoração Completa da UI)

### Adicionado
- **Shell explorador documental** substituindo o layout de 3 abas
- **Topbar operacional** com breadcrumb, busca textual, botão de upload e toggle de sidebar
- **Sidebar esquerda** com árvore de navegação: Todos, Recentes, Processando, Concluídos, Com Erro, Só Armazenados + filtros por tipo (PDF, DOCX, TXT, Áudio, Vídeo, Imagem) com contadores
- **Painel direito contextual** com metadados, status, tamanho, sensibilidade, informações do job, fragmentos e saídas
- **Upload modal/drawer** como ação de topo (não mais tela principal)
- **Modo de detalhe** dedicado com preview completo do asset (metadados, texto extraído, derivados)
- **Modo de fila** dedicado com tabela de processamento

### Alterado
- **CIDView.tsx**: completamente reestruturado de layout de 3 abas para shell workspace (sidebar + centro + painel direito)
- **Navegação**: CID agora abre primeiro no acervo/exploração, não no formulário de upload
- **Upload**: de aba principal para drawer/modal lateral acessado por botão na topbar
- **Cores**: paleta ajustada para usar indigo como cor de destaque (sidebar ativa, botões, breadcrumb)
- **Tipografia**: Rubik aplicado globalmente no módulo

### Preservado
- Toda lógica de dados (onSnapshot, estados, memos)
- Pipeline de processamento (initiateCidProcessing, handleUpload)
- Modal de prompts (Transformação Operacional)
- Helper functions e constantes
- Rota do módulo (/cid) inalterada

## [Anteriores]

### 2026-05
- Implementação inicial do CIDView com 3 abas
- Pipeline de upload e processamento
- Integração com Netlify Functions
- Criação das migrations do banco

## [2026-06-04] — Plano Mestre ET02 / Fronteira e Refatoração Segura

### Adicionado
- `cid-contract.ts` com contrato oficial do CID: formatos, fontes, ações permitidas, ações legadas, outputs técnicos e fronteiras.
- `cid-utils.ts` com utilitários compartilhados para data, bytes, labels, badges, ícones e tamanho de asset.
- `CidBoundaryBanner.tsx` para explicitar a fronteira operacional do CID.
- `CidProcessingQueue.tsx` extraindo a fila de processamento de `CIDView.tsx`.
- Registro de implementação em `plans/ET02_IMPLEMENTACAO_FASE_01_REGISTRO.md`.

### Alterado
- `CIDView.tsx` passou a sanitizar `desiredAction` usando ações permitidas pelo contrato.
- Opção `store_consolidate` removida do formulário de upload.
- Botão principal de derivação por prompt removido da experiência principal; seleção de ativos permanece sem CTA de inteligência profunda.
- Upload drawer passa a exibir banner de fronteira do CID.
- Fila de processamento passa a usar componente dedicado.
- Entrada/montagem do CID agora força a landing oficial no Dashboard Geral para evitar subvisão antiga preservada por cache/HMR.

### Removido
- Listeners de `cid_prompts`, `cid_prompt_runs` e `cid_prompt_run_items` de `CIDView.tsx`.
- Estados e modal de prompt/derivados do CID.
- Exibição de derivados no detalhe do asset.
- Tipos `CidPrompt`, `CidPromptRun` e `CidPromptRunItem` de `types.ts`.
- Função serverless `cid-apply-prompt-background.mjs`.
- Referências de prompts/derivados no manifesto programático `module-doc.ts` e no `README.md`.

### Não alterado por segurança
- Nenhuma migration, RLS, bucket ou policy foi alterada nesta rodada.

### Validação
- Build final após correção da landing: `✓ built in 36.45s`.
