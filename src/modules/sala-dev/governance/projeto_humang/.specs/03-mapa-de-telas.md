# 03 - Mapa de Telas - HumanG

## Visão Geral
Este documento detalha a estrutura de telas, navegação e componentes de interface para o MVP do HumanG - Sistema de Seleção Inteligente B2B. Baseado nos fluxos do usuário (.docs/04-fluxos-do-usuario.md) e na arquitetura técnica (.specs/02-estrutura-tecnica.md).

---

## Estrutura de Navegação Principal

### Layout Base: Dashboard com Sidebar
**Componentes:**
1. **Header Superior**
   - Logo HumanG
   - Notificações (badge com contador)
   - Perfil do usuário (dropdown)
   - Toggle tema claro/escuro

2. **Sidebar Esquerda (Navegação Principal)**
   - Dashboard / Home
   - Vagas (com contador de abertas)
   - Candidatos (com contador em revisão)
   - Banco de Talentos
   - Analytics
   - Configurações
   - Ajuda / Tutorial

3. **Área de Conteúdo Principal**
   - Breadcrumbs (navegação hierárquica)
   - Ações contextuais
   - Conteúdo da tela atual
   - Filtros e controles

4. **Barra de Status Inferior**
   - Status do sistema (online/offline)
   - Contador de candidatos processados hoje
   - Link para suporte

---

## Telas Principais do Sistema

### Tela 1: Dashboard de Recrutamento

**Rota:** `/dashboard`
**Usuários:** Carlos (principal), Ana
**Objetivo:** Visão geral do pipeline e KPIs

#### Componentes Principais:
1. **Resumo do Pipeline (Cards)**
   - Total de candidatos ativos
   - Em triagem automática
   - Aguardando revisão humana
   - Entrevistas agendadas hoje
   - Decisões pendentes

2. **Gráfico de Pipeline**
   - Visualização em funnel das etapas
   - Números absolutos e porcentagens
   - Tooltips com detalhes por etapa

3. **Atividades Recentes**
   - Timeline das últimas ações
   - Candidatos adicionados recentemente
   - Entrevistas realizadas
   - Decisões tomadas

4. **Vagas em Destaque**
   - Lista das vagas mais ativas
   - Progresso de cada vaga
   - Acesso rápido às vagas

5. **Métricas de Performance**
   - Tempo médio por etapa
   - Taxa de conversão
   - Satisfação do candidato (se disponível)

#### Estados da Tela:
- **Estado Normal:** Dashboard completo carregado
- **Estado Vazio:** Primeiro uso, sem dados
- **Estado Carregando:** Dados sendo carregados
- **Estado Filtrado:** Filtros aplicados

#### Ações Disponíveis:
- Filtrar por período (hoje, semana, mês)
- Filtrar por vaga específica
- Exportar relatório
- Acessar vaga específica (click)
- Ver detalhes de candidato (click)

---

### Tela 2: Lista de Vagas

**Rota:** `/vagas`
**Usuários:** Carlos, Ana
**Objetivo:** Gerenciar todas as posições abertas

#### Componentes Principais:
1. **Barra de Ações Superiores**
   - Botão "Nova Vaga"
   - Filtros (status, departamento, prioridade)
   - Busca por título ou descrição
   - Visualização (grid/lista)

2. **Lista de Vagas**
   - Card por vaga com:
     - Título e departamento
     - Status (aberta, pausada, fechada)
     - Contadores (candidatos total, em processo)
     - Progresso (% preenchida)
     - Data de abertura
     - Ações rápidas (editar, pausar, arquivar)

3. **Painel de Detalhes (Lateral)**
   - Abre ao selecionar uma vaga
   - Descrição completa
   - Requisitos técnicos
   - Critérios de avaliação
   - Time envolvido
   - Histórico de atividades

#### Estados da Tela:
- **Lista Completa:** Todas as vagas
- **Vaga Selecionada:** Painel lateral aberto
- **Criando Nova Vaga:** Modal/Formulário aberto
- **Sem Vagas:** Estado vazio com CTA

#### Ações Disponíveis:
- Criar nova vaga
- Editar vaga existente
- Pausar/retomar vaga
- Arquivar vaga (após preenchimento)
- Duplicar vaga
- Exportar candidatos da vaga

---

### Tela 3: Detalhe da Vaga

**Rota:** `/vagas/:id`
**Usuários:** Carlos, Ana
**Objetivo:** Gerenciar candidatos de uma vaga específica

#### Componentes Principais:
1. **Cabeçalho da Vaga**
   - Título, status e prioridade
   - KPIs da vaga (tempo aberta, taxa conversão)
   - Ações (editar, pausar, fechar)

