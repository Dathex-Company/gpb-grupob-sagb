# Changelog - Orquestração Principal

## [Unreleased]
- Criação oficial do módulo de Orquestração Principal.
- Migração da persona de Pierre Zanulli da pasta de documentos para o core de módulos.
- Atualização do padrão oficial `docs/governanca/padrao_modulos_plugaveis.md` com novas regras de governança documental obrigatória (`history-chat.md`, `decisions.md`, `changelog.md`, `agent/session-log.md`).
- Inclusão da política de localização do `prompt-ativacao-cline.md` (preferencial em `agent/`, compatível na raiz).
- Inclusão de política visual faseada (v1 estilo global básico; v2 customização leve por módulo com guardrails).
- Inclusão de política de versionamento híbrido (versão global SagB + versão independente por módulo em SemVer).
- Inclusão da fiscalização automática em duas fases (arquivos obrigatórios e conformidade visual/tokens).
- Criação do padrão `docs/governanca/padrao_postura_e_conduta_agentes.md` com frase-base obrigatória de postura firme, amigável e propositiva para todos os agentes.
- Implementação piloto no `nucleo-agentes` do padrão de transparência com botão `Docs` no topo + modal de documentação técnica operacional.
- Criação de `src/modules/nucleo-agentes/module-doc.ts` com contrato de fontes de dados, integrações, ativos reutilizáveis e riscos de duplicação.
- Ajuste no `src/core/context/ThemeContext.tsx` para fallback inicial fixo em `light` (modo clean), sem depender da preferência de tema do sistema operacional.
- Ajuste estrutural de navegação: criação de barra superior fixa global no `App.tsx` com `Docs`, `Configurações` e bloco de usuário.
- Remoção de duplicidade no Sidebar para "Agenda Inteligente" via filtro por label normalizado além do ID.
- Remoção de `configuracoes-sistema` do menu lateral, com acesso centralizado na barra superior.
- Refinamento visual do Sidebar: texto dos itens ajustado para `13px`, hover alterado para azul muito claro e redução do arredondamento para eliminar artefato visual no fim da linha.
- Ajuste fino de compactação do Sidebar: redução do `padding` vertical dos itens de `py-2.5` para `py-2` e remoção do espaçamento vertical entre itens (`gap-0.5` para `gap-0`) para aproximar visualmente os títulos conforme referência validada.
- Teste visual adicional no Sidebar: redução do texto dos itens de `13px` para `12px`, mantendo compactação (`py-2`, `gap-0`) e hover azul claro para comparação visual controlada.
- Ajuste adicional de proximidade no Sidebar: redução do `padding` vertical de `py-2` para `py-1.5`, mantendo `12px`, `gap-0` e hover azul claro para deixar os itens ainda mais próximos visualmente.
- Início da padronização tipográfica leve dos módulos: textos-base visíveis ajustados para `12px` em páginas-chave (`central-padroes`, `orquestracao-principal`, `videos-ia`) e componentes correlatos de `videos-ia`, além da descrição principal da `DashboardHome`.
- Correção de rota do piloto visual: o teste tipográfico passou a ser conduzido no módulo oficial de experimentação `nucleo-agentes`, com ajuste de textos operacionais para `12px` em `BaseDosAgentesView.tsx` antes de qualquer replicação mais ampla.
- Novo padrão estrutural em teste no piloto `nucleo-agentes`: topo do módulo agora utiliza `Docs` + `Responsável`, com inclusão do campo `owner` no contrato `ModuleManifest` e exibição de `Brene Sagore` no cabeçalho do módulo.
- Migração técnica do módulo piloto para padrão com underscore: `nucleo-agentes` foi renomeado para `nucleo_de_agentes`, com ajuste de pasta, `manifest.id`, `baseRoute`, rota, registry, sidebar e documentação estrutural obrigatória (`changelog`, `decisions`, `history-chat` e arquivos de `agent/`).
- Ajuste de UX no piloto `nucleo_de_agentes`: removido o botão `Docs` local do cabeçalho do módulo para eliminar duplicidade com o botão `Docs` da barra superior global, mantendo abertura do modal via evento global.
- Ajuste final de UX conforme decisão do usuário: botão `Docs` removido da barra fixa global (`App.tsx`) e restaurado como ponto único dentro do módulo `nucleo_de_agentes`.
- Higiene pós-ajuste de UX: removido listener global `sagb:open-module-docs` de `BaseDosAgentesView.tsx`, mantendo abertura do modal apenas pelo botão local do módulo.
- Início da replicação do padrão no `central-padroes`: inclusão de `owner` no manifesto, atualização do `module-doc` para o formato vigente, topo da página com `Docs + Responsável`, exportação de `moduleDoc` e normalização do `decisions.md`.
- Migração completa de naming técnico do módulo para underscore: `central-padroes` -> `central_padroes`, incluindo pasta, `manifest.id`, `baseRoute`, `routes.path`, import no `moduleRegistry`, referências técnicas internas e criação de `history-chat.md`.
