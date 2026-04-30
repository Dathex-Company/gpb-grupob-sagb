import { callAiProxy } from '../../../../services/aiProxy';

type GeminiTtsResult = {
  audioBase64: string;
  mimeType?: string;
};

class ZenVoice {
  private voice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;
  private activeAudio: HTMLAudioElement | null = null;
  private requestToken: number = 0;

  constructor() {
    this.initVoice();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => this.initVoice();
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();

    const preferred = [
      /portugu[eê]s.*brasil/i,
      /brazil/i,
      /pt-br/i
    ];

    const ptBrVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith('pt'));

    this.voice =
      ptBrVoices.find((v) => preferred.some((pattern) => pattern.test(`${v.name} ${v.lang}`))) ||
      ptBrVoices[0] ||
      voices[0] ||
      null;
  }

  private stopCurrentAudio() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
  }

  private async speakWithGemini(text: string, token: number): Promise<boolean> {
    const data = await callAiProxy<GeminiTtsResult>('gemini_tts', {
      text,
      locale: 'pt-BR',
      voiceName: 'Fenrir',
      speakingStyle: 'Voz masculina, agradável e firme, tom confiante, ritmo calmo, sem soar robótico.'
    });

    if (this.isMuted || token !== this.requestToken || typeof window === 'undefined') {
      return true;
    }

    const mimeType = data?.mimeType || 'audio/wav';
    const audioBase64 = String(data?.audioBase64 || '').trim();
    if (!audioBase64) return false;

    const src = `data:${mimeType};base64,${audioBase64}`;
    this.stopCurrentAudio();
    const audio = new Audio(src);
    this.activeAudio = audio;

    await audio.play();
    return true;
  }

  private speakWithBrowserFallback(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 0.82;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopCurrentAudio();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public async speak(text: string) {
    if (this.isMuted || typeof window === 'undefined') return;

    const safeText = String(text || '').trim();
    if (!safeText) return;

    this.requestToken += 1;
    const token = this.requestToken;

    try {
      const played = await this.speakWithGemini(safeText, token);
      if (!played && !this.isMuted && token === this.requestToken) {
        this.speakWithBrowserFallback(safeText);
      }
    } catch {
      if (!this.isMuted && token === this.requestToken) {
        this.speakWithBrowserFallback(safeText);
      }
    }
  }
}

export const zenVoice = new ZenVoice();
