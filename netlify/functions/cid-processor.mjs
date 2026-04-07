
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { Buffer } from 'buffer';

// Constantes
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB, um limite prático para a função
const CID_CHUNK_MAX_CHARS = 12000;
const SUMMARY_TIMEOUT_MS = Number(process.env.CID_SUMMARY_TIMEOUT_MS || 20000);
const EXTRACT_TIMEOUT_MS = Number(process.env.CID_EXTRACT_TIMEOUT_MS || 30000);
const QUEUED_STALE_MINUTES = Number(process.env.CID_QUEUE_STALE_MINUTES || 30);
const ORPHAN_JOB_MINUTES = Number(process.env.CID_ORPHAN_JOB_MINUTES || 20);
const PDF_MIN_HEURISTIC_CHARS = Number(process.env.CID_PDF_MIN_HEURISTIC_CHARS || 200);

const ACTIVE_JOB_STATUSES = ['processing', 'fragmenting', 'transcribing', 'summarizing', 'consolidating'];

// Helpers
const json = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(payload),
});

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or service role key is missing.');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};

const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Missing Gemini API key.');
  }
  return new GoogleGenAI({ apiKey: key });
};

const safeUpdate = async (supabase, table, id, payload) => {
  const { error } = await supabase.from(table).update(payload).eq('id', id);
  if (error) {
    console.error(`Falha ao atualizar ${table}/${id}`, error);
    // Não joga o erro para não parar o fluxo principal, mas loga.
  }
};

