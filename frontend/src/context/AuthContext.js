import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import api from '../utils/api';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('accessToken');
      
      if (token) {
        try {
          // Configurar o token no cabeçalho das requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obter dados do usuário
          const response = await api.get('/api/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          // Se o token for inválido, tentar atualizar com refresh token
          const refreshToken = Cookies.get('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await api.post('/api/auth/refresh-token', { refreshToken });
              const newToken = refreshResponse.data.accessToken;
              
              // Salvar novo token e configurar cabeçalho
              Cookies.set('accessToken', newToken, { expires: 7 });
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              
              // Obter dados do usuário com o novo token
              const userResponse = await api.get('/api/auth/profile');
              setUser(userResponse.data.user);
            } catch (refreshError) {
              // Se falhar, fazer logout
              logout();
            }
          } else {
            // Se não houver refresh token, fazer logout
            logout();
          }
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Função de login
  const login = async (email, password, twoFactorCode = null) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
        twoFactorCode
      });
      
      const { accessToken, refreshToken, user: userData, requires2FA } = response.data;
      
      // Se 2FA for necessário, retornar para solicitar código
      if (requires2FA) {
        return { requires2FA: true };
      }
      
      // Salvar tokens em cookies
      Cookies.set('accessToken', accessToken, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      
      // Configurar token no cabeçalho das requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Atualizar estado do usuário
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      // Verificar se é erro de pagamento necessário
      if (error.response && error.response.status === 402) {
        return { requiresPayment: true };
      }
      
      // Verificar se é erro de verificação de email
      if (error.response && error.response.data.requiresEmailVerification) {
        return { requiresEmailVerification: true };
      }
      
      throw error;
    }
  };

  // Função de registro
  const register = async (name, email, password, inviteCode = null) => {
    try {
      console.log('Tentando registrar usuário:', { name, email, inviteCode });
      
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        inviteCode
      });
      
      console.log('Resposta do servidor:', response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Erro no registro:', error);
      console.error('Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Verificar se é erro de convite necessário
      if (error.response && error.response.data.requiresInvite) {
        return { requiresInvite: true };
      }
      
      // Se houver mensagem específica do backend, usar ela
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    // Remover tokens dos cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Limpar cabeçalho de autorização
    delete api.defaults.headers.common['Authorization'];
    
    // Limpar estado do usuário
    setUser(null);
    
    // Redirecionar para login
    router.push('/login');
  };

  // Função para configurar 2FA
  const setup2FA = async () => {
    try {
      const response = await api.post('/api/auth/setup-2fa');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Função para verificar e ativar 2FA
  const verify2FA = async (token) => {
    try {
      const response = await api.post('/api/auth/verify-2fa', { token });
      
      // Atualizar estado do usuário
      setUser(prev => ({
        ...prev,
        twoFactorEnabled: true
      }));
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (data) => {
    try {
      const response = await api.put('/api/auth/profile', data);
      
      // Atualizar estado do usuário
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // Função para solicitar redefinição de senha
  const requestPasswordReset = async (email) => {
    try {
      const response = await api.post('/api/auth/request-password-reset', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      throw error;
    }
  };

  // Função para redefinir senha
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      throw error;
    }
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    setup2FA,
    verify2FA,
    updateProfile,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
