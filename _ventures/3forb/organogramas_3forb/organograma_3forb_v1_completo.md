# organograma_3forb_completo

Documento canônico da estrutura organizacional e operacional completa da 3forB (AMV — Assessoria de Marketing e Vendas), consolidando todas as definições e agentes identificados nas fontes do projeto, incluindo o backup da conversa da CEO Zara Bittencourt no ChatGPT.

## objetivo

Consolidar, em fonte única e estruturada, a hierarquia detalhada de agentes da 3forB, com vínculo entre:

- id canônico (padrão `nome_3fb_setor_nivel_sequencial`)
- nome visual
- cargo
- nível de atuação (estratégico, tático, operacional, consultivo)
- setor de atuação
- sequencial global
- status (ativo, pendente_criacao, substituido)
- categoria de consolidação (confirmado, novo, existente_com_revisao, pendente_definicao)

Este documento servirá como a **fonte da verdade definitiva** para a arquitetura de agentes da 3forB, supersedendo quaisquer documentos ou informações anteriores que possam estar desalinhadas.

## metadados de governança

- venture: 3forB
- versão: 1.0.0 (Completo Consolidado)
- data_atualizacao: 05/05/2026
- responsavel_governanca: Zara Bittencourt (CEO 3forB)
- responsavel_arquitetura: Cássio Mendes (Engenheiro Consultivo)
- documento_base_grupob: [`organograma_grupob.md`](../../docs/governanca_grupob/organograma_grupob.md)
- documento_nomenclatura: [`nomenclatura_agentes.md`](../../governance/nomenclatura_agentes.md)
- fontes_consolidadas:
  - [`governance/organograma.md`](../../governance/organograma.md) (organograma oficial anterior)
  - [`governance/organograma_marketing.md`](../../governance/organograma_marketing.md) (detalhamento marketing)
  - backup_chatgpt_zara (conversa completa da CEO Zara — linhas 1-14155)

> **Aviso de consolidação:** Este documento unifica todas as fontes. Agentes com `status: pendente_criacao` foram identificados no organograma macro, mas não tiveram seus prompts detalhados ou CA.XX atribuídos na conversa. Agentes com `categoria: novo` foram definidos na conversa Zara ChatGPT e não constavam nos organogramas anteriores. Agentes com `status: substituido` ou `descontinuado` foram explicitamente superados por novas definições. A validação final e a criação das pastas e prompts dos agentes pendentes cabem à liderança da 3forB.

---

## 1) liderança estratégica 3forB

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `zara_bittencourt_3fb_ceo_e_000` | Zara Bittencourt | CEO | estratégico | `ceo` | 000 | ativo | confirmado |
| `rian_mercer_3fb_cro_e_001` | Rian Mercer | CRO (Chief Revenue Officer) | estratégico | `cro` | 001 | ativo | confirmado |
| `bia_fanel_3fb_cmo_e_002` | Bia Fanel | CMO (Chief Marketing Officer) | estratégico | `mkt` | 002 | ativo | confirmado |
| `paula_zurik_3fb_qg_e_003` | Paula Zurik | Responsável Total pelo QG | estratégico | `qg` | 003 | ativo | novo |
| `sandro_zanelli_3fb_val_c_004` | Sandro Zanelli | Especialista em Valuation | consultivo | `val` | 004 | ativo | novo |

---

## 2) time operacional de marketing (`mkt`) — subordinado à CMO (Bia Fanel)

> **Nota:** Os agentes abaixo do Anton Borselli (Diretor de Marketing da Operação) são os detalhados na conversa Zara ChatGPT com numeração CA.XX. Essa estrutura supersedou a lista anterior do `governance/organograma_marketing.md` com Caio Vellari, Roni Valverdi, Lívia Salles, Ícaro Marquetti, Helena Duarte, Elian Dravet, Serena Valmont, que foram redefinidos em novas funções ou são considerados `substituidos`/`pendente_definicao` nesta nova estrutura de CA.XX.

### 2.1. direção de marketing da operação

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `anton_borselli_3fb_mkt_e_005` | Anton Borselli | Diretor de Marketing da Operação | estratégico | `mkt` | 005 | ativo | confirmado |

