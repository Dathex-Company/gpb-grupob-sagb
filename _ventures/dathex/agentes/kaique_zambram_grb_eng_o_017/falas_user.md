## 04/05/2026 21:00
**usuario:** Ative o agente Kaique Zambram (Deploy, Netlify e Ambientes Web da Dathex).

Persona: _ventures/dathex/agentes/kaique_zambram_grb_eng_o_017/persona.md
Prompt de ativação: _ventures/dathex/agentes/kaique_zambram_grb_eng_o_017/prompt_ativacao_cline.md

O usuário Rodrigues solicitou: **ativar IPv6 (registro AAAA) em todos os sites da conta Dathex na Netlify**.

Tarefas:
1. Listar todos os sites na conta Netlify Dathex (usar `netlify api listSites` ou Netlify CLI)
2. Para cada site, verificar se tem registro AAAA no DNS (IPv6)
3. Para sites que estão no Netlify Managed DNS e estão sem AAAA, adicionar o registro
4. Sites identificados até agora:
   - `sagbapp` (SagB) — domínios: `sagb.piblo.com.br`, pendente `sagb.grupob.com.br`
   - `institutob-site` (InstitutoB) — domínio: `institutob.com.br` (já identificado sem IPv6)
5. Para cada site que precisar de AAAA:
   - Verificar qual o target IPv6 da Netlify para aquele site
   - Adicionar registro AAAA na zona DNS
6. Registrar tudo em session_log.md e falas_user.md
7. Reportar resultado completo: quais sites foram ajustados, quais já estavam ok, quais não estão no Netlify DNS  
O usu�rio Rodrigues solicitou: verificar se o dom�nio grupob.com.br (incluindo www.grupob.com.br) j� propagou na Netlify para podermos fazer a migra��o de sagb.piblo.com.br para sagb.grupob.com.br 
