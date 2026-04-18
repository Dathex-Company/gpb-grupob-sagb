# Relação de Monitoramentos Existentes no Módulo Monitoramento

**Data da análise:** 13/04/2026  
**Fonte:** `src/modules/monitoramento/services/monitoramentoCatalog.ts`

---

## 1. Infraestrutura (23 itens)
- CPU
- GPU
- RAM
- Disco
- Temperatura
- Internet
- Ping
- Jitter
- Download
- Upload
- Perda de pacote
- Picos de latência
- Uptime da máquina
- Tailscale / VPN
- Status da VPN
- Latência da malha
- Máquinas conectadas
- Máquinas offline
- Última desconexão
- Qualidade da rota

## 2. Backend (9 itens)
- Supabase
- Banco de dados
- Storage
- Leituras
- Escritas
- Uploads
- Latência
- Integridade de gravação
- Tabelas relevantes

## 3. Frontend (7 itens)
- Deploys
- Builds
- Versões publicadas
- Falhas de publicação
- Ambientes ativos
- Netlify

## 4. Automações (7 itens)
- n8n
- Workflows ativos
- Execuções
- Filas
- Falhas
- Workflows órfãos
- Gargalos

## 5. IA e Agentes (8 itens)
- APIs de IA
- Latência por provedor
- Tokens
- Custo
- Agentes ativos
- Falhas
- Travamentos
- Consumo por modelo

## 6. Transcrições e Gravações (8 itens)
- OBS
- Gravação ativa
- Timer
- Arquivos gerados
- Transcrição em andamento
- Delay entre áudio e texto
- Perdas de captura
- Fila de processamento

## 7. Dados e Memória (14 itens)
- Total de memórias
- Memórias brutas
- Memórias refinadas
- Pendências de refinamento
- Chunks de áudio
- Delay de consolidação
- Integridade de escrita
- Timeline de escritas
- Ativos no CID
- Assets brutos
- Assets derivados
- Jobs
- Outputs

## 8. Sensor de Qualidade (8 itens)
- Saúde das APIs
- Tokens por conversa
- Custo por conversa
- Top agentes
- Top tipos de erro
- Eventos cognitivos
- Erros e acertos
- Últimos eventos

## 9. Custos e Consumo (13 itens)
- Custo do dia
- Custo do mês
- Custo acumulado
- Gasto por plataforma
- Gasto por provedor
- Google Cloud
- APIs pagas
- Storage
- Banco
- Uso por agente
- Uso por fluxo
- Picos de consumo
- Comparação com orçamento

## 10. Alertas (14 itens)
- Alertas críticos
- Alertas altos
- Falhas abertas
- Sinais de risco
- Incidentes em andamento
- Severidade
- Origem do alerta
- Tempo aberto
- Queda de internet
- Oscilação forte
- Perda de pacote alta
- VPN desconectada
- Nó fora da malha
- Latência anormal da rede

## 11. Eventos (10 itens)
- Reinícios
- Falhas
- Deploys
- Quedas
- Erros
- Gravações iniciadas
- Gravações encerradas
- Eventos de agentes
- Eventos de backend
- Linha do tempo operacional

## 12. Ideias e Produção (5 itens)
- Ideias geradas
- Iniciativas criadas
- Produção por período
- Pendências
- Conversão de ideia em ativo

## 13. Ação Inteligente (6 itens)
- Agente responsável por área
- Abrir reunião
- Criar task no TaskZei
- Enviar BO
- Encaminhar para responsável
- Histórico da decisão

---

## Resumo Estatístico
- **Total de submódulos:** 13
- **Total de itens de monitoramento:** 132
- **Média por submódulo:** ~10 itens

---

## Observações
1. A tela atual exibe apenas **rótulos** (não há implementação real de coleta de dados).
2. O módulo **não está no padrão novo** (falta `module-doc.ts`, `decisions.md`, etc.).
3. A estrutura é **somente visual** — não há serviços de coleta, agregação ou alerta.
4. O catálogo é **abrangente** mas precisa de priorização e implementação real.

---

## Próximos Passos (Ideias Nossas)
1. **Implementar monitoramento de tabelas Supabase** (tabela → módulos, uso)
2. **Criar serviços de coleta** para os itens mais críticos
3. **Dashboard executivo** com métricas agregadas
4. **Sistema de alertas** baseado em thresholds
5. **Integração com logs** (Sentry, Cloud Logging)
6. **Monitoramento de saúde de módulos** (build, deploy, owner)
7. **Painel de custos em tempo real** (Google Cloud, APIs)
8. **Linha do tempo operacional** (eventos + ações inteligentes)

---

**Pronto para discutir prioridades e criar o documento oficial de escopo.**