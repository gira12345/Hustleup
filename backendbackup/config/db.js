const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let sequelize;

if (process.env.DATABASE_URL) {
  // Produção (Render) - usar DATABASE_URL
  console.log('Using DATABASE_URL for production');
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
  console.log('Using individual DB config for development');
  
  const dbConfig = {
    database: process.env.DB_NAME || 'Projeto3',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '55rato66',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  };

  console.log('DB Config (db.js):', {
    database: dbConfig.database,
    username: dbConfig.username,
    passwordProvided: !!dbConfig.password,
    host: dbConfig.host
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
