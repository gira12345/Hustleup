// Teste final da configuração
const baseURL = 'https://hustleup-backend.onrender.com/api';

console.log('✅ Configuração corrigida:');
console.log('Base URL:', baseURL);
console.log('Login URL:', baseURL + '/auth/login');
console.log('Empresa perfil URL:', baseURL + '/empresa/perfil');
console.log('Admin URL:', baseURL + '/admin/empresas');

// Teste da rota que mais dá problemas
async function testLogin() {
  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@hustleup.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('✅ Login teste:', data.user ? 'SUCESSO' : 'ERRO');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testLogin();