2. **Pipeline da Vaga (Visual Kanban)**
   - Colunas por etapa do processo
   - Cards de candidatos arrastáveis entre colunas
   - Cada card mostra:
     - Foto/nome do candidato
     - Score de compatibilidade
     - Status atual
     - Ícones de alerta (se aplicável)

3. **Lista de Candidatos (Visual Alternativo)**
   - Tabela com todos os candidatos
   - Colunas: Nome, Score, Etapa, Última Atualização
   - Ordenável por qualquer coluna
   - Filtros avançados

4. **Painel de Análise**
   - Métricas específicas da vaga
   - Distribuição de scores
   - Tempo médio por etapa
   - Comparativo com outras vagas

#### Estados da Tela:
- **Pipeline View:** Visualização kanban
- **ListView:** Visualização em tabela
- **Candidato Selecionado:** Modal de detalhes aberto
- **Editando Vaga:** Formulário de edição

#### Ações Disponíveis:
- Mover candidato entre etapas (drag & drop)
- Adicionar candidato manualmente
- Filtrar candidatos por score/status
- Exportar lista de candidatos
- Agendar entrevistas em lote

---

### Tela 4: Perfil do Candidato

**Rota:** `/candidatos/:id`
**Usuários:** Carlos, Ana
**Objetivo:** Visualização detalhada e gestão individual

#### Componentes Principais:
1. **Cabeçalho do Perfil**
   - Foto e informações básicas
   - Score geral de compatibilidade
   - Status atual no processo
   - Ações rápidas (contatar, agendar, reprovar)

2. **Aba: Informações Pessoais**
   - Dados de contato
   - Localização
   - Preferências de trabalho
   - Histórico profissional resumido

3. **Aba: Análise Técnica**
   - Score técnico detalhado (breakdown)
   - Habilidades identificadas
   - Experiência relevante
   - Projetos/portfólio
   - Gap analysis vs. requisitos da vaga

4. **Aba: Avaliações**
   - Avaliações de entrevistas
   - Comentários da equipe
   - Fit cultural (se avaliado)
   - Histórico de decisões

5. **Aba: Timeline**
   - Histórico completo de interações
   - Email enviados/recebidos
   - Entrevistas agendadas/realizadas
   - Mudanças de status

6. **Aba: Documentos**
   - Currículo original (PDF/Word)
   - Outros documentos anexados
   - Portfólio links
   - Gravalhões de entrevista (se aplicável)

#### Estados da Tela:
- **Visualização Normal:** Todas as abas disponíveis
- **Editando:** Modo edição ativado
- **Avaliando:** Formulário de avaliação aberto
- **Compartilhando:** Modal de compartilhamento

#### Ações Disponíveis:
- Editar informações do candidato
- Adicionar avaliação/feedback
- Agendar entrevista
- Enviar email/template
- Mover para próxima etapa
- Adicionar ao banco de talentos
- Arquivar/descartar

---

### Tela 5: Banco de Talentos

**Rota:** `/banco-talentos`
**Usuários:** Carlos
**Objetivo:** Gerenciar candidatos para oportunidades futuras

#### Componentes Principais:
1. **Sistema de Filtros Avançados**
   - Filtro por skills/tags
   - Filtro por experiência
   - Filtro por localização
   - Filtro por disponibilidade
   - Filtro por score mínimo

2. **Visualização de Talentos**
   - Grid de cards ou lista
   - Cada card mostra:
     - Foto/nome
     - Skills principais (tags)
     - Última interação
     - Score de compatibilidade com vagas ativas
   - Badge de "Match Quente" (alta compatibilidade)

3. **Painel de Match Automático**
   - Lista de vagas com candidatos compatíveis
   - Score de match para cada combinação
   - Sugestões de contato proativo

4. **Gestão de Consentimento LGPD**
   - Status de consentimento por candidato
   - Datas de expiração
   - Ações para renovação

#### Estados da Tela:
- **Exploração:** Filtros aplicados, visualização de talentos
- **Candidato Selecionado:** Detalhes do talento
- **Match em Foco:** Vagas específicas com compatibilidade
- **Gestão LGPD:** Foco em consentimentos

#### Ações Disponíveis:
- Buscar talentos por critérios específicos
- Ver match com vagas atuais
- Contatar talento proativamente
- Renovar consentimento LGPD
- Exportar lista de talentos
- Criar segmentos/tags personalizadas

---

### Tela 6: Agendamento de Entrevistas

**Rota:** `/entrevistas/agendar`
**Usuários:** Carlos, Ana
**Objetivo:** Agendar e gerenciar entrevistas

