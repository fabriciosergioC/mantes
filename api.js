// API Configuration
// Em produção, a API está no mesmo domínio (/api)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Auth functions
export const auth = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro no login');
    }

    localStorage.setItem('mantes_token', result.token);
    localStorage.setItem('mantes_user', JSON.stringify({
      userId: result.userId,
      email: result.email,
      nome: result.nome
    }));

    return result;
  },

  register: async (email, password, nome) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nome }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro no registro');
    }

    localStorage.setItem('mantes_token', result.token);
    localStorage.setItem('mantes_user', JSON.stringify({
      userId: result.userId,
      email: result.email,
      nome: result.nome
    }));

    return result;
  },

  logout: () => {
    localStorage.removeItem('mantes_token');
    localStorage.removeItem('mantes_user');
  },

  getToken: () => localStorage.getItem('mantes_token'),

  getUser: () => {
    const user = localStorage.getItem('mantes_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('mantes_token'),
};

// API requests
export const api = {
  request: async (endpoint, options = {}) => {
    const token = auth.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Erro na requisição`);
    }

    return result;
  },

  // OS endpoints
  getOS: () => api.request('/os'),
  
  getOSById: (id) => api.request(`/os/${id}`),
  
  createOS: (data) => api.request('/os', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateOS: (id, data) => api.request(`/os/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteOS: (id) => api.request(`/os/${id}`, {
    method: 'DELETE',
  }),
};