### 2.2. módulos e agentes de marketing (CA.XX)

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `ca_001_diretora_marketing` | CA.01 | PMO de Marketing | tático | `mkt` | 006 | ativo | novo |
| `ca_002_gestor_operacoes_marketing` | CA.02 | Gestor de Operações de Marketing | tático | `mkt` | 007 | ativo | novo |
| `ca_003_head_estrategia_marketing` | CA.03 | Head de Estratégia de Marketing | tático | `mkt` | 008 | ativo | novo |
| `ca_004_estrategista_campanhas` | CA.04 | Estrategista de Campanhas | tático | `mkt` | 009 | ativo | novo |
| `ca_005_estrategista_posicionamento` | CA.05 | Estrategista de Posicionamento | tático | `mkt` | 010 | ativo | novo |
| `ca_006_estrategista_oferta_funil` | CA.06 | Estrategista de Oferta e Funil | tático | `mkt` | 011 | ativo | novo |
| `ca_007_head_meta` | CA.07 | Head de Meta | tático | `mkt` | 012 | ativo | novo |
| `ca_008_estrategista_meta` | CA.08 | Estrategista de Meta | tático | `mkt` | 013 | ativo | novo |
| `ca_009_especialista_instagram_organico` | CA.09 | Especialista em Instagram Orgânico | operacional | `mkt` | 014 | ativo | novo |
| `ca_010_especialista_facebook_organico` | CA.10 | Especialista em Facebook Orgânico | operacional | `mkt` | 015 | ativo | novo |
| `ca_011_especialista_meta_ads` | CA.11 | Especialista em Meta Ads | operacional | `mkt` | 016 | ativo | novo |
| `ca_012_analista_performance_meta` | CA.12 | Analista de Performance Meta | operacional | `mkt` | 017 | ativo | novo |
| `ca_013_head_google` | CA.13 | Head de Google | tático | `mkt` | 018 | ativo | novo |
| `ca_014_estrategista_google` | CA.14 | Estrategista de Google | tático | `mkt` | 019 | ativo | novo |
| `ca_015_especialista_google_meu_negocio` | CA.15 | Especialista em Google Meu Negócio | operacional | `mkt` | 020 | ativo | novo |
| `ca_016_especialista_google_ads` | CA.16 | Especialista em Google Ads | operacional | `mkt` | 021 | ativo | novo |
| `ca_017_especialista_seo` | CA.17 | Especialista em SEO | operacional | `mkt` | 022 | ativo | novo |
| `ca_018_especialista_analytics_tag_manager` | CA.18 | Especialista em Analytics e Tag Manager | operacional | `mkt` | 023 | ativo | novo |
| `ca_019_analista_performance_google` | CA.19 | Analista de Performance Google | operacional | `mkt` | 024 | ativo | novo |
| `ca_020_head_linkedin` | CA.20 | Head de LinkedIn | tático | `mkt` | 025 | ativo | novo |
| `ca_021_estrategista_linkedin` | CA.21 | Estrategista de LinkedIn | tático | `mkt` | 026 | ativo | novo |
| `ca_022_especialista_linkedin_organico` | CA.22 | Especialista em LinkedIn Orgânico | operacional | `mkt` | 027 | ativo | novo |
| `ca_023_especialista_linkedin_ads` | CA.23 | Especialista em LinkedIn Ads | operacional | `mkt` | 028 | ativo | novo |
| `ca_024_analista_performance_linkedin` | CA.24 | Analista de Performance LinkedIn | operacional | `mkt` | 029 | ativo | novo |
| `ca_025_head_tiktok` | CA.25 | Head de TikTok | tático | `mkt` | 030 | ativo | novo |
| `ca_026_estrategista_tiktok` | CA.26 | Estrategista de TikTok | tático | `mkt` | 031 | ativo | novo |
| `ca_027_especialista_tiktok_organico` | CA.27 | Especialista em TikTok Orgânico | operacional | `mkt` | 032 | ativo | novo |
| `ca_028_especialista_tiktok_ads` | CA.28 | Especialista em TikTok Ads | operacional | `mkt` | 033 | ativo | novo |
| `ca_029_analista_performance_tiktok` | CA.29 | Analista de Performance TikTok | operacional | `mkt` | 034 | ativo | novo |
| `ca_030_head_youtube` | CA.30 | Head de YouTube | tático | `mkt` | 035 | ativo | novo |
| `ca_031_estrategista_youtube` | CA.31 | Estrategista de YouTube | tático | `mkt` | 036 | ativo | novo |
| `ca_032_especialista_youtube_organico` | CA.32 | Especialista em YouTube Orgânico | operacional | `mkt` | 037 | ativo | novo |
| `ca_033_especialista_youtube_ads` | CA.33 | Especialista em YouTube Ads | operacional | `mkt` | 038 | ativo | novo |
| `ca_034_analista_performance_youtube` | CA.34 | Analista de Performance YouTube | operacional | `mkt` | 039 | ativo | novo |
| `ca_035_head_conteudo` | CA.35 | Head de Conteúdo | tático | `mkt` | 040 | ativo | novo |
| `ca_036_estrategista_conteudo` | CA.36 | Estrategista de Conteúdo | tático | `mkt` | 041 | ativo | novo |
| `ca_037_especialista_calendario_editorial` | CA.37 | Especialista em Calendário Editorial | operacional | `mkt` | 042 | ativo | novo |
| `ca_038_copywriter_conteudo` | CA.38 | Copywriter de Conteúdo | operacional | `mkt` | 043 | ativo | novo |
| `ca_039_redator_seo` | CA.39 | Redator SEO | operacional | `mkt` | 044 | ativo | novo |
| `ca_040_roteirista_videos_curtos` | CA.40 | Roteirista de Vídeos Curtos | operacional | `mkt` | 045 | ativo | novo |
| `ca_041_roteirista_youtube` | CA.41 | Roteirista de YouTube | operacional | `mkt` | 046 | ativo | novo |
| `ca_042_social_media_manager` | CA.42 | Social Media Manager | operacional | `mkt` | 047 | ativo | novo |
| `ca_043_analista_comunidade_engajamento` | CA.43 | Analista de Comunidade e Engajamento | operacional | `mkt` | 048 | ativo | novo |
| `ca_044_head_criacao` | CA.44 | Head de Criação | tático | `mkt` | 049 | ativo | novo |
| `ca_045_diretor_arte` | CA.45 | Diretor de Arte | tático | `mkt` | 050 | ativo | novo |
| `ca_046_designer_social` | CA.46 | Designer de Social | operacional | `mkt` | 051 | ativo | novo |
| `ca_047_designer_performance` | CA.47 | Designer de Performance | operacional | `mkt` | 052 | ativo | novo |
| `ca_048_editor_video_curto` | CA.48 | Editor de Vídeo Curto | operacional | `mkt` | 053 | ativo | novo |
| `ca_049_editor_video_longo` | CA.49 | Editor de Vídeo Longo | operacional | `mkt` | 054 | ativo | novo |
| `ca_050_motion_designer` | CA.50 | Motion Designer | operacional | `mkt` | 055 | ativo | novo |
| `ca_051_especialista_landing_pages_visuais` | CA.51 | Especialista em Landing Pages Visuais | operacional | `mkt` | 056 | ativo | novo |
| `ca_052_head_funis_automacao` | CA.52 | Head de Funis e Automação | tático | `mkt` | 057 | ativo | novo |
| `ca_053_especialista_crm_marketing` | CA.53 | Especialista em CRM de Marketing | operacional | `mkt` | 058 | ativo | novo |
| `ca_054_especialista_automacao_marketing` | CA.54 | Especialista em Automação (Marketing) | operacional | `mkt` | 059 | ativo | novo |
| `ca_055_especialista_landing_pages` | CA.55 | Especialista em Landing Pages | operacional | `mkt` | 060 | ativo | novo |
| `ca_056_especialista_cro_marketing` | CA.56 | Especialista em CRO (Marketing) | operacional | `mkt` | 061 | ativo | novo |
| `ca_057_especialista_lead_tracking` | CA.57 | Especialista em Lead Tracking | operacional | `mkt` | 062 | ativo | novo |
| `ca_058_analista_jornada_lead` | CA.58 | Analista de Jornada do Lead | operacional | `mkt` | 063 | ativo | novo |
| `ca_059_head_dados_marketing` | CA.59 | Head de Dados de Marketing | tático | `mkt` | 064 | ativo | novo |
| `ca_060_analista_bi_marketing` | CA.60 | Analista de BI de Marketing | operacional | `mkt` | 065 | ativo | novo |
| `ca_061_analista_attribution` | CA.61 | Analista de Attribution | operacional | `mkt` | 066 | ativo | novo |
| `ca_062_analista_testes_ab` | CA.62 | Analista de Testes A/B | operacional | `mkt` | 067 | ativo | novo |
| `ca_063_analista_relatorios_ramp_mkt` | CA.63 | Analista de Relatórios e RAMP (Marketing) | operacional | `mkt` | 068 | ativo | novo |

---

## 3) time operacional de vendas (`vnd`) — subordinado ao CRO (Rian Mercer)

### 3.1. direção de vendas

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `max_guerra_3fb_vnd_e_064` | Max Guerra | Diretor de Vendas | estratégico | `vnd` | 069 | ativo | confirmado |

