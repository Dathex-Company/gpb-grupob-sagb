# Changelog do Módulo nic

Registro de mudanças técnicas, decisões de arquitetura e evolução do módulo **nic**.

---

## [v2.0.0-naming-curadoria] - 2026-05-31

### Adicionado
- Módulo NIC reescrito como **Central de Curadoria de Nomes** do ecossistema.
- `naming/namingSchema.ts` — tipos de dados para nomes, conflitos, decisões e varredura.
- `naming/namingData.ts` — dados de demonstração com 10 nomes reais do ecossistema (GrupoB, StartyB, 3forB, AcadB, TRATO, NIC, Loze, Gluh, CID, NAGI).
- `services/nicNamingService.ts` — lógica de curadoria: aprovar, ajustar, listar, buscar.
- 4 abas de navegação: Visão Geral, Nomes, Pendências, Histórico.
- Seção de conflitos de nome com cards de resolução.
- Varredura de candidatos (8 nomes encontrados em pastas do ecossistema).
- Fluxo de aprovação com observação e detalhamento do item.
- Histórico de decisões com rastreabilidade.

### Alterado
- `NICPage.tsx` — reescrita completa com linguagem simples (sem jargão técnico).
- `NICPage.tsx` — UI aderente ao Alice UI Standard (Rubik, cards compactos, densidade, dark/light via cores fixas).
- `module-doc.ts` — novo propósito focado em curadoria de nomes, novos fluxos e integrações.
- `decisions.md` — registro da mega etapa.

### Removido
- Termos técnicos da interface: "cruzamento semântico", "motor de interpretação", "lente de leitura", "mock docs".
- Estrutura antiga de análise documental (substituída por catálogo de nomes).

### Pendências (Roadmap)
- Persistir dados em Supabase (hoje usa dados mockados).
- Implementar varredura real de diretórios (hoje simulado).
- Conectar saída de decisões ao NAGI.
- Upload e integração com fontes externas de nomes (planilhas, documentos).

---

## [v1.1.1-higienizacao-estrutural] - 2026-04-11

### Removido / Ajustado
- Duplicidade do card `Fluxo Operacional` em `data/nicBlueprint.ts`.
- Mantido o uso de `mockDocs` como ponte temporária até a integração real com o CID.

### Decisão
- Pastas vazias (`components/`, `hooks/`, `services/`, `store/`, `types/`) não foram removidas nesta etapa porque ainda podem compor o padrão estrutural do módulo.
- Itens com `A DEFINIR` foram preservados por serem lacunas formais, não resíduos mortos.

---

## [v1.1.0-formalizacao-modulo] - 2026-04-11

### Adicionado
- `module-doc.ts` com objetivo, integrações, fluxos principais e pendências do NIC.
- Export oficial de `module-doc` no `index.ts` do módulo.

### Consolidado
- Papel do NIC formalizado como módulo interpretativo na cadeia `CID > NIC > NAGI`.
- Registro explícito de que o NIC não é storage primário, e sim camada de leitura estratégica.

### Pendências
- Trocar mocks por integração real com documentos do CID.
- Definir persistência real do histórico de leituras estratégicas.

---

## [v1.0.0-governance-bootstrap] - 2026-04-09

### Adicionado
- Estrutura inicial de histórico local do módulo (changelog.md).
- Base para rastreabilidade contínua de mudanças.

### Pendências (Roadmap)
- Definir owner principal e backup com nome e sobrenome.
- Consolidar persona definitiva do agente responsável.
