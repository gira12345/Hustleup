// Teste para verificar estrutura dos dados do perfil da empresa
const { User, Empresa, Setor } = require('./models');

async function testarPerfilEmpresa() {
  try {
    console.log('🧪 Testando perfil da empresa...');
    
    const empresa = await Empresa.findOne({
      include: [
        {
          model: Setor,
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'nome']
        }
      ]
    });
    
    if (empresa) {
      console.log('✅ Empresa encontrada:', empresa.nome);
      console.log('📧 Email:', empresa.user?.email);
      console.log('🏢 Setores:', empresa.Setors?.map(s => s.nome) || []);
      console.log('📍 Contacto:', empresa.contacto);
      console.log('📝 Descrição:', empresa.descricao);
      
      // Simular o mapeamento do frontend
      const perfilData = {
        nome: empresa.nome || '',
        email: empresa.user?.email || '',
        telefone: empresa.contacto || '',
        endereco: empresa.morada || '',
        setor: empresa.Setors?.[0]?.nome || '',
        descricao: empresa.descricao || '',
        website: empresa.website || ''
      };
      
      console.log('\n📋 Dados mapeados para frontend:');
      console.log(JSON.stringify(perfilData, null, 2));
    } else {
      console.log('❌ Nenhuma empresa encontrada');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  }
}

testarPerfilEmpresa();
