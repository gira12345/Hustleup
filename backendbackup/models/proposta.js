module.exports = (sequelize, DataTypes) => {
  const Proposta = sequelize.define('Proposta', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contracto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    morada: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    areas: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendente' // outras opções: 'ativo', 'inativo', 'arquivado'
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gestorId: {
      type: DataTypes.INTEGER,
      allowNull: true  // permite que propostas existentes funcionem sem gestor associado
    },
    data_submissao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    data_limite_ativacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'propostas'
  });

  Proposta.associate = (models) => {
    Proposta.belongsTo(models.Empresa, {
      foreignKey: 'empresaId',
      as: 'empresa'
    });
    
    // Adiciona associação com o modelo User (gestor)
    Proposta.belongsTo(models.User, {
      foreignKey: 'gestorId',
      as: 'gestor'
    });
  };

  return Proposta;
};
