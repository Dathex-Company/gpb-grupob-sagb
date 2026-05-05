/**
 * Rate Limiter — Token Bucket Algorithm
 *
 * Implementa o algoritmo Token Bucket para rate limiting da API SagB.
 * Cada cliente recebe um bucket com capacidade máxima de tokens,
 * e os tokens são reabastecidos a uma taxa fixa por segundo.
 *
 * Uso:
 *   const limiter = new RateLimiter({ capacity: 100, refillRate: 10 });
 *   if (limiter.consume('client-123')) {
 *     // permitir requisição
 *   } else {
 *     // retornar 429 Too Many Requests
 *   }
 *
 * Decision: D-006 — Rate Limiting com Token Bucket
 */

export interface RateLimiterConfig {
  /** Capacidade máxima do bucket (burst máximo) */
  capacity: number;
  /** Tokens reabastecidos por segundo */
  refillRate: number;
  /** Intervalo de refill em ms (default: 1000ms = 1s) */
  refillIntervalMs?: number;
}

interface Bucket {
  tokens: number;
  lastRefill: number;
}

/**
 * Rate Limiter baseado no algoritmo Token Bucket.
 * Thread-safe para uso em ambientes single-thread (Node.js).
 */
export class RateLimiter {
  private readonly capacity: number;
  private readonly refillRate: number;
  private readonly refillIntervalMs: number;
  private readonly buckets: Map<string, Bucket> = new Map();

  constructor(config: RateLimiterConfig) {
    this.capacity = config.capacity;
    this.refillRate = config.refillRate;
    this.refillIntervalMs = config.refillIntervalMs ?? 1000;
  }

  /**
   * Tenta consumir um token do bucket do cliente.
   *
   * @param clientId - Identificador único do cliente
   * @param tokens - Número de tokens a consumir (default: 1)
   * @returns true se o consumo foi permitido, false se excedeu o limite
   */
  consume(clientId: string, tokens: number = 1): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(clientId);

    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.buckets.set(clientId, bucket);
    }

    // Refill baseado no tempo decorrido
    this.refill(bucket, now);

    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return true;
    }

    return false;
  }

  /**
   * Retorna o número atual de tokens disponíveis para um cliente.
   */
  getTokens(clientId: string): number {
    const bucket = this.buckets.get(clientId);
    if (!bucket) return this.capacity;

    this.refill(bucket, Date.now());
    return bucket.tokens;
  }

  /**
   * Retorna o tempo estimado (ms) até que um token esteja disponível.
   * Útil para o header Retry-After.
   */
  getWaitTime(clientId: string): number {
    const bucket = this.buckets.get(clientId);
    if (!bucket) return 0;

    this.refill(bucket, Date.now());
    if (bucket.tokens > 0) return 0;

    // Tempo necessário para gerar 1 token
    return Math.ceil(this.refillIntervalMs / this.refillRate);
  }

  /**
   * Reseta o bucket de um cliente específico.
   */
  reset(clientId: string): void {
    this.buckets.delete(clientId);
  }

  /**
   * Reseta todos os buckets (útil em testes ou reset global).
   */
  resetAll(): void {
    this.buckets.clear();
  }

  /**
   * Retorna estatísticas dos buckets ativos.
   */
  getStats(): { activeClients: number; totalTokens: number } {
    let totalTokens = 0;
    const now = Date.now();

    this.buckets.forEach((bucket, _clientId) => {
      this.refill(bucket, now);
      totalTokens += bucket.tokens;
    });

    return {
      activeClients: this.buckets.size,
      totalTokens,
    };
  }

  /**
   * Reabastece os tokens do bucket baseado no tempo decorrido.
   */
  private refill(bucket: Bucket, now: number): void {
    const elapsed = now - bucket.lastRefill;
    if (elapsed < this.refillIntervalMs) return;

    const refillCount = Math.floor(elapsed / this.refillIntervalMs);
    const newTokens = refillCount * this.refillRate;

    bucket.tokens = Math.min(this.capacity, bucket.tokens + newTokens);
    bucket.lastRefill = now;
  }
}

/**
 * Cria um RateLimiter com configuração padrão para a API SagB.
 * - Capacidade: 100 tokens (burst inicial)
 * - Refill: 10 tokens/segundo
 */
export function createDefaultRateLimiter(): RateLimiter {
  return new RateLimiter({
    capacity: 100,
    refillRate: 10,
    refillIntervalMs: 1000,
  });
}

/**
 * Cria um RateLimiter com configuração restrita para endpoints críticos.
 * - Capacidade: 20 tokens
 * - Refill: 2 tokens/segundo
 */
export function createStrictRateLimiter(): RateLimiter {
  return new RateLimiter({
    capacity: 20,
    refillRate: 2,
    refillIntervalMs: 1000,
  });
}
