import axios from 'axios';

// Criar instância do axios com configuração base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Verificar se estamos no navegador antes de acessar cookies
    if (typeof window !== 'undefined') {
      // Usar js-cookie para obter o token
      const Cookies = require('js-cookie');
      const token = Cookies.get('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentar atualizar o token
        const Cookies = require('js-cookie');
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('Refresh token não encontrado');
        }
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/refresh-token`,
          { refreshToken }
        );
        
        const { accessToken } = response.data;
        
        // Salvar novo token
        Cookies.set('accessToken', accessToken, { expires: 7 });
        
        // Atualizar cabeçalho e refazer a requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, limpar tokens e redirecionar para login
        const Cookies = require('js-cookie');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session=expired';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
