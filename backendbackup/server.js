require('dotenv').config();

// Garantir que JWT_SECRET está disponível
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_jwt_key_here_change_in_production';
}

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  // Testar conexão com BD
  sequelize.authenticate()
    .then(() => {
      // Sincronizar modelos com BD - IMPORTANTE para criar tabelas no Render
      if (process.env.NODE_ENV === 'production') {
        return sequelize.sync({ force: false, alter: true });
      } else {
        return sequelize.sync({ alter: true });
      }
    })
    .then(() => {
      // Modelos sincronizados
    })
    .catch((err) => {
      // Erro na conexão
    });
});

// Capturar erros
process.on('uncaughtException', (error) => {
  // Erro não capturado
});

process.on('unhandledRejection', (error) => {
  // Promise rejeitada
});
