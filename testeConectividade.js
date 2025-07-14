// Teste de conectividade com o backend
const baseURL = 'https://hustleup-backend.onrender.com/api';

async function testConnectivity() {
  try {
    console.log('🔍 Testando conectividade com backend...');
    
    // Teste 1: Rota de teste
    const testResponse = await fetch(`${baseURL}/test`);
    const testData = await testResponse.json();
    console.log('✅ Rota /test:', testData);
    
    // Teste 2: Rota de login
    try {
      const loginResponse = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: '123'
        })
      });
      const loginData = await loginResponse.json();
      console.log('⚠️ Rota /auth/login (esperado):', loginData);
    } catch (loginError) {
      console.log('❌ Erro no login:', loginError.message);
    }
    
    console.log('🎉 Conectividade OK!');
    
  } catch (error) {
    console.error('❌ Erro de conectividade:', error.message);
  }
}

testConnectivity();
