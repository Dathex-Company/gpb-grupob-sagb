# decisions — mentorias

## 30/04/2026 - Módulo alinhado ao padrão canônico de governança do SagB.
- Pasta `agent` limitada aos 4 arquivos canônicos definidos em `docs/governanca_sagb/padrao_unificado_governanca.md`.

## 03/05/2026 - Refatoração completa para padrão canônico de módulos plugáveis.

### Decisões

1. **Fullscreen via ModuleRoute type** — Adicionado campo `fullscreen?: boolean` ao tipo `ModuleRoute` para permitir que cada módulo declare se deve rodar em tela cheia. Futuramente o App.tsx pode ler isso dinamicamente em vez de hardcoded.

2. **View state interno mantido** — O roteamento interno via `useState<'dashboard' | 'library' | 'detail'>` foi preservado por ser mais leve que rotas aninhadas e não poluir o roteador global do SagB.

3. **`sagb:navigate` como padrão de retorno** — Adotado o evento customizado `sagb:navigate` (mesmo padrão usado pelo Gestão Financeira) em vez de `window.history.back()` (que quebra no CRM).

4. **Tokens `--sagb-*` como única fonte de cor** — Substituídas todas as ocorrências de cores hardcoded e `dark:` por tokens do tema. O módulo agora respeita o tema atual sem duplicação de definições.

5. **Header canônico 2 colunas** — Adotado o mesmo padrão do `sagb_bridge` e `configuracoes-ambiente`: badge "Módulo Oficial" à esquerda, metadata (responsável) + ações (Docs, Voltar) à direita.

6. **Owner no manifest** — Definido `owner.type: 'agent'` como placeholder. Deve ser atualizado quando houver um responsável humano ou agente específico designado.

7. **`plano_modulo.md` sem planejamento futuro** — Documentado apenas o estado atual do módulo, conforme solicitação do usuário. Nenhuma ET (etapa futura) foi incluída.
