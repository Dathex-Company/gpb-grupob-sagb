\# Documento Técnico — Simulador de Viabilidade e Resultado de Mentorias

Status: em construção — não canônico  
Versão: documento vivo, sem versionamento até aprovação integral  
Data: 01-08-2026  
Fuso: America/Sao\_Paulo  
Responsável estratégico: Douglas Rodrigues / GrupoB  
Responsável técnico: a definir  
Família documental sugerida: Mentorias / Sistemas / Simuladores

\---

\# Índice

1\. Síntese executiva  
2\. Objetivo  
3\. Escopo do MVP  
4\. Arquitetura funcional  
5\. Navegação e telas  
6\. Entradas comerciais  
7\. Aquisição e marketing  
8\. Custos  
9\. Upsells  
10\. Cenários  
11\. Fórmulas  
12\. Indicadores  
13\. Planejado versus realizado  
14\. Regras e alertas  
15\. Modelo de dados  
16\. Arquitetura técnica  
17\. Segurança e governança  
18\. UI Loze Ultra Clean  
19\. Testes  
20\. Critérios de aceite  
21\. Roadmap  
22\. Riscos  
23\. Questões abertas  
24\. Síntese final

\---

\# 1\. Síntese executiva

O Simulador de Viabilidade e Resultado de Mentorias será uma ferramenta de planejamento, decisão e acompanhamento financeiro-comercial capaz de transformar premissas de uma turma em projeções claras de receita, custos, lucro, ROI, aquisição, ponto de equilíbrio e potencial de upsell.

O sistema deve responder:

\- quantas pessoas são necessárias para viabilizar a turma;  
\- quanto será faturado por faixa de preço;  
\- quanto pode ser investido em marketing;  
\- qual será o custo por participante;  
\- qual será o CAC por canal;  
\- quantos leads serão necessários;  
\- qual será o ponto de equilíbrio;  
\- qual será o lucro com e sem upsell;  
\- qual será o ROI;  
\- o que acontece nos cenários conservador, provável e otimista;  
\- qual foi a diferença entre planejado e realizado.

O sistema não deve ser apenas uma calculadora financeira. Deve funcionar como instrumento de decisão, preparação comercial, controle operacional e aprendizado entre uma edição e outra.

\---

\# 2\. Objetivo

Permitir criar, comparar, aprovar e acompanhar simulações financeiras e comerciais de mentorias.

Objetivos secundários:

\- reduzir decisões baseadas em percepção;  
\- antecipar riscos de prejuízo;  
\- definir metas comerciais realistas;  
\- calcular orçamento de marketing;  
\- comparar modelos de preço;  
\- projetar capacidade e ocupação;  
\- medir dependência de upsell;  
\- separar receita principal de receitas complementares;  
\- registrar premissas usadas na decisão;  
\- criar histórico de versões e cenários;  
\- comparar planejado e realizado;  
\- melhorar a próxima turma com base em evidências.

\---

\# 3\. Escopo do MVP

Incluído:

\- cadastro da simulação;  
\- vínculo com uma mentoria;  
\- definição de capacidade e participantes;  
\- múltiplas faixas de preço;  
\- cortesias e descontos;  
\- aquisição por diferentes canais;  
\- funil comercial;  
\- custos fixos;  
\- custos por participante;  
\- custos percentuais;  
\- impostos e taxas;  
\- comissões;  
\- múltiplos upsells;  
\- cenários;  
\- cálculo automático;  
\- ponto de equilíbrio;  
\- ROI, CAC, ROAS e margem;  
\- salvamento;  
\- duplicação;  
\- histórico;  
\- exportação;  
\- comparação planejado versus realizado.

Fora do MVP:

\- processamento de pagamento;  
\- emissão fiscal;  
\- contabilidade completa;  
\- conciliação bancária;  
\- CRM completo;  
\- gestão de conteúdo da mentoria;  
\- automação de cobrança;  
\- recomendação autônoma por IA;  
\- contratação de fornecedores;  
\- gestão integral do evento.

