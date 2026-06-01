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

## 2026-05-31 22:26 (America/Sao_Paulo)

TAREFA: SagB | Telas Avançadas | MEGA-ETAPA 02 | Central de Telas Avançadas — Biblioteca + Estúdio + Referências

Cássio, com base na auditoria já realizada do módulo atual `src/modules/telas_avancadas/`, quero que você execute uma evolução estrutural grande e completa desta frente.

Objetivo macro
Transformar o módulo atual de Telas Avançadas em uma frente muito mais completa, chamada funcionalmente de uma Central de Telas Avançadas, mantendo tudo dentro do mesmo módulo nesta etapa, porém com separação interna clara de responsabilidades.

A ideia não é mais deixar esse módulo apenas como uma biblioteca simples de HTML/URL.
Quero que ele passe a contemplar, de forma organizada:

1. Biblioteca
2. Estúdio
3. Referências
4. Preview / Exportação / Publicação

Importante:
nesta etapa, eu quero tudo isso dentro da mesma missão e dentro do mesmo módulo, sem criar outro módulo separado agora.
Mas isso não significa misturar tudo.
Quero tudo junto no produto, porém internamente bem separado por áreas, páginas, componentes, services, store e types.

## 2026-05-31 22:42 (America/Sao_Paulo)

TAREFA: SagB | Telas Avançadas | MEGA-ETAPA 03 | Estabilização Técnica + Auditoria Funcional e Visual da Central

Cássio, agora a prioridade não é adicionar novas features soltas.

A prioridade desta etapa é:
1. estabilizar a entrega
2. corrigir o que estiver comprometendo robustez
3. auditar profundamente a Central de Telas Avançadas como produto real
4. validar se Biblioteca, Estúdio, Referências e Preview/Publicação estão realmente bons na prática
5. devolver um diagnóstico honesto com ajustes executados e pontos ainda pendentes

## 2026-06-01 00:00 (America/Sao_Paulo)

TAREFA: SagB | Telas Avançadas | MEGA-ETAPA 04 | Refino Premium de UX/UI + Evolução Real do Estúdio

Cássio, agora que a Central de Telas Avançadas foi estruturada e estabilizada, a prioridade desta etapa é transformar essa base em uma ferramenta realmente forte, clara e convincente como produto.

Não quero nova expansão caótica.
Quero refino premium de experiência, principalmente no Estúdio, mas também melhorando Biblioteca, Referências e Preview/Publicação.

Contexto consolidado
Hoje o módulo telas_avancadas já funciona como uma Central com:
- Biblioteca
- Estúdio
- Referências
- Preview / Exportação / Publicação

A base estrutural foi implantada e a estabilização técnica foi concluída, inclusive com:
- npm run dev ok
- npm run build ok

Agora a missão muda:
não é mais provar que a Central existe.
É fazer ela parecer, funcionar e conduzir como um produto muito melhor.

Objetivo macro
Elevar a Central de Telas Avançadas de uma base funcional para uma ferramenta madura de uso interno, com foco em:
1. UX mais guiada
2. interface mais clara
3. melhor hierarquia visual
4. fluxo de criação mais forte
5. preview mais útil
6. referências mais bem organizadas
7. governança melhor na Biblioteca
8. sensação de plataforma premium, não de formulário técnico

Direção obrigatória desta etapa
Quero que você trate esta etapa como um refino de produto, não apenas como "mais código".

Pergunta central que deve orientar tudo:
"Isso está ajudando de verdade alguém a criar, organizar, visualizar e publicar telas avançadas com clareza?"

Se a resposta for "mais ou menos", melhore.

Estratégia da etapa
Dividir esta evolução em quatro grandes frentes:

A. REFÍNO DO ESTÚDIO
B. REFÍNO DO PREVIEW / EXPORTAÇÃO / PUBLICAÇÃO
C. REFÍNO DA BIBLIOTECA
D. REFÍNO DE REFERÊNCIAS + HIERARQUIA VISUAL DA CENTRAL
