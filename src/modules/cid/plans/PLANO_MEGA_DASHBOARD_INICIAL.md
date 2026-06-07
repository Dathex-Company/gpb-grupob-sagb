# PLANO — Mega Dashboard Inicial do CID Explorer
## Transformar a tela de raízes em um painel executivo geral

### Problema atual

Hoje, ao clicar em "Sistema de Arquivos" na sidebar do CID, o usuário cai direto dentro da primeira raiz (`00_sagb`). Não há uma tela inicial que mostre o panorama geral de todas as raízes.

O que existe hoje é uma lista simples de 5 botões com nome e path.

### Visão proposta

A tela inicial (landing do CID Local) deve ser um **mega dashboard geral** com:

1. **Header grandioso** — gradiente cobrindo toda a largura, com o nome "CID Local Explorer" e uma frase de impacto
2. **Métricas globais agregadas** — total de pastas, arquivos e volume considerando TODAS as raízes
3. **Cards de raízes expandidos** — cada raiz vira um card premium com:
   - Gradiente de fundo específico
   - Ícone grande
   - Nome e descrição
   - Mini-estatísticas daquela raiz
   - Badge de "maior", "mais recente", etc.
   - Botão "Explorar" proeminente
4. **Barra de ação rápida** — busca global, acesso a dashboards, toggle de layout
5. **Seção de destaques** — links rápidos para pastas específicas, ou "acessos recentes"

### Abordagem técnica

Para não precisar escanear todas as raízes assincronamente (o que seria lento), vamos:

1. Fazer um scan leve de cada raiz (apenas listDir do root) no mount inicial
2. Armazenar em um estado `rootStats` que mapeia root.name → { folders, files, bytes, lastModified }
3. Enquanto o scan não termina, mostrar skeletons
4. Uma vez populado, exibir o dashboard completo

### Componentes a alterar

- **CidLocalExplorer.tsx** — transformar a view `viewMode === 'roots'` no novo dashboard
- Criar **CidRootDashboardCard** como subcomponente separado (opcional)
- Manter a view `browse` intacta para quando o usuário navegar em uma raiz

### Fluxo

```
Usuário clica "Sistema de Arquivos" no CID
  └── CIDView seta viewMode='local'
      └── CidLocalExplorer renderiza
          ├── Se rootFilter está setado → navigateTo na raiz (comportamento atual)
          └── Se rootFilter NÃO está setado → MEGA DASHBOARD GERAL
              ├── Scan de raízes (loading com skeletons)
              ├── Exibe métricas globais
              └── Exibe cards de cada raiz
```

### O que o dashboard deve mostrar

1. **Header**
   - "CID Local Explorer"
   - "Navegue pelo sistema de arquivos local"
   - Gradiente multi-cor (ou gradiente padrão elegante)

2. **Métricas globais** (após scan)
   - Total de pastas (soma de todas as raízes)
   - Total de arquivos
   - Volume total
   - Raízes disponíveis (5)
   - Última atividade (maior mtime entre todas)

3. **Cards de raízes** (grid responsivo)
   - Cada card:
     - Gradiente específico da raiz (já existe no ROOT_SKIN)
     - Ícone grande
     - Nome da raiz
     - Descrição
     - Estatísticas da raiz (pastas, arquivos, volume)
     - Botão "Explorar"
   - 2 colunas em desktop, 1 em mobile

4. **Rodapé do dashboard**
   - "Dica: use o terminal (/stats) ou o dashboard por pasta para análise aprofundada"
   - Link para plano/ajuda

### Implementação

Serei rápido: a implementação é concentrada no `CidLocalExplorer.tsx`, transformando o bloco `viewMode === 'roots'` e adicionando o scan inicial.

### Validação

- Build passa
- HMR atualiza
- Dashboard mostra dados reais após scan
- Ao clicar em "Explorar" em um card, navega para aquela raiz
