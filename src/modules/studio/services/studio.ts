import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, db, orderBy } from '../../../../services/supabase';
import { uploadBlobToSupabaseStorage, downloadBlobFromSupabaseStorage, triggerBlobDownload } from '../../../../services/storage';
import { transcribeMediaBlob } from '../../../../services/gemini';

const makeLocalId = (prefix: string) => `${prefix}_local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const isMissingTableError = (error: any, table: string) => {
  const msg = String(error?.message || error?.details?.message || '').toLowerCase();
  return msg.includes(`could not find the table 'public.${table}'`) || msg.includes(`table 'public.${table}'`);
};

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
  payload?: Record<string, any>;
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
  payload?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type StudioCaptureCamera = {
  cameraId: string;
  deviceId: string;
  label: string;
  orderIndex: number;
  width?: number;
  height?: number;
  fps?: number;
  status?: 'ready' | 'recording' | 'error' | 'offline';
};

export type StudioCameraFile = {
  id?: string;
  workspaceId: string;
  sessionId: string;
  cameraId: string;
  deviceId?: string;
  storagePath: string;
  mimeType: string;
  durationSeconds: number;
  status: 'uploaded' | 'error';
  errorMessage?: string;
  payload?: Record<string, any>;
};

export type StudioAudioTrack = {
  id?: string;
  workspaceId: string;
  sessionId: string;
  trackRole: 'master' | 'mic_headset' | 'mic_room' | 'system' | 'custom';
  sourceLabel?: string;
  deviceId?: string;
  storagePath: string;
  mimeType: string;
  durationSeconds: number;
  payload?: Record<string, any>;
};

const studioFallbackStore = {
  sessions: new Map<string, StudioSession>(),
  chunks: new Map<string, StudioChunk>(),
  sessionSubscribers: new Set<(workspaceId: string) => void>(),
  chunkSubscribers: new Set<(sessionId: string) => void>(),
  /** Timestamp da última limpeza para evitar execução frequente */
  lastCleanup: 0
};

/**
 * Limpa sessões e chunks antigos do fallback store (mais de 24h).
 * Chamado sob demanda para evitar memory leak em uso prolongado.
 */
const cleanupFallbackStore = () => {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // Só executa uma vez a cada 6 horas no máximo
  if (now - studioFallbackStore.lastCleanup < 6 * 60 * 60 * 1000) return;
  studioFallbackStore.lastCleanup = now;

  let sessionsRemoved = 0;
  studioFallbackStore.sessions.forEach((session, id) => {
    if (now - session.createdAt.getTime() > ONE_DAY_MS) {
      studioFallbackStore.sessions.delete(id);
      sessionsRemoved++;
    }
  });

  let chunksRemoved = 0;
  studioFallbackStore.chunks.forEach((chunk, id) => {
    if (now - chunk.createdAt.getTime() > ONE_DAY_MS) {
      studioFallbackStore.chunks.delete(id);
      chunksRemoved++;
    }
  });

  if (sessionsRemoved > 0 || chunksRemoved > 0) {
    console.info(`[Studio] cleanupFallbackStore: removidas ${sessionsRemoved} sessões e ${chunksRemoved} chunks antigos.`);
  }
};

const notifySessionSubscribers = (workspaceId: string) => {
  studioFallbackStore.sessionSubscribers.forEach((cb) => cb(workspaceId));
};

const notifyChunkSubscribers = (sessionId: string) => {
  studioFallbackStore.chunkSubscribers.forEach((cb) => cb(sessionId));
};

const getLocalSessionsByWorkspace = (workspaceId: string) => {
  return Array.from(studioFallbackStore.sessions.values())
    .filter((s) => s.workspaceId === workspaceId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const getLocalChunksBySession = (sessionId: string) => {
  return Array.from(studioFallbackStore.chunks.values())
    .filter((c) => c.sessionId === sessionId)
    .sort((a, b) => a.chunkIndex - b.chunkIndex);
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
  payload?: Record<string, any>;
}) => {
  const sessionData = {
    workspaceId: params.workspaceId,
    title: params.title || 'Sessão de Studio',
    chunkIntervalMin: params.chunkIntervalMin || 5,
    captureMode: params.captureMode || 'audio_video',
    source: params.source || 'live',
    status: params.source === 'upload' ? 'processing' : 'recording',
    totalDurationSeconds: 0,
    payload: params.payload || {}
  };

  try {
    const newDoc = await addDoc(collection(db, 'studio_sessions'), sessionData);
    return newDoc.id;
  } catch (error: any) {
    if (!isMissingTableError(error, 'studio_sessions')) throw error;

    const id = makeLocalId('studio_session');
    const now = new Date();
    const localSession: StudioSession = {
      id,
      workspaceId: params.workspaceId,
      title: sessionData.title,
      captureMode: sessionData.captureMode as StudioSession['captureMode'],
      source: sessionData.source as StudioSession['source'],
      chunkIntervalMin: sessionData.chunkIntervalMin,
      status: sessionData.status as StudioSession['status'],
      totalDurationSeconds: 0,
      payload: sessionData.payload,
      createdAt: now,
      updatedAt: now
    };
    studioFallbackStore.sessions.set(id, localSession);
    notifySessionSubscribers(params.workspaceId);
    return id;
  }
};

export const updateStudioSession = async (
  sessionId: string,
  updates: Partial<Omit<StudioSession, 'id' | 'createdAt' | 'updatedAt' | 'workspaceId'>>
) => {
  try {
    await updateDoc(doc(db, 'studio_sessions', sessionId), updates);
  } catch (error: any) {
    if (!isMissingTableError(error, 'studio_sessions')) throw error;

    const found = studioFallbackStore.sessions.get(sessionId);
    if (!found) return;
    const next: StudioSession = {
      ...found,
      ...updates,
      updatedAt: new Date()
    } as StudioSession;
    studioFallbackStore.sessions.set(sessionId, next);
    notifySessionSubscribers(next.workspaceId);
  }
};

export const subscribeToStudioSessions = (
  workspaceId: string,
  onUpdate: (sessions: StudioSession[]) => void
) => {
  const emitLocal = () => onUpdate(getLocalSessionsByWorkspace(workspaceId));

  const q = query(
    collection(db, 'studio_sessions'),
    where('workspaceId', '==', workspaceId)
  );

  const unsubscribeRemote = onSnapshot(
    q,
    (snapshot) => {
      const sessions = snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id })) as StudioSession[];
      sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onUpdate(sessions);
    },
    (error) => {
      if (isMissingTableError(error, 'studio_sessions')) {
        emitLocal();
      } else {
        console.error('[Studio] erro ao assinar sessões:', error);
      }
    }
  );

  const localListener = (targetWorkspaceId: string) => {
    if (targetWorkspaceId !== workspaceId) return;
    emitLocal();
  };

  studioFallbackStore.sessionSubscribers.add(localListener);
  emitLocal();

  // Limpeza periódica do fallback store ao assinar
  cleanupFallbackStore();

  return () => {
    unsubscribeRemote();
    studioFallbackStore.sessionSubscribers.delete(localListener);
  };
};

// ==========================================
// CHUNK MANAGEMENT & PIPELINE
// ==========================================

export const createStudioChunk = async (params: {
  sessionId: string;
  workspaceId: string;
  chunkIndex: number;
  startedAt: Date;
  payload?: Record<string, any>;
}) => {
  const chunkData = {
    sessionId: params.sessionId,
    workspaceId: params.workspaceId,
    chunkIndex: params.chunkIndex,
    status: 'pending',
    startedAt: params.startedAt,
    durationSeconds: 0,
    payload: params.payload || {}
  };

  try {
    const newDoc = await addDoc(collection(db, 'studio_chunks'), chunkData);
    return newDoc.id;
  } catch (error: any) {
    if (!isMissingTableError(error, 'studio_chunks')) throw error;

    const id = makeLocalId('studio_chunk');
    const now = new Date();
    const localChunk: StudioChunk = {
      id,
      sessionId: params.sessionId,
      workspaceId: params.workspaceId,
      chunkIndex: params.chunkIndex,
      status: 'pending',
      durationSeconds: 0,
      startedAt: params.startedAt,
      payload: params.payload || {},
      createdAt: now,
      updatedAt: now
    };
    studioFallbackStore.chunks.set(id, localChunk);
    notifyChunkSubscribers(params.sessionId);
    return id;
  }
};

export const updateStudioChunk = async (
  chunkId: string,
  updates: Partial<Omit<StudioChunk, 'id' | 'createdAt' | 'updatedAt' | 'workspaceId' | 'sessionId'>>
) => {
  try {
    await updateDoc(doc(db, 'studio_chunks', chunkId), updates);
  } catch (error: any) {
    if (!isMissingTableError(error, 'studio_chunks')) throw error;

    const found = studioFallbackStore.chunks.get(chunkId);
    if (!found) return;
    const next: StudioChunk = {
      ...found,
      ...updates,
      updatedAt: new Date()
    } as StudioChunk;
    studioFallbackStore.chunks.set(chunkId, next);
    notifyChunkSubscribers(next.sessionId);
  }
};

export const subscribeToStudioChunks = (
  sessionId: string,
  onUpdate: (chunks: StudioChunk[]) => void
) => {
  const emitLocal = () => onUpdate(getLocalChunksBySession(sessionId));

  const q = query(
    collection(db, 'studio_chunks'),
    where('sessionId', '==', sessionId)
  );

  const unsubscribeRemote = onSnapshot(
    q,
    (snapshot) => {
      const chunks = snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id })) as StudioChunk[];
      chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
      onUpdate(chunks);
    },
    (error) => {
      if (isMissingTableError(error, 'studio_chunks')) {
        emitLocal();
      } else {
        console.error('[Studio] erro ao assinar chunks:', error);
      }
    }
  );

  const localListener = (targetSessionId: string) => {
    if (targetSessionId !== sessionId) return;
    emitLocal();
  };

  studioFallbackStore.chunkSubscribers.add(localListener);
  emitLocal();

  // Limpeza periódica do fallback store ao assinar chunks
  cleanupFallbackStore();

  return () => {
    unsubscribeRemote();
    studioFallbackStore.chunkSubscribers.delete(localListener);
  };
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

const appendToSessionPayloadArray = async (sessionId: string, key: string, item: Record<string, any>) => {
  try {
    // 1. Buscar payload atual para fazer merge (evita sobrescrever dados de outras chaves)
    let existingPayload: Record<string, any> = {};

    try {
      const q = query(
        collection(db, 'studio_sessions'),
        where('id', '==', sessionId)
      );
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        existingPayload = snapshot.docs[0].data()?.payload || {};
      }
    } catch {
      // Fallback: tentar do store local
      const localSession = studioFallbackStore.sessions.get(sessionId);
      if (localSession?.payload) {
        existingPayload = localSession.payload;
      }
    }

    // 2. Fazer merge: preserva chaves existentes, adiciona novo item ao array
    const currentArray = Array.isArray(existingPayload[key]) ? existingPayload[key] : [];

    await updateStudioSession(sessionId, {
      payload: {
        ...existingPayload,
        [key]: [...currentArray, item]
      }
    });
  } catch {
    // fallback best-effort; sem impacto crítico no fluxo principal
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
  cameraId?: string;
  deviceId?: string;
}) => {
  try {
    await saveCameraFilePipeline({
      sessionId: params.sessionId,
      workspaceId: params.workspaceId,
      cameraId: params.cameraId || 'legacy-camera',
      deviceId: params.deviceId || 'legacy-device',
      videoBlob: params.videoBlob,
      durationSeconds: 0
    });
  } catch (error) {
    console.error('Falha ao salvar o vídeo bruto da sessão:', error);
  }
};

export const registerSessionCameras = async (params: {
  sessionId: string;
  workspaceId: string;
  cameras: StudioCaptureCamera[];
}) => {
  const table = collection(db, 'studio_session_cameras');
  for (const camera of params.cameras) {
    const payload = {
      sessionId: params.sessionId,
      workspaceId: params.workspaceId,
      cameraId: camera.cameraId,
      deviceId: camera.deviceId,
      label: camera.label,
      orderIndex: camera.orderIndex,
      width: camera.width,
      height: camera.height,
      fps: camera.fps,
      status: camera.status || 'ready',
      payload: {
        version: 1
      }
    };

    try {
      await addDoc(table, payload);
    } catch (error) {
      console.warn('[Studio] Tabela studio_session_cameras indisponível. Salvando no payload da sessão.', error);
      await appendToSessionPayloadArray(params.sessionId, 'sessionCameras', payload);
    }
  }
};

export const saveCameraFilePipeline = async (params: {
  sessionId: string;
  workspaceId: string;
  cameraId: string;
  deviceId?: string;
  videoBlob: Blob;
  durationSeconds: number;
}) => {
  const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
  const safeCameraId = params.cameraId.replace(/[^a-zA-Z0-9.-]/g, '');
  const fileName = `camera_${safeCameraId}_${Date.now()}.webm`;
  const storagePath = `${params.workspaceId}/${safeSessionId}/cameras/${safeCameraId}/${fileName}`;

  await uploadBlobToSupabaseStorage({
    bucket: 'studio',
    path: storagePath,
    blob: params.videoBlob,
    mimeType: params.videoBlob.type || 'video/webm'
  });

  const filePayload: StudioCameraFile = {
    workspaceId: params.workspaceId,
    sessionId: params.sessionId,
    cameraId: params.cameraId,
    deviceId: params.deviceId,
    storagePath,
    mimeType: params.videoBlob.type || 'video/webm',
    durationSeconds: params.durationSeconds,
    status: 'uploaded',
    payload: {
      version: 1
    }
  };

  try {
    await addDoc(collection(db, 'studio_camera_files'), filePayload);
  } catch (error) {
    console.warn('[Studio] Tabela studio_camera_files indisponível. Salvando no payload da sessão.', error);
    await appendToSessionPayloadArray(params.sessionId, 'cameraFiles', filePayload as any);
  }

  await updateStudioSession(params.sessionId, {
    rawVideoPath: storagePath
  });

  return storagePath;
};

export const saveMasterAudioPipeline = async (params: {
  sessionId: string;
  workspaceId: string;
  audioBlob: Blob;
  durationSeconds: number;
}) => {
  const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
  const fileName = `master_audio_${safeSessionId}_${Date.now()}.webm`;
  const storagePath = `${params.workspaceId}/${safeSessionId}/audio/${fileName}`;

  await uploadBlobToSupabaseStorage({
    bucket: 'studio',
    path: storagePath,
    blob: params.audioBlob,
    mimeType: params.audioBlob.type || 'audio/webm'
  });

  const trackPayload: StudioAudioTrack = {
    workspaceId: params.workspaceId,
    sessionId: params.sessionId,
    trackRole: 'master',
    storagePath,
    mimeType: params.audioBlob.type || 'audio/webm',
    durationSeconds: params.durationSeconds,
    payload: {
      version: 1
    }
  };

  try {
    await addDoc(collection(db, 'studio_audio_tracks'), trackPayload);
  } catch (error) {
    console.warn('[Studio] Tabela studio_audio_tracks indisponível. Salvando no payload da sessão.', error);
    await appendToSessionPayloadArray(params.sessionId, 'audioTracks', trackPayload as any);
  }
return storagePath;
};

/**
* Salva uma trilha de áudio individual (multitrack) em arquivo isolado no Supabase Storage.
* Cada fonte de áudio (headset, sala, sistema) tem seu próprio arquivo para isolamento de falhas.
* O campo `trackRole` identifica a origem: 'mic_headset' | 'mic_room' | 'system' | 'custom'.
*/
export const saveAudioTrackPipeline = async (params: {
sessionId: string;
workspaceId: string;
trackRole: StudioAudioTrack['trackRole'];
sourceLabel?: string;
deviceId?: string;
audioBlob: Blob;
durationSeconds: number;
}) => {
const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
const safeRole = params.trackRole.replace(/[^a-zA-Z0-9.-]/g, '');
const fileName = `track_${safeRole}_${Date.now()}.webm`;
const storagePath = `${params.workspaceId}/${safeSessionId}/audio/tracks/${safeRole}/${fileName}`;

await uploadBlobToSupabaseStorage({
  bucket: 'studio',
  path: storagePath,
  blob: params.audioBlob,
  mimeType: params.audioBlob.type || 'audio/webm'
});

const trackPayload: StudioAudioTrack = {
  workspaceId: params.workspaceId,
  sessionId: params.sessionId,
  trackRole: params.trackRole,
  sourceLabel: params.sourceLabel,
  deviceId: params.deviceId,
  storagePath,
  mimeType: params.audioBlob.type || 'audio/webm',
  durationSeconds: params.durationSeconds,
  payload: {
    version: 2,
    multiTrack: true
  }
};

try {
  await addDoc(collection(db, 'studio_audio_tracks'), trackPayload);
} catch (error) {
  console.warn('[Studio] Tabela studio_audio_tracks indisponível. Salvando no payload da sessão.', error);
  await appendToSessionPayloadArray(params.sessionId, 'audioTracks', trackPayload as any);
}

return storagePath;
};


/**
 * Extrai e valida os chunks completos (transcritos) de uma sessão.
 * Lógica compartilhada entre exportSessionTranscript e exportSessionTranscriptPlain.
 */
const fetchCompletedChunks = async (sessionId: string): Promise<StudioChunk[]> => {
  const chunks = await fetchChunksBySession(sessionId);
  const completedChunks = chunks.filter((c) => c.status === 'completed' && c.transcriptionText);

  if (completedChunks.length === 0) {
    throw new Error('Nenhum chunk transcrito disponível para exportação.');
  }

  return completedChunks;
};

/**
 * Retorna os chunks de uma sessão (local ou remoto).
 */
const fetchChunksBySession = async (sessionId: string): Promise<StudioChunk[]> => {
  try {
    const q = query(collection(db, 'studio_chunks'), where('sessionId', '==', sessionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id })) as StudioChunk[];
  } catch (error: any) {
    if (isMissingTableError(error, 'studio_chunks')) {
      return getLocalChunksBySession(sessionId);
    }
    console.error('[Studio] erro ao buscar chunks:', error);
    return [];
  }
};

/**
 * Exporta a transcrição completa de uma sessão como texto formatado (.md).
 * Consolida todos os chunks transcritos em um único documento.
 */
export const exportSessionTranscript = async (sessionId: string): Promise<string> => {
  const completedChunks = await fetchCompletedChunks(sessionId);

  let transcript = `# Transcrição de Sessão\n\n`;
  transcript += `**Sessão ID:** ${sessionId}\n`;
  transcript += `**Data de exportação:** ${new Date().toLocaleString('pt-BR')}\n`;
  transcript += `**Total de blocos transcritos:** ${completedChunks.length}\n`;
  transcript += `---\n\n`;

  for (const chunk of completedChunks) {
    const startedAt = chunk.startedAt
      ? new Date(chunk.startedAt).toLocaleTimeString('pt-BR')
      : '--:--:--';
    transcript += `## Bloco #${chunk.chunkIndex} (${startedAt})\n\n`;
    transcript += `${chunk.transcriptionText}\n\n`;
    transcript += `---\n\n`;
  }

  return transcript;
};

