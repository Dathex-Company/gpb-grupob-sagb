# Decisões Arquiteturais - Orquestração Principal

## 2026-04-18: Estabilização do Ambiente de Desenvolvimento

### Contexto
O usuário necessitava de um endereço fixo e estável para acompanhar o progresso do SagB sem a necessidade de gerenciar múltiplos servidores de módulos individualmente.

### Decisão
1. **Porta Fixa**: A porta padrão de desenvolvimento foi travada em **8000** em vez de usar as dinâmicas do Vite.
2. **Exposição de Host**: Habilitado `host: true` para permitir acesso via IP na rede local.
3. **Orquestração de Túnel**: Integrado `localtunnel` e `concurrently` para permitir o compartilhamento do ambiente via link externo (`sagb-exec.loca.lt`) com um único comando.
4. **Script Unificado**: Adicionado script `npm start` que sobe tanto o servidor Vite quanto o túnel simultaneamente.

### Consequências
- Facilidade de acesso para dashboards e monitoramento.
- Possibilidade de testes em dispositivos móveis na mesma rede ou remotamente via túnel.
- Padronização do workflow de "Start" do sistema.
