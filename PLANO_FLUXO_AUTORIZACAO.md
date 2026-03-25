# Plano de Implementação: Fluxo Seguro de Autorização Humana

## Contexto
O sistema SagB já possui:
1. Quadro de Elite para cadastro estrutural de humanos e agentes
2. Campo `authUserId` no formulário para vincular a usuário Supabase existente
3. Integração Supabase Auth funcionando para login básico
4. Funções server-side Netlify Functions para operações seguras

## Problema
Falta um fluxo seguro para transformar humanos cadastrados no Quadro de Elite em usuários autorizados reais do sistema com autenticação segura.

## Solução Proposta

### 1. Função Server-Side para Criação Segura de Usuários
**Arquivo:** `netlify/functions/auth-admin.mjs`
**Objetivo:** Criar usuários no Supabase Auth usando service_role (server-side)
**Segurança:** Nunca expor service_role no frontend

**Funcionalidades:**
- `createUser`: Cria usuário com email e senha gerada
- `inviteUser`: Envia convite por email (opção mais segura)
- `linkExistingUser`: Vincula humano existente a usuário Supabase já criado

### 2. Atualização do Quadro de Elite
**Arquivo:** `components/AgentFactory.tsx`
**Objetivo:** Adicionar botão "Autorizar Usuário" para humanos/híbridos

**Fluxo no frontend:**
1. Botão "Autorizar Usuário" aparece para humanos/híbridos sem `authUserId`
2. Ao clicar, chama função server-side para criar usuário
3. Recebe `authUserId` e atualiza cadastro humano
4. Mostra status: "Autorizado", "Convite enviado", etc.

### 3. Persistência do auth_user_id
**Arquivo:** `services/supabase.ts` (normalização de agentes)
**Objetivo:** Garantir que `authUserId` seja persistido corretamente

### 4. Resolução de Perfil Autenticado
**Arquivo:** `utils/humanIdentity.ts`
**Objetivo:** Melhorar lógica para detectar humanos autenticados

## Implementação Detalhada

### Passo 1: Criar função auth-admin.mjs

```javascript
// netlify/functions/auth-admin.mjs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

export async function handler(event) {
  // Verificar método
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  // Verificar autenticação (opcional: token de admin)
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { action, email, name, agentId } = payload;

    switch (action) {
      case 'create_user':
        // Criar usuário com senha gerada
        const password = generateSecurePassword();
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Confirmar email automaticamente
          user_metadata: { name, agentId }
        });

        if (userError) throw userError;

        return jsonResponse(200, {
          success: true,
          userId: userData.user.id,
          email: userData.user.email,
          password // Retornar apenas para admin (em produção, enviar por email)
        });

      case 'invite_user':
        // Enviar convite por email (mais seguro)
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          data: { name, agentId }
        });

        if (inviteError) throw inviteError;

        return jsonResponse(200, {
          success: true,
          message: 'Convite enviado por email',
          userId: inviteData.user.id
        });

      case 'link_user':
        // Vincular humano a usuário existente
        const { userId } = payload;
        return jsonResponse(200, {
          success: true,
          userId,
          message: 'Usuário vinculado com sucesso'
        });

      default:
        return jsonResponse(400, { error: 'Ação não reconhecida' });
    }
  } catch (error) {
    console.error('Auth admin error:', error);
    return jsonResponse(500, {
      error: 'Erro interno',
      message: error.message
    });
  }
}

function generateSecurePassword() {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
```

### Passo 2: Adicionar variáveis de ambiente
Adicionar ao `.env.example`:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Passo 3: Atualizar AgentFactory.tsx

Adicionar:
1. Botão "Autorizar Usuário" na interface
2. Lógica para chamar função server-side
3. Atualização do campo `authUserId` após sucesso

### Passo 4: Atualizar humanIdentity.ts

Melhorar `resolveHumanAccessStatus` para:
1. Verificar se `authUserId` existe e é válido
2. Verificar se usuário está autenticado na sessão atual
3. Retornar status mais preciso

### Passo 5: Testar fluxo completo

## Considerações de Segurança

1. **Service Role nunca no frontend**: Apenas em funções server-side
2. **Validação de permissões**: Verificar se quem chama a função tem permissão
3. **Logs de auditoria**: Registrar todas as criações de usuário
4. **Senhas seguras**: Gerar senhas fortes ou usar convites por email
5. **Rate limiting**: Prevenir abuso da função

## Próximos Passos

1. [ ] Criar função `auth-admin.mjs`
2. [ ] Adicionar variáveis de ambiente necessárias
3. [ ] Atualizar Quadro de Elite com botão de autorização
4. [ ] Implementar chamada à função server-side
5. [ ] Atualizar persistência do authUserId
6. [ ] Melhorar lógica de resolução de status humano
7. [ ] Testar fluxo completo
8. [ ] Adicionar logs de auditoria