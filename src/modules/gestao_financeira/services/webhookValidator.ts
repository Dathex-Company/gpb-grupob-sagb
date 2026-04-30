/**
 * Webhook Validator
 * Valida assinaturas HMAC de webhooks recebidos de providers bancários.
 * @author Yasmin Rangel
 */

import { financeService } from './financeService';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  provider?: string;
}

export class WebhookValidator {
  /**
   * Valida assinatura HMAC de um webhook
   * @param payloadString String JSON do payload recebido
   * @param signature Assinatura recebida no header X-Webhook-Signature
   * @param provider Nome do provider (ex: 'bank-api')
   * @returns Resultado da validação
   */
  static async validateSignature(
    payloadString: string,
    signature: string,
    provider: string = 'bank-api'
  ): Promise<ValidationResult> {
    try {
      // 1. Obter segredo do provider
      const secret = await financeService.getWebhookSecret(provider);
      if (!secret) {
        return {
          isValid: false,
          error: `Webhook secret not found for provider: ${provider}`,
          provider
        };
      }

      // 2. Calcular HMAC do payload
      const calculatedSignature = await this.calculateHmacSha256(payloadString, secret);

      // 3. Comparar assinaturas (comparação segura contra timing attacks)
      const isValid = this.secureCompare(calculatedSignature, signature);

      return {
        isValid,
        error: isValid ? undefined : 'Signature mismatch',
        provider
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        provider
      };
    }
  }

  /**
   * Calcula HMAC-SHA256 de uma string
   * @param data String a ser assinada
   * @param secret Segredo em formato string
   * @returns Assinatura em hexadecimal lowercase
   */
  private static async calculateHmacSha256(data: string, secret: string): Promise<string> {
    // Usar Web Crypto API (disponível em navegadores e Node.js)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    // Importar chave para uso com HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Assinar
    const signature = await crypto.subtle.sign('HMAC', key, messageData);

    // Converter para hexadecimal
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Comparação segura contra timing attacks
   * @param a String A
   * @param b String B
   * @returns true se strings são iguais
   */
  private static secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * Valida timestamp do webhook para proteção contra replay attacks
   * @param timestampString Timestamp ISO do header X-Webhook-Timestamp
   * @param maxAgeSeconds Idade máxima permitida em segundos (padrão 5 minutos)
   * @returns true se timestamp é válido
   */
  static validateTimestamp(
    timestampString: string | null | undefined,
    maxAgeSeconds: number = 300
  ): boolean {
    if (!timestampString) {
      // Se não fornecido, não validamos (opcional)
      return true;
    }

    try {
      const timestamp = new Date(timestampString);
      const now = new Date();
      const diffSeconds = Math.abs((now.getTime() - timestamp.getTime()) / 1000);

      return diffSeconds <= maxAgeSeconds;
    } catch {
      return false;
    }
  }

  /**
   * Extrai assinatura do header HTTP
   * @param headers Objeto de headers ou string do header
   * @returns Assinatura ou null se não encontrada
   */
  static extractSignatureFromHeader(headers: Record<string, string> | string): string | null {
    if (typeof headers === 'string') {
      // Tentar extrair de string de header única
      const match = headers.match(/^X-Webhook-Signature:\s*(.+)$/im);
      return match ? match[1].trim() : null;
    }

    // Buscar em várias possíveis chaves (case-insensitive)
    const headerKeys = Object.keys(headers);
    const signatureKey = headerKeys.find(
      key => key.toLowerCase() === 'x-webhook-signature'
    );

    return signatureKey ? headers[signatureKey].trim() : null;
  }

  /**
   * Extrai timestamp do header HTTP
   * @param headers Objeto de headers ou string do header
   * @returns Timestamp ou null se não encontrado
   */
  static extractTimestampFromHeader(headers: Record<string, string> | string): string | null {
    if (typeof headers === 'string') {
      const match = headers.match(/^X-Webhook-Timestamp:\s*(.+)$/im);
      return match ? match[1].trim() : null;
    }

    const headerKeys = Object.keys(headers);
    const timestampKey = headerKeys.find(
      key => key.toLowerCase() === 'x-webhook-timestamp'
    );

    return timestampKey ? headers[timestampKey].trim() : null;
  }

  /**
   * Validação completa de webhook
   * @param payloadString Payload JSON como string
   * @param headers Headers HTTP
   * @param provider Nome do provider
   * @returns Resultado da validação
   */
  static async validateWebhook(
    payloadString: string,
    headers: Record<string, string>,
    provider: string = 'bank-api'
  ): Promise<ValidationResult> {
    // Extrair assinatura
    const signature = this.extractSignatureFromHeader(headers);
    if (!signature) {
      return {
        isValid: false,
        error: 'Missing X-Webhook-Signature header',
        provider
      };
    }

    // Validar timestamp (opcional)
    const timestamp = this.extractTimestampFromHeader(headers);
    if (timestamp && !this.validateTimestamp(timestamp)) {
      return {
        isValid: false,
        error: 'Timestamp too old or invalid',
        provider
      };
    }

    // Validar assinatura
    return await this.validateSignature(payloadString, signature, provider);
  }
}