\---

\# 4\. Arquitetura funcional

Mentoria  
→ Simulação  
→ Premissas  
→ Receita \+ Aquisição \+ Custos \+ Upsells  
→ Motor de cálculo  
→ Cenários  
→ Dashboard \+ Viabilidade \+ Ponto de equilíbrio \+ Relatório  
→ Planejado  
→ Realizado  
→ Comparação e aprendizado

Entidades centrais:

\- Mentoria  
\- Simulação  
\- Cenário  
\- Faixa de preço  
\- Canal de aquisição  
\- Etapa de funil  
\- Item de custo  
\- Oferta de upsell  
\- Resultado calculado  
\- Registro realizado  
\- Aprovação  
\- Histórico

Estados da simulação:

\- Rascunho  
\- Em análise  
\- Aprovada  
\- Em comercialização  
\- Em execução  
\- Realizada  
\- Fechada  
\- Arquivada  
\- Cancelada

\---

\# 5\. Navegação e telas

Local recomendado:

NIDE  
└── Mentorias  
    └── Mentoria específica  
        ├── Visão geral  
        ├── Estrutura  
        ├── Materiais  
        ├── Sessões  
        ├── Comercial  
        ├── Simulador  
        └── Histórico

Rotas sugeridas:

/nide/mentorias/:mentoriaId/simulacoes  
/nide/mentorias/:mentoriaId/simulacoes/nova  
/nide/mentorias/:mentoriaId/simulacoes/:simulationId  
/nide/mentorias/:mentoriaId/simulacoes/:simulationId/realizado

Telas:

1\. Lista de simulações  
2\. Assistente de criação  
3\. Visão executiva  
4\. Premissas e detalhes  
5\. Comparação de cenários  
6\. Planejado versus realizado

Assistente de criação:

1\. Identificação  
2\. Capacidade e participantes  
3\. Preços e receita  
4\. Aquisição e comercial  
5\. Custos  
6\. Upsells  
7\. Cenários  
8\. Revisão

\---

\# 6\. Entradas comerciais

Capacidade:

\- capacidade total;  
\- vagas reservadas;  
\- cortesias;  
\- vagas patrocinadas;  
\- participantes pagantes projetados;  
\- participantes confirmados;  
\- participantes realizados.

Regra:

pagantes \+ cortesias \+ patrocinados ≤ capacidade total

Faixas de preço:

\- nome da faixa;  
\- quantidade planejada;  
\- preço de tabela;  
\- desconto;  
\- preço efetivo;  
\- origem ou público;  
\- data inicial e final;  
\- limite de vagas.

Condições possíveis:

\- cupom;  
\- preço de parceiro;  
\- preço para sócio;  
\- preço para indicado;  
\- pacote;  
\- venda corporativa;  
\- bolsa parcial;  
\- cortesia;  
\- patrocínio.

Riscos de receita:

\- cancelamento;  
\- reembolso;  
\- inadimplência;  
\- chargeback;  
\- receita contratada;  
\- receita recebida;  
\- receita em risco.

\---

\# 7\. Aquisição e marketing

Canais:

\- base própria;  
\- indicação;  
\- parceiros;  
\- orgânico;  
\- WhatsApp;  
\- Instagram;  
\- LinkedIn;  
\- eventos;  
\- mídia paga;  
\- outbound;  
\- comercial direto;  
\- afiliados;  
\- outros.

Campos por canal:

\- orçamento;  
\- leads;  
\- contatos;  
\- reuniões ou SADEs;  
\- propostas;  
\- vendas;  
\- ticket médio;  
\- comissão;  
\- custo adicional;  
\- receita atribuída.

Funil inicial:

Alcance → Lead → Contato → Reunião/SADE → Proposta → Venda → Comparecimento

Métricas:

\- CPL;  
\- custo por reunião;  
\- custo por proposta;  
\- CAC;  
\- conversão por etapa;  
\- receita;  
\- ROAS;  
\- margem por canal;  
\- participação no total de vendas.

