# Arquitetura de Módulos Plugáveis do SagB

**Etapa:** ET-02  
**Status:** documentação inicial LOZE-DEV.

---

## 1. Conceito

Módulo plugável é uma unidade funcional registrada no SagB por meio do registry central. Ele deve declarar identidade, rota, página principal e documentação viva. A intenção é permitir evolução por módulos sem recriar o SagB do zero.

## 2. Onde fica o registry

O registry central fica em `src/core/modules/moduleRegistry.ts`.

Ele importa manifests e rotas dos módulos em `src/modules/*` e expõe:

- `moduleRegistry`: lista canônica de módulos plugáveis registrados.
- `getRegisteredModules()`: lista usada pela navegação/sidebar.
- `getModuleRoutes()`: mapa de rotas por `manifest.id` usado pelo shell.

## 3. Como um módulo é registrado

Fluxo atual:

1. Criar pasta em `src/modules/<modulo>/`.
2. Criar `manifest.ts` com id, nome, rota base, ícone, status e owner.
3. Criar `routes.tsx` exportando rota e elemento React.
4. Exportar módulo via `index.ts` quando aplicável.
5. Importar manifest e routes em `src/core/modules/moduleRegistry.ts`.
6. Adicionar objeto `{ manifest, routes }` no array `moduleRegistry`.
7. Sidebar passa a enxergar o módulo se ele não for duplicado/oculto por regras de toggle.

## 4. Papel do `manifest.ts`

O `manifest.ts` define identidade pública e operacional do módulo:

- `id`
- `internalName`
- `displayName`
- `baseRoute`
- `icon`
- `initialStatus`
- `owner`
- eventualmente descrição, categoria e metadados.

Risco atual: formatos de manifest variam entre módulos.

## 5. Papel do `routes.tsx`

O `routes.tsx` declara a rota base e o elemento React do módulo. Ele não é um roteador completo tradicional; no shell atual, o `App.tsx` consulta `getModuleRoutes()` por `manifest.id` e renderiza `element` quando a tab ativa bate com o id.

Risco atual: `path` e `manifest.id` nem sempre têm o mesmo formato.

## 6. Papel do `module-doc.ts`

O `module-doc.ts` deve ser a documentação viva do módulo. Hoje existe, mas com formatos diferentes. No padrão LOZE-DAS, ele deve registrar:

- objetivo;
- owner;
- status;
- rotas;
- tabelas;
- storage;
- functions;
- dependências;
- riscos;
- pendências;
- decisões associadas;
- regra de evolução.

## 7. Como o módulo aparece na navegação

`components/Sidebar.tsx` usa `getRegisteredModules()` para montar itens dinâmicos. A navegação final combina:

- itens fixos do core;
- módulos dinâmicos do registry;
- deduplicação por id e label;
- toggles de ativação;
- ordem personalizada.

## 8. Tipos de módulos

| Tipo | Definição | Exemplo |
|---|---|---|
| Módulo plugável | Registrado em `moduleRegistry.ts` com manifest e routes | CID, TaskZei, Central de Padrões |
| Módulo legado | Vive no shell ou `components/`, sem manifest/registry | Governance, Continuous Memory |
| Submódulo | Parte funcional dentro de módulo maior | Quality Sensor dentro de Monitoramento |
| Módulo lab | Experimental, mockado ou sem maturidade plena | FluxoB, MCP SagB, Telas Avançadas |
| Legado-protegido | Código sensível/Golden Seal que deve ser preservado | Systemic Vision, Management |

## 9. Módulos já no registry

API SagB, Hub Integração, Agentes Comerciais, Cadastro Empresas, Núcleo Conversacional, Núcleo de Agentes, Central de Padrões, Monitoramento, NAGI, NIC, Quadro de Elite, Sala Dev, Mentorias, Metodologias, Missões, RAI, Karaokê, Studio, CID, TaskZei, CRM Ziplia, Configurações, Gestão Financeira, Telas Avançadas, Vídeos IA, Foco Total, SagB Bridge, MCP SagB e FluxoB.

## 10. Módulos fora do registry que devem ser avaliados

- Continuous Memory.
- Intelligence Flow.
- Governance.
- Quality Sensor.
- Dashboard Home.
- Hub/Ecosystem.
- Ventures.
- Homes de QGs/empresas.

## 11. Estrutura padrão recomendada

```text
src/modules/<modulo>/
  index.ts
  manifest.ts
  routes.tsx
  module-doc.ts
  README.md
  pages/
  components/
  services/
  hooks/
  types/
  data/
  __tests__/
```

## 12. Arquivos obrigatórios

1. `manifest.ts`
2. `routes.tsx`
3. `module-doc.ts`
4. `index.ts`

## 13. Arquivos recomendados

1. `README.md`
2. `services/`
3. `types/`
4. `__tests__/`
5. `docs/` quando o módulo tiver documentação própria.

## 14. Status de maturidade

- `core`
- `parcial`
- `lab`
- `legado-protegido`
- `confuso`
- `pendente de validação`

## 15. Riscos atuais

1. Mistura entre tab interna e rota URL.
2. Formatos diferentes de manifest e module-doc.
3. Componentes legados fora do registry com migrations reais.
4. Módulos mockados aparecendo como ativos.
5. Duplicidade de domínio entre módulos.

## 16. Regra antes de criar novo módulo

Antes de criar qualquer módulo novo, verificar:

- registry;
- docs existentes;
- migrations existentes;
- rotas existentes;
- módulos semelhantes;
- tabelas semelhantes;
- services semelhantes;
- Quarentena Técnica;
- ADRs pendentes.
