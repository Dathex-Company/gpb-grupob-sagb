// services/authAdmin.ts
// Serviço para chamar a função server-side de autorização de usuários

import { auth } from './supabase';

export interface CreateUserRequest {
  email: string;
  name: string;
  agentId?: string;
  workspaceId?: string;
}

export interface CreateUserResponse {
  success: boolean;
  userId?: string;
  email?: string;
  name?: string;
  existingUser?: boolean;
  reconciled?: boolean;
  linkStatus?: {
    linked: boolean;
    strategy?: string;
    reason?: string;
  };
  message?: string;
  error?: string;
}

export interface InviteUserRequest {
  email: string;
  name: string;
  agentId?: string;
  workspaceId?: string;
}

export interface InviteUserResponse {
  success: boolean;
  userId?: string;
  email?: string;
  existingUser?: boolean;
  reconciled?: boolean;
  linkStatus?: {
    linked: boolean;
    strategy?: string;
    reason?: string;
  };
  message?: string;
  error?: string;
}

export interface LinkUserRequest {
  userId: string;
  agentId?: string;
  workspaceId?: string;
}

export interface LinkUserResponse {
  success: boolean;
  userId?: string;
  email?: string;
  name?: string;
  message?: string;
  error?: string;
}

export interface ListUsersRequest {
  page?: number;
  limit?: number;
  workspaceId?: string;
}

export interface AuthAdminPermissions {
  inviteUser: boolean;
  createUser: boolean;
  linkUser: boolean;
  listUsers: boolean;
}

export interface GetPermissionsResponse {
  success: boolean;
  permissions: {
    actions: AuthAdminPermissions;
  };
  context?: {
    workspaceIds?: string[];
    roles?: string[];
    isSuperAdmin?: boolean;
    memberships?: number;
  };
  error?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignIn?: string;
  isConfirmed: boolean;
  metadata: {
    agentId?: string;
    createdVia?: string;
  };
}

export interface ListUsersResponse {
  success: boolean;
  users: UserInfo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  error?: string;
}

class AuthAdminService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/.netlify/functions/auth-admin';
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Obter o token de acesso atual do Supabase
      const session = (auth as any).getStoredSession?.();
      if (session?.access_token) {
        return session.access_token;
      }

      // Alternativa: tentar obter do currentUser
      const currentUser = auth.currentUser;
      if (currentUser && (auth as any).getStoredSession) {
        const storedSession = (auth as any).getStoredSession();
        return storedSession?.access_token || null;
      }

      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(action: string, payload: any): Promise<T> {
    const authToken = await this.getAuthToken();
    
    if (!authToken) {
      throw new Error('Usuário não autenticado. Faça login para realizar esta operação.');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        action,
        ...payload
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Erro ${response.status}: ${response.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.message || data.error || 'Operação falhou');
    }

    return data as T;
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      return await this.makeRequest<CreateUserResponse>('create_user', request);
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao criar usuário'
      };
    }
  }

  async inviteUser(request: InviteUserRequest): Promise<InviteUserResponse> {
    try {
      return await this.makeRequest<InviteUserResponse>('invite_user', request);
    } catch (error) {
      console.error('Error inviting user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao convidar usuário'
      };
    }
  }

  async linkUser(request: LinkUserRequest): Promise<LinkUserResponse> {
    try {
      return await this.makeRequest<LinkUserResponse>('link_user', request);
    } catch (error) {
      console.error('Error linking user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao vincular usuário'
      };
    }
  }

  async listUsers(request: ListUsersRequest = {}): Promise<ListUsersResponse> {
    try {
      return await this.makeRequest<ListUsersResponse>('list_users', request);
    } catch (error) {
      console.error('Error listing users:', error);
      return {
        success: false,
        users: [],
        pagination: {
          page: request.page || 1,
          limit: request.limit || 50,
          total: 0,
          hasMore: false
        },
        error: error instanceof Error ? error.message : 'Erro desconhecido ao listar usuários'
      };
    }
  }

  async getPermissions(workspaceId?: string): Promise<AuthAdminPermissions> {
    try {
      const response = await this.makeRequest<GetPermissionsResponse>('get_permissions', {
        workspaceId: workspaceId || undefined
      });

      return {
        inviteUser: Boolean(response?.permissions?.actions?.inviteUser),
        createUser: Boolean(response?.permissions?.actions?.createUser),
        linkUser: Boolean(response?.permissions?.actions?.linkUser),
        listUsers: Boolean(response?.permissions?.actions?.listUsers)
      };
    } catch (error) {
      console.error('Error loading auth admin permissions:', error);
      return {
        inviteUser: false,
        createUser: false,
        linkUser: false,
        listUsers: false
      };
    }
  }

  // Método auxiliar para verificar se um humano pode ser autorizado
  canAuthorizeHuman(agent: any): { canAuthorize: boolean; reason?: string } {
    if (!agent) {
      return { canAuthorize: false, reason: 'Agente não encontrado' };
    }

    const entityType = String(agent.entityType || '').toUpperCase();
    const collaboratorType = String(agent.collaboratorType || '').toUpperCase();
    
    const isHuman = entityType === 'HUMANO' || entityType === 'HIBRIDO' || 
                    collaboratorType === 'HUMANO' || collaboratorType === 'HIBRIDO';
    
    if (!isHuman) {
      return { canAuthorize: false, reason: 'Apenas humanos ou híbridos podem ser autorizados' };
    }

    if (agent.authUserId) {
      return { canAuthorize: false, reason: 'Usuário já autorizado' };
    }

    if (!agent.email) {
      return { canAuthorize: false, reason: 'Email é obrigatório para autorização' };
    }

    return { canAuthorize: true };
  }

  // Método para autorizar um humano (fluxo completo)
  async authorizeHuman(
    agent: any,
    method: 'create' | 'invite' = 'invite',
    options?: { workspaceId?: string }
  ): Promise<{
    success: boolean;
    userId?: string;
    message: string;
    error?: string;
  }> {
    const { canAuthorize, reason } = this.canAuthorizeHuman(agent);
    
    if (!canAuthorize) {
      return {
        success: false,
        message: reason || 'Não é possível autorizar este humano'
      };
    }

    try {
      if (method === 'create') {
        const result = await this.createUser({
          email: agent.email,
          name: agent.name,
          agentId: agent.id,
          ...(options?.workspaceId ? { workspaceId: options.workspaceId } : {})
        });

        if (result.success && result.userId) {
          return {
            success: true,
            userId: result.userId,
            message: result.message || 'Usuário criado com sucesso'
          };
        } else {
          return {
            success: false,
            message: result.error || 'Falha ao criar usuário'
          };
        }
      } else {
        const result = await this.inviteUser({
          email: agent.email,
          name: agent.name,
          agentId: agent.id,
          ...(options?.workspaceId ? { workspaceId: options.workspaceId } : {})
        });

        if (result.success) {
          return {
            success: true,
            userId: result.userId,
            message: result.message || 'Convite enviado com sucesso'
          };
        } else {
          return {
            success: false,
            message: result.error || 'Falha ao enviar convite'
          };
        }
      }
    } catch (error) {
      console.error('Error authorizing human:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido durante autorização'
      };
    }
  }
}

export const authAdminService = new AuthAdminService();