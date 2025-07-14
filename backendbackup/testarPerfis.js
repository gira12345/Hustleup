// Teste rápido para verificar se a correção funcionou
const { User, Empresa, Estudante, Setor } = require('./models');

async function testarPerfis() {
  try {
    console.log('🧪 Testando perfis...');
    
    // Testar perfil de empresa
    console.log('\n🏢 Testando perfil empresa...');
    const empresa = await Empresa.findOne({
      include: [{
        model: Setor,
        through: { attributes: [] }
      }]
    });
    
    if (empresa) {
      console.log('✅ Empresa encontrada:', empresa.nome);
      console.log('Setores:', empresa.Setors?.length || 0);
    } else {
      console.log('❌ Nenhuma empresa encontrada');
    }
    
    // Testar perfil de estudante
    console.log('\n👤 Testando perfil estudante...');
    const estudante = await Estudante.findOne({
      include: [{
        model: Setor,
        through: { attributes: [] }
      }]
    });
    
    if (estudante) {
      console.log('✅ Estudante encontrado:', estudante.nome);
      console.log('Setores:', estudante.Setors?.length || 0);
    } else {
      console.log('❌ Nenhum estudante encontrado');
    }
    
    console.log('\n✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

testarPerfis();
