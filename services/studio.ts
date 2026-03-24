import { addDoc, collection, doc, onSnapshot, query, updateDoc, where, getBasePollingMs, db } from './supabase';
import { uploadBlobToSupabaseStorage, getSupabasePublicUrl } from './storage';
import { transcribeMediaBlob } from './gemini';

export type StudioSession = {
  id: string;
  workspaceId: string;
  title: string;
  captureMode: 'audio_video' | 'audio_only';
  source: 'live' | 'upload';
  chunkIntervalMin: number;
  status: 'recording' | 'processing' | 'completed' | 'error';
  rawVideoPath?: string;
  totalDurationSeconds: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StudioChunk = {
  id: string;
  sessionId: string;
  workspaceId: string;
  chunkIndex: number;
  status: 'pending' | 'transcribing' | 'completed' | 'error';
  audioPath?: string;
  durationSeconds: number;
  transcriptionText?: string;
  cidAssetId?: string;
  startedAt?: Date;
  endedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
};

// ==========================================
// SESSION MANAGEMENT
// ==========================================

export const createStudioSession = async (params: {
  workspaceId: string;
  title: string;
  chunkIntervalMin: number;
  captureMode?: 'audio_video' | 'audio_only';
  source?: 'live' | 'upload';
}) => {
  const sessionData = {
    workspaceId: params.workspaceId,
        title: params.title || 'Sessão de Studio',
    chunkIntervalMin: params.chunkIntervalMin || 5,
    captureMode: params.captureMode || 'audio_video',
    source: params.source || 'live',
    status: params.source === 'upload' ? 'processing' : 'recording',
    totalDurationSeconds: 0
  };

  const newDoc = await addDoc(collection(db, 'studio_sessions'), sessionData);
  return newDoc.id;
};

export const updateStudioSession = async (
  sessionId: string,
  updates: Partial<Omit<StudioSession, 'id' | 'createdAt' | 'updatedAt' | 'workspaceId'>>
) => {
  await updateDoc(doc(db, 'studio_sessions', sessionId), updates);
};

export const subscribeToStudioSessions = (
  workspaceId: string,
  onUpdate: (sessions: StudioSession[]) => void
) => {
  const q = query(
    collection(db, 'studio_sessions'),
    where('workspaceId', '==', workspaceId)
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id })) as StudioSession[];
    sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    onUpdate(sessions);
  });
};

// ==========================================
// CHUNK MANAGEMENT & PIPELINE
// ==========================================

export const createStudioChunk = async (params: {
  sessionId: string;
  workspaceId: string;
  chunkIndex: number;
  startedAt: Date;
}) => {
  const chunkData = {
    sessionId: params.sessionId,
    workspaceId: params.workspaceId,
    chunkIndex: params.chunkIndex,
    status: 'pending',
    startedAt: params.startedAt,
    durationSeconds: 0
  };

  const newDoc = await addDoc(collection(db, 'studio_chunks'), chunkData);
  return newDoc.id;
};

export const updateStudioChunk = async (
  chunkId: string,
  updates: Partial<Omit<StudioChunk, 'id' | 'createdAt' | 'updatedAt' | 'workspaceId' | 'sessionId'>>
) => {
  await updateDoc(doc(db, 'studio_chunks', chunkId), updates);
};

export const subscribeToStudioChunks = (
  sessionId: string,
  onUpdate: (chunks: StudioChunk[]) => void
) => {
  const q = query(
    collection(db, 'studio_chunks'),
    where('sessionId', '==', sessionId)
  );

  return onSnapshot(q, (snapshot) => {
    const chunks = snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id })) as StudioChunk[];
    chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    onUpdate(chunks);
  });
};

/**
 * Pipeline principal de processamento de um Chunk.
 * 1. Faz upload do áudio para o Supabase Storage.
 * 2. Transcreve usando o Gemini (via aiProxy).
 * 3. Salva a transcrição no banco.
 * (Opcional) Envia para o CID se necessário no futuro, por enquanto salva local.
 */