### 3.2. módulos e agentes de vendas (CA.XX)

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `ca_065_pmo_vendas` | CA.65 | PMO de Vendas | tático | `vnd` | 070 | ativo | novo |
| `ca_066_gestor_operacoes_vendas` | CA.66 | Gestor de Operações de Vendas | tático | `vnd` | 071 | ativo | novo |
| `ca_067_head_estrategia_comercial` | CA.67 | Head de Estratégia Comercial | tático | `vnd` | 072 | ativo | novo |
| `ca_068_estrategista_funis_vendas` | CA.68 | Estrategista de Funis de Vendas | tático | `vnd` | 073 | ativo | novo |
| `ca_069_estrategista_icp_oferta` | CA.69 | Estrategista de ICP e Oferta | tático | `vnd` | 074 | ativo | novo |
| `ca_070_estrategista_sla_marketing_vendas` | CA.70 | Estrategista de SLA Marketing e Vendas | tático | `vnd` | 075 | ativo | novo |
| `ca_071_estrategista_pipeline_processos_comerciais` | CA.71 | Estrategista de Pipeline e Processos Comerciais | tático | `vnd` | 076 | ativo | novo |
| `ca_072_head_prevendas` | CA.72 | Head de Pré-vendas | tático | `vnd` | 077 | ativo | novo |
| `ca_073_especialista_sdr_outbound` | CA.73 | Especialista em SDR Outbound | operacional | `vnd` | 078 | ativo | novo |
| `ca_074_especialista_sdr_inbound` | CA.74 | Especialista em SDR Inbound | operacional | `vnd` | 079 | ativo | novo |
| `ca_075_especialista_qualificacao_leads` | CA.75 | Especialista em Qualificação de Leads | operacional | `vnd` | 080 | ativo | novo |
| `ca_076_analista_tempo_resposta_cadencia` | CA.76 | Analista de Tempo de Resposta e Cadência | operacional | `vnd` | 081 | ativo | novo |
| `ca_077_head_conversao_vendas` | CA.77 | Head de Conversão (Vendas) | tático | `vnd` | 082 | ativo | novo |
| `ca_078_especialista_closer_consultivo` | CA.78 | Especialista em Closer Consultivo | operacional | `vnd` | 083 | ativo | novo |
| `ca_079_especialista_closer_alta_oferta` | CA.79 | Especialista em Closer de Alta Oferta | operacional | `vnd` | 084 | ativo | novo |
| `ca_080_especialista_negociacao_objecoes` | CA.80 | Especialista em Negociação e Objeções | operacional | `vnd` | 085 | ativo | novo |
| `ca_081_analista_conversao_comercial` | CA.81 | Analista de Conversão Comercial | operacional | `vnd` | 086 | ativo | novo |
| `ca_082_head_crc` | CA.82 | Head de CRC | tático | `vnd` | 087 | ativo | novo |
| `ca_083_especialista_atendimento_whatsapp` | CA.83 | Especialista em Atendimento Comercial WhatsApp | operacional | `vnd` | 088 | ativo | novo |
| `ca_084_especialista_agendamento` | CA.84 | Especialista em Agendamento | operacional | `vnd` | 089 | ativo | novo |
| `ca_085_especialista_recuperacao_leads` | CA.85 | Especialista em Recuperação de Leads | operacional | `vnd` | 090 | ativo | novo |
| `ca_086_especialista_noshow_reativacao` | CA.86 | Especialista em No-show e Reativação | operacional | `vnd` | 091 | ativo | novo |
| `ca_087_analista_qualidade_atendimento_comercial` | CA.87 | Analista de Qualidade de Atendimento Comercial | operacional | `vnd` | 092 | ativo | novo |
| `ca_088_head_crm_comercial` | CA.88 | Head de CRM Comercial | tático | `vnd` | 093 | ativo | novo |
| `ca_089_especialista_kommo` | CA.89 | Especialista em Kommo | operacional | `vnd` | 094 | ativo | novo |
| `ca_090_especialista_automacao_comercial` | CA.90 | Especialista em Automação Comercial | operacional | `vnd` | 095 | ativo | novo |
| `ca_091_especialista_lead_scoring` | CA.91 | Especialista em Lead Scoring | operacional | `vnd` | 096 | ativo | novo |
| `ca_092_especialista_distribuicao_leads` | CA.92 | Especialista em Distribuição de Leads | operacional | `vnd` | 097 | ativo | novo |
| `ca_093_analista_higiene_organizacao_crm` | CA.93 | Analista de Higiene e Organização do CRM | operacional | `vnd` | 098 | ativo | novo |
| `ca_094_head_scripts_comerciais` | CA.94 | Head de Scripts Comerciais | tático | `vnd` | 099 | ativo | novo |
| `ca_095_especialista_scripts_primeiro_contato` | CA.95 | Especialista em Scripts de Primeiro Contato | operacional | `vnd` | 100 | ativo | novo |
| `ca_096_especialista_scripts_followup` | CA.96 | Especialista em Scripts de Follow-up | operacional | `vnd` | 101 | ativo | novo |
| `ca_097_especialista_biblioteca_objecoes` | CA.97 | Especialista em Biblioteca de Objeções | operacional | `vnd` | 102 | ativo | novo |
| `ca_098_especialista_mensagens_nutricao_comercial` | CA.98 | Especialista em Mensagens de Nutrição Comercial | operacional | `vnd` | 103 | ativo | novo |
| `ca_099_head_performance_comercial` | CA.99 | Head de Performance Comercial | tático | `vnd` | 104 | ativo | novo |
| `ca_100_analista_kpis_comerciais` | CA.100 | Analista de KPIs Comerciais | operacional | `vnd` | 105 | ativo | novo |
| `ca_101_analista_taxa_conversao_funil` | CA.101 | Analista de Taxa de Conversão por Funil | operacional | `vnd` | 106 | ativo | novo |
| `ca_102_analista_perdas_pipeline` | CA.102 | Analista de Perdas de Pipeline | operacional | `vnd` | 107 | ativo | novo |
| `ca_103_analista_forecast_previsibilidade` | CA.103 | Analista de Forecast e Previsibilidade | operacional | `vnd` | 108 | ativo | novo |
| `ca_104_head_treinamento_comercial` | CA.104 | Head de Treinamento Comercial | tático | `vnd` | 109 | ativo | novo |
| `ca_105_especialista_treinamento_sdr` | CA.105 | Especialista em Treinamento de SDR | operacional | `vnd` | 110 | ativo | novo |
| `ca_106_especialista_treinamento_closer` | CA.106 | Especialista em Treinamento de Closer | operacional | `vnd` | 111 | ativo | novo |
| `ca_107_especialista_treinamento_crc` | CA.107 | Especialista em Treinamento de CRC | operacional | `vnd` | 112 | ativo | novo |
| `ca_108_analista_reciclagem_acompanhamento_comercial` | CA.108 | Analista de Reciclagem e Acompanhamento Comercial | operacional | `vnd` | 113 | ativo | novo |
| `ca_109_head_gestex` | CA.109 | Head de Gestex | tático | `vnd` | 114 | ativo | novo |
| `ca_110_especialista_gestao_comercial_dedicada` | CA.110 | Especialista em Gestão Comercial Dedicada | operacional | `vnd` | 115 | ativo | novo |
| `ca_111_head_caper` | CA.111 | Head de CAPeR | tático | `vnd` | 116 | ativo | novo |
| `ca_112_especialista_captacao_agendamento_presencial` | CA.112 | Especialista em Captação e Agendamento Presencial | operacional | `vnd` | 117 | ativo | novo |

---

## 4) time operacional de expansão (`exp`) — subordinado ao CRO (Rian Mercer)

### 4.1. direção de expansão

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `liora_blake_3fb_exp_e_113` | Liora Blake | Diretora de Expansão | estratégico | `exp` | 118 | ativo | confirmado |

