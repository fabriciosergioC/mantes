// Configuração do Nhost
const NHOST_CONFIG = {
  backendUrl: 'http://localhost:1337', // Padrão para dev local
  hasuraAdminSecret: 'admin-secret-for-local-dev',
};

// Carregar variáveis de ambiente se disponível
if (import.meta.env) {
  NHOST_CONFIG.backendUrl = import.meta.env.VITE_NHOST_BACKEND_URL || NHOST_CONFIG.backendUrl;
  NHOST_CONFIG.hasuraAdminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET || NHOST_CONFIG.hasuraAdminSecret;
}

// Exportar configuração
export { NHOST_CONFIG };

// Função para fazer requisições GraphQL
export const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(`${NHOST_CONFIG.backendUrl}/v1/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': NHOST_CONFIG.hasuraAdminSecret,
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Erro no GraphQL');
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

// Funções de autenticação (usando Nhost Auth API)
export const auth = {
  // Login
  signIn: async (email, password) => {
    const response = await fetch(`${NHOST_CONFIG.backendUrl}/auth/signin/email-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Erro no login');
    }
    
    // Salvar sessão
    if (result.session) {
      localStorage.setItem('nhost_session', JSON.stringify(result.session));
    }
    
    return result;
  },
  
  // Logout
  signOut: () => {
    localStorage.removeItem('nhost_session');
  },
  
  // Obter sessão atual
  getSession: () => {
    const session = localStorage.getItem('nhost_session');
    return session ? JSON.parse(session) : null;
  },
  
  // Registro
  signUp: async (email, password, options = {}) => {
    const response = await fetch(`${NHOST_CONFIG.backendUrl}/auth/signup/email-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        ...options 
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Erro no registro');
    }
    
    return result;
  },
};