#### Componentes Principais:
1. **Calendário Visual**
   - Visualização semanal/mensal
   - Blocos de entrevistas agendadas
   - Slots disponíveis dos entrevistadores
   - Conflitos destacados

2. **Formulário de Agendamento**
   - Seleção de candidato(s)
   - Seleção de entrevistador(es)
   - Tipo de entrevista (técnica, cultural, etc.)
   - Data e hora (com sugestões automáticas)
   - Duração
   - Plataforma (presencial, Zoom, Google Meet)
   - Link da reunião (gerado automaticamente)

3. **Lista de Entrevistas Agendadas**
   - Próximas entrevistas (hoje/amanhã)
   - Entrevistas realizadas
   - Entrevistas canceladas/remarcadas

4. **Preparação para Entrevista**
   - Checklist pré-entrevista
   - Informações do candidato
   - Perguntas sugeridas
   - Template de avaliação

#### Estados da Tela:
- **Calendário View:** Visualização de agenda
- **Agendando:** Formulário de agendamento aberto
- **Detalhe Entrevista:** Modal com detalhes
- **Editando:** Modo edição de entrevista

#### Ações Disponíveis:
- Agendar nova entrevista
- Editar/cancelar entrevista existente
- Enviar convite automaticamente
- Gerar link de reunião
- Adicionar à agenda pessoal (Google/Outlook)
- Iniciar entrevista (abrir plataforma)

---

### Tela 7: Analytics e Relatórios

**Rota:** `/analytics`
**Usuários:** Ana (principal), Carlos
**Objetivo:** Análise de performance do processo de contratação

#### Componentes Principais:
1. **Dashboard de Métricas**
   - Taxa de conversão por etapa
   - Tempo médio de contratação
   - Custo por contratação
   - Qualidade da contratação (retenção em 6 meses)
   - Satisfação do candidato

2. **Gráficos Analíticos**
   - Fonte de candidatos mais eficaz
   - Performance por recrutador/entrevistador
   - Distribuição de scores
   - Tendências temporais

3. **Análise de Fit Cultural**
   - Correlação entre fit cultural e retenção
   - Performance por valor cultural
   - Gap analysis de diversidade

4. **Relatórios Exportáveis**
   - Relatório mensal/trimestral
   - Relatório por vaga/departamento
   - Benchmarking vs. indústria

#### Estados da Tela:
- **Visão Geral:** Métricas principais
- **Análise Detalhada:** Drill-down em métrica específica
- **Comparativo:** Comparação entre períodos/equipes
- **Exportação:** Configurando relatório

#### Ações Disponíveis:
- Filtrar por período
- Filtrar por departamento/vaga
- Comparar com período anterior
- Exportar relatório (PDF/Excel)
- Compartilhar dashboard
- Configurar alertas de métricas

---

### Tela 8: Configurações do Sistema

**Rota:** `/configuracoes`
**Usuários:** Carlos
**Objetivo:** Personalizar e configurar o HumanG

#### Componentes Principais:
1. **Configurações da Empresa**
   - Logo e informações da empresa
   - Valores culturais (para análise de fit)
   - Departamentos/equipes
   - Usuários e permissões

2. **Templates de Comunicação**
   - Email de contato inicial
   - Email de agendamento de entrevista
   - Email de feedback positivo/negativo
   - Email de banco de talentos
   - Variáveis disponíveis para personalização

3. **Critérios de Avaliação**
   - Pesos para diferentes habilidades
   - Pontuação mínima para qualificação
   - Modelo de fit cultural
   - Perguntas padrão de entrevista

4. **Integrações**
   - Email (SMTP/API)
   - Calendário (Google/Outlook)
   - Plataformas de job posting
   - Sistemas de RH existentes

5. **LGPD e Compliance**
   - Configurações de retenção de dados
   - Templates de consentimento
   - Política de exclusão de dados
   - Logs de acesso

#### Estados da Tela:
- **Geral:** Configurações básicas
- **Comunicação:** Editando templates
- **Avaliação:** Configurando critérios
- **Integrações:** Configurando conexões
- **LGPD:** Configurações de privacidade

#### Ações Disponíveis:
- Salvar configurações
- Testar templates de email
- Conectar/desconectar integrações
- Exportar configurações
- Restaurar padrões

---

## Navegação e Fluxos entre Telas

### Fluxo 1: Nova Contratação (Carlos)
```
Dashboard → Nova Vaga → Detalhe da Vaga → Pipeline da Vaga → Perfil do Candidato → Agendar Entrevista → Avaliar Candidato → Dashboard
```

