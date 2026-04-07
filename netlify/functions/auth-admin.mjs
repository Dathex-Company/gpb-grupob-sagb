// netlify/functions/auth-admin.mjs
// Função server-side para operações administrativas de autenticação com RBAC real
// Nunca expor service_role no frontend

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const ACTIONS = {
  GET_PERMISSIONS: 'get_permissions',
  CREATE_USER: 'create_user',
  INVITE_USER: 'invite_user',
  LINK_USER: 'link_user',
  LIST_USERS: 'list_users'
};

const BASE_ROLES = new Set([
  'owner',
  'workspace_owner',
  'admin',
  'workspace_admin',
  'manager',
  'maintainer',
  'security_admin'
]);

const ELEVATED_ROLES = new Set([
  'owner',
  'workspace_owner',
  'admin',
  'workspace_admin',
  'security_admin',
  'super_admin',
  'root'
]);

const pickFirst = (...values) => values.find((value) => String(value || '').trim()) || '';
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizeRole = (value) => String(value || '').trim().toLowerCase();

const resolveSupabaseRuntimeConfig = () => {
  const supabaseUrl = pickFirst(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_URL);
  const supabaseServiceKey = pickFirst(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SERVICE_KEY,
    process.env.SUPABASE_SECRET_KEY
  );
  const supabaseAnonKey = pickFirst(process.env.VITE_SUPABASE_ANON_KEY, process.env.SUPABASE_ANON_KEY);
  return { supabaseUrl, supabaseServiceKey, supabaseAnonKey };
};

const getMissingSupabaseVars = ({ supabaseUrl, supabaseServiceKey, supabaseAnonKey }) => {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL (ou SUPABASE_URL)');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SERVICE_KEY)');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY (ou SUPABASE_ANON_KEY)');
  return missing;
};

const createSupabaseAdmin = (supabaseUrl, supabaseServiceKey) =>
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  },
  body: JSON.stringify(data)
});

const failIfSupabaseMisconfigured = (cfg) => {
  const missing = getMissingSupabaseVars(cfg);
  if (!missing.length) return null;

  console.error('[auth-admin] Missing Supabase environment variables:', missing.join(', '));
  return jsonResponse(500, {
    success: false,
    error: 'Supabase environment variables missing',
    missing
  });
};

const readWorkspaceIds = (payload, headers) => {
  const payloadWorkspaceId = String(payload?.workspaceId || '').trim();
  const headerWorkspaceId = String(headers?.['x-workspace-id'] || headers?.['X-Workspace-Id'] || '').trim();
  const payloadWorkspaceIds = Array.isArray(payload?.workspaceIds)
    ? payload.workspaceIds.map((id) => String(id || '').trim()).filter(Boolean)
    : [];

  const set = new Set([payloadWorkspaceId, headerWorkspaceId, ...payloadWorkspaceIds].filter(Boolean));
  return Array.from(set);
};

const buildActionPermissions = ({ roles, isSuperAdmin }) => {
  const normalizedRoles = (roles || []).map(normalizeRole);
  const hasBaseRole = normalizedRoles.some((role) => BASE_ROLES.has(role));
  const hasElevatedRole = normalizedRoles.some((role) => ELEVATED_ROLES.has(role));

  const canInvite = isSuperAdmin || hasBaseRole;
  const canCreate = isSuperAdmin || hasElevatedRole;

  return {
    canInvite,
    canLink: canInvite,
    canCreate,
    canList: canCreate
  };
};

const forbiddenForAction = (action, permissions) =>
  jsonResponse(403, {
    success: false,
    error: 'Forbidden',
    message: `Permissão insuficiente para ação: ${action}`,
    permissions
  });

const validateAdminPermission = async (authToken, cfg, supabaseAdmin, workspaceIds) => {
  if (!authToken) return { ok: false };

  try {
    const supabasePublic = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const {
      data: { user },
      error
    } = await supabasePublic.auth.getUser(authToken);

    if (error || !user) return { ok: false };

    const isSuperAdmin =
      Boolean(user?.app_metadata?.is_super_admin) ||
      Boolean(user?.user_metadata?.is_super_admin) ||
      ELEVATED_ROLES.has(normalizeRole(user?.app_metadata?.role)) ||
      ELEVATED_ROLES.has(normalizeRole(user?.user_metadata?.role));

    let membershipRows = [];
    let query = supabaseAdmin
      .from('workspace_members')
      .select('workspace_id, role, status')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (workspaceIds.length === 1) {
      query = query.eq('workspace_id', workspaceIds[0]);
    } else if (workspaceIds.length > 1) {
      query = query.in('workspace_id', workspaceIds);
    }

    const { data: memberships, error: membershipsError } = await query;
    if (!membershipsError && Array.isArray(memberships)) {
      membershipRows = memberships;
    }

    const roles = membershipRows.map((m) => normalizeRole(m.role));
    const permissions = buildActionPermissions({ roles, isSuperAdmin });
    const hasAnyPermission = permissions.canInvite || permissions.canCreate || permissions.canLink || permissions.canList;

    return {
      ok: hasAnyPermission,
      user,
      permissions,
      context: {
        workspaceIds,
        roles,
        isSuperAdmin,
        memberships: membershipRows.length
      }
    };
  } catch (error) {
    console.error('[auth-admin] Error validating admin permission:', error);
    return { ok: false };
  }
};

