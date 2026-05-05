export function validateIntegrationConfig(provider: string, config: any): boolean {
  if (!config) return false;

  switch (provider) {
    case 'clickup':
      return !!config.apiToken && !!config.listId;

    case 'whatsapp':
      return !!config.accessToken && !!config.phoneNumberId;

    case 'gmail':
      return !!config.clientId && !!config.clientSecret && !!config.refreshToken;

    case 'titan':
      return !!config.apiKey;

    case 'meta_facebook':
      return !!config.accessToken && !!config.pageId;

    default:
      return true;
  }
}

export function validateEmailAddress(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }

}
