const { User, Empresa } = require('./models');

async function corrigirEmpresas() {
  console.log('🔧 Corrigindo empresas...');
  
  try {
    // 1. Buscar todas as empresas
    const empresas = await Empresa.findAll();
    console.log(`Encontradas ${empresas.length} empresas`);
    
    // 2. Buscar todos os users empresa
    const usersEmpresas = await User.findAll({ where: { role: 'empresa' } });
    console.log(`Encontrados ${usersEmpresas.length} users empresa`);
    
    // 3. Corrigir empresas sem userId
    for (const empresa of empresas) {
      if (!empresa.userId && empresa.contacto) {
        const user = usersEmpresas.find(u => u.email === empresa.contacto);
        if (user) {
          empresa.userId = user.id;
          empresa.validado = true;
          if (!empresa.descricao) empresa.descricao = '';
          await empresa.save();
          console.log(`✅ Corrigida empresa: ${empresa.nome}`);
        }
      }
    }
    
    // 4. Criar empresas para users sem empresa
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
    
    console.log('🎉 Correção concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

corrigirEmpresas();
