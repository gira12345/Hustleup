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
  console.log(`🚀 Backend HustleUp operacional em http://localhost:${PORT}`);
  console.log(`📋 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api/test`);
  
  // Testar conexão com BD
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Conexão com base de dados estabelecida');
      
      // Sincronizar modelos com BD - IMPORTANTE para criar tabelas no Render
      if (process.env.NODE_ENV === 'production') {
        return sequelize.sync({ force: false, alter: true });
      } else {
        return sequelize.sync({ alter: true });
      }
    })
    .then(() => {
      console.log('✅ Modelos sincronizados com a base de dados');
    })
    .catch((err) => {
      console.error('❌ Erro na conexão com base de dados:', err.message);
      console.error('❌ Erro completo:', err);
      console.error('❌ DATABASE_URL existe:', !!process.env.DATABASE_URL);
      console.error('❌ NODE_ENV:', process.env.NODE_ENV);
    });
});

// Capturar erros
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promise rejeitada:', error.message);
  server.close(() => {
    process.exit(1);
  });
});
