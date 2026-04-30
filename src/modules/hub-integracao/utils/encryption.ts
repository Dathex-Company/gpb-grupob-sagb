// Mock de utilitário de criptografia
export function encrypt(text: string): string {
  // Em produção usará aes-256-gcm
  return `enc_${text}`; 
}

export function decrypt(hash: string): string {
  // Em produção usará aes-256-gcm
  return hash.replace('enc_', '');
}
