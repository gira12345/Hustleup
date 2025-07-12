const Departamento = (sequelize, DataTypes) => {
  const Departamento = sequelize.define('Departamento', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'departamentos'
  });

  Departamento.associate = (models) => {
    // Estudantes <-> Departamentos
    Departamento.belongsToMany(models.Estudante, {
      through: 'estudante_departamento',
      foreignKey: 'departamentoId',
      otherKey: 'estudanteId'
    });
    // Empresas <-> Departamentos
    Departamento.belongsToMany(models.Empresa, {
      through: 'empresa_departamento',
      foreignKey: 'departamentoId',
      otherKey: 'empresaId'
    });
    // Gestores <-> Departamentos
    Departamento.belongsToMany(models.User, {
      through: models.GestorDepartamento,
      foreignKey: 'departamentoId',
      otherKey: 'gestorId',
      as: 'Departamentos' // Adiciona o alias para funcionar com include
    });
  };

  return Departamento;
};

module.exports = Departamento;
