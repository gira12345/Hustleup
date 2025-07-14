// Test para verificar a URL real que o frontend está chamando
const baseURL = 'https://hustleup-backend.onrender.com/api';
console.log('Base URL:', baseURL);

const finalURL = baseURL + '/auth/login';
console.log('URL final para login:', finalURL);

// Teste com fetch similar ao frontend
async function testLogin() {
  try {
    const response = await fetch(finalURL, {
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
    console.log('✅ Login funcionando:', data);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testLogin();
