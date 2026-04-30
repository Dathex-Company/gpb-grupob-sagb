# Diretriz de Operação e Refatoração — Studio (Fabi Nunes)

## Ordem de execução recomendada
1. Ler `agent/persona.md`.
2. Ler `agent/prompt-ativacao-cline.md`.
3. Validar escopo atual em `module-doc.ts`.
4. Executar mudanças incrementais em UI, serviços e migrações.
5. Registrar turno em `agent/session-log.md`.
6. Registrar decisão relevante em `decisions.md`.
7. Atualizar `changelog.md` com resumo técnico.

## Escopo técnico prioritário
- captura ao vivo multicâmera com estabilidade operacional;
- limite inicial oficial de 2 câmeras simultâneas;
- áudio mestre único para transcrição e CID;
- persistência de metadados e arquivos por câmera no Supabase.

## Critérios de qualidade
- sem regressão no fluxo de upload existente;
- fallback quando hardware/navegador limitar múltiplas câmeras;
- erros operacionais com mensagem clara para usuário;
- rastreabilidade documental completa.
