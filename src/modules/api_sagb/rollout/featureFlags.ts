/**
 * Feature Flags para rollout progressivo da API SagB.
 *
 * Permite ativar/desativar funcionalidades específicas
 * sem necessidade de deploy, via variáveis de ambiente.
 */

export interface FeatureFlags {
  /** Habilita o endpoint de healthcheck */
  healthEnabled: boolean;

  /** Habilita endpoints do TaskZei (notificações) */
  taskzeiEnabled: boolean;

  /** Habilita endpoints do CRM (leads) */
  crmEnabled: boolean;

  /** Habilita endpoints do Studio (projetos) */
  studioEnabled: boolean;

  /** Habilita endpoints do Vox (transcrição) */
  voxEnabled: boolean;

  /** Habilita auditoria (log no Supabase) */
  auditEnabled: boolean;

  /** Habilita cache de API Keys (reduz chamadas ao Supabase) */
  apiKeyCacheEnabled: boolean;

  /** Modo debug: log detalhado de requisições */
  debugMode: boolean;

  /** Habilita rotação automática de API Keys */
  autoKeyRotation: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  healthEnabled: true,
  taskzeiEnabled: true,
  crmEnabled: true,
  studioEnabled: true,
  voxEnabled: true,
  auditEnabled: true,
  apiKeyCacheEnabled: false,
  debugMode: false,
  autoKeyRotation: false,
};

let flags: FeatureFlags = { ...DEFAULT_FLAGS };

/**
 * Carrega as feature flags a partir de variáveis de ambiente.
 * Valores esperados: "true" ou "false" (case-insensitive).
 */
export function loadFeatureFlags(): FeatureFlags {
  const env = typeof process !== 'undefined' ? process.env : {};

  flags = {
    healthEnabled: parseEnvFlag(env.SAGB_FEATURE_HEALTH, true),
    taskzeiEnabled: parseEnvFlag(env.SAGB_FEATURE_TASKZEI, true),
    crmEnabled: parseEnvFlag(env.SAGB_FEATURE_CRM, true),
    studioEnabled: parseEnvFlag(env.SAGB_FEATURE_STUDIO, true),
    voxEnabled: parseEnvFlag(env.SAGB_FEATURE_VOX, true),
    auditEnabled: parseEnvFlag(env.SAGB_FEATURE_AUDIT, true),
    apiKeyCacheEnabled: parseEnvFlag(env.SAGB_FEATURE_API_KEY_CACHE, false),
    debugMode: parseEnvFlag(env.SAGB_DEBUG_MODE, false),
    autoKeyRotation: parseEnvFlag(env.SAGB_FEATURE_KEY_ROTATION, false),
  };

  return flags;
}

/**
 * Retorna as flags atuais (sem recarregar).
 */
export function getFeatureFlags(): FeatureFlags {
  return { ...flags };
}

/**
 * Atualiza flags programaticamente (útil para testes).
 */
export function setFeatureFlags(overrides: Partial<FeatureFlags>): FeatureFlags {
  flags = { ...flags, ...overrides };
  return flags;
}

/**
 * Reseta flags para o padrão.
 */
export function resetFeatureFlags(): void {
  flags = { ...DEFAULT_FLAGS };
}

/**
 * Verifica se um domínio específico está habilitado.
 */
export function isDomainEnabled(domain: 'health' | 'taskzei' | 'crm' | 'studio' | 'vox'): boolean {
  switch (domain) {
    case 'health': return flags.healthEnabled;
    case 'taskzei': return flags.taskzeiEnabled;
    case 'crm': return flags.crmEnabled;
    case 'studio': return flags.studioEnabled;
    case 'vox': return flags.voxEnabled;
    default: return false;
  }
}

/**
 * Parse de variável de ambiente booleana.
 */
function parseEnvFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === null) return defaultValue;
  const normalized = value.toLowerCase().trim();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return defaultValue;
}
