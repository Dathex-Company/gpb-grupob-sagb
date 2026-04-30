/**
 * Testes para webhookValidator.ts
 * @author Yasmin Rangel
 */

import { validateWebhookSignature, verifyTimestamp } from '../webhookValidator';

describe('webhookValidator', () => {
  const secret = 'test-secret-123';
  const payload = JSON.stringify({ event: 'payment.confirmed', data: { amount: 100 } });
  const timestamp = Date.now().toString();
  
  describe('validateWebhookSignature', () => {
    it('deve validar assinatura HMAC correta', async () => {
      // Gerar assinatura válida
      const encoder = new TextEncoder();
      const data = encoder.encode(`${timestamp}.${payload}`);
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const result = await validateWebhookSignature(
        payload,
        signature,
        secret,
        timestamp
      );
      
      expect(result).toBe(true);
    });

    it('deve rejeitar assinatura incorreta', async () => {
      const result = await validateWebhookSignature(
        payload,
        'invalid-signature',
        secret,
        timestamp
      );
      
      expect(result).toBe(false);
    });

    it('deve rejeitar payload alterado', async () => {
      // Gerar assinatura para payload original
      const encoder = new TextEncoder();
      const data = encoder.encode(`${timestamp}.${payload}`);
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Tentar validar com payload alterado
      const alteredPayload = JSON.stringify({ event: 'payment.confirmed', data: { amount: 999 } });
      const result = await validateWebhookSignature(
        alteredPayload,
        signature,
        secret,
        timestamp
      );
      
      expect(result).toBe(false);
    });

    it('deve rejeitar timestamp alterado', async () => {
      // Gerar assinatura com timestamp original
      const encoder = new TextEncoder();
      const data = encoder.encode(`${timestamp}.${payload}`);
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Tentar validar com timestamp diferente
      const differentTimestamp = (Date.now() - 1000).toString();
      const result = await validateWebhookSignature(
        payload,
        signature,
        secret,
        differentTimestamp
      );
      
      expect(result).toBe(false);
    });
  });

  describe('verifyTimestamp', () => {
    it('deve aceitar timestamp dentro da tolerância', () => {
      const now = Date.now();
      const recentTimestamp = (now - 5000).toString(); // 5 segundos atrás
      
      const result = verifyTimestamp(recentTimestamp, 10000); // tolerância de 10 segundos
      
      expect(result).toBe(true);
    });

    it('deve rejeitar timestamp muito antigo', () => {
      const oldTimestamp = (Date.now() - 30000).toString(); // 30 segundos atrás
      
      const result = verifyTimestamp(oldTimestamp, 10000); // tolerância de 10 segundos
      
      expect(result).toBe(false);
    });

    it('deve rejeitar timestamp no futuro', () => {
      const futureTimestamp = (Date.now() + 5000).toString(); // 5 segundos no futuro
      
      const result = verifyTimestamp(futureTimestamp, 10000);
      
      expect(result).toBe(false);
    });

    it('deve rejeitar timestamp inválido', () => {
      const result = verifyTimestamp('not-a-number', 10000);
      
      expect(result).toBe(false);
    });
  });
});