/**
 * Helper para cálculo de tempo restante por relógio real (clock-based).
 *
 * Motivação: evitar drift acumulado quando o intervalo do navegador é
 * pausado (abas em background) ou quando múltiplos componentes disparam
 * ticks concorrentes.
 */

/** Retorna os segundos restantes com base em targetEndAt e pausa acumulada */
export function calcRemainingSeconds(targetEndAt: number, pauseAccumulatedSeconds: number): number {
  const elapsed = Math.max(0, targetEndAt - Date.now());
  const totalSeconds = Math.ceil(elapsed / 1000);
  return Math.max(0, totalSeconds - pauseAccumulatedSeconds);
}

/** Retorna o timestamp alvo de encerramento (agora + duração em minutos) */
export function calcTargetEndAt(durationMinutes: number, startedAt: number = Date.now()): number {
  return startedAt + durationMinutes * 60 * 1000;
}

/** Calcula o progresso da sessão (0-100) */
export function calcProgress(
  durationMinutes: number,
  timeRemainingSeconds: number,
): number {
  const total = durationMinutes * 60;
  if (total <= 0) return 100;
  const elapsed = total - timeRemainingSeconds;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/** Checkpoints da sessão (percentuais do tempo total) */
export const SESSION_CHECKPOINTS = [
  { percent: 0, key: 'start', label: 'Início da sessão' },
  { percent: 25, key: '25pct', label: '25% concluído' },
  { percent: 50, key: '50pct', label: 'Metade do caminho' },
  { percent: 75, key: '75pct', label: 'Reta final' },
  { percent: 90, key: '90pct', label: 'Últimos momentos' },
] as const;

/** Mensagens base do Zen Folk para cada checkpoint (fallback local, sem IA) */
export const ZEN_FOLK_MESSAGES: Record<string, string> = {
  start: 'Vamos começar. Boa sessão e foco total!',
  '25pct': 'Um quarto concluído. Mantenha o ritmo, você está no caminho certo.',
  '50pct': 'Metade da jornada. Respire fundo e continue — falta pouco mais da metade.',
  '75pct': 'Reta final. Não desacelere agora, o resultado está próximo.',
  '90pct': 'Últimos momentos. Finalize com excelência o que começou.',
};