### 4.2. módulos e agentes de expansão (CA.XX)

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `ca_114_pmo_expansao` | CA.114 | PMO de Expansão | tático | `exp` | 119 | ativo | novo |
| `ca_115_gestor_operacoes_expansao` | CA.115 | Gestor de Operações de Expansão | tático | `exp` | 120 | ativo | novo |
| `ca_116_head_estrategia_expansao` | CA.116 | Head de Estratégia de Expansão | tático | `exp` | 121 | ativo | novo |
| `ca_117_estrategista_indicacao` | CA.117 | Estrategista de Indicação | tático | `exp` | 122 | ativo | novo |
| `ca_118_estrategista_parcerias` | CA.118 | Estrategista de Parcerias | tático | `exp` | 123 | ativo | novo |
| `ca_119_estrategista_retencao_ltv` | CA.119 | Estrategista de Retenção e LTV | tático | `exp` | 124 | ativo | novo |
| `ca_120_estrategista_comunidade_ativacao` | CA.120 | Estrategista de Comunidade e Ativação | tático | `exp` | 125 | ativo | novo |
| `ca_121_head_programas_indicacao` | CA.121 | Head de Programas de Indicação | tático | `exp` | 126 | ativo | novo |
| `ca_122_especialista_prinda` | CA.122 | Especialista em PRINDA | operacional | `exp` | 127 | ativo | novo |
| `ca_123_especialista_pin` | CA.123 | Especialista em PIN | operacional | `exp` | 128 | ativo | novo |
| `ca_124_especialista_campanhas_indicacao` | CA.124 | Especialista em Campanhas de Indicação | operacional | `exp` | 129 | ativo | novo |
| `ca_125_analista_performance_indicacoes` | CA.125 | Analista de Performance de Indicações | operacional | `exp` | 130 | ativo | novo |
| `ca_126_head_parcerias_estrategicas` | CA.126 | Head de Parcerias Estratégicas | tático | `exp` | 131 | ativo | novo |
| `ca_127_especialista_parcerias_locais` | CA.127 | Especialista em Parcerias Locais | operacional | `exp` | 132 | ativo | novo |
| `ca_128_especialista_co_marketing` | CA.128 | Especialista em Co-marketing | operacional | `exp` | 133 | ativo | novo |
| `ca_129_especialista_convenios_aliancas` | CA.129 | Especialista em Convênios e Alianças | operacional | `exp` | 134 | ativo | novo |
| `ca_130_analista_performance_parcerias` | CA.130 | Analista de Performance de Parcerias | operacional | `exp` | 135 | ativo | novo |
| `ca_131_head_posvenda` | CA.131 | Head de Pós-venda | tático | `exp` | 136 | ativo | novo |
| `ca_132_especialista_lpv` | CA.132 | Especialista em LPV | operacional | `exp` | 137 | ativo | novo |
| `ca_133_especialista_nps_satisfacao` | CA.133 | Especialista em NPS e Satisfação | operacional | `exp` | 138 | ativo | novo |
| `ca_134_especialista_fidelizacao` | CA.134 | Especialista em Fidelização | operacional | `exp` | 139 | ativo | novo |
| `ca_135_especialista_recompra_reativacao` | CA.135 | Especialista em Recompra e Reativação | operacional | `exp` | 140 | ativo | novo |
| `ca_136_analista_experiencia_cliente` | CA.136 | Analista de Experiência do Cliente | operacional | `exp` | 141 | ativo | novo |
| `ca_137_head_comunidade` | CA.137 | Head de Comunidade | tático | `exp` | 142 | ativo | novo |
| `ca_138_especialista_ativacao_comunidades` | CA.138 | Especialista em Ativação de Comunidades | operacional | `exp` | 143 | ativo | novo |
| `ca_139_especialista_eventos_expansao` | CA.139 | Especialista em Eventos e Ações de Expansão | operacional | `exp` | 144 | ativo | novo |
| `ca_140_especialista_programas_gamificados` | CA.140 | Especialista em Programas Gamificados | operacional | `exp` | 145 | ativo | novo |
| `ca_141_analista_engajamento_base` | CA.141 | Analista de Engajamento de Base | operacional | `exp` | 146 | ativo | novo |
| `ca_142_head_inteligencia_expansao` | CA.142 | Head de Inteligência de Expansão | tático | `exp` | 147 | ativo | novo |
| `ca_143_analista_ltv` | CA.143 | Analista de LTV | operacional | `exp` | 148 | ativo | novo |
| `ca_144_analista_retencao` | CA.144 | Analista de Retenção | operacional | `exp` | 149 | ativo | novo |
| `ca_145_analista_origem_indicacoes` | CA.145 | Analista de Origem de Indicações | operacional | `exp` | 150 | ativo | novo |
| `ca_146_analista_oportunidades_crescimento_organico` | CA.146 | Analista de Oportunidades de Crescimento Orgânico | operacional | `exp` | 151 | ativo | novo |
| `ca_147_especialista_fluxos_automacao_expansao` | CA.147 | Especialista em Fluxos e Automação (Expansão) | operacional | `exp` | 152 | ativo | novo |
| `ca_148_especialista_landing_pages_indicacao` | CA.148 | Especialista em Landing Pages (Indicação/Parceria) | operacional | `exp` | 153 | ativo | novo |
| `ca_149_especialista_crm_expansao` | CA.149 | Especialista em CRM (Expansão) | operacional | `exp` | 154 | ativo | novo |
| `ca_150_analista_relatorios_expansao` | CA.150 | Analista de Relatórios (Expansão) | operacional | `exp` | 155 | ativo | novo |

---

## 5) time de operações e entrega (`ops`)

> **Nota:** Estes agentes foram definidos no organograma inicial para uma 3forB de 500k/mês, mas não tiveram detalhamento CA.XX. Considerados `pendente_definicao` para criação de prompts completos e atribuição de IDs CA.XX sequenciais.

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `camila_duarte_3fb_ops_e_151` | Camila Duarte | Diretora de Operações | estratégico | `ops` | 156 | ativo | pendente_definicao |
| `felipe_nogueira_3fb_ops_t_152` | Felipe Nogueira | Account Manager | tático | `ops` | 157 | ativo | pendente_definicao |
| `renata_lima_3fb_ops_t_153` | Renata Lima | Account Manager | tático | `ops` | 158 | ativo | pendente_definicao |
| `gustavo_neri_3fb_ops_o_154` | Gustavo Neri | Especialista em EDA (Operações) | operacional | `ops` | 159 | ativo | pendente_definicao |
| `andre_siqueira_3fb_ops_o_155` | André Siqueira | Especialista em Funil e MAV (Operações) | operacional | `ops` | 160 | ativo | pendente_definicao |
| `lucas_barreto_3fb_ops_o_156` | Lucas Barreto | Analista de Suporte ao Cliente | operacional | `ops` | 161 | ativo | pendente_definicao |

---

## 6) time de tecnologia e sistemas (`tec`)

> **Nota:** Estes agentes foram definidos no organograma inicial para uma 3forB de 500k/mês, mas não tiveram detalhamento CA.XX. Considerados `pendente_definicao` para criação de prompts completos e atribuição de IDs CA.XX sequenciais.

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `kleber_teles_3fb_tec_e_157` | Kleber Teles | Head de Tecnologia | estratégico | `tec` | 162 | ativo | pendente_definicao |
| `cassio_mendes_3fb_tec_e_158` | Cássio Mendes | Arquiteto de Sistemas e Automação | estratégico | `tec` | 163 | ativo | pendente_definicao |
| `nilo_ferraz_3fb_tec_o_159` | Nilo Ferraz | Desenvolvedor Web | operacional | `tec` | 164 | ativo | pendente_definicao |
| `ayla_mont_3fb_tec_o_160` | Ayla Mont | Especialista em CRM e Integrações | operacional | `tec` | 165 | ativo | pendente_definicao |
| `teo_varn_3fb_tec_o_161` | Téo Varn | Especialista em Automação (Tecnologia) | operacional | `tec` | 166 | ativo | pendente_definicao |
| `lira_sol_3fb_tec_o_162` | Lira Sol | Analista de QA e Processos Digitais | operacional | `tec` | 167 | ativo | pendente_definicao |
| `davi_kron_3fb_tec_o_163` | Davi Kron | Analista de Dados e BI (Tecnologia) | operacional | `tec` | 168 | ativo | pendente_definicao |

---

