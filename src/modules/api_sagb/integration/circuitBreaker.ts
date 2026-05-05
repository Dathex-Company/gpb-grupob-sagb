/**
 * Implementação de Circuit Breaker para a API SagB.
 * Previne chamadas sucessivas a serviços downstream com falha.
 *
 * Estados: CLOSED (normal) → OPEN (falhando) → HALF_OPEN (teste) → CLOSED (recuperou)
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  failureThreshold: number;  // número de falhas consecutivas para abrir o circuito (default 5)
  successThreshold: number;  // número de sucessos consecutivos em HALF_OPEN para fechar (default 2)
  timeout: number;           // ms para aguardar antes de tentar HALF_OPEN (default 30000)
  name: string;              // nome do circuito para identificação em logs
}

interface CircuitBreakerEvents {
  onOpen?: (name: string) => void;
  onHalfOpen?: (name: string) => void;
  onClose?: (name: string) => void;
}

export class CircuitBreakerOpenError extends Error {
  constructor(
    message: string,
    public readonly name: string,
  ) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private readonly config: Required<CircuitBreakerConfig>;
  private readonly events?: CircuitBreakerEvents;

  constructor(config: CircuitBreakerConfig, events?: CircuitBreakerEvents) {
    this.config = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 30000,
      ...config,
    };
    this.events = events;
  }

  getState(): CircuitState {
    return this.state;
  }

  getName(): string {
    return this.config.name;
  }

  /**
   * Executa uma operação com proteção do Circuit Breaker.
   */
  async call<T>(fn: () => Promise<T>): Promise<T> {
    this.checkState();

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Verifica se o circuito permite a chamada.
   * Se HALF_OPEN e timeout expirou, transiciona para HALF_OPEN para teste.
   */
  private checkState(): void {
    if (this.state === 'CLOSED') return;

    if (this.state === 'OPEN') {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed >= this.config.timeout) {
        this.transitionTo('HALF_OPEN');
        return;
      }
      throw new CircuitBreakerOpenError(
        `Circuit breaker is OPEN. Retry in ${this.config.timeout - elapsed}ms`,
        this.config.name,
      );
    }

    // HALF_OPEN permite a chamada passar
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold && this.state !== 'OPEN') {
      this.transitionTo('OPEN');
    }
  }

  private transitionTo(newState: CircuitState): void {
    this.state = newState;

    switch (newState) {
      case 'OPEN':
        this.events?.onOpen?.(this.config.name);
        break;
      case 'HALF_OPEN':
        this.successCount = 0;
        this.events?.onHalfOpen?.(this.config.name);
        break;
      case 'CLOSED':
        this.events?.onClose?.(this.config.name);
        break;
    }
  }

  private reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
  }

  /**
   * Reseta manualmente o circuito para CLOSED (ex: após intervenção manual).
   */
  manualReset(): void {
    this.reset();
    console.log(`[CircuitBreaker] "${this.config.name}" manually reset to CLOSED`);
  }
}
