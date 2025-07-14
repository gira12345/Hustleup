import axios from 'axios';

console.log('🔧 Configurando axios...');
console.log('🌍 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔗 Fallback URL:', 'https://hustleup-backend.onrender.com/api');

const api = axios.create({
  baseURL: 'https://hustleup-backend.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('✅ Axios configurado com baseURL:', api.defaults.baseURL);

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    console.log('📤 Request interceptor:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tipo');
      
      // Usar replace em vez de href para evitar problemas com React Router
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
