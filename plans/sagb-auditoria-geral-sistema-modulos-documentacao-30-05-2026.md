Título da tarefa: SagB | Inventário Geral dos Módulos | Auditoria Técnica Profunda | [DATA]

Trabalhe apenas neste projeto: Z:\SagB\src\modules

Documento-base de auditoria:
Z:\SagB\src\modules

Objetivo:
realizar uma auditoria profunda dos módulos do SagB e registrar tudo em um documento único de inventário técnico, funcional e estratégico.

A ideia é que esse documento vire uma fonte de verdade para qualquer agente, programador ou responsável de módulo entender rapidamente:
- o que cada módulo faz
- em que fase está
- quais arquivos usa
- quais tabelas do Supabase utiliza
- quais integrações possui
- quais padrões segue
- o que pode ser reaproveitado
- o que está duplicado
- o que precisa ser ajustado

Escopo da auditoria:
analise todos os módulos encontrados em:

src/modules/

E, se houver módulos ou views antigas fora desse padrão, identifique também.

Para cada módulo, registre aqui neste documento mesmo:

1. Identificação do módulo
- nome exibido
- nome interno
- rota
- status atual
- responsável, se existir
- se é módulo oficial, frente interna ou camada técnica

2. Função do módulo
- para que serve
- qual problema resolve
- qual papel tem dentro do SagB
- se pode ser destacável ou não

3. Estrutura técnica
- pasta do módulo
- arquivos principais
- páginas
- componentes
- hooks
- services
- store
- types
- manifest
- routes
- module-doc ou ficha equivalente

4. Banco de dados / Supabase
- tabelas utilizadas
- buckets/storage utilizados
- views/RPCs, se houver
- quais dados são próprios do módulo
- quais dados são compartilhados
- se existe risco de duplicidade
- se há tabelas que poderiam ser reaproveitadas

5. Regras, cálculos e lógicas
- cálculos existentes
- regras de negócio
- validações
- fluxos internos
- estados importantes
- automações, se houver

6. Integrações
- APIs usadas
- webhooks
- serviços externos
- conexão com API SagB, MCP, Bridge ou outros módulos
- dependências relevantes

7. Padrões do SagB
verifique se o módulo segue:
- padrão modular oficial
- padrão de nomenclatura
- manifest
- routes
- module-doc/ficha técnica
- README
- CHANGELOG
- DECISIONS
- pasta agent/
- documentação mínima
- padrão visual Alice UI Standard, se aplicável

8. Maturidade
classifique o módulo como:
- não iniciado
- conceitual
- base criada
- parcial
- funcional
- maduro

9. Lacunas e riscos
- o que está faltando
- o que está confuso
- o que está duplicado
- o que está fora do padrão
- o que pode gerar problema no futuro

10. Reaproveitamento
- o que este módulo já usa de outros módulos
- o que outros módulos poderiam reaproveitar dele
- quais tabelas, services, componentes ou padrões podem ser compartilhados

11. Próximas recomendações
- criar do zero
- reorganizar
- evoluir
- documentar
- corrigir padrão
- revisar Supabase
- separar como produto
- manter como frente interna

Formato do documento:
para cada módulo, use este padrão:

## [Nome do Módulo] | Inventário Técnico | [DATA]

### 1. Identificação
### 2. Função do módulo
### 3. Estrutura técnica
### 4. Supabase e dados
### 5. Regras, cálculos e lógicas
### 6. Integrações
### 7. Padrões utilizados
### 8. Maturidade atual
### 9. Lacunas e riscos
### 10. Reaproveitamentos possíveis
### 11. Recomendações

Regras importantes:
- não altere código de negócio
- não refatore nada agora
- não crie tabela nova
- não remova arquivos
- não mova módulos
- apenas audite e registre
- diferencie o que existe do que é inferência
- não invente responsável se não estiver documentado
- se algo não existir, registre como “não encontrado”
- se encontrar duplicidade, registre claramente

Ao final da auditoria geral, inclua uma seção final:

## Síntese Geral do Inventário | [DATA]

Com:
1. quantidade de módulos analisados
2. módulos maduros
3. módulos parciais
4. módulos fora do padrão
5. módulos sem documentação
6. tabelas Supabase mais reutilizadas
7. tabelas possivelmente duplicadas
8. integrações encontradas
9. maiores riscos
10. próximos passos recomendados

Resultado esperado:
um documento único, claro e útil, que sirva como mapa real dos módulos do SagB.

Ao concluir:
1. informe se a auditoria foi concluída
2. informe quantos módulos foram analisados
3. informe onde o documento foi salvo
4. registre o que encontrou de mais importante
5. registre o que faria diferente
6. registre insights, riscos e observações relevantes