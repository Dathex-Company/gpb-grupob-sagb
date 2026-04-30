/**
 * Testes para webhookHandler.ts
 * @author Yasmin Rangel
 */

import { processWebhookNotification, isSupportedWebhookEvent, getEventDescription } from '../webhookHandler';
import { financeService } from '../financeService';

// Mock do financeService
jest.mock('../financeService', () => ({
  financeService: {
    updateStatusByExternalReference: jest.fn(),
    createTransacao: jest.fn(),
    registerConciliacao: jest.fn()
  }
}));

describe('webhookHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processWebhookNotification', () => {
    it('deve processar payment.confirmed com sucesso', async () => {
      const mockTransacaoId = 'tx_123';
      (financeService.updateStatusByExternalReference as jest.Mock).mockResolvedValue(mockTransacaoId);
      (financeService.registerConciliacao as jest.Mock).mockResolvedValue('conc_123');

      const payload = {
        event: 'payment.confirmed',
        data: {
          reference: 'ref_123',
          paid_at: '2024-01-15T10:30:00Z',
          amount: 1000
        },
        timestamp: '2024-01-15T10:30:00Z',
        provider: 'bank-api'
      };

      const result = await processWebhookNotification(payload);

      expect(result.success).toBe(true);
      expect(result.transacaoId).toBe(mockTransacaoId);
      expect(result.eventType).toBe('payment.confirmed');
      expect(financeService.updateStatusByExternalReference).toHaveBeenCalledWith({
        provider: 'bank-api',
        reference: 'ref_123',
        status: 'conciliado',
        dataPagamento: '2024-01-15T10:30:00Z',
        metadataPatch: expect.any(Object)
      });
      expect(financeService.registerConciliacao).toHaveBeenCalled();
    });

    it('deve processar transfer.failed com sucesso', async () => {
      const mockTransacaoId = 'tx_456';
      (financeService.updateStatusByExternalReference as jest.Mock).mockResolvedValue(mockTransacaoId);
      (financeService.registerConciliacao as jest.Mock).mockResolvedValue('conc_456');

      const payload = {
        event: 'transfer.failed',
        data: {
          reference: 'ref_456',
          reason: 'insufficient_funds'
        },
        timestamp: '2024-01-15T11:00:00Z',
        provider: 'bank-api'
      };

      const result = await processWebhookNotification(payload);

      expect(result.success).toBe(true);
      expect(result.transacaoId).toBe(mockTransacaoId);
      expect(result.eventType).toBe('transfer.failed');
      expect(financeService.updateStatusByExternalReference).toHaveBeenCalledWith({
        provider: 'bank-api',
        reference: 'ref_456',
        status: 'falhou',
        metadataPatch: expect.objectContaining({
          failure_reason: 'insufficient_funds'
        })
      });
    });

    it('deve criar nova transação para payment.created sem referência existente', async () => {
      (financeService.updateStatusByExternalReference as jest.Mock).mockResolvedValue(null);
      (financeService.createTransacao as jest.Mock).mockResolvedValue('tx_new_123');
      (financeService.registerConciliacao as jest.Mock).mockResolvedValue('conc_new_123');

      const payload = {
        event: 'payment.created',
        data: {
          reference: 'ref_new',
          amount: 500,
          description: 'Pagamento teste'
        },
        timestamp: '2024-01-15T12:00:00Z',
        provider: 'bank-api'
      };

      const result = await processWebhookNotification(payload);

      expect(result.success).toBe(true);
      expect(result.transacaoId).toBe('tx_new_123');
      expect(financeService.createTransacao).toHaveBeenCalledWith({
        origem: 'bank',
        tipo: 'pagamento',
        status: 'pendente',
        descricao: 'Pagamento teste',
        valor: 500,
        data_competencia: expect.any(String),
        data_pagamento: null,
        referencia_externa: 'ref_new',
        integracao_provider: 'bank-api',
        plano_conta_codigo: null,
        metadata: expect.any(Object)
      });
    });

    it('deve retornar erro quando updateStatusByExternalReference falhar', async () => {
      const error = new Error('Database error');
      (financeService.updateStatusByExternalReference as jest.Mock).mockRejectedValue(error);
      (financeService.registerConciliacao as jest.Mock).mockResolvedValue('conc_error_123');

      const payload = {
        event: 'payment.confirmed',
        data: { reference: 'ref_error' },
        timestamp: '2024-01-15T13:00:00Z'
      };

      const result = await processWebhookNotification(payload);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
      expect(financeService.registerConciliacao).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'erro'
        })
      );
    });

    it('deve registrar conciliação como ignorado para evento sem referência', async () => {
      (financeService.registerConciliacao as jest.Mock).mockResolvedValue('conc_ignore_123');

      const payload = {
        event: 'payment.confirmed',
        data: { amount: 100 }, // sem reference
        timestamp: '2024-01-15T14:00:00Z'
      };

      const result = await processWebhookNotification(payload);

      expect(result.success).toBe(false);
      expect(financeService.registerConciliacao).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ignorado'
        })
      );
    });
  });

  describe('isSupportedWebhookEvent', () => {
    it('deve retornar true para eventos suportados', () => {
      expect(isSupportedWebhookEvent('payment.confirmed')).toBe(true);
      expect(isSupportedWebhookEvent('transfer.failed')).toBe(true);
      expect(isSupportedWebhookEvent('payment.created')).toBe(true);
      expect(isSupportedWebhookEvent('transfer.created')).toBe(true);
      expect(isSupportedWebhookEvent('payment.refunded')).toBe(true);
      expect(isSupportedWebhookEvent('transfer.completed')).toBe(true);
    });

    it('deve retornar false para eventos não suportados', () => {
      expect(isSupportedWebhookEvent('unknown.event')).toBe(false);
      expect(isSupportedWebhookEvent('')).toBe(false);
      expect(isSupportedWebhookEvent('payment.cancelled')).toBe(false);
    });
  });

  describe('getEventDescription', () => {
    it('deve retornar descrição para eventos conhecidos', () => {
      expect(getEventDescription('payment.confirmed')).toBe('Pagamento confirmado');
      expect(getEventDescription('transfer.failed')).toBe('Transferência falhou');
      expect(getEventDescription('payment.created')).toBe('Pagamento criado');
    });

    it('deve retornar descrição genérica para eventos desconhecidos', () => {
      expect(getEventDescription('unknown.event')).toBe('Evento: unknown.event');
      expect(getEventDescription('')).toBe('Evento: ');
    });
  });
});