# MEGATAREFA — Implantação Completa do CID Explorer Disruptivo

## SagB | CID | Mega implantação do explorador local, cloud e inteligente

Data: 04/06/2026  
Status: Em implantação — primeira entrega executada em 04/06/2026  
Escopo: CID Explorer local, CID cloud, inteligência assistida, dashboards, pipeline visual e evolução futura

---

## 1. Leitura executiva

Esta megatarefa organiza a implantação de tudo que foi sugerido no plano disruptivo do CID Explorer.

O objetivo não é apenas melhorar uma tela. O objetivo é transformar o CID em uma camada operacional de ingestão documental extremamente moderna, capaz de navegar arquivos locais, entender diretórios, importar ativos, acompanhar pipeline, produzir métricas e operar com assistência inteligente.

O CID deve continuar respeitando sua fronteira estratégica: preparar matéria-prima documental. A inteligência profunda, cruzamento estratégico e leitura decisória continuam fora do CID. O que entra aqui é inteligência operacional aplicada à ingestão, organização, triagem e preparação.

---

## 2. Objetivo central da megatarefa

Implantar uma experiência completa para o CID Explorer com cinco capacidades principais:

1. Navegação local moderna nas raízes autorizadas.
2. Integração transparente entre arquivos locais e ativos cloud.
3. Assistente operacional para entender pastas e arquivos.
4. Dashboard e pipeline visual para acompanhar ingestão e processamento.
5. Fundações futuras para canvas, timeline, terminal, fontes externas e colaboração.

---

## 3. Princípios obrigatórios

1. O CID prepara documentos; não vira módulo de inteligência profunda.
2. Toda origem deve ser visível: local, cloud, sincronizado ou em pipeline.
3. Nenhuma automação deve apagar, mover ou sobrescrever arquivo local sem confirmação explícita.
4. Importação deve ser rastreável.
5. Preview não é processamento final.
6. IA dentro do CID deve ser operacional e limitada ao contexto documental.
7. A experiência precisa ser premium, rápida e confiável.
8. Cada frente deve ser entregável e reversível.
9. Tudo que for plano deve ficar neste diretório de plans.

---

## 4. Fronteiras do CID

### Entra no CID

- Navegação de arquivos locais.
- Preview de arquivos.
- Importação para ativos CID.
- Metadados operacionais.
- Fila e estado de processamento.
- Resumos operacionais para triagem.
- Detecção de tipo, tamanho, data, extensão, origem e caminho.
- Organização de ativos.
- Geração de derivados operacionais.

### Não entra no CID

- Estratégia profunda de negócio.
- Cruzamento entre empresas para decisão executiva.
- Radar de conexões.
- NICO.
- NAGI.
- Recomendações estratégicas finais.
- Score comercial profundo.
- Diagnóstico humano ou consultivo final.

---

## 5. Arquitetura alvo

### Camadas

1. Interface CID Explorer.
2. Bridge local de filesystem.
3. Cliente local bridge.
4. Serviços CID cloud.
5. Store de estado e filtros.
6. Pipeline de jobs.
7. Assistente operacional.
8. Dashboard analítico.

### Fluxo principal

1. Usuário escolhe raiz local.
2. CID lista pastas e arquivos.
3. Usuário visualiza, filtra, abre preview ou seleciona itens.
4. Usuário importa um ou vários arquivos.
5. CID cria ativos com origem local.
6. Pipeline recebe jobs conforme ação escolhida.
7. Dashboard e pipeline visual mostram andamento.
8. Assistente pode explicar, resumir e sugerir ações operacionais.

---

## 6. Fase 1 — Base premium e unificação local cloud

### Objetivo

Consolidar a experiência atual do explorador local e unificar sua relação com o acervo cloud.

### Tasks

- [ ] Revisar o componente atual do explorador local e separar subcomponentes de header, toolbar, card, lista e preview.
- [ ] Criar um modelo visual único para itens locais e ativos CID.
- [ ] Adicionar badges de origem: local, cloud, sincronizando, importado, erro.
- [ ] Melhorar o breadcrumb para permitir clique em qualquer nível da árvore.
- [ ] Adicionar seleção múltipla de arquivos e pastas.
- [ ] Adicionar barra de ações em lote.
- [ ] Permitir importar múltiplos arquivos selecionados.
- [ ] Criar estado visual para item já importado.
- [ ] Adicionar mensagem clara quando pasta não tiver itens.
- [ ] Adicionar skeletons e estados de erro premium.
- [ ] Adicionar modo compacto para diretórios com muitos arquivos.
- [ ] Garantir que a sidebar continue consistente com o papel do CID.
- [ ] Validar build após refatoração.

