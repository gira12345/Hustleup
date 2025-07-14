const { User, Empresa } = require('./models');

async function checkEmpresasSimple() {
  try {
    console.log('🔍 Verificando empresas...');
    
    const empresas = await Empresa.findAll();
    console.log(`Total empresas: ${empresas.length}`);
    
    for (const empresa of empresas) {
      console.log(`ID: ${empresa.id} | Nome: ${empresa.nome} | UserId: ${empresa.userId} | Validado: ${empresa.validado} | Email: ${empresa.contacto}`);
    }
    
    const usersEmpresas = await User.findAll({ where: { role: 'empresa' } });
    console.log(`\nTotal users empresa: ${usersEmpresas.length}`);
    
    for (const user of usersEmpresas) {
      console.log(`User: ${user.email} | ID: ${user.id} | Nome: ${user.nome}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  process.exit(0);
}

checkEmpresasSimple();