## 7) time financeiro e administrativo (`fin`)

> **Nota:** Estes agentes foram definidos no organograma inicial para uma 3forB de 500k/mês, mas não tiveram detalhamento CA.XX. Considerados `pendente_definicao` para criação de prompts completos e atribuição de IDs CA.XX sequenciais.

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `helena_prado_3fb_fin_e_164` | Helena Prado | Diretora Financeira | estratégico | `fin` | 169 | ativo | pendente_definicao |
| `marco_lien_3fb_fin_o_165` | Marco Lien | Analista Financeiro | operacional | `fin` | 170 | ativo | pendente_definicao |
| `nina_prado_3fb_fin_o_166` | Nina Prado | Analista de Controladoria | operacional | `fin` | 171 | ativo | pendente_definicao |
| `lia_varen_3fb_fin_o_167` | Lia Varen | Analista Administrativo | operacional | `fin` | 172 | ativo | pendente_definicao |
| `cael_monta_3fb_fin_o_168` | Cael Monta | Analista de Compras e Contratos | operacional | `fin` | 173 | ativo | pendente_definicao |

---

## 8) time de pessoas e cultura (`rhm`)

> **Nota:** Estes agentes foram definidos no organograma inicial para uma 3forB de 500k/mês, mas não tiveram detalhamento CA.XX. Considerados `pendente_definicao` para criação de prompts completos e atribuição de IDs CA.XX sequenciais.

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `iara_bell_3fb_rhm_e_169` | Iara Bell | Head de Pessoas e Cultura | estratégico | `rhm` | 174 | ativo | pendente_definicao |
| `noel_ventura_3fb_rhm_o_170` | Noel Ventura | Analista de Recrutamento e Seleção | operacional | `rhm` | 175 | ativo | pendente_definicao |
| `cora_nunes_3fb_rhm_o_171` | Cora Nunes | Analista de Desenvolvimento Humano | operacional | `rhm` | 176 | ativo | pendente_definicao |
| `luma_serin_3fb_rhm_o_172` | Luma Serin | Analista de Cultura e Performance | operacional | `rhm` | 177 | ativo | pendente_definicao |

---

## 9) time jurídico e governança (`jur`)

> **Nota:** Estes agentes foram definidos no organograma inicial para uma 3forB de 500k/mês, mas não tiveram detalhamento CA.XX. Considerados `pendente_definicao` para criação de prompts completos e atribuição de IDs CA.XX sequenciais.

| id_canonico | nome_visual | cargo | nivel | setor | sequencial_global | status | categoria |
|---|---|---|---|---|---:|---|---|
| `tales_breno_3fb_jur_e_173` | Tales Breno | Head Jurídico | estratégico | `jur` | 178 | ativo | pendente_definicao |
| `lina_moura_3fb_jur_o_174` | Lina Moura | Analista Jurídica | operacional | `jur` | 179 | ativo | pendente_definicao |
| `caio_vern_3fb_jur_o_175` | Caio Vern | Analista de Compliance e Governança | operacional | `jur` | 180 | ativo | pendente_definicao |

---

## 10) agentes substituídos / descontinuados (do organograma antigo ou conversas iniciais)

| nome_antigo | cargo_antigo | status | observação |
|---|---|---|---|
| Cael Voss | CRO | substituido | Substituído por Rian Mercer. | 
| Murilo Zago | Head de Vendas | pendente_revisao | No organograma antigo, mas não explicitamente reafirmado na nova estrutura CA.XX. | 
| Henri Milan | SDR / Hunter | pendente_revisao | No organograma antigo, mas não explicitamente reafirmado na nova estrutura CA.XX. | 
| Alec Ross | Closer | pendente_revisao | No organograma antigo, mas não explicitamente reafirmado na nova estrutura CA.XX. | 
| Zoren White | SDR | pendente_revisao | No organograma antigo, mas não explicitamente reafirmado na nova estrutura CA.XX. | 
| Tarian Wolfe | Analista Comercial | pendente_revisao | No organograma antigo, mas não explicitamente reafirmado na nova estrutura CA.XX. | 
| Bernardo Castello | Diretor de Marketing | substituido | Substituído por Anton Borselli para a operação. Bia Fanel como CMO. |
| Benício Ravel | Gestor de Tráfego | substituido | Substituído por Nolan Krev (Head de Gestão de Tráfego). |
| Davi Fontes | Copywriter | pendente_revisao | No organograma antigo, mas novas funções de Copywriter de Conteúdo (CA.38) e Redator SEO (CA.39) foram criadas. |
| Marina Vaz | Diretora de Arte | pendente_revisao | Novas funções de criação (Diretor de Arte CA.45, Designers, Editores) foram criadas, mas a Marina não foi explicitamente realocada. |
| Lívia Salles | Community & Social / Social Media Manager | existente_com_revisao | Mencionada no organograma antigo e no detalhe de marketing. Na nova estrutura, tem CA.42 Social Media Manager e CA.43 Analista de Comunidade e Engajamento. Precisa de confirmação de realocação. |
| Ícaro Marquetti | Estrategista de Vídeo e SPV | pendente_revisao | Na nova estrutura, tem CA.40 Roteirista de Vídeos Curtos e CA.41 Roteirista de YouTube. Precisa de confirmação de realocação. |
| Helena Duarte | Revisora de Linguagem e Norma Culta | pendente_revisao | Nova estrutura tem revisão de conteúdo. Precisa de confirmação. |
| Elian Dravet | Solicitador Estratégico de Prompt | pendente_revisao | Novas funções de prompt. Precisa de confirmação. |
| Serena Valmont | Especialista em Prompt de Imagem | pendente_revisao | Novas funções de prompt de imagem (CA.45 Diretor de Arte, CA.46 Designer de Social, CA.47 Designer de Performance). Precisa de confirmação. |
| Hector Valente | CGO Expansão | substituido | Substituído por Liora Blake (Diretora de Expansão). |
| Tadeu Gusmão | Head de Expansão | pendente_revisao | Novas funções de Expansão foram criadas, mas Tadeu não foi explicitamente realocado. |
| Ricardo Lemos | Treinador PIRP | descontinuado | Não há menção ou similaridade explícita na nova estrutura. |

---

## 11) total de agentes consolidados

- Liderança Estratégica: 5 agentes
- Marketing Operacional: 63 agentes (Diretor + 62 CAs)
- Vendas Operacional: 49 agentes (Diretor + 48 CAs)
- Expansão Operacional: 38 agentes (Diretora + 37 CAs)
- Operações e Entrega: 6 agentes (`pendente_definicao`)
- Tecnologia e Sistemas: 7 agentes (`pendente_definicao`)
- Financeiro e Administrativo: 5 agentes (`pendente_definicao`)
- Pessoas e Cultura: 4 agentes (`pendente_definicao`)
- Jurídico e Governança: 3 agentes (`pendente_definicao`)

**Total Geral de Agentes (confirmados, novos e pendentes de definição): 180 agentes.**

---

## 12) hierarquia visual (macro - mermaid)