const generateSecurePassword = () => {
  const raw = randomBytes(24).toString('base64url');
  const withSymbols = `${raw}#A1!`;
  return withSymbols.slice(0, 20);
};

const isAlreadyRegisteredError = (message) => {
  const normalized = String(message || '').toLowerCase();
  return normalized.includes('already registered') || normalized.includes('already exists');
};

const findAuthUserByEmail = async (supabaseAdmin, email) => {
  const target = normalizeEmail(email);
  const perPage = 200;

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const users = data?.users || [];
    const found = users.find((u) => normalizeEmail(u?.email) === target);
    if (found) return found;

    if (users.length < perPage) break;
  }

  return null;
};

const tryLinkAgentAuthUser = async (supabaseAdmin, agentId, authUserId) => {
  if (!agentId || !authUserId) return { linked: false, reason: 'missing_agent_or_user' };

  const attempts = [
    { column: 'auth_user_id', payload: { auth_user_id: authUserId, updated_at: new Date().toISOString() } },
    { column: 'authUserId', payload: { authUserId: authUserId, updated_at: new Date().toISOString() } }
  ];

  for (const attempt of attempts) {
    const { error } = await supabaseAdmin.from('agents').update(attempt.payload).eq('id', agentId);
    if (!error) return { linked: true, strategy: attempt.column };

    const message = String(error?.message || '').toLowerCase();
    const isMissingColumn = message.includes('column') && message.includes('does not exist');
    if (!isMissingColumn) {
      return { linked: false, reason: error.message || 'update_failed' };
    }
  }

  return { linked: false, reason: 'auth_link_column_not_found' };
};

const validateEmailAndName = (email, name) => {
  if (!email || !name) {
    return jsonResponse(400, {
      success: false,
      error: 'Bad Request',
      message: 'Email e nome são obrigatórios'
    });
  }
  return null;
};

