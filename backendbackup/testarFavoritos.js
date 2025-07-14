// Teste para verificar se as associações de favoritos estão funcionando
const { Estudante, Proposta, Empresa } = require('./models');

async function testarFavoritos() {
  try {
    console.log('🧪 Testando associações de favoritos...');
    
    // Testar se conseguimos listar favoritos
    console.log('\n1. Testando listagem de favoritos...');
    const estudante = await Estudante.findOne({
      include: [{
        model: Proposta,
        as: 'Favoritos',
        include: [Empresa]
      }]
    });
    
    if (estudante) {
      console.log('✅ Estudante encontrado:', estudante.nome);
      console.log('📋 Favoritos:', estudante.Favoritos?.length || 0);
      
      if (estudante.Favoritos && estudante.Favoritos.length > 0) {
        estudante.Favoritos.forEach((fav, index) => {
          console.log(`  ${index + 1}. ${fav.nome} - ${fav.Empresa?.nome || 'N/A'}`);
        });
      }
    } else {
      console.log('❌ Nenhum estudante encontrado');
    }
    
    // Testar se conseguimos encontrar uma proposta
    console.log('\n2. Testando busca de proposta...');
    const proposta = await Proposta.findOne();
    
    if (proposta) {
      console.log('✅ Proposta encontrada:', proposta.nome);
    } else {
      console.log('❌ Nenhuma proposta encontrada');
    }
    
    console.log('\n✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

testarFavoritos();
