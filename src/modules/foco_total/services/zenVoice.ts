import { callAiProxy } from '../../../../services/aiProxy';
import type { VoiceMode } from '../types';

type GeminiTtsResult = {
  audioBase64: string;
  mimeType?: string;
};

// ── Cache de frases comuns (FT-014) ──────────────────────────────
const phraseCache = new Map<string, { audioBase64: string; mimeType: string }>();
const MAX_CACHE_SIZE = 30;

// ── Tipos internos ────────────────────────────────────────────────
interface VoiceStatus {
  mode: VoiceMode;
  userActivated: boolean;
  browserVoicesAvailable: number;
  currentVoiceName: string | null;
}

// ── Classe ZenVoice ───────────────────────────────────────────────

class ZenVoice {
  private voice: SpeechSynthesisVoice | null = null;
  private mode: VoiceMode = 'muted';
  private userActivated: boolean = false;
  private activeAudio: HTMLAudioElement | null = null;
  private requestToken: number = 0;
  private audioQueue: Array<{ text: string; token: number }> = [];
  private isProcessing: boolean = false;
  private voicesChangedRegistered: boolean = false;
  private previousOnVoicesChanged: ((this: Window, ev: Event) => void) | null = null;

  constructor() {
    this.initVoice();
    this.registerVoicesListener();
  }

  // ── Inicialização segura de vozes ───────────────────────────────

  private initVoice() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();

    const preferred = [
      /portugu[eê]s.*brasil/i,
      /brazil/i,
      /pt-br/i,
    ];

    const ptBrVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith('pt'));

    this.voice =
      ptBrVoices.find((v) => preferred.some((pattern) => pattern.test(`${v.name} ${v.lang}`))) ||
      ptBrVoices[0] ||
      voices[0] ||
      null;
  }

  /** Registra listener seguro sem sobrescrever handlers anteriores (FT-016) */
  private registerVoicesListener() {
    if (typeof window === 'undefined' || !window.speechSynthesis || this.voicesChangedRegistered) return;

    // Preserva handler anterior
    if (window.speechSynthesis.onvoiceschanged) {
      this.previousOnVoicesChanged = window.speechSynthesis.onvoiceschanged;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      // Chama handler anterior primeiro
      if (this.previousOnVoicesChanged) {
        try {
          this.previousOnVoicesChanged.call(window, new Event('voiceschanged'));
        } catch {
          // Ignora erros do handler anterior
        }
      }
      this.initVoice();
    };

    this.voicesChangedRegistered = true;
  }

  // ── Controle de áudio ───────────────────────────────────────────

  private stopCurrentAudio() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
  }

  /** Cancela toda a fila de áudio */
  private cancelAllAudio() {
    this.requestToken += 1;
    this.audioQueue = [];
    this.isProcessing = false;
    this.stopCurrentAudio();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // ── Gemini TTS ──────────────────────────────────────────────────

  private async speakWithGemini(text: string, token: number): Promise<boolean> {
    // Verifica cache primeiro (FT-014)
    const cached = phraseCache.get(text);
    if (cached) {
      if (this.mode === 'muted' || token !== this.requestToken || typeof window === 'undefined') {
        return true;
      }
      this.stopCurrentAudio();
      const audio = new Audio(`data:${cached.mimeType};base64,${cached.audioBase64}`);
      this.activeAudio = audio;
      try {
        await audio.play();
        return true;
      } catch (err) {
        this.handlePlayError(err);
        return false;
      }
    }

    try {
      const data = await callAiProxy<GeminiTtsResult>('gemini_tts', {
        text,
        locale: 'pt-BR',
        voiceName: 'Fenrir',
        speakingStyle: 'Voz masculina, agradável e firme, tom confiante, ritmo calmo, sem soar robótico.',
      });

      if (this.mode === 'muted' || token !== this.requestToken || typeof window === 'undefined') {
        return true;
      }

      const mimeType = data?.mimeType || 'audio/wav';
      const audioBase64 = String(data?.audioBase64 || '').trim();
      if (!audioBase64) return false;

      // Armazena no cache
      if (phraseCache.size < MAX_CACHE_SIZE) {
        phraseCache.set(text, { audioBase64, mimeType });
      }

      const src = `data:${mimeType};base64,${audioBase64}`;
      this.stopCurrentAudio();
      const audio = new Audio(src);
      this.activeAudio = audio;

      await audio.play();
      return true;
    } catch (err) {
      // Fallback para browser em caso de falha do Gemini
      return false;
    }
  }

  // ── Browser SpeechSynthesis ─────────────────────────────────────

  private speakWithBrowserFallback(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 0.82;
    utterance.volume = 1;

    // Trata bloqueio de autoplay (FT-015)
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.handlePlayError(err);
    }
  }

  // ── Tratamento de erros de áudio ────────────────────────────────

  private handlePlayError(err: unknown) {
    const name = (err as DOMException)?.name || '';
    if (name === 'NotAllowedError') {
      console.warn('[ZenVoice] Autoplay bloqueado pelo navegador. Interaja com a página primeiro.');
    } else {
      console.warn('[ZenVoice] Erro ao reproduzir áudio:', err);
    }
  }

  // ── API pública ─────────────────────────────────────────────────

  /** Define o modo de voz */
  public setMode(mode: VoiceMode) {
    this.mode = mode;
    if (mode === 'muted') {
      this.cancelAllAudio();
    }
    if (mode === 'browser' || mode === 'gemini_tts') {
      this.userActivated = true;
    }
  }

  /** Atalho para compatibilidade com código existente */
  public setMuted(muted: boolean) {
    this.setMode(muted ? 'muted' : 'browser');
  }

  public getMuted(): boolean {
    return this.mode === 'muted';
  }

  /** Ativação explícita de voz pelo usuário (FT-015) */
  public activateVoice(mode: VoiceMode = 'browser') {
    this.userActivated = true;
    this.setMode(mode);
  }

  /** Status completo da voz (para UI) */
  public getVoiceStatus(): VoiceStatus {
    return {
      mode: this.mode,
      userActivated: this.userActivated,
      browserVoicesAvailable:
        typeof window !== 'undefined' && window.speechSynthesis
          ? window.speechSynthesis.getVoices().length
          : 0,
      currentVoiceName: this.voice?.name || null,
    };
  }

  /** Fala um texto, respeitando modo e fila */
  public async speak(text: string) {
    if (this.mode === 'muted' || typeof window === 'undefined') return;

    const safeText = String(text || '').trim();
    if (!safeText) return;

    this.requestToken += 1;
    const token = this.requestToken;

    // Modo Gemini TTS
    if (this.mode === 'gemini_tts') {
      try {
        const played = await this.speakWithGemini(safeText, token);
        if (!played && this.mode !== 'muted' && token === this.requestToken) {
          this.speakWithBrowserFallback(safeText);
        }
      } catch {
        if (this.mode !== 'muted' && token === this.requestToken) {
          this.speakWithBrowserFallback(safeText);
        }
      }
      return;
    }

    // Modo Browser
    if (this.mode === 'browser') {
      this.speakWithBrowserFallback(safeText);
    }
  }
}

export const zenVoice = new ZenVoice();
