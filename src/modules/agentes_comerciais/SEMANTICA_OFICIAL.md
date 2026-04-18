# Agentes Comerciais — Squad Comercial Virtual (ET 01)

## 1) Visão e Missão do Módulo

O módulo **Agentes Comerciais** não gerencia apenas atendentes; ele é o laboratório de configuração de **Squads Comerciais de Elite**. 
A missão é prover às empresas (clinicas, imobiliárias, etc) um time especializado composto por IAs e Humanos com identidades, vozes e funções específicas no funil de vendas.

## 2) Entidade principal oficial

- **AgenteComercial** é a entidade principal oficial.
- Representa um membro de um squad comercial com DNA próprio.

## 3) Funções Comerciais (Especializações)

As funções canônicas dentro de um squad são:
- **SDR (Sales Development Representative)**: Focado em prospecção, triagem e agendamento.
- **CLOSER**: Especialista em apresentação de proposta e fechamento de contrato.
- **FARMER**: Focado em sucesso do cliente, retenção e expansão (upsell).
- **CRC (Customer Relationship Center)**: Suporte consultivo e manutenção de relacionamento.
- **GDR (Gestor de Relacionamento)**: Supervisão e coordenação do squad.

## 2) Classificações oficiais (não são entidade principal)

- `tipo`: `HUMANO | IA_HIBRIDO | AUTOMATICO | OUTRO`
- `status`: `ATIVO | INATIVO | EM_TREINAMENTO | EM_FERIAS | AUSENTE`
- `nivel_experiencia`: `JUNIOR | PLENO | SENIOR | ESPECIALISTA`
- `canal_atendimento`: `TELEFONE | EMAIL | CHAT | VIDEO | PRESENCIAL | MULTICANAL`

## 3) Termos legados aceitos temporariamente

Estes termos/campos ainda são aceitos **somente por compatibilidade**:

- `atendente`, `operador`, `agente_comercial`
- campos legados de payload: `name`, `type`, `status`, `channel`, `experience`

Mapeamento e rastreabilidade estarão em:

- `services/agenteMapper.ts` (a ser criado)
  - `normalizeAgente`
  - `normalizeAgentes`
  - `toLegacyCompat`

## 4) Campos-base oficiais do agente

- `id`
- `nome`
- `nome_exibicao?`
- `email`
- `telefone?`
- `tipo`
- `status`
- `nivel_experiencia`
- `canal_atendimento`
- `funcao` (SDR, CLOSER, FARMER, CRC, GDR)
- `vertical?` (ex: Odontologia)
- `especialidades?` (array de strings)
- `capacidade_concorrente`
- `persona?` (objeto: bio, tom_voz, objetivos)
- `voz?` (objeto: provider, voice_id, velocidade, pitch)
- `metricas?`
- `foto_url?`
- `created_at`
- `updated_at`
- `ultimo_acesso?`

## 5) UI oficial

A interface principal do módulo adota **AgenteComercial** como linguagem principal.
Termos legados não devem aparecer como nomenclatura dominante da UI.

## 6) Atributos Indispensáveis (DNA do Squad)

Para que um Agente Comercial seja considerado pronto para venda ("As-A-Service"), ele deve possuir:
- **Persona Vibrante**: Bio rica e Tom de Voz que venda a marca do cliente.
- **Identidade Auditiva**: Configuração de voz clara (Voz Humana capturada ou IA de alta qualidade).
- **Verticalização**: Treinamento focado no segmento (ex: Scripts específicos para Clínicas).
- **Métricas Visíveis**: Performance de conversão integrada ao card.

## 7) Separação de contexto

Esta padronização mantém o escopo do módulo **Agentes Comerciais** separado do contexto amplo de CRM e vendas.
O módulo foca na gestão operacional de agentes comerciais, com potencial para integração futura com outros sistemas.