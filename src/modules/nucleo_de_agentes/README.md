# Módulo: Núcleo de Agentes

## Objetivo
Criar o módulo oficial **Núcleo de Agentes** dentro do SagB, com a tela **Base dos Agentes**, responsável por organizar e exibir as camadas estruturais que definem o comportamento, os limites, o conhecimento e a memória dos agentes do sistema.

## Estrutura do Módulo
```
src/modules/nucleo_de_agentes/
├── index.ts                    # Exportações do módulo
├── manifest.ts                 # Manifesto do módulo
├── routes.tsx                  # Rotas do módulo
├── README.md                   # Esta documentação
├── pages/
│   └── NucleoAgentesPage.tsx   # Página principal
├── components/
│   └── BaseDosAgentesView.tsx  # Componente principal (7 camadas)
├── hooks/                      # Hooks específicos do módulo
├── services/                   # Serviços do módulo
├── store/                      # Estado do módulo
├── types/                      # Tipos TypeScript
└── agent/                      # Configuração do agente
```

## As 7 Camadas Estruturais

1. **Camada 01. Escopo e Acessos** - Onde o agente atua e o que pode acessar
2. **Camada 02. Cultura Oficial** - Identidade, tom de voz e valores
3. **Camada 03. Base Institucional** - Protocolos, padrões e estruturas oficiais
4. **Camada 04. Diretrizes & Compliance** - Regras de segurança, LGPD e bloqueios
5. **Camada 05. Protocolos Oficiais** - Regras operacionais e decisórias
6. **Camada 06. Núcleo de Inteligência** - DNA, conhecimento e permissões dos agentes
7. **Camada 07. Memória dos Agentes** - Cofre Black e memória contínua

## Implementação Realizada

### 1. Estrutura Modular Criada
- ✅ Diretório `src/modules/nucleo_de_agentes/` criado com estrutura padrão
- ✅ Arquivos `manifest.ts`, `index.ts`, `routes.tsx` configurados
- ✅ Módulo registrado no `moduleRegistry` do SagB

### 2. Integração com o Sistema
- ✅ Sidebar atualizada com item "Núcleo de Agentes"
- ✅ Rota `/nucleo_de_agentes` configurada e funcional
- ✅ Sistema de módulos do SagB reconhecendo o novo módulo

### 3. Interface das 7 Camadas
- ✅ Componente `BaseDosAgentesView` criado
- ✅ Grid de 7 cards representando cada camada
- ✅ Modal de detalhes para cada camada
- ✅ Design seguindo o padrão visual do SagB

### 4. Preservação de Funcionalidade
- ✅ Todas as funcionalidades do antigo `GovernanceView` mantidas
- ✅ Transição gradual planejada
- ✅ Backward compatibility garantida

## Critérios de Validação Atendidos

1. ✅ O módulo `nucleo_de_agentes` existe dentro do padrão modular do SagB
2. ✅ O módulo aparece com o nome **Núcleo de Agentes** na Sidebar
3. ✅ A tela principal se chama **Base dos Agentes**
4. ✅ A tela exibe as 7 camadas oficiais em formato de cards
5. ✅ A organização da tela deixa claro que esse módulo é a base cognitiva e normativa dos agentes
6. ✅ O módulo nasce preparado para futura evolução, sem soluções improvisadas

## Próximos Passos (Evolução)

1. **Migração Completa do GovernanceView**
   - Integrar todas as funcionalidades existentes nas 7 camadas
   - Manter compatibilidade com código legado

2. **Expansão das Camadas**
   - Desenvolver interfaces específicas para cada camada
   - Criar fluxos de trabalho por camada

3. **Integração com Outros Módulos**
   - Conectar com `metodologias` para Base Institucional
   - Integrar com `continuous-memory` para Memória dos Agentes
   - Sincronizar com `fabrica-ca` para Núcleo de Inteligência

4. **APIs e Serviços**
   - Criar serviços específicos para cada camada
   - Desenvolver APIs para gestão programática

## Observações Técnicas

- O módulo foi criado como refatoração do `GovernanceView` existente
- A abordagem preserva 100% da funcionalidade atual
- A transição será gradual, permitindo testes e ajustes
- O design system do SagB foi seguido em todos os componentes

## Como Testar

1. Execute `npm run dev`
3. Acesse `http://localhost:5174`
4. Clique em "Núcleo de Agentes" na Sidebar
4. Explore as 7 camadas clicando nos cards
5. Verifique a integração com o sistema

---

**Data da Implementação:** 13/04/2026  
**Responsável:** Brene Sagore  
**Padrão do topo:** botão `Docs` + bloco `Responsável` visível no cabeçalho do módulo.
**Status:** ✅ Implementado e Funcional