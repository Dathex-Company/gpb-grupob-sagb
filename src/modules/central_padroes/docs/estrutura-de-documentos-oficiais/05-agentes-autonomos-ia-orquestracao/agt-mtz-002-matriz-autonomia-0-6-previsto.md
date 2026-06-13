# Matriz de Autonomia Nível 0-6 — previsto (substitui AGT-MTZ-001)

**Código**: AGT-MTZ-002 (substitui AGT-MTZ-001)
**Tipo**: 📊 Matriz
**Domínio**: Agentes Autônomos, IA e Orquestração (DM-05)
**Responsável**: Pierre Zanulli
**Validação necessária**: Pierre + Pietro
**Status**: previsto — **depende de unificação com AGT-MTZ-001**
**Fonte**: [`protocolos-grupob-sagb-geral.md`](../../protocolos-grupob-sagb-geral.md) — item 3.19

---

## ⚠️ Nota de dependência

Este documento substitui a matriz `AGT-MTZ-001` existente no DM-05-AGT. Antes de canonizar, é necessário **unificar** as duas versões. A versão do SagB (0-6) é mais granular e substitui a versão anterior.

## Matriz de Autonomia

| Nível | Nome | Descrição | Exemplo |
|-------|------|-----------|---------|
| 0 | Responder sem ferramenta | Apenas conversação | Responder dúvida conceitual |
| 1 | Consultar dados | Ler informações existentes | Buscar dado no CRM |
| 2 | Sugerir ação | Propor ação sem executar | "Sugiro criar tarefa X" |
| 3 | Preparar ação para aprovação | Montar ação, humano aprova | Preparar e-mail, humano envia |
| 4 | Executar ação reversível | Fazer algo que pode ser desfeito | Criar rascunho, atualizar campo |
| 5 | Executar ação sensível com aprovação | Ação crítica com aprovação explícita | Excluir registro, enviar pagamento |
| 6 | Bloqueado para agentes | Apenas humanos | Assinar contrato, decisão estratégica |

## Regras

1. Nível de autonomia é definido por **agente + escopo**, não globalmente.
2. Subir de nível exige **validação do dono do agente**.
3. Incidente pode **rebaixar temporariamente** o nível.
4. Ações no nível 5 sempre exigem **aprovação humana explícita** (não implícita).

## Dependências

| Tema | Depende de | Motivo |
|------|------------|--------|
| AGT-MTZ-001 (existente) | Pierre | **Unificar antes de canonizar** |
| AGT-POL-003 | Pierre | Tool Use Seguro (relacionado) |
| AGT-PRT-002 | Pierre | Incidente pode rebaixar nível |

---

*Documento previsto — aguardando unificação com AGT-MTZ-001 e validação de Pierre Zanulli*