/**
 * Exporta a transcrição como texto plano (.txt).
 */
export const exportSessionTranscriptPlain = async (sessionId: string): Promise<string> => {
  const completedChunks = await fetchCompletedChunks(sessionId);

  let transcript = `TRANSCRIÇÃO DE SESSÃO\n`;
  transcript += `Sessão: ${sessionId}\n`;
  transcript += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;
  transcript += `${'='.repeat(60)}\n\n`;

  for (const chunk of completedChunks) {
    const startedAt = chunk.startedAt
      ? new Date(chunk.startedAt).toLocaleTimeString('pt-BR')
      : '--:--:--';
    transcript += `[Bloco #${chunk.chunkIndex} - ${startedAt}]\n`;
    transcript += `${chunk.transcriptionText}\n\n`;
  }

  return transcript;
};

/**
 * Faz download do áudio master de uma sessão e dispara o download no navegador.
 */
/**
 * Busca o áudio master de uma sessão na tabela `studio_audio_tracks`.
 * Fallback: busca o primeiro chunk com `audioPath` (sessões legadas).
 */
const fetchMasterAudioPath = async (sessionId: string): Promise<string | null> => {
  try {
    const q = query(
      collection(db, 'studio_audio_tracks'),
      where('sessionId', '==', sessionId),
      where('trackRole', '==', 'master'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data().storagePath as string;
    }
  } catch {
    // Tabela pode não existir — fallback para chunks
  }

  // Fallback legado: buscar o primeiro chunk com audioPath
  try {
    const chunks = await fetchChunksBySession(sessionId);
    const chunkWithAudio = chunks.find((c) => c.audioPath);
    return chunkWithAudio?.audioPath || null;
  } catch {
    return null;
  }
};

export const downloadSessionMasterAudio = async (
  sessionId: string,
  workspaceId: string,
  sessionTitle?: string
) => {
  const audioPath = await fetchMasterAudioPath(sessionId);
  if (!audioPath) {
    throw new Error('Nenhum áudio master disponível para download nesta sessão.');
  }

  const blob = await downloadBlobFromSupabaseStorage({
    bucket: 'studio',
    path: audioPath
  });

  const safeTitle = (sessionTitle || `sessao-${sessionId}`)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .toLowerCase();

  triggerBlobDownload(blob, `studio_audio_${safeTitle}.webm`);
};

/**
 * Faz download do arquivo de vídeo de uma câmera específica e dispara o download no navegador.
 */
export const downloadSessionCameraVideo = async (
  sessionId: string,
  workspaceId: string,
  cameraLabel: string,
  storagePath: string
) => {
  if (!storagePath) {
    throw new Error('Caminho do arquivo de vídeo não encontrado.');
  }

  const blob = await downloadBlobFromSupabaseStorage({
    bucket: 'studio',
    path: storagePath
  });

  const safeLabel = cameraLabel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .toLowerCase();

  triggerBlobDownload(blob, `studio_camera_${safeLabel}_${Date.now()}.webm`);
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
  // Validação: fileBlob.type vazio causa erro no upload e transcrição
  if (!params.fileBlob.type) {
    console.warn('[Studio] fileBlob.type vazio — inferindo application/octet-stream');
  }

  try {
    await updateStudioSession(params.sessionId, { status: 'processing' });

    // 1. Upload
    const safeSessionId = params.sessionId.replace(/[^a-zA-Z0-9.-]/g, '');
    const storagePath = `${params.workspaceId}/${safeSessionId}/${params.fileName}`;
    const mimeType = params.fileBlob.type || 'application/octet-stream';

    await uploadBlobToSupabaseStorage({
      bucket: 'studio',
      path: storagePath,
      blob: params.fileBlob,
      mimeType
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

// ==========================================
// PLAYBACK — busca vídeos e áudio para reprodução
// ==========================================

/**
 * Busca os arquivos de câmera (vídeos) de uma sessão para reprodução.
 * Tenta por ordem:
 * 1. Tabela `studio_camera_files`
 * 2. Payload da sessão (`payload.cameraFiles`)
 * 3. `rawVideoPath` da sessão (legado — última câmera)
 */
export const fetchSessionCameraFiles = async (
  sessionId: string,
  session?: StudioSession | null
): Promise<StudioCameraFile[]> => {
  // 1. Tentar tabela dedicada
  try {
    const q = query(
      collection(db, 'studio_camera_files'),
      where('sessionId', '==', sessionId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return snapshot.docs.map((d: any) => ({ ...d.data(), id: d.id })) as StudioCameraFile[];
    }
  } catch {
    // tabela pode não existir
  }

  // 2. Fallback: payload da sessão
  if (session?.payload?.cameraFiles && Array.isArray(session.payload.cameraFiles)) {
    return session.payload.cameraFiles as StudioCameraFile[];
  }

  // 3. Fallback legado: rawVideoPath
  if (session?.rawVideoPath) {
    return [{
      workspaceId: session.workspaceId,
      sessionId,
      cameraId: 'legacy',
      storagePath: session.rawVideoPath,
      mimeType: 'video/webm',
      durationSeconds: session.totalDurationSeconds || 0,
      status: 'uploaded'
    }];
  }

  return [];
};

/**
 * Busca o áudio master de uma sessão para reprodução.
 */
export const fetchSessionMasterAudio = async (
  sessionId: string,
  session?: StudioSession | null
): Promise<StudioAudioTrack | null> => {
  // 1. Tentar tabela dedicada
  try {
    const q = query(
      collection(db, 'studio_audio_tracks'),
      where('sessionId', '==', sessionId),
      where('trackRole', '==', 'master')
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as StudioAudioTrack;
    }
  } catch {
    // tabela pode não existir
  }

  // 2. Fallback: payload da sessão
  if (session?.payload?.audioTracks && Array.isArray(session.payload.audioTracks)) {
    const master = session.payload.audioTracks.find((t: any) => t.trackRole === 'master');
    return master || null;
  }

  return null;
};