### Critério de aceite

O usuário consegue clicar em uma raiz, abrir subpastas, visualizar arquivos, selecionar vários itens, importar para o CID e distinguir claramente o que é local e o que é cloud.

---

## 7. Fase 2 — Intelligence Dashboard operacional

### Objetivo

Criar um painel de inteligência operacional da pasta atual.

### Tasks

- [ ] Criar cards de métricas da pasta atual: pastas, arquivos, volume, último modificado.
- [ ] Criar distribuição por tipo de arquivo.
- [ ] Criar lista dos maiores arquivos.
- [ ] Criar lista dos arquivos mais recentes.
- [ ] Criar indicador de arquivos potencialmente processáveis.
- [ ] Criar estimativa operacional de processamento.
- [ ] Criar indicador de qualidade de metadados.
- [ ] Criar botão para alternar entre explorador e dashboard.
- [ ] Criar dashboard por raiz e por pasta atual.
- [ ] Evitar processamento pesado no render principal.
- [ ] Validar performance com diretórios grandes.

### Critério de aceite

O usuário entra em uma pasta e entende rapidamente o perfil documental dela sem abrir arquivo por arquivo.

---

## 8. Fase 3 — CID Copilot operacional

### Objetivo

Adicionar um assistente conversacional limitado à função operacional do CID.

### Tasks

- [ ] Criar painel lateral do Copilot.
- [ ] Criar prompt de fronteira do assistente: triagem, resumo, organização e ingestão.
- [ ] Permitir perguntas sobre a pasta atual.
- [ ] Permitir perguntas sobre arquivo em preview.
- [ ] Criar resumo rápido de arquivos de texto.
- [ ] Criar resumo rápido de PDF quando houver extração disponível.
- [ ] Criar sugestões de ação: importar, ignorar, revisar, agrupar.
- [ ] Adicionar comandos seguros: listar PDFs, sugerir tags, sugerir tipo documental.
- [ ] Bloquear respostas de inteligência estratégica profunda.
- [ ] Adicionar disclaimer de escopo operacional.
- [ ] Criar cache simples de respostas por arquivo.
- [ ] Registrar erros de IA de forma amigável.

### Critério de aceite

O usuário consegue perguntar sobre arquivos e pastas para acelerar triagem, sem transformar o CID em módulo de análise estratégica.

---

## 9. Fase 4 — Pipeline visual

### Objetivo

Mostrar de forma visual o caminho do ativo desde importação até pronto para uso.

### Tasks

- [ ] Mapear estados reais existentes dos jobs e assets.
- [ ] Criar componente de grafo linear do pipeline.
- [ ] Exibir etapas: recebido, armazenado, extraindo, transcrevendo, fragmentando, derivando, pronto, erro.
- [ ] Exibir progresso percentual quando existir.
- [ ] Exibir logs resumidos por etapa.
- [ ] Permitir reprocessar etapa com erro quando backend permitir.
- [ ] Adicionar visão de fila global.
- [ ] Adicionar visão de fila por arquivo.
- [ ] Adicionar indicadores de gargalo.

### Critério de aceite

O usuário entende onde cada item está no pipeline e consegue identificar falhas sem abrir console ou banco.

---

## 10. Fase 5 — Terminal visual do CID

### Objetivo

Criar um terminal semântico e seguro para ações no diretório atual.

### Comandos iniciais

- [ ] Criar comando para árvore do diretório.
- [ ] Criar comando para estatísticas.
- [ ] Criar comando para busca textual simples.
- [ ] Criar comando para listar duplicados por nome e tamanho.
- [ ] Criar comando para importar todos os PDFs.
- [ ] Criar comando para exportar listagem.
- [ ] Criar histórico de comandos.
- [ ] Criar autocomplete.
- [ ] Criar política de comandos seguros.

### Critério de aceite

O usuário executa ações avançadas sem sair da interface e sem risco de dano ao filesystem.

---

## 11. Fase 6 — Timeline e mapa temporal

### Objetivo

Criar visão temporal da pasta e dos ativos.

### Tasks

- [ ] Criar timeline por data de modificação.
- [ ] Criar agrupamento por dia, semana e mês.
- [ ] Criar heatmap de atividade.
- [ ] Criar filtro por período.
- [ ] Criar destaque para arquivos antigos.
- [ ] Criar destaque para arquivos alterados recentemente.
- [ ] Integrar timeline com importação.

### Critério de aceite

O usuário identifica rapidamente o que mudou, o que é antigo e o que merece ser importado.