### Fluxo 2: Avaliação de Fit Cultural (Ana)
```
Dashboard → Detalhe da Vaga → Perfil do Candidato (Aba Avaliações) → Adicionar Avaliação Cultural → Dashboard
```

### Fluxo 3: Reaproveitamento de Talento (Carlos)
```
Banco de Talentos → Filtrar por Skills → Ver Match com Vagas → Perfil do Candidato → Contatar Candidato → Dashboard
```

### Fluxo 4: Análise de Performance (Ana)
```
Dashboard → Analytics → Filtrar por Período → Analisar Métricas → Exportar Relatório → Dashboard
```

---

## Estados e Transições de Interface

### Estado Global: Sistema Offline
**Indicadores:**
- Badge "Offline" no header
- Notificação de reconexão automática
- Ações bloqueadas (com tooltip explicativo)
- Dados locais em cache (se disponível)

### Estado Global: Carregando
**Indicadores:**
- Spinner no conteúdo principal
- Esqueleto de loading nos cards
- Progress bar para operações longas

### Estado Global: Erro
**Indicadores:**
- Toast notification com erro
- Botão "Tentar novamente"
- Opção de reportar problema
- Fallback para conteúdo simplificado

### Estado Específico: Primeiro Uso
**Componentes especiais:**
- Tutorial interativo
- Dados de exemplo
- CTA para criar primeira vaga
- Link para documentação

---

## Componentes de Interface Reutilizáveis

### Componente 1: Card de Candidato
**Uso:** Listas, pipeline, banco de talentos
**Props:**
- `candidate`: Objeto candidato
- `showScore`: boolean (mostrar score)
- `showStatus`: boolean (mostrar status)
- `showActions`: boolean (mostrar ações)
- `draggable`: boolean (para pipeline)
- `onClick`: função

**Estados:**
- Normal
- Selecionado
- Arrastando
- Desabilitado

### Componente 2: Score Badge
**Uso:** Indicador visual de compatibilidade
**Props:**
- `score`: número (0-100)
- `size`: 'small' | 'medium' | 'large'
- `showNumber`: boolean
- `variant`: 'technical' | 'cultural' | 'overall'

