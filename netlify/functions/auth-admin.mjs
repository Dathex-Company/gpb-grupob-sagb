// netlify/functions/auth-admin.mjs
// Função segura server-side para operações administrativas de autenticação
// Nunca expor service_role no frontend

import { createClient } from '@supabase/supabase-js';

const pickFirst = (...values) => values.find((value) => String(value || '').trim()) || '';

const resolveSupabaseRuntimeConfig = () => {
  const supabaseUrl = pickFirst(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_URL
  );

  const supabaseServiceKey = pickFirst(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SERVICE_KEY,
    process.env.SUPABASE_SECRET_KEY
  );

  const supabaseAnonKey = pickFirst(
    process.env.VITE_SUPABASE_ANON_KEY,
    process.env.SUPABASE_ANON_KEY
  );

  return { supabaseUrl, supabaseServiceKey, supabaseAnonKey };
};

const getMissingSupabaseVars = ({ supabaseUrl, supabaseServiceKey, supabaseAnonKey }) => {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL (ou SUPABASE_URL)');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SERVICE_KEY)');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY (ou SUPABASE_ANON_KEY)');
  return missing;
};

const createSupabaseAdmin = (supabaseUrl, supabaseServiceKey) => createClient(supabaseUrl, supabaseServiceKey, {
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
    'Pragma': 'no-cache',
    'Expires': '0'
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

// Verifica se o usuário que faz a requisição tem permissão de admin
const validateAdminPermission = async (authToken, cfg) => {
  if (!authToken) return false;
  
  try {
    // Verifica o token com a API pública (anon key)
    const supabasePublic = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    const { data: { user }, error } = await supabasePublic.auth.getUser(authToken);
    
    if (error || !user) return false;
    
    // Aqui você pode adicionar lógica adicional para verificar se o usuário é admin
    // Por exemplo, verificar em uma tabela de administradores
    // Por enquanto, permitimos apenas se o usuário estiver autenticado
    return true;
  } catch (error) {
    console.error('Error validating admin permission:', error);
    return false;
  }
};

const generateSecurePassword = () => {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const crypto = globalThis.crypto || require('crypto');
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
};

export async function handler(event) {
  const cfg = resolveSupabaseRuntimeConfig();
  const misconfiguredResponse = failIfSupabaseMisconfigured(cfg);
  if (misconfiguredResponse) return misconfiguredResponse;

  const supabaseAdmin = createSupabaseAdmin(cfg.supabaseUrl, cfg.supabaseServiceKey);

  // Verificar método
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { 
      success: false, 
      error: 'Method not allowed',
      message: 'Apenas requisições POST são permitidas'
    });
  }

  // Verificar autenticação
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse(401, { 
      success: false, 
      error: 'Unauthorized',
      message: 'Token de autenticação não fornecido'
    });
  }

  const authToken = authHeader.substring(7); // Remove "Bearer "

  // Validar permissão do usuário
  const hasPermission = await validateAdminPermission(authToken, cfg);
  if (!hasPermission) {
    return jsonResponse(403, { 
      success: false, 
      error: 'Forbidden',
      message: 'Permissão insuficiente para realizar esta operação'
    });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { action, email, name, agentId, userId } = payload;

    // Validações básicas
    if (!action) {
      return jsonResponse(400, { 
        success: false, 
        error: 'Bad Request',
        message: 'Ação não especificada'
      });
    }

    switch (action) {
      case 'create_user': {
        // Criar usuário com senha gerada
        if (!email || !name) {
          return jsonResponse(400, { 
            success: false, 
            error: 'Bad Request',
            message: 'Email e nome são obrigatórios'
          });
        }

        const password = generateSecurePassword();
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: email.trim().toLowerCase(),
          password,
          email_confirm: true, // Confirmar email automaticamente
          user_metadata: { 
            name: name.trim(),
            agentId: agentId || null,
            created_via: 'quadro_de_elite'
          }
        });

        if (userError) {
          console.error('Error creating user:', userError);
          
          // Tratar erros comuns
          if (userError.message.includes('already registered')) {
            return jsonResponse(409, { 
              success: false, 
              error: 'Conflict',
              message: 'Usuário já registrado com este email'
            });
          }
          
          throw userError;
        }

        // Registrar a criação para auditoria
        console.log(`User created: ${userData.user.email} (${userData.user.id}) for agent: ${agentId || 'N/A'}`);

        return jsonResponse(200, {
          success: true,
          userId: userData.user.id,
          email: userData.user.email,
          name: userData.user.user_metadata?.name || name,
          password, // Retornar apenas para admin (em produção, considerar enviar por email separado)
          message: 'Usuário criado com sucesso. A senha foi gerada automaticamente.'
        });
      }

      case 'invite_user': {
        // Enviar convite por email (mais seguro)
        if (!email || !name) {
          return jsonResponse(400, { 
            success: false, 
            error: 'Bad Request',
            message: 'Email e nome são obrigatórios'
          });
        }

        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim().toLowerCase(), {
          data: { 
            name: name.trim(),
            agentId: agentId || null,
            invited_via: 'quadro_de_elite'
          }
        });

        if (inviteError) {
          console.error('Error inviting user:', inviteError);
          
          if (inviteError.message.includes('already registered')) {
            return jsonResponse(409, { 
              success: false, 
              error: 'Conflict',
              message: 'Usuário já registrado com este email'
            });
          }
          
          throw inviteError;
        }

        console.log(`User invited: ${email} (${inviteData.user?.id || 'unknown'}) for agent: ${agentId || 'N/A'}`);

        return jsonResponse(200, {
          success: true,
          message: 'Convite enviado por email com sucesso',
          userId: inviteData.user?.id || null,
          email: email
        });
      }

      case 'link_user': {
        // Vincular humano a usuário existente (apenas retorna o userId para uso no frontend)
        if (!userId) {
          return jsonResponse(400, { 
            success: false, 
            error: 'Bad Request',
            message: 'userId é obrigatório para vincular usuário'
          });
        }

        // Verificar se o usuário existe
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (userError || !userData.user) {
          return jsonResponse(404, { 
            success: false, 
            error: 'Not Found',
            message: 'Usuário não encontrado'
          });
        }

        return jsonResponse(200, {
          success: true,
          userId: userData.user.id,
          email: userData.user.email,
          name: userData.user.user_metadata?.name || 'Usuário',
          message: 'Usuário válido para vinculação'
        });
      }

      case 'list_users': {
        // Listar usuários (com paginação para segurança)
        const { page = 1, limit = 50 } = payload;
        const offset = (page - 1) * limit;

        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page: page,
          perPage: limit
        });

        if (listError) throw listError;

        // Filtrar informações sensíveis
        const safeUsers = (users.users || []).map(user => ({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
          isConfirmed: user.email_confirmed_at !== null,
          metadata: {
            agentId: user.user_metadata?.agentId,
            createdVia: user.user_metadata?.created_via
          }
        }));

        return jsonResponse(200, {
          success: true,
          users: safeUsers,
          pagination: {
            page,
            limit,
            total: users.users?.length || 0,
            hasMore: (users.users?.length || 0) >= limit
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
    console.error('Auth admin error:', error);
    
    // Determinar código de status apropriado
    let statusCode = 500;
    let errorMessage = 'Erro interno do servidor';
    
    if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
      statusCode = 429;
      errorMessage = 'Muitas requisições. Tente novamente mais tarde.';
    } else if (error.message?.includes('invalid') || error.message?.includes('validation')) {
      statusCode = 400;
      errorMessage = 'Dados inválidos fornecidos';
    }
    
    return jsonResponse(statusCode, {
      success: false,
      error: 'Internal Server Error',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}