export const processAudioChunkPipeline = async (params: {
  chunkId: string;
  workspaceId: string;
  sessionId: string;
  audioBlob: Blob;
  durationSeconds: number;
  endedAt: Date;
}) => {
  try {
    await updateStudioChunk(params.chunkId, {
      status: 'transcribing',
      endedAt: params.endedAt,
      durationSeconds: params.durationSeconds
    });

    // 1. Upload do áudio
    const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `chunk_${params.chunkId}_${Date.now()}.webm`;
    const storagePath = `${params.workspaceId}/${safeSessionId}/${fileName}`;

    await uploadBlobToSupabaseStorage({
      bucket: 'studio',
      path: storagePath,
      blob: params.audioBlob,
      mimeType: params.audioBlob.type || 'audio/webm'
    });

    // 2. Transcrição
    const transcription = await transcribeMediaBlob(params.audioBlob, params.audioBlob.type || 'audio/webm', fileName);

    // 3. Atualiza Chunk com Sucesso
    await updateStudioChunk(params.chunkId, {
      status: 'completed',
      audioPath: storagePath,
      transcriptionText: transcription || '[Sem áudio detectado ou falha na transcrição]'
    });

    // 4. Integração com CID (Mock para expansão futura)
    if (transcription) {
      await sendChunkToCID(params.workspaceId, params.chunkId, transcription);
    }

  } catch (error: any) {
    console.error(`Erro no processamento do chunk ${params.chunkId}:`, error);
    await updateStudioChunk(params.chunkId, {
      status: 'error',
      errorMessage: error.message || 'Erro desconhecido ao processar chunk'
    });
  }
};

/**
 * Envia o conteúdo transcrito do chunk para o CID
 * Transformando o áudio segmentado em um ativo de conhecimento consultável.
 */
export const sendChunkToCID = async (workspaceId: string, chunkId: string, text: string) => {
  try {
    console.log(`[Studio] Enviando transcrição do chunk ${chunkId} para o CID...`);
    
    const assetData = {
      workspaceId,
      title: `Transcrição Studio - Chunk ${chunkId.split('-')[0]}`,
      materialType: 'Audio',
      sourceKind: 'studio',
      sourceId: chunkId,
      status: 'Completed',
      isConsultable: true,
      desiredAction: 'Store + summarize',
      progressPct: 100
    };
    
    const newAsset = await addDoc(collection(db, 'cid_assets'), assetData);
    
    await addDoc(collection(db, 'cid_outputs'), {
      workspaceId,
      assetId: newAsset.id,
      outputType: 'Transcription',
      contentText: text,
      status: 'ready'
    });
    
    await updateStudioChunk(chunkId, { cidAssetId: newAsset.id });
    
    console.log(`[Studio] Transcrição integrada ao CID com sucesso (Asset ID: ${newAsset.id}).`);
  } catch (error) {
    console.error('Falha ao integrar com CID:', error);
  }
};

export const saveRawVideoPipeline = async (params: {
  sessionId: string;
  workspaceId: string;
  videoBlob: Blob;
}) => {
  try {
    const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `raw_video_${safeSessionId}_${Date.now()}.webm`;
    const storagePath = `${params.workspaceId}/${safeSessionId}/${fileName}`;

    await uploadBlobToSupabaseStorage({
      bucket: 'studio',
      path: storagePath,
      blob: params.videoBlob,
      mimeType: params.videoBlob.type || 'video/webm'
    });

    await updateStudioSession(params.sessionId, {
      rawVideoPath: storagePath
    });
  } catch (error) {
    console.error('Falha ao salvar o vídeo bruto da sessão:', error);
  }
};

/**
 * Pipeline para processar um arquivo completo (retroativo)
 * 1. Upload do arquivo bruto
 * 2. Transcrição completa via Gemini
 * 3. Criação de um chunk mestre para o histórico
 * 4. Integração com CID
 */
export const processFullFilePipeline = async (params: {
  sessionId: string;
  workspaceId: string;
  fileBlob: Blob;
  fileName: string;
}) => {
  try {
    await updateStudioSession(params.sessionId, { status: 'processing' });

    // 1. Upload
    const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
    const storagePath = `${params.workspaceId}/${safeSessionId}/${params.fileName}`;

    await uploadBlobToSupabaseStorage({
      bucket: 'studio',
      path: storagePath,
      blob: params.fileBlob,
      mimeType: params.fileBlob.type
    });

    await updateStudioSession(params.sessionId, { rawVideoPath: storagePath });

    // 2. Criar chunk mestre
    const chunkId = await createStudioChunk({
      sessionId: params.sessionId,
      workspaceId: params.workspaceId,
      chunkIndex: 1,
      startedAt: new Date()
    });

    await updateStudioChunk(chunkId, { status: 'transcribing' });

    // 3. Transcrever
    const transcription = await transcribeMediaBlob(params.fileBlob, params.fileBlob.type, params.fileName);

    // 4. Finalizar
    await updateStudioChunk(chunkId, {
      status: 'completed',
      audioPath: storagePath,
      transcriptionText: transcription || '[Processamento concluído sem texto extraído]',
      endedAt: new Date()
    });

    await updateStudioSession(params.sessionId, { status: 'completed' });

    if (transcription) {
      await sendChunkToCID(params.workspaceId, chunkId, transcription);
    }

  } catch (error: any) {
    console.error('Erro no processamento de arquivo completo:', error);
    await updateStudioSession(params.sessionId, { status: 'error' });
  }
};
