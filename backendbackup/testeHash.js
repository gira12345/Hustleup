// Teste direto de login
const bcrypt = require('bcrypt');

async function testarLogin() {
  console.log('🔧 Testando login com password...');
  
  const password = 'password123';
  const hashedDuplo = await bcrypt.hash(await bcrypt.hash(password, 10), 10);
  const hashedSimples = await bcrypt.hash(password, 10);
  
  console.log('Password original:', password);
  console.log('Hash simples:', hashedSimples);
  console.log('Hash duplo:', hashedDuplo);
  
  // Testar comparação
  const testeSimples = await bcrypt.compare(password, hashedSimples);
  const testeDuplo = await bcrypt.compare(password, hashedDuplo);
  
  console.log('Teste hash simples:', testeSimples); // Deve ser true
  console.log('Teste hash duplo:', testeDuplo); // Deve ser false
  
  // Testar se hash duplo precisa de hash simples
  const testeDuploComHashSimples = await bcrypt.compare(hashedSimples, hashedDuplo);
  console.log('Teste hash duplo com hash simples:', testeDuploComHashSimples);
}

testarLogin();
