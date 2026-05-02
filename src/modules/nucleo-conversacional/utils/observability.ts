type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const PREFIX = '[SagB][NucleoConversacional]';

const shouldLogDebug = () => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return Boolean((import.meta as any).env.DEV);
  }
  return false;
};

const print = (level: LogLevel, event: string, payload?: Record<string, unknown>) => {
  if (level === 'debug' && !shouldLogDebug()) return;
  const tag = `${PREFIX} ${event}`;
  if (level === 'debug') console.debug(tag, payload || {});
  if (level === 'info') console.info(tag, payload || {});
  if (level === 'warn') console.warn(tag, payload || {});
  if (level === 'error') console.error(tag, payload || {});
};

export const ncLog = {
  debug: (event: string, payload?: Record<string, unknown>) => print('debug', event, payload),
  info: (event: string, payload?: Record<string, unknown>) => print('info', event, payload),
  warn: (event: string, payload?: Record<string, unknown>) => print('warn', event, payload),
  error: (event: string, payload?: Record<string, unknown>) => print('error', event, payload),
};

