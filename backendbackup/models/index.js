const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Usar a configuração do db.js
const sequelize = require('../config/db');

console.log('Sequelize configurado via config/db.js');

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

// Estudante ↔ Setores
db.Estudante.belongsToMany(db.Setor, {
  through: 'estudante_setor',
  foreignKey: 'estudanteId',
  otherKey: 'setorId',
  timestamps: false
});
db.Setor.belongsToMany(db.Estudante, {
  through: 'estudante_setor',
  foreignKey: 'setorId',
  otherKey: 'estudanteId',
  timestamps: false
});

// Empresa ↔ Setores
db.Empresa.belongsToMany(db.Setor, {
  through: 'empresa_setor',
  foreignKey: 'empresaId',
  otherKey: 'setorId',
  timestamps: false
});
db.Setor.belongsToMany(db.Empresa, {
  through: 'empresa_setor',
  foreignKey: 'setorId',
  otherKey: 'empresaId',
  timestamps: false
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
