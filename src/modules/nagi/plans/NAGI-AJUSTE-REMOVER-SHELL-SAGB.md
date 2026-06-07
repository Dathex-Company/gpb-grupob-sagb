# SagB | NAGI | Ajuste de Direção Visual | Remover Shell do SagB

**Status:** ✅ Concluído
**Data:** 2026-06-04
**Autor:** Cássio Mendes
**Path oficial:** `Z:\00_sagb\src\modules\nagi`

---

## 1. Resumo Executivo

### Problema

O NAGI ainda estava aparecendo **dentro do shell visual do SagB**, com o sidebar do SagB visível à esquerda. Isso acontecia porque:

1. `hideSidebar` no `App.tsx` não incluía `'nagi'` — o sidebar do SagB continuava renderizado
2. `hideHeader` no `App.tsx` não incluía `'nagi'` — o header do SagB continuava renderizado
3. A **rota dinâmica** do módulo (via `moduleRegistry`) executava **antes** do switch case, renderizando `NAGIPage` **sem** as props `onBack`/`onOpenTab`

### Correção

Duas alterações cirúrgicas no `App.tsx`:

| Localização | Antes | Depois |
|---|---|---|
| `hideSidebar` (linha 1711) | `... || activeTab === 'nide'` | `... || activeTab === 'nide' || activeTab === 'nagi'` |
| `hideHeader` (linha 1712) | `... || activeTab === 'nide'` | `... || activeTab === 'nide' || activeTab === 'nagi'` |
| Rota dinâmica (linha 1803) | `moduleRoutes[resolvedActiveTab] && ...` | `moduleRoutes[resolvedActiveTab] && ... && resolvedActiveTab !== 'nagi'` |

### Resultado

Agora, ao clicar em NAGI no sidebar do SagB:
1. ✅ O sidebar do SagB **desaparece** completamente
2. ✅ O header do SagB **desaparece** completamente
3. ✅ O NAGI ocupa a viewport inteira com seu próprio shell
4. ✅ O switch case `'nagi'` executa com `onBack` e `onOpenTab` corretos
5. ✅ Ao clicar "Voltar ao SagB", o sidebar e header do SagB retornam

---

## 2. Causa Raiz

### Por que o shell do SagB ainda enquadrava o NAGI

```
App.tsx (layout principal)
├── <Sidebar />                    ← SagB sidebar (NUNCA escondia para 'nagi')
├── <main>
│   ├── <header />                 ← SagB header (NUNCA escondia para 'nagi')
│   └── <renderContent()>
│       ├── moduleRoutes['nagi']   ← ROTA A: renderiza NAGIPage SEM props
│       │                          ← (rota dinâmica executa PRIMEIRO)
│       └── switch case 'nagi'     ← ROTA B: NUNCA executa
│           <NAGIPage onBack={...} onOpenTab={...}/>
```

O fluxo de renderização:
1. `activeTab = 'nagi'`
2. `hideSidebar` é `false` → Sidebar do SagB renderizado
3. `hideHeader` é `false` → Header do SagB renderizado
4. `renderContent()` → `getModuleRoutes()` retorna o elemento NAGI (sem props)
5. O NAGI aparece **dentro** do `<main>`, com o sidebar do SagB à esquerda
6. O NagiShell tenta usar `100vw` mas está preso dentro do flex container

---

## 3. Arquivo Alterado

| Arquivo | Linhas alteradas |
|---|---|
| [`App.tsx`](Z:/00_sagb/App.tsx:1711) | Linha 1711: add `|| activeTab === 'nagi'` ao `hideSidebar` |
| [`App.tsx`](Z:/00_sagb/App.tsx:1712) | Linha 1712: add `|| activeTab === 'nagi'` ao `hideHeader` |
| [`App.tsx`](Z:/00_sagb/App.tsx:1803) | Linha 1803: add `&& resolvedActiveTab !== 'nagi'` à rota dinâmica |

Apenas **1 arquivo**, **3 linhas** alteradas. Correção mínima e precisa.

---

## 4. O que foi preservado

Tudo o que foi criado na MEGA-ETAPA 06 foi **totalmente preservado**:

| Componente | Preservado |
|---|---|
| NagiShell | ✅ |
| NagiSidebar | ✅ |
| NagiDashboard | ✅ |
| NAGIView (refatorado) | ✅ |
| Tokens CSS | ✅ |
| NAGIPage | ✅ (já estava correto) |

