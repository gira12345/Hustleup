const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Verificar se as variáveis de ambiente foram carregadas
console.log('Verificando variáveis de ambiente:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS length:', process.env.DB_PASS ? process.env.DB_PASS.length : 'undefined');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('.env file exists:', fs.existsSync(path.resolve(__dirname, '../.env')));

// 🔌 Conexão com a base de dados
const dbName = process.env.DB_NAME || 'Projeto3';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASS || '55rato66';
const dbHost = process.env.DB_HOST || 'dpg-d1pcvimr433s73d942t0-a.frankfurt-postgres.render.com';

console.log('Using connection parameters:', { dbName, dbUser, passwordLength: dbPassword ? dbPassword.length : 0, dbHost });

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// 📦 Objecto base para os modelos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 🧱 Importar modelos
db.User = require('./user')(sequelize, DataTypes);
db.Empresa = require('./empresa')(sequelize, DataTypes);
db.Estudante = require('./estudante')(sequelize, DataTypes);
db.Proposta = require('./proposta')(sequelize, DataTypes);
db.Departamento = require('./departamento')(sequelize, DataTypes);
db.EstudanteFavorito = require('./estudante_favorito')(sequelize, DataTypes);
db.PedidoRemocao = require('./pedidoRemocao')(sequelize, DataTypes);
db.Setor = require('./setor')(sequelize, DataTypes);
db.GestorDepartamento = require('./gestor_departamento')(sequelize, DataTypes);
db.Candidatura = require('./candidatura');

// Tabelas de ligação
db.EmpresaDepartamento = require('./empresa_departamento')(sequelize, DataTypes);
db.EstudanteDepartamento = require('./estudante_departamento')(sequelize, DataTypes);

// ASSOCIAÇÕES ENTRE MODELOS

// User → Estudante e Empresa
db.User.hasOne(db.Empresa, { foreignKey: 'userId' });
db.User.hasOne(db.Estudante, { foreignKey: 'userId' });

// Empresa → Propostas
db.Empresa.hasMany(db.Proposta, { foreignKey: 'empresaId' });
db.Proposta.belongsTo(db.Empresa, { foreignKey: 'empresaId' });

// Empresa ↔ Departamentos
db.Empresa.belongsToMany(db.Departamento, {
  through: db.EmpresaDepartamento,
  foreignKey: 'empresaId',
  otherKey: 'departamentoId'
});
db.Departamento.belongsToMany(db.Empresa, {
  through: db.EmpresaDepartamento,
  foreignKey: 'departamentoId',
  otherKey: 'empresaId'
});

// Estudante ↔ Departamentos
db.Estudante.belongsToMany(db.Departamento, {
  through: db.EstudanteDepartamento,
  foreignKey: 'estudanteId',
  otherKey: 'departamentoId'
});
db.Departamento.belongsToMany(db.Estudante, {
  through: db.EstudanteDepartamento,
  foreignKey: 'departamentoId',
  otherKey: 'estudanteId'
});

// Gestor (User) ↔ Departamentos
db.User.belongsToMany(db.Departamento, {
  through: db.GestorDepartamento,
  foreignKey: 'gestorId',
  otherKey: 'departamentoId',
  as: 'DepartamentosGeridos'
});
db.Departamento.belongsToMany(db.User, {
  through: db.GestorDepartamento,
  foreignKey: 'departamentoId',
  otherKey: 'gestorId',
  as: 'Gestores'
});

// Estudante ↔ Propostas (Favoritos)
db.Estudante.belongsToMany(db.Proposta, {
  through: db.EstudanteFavorito,
  as: 'Favoritos',
  foreignKey: 'estudanteId',
  otherKey: 'propostaId'
});
db.Proposta.belongsToMany(db.Estudante, {
  through: db.EstudanteFavorito,
  as: 'FavoritadoPor',
  foreignKey: 'propostaId',
  otherKey: 'estudanteId'
});

// Candidaturas
db.Estudante.hasMany(db.Candidatura, { foreignKey: 'estudanteId' });
db.Candidatura.belongsTo(db.Estudante, { foreignKey: 'estudanteId' });

db.Proposta.hasMany(db.Candidatura, { foreignKey: 'propostaId' });
db.Candidatura.belongsTo(db.Proposta, { foreignKey: 'propostaId' });

// Pedidos de Remoção
db.Estudante.hasMany(db.PedidoRemocao, { foreignKey: 'estudanteId' });
db.PedidoRemocao.belongsTo(db.Estudante, { foreignKey: 'estudanteId' });

// Associações diretas com User
db.Estudante.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasOne(db.Estudante, { foreignKey: 'userId' });

// Chamar associate se existir (para garantir associações)
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

// 📤 Exportar tudo
module.exports = db;
