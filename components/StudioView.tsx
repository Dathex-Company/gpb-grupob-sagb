import React, { useEffect, useRef, useState } from 'react';
import { BackIcon, MicIcon, StopCircleIcon, CloudUploadIcon, FileTextIcon } from './Icon';
import {
  StudioSession,
  StudioChunk,
  createStudioSession,
  updateStudioSession,
  subscribeToStudioSessions,
  createStudioChunk,
  subscribeToStudioChunks,
  processAudioChunkPipeline,
  saveRawVideoPipeline,
  processFullFilePipeline
} from '../services/studio';
import { UserProfile } from '../types';

interface StudioViewProps {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  userProfile?: UserProfile | null;
  onBack?: () => void;
}

const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';

const fmtDuration = (seconds?: number | null) => {
  const total = Math.max(0, Math.round(Number(seconds || 0)));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const StudioView: React.FC<StudioViewProps> = ({
  workspaceId,
  ownerUserId,
  onBack
}) => {
  const scopedWorkspaceId = workspaceId || DEFAULT_WORKSPACE_ID;
  
  const [sessions, setSessions] = useState<StudioSession[]>([]);
  const [chunks, setChunks] = useState<StudioChunk[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'live' | 'upload'>('live');
  const [isRecording, setIsRecording] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  // Settings
  const [chunkIntervalMin, setChunkIntervalMin] = useState<number>(2);
  const [captureMode, setCaptureMode] = useState<'audio_video' | 'audio_only'>('audio_only');
  const [sessionTitle, setSessionTitle] = useState<string>(`Gravação de Áudio • ${new Date().toLocaleDateString('pt-BR')}`);
  
  // Real-time tracking
  const [sessionElapsedMs, setSessionElapsedMs] = useState(0);
  const [chunkElapsedMs, setChunkElapsedMs] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  
  const sessionStartedAtRef = useRef<number>(0);
  const chunkStartedAtRef = useRef<number>(0);
  const currentChunkIndexRef = useRef<number>(1);
  
  const chunkTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Sessions
  useEffect(() => {
    const unsubscribe = subscribeToStudioSessions(scopedWorkspaceId, (data) => {
      setSessions(data);
      const active = data.find(s => s.status === 'recording');
      if (active && !isRecording) {
        setActiveSessionId(active.id);
      }
    });
    return () => unsubscribe();
  }, [scopedWorkspaceId, isRecording]);

  // Load Chunks for active or selected session
  useEffect(() => {
    const targetId = activeSessionId || (sessions[0]?.id);
    if (targetId) {
      const unsub = subscribeToStudioChunks(targetId, setChunks);
      return () => unsub();
    }
  }, [activeSessionId, sessions]);

  // Handle timers for UI
  useEffect(() => {
    if (!isRecording) {
      setSessionElapsedMs(0);
      setChunkElapsedMs(0);
      return;
    }

    const updateTimers = () => {
      const now = Date.now();
      setSessionElapsedMs(now - sessionStartedAtRef.current);
      setChunkElapsedMs(now - chunkStartedAtRef.current);
    };

    elapsedTimerRef.current = window.setInterval(updateTimers, 1000);
    return () => {
      if (elapsedTimerRef.current) window.clearInterval(elapsedTimerRef.current);
    };
  }, [isRecording]);

  const requestStream = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Navegador não suporta captura de mídia.');
    }
    
    return await navigator.mediaDevices.getUserMedia({
      video: captureMode === 'audio_video' ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      audio: { echoCancellation: true, noiseSuppression: true }
    });
  };

  const startAudioChunkRecorder = async (sessionId: string) => {
    if (!streamRef.current) return;
    
    const chunkId = await createStudioChunk({
      sessionId,
      workspaceId: scopedWorkspaceId,
      chunkIndex: currentChunkIndexRef.current,
      startedAt: new Date()
    });
    
    chunkStartedAtRef.current = Date.now();
    
    const audioStream = new MediaStream(streamRef.current.getAudioTracks());
    const audioRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
    
    const parts: Blob[] = [];
    audioRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) parts.push(e.data);
    };
    
    audioRecorder.onstop = () => {
      const blob = new Blob(parts, { type: 'audio/webm' });
      const duration = Math.round((Date.now() - chunkStartedAtRef.current) / 1000);
      const endedAt = new Date();
      
      void processAudioChunkPipeline({
        chunkId,
        workspaceId: scopedWorkspaceId,
        sessionId,
        audioBlob: blob,
        durationSeconds: duration,
        endedAt
      });
      
      if (isRecording) {
        currentChunkIndexRef.current += 1;
        void startAudioChunkRecorder(sessionId);
      }
    };
    
    audioRecorderRef.current = audioRecorder;
    audioRecorder.start();
    
    chunkTimerRef.current = window.setTimeout(() => {
      if (audioRecorder.state === 'recording') {
        audioRecorder.stop();
      }
    }, chunkIntervalMin * 60 * 1000);
  };

  const startRecording = async () => {
    try {
      setIsBusy(true);
      setFeedback('Iniciando captura de áudio...');
      
      const stream = await requestStream();
      streamRef.current = stream;
      
      if (videoRef.current && captureMode === 'audio_video') {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
      
      const sessionId = await createStudioSession({
        workspaceId: scopedWorkspaceId,
        title: sessionTitle,
        chunkIntervalMin,
        captureMode
      });
      
      setActiveSessionId(sessionId);
      sessionStartedAtRef.current = Date.now();
      currentChunkIndexRef.current = 1;
      
      if (captureMode === 'audio_video') {
        const videoRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const videoParts: Blob[] = [];
        videoRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) videoParts.push(e.data); };
        videoRecorder.onstop = () => {
          const blob = new Blob(videoParts, { type: 'video/webm' });
          void saveRawVideoPipeline({ sessionId, workspaceId: scopedWorkspaceId, videoBlob: blob });
        };
        videoRecorderRef.current = videoRecorder;
        videoRecorder.start();
      }
      
      setIsRecording(true);
      await startAudioChunkRecorder(sessionId);
      setFeedback('Gravação em andamento...');
    } catch (error: any) {
      setFeedback(error.message || 'Falha ao iniciar.');
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    } finally {
      setIsBusy(false);
    }
  };

  const stopRecording = async () => {
    setIsBusy(true);
    setFeedback('Finalizando e salvando...');
    setIsRecording(false);
    
    if (chunkTimerRef.current) window.clearTimeout(chunkTimerRef.current);
    if (audioRecorderRef.current?.state === 'recording') audioRecorderRef.current.stop();
    if (videoRecorderRef.current?.state === 'recording') videoRecorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    
    if (activeSessionId) {
      const duration = Math.round((Date.now() - sessionStartedAtRef.current) / 1000);
      await updateStudioSession(activeSessionId, {
        status: 'completed',
        totalDurationSeconds: duration
      });
    }
    
    setActiveSessionId(null);
    setIsBusy(false);
    setFeedback('Sessão finalizada.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsBusy(true);
      setFeedback(`Enviando arquivo: ${file.name}...`);
      
      const sessionId = await createStudioSession({
        workspaceId: scopedWorkspaceId,
        title: `Processamento: ${file.name}`,
        chunkIntervalMin: 0, // Not used for full file
        captureMode: file.type.startsWith('video/') ? 'audio_video' : 'audio_only'
      });

      setActiveSessionId(sessionId);
      
      await processFullFilePipeline({
        sessionId,
        workspaceId: scopedWorkspaceId,
        fileBlob: file,
        fileName: file.name
      });

      setFeedback('Processamento concluído com sucesso.');
    } catch (error: any) {
      setFeedback(`Erro no upload: ${error.message}`);
    } finally {
      setIsBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 custom-scrollbar">
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        
        {/* HEADER */}
        <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              {onBack && (
                <button onClick={onBack} className="w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                  <BackIcon className="w-5 h-5" />
                </button>
              )}
              <div>
                <span className="text-[10px] uppercase tracking-[0.38em] font-black text-cyan-600 block mb-2">Studio v1</span>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Centro de Captura Inteligente</h1>
                <p className="text-slate-500 text-sm mt-2 max-w-xl">
                  Transforme fala em conhecimento organizado. Foco em áudio de alta fidelidade para transcrição via Gemini e integração nativa com o CID.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl self-start">
              <button 
                onClick={() => setActiveTab('live')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'live' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Captura ao Vivo
              </button>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Processar Arquivo
              </button>
            </div>
          </div>
        </header>

        {feedback && (
          <div className="px-5 py-3 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-800 text-sm font-bold animate-pulse">
            {feedback}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'live' ? (
              <>
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-slate-900">Monitor de Áudio</h2>
                    {isRecording && (
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-rose-500 text-sm font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                          AO VIVO
                        </span>
                        <span className="text-slate-600 font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg">
                          {fmtDuration(sessionElapsedMs / 1000)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative w-full aspect-video bg-slate-950 rounded-[24px] overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                    {captureMode === 'audio_video' ? (
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-slate-600">
                        <div className={`w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center ${isRecording ? 'text-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.2)]' : 'text-slate-700'}`}>
                          <MicIcon className={`w-10 h-10 ${isRecording ? 'animate-pulse' : ''}`} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest opacity-50">Capturando apenas áudio (Prioridade v1)</span>
                      </div>
                    )}
                    
                    {!isRecording && (
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
                        <button 
                          onClick={startRecording}
                          disabled={isBusy}
                          className="px-8 py-4 rounded-3xl bg-white text-slate-950 font-black shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50"
                        >
                          <MicIcon className="w-6 h-6" />
                          Iniciar Gravação
                        </button>
                      </div>
                    )}

                    {isRecording && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <button 
                          onClick={stopRecording}
                          className="px-8 py-4 rounded-3xl bg-rose-500 text-white font-black shadow-2xl flex items-center gap-3 hover:bg-rose-600 hover:scale-105 transition-all"
                        >
                          <StopCircleIcon className="w-6 h-6" />
                          Finalizar Sessão
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Título da Sessão
                      </label>
                      <input 
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                        disabled={isRecording}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Câmera</span>
                        <span className="text-sm font-bold text-slate-700">Habilitar Vídeo (Beta)</span>
                      </div>
                      <button 
                        onClick={() => setCaptureMode(captureMode === 'audio_only' ? 'audio_video' : 'audio_only')}
                        disabled={isRecording}
                        className={`w-12 h-6 rounded-full transition-colors relative ${captureMode === 'audio_video' ? 'bg-amber-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${captureMode === 'audio_video' ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Intervalo de Inteligência (Chunks)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 5].map(val => (
                          <button 
                            key={val}
                            onClick={() => setChunkIntervalMin(val)}
                            disabled={isRecording}
                            className={`py-3 rounded-xl text-xs font-black border transition-all ${chunkIntervalMin === val ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                          >
                            {val} Min
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      Recomendado: 2 minutos. O áudio é segmentado e enviado para o Gemini em tempo real sem interromper a captura principal.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <CloudUploadIcon className="w-10 h-10" />
                </div>
                <div className="max-w-md space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Processar Arquivo Gravado</h2>
                  <p className="text-slate-500 text-sm">
                    Suba um arquivo de áudio ou vídeo (mp3, wav, mp4, webm) para extração completa de transcrição e envio ao CID.
                  </p>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="audio/*,video/*"
                  onChange={handleFileUpload}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="px-10 py-4 rounded-3xl bg-slate-900 text-white font-black shadow-xl hover:bg-slate-800 hover:scale-105 transition-all disabled:opacity-50"
                >
                  Selecionar Arquivo
                </button>
                
                <div className="pt-6 grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                    <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Limite</span>
                    <span className="text-xs font-bold text-slate-700">Até 1 hora de áudio</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                    <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Velocidade</span>
                    <span className="text-xs font-bold text-slate-700">Processamento em nuvem</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: SESSIONS & CHUNKS */}
          <div className="space-y-6 flex flex-col h-full">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm flex-1 flex flex-col max-h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Linha do Tempo</h2>
                <span className="text-[10px] font-bold text-slate-400">{chunks.length} blocos</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {chunks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-2">
                    <FileTextIcon className="w-8 h-8 opacity-20" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Aguardando blocos...</span>
                  </div>
                ) : (
                  chunks.map(chunk => (
                    <div key={chunk.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-slate-400 text-[10px] uppercase">Bloco #{chunk.chunkIndex}</span>
                        <div className="flex items-center gap-2">
                          {chunk.cidAssetId && (
                            <span className="text-[9px] font-black text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">CID</span>
                          )}
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${
                            chunk.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            chunk.status === 'error' ? 'bg-rose-100 text-rose-700' :
                            chunk.status === 'transcribing' ? 'bg-cyan-100 text-cyan-700 animate-pulse' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {chunk.status}
                          </span>
                        </div>
                      </div>
                      
                      {chunk.transcriptionText ? (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                          {chunk.transcriptionText}
                        </p>
                      ) : (
                        <div className="space-y-1">
                          <div className="h-2 w-full bg-slate-200 rounded-full animate-pulse" />
                          <div className="h-2 w-2/3 bg-slate-200 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Sessões Recentes</h2>
              <div className="space-y-2">
                {sessions.slice(0, 4).map(session => (
                  <button 
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      activeSessionId === session.id 
                        ? 'bg-slate-950 text-white border-slate-950 shadow-lg scale-[1.02]' 
                        : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-black text-xs truncate mr-2">{session.title}</div>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        session.source === 'upload' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {session.source || 'live'}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between text-[10px] font-bold ${activeSessionId === session.id ? 'text-slate-400' : 'text-slate-400'}`}>
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {fmtDuration(session.totalDurationSeconds)}
                      </span>
                    </div>
                  </button>
                ))}
                {sessions.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center py-4 font-bold uppercase tracking-widest">Nenhuma sessão salva</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default StudioView;