```mermaid
graph TD
    Z[Zara Bittencourt<br/>CEO 3forB] --> R[Rian Mercer<br/>CRO]
    Z --> B[Bia Fanel<br/>CMO]
    Z --> P[Paula Zurik<br/>Responsável QG]
    Z --> S[Sandro Zanelli<br/>Valuation]

    B --> AM[Anton Borselli<br/>Dir. Marketing Operação]
    AM --> MKT_OPS[Módulos e Agentes Marketing]

    R --> MG[Max Guerra<br/>Dir. Vendas]
    MG --> VND_OPS[Módulos e Agentes Vendas]
    R --> LB[Liora Blake<br/>Dir. Expansão]
    LB --> EXP_OPS[Módulos e Agentes Expansão]

    Z --> OPS[Camila Duarte<br/>Dir. Operações e Entrega]
    Z --> TEC[Kleber Teles<br/>Head Tecnologia e Sistemas]
    Z --> FIN[Helena Prado<br/>Dir. Financeira e Adm.]
    Z --> RHM[Iara Bell<br/>Head Pessoas e Cultura]
    Z --> JUR[Tales Breno<br/>Head Jurídico e Gov.]

    MKT_OPS --> MA[Marketing | Mídias Pagas]
    MKT_OPS --> MC[Marketing | Conteúdo e Social]
    MKT_OPS --> CR[Marketing | Criação]
    MKT_OPS --> FN[Marketing | Funis e Automação]
    MKT_OPS --> DD[Marketing | Dados e Performance]

    VND_OPS --> VS[Vendas | Estratégia Comercial]
    VND_OPS --> PV[Vendas | Pré-vendas]
    VND_OPS --> CV[Vendas | Conversão]
    VND_OPS --> AC[Vendas | Atendimento Comercial e CRC]
    VND_OPS --> CA[Vendas | CRM e Automação Comercial]
    VND_OPS --> SC[Vendas | Scripts e Mensagens]
    VND_OPS --> GP[Vendas | Gestão e Performance]
    VND_OPS --> TD[Vendas | Treinamento e Desenvolvimento]
    VND_OPS --> PE[Vendas | Programas Especiais]

    EXP_OPS --> ES[Expansão | Estratégia]
    EXP_OPS --> PI[Expansão | Programas de Indicação]
    EXP_OPS --> PR[Expansão | Parcerias]
    EXP_OPS --> PVJ[Expansão | Pós-venda e Jornada]
    EXP_OPS --> CA2[Expansão | Comunidade e Ativação]
    EXP_OPS --> IE[Expansão | Inteligência de Expansão]
    EXP_OPS --> SO[Expansão | Suporte Operacional]
```

---

## 13) árvore ascii (detalhada)

