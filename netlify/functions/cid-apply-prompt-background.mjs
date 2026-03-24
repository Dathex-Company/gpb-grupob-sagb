import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Limites operacionais para proteger V1
const LIMIT_SINGLE_CHARS = 100000;
const LIMIT_CONSOLIDATED_CHARS = 200000;
// Estimativa baseada em gemini-2.5-flash (U$ 0.075 / 1M input e U$ 0.30 / 1M output)
const COST_PER_1M_INPUT = 0.075;
const COST_PER_1M_OUTPUT = 0.30;
const MODEL_NAME = 'gemini-2.5-flash';

const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase vars missing');
  return createClient(url, key);
};

const getGenAIClient = () => {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('Gemini key missing');
  return new GoogleGenAI(key);
};

// Funcao auxiliar para extrair o melhor texto do asset
const getAssetText = async (supabase, assetId) => {
  // Tenta pegar transcription ou extracted_text dos outputs
  const { data: outputs } = await supabase
    .from('cid_outputs')
    .select('content_text')
    .eq('asset_id', assetId)
    .in('output_type', ['extracted_text', 'transcription'])
    .order('created_at', { ascending: false })
    .limit(1);

  if (outputs && outputs.length > 0 && outputs[0].content_text) {
    return outputs[0].content_text;
  }

  // Fallback: junta os chunks
  const { data: chunks } = await supabase
    .from('cid_chunks')
    .select('text_content')
    .eq('asset_id', assetId)
    .order('chunk_index', { ascending: true });

  if (chunks && chunks.length > 0) {
    return chunks.map(c => c.text_content).join('\n\n');
  }

  return '';
};

// Chama a Gemini
const callLLM = async (systemPrompt, userPrompt, outputFormat) => {
  const ai = getGenAIClient();
  const startTime = Date.now();
  
  // Define mime type sugerido para JSON se for o caso
  const mimeType = outputFormat === 'json' ? 'application/json' : 'text/plain';

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
    ],
    config: {
      temperature: 0.2,
      responseMimeType: mimeType
    }
  });

  const latencyMs = Date.now() - startTime;
  
  // Gemini Node SDK: dados de uso
  const usage = response.usageMetadata || {};
  const tokensIn = usage.promptTokenCount || 0;
  const tokensOut = usage.candidatesTokenCount || 0;
  
  const estimatedCost = (tokensIn / 1000000 * COST_PER_1M_INPUT) + (tokensOut / 1000000 * COST_PER_1M_OUTPUT);

  return {
    text: response.text || '',
    tokensIn,
    tokensOut,
    latencyMs,
    estimatedCost
  };
};

// Execucao da Netlify Background Function
export async function handler(event) {
  // Retorna 202 IMEDIATAMENTE e roda em background
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { runId } = payload;
  if (!runId) return { statusCode: 400, body: 'Missing runId' };

  const supabase = getSupabaseAdmin();

  const failRun = async (message) => {
    console.error(`[CID Prompt] Falha no run ${runId}: ${message}`);
    await supabase.from('cid_prompt_runs').update({
      status: 'error',
      error_message: message,
      completed_at: new Date().toISOString()
    }).eq('id', runId);
  };

  try {
    // 1. Pega os dados do Run Pai
    const { data: run, error: runErr } = await supabase
      .from('cid_prompt_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (runErr || !run) throw new Error('Run não encontrado');

    // Marca como processando
    await supabase.from('cid_prompt_runs').update({
      status: 'processing',
      started_at: new Date().toISOString()
    }).eq('id', runId);

    const promptSnap = run.prompt_snapshot;
    if (!promptSnap || !promptSnap.user_prompt_template) throw new Error('Snapshot inválido');

    // 2. Pega os Items (Assets vinculados)
    const { data: items, error: itemsErr } = await supabase
      .from('cid_prompt_run_items')
      .select('*')
      .eq('run_id', runId)
      .order('sequence_order', { ascending: true });

    if (itemsErr || !items || items.length === 0) throw new Error('Nenhum asset vinculado a esta execução');

    // ---------------------------------------------------------
    // FLUXO: SINGLE ou CONSOLIDATED (Ambos geram 1 unica saida no Pai)
    // ---------------------------------------------------------
    if (run.execution_scope === 'single' || run.execution_scope === 'consolidated') {
      
      let combinedText = '';
      const limitChars = run.execution_scope === 'single' ? LIMIT_SINGLE_CHARS : LIMIT_CONSOLIDATED_CHARS;
      let wasTruncated = false;
      let originalTotalChars = 0;

      // Junta o texto de todos os items (1 no single, N no consolidated)
      for (const item of items) {
        const text = await getAssetText(supabase, item.asset_id);
        if (text) {
          combinedText += `\n\n--- Documento ${item.sequence_order + 1} ---\n${text}`;
        }
      }

      originalTotalChars = combinedText.length;

      // Applica Truncamento de Seguranca
      if (originalTotalChars > limitChars) {
        combinedText = combinedText.substring(0, limitChars);
        wasTruncated = true;
      }

      if (!combinedText.trim()) throw new Error('Nenhum texto encontrado nos assets selecionados.');

      // Injeta no prompt
      const finalPrompt = promptSnap.user_prompt_template.replace(/\{\{text\}\}/g, combinedText);

      // Chama a LLM
      const llmResult = await callLLM(promptSnap.system_prompt, finalPrompt, promptSnap.output_format);

      // Atualiza o Run Pai
      const updatePayload = {
        status: 'completed',
        result_text: llmResult.text,
        source_total_chars: originalTotalChars,
        source_processed_chars: combinedText.length,
        was_truncated: wasTruncated,
        warning_message: wasTruncated ? `Texto excedeu o limite de segurança da V1 (${limitChars} caracteres) e foi parcialmente processado.` : null,
        model_used: MODEL_NAME,
        tokens_in: llmResult.tokensIn,
        tokens_out: llmResult.tokensOut,
        estimated_cost_usd: llmResult.estimatedCost,
        latency_ms: llmResult.latencyMs,
        completed_at: new Date().toISOString()
      };

      // Se for JSON, tenta parsear
      if (promptSnap.output_format === 'json') {
        try {
          // Remove marcadores markdown se a LLM mandou ```json
          let cleanStr = llmResult.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          updatePayload.result_json = JSON.parse(cleanStr);
        } catch (e) {
          updatePayload.warning_message = (updatePayload.warning_message || '') + ' O modelo não retornou um JSON válido.';
        }
      }

      await supabase.from('cid_prompt_runs').update(updatePayload).eq('id', runId);

      // Atualiza os items filhos so para constar concluido
      await supabase.from('cid_prompt_run_items').update({
        status: 'completed',
        completed_at: new Date().toISOString()
      }).eq('run_id', runId);
    }
    
    // ---------------------------------------------------------
    // FLUXO: BATCH (Processa um por um. Apenas logaremos que V1.1 fara isso)
    // ---------------------------------------------------------
    else if (run.execution_scope === 'batch') {
      throw new Error('Modo Batch pesado agendado para V1.1. Selecione Single ou Consolidated.');
    } else {
      throw new Error(`Execution scope desconhecido: ${run.execution_scope}`);
    }

  } catch (error) {
    await failRun(error.message);
  }
}
