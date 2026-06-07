# PLANO DISRUPTIVO — CID Local Explorer
## SagB | C.I.D. | Explorador de Arquivos Local
### Data: 04/06/2026 | Autor: Cássio | Status: Rascunho para aprovação

---

## SUMÁRIO EXECUTIVO

O CID Local Explorer nasceu como uma ponte entre o filesystem `Z:\` e o pipeline documental do SagB. O que entregamos hoje é **sólido**, mas ainda é um explorador de arquivos comum.

Este plano propõe transformá-lo em **algo que não existe no mercado**: um **assistente de inteligência documental operacional** que combina navegação local, IA generativa embedada, visualização estratégica e automação de pipeline — tudo rodando no navegador, zero backend adicional.

---

## VISÃO

> "O CID Local Explorer deve ser a interface mais inteligente que alguém já viu para navegar, entender e agir sobre documentos locais — sem sair do navegador."

---

## BLOCOS DISRUPTIVOS

---

### 🔥 BLOCO 1 — CID Copilot: Assistente de Documentos Inteligente

**O que é:** Um chat/assistente embedado que "entende" os arquivos da pasta que você está navegando.

**Funcionalidades:**

| Funcionalidade | Descrição | Disrupção |
|---------------|-----------|-----------|
| **Chat contextual** | Ao abrir uma pasta, o CID Copilot pré-carrega contexto dos arquivos (.txt, .md, .pdf) e você pode perguntar em linguagem natural | Navegador de arquivos com IA conversacional embedada |
| **Resumo automático** | Ao selecionar um arquivo, o Copilot exibe resumo de 1 parágrafo gerado localmente via Gemini ou modelo leve WASM | Nenhum explorador de arquivos faz isso |
| **Pergunte ao diretório** | "Qual o maior contrato aqui?" "Quais arquivos mencionam a empresa X?" "Me mostre só documentos atualizados esse mês" | Busca semântica em cima do filesystem |
| **Ação por comando** | "Importe todos os PDFs desta pasta para o CID", "Agrupa esses arquivos por cliente" | Voz/texto vira ação real |

**Stack sugerida:**
- Integração com Gemini API (já existente no CID)
- Chat UI estilo copilot (barra lateral fixa ou painel flutuante)
- Indexação preguiçosa (lazy index): só processa arquivos quando você entra na pasta

**Diferencial competitivo:** Nenhuma ferramenta de filesystem no mercado faz isso. Nem Finder, nem Explorer, nem VS Code.

---

### 🔥 BLOCO 2 — Visual Canvas (Navegação Espacial)

**O que é:** Substituir a visualização linear (grid/lista) por uma tela infinita estilo Miro/FigJam onde pastas e arquivos são cards posicionáveis.

**Funcionalidades:**

- **Zoom semântico**: zoom out → vê árvore de diretórios como blocos. Zoom in → vê arquivos individuais com preview
- **Agrupamento visual por tipo**: PDFs agrupados numa bolha azul, imagens numa bolha verde
- **Conexões visuais**: arraste uma linha entre um contrato PDF e uma planilha para indicar relação
- **Sticky notes**: coloque post-its virtuais em pastas/arquivos ("Rever depois", "Aprovado", "Precisa de assinatura")
- **Mini-mapa**: canto inferior direito mostra um overview da árvore

**Diferencial competitivo:** Navegação espacial de arquivos com canvas infinito. Não existe.

---

### 🔥 BLOCO 3 — Merge Local + Supabase (Híbrido Transparente)

**O que é:** Uma única interface que unifica arquivos locais E assets do Supabase, sem o usuário precisar saber de onde vem cada coisa.

**Como funciona:**

```
┌─────────────────────────────────────────────────────────────┐
│  CID Explorer (único)                                        │
│                                                              │
│  sidebar:                                                     │
│  ├── 📁 Sistema de Arquivos     ← Z:\ (local)                │
│  ├── ☁️  Supabase CID           ← cid_assets (cloud)         │
│  └── 🔀 Pipeline Ativo         ← jobs + processing           │
│                                                              │
│  Ao clicar em "Importar local" →                              │
│  ├── Cria asset no Supabase                                   │
│  ├── Dispara pipeline (transcrição, fragmentação)             │
│  └── Mostra status em tempo real                              │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- **Mirror mode**: uma pasta local pode ser "espelhada" no Supabase — qualquer arquivo novo aparece automaticamente como asset
- **Sync seletivo**: selecione arquivos locais e clique "Sincronizar" → viram assets CID com pipeline
- **Status híbrido**: cada item mostra badge indicando se está `💻 Local`, `☁️ Cloud` ou `🔄 Sincronizando`