---

## 12. Fase 7 — Visual Canvas experimental

### Objetivo

Criar uma experiência espacial para navegar documentos como mapa visual.

### Tasks

- [ ] Fazer prova de conceito com canvas ou biblioteca de fluxo.
- [ ] Representar pastas como grupos.
- [ ] Representar arquivos como cards.
- [ ] Permitir zoom e pan.
- [ ] Permitir conexões manuais entre arquivos.
- [ ] Criar notas visuais.
- [ ] Criar mini-mapa.
- [ ] Validar performance.
- [ ] Manter como modo experimental até estabilizar.

### Critério de aceite

O usuário consegue explorar uma pasta como mapa visual sem prejudicar a navegação tradicional.

---

## 13. Fase 8 — CID Fetch e fontes externas

### Objetivo

Expandir ingestão para fontes remotas.

### Tasks

- [ ] Criar modelo de fonte externa.
- [ ] Criar importação por URL direta.
- [ ] Criar conector GitHub em modo leitura.
- [ ] Planejar Google Drive e OneDrive.
- [ ] Planejar ingestão por e-mail.
- [ ] Planejar ingestão por WhatsApp ou Telegram.
- [ ] Adicionar origem externa nos badges.
- [ ] Adicionar logs de origem.

### Critério de aceite

O CID passa a ser hub de ingestão documental, sem depender só de upload manual e filesystem local.

---

## 14. Fase 9 — Colaboração em tempo real

### Objetivo

Permitir operação compartilhada sobre pastas e ativos.

### Tasks

- [ ] Mapear presença de usuários por workspace.
- [ ] Criar avatares de usuários ativos na pasta.
- [ ] Criar comentários por arquivo.
- [ ] Criar anotações por pasta.
- [ ] Criar atividade recente compartilhada.
- [ ] Integrar com permissões existentes.
- [ ] Validar privacidade.

### Critério de aceite

Múltiplos usuários conseguem operar a ingestão documental sem colisão e com contexto compartilhado.

---

## 15. Fase 10 — Gamificação leve

### Objetivo

Adicionar camadas de engajamento sem infantilizar o CID.

### Tasks

- [ ] Criar badges operacionais.
- [ ] Criar progresso de organização por pasta.
- [ ] Criar conquistas discretas.
- [ ] Criar ranking interno opcional.
- [ ] Permitir desligar gamificação.

### Critério de aceite

Gamificação incentiva organização sem distrair do propósito operacional.

---

## 16. Dependências técnicas

- Bridge local funcionando.
- Cliente da bridge estável.
- Serviços CID cloud mapeados.
- Modelo de asset com origem e payload consistente.
- Integração Gemini disponível.
- Supabase disponível.
- Estados de jobs mapeados.
- Regras de segurança para leitura local.

---

## 17. Riscos principais

1. Misturar demais CID com inteligência profunda.
2. Criar UI bonita mas pesada em diretórios grandes.
3. Confundir origem local e cloud.
4. Gerar importações duplicadas.
5. Copilot responder além do escopo.
6. Bridge local expor caminhos indevidos.
7. Pipeline visual mostrar estados que backend ainda não tem.

---

## 18. Mitigações

1. Prompts e labels reforçando escopo operacional.
2. Virtualização e paginação visual.
3. Badges de origem em todos os itens.
4. Hash ou assinatura de importação para detectar duplicatas.
5. Guardrails do Copilot.
6. Allowlist rígida de raízes locais.
7. Mapeamento real dos estados antes de desenhar pipeline final.

---

## 19. Ordem recomendada

1. Fase 1 — Base premium e unificação local cloud.
2. Fase 2 — Dashboard operacional.
3. Fase 3 — Copilot operacional.
4. Fase 4 — Pipeline visual.
5. Fase 5 — Terminal visual.
6. Fase 6 — Timeline.
7. Fase 7 — Canvas experimental.
8. Fase 8 — Fontes externas.
9. Fase 9 — Colaboração.
10. Fase 10 — Gamificação.

---

## 20. Critérios de maturidade

### Maturidade funcional

- Navega local.
- Importa assets.
- Mostra preview.
- Lista cloud e local.

### Maturidade operacional

- Importação em lote.
- Dashboard.
- Estados de pipeline.
- Erros compreensíveis.

### Maturidade inteligente

- Copilot operacional.
- Sugestões de tags.
- Resumos rápidos.
- Busca contextual.

### Maturidade ecossistêmica

- Fontes externas.
- Colaboração.
- Histórico temporal.
- Canvas.