Regra obrigatória: vendas da base, indicação, parceiros e mídia paga devem ficar separadas.

\---

\# 8\. Custos

Custos fixos:

\- espaço;  
\- plataforma;  
\- equipe;  
\- audiovisual;  
\- fotografia e vídeo;  
\- produção;  
\- design;  
\- página de venda;  
\- ferramentas;  
\- deslocamento;  
\- hospedagem;  
\- palestrante ou convidado;  
\- seguro;  
\- equipamentos;  
\- contingência.

Custos por participante:

\- coffee break;  
\- alimentação;  
\- material;  
\- apostila;  
\- certificado;  
\- kit;  
\- brinde;  
\- licença;  
\- suporte;  
\- envio;  
\- atendimento.

Custos percentuais:

\- imposto;  
\- taxa de pagamento;  
\- antecipação;  
\- comissão comercial;  
\- comissão de parceiro;  
\- royalties;  
\- plataforma de venda;  
\- afiliado;  
\- reembolso;  
\- inadimplência;  
\- chargeback.

Regra contra dupla contagem: o mesmo gasto não pode entrar em mais de uma categoria.

\---

\# 9\. Upsells

Campos:

\- nome;  
\- tipo;  
\- público elegível;  
\- momento da oferta;  
\- preço;  
\- conversão projetada;  
\- compradores;  
\- receita;  
\- taxa de pagamento;  
\- imposto;  
\- comissão;  
\- custo de entrega;  
\- reembolso;  
\- margem.

Tipos:

\- outra mentoria;  
\- mentoria individual;  
\- implantação;  
\- E.D.A.;  
\- M.A.V.;  
\- acompanhamento;  
\- plano recorrente;  
\- consultoria;  
\- imersão;  
\- evento;  
\- produto digital;  
\- assinatura.

O dashboard deve mostrar separadamente:

1\. resultado da operação sem upsell;  
2\. resultado consolidado com upsell.

Uma operação que só se torna viável com upsell deve receber alerta de dependência.

\---

\# 10\. Cenários

Obrigatórios:

\- Conservador  
\- Provável  
\- Otimista

Variáveis por cenário:

\- participantes;  
\- preço efetivo;  
\- desconto;  
\- investimento em marketing;  
\- CPL;  
\- conversão;  
\- reembolso;  
\- inadimplência;  
\- inflação de custos;  
\- conversão de upsell;  
\- custo de entrega.

O cenário aprovado deve ser escolhido explicitamente. O sistema não deve assumir automaticamente que o otimista é o objetivo operacional.

\---

\# 11\. Fórmulas

Receita principal bruta:

receita\_principal\_bruta \= Σ (quantidade\_da\_faixa × preço\_efetivo\_da\_faixa) \+ patrocínios

Compradores de upsell:

compradores\_upsell \= arredondar(participantes\_elegíveis × taxa\_conversão\_upsell)

Receita de upsell:

receita\_upsell\_bruta \= Σ (compradores\_upsell × preço\_upsell)

Receita bruta total:

receita\_bruta\_total \= receita\_principal\_bruta \+ receita\_upsell\_bruta \+ outras\_receitas

Perdas:

reembolsos \= base\_reembolsável × taxa\_reembolso  
inadimplência \= receita\_a\_prazo × taxa\_inadimplência  
chargebacks \= receita\_cartão × taxa\_chargeback

Taxas:

taxas\_pagamento \= Σ (receita\_por\_meio\_pagamento × taxa\_percentual) \+ taxas\_fixas \+ antecipação

Impostos:

impostos \= base\_tributável\_configurada × alíquota

Receita líquida:

receita\_líquida \= receita\_bruta\_total \- reembolsos \- inadimplência \- chargebacks \- taxas\_pagamento \- impostos

Custos:

custos\_fixos \= Σ itens\_fixos  
custos\_unitários \= Σ (quantidade\_aplicável × custo\_unitário)  
custos\_percentuais \= Σ (base\_do\_item × percentual)