**Diferencial competitivo:** Navegador dual (local + cloud) unificado com pipeline automático.

---

### 🔥 BLOCO 4 — Terminal Visual Embedado

**O que é:** Um terminal visual dentro do explorador que executa comandos no diretório atual.

**Comandos possíveis:**

| Comando | Ação |
|---------|------|
| `/tree` | Exibe árvore de diretórios da pasta atual |
| `/stats` | Estatísticas detalhadas (tipos, tamanhos, datas) |
| `/find texto` | Busca textual em arquivos (grep visual) |
| `/duplicates` | Encontra arquivos duplicados por nome/tamanho/hash |
| `/export json` | Exporta listagem como JSON para uso externo |
| `/batch import pdf` | Importa todos os PDFs de uma vez |
| `/watch` | Monitora mudanças na pasta em tempo real |
| `/compress` | Compacta arquivos selecionados em ZIP |

**Diferencial competitivo:** Explorador de arquivos com terminal semântico próprio.

---

### 🔥 BLOCO 5 — Timeline e Mapa de Calor Temporal

**O que é:** Uma visão temporal dos arquivos, como um commit history do Git.

**Visualizações:**

- **Timeline vertical**: arquivos organizados por data de modificação, com preview inline
- **Heatmap**: grade estilo GitHub contributions mostrando atividade por dia/semana na pasta
- **Snapshots**: "Como essa pasta estava em 01/01/2026?" (baseado em metadados de criação/modificação)
- **Feed de atividade**: "3 arquivos criados hoje", "2 modificados ontem", "1 deletado"

**Diferencial competitivo:** Finder/Explorer não tem timeline. É um conceito de versionamento visual.

---

### 🔥 BLOCO 6 — Visual Intelligence Dashboard

**O que é:** Painel de inteligência sobre os arquivos da pasta atual.

**Métricas em tempo real:**

- Volume total vs. média histórica
- Distribuição por tipo de arquivo (gráfico de rosca)
- Top 10 maiores arquivos
- Arquivos mais antigos (não modificados há >6 meses)
- Estimativa de processamento: "Se importar tudo: ~12min de transcrição + ~3min de fragmentação"
- Qualidade dos dados: "32% dos arquivos têm metadados completos"

**Diferencial competitivo:** Dashboard de inteligência sobre filesystem. Nada igual.

---

### 🔥 BLOCO 7 — CID Fetch: Importação Remota Inteligente

**O que é:** Além de navegar o local, poder importar de fontes remotas.

**Origens suportadas:**

- **GitHub/GitLab**: `Importar de https://github.com/user/repo`
- **Google Drive / OneDrive**: autenticação OAuth + listagem
- **URL direta**: baixa arquivo de URL pública
- **E-mail**: "Encaminhe para cid@sagb.com" → vira asset
- **WhatsApp/Telegram**: bot que recebe arquivos e injeta no CID

**Diferencial competitivo:** CID como hub de ingestão universal, não só local.

---

### 🔥 BLOCO 8 — Pipeline Visual com Grafo de Processamento

**O que é:** Uma visão visual do pipeline de processamento para cada arquivo.

```
Arquivo importado
    │
    ▼
📥 Recebido ───→ 🔄 Transcrevendo ───→ ✂️ Fragmentando ───→ 📦 Pronto
                    │                        │
                    ▼                        ▼
               ⏳ 45%                    ⏳ 12%
```

**Funcionalidades:**
- Grafo de pipeline em tempo real para cada asset
- Clique em cada etapa para ver detalhes (log, erro, resultado parcial)
- Re-try de etapas com falha individualmente
- Visualização de dependências entre assets (ex: asset B depende da transcrição do asset A)

---

### 🔥 BLOCO 9 — Colaboração em Tempo Real

**O que é:** Múltiplos usuários navegando a mesma pasta simultaneamente.

**Baseado em:** Supabase Realtime (já existe no projeto)

**Funcionalidades:**
- Avatares de quem está na mesma pasta
- Cursor de cada usuário visível (tipo Google Docs)
- Anotações compartilhadas em pastas/arquivos
- Chat lateral por pasta

---

### 🔥 BLOCO 10 — Experiência Gamificada

**O que é:** Transformar a navegação e organização em algo engajante.

**Mecânicas:**
- **Streak**: dias consecutivos usando o CID
- **Badges**: "Coletor de PDFs", "Organizador Serial", "Primeiro a importar"
- **Níveis**: Quanto mais arquivos organiza, mais recursos desbloqueia
- **Leaderboard**: quem mais contribuiu com o CID na semana

---

## MATRIZ DE PRIORIDADE