const withTimeout = async (promise, timeoutMs, label) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout em ${label} (${timeoutMs}ms)`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const minutesBetween = (isoDate) => {
  if (!isoDate) return null;
  const ts = new Date(isoDate).getTime();
  if (Number.isNaN(ts)) return null;
  return (Date.now() - ts) / (1000 * 60);
};

const mergeJson = (baseValue, patchValue) => ({
  ...(typeof baseValue === 'object' && baseValue ? baseValue : {}),
  ...(typeof patchValue === 'object' && patchValue ? patchValue : {}),
});

const upsertOutput = async (supabase, payload) => {
  const { error } = await supabase.from('cid_outputs').insert(payload);
  if (error) {
    console.error('[CID Processor] Falha ao inserir output', { outputType: payload.output_type, error: error.message });
  }
};

// --- Funções Portadas e Adaptadas ---

const sanitizeUtf16Text = (value) => {
  // (Lógica de CIDView.tsx)
  const raw = String(value || '');
  if (!raw) return '';
  let out = '';
  for (let i = 0; i < raw.length; i += 1) {
    const code = raw.charCodeAt(i);
    const next = i + 1 < raw.length ? raw.charCodeAt(i + 1) : null;
    if (code >= 0xD800 && code <= 0xDBFF) {
      if (next !== null && next >= 0xDC00 && next <= 0xDFFF) {
        out += raw[i] + raw[i + 1];
        i += 1;
      } else {
        out += '\uFFFD';
      }
      continue;
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      out += '\uFFFD';
      continue;
    }
    out += raw[i];
  }
  return out;
};

const sliceUtf16Safe = (value, start, end) => {
    // (Lógica de CIDView.tsx)
    // ... (implementação completa seria necessária aqui)
    return value.slice(start, end);
};

const splitChunks = (text, maxChars = CID_CHUNK_MAX_CHARS) => {
  // (Lógica de CIDView.tsx, simplificada)
  const raw = sanitizeUtf16Text(String(text || '')).trim();
  if (!raw) return [];
  const chunks = [];
  for (let i = 0; i < raw.length; i += maxChars) {
    chunks.push(raw.substring(i, i + maxChars));
  }
  return chunks;
};

const normalizeExtractedText = (text) => {
  const sanitized = sanitizeUtf16Text(String(text || ''));
  if (!sanitized) return '';
  return sanitized
    .replace(/\u0000/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[\t\f\v]+/g, ' ')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const decodePdfStringLiteral = (value) =>
  value
    .replace(/^\(|\)$/g, '')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');

const extractPdfTextHeuristic = (fileBuffer) => {
  const raw = fileBuffer.toString('latin1');
  const snippets = [];

  const tjMatches = raw.match(/\((?:\\.|[^\\()]){2,}\)\s*Tj/gm) || [];
  for (const match of tjMatches) {
    const literal = match.replace(/\s*Tj$/, '');
    snippets.push(decodePdfStringLiteral(literal));
  }

  const tjArrayMatches = raw.match(/\[(?:.|\n|\r)*?\]\s*TJ/gm) || [];
  for (const block of tjArrayMatches) {
    const literals = block.match(/\((?:\\.|[^\\()])*\)/gm) || [];
    for (const literal of literals) {
      snippets.push(decodePdfStringLiteral(literal));
    }
  }

  const text = normalizeExtractedText(snippets.join(' '));
  const chars = text.length;
  const confidence = chars === 0 ? 0 : Math.min(0.72, 0.25 + chars / 10000);

  return {
    text,
    chars,
    confidence,
  };
};

const extractTextWithGemini = async ({ fileBuffer, mimeType, instruction, timeoutMs = EXTRACT_TIMEOUT_MS }) => {
  const ai = getGeminiClient();

  const response = await withTimeout(
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType || 'application/octet-stream', data: fileBuffer.toString('base64') } },
          { text: instruction },
        ],
      },
      config: { temperature: 0.0 },
    }),
    timeoutMs,
    'extração Gemini'
  );

  return normalizeExtractedText(response?.text || '');
};

const extractDocumentText = async ({ materialType, mimeType, fileBuffer }) => {
  const normalizedMime = String(mimeType || '').toLowerCase();
  const isPdf = materialType === 'pdf' || normalizedMime.includes('pdf');
  const isDocx = materialType === 'docx' || normalizedMime.includes('officedocument.wordprocessingml.document');
  const isDoc = materialType === 'doc' || normalizedMime.includes('application/msword');

  if (materialType === 'txt' || normalizedMime.startsWith('text/')) {
    const text = normalizeExtractedText(fileBuffer.toString('utf-8'));
    return {
      text,
      metadata: {
        extractor_used: 'utf8_text_reader',
        chars_extracted: text.length,
        extraction_confidence: text ? 1 : 0,
        ocr_used: false,
      },
    };
  }

  if (isPdf) {
    const heuristic = extractPdfTextHeuristic(fileBuffer);
    if (heuristic.chars >= PDF_MIN_HEURISTIC_CHARS) {
      return {
        text: heuristic.text,
        metadata: {
          extractor_used: 'pdf_heuristic_tj_parser',
          chars_extracted: heuristic.chars,
          extraction_confidence: Number(heuristic.confidence.toFixed(2)),
          ocr_used: false,
        },
      };
    }

    let geminiText = '';
    try {
      geminiText = await extractTextWithGemini({
        fileBuffer,
        mimeType: 'application/pdf',
        instruction:
          'Extraia o texto deste PDF preservando ordem lógica, títulos, listas e parágrafos. Responda apenas com o texto extraído, sem comentários.',
      });
    } catch (error) {
      console.warn('[CID Processor] Fallback Gemini (PDF parse) falhou:', error.message);
    }

    if (geminiText.length > 0) {
      const shouldUseOcrFallback = geminiText.length < 300;
      if (!shouldUseOcrFallback) {
        return {
          text: geminiText,
          metadata: {
            extractor_used: 'gemini_pdf_parse',
            chars_extracted: geminiText.length,
            extraction_confidence: 0.86,
            ocr_used: false,
          },
        };
      }

      try {
        const ocrText = await extractTextWithGemini({
          fileBuffer,
          mimeType: 'application/pdf',
          instruction:
            'Este PDF pode ser escaneado. Aja como OCR e extraia todo o texto legível com a melhor fidelidade possível. Retorne apenas o texto.',
          timeoutMs: EXTRACT_TIMEOUT_MS + 10000,
        });

        if (ocrText.length >= geminiText.length) {
          return {
            text: ocrText,
            metadata: {
              extractor_used: 'gemini_pdf_ocr_fallback',
              chars_extracted: ocrText.length,
              extraction_confidence: 0.74,
              ocr_used: true,
            },
          };
        }
      } catch (error) {
        console.warn('[CID Processor] Fallback Gemini OCR (PDF) falhou:', error.message);
      }

      return {
        text: geminiText,
        metadata: {
          extractor_used: 'gemini_pdf_parse_low_text',
          chars_extracted: geminiText.length,
          extraction_confidence: 0.62,
          ocr_used: false,
        },
      };
    }
  }

  if (isDocx || isDoc) {
    let primary = '';
    try {
      primary = await extractTextWithGemini({
        fileBuffer,
        mimeType: isDocx
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/msword',
        instruction:
          'Extraia o texto deste documento Word preservando estrutura mínima (títulos, listas, parágrafos e tabelas simples em formato linear). Responda só com o texto.',
      });
    } catch (error) {
      console.warn('[CID Processor] Extração DOCX/DOC via Gemini falhou:', error.message);
    }

    if (primary.length > 0) {
      return {
        text: primary,
        metadata: {
          extractor_used: isDocx ? 'gemini_docx_parse' : 'gemini_doc_parse',
          chars_extracted: primary.length,
          extraction_confidence: isDocx ? 0.84 : 0.76,
          ocr_used: false,
        },
      };
    }

    const fallbackRaw = normalizeExtractedText(fileBuffer.toString('utf-8').replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u024F]/g, ' '));
    if (fallbackRaw.length > 0) {
      return {
        text: fallbackRaw,
        metadata: {
          extractor_used: 'binary_utf8_fallback',
          chars_extracted: fallbackRaw.length,
          extraction_confidence: 0.22,
          ocr_used: false,
        },
      };
    }
  }

  return {
    text: '',
    metadata: {
      extractor_used: 'unsupported_or_empty',
      chars_extracted: 0,
      extraction_confidence: 0,
      ocr_used: false,
    },
  };
};

const transcribeMedia = async (fileBuffer, mimeType) => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: fileBuffer.toString('base64') } },
          { text: 'Transcreva o audio fielmente.' }
        ]
      },
      config: { temperature: 0.0 }
    });
    return sanitizeUtf16Text(response.text || '');
  } catch (error) {
    console.error('Falha na transcrição com Gemini:', error);
    return '';
  }
};

const summarize = async (text, mode) => {
  const normalized = normalizeExtractedText(text);
  if (!normalized) return '';

  const ai = getGeminiClient();
  const prompt = mode === 'short'
    ? `Gere um resumo executivo curto (até 8 bullets) em pt-BR do conteúdo abaixo, focando em fatos, decisões, riscos e próximos passos.\n\nConteúdo:\n${normalized.slice(0, 120000)}`
    : `Gere um resumo detalhado em pt-BR (seções: contexto, pontos-chave, riscos, oportunidades, próximos passos) do conteúdo abaixo.\n\nConteúdo:\n${normalized.slice(0, 120000)}`;

  const response = await withTimeout(
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.2 },
    }),
    SUMMARY_TIMEOUT_MS,
    'resumo Gemini'
  );

  return normalizeExtractedText(response?.text || '');
};

// --- Handler Principal ---

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body' });
  }

  const { assetId } = payload;
  if (!assetId) {
    return json(400, { ok: false, error: 'Missing assetId' });
  }

  const supabaseAdmin = getSupabaseAdmin();
  let currentJob = null;
  let currentAsset = null;

  const failJob = async (message) => {
    console.error(`[CID Processor] Falha: ${message}`, { assetId });
    const retries = Number(currentJob?.retries || 0);
    const maxRetries = Number(currentJob?.max_retries || 3);
    const nextRetries = retries + 1;
    const exceeded = nextRetries > maxRetries;

    const nowIso = new Date().toISOString();

    await safeUpdate(supabaseAdmin, 'cid_assets', assetId, {
      status: exceeded ? 'error' : 'queued',
      failed_at: exceeded ? nowIso : null,
      updated_at: nowIso,
      payload: mergeJson(currentAsset?.payload, {
        processingError: message,
        retryScheduled: !exceeded,
        retryAttempt: nextRetries,
      }),
    });

    if (currentJob?.id) {
      await safeUpdate(supabaseAdmin, 'cid_processing_jobs', currentJob.id, {
        status: exceeded ? 'error' : 'queued',
        retries: nextRetries,
        error_message: message,
        failed_at: exceeded ? nowIso : null,
        updated_at: nowIso,
        payload: mergeJson(currentJob.payload, {
          last_failure_at: nowIso,
          last_failure_reason: message,
          retry_scheduled: !exceeded,
        }),
      });
    }
  };

  try {
    // 1. Obter Asset e Arquivo
    const { data: asset, error: assetError } = await supabaseAdmin.from('cid_assets').select('*').eq('id', assetId).single();
    if (assetError || !asset) throw new Error(`Asset ${assetId} não encontrado.`);
    currentAsset = asset;

    const { data: latestJob, error: latestJobError } = await supabaseAdmin
      .from('cid_processing_jobs')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestJobError) {
      throw new Error(`Falha ao carregar job do asset ${assetId}: ${latestJobError.message}`);
    }

    currentJob = latestJob || null;

    const { data: assetFile, error: fileError } = await supabaseAdmin.from('cid_asset_files').select('*').eq('asset_id', assetId).single();
    if (fileError || !assetFile) throw new Error(`Arquivo para o asset ${assetId} não encontrado.`);
    
    // Validação de tamanho
    if (assetFile.size_bytes > MAX_FILE_SIZE_BYTES) {
        throw new Error(`Arquivo excede o limite de ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB para processamento no back-end.`);
    }

    const nowIso = new Date().toISOString();

    if (currentJob?.status === 'queued') {
      const queuedForMinutes = minutesBetween(currentJob.created_at);
      if (queuedForMinutes !== null && queuedForMinutes > QUEUED_STALE_MINUTES) {
        const nextRetries = Number(currentJob.retries || 0) + 1;
        const maxRetries = Number(currentJob.max_retries || 3);
        if (nextRetries > maxRetries) {
          throw new Error(`Job excedeu max_retries após ficar preso em queued por ${Math.round(queuedForMinutes)} min.`);
        }

        await safeUpdate(supabaseAdmin, 'cid_processing_jobs', currentJob.id, {
          retries: nextRetries,
          error_message: `Queue guard: job estava em queued por ${Math.round(queuedForMinutes)} min. Retomado automaticamente.`,
          updated_at: nowIso,
          payload: mergeJson(currentJob.payload, {
            queue_guard_recovered_at: nowIso,
            queue_guard_type: 'stale_queued_recovered',
            queue_guard_minutes: Math.round(queuedForMinutes),
          }),
        });
        currentJob.retries = nextRetries;
      }
    }

    if (currentJob && ACTIVE_JOB_STATUSES.includes(String(currentJob.status || '').toLowerCase())) {
      const referenceTime = currentJob.started_at || currentJob.updated_at || currentJob.created_at;
      const runningForMinutes = minutesBetween(referenceTime);
      if (runningForMinutes !== null && runningForMinutes > ORPHAN_JOB_MINUTES) {
        const nextRetries = Number(currentJob.retries || 0) + 1;
        const maxRetries = Number(currentJob.max_retries || 3);
        if (nextRetries > maxRetries) {
          throw new Error(`Job órfão excedeu max_retries após ${Math.round(runningForMinutes)} min sem avanço.`);
        }

        await safeUpdate(supabaseAdmin, 'cid_processing_jobs', currentJob.id, {
          status: 'queued',
          retries: nextRetries,
          error_message: `Queue guard: job órfão detectado (${Math.round(runningForMinutes)} min sem avanço).`,
          updated_at: nowIso,
          payload: mergeJson(currentJob.payload, {
            queue_guard_orphan_recovered_at: nowIso,
            queue_guard_type: 'orphan_recovered',
            queue_guard_minutes: Math.round(runningForMinutes),
          }),
        });
        currentJob.status = 'queued';
        currentJob.retries = nextRetries;
      }
    }

    await safeUpdate(supabaseAdmin, 'cid_assets', assetId, {
      status: 'processing',
      processing_started_at: asset.processing_started_at || nowIso,
      updated_at: nowIso,
      payload: mergeJson(asset.payload, { processor_heartbeat_at: nowIso }),
    });

    if (currentJob?.id) {
      await safeUpdate(supabaseAdmin, 'cid_processing_jobs', currentJob.id, {
        status: 'processing',
        started_at: currentJob.started_at || nowIso,
        updated_at: nowIso,
        error_message: null,
        payload: mergeJson(currentJob.payload, {
          processor_heartbeat_at: nowIso,
          lock_owner: 'cid-processor-netlify',
        }),
      });
    }

    const jobId = currentJob?.id || null;

    // 2. Download do Arquivo (Apenas se necessário)
    // Se a ação for apenas armazenar, não precisamos baixar o arquivo nem extrair texto.
    if (asset.desired_action === 'store_only') {
        const finalStatus = 'completed';
        await safeUpdate(supabaseAdmin, 'cid_assets', assetId, { status: finalStatus, progress_pct: 100, completed_at: new Date().toISOString(), payload: mergeJson(asset.payload, { processor_heartbeat_at: new Date().toISOString() }) });
        if (jobId) await safeUpdate(supabaseAdmin, 'cid_processing_jobs', jobId, { status: finalStatus, progress_pct: 100, completed_at: new Date().toISOString(), payload: mergeJson(currentJob?.payload, { processor_heartbeat_at: new Date().toISOString() }) });
        
        console.log(`[CID Processor] Sucesso (Armazenado apenas) para o assetId: ${assetId}`);
        return json(200, { ok: true, message: `Asset ${assetId} stored successfully.` });
    }

    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage.from(assetFile.bucket).download(assetFile.path);
    if (downloadError) throw new Error(`Falha no download do arquivo: ${downloadError.message}`);

    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

    // 3. Extração de Texto / Transcrição
    let sourceText = '';
    let extractionMetadata = {
      extractor_used: 'not_executed',
      chars_extracted: 0,
      extraction_confidence: 0,
      ocr_used: false,
    };
    const canTranscribe = asset.desired_action === 'store_transcribe' || asset.desired_action === 'store_transcribe_summarize';

    if (canTranscribe && (asset.material_type === 'audio' || asset.material_type === 'video')) {
        await safeUpdate(supabaseAdmin, 'cid_assets', assetId, { status: 'transcribing' });
        if (jobId) await safeUpdate(supabaseAdmin, 'cid_processing_jobs', jobId, { status: 'transcribing' });
        sourceText = normalizeExtractedText(await transcribeMedia(fileBuffer, assetFile.mime_type));
        extractionMetadata = {
          extractor_used: 'gemini_transcription',
          chars_extracted: sourceText.length,
          extraction_confidence: sourceText ? 0.8 : 0,
          ocr_used: false,
        };
        if (sourceText) {
             await upsertOutput(supabaseAdmin, { asset_id: assetId, job_id: jobId, workspace_id: asset.workspace_id, output_type: 'transcription', content_text: sourceText, language: asset.language, payload: extractionMetadata });
        }
    } else {
        const extractionResult = await extractDocumentText({ materialType: asset.material_type, mimeType: assetFile.mime_type, fileBuffer });
        sourceText = extractionResult.text;
        extractionMetadata = extractionResult.metadata;

        if (sourceText) {
          await upsertOutput(supabaseAdmin, {
            asset_id: assetId,
            job_id: jobId,
            workspace_id: asset.workspace_id,
            output_type: 'extracted_text',
            content_text: sourceText,
            language: asset.language,
            payload: extractionMetadata,
          });
        }
    }
    
    // 4. Fragmentação (Chunks)
    await safeUpdate(supabaseAdmin, 'cid_assets', assetId, { status: 'fragmenting' });
    if (jobId) await safeUpdate(supabaseAdmin, 'cid_processing_jobs', jobId, { status: 'fragmenting' });

    await supabaseAdmin.from('cid_chunks').delete().eq('asset_id', assetId);

    const chunkTexts = splitChunks(sourceText);
    const totalParts = chunkTexts.length;
    
    for (let i = 0; i < totalParts; i++) {
        await supabaseAdmin.from('cid_chunks').insert({
            asset_id: assetId,
            job_id: jobId,
            workspace_id: asset.workspace_id,
            chunk_index: i + 1,
            text_content: chunkTexts[i],
            status: 'completed'
        });
    }
    await safeUpdate(supabaseAdmin, 'cid_assets', assetId, { total_parts: totalParts, completed_parts: totalParts, pending_parts: 0, progress_pct: 80 });

    // 5. Geração de Resumos
    const canSummarize = asset.desired_action === 'store_summarize' || asset.desired_action === 'store_transcribe_summarize' || asset.desired_action === 'store_consolidate';
    let summaryError = null;
    if (canSummarize && sourceText) {
        await safeUpdate(supabaseAdmin, 'cid_assets', assetId, { status: 'summarizing' });
        if (jobId) await safeUpdate(supabaseAdmin, 'cid_processing_jobs', jobId, { status: 'summarizing' });

        try {
          const shortSummary = await summarize(sourceText, 'short');
          if (shortSummary) {
            await upsertOutput(supabaseAdmin, {
              asset_id: assetId,
              job_id: jobId,
              workspace_id: asset.workspace_id,
              output_type: 'summary_short',
              content_text: shortSummary,
              language: asset.language,
              payload: {
                summarizer: 'gemini-2.5-flash',
                timeout_ms: SUMMARY_TIMEOUT_MS,
                source_chars: sourceText.length,
              },
            });
          }
        } catch (error) {
          summaryError = `Resumo falhou: ${String(error?.message || 'erro desconhecido')}`;
          console.warn('[CID Processor] Falha no resumo Gemini:', error?.message || error);
        }
    }

    // 6. Finalização
    const hasSourceWarning = !sourceText;
    const hasSummaryWarning = Boolean(summaryError);
    const finalStatus = hasSourceWarning || hasSummaryWarning ? 'completed_warning' : 'completed';
    const finalMessage = hasSourceWarning
      ? 'Não foi possível extrair texto ou transcrever o conteúdo para processamento completo.'
      : summaryError;

    await safeUpdate(supabaseAdmin, 'cid_assets', assetId, {
      status: finalStatus,
      progress_pct: 100,
      completed_at: new Date().toISOString(),
      payload: mergeJson(asset.payload, {
        processingWarning: finalMessage,
        extraction: extractionMetadata,
        processor_heartbeat_at: new Date().toISOString(),
      }),
    });

    if (jobId) {
      await safeUpdate(supabaseAdmin, 'cid_processing_jobs', jobId, {
        status: finalStatus,
        error_message: finalMessage,
        progress_pct: 100,
        completed_at: new Date().toISOString(),
        payload: mergeJson(currentJob?.payload, {
          extraction: extractionMetadata,
          processor_heartbeat_at: new Date().toISOString(),
        }),
      });
    }

    console.log(`[CID Processor] Sucesso para o assetId: ${assetId}`);
    return json(200, {
      ok: true,
      message: `Asset ${assetId} processed successfully.`,
      extraction: extractionMetadata,
      summaryWarning: summaryError,
    });

  } catch (error) {
    await failJob(error.message);
    return json(500, { ok: false, error: error.message || 'Internal Server Error' });
  }
}