**Cores por faixa:**
- 80-100: Verde (#10B981) - Alta compatibilidade
- 60-79: Amarelo (#F59E0B) - Compatibilidade média
- 0-59: Vermelho (#EF4444) - Baixa compatibilidade

### Componente 3: Pipeline Column
**Uso:** Coluna no visual kanban do pipeline
**Props:**
- `stage`: objeto estágio
- `candidates`: array de candidatos
- `onCandidateMove`: função
- `onCandidateClick`: função

**Comportamento:**
- Aceita drop de candidates
- Scroll vertical se muitos candidatos
- Contador no header
- Badge se requer ação

### Componente 4: Template Email Editor
**Uso:** Edição de templates de comunicação
**Props:**
- `templateId`: identificador do template
- `variables`: array de variáveis disponíveis
- `onSave`: função
- `onTest`: função

**Recursos:**
- Editor WYSIWYG básico
- Inserção de variáveis com dropdown
- Preview do email
- Teste de envio

---

## Responsividade e Dispositivos

### Desktop (≥ 1024px)
- Sidebar sempre visível
- Painéis laterais expansíveis
- Grid com múltiplas colunas
- Hover states completos

### Tablet (768px - 1023px)
- Sidebar recolhível (hamburger menu)
- Conteúdo principal em coluna única
- Cards em grid 2-col
- Touch gestures habilitados

### Mobile (≤ 767px)
- Menu hamburger para navegação
- Conteúdo em coluna única
- Cards em lista vertical
- Ações em bottom sheet
- Tabs para navegação secundária

---

## Sistema de Design e Tokens

### Cores Primárias:
- **Primária:** Azul HumanG (#2563EB)
- **Secundária:** Verde Sucesso (#10B981)
- **Atenção:** Amarelo Alerta (#F59E0B)
- **Erro:** Vermelho (#EF4444)
- **Neutro:** Cinza Escuro (#1F2937)

### Tipografia:
- **Família:** 'Inter', -apple-system, sans-serif
- **Títulos:** 24px, 20px, 18px, 16px
- **Corpo:** 14px (base), 12px (small)
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Espaçamento (8px grid):
- **XS:** 4px
- **S:** 8px
- **M:** 16px
- **L:** 24px
- **XL:** 32px
- **2XL:** 48px

### Sombras:
- **Baixa:** 0 1px 2px rgba(0, 0, 0, 0.05)
- **Média:** 0 4px 6px rgba(0, 0, 0, 0.07)
- **Alta:** 0 10px 15px rgba(0, 0, 0, 0.1)

---

## Acessibilidade (WCAG 2.1 AA)

### Contraste:
- Texto/cor de fundo mínimo 4.5:1
- Componentes interativos mínimo 3:1
- Estados de foco claramente visíveis

### Navegação por Teclado:
- Tab order lógico
- Skip to content link
- Atalhos de teclado para ações frequentes
- Foco gerenciado em modais

### Screen Readers:
- Labels ARIA para todos os componentes
- Live regions para atualizações dinâmicas
- Status do pipeline anunciado
- Mensagens de erro descritivas

### Redução de Movimento:
- Preferência respeitada
- Animações opcionais
- Transições suaves mas não essenciais

---

## Próximos Passos para Implementação

### Fase 1: Telas Core MVP
1. Dashboard de Recrutamento
2. Lista de Vagas + Detalhe da Vaga
3. Perfil do Candidato (abas básicas)
4. Agendamento de Entrevistas

### Fase 2: Telas de Suporte MVP
1. Banco de Talentos (lista básica)
2. Configurações (templates de email)
3. Analytics (métricas básicas)

### Fase 3: Refinamento Pós-MVP
1. Pipeline visual Kanban (drag & drop)
2. Banco de Talentos avançado (match automático)
3. Analytics completos
4. Integrações externas

---

## Relação com Backend (APIs)

### Telas e Endpoints Correspondentes:

**Dashboard:**
- `GET /api/dashboard/stats`
- `GET /api/dashboard/activities`
- `GET /api/dashboard/metrics`

**Vagas:**
- `GET /api/jobs` (lista)
- `GET /api/jobs/:id` (detalhe)
- `POST /api/jobs` (criar)
- `PUT /api/jobs/:id` (editar)

**Candidatos:**
- `GET /api/candidates` (lista)
- `GET /api/candidates/:id` (detalhe)
- `GET /api/jobs/:jobId/candidates` (por vaga)
- `PUT /api/candidates/:id/status` (mover etapa)

**Entrevistas:**
- `GET /api/interviews` (lista)
- `POST /api/interviews` (agendar)
- `PUT /api/interviews/:id` (editar/cancelar)

**Banco de Talentos:**
- `GET /api/talent-pool` (lista)
- `GET /api/talent-pool/matches` (matches)
- `POST /api/talent-pool/:id/contact` (contatar)

---

## Considerações Técnicas de Implementação

### Frontend Architecture:
- **Framework:** React 18+ com TypeScript
- **Estado:** React Query para server state + Zustand para client state
- **Roteamento:** React Router v6
- **Estilização:** Tailwind CSS + CSS Modules
- **Componentes:** Headless UI + custom components
- **Formulários:** React Hook Form + Zod validation
- **Testes:** Jest + React Testing Library + Cypress E2E

### Performance:
- Code splitting por rota
- Lazy loading de componentes pesados
- Virtualização de listas longas
- Cache agressivo com React Query
- Image optimization com lazy loading

### SEO (Portal do Candidato):
- SSR para páginas públicas
- Meta tags dinâmicas
- Sitemap XML
- Open Graph tags

---

## Documentos Relacionados

### Documentos de Entrada:
- `.docs/04-fluxos-do-usuario.md` - Jornadas e fluxos do usuário
- `.specs/01-entidades-e-dados.md` - Modelo de dados
- `.specs/02-estrutura-tecnica.md` - Arquitetura técnica

### Próximos Documentos:
- `.tasks/01-quebra-de-tarefas.md` - Tarefas de implementação
- `.logs/frontend-execucao.md` - Log de implementação frontend

---

## Conclusão

O mapa de telas define a estrutura de interface completa para o MVP do HumanG, focando nas necessidades das personas Carlos (eficiência operacional) e Ana (qualidade cultural). A navegação é intuitiva, com o dashboard como centro e módulos especializados acessíveis conforme necessidade.

As telas foram projetadas para escalar gradualmente, começando com funcionalidades core do MVP e evoluindo para features avançadas. O sistema de design proporciona consistência visual enquanto mantém flexibilidade para personalização por empresa.

**Próxima etapa:** O Project Planner (ET-05) utilizará este mapa de telas para criar o backlog detalhado e roadmap de implementação.

---

*Documento gerado pelo UX and Flow Designer (ET-04) como parte do fluxo multiagentes do Projeto HumanG.*
*Última atualização: [DATA DA GERAÇÃO]*
*Baseado em: .docs/04-fluxos-do-usuario.md, .specs/01-entidades-e-dados.md, .specs/02-estrutura-tecnica.md*

