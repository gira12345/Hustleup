module.exports = (sequelize, DataTypes) => {
  const Setor = sequelize.define('Setor', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'setores'
  });

  Setor.associate = (models) => {
    // Estudantes <-> Setores
    Setor.belongsToMany(models.Estudante, {
      through: 'estudante_setor',
      foreignKey: 'setorId',
      otherKey: 'estudanteId',
      timestamps: false
    });

    // Empresas <-> Setores
    Setor.belongsToMany(models.Empresa, {
      through: 'empresa_setor',
      foreignKey: 'setorId',
      otherKey: 'empresaId'
    });
  };

  return Setor;
};
