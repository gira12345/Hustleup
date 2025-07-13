const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let sequelize;

if (process.env.DATABASE_URL) {
  // Produção (Render) - usar DATABASE_URL
  console.log('🔗 Usando DATABASE_URL para produção');
  console.log('DATABASE_URL configurada:', !!process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Desenvolvimento - usar variáveis separadas
  console.log('🔗 Usando configuração individual para desenvolvimento');
  console.log('DATABASE_URL não encontrada, usando configuração local');
  
  const dbConfig = {
    database: process.env.DB_NAME || 'Projeto3',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '55rato66',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  };

  console.log('📋 Configuração da BD:', {
    database: dbConfig.database,
    username: dbConfig.username,
    host: dbConfig.host,
    passwordProvided: !!dbConfig.password
  });

  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
    }
  );
}

module.exports = sequelize;