Custo total:

custo\_total \= custos\_fixos \+ custos\_unitários \+ custos\_percentuais \+ marketing \+ contingência

Resultado operacional:

resultado\_operacional \= receita\_líquida \- custo\_total

Margem:

margem\_operacional \= resultado\_operacional ÷ receita\_líquida × 100

ROI:

ROI \= resultado\_operacional ÷ investimento\_total × 100

ROAS:

ROAS \= receita\_atribuída\_à\_mídia ÷ investimento\_em\_mídia

CAC pago:

CAC\_pago \= (investimento\_em\_mídia \+ custos\_comerciais\_do\_canal) ÷ clientes\_novos\_do\_canal

Ticket médio:

ticket\_médio \= receita\_principal\_bruta ÷ participantes\_pagantes

Ocupação:

ocupação \= participantes\_totais ÷ capacidade\_total × 100

Contribuição unitária:

contribuição\_unitária\_média \= receita\_líquida\_principal\_por\_pagante \- custo\_variável\_médio\_por\_pagante

Ponto de equilíbrio:

ponto\_equilíbrio\_pagantes \= arredondar\_para\_cima(custos\_fixos ÷ contribuição\_unitária\_média)

Conversão total:

taxa\_conversão\_total \= taxa\_lead\_contato × taxa\_contato\_reunião × taxa\_reunião\_proposta × taxa\_proposta\_venda

Leads necessários:

leads\_necessários \= arredondar\_para\_cima(vendas\_novas\_necessárias ÷ taxa\_conversão\_total)

Planejado versus realizado:

diferença\_absoluta \= realizado \- planejado

diferença\_percentual \= (realizado \- planejado) ÷ planejado × 100

\---

\# 12\. Indicadores

Executivos:

\- receita bruta;  
\- receita líquida;  
\- custo total;  
\- resultado operacional;  
\- margem;  
\- ROI;  
\- ponto de equilíbrio;  
\- ocupação;  
\- ticket médio;  
\- receita por participante;  
\- CAC;  
\- ROAS;  
\- dependência de upsell.

Comerciais:

\- leads;  
\- reuniões;  
\- propostas;  
\- vendas;  
\- conversão;  
\- vendas por canal;  
\- ticket por canal;  
\- vagas restantes;  
\- velocidade de venda;  
\- meta diária necessária.

Financeiros:

\- custos fixos;  
\- custos unitários;  
\- custos percentuais;  
\- impostos;  
\- taxas;  
\- comissões;  
\- contingência;  
\- receita recebida;  
\- receita a receber;  
\- inadimplência.

\---

\# 13\. Planejado versus realizado

Registrar:

\- participantes inscritos;  
\- pagantes;  
\- presentes;  
\- receita contratada;  
\- receita recebida;  
\- reembolsos;  
\- marketing;  
\- custos reais;  
\- comissões;  
\- impostos;  
\- upsells;  
\- resultado final.

Para cada item:

\- planejado;  
\- realizado;  
\- variação;  
\- justificativa;  
\- responsável;  
\- ação corretiva;  
\- aprendizado.

\---

\# 14\. Regras e alertas

Regras:

\- valores monetários não podem ser negativos;  
\- quantidades devem ser inteiras;  
\- percentuais entre 0% e 100%;  
\- capacidade maior que zero;  
\- cortesias não superam capacidade;  
\- compradores de upsell não superam elegíveis;  
\- receita principal não inclui upsell;  
\- patrocínio fica separado;  
\- imposto e comissão informam base;  
\- todo cenário possui data de cálculo;  
\- cálculo aprovado salva snapshot;  
\- alteração crítica gera nova revisão.

Arredondamento:

\- moeda com duas casas;  
\- percentual com duas casas;  
\- quantidade necessária arredondada para cima;  
\- precisão interna superior à exibida.

Não usar somente Number do JavaScript para dinheiro crítico.

Alertas obrigatórios:

