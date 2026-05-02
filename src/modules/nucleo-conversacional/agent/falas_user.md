# falas_user

## objetivo
Registrar literalmente as falas do usuário associadas a este módulo/agente, sem resumir, corrigir, reinterpretar ou reorganizar o texto.

## padrão obrigatório
- copiar a fala do usuário exatamente como foi dita/escrita;
- não resumir;
- não corrigir ortografia;
- não trocar palavras;
- não transformar em ata;
- registrar data/hora local quando disponível.

## registros

## 2026-05-02 13:46
ative o Z:\SagB\src\modules\nucleo-conversacional\agent\prompt_ativacao_cline.md

## 2026-05-02 13:48
**[URGENTE: AUDITORIA DE CONFORMIDADE E ANTI-DRIFT - FASE 2]**

Olá. Quero que você atue agora na sua capacidade de OWNER oficial deste módulo. Precisamos adequar este módulo ao novo padrão de governança canônica estabelecido pela orquestração principal.

Sua tarefa é fazer uma **varredura completa e silenciosa** em todo o escopo do seu módulo, garantindo 100% de conformidade com as regras recentes. Ao final, apresente um relatório rápido das correções executadas.

**Passos obrigatórios da sua varredura (Siga nesta ordem e execute os ajustes necessários):**

1.  **Auditoria Documental (`docs/governanca_sagb/padrao_modulos_plugaveis.md`)**
    *   Verifique se os 4 arquivos canônicos existem na raiz do seu módulo: `manifest.ts`, `plano_modulo.md`, `decisions.md`, `changelog.md`. 
    *   Se não existirem, crie-os imediatamente seguindo o template oficial da Central de Padrões.
    *   Verifique se o seu nome está explícito como owner principal no `manifest.ts`.

2.  **Auditoria Visual (DEC-008 - Padrão Visual Canônico)**
    *   Faça um *grep* / busca em todos os `.tsx` do seu módulo.
    *   **Remova e corrija** qualquer cor hexadecimal ou RGB aplicada inline (`style={{ backgroundColor: '#FFF' }}`).
    *   Substitua por tokens semânticos do SagB utilizando Tailwind (ex: `bg-white dark:bg-sagb-bg`, `text-gray-900 dark:text-sagb-text`).
    *   Verifique se há alguma família de fontes diferente sendo importada. A fonte global oficial é unicamente a **Inter**.

3.  **Auditoria de Runtime (Anti-Fallback)**
    *   Assegure-se de que os seus componentes e páginas estão registrados e exportados corretamente através do `manifest.ts` para que o App.tsx / ModuleRegistry os consumam dinamicamente.
    *   O seu módulo não pode depender de rotas ou componentes legados emulados.

Use as ferramentas necessárias para ler os padrões (ex: leia `docs/governanca_sagb/padrao_modulos_plugaveis.md`), realize as modificações e, apenas quando terminar e validar, me entregue o relatório do que estava fora do padrão e foi corrigido.


