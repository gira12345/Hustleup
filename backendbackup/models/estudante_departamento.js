module.exports = (sequelize, DataTypes) => {
  const EstudanteDepartamento = sequelize.define('estudante_departamento', {
    estudanteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'estudantes', key: 'id' }
    },
    departamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'departamentos', key: 'id' }
    }
  }, {
    tableName: 'estudante_departamento',
    timestamps: false
  });
  return EstudanteDepartamento;
};
