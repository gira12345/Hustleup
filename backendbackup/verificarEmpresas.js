// Script para verificar empresas e users na base de dados
const { User, Empresa } = require('./models');

async function verificarEmpresas() {
  try {
    console.log('🔍 Verificando empresas...');
    
    // Buscar todas as empresas
    const empresas = await Empresa.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'role', 'password']
      }]
    });
    
    console.log(`📊 Total de empresas: ${empresas.length}`);
    
    for (const empresa of empresas) {
      console.log(`\n🏢 Empresa: ${empresa.nome}`);
      console.log(`   ID: ${empresa.id}`);
      console.log(`   UserId: ${empresa.userId}`);
      console.log(`   Validado: ${empresa.validado}`);
      
      if (empresa.user) {
        console.log(`   ✅ User associado:`);
        console.log(`      Email: ${empresa.user.email}`);
        console.log(`      Role: ${empresa.user.role}`);
        console.log(`      Password hash: ${empresa.user.password.substring(0, 20)}...`);
      } else {
        console.log(`   ❌ SEM USER associado!`);
      }
    }
    
    // Verificar users do tipo empresa
    console.log('\n🔍 Verificando users do tipo empresa...');
    const usersEmpresa = await User.findAll({
      where: { role: 'empresa' },
      include: [{
        model: Empresa,
        as: 'Empresa'
      }]
    });
    
    console.log(`📊 Total de users empresa: ${usersEmpresa.length}`);
    
    for (const user of usersEmpresa) {
      console.log(`\n👤 User: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.nome}`);
      console.log(`   Role: ${user.role}`);
      
      if (user.Empresa) {
        console.log(`   ✅ Empresa associada: ${user.Empresa.nome}`);
      } else {
        console.log(`   ❌ SEM EMPRESA associada!`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarEmpresas();
