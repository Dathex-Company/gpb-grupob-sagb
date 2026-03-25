import { Agent, UserProfile } from '../types';

const emailPrefix = (email?: string | null) => {
  const raw = String(email || '').trim();
  if (!raw.includes('@')) return raw;
  return raw.split('@')[0].replace(/[._-]+/g, ' ').trim();
};

const toTitle = (value?: string | null) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const resolveAuthenticatedUserProfile = (authUser: any, profile?: UserProfile | null, agents?: Agent[]): UserProfile | null => {
  if (!authUser && !profile) return null;

  const authId = authUser?.id || authUser?.uid || profile?.uid || '';
  const authEmail = String(authUser?.email || profile?.email || '').trim();
  const meta = authUser?.user_metadata && typeof authUser.user_metadata === 'object' ? authUser.user_metadata : {};
  
  const humanAgent = agents?.find(a => {
    if (a.entityType !== 'HUMANO' && a.entityType !== 'HIBRIDO') return false;
    // Tenta primeiro match forte por authUserId, com fallback para email
    if (a.authUserId && a.authUserId === authId) return true;
    return String(a.email || '').trim().toLowerCase() === authEmail.toLowerCase();
  });

  const fallbackName = toTitle(meta.full_name || meta.name || emailPrefix(authEmail) || 'Usuário');
  const resolvedName = String(humanAgent?.name || profile?.name || fallbackName).trim();
  const resolvedNickname = String(profile?.nickname || resolvedName.split(' ')[0] || emailPrefix(authEmail) || 'Usuário').trim();

  return {
    uid: String(profile?.uid || authId),
    email: authEmail,
    name: resolvedName,
    nickname: resolvedNickname,
    role: String(humanAgent?.officialRole || profile?.role || meta.role || 'Colaborador'),
    company: String(humanAgent?.company || profile?.company || 'GrupoB'),
    workspaceId: profile?.workspaceId,
    avatarUrl: String(humanAgent?.avatarUrl || profile?.avatarUrl || meta.avatar_url || meta.picture || ''),
    tier: humanAgent?.tier || profile?.tier || 'OPERACIONAL',
    createdAt: profile?.createdAt || new Date()
  };
};
