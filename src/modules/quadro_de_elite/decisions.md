# Decisões Estruturais — Quadro de Elite

Este documento registra decisões arquiteturais e operacionais tomadas durante a modernização do módulo.

---

## 2026-04-16
### Migração do AgentFactory para módulo oficial
**Decisão:** Mover o componente `AgentFactory` e seus subcomponentes (`agent-factory/*`) da raiz `components/` para dentro do módulo `quadro_de_elite`.

**Justificativa:**
- Centralizar a responsabilidade de cadastro e gestão de agentes em um único módulo.
- Seguir o padrão modular oficial do SagB, onde cada funcionalidade de domínio reside em seu próprio módulo.
- Facilitar manutenção, evolução e governança.

**Impactos:**
- Arquivos movidos:
  - `components/AgentFactory.tsx` → `src/modules/quadro_de_elite/components/AgentFactory.tsx`
  - `components/agent-factory/*` → `src/modules/quadro_de_elite/components/agent-factory/*`
- Imports ajustados para usar caminhos relativos `../../../` para acessar `types`, `services`, `hooks`.
- A página `QuadroDeElitePage.tsx` agora importa o `AgentFactory` localmente.

### Padrão visual `Docs + Responsável`
**Decisão:** Implementar o cabeçalho padrão do SagB com botão de documentação e identificação do responsável.

**Justificativa:**
- Garantir consistência visual com outros módulos.
- Oferecer acesso rápido à documentação do módulo (`module-doc.ts`).
- Explicitar a responsabilidade da agente Helen Dravet.

**Implementação:**
- Uso do componente `ModuleHeader` de `../../../components/ui/ModuleHeader`.
- Propriedades: `moduleName="Quadro de Elite"`, `ownerName="Helen Dravet"`, `moduleDocPath="../module-doc.ts"`.

### Tipografia operacional de 12px
**Decisão:** Aplicar `text-[12px]` no container principal da página.

**Justificativa:**
- Alinhar com o padrão de tipografia leve e operacional do SagB.
- Reduzir ruído visual e melhorar densidade informativa.

**Implementação:**
- Classe `text-[12px]` adicionada ao `div` raiz de `QuadroDeElitePage.tsx`.

### Atualização de `module-doc.ts`
**Decisão:** Atualizar o campo `arquivos_locais_relevantes` para refletir os novos caminhos.

**Justificativa:**
- Manter a documentação precisa e útil para futuras manutenções.
- Evitar confusão sobre localização dos arquivos.

**Alteração:**
- `components/AgentFactory.tsx` → `src/modules/quadro_de_elite/components/AgentFactory.tsx`
- `components/agent-factory/*` → `src/modules/quadro_de_elite/components/agent-factory/*`

---

## 2026-04-18
### Adoção de ID canônico imutável para agentes
**Decisão:** Adotar `canonicalId` como chave canônica imutável no cadastro estrutural de agentes, seguindo convenção `nome_empresa3_setor3_nivel1_seq3`.

**Justificativa:**
- Garantir legibilidade técnica, rastreabilidade e escalabilidade de identidade de agentes.
- Evitar colisões de nomenclatura entre ventures, setores e níveis.
- Padronizar integração entre cadastro, pastas e relatórios operacionais.

**Implementação inicial:**
- Campo `canonicalId` no contrato `Agent`.
- Campo obrigatório no formulário do Quadro de Elite.
- Validação sintática via regex e parsing semântico de partes (`empresa3`, `setor3`, `nivel1`, `seq3`).
- Bloqueio de edição do ID após criação (imutabilidade).
- Verificação de duplicidade por `canonicalId` e por `seq3` dentro da mesma venture.
- Exposição de `canonicalId` na tabela e inclusão no filtro de busca textual.

**Impactos esperados:**
- Maior consistência dos cadastros em escala.
- Redução de retrabalho por ambiguidades de identificação.
- Base mais segura para migração progressiva de legado.

---

## Próximas decisões pendentes
- Integração com serviços reais (Supabase) para carregamento de `agents`, `businessUnits`, `ventures`.
- Remoção de ruídos visuais excessivos nos subcomponentes do `AgentFactory` (sombras, bordas pesadas).
- Definição de owner_backup no `module-doc.ts`.