\- ponto de equilíbrio acima da capacidade;  
\- resultado negativo;  
\- margem abaixo da meta;  
\- ROI negativo;  
\- CAC acima da contribuição;  
\- marketing sem vendas;  
\- dependência elevada de upsell;  
\- cortesias excessivas;  
\- preço abaixo do custo unitário;  
\- contingência zerada no presencial;  
\- ausência de imposto ou taxa;  
\- desvio relevante entre planejado e realizado.

\---

\# 15\. Modelo de dados

Tabelas principais:

\- mentorship\_simulations  
\- mentorship\_simulation\_scenarios  
\- mentorship\_price\_tiers  
\- mentorship\_acquisition\_channels  
\- mentorship\_cost\_items  
\- mentorship\_upsell\_offers  
\- mentorship\_simulation\_results  
\- mentorship\_simulation\_actuals  
\- mentorship\_simulation\_approvals  
\- mentorship\_simulation\_history

Convenções:

\- UUID;  
\- workspace\_id;  
\- auditoria;  
\- exclusão lógica;  
\- numeric para dinheiro;  
\- snapshots imutáveis;  
\- RLS.

\---

\# 16\. Arquitetura técnica

Stack:

\- React;  
\- TypeScript;  
\- Tailwind;  
\- Vite;  
\- Supabase;  
\- PostgreSQL.

Separação obrigatória:

\- UI não contém fórmulas;  
\- persistência não define regra de negócio;  
\- motor de cálculo é puro e testável;  
\- validação independe da tela;  
\- resultados guardam versão do cálculo.

Estrutura sugerida:

src/modules/nide/domains/mentorias/simulador/  
├── domain/  
├── application/  
├── repository/  
├── services/  
├── hooks/  
├── store/  
├── components/  
├── pages/  
├── schemas/  
├── tests/  
├── docs/  
├── routes.tsx  
├── domain-manifest.ts  
└── index.ts

Componentes principais:

\- SimulationKpiCard  
\- ScenarioComparison  
\- PriceTierEditor  
\- AcquisitionChannelEditor  
\- CostItemEditor  
\- UpsellEditor  
\- BreakEvenChart  
\- RevenueCompositionChart  
\- CostCompositionChart  
\- FunnelChart  
\- ViabilityBadge  
\- AlertPanel  
\- PlanActualVariance

\---

\# 17\. Segurança e governança

\- RLS por workspace;  
\- permissões por papel;  
\- aprovação restrita;  
\- histórico protegido;  
\- registro de criação, alteração, cálculo, aprovação, reabertura, duplicação, fechamento, exportação e exclusão lógica;  
\- snapshot ao aprovar;  
\- nunca recalcular silenciosamente uma versão aprovada;  
\- dados pessoais de participantes fora do MVP.

\---

\# 18\. UI Loze Ultra Clean

Diretrizes:

\- fonte Rubik;  
\- interface leve e respirada;  
\- ausência de bordas visíveis;  
\- cartões com sombra suave;  
\- raios amplos;  
\- cor institucional como acento;  
\- fundo neutro dominante;  
\- foco acessível;  
\- sidebar moderna;  
\- gradiente sutil opcional;  
\- tabelas sem grade pesada.

Modelos visuais:

Lista: cadastro em linhas  
Assistente: cadastro em etapas  
Visão executiva: dashboard executivo  
Detalhamento: dashboard \+ formulários  
Cenários: comparação em cards  
Realizado: dashboard \+ variações

\---

\# 19\. Testes

Casos mínimos:

1\. preço único;  
2\. múltiplas faixas;  
3\. cortesias;  
4\. marketing zero;  
5\. participantes zero;  
6\. capacidade excedida;  
7\. imposto;  
8\. taxa fixa e percentual;  
9\. comissão;  
10\. reembolso;  
11\. inadimplência;  
12\. upsell;  
13\. múltiplos upsells;  
14\. ponto de equilíbrio;  
15\. conversão;  
16\. ROI com investimento zero;  
17\. margem negativa;  
18\. mix de preço;  
19\. custo por presentes;  
20\. planejado versus realizado.