```text
3forb/
├── zara_bittencourt_3fb_ceo_e_000/          # CEO
│
├── rian_mercer_3fb_cro_e_001/               # CRO
│   ├── max_guerra_3fb_vnd_e_064/            # Diretor de Vendas
│   │   ├── ca_065_pmo_vendas/                # PMO de Vendas
│   │   ├── ca_066_gestor_operacoes_vendas/   # Gestor de Operações de Vendas
│   │   ├── ca_067_head_estrategia_comercial/ # Head de Estratégia Comercial
│   │   ├── ca_068_estrategista_funis_vendas/ # Estrategista de Funis de Vendas
│   │   ├── ca_069_estrategista_icp_oferta/   # Estrategista de ICP e Oferta
│   │   ├── ca_070_estrategista_sla_marketing_vendas/ # Estrategista de SLA Marketing e Vendas
│   │   ├── ca_071_estrategista_pipeline_processos_comerciais/ # Estrategista de Pipeline e Processos Comerciais
│   │   ├── ca_072_head_prevendas/            # Head de Pré-vendas
│   │   ├── ca_073_especialista_sdr_outbound/ # Especialista em SDR Outbound
│   │   ├── ca_074_especialista_sdr_inbound/  # Especialista em SDR Inbound
│   │   ├── ca_075_especialista_qualificacao_leads/ # Especialista em Qualificação de Leads
│   │   ├── ca_076_analista_tempo_resposta_cadencia/ # Analista de Tempo de Resposta e Cadência
│   │   ├── ca_077_head_conversao_vendas/      # Head de Conversão (Vendas)
│   │   ├── ca_078_especialista_closer_consultivo/ # Especialista em Closer Consultivo
│   │   ├── ca_079_especialista_closer_alta_oferta/ # Especialista em Closer de Alta Oferta
│   │   ├── ca_080_especialista_negociacao_objecoes/ # Especialista em Negociação e Objeções
│   │   ├── ca_081_analista_conversao_comercial/ # Analista de Conversão Comercial
│   │   ├── ca_082_head_crc/                  # Head de CRC
│   │   ├── ca_083_especialista_atendimento_whatsapp/ # Especialista em Atendimento Comercial WhatsApp
│   │   ├── ca_084_especialista_agendamento/  # Especialista em Agendamento
│   │   ├── ca_085_especialista_recuperacao_leads/ # Especialista em Recuperação de Leads
│   │   ├── ca_086_especialista_noshow_reativacao/ # Especialista em No-show e Reativação
│   │   ├── ca_087_analista_qualidade_atendimento_comercial/ # Analista de Qualidade de Atendimento Comercial
│   │   ├── ca_088_head_crm_comercial/        # Head de CRM Comercial
│   │   ├── ca_089_especialista_kommo/        # Especialista em Kommo
│   │   ├── ca_090_especialista_automacao_comercial/ # Especialista em Automação Comercial
│   │   ├── ca_091_especialista_lead_scoring/ # Especialista em Lead Scoring
│   │   ├── ca_092_especialista_distribuicao_leads/ # Especialista em Distribuição de Leads
│   │   ├── ca_093_analista_higiene_organizacao_crm/ # Analista de Higiene e Organização do CRM
│   │   ├── ca_094_head_scripts_comerciais/    # Head de Scripts Comerciais
│   │   ├── ca_095_especialista_scripts_primeiro_contato/ # Especialista em Scripts de Primeiro Contato
│   │   ├── ca_096_especialista_scripts_followup/ # Especialista em Scripts de Follow-up
│   │   ├── ca_097_especialista_biblioteca_objecoes/ # Especialista em Biblioteca de Objeções
│   │   ├── ca_098_especialista_mensagens_nutricao_comercial/ # Especialista em Mensagens de Nutrição Comercial
│   │   ├── ca_099_head_performance_comercial/ # Head de Performance Comercial
│   │   ├── ca_100_analista_kpis_comerciais/    # Analista de KPIs Comerciais
│   │   ├── ca_101_analista_taxa_conversao_funil/ # Analista de Taxa de Conversão por Funil
│   │   ├── ca_102_analista_perdas_pipeline/ # Analista de Perdas de Pipeline
│   │   ├── ca_103_analista_forecast_previsibilidade/ # Analista de Forecast e Previsibilidade
│   │   ├── ca_104_head_treinamento_comercial/ # Head de Treinamento Comercial
│   │   ├── ca_105_especialista_treinamento_sdr/ # Especialista em Treinamento de SDR
│   │   ├── ca_106_especialista_treinamento_closer/ # Especialista em Treinamento de Closer
│   │   ├── ca_107_especialista_treinamento_crc/ # Especialista em Treinamento de CRC
│   │   ├── ca_108_analista_reciclagem_acompanhamento_comercial/ # Analista de Reciclagem e Acompanhamento Comercial
│   │   ├── ca_109_head_gestex/               # Head de Gestex
│   │   ├── ca_110_especialista_gestao_comercial_dedicada/ # Especialista em Gestão Comercial Dedicada
│   │   ├── ca_111_head_caper/               # Head de CAPeR
│   │   └── ca_112_especialista_captacao_agendamento_presencial/ # Especialista em Captação e Agendamento Presencial
│   │
│   └── liora_blake_3fb_exp_e_113/           # Diretora de Expansão
│       ├── ca_114_pmo_expansao/              # PMO de Expansão
│       ├── ca_115_gestor_operacoes_expansao/ # Gestor de Operações de Expansão
│       ├── ca_116_head_estrategia_expansao/  # Head de Estratégia de Expansão
│       ├── ca_117_estrategista_indicacao/    # Estrategista de Indicação
│       ├── ca_118_estrategista_parcerias/    # Estrategista de Parcerias
│       ├── ca_119_estrategista_retencao_ltv/ # Estrategista de Retenção e LTV
│       ├── ca_120_estrategista_comunidade_ativacao/ # Estrategista de Comunidade e Ativação
│       ├── ca_121_head_programas_indicacao/  # Head de Programas de Indicação
│       ├── ca_122_especialista_prinda/       # Especialista em PRINDA
│       ├── ca_123_especialista_pin/          # Especialista em PIN
│       ├── ca_124_especialista_campanhas_indicacao/ # Especialista em Campanhas de Indicação
│       ├── ca_125_analista_performance_indicacoes/ # Analista de Performance de Indicações
│       ├── ca_126_head_parcerias_estrategicas/ # Head de Parcerias Estratégicas
│       ├── ca_127_especialista_parcerias_locais/ # Especialista em Parcerias Locais
│       ├── ca_128_especialista_co_marketing/ # Especialista em Co-marketing
│       ├── ca_129_especialista_convenios_aliancas/ # Especialista em Convênios e Alianças
│       ├── ca_130_analista_performance_parcerias/ # Analista de Performance de Parcerias
│       ├── ca_131_head_posvenda/             # Head de Pós-venda
│       ├── ca_132_especialista_lpv/          # Especialista em LPV
│       ├── ca_133_especialista_nps_satisfacao/ # Especialista em NPS e Satisfação
│       ├── ca_134_especialista_fidelizacao/ # Especialista em Fidelização
│       ├── ca_135_especialista_recompra_reativacao/ # Especialista em Recompra e Reativação
│       ├── ca_136_analista_experiencia_cliente/ # Analista de Experiência do Cliente
│       ├── ca_137_head_comunidade/           # Head de Comunidade
│       ├── ca_138_especialista_ativacao_comunidades/ # Especialista em Ativação de Comunidades
│       ├── ca_139_especialista_eventos_expansao/ # Especialista em Eventos e Ações de Expansão
│       ├── ca_140_especialista_programas_gamificados/ # Especialista em Programas Gamificados
│       ├── ca_141_analista_engajamento_base/ # Analista de Engajamento de Base
│       ├── ca_142_head_inteligencia_expansao/ # Head de Inteligência de Expansão
│       ├── ca_143_analista_ltv/             # Analista de LTV
│       ├── ca_144_analista_retencao/         # Analista de Retenção
│       ├── ca_145_analista_origem_indicacoes/ # Analista de Origem de Indicações
│       ├── ca_146_analista_oportunidades_crescimento_organico/ # Analista de Oportunidades de Crescimento Orgânico
│       ├── ca_147_especialista_fluxos_automacao_expansao/ # Especialista em Fluxos e Automação (Expansão)
│       ├── ca_148_especialista_landing_pages_indicacao/ # Especialista em Landing Pages (Indicação/Parceria)
│       ├── ca_149_especialista_crm_expansao/ # Especialista em CRM (Expansão)
│       └── ca_150_analista_relatorios_expansao/ # Analista de Relatórios (Expansão)
│
├── bia_fanel_3fb_mkt_e_002/                 # CMO
│   └── anton_borselli_3fb_mkt_e_005/        # Diretor de Marketing da Operação
│       ├── ca_001_pmo_marketing/             # PMO de Marketing
│       ├── ca_002_gestor_operacoes_marketing/ # Gestor de Operações de Marketing
│       ├── ca_003_head_estrategia_marketing/ # Head de Estratégia de Marketing
│       ├── ca_004_estrategista_campanhas/    # Estrategista de Campanhas
│       ├── ca_005_estrategista_posicionamento/ # Estrategista de Posicionamento
│       ├── ca_006_estrategista_oferta_funil/ # Estrategista de Oferta e Funil
│       ├── ca_007_head_meta/                 # Head de Meta
│       ├── ca_008_estrategista_meta/         # Estrategista de Meta
│       ├── ca_009_especialista_instagram_organico/ # Especialista em Instagram Orgânico
│       ├── ca_010_especialista_facebook_organico/ # Especialista em Facebook Orgânico
│       ├── ca_011_especialista_meta_ads/     # Especialista em Meta Ads
│       ├── ca_012_analista_performance_meta/ # Analista de Performance Meta
│       ├── ca_013_head_google/               # Head de Google
│       ├── ca_014_estrategista_google/       # Estrategista de Google
│       ├── ca_015_especialista_google_meu_negocio/ # Especialista em Google Meu Negócio
│       ├── ca_016_especialista_google_ads/   # Especialista em Google Ads
│       ├── ca_017_especialista_seo/          # Especialista em SEO
│       ├── ca_018_especialista_analytics_tag_manager/ # Especialista em Analytics e Tag Manager
│       ├── ca_019_analista_performance_google/ # Analista de Performance Google
│       ├── ca_020_head_linkedin/             # Head de LinkedIn
│       ├── ca_021_estrategista_linkedin/     # Estrategista de LinkedIn
│       ├── ca_022_especialista_linkedin_organico/ # Especialista em LinkedIn Orgânico
│       ├── ca_023_especialista_linkedin_ads/ # Especialista em LinkedIn Ads
│       ├── ca_024_analista_performance_linkedin/ # Analista de Performance LinkedIn
│       ├── ca_025_head_tiktok/               # Head de TikTok
│       ├── ca_026_estrategista_tiktok/       # Estrategista de TikTok
│       ├── ca_027_especialista_tiktok_organico/ # Especialista em TikTok Orgânico
│       ├── ca_028_especialista_tiktok_ads/   # Especialista em TikTok Ads
│       ├── ca_029_analista_performance_tiktok/ # Analista de Performance TikTok
│       ├── ca_030_head_youtube/              # Head de YouTube
│       ├── ca_031_estrategista_youtube/      # Estrategista de YouTube
│       ├── ca_032_especialista_youtube_organico/ # Especialista em YouTube Orgânico
│       ├── ca_033_especialista_youtube_ads/   # Especialista em YouTube Ads
│       ├── ca_034_analista_performance_youtube/ # Analista de Performance YouTube
│       ├── ca_035_head_conteudo/             # Head de Conteúdo
│       ├── ca_036_estrategista_conteudo/     # Estrategista de Conteúdo
│       ├── ca_037_especialista_calendario_editorial/ # Especialista em Calendário Editorial
│       ├── ca_038_copywriter_conteudo/       # Copywriter de Conteúdo
│       ├── ca_039_redator_seo/               # Redator SEO
│       ├── ca_040_roteirista_videos_curtos/ # Roteirista de Vídeos Curtos
│       ├── ca_041_roteirista_youtube/       # Roteirista de YouTube
│       ├── ca_042_social_media_manager/      # Social Media Manager
│       ├── ca_043_analista_comunidade_engajamento/ # Analista de Comunidade e Engajamento
│       ├── ca_044_head_criacao/             # Head de Criação
│       ├── ca_045_diretor_arte/             # Diretor de Arte
│       ├── ca_046_designer_social/           # Designer de Social
│       ├── ca_047_designer_performance/      # Designer de Performance
│       ├── ca_048_editor_video_curto/       # Editor de Vídeo Curto
│       ├── ca_049_editor_video_longo/       # Editor de Vídeo Longo
│       ├── ca_050_motion_designer/           # Motion Designer
│       ├── ca_051_especialista_landing_pages_visuais/ # Especialista em Landing Pages Visuais
│       ├── ca_052_head_funis_automacao/     # Head de Funis e Automação
│       ├── ca_053_especialista_crm_marketing/ # Especialista em CRM de Marketing
│       ├── ca_054_especialista_automacao_marketing/ # Especialista em Automação (Marketing)
│       ├── ca_055_especialista_landing_pages/ # Especialista em Landing Pages
│       ├── ca_056_especialista_cro_marketing/ # Especialista em CRO (Marketing)
│       ├── ca_057_especialista_lead_tracking/ # Especialista em Lead Tracking
│       ├── ca_058_analista_jornada_lead/    # Analista de Jornada do Lead
│       ├── ca_059_head_dados_marketing/     # Head de Dados de Marketing
│       ├── ca_060_analista_bi_marketing/    # Analista de BI de Marketing
│       ├── ca_061_analista_attribution/     # Analista de Attribution
│       ├── ca_062_analista_testes_ab/       # Analista de Testes A/B
│       └── ca_063_analista_relatorios_ramp_mkt/ # Analista de Relatórios e RAMP (Marketing)
│
├── paula_zurik_3fb_qg_e_003/                # Responsável Total pelo QG
│
├── sandro_zanelli_3fb_val_c_004/            # Especialista em Valuation
│
├── ops/                                     # Operações e Entrega
│   ├── camila_duarte_3fb_ops_e_151/         # Diretora de Operações
│   ├── felipe_nogueira_3fb_ops_t_152/       # Account Manager
│   ├── renata_lima_3fb_ops_t_153/           # Account Manager
│   ├── gustavo_neri_3fb_ops_o_154/          # Especialista em EDA (Operações)
│   ├── andre_siqueira_3fb_ops_o_155/        # Especialista em Funil e MAV (Operações)
│   └── lucas_barreto_3fb_ops_o_156/         # Analista de Suporte ao Cliente
│
├── tec/                                     # Tecnologia e Sistemas
│   ├── kleber_teles_3fb_tec_e_157/          # Head de Tecnologia
│   ├── cassio_mendes_3fb_tec_e_158/         # Arquiteto de Sistemas e Automação
│   ├── nilo_ferraz_3fb_tec_o_159/           # Desenvolvedor Web
│   ├── ayla_mont_3fb_tec_o_160/             # Especialista em CRM e Integrações
│   ├── teo_varn_3fb_tec_o_161/              # Especialista em Automação (Tecnologia)
│   ├── lira_sol_3fb_tec_o_162/              # Analista de QA e Processos Digitais
│   └── davi_kron_3fb_tec_o_163/             # Analista de Dados e BI (Tecnologia)
│
├── fin/                                     # Financeiro e Administrativo
│   ├── helena_prado_3fb_fin_e_164/          # Diretora Financeira
│   ├── marco_lien_3fb_fin_o_165/            # Analista Financeiro
│   ├── nina_prado_3fb_fin_o_166/            # Analista de Controladoria
│   ├── lia_varen_3fb_fin_o_167/             # Analista Administrativo
│   └── cael_monta_3fb_fin_o_168/            # Analista de Compras e Contratos
│
├── rhm/                                     # Pessoas e Cultura
│   ├── iara_bell_3fb_rhm_e_169/             # Head de Pessoas e Cultura
│   ├── noel_ventura_3fb_rhm_o_170/          # Analista de Recrutamento e Seleção
│   ├── cora_nunes_3fb_rhm_o_171/            # Analista de Desenvolvimento Humano
│   └── luma_serin_3fb_rhm_o_172/            # Analista de Cultura e Performance
│
└── jur/                                     # Jurídico e Governança
    ├── tales_breno_3fb_jur_e_173/           # Head Jurídico
    ├── lina_moura_3fb_jur_o_174/            # Analista Jurídica
    └── caio_vern_3fb_jur_o_175/             # Analista de Compliance e Governança
```

