const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Ensure we have valid connection parameters
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

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

module.exports = sequelize;
