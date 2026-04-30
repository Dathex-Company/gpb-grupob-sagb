export function validateIntegrationConfig(provider: string, config: any): boolean {
  // Placeholder para validação de schema (zod, etc)
  if (!config) return false;
  
  if (provider === 'clickup') {
    return !!config.apiToken;
  }
  
  if (provider === 'whatsapp') {
    return !!config.accessToken && !!config.phoneNumberId;
  }
  
  return true;
}
