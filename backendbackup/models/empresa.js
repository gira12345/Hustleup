module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define('Empresa', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    localizacao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contracto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    morada: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    validado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'empresas'
  });

  Empresa.associate = (models) => {
    Empresa.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Empresa.belongsToMany(models.Setor, {
      through: 'empresa_setor',
      foreignKey: 'empresaId',
      otherKey: 'setorId'
    });

    Empresa.hasMany(models.Proposta, {
      foreignKey: 'empresaId',
      as: 'propostas'
    });
  };

  return Empresa;
};