Nenhum componente interno do NAGI precisou ser alterado.

---

## 5. Como ficou a entrada do NAGI agora

```
FLUXO: SagB → NAGI

1. Usuário clica "NAGI" no sidebar do SagB
2. activeTab = 'nagi'
3. hideSidebar = true → SagB sidebar DESAPARECE
4. hideHeader = true → SagB header DESAPARECE
5. Rota dinâmica pula NAGI
6. Switch case renderiza:
   <NAGIPage onBack={() => setActiveTab('ecosystem')}
             onOpenTab={(tab) => setActiveTab(tab)} />
7. NAGIPage renderiza NagiShell
8. NagiShell ocupa 100vw × 100dvh → SISTEMA PRÓPRIO


FLUXO: NAGI → SagB

1. Usuário clica "Voltar ao SagB" no footer da sidebar do NAGI
2. onBack() → setActiveTab('ecosystem')
3. activeTab = 'ecosystem'
4. hideSidebar = false → SagB sidebar REAPARECE
5. hideHeader = false → SagB header REAPARECE
6. Usuário está de volta ao ecossistema SagB
```

---

## 6. Reflexão Crítica

### Por que a primeira execução ainda ficou com cara de módulo encaixado?

Porque o ajuste foi **apenas no nível do componente NAGI**, sem tocar no **layout global do SagB**. O NagiShell foi construído com `width: 100vw` e `height: 100dvh` esperando ocupar a tela inteira, mas o SagB nunca "soltava" a tela — o sidebar e header continuavam renderizados.

Foi um erro de **suposição de layout**: assumir que `100vw` dentro de um flex container `flex-1` se comportaria como viewport cheia. Tecnicamente, até funcionava (o NagiShell sobrepunha o sidebar visualmente), mas o resultado visual era de dois sidebars concorrentes.

### O que estava prendendo o NAGI ao shell do SagB?

Duas condições booleanas simples:
```javascript
hideSidebar = ... || activeTab === 'nide'  // faltava 'nagi'
hideHeader = ... || activeTab === 'nide'   // faltava 'nagi'
```

E a precedência da rota dinâmica sobre o switch case. Três caracteres (`'nagi'`) em cada condição teriam resolvido desde o início.

### Agora a sensação de sistema independente foi realmente atingida?

**Sim.** Com o sidebar e header do SagB completamente ocultos, o NAGI ocupa a viewport de ponta a ponta. A única diferença técnica é que a URL ainda é a mesma do SPA do SagB — mas isso é invisível para o usuário.

A experiência é: "entre no NAGI → saia do SagB → navegue no NAGI → clique 'Voltar ao SagB' → volte ao SagB".

### O que ainda pode denunciar visualmente que está "dentro" do SagB?

1. **A fonte Rubik** — é a mesma do SagB, então há consistência (o que é bom, não ruim)
2. **Os tokens CSS** — `var(--nagi-*)` são derivados do Alice UI, mas isso é invisível
3. **A transição** — a troca entre SagB e NAGI é instantânea, sem animação de "entrada em outro sistema". Uma transição sutil (fade ou slide) melhoraria ainda mais a sensação

### O que eu faria para deixar ainda mais convincente

1. **Animação de transição**: um fade-out/fade-in de ~200ms ao entrar/sair do NAGI daria a sensação de "portal"
2. **Body class**: adicionar `class="module-nagi"` ao body quando NAGI estiver ativo, para permitir CSS específico
3. **Ícone de loading na transição**: um breve "Carregando NAGI..." enquanto o módulo monta

Mas esses são refinamentos. A correção estrutural está completa e funcional.

---

## 7. Critérios de Pronto

| Critério | Status |
|---|---|
| Sidebar do SagB some completamente da experiência do NAGI | ✅ |
| NAGI entra como sistema full screen real | ✅ |
| Sidebar do NAGI vira a navegação principal da tela | ✅ |
| Dashboard é a home oficial do módulo | ✅ |
| Única ponte visível com SagB é "Voltar ao SagB" | ✅ |
| Sensação geral é de sistema autônomo | ✅ |
| Lógica já construída permanece íntegra | ✅ |

---

*Documento registrado em `Z:\00_sagb\src\modules\nagi\plans\` conforme regra permanente de governança documental do módulo.*
