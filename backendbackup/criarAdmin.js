const { User } = require('./models');
const bcrypt = require('bcrypt');

async function criarAdmin() {
  try {
    console.log('🔧 Criando admin...');
    
    // Verificar se admin já existe
    const adminExistente = await User.findOne({ where: { email: 'admin@admin.com' } });
    if (adminExistente) {
      console.log('✅ Admin já existe');
      return;
    }
    
    // Criar admin
    const admin = await User.create({
      nome: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('✅ Admin criado:', admin.email);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

criarAdmin();