export async function handler(event) {
  const cfg = resolveSupabaseRuntimeConfig();
  const misconfiguredResponse = failIfSupabaseMisconfigured(cfg);
  if (misconfiguredResponse) return misconfiguredResponse;

  const supabaseAdmin = createSupabaseAdmin(cfg.supabaseUrl, cfg.supabaseServiceKey);

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, {
      success: false,
      error: 'Method not allowed',
      message: 'Apenas requisições POST são permitidas'
    });
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse(401, {
      success: false,
      error: 'Unauthorized',
      message: 'Token de autenticação não fornecido'
    });
  }

  const authToken = authHeader.substring(7);

  try {
    const payload = JSON.parse(event.body || '{}');
    const { action, email, name, agentId, userId } = payload;

    if (!action) {
      return jsonResponse(400, {
        success: false,
        error: 'Bad Request',
        message: 'Ação não especificada'
      });
    }

    const workspaceIds = readWorkspaceIds(payload, event.headers || {});
    const authorization = await validateAdminPermission(authToken, cfg, supabaseAdmin, workspaceIds);

    if (!authorization.ok) {
      return jsonResponse(403, {
        success: false,
        error: 'Forbidden',
        message: 'Permissão insuficiente para operações administrativas de Auth'
      });
    }

    const permissions = authorization.permissions;

    if (action === ACTIONS.GET_PERMISSIONS) {
      return jsonResponse(200, {
        success: true,
        permissions: {
          actions: {
            inviteUser: Boolean(permissions.canInvite),
            createUser: Boolean(permissions.canCreate),
            linkUser: Boolean(permissions.canLink),
            listUsers: Boolean(permissions.canList)
          }
        },
        context: authorization.context
      });
    }

    switch (action) {
      case ACTIONS.CREATE_USER: {
        if (!permissions.canCreate) return forbiddenForAction(action, permissions);

        const validation = validateEmailAndName(email, name);
        if (validation) return validation;

        const normalizedEmail = normalizeEmail(email);
        const password = generateSecurePassword();

        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
          user_metadata: {
            name: String(name || '').trim(),
            agentId: agentId || null,
            created_via: 'quadro_de_elite'
          }
        });

        if (userError) {
          if (isAlreadyRegisteredError(userError.message)) {
            const existingUser = await findAuthUserByEmail(supabaseAdmin, normalizedEmail);
            if (existingUser) {
              const linkResult = await tryLinkAgentAuthUser(supabaseAdmin, agentId, existingUser.id);
              return jsonResponse(200, {
                success: true,
                existingUser: true,
                reconciled: true,
                userId: existingUser.id,
                email: existingUser.email,
                message: 'Usuário já existia no Auth e foi reconciliado para vinculação.',
                linkStatus: linkResult
              });
            }
          }
          throw userError;
        }

        const linkResult = await tryLinkAgentAuthUser(supabaseAdmin, agentId, userData?.user?.id);
        console.log(`[auth-admin] User created: ${userData?.user?.email} (${userData?.user?.id}) agent=${agentId || 'N/A'}`);

        return jsonResponse(200, {
          success: true,
          userId: userData?.user?.id,
          email: userData?.user?.email,
          name: userData?.user?.user_metadata?.name || name,
          message: 'Usuário criado com sucesso.',
          linkStatus: linkResult
        });
      }

      case ACTIONS.INVITE_USER: {
        if (!permissions.canInvite) return forbiddenForAction(action, permissions);

        const validation = validateEmailAndName(email, name);
        if (validation) return validation;

        const normalizedEmail = normalizeEmail(email);
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
          data: {
            name: String(name || '').trim(),
            agentId: agentId || null,
            invited_via: 'quadro_de_elite'
          }
        });

        if (inviteError) {
          if (isAlreadyRegisteredError(inviteError.message)) {
            const existingUser = await findAuthUserByEmail(supabaseAdmin, normalizedEmail);
            if (existingUser) {
              const linkResult = await tryLinkAgentAuthUser(supabaseAdmin, agentId, existingUser.id);
              return jsonResponse(200, {
                success: true,
                existingUser: true,
                reconciled: true,
                userId: existingUser.id,
                email: existingUser.email,
                message: 'Usuário já estava registrado no Auth. Conciliação de vínculo preparada.',
                linkStatus: linkResult
              });
            }
          }
          throw inviteError;
        }

        const resolvedUserId = inviteData?.user?.id || null;
        const linkResult = await tryLinkAgentAuthUser(supabaseAdmin, agentId, resolvedUserId);
        console.log(`[auth-admin] User invited: ${normalizedEmail} (${resolvedUserId || 'unknown'}) agent=${agentId || 'N/A'}`);

        return jsonResponse(200, {
          success: true,
          userId: resolvedUserId,
          email: normalizedEmail,
          message: 'Convite enviado por e-mail com sucesso.',
          linkStatus: linkResult
        });
      }

      case ACTIONS.LINK_USER: {
        if (!permissions.canLink) return forbiddenForAction(action, permissions);
        if (!userId) {
          return jsonResponse(400, {
            success: false,
            error: 'Bad Request',
            message: 'userId é obrigatório para vincular usuário'
          });
        }

        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData?.user) {
          return jsonResponse(404, {
            success: false,
            error: 'Not Found',
            message: 'Usuário não encontrado'
          });
        }

        const linkResult = await tryLinkAgentAuthUser(supabaseAdmin, agentId, userData.user.id);
        return jsonResponse(200, {
          success: true,
          userId: userData.user.id,
          email: userData.user.email,
          name: userData.user.user_metadata?.name || 'Usuário',
          message: 'Usuário válido para vinculação.',
          linkStatus: linkResult
        });
      }

      case ACTIONS.LIST_USERS: {
        if (!permissions.canList) return forbiddenForAction(action, permissions);

        const page = Number(payload?.page || 1);
        const limit = Math.min(100, Math.max(1, Number(payload?.limit || 50)));

        const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage: limit
        });

        if (listError) throw listError;

        const safeUsers = (data?.users || []).map((user) => ({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
          isConfirmed: user.email_confirmed_at !== null,
          metadata: {
            agentId: user.user_metadata?.agentId,
            createdVia: user.user_metadata?.created_via || user.user_metadata?.invited_via
          }
        }));

        return jsonResponse(200, {
          success: true,
          users: safeUsers,
          pagination: {
            page,
            limit,
            total: safeUsers.length,
            hasMore: safeUsers.length >= limit
          }
        });
      }

      default:
        return jsonResponse(400, {
          success: false,
          error: 'Bad Request',
          message: `Ação não reconhecida: ${action}`
        });
    }
  } catch (error) {
    console.error('[auth-admin] error:', error);
    let statusCode = 500;
    let errorMessage = 'Erro interno do servidor';

    const raw = String(error?.message || '').toLowerCase();
    if (raw.includes('rate limit') || raw.includes('too many requests')) {
      statusCode = 429;
      errorMessage = 'Muitas requisições. Tente novamente mais tarde.';
    } else if (raw.includes('invalid') || raw.includes('validation')) {
      statusCode = 400;
      errorMessage = 'Dados inválidos fornecidos';
    }

    return jsonResponse(statusCode, {
      success: false,
      error: 'Internal Server Error',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}