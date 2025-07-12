require('dotenv').config();

// Garantir que JWT_SECRET está disponível
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_jwt_key_here_change_in_production';
}

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`HustleUp Backend funcionando em http://localhost:${PORT}`);
  
  // Testar conexão com BD
  sequelize.authenticate()
    .then(() => {
      console.log('Base de dados conectada!');
    })
    .catch((err) => {
      console.error('Erro na conexão com BD:', err.message);
    });
});

// Capturar erros
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('Promise rejeitada:', error.message);
});