---

## 21. Entregável mínimo recomendado

A primeira implantação aprovada deveria conter:

- Refatoração do explorador local em subcomponentes.
- Seleção múltipla.
- Importação em lote.
- Badges local/cloud.
- Dashboard da pasta.
- Copilot operacional básico.
- Pipeline visual simples.

---

## 22. Decisão solicitada

Antes de implementar, validar:

1. A prioridade das fases.
2. Se o Copilot pode usar Gemini já nesta etapa.
3. Se importação em lote deve criar jobs automaticamente ou apenas assets recebidos.
4. Se merge local/cloud deve substituir a separação atual ou entrar como modo opcional.
5. Se canvas deve ser experimental e escondido atrás de flag.

---

## 23. Fechamento

Esta megatarefa transforma o CID Explorer em uma experiência altamente diferenciada, sem romper o posicionamento estratégico do CID como base de preparação documental.

O caminho recomendado é evoluir em camadas: primeiro robustez e clareza, depois inteligência operacional, depois experiências disruptivas.

---

## 24. Registro de execução — 04/06/2026

### Segunda entrega — Mega Dashboard Geral + Navegação na Sidebar

#### Sidebar do CID modificada

Arquivo: `CIDView.tsx`

- Adicionado item **"📊 Dashboard Local"** como primeira opção do grupo "Sistema de Arquivos" na sidebar.
- Ao clicar em "Dashboard Local", o CID mostra o Mega Dashboard Geral com todas as raízes.
- As raízes individuais (`00_sagb`, `01_empresasb`, etc.) continuam funcionando como antes: navegam direto para a raiz.
- Botão **"Voltar ao SagB"** agora sempre visível no rodapé da sidebar (antes era condicional).
- Fallback: se `onBack` não estiver definido, dispara evento `cid-close-local` para fechar o explorador.

Foi implementado o Mega Dashboard Geral como tela inicial do CID Local Explorer.

#### Funcionalidades adicionadas

- **Header impactante** com gradiente slate→indigo→slate, título "Explorador de Arquivos" e subtítulo.
- **Métricas globais** escaneando todas as raízes: total de raízes, pastas, arquivos, volume e última atividade.
- **Scan assíncrono de todas as raízes** ao entrar no dashboard, com skeletons enquanto carrega.
- **Cards premium de cada raiz** com gradiente específico (igual ao ROOT_SKIN), mini-estatísticas, path e botão "Explorar →".
- **Navegação entre dashboard e pasta** via breadcrumb: "Local" no breadcrumb volta ao dashboard geral.
- **Dica rápida** contextual sobre terminal e navegação.

#### Validação técnica

Build Vite em modo development:

- `✓ built in 35.84s`
- Sem erro de compilação.

#### Como acessar

1. Entre no CID pelo módulo.
2. Na sidebar, clique em "Sistema de Arquivos" → qualquer raiz.
3. Dentro da raiz, clique em "Local" no breadcrumb → volta ao Mega Dashboard Geral.
4. No dashboard, clique em qualquer card → navega para aquela raiz.

---

### Primeira entrega (anterior)

Foi executada a primeira rodada da megatarefa no componente `CidLocalExplorer.tsx`, cobrindo parte da Fase 1 e da Fase 2.

### Funcionalidades adicionadas

- Seleção múltipla de arquivos locais.
- Botão de importação em lote dos arquivos selecionados.
- Ação para selecionar todos os arquivos filtrados.
- Ação para limpar seleção.
- Badges e destaque visual para arquivos selecionados.
- Painel de navegação com abas: Arquivos, Dashboard, Terminal e Copilot.
- Dashboard operacional da pasta atual.
- Métricas: pastas, arquivos, volume, processáveis e última alteração.
- Distribuição por tipo/extensão.
- Lista dos maiores arquivos.
- Lista dos arquivos mais recentes.
- Terminal visual com comandos seguros:
  - `/stats`
  - `/tree`
  - `/types`
  - `/largest`
  - `/recent`
  - `/import pdf`
  - `/clear`
- Aba placeholder do CID Copilot operacional, sem chamada de IA ainda, respeitando aprovação futura de prompt e fronteira.

### Validação técnica

Foi executado build Vite em modo development.

Resultado:

- 924 módulos transformados.
- Build concluído com sucesso.
- Sem erro de compilação no componente.

### Observações

Esta entrega não criou migration, bucket, policy, deploy, commit ou alteração de banco.

O Copilot foi preparado visualmente, mas não conectado a IA nesta rodada para evitar extrapolar o escopo sem aprovação específica.