Também testar:

\- salvar e carregar;  
\- RLS;  
\- aprovação;  
\- snapshot;  
\- duplicação;  
\- exclusão lógica;  
\- histórico;  
\- fechamento;  
\- responsividade;  
\- acessibilidade;  
\- exportação.

\---

\# 20\. Critérios de aceite

O MVP deve:

1\. criar simulação vinculada a mentoria;  
2\. aceitar múltiplos preços;  
3\. registrar canais e funil;  
4\. registrar custos de todos os tipos;  
5\. cadastrar múltiplos upsells;  
6\. calcular três cenários;  
7\. exibir receita, custos, lucro, margem e ROI;  
8\. calcular ponto de equilíbrio, leads, CAC e ROAS;  
9\. separar resultado com e sem upsell;  
10\. gerar alertas;  
11\. salvar e reabrir;  
12\. aprovar com snapshot;  
13\. registrar realizado;  
14\. comparar planejado e realizado;  
15\. manter conformidade visual;  
16\. passar nos testes críticos.

\---

\# 21\. Roadmap

Etapa 0 — validar nomenclatura, local, entidades e fórmulas.

Etapa 1 — criar FORMULAS.md, motor puro, validações, alertas e testes.

Etapa 2 — criar tabelas, repositories, services, RLS, histórico e snapshots.

Etapa 3 — criar lista, assistente de entrada, receita, aquisição, custos, upsells e salvamento.

Etapa 4 — criar dashboard, KPIs, gráficos, cenários, viabilidade, alertas e ponto de equilíbrio.

Etapa 5 — criar aprovação e governança.

Etapa 6 — criar planejado versus realizado.

Etapa 7 — criar exportação.

Etapa 8 — integrar CRM, pagamentos, financeiro e ClickUp.

Não começar pelo visual final antes de validar o motor e os testes.

\---

\# 22\. Riscos

Fórmula errada → testes e memória de cálculo.

Ponto flutuante → decimal/numeric.

Mistura de receita e upsell → resultados separados.

Dupla contagem → validação.

Falta de imposto → alerta.

Cenário otimista como base → aprovação explícita.

Recalcular aprovado → snapshot.

UI complexa → assistente em etapas.

Excesso de campos → MVP essencial.

IA no cálculo → IA fora do motor.

Integração prematura → entrada manual no MVP.

Falta de realizado → fechamento obrigatório.

\---

\# 23\. Questões abertas

\- nome final;  
\- código documental;  
\- local definitivo no NIDE;  
\- cor institucional;  
\- margem mínima;  
\- faixas de viabilidade;  
\- base tributável;  
\- conceito de investimento total;  
\- aprovadores;  
\- biblioteca de gráficos;  
\- autosave;  
\- exportação inicial;  
\- expansão para Imersões e Eventos.

\---

\# 24\. Síntese final

O Simulador deve nascer com motor determinístico, separado da interface, capaz de projetar receita, aquisição, custos, upsells, ponto de equilíbrio, lucro, margem e ROI em três cenários. Deve registrar premissas, salvar snapshots aprovados e comparar planejamento com resultado real.

Ordem recomendada:

1\. Validar fórmulas  
2\. Criar motor e testes  
3\. Criar banco e governança  
4\. Criar fluxo de entrada  
5\. Criar dashboard  
6\. Criar realizado  
7\. Integrar outros sistemas

Fontes técnicas consultadas:

\- 00.05-gov-pad-001-v1.0-padrao-documental-md-visual-05-07-2026.md  
\- 01.80-tec-pad-009-v1.0-padrao-loze-ui-ultra-clean-25-07-2026.md  
\- 01.81-tec-ref-001-v1.0-referencia-visual-loze-ui-ultra-clean-6-telas-25-07-2026.html  
\- 01.82-tec-ref-002-v1.0-referencia-visual-loze-ui-ultra-clean-gradient-sidebar-25-07-2026.html  
