const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Candidatura = sequelize.define('Candidatura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estudanteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Estudantes',
      key: 'id'
    }
  },
  propostaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Propostas',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('pendente', 'aceite', 'rejeitada'),
    defaultValue: 'pendente',
    allowNull: false
  },
  carta_motivacao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cv_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data_candidatura: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  data_resposta: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'candidaturas',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Candidatura;
