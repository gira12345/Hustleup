// Teste para verificar estrutura dos dados do perfil do estudante
const { User, Estudante, Setor } = require('./models');

async function testarPerfilEstudante() {
  try {
    console.log('🧪 Testando perfil do estudante...');
    
    const estudante = await Estudante.findOne({
      include: [
        {
          model: Setor,
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: ['id', 'email', 'nome']
        }
      ]
    });
    
    if (estudante) {
      console.log('✅ Estudante encontrado:', estudante.nome);
      console.log('📧 Email (User):', estudante.User?.email);
      console.log('📞 Contacto:', estudante.contacto);
      console.log('📞 Telefone:', estudante.telefone);
      console.log('🏢 Setores:', estudante.Setors?.map(s => s.nome) || []);
      console.log('🎓 Curso:', estudante.curso);
      console.log('📝 Sobre Mim:', estudante.sobreMim);
      
      // Simular o acesso do frontend
      const contactoFinal = estudante.telefone || estudante.contacto || estudante.User?.email || '-';
      console.log('\n📋 Contacto final (frontend):', contactoFinal);
    } else {
      console.log('❌ Nenhum estudante encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  }
}

testarPerfilEstudante();
