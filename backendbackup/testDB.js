const { User } = require('./models');

async function testDB() {
  try {
    const users = await User.findAll({ limit: 1 });
    console.log('✅ Base de dados acessível');
    console.log(`Total users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro DB:', error.message);
    process.exit(1);
  }
}

testDB();
