const db = require('./models');

async function debugPropostas() {
  try {
    console.log('🔍 Verificando propostas na base de dados...');
    
    // Testar conexão
    await db.sequelize.authenticate();
    console.log('✅ Conexão à base de dados estabelecida');
    
    // Buscar todas as propostas
    const todasPropostas = await db.Proposta.findAll();
    console.log(`📊 Total de propostas: ${todasPropostas.length}`);
    
    if (todasPropostas.length === 0) {
      console.log('❌ Nenhuma proposta encontrada na base de dados');
      return;
    }
    
    // Mostrar estados das propostas
    console.log('\n📋 Estados das propostas:');
    const estadosCounts = {};
    todasPropostas.forEach(proposta => {
      const estado = proposta.estado;
      estadosCounts[estado] = (estadosCounts[estado] || 0) + 1;
      console.log(`ID: ${proposta.id}, Nome: ${proposta.nome}, Estado: ${estado}, Data limite: ${proposta.data_limite_ativacao}`);
    });
    
    console.log('\n📈 Resumo por estado:');
    Object.entries(estadosCounts).forEach(([estado, count]) => {
      console.log(`${estado}: ${count} propostas`);
    });
    
    // Buscar propostas ativas especificamente
    const propostasAtivas = await db.Proposta.findAll({
      where: { estado: 'ativa' }
    });
    console.log(`\n✅ Propostas ativas: ${propostasAtivas.length}`);
    
    // Buscar propostas pendentes
    const propostasPendentes = await db.Proposta.findAll({
      where: { estado: 'pendente' }
    });
    console.log(`⏳ Propostas pendentes: ${propostasPendentes.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao verificar propostas:', error);
  } finally {
    await db.sequelize.close();
  }
}

debugPropostas();
