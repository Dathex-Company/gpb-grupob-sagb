import { UserProfile } from '../types';

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

export const resolveAuthenticatedUserProfile = (authUser: any, profile?: UserProfile | null): UserProfile | null => {
  if (!authUser && !profile) return null;

  const authId = authUser?.id || authUser?.uid || profile?.uid || '';
  const authEmail = String(authUser?.email || profile?.email || '').trim();
  const meta = authUser?.user_metadata && typeof authUser.user_metadata === 'object' ? authUser.user_metadata : {};
  const fallbackName = toTitle(meta.full_name || meta.name || emailPrefix(authEmail) || 'Usuário');
  const resolvedName = String(profile?.name || fallbackName).trim();
  const resolvedNickname = String(profile?.nickname || resolvedName.split(' ')[0] || emailPrefix(authEmail) || 'Usuário').trim();

  return {
    uid: String(profile?.uid || authId),
    email: authEmail,
    name: resolvedName,
    nickname: resolvedNickname,
    role: String(profile?.role || meta.role || 'Colaborador'),
    company: String(profile?.company || 'GrupoB'),
    workspaceId: profile?.workspaceId,
    avatarUrl: String(profile?.avatarUrl || meta.avatar_url || meta.picture || ''),
    tier: profile?.tier || 'OPERACIONAL',
    createdAt: profile?.createdAt || new Date()
  };
};