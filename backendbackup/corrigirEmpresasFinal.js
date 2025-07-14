const { User, Empresa } = require('./models');

async function corrigirEmpresasFinal() {
  console.log('🔧 Correção final das empresas...');
  
  try {
    // 1. Validar todas as empresas existentes
    const empresasNaoValidadas = await Empresa.findAll({ where: { validado: false } });
    console.log(`Encontradas ${empresasNaoValidadas.length} empresas não validadas`);
    
    for (const empresa of empresasNaoValidadas) {
      empresa.validado = true;
      if (!empresa.descricao) empresa.descricao = '';
      await empresa.save();
      console.log(`✅ Validada empresa: ${empresa.nome}`);
    }
    
    // 2. Corrigir empresas sem userId
    const empresasSemUserId = await Empresa.findAll({ where: { userId: null } });
    console.log(`Encontradas ${empresasSemUserId.length} empresas sem userId`);
    
    for (const empresa of empresasSemUserId) {
      if (empresa.contacto) {
        const user = await User.findOne({ where: { email: empresa.contacto } });
        if (user) {
          empresa.userId = user.id;
          empresa.validado = true;
          if (!empresa.descricao) empresa.descricao = '';
          await empresa.save();
          console.log(`✅ Corrigida empresa: ${empresa.nome} -> User: ${user.email}`);
        }
      }
    }
    
    // 3. Criar empresas para users sem empresa
    const usersEmpresas = await User.findAll({ where: { role: 'empresa' } });
    console.log(`Verificando ${usersEmpresas.length} users empresa`);
    
    for (const user of usersEmpresas) {
      const empresa = await Empresa.findOne({ where: { userId: user.id } });
      if (!empresa) {
        await Empresa.create({
          nome: user.nome,
          userId: user.id,
          descricao: '',
          contacto: user.email,
          validado: true,
          localizacao: '',
          morada: ''
        });
        console.log(`✅ Criada empresa para user: ${user.email}`);
      }
    }
    
    // 4. Relatório final
    const totalEmpresas = await Empresa.count();
    const empresasValidadas = await Empresa.count({ where: { validado: true } });
    const empresasComUserId = await Empresa.count({ where: { userId: { [require('sequelize').Op.ne]: null } } });
    
    console.log('\n📊 Relatório Final:');
    console.log(`Total empresas: ${totalEmpresas}`);
    console.log(`Empresas validadas: ${empresasValidadas}`);
    console.log(`Empresas com userId: ${empresasComUserId}`);
    
    if (empresasValidadas === totalEmpresas && empresasComUserId === totalEmpresas) {
      console.log('🎉 Todas as empresas estão corrigidas!');
    } else {
      console.log('⚠️ Ainda existem empresas com problemas');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

corrigirEmpresasFinal();
