// Teste de conexão entre frontend e backend
import api from './src/config/axios.js';

console.log('=== TESTE DE CONEXÃO FRONTEND-BACKEND ===');
console.log('API Base URL:', api.defaults.baseURL);
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// Teste de conexão
api.get('/api/test')
  .then(response => {
    console.log('✅ Conexão bem-sucedida!');
    console.log('Resposta:', response.data);
  })
  .catch(error => {
    console.error('❌ Erro na conexão:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('URL:', error.config?.url);
  });
