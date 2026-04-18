const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const sessionStorageKey = 'sagb_supabase_session_v1';

const EMPRESA_LOGO_BUCKET = import.meta.env.VITE_SUPABASE_EMPRESA_LOGO_BUCKET || 'empresas-logos';

const sanitizePathSegment = (value: string) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

const getAccessToken = () => {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem(sessionStorageKey);
    const parsed = raw ? JSON.parse(raw) : null;
    return String(parsed?.access_token || '');
  } catch {
    return '';
  }
};

const getFileExtension = (file: File) => {
  const fromName = String(file.name || '').split('.').pop();
  if (fromName && fromName.length <= 6) return fromName.toLowerCase();
  const fromType = String(file.type || '').split('/').pop();
  return fromType ? fromType.toLowerCase() : 'bin';
};

export const isLegacyBase64Logo = (value: string | null | undefined) =>
  /^data:image\//i.test(String(value || '').trim());

export const buildEmpresaLogoPublicUrl = (bucket: string, path: string) => {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

export const resolveEmpresaLogoUrl = (logoUrl: string | null | undefined) => {
  const value = String(logoUrl || '').trim();
  if (!value) return '';

  if (/^(https?:\/\/|blob:|data:image\/)/i.test(value)) return value;

  if (value.startsWith('storage://')) {
    const payload = value.replace('storage://', '');
    const [bucket, ...pathParts] = payload.split('/');
    const path = pathParts.join('/');
    if (!bucket || !path) return value;
    return buildEmpresaLogoPublicUrl(bucket, path);
  }

  if (value.includes('/')) {
    return buildEmpresaLogoPublicUrl(EMPRESA_LOGO_BUCKET, value);
  }

  return value;
};

export const uploadEmpresaLogo = async (file: File, empresaNome?: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase Storage indisponível: variáveis de ambiente ausentes.');
  }

  const token = getAccessToken();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const safeEmpresa = sanitizePathSegment(empresaNome || 'empresa');
  const fileExt = getFileExtension(file);
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${safeEmpresa}-${uniqueSuffix}.${fileExt}`;
  const storagePath = `cadastro-empresas/${year}/${month}/${fileName}`;

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${EMPRESA_LOGO_BUCKET}/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token || supabaseAnonKey}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true'
    },
    body: file
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(detail || `Falha no upload da logo (${response.status}).`);
  }

  const logoUrl = buildEmpresaLogoPublicUrl(EMPRESA_LOGO_BUCKET, storagePath);
  return {
    bucket: EMPRESA_LOGO_BUCKET,
    path: storagePath,
    logoUrl
  };
};