---

## 14) regra de consistência com pastas de agentes

Toda entrada deste organograma deve possuir pasta correspondente em `_ventures/3forb/agentes/` (ou no diretório canônico de agentes da 3forB, se houver um centralizado em `_agentes/`).

Checklist mínimo por agente:

1. pasta canônica existente com nome igual ao slug do id (ex: `zara_bittencourt_3fb_ceo_e_000`)
2. arquivo `persona.md` coerente com cargo e nível
3. arquivo `prompt_ativacao_cline.md` vigente
4. arquivo `session_log.md` com registro de ativação
5. arquivo `falas_user.md` (pode estar vazio inicialmente)
6. status no organograma compatível com situação operacional

> **Observação:** Atualmente (05/05/2026), apenas `zara_bittencourt_3fb_ceo_e_000` possui pasta criada em `_agentes/zara_bittencourt_ceo/`. Os demais agentes precisam ser formalizados.

---

## 15) regras de atualização

1. qualquer criação, remoção ou mudança de cargo de agente deve atualizar este documento no mesmo ciclo
2. id canônico é imutável após criação
3. sequencial global é único por venture (3forB), não por setor — conforme [`nomenclatura_agentes.md`](../../governance/nomenclatura_agentes.md)
4. status permitido: `ativo`, `descontinuado`, `reserva`, `pendente_definicao`, `substituido`, `existente_com_revisao`
5. mudanças devem manter coerência com [`organograma_grupob.md`](../../docs/governanca_grupob/organograma_grupob.md)
6. este documento substitui e unifica todas as versões anteriores de organograma da 3forB, incluindo:
   - [`governance/organograma.md`](../../governance/organograma.md)
   - [`governance/organograma_marketing.md`](../../governance/organograma_marketing.md)
   - informações de organograma do backup da conversa Zara Bittencourt CEO ChatGPT (linhas 1-14155)
7. toda definição de organograma em conversas de CEO/agentes deve ser refletida neste documento em até 1 ciclo de governança

---

## 16) resumo da estrutura do qg (base do sistema operacional)

O QG da 3forB é o sistema operacional da empresa, organizado em macrocamadas e módulos que acompanham a jornada do cliente e a operação interna:

- **1. COMANDO**
  - Dashboard Executivo
  - Inteligência e RAMP
  - Reuniões e Decisões

- **2. ENTRADA**
  - Diagnóstico
  - Comercial
  - Propostas
  - Contratos
  - Onboarding

- **3. OPERAÇÃO**
  - Clientes
  - Entregáveis
  - Tarefas e Produção

- **4. NÚCLEOS ESPECIALISTAS**
  - Marketing
  - Mídias Pagas
  - Vendas
  - Expansão

- **5. ESTRUTURA DA MÁQUINA**
  - E.D.A
  - MAV
  - Automações
  - Agentes e IA
  - Playbooks e Base de Conhecimento

- **6. GESTÃO**
  - Financeiro
  - Configurações

> **Observação:** Esta estrutura detalhada do QG, definida na conversa Zara/Paula Zurik, serve como blueprint para a criação dos módulos internos da 3forB e suas respectivas equipes de agentes, complementando o organograma de agentes da empresa.

SagB