| Bloco | Impacto | Esforço | Risco | Prioridade |
|-------|---------|---------|-------|:----------:|
| B1 — CID Copilot | 🔥🔥🔥🔥🔥 | Médio | Baixo | **P0** |
| B3 — Merge Local+Cloud | 🔥🔥🔥🔥🔥 | Médio | Médio | **P0** |
| B8 — Pipeline Visual | 🔥🔥🔥🔥 | Médio | Baixo | **P1** |
| B6 — Intelligence Dashboard | 🔥🔥🔥🔥 | Baixo | Baixo | **P1** |
| B2 — Visual Canvas | 🔥🔥🔥🔥🔥 | Alto | Alto | **P2** |
| B5 — Timeline | 🔥🔥🔥 | Baixo | Baixo | **P2** |
| B4 — Terminal Visual | 🔥🔥🔥 | Médio | Médio | **P2** |
| B7 — CID Fetch | 🔥🔥🔥🔥 | Alto | Alto | **P3** |
| B9 — Colaboração | 🔥🔥🔥 | Alto | Alto | **P3** |
| B10 — Gamificação | 🔥🔥 | Médio | Baixo | **P4** |

---

## ORDER RECOMENDADA DE IMPLEMENTAÇÃO

```
FASE 1 (now — 1 sprint)
├── B6 — Intelligence Dashboard (métricas já temos, só visualizar)
├── B3 — Merge Local+Cloud (já temos os dois lados)
└── B1 — CID Copilot (chat simples + Gemini, MVP em horas)

FASE 2 (próximo sprint)
├── B8 — Pipeline Visual (já existe o estado no CID, só grafar)
├── B4 — Terminal Visual (5 comandos essenciais)
└── B5 — Timeline (já temos mtime, só organizar)

FASE 3 (sprint seguinte)
├── B2 — Visual Canvas (projeto mais complexo, requer pesquisa)
└── B7 — CID Fetch (depende de autenticação externa)

FASE 4 (futuro)
├── B9 — Colaboração (depende de realtime + auth multi-usuário)
└── B10 — Gamificação (só depois que tudo estiver estável)
```

---

## RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Mitigação |
|-------|:------------:|-----------|
| Copilot sem contexto suficiente alucinar | Média | Prompt engineering + fallback "Não encontrei informação suficiente" |
| Canvas visual ficar lento com muitas pastas | Alta | Virtualização (só renderiza o que está no viewport) |
| Merge Local+Cloud confundir usuário | Média | Badge visual claro + filtro por origem |
| Gemini API rate limit | Alta | Cache de respostas + fila de requests |
| Pipeline visual consumir muitas queries | Média | WebSocket realtime ao invés de polling |

---

## REFLEXÃO CRÍTICA

**O que já está bom e deve ser preservado:**
- A bridge local (plugin Vite) — leve, zero dependências, só dev mode
- A separação clara entre Local e Cloud na sidebar
- Os cards modernos com gradiente por raiz
- O preview escuro (dark) — muito mais premium que o light

**O que talvez não valha a pena agora:**
- Gamificação (B10) é legal, mas não agrega valor ao pipeline documental
- Visual Canvas (B2) é lindo e disruptivo, mas o esforço é alto. Fazer depois.
- Colaboração em tempo real (B9) exige Supabase Realtime maduro e autenticação multiworkspace

**O que atacar primeiro (recomendação forte):**
1. **CID Copilot** — É o que mais impressiona e mais agrega valor. Um chat que entende os arquivos da pasta atual transforma completamente a percepção do módulo.
2. **Merge Local+Cloud** — Unificar as duas experiências elimina a maior confusão que o usuário pode ter ("onde está meu arquivo?").
3. **Intelligence Dashboard** — Rápido de fazer (dados já existem) e dá uma camada de sofisticação que justifica o posicionamento do CID como "base de preparação documental inteligente".

**O que eu faria diferente se redesenhasse hoje:**
- Não faria o explorador como um "modo" dentro do CID (viewMode === 'local'). Faria como uma view nativa do CID, mesclada com o explorer padrão. O usuário não deveria saber se está no "modo local" ou "modo cloud".
- Usaria Web Workers para indexação preguiçosa de arquivos de texto em segundo plano, sem travar a UI.
- Criaria uma API de plugins para que cada raiz (00_sagb, 01_empresasb...) pudesse ter handlers personalizados de preview e importação.

---

## PRÓXIMO PASSO

Se aprovar este plano, posso criar as tasks de implementação para a **FASE 1**:
1. CID Copilot (chat contextual com Gemini)
2. Merge Local + Supabase (sidebar unificada)
3. Intelligence Dashboard (métricas em tempo real)

Aguardando sua validação para prosseguir.
