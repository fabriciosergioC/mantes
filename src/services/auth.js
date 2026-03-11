// Serviços de Autenticação Nhost

import nhost from '../lib/nhost.js';

export const authService = {
  /**
   * Fazer login com email e senha
   */
  async login(email, senha) {
    try {
      const { data, error } = await nhost.auth.signIn({
        email,
        password: senha
      });

      if (error) throw error;

      // Salvar dados do usuário no localStorage
      const user = {
        id: data.user.id,
        nome: data.user.displayName,
        email: data.user.email,
        lider: true // Nhost não tem este campo, usar metadata se necessário
      };

      localStorage.setItem('@mantes:user', JSON.stringify(user));
      localStorage.setItem('@mantes:token', data.session.accessToken);

      return { success: true, user, token: data.session.accessToken };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Registrar novo usuário
   */
  async register(nome, email, senha) {
    try {
      const { data, error } = await nhost.auth.signUp({
        email,
        password: senha,
        options: {
          userData: {
            nome
          }
        }
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Alterar senha
   */
  async changePassword(senhaAtual, novaSenha) {
    try {
      // Nhost não tem changePassword direto, precisa fazer reset
      const { error } = await nhost.auth.changePassword({
        newPassword: novaSenha
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await nhost.auth.signOut();
      localStorage.removeItem('@mantes:user');
      localStorage.removeItem('@mantes:token');
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Verificar se está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('@mantes:token');
    const user = localStorage.getItem('@mantes:user');
    return !!(token && user);
  },

  /**
   * Obter usuário atual
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('@mantes:user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obter token de acesso
   */
  getToken() {
    return localStorage.getItem('@mantes:token');
  }
};
