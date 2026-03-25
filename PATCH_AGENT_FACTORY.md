# Patch para AgentFactory.tsx - Adicionar Autorização de Usuários

## Alterações necessárias:

### 1. Adicionar import do serviço authAdmin
```typescript
import { authAdminService } from '../services/authAdmin';
```

### 2. Adicionar estados para autorização
```typescript
const [isAuthorizing, setIsAuthorizing] = useState(false);
const [authorizationResult, setAuthorizationResult] = useState<{
  success: boolean;
  message: string;
  userId?: string;
} | null>(null);
```

### 3. Adicionar função para autorizar humano
```typescript
const handleAuthorizeHuman = async (agent: Agent, method: 'create' | 'invite' = 'invite') => {
  if (isAuthorizing) return;
  
  setIsAuthorizing(true);
  setAuthorizationResult(null);
  
  try {
    const result = await authAdminService.authorizeHuman(agent, method);
    
    setAuthorizationResult(result);
    
    if (result.success && result.userId) {
      // Atualizar o agente com o authUserId
      const updatedAgent = { ...agent, authUserId: result.userId };
      
      // Atualizar no banco de dados
      await updateDoc(doc(db, 'agents', agent.id), {
        authUserId: result.userId
      });
      
      // Atualizar na lista local
      onActivate(updatedAgent);
      
      // Se estiver editando este agente, atualizar o formulário
      if (editingAgentId === agent.id) {
        setForm(prev => ({ ...prev, authUserId: result.userId || '' }));
      }
      
      window.alert(`Autorização realizada com sucesso! ${result.message}`);
    } else {
      window.alert(`Falha na autorização: ${result.message}`);
    }
  } catch (error: any) {
    console.error('Error authorizing human:', error);
    setAuthorizationResult({
      success: false,
      message: error.message || 'Erro desconhecido durante autorização'
    });
    window.alert(`Erro durante autorização: ${error.message || 'Erro desconhecido'}`);
  } finally {
    setIsAuthorizing(false);
  }
};
```

### 4. Adicionar botão na tabela (na coluna de ações)
```typescript
// Dentro do map de filteredAgents, na coluna de ações:
{isHumanStructuralEntity(agent) && !agent.authUserId && (
  <button 
    onClick={() => handleAuthorizeHuman(agent)}
    disabled={isAuthorizing}
    className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
    title="Autorizar Usuário"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  </button>
)}
```

### 5. Adicionar seção de autorização no formulário (após a seção de email)
```typescript
{form.entityType !== 'AGENTE' && form.email && !form.authUserId && (
  <div className="space-y-3 rounded-2xl border border-gray-200 bg-blue-50/30 p-4">
    <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-600">Autorização de Usuário</h4>
    <p className="text-[10px] font-semibold text-gray-600">
      Este humano ainda não tem uma conta de autenticação no sistema. 
      Você pode criar uma conta segura ou enviar um convite por email.
    </p>
    
    {authorizationResult && (
      <div className={`rounded-xl p-3 text-[10px] font-semibold ${authorizationResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {authorizationResult.message}
      </div>
    )}
    
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleAuthorizeHuman(currentEditingAgent || form, 'invite')}
        disabled={isAuthorizing || !form.email}
        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-100 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-blue-700 transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAuthorizing ? (
          <>
            <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Enviar Convite por Email
          </>
        )}
      </button>
      
      <button
        onClick={() => handleAuthorizeHuman(currentEditingAgent || form, 'create')}
        disabled={isAuthorizing || !form.email}
        className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-100 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-green-700 transition hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAuthorizing ? (
          <>
            <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Criando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Criar Usuário com Senha
          </>
        )}
      </button>
      
      <div className="text-[9px] font-semibold text-gray-500 flex-1">
        <p><strong>Convite:</strong> Mais seguro - o usuário define sua própria senha</p>
        <p><strong>Criação:</strong> Mais rápido - senha é gerada automaticamente</p>
      </div>
    </div>
  </div>
)}
```

### 6. Adicionar ícone de autorização (se necessário)
Adicionar um ícone SVG para o botão de autorização ou usar um ícone existente.

### 7. Atualizar a função buildAgentPayload para incluir authUserId
A função já inclui authUserId, mas vamos garantir que ela esteja sendo passada corretamente.

### 8. Adicionar verificação de permissão
Adicionar verificação se o usuário atual tem permissão para autorizar outros usuários.