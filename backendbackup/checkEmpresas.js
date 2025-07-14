const { User, Empresa } = require('./models');

async function checkEmpresasState() {
  try {
    console.log('🔍 Verificando estado das empresas...');
    
    // Buscar todas as empresas
    const empresas = await Empresa.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['id', 'ASC']]
    });
    
    console.log(`📊 Total de empresas: ${empresas.length}`);
    
    for (const empresa of empresas) {
      console.log(`\n📋 Empresa ID: ${empresa.id}`);
      console.log(`   Nome: ${empresa.nome}`);
      console.log(`   UserId: ${empresa.userId}`);
      console.log(`   Validado: ${empresa.validado}`);
      console.log(`   Contacto: ${empresa.contacto}`);
      console.log(`   Descricao: ${empresa.descricao}`);
      console.log(`   User associado: ${empresa.user ? empresa.user.email : 'NENHUM'}`);
      
      // Verificar se há User com este email
      if (!empresa.user && empresa.contacto) {
        const userPorEmail = await User.findOne({ where: { email: empresa.contacto } });
        console.log(`   User por email: ${userPorEmail ? userPorEmail.email : 'NÃO ENCONTRADO'}`);
      }
    }
    
    // Verificar Users de empresas sem empresa associada
    const usersEmpresas = await User.findAll({ where: { role: 'empresa' } });
    console.log(`\n👥 Total de Users empresa: ${usersEmpresas.length}`);
    
    for (const user of usersEmpresas) {
      const empresa = await Empresa.findOne({ where: { userId: user.id } });
      console.log(`   User: ${user.email} - Empresa: ${empresa ? empresa.nome : 'SEM EMPRESA'}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

checkEmpresasState();
