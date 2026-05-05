export * from './manifest';
export * from './routes';
export { HubIntegracaoPage } from './pages/HubIntegracaoPage';
export { integrationHub } from './services/integrationService';
export { credentialManager } from './services/credentialManager';
export { whatsAppDriver } from './services/whatsappService';
export { emailService } from './services/emailService';
export { loggerService } from './services/loggerService';
export type {
  Integration,
  HubInboundMessage,
  HubInboundSource,
  HubActivityLogEntry,
  HubInboundWebhookPayload,
  HubMailSendInput,
  HubMailSendResult,
  ConnectionConfig,
  IntegrationServiceContract,
} from './types/integration.types';

// ─── Contrato Público — Taskzei Integration ─────────────────────────
// O Taskzei (Inbox Inteligente) consome o Hub através destas funções.
//
// Uso no Taskzei:
//   import { integrationHub } from '../../hub-integracao';
//
//   // Escutar mensagens em tempo real (event bridge)
//   window.addEventListener('hub:inbound-message', (event) => {
//     const msg = (event as CustomEvent<HubInboundMessage>).detail;
//     useInboxStore.getState().addInboxItem({ ... });
//   });
//
//   // Consultar mensagens pendentes
//   const messages = await integrationHub.getInboxMessages('int_waba_01');
//
//   // Marcar como lida após processamento
//   await integrationHub.markAsRead(message.id);
//
// Exportamos os métodos diretamente para conveniência:
export const getInboxMessages = integrationHub.getInboxMessages.bind(integrationHub);
export const markAsRead = integrationHub.markAsRead.bind(integrationHub);
