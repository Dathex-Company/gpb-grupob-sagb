# Plano de Padronização Documental — Central de Padrões

## Contexto
O módulo [`central_padroes`](src/modules/central_padroes/manifest.ts) possui um agente (Zico Padron) com quatro documentos principais que precisam ser alinhados ao padrão de governança do SagB.

## Baseline Atual

### 1. [`persona.md`](src/modules/central_padroes/agent/persona.md)
- **Estado**: Estrutura básica com papel, identidade, postura consultiva e missões ativas.
- **Lacunas**: Falta de limites explícitos, critérios de decisão e referência ao protocolo de log.

### 2. [`owner.md`](src/modules/central_padroes/agent/owner.md)
- **Estado**: Tabela simples com owner principal, secundário e orquestração.
- **Lacunas**: Status inconsistente ("PARCIAL" vs "PENDENTE"), falta de critério para owner secundário.

### 3. [`decisions.md`](src/modules/central_padroes/decisions.md)
- **Estado**: Lista de decisões em formato de bullet points com datas.
- **Lacunas**: Ausência de template estruturado (contexto, decisão, impacto, riscos, ações).

### 4. [`session-log.md`](src/modules/central_padroes/agent/session-log.md)
- **Estado**: Log contínuo com estrutura de turno e registros atuais.
- **Lacunas**: Falta de vínculo explícito com `decisions.md` e padronização de timestamps.

## Padrão‑Alvo Proposto

### 1. Persona (`persona.md`)
```
# Persona: Zico Padron — Central de Padrões

## Papel e Identidade
[Texto existente mantido]

## Postura Consultiva e Desafiadora
[Texto existente mantido]

## Limites Operacionais
- Não executa código diretamente sem revisão arquitetural.
- Não altera padrões homologados sem consenso do owner secundário.
- Não ignora o protocolo de log contínuo.

## Missões Ativas
[Lista atualizada com prioridades]

## Protocolo Operacional Obrigatório
1. Leitura de `persona.md` ao ser ativado.
2. Atualização de `session-log.md` a cada turno.
3. Registro de decisões arquiteturais em `decisions.md`.
4. Consulta ao `owner.md` para escalonamento.
```

### 2. Owner (`owner.md`)
```
# Owner e Accountability — Central de Padrões

| Papel | Responsável | Status | Critério de Ativação |
|-------|-------------|--------|----------------------|
| Owner Principal | Zico Padron (Agente do Módulo) | ATIVO | Ativação via `prompt-ativacao-cline.md` |
| Owner Secundário | A DEFINIR | PENDENTE | Nomeação por Pierre Zanulli |
| Orquestração | Pierre Zanulli | ATIVO | Decisões estratégicas de módulo |

**Accountability Operacional**
- O owner principal responde por conformidade documental.
- O owner secundário atua como revisor de padrões.
- A orquestração resolve conflitos de governança.
```

### 3. Decisions (`decisions.md`)
```
# Decisões — Central de Padrões

Registro estruturado das decisões arquiteturais e operacionais do módulo.

## Template de Decisão
```md
### [YYYY‑MM‑DD] Título da Decisão
**Contexto:** [Por que a decisão foi necessária]
**Decisão:** [O que foi decidido]
**Impacto:** [Efeito no módulo e dependências]
**Riscos:** [Possíveis problemas identificados]
**Ações:** [Passos para implementação]
**Responsável:** [Quem executa]
```

## Histórico de Decisões

### [2026‑04‑12] Migração para Arquitetura de Módulo Plugável
**Contexto:** Documentação solta em `docs/standards` precisava de estrutura oficial.
**Decisão:** Mover para `src/modules/central_padroes` com padrão de módulo plugável.
**Impacto:** Centralização de padrões e integração com registry.
**Riscos:** Quebra de referências legadas.
**Ações:** Criação de `manifest.ts`, `routes.tsx`, `module‑doc.ts`.
**Responsável:** Zico Padron.

[Demais decisões convertidas para o template]
```

### 4. Session‑Log (`session‑log.md`)
```
# Log Contínuo de Operação — Zico Padron

Este documento consolida o registro cronológico das interações na **Central de Padrões**.

## Estrutura do Turno
```md
## YYYY‑MM‑DD HH:MM
**autor:** [mensagem]

## YYYY‑MM‑DD HH:MM
**zico‑padron:** [resposta/ação | referência‑decisão]
```

## Protocolo de Log
1. Cada interação com o usuário gera dois turnos (entrada + resposta).
2. Decisões arquiteturais devem referenciar o ID da decisão em `decisions.md`.
3. Timestamps no fuso America/Sao_Paulo (UTC‑3).

---

## Histórico

[Log existente mantido com formatação padronizada]
```

## Checklist de Conformidade

### ✅ `persona.md`
- [ ] Identidade e papel claros
- [ ] Postura consultiva definida
- [ ] Limites operacionais explícitos
- [ ] Missões ativas priorizadas
- [ ] Protocolo operacional completo

### ✅ `owner.md`
- [ ] Tabela com papéis, responsáveis e status
- [ ] Status consistentes (ATIVO/PENDENTE/INATIVO)
- [ ] Critério de ativação por papel
- [ ] Accountability operacional descrita

### ✅ `decisions.md`
- [ ] Template estruturado de decisão
- [ ] Histórico convertido para template
- [ ] Contexto, decisão, impacto, riscos, ações
- [ ] Responsável atribuído

### ✅ `session‑log.md`
- [ ] Estrutura de turno padronizada
- [ ] Timestamps consistentes
- [ ] Referência a decisões quando aplicável
- [ ] Protocolo de log documentado

## Próximos Passos

1. **Validação do plano** com o usuário
2. **Implementação** das alterações nos quatro arquivos
3. **Verificação** de conformidade cruzada
4. **Atualização** do `session‑log.md` com a decisão de padronização

## Dependências Externas
- **Supabase**: 0 tabelas utilizadas (confirmado por varredura global)
- **Integrações**: Nenhuma injeção externa detectada
- **Registry**: Módulo registrado em [`moduleRegistry.ts`](src/core/modules/moduleRegistry.ts:14)