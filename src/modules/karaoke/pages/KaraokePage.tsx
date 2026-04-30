import React, { useEffect, useMemo, useRef, useState } from 'react';

type LyricLine = {
  id: string;
  text: string;
  timeSec: number | null;
};

const parseLyrics = (raw: string): LyricLine[] => {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\]\s*(.*)$/);

      if (!match) {
        return {
          id: `line-${index}`,
          text: line,
          timeSec: null
        };
      }

      const mins = Number(match[1] || 0);
      const secs = Number(match[2] || 0);
      const cents = Number(match[3] || 0);
      const text = (match[4] || '').trim();

      return {
        id: `line-${index}`,
        text: text || '(sem texto)',
        timeSec: mins * 60 + secs + cents / 100
      };
    });
};

const fmtTime = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const KaraokePage: React.FC = () => {
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const linesContainerRef = useRef<HTMLDivElement | null>(null);

  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaName, setMediaName] = useState<string>('');
  const [mediaType, setMediaType] = useState<string>('');
  const [lyricsRaw, setLyricsRaw] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  const lyricLines = useMemo(() => parseLyrics(lyricsRaw), [lyricsRaw]);
  const hasTimedLyrics = lyricLines.some((line) => line.timeSec !== null);

  const activeLineId = useMemo(() => {
    if (!hasTimedLyrics) return null;

    let active: string | null = null;
    for (const line of lyricLines) {
      if (line.timeSec !== null && line.timeSec <= currentTime + 0.05) {
        active = line.id;
      }
    }
    return active;
  }, [currentTime, hasTimedLyrics, lyricLines]);

  useEffect(() => {
    if (!autoScroll || !activeLineId || !linesContainerRef.current) return;

    const el = linesContainerRef.current.querySelector(`[data-line-id="${activeLineId}"]`);
    if (el) {
      (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLineId, autoScroll]);

  const onSelectMedia = (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      setFileError('Arquivo inválido. Envie áudio ou vídeo.');
      return;
    }

    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }

    setFileError('');
    setMediaName(file.name);
    setMediaType(file.type);
    setMediaUrl(URL.createObjectURL(file));
    setCurrentTime(0);
  };

  const onUploadLyricsTxt = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    setLyricsRaw(text);
  };

  const clearAll = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl('');
    setMediaName('');
    setMediaType('');
    setLyricsRaw('');
    setCurrentTime(0);
    setFileError('');
  };

  const seekToLine = (line: LyricLine) => {
    if (!mediaRef.current || line.timeSec === null) return;
    mediaRef.current.currentTime = line.timeSec;
  };

  const isVideo = mediaType.startsWith('video/');

  return (
    <div className="flex-1 h-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      <header className="p-6 border-b border-slate-800 bg-slate-900/60">
        <h1 className="text-2xl font-black text-white">Karaokê SagB</h1>
        <p className="text-slate-400 text-sm mt-1">
          Módulo independente: suba sua música e sua letra direto aqui.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 overflow-hidden h-full min-h-0">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-sm font-black tracking-widest uppercase text-slate-400 mb-4">Entrada</h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-300">Mídia (áudio/vídeo)</span>
              <input
                type="file"
                accept="audio/*,video/*"
                className="mt-2 w-full text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-white hover:file:bg-cyan-500"
                onChange={(e) => onSelectMedia(e.target.files?.[0])}
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-300">Letra por arquivo (.txt)</span>
              <input
                type="file"
                accept=".txt,text/plain"
                className="mt-2 w-full text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-white hover:file:bg-slate-600"
                onChange={(e) => void onUploadLyricsTxt(e.target.files?.[0])}
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-300">Letra (cole aqui)</span>
              <textarea
                value={lyricsRaw}
                onChange={(e) => setLyricsRaw(e.target.value)}
                className="mt-2 w-full min-h-[180px] rounded-2xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder={'Exemplo sincronizado:\n[00:05] Primeira linha\n[00:10] Segunda linha\n\nOu texto livre, uma linha por verso.'}
              />
            </label>

            {fileError && (
              <div className="rounded-xl bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 text-sm">
                {fileError}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {mediaName ? `Arquivo atual: ${mediaName}` : 'Nenhum arquivo carregado'}
              </div>
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold uppercase tracking-widest"
              >
                Limpar tudo
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-400">Player e letra</h2>
            <button
              onClick={() => setAutoScroll((v) => !v)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold ${autoScroll ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}
            >
              Auto-scroll {autoScroll ? 'ON' : 'OFF'}
            </button>
          </div>

          {mediaUrl ? (
            <div className="mb-5">
              {isVideo ? (
                <video
                  ref={mediaRef}
                  src={mediaUrl}
                  controls
                  onTimeUpdate={() => setCurrentTime(mediaRef.current?.currentTime || 0)}
                  className="w-full max-h-[320px] rounded-2xl bg-black"
                />
              ) : (
                <audio
                  ref={mediaRef}
                  src={mediaUrl}
                  controls
                  onTimeUpdate={() => setCurrentTime(mediaRef.current?.currentTime || 0)}
                  className="w-full"
                />
              )}
              <div className="text-xs text-slate-400 mt-2">Tempo atual: {fmtTime(currentTime)}</div>
            </div>
          ) : (
            <div className="mb-5 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center text-slate-400 text-sm">
              Suba uma mídia para começar.
            </div>
          )}

          <div ref={linesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
            {lyricLines.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center text-slate-400 text-sm">
                Cole ou envie a letra para exibir os versos.
              </div>
            ) : (
              lyricLines.map((line) => {
                const active = line.id === activeLineId;
                return (
                  <button
                    key={line.id}
                    data-line-id={line.id}
                    onClick={() => seekToLine(line)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      active ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      {line.timeSec !== null ? fmtTime(line.timeSec) : 'Sem tempo'}
                    </div>
                    <div className="text-base leading-relaxed">{line.text}</div>
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default KaraokePage;
